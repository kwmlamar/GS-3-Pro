# Training Database Setup Guide

This guide will help you connect the Training page to your Supabase database to show real data.

## 🚀 Quick Setup

### 1. Database Configuration

Create a `.env.local` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema Setup

Run the SQL commands from `create-training-tables.sql` in your Supabase SQL editor. This will create:

- **training_courses** - Stores training course information
- **training_enrollments** - Tracks employee enrollments in courses
- **certificates** - Certificate templates and types
- **certificate_issuances** - Records of issued certificates

### 3. Sample Data

The SQL script includes sample data:
- 6 training courses (Basic Security, Advanced Threat Assessment, etc.)
- 5 certificate types (Security Officer, Firearms, First Aid, etc.)
- Sample enrollments and certificate issuances

## 📊 Features Added

### Real-time Data Loading
- Training courses loaded from database
- Certificate information from database
- Live statistics and analytics
- Search functionality across courses

### Enhanced UI
- Loading states while fetching data
- Error handling with user-friendly messages
- Empty states when no data is available
- Real-time statistics dashboard

### Database Integration
- Complete CRUD operations for training data
- Relationship management between courses, employees, and certificates
- Analytics and reporting capabilities
- Search and filtering functionality

## 🔧 Technical Implementation

### Database Tables

#### training_courses
```sql
- id (BIGSERIAL PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- type (VARCHAR) - Core Training, Specialized, Management
- duration_hours (INTEGER)
- status (VARCHAR) - Active, Inactive
- created_by (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

#### training_enrollments
```sql
- id (BIGSERIAL PRIMARY KEY)
- course_id (BIGINT REFERENCES training_courses)
- employee_id (BIGINT REFERENCES employees)
- enrollment_date (TIMESTAMP)
- completion_date (TIMESTAMP)
- status (VARCHAR) - Enrolled, In Progress, Completed
- progress_percentage (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

#### certificates
```sql
- id (BIGSERIAL PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- template_name (VARCHAR)
- validity_months (INTEGER)
- created_at, updated_at (TIMESTAMP)
```

#### certificate_issuances
```sql
- id (BIGSERIAL PRIMARY KEY)
- certificate_id (BIGINT REFERENCES certificates)
- employee_id (BIGINT REFERENCES employees)
- issued_date (TIMESTAMP)
- expiry_date (TIMESTAMP)
- status (VARCHAR) - Valid, Expired
- issued_by (VARCHAR)
- created_at, updated_at (TIMESTAMP)
```

### Service Layer

The `src/lib/trainingService.js` provides:

- **Course Management**: CRUD operations for training courses
- **Enrollment Tracking**: Manage employee enrollments and progress
- **Certificate Management**: Handle certificate templates and issuances
- **Analytics**: Get training statistics and completion rates
- **Search**: Find courses by title, description, or type

### UI Components

The updated Training page includes:

- **Real-time Statistics**: Live dashboard with training metrics
- **Course Listings**: Dynamic course display with real data
- **Certificate Management**: Certificate templates and issuances
- **Search Functionality**: Real-time search across courses
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Graceful error messages

## 🎯 Next Steps

Once the database is set up, you can:

1. **Add New Courses**: Use the "Create Course" button (when implemented)
2. **Manage Enrollments**: Track employee progress through courses
3. **Issue Certificates**: Generate and manage employee certifications
4. **View Analytics**: Monitor training completion rates and statistics
5. **Search Courses**: Find specific training programs quickly

## 🔍 Testing

To verify the setup:

1. Navigate to the Training page in your application
2. Check that courses are loading from the database
3. Verify that statistics are showing real numbers
4. Test the search functionality
5. Ensure certificates are displaying correctly

## 🛠️ Troubleshooting

### Common Issues

**No data showing**: Ensure your Supabase credentials are correct and the tables exist
**Connection errors**: Check your `.env.local` file and network connection
**Missing tables**: Run the SQL commands from `create-training-tables.sql`

### Debug Mode

Check the browser console for any error messages related to:
- Database connection issues
- Missing environment variables
- SQL query errors

## 📈 Future Enhancements

The training system is designed to be extensible for:

- **Advanced Analytics**: Detailed reporting and insights
- **Course Creation**: Full course management interface
- **Certificate Builder**: Visual certificate template editor
- **Progress Tracking**: Detailed employee progress monitoring
- **Automated Notifications**: Expiry reminders and completion alerts

---

**Note**: The training page now shows real data from your database. Make sure to set up your Supabase credentials and run the SQL setup commands to see the full functionality in action! 