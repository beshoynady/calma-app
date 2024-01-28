import React from 'react'
import './Location.css'

const Location = () => {
  return (
    <section id='location'>
        <div className="container">
          <div className='section-title'>
            <h2>location</h2>
          </div>
          <div className='location-content'>
            <div className="left">
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1161.634263800247!2d31.11283779962701!3d29.041697570065313!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145a25b86c1d853f%3A0xfd7ec602f95c7705!2z2YXYt9i52YUg2YPYp9mB2YrYp9ix!5e0!3m2!1sar!2seg!4v1685709736432!5m2!1sar!2seg"width="100%" height="100%" style={{border:'0',allowfullscreen:'', loading:'lazy', referrerpolicy:'no-referrer-when-downgrade'}}></iframe>
            </div>
            <div className="right">
                <h1>كافيار للمأكولات البحرية <br/>Caviar Seafood</h1>
                <p>
                   العنوان : بني سويف - بني سويف الجديدة شرق النيل بجوار بنك الاسكندرية
                </p>
            </div>
          </div>

        </div>
    </section>
  )
}

export default Location