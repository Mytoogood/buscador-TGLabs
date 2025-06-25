import axios from 'axios';

// API Configuration
const API_BASE_URL = 'https://api.moblix.com.br';
const TOKEN_ENDPOINT = '/api/Token';

// Credentials
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

// Function to get authentication token
async function getAuthToken() {
  try {
    console.log('🔑 Requesting authentication token...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', CREDENTIALS.username);
    formData.append('password', CREDENTIALS.password);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}${TOKEN_ENDPOINT}`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.access_token) {
      console.log('✅ Authentication successful');
      console.log(`Token type: ${response.data.token_type}`);
      console.log(`Expires in: ${response.data.expires_in} seconds`);
      return response.data.access_token;
    } else {
      throw new Error('No access token in response');
    }
  } catch (error) {
    console.error('❌ Authentication failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw error;
  }
}

// Function to test hotel availability
async function testHotelAvailability(token) {
  try {
    console.log('\n🏨 Testing hotel availability endpoint...');
    
    // Test parameters - same as in your URL
    const params = {
      Checkin: '2025-06-26',
      Checkout: '2025-06-27',
      Rooms: JSON.stringify({"Adts": 2, "ChildAge": []}),
      Currency: 'BRL:1'
    };

    console.log('Parameters:', params);

    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/hotel/api/Availability`,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Hotel availability request successful');
    console.log('Response status:', response.status);
    console.log('Response data structure:', {
      success: response.data?.Success,
      dataLength: response.data?.Data?.length || 0,
      errorMessage: response.data?.MensagemErro || 'None'
    });

    return response.data;
  } catch (error) {
    console.error('❌ Hotel availability request failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    // Log the full URL that was attempted
    console.error('Failed URL:', error.config?.url);
    console.error('Failed params:', error.config?.params);
    
    throw error;
  }
}

// Function to test with different parameter formats
async function testDifferentParameterFormats(token) {
  console.log('\n🔄 Testing different parameter formats...');
  
  const testCases = [
    {
      name: 'Format 1: Simple Adults parameter',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Adults: 2,
        Currency: 'BRL'
      }
    },
    {
      name: 'Format 2: Rooms as encoded JSON',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Rooms: encodeURIComponent(JSON.stringify({"Adts": 2, "ChildAge": []})),
        Currency: 'BRL'
      }
    },
    {
      name: 'Format 3: Currency without :1',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Adults: 2,
        Currency: 'BRL'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n📝 Testing ${testCase.name}...`);
      console.log('Parameters:', testCase.params);
      
      const response = await axios({
        method: 'GET',
        url: `${API_BASE_URL}/hotel/api/Availability`,
        params: testCase.params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      console.log(`✅ ${testCase.name} - Success!`);
      console.log('Response:', {
        status: response.status,
        success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0
      });
      
      return response.data; // Return on first success
    } catch (error) {
      console.error(`❌ ${testCase.name} - Failed:`, {
        status: error.response?.status,
        message: error.response?.data?.MensagemErro || error.message
      });
    }
  }
}

// Main test function
async function main() {
  try {
    console.log('🚀 Starting Moblix API debug session...\n');
    
    // Step 1: Get authentication token
    const token = await getAuthToken();
    
    // Step 2: Test hotel availability with original parameters
    try {
      await testHotelAvailability(token);
    } catch (error) {
      console.log('\n⚠️  Original format failed, trying alternative formats...');
      
      // Step 3: Try different parameter formats
      await testDifferentParameterFormats(token);
    }
    
    console.log('\n🎉 Debug session completed!');
  } catch (error) {
    console.error('\n💥 Debug session failed:', error.message);
    process.exit(1);
  }
}

// Run the debug session
main();
