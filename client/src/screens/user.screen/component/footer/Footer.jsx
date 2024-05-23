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
            // <div classNameName="container">
            //   <div classNameName="footer-logo">
            //     <h1>CALMA CAFI</h1>
            //   </div>
            //   <div classNameName="footer-nav">
            //   <ul classNameName='foo-nav'>
            //       <li><a href="#">الرئيسية</a></li>
            //       <li><a href="#menu">قائمة الطعام</a></li>
            //       <li><a href="#offer">العروض</a></li>
            //       <li><a href="#location">موقعنا</a></li>
            //       <li><a href="#contact">تواصل معنا</a></li>
            //     </ul>
            //   </div>
            //   <div classNameName="footer-social">
            //     <ul classNameName='foo-soci'>
            //       <li><a href="https://www.facebook.com/calmacafeegy" target='_blank'><img src={face} alt="facebook" /></a></li>
            //       <li><a href=""><img src={twit} alt="" /></a></li>
            //       <li><a href=""><img src={inst} alt="" /></a></li>
            //     </ul>
            //   </div>
            // </div>
            <div className="container bottom-0">
              <footer className="text-white text-center text-lg-start" style={{ backgroundColor: "#23242a" }}>
                <div className="container p-4">
                  <div className="row mt-4">
                    <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
                      <h5 className="text-uppercase mb-4">{restaurantData.name}</h5>

                      <p>{restaurantData.description}</p>

                      <div className="mt-4">
                        {restaurantData.social_media&&restaurantData.social_media.map((item, i) => (
                          item.platform === 'facebook' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg ml-1"><i className="fab fa-facebook-f"></i></a> :
                            item.platform === 'twitter' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg ml-1"><i className="fab fa-twitter"></i></a> :
                              item.platform === 'instagram' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg ml-1"><i className="fab fa-instagram"></i></a> :
                                item.platform === 'linkedin' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg ml-1"><i className="fab fa-linkedin-in"></i></a> :
                                  item.platform === 'youtube' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg ml-1"><i className="fab fa-youtube"></i></a> :
                                    null
                        ))}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                      {/* <h5 className="text-uppercase mb-4 pb-1">Search something</h5>

                      <div className="form-outline form-white mb-4">
                        <input type="text" id="formControlLg" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="formControlLg" style={{ marginLeft: 0 }}>Search</label>
                      </div> */}

                      <ul className="fa-ul" style={{ marginLeft: "1.65em" }}>
                        <li className="mb-3">
                          <span className="fa-li"><i className="fas fa-home"></i></span>
                          <span className="ms-2">`${restaurantData.address.state} ${restaurantData.address.city} ${restaurantData.address.street}`</span>
                        </li>
                        <li className="mb-3">
                          <span className="fa-li"><i className="fas fa-envelope"></i></span>
                          <span className="ms-2">{restaurantData.contact.email}</span>
                        </li>
                        <li className="mb-3">
                          <span className="fa-li"><i className="fas fa-phone"></i></span>
                          <span className="ms-2">{restaurantData.contact.phone}</span>
                        </li>
                        <li className="mb-3">
                          <span className="fa-li"><i className="fas fa-whatsapp"></i></span>
                          <span className="ms-2">{restaurantData.contact.whatsapp}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h5 className="text-uppercase mb-4">مواعيد العمل</h5>
                      <table className="table text-center text-white">
                        <tbody className="font-weight-normal">
                          {restaurantData.opening_hours ? restaurantData.opening_hours.map(item =>
                            <tr>
                              <td>{item.day}:</td>
                              {
                                item.closed ?
                                  <td>مغلق</td>
                                  : <td>{item.from} - {item.to}</td>
                              }
                            </tr>
                          ) : ''}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                  © 2020 Copyright:
                  <a className="text-white" href="https://mdbootstrap.com/">MDBootstrap.com</a>
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