import React from 'react'
import './Contact.css'
import whatsapp from '../../../../image/whatsapp.png'
import facebook from '../../../../image/facebook.png'

const Contact = () => {

    return (
        <section className='contact' id='contact'>
            <div className="container">
                <div className="section-title">
                    <h2>تواصل معنا</h2>
                </div>
                <div className='contact-content'>
                    <div className="right">
                        <p>صفحتنا علي الفيس بوك<br />
                            <a href='https://www.facebook.com/calmacafeegy' target="_blank"  rel="noreferrer"> <img src={facebook} alt="facebook Icon" /></a>
                        </p>
                        <p> واتساب
                            <a href="https://api.whatsapp.com/send?phone=+201144001433" target="_blank"  rel="noreferrer"><img src={whatsapp} alt="WhatsApp Icon" /></a>
                        </p>
                        <p>موبايل
                            <a href="tel:01144001433">01144001433</a>
                        </p>
                    </div>
                    <div className="left">
                        <h2>لارسال الشكاوي و الملاحظات</h2>
                        <form action="">
                            <input placeholder='الاسم' type="text" id='name' required />
                            <input placeholder='E-Mail' type="email" id='email' />
                            <input placeholder='الموبايل' type="tel" id='phone' required />
                            <textarea placeholder='رسالتك' maxLength={150} type="text" id='supject' required />
                            <button type='Submit'>ارسال</button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Contact