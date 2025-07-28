# Staff Database Structure

This document outlines the comprehensive database structure for managing security staff and entity staff within the GS-3 SecureOps Pro platform.

## Overview

The platform now supports two distinct types of staff management:

1. **Security Staff** - Employees of security companies (subcontractors)
2. **Entity Staff** - Employees of client entities/sites

## Database Tables

### Security Staff Tables

#### `security_staff`
Main table for security company employees.

**Key Fields:**
- `id` - Primary key
- `first_name`, `last_name` - Employee name
- `employee_id` - Unique employee identifier
- `security_company_id` - **Links to `subcontractor_profiles` table**
- `position` - Job title (Security Officer, Site Supervisor, etc.)
- `status` - Active, Inactive, On Leave, Terminated, Suspended
- `performance_rating` - 0-5 rating system
- `compliance_score` - 0-100 compliance percentage
- `background_check_status` - Pending, In Progress, Approved, Rejected, Expired
- `drug_test_status` - Pending, Passed, Failed, Expired
- `certifications` - Array of certifications
- `training_completion` - JSON object tracking training completion
- `equipment_assigned` - JSON array of assigned equipment

#### `security_staff_assignments`
Tracks site assignments for security staff.

**Key Fields:**
- `security_staff_id` - Links to security_staff
- `site_id` - Links to sites table
- `shift_type` - Day, Night, Graveyard, Flexible
- `hours_per_week` - Weekly hours
- `hourly_rate` - Pay rate
- `supervisor_id` - Links to another security_staff member

#### `security_staff_incidents`
Tracks incidents involving security staff.

**Key Fields:**
- `security_staff_id` - Links to security_staff
- `site_id` - Links to sites table
- `incident_type` - Type of incident
- `severity` - Low, Medium, High, Critical
- `status` - Open, In Progress, Resolved, Closed
- `witnesses` - JSON array of witnesses
- `evidence_attached` - JSON array of evidence

#### `security_staff_performance_logs`
Tracks performance metrics over time.

**Key Fields:**
- `security_staff_id` - Links to security_staff
- `log_date` - Date of performance log
- `performance_score` - 0-5 rating
- `attendance_rate` - Percentage attendance
- `incident_count` - Number of incidents
- `client_satisfaction_rating` - 1-5 rating
- `training_hours_completed` - Training hours

### Entity Staff Tables

#### `entity_staff`
Main table for client entity employees.

**Key Fields:**
- `id` - Primary key
- `first_name`, `last_name` - Employee name
- `employee_id` - Unique employee identifier
- `entity_id` - **Links to `sites` table**
- `department` - Department within entity
- `position` - Job title
- `employee_type` - Full-time, Part-time, Contractor, Temporary, Intern
- `access_level` - Standard, Elevated, Administrative, Restricted
- `security_clearance` - None, Basic, Secret, Top Secret, Special Access
- `supervisor_id` - Self-referencing for hierarchy
- `performance_rating` - 0-5 rating system
- `compliance_score` - 0-100 compliance percentage

#### `entity_staff_assignments`
Tracks role assignments for entity staff.

**Key Fields:**
- `entity_staff_id` - Links to entity_staff
- `site_id` - Links to sites table
- `role_title` - Specific role title
- `is_primary_role` - Boolean for primary role
- `hours_per_week` - Weekly hours
- `salary` - Annual salary
- `status` - Active, Inactive, Completed, Terminated

#### `entity_staff_incidents`
Tracks incidents involving entity staff.

**Key Fields:**
- `entity_staff_id` - Links to entity_staff
- `site_id` - Links to sites table
- `incident_type` - Type of incident
- `severity` - Low, Medium, High, Critical
- `status` - Open, In Progress, Resolved, Closed

#### `entity_staff_performance_logs`
Tracks performance metrics for entity staff.

