-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    industry VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients(industry);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_contact_person ON clients USING gin(to_tsvector('english', contact_person));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_clients_updated_at();

-- Add comments to the table
COMMENT ON TABLE clients IS 'Stores client information for security company relationships';
COMMENT ON COLUMN clients.id IS 'Primary key for the client';
COMMENT ON COLUMN clients.name IS 'Client company name';
COMMENT ON COLUMN clients.contact_person IS 'Primary contact person at the client';
COMMENT ON COLUMN clients.email IS 'Primary contact email';
COMMENT ON COLUMN clients.phone IS 'Primary contact phone number';
COMMENT ON COLUMN clients.industry IS 'Industry sector of the client';
COMMENT ON COLUMN clients.status IS 'Current status of the client (Active, Inactive, etc.)';
COMMENT ON COLUMN clients.address IS 'JSON object containing address information';
COMMENT ON COLUMN clients.created_at IS 'Timestamp when the client was created';
COMMENT ON COLUMN clients.updated_at IS 'Timestamp when the client was last updated'; 