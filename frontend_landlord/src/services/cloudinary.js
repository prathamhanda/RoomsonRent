import axios from 'axios';
import backendURL from '@/config/config';

const CLOUDINARY_CLOUD_NAME = 'dglcgpley';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Using Cloudinary's default upload preset

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('api_key', '797288255224796');

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
    
    await axios.post(
      `${backendURL}/api/cloudinary/delete`,
      { 
        public_id: publicId,
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: '797288255224796'
      },
      { withCredentials: true }
    );
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files) => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}; 