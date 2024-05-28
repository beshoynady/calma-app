import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import { detacontext } from '../../App';
import NavBar from './manag.component/navbar/NavBar';
import SideBar from './manag.component/sidebar/SideBar';
import './ManagLayout.css';
import LoadingPage from './manag.component/LoadingPage/LoadingPage';

const ManagLayout = () => {
  const [isTokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const tokenStorage = localStorage.getItem('token_e');
    if (tokenStorage) {
      const decodedToken = jwt_decode(tokenStorage);
      setTokenValid(decodedToken.employeeinfo.isActive);
    }
  }, []);

  if (isTokenValid) {
    return (
      <detacontext.Consumer>
        {
          ({ allProducts, isLoadiog, setisLoadiog }) => {
            if(!isLoadiog){
              return (
                <div className='manag-body'>
                  <ToastContainer />
                  <SideBar />
                  <main className='content'>
                    <NavBar />
                    <Outlet />
                  </main>
                </div>
              )
            }else{
              return(
                <LoadingPage/>
              )
            }
          }}
      </detacontext.Consumer>
    );
  } else {
    return <Navigate to={'/login'} />;
  }
};

export default ManagLayout;
