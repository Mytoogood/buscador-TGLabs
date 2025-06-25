// Test simplified hotel availability parameters
const https = require('https');
const querystring = require('querystring');

// Get auth token first
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

// Test with super simplified parameters
async function testSimplifiedHotelAPI(token) {
  const testCases = [
    {
      name: 'Ultra Simple - Only essentials',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Adults: '2',
        Currency: 'BRL'
      }
    },
    {
      name: 'With location ID',
      params: {
        Checkin: '2025-06-26',
        Checkout: '2025-06-27',
        Adults: '2',
        Currency: 'BRL',
        IdLocation: '123'  // Test with a simple ID
      }
    },
    {
      name: 'Alternative format',
      params: {
        CheckinDate: '2025-06-26',
        CheckoutDate: '2025-06-27',
        AdultsCount: '2',
        CurrencyCode: 'BRL'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      console.log('Parameters:', testCase.params);
      
      const result = await new Promise((resolve, reject) => {
        const queryParams = new URLSearchParams(testCase.params).toString();
        const path = `/hotel/api/Availability?${queryParams}`;

        console.log('Full URL:', `https://api.moblix.com.br${path}`);

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
          console.log(`Status: ${res.statusCode}`);
          
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            resolve({ 
              status: res.statusCode, 
              data: data,
              headers: res.headers
            });
          });
        });

        req.on('error', reject);
        req.end();
      });

      if (result.status === 200) {
        try {
          const jsonData = JSON.parse(result.data);
          console.log(`✅ SUCCESS: ${testCase.name}`);
          console.log('Response:', {
            success: jsonData.Success,
            dataCount: jsonData.Data ? jsonData.Data.length : 0,
            message: jsonData.MensagemErro || 'None'
          });
          return jsonData; // Return on first success
        } catch (parseError) {
          console.log(`📋 Raw response: ${result.data.substring(0, 200)}...`);
        }
      } else {
        console.log(`❌ FAILED: ${testCase.name} - Status: ${result.status}`);
        console.log(`Response: ${result.data.substring(0, 500)}`);
      }
    } catch (error) {
      console.log(`💥 ERROR: ${testCase.name} - ${error.message}`);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Testing simplified hotel API parameters...\n');
    
    const token = await getAuthToken();
    await testSimplifiedHotelAPI(token);
    
    console.log('\n🎉 Test completed!');
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  }
}

main();
