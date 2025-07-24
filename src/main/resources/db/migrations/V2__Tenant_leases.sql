CREATE TABLE tenant_leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    lease_id UUID NOT NULL REFERENCES leases(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX unique_tenant_leases on tenant_leases (tenant_id, lease_id) WHERE deleted=false;

ALTER TABLE tenants DROP COLUMN lease_id;

