-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE expense_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE UNIQUE INDEX unique_name_expense_types on expense_types (name) WHERE deleted=false;

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE UNIQUE INDEX unique_name_properties on properties (name) WHERE deleted=false;

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR,
    current_rent NUMERIC(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    property_id UUID NOT NULL REFERENCES properties(id)
);
CREATE UNIQUE INDEX unique_name_property_units on units (name, property_id) WHERE deleted=false;

CREATE TABLE leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    balance NUMERIC(10,2),
    current BOOLEAN NOT NULL DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    unit_id UUID REFERENCES units(id)
);

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    lease_id UUID REFERENCES leases(id)
);
CREATE UNIQUE INDEX unique_name_tenants on tenants (first_name, last_name) WHERE deleted=false;

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(10,2) NOT NULL,
    note VARCHAR,
    merchant VARCHAR NOT NULL,
    image_path VARCHAR,
    paid_on TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    expense_type_id UUID REFERENCES expense_types(id),
    property_id UUID REFERENCES properties(id)
);

CREATE TABLE rent_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC(10,2) NOT NULL,
    received_on TIMESTAMP NOT NULL,
    due_on TIMESTAMP NOT NULL,
    note VARCHAR,
    image_path VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    lease_id UUID REFERENCES leases(id)
);