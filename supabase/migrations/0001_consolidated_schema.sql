-- ==============================================================================
-- RIVA CONSOLIDATED SCHEMA & RLS POLICIES (Supabase / PostgreSQL)
-- Version: 1.1 (Multi-tenant CRM, Client Profiles, Appointments, Waitlist)
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom ENUM types (with IF NOT EXISTS checks)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_type') THEN
        CREATE TYPE tenant_type AS ENUM ('salon', 'solo');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_status') THEN
        CREATE TYPE tenant_status AS ENUM ('draft', 'published');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM ('pending_deposit', 'confirmed', 'in_progress', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'waitlist_status') THEN
        CREATE TYPE waitlist_status AS ENUM ('pending', 'notified', 'booked', 'expired');
    END IF;
END $$;

-- 3. Tenants (Salons & Solo Masters)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type tenant_type DEFAULT 'salon',
    is_solo_master BOOLEAN DEFAULT false,
    phone VARCHAR(50),
    city TEXT DEFAULT 'Antalya',
    address TEXT,
    description TEXT,
    deposit_amount NUMERIC(10, 2) DEFAULT 0,
    portfolio_images TEXT[] DEFAULT '{}',
    social_networks JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{"moderation_mode": "manual", "global_discount": 0}'::jsonb,
    status tenant_status DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tenant Owners (Links auth.users to tenants for secure dashboard access)
CREATE TABLE IF NOT EXISTS tenant_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'owner',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, user_id)
);

-- 5. Masters / Specialists
CREATE TABLE IF NOT EXISTS masters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'master',
    status VARCHAR(50) DEFAULT 'active',
    avatar_url TEXT,
    schedule_rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Services
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id UUID REFERENCES masters(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    buffer_minutes INTEGER DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    deposit_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Working Schedules
CREATE TABLE IF NOT EXISTS working_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id UUID REFERENCES masters(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL DEFAULT '10:00',
    end_time TIME NOT NULL DEFAULT '20:00',
    is_working BOOLEAN DEFAULT true,
    UNIQUE(tenant_id, master_id, day_of_week)
);

-- 8. Clients (Global CRM Contact Directory)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Client Profiles (Tenant-specific CRM Profile with LTV and Internal Notes)
CREATE TABLE IF NOT EXISTS client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    ltv NUMERIC(10, 2) DEFAULT 0,
    strike_count INTEGER DEFAULT 0,
    internal_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(client_id, tenant_id)
);

-- 10. Appointments / Bookings
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id UUID REFERENCES masters(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    client_email TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status appointment_status DEFAULT 'confirmed',
    internal_notes TEXT DEFAULT '',
    price NUMERIC(10, 2) DEFAULT 0,
    deposit_amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Waitlist Requests
CREATE TABLE IF NOT EXISTS waitlist_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    desired_date DATE NOT NULL,
    time_preference TEXT,
    status waitlist_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenant_owners_user_id ON tenant_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_masters_tenant_id ON masters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_time ON appointments(tenant_id, start_time);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_client_profiles_tenant_client ON client_profiles(tenant_id, client_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_tenant_date ON waitlist_requests(tenant_id, desired_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_requests ENABLE ROW LEVEL SECURITY;

-- Tenants: Public can view published salons/masters; owners can edit their own
DROP POLICY IF EXISTS "Public can view published tenants" ON tenants;
CREATE POLICY "Public can view published tenants" ON tenants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners can update own tenant" ON tenants;
CREATE POLICY "Owners can update own tenant" ON tenants FOR UPDATE USING (
    id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);

-- Tenant Owners: Users can view their own tenant links
DROP POLICY IF EXISTS "Users can view own tenant_owner records" ON tenant_owners;
CREATE POLICY "Users can view own tenant_owner records" ON tenant_owners FOR SELECT USING (user_id = auth.uid());

-- Masters: Public can view active masters; owners can manage
DROP POLICY IF EXISTS "Public can view masters" ON masters;
CREATE POLICY "Public can view masters" ON masters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners manage masters" ON masters;
CREATE POLICY "Owners manage masters" ON masters FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);

-- Services: Public can view active services; owners can manage
DROP POLICY IF EXISTS "Public can view services" ON services;
CREATE POLICY "Public can view services" ON services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners manage services" ON services;
CREATE POLICY "Owners manage services" ON services FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);

-- Working schedules: Public can view; owners can manage
DROP POLICY IF EXISTS "Public can view schedules" ON working_schedules;
CREATE POLICY "Public can view schedules" ON working_schedules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owners manage schedules" ON working_schedules;
CREATE POLICY "Owners manage schedules" ON working_schedules FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);

-- Clients & Client Profiles: Public can insert upon booking; owners have full access
DROP POLICY IF EXISTS "Public can insert clients" ON clients;
CREATE POLICY "Public can insert clients" ON clients FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can view clients" ON clients;
CREATE POLICY "Owners can view clients" ON clients FOR SELECT USING (
    id IN (
        SELECT client_id FROM client_profiles
        WHERE tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
    )
);

DROP POLICY IF EXISTS "Public can insert client profiles" ON client_profiles;
CREATE POLICY "Public can insert client profiles" ON client_profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners manage client profiles" ON client_profiles;
CREATE POLICY "Owners manage client profiles" ON client_profiles FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);

-- Appointments: Public can create appointment; owners can manage
DROP POLICY IF EXISTS "Public can insert appointments" ON appointments;
CREATE POLICY "Public can insert appointments" ON appointments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners manage appointments" ON appointments;
CREATE POLICY "Owners manage appointments" ON appointments FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);

-- Waitlist: Public can register into waitlist; owners can manage
DROP POLICY IF EXISTS "Public can insert waitlist" ON waitlist_requests;
CREATE POLICY "Public can insert waitlist" ON waitlist_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners manage waitlist" ON waitlist_requests;
CREATE POLICY "Owners manage waitlist" ON waitlist_requests FOR ALL USING (
    tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);
