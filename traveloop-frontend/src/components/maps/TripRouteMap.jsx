import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TripRouteMap = ({ stops }) => {
  // Filter out stops without coordinates
  const validStops = stops?.filter(stop => stop.city_lat && stop.city_lng) || [];
  
  if (validStops.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-white/20">
        <p className="text-slate-500 font-medium">No map data available for this trip.</p>
      </div>
    );
  }

  // Calculate bounds to fit all markers
  const bounds = validStops.map(stop => [stop.city_lat, stop.city_lng]);
  
  // Create path coordinates
  const pathCoordinates = validStops.map(stop => [stop.city_lat, stop.city_lng]);

  // Create a custom numbered icon function
  const createNumberedIcon = (number) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px;">${number}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="h-full w-full min-h-[400px] rounded-2xl overflow-hidden border border-white/20 shadow-xl relative z-0">
      <MapContainer 
        bounds={bounds} 
        scrollWheelZoom={false}
        className="h-full w-full absolute inset-0 z-0"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Draw route lines */}
        {pathCoordinates.length > 1 && (
          <Polyline 
            positions={pathCoordinates} 
            color="#f59e0b" // amber-500
            weight={3}
            dashArray="10, 10"
            opacity={0.8}
          />
        )}

        {/* Draw markers */}
        {validStops.map((stop, index) => (
          <Marker 
            key={stop.id} 
            position={[stop.city_lat, stop.city_lng]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup className="traveloop-popup">
              <div className="font-semibold text-slate-800">{index + 1}. {stop.city_name}</div>
              <div className="text-sm text-slate-600 mt-1">{stop.section_title}</div>
              {stop.section_budget > 0 && (
                <div className="text-sm font-medium text-amber-600 mt-1">
                  Budget: ${stop.section_budget}
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TripRouteMap;
