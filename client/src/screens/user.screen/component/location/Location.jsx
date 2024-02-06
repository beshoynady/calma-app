import React from 'react'
import './Location.css'

const Location = () => {
  return (
    <section id='location'>
        <div className="container">
          <div className='section-title'>
            <h2>موقعنا</h2>
          </div>
          <div className="right">
                <h1>منتظركم في  <br/>Calma Cafe</h1>
                <p>
                   العنوان : بني سويف- الفشن - أخر شارع البحر الأعظم بجوار ماركت طيبة
                </p>
            </div>
          <div className='location-content'>
            <div className="left">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d345.3559841407438!2d30.906397270495084!3d28.819128412589315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145a4b2af2df1305%3A0x217338bf74a4527b!2z2KfZhNmB2LTZhtiMINmF2K_ZitmG2Kkg2KfZhNmB2LTZhtiMINin2YTZgdi02YbYjCDZhdit2KfZgdi42Kkg2KjZhtmKINiz2YjZitmB!5e1!3m2!1sar!2seg!4v1707242962620!5m2!1sar!2seg" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

          </div>

        </div>
    </section>
  )
}

export default Location