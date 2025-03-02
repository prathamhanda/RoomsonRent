import React, { useState } from 'react';
import Navbar from '../navbar';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'Independent',
    address: '',
    city: '',
    pincode: '',
    rooms: '',
    bedsPerRoom: '',
    monthlyRent: '',
    securityDeposit: '',
    amenities: {
      wifi: false,
      ac: false,
      hotWater: false,
      parking: false,
      meals: false,
      laundry: false,
      cleaning: false,
      tv: false,
    },
    genderPreference: 'any',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: { ...formData.amenities, [name]: checked },
    });
  };

  const handleImageUpload = (e) => {
    // In a real app, you would handle file uploads differently
    const fileList = Array.from(e.target.files);
    setFormData({ ...formData, images: fileList });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    alert('PG Listing created successfully!');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 py-6 px-8">
              <h1 className="text-3xl font-bold text-white">Create Your PG Listing</h1>
              <p className="text-indigo-100 mt-2">Fill in the details to list your property and find suitable paying guests</p>
            </div>

            <form onSubmit={handleSubmit} className="py-8 px-8">
              {/* Property Details Section */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Property Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-1">Property Name*</label>
                    <input
                      type="text"
                      id="propertyName"
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., Sunshine PG"
                    />
                  </div>

                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type*</label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Independent">Independent House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Hostel">Hostel Building</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Complete Address*</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Street address"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., Mumbai"
                    />
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., 400001"
                    />
                  </div>
                </div>
              </div>

              {/* Accommodation Details */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Accommodation Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">Total Rooms*</label>
                    <input
                      type="number"
                      id="rooms"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., 5"
                    />
                  </div>

                  <div>
                    <label htmlFor="bedsPerRoom" className="block text-sm font-medium text-gray-700 mb-1">Beds Per Room*</label>
                    <input
                      type="number"
                      id="bedsPerRoom"
                      name="bedsPerRoom"
                      value={formData.bedsPerRoom}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., 2"
                    />
                  </div>

                  <div>
                    <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹)*</label>
                    <input
                      type="number"
                      id="monthlyRent"
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., 8000"
                    />
                  </div>

                  <div>
                    <label htmlFor="securityDeposit" className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)*</label>
                    <input
                      type="number"
                      id="securityDeposit"
                      name="securityDeposit"
                      value={formData.securityDeposit}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., 15000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Gender Preference*</label>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="any"
                          name="genderPreference"
                          value="any"
                          checked={formData.genderPreference === 'any'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="any" className="ml-2 text-sm text-gray-700">Any</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="male"
                          name="genderPreference"
                          value="male"
                          checked={formData.genderPreference === 'male'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="male" className="ml-2 text-sm text-gray-700">Male Only</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="female"
                          name="genderPreference"
                          value="female"
                          checked={formData.genderPreference === 'female'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="female" className="ml-2 text-sm text-gray-700">Female Only</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Amenities</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="wifi"
                      name="wifi"
                      checked={formData.amenities.wifi}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="wifi" className="ml-2 text-sm text-gray-700">WiFi</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ac"
                      name="ac"
                      checked={formData.amenities.ac}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="ac" className="ml-2 text-sm text-gray-700">Air Conditioning</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hotWater"
                      name="hotWater"
                      checked={formData.amenities.hotWater}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="hotWater" className="ml-2 text-sm text-gray-700">Hot Water</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="parking"
                      name="parking"
                      checked={formData.amenities.parking}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="parking" className="ml-2 text-sm text-gray-700">Parking</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="meals"
                      name="meals"
                      checked={formData.amenities.meals}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="meals" className="ml-2 text-sm text-gray-700">Meals Included</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="laundry"
                      name="laundry"
                      checked={formData.amenities.laundry}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="laundry" className="ml-2 text-sm text-gray-700">Laundry</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cleaning"
                      name="cleaning"
                      checked={formData.amenities.cleaning}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="cleaning" className="ml-2 text-sm text-gray-700">Room Cleaning</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tv"
                      name="tv"
                      checked={formData.amenities.tv}
                      onChange={handleAmenityChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <label htmlFor="tv" className="ml-2 text-sm text-gray-700">TV</label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Property Description</h2>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Detailed Description*</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your property, neighborhood, rules, etc."
                  ></textarea>
                </div>
              </div>

              {/* Images */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Property Images</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Upload Images* (Min 3 photos)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload files</span>
                          <input 
                            id="images" 
                            name="images" 
                            type="file" 
                            multiple
                            required
                            onChange={handleImageUpload}
                            className="sr-only" 
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{formData.images.length} file(s) selected</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Contact Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Contact Person*</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., 9876543210"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="mt-8">
                <div className="flex items-center mb-6">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I confirm that all the information provided is accurate and I agree to the Terms of Service
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
                >
                  Create PG Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateListing;