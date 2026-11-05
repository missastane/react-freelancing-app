
import api from "../api/axios";

export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/refresh");
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};
