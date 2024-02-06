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
          <h1>CALMA CAFI</h1>
        </div>
        <div className="footer-nav">
        <ul className='foo-nav'>
            <li><a href="#">الرئيسية</a></li>
            <li><a href="#menu">قائمة الطعام</a></li>
            <li><a href="#offer">العروض</a></li>
            <li><a href="#location">موقعنا</a></li>
            <li><a href="#contact">تواصل معنا</a></li>
          </ul>
        </div>
        <div className="footer-social">
          <ul className='foo-soci'>
            <li><a href="https://www.facebook.com/calmacafeegy" target='_blank'><img src={face} alt="facebook" /></a></li>
            <li><a href=""><img src={twit} alt="" /></a></li>
            <li><a href=""><img src={inst} alt="" /></a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer