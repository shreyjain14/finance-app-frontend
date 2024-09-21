const API_BASE_URL = 'http://127.0.0.1:5000';

const api = {
  get: async (url) => {
    return await sendRequest(url, 'GET');
  },
  post: async (url, data) => {
    return await sendRequest(url, 'POST', data);
  },
};

async function sendRequest(url, method, data = null) {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, options);
    
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export default api;
