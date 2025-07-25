# Reports Hub Database Setup

This document outlines the setup and functionality of the Reports Hub, which provides comprehensive reporting capabilities for the GS-3 SecureOps Pro platform.

## Overview

The Reports Hub consists of four main components:
- **Reports**: Main security reports with document control
- **Violations**: Security violations and events tracking
- **Observations**: Security observations and notes
- **Templates**: Dynamic report templates

## Database Schema

### Reports Table
```sql
CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  report_type VARCHAR(100) NOT NULL,
  doc_number VARCHAR(100) UNIQUE NOT NULL,
  site_id BIGINT,
  site_name VARCHAR(255),
  officer_id BIGINT,
  officer_name VARCHAR(255),
  report_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft',
  priority VARCHAR(50) DEFAULT 'Medium',
  description TEXT,
  findings TEXT,
  recommendations TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Violations Table
```sql
CREATE TABLE violations (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  site_id BIGINT,
  site_name VARCHAR(255),
  reported_by_id BIGINT,
  reported_by_name VARCHAR(255),
  violation_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  resolution_notes TEXT,
  corrective_actions TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Observations Table
```sql
CREATE TABLE observations (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'Medium',
  location VARCHAR(255),
  site_id BIGINT,
  site_name VARCHAR(255),
  observer_id BIGINT,
  observer_name VARCHAR(255),
  observation_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Report Templates Table
```sql
CREATE TABLE report_templates (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(100) NOT NULL,
  template_content JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- Supabase project configured
- Environment variables set up

### 2. Run the Setup Script
```bash
node setup-reports-tables.js
```

This script will:
- Test database connection
- Create all necessary tables
- Insert sample data
- Set up Row Level Security (RLS) policies
- Create indexes for performance

### 3. Verify Setup
After running the setup script, you should see:
- ✅ Database connection successful
- ✅ All tables created
- ✅ Sample data inserted
- ✅ RLS policies configured

## Features

### Reports Management
- **Document Control**: Unique document numbers (SIR-2024-001, DPR-2024-045, etc.)
- **Status Tracking**: Draft, Under Review, Completed
- **Priority Levels**: High, Medium, Low
- **Search & Filter**: By title, document number, officer, site
- **Export & Share**: PDF export and sharing capabilities

### Violations Tracking
- **Severity Levels**: High, Medium, Low
- **Status Management**: Open, Under Investigation, Resolved
- **Location Tracking**: Specific site and area information
- **Resolution Notes**: Detailed resolution and corrective actions

### Observations System
- **Priority Levels**: High, Medium, Low
- **Follow-up Tracking**: Required follow-up actions
- **Location Mapping**: Site and area observations
- **Status Management**: Open, Under Review, Resolved

### Template System
- **Dynamic Templates**: JSON-based template content
- **Type Categorization**: Incident, Patrol, Inspection, etc.
- **Active/Inactive**: Template availability control
- **Customizable Sections**: Configurable template structure

## API Services

### Reports Service
```javascript
import { reportsService } from '@/lib/reportsService';

// Get all reports with optional filters
const reports = await reportsService.getReports({
  status: 'Completed',
  type: 'Incident',
  site: 'Corporate HQ'
});

// Create new report
const newReport = await reportsService.createReport({
  title: 'Security Incident Report',
  report_type: 'Incident',
  doc_number: 'SIR-2024-002',
  // ... other fields
});
```

### Violations Service
```javascript
import { violationsService } from '@/lib/reportsService';

// Get violations with filters
const violations = await violationsService.getViolations({
  severity: 'High',
  status: 'Open'
});
```

### Observations Service
```javascript
import { observationsService } from '@/lib/reportsService';

// Get observations with filters
const observations = await observationsService.getObservations({
  priority: 'High',
  followUpRequired: true
});
```

### Templates Service
```javascript
import { reportTemplatesService } from '@/lib/reportsService';

// Get active templates
const templates = await reportTemplatesService.getTemplates({
  isActive: true
});
```

## Document Number Generation

The system includes automatic document number generation:

```javascript
import { generateDocNumber } from '@/lib/reportsService';

// Generate document numbers
const docNumber = generateDocNumber('Incident', new Date());
// Returns: SIR-2024-0115-001
```

Document number prefixes:
- **SIR**: Security Incident Report
- **DPR**: Daily Patrol Report
- **EIR**: Equipment Inspection Report
- **SAR**: Security Assessment Report
- **VR**: Violation Report
- **OL**: Observation Log

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies for:
- **Read Access**: Authenticated users can read all records
- **Write Access**: Authenticated users can create/update records
- **Delete Access**: Authenticated users can delete records

### Data Validation
- **Required Fields**: Title, type, document number, dates
- **Status Validation**: Predefined status values
- **Priority Validation**: High, Medium, Low only
- **Date Validation**: Proper date format and ranges

## Performance Optimizations

### Database Indexes
- **Document Numbers**: Fast lookup by unique doc numbers
- **Status & Type**: Efficient filtering
- **Dates**: Range queries and sorting
- **Full-text Search**: Name and description search

### Query Optimization
- **Pagination**: Large dataset handling
- **Filtering**: Efficient WHERE clauses
- **Sorting**: Indexed ORDER BY operations
- **Caching**: Client-side data caching

## Sample Data

The setup script inserts comprehensive sample data:

### Reports
- Security Incident Report (SIR-2024-001)
- Daily Patrol Report (DPR-2024-045)
- Equipment Inspection Report (EIR-2024-012)
- Security Assessment Report (SAR-2024-003)

### Violations
- Safety Violation (Medium severity)
- Security Breach (High severity)
- Policy Violation (Low severity)
- Equipment Misuse (Medium severity)

### Observations
- Maintenance Issue (Medium priority)
- Security Enhancement (Low priority)
- Safety Concern (High priority)
- Operational Improvement (Low priority)

### Templates
- Security Incident Report Template
- Daily Patrol Template
- Equipment Inspection Template
- Violation Report Template
- Observation Log Template
- Security Assessment Template

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check environment variables
   - Verify Supabase URL and key
   - Ensure network connectivity

2. **RLS Policy Errors**
   - Verify user authentication
   - Check policy permissions
   - Ensure proper role assignment

3. **Missing Tables**
   - Run setup script again
   - Check SQL execution logs
   - Verify database permissions

4. **Data Not Loading**
   - Check service imports
   - Verify table names
   - Check console for errors

### Debug Commands

```bash
# Test database connection
node test-database-connection.sql

# Check table structure
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%report%';

# Verify sample data
SELECT COUNT(*) FROM reports;
SELECT COUNT(*) FROM violations;
SELECT COUNT(*) FROM observations;
SELECT COUNT(*) FROM report_templates;
```

## Next Steps

After successful setup:

1. **Test the Reports Hub**: Navigate to `/reports` in your application
2. **Create Custom Reports**: Use the template system for new report types
3. **Implement Export Features**: Add PDF generation capabilities
4. **Add Advanced Filtering**: Implement date ranges and complex queries
5. **Integrate with Other Modules**: Connect with employees, sites, and assessments

## Support

For issues or questions:
- Check the console for error messages
- Review the database logs
- Verify environment configuration
- Test individual service functions

The Reports Hub is now fully integrated with your GS-3 SecureOps Pro platform and ready for production use! 