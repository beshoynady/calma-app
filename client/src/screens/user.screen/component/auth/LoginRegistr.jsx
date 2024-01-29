import React, { useState, useRef } from 'react';
import './LoginRegistr.css';
// import axios from 'axios';
// import jwt_decode from "jwt-decode";
import { detacontext } from '../../../../App'
import { Link, useNavigate } from 'react-router-dom';

const LoginRegistr = (props) => {
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
  const [address, setaddress] = useState("")
  const [phone, setphone] = useState("")
  const [password, setpassword] = useState("")
  const [passconfirm, setpassconfirm] = useState("")

  const closeform=()=>{
    authform.current.style.display="none"
  }
  // axios.defaults.withCredentials= true ;

  // const signup = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const newclient = await axios.post('https://caviar-api.vercel.app/api/auth/signup', { username, password, phone, address, email })
  //     console.log(newclient)
  //     const token = newclient.accessToken
  //     localStorage.setItem("token", token)
  //     navigate('/login')
  //     } catch (error) {
  //     console.log(error)
  //   }
  // }


  // const login = async (e) => {
  //   e.preventDefault()
  //   console.log(phone);
  //   console.log(password);
  //   try {
  //     const client = await axios.post('https://caviar-api.vercel.app/api/auth/login', { phone, password })
  //     // console.log(client.data)
  //     // window.location.href =`http://localhost:3000/${client?.data._id}`;
  //     // console.log(client.data)
  //     if(client){
  //       const token = client.data.accessToken ;
  //       if(token){
  //         localStorage.setItem("token", token)
  //       }
  //       navigate('/')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <detacontext.Consumer>
      {
        ({login, signup }) => {
          return (

            <div className='auth-section' ref={authform} style={openlogin? { 'display': 'flex' } : { 'display': 'none' }}>
              <div className="wrapper">
                <div className="title-text">
                  <Link to={'login'} ref={loginText} className="title login">
                    Login Form
                  </Link>
                  <Link to={'signup'} className="title signup">
                    Signup Form
                  </Link>
        
                </div>
                <div className="form-container">
                  <div className="slide-controls">
                    <input type="radio" name="slide" id="signup" />
                    <input type="radio" name="slide" id="login" defaultChecked />
                    <label htmlFor="login" className="slide login" onClick={() => {
                      loginForm.current.style.marginRight = "0%";
                      loginText.current.style.marginRight = "0%";
                    }}>Login</label>
                    <label htmlFor="signup" className="slide signup" onClick={() => {
                      loginForm.current.style.marginRight = "-50%";
                      loginText.current.style.marginRight = "-50%";
                    }}>Signup</label>
                    <div className="slider-tab"></div>
                  </div>
                  <div className="form-inner">
                    <form ref={loginForm} className="login" onSubmit={(e)=>login(e,phone,password)}>
                      <div className="field">
                        <input type="text" placeholder="Phone" required onChange={(e) => setphone(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="password" placeholder="Password" required onChange={(e) => setpassword(e.target.value)} />
                      </div>
                      <div className="pass-link">
                        <a href="#">Forgot password?</a>
                      </div>
                      <div className="field btn">
                        <div className="btn-layer"></div>
                        <input type="submit" value="Login"  onClick={closeform}/>
                      </div>
                      <div className="signup-link" >
                        Not a member? <a ref={signupLink} href="" onClick={(e) => {
                          e.preventDefault()
                          loginForm.current.style.marginLeft = "-50%";
                          loginText.current.style.marginLeft = "-50%";
                        }}>Signup now</a>
                      </div>
                    </form>
                    <form className="signup" onSubmit={(e)=>signup(e,username,password,phone,address,email)}>
                      <div className="field">
                        <input type="text" placeholder="User Name" required onChange={(e) => setusername(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="text" placeholder="E-Mail" required onChange={(e) => setemail(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="text" placeholder="Phone" required onChange={(e) => setphone(e.target.value)} />
                      </div>
                      <div className="field">
                        <textarea placeholder="address" cols="42" rows="2" required onChange={(e) => setaddress(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="password" placeholder="Password" required onChange={(e) => setpassword(e.target.value)} />
                      </div>
                      <div className="field">
                        <input type="password" placeholder="Confirm password" required onChange={(e) => setpassconfirm(e.target.value)} />
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