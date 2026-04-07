import axios from "axios";

// Create a custom axios instance so we can attach shared config to every request //
const axiosInstance = axios.create();

// Request interceptor — runs before every outgoing request //
axiosInstance.interceptors.request.use(
  (config) => {
    // Grab the stored token (set during login) //
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      // Attach the token in both header formats the backend may expect //
      config.headers["x-auth-token"] = token;
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  // Pass request setup errors through so callers can handle them //
  (error) => Promise.reject(error),
);

// Response interceptor — runs after every incoming response //
axiosInstance.interceptors.response.use(
  // Successful responses pass straight through //
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Flag 401 (unauthorized) and 403 (forbidden) as auth errors so //
    // components can show a specific message instead of a generic one //
    if (status === 401 || status === 403) {
      error.isAuthError = true;
      error.friendlyMessage =
        "§ You must be logged in to perform this action...  §";
    }

    // Always forward the error so individual callers can still handle it //
    return Promise.reject(error);
  },
);

export default axiosInstance;
