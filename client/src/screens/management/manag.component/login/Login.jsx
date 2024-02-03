import React,{useState} from 'react'
import './Login.css'
import { detacontext } from '../../../../App'
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
const [phone, setphone] = useState('')
const [password, setpassword] = useState('')
    return (
        <detacontext.Consumer>
            {
                ({ employeelogin }) => {
                    return (
                        <div className="login-container">
                            <ToastContainer/>
                            <div className="screen">
                                <div className="screen__content">
                                    <form className="login-dash" onSubmit={(e)=>employeelogin(e,phone, password)} >
                                        <div className="login__field">
                                            <i className="login__icon fas fa-user"></i>
                                            <input type="text" className="login__input" placeholder="Your Phone" onChange={(e)=>setphone(e.target.value)}/>
                                        </div>
                                        <div className="login__field">
                                            <i className="login__icon fas fa-lock"></i>
                                            <input type="password" className="login__input" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
                                        </div>
                                        <button className="button login__submit">
                                            <span className="button__text">تسجيل الدخول</span>
                                            <i className="button__icon fas fa-chevron-left"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="screen__background">
                                    <span className="screen__background__shape screen__background__shape4"></span>
                                    <span className="screen__background__shape screen__background__shape3"></span>
                                    <span className="screen__background__shape screen__background__shape2"></span>
                                    <span className="screen__background__shape screen__background__shape1"></span>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        </detacontext.Consumer>
    )
}

export default Login