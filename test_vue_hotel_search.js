// Test the Vue.js hotel search functionality with the fixes
import moblixApiService from './src/services/moblixApiService.js';

async function testVueHotelSearch() {
  try {
    console.log('🧪 Testing Vue.js hotel search functionality...\n');

    // Test 1: Search for location
    console.log('1. 📍 Testing location search...');
    try {
      const locations = await moblixApiService.buscarLocalizacaoHoteis('Rio de Janeiro');
      console.log('✅ Location search successful');
      console.log(`Found ${locations.length} locations`);
      
      if (locations.length > 0) {
        const firstLocation = locations[0];
        console.log('First location:', {
          label: firstLocation.Label,
          cityId: firstLocation.CityId,
          type: firstLocation.Type
        });

        // Test 2: Hotel availability search with location
        console.log('\n2. 🏨 Testing hotel availability with location...');
        const hotelParams = {
          idLocation: firstLocation.CityId,
          checkin: '2025-06-26',
          checkout: '2025-06-27',
          adults: 2,
          childrenAges: [],
          currency: 'BRL'
        };

        console.log('Hotel search parameters:', hotelParams);
        
        const hotelResults = await moblixApiService.buscarDisponibilidadeHoteis(hotelParams);
        
        if (hotelResults.Success) {
          console.log('✅ Hotel search successful');
          console.log(`Found ${hotelResults.Data?.length || 0} hotels`);
          
          if (hotelResults.Data && hotelResults.Data.length > 0) {
            const firstHotel = hotelResults.Data[0];
            console.log('First hotel:', {
              name: firstHotel.HotelName || firstHotel.Name,
              city: firstHotel.Address?.City || firstHotel.City,
              category: firstHotel.Category
            });
          }
        } else {
          console.log('⚠️ Hotel search returned false success:', hotelResults.MensagemErro);
        }
      }
    } catch (locationError) {
      console.log('❌ Location search failed:', locationError.message);
    }

    // Test 3: Hotel search without location (should fail gracefully)
    console.log('\n3. ⚠️ Testing hotel search without location...');
    try {
      const noLocationParams = {
        checkin: '2025-06-26',
        checkout: '2025-06-27',
        adults: 2,
        childrenAges: [],
        currency: 'BRL'
      };

      const noLocationResults = await moblixApiService.buscarDisponibilidadeHoteis(noLocationParams);
      console.log('Unexpected success without location:', noLocationResults);
    } catch (noLocationError) {
      console.log('✅ Expected failure without location:', noLocationError.message);
    }

    console.log('\n🎉 Vue.js hotel search test completed!');
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  }
}

// Run the test
testVueHotelSearch();
