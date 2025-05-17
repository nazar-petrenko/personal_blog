// src/hooks/useApi.js
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useApi = () => {
  const { token, login, logout } = useAuth();

  const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // для refresh токена в cookie
  });

  // Перехоплювач запиту
  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Перехоплювач відповіді
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      // Якщо accessToken протермінувався
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshRes = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
          const newAccessToken = refreshRes.data.accessToken;

          const user = JSON.parse(localStorage.getItem("user"));
          login(user, newAccessToken);

          // Повторити оригінальний запит з новим токеном
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshErr) {
          logout();
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
