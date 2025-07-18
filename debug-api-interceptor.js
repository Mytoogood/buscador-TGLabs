// Enhanced API Interceptor for Flight Search Debugging
// This script intercepts API calls and provides detailed analysis of price inconsistencies

(function() {
    'use strict';
    
    // Storage for API calls and results
    window.flightDebugData = {
        apiCalls: [],
        searchResults: [],
        priceAnalysis: []
    };
    
    console.log('🔍 Flight Debug API Interceptor initialized');
    console.log('📊 Access data via window.flightDebugData');
    
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};
        
        // Only intercept Moblix API calls
        if (url && (url.includes('moblix') || url.includes('api'))) {
            const requestData = {
                url: url,
                method: options.method || 'GET',
                timestamp: new Date().toISOString(),
                requestId: Date.now() + Math.random()
            };
            
            // Try to parse request body if present
            if (options.body) {
                try {
                    requestData.requestBody = JSON.parse(options.body);
                } catch (e) {
                    requestData.requestBody = options.body;
                }
            }
            
            console.log('🚀 API Request:', requestData);
            
            return originalFetch.apply(this, args)
                .then(response => {
                    const clonedResponse = response.clone();
                    
                    // Process response
                    clonedResponse.json().then(data => {
                        const responseData = {
                            ...requestData,
                            status: response.status,
                            responseData: data,
                            responseTime: new Date().toISOString()
                        };
                        
                        window.flightDebugData.apiCalls.push(responseData);
                        
                        // Analyze flight data if present
                        if (data && (data.flights || data.data || Array.isArray(data))) {
                            analyzeFlightResponse(responseData);
                        }
                        
                        console.log('📥 API Response:', responseData);
                        
                    }).catch(e => {
                        console.error('Error parsing response:', e);
                    });
                    
                    return response;
                })
                .catch(error => {
                    console.error('🚨 API Error:', error);
                    return Promise.reject(error);
                });
        }
        
        return originalFetch.apply(this, args);
    };
    
    // Analyze flight response data
    function analyzeFlightResponse(responseData) {
        const data = responseData.responseData;
        let flights = [];
        
        // Extract flights from different possible structures
        if (data.flights) {
            flights = data.flights;
        } else if (data.data) {
            flights = Array.isArray(data.data) ? data.data : [data.data];
        } else if (Array.isArray(data)) {
            flights = data;
        }
        
        const analysis = {
            requestId: responseData.requestId,
            timestamp: responseData.timestamp,
            totalFlights: flights.length,
            priceStats: {},
            companies: new Set(),
            priceFields: new Set(),
            flightDetails: []
        };
        
        // Analyze each flight
        flights.forEach((flight, index) => {
            const flightAnalysis = {
                index: index,
                company: extractCompanyName(flight),
                prices: extractAllPrices(flight),
                segments: extractFlightSegments(flight),
                raw: flight
            };
            
            analysis.flightDetails.push(flightAnalysis);
            analysis.companies.add(flightAnalysis.company);
            
            // Track all price fields found
            Object.keys(flightAnalysis.prices).forEach(field => {
                analysis.priceFields.add(field);
            });
        });
        
        // Calculate price statistics
        const allPrices = flights.map(flight => {
            const prices = extractAllPrices(flight);
            return prices.valorTotalComTaxa || prices.valorTotal || prices.valorAdulto || 0;
        }).filter(price => price > 0);
        
        if (allPrices.length > 0) {
            analysis.priceStats = {
                min: Math.min(...allPrices),
                max: Math.max(...allPrices),
                avg: allPrices.reduce((a, b) => a + b, 0) / allPrices.length,
                count: allPrices.length,
                values: allPrices.sort((a, b) => a - b)
            };
        }
        
        analysis.companies = Array.from(analysis.companies);
        analysis.priceFields = Array.from(analysis.priceFields);
        
        window.flightDebugData.priceAnalysis.push(analysis);
        
        console.log('📊 Flight Analysis:', analysis);
        
        // Compare with previous searches if available
        if (window.flightDebugData.priceAnalysis.length > 1) {
            compareSearchResults();
        }
    }
    
    // Extract company name from flight data
    function extractCompanyName(flight) {
        return flight.companhia || 
               flight.airline || 
               flight.company || 
               flight.operatingCarrier || 
               flight.carrier || 
               'Unknown';
    }
    
    // Extract all price-related fields
    function extractAllPrices(flight) {
        const prices = {};
        
        // Common price fields
        const priceFields = [
            'valorTotalComTaxa', 'valorTotal', 'valorAdulto', 'valorCrianca', 'valorBebe',
            'price', 'priceWithTax', 'totalPrice', 'basePrice', 'totalFare',
            'ValorTotalComTaxa', 'ValorTotal', 'ValorAdulto', 'ValorCrianca', 'ValorBebe'
        ];
        
        priceFields.forEach(field => {
            if (flight[field] !== undefined && flight[field] !== null) {
                prices[field] = parseFloat(flight[field]) || 0;
            }
        });
        
        // Check tariffs array
        if (flight.tarifas && Array.isArray(flight.tarifas)) {
            flight.tarifas.forEach((tariff, index) => {
                priceFields.forEach(field => {
                    if (tariff[field] !== undefined && tariff[field] !== null) {
                        prices[`tarifas[${index}].${field}`] = parseFloat(tariff[field]) || 0;
                    }
                });
            });
        }
        
        // Check fareGroup
        if (flight.fareGroup) {
            priceFields.forEach(field => {
                if (flight.fareGroup[field] !== undefined && flight.fareGroup[field] !== null) {
                    prices[`fareGroup.${field}`] = parseFloat(flight.fareGroup[field]) || 0;
                }
            });
        }
        
        return prices;
    }
    
    // Extract flight segments information
    function extractFlightSegments(flight) {
        const segments = [];
        
        if (flight.segments && Array.isArray(flight.segments)) {
            flight.segments.forEach(segment => {
                segments.push({
                    origin: segment.origin || segment.origem,
                    destination: segment.destination || segment.destino,
                    departure: segment.departure || segment.partida,
                    arrival: segment.arrival || segment.chegada,
                    flightNumber: segment.flightNumber || segment.numeroVoo,
                    duration: segment.duration || segment.duracao
                });
            });
        }
        
        return segments;
    }
    
    // Compare search results for inconsistencies
    function compareSearchResults() {
        const analyses = window.flightDebugData.priceAnalysis;
        if (analyses.length < 2) return;
        
        const current = analyses[analyses.length - 1];
        const previous = analyses[analyses.length - 2];
        
        console.log('🔍 Comparing search results...');
        console.log('Previous search:', previous.timestamp);
        console.log('Current search:', current.timestamp);
        
        // Compare flight counts
        if (current.totalFlights !== previous.totalFlights) {
            console.warn('⚠️ Flight count changed:', {
                previous: previous.totalFlights,
                current: current.totalFlights,
                difference: current.totalFlights - previous.totalFlights
            });
        }
        
        // Compare price ranges
        if (current.priceStats.min !== previous.priceStats.min || 
            current.priceStats.max !== previous.priceStats.max) {
            console.warn('⚠️ Price range changed:', {
                previous: {
                    min: previous.priceStats.min,
                    max: previous.priceStats.max,
                    avg: previous.priceStats.avg
                },
                current: {
                    min: current.priceStats.min,
                    max: current.priceStats.max,
                    avg: current.priceStats.avg
                }
            });
        }
        
        // Compare companies
        const prevCompanies = new Set(previous.companies);
        const currCompanies = new Set(current.companies);
        const addedCompanies = [...currCompanies].filter(c => !prevCompanies.has(c));
        const removedCompanies = [...prevCompanies].filter(c => !currCompanies.has(c));
        
        if (addedCompanies.length > 0 || removedCompanies.length > 0) {
            console.warn('⚠️ Companies changed:', {
                added: addedCompanies,
                removed: removedCompanies,
                previous: previous.companies,
                current: current.companies
            });
        }
        
        // Detailed price comparison
        console.log('💰 Price comparison details:');
        console.table({
            'Previous Search': {
                'Min Price': previous.priceStats.min,
                'Max Price': previous.priceStats.max,
                'Avg Price': previous.priceStats.avg.toFixed(2),
                'Flight Count': previous.totalFlights,
                'Companies': previous.companies.join(', ')
            },
            'Current Search': {
                'Min Price': current.priceStats.min,
                'Max Price': current.priceStats.max,
                'Avg Price': current.priceStats.avg.toFixed(2),
                'Flight Count': current.totalFlights,
                'Companies': current.companies.join(', ')
            }
        });
    }
    
    // Utility functions for manual analysis
    window.flightDebugUtils = {
        // Get all API calls
        getApiCalls: () => window.flightDebugData.apiCalls,
        
        // Get all price analyses
        getPriceAnalyses: () => window.flightDebugData.priceAnalysis,
        
        // Get the latest search results
        getLatestResults: () => {
            const analyses = window.flightDebugData.priceAnalysis;
            return analyses.length > 0 ? analyses[analyses.length - 1] : null;
        },
        
        // Compare two specific searches
        compareSearches: (index1, index2) => {
            const analyses = window.flightDebugData.priceAnalysis;
            if (analyses[index1] && analyses[index2]) {
                console.log('Comparing searches:', index1, 'vs', index2);
                console.log('Search 1:', analyses[index1]);
                console.log('Search 2:', analyses[index2]);
                
                // Detailed comparison logic here
                return {
                    search1: analyses[index1],
                    search2: analyses[index2],
                    differences: {
                        flightCount: analyses[index2].totalFlights - analyses[index1].totalFlights,
                        priceRange: {
                            min: analyses[index2].priceStats.min - analyses[index1].priceStats.min,
                            max: analyses[index2].priceStats.max - analyses[index1].priceStats.max,
                            avg: analyses[index2].priceStats.avg - analyses[index1].priceStats.avg
                        }
                    }
                };
            }
            return null;
        },
        
        // Export all data for external analysis
        exportData: () => {
            const data = JSON.stringify(window.flightDebugData, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `flight-debug-data-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
        
        // Clear all debug data
        clearData: () => {
            window.flightDebugData = {
                apiCalls: [],
                searchResults: [],
                priceAnalysis: []
            };
            console.log('🧹 Debug data cleared');
        },
        
        // Get summary of all searches
        getSummary: () => {
            const analyses = window.flightDebugData.priceAnalysis;
            return analyses.map((analysis, index) => ({
                searchIndex: index,
                timestamp: analysis.timestamp,
                totalFlights: analysis.totalFlights,
                priceRange: `${analysis.priceStats.min} - ${analysis.priceStats.max}`,
                avgPrice: analysis.priceStats.avg.toFixed(2),
                companies: analysis.companies.join(', ')
            }));
        }
    };
    
    console.log('✅ Flight Debug API Interceptor ready!');
    console.log('📋 Available utilities:');
    console.log('  - flightDebugUtils.getApiCalls()');
    console.log('  - flightDebugUtils.getPriceAnalyses()');
    console.log('  - flightDebugUtils.getLatestResults()');
    console.log('  - flightDebugUtils.compareSearches(index1, index2)');
    console.log('  - flightDebugUtils.exportData()');
    console.log('  - flightDebugUtils.clearData()');
    console.log('  - flightDebugUtils.getSummary()');
    
})();
