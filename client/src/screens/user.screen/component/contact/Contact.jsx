import React from 'react'
import './Contact.css'

const Contact = () => {
    return (
        <section className='contact' id='contact'>
            <div className="container">
                <div className="section-title">
                    <h2>contact us</h2>
                </div>
                <div className='contact-content'>
                    <div className="left">
                        <h2></h2>
                        <form action="">
                            <input placeholder='Name' type="text" id='name' />
                            <input placeholder='E-Mail' type="email" id='email' />
                            <input placeholder='Phone' type="tel" id='phone' />
                            <textarea placeholder='message' type="text" id='supject' />
                            <button type='Submit'>send</button>
                        </form>
                    </div>
                    <div className="right">
                        <p>صفجتنا علي الفيس بوك<br/>
                            <a href='https://www.facebook.com/Caviarseafood2'>كافيار للمأكولات البحرية Caviar Seafood
                            </a>
                        </p>
                        <p>0100000000 : رقم الموبايل</p>
                        <p>واتس: 0111111111</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact