# Reports Form Officer Field Update

## Overview
The reports form has been updated to replace the single "Reporting Officer" field with three separate dropdown fields:
- **Site** (dropdown from sites table)
- **Entity Officer** (dropdown from entity_staff table)
- **Security Officer** (dropdown from security_staff table)

## Changes Made

### 1. Database Schema Update
**File:** `update-reports-table-for-officers.sql`

The reports table needs to be updated with the following SQL (run in Supabase dashboard):

```sql
-- Add new fields
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS site_id INTEGER REFERENCES sites(id),
ADD COLUMN IF NOT EXISTS entity_officer_id INTEGER REFERENCES entity_staff(id),
ADD COLUMN IF NOT EXISTS security_officer_id INTEGER REFERENCES security_staff(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_site_id ON reports(site_id);
CREATE INDEX IF NOT EXISTS idx_reports_entity_officer_id ON reports(entity_officer_id);
CREATE INDEX IF NOT EXISTS idx_reports_security_officer_id ON reports(security_officer_id);
```

### 2. ReportForm Component Updates
**File:** `src/components/reports/ReportForm.jsx`

**Changes:**
- Added imports for `getEntityStaff`, `getSecurityStaff`, and `supabase` client
- Replaced `officer_name` field with `site_id`, `entity_officer_id`, and `security_officer_id` fields
- Added state management for entity staff, security staff, and sites data
- Added useEffect to fetch all data on component mount
- Replaced the single officer input field with three dropdown selects
- Updated form data handling to work with the new field structure
- **Completely removed Site/Location field** - site information now derived from Site selection

**New Features:**
- Site dropdown populated from sites table
- Entity Officer dropdown populated from entity_staff table
- Security Officer dropdown populated from security_staff table
- **Site information automatically derived from selected Site**
- Loading states for dropdowns while data is being fetched
- Option to leave fields unassigned (null values)

### 3. Reports Service Updates
**File:** `src/lib/reportsService.js`

**Changes:**
- Updated `getReports()` method to join with sites, entity_staff, and security_staff tables
- Updated `getReport()` method to include site and officer information
- Added data transformation to include site and officer names for display
- Updated filter options to work with new field structure

**New Features:**
- Automatic fetching of site and officer names from related tables
- Support for filtering by site, entity officer, or security officer
- Backward compatibility with existing reports

### 4. ReportList Component Updates
**File:** `src/pages/reports/ReportList.jsx`

**Changes:**
- Updated the display section to show site, entity officer, and security officer
- Replaced site display with site information since site information is derived from site selection
- Removed redundant site name display

**New Display:**
- Shows "Site: [Name]", "Entity Officer: [Name]", and "Security Officer: [Name]"
- Handles cases where fields are not assigned ("Not assigned")

## Migration Steps

1. **Run the SQL migration** in your Supabase dashboard using the provided SQL script
2. **Test the updated form** by creating a new report
3. **Verify the dropdowns** populate correctly with sites, entity staff, and security staff data
4. **Check the report list** displays all three fields correctly

## Backward Compatibility

- The old `officer_name` column is preserved for existing reports
- Existing reports will show "Not assigned" for the new fields
- The system gracefully handles missing data

## Benefits

1. **Better Data Structure**: Proper foreign key relationships instead of text fields
2. **Data Integrity**: Ensures sites and officers exist in the system
3. **Enhanced Filtering**: Can filter reports by specific sites and officers
4. **Improved UX**: Dropdown selection instead of manual text entry
5. **Consistency**: Aligns with the existing sites, entity staff, and security staff systems
6. **Comprehensive Reporting**: Links reports to specific sites and responsible officers
7. **Simplified Data Model**: Site information derived from site selection, eliminating redundant data storage

## Testing

To test the changes:

1. Navigate to the Reports page
2. Click "Create New Report"
3. Verify all three dropdowns (Site, Entity Officer, Security Officer) are populated
4. Select values and save the report
5. Check that the report list displays all three fields correctly
6. Test editing an existing report to ensure the dropdowns work properly 