**Key Fields:**
- `entity_staff_id` - Links to entity_staff
- `log_date` - Date of performance log
- `performance_score` - 0-5 rating
- `attendance_rate` - Percentage attendance
- `incident_count` - Number of incidents
- `training_hours_completed` - Training hours
- `compliance_score` - 0-100 compliance percentage

#### `entity_staff_access_logs`
Tracks access control logs for entity staff.

**Key Fields:**
- `entity_staff_id` - Links to entity_staff
- `site_id` - Links to sites table
- `access_type` - Entry, Exit, Area Access, System Login, System Logout
- `access_point` - Specific access point
- `access_time` - Timestamp of access
- `access_method` - Card, Biometric, Key, Manual, System
- `access_result` - Granted, Denied, Suspicious, Error

## Key Relationships

### Security Staff Relationships
```
security_staff
├── security_company_id → subcontractor_profiles.id
├── supervisor_id → security_staff.id (self-reference)
└── Assignments, Incidents, Performance Logs

security_staff_assignments
├── security_staff_id → security_staff.id
├── site_id → sites.id
└── supervisor_id → security_staff.id
```

### Entity Staff Relationships
```
entity_staff
├── entity_id → sites.id
├── supervisor_id → entity_staff.id (self-reference)
└── Assignments, Incidents, Performance Logs, Access Logs

entity_staff_assignments
├── entity_staff_id → entity_staff.id
└── site_id → sites.id
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies for authenticated users.

### Data Validation
- Status fields use CHECK constraints for valid values
- Performance ratings are constrained to 0-5 range
- Compliance scores are constrained to 0-100 range
- Date fields ensure logical date relationships

### Indexing Strategy
- Primary keys are indexed automatically
- Foreign key relationships are indexed
- Status fields are indexed for filtering
- Date fields are indexed for time-based queries
- Performance rating fields are indexed for sorting

## Sample Data

### Security Staff Sample
- James Wilson (SEC001) - Security Officer at SecureCorp
- Maria Garcia (SEC002) - Site Supervisor at SecureCorp
- David Thompson (SEC003) - Security Officer at Guardian Security
- Sarah Miller (SEC004) - Security Officer at Guardian Security

### Entity Staff Sample
- Robert Anderson (ENT001) - Operations Manager at Corporate HQ
- Jennifer Martinez (ENT002) - HR Director at Corporate HQ
- Michael Brown (ENT003) - Systems Administrator at Metro Hospital
- Lisa Davis (ENT004) - Administrative Assistant at Metro Hospital

## Usage Examples

### Query Security Staff by Company
```sql
SELECT 
  ss.first_name,
  ss.last_name,
  ss.position,
  sc.company_name
FROM security_staff ss
JOIN subcontractor_profiles sc ON ss.security_company_id = sc.id
WHERE sc.company_name = 'SecureCorp';
```

### Query Entity Staff by Site
```sql
SELECT 
  es.first_name,
  es.last_name,
  es.department,
  es.position,
  s.site_name
FROM entity_staff es
JOIN sites s ON es.entity_id = s.id
WHERE s.site_name = 'Corporate HQ Alpha';
```

### Performance Tracking
```sql
SELECT 
  ss.first_name,
  ss.last_name,
  AVG(spl.performance_score) as avg_performance,
  AVG(spl.attendance_rate) as avg_attendance
FROM security_staff ss
JOIN security_staff_performance_logs spl ON ss.id = spl.security_staff_id
WHERE spl.log_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY ss.id, ss.first_name, ss.last_name;
```

## Implementation Notes

1. **Security Staff** are linked to security companies (subcontractors) via `security_company_id`
2. **Entity Staff** are linked to sites/entities via `entity_id`
3. Both staff types support hierarchical relationships through self-referencing `supervisor_id`
4. Performance tracking is available for both staff types
5. Incident tracking is comprehensive for both staff types
6. Access control logging is specific to entity staff
7. All tables support audit trails with `created_at` and `updated_at` timestamps

This structure provides a robust foundation for managing both security company employees and client entity employees within the GS-3 SecureOps Pro platform. 