import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function fetchResults(params = {}) {
  try {
    const response = await apiClient.get('/results', { params });
    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error('Invalid data format from server');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch results';
  }
}

export async function fetchResultById(id) {
  if (!id) {
    throw new Error('Result ID is required');
  }
  try {
    const response = await apiClient.get(`/results/${id}`);
    if (!response.data || !response.data.result) {
      throw new Error('Result not found');
    }
    return response.data.result;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch result detail';
  }
}

export async function uploadResultsCSV(formData, onUploadProgress) {
  if (!(formData instanceof FormData)) {
    throw new Error('FormData instance is required');
  }
  try {
    const response = await apiClient.post('/results/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to upload CSV';
  }
}
