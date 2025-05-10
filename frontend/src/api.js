import axios from 'axios';

const API_URL = 'https://onlinemarket-dr9a.onrender.com';

export const authHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
   

export const registerUser = async (formData, confirmationCode) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, { ...formData, confirmationCode });
        return response.data;
    } catch (error) {
        console.error('Error registering user', error);
        throw error;
    }
};

export const loginUser = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, formData);
        return response.data;
    } catch (error) {
        console.error('Error logging in user', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, { headers: authHeader() });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user', error);
      throw error;
    }
  };
  
  export const getCountries = async () => {
    try {
      const response = await axios.get(`${API_URL}/countries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  };
  
  export const updateUserLocation = async (userId, countryId, regionId) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/update_location`,
        { country_id: countryId, region_id: regionId },
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user location:', error);
      throw error;
    }
  };

  export const getBalance = async (userId) => {
    const res = await axios.get(`${API_URL}/balances/${userId}`, {
      headers: authHeader()
    });
    return res.data;
  };
  
  export const getCreditCardsByUser = async (userId) => {
    const res = await axios.get(`${API_URL}/creditcards/user/${userId}`, {
      headers: authHeader()
    });
    return res.data;
  };

  export const addCreditCard = async (cardData) => {
    try {
      const response = await axios.post(`${API_URL}/creditcards`, cardData, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error adding credit card:', error);
      throw error;
    }
  };


  export const getStores = async () => {
    const res = await fetch(`${API_URL}/stores`, {
      headers: authHeader(),
    });
    return await res.json();
  };
  
  export const getRegionNameById = async (regionId) => {
    const res = await fetch(`${API_URL}/regions/${regionId}`, {
      headers: authHeader(),
    });
    const data = await res.json();
    return data.name;
  };
  

  export const getStoreById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/stores/${id}`, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching store by ID:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  

export const getProductsByStoreId = async (storeId) => {
    try {
        const response = await axios.get(`${API_URL}/products/store/${storeId}`, {
            headers: authHeader(),
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products by store ID:', error);
        throw error;
    }
};

export const addToCart = async (cartData) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, cartData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getMyStores = async () => {
  try {
    const response = await axios.get(`${API_URL}/stores/my`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my stores:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getRegionsByCountryId = async (countryId) => {
  try {
    const response = await axios.get(`${API_URL}/regions/country/${countryId}`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching regions by country ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getStoreCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/store-categories`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching store categories:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createStore = async (storeData) => {
  try {
    const response = await axios.post(`${API_URL}/stores`, storeData, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating store:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const payCommission = async (userId, commissionUSD, commissionKZT) => {
  try {
    const response = await axios.post(`${API_URL}/balances/pay-commission`, {
      userId,
      commissionUSD,
      commissionKZT
    }, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`, {
      headers: authHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
    throw error;
  }
};