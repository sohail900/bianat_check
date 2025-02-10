import axios from "axios";
import { requestHandler } from "@shared/utilites/requestHandler";


interface User {
  username: string;
  email: string;
  name: string;
  verified: boolean;
  roles: string[];
  subscriptions: string;
  subscriptionIds: string[];
  zohoCustomerId: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
  subscriptionDetails: object;
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
}

export const signIn = requestHandler<SignInParams, AuthResponse>((params) =>
  axios.post(`${process.env.REACT_APP_API_URL}auth/login`, params)
);

export const signUp = requestHandler<SignUpParams, AuthResponse>(
  async (params): Promise<any> => 
    axios.post(`${process.env.REACT_APP_API_URL}auth/signup`, params)
   
);

interface forgotPasswordParams {
  email: string;
}

interface forgotPasswordResponse {
  message: string;
}

export const forgotPassword = requestHandler<
  forgotPasswordParams,
  forgotPasswordResponse
>((params) =>
  axios.post(`${process.env.REACT_APP_API_URL}auth/forgot-password`, params)
);
