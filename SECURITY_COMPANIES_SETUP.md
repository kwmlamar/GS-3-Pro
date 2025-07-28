# Security Company Management Setup Guide

## Overview
This guide will help you set up the database schema for the security company management system and populate it with sample data.

## Step 1: Create the Database Tables

You need to create the security company tables in your Supabase database. You can do this through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL:

```sql
-- Run the complete SQL from create-security-companies-table.sql
```

This will create:
- `subcontractor_profiles` - Main security company information
- `subcontractor_sites` - Site assignments for security companies
- `subcontractor_incidents` - Incident tracking for security companies
- `subcontractor_performance_logs` - Performance tracking

## Step 2: Populate Sample Data

After creating the tables, run the following script to populate them with sample data:

```bash
node setup-security-companies.js
```

This will create 6 sample security companies with realistic data:
- Alpha Security Services (Corporate Security - Tier 1)
- Guardian Event Security (Event Security - Tier 1)
- MediGuard Healthcare Security (Healthcare Security - Tier 2)
- RetailShield Loss Prevention (Retail Security - Tier 2)
- Industrial Safety Solutions (Industrial Security - Tier 3)
- Premier Security Group (General Security - Tier 3, Pending Review)

## Step 3: Verify the Setup

1. Navigate to the Security Companies page in your application (`/security-companies`)
2. You should see the security company data displayed in the overview tab
3. The compliance tab should show real statistics based on the data

## Database Schema

### subcontractor_profiles
Main table containing security company information:
- Basic company details (name, contact info)
- Service specialization and status
- Vetting and compliance information
- Performance metrics and ratings
- Insurance and certification data
- Contract details and worker counts

### subcontractor_sites
Links security companies to specific sites:
- Assignment details and worker counts
- Contract terms and performance notes
- Start/end dates and status tracking

### subcontractor_incidents
Tracks incidents involving security companies:
- Incident type and severity
- Description and resolution notes
- Status tracking and timestamps

### subcontractor_performance_logs
Performance tracking over time:
- Daily performance scores
- Attendance rates and incident counts
- Client satisfaction ratings

## Features

The security company management system includes:

- **Tier System**: Three-tier classification system (Tier 1 - Primary, Tier 2 - Standard, Tier 3 - Development)
- **Comprehensive Profiles**: Complete security company information with contact details, specializations, and compliance data
- **Site Assignments**: Track which security companies are assigned to which sites
- **Incident Tracking**: Monitor and resolve incidents involving security companies
- **Performance Monitoring**: Track performance metrics and ratings over time
- **Compliance Management**: Vetting status and certification tracking
- **Insurance & Certifications**: JSON fields for flexible insurance and certification data

## Dashboard Features

The security companies page provides:

1. **Overview Tab**: Complete list of security companies with search and tier filtering
2. **Tier System Tab**: Detailed view of the three-tier classification system with requirements and benefits
3. **Performance Tab**: Performance metrics and KPIs (coming soon)
4. **Compliance Tab**: Vetting status and compliance statistics
5. **Data Access Tab**: Access control configuration (coming soon)

Each security company card shows:
- Company name and status badges
- Tier classification with color-coded badges
- Contact information and location
- Service specialization and performance rating
- Number of sites assigned
- Vetting status and compliance information

## Tier System

The security company tier system provides a structured approach to classifying and managing security providers:

### Tier 1 - Primary
- **Description**: Premium security companies with highest standards and capabilities
- **Requirements**: Minimum 5 years experience, ISO 9001 certification, comprehensive insurance ($5M+), advanced training, 24/7 support, multi-site management
- **Benefits**: Priority assignments, exclusive access to premium sites, reduced vetting, direct client communication, performance bonuses

### Tier 2 - Standard
- **Description**: Established security companies with proven track record
- **Requirements**: Minimum 2 years experience, state license, basic insurance ($1M+), standard training, business hours support, single-site capability
- **Benefits**: Standard assignments, regular site access, standard vetting process, supervised client communication

### Tier 3 - Development
- **Description**: New or developing security companies building capabilities
- **Requirements**: Valid license, basic insurance ($500K+), fundamental training, limited support hours, single-site focus
- **Benefits**: Limited assignments, restricted access, enhanced monitoring, supervised operations, development-focused metrics

## Service Specializations

The system supports various security specializations:
- **General Security**: Basic security services
- **Event Security**: Specialized event and crowd management
- **Corporate Security**: High-level corporate environments
- **Healthcare Security**: Medical facility security
- **Retail Security**: Loss prevention and retail environments
- **Industrial Security**: Manufacturing and industrial facilities

## Performance Tracking

The system tracks:
- **Performance Ratings**: 0-5 scale based on performance
- **Incident Management**: Total and resolved incidents
- **Worker Management**: Current vs maximum worker counts
- **Attendance Rates**: Daily attendance tracking
- **Client Satisfaction**: 1-5 scale client ratings

## Troubleshooting

If you encounter issues:

1. **Table not found**: Make sure you've run the SQL to create the subcontractor tables
2. **Permission errors**: Check that RLS policies are properly set up
3. **No data showing**: Run the setup script to populate sample data
4. **Connection issues**: Verify your Supabase credentials in `.env.local`

## Next Steps

Once the subcontractor system is set up, you can:

1. Add real subcontractor data through the interface
2. Assign subcontractors to specific sites
3. Track incidents and performance metrics
4. Integrate with other modules (employees, assessments, etc.)
5. Add more advanced features like automated performance reporting

## API Integration

The system provides comprehensive service functions:

```javascript
// Get all subcontractors
const { data, error } = await getSubcontractors();

// Get subcontractor by ID with full details
const { data, error } = await getSubcontractorById(id);

// Search subcontractors
const { data, error } = await searchSubcontractors(searchTerm);

// Get statistics
const { data, error } = await getSubcontractorStats();

// Create new subcontractor
const { data, error } = await createSubcontractor(subcontractorData);

// Update subcontractor
const { data, error } = await updateSubcontractor(id, updates);
```

## Sample Data Structure

Each subcontractor includes:
- Company information and contact details
- Service specialization and status
- Vetting and compliance information
- Performance metrics and ratings
- Insurance coverage details
- Certification information
- Address and location data
- Contract terms and worker counts 