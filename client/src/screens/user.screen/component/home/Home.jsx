import React, { useRef, useState, useEffect } from 'react';
import './Home.css'
import { detacontext } from '../../../../App'
import { useParams } from 'react-router-dom';

const Home = () => {
  const {id} = useParams()
  return (
    <detacontext.Consumer>
      {
        ({askingForHelp ,userLoginInfo, usertitle}) => {
          return (
            <main className='main-home' id='main'> 
              <div className="container">
                <div className="content">
                  {userLoginInfo&&userLoginInfo.userinfo && id  ?<p className='main-title'>مرحبا {usertitle(userLoginInfo.userinfo.id)} <br/>علي طاولة {usertitle(id)} <br/> في</p>
                  : userLoginInfo&&userLoginInfo.userinfo?<p className='main-title'>مرحبا {usertitle(userLoginInfo.userinfo.id)} <br/> في</p>
                  : id?<p className='main-title'>مرحبا ضيوف طاولة {usertitle(id)} <br/> في</p>
                  :<p className='main-title'>مرحبا بكم  <br/> في</p>
                  }
                  <p className='main-text'> Calma Cafe <br /> ابدأ رحلة استكشاف الحلو من كالما كافيه بمنتجات جديدة</p>
                  <ul className="main-btn">

                    {id?<>
                    <li className='main-li' onClick={()=>askingForHelp(id)}>طلب الويتر</li>
                    <li className='main-li'><a href="#menu">المنيو</a></li>
                    </>
                    :<li className='main-li mrl-auto'><a href="#menu">المنيو</a></li>}
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

export default Home