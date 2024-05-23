import React from 'react'
import { ToastContainer } from 'react-toastify';
import './Userscreen.css'
import Header from './component/header/Header'
import Home from './component/home/Home.jsx';
import Offers from './component/offers/Offers.jsx';
import Menu from './component/menu/Menu.jsx';
import Location from './component/location/Location.jsx';
import Contact from './component/contact/Contact.jsx';
import Reservation from './component/reservations/Reservation.jsx';
import Footer from './component/footer/Footer.jsx';
import { detacontext } from '../../App.js'




const Userscreen = () => {
	return (
		<detacontext.Consumer>
			{
				({ restaurantData }) => {
					return (<div className='userscreen' style={{ direction: "rtl" }}>
						<ToastContainer />
						<Header />
						<Home />
						<Offers />
						<Menu />
						{restaurantData.location &&
							<Location />
						}
						{restaurantData.contact && restaurantData.social_media &&
							<Contact />
						}
						{restaurantData.usesReservationSystem &&
							<Reservation />
						}
						<Footer />
					</div>
					)
				}
			}
		</detacontext.Consumer>
	)

}

export default Userscreen