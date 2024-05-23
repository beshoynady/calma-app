import React from 'react'
// import './Footer.css';
import { detacontext } from '../../../../App'

const Footer = () => {
  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, askingForHelp, userLoginInfo, usertitle }) => {
          return (
            <div className="container bottom-0">
              <footer className="text-white text-center" style={{ backgroundColor: "#23242a" }}>
                <div className="container p-4">
                  <div className="row mt-4">
                    <div className="col-lg-4 col-md-12 mb-4 mb-md-0">
                      <h5 className="text-uppercase mb-4">{restaurantData.name}</h5>
                      <p>{restaurantData.description}</p>
                      <div className="mt-4">
                        {restaurantData.social_media && restaurantData.social_media.map((item, i) => (
                          item.platform === 'facebook' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg mr-1"><i className="fab fa-facebook-f"></i></a> :
                            item.platform === 'twitter' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg mr-1"><i className="fab fa-twitter"></i></a> :
                              item.platform === 'instagram' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg mr-1"><i className="fab fa-instagram"></i></a> :
                                item.platform === 'linkedin' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg mr-1"><i className="fab fa-linkedin-in"></i></a> :
                                  item.platform === 'youtube' ? <a key={i} href={item.url} className="btn btn-floating btn-warning btn-lg mr-1"><i className="fab fa-youtube"></i></a> :
                                    null
                        ))}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h5 className="text-uppercase mb-4 pb-1">ابحث عن شيء</h5>
                      <div className="form-outline form-white mb-4">
                        <input type="text" id="formControlLg" className="form-control form-control-lg" />
                        <label className="form-label" htmlFor="formControlLg" style={{ marginRight: 0 }}>بحث</label>
                      </div>
                      <ul className="fa-ul" style={{ marginRight: "1.65em" }}>
                        {restaurantData.address && (
                          <li className="mb-3">
                            <span className="ms-2">
                              {`${restaurantData.address.state || ''} ${restaurantData.address.city || ''} ${restaurantData.address.street || ''}`}
                            </span>
                            <span className="fa-li"><i className="fas fa-home"></i></span>
                          </li>
                        )}
                        {restaurantData.contact?.email && (
                          <li className="mb-3">
                            <span className="ms-2">{restaurantData.contact.email}</span>
                            <span className="fa-li"><i className="fas fa-envelope"></i></span>
                          </li>
                        )}
                        {restaurantData.contact?.phone && (
                          <li className="mb-3">
                            <span className="ms-2">{restaurantData.contact.phone}</span>
                            <span className="fa-li"><i className="fas fa-phone"></i></span>
                          </li>
                        )}
                        {restaurantData.contact?.whatsapp && (
                          <li className="mb-3">
                            <span className="ms-2">{restaurantData.contact.whatsapp}</span>
                            <span className="fa-li"><i className="fab fa-whatsapp"></i></span>
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                      <h5 className="text-uppercase mb-4">مواعيد العمل</h5>
                      <table className="table text-center text-white">
                        <tbody className="font-weight-normal">
                          {restaurantData.opening_hours ? restaurantData.opening_hours.map((item, index) => (
                            <tr key={index}>
                              <td>{item.day}:</td>
                              <td>{item.closed ? 'مغلق' : `${item.from} - ${item.to}`}</td>
                            </tr>
                          )) : ''}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                  © 2020 حقوق النشر:
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