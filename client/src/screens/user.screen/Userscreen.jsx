import React from 'react'
import Header from './component/header/Header'
import Home from './component/home/Home.jsx';
import Offers from './component/offers/Offers.jsx';
import Menu from './component/menu/Menu.jsx';
import Location from './component/location/Location.jsx';
import Contact from './component/contact/Contact.jsx';
import Footer from './component/footer/Footer.jsx';
import { ToastContainer, toast } from 'react-toastify';




const Userscreen = () => {
    return (
        <div className='userscreen'>
            <ToastContainer/>
            <Header />
            <Home />
            <Offers />
            <Menu />
            <Location />
            <Contact />
            <Footer />
        </div>
    )
}

export default Userscreen