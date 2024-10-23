import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_URL, // Update with your actual API base URL 
  baseURL : "http://localhost:3000/api/v1/" // local environment variable
  // baseURL: "https://cafe-backend-sigma.vercel.app/api/v1/"
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally here
    return Promise.reject(error.response ? error.response.data : error.message);
  }
);

export default axiosInstance;
