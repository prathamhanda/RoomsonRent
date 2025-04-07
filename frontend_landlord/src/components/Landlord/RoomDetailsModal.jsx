import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Plus, Trash2, CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from 'axios';
import backendURL from '@/config/config';
import { toast } from 'react-hot-toast';

const RoomDetailsModal = ({ isOpen, onClose, listing, onSuccess }) => {
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [tenants, setTenants] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [newTenant, setNewTenant] = useState({ name: '', phone: '' });
  const [photoFiles, setPhotoFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState(1); // 1 for selection, 2 for photos, 3 for tenants
  const [uploadingStates, setUploadingStates] = useState([]);
  
  // Reset everything when modal opens/closes or listing changes
  useEffect(() => {
    if (isOpen) {
      setSelectedFloor('');
      setSelectedRoom('');
      setTenants([]);
      setPhotos([]);
      setNewTenant({ name: '', phone: '' });
      setPhotoFiles([]);
      setPreviewUrls([]);
      setUploadingStates([]);
      setStep(1);
    }
  }, [isOpen, listing]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Update file list
      setPhotoFiles([...photoFiles, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
      
      // Add uploading states for new files
      setUploadingStates([...uploadingStates, ...files.map(() => 'pending')]);
    }
  };

  const removePreview = (index) => {
    const updatedFiles = [...photoFiles];
    const updatedPreviews = [...previewUrls];
    const updatedStates = [...uploadingStates];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    updatedStates.splice(index, 1);
    
    setPhotoFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    setUploadingStates(updatedStates);
  };

  const verifyTenant = async () => {
    if (!newTenant.phone || newTenant.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setIsVerifying(true);
    try {
      const response = await axios.get(`${backendURL}/api/users/check-user/${newTenant.phone}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        toast.success('User verified successfully!');
        // If user exists, pre-fill the name from response
        if (response.data.data && response.data.data.name) {
          setNewTenant(prev => ({ ...prev, name: response.data.data.name }));
        }
      } else {
        toast.error('User not found. Please ensure they are registered on the platform.');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('User not found or not registered');
    } finally {
      setIsVerifying(false);
    }
  };

  const addTenant = () => {
    if (!newTenant.name || !newTenant.phone) {
      toast.error('Please fill all tenant details');
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
    if (!selectedFloor || !selectedRoom) {
      toast.error('Please select a floor and room');
      return;
    }

    setIsUploading(true);
    try {
      // First upload photos if any
      let photoUrls = [];
      if (photoFiles.length > 0) {
        const uploadPromises = photoFiles.map(async (file, index) => {
          try {
            // Update state to uploading
            const newUploadingStates = [...uploadingStates];
            newUploadingStates[index] = 'uploading';
            setUploadingStates(newUploadingStates);
            
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await axios.post(
              `${backendURL}/api/uploads/room/${listing._id}/${selectedFloor}/${selectedRoom}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
              }
            );
            
            if (uploadResponse.data.success) {
              // Update state to success
              const newUploadingStates = [...uploadingStates];
              newUploadingStates[index] = 'success';
              setUploadingStates(newUploadingStates);
              
              return uploadResponse.data.data.filePath;
            } else {
              throw new Error('Upload failed');
            }
          } catch (error) {
            // Update state to error
            const newUploadingStates = [...uploadingStates];
            newUploadingStates[index] = 'error';
            setUploadingStates(newUploadingStates);
            
            console.error(`Error uploading file ${index}:`, error);
            return null;
          }
        });
        
        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);
        photoUrls = results.filter(url => url !== null);
      }
      
      // Then update room with photos and tenants
      const floorIndex = listing.floors.findIndex(floor => floor.floorId === selectedFloor);
      const roomIndex = listing.floors[floorIndex].rooms.findIndex(room => room.roomId === selectedRoom);
      
      // Get existing room data
      const room = listing.floors[floorIndex].rooms[roomIndex];
      
      // Update room with new data
      const updatedRoom = {
        ...room,
        photos: [...(room.photos || []), ...photoUrls],
        tenants: tenants
      };
      
      // Create a deep copy of listing to update
      const updatedListing = JSON.parse(JSON.stringify(listing));
      updatedListing.floors[floorIndex].rooms[roomIndex] = updatedRoom;
      
      // Send update to backend
      const updateResponse = await axios.put(
        `${backendURL}/api/listings/${listing._id}`,
        updatedListing,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (updateResponse.data.success) {
        toast.success('Room details updated successfully!');
        onSuccess(updateResponse.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room details');
    } finally {
      setIsUploading(false);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  // Render room configuration based on sharing options
  const renderRoomConfiguration = (room) => {
    if (!room || !room.sharingOptions || room.sharingOptions.length === 0) {
      return 'No sharing options defined';
    }
    
    return room.sharingOptions.join(', ');
  };

  // Render upload status icon based on state
  const renderUploadStatusIcon = (state) => {
    switch (state) {
      case 'uploading':
        return <Loader size={16} className="text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {step === 1 ? 'Select Room' : 
                 step === 2 ? 'Upload Photos' : 'Add Tenants'}
              </h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Floor
                    </label>
                    <select
                      value={selectedFloor}
                      onChange={(e) => {
                        setSelectedFloor(e.target.value);
                        setSelectedRoom('');
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE6F61]"
                    >
                      <option value="">Select a floor</option>
                      {listing?.floors?.map((floor, index) => (
                        <option key={floor.floorId} value={floor.floorId}>
                          Floor {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedFloor && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Room
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {listing?.floors?.find(f => f.floorId === selectedFloor)?.rooms?.map((room, index) => (
                          <div
                            key={room.roomId}
                            onClick={() => setSelectedRoom(room.roomId)}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedRoom === room.roomId
                                ? 'border-[#FE6F61] bg-[#FE6F61]/5 ring-1 ring-[#FE6F61]'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <h3 className="font-medium">Room {index + 1}</h3>
                            <p className="text-sm text-gray-600">
                              {renderRoomConfiguration(room)}
                            </p>
                            <p className="text-sm text-gray-600">
                              For: {room.targetTenants || 'Any'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Add photos of the selected room. Good photos increase tenant interest.
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
                            {uploadingStates[index] !== 'pending' && (
                              <div className="bg-white/80 p-1 rounded-full shadow-md">
                                {renderUploadStatusIcon(uploadingStates[index])}
                              </div>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removePreview(index)}
                              className="bg-white/80 hover:bg-white p-1 rounded-full shadow-md"
                              disabled={uploadingStates[index] === 'uploading'}
                            >
                              <Trash2 size={16} className={`text-red-500 ${uploadingStates[index] === 'uploading' ? 'opacity-50' : ''}`} />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Add current tenants living in this room. These should be registered users of the platform.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-grow">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tenant Name
                        </label>
                        <input
                          type="text"
                          value={newTenant.name}
                          onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                          placeholder="Enter tenant name"
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="flex-grow">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="tel"
                            value={newTenant.phone}
                            onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                            placeholder="10-digit number"
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <button
                            onClick={verifyTenant}
                            disabled={isVerifying}
                            className="px-2 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                          >
                            {isVerifying ? 'Checking...' : 'Verify'}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={addTenant}
                        className="mt-auto p-2 bg-[#FE6F61] text-white rounded-lg hover:bg-[#e5635b] transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    {tenants.length > 0 && (
                      <div className="mt-3">
                        <h3 className="font-medium mb-2">Current Tenants:</h3>
                        <div className="space-y-2">
                          {tenants.map((tenant, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                              <div>
                                <p className="font-medium">{tenant.name}</p>
                                <p className="text-sm text-gray-600">{tenant.phone}</p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeTenant(index)}
                                className="text-red-500 p-1 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 p-4 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div> // Empty div to maintain layout
              )}
              
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && (!selectedFloor || !selectedRoom)) {
                      toast.error('Please select a floor and room first');
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className="px-4 py-2 bg-[#FE6F61] text-white rounded-lg hover:bg-[#e5635b] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className={`px-4 py-2 bg-[#FE6F61] text-white rounded-lg transition-colors ${
                    isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#e5635b]'
                  }`}
                >
                  {isUploading ? 'Saving...' : 'Save Details'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoomDetailsModal; 