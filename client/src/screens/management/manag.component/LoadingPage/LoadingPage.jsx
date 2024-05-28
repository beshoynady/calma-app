import React from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <img src="https://via.placeholder.com/100" alt="Logo" className="logo mb-4" />
        <div className="spinner"></div>
        <div className="loading-text mt-3">الرجاء الانتظار...</div>
      </div>
    </div>
  );
}

export default LoadingPage;
