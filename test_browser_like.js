import axios from 'axios';

async function testBrowserLikeAuth() {
    console.log('🚀 Testing Moblix API with browser-like behavior...\n');
    
    try {
        console.log('🔑 Attempting authentication with browser-like headers...');
        
        // Simular exatamente o comportamento do navegador
        const authData = new URLSearchParams({
            grant_type: 'password',
            username: 'felipetech88@gmail.com',
            password: '12345678'
        });

        const response = await axios({
            method: 'POST',
            url: 'https://api.moblix.com.br/api/Token',
            data: authData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            timeout: 30000,
            validateStatus: function (status) {
                return status < 600; // Não rejeitar automaticamente para status 4xx/5xx
            }
        });

        if (response.status === 200 && response.data.access_token) {
            console.log('✅ Authentication successful!');
            console.log('📝 Token type:', response.data.token_type);
            console.log('⏰ Expires in:', response.data.expires_in, 'seconds');
            
            // Agora vamos testar uma chamada de disponibilidade
            console.log('\n🏨 Testing hotel availability...');
            
            const hotelResponse = await axios({
                method: 'GET',
                url: 'https://api.moblix.com.br/hotel/api/Availability',
                params: {
                    IdLocation: 6848, // ID específico da documentação
                    Checkin: '2025-01-20',
                    Checkout: '2025-01-22', 
                    Rooms: JSON.stringify({"Adts": 2, "ChildAge": []}),
                    Currency: 'BRL'
                },
                headers: {
                    'Authorization': `Bearer ${response.data.access_token}`,
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                timeout: 30000,
                validateStatus: function (status) {
                    return status < 600;
                }
            });

            if (hotelResponse.status === 200) {
                console.log('✅ Hotel availability request successful!');
                console.log('📊 Found', hotelResponse.data.length, 'hotels');
                if (hotelResponse.data.length > 0) {
                    console.log('🏨 First hotel:', hotelResponse.data[0].Name);
                    console.log('💰 Price:', hotelResponse.data[0].Price);
                }
            } else {
                console.log('❌ Hotel availability request failed:', {
                    status: hotelResponse.status,
                    statusText: hotelResponse.statusText,
                    data: hotelResponse.data
                });
            }
            
        } else {
            console.log('❌ Authentication failed:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            });
        }

    } catch (error) {
        console.log('💥 Error occurred:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
}

testBrowserLikeAuth();
