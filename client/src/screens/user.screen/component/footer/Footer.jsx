import React from 'react'
// import './Footer.css';
import { detacontext } from '../../../../App'

import face from '../../../../image/social/facebook.svg'
import twit from '../../../../image/social/twitter.svg'
import inst from '../../../../image/social/square-instagram.svg'
const Footer = () => {
  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, askingForHelp, userLoginInfo, usertitle }) => {
          return (
            // <footer>
            // <div className="container">
            //   <div className="footer-logo">
            //     <h1>CALMA CAFI</h1>
            //   </div>
            //   <div className="footer-nav">
            //   <ul className='foo-nav'>
            //       <li><a href="#">الرئيسية</a></li>
            //       <li><a href="#menu">قائمة الطعام</a></li>
            //       <li><a href="#offer">العروض</a></li>
            //       <li><a href="#location">موقعنا</a></li>
            //       <li><a href="#contact">تواصل معنا</a></li>
            //     </ul>
            //   </div>
            //   <div className="footer-social">
            //     <ul className='foo-soci'>
            //       <li><a href="https://www.facebook.com/calmacafeegy" target='_blank'><img src={face} alt="facebook" /></a></li>
            //       <li><a href=""><img src={twit} alt="" /></a></li>
            //       <li><a href=""><img src={inst} alt="" /></a></li>
            //     </ul>
            //   </div>
            // </div>
            <div class="container my-5">

              <footer class="text-white text-center text-lg-start" style="background-color: #23242a;">
                <div class="container p-4">
                  <div class="row mt-4">
                    <div class="col-lg-4 col-md-12 mb-4 mb-md-0">
                      <h5 class="text-uppercase mb-4">{restaurantData.name}</h5>

                      <p>
                        {restaurantData.description}
                      </p>


                      <div class="mt-4">
                        {restaurantData.contact.Object.keys(social_media).map((social, i)=>{
                          <a type="button" class="btn btn-floating btn-warning btn-lg"><i className={`fab fa-${social}`}></i></a>
                        })}
                        {/* <a type="button" class="btn btn-floating btn-warning btn-lg"><i class="fab fa-dribbble"></i></a>
                        <a type="button" class="btn btn-floating btn-warning btn-lg"><i class="fab fa-twitter"></i></a>
                        <a type="button" class="btn btn-floating btn-warning btn-lg"><i class="fab fa-google-plus-g"></i></a> */}
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h5 class="text-uppercase mb-4 pb-1">Search something</h5>

                      <div class="form-outline form-white mb-4">
                        <input type="text" id="formControlLg" class="form-control form-control-lg" />
                        <label class="form-label" for="formControlLg" style="margin-left: 0px;">Search</label>
                        <div class="form-notch"><div class="form-notch-leading" style="width: 9px;"></div><div class="form-notch-middle" style="width: 48.8px;"></div><div class="form-notch-trailing"></div></div></div>

                      <ul class="fa-ul" style="margin-left: 1.65em;">
                        {}
                        <li class="mb-3">
                          <span class="fa-li"><i class="fas fa-home"></i></span><span class="ms-2">New York, NY 10012, US</span>
                        </li>
                        <li class="mb-3">
                          <span class="fa-li"><i class="fas fa-envelope"></i></span><span class="ms-2">info@example.com</span>
                        </li>
                        <li class="mb-3">
                          <span class="fa-li"><i class="fas fa-phone"></i></span><span class="ms-2">+ 01 234 567 88</span>
                        </li>
                        <li class="mb-3">
                          <span class="fa-li"><i class="fas fa-print"></i></span><span class="ms-2">+ 01 234 567 89</span>
                        </li>
                      </ul>
                    </div>

                    <div class="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h5 class="text-uppercase mb-4">Opening hours</h5>

                      <table class="table text-center text-white">
                        <tbody class="font-weight-normal">
                          <tr>
                            <td>Mon - Thu:</td>
                            <td>8am - 9pm</td>
                          </tr>
                          <tr>
                            <td>Fri - Sat:</td>
                            <td>8am - 1am</td>
                          </tr>
                          <tr>
                            <td>Sunday:</td>
                            <td>9am - 10pm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
                  © 2020 Copyright:
                  <a class="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
                </div>
              </footer>

            </div>

            // </footer>
          )
        }
      }
    </detacontext.Consumer>

  )
}

export default Footer