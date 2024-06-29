import React, { useContext } from 'react';
import './ManagLayout.css';
import { detacontext } from '../../App';
import { Navigate, Outlet } from 'react-router-dom';
import NavBar from './manag.component/navbar/NavBar';
import SideBar from './manag.component/sidebar/SideBar';
import { ToastContainer } from 'react-toastify';

const ManagLayout = () => {
  const { employeeLoginInfo } = useContext(detacontext);

  const isLoggedIn = employeeLoginInfo?.employeeinfo?.isAdmin && employeeLoginInfo?.employeeinfo?.isActive;

  if (!isLoggedIn) {
    return <Navigate to='/login' />;
  }

  return (
    <div className='manag-body'>
      <ToastContainer />
      <main className='content'>
        <NavBar />
        <Outlet />
      </main>
      <SideBar />
    </div>
  );
};

export default ManagLayout;
