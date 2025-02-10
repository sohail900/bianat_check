import axios from "axios";

import { store } from "../app/Store";
import { logout } from "../features/Auth/authSlice";

const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

authApi.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.access_token;
    // const tokenl = localStorage.getItem("access_token")
    // console.log("tokenl" ,  tokenl)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default authApi;
