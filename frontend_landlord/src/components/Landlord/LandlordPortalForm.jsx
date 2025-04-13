import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Search, MapPin, Navigation } from "lucide-react";
import LocationPicker from "./LocationPicker";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backendURL from "@/config/config";


const LandlordPortalForm = () => {
  // Form state management
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    numberOfProperties: "",
    properties: [],
  });
  const [errors, setErrors] = useState({});
  const [mapPosition, setMapPosition] = useState([20.5937, 78.9629]); // Default center of India

  // Sample amenities list
const amenitiesList = [
    { name: "Wi-Fi", icon: "📶" },
    { name: "Air Conditioning", icon: "❄️" },
    { name: "Washing Machine", icon: "🧺" },
    { name: "Refrigerator", icon: "🌡️" }, 
    { name: "TV", icon: "📺" },
    { name: "Microwave", icon: "🔥" },
    { name: "Geyser", icon: "🚿" },
    { name: "Power Backup", icon: "🔋" },
    { name: "Parking", icon: "🅿️" },
    { name: "Security", icon: "👮" },
    { name: "CCTV", icon: "📹" },
    { name: "Lift", icon: "🛗" },
    { name: "Swimming Pool", icon: "🏊" },
    { name: "Gym", icon: "💪" }
];

  // Property types
  const propertyTypes = ["PG", "Flat", "Boys PG", "Girls PG", "Other"];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };

  // Handle property input changes
  const handlePropertyChange = (index, field, value) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[index]) {
      updatedProperties[index] = {};
    }

    // Update the field value
    updatedProperties[index][field] = value;

    // Special handling for numberOfFloors
    if (field === 'numberOfFloors') {
      const numFloors = parseInt(value) || 0;
      if (!updatedProperties[index].floors) {
        updatedProperties[index].floors = [];
      }
      // Preserve existing floor data while adjusting array size
      updatedProperties[index].floors = Array(numFloors)
        .fill()
        .map((_, i) => updatedProperties[index].floors[i] || { rooms: [] });
    }

    setFormData({ ...formData, properties: updatedProperties });

    // Clear error for this property field
    if (errors[`property_${index}_${field}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`property_${index}_${field}`];
      setErrors(updatedErrors);
    }
  };

  // Handle property type selection (single selection)
  const handleTypeSelection = (index, type) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[index]) {
      updatedProperties[index] = {};
    }

    // Set the single property type
    updatedProperties[index].propertyType = type;
    setFormData({ ...formData, properties: updatedProperties });

    // Clear error for property type
    if (errors[`property_${index}_propertyType`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`property_${index}_propertyType`];
      setErrors(updatedErrors);
    }
  };

  // Handle amenity selection
  const handleAmenitySelection = (index, amenity) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[index]) {
      updatedProperties[index] = { amenities: [] };
    } else if (!updatedProperties[index].amenities) {
      updatedProperties[index].amenities = [];
    }

    const amenityIndex = updatedProperties[index].amenities.indexOf(amenity);

    if (amenityIndex === -1) {
      updatedProperties[index].amenities.push(amenity);
    } else {
      updatedProperties[index].amenities.splice(amenityIndex, 1);
    }

    setFormData({ ...formData, properties: updatedProperties });
  };

  // Handle room configuration change to maintain all rooms separately
  const handleRoomConfigChange = (propertyIndex, floorIndex, roomIndex, field, value) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[propertyIndex].floors) {
      updatedProperties[propertyIndex].floors = [];
    }

    if (!updatedProperties[propertyIndex].floors[floorIndex]) {
      updatedProperties[propertyIndex].floors[floorIndex] = { rooms: [] };
    }

    if (!updatedProperties[propertyIndex].floors[floorIndex].rooms) {
      updatedProperties[propertyIndex].floors[floorIndex].rooms = [];
    }

    // Ensure we have enough room objects
    while (updatedProperties[propertyIndex].floors[floorIndex].rooms.length <= roomIndex) {
      updatedProperties[propertyIndex].floors[floorIndex].rooms.push({});
    }

    // Set the field value for the specific room
    updatedProperties[propertyIndex].floors[floorIndex].rooms[roomIndex][field] = value;

    setFormData({ ...formData, properties: updatedProperties });

    // Clear error for this field
    if (errors[`property_${propertyIndex}_floor_${floorIndex}_room_${roomIndex}_${field}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`property_${propertyIndex}_floor_${floorIndex}_room_${roomIndex}_${field}`];
      setErrors(updatedErrors);
    }
  };

  // Add a function to handle room sharing options
  const handleRoomSharingSelection = (propertyIndex, floorIndex, roomIndex, sharingOption) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[propertyIndex].floors) {
      updatedProperties[propertyIndex].floors = [];
    }

    if (!updatedProperties[propertyIndex].floors[floorIndex]) {
      updatedProperties[propertyIndex].floors[floorIndex] = { rooms: [] };
    }

    if (!updatedProperties[propertyIndex].floors[floorIndex].rooms) {
      updatedProperties[propertyIndex].floors[floorIndex].rooms = [];
    }

    if (!updatedProperties[propertyIndex].floors[floorIndex].rooms[roomIndex]) {
      updatedProperties[propertyIndex].floors[floorIndex].rooms[roomIndex] = { sharingOptions: [] };
    }

    if (!updatedProperties[propertyIndex].floors[floorIndex].rooms[roomIndex].sharingOptions) {
      updatedProperties[propertyIndex].floors[floorIndex].rooms[roomIndex].sharingOptions = [];
    }

    const sharingOptions = updatedProperties[propertyIndex].floors[floorIndex].rooms[roomIndex].sharingOptions;
    const optionIndex = sharingOptions.indexOf(sharingOption);

    if (optionIndex === -1) {
      sharingOptions.push(sharingOption);
    } else {
      sharingOptions.splice(optionIndex, 1);
    }

    setFormData({ ...formData, properties: updatedProperties });

    // Clear error if any
    if (errors[`property_${propertyIndex}_floor_${floorIndex}_room_${roomIndex}_sharingOptions`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`property_${propertyIndex}_floor_${floorIndex}_room_${roomIndex}_sharingOptions`];
      setErrors(updatedErrors);
    }
  };

  // Handle map location selection
  const handleMapSelection = (propertyIndex, lat, lng, address) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[propertyIndex]) {
      updatedProperties[propertyIndex] = {};
    }

    // Extract city and state from address if possible
    let city = '';
    let state = '';
    const addressComponents = address.split(',').map(component => component.trim());
    if (addressComponents.length >= 3) {
      city = addressComponents[addressComponents.length - 3];
      state = addressComponents[addressComponents.length - 2];
    }

    // Update property with location data
    updatedProperties[propertyIndex].latitude = lat;
    updatedProperties[propertyIndex].longitude = lng;
    updatedProperties[propertyIndex].location = address;
    updatedProperties[propertyIndex].city = city;
    updatedProperties[propertyIndex].state = state;

    setFormData({ ...formData, properties: updatedProperties });

    // Clear error for location
    if (errors[`property_${propertyIndex}_location`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`property_${propertyIndex}_location`];
      setErrors(updatedErrors);
    }
  };

  // Add checkboxes for room selection
  const handleRoomSelection = (propertyIndex, floorIndex, roomIndex) => {
    const updatedProperties = [...formData.properties];
    if (!updatedProperties[propertyIndex].floors[floorIndex].rooms) {
      updatedProperties[propertyIndex].floors[floorIndex].rooms = [];
    }
    updatedProperties[propertyIndex].floors[floorIndex].selectedRoom = roomIndex;
    setFormData({ ...formData, properties: updatedProperties });
  };

  // Add this new function to handle floor-specific changes
  const handleFloorChange = (propertyIndex, floorIndex, field, value) => {
    const updatedProperties = [...formData.properties];
    
    if (!updatedProperties[propertyIndex].floors) {
      updatedProperties[propertyIndex].floors = [];
    }
    
    if (!updatedProperties[propertyIndex].floors[floorIndex]) {
      updatedProperties[propertyIndex].floors[floorIndex] = { rooms: [] };
    }

    // Update the specific field
    updatedProperties[propertyIndex].floors[floorIndex][field] = value;

    // If updating numberOfRooms, initialize the rooms array
    if (field === 'numberOfRooms') {
      const numRooms = parseInt(value) || 0;
      updatedProperties[propertyIndex].floors[floorIndex].rooms = Array(numRooms)
        .fill()
        .map((_, i) => updatedProperties[propertyIndex].floors[floorIndex].rooms[i] || {
          sharingOptions: [],
          targetTenants: ''
        });
    }

    setFormData({ ...formData, properties: updatedProperties });

    // Clear any related errors
    if (errors[`property_${propertyIndex}_floor_${floorIndex}_${field}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`property_${propertyIndex}_floor_${floorIndex}_${field}`];
      setErrors(updatedErrors);
    }
  };

  // Update validateStep function to check all rooms on each floor
  const validateStep = (currentStep) => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.numberOfProperties) {
          newErrors.numberOfProperties = "Please enter the number of properties";
        } else if (
          parseInt(formData.numberOfProperties) < 1 ||
          parseInt(formData.numberOfProperties) > 5
        ) {
          newErrors.numberOfProperties = "Number of properties must be between 1 and 5";
        }
        break;

      case 2:
        formData.properties.forEach((property, index) => {
          if (!property.name || property.name.trim() === "") {
            newErrors[`property_${index}_name`] = "Property name is required";
          }

          if (!property.propertyType) {
            newErrors[`property_${index}_propertyType`] =
              "Please select a property type";
          }
        });
        break;

      case 3:
        formData.properties.forEach((property, index) => {
          if (!property.location || property.location.trim() === "") {
            newErrors[`property_${index}_location`] = "Location is required";
          }
        });
        break;

      case 4:
        formData.properties.forEach((property, index) => {
          if (!property.numberOfFloors || parseInt(property.numberOfFloors) < 1) {
            newErrors[`property_${index}_numberOfFloors`] =
              "Please enter at least 1 floor";
          } else if (property.floors) {
            property.floors.forEach((floor, floorIndex) => {
              if (!floor.numberOfRooms || parseInt(floor.numberOfRooms) < 1) {
                newErrors[
                  `property_${index}_floor_${floorIndex}_numberOfRooms`
                ] = "Number of rooms is required";
              }

              // Check each room in the floor
              if (floor.rooms) {
                for (let roomIndex = 0; roomIndex < parseInt(floor.numberOfRooms); roomIndex++) {
                  const room = floor.rooms[roomIndex];
                  
                  if (!room || !room.sharingOptions || room.sharingOptions.length === 0) {
                    newErrors[
                      `property_${index}_floor_${floorIndex}_room_${roomIndex}_sharingOptions`
                    ] = `Room ${roomIndex + 1}: Select at least one sharing option`;
                  }

                  if (!room || !room.targetTenants) {
                    newErrors[
                      `property_${index}_floor_${floorIndex}_room_${roomIndex}_targetTenants`
                    ] = `Room ${roomIndex + 1}: Target tenants is required`;
                  }
                }
              }
            });
          }
        });
        break;

      default:
        break;
    }

    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  // Handle direct step navigation
  const handleStepNavigation = (newStep) => {
    if (newStep < step) {
      setStep(newStep);
    } else if (newStep > step) {
      let canNavigate = true;
      let validationErrors = {};

      for (let i = step; i < newStep; i++) {
        const { isValid, errors } = validateStep(i);
        if (!isValid) {
          canNavigate = false;
          validationErrors = { ...validationErrors, ...errors };
          break;
        }
      }

      if (canNavigate) {
        if (step === 1 && formData.properties.length === 0) {
          const propertiesCount = parseInt(formData.numberOfProperties);
          const initialProperties = Array(propertiesCount).fill().map(() => ({}));
          setFormData({ ...formData, properties: initialProperties });
        }
        setStep(newStep);
      } else {
        setErrors(validationErrors);
      }
    }
  };

  // Handle next step
  const handleNextStep = () => {
    const { isValid, errors: newErrors } = validateStep(step);
    if (isValid) {
      if (step === 1 && formData.properties.length === 0) {
        const propertiesCount = parseInt(formData.numberOfProperties);
        const initialProperties = Array(propertiesCount).fill().map(() => ({}));
        setFormData({ ...formData, properties: initialProperties });
      }
      setStep(step + 1);
    } else {
      setErrors(newErrors);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Add a handler for the Enter key to navigate through steps
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 5) {
        handleNextStep();
      } else {
        handleSubmit(e);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateStep(step);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Transform the form data to match backend schema
      const transformedProperties = formData.properties.map(property => {
        // Process floors data to match backend schema
        const floorData = property.floors?.map(floor => {
          // Prepare all rooms data
          const roomsData = floor.rooms
            ?.slice(0, parseInt(floor.numberOfRooms))
            ?.map((room, index) => ({
              roomId: `room_${index + 1}`,
              type: room.type || "standard",
              sharingOptions: room.sharingOptions || [],
              targetTenants: room.targetTenants || '',
              photos: room.photos || []
            })) || [];

          return {
            floorId: `floor_${Math.random().toString(36).substring(2, 10)}`,
            numberOfRooms: parseInt(floor.numberOfRooms),
            rooms: roomsData
          };
        });

        return {
          title: property.name,
          description: `${property.name} - ${property.propertyType}`,
          name: property.name,
          propertyType: property.propertyType,
          address: property.location,
          landmark: property.landmark,
          location: {
            type: 'Point',
            coordinates: [parseFloat(property.longitude), parseFloat(property.latitude)],
            city: property.city || '',
            state: property.state || '',
            country: 'India'
          },
          numberOfFloors: parseInt(property.numberOfFloors),
          floors: floorData || [],
          amenities: property.amenities || [],
          active: true
        };
      });

      // Submit each property
      for (const propertyData of transformedProperties) {
        const response = await axios.post(
          backendURL + `/api/listings`,
          propertyData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to create listing');
        }
      }

      alert('Properties submitted successfully!');
      navigate('/dashboard'); // Redirect to dashboard
      // Reset form or redirect
      setFormData({
        numberOfProperties: '',
        properties: []
      });
      setStep(1);
      
    } catch (error) {
      console.error('Error submitting properties:', error);
      alert(error.response?.data?.message || 'Error submitting properties. Please try again.');
    }
  };

  // Animation variants for Framer Motion
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Number of Properties</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Enter number (1-5):
              </label>
              <input
                type="number"
                name="numberOfProperties"
                min="1"
                max="5"
                value={formData.numberOfProperties}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.numberOfProperties
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                }`}
              />
              {errors.numberOfProperties && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.numberOfProperties}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Property Details</h2>

            {formData.properties.map((property, index) => (
              <motion.div
                key={index}
                className="mb-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-[rgb(254,111,97)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium mb-3">
                  Property {index + 1}
                </h3>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Property Name:
                  </label>
                  <input
                    type="text"
                    value={property.name || ""}
                    onChange={(e) =>
                      handlePropertyChange(index, "name", e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Shayam Ghar"
                    className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                      errors[`property_${index}_name`]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                    }`}
                  />
                  {errors[`property_${index}_name`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`property_${index}_name`]}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Property Type:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {propertyTypes.map((type) => (
                      <motion.div
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 border rounded cursor-pointer transition-all duration-200 ${
                          property.propertyType === type
                            ? "bg-blue-500 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => handleTypeSelection(index, type)}
                      >
                        <div className="flex items-center justify-center">
                          <span>{type}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {errors[`property_${index}_propertyType`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`property_${index}_propertyType`]}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 3:
        return (
            <motion.div
                className="bg-white p-6 rounded-lg shadow-md"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Location & Amenities</h2>

                {formData.properties.map((property, index) => (
                    <motion.div
                        key={index}
                        className="mb-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-[rgb(254,111,97)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <h3 className="text-lg font-medium mb-3">
                            Property {index + 1}: {property.name || "Unnamed"}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Location:</label>
                            <LocationPicker
                                propertyIndex={index}
                                initialPosition={
                                    property.latitude && property.longitude
                                        ? [property.latitude, property.longitude]
                                        : null
                                }
                                onSelectLocation={(lat, lng, address) =>
                                    handleMapSelection(index, lat, lng, address)
                                }
                                formData={formData}
                            />
                            {errors[`property_${index}_location`] && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors[`property_${index}_location`]}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">
                                Nearest Landmark:
                            </label>
                            <input
                                type="text"
                                value={property.landmark || ""}
                                onChange={(e) =>
                                    handlePropertyChange(index, "landmark", e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="e.g., Near City Mall"
                                className="w-full p-3 border-2 rounded-lg transition-all duration-200 border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-[rgb(254,111,97)] font-medium mb-2">
                                Amenities:
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {amenitiesList.map((amenity) => (
                                    <motion.div
                                        key={amenity.name}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAmenitySelection(index, amenity.name)}
                                        className={`
                                            p-3 rounded-lg cursor-pointer transition-all duration-200
                                            ${
                                                property.amenities?.includes(amenity.name)
                                                    ? "bg-[rgb(254,111,97)] text-white shadow-md"
                                                    : "bg-white border-2 border-gray-200 hover:border-[rgb(254,111,97)]"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{amenity.icon}</span>
                                            <span className="text-sm font-medium">{amenity.name}</span>
                                            {property.amenities?.includes(amenity.name) && (
                                                <motion.svg 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-5 h-5 ml-auto"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </motion.svg>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        );

      case 4:
        return (
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Room Configuration</h2>

            {formData.properties.map((property, index) => (
              <motion.div
                key={index}
                className="mb-8 p-6 bg-white rounded-lg shadow-md border-l-4 border-[rgb(254,111,97)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium mb-3">
                  Property {index + 1}: {property.name || "Unnamed"}
                </h3>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Number of Floors:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={property.numberOfFloors || ""}
                    onChange={(e) =>
                      handlePropertyChange(
                        index,
                        "numberOfFloors",
                        e.target.value
                      )
                    }
                    onKeyDown={handleKeyDown}
                    className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                      errors[`property_${index}_numberOfFloors`]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                    }`}
                  />
                  {errors[`property_${index}_numberOfFloors`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`property_${index}_numberOfFloors`]}
                    </p>
                  )}
                </div>

                <AnimatePresence>
                  {property.numberOfFloors &&
                    parseInt(property.numberOfFloors) > 0 && (
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="font-medium mb-2">Floor Details:</h4>

                        {[...Array(parseInt(property.numberOfFloors))].map(
                          (_, floorIndex) => (
                            <motion.div
                              key={floorIndex}
                              className="mb-6 p-4 border border-gray-200 rounded"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: floorIndex * 0.1 }}
                            >
                              <h5 className="font-medium mb-3 text-[rgb(254,111,97)]">
                                Floor {floorIndex + 1}
                              </h5>

                              <div className="mb-4">
                                <label className="block text-gray-700 mb-1">
                                  Number of Rooms:
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={
                                    property.floors?.[floorIndex]
                                      ?.numberOfRooms || ""
                                  }
                                  onChange={(e) =>
                                    handleFloorChange(
                                      index,
                                      floorIndex,
                                      "numberOfRooms",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={handleKeyDown}
                                  className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                                    errors[
                                      `property_${index}_floor_${floorIndex}_numberOfRooms`
                                    ]
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                                  }`}
                                />
                                {errors[
                                  `property_${index}_floor_${floorIndex}_numberOfRooms`
                                ] && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {
                                      errors[
                                        `property_${index}_floor_${floorIndex}_numberOfRooms`
                                      ]
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Room details for this floor */}
                              {property.floors?.[floorIndex]?.numberOfRooms > 0 && (
                                <div className="space-y-4 mt-4">
                                  {[...Array(parseInt(property.floors[floorIndex].numberOfRooms))].map(
                                    (_, roomIndex) => (
                                      <div 
                                        key={roomIndex} 
                                        className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                                      >
                                        <h6 className="font-medium mb-2">Room {roomIndex + 1}</h6>
                                        
                                        <div className="mb-3">
                                          <label className="block text-gray-700 mb-1">
                                            Room Sharing Options:
                                          </label>
                                          <div className="flex flex-wrap gap-2">
                                            {["Single", "Double", "Triple", "4 Sharing"].map((option) => (
                                              <motion.div
                                                key={option}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`px-3 py-1 border rounded cursor-pointer transition-all duration-200 ${
                                                  property.floors?.[floorIndex]?.rooms?.[roomIndex]?.sharingOptions?.includes(option)
                                                    ? "bg-red-100 border-blue-300 text-blue-800"
                                                    : "bg-white border-gray-300 hover:bg-gray-50"
                                                }`}
                                                onClick={() => handleRoomSharingSelection(index, floorIndex, roomIndex, option)}
                                              >
                                                {option}
                                              </motion.div>
                                            ))}
                                          </div>
                                          {errors[
                                            `property_${index}_floor_${floorIndex}_room_${roomIndex}_sharingOptions`
                                          ] && (
                                            <p className="text-red-500 text-sm mt-1">
                                              {errors[
                                                `property_${index}_floor_${floorIndex}_room_${roomIndex}_sharingOptions`
                                              ]}
                                            </p>
                                          )}
                                        </div>

                                        <div className="mb-3">
                                          <label className="block text-gray-700 mb-1">
                                            Target Tenants:
                                          </label>
                                          <select
                                            value={
                                              property.floors?.[floorIndex]?.rooms?.[roomIndex]?.targetTenants || ""
                                            }
                                            onChange={(e) =>
                                              handleRoomConfigChange(
                                                index,
                                                floorIndex,
                                                roomIndex,
                                                "targetTenants",
                                                e.target.value
                                              )
                                            }
                                            onKeyDown={handleKeyDown}
                                            className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                                              errors[
                                                `property_${index}_floor_${floorIndex}_room_${roomIndex}_targetTenants`
                                              ]
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                                            }`}
                                          >
                                            <option value="">Select tenant type</option>
                                            <option value="Students">Students</option>
                                            <option value="Working Professionals">
                                              Working Professionals
                                            </option>
                                            <option value="Family">Family</option>
                                            <option value="Any">Any</option>
                                          </select>
                                          {errors[
                                            `property_${index}_floor_${floorIndex}_room_${roomIndex}_targetTenants`
                                          ] && (
                                            <p className="text-red-500 text-sm mt-1">
                                              {errors[
                                                `property_${index}_floor_${floorIndex}_room_${roomIndex}_targetTenants`
                                              ]}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )
                        )}
                      </motion.div>
                    )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Review & Submit</h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Summary</h3>
              <p className="mb-2">
                Number of Properties: {formData.numberOfProperties}
              </p>

              {formData.properties.map((property, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 border border-gray-200 rounded-lg"
                >
                  <h4 className="font-medium">
                    Property {index + 1}: {property.name || "Unnamed"}
                  </h4>
                  <p>Type: {property.propertyType || "None selected"}</p>
                  <p>Location: {property.location || "Not specified"}</p>
                  <p>Landmark: {property.landmark || "Not specified"}</p>
                  <p>
                    Amenities:{" "}
                    {property.amenities?.length > 0
                      ? property.amenities.join(", ")
                      : "None selected"}
                  </p>
                  <p>Number of Floors: {property.numberOfFloors || "0"}</p>
                  {property.floors && property.floors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Floor Details:</p>
                      {property.floors.map((floor, floorIndex) => (
                        <div key={floorIndex} className="ml-3 mt-1 p-2 border-l-2 border-gray-200">
                          <p className="font-medium">
                            Floor {floorIndex + 1}: {floor.numberOfRooms || "0"} rooms
                          </p>
                          
                          {/* Display all rooms for this floor */}
                          {floor.rooms && parseInt(floor.numberOfRooms) > 0 && (
                            <div className="ml-4 space-y-2 mt-2">
                              {floor.rooms.slice(0, parseInt(floor.numberOfRooms)).map((room, roomIndex) => (
                                <div key={roomIndex} className="p-2 bg-gray-50 rounded">
                                  <p className="text-sm font-medium">Room {roomIndex + 1}:</p>
                                  <p className="text-sm">
                                    Sharing Options:{" "}
                                    {room.sharingOptions?.length > 0
                                      ? room.sharingOptions.join(", ")
                                      : "None"}
                                  </p>
                                  <p className="text-sm">
                                    Target Tenants:{" "}
                                    {room.targetTenants || "Not specified"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
              
            {/* Submit Button with improved styles and conditional disabling */}
            <button
              type="submit"
              className={`px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 ml-auto transition duration-300`}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };
  console.log(formData);
  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4" onKeyDown={handleKeyDown}>
      <div className="max-w-4xl mt-20 mx-auto">
        <div className="mb-8 bg-white rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-[rgb(254,111,97)] mb-4">
            Landlord Portal - Rooms on Rent
          </h1>
          <div className="overflow-x-auto">
            <div className="flex justify-center mt-6 min-w-[300px]">
              <div className="flex items-center" style={{ padding: '0 10px' }}>
                {[1, 2, 3, 4, 5].map((stepNumber) => (
                  <motion.div
                    key={stepNumber}
                    className="flex items-center cursor-pointer"
                    onClick={() => handleStepNavigation(stepNumber)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 text-sm md:text-base ${
                        step === stepNumber
                          ? "bg-[rgb(254,111,97)] text-white shadow-md"
                          : step > stepNumber
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 5 && (
                      <div
                        className={`w-8 md:w-16 h-1 transition-all duration-300 ${
                          step > stepNumber
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <motion.div 
            className="flex justify-between bg-white p-4 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {step > 1 && (
              <motion.button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Previous
              </motion.button>
            )}

            {step < 5 ? (
              <motion.button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-[rgb(254,111,97)] text-white rounded-lg hover:bg-[rgb(234,91,77)] focus:outline-none focus:ring-2 focus:ring-[rgb(254,111,97)] transition-all duration-300 ml-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Next
              </motion.button>
            ) : null}
          </motion.div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default LandlordPortalForm;