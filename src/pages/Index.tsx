
import React from "react";
import { Navigate } from "react-router-dom";

// This component now just redirects to Dashboard since we moved the candidate form
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
