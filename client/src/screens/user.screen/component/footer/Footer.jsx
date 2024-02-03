import React from 'react'
import './Footer.css';
import face from'../../../../image/social/facebook.svg'
import twit from'../../../../image/social/twitter.svg'
import inst from'../../../../image/social/square-instagram.svg'
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-logo">
          <h1>caviar</h1>
        </div>
        <div className="footer-nav">
        <ul className='foo-nav'>
            <li><a href="#">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#offer">offers</a></li>
            <li><a href="#location">Location</a></li>
            <li><a href="#contact">contact Us</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <ul className='foo-soci'>
            <li><a href=""><img src={face} alt="" /></a></li>
            <li><a href=""><img src={twit} alt="" /></a></li>
            <li><a href=""><img src={inst} alt="" /></a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer