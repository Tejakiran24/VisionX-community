import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: import.meta.env.VITE_API_TIMEOUT || 10000, // 10 second timeout
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['x-auth-token'] = token;
            
            // Decode token to check payload
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));
                console.log('🔑 Token payload:', payload);
            } catch (err) {
                console.warn('⚠️ Could not decode token:', err);
            }
        } else {
            console.warn('⚠️ No auth token found in localStorage');
        }
        
        console.log('� Outgoing request:', {
            method: config.method,
            url: config.url,
            headers: config.headers,
            data: config.data
        });
        
        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ API Error Details:', {
            url: error.config?.url,
            method: error.config?.method,
            code: error.code,
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - server might be down');
            console.error('Request config:', error.config);
            return Promise.reject(new Error('Server is not responding. Please try again later.'));
        }
        
        if (!error.response) {
            console.error('🌐 Network error - server might be down');
            console.error('Request config:', error.config);
            return Promise.reject(new Error('Cannot connect to server. Please check your internet connection.'));
        }

        // Handle specific error status codes
        switch (error.response.status) {
            case 401:
                console.error('🔐 Authentication failed');
                return Promise.reject(new Error('Authentication failed. Please log in again.'));
            case 403:
                console.error('🚫 Access forbidden');
                return Promise.reject(new Error('Access denied. You do not have permission.'));
            case 404:
                console.error('🔍 Resource not found:', error.config.url);
                return Promise.reject(new Error('Resource not found'));
            case 500:
                console.error('💥 Server error:', error.response.data);
                return Promise.reject(new Error('Internal server error. Please try again later.'));
            default:
                console.error('❓ Unhandled error:', error);
                return Promise.reject(error);
        }
    }
);

export default api;
