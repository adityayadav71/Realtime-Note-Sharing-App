import axios from "axios";
axios.defaults.withCredentials = true;
import { BASE_URL } from "./apiConfig";

export const checkLogInStatus = async () => {
  const response = await axios.get(`${BASE_URL}/api/v1/users/isLoggedIn`, {
    headers: {
      "Access-Control-Allow-Credentials": true,
    },
    credentials: "include",
  });
  return response.data;
};

export const signup = async (formData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/users/signup`,
    JSON.stringify(formData),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  
  return response.data;
};

export const login = async (formData) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/users/login`,
    JSON.stringify(formData),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${BASE_URL}/api/v1/users/logout`, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
  });
  return response.data.status === "success";
};