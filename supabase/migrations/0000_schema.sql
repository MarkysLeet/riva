-- Create custom types
CREATE TYPE tenant_type AS ENUM ('salon', 'solo');
CREATE TYPE tenant_status AS ENUM ('draft', 'published');
CREATE TYPE master_role AS ENUM ('owner', 'master');
CREATE TYPE master_status AS ENUM ('active', 'invited');
CREATE TYPE appointment_status AS ENUM ('confirmed', 'pending_deposit', 'cancelled');
CREATE TYPE waitlist_status AS ENUM ('pending', 'notified', 'booked', 'expired');

-- 1. tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type tenant_type NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    city TEXT,
    address TEXT,
    description TEXT,
    deposit_amount NUMERIC DEFAULT 0,
    portfolio_images TEXT[] DEFAULT '{}',
    status tenant_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. business_masters
CREATE TABLE business_masters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role master_role NOT NULL DEFAULT 'master',
    status master_status NOT NULL DEFAULT 'invited',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id UUID REFERENCES business_masters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    price NUMERIC NOT NULL,
    duration_minutes INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. working_schedules
CREATE TABLE working_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id UUID REFERENCES business_masters(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_working BOOLEAN DEFAULT true,
    UNIQUE(business_id, master_id, day_of_week)
);

-- 5. appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    master_id UUID REFERENCES business_masters(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    client_email TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status appointment_status DEFAULT 'pending_deposit',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. waitlist_requests
CREATE TABLE waitlist_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    desired_date DATE NOT NULL,
    time_preference TEXT,
    status waitlist_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
