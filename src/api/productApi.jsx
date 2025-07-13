import axios from 'axios';

const API_URL = 'http://localhost:3001/products';

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};