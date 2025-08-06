# Database Fix Instructions

## Issue
The application is showing an error because the database still has references to the old "employees" table, but the table has been renamed to "entity_staff".

## Solution
You need to run **TWO** SQL scripts in your Supabase SQL Editor.

### Steps:

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the First Fix Script**
   - Copy the contents of `fix-database-views-and-functions.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

4. **Run the Second Fix Script**
   - Create a new query
   - Copy the contents of `fix-database-triggers.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

5. **Verify the Fix**
   - Both scripts should complete without errors
   - You should see "Database functions and views updated successfully!" and "Database triggers and policies updated successfully!" as results

## What the Scripts Do

### First Script (`fix-database-views-and-functions.sql`):
- ✅ Drops the old `employees_with_supervisors` view
- ✅ Creates the new `entity_staff_with_supervisors` view
- ✅ Updates all database functions to use `entity_staff` table
- ✅ Updates function parameters to use `entity_staff_id`
- ✅ Updates triggers and permissions

### Second Script (`fix-database-triggers.sql`):
- ✅ Drops the old trigger on `employees` table
- ✅ Creates new trigger on `entity_staff` table
- ✅ Creates proper indexes for `entity_staff` table
- ✅ Sets up Row Level Security (RLS) policies for `entity_staff` table

## After Running the Scripts

Once you've run both scripts, the application should work correctly. The error:
```
relation "employees" does not exist
```

Should be resolved, and you should be able to:
- View entity staff
- Add new entity staff
- Edit existing entity staff
- Use the chain of command functionality

## If You Still See Errors

If you still see errors after running the scripts:
1. Check the browser console for new error messages
2. Make sure both scripts ran successfully in the SQL Editor
3. Try refreshing the application page
4. Check if there are any other database objects still referencing the old table 