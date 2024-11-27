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
  console.log("login response:",response.data);
  saveAuthTokens(response.data); 
  return response.data;
};

export const logoutUser = () => {
//   localStorage.removeItem("idToken");
//   localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresIn");
  localStorage.removeItem("expiresAt");
};
