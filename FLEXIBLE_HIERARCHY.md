# Flexible Hierarchy Builder

## Overview

The Hierarchy Builder now supports flexible parent-child relationships, allowing any entity type to be a parent of any other entity type. This provides maximum flexibility for organizing your organizational structure.

## Key Changes

### Before (Restrictive Hierarchy)
- `site` could only have `region`, `national`, or `global` as parents
- `region` could only have `national` or `global` as parents  
- `national` could only have `global` as parent
- `global` could not have any parent

### After (Flexible Hierarchy)
- Any entity type can be a parent of any other entity type
- No restrictions on parent-child relationships
- Self-referencing is prevented (an entity cannot be its own parent)
- All entity types can have parents or be parentless

## Entity Types

The system supports the following entity types:
- `site` - Individual locations or facilities
- `region` - Regional groupings
- `national` - National-level entities
- `global` - Global-level entities
- `special_activity` - Special activity locations

## Features

### 1. Flexible Entity Creation
When creating or editing entities, you can now select any existing entity as a parent, regardless of type.

### 2. New Hierarchy View
A new "Hierarchy View" tab provides a flexible way to explore all entities and their relationships:
- View all entities in a grid layout
- Filter by parent entity
- See parent-child relationships clearly displayed

### 3. Enhanced Dashboard Views
The existing dashboard views (Regional, National, Global) continue to work but now support the flexible hierarchy:
- Regional View: Shows sites under any parent entity
- National View: Shows regions under any parent entity  
- Global View: Shows national entities under any parent entity

## Usage Examples

### Example 1: Site under Global
You can now create a site that reports directly to a global entity:
```
Site: "Downtown Office" (site)
Parent: "Global Corp" (global)
```

### Example 2: Region under Site
You can create a region that reports to a site:
```
Region: "North Division" (region)  
Parent: "Main Campus" (site)
```

### Example 3: National under Region
You can create a national entity under a region:
```
National: "US Operations" (national)
Parent: "North America" (region)
```

## Benefits

1. **Maximum Flexibility**: Organize your hierarchy in any way that makes sense for your organization
2. **Real-world Scenarios**: Support complex organizational structures that don't fit rigid hierarchies
3. **Future-proof**: Easy to adapt as organizational needs change
4. **User-friendly**: Simple interface that doesn't restrict creative organizational design

## Technical Implementation

### Code Changes

1. **EntityForm.jsx**: Updated `parentCandidates` logic to allow any entity as parent
2. **Sites.jsx**: Added new "Hierarchy View" tab and updated descriptions
3. **Removed restrictions**: No more type-based filtering of parent candidates

### Database Schema
The existing database schema supports this flexibility without changes:
- `parent_id` field allows any entity ID
- Foreign key constraints ensure data integrity
- Self-referencing is prevented at the application level

## Testing

Run the test script to verify the flexible hierarchy functionality:
```bash
node test-flexible-hierarchy.js
```

This will show:
- Current hierarchy structure
- All parent-child relationships
- Validation of flexible rules
- Dashboard data analysis

## Migration Notes

- Existing data is automatically compatible
- No database migration required
- All existing parent-child relationships are preserved
- New flexible relationships can be created immediately

## Future Enhancements

Potential future improvements:
- Visual hierarchy tree view
- Drag-and-drop hierarchy editing
- Bulk hierarchy operations
- Advanced filtering and search
- Hierarchy validation rules (optional)
- Export/import hierarchy structures 