# Subcontractor Management Setup Guide

## Overview
This guide will help you set up the database schema for the subcontractor management system and populate it with sample data.

## Step 1: Create the Database Tables

You need to create the subcontractor tables in your Supabase database. You can do this through the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL:

```sql
-- Run the complete SQL from create-subcontractors-table.sql
```

This will create:
- `subcontractor_profiles` - Main subcontractor information
- `subcontractor_sites` - Site assignments for subcontractors
- `subcontractor_incidents` - Incident tracking for subcontractors
- `subcontractor_performance_logs` - Performance tracking

## Step 2: Populate Sample Data

After creating the tables, run the following script to populate them with sample data:

```bash
node setup-subcontractors.js
```

This will create 6 sample subcontractors with realistic data:
- Alpha Security Services (Corporate Security)
- Guardian Event Security (Event Security)
- MediGuard Healthcare Security (Healthcare Security)
- RetailShield Loss Prevention (Retail Security)
- Industrial Safety Solutions (Industrial Security)
- Premier Security Group (General Security - Pending Review)

## Step 3: Verify the Setup

1. Navigate to the Subcontractors page in your application (`/subcontractors`)
2. You should see the subcontractor data displayed in the overview tab
3. The compliance tab should show real statistics based on the data

## Database Schema

### subcontractor_profiles
Main table containing subcontractor information:
- Basic company details (name, contact info)
- Service specialization and status
- Vetting and compliance information
- Performance metrics and ratings
- Insurance and certification data
- Contract details and worker counts

### subcontractor_sites
Links subcontractors to specific sites:
- Assignment details and worker counts
- Contract terms and performance notes
- Start/end dates and status tracking

### subcontractor_incidents
Tracks incidents involving subcontractors:
- Incident type and severity
- Description and resolution notes
- Status tracking and timestamps

### subcontractor_performance_logs
Performance tracking over time:
- Daily performance scores
- Attendance rates and incident counts
- Client satisfaction ratings

## Features

The subcontractor management system includes:

- **Comprehensive Profiles**: Complete subcontractor information with contact details, specializations, and compliance data
- **Site Assignments**: Track which subcontractors are assigned to which sites
- **Incident Tracking**: Monitor and resolve incidents involving subcontractors
- **Performance Monitoring**: Track performance metrics and ratings over time
- **Compliance Management**: Vetting status and certification tracking
- **Insurance & Certifications**: JSON fields for flexible insurance and certification data

## Dashboard Features

The subcontractors page provides:

1. **Overview Tab**: Complete list of subcontractors with search and filtering
2. **Performance Tab**: Performance metrics and KPIs (coming soon)
3. **Compliance Tab**: Vetting status and compliance statistics
4. **Data Access Tab**: Access control configuration (coming soon)

Each subcontractor card shows:
- Company name and status badges
- Contact information and location
- Service specialization and performance rating
- Number of sites assigned
- Vetting status and compliance information

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