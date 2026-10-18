-- Create custom types
CREATE TYPE booking_status AS ENUM ('PENDING_APPROVAL', 'CONFIRMED', 'CANCELED', 'NO_SHOW');
CREATE TYPE payment_status AS ENUM ('AUTHORIZED', 'CAPTURED', 'VOIDED', 'REFUNDED');

-- Tenants (Salons/Businesses)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    settings JSONB DEFAULT '{"moderation_mode": "manual", "global_discount": 0}'::jsonb,
    subscription_status VARCHAR(50) DEFAULT 'active',
    referral_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Owners (Links users to tenants for admin access)
CREATE TABLE tenant_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users in Supabase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, user_id)
);

-- Masters (Employees)
CREATE TABLE masters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    schedule_rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    buffer_minutes INTEGER DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Master_Service M2M
CREATE TABLE master_services (
    master_id UUID REFERENCES masters(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (master_id, service_id)
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Client Profiles (CRM)
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    ltv DECIMAL(10, 2) DEFAULT 0,
    strike_count INTEGER DEFAULT 0,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(client_id, tenant_id)
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    master_id UUID REFERENCES masters(id) ON DELETE RESTRICT,
    client_id UUID REFERENCES clients(id) ON DELETE RESTRICT,
    service_ids UUID[] NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status DEFAULT 'PENDING_APPROVAL',
    payment_status payment_status,
    payment_intent_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Setup (Basic)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read of tenants, masters, services for the booking widget
CREATE POLICY "Public tenants are viewable by everyone" ON tenants FOR SELECT USING (true);
CREATE POLICY "Public masters are viewable by everyone" ON masters FOR SELECT USING (true);
CREATE POLICY "Public services are viewable by everyone" ON services FOR SELECT USING (true);

CREATE POLICY "Users can view own tenant_owner records" ON tenant_owners FOR SELECT USING (user_id = auth.uid());

-- Owners can view and edit their own tenant data
CREATE POLICY "Owners can view own tenant" ON tenants FOR SELECT USING (
  id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);
CREATE POLICY "Owners can update own tenant" ON tenants FOR UPDATE USING (
  id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);

-- Owners can manage masters, services, bookings for their tenant
CREATE POLICY "Owners manage masters" ON masters FOR ALL USING (
  tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);
CREATE POLICY "Owners manage services" ON services FOR ALL USING (
  tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);
CREATE POLICY "Owners manage bookings" ON bookings FOR ALL USING (
  tenant_id IN (SELECT tenant_id FROM tenant_owners WHERE user_id = auth.uid())
);
