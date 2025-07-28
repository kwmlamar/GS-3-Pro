# Security Staff Form Implementation

## Overview
A dedicated SecurityStaffForm component has been created to handle adding and editing security staff members. This form is specifically designed to work with the `security_staff` table structure and provides a comprehensive interface for managing security personnel.

## Key Features

### Form Fields
The SecurityStaffForm includes the following sections:

1. **Basic Information**
   - First Name
   - Last Name
   - Employee ID
   - Position
   - Security Company (dropdown)

2. **Contact Information**
   - Email
   - Phone

3. **Employment Details**
   - Hire Date
   - Termination Date
   - Status (Active, Inactive, On Leave, Terminated, Suspended)

4. **Compliance & Background Checks**
   - Compliance Score (%)
   - Performance Rating
   - Background Check Status (Pending, In Progress, Approved, Rejected, Expired)
   - Background Check Expiry Date
   - Drug Test Status (Pending, Passed, Failed, Expired)
   - Drug Test Expiry Date

5. **Equipment & Uniform**
   - Uniform Size (XS, S, M, L, XL, XXL)

6. **Site Assignments**
   - Multi-select dropdown for assigning security staff to sites
   - Primary site designation

7. **Certifications & Training**
   - Certifications (comma-separated text area)

8. **Notes**
   - General notes and comments

## Database Structure

### Tables Used
- `security_staff` - Main table for security staff data
- `security_staff_entities` - Junction table linking security staff to sites
- `subcontractor_profiles` - Security companies
- `sites` - Available sites for assignment

### Key Fields in security_staff Table
```sql
- id (BIGSERIAL PRIMARY KEY)
- first_name (VARCHAR(255) NOT NULL)
- last_name (VARCHAR(255) NOT NULL)
- employee_id (VARCHAR(100) UNIQUE)
- security_company_id (BIGINT REFERENCES subcontractor_profiles)
- position (VARCHAR(255) NOT NULL)
- status (VARCHAR(50) DEFAULT 'Active')
- hire_date (DATE DEFAULT CURRENT_DATE)
- termination_date (DATE)
- email (VARCHAR(255))
- phone (VARCHAR(50))
- emergency_contact (JSONB)
- certifications (TEXT[])
- training_completion (JSONB)
- performance_rating (DECIMAL(3,2))
- compliance_score (INTEGER DEFAULT 100)
- background_check_status (VARCHAR(50))
- background_check_expiry (DATE)
- drug_test_status (VARCHAR(50))
- drug_test_expiry (DATE)
- uniform_size (VARCHAR(50))
- equipment_assigned (JSONB)
- notes (TEXT)
```

## Implementation Details

### Component Location
- File: `src/components/security-staff/SecurityStaffForm.jsx`
- Import: `import SecurityStaffForm from '@/components/security-staff/SecurityStaffForm';`

### Service Functions
The form uses the following service functions from `src/lib/securityStaffService.js`:
- `createSecurityStaff(securityStaffData)` - Creates new security staff
- `updateSecurityStaff(id, updates)` - Updates existing security staff
- `getSecurityCompanies()` - Fetches available security companies
- `getPotentialSupervisors(excludeId)` - Fetches potential supervisors

### Form Features
1. **Real-time Validation** - Form validates required fields before submission
2. **Multi-site Assignment** - Security staff can be assigned to multiple sites
3. **Company Integration** - Links to security companies from subcontractor_profiles
4. **Compliance Tracking** - Tracks background checks, drug tests, and compliance scores
5. **Performance Monitoring** - Includes performance rating and training completion
6. **Equipment Management** - Tracks uniform sizes and assigned equipment

### UI/UX Features
1. **Responsive Design** - Works on desktop and mobile devices
2. **Modal Interface** - Opens as a modal overlay
3. **Loading States** - Shows loading indicators during API calls
4. **Error Handling** - Displays user-friendly error messages
5. **Form Validation** - Prevents submission with invalid data
6. **Auto-save Prevention** - Prevents accidental form submission

## Usage

### In SecurityStaff Page
The form is integrated into the SecurityStaff page (`src/pages/SecurityStaff.jsx`):

```jsx
{showAddForm && (
  <SecurityStaffForm
    onClose={() => setShowAddForm(false)}
    onSuccess={handleEntityStaffCreated}
  />
)}
```

### Props
- `securityStaff` (optional) - Existing security staff data for editing
- `onClose` (function) - Callback when form is closed
- `onSuccess` (function) - Callback when form is successfully submitted

## Database Setup

### Required Tables
1. Run `create-security-staff-table.sql` to create the main security_staff table
2. Run `create-security-staff-entities-table.sql` to create the junction table
3. Ensure `subcontractor_profiles` and `sites` tables exist

### Sample Data
The security_staff table includes sample data for testing:
- James Wilson (Security Officer)
- Maria Garcia (Site Supervisor)
- David Thompson (Security Officer)
- Sarah Miller (Security Officer)

## Testing

### Manual Testing
1. Navigate to Security Staff page
2. Click "Add Security Staff" button
3. Fill out the form with test data
4. Submit and verify data is saved
5. Edit existing security staff and verify updates

### Automated Testing
Run the test script: `node test-security-staff-form.js`

## Future Enhancements

### Potential Improvements
1. **File Upload** - Add ability to upload documents (certifications, background checks)
2. **Bulk Operations** - Import/export security staff data
3. **Advanced Filtering** - Filter by company, status, compliance score
4. **Reporting** - Generate compliance and performance reports
5. **Notifications** - Alert when background checks or drug tests are expiring
6. **Mobile App** - Native mobile application for field use

### Integration Opportunities
1. **Time Tracking** - Integrate with time tracking systems
2. **Payroll** - Connect to payroll systems
3. **Training Management** - Link to training platforms
4. **Incident Reporting** - Connect to incident management systems
5. **Client Portal** - Allow clients to view assigned security staff

## Troubleshooting

### Common Issues
1. **Database Connection** - Ensure Supabase connection is configured
2. **RLS Policies** - Verify Row Level Security policies are set up
3. **Missing Tables** - Run all required SQL scripts
4. **Permission Issues** - Check authentication and authorization

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify network requests in browser dev tools
3. Check Supabase logs for database errors
4. Test database connection directly
5. Verify table structure matches expected schema

## Conclusion

The SecurityStaffForm provides a comprehensive solution for managing security staff data with a user-friendly interface and robust backend integration. The form handles all aspects of security staff management from basic information to compliance tracking and site assignments. 