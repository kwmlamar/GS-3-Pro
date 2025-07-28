// Simple test to check entity staff data
// Copy and paste this into browser console

const testEntityStaffQuery = async () => {
  console.log('🧪 Testing entity staff queries...');
  
  try {
    // 1. Check if we have any sites
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('id, name')
      .limit(3);
    
    console.log('📍 Sites found:', sites);
    
    if (!sites || sites.length === 0) {
      console.log('❌ No sites found!');
      return;
    }
    
    const testSite = sites[0];
    console.log('🎯 Testing with site:', testSite);
    
    // 2. Check entity_staff_entities table
    const { data: entityStaffEntities, error: entityStaffEntitiesError } = await supabase
      .from('entity_staff_entities')
      .select('*')
      .eq('site_id', testSite.id);
    
    console.log('🔗 Entity staff entities for site:', entityStaffEntities);
    console.log('🔗 Entity staff entities error:', entityStaffEntitiesError);
    
    // 3. Check entity_staff table
    const { data: allEntityStaff, error: allEntityStaffError } = await supabase
      .from('entity_staff')
      .select('id, first_name, last_name, site')
      .limit(5);
    
    console.log('👥 All entity staff:', allEntityStaff);
    console.log('👥 All entity staff error:', allEntityStaffError);
    
    // 4. Test the exact query from the dialog
    const { data: entityStaffViaRelationships, error: entityStaffViaRelationshipsError } = await supabase
      .from('entity_staff_entities')
      .select(`
        entity_staff_id,
        is_primary,
        entity_staff (
          id,
          first_name,
          last_name,
          email,
          phone,
          position
        )
      `)
      .eq('site_id', testSite.id);
    
    console.log('🎯 Entity staff via relationships query:', entityStaffViaRelationships);
    console.log('🎯 Entity staff via relationships error:', entityStaffViaRelationshipsError);
    
    // 5. Test legacy query
    const { data: entityStaffViaLegacy, error: entityStaffViaLegacyError } = await supabase
      .from('entity_staff')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        position
      `)
      .eq('site', testSite.name);
    
    console.log('🎯 Entity staff via legacy query:', entityStaffViaLegacy);
    console.log('🎯 Entity staff via legacy error:', entityStaffViaLegacyError);
    
    console.log('📋 SUMMARY:');
    console.log(`- Sites: ${sites.length}`);
    console.log(`- Entity staff entities for ${testSite.name}: ${entityStaffEntities?.length || 0}`);
    console.log(`- Total entity staff: ${allEntityStaff?.length || 0}`);
    console.log(`- Via relationships for ${testSite.name}: ${entityStaffViaRelationships?.length || 0}`);
    console.log(`- Via legacy for ${testSite.name}: ${entityStaffViaLegacy?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testEntityStaffQuery(); 