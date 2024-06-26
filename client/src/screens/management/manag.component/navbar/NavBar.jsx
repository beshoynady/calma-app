import React, { useState, useEffect } from 'react';
import { detacontext } from '../../../../App';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
// import './NavBar.css';

// const socket = io(process.env.REACT_APP_API_URL, {
//   reconnection: true,
// });

const NavBar = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);

  };

  const toggleMessages = () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);

  };

  const toggleDir = () => {
    const html = document.documentElement;
    if (html.getAttribute('dir') === 'ltr') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'en');
    }
  };

  const handleNotificationClick = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  const handleMessageClick = (index) => {
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);
    setMessages(updatedMessages);
  };

  // useEffect(() => {
  //   // Listen for new order notifications
  //   socket.on('reciveorder', (notification) => {
  //     console.log("socket Notification received:", notification);
  //     setNotifications(prevNotifications => [...prevNotifications, notification]);

  //   });
  // }, []);

  //   const handleNotificationClick = (index) => {
  //     // Remove notification at the specified index
  //     const updatedNotifications = [...notifications];
  //     updatedNotifications.splice(index, 1);
  //     setNotifications(updatedNotifications);
  //   };

  return (
    <detacontext.Consumer>
      {({ employeeLoginInfo, employeelogout }) => (
        <nav className="navbar w-100 navbar-expand-lg navbar-light bg-light flex-row pr-1 " style={{ height: '60px' }}>
          {/* <input type="checkbox" id="theme-toggle" hidden />
              <label htmlFor="theme-toggle" className="theme-toggle" onClick={toggleDir}></label> */}
          <div className="navbar-nav ms-auto flex-row">
            <div className="nav-item d-flex align-items-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', fontSize: '18px' }}>
                {employeeLoginInfo?.employeeinfo && employeeLoginInfo.employeeinfo.username?.charAt(0)}
              </div>
              <span className="text-dark ms-2">{employeeLoginInfo?.employeeinfo && employeeLoginInfo.employeeinfo?.role}</span>
            </div>
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" onClick={toggleMessages} aria-haspopup="true" aria-expanded={showMessages ? "true" : "false"}>
                <i className="bx bx-envelope"></i>
                <span className="badge badge-pill badge-danger">{messages.length}</span>
              </a>
              {showMessages && (
                <div className="dropdown-menu dropdown-menu-right flex-column show" aria-labelledby="messagesDropdown" style={{ position: 'absolute' }}>
                  {messages.length > 0 ? messages.map((message, index) => (
                    <a key={index} className="dropdown-item" href="#" onClick={() => handleMessageClick(index)}>
                      {message}
                    </a>
                  )) : <a className="dropdown-item" href="#">No new messages</a>}
                </div>
              )}
            </div>
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="notificationsDropdown" onClick={toggleNotifications} aria-haspopup="true" aria-expanded={showNotifications ? "true" : "false"} >
                <i className="bx bx-bell"></i>
                <span className="badge badge-pill badge-danger">{notifications.length}</span>
              </a>
              {showNotifications && (
                <div className="dropdown-menu dropdown-menu-right flex-column absolute show" aria-labelledby="notificationsDropdown" style={{ position: 'absolute' }}>
                  {notifications.length > 0 ? notifications.map((notification, index) => (
                    <a key={index} className="dropdown-item" href="#" onClick={() => handleNotificationClick(index)}>
                      {notification}
                    </a>
                  )) : <a className="dropdown-item" href="#">No new notifications</a>}
                </div>
              )}
            </div>
            {/* <form className="form-inline my-2 my-lg-0 me-auto">
            <div className="input-group">
              <input className="form-control col-8" type="search" placeholder="Search" aria-label="Search" />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">Search</button>
              </div>
            </div>
          </form> */}
          </div>
        </nav>
      )}
    </detacontext.Consumer>
  );
};

export default NavBar;


