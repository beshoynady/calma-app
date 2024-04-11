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
                        <section class="body">
                            <div class="container">
                                <div class="login-box">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="logo">
                                                <span class="logo-font">Go</span>Snippets
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <br/>
                                                <h3 class="header-title">سجل دخول</h3>
                                                <form class="login-form" onSubmit={(e) => adminLogin(e, phone, password)}>
                                                    <div class="form-group">
                                                        <input type="text" class="form-control" placeholder="phone" onChange={(e) => setphone(e.target.value)} />
                                                    </div>
                                                    <div class="form-group">
                                                        <input type="Password" class="form-control" placeholder="Password" onChange={(e) => setpassword(e.target.value)} />
                                                        <a href="#!" class="forgot-password">Forgot Password?</a>
                                                    </div>
                                                    <div class="form-group">
                                                        <button class="btn btn-primary btn-block">تسجيل دخول</button>
                                                    </div>
                                                    <div class="form-group">
                                                        <div class="text-center">New Member? <a href="#!">Sign up Now</a></div>
                                                    </div>
                                                </form>
                                        </div>
                                        <div class="col-sm-6 hide-on-mobile">
                                            <div id="demo" class="carousel slide" data-ride="carousel">
                                                {/* <!-- Indicators --> */}
                                                <ul class="carousel-indicators">
                                                    <li data-target="#demo" data-slide-to="0" class="active"></li>
                                                    <li data-target="#demo" data-slide-to="1"></li>
                                                </ul>
                                                {/* <!-- The slideshow --> */}
                                                <div class="carousel-inner">
                                                    <div class="carousel-item active">
                                                        <div class="slider-feature-card">
                                                            <img src="https://i.imgur.com/YMn8Xo1.png" alt="" />
                                                            <h3 class="slider-title">Title Here</h3>
                                                            <p class="slider-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, odio!</p>
                                                        </div>   
                                                    </div>
                                                    <div class="carousel-item">
                                                        <div class="slider-feature-card">
                                                            <img src="https://i.imgur.com/Yi5KXKM.png" alt=""/>
                                                                <h3 class="slider-title">Title Here</h3>
                                                                <p class="slider-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione, debitis?</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <!-- Left and right controls --> */}
                                                <a class="carousel-control-prev" href="#demo" data-slide="prev">
                                                    <span class="carousel-control-prev-icon"></span>
                                                </a>
                                                <a class="carousel-control-next" href="#demo" data-slide="next">
                                                    <span class="carousel-control-next-icon"></span>
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