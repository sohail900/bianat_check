import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../services/authApi";

/**
 * @name authSlice
 * @type {object}
 * @property {boolean} isAuth - is user authenticated
 * @property {object} user - user data
 * @property {string} access_token - access token
 * @property {object} subscriptionDetails - subscription details
 * @property {function} logout - logout user
 * @property {function} login - login user
 * @description: Auth slice
 */

const initialState = {
  isAuth: false,
  user: null,
  access_token: null,
  subscriptionDetails: null,
};

export const getSubscriptionDetails = createAsyncThunk(
  "auth/getSubscriptionDetails",
  async () => {
    const response = await authApi.get("auth/my-subscriptions");

    return response.data;
  }
);
//
export const login = createAsyncThunk(
  "auth/login",
  async (data) => {
    const result = await authApi.post("auth/login", data);

    if (result.status === 200) {
      return {
        isAuth: true,
        user: result.data.content,
        access_token: result.data.access_token,
        subscriptionDetails: result.data.content.subscriptionDetails,
      };
    }
  }
);

export const getMyUserData = createAsyncThunk(
  "auth/getMyUserData",
  async () => {
    const response = await authApi.get("auth/me");

    if (response.status === 200) {
      return {
        user: response.data,
        subscriptionDetails: response.data.subscriptionDetails,
      };
    }
  }
);

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    logout: (state) => {
      window.location.reload(false);
      state.isAuth = false;
      state.user = null;
      state.access_token = null;
      state.subscriptionDetails = null;
      localStorage.clear();
    },
    signIn: (state, action) => {
      const {access_token, user, subscriptionDetails} = action.payload;
      
      state.isAuth = true;
      state.user = user;
      state.access_token = access_token;
      state.subscriptionDetails = subscriptionDetails;
    },
    updateSubscription: (state, action) => {
      const { subscription, subscriptionIds } = action.payload;
      state.user.subscription = subscription;
      state.user.subscriptionIds = subscriptionIds;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.subscriptionDetails = action.payload.subscriptionDetails;
    },
    [getSubscriptionDetails.fulfilled]: (state, action) => {
      state.subscriptionDetails = action.payload;
    },
    [getMyUserData.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.subscriptionDetails = action.payload.subscriptionDetails;
    },
  },
});

export const { logout, updateSubscription, signIn } = authSlice.actions;
export default authSlice.reducer;
