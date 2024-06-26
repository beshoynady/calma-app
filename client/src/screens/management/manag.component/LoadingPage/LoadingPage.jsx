import React from 'react';
import './LoadingPage.css';
import { useContext } from 'react';
import { detacontext } from '../../../../App';


const LoadingPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const {resturantData} = useContext(detacontext)
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        {resturantData.logo?
        <img src={`${apiUrl}/images/${resturantData.logo}`} alt="Logo" className="logo mb-4" />
        :''
      }
        <div className="spinner"></div>
        <div className="loading-text mt-3" >الرجاء الانتظار...</div>
      </div>
    </div>
  );
}

export default LoadingPage;
