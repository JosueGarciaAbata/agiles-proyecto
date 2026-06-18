import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// Interceptor para añadir el token a las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
