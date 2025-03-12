
import axios from 'axios';

// OpenWeatherMap API for weather data
const OPENWEATHER_API_KEY = 'replace_with_your_api_key'; // Users should replace with their own key
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// OpenTopography API for elevation data
const OPENTOPOGRAPHY_API_URL = 'https://portal.opentopography.org/API/globaldem';

// Global Forest Watch API for land use data
const GFW_API_URL = 'https://api.resourcewatch.org/v1/gfw';

// Interface definitions
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  forecast: ForecastItem[];
}

export interface ForecastItem {
  date: string;
  temperature: number;
  precipitation: number;
  description: string;
}

export interface FloodRiskData {
  riskLevel: number;
  riskCategory: string;
  rainfallPrediction: number;
  warningMessage: string | null;
}

export interface WaterBodyData {
  id: string;
  name: string;
  coordinates: [number, number];
  currentLevel: number;
  maxLevel: number;
  riskLevel: string;
  changeRate: number;
}

// City coordinates and water bodies data
const cityData = {
  bangalore: {
    coordinates: [12.9716, 77.5946],
    waterBodies: [
      { id: 'blr-1', name: 'Ulsoor Lake', coordinates: [12.9767, 77.6230], maxLevel: 100 },
      { id: 'blr-2', name: 'Bellandur Lake', coordinates: [12.9289, 77.6651], maxLevel: 100 },
      { id: 'blr-3', name: 'Hebbal Lake', coordinates: [13.0358, 77.5944], maxLevel: 100 },
    ]
  },
  mumbai: {
    coordinates: [19.0760, 72.8777],
    waterBodies: [
      { id: 'mum-1', name: 'Mithi River', coordinates: [19.0821, 72.8817], maxLevel: 100 },
      { id: 'mum-2', name: 'Powai Lake', coordinates: [19.1273, 72.9052], maxLevel: 100 },
      { id: 'mum-3', name: 'Vihar Lake', coordinates: [19.1302, 72.9061], maxLevel: 100 },
    ]
  },
  delhi: {
    coordinates: [28.6139, 77.2090],
    waterBodies: [
      { id: 'del-1', name: 'Yamuna River', coordinates: [28.6304, 77.2406], maxLevel: 100 },
      { id: 'del-2', name: 'Najafgarh Drain', coordinates: [28.6139, 77.0090], maxLevel: 100 },
      { id: 'del-3', name: 'Delhi Ridge', coordinates: [28.7041, 77.1025], maxLevel: 100 },
    ]
  }
};

// Get weather data for a city
export const getWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const coords = cityData[city as keyof typeof cityData]?.coordinates;
    if (!coords) throw new Error('City coordinates not found');

    // In a real app, this would be an actual API call:
    // const response = await axios.get(`${WEATHER_BASE_URL}/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    
    // For demo purposes, we'll simulate the API response
    // This simulates some variance based on the city for more realistic data
    const cityFactor = city === 'bangalore' ? 0.8 : city === 'mumbai' ? 1.2 : 1;
    
    // Create simulated weather data
    const mockData: WeatherData = {
      temperature: 25 + (Math.random() * 10 - 5) * cityFactor,
      humidity: 50 + (Math.random() * 30) * cityFactor,
      windSpeed: 5 + (Math.random() * 15) * cityFactor,
      precipitation: Math.random() * 100 * cityFactor,
      forecast: Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return {
          date: date.toLocaleDateString(),
          temperature: 25 + (Math.random() * 10 - 5) * cityFactor,
          precipitation: Math.random() * 100 * cityFactor,
          description: Math.random() > 0.7 ? 'Rainy' : Math.random() > 0.5 ? 'Cloudy' : 'Sunny'
        };
      })
    };

    return mockData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get flood risk data for a city
