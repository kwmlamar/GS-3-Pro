# Health & Safety Database Setup

## Overview
The Health & Safety module has been successfully connected to the database with full CRUD functionality for managing workplace incidents.

## Database Schema

### Table: `health_safety_incidents`
```sql
CREATE TABLE health_safety_incidents (
  id BIGSERIAL PRIMARY KEY,
  site_id BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  incident_date DATE NOT NULL,
  reported_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  investigation_status VARCHAR(50) DEFAULT 'open' CHECK (investigation_status IN ('open', 'in_progress', 'closed')),
  report_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Features
- **Primary Key**: Auto-incrementing ID
- **Foreign Keys**: Links to sites table and auth.users table
- **Status Tracking**: Three status levels (open, in_progress, closed)
- **Timestamps**: Automatic created_at and updated_at tracking
- **File Support**: Optional report_url field for file attachments

## Database Setup Files

### 1. `create-health-safety-incidents-table.sql`
Contains the complete SQL schema with:
- Table creation
- Indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates

### 2. `src/lib/healthSafetyService.js`
Centralized service for all database operations:
- `getIncidents()` - Fetch all incidents with site data
- `getSites()` - Fetch sites for dropdown
- `createIncident()` - Create new incident
- `updateIncident()` - Update existing incident
- `updateIncidentStatus()` - Change investigation status
- `deleteIncident()` - Remove incident
- `getIncidentStats()` - Get statistics
- `searchIncidents()` - Search functionality

### 3. `src/pages/HealthSafety.jsx`
Updated React component that:
- Uses the centralized service
- Provides full CRUD interface
- Includes search functionality
- Shows incident status management
- Handles file uploads (UI ready)

## Security Features

### Row Level Security (RLS)
- Enabled on the `health_safety_incidents` table
- Policies allow authenticated users to:
  - Read all incidents
  - Insert new incidents
  - Update existing incidents
  - Delete incidents

### Data Validation
- Required fields: site_id, description, incident_date
- Status validation: Only 'open', 'in_progress', 'closed' allowed
- Foreign key constraints ensure data integrity

## Testing

### Setup Scripts
1. `setup-health-safety.js` - Creates table and tests connection
2. `test-health-safety.js` - Comprehensive functionality testing

### Test Results
✅ Database connection working  
✅ Tables accessible  
✅ Joins working  
✅ RLS policies active  
✅ Sites table has data (2 sites found)  

## Usage

### Creating Incidents
1. Navigate to Health & Safety page
2. Click "Report New Incident"
3. Fill in required fields:
   - Site selection
   - Incident date
   - Description
   - Optional file upload
4. Submit form

### Managing Incidents
- **View**: All incidents displayed in table format
- **Edit**: Click edit button to modify incident details
- **Status Updates**: Use action buttons to change investigation status
- **Search**: Filter incidents by site, description, or reporter

### Status Workflow
1. **Open** → New incidents start here
2. **In Progress** → Investigation underway
3. **Closed** → Investigation complete

## Integration Points

### Sites Table
- Incidents are linked to sites via `site_id`
- Site names displayed in incident list
- Site selection required for new incidents

### Authentication
- Uses Supabase auth for user management
- `reported_by_id` links to authenticated user
- RLS policies ensure proper access control

## File Upload Support
- UI ready for file uploads
- `report_url` field available for storing file references
- File upload functionality can be implemented as needed

## Performance Optimizations
- Indexes on frequently queried columns
- Efficient joins with sites table
- Pagination support ready
- Search optimization with ILIKE queries

## Next Steps
1. ✅ Database schema created
2. ✅ Service layer implemented
3. ✅ UI connected to database
4. ✅ Testing completed
5. 🔄 File upload implementation (optional)
6. 🔄 User profile integration (optional)
7. 🔄 Advanced reporting features (optional)

## Troubleshooting

### Common Issues
1. **RLS Policy Errors**: Ensure user is authenticated
2. **Foreign Key Errors**: Verify sites table has data
3. **Join Errors**: Check table relationships exist

### Testing Commands
```bash
# Test database setup
node setup-health-safety.js

# Test functionality
node test-health-safety.js
```

## Files Created/Modified
- ✅ `create-health-safety-incidents-table.sql` - Database schema
- ✅ `src/lib/healthSafetyService.js` - Service layer
- ✅ `src/pages/HealthSafety.jsx` - Updated component
- ✅ `setup-health-safety.js` - Setup script
- ✅ `test-health-safety.js` - Test script
- ✅ `HEALTH_SAFETY_SETUP.md` - This documentation

The Health & Safety module is now fully connected to the database and ready for production use! 🎉 