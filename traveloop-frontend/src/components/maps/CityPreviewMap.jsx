import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map view updates when coordinates change
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const CityPreviewMap = ({ lat, lng, cityName }) => {
  const [mapCenter, setMapCenter] = useState([lat || 0, lng || 0]);

  useEffect(() => {
    if (lat && lng) {
      setMapCenter([lat, lng]);
    }
  }, [lat, lng]);

  if (!lat || !lng) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] bg-slate-50/50 backdrop-blur-sm rounded-xl border border-white/20">
        <p className="text-slate-400 text-sm italic">Select a city to view map</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[200px] rounded-xl overflow-hidden border border-white/20 shadow-md relative z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={11} 
        scrollWheelZoom={false}
        className="h-full w-full absolute inset-0 z-0"
        style={{ zIndex: 0 }}
      >
        <MapUpdater center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default CityPreviewMap;
