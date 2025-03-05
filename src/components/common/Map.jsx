import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map view updates
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const Map = ({ 
  center = [12.9716, 77.5946], // Default to Bangalore
  zoom = 14, 
  markers = [], 
  height = '400px',
  className = '',
  showPopup = true
}) => {
  // If there's only one location in markers array, use it as center
  const mapCenter = markers.length === 1 
    ? [markers[0].coordinates.lat, markers[0].coordinates.lng] 
    : center;

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} />
        
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.coordinates.lat, marker.coordinates.lng]}
          >
            {showPopup && (
              <Popup>
                <div>
                  <h3 className="font-medium">{marker.title || 'Location'}</h3>
                  {marker.address && <p className="text-sm text-gray-600">{marker.address}</p>}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map; 