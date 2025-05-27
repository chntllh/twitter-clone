import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://twitter-clone-backend-7wbw.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response);
    return Promise.reject(error.response);
  }
);

export default apiClient;
