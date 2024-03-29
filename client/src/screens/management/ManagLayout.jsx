import React, { useState, useEffect } from 'react';
import './ManagLayout.css'
import { detacontext } from '../../App'
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from './manag.component/navbar/NavBar';
import SideBar from './manag.component/sidebar/SideBar';
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';
import { ToastContainer } from 'react-toastify';


const ManagLayout = () => {
  if (localStorage.getItem('token_e')) {
    // console.log(localStorage.getItem('token'))
    const tokenStorage = localStorage.getItem('token_e')
    if (tokenStorage) {
      const decodetoken = jwt_decode(tokenStorage)
      if (decodetoken.employeeinfo.isActive) {
        return (
          <div className='manag-body '>
            <ToastContainer/>
            <SideBar />
            <main className='content'>
              <NavBar />
              <Outlet></Outlet>
            </main>
          </div>)
      }
    }
  } else {
    return <Navigate to={'/login'} />
  }
}

export default ManagLayout