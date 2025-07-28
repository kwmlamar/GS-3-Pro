// Test script for SecurityStaffForm functionality
import { createSecurityStaff, getSecurityStaff, updateSecurityStaff } from './src/lib/securityStaffService.js';

async function testSecurityStaffForm() {
  console.log('Testing SecurityStaffForm functionality...');

  try {
    // Test creating a new security staff member
    const newSecurityStaff = {
      first_name: 'John',
      last_name: 'Doe',
      employee_id: 'SEC001',
      security_company_id: 1,
      position: 'Security Officer',
      status: 'Active',
      hire_date: '2024-01-15',
      email: 'john.doe@security.com',
      phone: '+1-555-0101',
      compliance_score: 95,
      background_check_status: 'Approved',
      drug_test_status: 'Passed',
      certifications: ['Basic Security', 'First Aid', 'CPR'],
      entities: [1, 2] // Assuming sites with IDs 1 and 2 exist
    };

    console.log('Creating new security staff member...');
    const createResult = await createSecurityStaff(newSecurityStaff);
    
    if (createResult.error) {
      console.error('Error creating security staff:', createResult.error);
      return;
    }

    console.log('Security staff created successfully:', createResult.data);

    // Test fetching all security staff
    console.log('Fetching all security staff...');
    const fetchResult = await getSecurityStaff();
    
    if (fetchResult.error) {
      console.error('Error fetching security staff:', fetchResult.error);
      return;
    }

    console.log('Security staff fetched successfully:', fetchResult.data);

    // Test updating security staff
    if (createResult.data) {
      console.log('Updating security staff member...');
      const updateData = {
        ...newSecurityStaff,
        compliance_score: 98,
        performance_rating: 4.5
      };

      const updateResult = await updateSecurityStaff(createResult.data.id, updateData);
      
      if (updateResult.error) {
        console.error('Error updating security staff:', updateResult.error);
        return;
      }

      console.log('Security staff updated successfully:', updateResult.data);
    }

    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSecurityStaffForm(); 