
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dynamically import Leaflet components to avoid SSR issues
const Map = lazy(() => import('@/components/Map'));

const Index = () => {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState('bangalore');
  const [loading, setLoading] = useState(true);
  const [floodRisk, setFloodRisk] = useState(30);
  const [waterLevels, setWaterLevels] = useState([]);
  
  useEffect(() => {
    // Simulated data loading
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate fetching water level data
      const mockData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        level: Math.random() * 100
      }));
      
      setWaterLevels(mockData);
      setLoading(false);
      
      // Show a simulated flood risk alert
      if (Math.random() > 0.7) {
        toast({
          title: "⚠️ High Flood Risk Detected",
          description: "Heavy rainfall expected in the next 24 hours.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [selectedCity, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Urban Vision GIS</h1>
        <p className="text-muted-foreground">Real-time Urban Insights & Flood Monitoring</p>
      </div>

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
        
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className="lg:col-span-2 p-4">
          <h2 className="text-xl font-semibold mb-4">Geographic Overview</h2>
          <div className="map-container">
            <Suspense fallback={<p>Loading map...</p>}>
              <Map city={selectedCity} />
            </Suspense>
          </div>
        </Card>

        {/* Metrics Section */}
        <div className="space-y-6">
          {/* Flood Risk Card */}
          <Card className="stat-card">
            <h3 className="text-lg font-medium mb-2">Current Flood Risk</h3>
            <Progress value={floodRisk} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {floodRisk < 30 ? "Low Risk" : floodRisk < 70 ? "Moderate Risk" : "High Risk"}
            </p>
          </Card>

          {/* Water Levels Card */}
          <Card className="stat-card">
            <h3 className="text-lg font-medium mb-4">Water Levels Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={waterLevels}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="weather" className="mt-8">
        <TabsList>
          <TabsTrigger value="weather">Weather Analysis</TabsTrigger>
          <TabsTrigger value="urban">Urban Planning</TabsTrigger>
          <TabsTrigger value="predictions">Flood Predictions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weather" className="chart-container">
          <h3 className="text-xl font-semibold mb-4">Weather Analysis</h3>
          {/* Add weather charts/data here */}
        </TabsContent>
        
        <TabsContent value="urban" className="chart-container">
          <h3 className="text-xl font-semibold mb-4">Urban Planning Insights</h3>
          {/* Add urban planning data here */}
        </TabsContent>
        
        <TabsContent value="predictions" className="chart-container">
          <h3 className="text-xl font-semibold mb-4">Flood Predictions</h3>
          {/* Add prediction data here */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
