# Hierarchy Database Setup Guide

## Overview
This guide will help you set up the database schema for the hierarchy page and populate it with sample data.

## Step 1: Create the Sites Table

You need to create the `sites` table in your Supabase database. You can do this through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL:

```sql
-- Create sites table for hierarchy management
CREATE TABLE IF NOT EXISTS sites (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('site', 'region', 'national', 'global', 'special_activity')),
  parent_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  client_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  address JSONB DEFAULT '{}',
  gps_coordinates JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  description TEXT,
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  security_level VARCHAR(50) DEFAULT 'standard' CHECK (security_level IN ('standard', 'enhanced', 'high', 'maximum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sites_name ON sites USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_sites_type ON sites(type);
CREATE INDEX IF NOT EXISTS idx_sites_parent_id ON sites(parent_id);
CREATE INDEX IF NOT EXISTS idx_sites_client_id ON sites(client_id);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_security_level ON sites(security_level);
CREATE INDEX IF NOT EXISTS idx_sites_address ON sites USING gin(address);
CREATE INDEX IF NOT EXISTS idx_sites_gps_coordinates ON sites USING gin(gps_coordinates);

-- Enable Row Level Security (RLS)
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read sites" ON sites
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert sites" ON sites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update sites" ON sites
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete sites" ON sites
  FOR DELETE USING (auth.role() = 'authenticated');
```

## Step 2: Populate Sample Data

After creating the table, run the following script to populate it with sample hierarchy data:

```bash
node setup-sites-table.js
```

This will create a complete hierarchy structure with:
- 1 Global site (GS-3 Global Operations)
- 3 National sites (North America, Europe, Asia Pacific)
- 6 Regional sites (Northeast, Southeast, Western, Central Europe, Northern Europe, East Asia)
- 6 Individual sites (Corporate HQ, Hospital, Resort, Tech Campus, Government Complex, Corporate Tower)
- 2 Special activity sites (Sporting Event, Conference)

## Step 3: Verify the Setup

1. Navigate to the Hierarchy Builder page in your application (`/sites`)
2. You should see the hierarchy data displayed in the dashboard tabs
3. The Regional, National, and Global dashboard tabs should show the appropriate child entities

## Hierarchy Structure

The sample data creates a realistic security company hierarchy:

```
GS-3 Global Operations (global)
├── GS-3 North America (national)
│   ├── Northeast Region (region)
│   │   ├── Corporate HQ Alpha (site)
│   │   ├── Metro Hospital East (site)
│   │   └── Major Sporting Event (special_activity)
│   ├── Southeast Region (region)
│   │   ├── Miami Beach Resort (site)
│   │   └── Orlando Theme Park (site)
│   └── Western Region (region)
│       ├── Silicon Valley Tech Campus (site)
│       └── Hollywood Studio Lot (site)
├── GS-3 Europe (national)
│   ├── Central Europe (region)
│   │   ├── Berlin Government Complex (site)
│   │   ├── Paris Luxury Hotel (site)
│   │   └── International Conference (special_activity)
│   └── Northern Europe (region)
│       └── London Financial District (site)
└── GS-3 Asia Pacific (national)
    └── East Asia (region)
        ├── Tokyo Corporate Tower (site)
        └── Seoul Tech Campus (site)
```

## Features

The hierarchy system includes:

- **Hierarchical Relationships**: Parent-child relationships between sites
- **Multiple Site Types**: Global, National, Regional, Site, and Special Activity
- **Contact Information**: Each site has contact details
- **Address & GPS**: JSON fields for location data
- **Security Levels**: Standard, Enhanced, High, Maximum
- **Status Tracking**: Active, Inactive, Maintenance
- **Client Associations**: Sites can be linked to clients

## Dashboard Features

The hierarchy page provides:

1. **Sites List**: Complete list of all sites with search and filtering
2. **Regional Dashboard**: Shows sites under regional entities
3. **National Dashboard**: Shows regions under national entities  
4. **Global Dashboard**: Shows national entities under global operations

Each dashboard allows you to:
- Select specific parent entities to filter the view
- See child entities with their details
- View contact information and addresses
- Access site-specific actions (View Details, etc.)

## Troubleshooting

If you encounter issues:

1. **Table not found**: Make sure you've run the SQL to create the sites table
2. **Permission errors**: Check that RLS policies are properly set up
3. **No data showing**: Run the setup script to populate sample data
4. **Connection issues**: Verify your Supabase credentials in `.env.local`

## Next Steps

Once the hierarchy is set up, you can:

1. Add real site data through the Entity Form
2. Customize the hierarchy structure for your organization
3. Integrate with other modules (employees, assessments, etc.)
4. Add more advanced features like site analytics and reporting 