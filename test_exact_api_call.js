import axios from 'axios';

// API Configuration exactly as shown in your error
const API_BASE_URL = 'https://api.moblix.com.br';

// Credentials
const CREDENTIALS = {
  username: 'TooGood',
  password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
};

async function getAuthToken() {
  try {
    console.log('🔑 Getting authentication token...');
    
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', CREDENTIALS.username);
    formData.append('password', CREDENTIALS.password);

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/api/Token`,
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.access_token) {
      console.log('✅ Authentication successful');
      return response.data.access_token;
    } else {
      throw new Error('No access token in response');
    }
  } catch (error) {
    console.error('❌ Authentication failed:', {
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
}

async function testExactAPICall(token) {
  try {
    console.log('🏨 Testing exact API call from browser...');
    
    // Use the exact URL from your browser error
    const url = `${API_BASE_URL}/hotel/api/Availability`;
    
    // Decode the parameters from your URL
    const decodedRooms = decodeURIComponent('%7B%22Adts%22%3A2%2C%22ChildAge%22%3A%5B%5D%7D');
    console.log('Decoded Rooms parameter:', decodedRooms);
    
    const params = {
      IdLocation: 6848, // São Paulo - required parameter
      Checkin: '2025-06-26',
      Checkout: '2025-06-27', 
      Rooms: decodedRooms, // This should be: {"Adts":2,"ChildAge":[]}
      Currency: 'BRL:1'
    };

    console.log('Making request with params:', params);
    console.log('Full URL will be:', `${url}?${new URLSearchParams(params).toString()}`);

    const response = await axios({
      method: 'GET',
      url: url,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Success! Response:', {
      status: response.status,
      success: response.data?.Success,
      dataCount: response.data?.Data?.length || 0,
      message: response.data?.MensagemErro || 'None'
    });

    return response.data;
  } catch (error) {
    console.error('❌ Failed:', {
      status: error.response?.status,
      message: error.response?.data?.MensagemErro || error.message,
      fullErrorData: error.response?.data
    });
    throw error;
  }
}

async function testAlternativeFormats(token) {
  console.log('\n🔄 Testing alternative parameter formats...');
  
  const alternatives = [
    {
      name: 'Format 1: Simple parameters',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Adults: 2,
        Currency: 'BRL'
      }
    },
    {
      name: 'Format 2: Different rooms format',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Rooms: JSON.stringify([{Adults: 2, Children: []}]),
        Currency: 'BRL'
      }
    },
    {
      name: 'Format 3: No currency suffix',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Adults: 2,
        Currency: 'BRL'
      }
    }
  ];

  for (const alt of alternatives) {
    try {
      console.log(`\n📝 Testing ${alt.name}...`);
      
      const response = await axios({
        method: 'GET',
        url: `${API_BASE_URL}/hotel/api/Availability`,
        params: alt.params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      console.log(`✅ ${alt.name} - Success!`);
      console.log('Response:', {
        status: response.status,
        success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0
      });
      
      return response.data;
    } catch (error) {
      console.error(`❌ ${alt.name} - Failed:`, {
        status: error.response?.status,
        message: error.response?.data?.MensagemErro || error.message
      });
    }
  }
}

async function main() {
  try {
    console.log('🚀 Testing Moblix API with exact browser parameters...\n');
    
    const token = await getAuthToken();
    
    try {
      await testExactAPICall(token);
    } catch (error) {
      console.log('\n⚠️ Exact format failed, trying alternatives...');
      await testAlternativeFormats(token);
    }
    
    console.log('\n🎉 Test completed!');
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  }
}

main();
