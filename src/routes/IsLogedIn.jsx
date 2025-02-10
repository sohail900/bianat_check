import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const IsLoggedIn = ({ Component }) => {
  const isAuth = useSelector((state) => state?.auth?.isAuth);

  if (isAuth) {
    return <Navigate to="/dashboard" />;
  }
  return <Component />;
};

export default IsLoggedIn;
