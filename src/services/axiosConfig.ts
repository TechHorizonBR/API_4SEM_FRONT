import axios from "axios";
import { tokenStore } from "@/stores/token";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStore().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
