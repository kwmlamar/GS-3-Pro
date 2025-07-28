# Clients Table Setup Guide

This guide will help you set up the database schema for the clients management system and populate it with sample data.

## Overview

The clients table stores information about client companies that security companies work with. This enables tracking which security companies are assigned to which clients and managing those relationships.

## Step 1: Create the Database Table

You need to create the clients table in your Supabase database.

### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `create-clients-table.sql`
4. Run the SQL script

### Option B: Using Supabase CLI

```bash
supabase db push
```

## Step 2: Populate with Sample Data

Run the setup script to populate the clients table with sample data:

```bash
node setup-clients.js
```

This will create 6 sample clients across different industries:
- Acme Corporation (Technology)
- Global Manufacturing Inc (Manufacturing)
- Metro Healthcare Systems (Healthcare)
- Premier Retail Group (Retail)
- Energy Solutions Corp (Energy)
- Financial Services Ltd (Finance)

## Step 3: Verify the Setup

1. Navigate to the Security Companies page in your application (`/security-companies`)
2. Click "Add Security Company"
3. In the form, you should see a "Assigned Client" dropdown with the sample clients
4. Select a client and save the security company
5. View the security company card to see the client assignment

## Database Schema

### Clients Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique identifier for the client |
| `name` | VARCHAR(255) | Client company name |
| `contact_person` | VARCHAR(255) | Primary contact person at the client |
| `email` | VARCHAR(255) | Primary contact email |
| `phone` | VARCHAR(50) | Primary contact phone number |
| `industry` | VARCHAR(100) | Industry sector of the client |
| `status` | VARCHAR(50) | Current status (Active, Inactive, etc.) |
| `address` | JSONB | JSON object containing address information |
| `created_at` | TIMESTAMP | When the client was created |
| `updated_at` | TIMESTAMP | When the client was last updated |

### Indexes

- `idx_clients_name`: Full-text search on client name
- `idx_clients_industry`: Index on industry for filtering
- `idx_clients_status`: Index on status for filtering
- `idx_clients_contact_person`: Full-text search on contact person

## Features

The clients management system includes:

- **Client Profiles**: Complete client information with contact details and industry
- **Industry Classification**: Categorize clients by industry sector
- **Address Storage**: Flexible JSON storage for address information
- **Status Management**: Track active/inactive client status
- **Search & Filter**: Full-text search and industry-based filtering
- **Integration**: Seamless integration with security companies

## API Functions

The client service provides the following functions:

- `getClients()`: Get all active clients
- `getClientById(id)`: Get a specific client by ID
- `searchClients(searchTerm)`: Search clients by name, contact, or industry
- `getClientsByIndustry(industry)`: Get clients by industry
- `getClientStats()`: Get client statistics and industry breakdown
- `createClient(clientData)`: Create a new client
- `updateClient(id, updates)`: Update an existing client
- `deleteClient(id)`: Soft delete a client (sets status to Inactive)

## Integration with Security Companies

The clients table integrates with the security companies system through:

- **Foreign Key Relationship**: Security companies have a `client_id` field
- **Dropdown Selection**: Client selection in security company forms
- **Display Integration**: Client information shown in security company cards
- **Optional Assignment**: Security companies can exist without client assignments

## Usage Examples

### Creating a New Client

```javascript
const newClient = {
  name: 'TechCorp Solutions',
  contact_person: 'Alice Johnson',
  email: 'alice@techcorp.com',
  phone: '(555) 999-8888',
  industry: 'Technology',
  status: 'Active',
  address: {
    street: '456 Innovation Dr',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105'
  }
};

const { data, error } = await createClient(newClient);
```

### Searching Clients

```javascript
// Search by name, contact person, or industry
const { data, error } = await searchClients('Technology');
```

### Getting Client Statistics

```javascript
const { data, error } = await getClientStats();
// Returns: { total, active, byIndustry, industries }
```

## Troubleshooting

### Common Issues

1. **Table doesn't exist**: Run the `create-clients-table.sql` script first
2. **No clients in dropdown**: Run `node setup-clients.js` to populate sample data
3. **Connection errors**: Check your Supabase environment variables
4. **Permission errors**: Ensure your Supabase RLS policies allow client access

### Verification Steps

1. Check that the clients table exists in your Supabase dashboard
2. Verify that sample data was inserted by running the setup script
3. Test the dropdown in the security company form
4. Check that client information displays correctly in security company cards

## Next Steps

After setting up the clients table:

1. **Add More Clients**: Use the API functions to add your own clients
2. **Customize Industries**: Modify the industry options to match your needs
3. **Enhance Integration**: Add client-specific features to the security company system
4. **Reporting**: Create reports showing client-security company relationships 