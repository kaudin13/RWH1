// Weather API integration
export async function fetchWeatherData(lat: number, lon: number, apiKey: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Rainfall data API integration
export async function fetchRainfallData(lat: number, lon: number, apiKey: string) {
  try {
    // Using OpenWeatherMap's One Call API for historical data
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    
    // Calculate annual rainfall (mock calculation)
    const monthlyData = data.daily?.slice(0, 12) || [];
    const annualRainfall = monthlyData.reduce((sum: number, day: any) => {
      return sum + (day.rain?.['1h'] || 0);
    }, 0) * 30; // Approximate monthly total
    
    return {
      annual: Math.max(400, Math.min(2000, annualRainfall)), // Reasonable bounds
      monthly: monthlyData.map((day: any) => day.rain?.['1h'] || 0)
    };
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    // Return mock data as fallback
    return {
      annual: 800,
      monthly: [50, 40, 30, 60, 120, 200, 250, 220, 150, 80, 40, 30]
    };
  }
}

// Reverse geocoding to get address
export async function reverseGeocode(lat: number, lon: number, apiKey: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      const location = data[0];
      // Create a more detailed address
      const parts = [];
      if (location.name) parts.push(location.name);
      if (location.state) parts.push(location.state);
      if (location.country) parts.push(location.country);
      
      return parts.join(', ');
    }
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  } catch (error) {
    console.error('Error with reverse geocoding:', error);
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  }
}

// Get detailed location information
export async function getLocationDetails(lat: number, lon: number, apiKey: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      const location = data[0];
      return {
        name: location.name || 'Unknown Location',
        state: location.state || '',
        country: location.country || '',
        fullAddress: `${location.name || 'Unknown'}, ${location.state || ''}, ${location.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, ''),
        coordinates: { lat, lon }
      };
    }
    
    return {
      name: 'Unknown Location',
      state: '',
      country: '',
      fullAddress: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      coordinates: { lat, lon }
    };
  } catch (error) {
    console.error('Error getting location details:', error);
    return {
      name: 'Unknown Location',
      state: '',
      country: '',
      fullAddress: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      coordinates: { lat, lon }
    };
  }
}

// Mock roof detection API (would integrate with computer vision service)
export async function analyzeRoofImage(imageFile: File): Promise<{
  roofArea: number;
  confidence: number;
  roofType: string;
}> {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock analysis results
  const mockResults = [
    { roofArea: 120, confidence: 0.92, roofType: 'concrete' },
    { roofArea: 85, confidence: 0.88, roofType: 'tile' },
    { roofArea: 95, confidence: 0.85, roofType: 'sheet' },
    { roofArea: 150, confidence: 0.91, roofType: 'concrete' },
  ];
  
  return mockResults[Math.floor(Math.random() * mockResults.length)];
}

// Get user's current location
export function getCurrentLocation(): Promise<{lat: number; lon: number}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        // Enhanced error handling with more specific messages
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied by the user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }
        
        // Create a new error with the specific message
        const enhancedError = new Error(errorMessage);
        enhancedError.name = 'GeolocationError';
        reject(enhancedError);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}