export const getFloodRiskData = async (city: string): Promise<FloodRiskData> => {
  try {
    // In a real app, this would call a ML model API or service
    // For demo, we'll simulate the flood risk based on the city
    const baseRisk = city === 'mumbai' ? 65 : city === 'bangalore' ? 40 : 30;
    const riskVariance = Math.random() * 30 - 15;
    const risk = Math.max(10, Math.min(90, baseRisk + riskVariance));
    
    let riskCategory = 'Low';
    let warningMessage = null;
    
    if (risk > 70) {
      riskCategory = 'High';
      warningMessage = 'High flood risk detected. Heavy rainfall expected in the next 24-48 hours.';
    } else if (risk > 40) {
      riskCategory = 'Moderate';
      warningMessage = risk > 60 ? 'Moderate to high flood risk. Prepare for possible water logging.' : null;
    }
    
    return {
      riskLevel: Math.round(risk),
      riskCategory,
      rainfallPrediction: Math.round(risk / 2 + Math.random() * 20),
      warningMessage
    };
  } catch (error) {
    console.error('Error calculating flood risk:', error);
    throw error;
  }
};

// Get water bodies data for a city
export const getWaterBodiesData = async (city: string): Promise<WaterBodyData[]> => {
  try {
    const cityWaterBodies = cityData[city as keyof typeof cityData]?.waterBodies;
    if (!cityWaterBodies) throw new Error('Water bodies data not found for this city');
    
    // Simulate water level data
    return cityWaterBodies.map(wb => {
      const currentLevel = Math.round(Math.random() * 80 + 20);
      const changeRate = Math.round((Math.random() * 10 - 5) * 10) / 10;
      let riskLevel = 'Low';
      
      if (currentLevel > 90) riskLevel = 'Critical';
      else if (currentLevel > 75) riskLevel = 'High';
      else if (currentLevel > 60) riskLevel = 'Moderate';
      
      return {
        id: wb.id,
        name: wb.name,
        coordinates: wb.coordinates as [number, number],
        currentLevel,
        maxLevel: wb.maxLevel,
        riskLevel,
        changeRate
      };
    });
  } catch (error) {
    console.error('Error fetching water bodies data:', error);
    throw error;
  }
};

// Get historical water level data for trend analysis
export const getWaterLevelHistory = async (city: string): Promise<any[]> => {
  try {
    // This would connect to a real data source in production
    // For demo, generate a simulated trend
    const today = new Date();
    const data = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      
      // Create some patterns in the data
      const baseLevel = city === 'mumbai' ? 65 : city === 'bangalore' ? 45 : 35;
      const trendFactor = i / 6; // Increases over time
      const randomFactor = Math.random() * 15 - 7.5;
      const seasonalFactor = Math.sin(i / 2) * 5; // Creates a wave pattern
      
      return {
        date: date.toLocaleDateString(),
        level: Math.max(10, Math.min(100, baseLevel + trendFactor * 20 + randomFactor + seasonalFactor))
      };
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching water level history:', error);
    throw error;
  }
};

// Get urban planning data - land use and flood zones
export const getUrbanPlanningData = async (city: string): Promise<any> => {
  try {
    // In a real app, this would fetch GIS data from a service
    // For demo, we'll return mock data about land use and flood zones
    
    // Simulate flood-prone areas (would be real GeoJSON in production)
    const floodZones = Array.from({ length: 3 }, (_, i) => {
      const coords = cityData[city as keyof typeof cityData]?.coordinates;
      if (!coords) return null;
      
      // Create zones at different positions around the city center
      const angle = i * (Math.PI * 2 / 3);
      const distance = 0.02 + (i * 0.01);
      
      return {
        id: `${city}-flood-${i}`,
        coordinates: [
          coords[0] + Math.cos(angle) * distance,
          coords[1] + Math.sin(angle) * distance
        ],
        radius: 1000 + (i * 500),
        riskLevel: i === 0 ? 'High' : i === 1 ? 'Moderate' : 'Low'
      };
    }).filter(Boolean);
    
    // Future development recommendations
    const recommendations = [
      {
        id: 'rec-1',
        title: 'Drainage System Upgrade',
        description: 'Existing drainage systems need capacity improvements in marked areas.',
        priority: 'High'
      },
      {
        id: 'rec-2',
        title: 'Green Infrastructure Development',
        description: 'Implement permeable surfaces and rain gardens to reduce runoff.',
        priority: 'Medium'
      },
      {
        id: 'rec-3',
        title: 'Flood Plain Zoning',
        description: 'Restrict development in high-risk flood zones marked on the map.',
        priority: 'High'
      }
    ];
    
    return {
      floodZones,
      recommendations
    };
  } catch (error) {
    console.error('Error fetching urban planning data:', error);
    throw error;
  }
};
