import axios from "axios";
import { API_BASE_URL } from "../../utils/api";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Something went wrong, please try again");
      } else if (error.response.status === 500) {
        toast.error("Something went wrong, please try again");
      } else if (error.response.status === 404) {
        toast.error("Your api is not available");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
