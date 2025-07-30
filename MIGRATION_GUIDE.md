# 🔧 Reports Migration Guide

## 🚨 Current Issue
The reports functionality is failing with this error:
```
Could not find a relationship between 'reports' and 'site_id' in the schema cache
```

This happens because the database migration hasn't been run yet.

## ✅ Solution

### Step 1: Run the Database Migration

1. **Go to your Supabase Dashboard**
   - Open your Supabase project
   - Navigate to the **SQL Editor** (in the left sidebar)

2. **Copy and paste this SQL:**

```sql
-- Add new fields to reports table
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS site_id INTEGER REFERENCES sites(id),
ADD COLUMN IF NOT EXISTS entity_officer_id INTEGER REFERENCES entity_staff(id),
ADD COLUMN IF NOT EXISTS security_officer_id INTEGER REFERENCES security_staff(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_site_id ON reports(site_id);
CREATE INDEX IF NOT EXISTS idx_reports_entity_officer_id ON reports(entity_officer_id);
CREATE INDEX IF NOT EXISTS idx_reports_security_officer_id ON reports(security_officer_id);
```

3. **Click "Run"** to execute the migration

### Step 2: Verify the Migration

After running the migration, the reports functionality should work properly. The migration:

- ✅ Adds `site_id` column (links to sites table)
- ✅ Adds `entity_officer_id` column (links to entity_staff table)  
- ✅ Adds `security_officer_id` column (links to security_staff table)
- ✅ Creates performance indexes
- ✅ Maintains backward compatibility

### Step 3: Test the Fix

1. Refresh your application
2. Navigate to the Reports page
3. Try to fetch reports - the error should be gone
4. Test creating a new report with the enhanced form

## 🔄 What This Migration Does

### Before Migration:
- Reports table has basic columns
- No foreign key relationships
- Limited filtering capabilities

### After Migration:
- Reports linked to specific sites
- Reports linked to entity officers
- Reports linked to security officers
- Enhanced filtering and reporting
- Better data integrity

## 🛠️ Temporary Fix Applied

I've added a temporary fix to `reportsService.js` that:
- Detects if the migration has been run
- Falls back to the old structure if migration hasn't run
- Shows a warning message in the console
- Prevents the application from crashing

## 📋 Migration Status

- [ ] **Migration not run yet** (current state)
- [ ] **Migration completed** (after you run the SQL)
- [ ] **Testing completed** (after you verify it works)

## 🚀 Benefits After Migration

1. **Better Data Structure**: Proper foreign key relationships
2. **Enhanced Filtering**: Filter by site, entity officer, security officer
3. **Improved Reporting**: Link reports to specific entities
4. **Data Integrity**: Ensures referenced data exists
5. **Better UX**: Dropdown selections instead of manual text entry

---

**⚠️ Important**: Run the migration in your Supabase dashboard to resolve this error completely. 