import React from 'react'
import './NavBar.css'
import { detacontext } from '../../../../App'
import { Link } from 'react-router-dom'


const NavBar = () => {
  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, employeelogout }) => {
          return (
            <nav>
              {/* <i class='bx bx-menu'></i> */}
              {/* <form action="#">
                <div class="form-input">
                  <input type="search" placeholder="Search..."/>
                    <button class="search-btn" type="submit"><i class='bx bx-search'></i></button>
                </div>
              </form> */}
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
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default NavBar