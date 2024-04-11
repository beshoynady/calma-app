import React, { useState } from 'react'
import './Login.css'
import { detacontext } from '../../../../App'



const Login = () => {
    
    const [phone, setphone] = useState('')
    const [password, setpassword] = useState('')
    return (
        <detacontext.Consumer>
            {
                ({ adminLogin }) => {
                    return (
                        <section className="body">
                            <div className="container">
                                <div className="login-box">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="logo">
                                                <span className="logo-font">Go</span>Snippets
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <br/>
                                                <h3 className="header-title">سجل دخول</h3>
                                                <form className="login-form" onSubmit={(e) => adminLogin(e, phone, password)}>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" placeholder="phone" onChange={(e) => setphone(e.target.value)} />
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="Password" className="form-control" placeholder="Password" onChange={(e) => setpassword(e.target.value)} />
                                                        <a href="#!" className="forgot-password">Forgot Password?</a>
                                                    </div>
                                                    <div className="form-group">
                                                        <button className="btn btn-47 btn btn-47-primary btn btn-block">تسجيل دخول</button>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="text-center">New Member? <a href="#!">Sign up Now</a></div>
                                                    </div>
                                                </form>
                                        </div>
                                        <div className="col-sm-6 hide-on-mobile">
                                            <div id="demo" className="carousel slide" data-ride="carousel">
                                                {/* <!-- Indicators --> */}
                                                <ul className="carousel-indicators">
                                                    <li data-target="#demo" data-slide-to="0" className="active"></li>
                                                    <li data-target="#demo" data-slide-to="1"></li>
                                                </ul>
                                                {/* <!-- The slideshow --> */}
                                                <div className="carousel-inner">
                                                    <div className="carousel-item active">
                                                        <div className="slider-feature-card">
                                                            <img src="https://i.imgur.com/YMn8Xo1.png" alt="" />
                                                            <h3 className="slider-title">Title Here</h3>
                                                            <p className="slider-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, odio!</p>
                                                        </div>   
                                                    </div>
                                                    <div className="carousel-item">
                                                        <div className="slider-feature-card">
                                                            <img src="https://i.imgur.com/Yi5KXKM.png" alt=""/>
                                                                <h3 className="slider-title">Title Here</h3>
                                                                <p className="slider-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, debitis?</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!-- Left and right controls --> */}
                                                <a className="carousel-control-prev" href="#demo" data-slide="prev">
                                                    <span className="carousel-control-prev-icon"></span>
                                                </a>
                                                <a className="carousel-control-next" href="#demo" data-slide="next">
                                                    <span className="carousel-control-next-icon"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                }
            }
        </detacontext.Consumer>
    )
}

export default Login