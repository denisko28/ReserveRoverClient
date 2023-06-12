import axios from "axios";
import { auth } from "./firebase-config";

export const serverUrl = "https://localhost:7088";

const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers["Authorization"] = `Bearer ${await auth.currentUser?.getIdToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
