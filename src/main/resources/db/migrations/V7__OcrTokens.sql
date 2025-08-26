CREATE TABLE ocr_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regex VARCHAR NOT NULL,
	merchant VARCHAR NOT NULL,
	expense_type_id UUID REFERENCES expense_types(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);
CREATE UNIQUE INDEX unique_regex_ocr_tokens on ocr_tokens (regex) WHERE deleted=false;