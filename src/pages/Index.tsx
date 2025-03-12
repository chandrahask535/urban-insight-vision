
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, Droplets, CloudRain, Wind, Thermometer } from 'lucide-react';
import FloodAlertBanner from '@/components/FloodAlertBanner';
import WaterLevelCard from '@/components/WaterLevelCard';
import PredictionChart from '@/components/PredictionChart';
import RecommendationCard from '@/components/RecommendationCard';
import { 
  getWeatherData, 
  getFloodRiskData, 
  getWaterBodiesData, 
  getWaterLevelHistory, 
  getUrbanPlanningData,
  WeatherData,
  FloodRiskData,
  WaterBodyData
} from '@/services/api';

// Dynamically import Leaflet components to avoid SSR issues
const Map = lazy(() => import('@/components/Map'));

const Index = () => {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState('bangalore');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [floodRisk, setFloodRisk] = useState<FloodRiskData | null>(null);
  const [waterBodies, setWaterBodies] = useState<WaterBodyData[]>([]);
  const [waterLevels, setWaterLevels] = useState([]);
  const [urbanData, setUrbanData] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'low' | 'moderate' | 'high'>('low');
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('weather');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [weather, floodRiskData, waterBodiesData, waterLevelData, urbanPlanningData] = await Promise.all([
          getWeatherData(selectedCity),
          getFloodRiskData(selectedCity),
          getWaterBodiesData(selectedCity),
          getWaterLevelHistory(selectedCity),
          getUrbanPlanningData(selectedCity)
        ]);
        
        // Update state with fetched data
        setWeatherData(weather);
        setFloodRisk(floodRiskData);
        setWaterBodies(waterBodiesData);
        setWaterLevels(waterLevelData);
        setUrbanData(urbanPlanningData);
        
        // Check if we need to show a flood risk alert
        if (floodRiskData.warningMessage) {
          setAlertMessage(floodRiskData.warningMessage);
          setAlertSeverity(
            floodRiskData.riskCategory === 'High' ? 'high' : 
            floodRiskData.riskCategory === 'Moderate' ? 'moderate' : 'low'
          );
          setShowAlert(true);
          
          // Also show a toast notification
          toast({
            title: `⚠️ ${floodRiskData.riskCategory} Flood Risk Alert`,
            description: floodRiskData.warningMessage,
            variant: floodRiskData.riskCategory === 'High' ? "destructive" : "default",
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
        toast({
          title: "Error loading data",
          description: "Failed to fetch the latest data. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [selectedCity, toast]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const dismissAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Urban Vision GIS</h1>
        <p className="text-muted-foreground">Real-time Urban Insights & Flood Monitoring</p>
      </div>

      {/* Alert Banner */}
      {showAlert && floodRisk?.warningMessage && (
        <FloodAlertBanner 
          message={alertMessage} 
          severity={alertSeverity}
          onDismiss={dismissAlert} 
        />
      )}

      {/* City Selection & Controls */}
      <div className="flex justify-between items-center mb-6">
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={handleRefresh}>
          Refresh Data
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className="lg:col-span-2 p-4">
          <h2 className="text-xl font-semibold mb-4">Geographic Overview</h2>
          <div className="h-[500px] rounded overflow-hidden">
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-gray-100">Loading map...</div>}>
              <Map 
                city={selectedCity} 
                waterBodies={waterBodies}
                floodZones={urbanData?.floodZones}
                showUrbanPlanning={activeTab === 'urban'}
              />
            </Suspense>
          </div>
        </Card>

        {/* Metrics Section */}
        <div className="space-y-6">
          {/* Flood Risk Card */}
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Current Flood Risk</h3>
            {floodRisk ? (
              <>
                <Progress 
                  value={floodRisk.riskLevel} 
                  className="mb-2"
                  // Add different colors based on risk level
                  style={{
                    '--progress-background': floodRisk.riskLevel > 70 ? 'hsl(0, 84%, 60%)' : 
                                            floodRisk.riskLevel > 40 ? 'hsl(30, 84%, 60%)' : 
                                            'hsl(142, 72%, 50%)'
                  } as any}
                />
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Low Risk</span>
                  <span>{floodRisk.riskCategory} ({floodRisk.riskLevel}%)</span>
                  <span>High Risk</span>
                </div>
                
                <div className="bg-secondary/40 p-3 rounded flex items-center">
                  <CloudRain className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm">Expected Rainfall</p>
                    <p className="font-medium">{floodRisk.rainfallPrediction}mm in next 24h</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="animate-pulse">
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            )}
          </Card>

          {/* Weather Card */}
          {weatherData && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Current Weather</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/40 p-3 rounded flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-red-500" />
                  <div>
                    <p className="text-sm">Temperature</p>
                    <p className="font-medium">{weatherData.temperature.toFixed(1)}°C</p>
                  </div>
                </div>
                
                <div className="bg-secondary/40 p-3 rounded flex items-center">
                  <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm">Humidity</p>
                    <p className="font-medium">{weatherData.humidity.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="bg-secondary/40 p-3 rounded flex items-center">
                  <Wind className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm">Wind Speed</p>
                    <p className="font-medium">{weatherData.windSpeed.toFixed(1)} km/h</p>
                  </div>
                </div>
                
                <div className="bg-secondary/40 p-3 rounded flex items-center">
                  <CloudRain className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm">Precipitation</p>
                    <p className="font-medium">{weatherData.precipitation.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Water Bodies Section */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Water Bodies Monitoring</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {waterBodies.map(body => (
          <WaterLevelCard key={body.id} waterBody={body} />
        ))}
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="weather" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="weather">Weather Analysis</TabsTrigger>
          <TabsTrigger value="water">Water Level Trends</TabsTrigger>
          <TabsTrigger value="urban">Urban Planning</TabsTrigger>
          <TabsTrigger value="predictions">Flood Predictions</TabsTrigger>
        </TabsList>
        
        {/* Weather Analysis Tab */}
        <TabsContent value="weather" className="chart-container mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">5-Day Temperature Forecast</h3>
              {weatherData && (
                <PredictionChart 
                  data={weatherData.forecast} 
                  dataKey="temperature"
                  name="Temperature"
                  stroke="hsl(0, 84%, 60%)"
                  fill="hsl(0, 84%, 60%)"
                  yAxisLabel="°C"
                />
              )}
            </Card>
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">5-Day Precipitation Forecast</h3>
              {weatherData && (
                <PredictionChart 
                  data={weatherData.forecast} 
                  dataKey="precipitation"
                  name="Precipitation"
                  stroke="hsl(220, 84%, 60%)"
                  fill="hsl(220, 84%, 60%)"
                  yAxisLabel="%"
                />
              )}
            </Card>
          </div>
        </TabsContent>
        
        {/* Water Level Trends Tab */}
        <TabsContent value="water" className="chart-container mt-4">
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Water Level Trends (Past 7 Days)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={waterLevels}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsla(var(--background))', 
                    borderColor: 'hsla(var(--border))'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  name="Water Level"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-6 space-y-4">
              <h4 className="font-medium">Analysis & Insights</h4>
              <p className="text-muted-foreground">
                The chart shows water level fluctuations across key water bodies in {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}. 
                This data is crucial for predicting potential flood risks and water management.
              </p>
              
              {floodRisk?.riskLevel > 60 && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700 font-medium">Risk Alert</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    Water levels are approaching critical thresholds. Continued rainfall could lead to flooding in low-lying areas.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        {/* Urban Planning Tab */}
        <TabsContent value="urban" className="chart-container mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Infrastructure Recommendations</h3>
              <div className="space-y-4">
                {urbanData?.recommendations?.map((rec: any) => (
                  <RecommendationCard 
                    key={rec.id}
                    title={rec.title}
                    description={rec.description}
                    priority={rec.priority}
                  />
                ))}
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Land Use Suitability</h3>
              <p className="text-muted-foreground mb-4">
                The map shows zones with varying flood risks. Urban planning should prioritize development in low-risk areas
                and implement mitigation measures in moderate-risk zones.
              </p>
              <div className="space-y-3 mt-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span>High Risk Zone - Avoid new development, implement flood protection</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                  <span>Moderate Risk Zone - Limited development with proper drainage</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Low Risk Zone - Suitable for development</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                  <span>Urban Expansion Zone - Planned infrastructure improvements</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Flood Predictions Tab */}
        <TabsContent value="predictions" className="chart-container mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-4">
              <h3 className="text-xl font-semibold mb-4">Flood Risk Prediction Model</h3>
              <p className="text-muted-foreground mb-4">
                This prediction model combines historical data, terrain analysis, and weather forecasts to 
                estimate flood probabilities over the next 7 days.
              </p>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={[
                    { day: 'Day 1', risk: Math.min(100, Math.max(10, floodRisk?.riskLevel || 30)) },
                    { day: 'Day 2', risk: Math.min(100, Math.max(10, (floodRisk?.riskLevel || 30) + (Math.random() * 15 - 5))) },
                    { day: 'Day 3', risk: Math.min(100, Math.max(10, (floodRisk?.riskLevel || 30) + (Math.random() * 20 - 10))) },
                    { day: 'Day 4', risk: Math.min(100, Math.max(10, (floodRisk?.riskLevel || 30) + (Math.random() * 25 - 15))) },
                    { day: 'Day 5', risk: Math.min(100, Math.max(10, (floodRisk?.riskLevel || 30) + (Math.random() * 30 - 20))) },
                    { day: 'Day 6', risk: Math.min(100, Math.max(10, (floodRisk?.riskLevel || 30) + (Math.random() * 35 - 25))) },
                    { day: 'Day 7', risk: Math.min(100, Math.max(10, (floodRisk?.riskLevel || 30) + (Math.random() * 40 - 30))) },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" />
                  <YAxis label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsla(var(--background))', 
                      borderColor: 'hsla(var(--border))'
                    }} 
                  />
                  <Bar 
                    dataKey="risk" 
                    name="Flood Risk"
                    fill="url(#colorGradient)" 
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Factors Influencing Predictions</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>Historical rainfall patterns</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Terrain elevation and slope</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  <span>Drainage infrastructure capacity</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                  <span>Soil absorption rates</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span>Weather forecast accuracy</span>
                </li>
              </ul>
              
              {floodRisk && floodRisk.riskLevel > 60 && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-6">
                  <h4 className="font-medium text-red-700 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Prevention Recommendations
                  </h4>
                  <ul className="mt-2 text-sm text-red-600 space-y-1">
                    <li>• Monitor weather updates closely</li>
                    <li>• Clear drainage systems in high-risk areas</li>
                    <li>• Prepare emergency response plans</li>
                    <li>• Consider temporary flood barriers</li>
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Footer */}
      <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>Urban Vision GIS provides real-time urban insights and flood monitoring powered by satellite imagery and weather data.</p>
        <p className="mt-2">© 2023 Urban Vision GIS. Data sources: NASA MODIS, ESA Sentinel, ISRO BHUVAN, OpenWeatherMap, and OpenTopography.</p>
      </div>
    </div>
  );
};

export default Index;
