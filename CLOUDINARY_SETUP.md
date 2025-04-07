# Cloudinary Integration Guide

This project now uses Cloudinary for image storage instead of local file storage. Follow these steps to set up Cloudinary for your development environment.

## 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. After signing up, go to your Dashboard to find your account details

## 2. Configure Environment Variables

1. In your backend directory, update the `.env` file with your Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAX_FILE_UPLOAD=5000000
FILE_UPLOAD_PATH=./public/uploads
```

- Replace `your_cloud_name`, `your_api_key`, and `your_api_secret` with your actual Cloudinary account details.
- You can find these values in your Cloudinary Dashboard.

## 3. Test Your Configuration

To test if your Cloudinary setup is working properly:

1. Start your backend server
2. Use the test endpoint to upload an image:
   ```
   POST /api/cloudinary-test/upload
   ```
   Send a multipart/form-data request with a file named "file"

3. If successful, you should see a response with the image URL and details.

## 4. Image Optimization Features

With Cloudinary, you gain access to powerful image transformation features:

- Automatic image optimization
- Responsive images
- Image transformations (resize, crop, filter, etc.)
- Lazy loading
- Format conversion

The `RoomDetailsCard` component has been updated to use these features. See the `optimizeCloudinaryUrl` function in that component for an example.

## 5. What Changed

The following components were updated:

1. Backend:
   - `uploads.js` controllers now use Cloudinary for image uploads
   - Added Cloudinary configuration in `config/cloudinary.js`
   - Added test routes for verification

2. Frontend:
   - Enhanced `RoomDetailsModal.jsx` with better upload handling
   - Updated `RoomDetailsCard.jsx` with Cloudinary URL optimization
   - Added a photo gallery modal for better image viewing

## 6. Note on Existing Images

Any existing images that were previously uploaded to local storage will still work, but new uploads will go to Cloudinary. Consider migrating old images to Cloudinary for consistency. 