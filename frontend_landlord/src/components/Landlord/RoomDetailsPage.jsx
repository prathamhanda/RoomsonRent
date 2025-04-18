import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Trash2, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import backendURL from '@/config/config';
import { toast } from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const RoomDetailsPage = () => {
  const { listingId, floorId, roomId } = useParams();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [newTenant, setNewTenant] = useState({ name: '', phone: '' });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingStates, setUploadingStates] = useState([]);
  const [skipTenants, setSkipTenants] = useState(false);
  const [skipPhotos, setSkipPhotos] = useState(false);

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/listings/${listingId}`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          setListing(response.data.data);
          
          // Find selected floor and room
          const floor = response.data.data.floors.find(f => f.floorId === floorId);
          if (floor) {
            setSelectedFloor(floor);
            const room = floor.rooms.find(r => r.roomId === roomId);
            if (room) {
              setSelectedRoom(room);
              setTenants(room.tenants || []);
              setPhotos(room.photos || []);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing details');
      }
    };

    if (listingId && floorId && roomId) {
      fetchListing();
    }
  }, [listingId, floorId, roomId]);

  // Get floor and room numbers
  const getFloorAndRoomNumbers = () => {
    if (!listing || !selectedFloor || !selectedRoom) return { floorNum: '1', roomNum: '1' };

    const floorIndex = listing.floors.findIndex(f => f.floorId === floorId);
    const roomIndex = selectedFloor.rooms.findIndex(r => r.roomId === roomId);

    return {
      floorNum: (floorIndex + 1).toString(),
      roomNum: (roomIndex + 1).toString()
    };
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Update file list
      setPhotoFiles([...photoFiles, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removePreview = (index) => {
    const updatedFiles = [...photoFiles];
    const updatedPreviews = [...previewUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setPhotoFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const checkAndFillUserData = async (phone) => {
    if (!phone || phone.length !== 10) return;

    try {
      const response = await axios.get(`${backendURL}/api/users/check-user/${phone}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const userData = response.data.data;
        setNewTenant(prev => ({ 
          ...prev, 
          name: userData.name,
          userId: userData._id
        }));
        toast.success('Found registered user!');
      }
    } catch (error) {
      // User not found - just clear the name field
      setNewTenant(prev => ({
        ...prev,
        name: '',
        userId: undefined
      }));
    }
  };

  const createOrGetTenant = async () => {
    if (!newTenant.phone || newTenant.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/users/create-or-get`,
        {
          phone: newTenant.phone,
          name: newTenant.name,
          email: `${newTenant.phone}@placeholder.com`,
          role: 'user',
          verified: false,
          avatar: '',
          currentRooms: [],
          gender: 'not_specified',
          address: '',
          city: '',
          state: '',
          pincode: '',
          otp: null
        },
        {
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        const userData = response.data.data;
        const tenantData = {
          userId: userData._id, // Ensure we have the userId
          name: userData.name,
          phone: userData.phone
        };
        
        // Update newTenant state with the user data
        setNewTenant(tenantData);
        
        // Add the tenant with complete data including userId
        setTenants(prev => [...prev, tenantData]);
        
        // Reset the form
        setNewTenant({ name: '', phone: '' });
        toast.success('Tenant added successfully!');
      }
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast.error(error.response?.data?.error || 'Failed to add tenant');
    }
  };

  const addTenant = () => {
    if (!newTenant.phone) {
      toast.error('Please enter a phone number');
      return;
    }
    
    // For unregistered users, require a name
    if (!newTenant.userId && !newTenant.name) {
      toast.error('Please enter tenant name');
      return;
    }
    
    // Check if tenant is already added
    if (tenants.some(t => t.phone === newTenant.phone)) {
      toast.error('This tenant is already added');
      return;
    }
    
    setTenants([...tenants, { ...newTenant }]);
    setNewTenant({ name: '', phone: '' });
  };

  const removeTenant = (index) => {
    const updatedTenants = [...tenants];
    updatedTenants.splice(index, 1);
    setTenants(updatedTenants);
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      // First upload photos if any and not skipped
      let photoUrls = [...photos];
      if (!skipPhotos && photoFiles.length > 0) {
        const uploadPromises = photoFiles.map(async (file, index) => {
          try {
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await axios.post(
              `${backendURL}/api/uploads/room/${listingId.replace(/['"]/g, '')}/${floorId}/${roomId}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
              }
            );
            
            if (uploadResponse.data.success) {
              return uploadResponse.data.data.filePath;
            }
            return null;
          } catch (error) {
            console.error(`Error uploading file ${index}:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(uploadPromises);
        photoUrls = [...photoUrls, ...results.filter(url => url !== null)];
      }
      
      // Create a deep copy of the listing for updates
      const updatedListing = JSON.parse(JSON.stringify(listing));
      
      // Find the floor and room indices
      const floorIndex = updatedListing.floors.findIndex(floor => floor.floorId === floorId);
      if (floorIndex === -1) {
        throw new Error('Floor not found');
      }

      const roomIndex = updatedListing.floors[floorIndex].rooms.findIndex(room => room.roomId === roomId);
      if (roomIndex === -1) {
        throw new Error('Room not found');
      }

      // Get the current room data
      const currentRoom = updatedListing.floors[floorIndex].rooms[roomIndex];
      
      // Update room data while preserving other properties
      updatedListing.floors[floorIndex].rooms[roomIndex] = {
        ...currentRoom, // Preserve all existing room properties
        photos: skipPhotos ? currentRoom.photos : photoUrls,
        tenants: skipTenants ? currentRoom.tenants : tenants.map(tenant => ({
          userId: tenant.userId,  // This should be a valid MongoDB ObjectId
          name: tenant.name,
          phone: tenant.phone,
          assignedAt: new Date().toISOString()
        }))
      };

      // Update the listing
      const updateResponse = await axios.put(
        `${backendURL}/api/listings/${listingId.replace(/['"]/g, '')}`,
        updatedListing,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (!skipTenants && updateResponse.data.success) {
        // Update each tenant's user record
        const tenantUpdatePromises = tenants.map(tenant =>
          axios.put(
            `${backendURL}/api/users/assign-room/${tenant.userId}`,
            {
              listingId: listingId.replace(/['"]/g, ''),
              floorId,
              roomId
            },
            { withCredentials: true }
          )
        );

        await Promise.all(tenantUpdatePromises);
      }
      
      if (updateResponse.data.success) {
        toast.success('Room details updated successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating room:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update room details');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    try {
      // Create a deep copy of the listing for updates
      const updatedListing = JSON.parse(JSON.stringify(listing));
      
      // Find the floor and room indices
      const floorIndex = updatedListing.floors.findIndex(floor => floor.floorId === floorId);
      const roomIndex = updatedListing.floors[floorIndex].rooms.findIndex(room => room.roomId === roomId);
      
      // Remove the photo from the room's photos array
      updatedListing.floors[floorIndex].rooms[roomIndex].photos = 
        updatedListing.floors[floorIndex].rooms[roomIndex].photos.filter(photo => photo !== photoUrl);
      
      // Update the listing in the backend
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
        // Update local state
        setListing(updatedListing);
        setPhotos(updatedListing.floors[floorIndex].rooms[roomIndex].photos);
        toast.success('Photo deleted successfully');
      } else {
        throw new Error('Failed to update listing');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  if (!listing || !selectedFloor || !selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size={40} className="text-[#FE6F61] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Room Details
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {`Floor ${getFloorAndRoomNumbers().floorNum}, Room ${getFloorAndRoomNumbers().roomNum}`}
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Photo Upload Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Room Photos</h2>
                <button
                  onClick={() => setSkipPhotos(!skipPhotos)}
                  className={`text-sm font-medium ${
                    skipPhotos ? 'text-[#FE6F61]' : 'text-gray-500'
                  }`}
                >
                  {skipPhotos ? 'Add Photos' : 'Skip Photos'}
                </button>
              </div>

              {!skipPhotos && (
                <>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Add photos of the room. Good photos increase tenant interest.
                    </p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="room-photos"
                    />
                    <label
                      htmlFor="room-photos"
                      className="flex flex-col items-center justify-center cursor-pointer py-6"
                    >
                      <Upload size={40} className="text-gray-400 mb-2" />
                      <span className="text-gray-600 font-medium">Click to upload photos</span>
                      <span className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</span>
                    </label>
                  </div>
                  
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute top-1 right-1 flex space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removePreview(index)}
                              className="bg-white/80 hover:bg-white p-1 rounded-full shadow-md"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Tenant Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Room Tenants</h2>
                <button
                  onClick={() => setSkipTenants(!skipTenants)}
                  className={`text-sm font-medium ${
                    skipTenants ? 'text-[#FE6F61]' : 'text-gray-500'
                  }`}
                >
                  {skipTenants ? 'Add Tenants' : 'Skip Tenants'}
                </button>
              </div>

              {!skipTenants && (
                <>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={newTenant.phone}
                          onChange={(e) => {
                            const phone = e.target.value;
                            setNewTenant(prev => ({ ...prev, phone }));
                            if (phone.length === 10) {
                              checkAndFillUserData(phone);
                            }
                          }}
                          placeholder="10-digit number"
                          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent"
                        />
                      </div>
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTenant.name}
                            onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                            placeholder="Tenant name"
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent"
                          />
                          <button
                            onClick={createOrGetTenant}
                            disabled={!newTenant.phone || (!newTenant.userId && !newTenant.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              !newTenant.phone || (!newTenant.userId && !newTenant.name)
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-[#FE6F61] text-white hover:bg-[#e5635b]'
                            }`}
                          >
                            Add Tenant
                          </button>
                        </div>
                      </div>
                    </div>

                    {tenants.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-900 mb-3">Added Tenants</h3>
                        <div className="space-y-3">
                          {tenants.map((tenant, index) => (
                            <div 
                              key={index} 
                              className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{tenant.name}</p>
                                <p className="text-sm text-gray-600">{tenant.phone}</p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeTenant(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                              >
                                <Trash2 size={20} />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isUploading || (!skipTenants && tenants.length === 0)}
                className={`px-6 py-3 bg-[#FE6F61] text-white rounded-lg transition-colors ${
                  isUploading || (!skipTenants && tenants.length === 0)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#e5635b]'
                }`}
              >
                {isUploading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage; 