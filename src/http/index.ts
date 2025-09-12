import axios, { AxiosInstance } from "axios";
import { getCookie } from "cookies-next";

interface CustomAxiosInstance extends AxiosInstance {
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
}

const $api: CustomAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
}) as CustomAxiosInstance;

let authToken: string | null = null;

$api.interceptors.request.use(
  (config) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`${config.method?.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

$api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;

      const token = getCookie("token") as string | undefined;

      switch (status) {
        case 401:
          if (token) {
            console.error("Unauthorized - Token may be expired");
          }
          break;
        case 403:
          console.error("Forbidden - Insufficient permissions");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 429:
          console.error("Too many requests - Rate limited");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error(`HTTP Error ${status}:`, data?.message || "Unknown error");
      }

      error.userMessage = data?.message || `Request failed with status ${status}`;
    } else if (error.request) {
      console.error("Network Error:", error.message);
      error.userMessage = "Network error - please check your connection";
    } else {
      console.error("Request Setup Error:", error.message);
      error.userMessage = "Request configuration error";
    }

    return Promise.reject(error);
  }
);

$api.setAuthToken = (token: string) => {
  authToken = token;
};

$api.clearAuthToken = () => {
  authToken = null;
};

export default $api;
