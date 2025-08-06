# NFC/GPS Tags Setup Guide

This guide explains how to set up and use the NFC/GPS functionality in the GS-3 PRO system.

## Overview

The NFC/GPS system provides:
- **NFC Tags**: Physical tags that can be scanned for location verification
- **GPS Locations**: Geofenced areas for automated check-ins
- **Scan Logs**: Complete audit trail of all scans and check-ins
- **Real-time Data**: Live updates from the database

## Database Setup

### 1. Run the SQL Script

Copy and paste the contents of `nfc-gps-setup-supabase.sql` into your Supabase SQL Editor and execute it.

This will create:
- `nfc_tags` table
- `gps_locations` table  
- `scan_logs` table
- All necessary indexes and security policies

### 2. Verify Setup

After running the script, you should see:
- 5 NFC tags created
- 5 GPS locations created
- 4 sample scan logs
- All tables accessible with proper permissions

## Features Implemented

### NFC Management Page (`/nfc-management`)

**Overview Tab:**
- Real-time statistics dashboard
- Total NFC tags and GPS locations
- 24-hour scan activity
- Active tag count

**NFC Tags Tab:**
- List all NFC tags with real data
- Battery level indicators
- Last scan timestamps
- Location descriptions
- Manual scan logging

**GPS Locations Tab:**
- List all GPS locations
- Radius and type information
- Last check-in times
- Manual check-in functionality

**Mobile Scanner Tab:**
- Simulated mobile scanner interface
- Scan simulation with real database logging

**Media Attachments Tab:**
- Interface for attaching media to scans
- Photo, audio, and note capabilities

### Entity Details Integration

When viewing site details, you'll see a new **NFC/GPS** tab showing:
- All NFC tags deployed at that site
- All GPS locations configured for that site
- Status and last activity information

## Database Schema

### NFC Tags Table
```sql
nfc_tags (
  id BIGSERIAL PRIMARY KEY,
  tag_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  site_id BIGINT,
  location_description VARCHAR(500),
  coordinates POINT,
  status VARCHAR(50) DEFAULT 'Active',
  tag_type VARCHAR(50) DEFAULT 'NFC',
  battery_level INTEGER DEFAULT 100,
  last_scan_at TIMESTAMP WITH TIME ZONE,
  last_scan_by BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### GPS Locations Table
```sql
gps_locations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  site_id BIGINT,
  coordinates POINT NOT NULL,
  radius_meters INTEGER DEFAULT 50,
  status VARCHAR(50) DEFAULT 'Active',
  location_type VARCHAR(50) DEFAULT 'Patrol',
  last_check_in_at TIMESTAMP WITH TIME ZONE,
  last_check_in_by BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Scan Logs Table
```sql
scan_logs (
  id BIGSERIAL PRIMARY KEY,
  tag_id BIGINT,
  gps_location_id BIGINT,
  scanned_by BIGINT,
  scan_type VARCHAR(50) NOT NULL,
  coordinates POINT,
  scan_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  media_attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## Service Functions

The `nfcGpsService` provides these functions:

### NFC Tags
- `getNfcTags()` - Get all NFC tags
- `getNfcTagsBySite(siteId)` - Get tags for a specific site
- `createNfcTag(tagData)` - Create new NFC tag
- `updateNfcTag(id, updates)` - Update existing tag
- `deleteNfcTag(id)` - Delete NFC tag

### GPS Locations
- `getGpsLocations()` - Get all GPS locations
- `getGpsLocationsBySite(siteId)` - Get locations for a specific site
- `createGpsLocation(locationData)` - Create new GPS location
- `updateGpsLocation(id, updates)` - Update existing location
- `deleteGpsLocation(id)` - Delete GPS location

### Scan Logging
- `logScan(scanData)` - Log a new scan
- `getScanLogs(filters)` - Get scan history
- `getScanStatistics()` - Get scan statistics

## Usage Examples

### Logging an NFC Scan
```javascript
await nfcGpsService.logScan({
  tag_id: 1,
  scanned_by: 1, // Current user ID
  scan_type: 'NFC',
  coordinates: { lat: 40.7128, lng: -74.0060 },
  notes: 'Regular patrol check-in'
});
```

### Logging a GPS Check-in
```javascript
await nfcGpsService.logScan({
  gps_location_id: 1,
  scanned_by: 1, // Current user ID
  scan_type: 'GPS',
  coordinates: { lat: 40.7128, lng: -74.0060 },
  notes: 'Manual GPS check-in'
});
```

## Testing

Use the test script `test-nfc-gps-setup.js` to verify functionality:

1. Open browser console
2. Run: `window.testNfcGps.runAllTests()`

This will test:
- Database connection
- Table existence
- Service functionality
- Data retrieval

## Next Steps

To complete the implementation:

1. **Run the SQL script** in Supabase SQL Editor
2. **Test the functionality** using the test script
3. **Add user authentication** to get current user ID for scans
4. **Implement real NFC scanning** using Web NFC API
5. **Add GPS geofencing** for automatic check-ins
6. **Create mobile app** for field use

## Troubleshooting

### Common Issues

1. **Tables don't exist**: Run the SQL script in Supabase
2. **Permission errors**: Check RLS policies are enabled
3. **Data not loading**: Verify site IDs match existing sites
4. **Scan not logging**: Check user authentication

### Debug Commands

```javascript
// Test database connection
window.testNfcGps.testDatabaseConnection()

// Check table existence
window.testNfcGps.testTableExistence()

// Test service functions
window.testNfcGps.testNfcGpsService()
```

## Security

- All tables have Row Level Security (RLS) enabled
- Policies restrict access to authenticated users only
- Coordinates are stored as PostgreSQL POINT type
- All operations are logged with timestamps
- User authentication required for all operations 