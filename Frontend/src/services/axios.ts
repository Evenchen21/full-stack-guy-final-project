import axios from "axios";

// Create an axios instance
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers["x-auth-token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      error.isAuthError = true;
      error.friendlyMessage =
        "§ You must be logged in to perform this action...  §";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
