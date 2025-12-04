import axios from 'axios';
import { getItem } from './safeStorage.js';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://nikola-backend.onrender.com';

/**
 * Upload a file to the backend (which then uploads to Supabase)
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadFileViaBackend = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const token = getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(
      `${backendUrl}/api/products/upload-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (response.data && response.data.url) {
      return response.data.url;
    } else {
      throw new Error('No URL returned from upload');
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to upload file via backend');
    }
    throw new Error('Failed to upload file via backend');
  }
};
