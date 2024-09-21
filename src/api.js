const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = {
  post: async (url, data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData); // For debugging

      if (!response.ok) {
        throw new Error(responseData.message || 'An error occurred');
      }

      return responseData;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },

  get: async (url) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();
      console.log('API Response:', responseData); // For debugging

      if (!response.ok) {
        throw new Error(responseData.message || 'An error occurred');
      }

      return responseData;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  },
};

export default api;
