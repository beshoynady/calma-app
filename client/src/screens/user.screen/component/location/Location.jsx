import React from 'react';
import './Location.css';
import { detacontext } from '../../../../App'



const Location = () => {
  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, askingForHelp, userLoginInfo, usertitle }) => {
          return (
            <section id='location'>
              <div className="container">
                <div className='section-title'>
                  <h2>موقعنا</h2>
                </div>

                <div className='location-content'>
                  <div className="right">
                    <h1>منتظركم في  <br />{restaurantData.name}</h1>
                    {restaurantData.address && 
                    <p>
                      العنوان :{`محافظة: ${restaurantData.address.state || ''}مدينة: ${restaurantData.address.city || ''} شارع: ${restaurantData.address.street || ''}`}
                    </p>
                    }
                  </div>
                  <div className="left">
                    <iframe
                      src={restaurantData.LocationUrl}
                      width="100%"
                      height="100%"
                      style={{ border: '0', allowfullscreen: '', referrerpolicy: 'no-referrer-when-downgrade' }}
                      loading="async"
                      title="Google Map"
                    ></iframe>
                  </div>

                </div>
              </div>
            </section>
          )
        }
      }
    </detacontext.Consumer>

  );
};

export default Location;
