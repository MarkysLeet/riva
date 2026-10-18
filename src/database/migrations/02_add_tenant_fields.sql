ALTER TABLE tenants ADD COLUMN phone VARCHAR(50);
ALTER TABLE tenants ADD COLUMN social_networks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tenants ADD COLUMN is_solo_master BOOLEAN DEFAULT false;
