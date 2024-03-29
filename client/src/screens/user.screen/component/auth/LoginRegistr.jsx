import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

// import jwt_decode from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import './LoginRegistr.css';

const LoginRegistr = (props) => {
  // const apiUrl = process.env.REACT_APP_API_URL;
  // const token = localStorage.getItem('token_e');
  // const config = {
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //   },
  // };
  // const navigate = useNavigate()
  const openlogin = props.openlogin;
  const [openform, setopenform] = useState(props.openlogin)
  const [closelogin, setcloselogin] = useState(true)

  const authform = useRef()
  const loginText = useRef()
  const loginForm = useRef()
  const signupLink = useRef()

  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [deliveryArea, setdeliveryArea] = useState("")
  const [address, setaddress] = useState("")
  const [phone, setphone] = useState("")
  const [password, setpassword] = useState("")
  const [passconfirm, setpassconfirm] = useState("")


  const [areas, setAreas] = useState([]);

  
    const getAllDeliveryAreas= async()=>{
    try {
      const response = await axios.get(`${apiUrl}/api/deliveryarea`)
      const data = await response.data
      console.log({ data })
      if(data){
        setAreas(data)
      }else{
        toast.error('لا يوجد بيانات لمنطقه التوصيل ! اضف بيانات منطقه التوصيل ')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب بيانات منطقه التوصيل! اعد تحميل الصفحة')
    }
  }

  const closeform = () => {
    authform.current.style.display = "none"
  }

  useEffect(() => {
    getAllDeliveryAreas()
  }, [])
  

  return (
    <detacontext.Consumer>
      {
        ({ login, signup }) => {
          return (
            <div className='auth-section' ref={authform} style={openlogin ? { 'display': 'flex' } : { 'display': 'none' }}>
              <div className="wrapper">
                {/* <div className="title-text">
                  <Link to={'login'} ref={loginText} className="title login">
                    تسجيل دخول
                  </Link>
                  <Link to={'signup'} className="title signup">
                    تسجيل عضو جديد
                  </Link>

                </div> */}
                <div className="form-container">
                  <div className="slide-controls">
                    <input type="radio" name="slide" id="signup" />
                    <input type="radio" name="slide" id="login" defaultChecked />
                    <label htmlFor="login" className="slide login" onClick={() => {
                      loginForm.current.style.marginRight = "0%";
                      // loginText.current.style.marginRight = "0%";
                    }}>دخول</label>
                    <label htmlFor="signup" className="slide signup" onClick={() => {
                      loginForm.current.style.marginRight = "-50%";
                      // loginText.current.style.marginRight = "-50%";
                    }}>عضو جديد</label>
                    <div className="slider-tab"></div>
                  </div>
                  <div className="form-inner">
                    <form ref={loginForm} className="login" onSubmit={(e) => login(e, phone, password)}>
                      <div className="field">
                        <input type="text" placeholder="Phone" required onChange={(e) => setphone(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="password" placeholder="Password" required onChange={(e) => setpassword(e.target.value)} />
                      </div>
                      {/* <div className="pass-link">
                        <a href="#">نسيت الباسورد?</a>
                      </div> */}
                      <div className="field btn">
                        <div className="btn-layer"></div>
                        <input type="submit" value="Login" onClick={closeform} />
                      </div>
                    </form>
                    <form className="signup" onSubmit={(e) => signup(e, username, phone, deliveryArea, address, email, password, passconfirm)}>
                      <div className="field">
                        <input type="text" placeholder="اسمك" required onChange={(e) => setusername(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="text" placeholder="الايميل" onChange={(e) => setemail(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="text" placeholder="الموبايل" required onChange={(e) => setphone(e.target.value)} />
                      </div>
                      <div className="field">
                        <select onChange={(e) => setdeliveryArea(e.target.value)}>
                          <option>اختر المنطقة</option>
                          {areas ? (
                            areas.map((area, i) => (
                              <option value={area._id} key={i}>{area.name}</option>
                            ))
                          ) : (
                            <option>لا توجد مناطق توصيل متاحة</option>
                          )}
                        </select>
                      </div>

                      <div className="field">
                        <textarea  placeholder='العنوان بالتفصيل' cols="42" rows="2" required onChange={(e) => setaddress(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="password" placeholder="الباسورد" required onChange={(e) => setpassword(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="password" placeholder="تاكيد الباسورد" required onChange={(e) => setpassconfirm(e.target.value)} />
                      </div>
                      <div className="field btn">
                        <div className="btn-layer"></div>
                        <input type="submit" value="Signup" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
    </detacontext.Consumer>
  )

}

export default LoginRegistr