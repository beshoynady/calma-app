import React, { useState, useEffect } from 'react';
import { detacontext } from '../../../../App';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import './NavBar.css';

// const socket = io(process.env.REACT_APP_API_URL, {
//   reconnection: true,
// });




const NavBar = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleDir =()=>{
    // document.getElementById('toggleButton').addEventListener('click', function() {
      var html = document.documentElement;
      var text = document.getElementById('text');
  
      if (html.getAttribute('dir') === 'ltr') {
          html.setAttribute('dir', 'rtl');
          html.setAttribute('lang', 'ar');
          text.textContent = 'هذا نص باللغة العربية.';
          this.textContent = 'Change Direction and Language';
      } else {
          html.setAttribute('dir', 'ltr');
          html.setAttribute('lang', 'en');
          text.textContent = 'This is a text in English.';
          this.textContent = 'تغيير الاتجاه واللغة';
      }
  // });
  }

  const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   // Listen for new order notifications
  //   socket.on('reciveorder', (notification) => {
  //     console.log("socket Notification received:", notification);
  //     setNotifications(prevNotifications => [...prevNotifications, notification]);
      
  //   });
  // }, []);

  const handleNotificationClick = (index) => {
    // Remove notification at the specified index
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  return (
    <detacontext.Consumer>
      {({ employeeLoginInfo, employeelogout }) => (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <input type="checkbox" id="theme-toggle" hidden />
          <label htmlFor="theme-toggle" className="theme-toggle"></label>
          <div className="dropdown">
            <a href="#" className="dropdown-toggle"
              id="dropdownMenuButton"
              onClick={() => toggleDir()}
              // onClick={() => toggleNotifications()}
              aria-haspopup="true"
              aria-expanded={showNotifications ? "true" : "false"}>
              <i className="bx bx-bell" style={{ color: "--light" }}></i>
              <span className="badge badge-pill badge-danger">{notifications.length}</span>
            </a>
            {showNotifications &&
              <div className="dropdown-menu dropdown-menu-right show" aria-labelledby="dropdownMenuButton">
                {notifications.length>0?notifications.map((notification, index) => (
                  <a key={index} className="dropdown-item" href="#" onClick={() => handleNotificationClick(index)}>
                    {notification}
                  </a>
                ))
                : <a> لا يوجد اشعارات جديدة </a>
              }
              </div>
            }
          </div>
        </nav>
      )}
    </detacontext.Consumer>
  );
};

export default NavBar;


