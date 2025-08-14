CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR,
	file_type VARCHAR,
	height INTEGER,
	width INTEGER,
	compression_quality NUMERIC,
    data bytea NOT NULL,
    resource_id UUID NOT NULL,
    resource_type VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);