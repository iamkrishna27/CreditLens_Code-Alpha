import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictCreditScore = async (data) => {
  try {
    const response = await api.post('/predict', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(error.response.data.detail || 'Server Error');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please ensure the FastAPI backend is running.');
    } else {
      // Something happened in setting up the request
      throw new Error('Error setting up the request.');
    }
  }
};
