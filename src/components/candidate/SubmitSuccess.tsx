
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SubmitSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to candidate client selection page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/candidate/select-clients");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
      <div className="rounded-full bg-green-100 p-3">
        <svg 
          className="h-6 w-6 text-green-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-primary">Congratulations!</h2>
      <p className="text-lg">You just submitted a candidate</p>
      <p className="text-sm text-muted-foreground">Redirecting to client selection...</p>
    </div>
  );
};

export default SubmitSuccess;
