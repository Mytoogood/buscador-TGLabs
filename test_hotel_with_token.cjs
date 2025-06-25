// Test hotel availability with working authentication
const https = require('https');
const querystring = require('querystring');

// Function to get authentication token
async function getAuthToken() {
  return new Promise((resolve, reject) => {
    const authData = {
      grant_type: 'password',
      username: 'TooGood', 
      password: '23a01acf223df93bbd08843a27d1fe7a873321ed13e4268a0a09aca9e92cc4c7'
    };

    const postData = querystring.stringify(authData);

    const options = {
      hostname: 'api.moblix.com.br',
      port: 443,
      path: '/api/Token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'externo',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.access_token) {
            console.log('✅ Authentication successful');
            resolve(response.access_token);
          } else {
            reject(new Error('Authentication failed: ' + JSON.stringify(response)));
          }
        } catch (error) {
          reject(new Error('Invalid response: ' + data));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Function to test hotel availability
async function testHotelAvailability(token) {
  return new Promise((resolve, reject) => {
    // Parameters exactly as in your browser error
    const params = {
      Checkin: '2025-06-26',
      Checkout: '2025-06-27',
      Rooms: '{"Adts":2,"ChildAge":[]}',
      Currency: 'BRL:1'
    };

    const queryParams = new URLSearchParams(params).toString();
    const path = `/hotel/api/Availability?${queryParams}`;

    console.log('🏨 Testing hotel availability...');
    console.log('📍 URL:', `https://api.moblix.com.br${path}`);

    const options = {
      hostname: 'api.moblix.com.br',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Origin': 'externo'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`📊 Status Code: ${res.statusCode}`);
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (data.trim() === '') {
            console.log('⚠️ Empty response received');
            resolve({ empty: true, status: res.statusCode });
            return;
          }

          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ Hotel availability request successful');
            console.log('📋 Response structure:', {
              success: response.Success,
              dataCount: response.Data ? response.Data.length : 0,
              message: response.MensagemErro || 'None'
            });
            resolve(response);
          } else {
            console.log('❌ Hotel availability request failed');
            console.log('📄 Error response:', response);
            reject(new Error(`HTTP ${res.statusCode}: ${response.MensagemErro || 'Unknown error'}`));
          }
        } catch (error) {
          console.log('❌ Invalid JSON response:', data);
          reject(new Error('Invalid response: ' + data));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to test alternative parameter formats
async function testAlternativeFormats(token) {
  const alternatives = [
    {
      name: 'Simple Adults parameter',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Adults: '2',
        Currency: 'BRL'
      }
    },
    {
      name: 'Different rooms format',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Rooms: '[{"Adults":2,"Children":[]}]',
        Currency: 'BRL'
      }
    }
  ];

  for (const alt of alternatives) {
    try {
      console.log(`\n📝 Testing ${alt.name}...`);
      
      const result = await new Promise((resolve, reject) => {
        const queryParams = new URLSearchParams(alt.params).toString();
        const path = `/hotel/api/Availability?${queryParams}`;

        const options = {
          hostname: 'api.moblix.com.br',
          port: 443,
          path: path,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Origin': 'externo'
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              const response = data.trim() ? JSON.parse(data) : { empty: true };
              resolve({ status: res.statusCode, data: response });
            } catch (error) {
              resolve({ status: res.statusCode, data: data, parseError: true });
            }
          });
        });

        req.on('error', reject);
        req.end();
      });

      console.log(`📊 ${alt.name} - Status: ${result.status}`);
      if (result.status === 200) {
        console.log(`✅ Success! Hotels found: ${result.data.Data ? result.data.Data.length : 0}`);
        return result.data;
      } else {
        console.log(`❌ Failed: ${result.data.MensagemErro || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${alt.name} - Error: ${error.message}`);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting hotel availability test...\n');
    
    const token = await getAuthToken();
    
    try {
      await testHotelAvailability(token);
    } catch (error) {
      console.log('\n⚠️ Original format failed, trying alternatives...');
      await testAlternativeFormats(token);
    }
    
    console.log('\n🎉 Test completed!');
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  }
}

main();
