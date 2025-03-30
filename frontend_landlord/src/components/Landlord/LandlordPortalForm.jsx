import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Search, MapPin, Navigation } from "lucide-react";
import LocationPicker from "./LocationPicker";

const LandlordPortalForm = () => {
  // Form state management
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

    updatedProperties[index][field] = value;
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

  // Handle room configuration changes
  const handleRoomConfigChange = (propertyIndex, floorIndex, field, value) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[propertyIndex].floors) {
      updatedProperties[propertyIndex].floors = [];
    }

    if (!updatedProperties[propertyIndex].floors[floorIndex]) {
      updatedProperties[propertyIndex].floors[floorIndex] = {};
    }

    updatedProperties[propertyIndex].floors[floorIndex][field] = value;
    setFormData({ ...formData, properties: updatedProperties });

    // Clear error for this field
    if (errors[`property_${propertyIndex}_floor_${floorIndex}_${field}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[
        `property_${propertyIndex}_floor_${floorIndex}_${field}`
      ];
      setErrors(updatedErrors);
    }
  };

  // Handle map location selection
  const handleMapSelection = (propertyIndex, lat, lng, address) => {
    const updatedProperties = [...formData.properties];

    if (!updatedProperties[propertyIndex]) {
      updatedProperties[propertyIndex] = {};
    }

    updatedProperties[propertyIndex].latitude = lat;
    updatedProperties[propertyIndex].longitude = lng;
    updatedProperties[propertyIndex].location = address;

    setFormData({ ...formData, properties: updatedProperties });

    // Clear error for location
    if (errors[`property_${propertyIndex}_location`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`property_${propertyIndex}_location`];
      setErrors(updatedErrors);
    }
  };

  // Update validateStep function to not trigger state updates during validation
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
          if (
            !property.numberOfFloors ||
            parseInt(property.numberOfFloors) < 1
          ) {
            newErrors[`property_${index}_numberOfFloors`] =
              "Please enter at least 1 floor";
          } else if (property.floors) {
            property.floors.forEach((floor, floorIndex) => {
              if (!floor.numberOfRooms || parseInt(floor.numberOfRooms) < 1) {
                newErrors[
                  `property_${index}_floor_${floorIndex}_numberOfRooms`
                ] = "Number of rooms is required";
              }

              if (!floor.sharingOptions || floor.sharingOptions.length === 0) {
                newErrors[
                  `property_${index}_floor_${floorIndex}_sharingOptions`
                ] = "Select at least one sharing option";
              }

              if (!floor.targetTenants) {
                newErrors[
                  `property_${index}_floor_${floorIndex}_targetTenants`
                ] = "Target tenants is required";
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      console.log("Form submitted:", JSON.stringify(formData, null, 2));
      // Here you would typically send the data to your backend
      alert("Properties submitted successfully!");
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
                              className="mb-4 p-3 border border-gray-200 rounded"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: floorIndex * 0.1 }}
                            >
                              <h5 className="font-medium mb-2">
                                Floor {floorIndex + 1}
                              </h5>

                              <div className="mb-3">
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
                                    handleRoomConfigChange(
                                      index,
                                      floorIndex,
                                      "numberOfRooms",
                                      e.target.value
                                    )
                                  }
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

                              <div className="mb-3">
                                <label className="block text-gray-700 mb-1">
                                  Room Sharing Options:
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    "Single",
                                    "Double",
                                    "Triple",
                                    "4 Sharing",
                                  ].map((option) => (
                                    <motion.div
                                      key={option}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className={`px-3 py-1 border rounded cursor-pointer transition-all duration-200 ${
                                        property.floors?.[
                                          floorIndex
                                        ]?.sharingOptions?.includes(option)
                                          ? "bg-red-100 border-blue-300 text-blue-800"
                                          : "bg-white border-gray-300 hover:bg-gray-50"
                                      }`}
                                      onClick={() => {
                                        const updatedProperties = [
                                          ...formData.properties,
                                        ];
                                        if (!updatedProperties[index].floors) {
                                          updatedProperties[index].floors = [];
                                        }
                                        if (
                                          !updatedProperties[index].floors[
                                            floorIndex
                                          ]
                                        ) {
                                          updatedProperties[index].floors[
                                            floorIndex
                                          ] = { sharingOptions: [] };
                                        } else if (
                                          !updatedProperties[index].floors[
                                            floorIndex
                                          ].sharingOptions
                                        ) {
                                          updatedProperties[index].floors[
                                            floorIndex
                                          ].sharingOptions = [];
                                        }

                                        const options =
                                          updatedProperties[index].floors[
                                            floorIndex
                                          ].sharingOptions;
                                        const optionIndex =
                                          options.indexOf(option);

                                        if (optionIndex === -1) {
                                          options.push(option);
                                        } else {
                                          options.splice(optionIndex, 1);
                                        }

                                        setFormData({
                                          ...formData,
                                          properties: updatedProperties,
                                        });

                                        // Clear error if any
                                        if (
                                          errors[
                                            `property_${index}_floor_${floorIndex}_sharingOptions`
                                          ]
                                        ) {
                                          const updatedErrors = { ...errors };
                                          delete updatedErrors[
                                            `property_${index}_floor_${floorIndex}_sharingOptions`
                                          ];
                                          setErrors(updatedErrors);
                                        }
                                      }}
                                    >
                                      {option}
                                    </motion.div> // Closing tag for sharing option
                                  ))}
                                </div>
                                {errors[
                                  `property_${index}_floor_${floorIndex}_sharingOptions`
                                ] && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {
                                      errors[
                                        `property_${index}_floor_${floorIndex}_sharingOptions`
                                      ]
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="mb-3">
                                <label className="block text-gray-700 mb-1">
                                  Target Tenants:
                                </label>
                                <select
                                  value={
                                    property.floors?.[floorIndex]
                                      ?.targetTenants || ""
                                  }
                                  onChange={(e) =>
                                    handleRoomConfigChange(
                                      index,
                                      floorIndex,
                                      "targetTenants",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                                    errors[
                                      `property_${index}_floor_${floorIndex}_targetTenants`
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
                                  `property_${index}_floor_${floorIndex}_targetTenants`
                                ] && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {
                                      errors[
                                        `property_${index}_floor_${floorIndex}_targetTenants`
                                      ]
                                    }
                                  </p>
                                )}
                              </div>
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
                  <p>Type: {property.propertyType || "None selected"}</p>{" "}
                  {/* Updated for single type */}
                  <p>Location: {property.location || "Not specified"}</p>
                  <p>Landmark: {property.landmark || "Not specified"}</p>
                  <p>
                    Amenities:{" "}
                    {property.amenities?.join(", ") || "None selected"}
                  </p>
                  <p>Number of Floors: {property.numberOfFloors || "0"}</p>
                  {property.floors && property.floors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">Floor Details:</p>
                      {property.floors.map((floor, floorIndex) => (
                        <div key={floorIndex} className="ml-3 mt-1">
                          <p>
                            Floor {floorIndex + 1}: {floor.numberOfRooms || "0"}{" "}
                            rooms
                          </p>
                          <p>
                            Sharing Options:{" "}
                            {floor.sharingOptions?.join(", ") || "None"}
                          </p>
                          <p>
                            Target Tenants:{" "}
                            {floor.targetTenants || "Not specified"}
                          </p>
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

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
            ) : (
              <motion.button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ml-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit
              </motion.button>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default LandlordPortalForm;
