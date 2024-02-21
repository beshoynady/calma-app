import React, { useRef, useState, useEffect } from 'react';
import './Home.css'
import { detacontext } from '../../../../App'
import { useParams } from 'react-router-dom';

const Home = () => {
  const { id } = useParams();

  const renderWelcomeMessage = (userLoginInfo, usertitle) => {
    if (userLoginInfo && userLoginInfo.userinfo && id) {
      return (
        <p className='main-title'>مرحبا {usertitle(userLoginInfo.userinfo.id)} <br />علي طاولة {usertitle(id)} <br /> في</p>
      );
    } else if (userLoginInfo && userLoginInfo.userinfo) {
      return (
        <p className='main-title'>مرحبا {usertitle(userLoginInfo.userinfo.id)} <br /> في</p>
      );
    } else if (id) {
      return (
        <p className='main-title'>مرحبا ضيوف طاولة {usertitle(id)} <br /> في</p>
      );
    } else {
      return (
        <p className='main-title'>مرحبا بكم  <br /> في</p>
      );
    }
  };

  return (
    <detacontext.Consumer>
      {
        ({ askingForHelp, userLoginInfo, usertitle }) => {
          return (
            <main className='main-home' id='main'>
              <div className="container">
                <div className="content">
                  {renderWelcomeMessage(userLoginInfo, usertitle)}
                  <p className='main-text'> Calma Cafe <br /> ابدأ رحلة استكشاف الحلو من كالما كافيه بمنتجات جديدة</p>
                  <ul className="main-btn">
                    {id ?
                      <>
                        <li className='main-li' onClick={() => askingForHelp(id)}>طلب الويتر</li>
                        <li className='main-li'><a href="#menu">المنيو</a></li>
                      </>
                      :
                      <li className='main-li mrl-auto'><a href="#menu">المنيو</a></li>
                    }
                  </ul>
                </div>
              </div>
            </main>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Home;
