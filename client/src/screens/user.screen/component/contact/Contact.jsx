import React from 'react'
import axios from 'axios'
import './Contact.css'
import whatsapp from '../../../../image/whatsapp.png'
import facebook from '../../../../image/facebook.png'

const Contact = () => {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const sendmassage = async(e)=>{
        e.preventDefault();
        try {
            if(!name|| !phone|| !message){
                toast.error('الاسم و الموبايل و الرساله حقول مطلوبه')
            }
            const send = await axios.post(`${apiUrl}/app/massage`,{
                name, email, phone, message
            })
            if (send.status === 201){
                toast.success('تم ارسال رسالتك بنجاح')
            }else {
                toast.error('حدث خطأ اثناء ارسال الرساله ! حاول مره اخري')
            }
        } catch (error) {
            toast.error('فشل ارسال الرسال ! حاول مرع اخري')
        }
    }

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
                        <form onSubmit={sendmassage}>
                            <input placeholder='الاسم' type="text" id='name' required onChange={(e)=>setName(e.target.value)}/>
                            <input placeholder='E-Mail' type="email" id='email' onChange={(e)=>setEmail(e.target.value)}/>
                            <input placeholder='الموبايل' type="tel" id='phone' required onChange={(e)=>setPhone(e.target.value)}/>
                            <textarea placeholder='رسالتك' maxLength={150} type="text" id='supject' required onChange={(e)=>setMessage(e.target.value)}/>
                            <button type='Submit'>ارسال</button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Contact