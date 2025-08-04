CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    tenant_id UUID REFERENCES tenants(id),
    lease_id UUID REFERENCES leases(id)
);

ALTER TABLE tenants ADD COLUMN email VARCHAR;