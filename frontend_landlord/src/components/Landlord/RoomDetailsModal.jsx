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
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    userData: null
  });
  
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
    setVerificationStatus({ isVerified: false, userData: null });

    try {
      const response = await axios.get(`${backendURL}/api/users/check-user/${newTenant.phone}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const userData = response.data.data;
        setVerificationStatus({
          isVerified: true,
          userData: userData
        });
        setNewTenant(prev => ({ 
          ...prev, 
          name: userData.name,
          userId: userData._id // Store user ID for later use
        }));
        toast.success('User verified successfully!');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setVerificationStatus({ isVerified: false, userData: null });
      toast.error('User not found or not registered');
    } finally {
      setIsVerifying(false);
    }
  };

  const addTenant = () => {
    if (!verificationStatus.isVerified) {
      toast.error('Please verify the tenant first');
      return;
    }
    
    if (!newTenant.name || !newTenant.phone) {
      toast.error('Please fill all tenant details');
      return;
    }
    
    // Check if tenant is already added
    if (tenants.some(t => t.phone === newTenant.phone)) {
      toast.error('This tenant is already added');
      return;
    }
    
    setTenants([...tenants, { ...newTenant }]);
    setNewTenant({ name: '', phone: '' });
    setVerificationStatus({ isVerified: false, userData: null });
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
      
      // Associate tenants with the room
      const tenantAssignPromises = tenants.map(tenant => 
        axios.put(
          `${backendURL}/api/users/assign-room/${tenant.userId}`,
          {
            listingId: listing._id,
            floorId: selectedFloor,
            roomId: selectedRoom
          },
          { withCredentials: true }
        )
      );

      // Wait for all tenant assignments to complete
      await Promise.all(tenantAssignPromises);
      
      // Then update room with photos and tenants
      const floorIndex = listing.floors.findIndex(floor => floor.floorId === selectedFloor);
      const roomIndex = listing.floors[floorIndex].rooms.findIndex(room => room.roomId === selectedRoom);
      
      // Get existing room data
      const room = listing.floors[floorIndex].rooms[roomIndex];
      
      // Update room with new data
      const updatedRoom = {
        ...room,
        photos: [...(room.photos || []), ...photoUrls],
        tenants: tenants.map(tenant => ({
          userId: tenant.userId,
          name: tenant.name,
          phone: tenant.phone
        }))
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
    hidden: { opacity: 0, y: "100%", scale: 1 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0,
      y: "100%",
      transition: { 
        duration: 0.2,
        ease: 'easeIn'
      }
    }
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
          className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center sm:items-center p-0 sm:p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-3xl sm:rounded-xl shadow-xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {step === 1 ? 'Select Room' : 
                 step === 2 ? 'Upload Photos' : 'Add Tenants'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto h-[calc(100vh-120px)] sm:h-auto sm:max-h-[calc(90vh-120px)] p-4">
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
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Add current tenants living in this room. Only verified users can be added as tenants.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={newTenant.phone}
                            onChange={(e) => {
                              setNewTenant({ ...newTenant, phone: e.target.value });
                              setVerificationStatus({ isVerified: false, userData: null });
                            }}
                            placeholder="10-digit number"
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FE6F61] focus:border-transparent"
                          />
                          <button
                            onClick={verifyTenant}
                            disabled={isVerifying || !newTenant.phone}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isVerifying 
                                ? 'bg-gray-100 text-gray-400'
                                : verificationStatus.isVerified
                                ? 'bg-green-50 text-green-600'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            {isVerifying ? (
                              <div className="flex items-center gap-2">
                                <Loader size={16} className="animate-spin" />
                                <span>Verifying...</span>
                              </div>
                            ) : verificationStatus.isVerified ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={16} />
                                <span>Verified</span>
                              </div>
                            ) : (
                              'Verify'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {verificationStatus.isVerified && verificationStatus.userData && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-green-800">
                              {verificationStatus.userData.name}
                            </h4>
                            <p className="text-sm text-green-600">
                              Verified User
                            </p>
                          </div>
                          <button
                            onClick={addTenant}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                    
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
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-4 flex justify-between">
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