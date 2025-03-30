import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Navigation } from "react-feather";

const LocationPicker = ({
  propertyIndex,
  initialPosition,
  onSelectLocation,
  formData
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState(
    initialPosition || [20.5937, 78.9629]
  );
  const [address, setAddress] = useState("");

  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const addressText = data.display_name || "Unknown location";
          setAddress(addressText);
          onSelectLocation(lat, lng, addressText);
        } catch (error) {
          console.error("Error getting address:", error);
          setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          onSelectLocation(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      },
    });
    return null;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        setAddress(display_name);
        onSelectLocation(parseFloat(lat), parseFloat(lon), display_name);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);

          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const addressText = data.display_name || "Unknown location";
            setAddress(addressText);
            onSelectLocation(latitude, longitude, addressText);
          } catch (error) {
            console.error("Error getting address:", error);
            setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            onSelectLocation(
              latitude,
              longitude,
              `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            );
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert(
            "Unable to get your current location. Please try the search function instead."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    // If a property already has coordinates, use them
    const property = formData.properties[propertyIndex];
    if (property && property.latitude && property.longitude) {
      setPosition([property.latitude, property.longitude]);
      setAddress(property.location || "");
    }
  }, [propertyIndex]);

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <div className="flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Search size={20} />
        </button>
        <button
          type="button"
          onClick={handleDetectLocation}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <Navigation size={20} />
        </button>
      </div>

      <div className="h-64 mb-2 rounded overflow-hidden border border-gray-300">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          key={`map-${position[0]}-${position[1]}`}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
          <MapEvents />
          <ZoomControl position="topright" />
        </MapContainer>
      </div>

      <div className="text-sm">
        <strong>Selected Address:</strong>{" "}
        {address || "Click on the map to select a location"}
      </div>
    </div>
  );
};

export default LocationPicker;