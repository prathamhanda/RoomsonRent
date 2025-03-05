import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListing } from '../../context/ListingContext';
import { useLocationContext } from '../../context/LocationContext';
import Spinner from '../../components/common/Spinner';
import LocationSelector from '../../components/listings/LocationSelector';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';

const amenitiesList = [
  'Wi-Fi', 'TV', 'Air Conditioning', 'Washing Machine', 'Refrigerator', 
  'Microwave', 'Gas Connection', 'Parking', 'Power Backup', 'Security', 
  'CCTV', 'Gym', 'Swimming Pool', 'Study Room', 'Housekeeping'
];

const rulesList = [
  'No Smoking', 'No Pets', 'No Parties', 'No Visitors after 10pm',
  'ID Proof Required', 'No Alcohol', 'Vegetarian Only', 'No Non-Veg Cooking'
];

const CreateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createListing, updateListing, getListingById, loading, error } = useListing();
  const { getAllLocations, getCurrentLocation, showError } = useLocationContext();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'single',
    price: '',
    securityDeposit: '',
    address: '',
    location: '',
    availableFrom: '',
    occupancy: 'single',
    maxOccupancy: 1,
    amenities: [],
    rules: [],
    images: [],
    isActive: true
  });
  
  const [locations, setLocations] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [loadError, setLoadError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [locationData, setLocationData] = useState(null);
  
  // Format date as YYYY-MM-DD for input field
  const formatDateForInput = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };
  
  // Load locations and listing data if in edit mode
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch locations
        const locationsData = await getAllLocations();
        setLocations(locationsData);
        
        // If we have an ID, we're in edit mode
        if (id) {
          setIsEditMode(true);
          const listingData = await getListingById(id);
          
          // Format dates and convert data types
          const formattedListing = {
            ...listingData,
            price: String(listingData.price),
            securityDeposit: String(listingData.securityDeposit),
            availableFrom: formatDateForInput(listingData.availableFrom),
            maxOccupancy: listingData.maxOccupancy || 1,
            location: listingData.location._id
          };
          
          setFormData(formattedListing);
          setImagePreviewUrls(listingData.images || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setLoadError('Failed to load form data. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, getAllLocations, getListingById]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    if (name === 'amenities' || name === 'rules') {
      // Handle checkboxes for amenities and rules
      const currentArray = [...formData[name]];
      if (checked) {
        currentArray.push(value);
      } else {
        const index = currentArray.indexOf(value);
        if (index > -1) {
          currentArray.splice(index, 1);
        }
      }
      setFormData({
        ...formData,
        [name]: currentArray
      });
    } else if (type === 'checkbox') {
      // For isActive checkbox
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'price' || name === 'securityDeposit' || name === 'maxOccupancy') {
      // Only allow numbers for price, security deposit and max occupancy
      const regex = /^[0-9]*$/;
      if (value === '' || regex.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleImageChange = (e) => {
    e.preventDefault();
    
    const files = Array.from(e.target.files);
    
    // Add new files to existing ones
    setImageFiles(prevFiles => [...prevFiles, ...files]);
    
    // Create previews for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prevUrls => [...prevUrls, ...newPreviews]);
  };
  
  const removeImage = (index) => {
    // Remove from preview array
    setImagePreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
    
    // If it's a new image (file object exists), remove from files array
    if (imageFiles[index]) {
      setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    } else if (isEditMode) {
      // If it's an existing image URL in edit mode, remove from form data
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({
        ...formData,
        images: updatedImages
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.securityDeposit) errors.securityDeposit = 'Security deposit is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.availableFrom) errors.availableFrom = 'Available date is required';
    
    // Length validations
    if (formData.title.length > 100) errors.title = 'Title cannot exceed 100 characters';
    if (formData.description.length > 2000) errors.description = 'Description cannot exceed 2000 characters';
    
    // Numeric validations
    if (parseInt(formData.price) <= 0) errors.price = 'Price must be greater than 0';
    if (parseInt(formData.securityDeposit) < 0) errors.securityDeposit = 'Security deposit cannot be negative';
    if (parseInt(formData.maxOccupancy) <= 0) errors.maxOccupancy = 'Maximum occupancy must be at least 1';
    
    // Image validation
    if (!isEditMode && imageFiles.length === 0) {
      errors.images = 'At least one image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure we have location data
    if (!locationData) {
      showError('Please select a location for your listing');
      return;
    }
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector('.text-red-600');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare form data
    const processedData = {
      ...formData,
      price: parseInt(formData.price),
      securityDeposit: parseInt(formData.securityDeposit),
      maxOccupancy: parseInt(formData.maxOccupancy),
      location: locationData._id,
      address: locationData.address,
      coordinates: locationData.coordinates,
      availableFrom: new Date(formData.availableFrom).toISOString()
    };
    
    try {
      if (isEditMode) {
        // Update existing listing
        await updateListing(id, processedData, imageFiles, (progress) => {
          setUploadProgress(progress);
        });
        navigate('/dashboard/listings');
      } else {
        // Create new listing
        await createListing(processedData, imageFiles, (progress) => {
          setUploadProgress(progress);
        });
        navigate('/dashboard/listings');
      }
    } catch (err) {
      console.error('Error saving listing:', err);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Spinner size="large" color="indigo" />
      </div>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Basic Information */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                    }`}
                    placeholder="e.g., Cozy Single Room near Tech Park"
                  />
                  {formErrors.title && <p className="mt-2 text-sm text-red-600">{formErrors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Property Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                  >
                    <option value="single">Single Room</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                    <option value="apartment">Full Apartment</option>
                    <option value="house">Full House</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                    }`}
                    placeholder="Describe your property, including features, nearby facilities, etc."
                  ></textarea>
                  {formErrors.description && <p className="mt-2 text-sm text-red-600">{formErrors.description}</p>}
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.description.length}/2000 characters
                  </p>
                </div>
              </div>
            </div>
            
            {/* Location Details */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Location & Availability</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location *</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`mt-1 block w-full py-2 px-3 border ${
                      formErrors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                    } bg-white rounded-md shadow-sm focus:outline-none sm:text-sm`}
                  >
                    <option value="">Select a location</option>
                    {locations.map(loc => (
                      <option key={loc._id} value={loc._id}>
                        {loc.name}, {loc.city}
                      </option>
                    ))}
                  </select>
                  {formErrors.location && <p className="mt-2 text-sm text-red-600">{formErrors.location}</p>}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Full Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.address ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                    }`}
                    placeholder="Enter the complete address"
                  />
                  {formErrors.address && <p className="mt-2 text-sm text-red-600">{formErrors.address}</p>}
                </div>
                
                <div>
                  <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">Available From *</label>
                  <input
                    type="date"
                    id="availableFrom"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.availableFrom ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                    }`}
                  />
                  {formErrors.availableFrom && <p className="mt-2 text-sm text-red-600">{formErrors.availableFrom}</p>}
                </div>
                
                <div className="flex items-center h-full pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#FE6F61] focus:ring-[#FE6F61] border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Make this listing active (immediately visible to users)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Price & Occupancy */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Price & Occupancy</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Monthly Rent (₹) *</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {formErrors.price && <p className="mt-2 text-sm text-red-600">{formErrors.price}</p>}
                </div>
                
                <div>
                  <label htmlFor="securityDeposit" className="block text-sm font-medium text-gray-700">Security Deposit (₹) *</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="text"
                      id="securityDeposit"
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleChange}
                      className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm ${
                        formErrors.securityDeposit ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {formErrors.securityDeposit && <p className="mt-2 text-sm text-red-600">{formErrors.securityDeposit}</p>}
                </div>
                
                <div>
                  <label htmlFor="occupancy" className="block text-sm font-medium text-gray-700">Occupancy Type</label>
                  <select
                    id="occupancy"
                    name="occupancy"
                    value={formData.occupancy}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FE6F61] focus:border-[#FE6F61] sm:text-sm"
                  >
                    <option value="single">Single Occupancy</option>
                    <option value="double">Double Sharing</option>
                    <option value="triple">Triple Sharing</option>
                    <option value="any">Any</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="maxOccupancy" className="block text-sm font-medium text-gray-700">Maximum Occupants</label>
                  <input
                    type="text"
                    id="maxOccupancy"
                    name="maxOccupancy"
                    value={formData.maxOccupancy}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      formErrors.maxOccupancy ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#FE6F61] focus:border-[#FE6F61]'
                    }`}
                  />
                  {formErrors.maxOccupancy && <p className="mt-2 text-sm text-red-600">{formErrors.maxOccupancy}</p>}
                </div>
              </div>
            </div>
            
            {/* Amenities & Rules */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Amenities & Rules</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {amenitiesList.map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        name="amenities"
                        value={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#FE6F61] focus:ring-[#FE6F61] border-gray-300 rounded"
                      />
                      <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-900">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {rulesList.map(rule => (
                    <div key={rule} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rule-${rule}`}
                        name="rules"
                        value={rule}
                        checked={formData.rules.includes(rule)}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#FE6F61] focus:ring-[#FE6F61] border-gray-300 rounded"
                      />
                      <label htmlFor={`rule-${rule}`} className="ml-2 block text-sm text-gray-900">
                        {rule}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Images */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Property Images</h2>
              
              <div className="mb-4">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-[#FE6F61] hover:text-[#e55a4d] focus-within:outline-none">
                        <span>Upload files</span>
                        <input 
                          id="images" 
                          name="images" 
                          type="file" 
                          multiple 
                          accept="image/*"
                          className="sr-only" 
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>
                {formErrors.images && <p className="mt-2 text-sm text-red-600">{formErrors.images}</p>}
              </div>
              
              {imagePreviewUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image Previews</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                          <img src={url} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <LocationSelector 
              value={locationData}
              onChange={(location) => setLocationData(location)}
            />
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateListing; 