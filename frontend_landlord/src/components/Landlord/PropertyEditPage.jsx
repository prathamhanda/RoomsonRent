import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Upload, Camera, Save, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import backendURL from '@/config/config';
import LocationPicker from './LocationPicker';

const PropertyEditPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editMode, setEditMode] = useState('property'); // 'property', 'floor', or 'room'
  const [step, setStep] = useState(1); // Add step state

  // Property level state
  const [propertyDetails, setPropertyDetails] = useState({
    title: '',
    description: '',
    name: '',
    address: '',
    landmark: '',
    propertyType: '',
    furnishingStatus: '',
    amenities: [],
    rules: []
  });

  // Floor level state
  const [floorDetails, setFloorDetails] = useState({
    numberOfRooms: 0
  });

  // Room level state
  const [roomDetails, setRoomDetails] = useState({
    type: 'standard',
    sharingOptions: [],
    targetTenants: '',
    price: '',
    discountedPrice: '',
    photos: []
  });

  // New state for location
  const [location, setLocation] = useState(null);

  // New state for form data
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    description: "",
    propertyType: "",
    address: "",
    landmark: "",
    location: null,
    numberOfFloors: 0,
    floors: [],
    amenities: [],
    active: true
  });

  const [errors, setErrors] = useState({});
  const [deletingImages, setDeletingImages] = useState({});

  // Property types and amenities lists
  const propertyTypes = ["PG", "Flat", "Boys PG", "Girls PG", "Other"];
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

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/listings/${listingId}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const listingData = response.data.data;
        setListing(listingData);
        setPropertyDetails({
          title: listingData.title || '',
          description: listingData.description || '',
          name: listingData.name || '',
          address: listingData.address || '',
          landmark: listingData.landmark || '',
          propertyType: listingData.propertyType || '',
          furnishingStatus: listingData.furnishingStatus || '',
          amenities: listingData.amenities || [],
          rules: listingData.rules || []
        });
        setFormData({
          title: listingData.title,
          name: listingData.name,
          description: listingData.description,
          propertyType: listingData.propertyType,
          address: listingData.address,
          landmark: listingData.landmark,
          location: listingData.location,
          numberOfFloors: listingData.numberOfFloors,
          floors: listingData.floors,
          amenities: listingData.amenities,
          active: listingData.active
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load property details');
      setLoading(false);
    }
  };

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
    setEditMode('floor');
    setFloorDetails({
      numberOfRooms: floor.numberOfRooms
    });
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setEditMode('room');
    setRoomDetails({
      type: room.type || 'standard',
      sharingOptions: room.sharingOptions || [],
      targetTenants: room.targetTenants || '',
      price: room.price || '',
      discountedPrice: room.discountedPrice || '',
      photos: room.photos || []
    });
  };

  const handlePropertyUpdate = async () => {
    setSaving(true);
    try {
      const updatedListing = {
        ...listing,
        ...propertyDetails
      };

      const response = await axios.put(
        `${backendURL}/api/listings/${listingId}`,
        updatedListing,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success('Property details updated successfully');
        setListing(response.data.data);
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property details');
    } finally {
      setSaving(false);
    }
  };

  const handleFloorUpdate = async () => {
    setSaving(true);
    try {
      const updatedFloors = [...listing.floors];
      const floorIndex = updatedFloors.findIndex(f => f.floorId === selectedFloor.floorId);
      
      if (floorIndex !== -1) {
        updatedFloors[floorIndex] = {
          ...updatedFloors[floorIndex],
          ...floorDetails
        };

        const response = await axios.put(
          `${backendURL}/api/listings/${listingId}`,
          {
            ...listing,
            floors: updatedFloors
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          toast.success('Floor details updated successfully');
          setListing(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error updating floor:', error);
      toast.error('Failed to update floor details');
    } finally {
      setSaving(false);
    }
  };

  const handleRoomUpdate = async () => {
    setSaving(true);
    try {
      const updatedFloors = [...listing.floors];
      const floorIndex = updatedFloors.findIndex(f => f.floorId === selectedFloor.floorId);
      
      if (floorIndex !== -1) {
        const roomIndex = updatedFloors[floorIndex].rooms.findIndex(r => r.roomId === selectedRoom.roomId);
        
        if (roomIndex !== -1) {
          // Format roomDetails for update - ensure price values are valid numbers
          let price = roomDetails.price;
          if (price === '') price = null;
          else if (typeof price === 'string') price = parseFloat(price);
          else if (typeof price !== 'number') price = null;
          
          let discountedPrice = roomDetails.discountedPrice;
          if (discountedPrice === '') discountedPrice = undefined;
          else if (typeof discountedPrice === 'string') discountedPrice = parseFloat(discountedPrice);
          else if (typeof discountedPrice !== 'number') discountedPrice = undefined;
          
          const formattedRoomDetails = {
            ...roomDetails,
            price: price,
            discountedPrice: discountedPrice
          };
          
          // If discountedPrice is undefined or null, remove it from the object
          if (formattedRoomDetails.discountedPrice === undefined || formattedRoomDetails.discountedPrice === null) {
            delete formattedRoomDetails.discountedPrice;
          }
          
          console.log("Updating room with data:", formattedRoomDetails);
          
          updatedFloors[floorIndex].rooms[roomIndex] = {
            ...updatedFloors[floorIndex].rooms[roomIndex],
            ...formattedRoomDetails
          };

          const response = await axios.put(
            `${backendURL}/api/listings/${listingId}`,
            {
              ...listing,
              floors: updatedFloors
            },
            {
              headers: {
                'Content-Type': 'application/json'
              },
              withCredentials: true
            }
          );

          if (response.data.success) {
            toast.success('Room details updated successfully');
            setListing(response.data.data);
          }
        }
      }
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room details');
    } finally {
      setSaving(false);
    }
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (files, floorId, roomId) => {
    const loadingToast = toast.loading(`Uploading ${files.length} images...`);
    
    try {
      const formData = new FormData();
      
      // Add each file to the form data
      Array.from(files).forEach(file => {
        formData.append('file', file);
        console.log(`Adding file to upload: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      });

      const response = await axios.post(
        `${backendURL}/api/uploads/room/${listingId}/${floorId}/${roomId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
          timeout: 300000, // 5 minute timeout
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            toast.loading(`Uploading: ${percentCompleted}%`, { id: loadingToast });
          }
        }
      );

      if (response.data.success) {
        const uploadedCount = response.data.data.filePaths.length;
        toast.success(`Successfully uploaded ${uploadedCount} of ${files.length} images`, { id: loadingToast });
        return response.data.data.filePaths;
      } else {
        toast.error('Upload failed - server returned error', { id: loadingToast });
        return [];
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      
      let errorMessage = "Error uploading images";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timed out. Please try again.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      }
      
      toast.error(errorMessage, { id: loadingToast });
      return [];
    }
  };

  // Handle image deletion
  const handleImageDelete = async (imageUrl, floorId, roomId) => {
    try {
      // Set loading state for this specific image
      setDeletingImages(prev => ({ ...prev, [imageUrl]: true }));
      
      // First delete the image from Cloudinary
      await axios.post(
        `${backendURL}/api/cloudinary/delete-by-url`,
        { imageUrl },
        { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout for deletion
        }
      );

      // Then update the local state to provide immediate feedback
      const updatedFormData = { ...formData };
      const floorIndex = updatedFormData.floors.findIndex(f => f.floorId === floorId);
      if (floorIndex !== -1) {
        const roomIndex = updatedFormData.floors[floorIndex].rooms.findIndex(r => r.roomId === roomId);
        if (roomIndex !== -1) {
          // Remove the image URL from the room's photos array
          updatedFormData.floors[floorIndex].rooms[roomIndex].photos = 
            updatedFormData.floors[floorIndex].rooms[roomIndex].photos.filter(photo => photo !== imageUrl);
          
          // Update the listing in the backend
          const response = await axios.put(
            `${backendURL}/api/listings/${listingId}`,
            updatedFormData,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true
            }
          );

          if (response.data.success) {
            setFormData(updatedFormData);
            toast.success("Image deleted successfully");
          } else {
            throw new Error("Failed to update listing");
          }
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image. Please try again.");
      // Refresh the listing data to ensure UI is in sync with backend
      fetchListing();
    } finally {
      // Clear loading state
      setDeletingImages(prev => {
        const newState = { ...prev };
        delete newState[imageUrl];
        return newState;
      });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If name or title is being updated, sync both fields
    if (name === 'name' || name === 'title') {
      setFormData(prev => ({
        ...prev,
        name: value,
        title: value
      }));
      if (errors.name) {
        const updatedErrors = { ...errors };
        delete updatedErrors.name;
        delete updatedErrors.title;
        setErrors(updatedErrors);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        const updatedErrors = { ...errors };
        delete updatedErrors[name];
        setErrors(updatedErrors);
      }
    }
  };

  // Handle property type selection
  const handleTypeSelection = (type) => {
    setFormData({ ...formData, propertyType: type });
    if (errors.propertyType) {
      const updatedErrors = { ...errors };
      delete updatedErrors.propertyType;
      setErrors(updatedErrors);
    }
  };

  // Handle amenity selection
  const handleAmenitySelection = (amenity) => {
    const updatedAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  // Handle location selection
  const handleMapSelection = (lat, lng, address, city, state) => {
    setFormData({
      ...formData,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
        city,
        state,
        country: 'India'
      },
      address
    });
  };

  // Handle floor changes
  const handleFloorChange = (floorIndex, field, value) => {
    const updatedFloors = [...formData.floors];
    if (!updatedFloors[floorIndex]) {
      updatedFloors[floorIndex] = { rooms: [] };
    }

    if (field === 'numberOfRooms') {
      const numRooms = parseInt(value) || 0;
      updatedFloors[floorIndex].numberOfRooms = numRooms;
      updatedFloors[floorIndex].rooms = updatedFloors[floorIndex].rooms
        .slice(0, numRooms)
        .concat(Array(Math.max(0, numRooms - updatedFloors[floorIndex].rooms.length))
          .fill()
          .map(() => ({
            roomId: `room_${Math.random().toString(36).substring(2, 10)}`,
            type: 'standard',
            sharingOptions: [],
            targetTenants: '',
            photos: []
          }))
        );
    } else {
      updatedFloors[floorIndex][field] = value;
    }

    setFormData({ ...formData, floors: updatedFloors });
  };

  // Handle room configuration changes
  const handleRoomConfigChange = (floorIndex, roomIndex, field, value) => {
    const updatedFloors = [...formData.floors];
    if (!updatedFloors[floorIndex].rooms[roomIndex]) {
      updatedFloors[floorIndex].rooms[roomIndex] = {};
    }
    
    // Special handling for price fields to ensure they're stored correctly
    if (field === 'price' || field === 'discountedPrice') {
      if (value === '') {
        // For empty string, just store it as is
        updatedFloors[floorIndex].rooms[roomIndex][field] = value;
      } else if (typeof value === 'number') {
        // If it's already a number, store it directly
        updatedFloors[floorIndex].rooms[roomIndex][field] = value;
      } else {
        // Try to parse as a number
        const numValue = parseFloat(value);
        updatedFloors[floorIndex].rooms[roomIndex][field] = isNaN(numValue) ? 0 : numValue;
      }
    } else {
      // For non-price fields, store the value as-is
      updatedFloors[floorIndex].rooms[roomIndex][field] = value;
    }
    
    setFormData({ ...formData, floors: updatedFloors });
  };

  // Handle room sharing selection
  const handleRoomSharingSelection = (floorIndex, roomIndex, sharingOption) => {
    const updatedFloors = [...formData.floors];
    const room = updatedFloors[floorIndex].rooms[roomIndex];
    
    if (!room.sharingOptions) {
      room.sharingOptions = [];
    }

    const optionIndex = room.sharingOptions.indexOf(sharingOption);
    if (optionIndex === -1) {
      room.sharingOptions.push(sharingOption);
    } else {
      room.sharingOptions.splice(optionIndex, 1);
    }

    setFormData({ ...formData, floors: updatedFloors });
  };

  // Handle tenant management
  const handleTenantVerification = async (phone, floorIndex, roomIndex) => {
    try {
      const response = await axios.get(
        `${backendURL}/api/users/check-user/${phone}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const tenant = response.data.data;
        const updatedFloors = [...formData.floors];
        const room = updatedFloors[floorIndex].rooms[roomIndex];
        
        if (!room.tenants) {
          room.tenants = [];
        }

        // Check if tenant is already added
        if (!room.tenants.some(t => t.userId === tenant._id)) {
          room.tenants.push({
            userId: tenant._id,
            name: tenant.name,
            phone: tenant.phone,
            assignedAt: new Date()
          });
        }

        setFormData({ ...formData, floors: updatedFloors });
        toast.success(`Tenant ${tenant.name} verified and added`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying tenant");
    }
  };

  // Handle tenant removal
  const handleTenantRemoval = (floorIndex, roomIndex, tenantId) => {
    const updatedFloors = [...formData.floors];
    const room = updatedFloors[floorIndex].rooms[roomIndex];
    room.tenants = room.tenants.filter(t => t.userId !== tenantId);
    setFormData({ ...formData, floors: updatedFloors });
  };

  // Add a new function to handle floor activation
  const toggleFloorActive = (floorIndex, isActive) => {
    const updatedFloors = [...formData.floors];
    
    if (!updatedFloors[floorIndex]) {
      updatedFloors[floorIndex] = { rooms: [] };
    }
    
    updatedFloors[floorIndex].active = isActive;
    
    // If activating the floor, ensure it has at least 1 room
    if (isActive && (!updatedFloors[floorIndex].numberOfRooms || 
        updatedFloors[floorIndex].numberOfRooms < 1)) {
      updatedFloors[floorIndex].numberOfRooms = 1;
    }
    
    setFormData({ ...formData, floors: updatedFloors });
    
    // Clear any related errors
    if (errors[`floor_${floorIndex}_numberOfRooms`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`floor_${floorIndex}_numberOfRooms`];
      setErrors(updatedErrors);
    }
  };

  // Validation functions
  const validateStep = (currentStep) => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.name?.trim()) {
          newErrors.name = "Property name is required";
        }
        if (!formData.propertyType) {
          newErrors.propertyType = "Please select a property type";
        }
        break;

      case 2:
        if (!formData.address?.trim()) {
          newErrors.address = "Location is required";
        }
        break;

      case 3:
        if (!formData.numberOfFloors || formData.numberOfFloors < 1) {
          newErrors.numberOfFloors = "Please enter at least 1 floor";
        }
        
        // Check if at least one floor is active
        const hasActiveFloor = formData.floors?.some(floor => 
          floor.active !== false && floor.numberOfRooms > 0);
          
        if (!hasActiveFloor) {
          newErrors.activeFloors = "At least one floor must be available for rent";
        }
        
        formData.floors?.forEach((floor, floorIndex) => {
          // Skip validation for inactive floors
          if (floor.active === false) {
            return;
          }
          
          if (!floor.numberOfRooms || floor.numberOfRooms < 1) {
            newErrors[`floor_${floorIndex}_rooms`] = "Number of rooms is required";
          }
          
          floor.rooms?.forEach((room, roomIndex) => {
            if (!room.sharingOptions?.length) {
              newErrors[`floor_${floorIndex}_room_${roomIndex}_sharing`] = "Select at least one sharing option";
            }
            if (!room.targetTenants) {
              newErrors[`floor_${floorIndex}_room_${roomIndex}_tenants`] = "Target tenants is required";
            }
          });
        });
        break;

      default:
        break;
    }

    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  // Navigation handlers
  const handleNextStep = () => {
    const { isValid, errors: validationErrors } = validateStep(step);
    if (isValid) {
      setStep(step + 1);
    } else {
      setErrors(validationErrors);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateStep(step);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.put(
        `${backendURL}/api/listings/${listingId}`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success("Property updated successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating property");
    }
  };

  // Render different steps
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
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Basic Details</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Property Name/Title:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                }`}
                placeholder="Enter property name/title"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">This will be used as both the property name and title</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Property Type:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {propertyTypes.map((type) => (
                  <motion.div
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 border rounded cursor-pointer transition-all duration-200 ${
                      formData.propertyType === type
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => handleTypeSelection(type)}
                  >
                    <div className="flex items-center justify-center">
                      <span>{type}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              {errors.propertyType && (
                <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
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
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Location & Amenities</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Location:</label>
              <LocationPicker
                initialPosition={
                  formData.location?.coordinates
                    ? {
                        lat: formData.location.coordinates[1],
                        lng: formData.location.coordinates[0]
                      }
                    : null
                }
                onSelectLocation={(lat, lng, address, city, state) =>
                  handleMapSelection(lat, lng, address, city, state)
                }
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Landmark:</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
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
                    onClick={() => handleAmenitySelection(amenity.name)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        formData.amenities?.includes(amenity.name)
                          ? "bg-[rgb(254,111,97)] text-white shadow-md"
                          : "bg-white border-2 border-gray-200 hover:border-[rgb(254,111,97)]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{amenity.icon}</span>
                      <span className="text-sm font-medium">{amenity.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Rooms & Tenants</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Number of Floors:</label>
              <input
                type="number"
                min="1"
                name="numberOfFloors"
                value={formData.numberOfFloors}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData({
                    ...formData,
                    numberOfFloors: value,
                    floors: Array(value)
                      .fill()
                      .map((_, index) => formData.floors[index] || { rooms: [] })
                  });
                }}
                className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                  errors.numberOfFloors
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                }`}
              />
              {errors.numberOfFloors && (
                <p className="text-red-500 text-sm mt-1">{errors.numberOfFloors}</p>
              )}
            </div>
            
            {errors.activeFloors && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-500 text-sm">{errors.activeFloors}</p>
                <p className="text-gray-700 text-xs mt-1">Please make at least one floor available by toggling the switch.</p>
              </div>
            )}

            {formData.floors?.map((floor, floorIndex) => (
              <motion.div
                key={floor.floorId || floorIndex}
                className="mb-6 p-4 border border-gray-200 rounded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: floorIndex * 0.1 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-[rgb(254,111,97)]">
                    {floorIndex === 0 ? "Ground Floor" : `Floor ${floorIndex}`}
                  </h3>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer mr-2">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={floor.active !== false}
                        onChange={(e) => toggleFloorActive(floorIndex, e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[rgb(254,111,97)] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[rgb(254,111,97)]"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {floor.active !== false ? "Available" : "Not Available"}
                      </span>
                    </label>
                  </div>
                </div>

                {floor.active !== false ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Number of Rooms:</label>
                      <input
                        type="number"
                        min="1"
                        value={floor.numberOfRooms || ""}
                        onChange={(e) => handleFloorChange(floorIndex, "numberOfRooms", e.target.value)}
                        className={`w-full p-3 border-2 rounded-lg transition-all duration-200 ${
                          errors[`floor_${floorIndex}_rooms`]
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                        }`}
                      />
                      {errors[`floor_${floorIndex}_rooms`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`floor_${floorIndex}_rooms`]}
                        </p>
                      )}
                    </div>

                    {floor.rooms?.map((room, roomIndex) => (
                      <div
                        key={room.roomId || roomIndex}
                        className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <h4 className="font-medium mb-3">Room {roomIndex + 1}</h4>

                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Sharing Options:</label>
                          <div className="flex flex-wrap gap-2">
                            {["Single", "Double", "Triple", "4 Sharing"].map((option) => (
                              <motion.div
                                key={option}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-1 border rounded cursor-pointer transition-all duration-200 ${
                                  room.sharingOptions?.includes(option)
                                    ? "bg-blue-100 border-blue-300 text-blue-800"
                                    : "bg-white border-gray-300 hover:bg-gray-50"
                                }`}
                                onClick={() => handleRoomSharingSelection(floorIndex, roomIndex, option)}
                              >
                                {option}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Target Tenants:</label>
                          <select
                            value={room.targetTenants || ""}
                            onChange={(e) =>
                              handleRoomConfigChange(
                                floorIndex,
                                roomIndex,
                                "targetTenants",
                                e.target.value
                              )
                            }
                            className="w-full p-3 border-2 rounded-lg transition-all duration-200 border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                          >
                            <option value="">Select target tenants</option>
                            <option value="Students">Students</option>
                            <option value="Working Professionals">Working Professionals</option>
                            <option value="Family">Family</option>
                            <option value="Any">Any</option>
                          </select>
                        </div>

                        {/* Room Pricing */}
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Original Price (₹/month):</label>
                          <input
                            type="number"
                            min="0"
                            value={room.price || ""}
                            onChange={(e) => {
                              const numValue = e.target.value === '' ? '' : parseFloat(e.target.value);
                              handleRoomConfigChange(
                                floorIndex,
                                roomIndex,
                                "price",
                                numValue
                              );
                            }}
                            placeholder="e.g., 5000"
                            className="w-full p-3 border-2 rounded-lg transition-all duration-200 border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Discounted Price (₹/month):</label>
                          <input
                            type="number"
                            min="0"
                            value={room.discountedPrice || ""}
                            onChange={(e) => {
                              const numValue = e.target.value === '' ? '' : parseFloat(e.target.value);
                              handleRoomConfigChange(
                                floorIndex,
                                roomIndex,
                                "discountedPrice",
                                numValue
                              );
                            }}
                            placeholder="e.g., 4500 (optional)"
                            className="w-full p-3 border-2 rounded-lg transition-all duration-200 border-gray-200 focus:border-[rgb(254,111,97)] focus:ring-2 focus:ring-[rgb(254,111,97)]"
                          />
                          <p className="text-gray-500 text-xs mt-1">Leave empty if no discount is offered</p>
                        </div>

                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Room Photos:</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {room.photos?.map((photo, photoIndex) => (
                              <div key={photoIndex} className="relative group">
                                <img
                                  src={photo}
                                  alt={`Room ${roomIndex + 1} photo ${photoIndex + 1}`}
                                  className={`w-full h-32 object-cover rounded-lg ${deletingImages[photo] ? 'opacity-50' : ''}`}
                                />
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleImageDelete(photo, floor.floorId, room.roomId)}
                                  disabled={deletingImages[photo]}
                                  className={`absolute top-2 right-2 p-1.5 rounded-full shadow-lg 
                                    ${deletingImages[photo] ? 
                                      'bg-gray-400 cursor-not-allowed' : 
                                      'bg-white/90 hover:bg-red-500 hover:text-white text-red-500 opacity-0 group-hover:opacity-100'
                                    } transition-all duration-200`}
                                >
                                  {deletingImages[photo] ? (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </motion.button>
                              </div>
                            ))}
                            <motion.label 
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[rgb(254,111,97)] cursor-pointer transition-all duration-200 hover:bg-gray-50"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  if (e.target.files?.length) {
                                    const urls = await handleImageUpload(
                                      e.target.files,
                                      floor.floorId,
                                      room.roomId
                                    );
                                    if (urls?.length > 0) {
                                      const updatedFloors = [...formData.floors];
                                      const updatedRoom = updatedFloors[floorIndex].rooms[roomIndex];
                                      updatedRoom.photos = [...(updatedRoom.photos || []), ...urls];
                                      setFormData({ ...formData, floors: updatedFloors });
                                    }
                                  }
                                }}
                              />
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="w-6 h-6 text-gray-400" />
                                <p className="text-sm text-gray-500">Upload Photos</p>
                              </div>
                            </motion.label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500">
                    This floor is not available for rent
                  </div>
                )}
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
          >
            <h2 className="text-2xl font-bold text-[rgb(254,111,97)] mb-6">Review & Submit</h2>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Basic Details</h3>
                <p><span className="font-medium">Name:</span> {formData.name}</p>
                <p><span className="font-medium">Type:</span> {formData.propertyType}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Location</h3>
                <p>{formData.address}</p>
                {formData.landmark && <p><span className="font-medium">Landmark:</span> {formData.landmark}</p>}
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities?.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Rooms Configuration</h3>
                {formData.floors?.map((floor, floorIndex) => (
                  <div key={floor.floorId} className="mb-4 pl-4 border-l-2 border-gray-200">
                    <h4 className="font-medium">
                      {floorIndex === 0 ? "Ground Floor" : `Floor ${floorIndex}`}
                    </h4>
                    <div className="grid gap-4 mt-2">
                      {floor.rooms?.map((room, roomIndex) => (
                        <div key={room.roomId} className="pl-4 border-l border-gray-200">
                          <h5 className="font-medium">Room {roomIndex + 1}</h5>
                          <p>Sharing: {room.sharingOptions?.join(", ")}</p>
                          <p>Target: {room.targetTenants}</p>
                          <p>Price: ₹{room.price} {room.discountedPrice && <span className="text-green-600">( Discounted: ₹{room.discountedPrice} )</span>}</p>
                          <p>Photos: {room.photos?.length || 0}</p>
                          <p>Tenants: {room.tenants?.length || 0}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[rgb(254,111,97)]"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-white rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-center text-[rgb(254,111,97)] mb-4">
              Edit Property
            </h1>
            
            <div className="flex justify-center mt-6">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step === stepNumber
                        ? "bg-[rgb(254,111,97)] text-white"
                        : step > stepNumber
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {stepNumber}
                  </motion.div>
                  {stepNumber < 4 && (
                    <div
                      className={`w-16 h-1 transition-all duration-300 ${
                        step > stepNumber ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <motion.div
            className="flex justify-between mt-6 bg-white p-4 rounded-lg shadow-md"
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

            <motion.button
              type="button"
              onClick={step < 4 ? handleNextStep : handleSubmit}
              className={`px-6 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ml-auto ${
                step < 4
                  ? "bg-[rgb(254,111,97)] text-white hover:bg-[rgb(234,91,77)] focus:ring-[rgb(254,111,97)]"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {step < 4 ? "Next" : "Update Property"}
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyEditPage; 