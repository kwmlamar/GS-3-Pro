# Role-Based Dashboard Implementation Guide

## Overview

This guide explains how to implement separate dashboard views based on user roles (admin, supervisor, client_poc, etc.) in the GS-3 SecureOps Pro application.

## What Was Implemented

### 1. Role Service (`src/lib/roleService.js`)

**Key Features:**
- **Role Definitions**: Centralized role constants and hierarchy
- **Dashboard Configurations**: Role-specific dashboard layouts and features
- **Permission System**: Hierarchical permission checking
- **Role-Specific Data**: Customized statistics and activities for each role

**Available Roles:**
- `admin` - Complete system oversight
- `executive` - Strategic overview
- `operations_manager` - Operational management
- `supervisor` - Team management
- `consultant` - Advisory services
- `hybrid_employee` - Personal overview
- `client_poc` - Client portal access

### 2. Role-Specific Dashboard Components

#### Admin Dashboard (`src/components/dashboards/AdminDashboard.jsx`)
- **Features**: System monitoring, security alerts, administrative actions
- **Stats**: Sites, regions, officers, alerts, compliance, security status
- **Actions**: System settings, user management, developer portal, analytics
- **Widgets**: Security monitoring, system status, performance metrics

#### Supervisor Dashboard (`src/components/dashboards/SupervisorDashboard.jsx`)
- **Features**: Team management, performance tracking, scheduling
- **Stats**: Team members, alerts, compliance, scheduling, reports
- **Actions**: Team management, assessments, performance reviews
- **Widgets**: Team metrics, performance overview, quick actions

#### Client Dashboard (`src/components/dashboards/ClientDashboard.jsx`)
- **Features**: Service delivery, training access, support
- **Stats**: Facilities, officers, compliance, reports, training
- **Actions**: Service reports, training portal, support contact
- **Widgets**: Service quality, performance metrics, status alerts

### 3. Updated Main Dashboard (`src/pages/Dashboard.jsx`)

**Changes Made:**
- Integrated role service for data fetching
- Added role-specific dashboard routing
- Implemented role-based configuration loading
- Maintained backward compatibility

## How to Use

### 1. Setting User Roles

Users are assigned roles through the authentication system. The role determines which dashboard they see:

```javascript
// In App.jsx or authentication service
const [userRole, setUserRole] = useState('admin'); // or other roles
```

### 2. Adding New Roles

To add a new role:

1. **Define the role in `roleService.js`:**
```javascript
export const ROLES = {
  // ... existing roles
  NEW_ROLE: 'new_role'
};
```

2. **Add to hierarchy:**
```javascript
export const ROLE_HIERARCHY = {
  // ... existing roles
  [ROLES.NEW_ROLE]: 3 // Set appropriate level
};
```

3. **Create dashboard configuration:**
```javascript
export const ROLE_DASHBOARDS = {
  [ROLES.NEW_ROLE]: {
    title: 'New Role Dashboard',
    description: 'Description of the dashboard',
    stats: [
      // Define role-specific statistics
    ],
    quickActions: [
      // Define role-specific actions
    ],
    widgets: [
      // Define role-specific widgets
    ]
  }
};
```

4. **Create dashboard component:**
```javascript
// src/components/dashboards/NewRoleDashboard.jsx
const NewRoleDashboard = ({ userRole, userName }) => {
  // Implement role-specific dashboard
};
```

5. **Add to main Dashboard routing:**
```javascript
// In Dashboard.jsx
if (userRole === ROLES.NEW_ROLE) {
  return <NewRoleDashboard userRole={userRole} userName={userName} />;
}
```

### 3. Customizing Role Data

#### Statistics
Modify `getRoleStats()` in `roleService.js` to return role-specific data:

```javascript
case ROLES.YOUR_ROLE:
  // Fetch and return role-specific statistics
  stats.push(
    { id: 'custom_stat', value: '42' },
    { id: 'another_stat', value: '85%' }
  );
  break;
```

#### Activities
Modify `getRoleActivities()` to filter activities by role:

```javascript
if (userRole === ROLES.YOUR_ROLE) {
  query = query.eq('type', 'your_role_specific_activity');
}
```

### 4. Adding Role-Specific Features

#### Quick Actions
Add role-specific actions in the dashboard configuration:

```javascript
quickActions: [
  { label: "Custom Action", icon: CustomIcon, path: "/custom-path", color: "bg-blue-600" }
]
```

#### Widgets
Create custom widgets for specific roles:

```javascript
widgets: ['recentActivities', 'customWidget', 'roleSpecificMetrics']
```

## Database Considerations

### 1. User Roles Table
Ensure your users table has a role column:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id),
  full_name TEXT,
  role TEXT DEFAULT 'hybrid_employee',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Role-Based Permissions
Consider implementing a permissions table for granular access control:

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Considerations

### 1. Role Validation
Always validate roles on both client and server side:

```javascript
// Client-side validation
const hasPermission = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};
```

### 2. Server-Side Authorization
Implement server-side role checks in your API endpoints:

```javascript
// Example middleware
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!hasPermission(userRole, requiredRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

## Testing

### 1. Role Switching
For development, you can temporarily switch roles in `App.jsx`:

```javascript
const [userRole, setUserRole] = useState('admin'); // Change to test different roles
```

### 2. Testing Different Dashboards
- Set different roles to see various dashboard layouts
- Verify role-specific features are accessible
- Test permission restrictions

## Future Enhancements

### 1. Dynamic Dashboard Configuration
Consider making dashboard configurations database-driven for easier management.

### 2. Role-Based Navigation
Extend the sidebar navigation to be role-specific as well.

### 3. Advanced Permissions
Implement more granular permission systems for specific features.

### 4. Dashboard Customization
Allow users to customize their dashboard layout within their role constraints.

## Troubleshooting

### Common Issues

1. **Dashboard not loading**: Check if the role is properly defined in `ROLES`
2. **Missing features**: Verify the role has the required permissions
3. **Data not loading**: Check the `getRoleStats()` and `getRoleActivities()` functions
4. **Navigation issues**: Ensure role-specific routes are properly configured

### Debug Tips

1. **Console logging**: Add console.log to see which role is being used
2. **Role checking**: Use the browser console to test `hasPermission()` function
3. **Data verification**: Check if role-specific data is being fetched correctly

## Conclusion

This implementation provides a flexible, scalable role-based dashboard system that can be easily extended for new roles and features. The modular approach allows for easy maintenance and customization while maintaining security and performance. 