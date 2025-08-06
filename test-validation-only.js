// Test validation logic without dependencies
function validateEntityStaffData(data) {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.role || data.role.trim().length === 0) {
    errors.push('Role is required');
  }

  if (data.compliance !== undefined && (data.compliance < 0 || data.compliance > 100)) {
    errors.push('Compliance must be between 0 and 100');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Test form data scenarios
const testCases = [
  {
    name: 'Empty form data',
    data: {
      name: '',
      role: '',
      type: 'Standard Officer',
      site: '',
      status: 'Active',
      compliance: 100,
      certifications: '',
      email: '',
      phone: '',
      hire_date: new Date().toISOString().split('T')[0],
      department_id: null,
      supervisor_id: null,
      notes: ''
    }
  },
  {
    name: 'Valid form data',
    data: {
      name: 'John Doe',
      role: 'Security Officer',
      type: 'Standard Officer',
      site: 'Test Site',
      status: 'Active',
      compliance: 100,
      certifications: 'Basic Security, First Aid',
      email: 'john.doe@test.com',
      phone: '123-456-7890',
      hire_date: new Date().toISOString().split('T')[0],
      department_id: null,
      supervisor_id: null,
      notes: 'Test employee'
    }
  },
  {
    name: 'Missing name',
    data: {
      name: '',
      role: 'Security Officer',
      type: 'Standard Officer',
      site: 'Test Site',
      status: 'Active',
      compliance: 100,
      certifications: '',
      email: 'john.doe@test.com',
      phone: '123-456-7890',
      hire_date: new Date().toISOString().split('T')[0],
      department_id: null,
      supervisor_id: null,
      notes: ''
    }
  },
  {
    name: 'Missing role',
    data: {
      name: 'John Doe',
      role: '',
      type: 'Standard Officer',
      site: 'Test Site',
      status: 'Active',
      compliance: 100,
      certifications: '',
      email: 'john.doe@test.com',
      phone: '123-456-7890',
      hire_date: new Date().toISOString().split('T')[0],
      department_id: null,
      supervisor_id: null,
      notes: ''
    }
  }
];

console.log('Testing form validation scenarios...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log('Form data:', testCase.data);
  
  const validation = validateEntityStaffData(testCase.data);
  console.log('Validation result:', validation);
  
  if (validation.isValid) {
    console.log('✅ Validation passed');
  } else {
    console.log('❌ Validation failed:', validation.errors);
  }
  
  console.log('---\n');
}); 