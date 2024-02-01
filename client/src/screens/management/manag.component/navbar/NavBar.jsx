import React from 'react'
import './NavBar.css'
import { detacontext } from '../../../../App'


const NavBar = () => {
  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, employeelogout }) => {
          return (
            <nav>
              <input type="checkbox" id="theme-toggle" hidden/>
                <label for="theme-toggle" class="theme-toggle"></label>
                <a href="#" class="notif">
                  <i class='bx bx-bell'></i>
                  <span class="count">12</span>
                </a>
                <a href="#" class="profile">
                  <img src="images/logo.png"/>
                </a>
            </nav>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default NavBar
        // <header className='manag-header'>
        //   <div className='container'>
        //     <nav className='manag-nav'>
        //       <div className="profile">
        //         <div className="info">
        //           <p>اهلا, <b>{employeeLoginInfo && employeeLoginInfo.employeeinfo ? employeeLoginInfo.employeeinfo.username :''}</b></p>
        //         </div>
        //         <div className="logout-btn">
        //           <a href='/login' onClick={employeelogout}>خروج</a>
        //         </div>
        //       </div>

        //     </nav>
        //   </div>
        // </header>