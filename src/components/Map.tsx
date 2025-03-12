
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { WaterBodyData } from '../services/api';

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Custom icons
const waterIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/616/616645.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface MapProps {
  city: string;
  waterBodies?: WaterBodyData[];
  floodZones?: any[];
  showUrbanPlanning?: boolean;
}

const cityCoordinates: Record<string, LatLngTuple> = {
  bangalore: [12.9716, 77.5946],
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
};

const Map = ({ city, waterBodies = [], floodZones = [], showUrbanPlanning = false }: MapProps) => {
  const position: LatLngTuple = cityCoordinates[city as keyof typeof cityCoordinates];
  const [activeLayer, setActiveLayer] = useState<string>('all');

  // Get color based on risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'darkred';
      case 'High': return 'red';
      case 'Moderate': return 'orange';
      case 'Low': return 'green';
      default: return 'blue';
    }
  };

  return (
    <MapContainer
      center={position}
      zoom={11}
      className="h-[500px] w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <LayersControl position="topright">
        {/* Base Layer - City Center */}
        <LayersControl.Overlay checked name="City Center">
          <LayerGroup>
            <Marker position={position}>
              <Popup>
                {city.charAt(0).toUpperCase() + city.slice(1)} City Center
              </Popup>
            </Marker>
          </LayerGroup>
        </LayersControl.Overlay>
        
        {/* Flood Risk Zones */}
        <LayersControl.Overlay checked name="Flood Risk Zones">
          <LayerGroup>
            {floodZones.map((zone, index) => (
              <Circle
                key={`flood-zone-${index}`}
                center={zone.coordinates as LatLngTuple}
                radius={zone.radius}
                pathOptions={{ 
                  color: getRiskColor(zone.riskLevel), 
                  fillColor: getRiskColor(zone.riskLevel),
                  fillOpacity: 0.3
                }}
              >
                <Popup>
                  <strong>{zone.riskLevel} Flood Risk Area</strong>
                  <p>This area has a {zone.riskLevel.toLowerCase()} risk of flooding.</p>
                </Popup>
              </Circle>
            ))}
            
            {/* Default circles if no flood zones are provided */}
            {floodZones.length === 0 && (
              <>
                <Circle
                  center={[position[0] + 0.02, position[1] + 0.02] as LatLngTuple}
                  radius={1000}
                  pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
                >
                  <Popup>High Flood Risk Area</Popup>
                </Circle>
                
                <Circle
                  center={[position[0] - 0.02, position[1] - 0.02] as LatLngTuple}
                  radius={1500}
                  pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.3 }}
                >
                  <Popup>Moderate Flood Risk Area</Popup>
                </Circle>
              </>
            )}
          </LayerGroup>
        </LayersControl.Overlay>
        
        {/* Water Bodies Layer */}
        <LayersControl.Overlay checked name="Water Bodies">
          <LayerGroup>
            {waterBodies.map((body) => (
              <Marker 
                key={body.id} 
                position={body.coordinates}
                icon={waterIcon}
              >
                <Popup>
                  <div className="p-1">
                    <strong>{body.name}</strong>
                    <div className="mt-1">Current Level: {body.currentLevel}%</div>
                    <div className="mt-1">
                      Status: <span style={{ color: getRiskColor(body.riskLevel) }}>{body.riskLevel}</span>
                    </div>
                    <div className="mt-1">
                      Change: {body.changeRate > 0 ? '+' : ''}{body.changeRate}% per day
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
        
        {/* Urban Planning Layer */}
        {showUrbanPlanning && (
          <LayersControl.Overlay name="Urban Planning">
            <LayerGroup>
              {/* In a real app, this would show zoning data, planned infrastructure, etc. */}
              <Circle
                center={[position[0] + 0.03, position[1] + 0.01] as LatLngTuple}
                radius={800}
                pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.2 }}
              >
                <Popup>
                  <strong>Urban Expansion Zone</strong>
                  <p>Planned development area with improved drainage systems</p>
                </Popup>
              </Circle>
            </LayerGroup>
          </LayersControl.Overlay>
        )}
      </LayersControl>
    </MapContainer>
  );
};

export default Map;
