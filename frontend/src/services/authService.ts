import axios from "axios";
import axiosInstance from "./axiosInstance";

const saveAuthTokens = (tokens: {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}) => {
  localStorage.setItem("idToken", tokens.idToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  localStorage.setItem("expiresIn", tokens.expiresIn);
  localStorage.setItem(
    "expiresAt",
    (Date.now() + parseInt(tokens.expiresIn) * 1000).toString()
  );
};

export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(
      "Attempting refresh with token:",
      refreshToken?.substring(0, 10) + "..."
    );

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
      {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }
    );

    const tokens = {
      idToken: response.data.id_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in.toString(),
    };

    saveAuthTokens(tokens);
    return tokens.idToken;
  } catch (error: any) {
    console.error("Token refresh failed:", error.response?.data || error);
    localStorage.clear();
    throw error;
  }
};

export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem("expiresAt");
  if (!expiresAt) return true;

  // Add 5 minute buffer before actual expiration
  return Date.now() > parseInt(expiresAt) - 5 * 60 * 1000;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const response = await axiosInstance.post(`/auth/register`, data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axiosInstance.post(`/auth/login`, data);
  saveAuthTokens(response.data);
  return response.data;
};

export const updateProfile = async (data: { name: string; email: string }) => {
  const response = await axiosInstance.put(`/auth/profile`, data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axiosInstance.post(`/auth/change-password`, data);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await axiosInstance.post(`/auth/forgot-password`, data);
  return response.data;
};

export const resetPassword = async (data: {
  oobCode: string;
  newPassword: string;
}) => {
  const response = await axiosInstance.post(`/auth/reset-password`, data);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("expiresAt");
};

// Types for API responses
export interface AuthResponse {
  message: string;
  error?: string;
}

export interface PasswordChangeResponse extends AuthResponse {
  message: string;
}

export interface PasswordResetResponse extends AuthResponse {
  message: string;
}

// Usage example types
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  oobCode: string;
  newPassword: string;
}
