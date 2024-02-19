import React from 'react';
import './Contact.css';
import whatsapp from '../../../../image/whatsapp.png';
import facebook from '../../../../image/facebook.png';

const Contact = () => {
    return (
        <section className='contact' id='contact'>
            <div className="container">
                <div className="section-title">
                    <h2>تواصل معنا</h2>
                </div>
                <div className='contact-content'>
                    <div className="contact-info">
                        <h3>معلومات الاتصال</h3>
                        <div className="social-media">
                            <a href='https://www.facebook.com/calmacafeegy' target="_blank" rel="noreferrer">
                                <img src={facebook} alt="Facebook Icon" />
                            </a>
                            <a href="https://api.whatsapp.com/send?phone=+201144001433" target="_blank" rel="noreferrer">
                                <img src={whatsapp} alt="WhatsApp Icon" />
                            </a>
                        </div>
                        <p className="phone">موبايل: <a href="tel:01144001433">01144001433</a></p>
                    </div>
                    <div className="contact-form">
                        <h3>أرسل لنا رسالتك</h3>
                        <form action="">
                            <div className="form-group">
                                <input placeholder='الاسم' type="text" id='name' required />
                            </div>
                            <div className="form-group">
                                <input placeholder='البريد الإلكتروني' type="email" id='email' required />
                            </div>
                            <div className="form-group">
                                <input placeholder='الموبايل' type="tel" id='phone' required />
                            </div>
                            <div className="form-group">
                                <textarea placeholder='رسالتك' maxLength={150} id='supject' required />
                            </div>
                            <button type='Submit'>ارسال</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact;
