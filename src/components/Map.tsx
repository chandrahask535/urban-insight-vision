
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngTuple } from 'leaflet';

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface MapProps {
  city: string;
}

const cityCoordinates: Record<string, LatLngTuple> = {
  bangalore: [12.9716, 77.5946],
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
};

const Map = ({ city }: MapProps) => {
  const position: LatLngTuple = cityCoordinates[city as keyof typeof cityCoordinates];

  return (
    <MapContainer
      center={position}
      zoom={11}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* City Center Marker */}
      <Marker position={position}>
        <Popup>
          {city.charAt(0).toUpperCase() + city.slice(1)}
        </Popup>
      </Marker>
      
      {/* Flood Risk Areas */}
      <Circle
        center={[position[0] + 0.02, position[1] + 0.02] as LatLngTuple}
        radius={1000}
        pathOptions={{ color: 'red', fillColor: 'red' }}
      >
        <Popup>High Flood Risk Area</Popup>
      </Circle>
      
      <Circle
        center={[position[0] - 0.02, position[1] - 0.02] as LatLngTuple}
        radius={1500}
        pathOptions={{ color: 'orange', fillColor: 'orange' }}
      >
        <Popup>Moderate Flood Risk Area</Popup>
      </Circle>
    </MapContainer>
  );
};

export default Map;
