import apiClient from "./apiClient.js";

export const testUser = () => apiClient.get("/api/user/test");

export const login = (identifier, password) => {
  return apiClient.post("/api/auth/login", {
    identifier,
    password,
  });
};

export const signup = (email, name, password) => {
  return apiClient.post("/api/auth/register", {
    email,
    name,
    password,
  });
};

export const googleLogin = ({ user }) => {
  return apiClient.post("/api/auth/google", {
    name: user.displayName,
    email: user.email,
    googlePhotoUrl: user.photoURL,
  });
};