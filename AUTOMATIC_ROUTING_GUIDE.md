# 🔄 Automatic Report Routing Guide

## 🎯 Overview

The system now automatically routes reports to the appropriate table based on the report type:

- **"Violation"** → `violations` table
- **"Observation"** → `observations` table  
- **All other types** → `reports` table

## 📋 How It Works

### 1. **Report Creation**
When creating a report, the system automatically:

```javascript
// Example: Creating a "Violation" report
const reportData = {
  title: "Safety Violation",
  report_type: "Violation",  // ← This triggers routing
  description: "Improper PPE usage",
  priority: "High",
  // ... other fields
};

// Result: Automatically saved to violations table
```

### 2. **Data Transformation**
The system transforms the data to match the target table structure:

#### For Violations:
```javascript
// Input (ReportForm data)
{
  title: "Safety Violation",
  report_type: "Violation",
  description: "Improper PPE usage",
  priority: "High",
  site_name: "Building A"
}

// Output (violations table)
{
  type: "Safety Violation",           // title → type
  description: "Improper PPE usage",
  severity: "High",                   // priority → severity
  location: "Building A",             // site_name → location
  violation_date: "2024-01-15",      // report_date → violation_date
  status: "Open",
  // ... other fields
}
```

#### For Observations:
```javascript
// Input (ReportForm data)
{
  title: "Lighting Issue",
  report_type: "Observation",
  description: "Broken light in parking lot",
  priority: "Medium"
}

// Output (observations table)
{
  type: "Lighting Issue",            // title → type
  description: "Broken light in parking lot",
  priority: "Medium",                 // priority stays same
  observation_date: "2024-01-15",    // report_date → observation_date
  follow_up_required: false,         // based on priority
  status: "Open"
  // ... other fields
}
```

### 3. **Unified Viewing**
The `getReports()` method now fetches from all three tables and combines the results:

```javascript
// Fetches from reports, violations, and observations tables
const allReports = await reportsService.getReports();

// Returns unified format with original_table field
[
  {
    id: 1,
    title: "Security Incident",
    report_type: "Incident",
    original_table: "reports"
  },
  {
    id: 2,
    title: "Safety Violation", 
    report_type: "Violation",
    original_table: "violations"
  },
  {
    id: 3,
    title: "Lighting Issue",
    report_type: "Observation", 
    original_table: "observations"
  }
]
```

## 🎛️ Report Types & Routing

| Report Type | Target Table | Special Behavior |
|-------------|--------------|------------------|
| **Violation** | `violations` | Priority → Severity, Title → Type |
| **Observation** | `observations` | Title → Type, Auto follow-up for High/Critical |
| **Incident** | `reports` | Standard report behavior |
| **Patrol** | `reports` | Standard report behavior |
| **Inspection** | `reports` | Standard report behavior |
| **Assessment** | `reports` | Standard report behavior |
| **Equipment** | `reports` | Standard report behavior |
| **Training** | `reports` | Standard report behavior |
| **Maintenance** | `reports` | Standard report behavior |
| **Other** | `reports` | Standard report behavior |

## 🔍 Filtering & Search

### Type-Based Filtering
```javascript
// Get only violations
const violations = await reportsService.getReports({ type: 'Violation' });

// Get only observations  
const observations = await reportsService.getReports({ type: 'Observation' });

// Get only standard reports
const reports = await reportsService.getReports({ type: 'Incident' });
```

### Cross-Table Filtering
```javascript
// Filter by site across all tables
const siteReports = await reportsService.getReports({ site: 123 });

// Filter by officer across all tables
const officerReports = await reportsService.getReports({ 
  entityOfficer: 456 
});

// Filter by date range across all tables
const dateReports = await reportsService.getReports({
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31'
});
```

## 📊 Benefits

### 1. **Automatic Organization**
- Violations automatically go to violations table
- Observations automatically go to observations table
- No manual table selection needed

### 2. **Unified Interface**
- Single form for all report types
- Consistent user experience
- No need to learn different interfaces

### 3. **Better Data Structure**
- Each table optimized for its data type
- Proper foreign key relationships
- Enhanced filtering capabilities

### 4. **Backward Compatibility**
- Existing reports continue to work
- Legacy data preserved
- Gradual migration possible

## 🛠️ Technical Implementation

### Key Methods Updated:

1. **`createReport()`** - Routes to appropriate table
2. **`getReports()`** - Fetches from all tables
3. **Data transformation** - Converts between formats
4. **Error handling** - Graceful fallbacks

### Console Logging:
```javascript
// Shows which table is being used
console.log(`📋 Creating ${reportType} in ${targetTable} table`);
```

## 🚨 Important Notes

### 1. **Migration Required**
Before this works properly, run the database migrations:
- `update-reports-table-for-officers.sql`
- `update-violations-observations-tables.sql`

### 2. **Data Consistency**
- All tables now have consistent foreign key structure
- Same officer and site relationships across tables
- Proper indexing for performance

### 3. **Testing**
- Test creating each report type
- Verify data appears in correct table
- Check filtering works across all tables

## 🔄 Future Enhancements

### Potential Improvements:
1. **Edit functionality** - Update routing for editing
2. **Delete functionality** - Handle deletion across tables
3. **Bulk operations** - Mass updates across tables
4. **Advanced filtering** - More sophisticated search
5. **Reporting** - Cross-table analytics

---

**🎯 Result**: Seamless automatic routing with unified interface and better data organization! 