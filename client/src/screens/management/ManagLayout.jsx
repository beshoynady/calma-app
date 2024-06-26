import React, { useState, useEffect } from 'react';
import './ManagLayout.css'
import { detacontext } from '../../App'
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from './manag.component/navbar/NavBar';
import SideBar from './manag.component/sidebar/SideBar';
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';
import { ToastContainer } from 'react-toastify';
import LoadingPage from './manag.component/LoadingPage/LoadingPage';


const ManagLayout = () => {
  const { role } = useContext(DataContext);

  if (role !== 'admin') {
    return <Navigate to='/login' />;
  }

  return (
    <div className='manag-body '>
      <ToastContainer/>
      <main className='content'>
        <NavBar />
        <Outlet />
      </main>
      <SideBar />
    </div>
  );
};
export default ManagLayout