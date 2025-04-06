import { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Search } from 'lucide-react';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const LocationPicker = ({ propertyIndex, initialPosition, onSelectLocation }) => {
  const [position, setPosition] = useState(initialPosition || { lat: 20.5937, lng: 78.9629 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [address, setAddress] = useState('');

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPosition({ lat, lng });
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCcHrOBJ_7BpFNATBavw_8b3EtggNzkL2s`
      );
      const addressResult = response.data.results[0];
      if (addressResult) {
        const formattedAddress = addressResult.formatted_address;
        // Extract city and state from address components
        let city = '';
        let state = '';
        addressResult.address_components.forEach(component => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
        });
        setAddress(formattedAddress);
        onSelectLocation(lat, lng, formattedAddress, city, state);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=AIzaSyCcHrOBJ_7BpFNATBavw_8b3EtggNzkL2s`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleLocationSelect = (result) => {
    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;
    const formattedAddress = result.formatted_address;
    
    // Extract city and state from address components
    let city = '';
    let state = '';
    result.address_components.forEach(component => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
    });

    setPosition({ lat, lng });
    setAddress(formattedAddress);
    onSelectLocation(lat, lng, formattedAddress, city, state);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-[rgb(254,111,97)] text-white rounded hover:bg-[rgb(234,91,77)]"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleLocationSelect(result)}
            >
              {result.formatted_address}
            </div>
          ))}
        </div>
      )}

      <div className="h-[400px] relative rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey="AIzaSyCcHrOBJ_7BpFNATBavw_8b3EtggNzkL2s">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={13}
            onClick={handleMapClick}
          >
            <Marker position={position} />
          </GoogleMap>
        </LoadScript>
      </div>

      {address && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Selected location:</p>
          <p className="text-gray-800">{address}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;