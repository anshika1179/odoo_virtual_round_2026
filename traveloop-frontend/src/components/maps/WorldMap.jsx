import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarkerIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #f59e0b; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const WorldMap = ({ popularCities }) => {
  const navigate = useNavigate();
  
  const validCities = popularCities?.filter(c => c.latitude && c.longitude) || [];

  if (validCities.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-slate-50 rounded-2xl border border-slate-200">
        <p className="text-slate-500">Loading map data...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[500px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative z-0">
      <MapContainer 
        center={[20, 0]} // Center of the world approximately
        zoom={2} 
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        scrollWheelZoom={false}
        className="h-full w-full absolute inset-0 z-0 bg-slate-800"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          // Voyager is a clean, modern style perfect for landing pages
        />
        
        {validCities.map((city) => (
          <Marker 
            key={city.id} 
            position={[city.latitude, city.longitude]}
            icon={customMarkerIcon}
          >
            <Popup className="traveloop-popup rounded-xl">
              <div className="text-center p-1">
                <div className="font-bold text-slate-800 text-lg mb-1">{city.name}</div>
                <div className="text-sm text-slate-500 mb-3">{city.country}</div>
                <button 
                  onClick={() => navigate('/trips')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Plan Trip Here
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
