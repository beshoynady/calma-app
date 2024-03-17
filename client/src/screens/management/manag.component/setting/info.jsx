import React, { useState } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

const Info = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    state: '',
    city: '',
    street: '',
    postal_code: '',
    phone: '',
    whatsapp: '',
    email: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    opening_hours_from: '',
    opening_hours_to: '',
    delivery: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // إرسال البيانات إلى الخادم باستخدام axios
      const response = await axios.post('رابط-الخادم', formData);
      // عرض رسالة نجاح باستخدام react-toastify
      toast.success('تمت إضافة المطعم بنجاح');
      // مسح البيانات المدخلة بعد الإرسال
      setFormData({
        name: '',
        description: '',
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: '',
        phone: '',
        whatsapp: '',
        email: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        opening_hours_from: '',
        opening_hours_to: '',
        delivery: false
      });
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة المطعم');
      console.error('Error:', error);
    }
  };

  return (
    <detacontext.Consumer>
      {({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => (
        <div className="container" dir='rtl'>
          {/* <h1 className="text-center">إضافة مطعم</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">الاسم:</label>
                            <input type="text" className="form-control" id="name" placeholder="ادخل اسم المطعم" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">الوصف:</label>
                            <textarea className="form-control" id="description" rows="3" placeholder="ادخل وصفا للمطعم" required></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="country">البلد:</label>
                                <input type="text" className="form-control" id="country" placeholder="ادخل اسم البلد" required />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="state">المحافظة:</label>
                                <input type="text" className="form-control" id="state" placeholder="ادخل اسم المحافظة" required />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="city">المدينة:</label>
                                <input type="text" className="form-control" id="city" placeholder="ادخل اسم المدينة" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="street">الشارع:</label>
                                <input type="text" className="form-control" id="street" placeholder="ادخل اسم الشارع" required />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="postal_code">الرمز البريدي:</label>
                                <input type="text" className="form-control" id="postal_code" placeholder="ادخل الرمز البريدي" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">رقم الهاتف:</label>
                            <input type="text" className="form-control" id="phone" placeholder="ادخل رقم الهاتف" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="whatsapp">واتساب:</label>
                            <input type="text" className="form-control" id="whatsapp" placeholder="ادخل رقم واتساب" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">البريد الإلكتروني:</label>
                            <input type="email" className="form-control" id="email" placeholder="ادخل البريد الإلكتروني" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="facebook">فيسبوك:</label>
                            <input type="text" className="form-control" id="facebook" placeholder="ادخل رابط فيسبوك" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="twitter">تويتر:</label>
                            <input type="text" className="form-control" id="twitter" placeholder="ادخل رابط تويتر" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="instagram">انستجرام:</label>
                            <input type="text" className="form-control" id="instagram" placeholder="ادخل رابط انستجرام" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="linkedin">لينكدإن:</label>
                            <input type="text" className="form-control" id="linkedin" placeholder="ادخل رابط لينكدإن" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="youtube">يوتيوب:</label>
                            <input type="text" className="form-control" id="youtube" placeholder="ادخل رابط يوتيوب" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="opening_hours">ساعات
                                العمل:</label>
                            <div className="row">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="من" id="opening_hours_from" required />
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="إلى" id="opening_hours_to" required />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="delivery">التوصيل متاح؟</label>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="delivery" />
                                <label className="form-check-label" htmlFor="delivery">
                                    نعم
                                </label>
                            </div>
                        </div>
                        <button style={{width:'47%', height:'50px'}} type="submit" className="btn btn-primary">إضافة المطعم</button>
                    </form> */}
          {/* 
                    <div class="container-scroller">
      <nav class="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div class="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
          <a class="navbar-brand brand-logo" href="../../index.html">
            <img src="../../assets/images/logo.svg" alt="logo" /> </a>
          <a class="navbar-brand brand-logo-mini" href="../../index.html">
            <img src="../../assets/images/logo-mini.svg" alt="logo" /> </a>
        </div>
        <div class="navbar-menu-wrapper d-flex align-items-center">
          <ul class="navbar-nav">
            <li class="nav-item font-weight-semibold d-none d-lg-block">Help : +050 2992 709</li>
            <li class="nav-item dropdown language-dropdown">
              <a class="nav-link dropdown-toggle px-2 d-flex align-items-center" id="LanguageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                <div class="d-inline-flex mr-0 mr-md-3">
                  <div class="flag-icon-holder">
                    <i class="flag-icon flag-icon-us"></i>
                  </div>
                </div>
                <span class="profile-text font-weight-medium d-none d-md-block">English</span>
              </a>
              <div class="dropdown-menu dropdown-menu-left navbar-dropdown py-2" aria-labelledby="LanguageDropdown">
                <a class="dropdown-item">
                  <div class="flag-icon-holder">
                    <i class="flag-icon flag-icon-us"></i>
                  </div>English
                </a>
                <a class="dropdown-item">
                  <div class="flag-icon-holder">
                    <i class="flag-icon flag-icon-fr"></i>
                  </div>French
                </a>
                <a class="dropdown-item">
                  <div class="flag-icon-holder">
                    <i class="flag-icon flag-icon-ae"></i>
                  </div>Arabic
                </a>
                <a class="dropdown-item">
                  <div class="flag-icon-holder">
                    <i class="flag-icon flag-icon-ru"></i>
                  </div>Russian
                </a>
              </div>
            </li>
          </ul>
          <form class="ml-auto search-form d-none d-md-block" action="#">
                                        <div class="form-group" style={{ width: '100%' }}>

              <input type="search" class="form-control" placeholder="Search Here"/>
            </div>
          </form>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
              <a class="nav-link count-indicator" id="messageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                <i class="mdi mdi-bell-outline"></i>
                <span class="count">7</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="messageDropdown">
                <a class="dropdown-item py-3">
                  <p class="mb-0 font-weight-medium float-left">You have 7 unread mails </p>
                  <span class="badge badge-pill badge-primary float-right">View all</span>
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <img src="../../assets/images/faces/face10.jpg" alt="image" class="img-sm profile-pic"/>
                  </div>
                  <div class="preview-item-content flex-grow py-2">
                    <p class="preview-subject ellipsis font-weight-medium text-dark">Marian Garner </p>
                    <p class="font-weight-light small-text"> The meeting is cancelled </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <img src="../../assets/images/faces/face12.jpg" alt="image" class="img-sm profile-pic"/>
                  </div>
                  <div class="preview-item-content flex-grow py-2">
                    <p class="preview-subject ellipsis font-weight-medium text-dark">David Grey </p>
                    <p class="font-weight-light small-text"> The meeting is cancelled </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item">
                  <div class="preview-thumbnail">
                    <img src="../../assets/images/faces/face1.jpg" alt="image" class="img-sm profile-pic"/>
                  </div>
                  <div class="preview-item-content flex-grow py-2">
                    <p class="preview-subject ellipsis font-weight-medium text-dark">Travis Jenkins </p>
                    <p class="font-weight-light small-text"> The meeting is cancelled </p>
                  </div>
                </a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link count-indicator" id="notificationDropdown" href="#" data-toggle="dropdown">
                <i class="mdi mdi-email-outline"></i>
                <span class="count bg-success">3</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="notificationDropdown">
                <a class="dropdown-item py-3 border-bottom">
                  <p class="mb-0 font-weight-medium float-left">You have 4 new notifications </p>
                  <span class="badge badge-pill badge-primary float-right">View all</span>
                </a>
                <a class="dropdown-item preview-item py-3">
                  <div class="preview-thumbnail">
                    <i class="mdi mdi-alert m-auto text-primary"></i>
                  </div>
                  <div class="preview-item-content">
                    <h6 class="preview-subject font-weight-normal text-dark mb-1">Application Error</h6>
                    <p class="font-weight-light small-text mb-0"> Just now </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item py-3">
                  <div class="preview-thumbnail">
                    <i class="mdi mdi-settings m-auto text-primary"></i>
                  </div>
                  <div class="preview-item-content">
                    <h6 class="preview-subject font-weight-normal text-dark mb-1">Settings</h6>
                    <p class="font-weight-light small-text mb-0"> Private message </p>
                  </div>
                </a>
                <a class="dropdown-item preview-item py-3">
                  <div class="preview-thumbnail">
                    <i class="mdi mdi-airballoon m-auto text-primary"></i>
                  </div>
                  <div class="preview-item-content">
                    <h6 class="preview-subject font-weight-normal text-dark mb-1">New user registration</h6>
                    <p class="font-weight-light small-text mb-0"> 2 days ago </p>
                  </div>
                </a>
              </div>
            </li>
            <li class="nav-item dropdown d-none d-xl-inline-block user-dropdown">
              <a class="nav-link dropdown-toggle" id="UserDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                <img class="img-xs rounded-circle" src="../../assets/images/faces/face8.jpg" alt="Profile image"/> </a>
              <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                <div class="dropdown-header text-center">
                  <img class="img-md rounded-circle" src="../../assets/images/faces/face8.jpg" alt="Profile image"/>
                  <p class="mb-1 mt-3 font-weight-semibold">Allen Moreno</p>
                  <p class="font-weight-light text-muted mb-0">allenmoreno@gmail.com</p>
                </div>
                <a class="dropdown-item">My Profile <span class="badge badge-pill badge-danger">1</span><i class="dropdown-item-icon ti-dashboard"></i></a>
                <a class="dropdown-item">Messages<i class="dropdown-item-icon ti-comment-alt"></i></a>
                <a class="dropdown-item">Activity<i class="dropdown-item-icon ti-location-arrow"></i></a>
                <a class="dropdown-item">FAQ<i class="dropdown-item-icon ti-help-alt"></i></a>
                <a class="dropdown-item">Sign Out<i class="dropdown-item-icon ti-power-off"></i></a>
              </div>
            </li>
          </ul>
          <button style={{width:'47%', height:'50px'}} class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span class="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
      <div class="container-fluid page-body-wrapper">
        <nav class="sidebar sidebar-offcanvas" id="sidebar">
          <ul class="nav">
            <li class="nav-item nav-profile">
              <a href="#" class="nav-link">
                <div class="profile-image">
                  <img class="img-xs rounded-circle" src="../../assets/images/faces/face8.jpg" alt="profile image"/>
                  <div class="dot-indicator bg-success"></div>
                </div>
                <div class="text-wrapper">
                  <p class="profile-name">Allen Moreno</p>
                  <p class="designation">Premium user</p>
                </div>
              </a>
            </li>
            <li class="nav-item nav-category">Main Menu</li>
            <li class="nav-item">
              <a class="nav-link" href="../../index.html">
                <i class="menu-icon typcn typcn-document-text"></i>
                <span class="menu-title">Dashboard</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <i class="menu-icon typcn typcn-coffee"></i>
                <span class="menu-title">Basic UI Elements</span>
                <i class="menu-arrow"></i>
              </a>
              <div class="collapse" id="ui-basic">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/ui-features/buttons.html">Buttons</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/ui-features/dropdowns.html">Dropdowns</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/ui-features/typography.html">Typography</a>
                  </li>
                </ul>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../../pages/forms/basic_elements.html">
                <i class="menu-icon typcn typcn-shopping-bag"></i>
                <span class="menu-title">Form elements</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../../pages/charts/chartjs.html">
                <i class="menu-icon typcn typcn-th-large-outline"></i>
                <span class="menu-title">Charts</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../../pages/tables/basic-table.html">
                <i class="menu-icon typcn typcn-bell"></i>
                <span class="menu-title">Tables</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="../../pages/icons/font-awesome.html">
                <i class="menu-icon typcn typcn-user-outline"></i>
                <span class="menu-title">Icons</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
                <i class="menu-icon typcn typcn-document-add"></i>
                <span class="menu-title">User Pages</span>
                <i class="menu-arrow"></i>
              </a>
              <div class="collapse" id="auth">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/samples/blank-page.html"> Blank Page </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/samples/login.html"> Login </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/samples/register.html"> Register </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/samples/error-404.html"> 404 </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="../../pages/samples/error-500.html"> 500 </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav> */}


          <div class="main-panel">
            <div class="content-wrapper">
              <div class="row">
                <div class="col-12 grid-margin">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">بيانات المطعم</h4>
                      <form class="form-sample">
                        {/* <p class="card-description"> Personal info </p> */}
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">الاسم</label>
                              <div class="col-sm-9">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">الوصف</label>
                              <div class="col-sm-9">
                                <textarea type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div class="row">
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">Gender</label>
                              <div class="col-sm-9">
                                <select class="form-control">
                                  <option>Male</option>
                                  <option>Female</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">Date of Birth</label>
                              <div class="col-sm-9">
                                <input class="form-control" placeholder="dd/mm/yyyy" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">Category</label>
                              <div class="col-sm-9">
                                <select class="form-control">
                                  <option>Category1</option>
                                  <option>Category2</option>
                                  <option>Category3</option>
                                  <option>Category4</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">Membership</label>
                              <div class="col-sm-4">
                                <div class="form-radio">
                                  <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="membershipRadios" id="membershipRadios1" value="" checked /> Free </label>
                                </div>
                              </div>
                              <div class="col-sm-5">
                                <div class="form-radio">
                                  <label class="form-check-label">
                                    <input type="radio" class="form-check-input" name="membershipRadios" id="membershipRadios2" value="option2" /> Professional </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <p class="card-description"> العنوان </p>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">الدولة</label>
                              <div class="col-sm-9">
                                <input type="text" class="form-control" />
                                {/* <select class="form-control">
                                  <option>America</option>
                                  <option>Italy</option>
                                  <option>Russia</option>
                                  <option>Britain</option>
                                </select> */}
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">المحافظة</label>
                              <div class="col-sm-9">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">المدينة</label>
                              <div class="col-sm-9">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">العنوان</label>
                              <div class="col-sm-9">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">اللوجو</label>
                              <div class="col-sm-9">
                                <input type="file" class="form-control" />
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label class="col-sm-3 col-form-label">كود البريد</label>
                              <div class="col-sm-9">
                                <input type="text" class="form-control" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <button style={{width:'47%', height:'50px'}} type="submit" class="btn btn-success mr-2">تاكيد</button>
                        <button style={{width:'47%', height:'50px'}} class="btn btn-light">إلغاء</button>
                      </form>
                    </div>
                  </div>
                </div>



                <div class="col-md-6 d-flex align-items-stretch grid-margin">
                  <div class="row flex-grow">
                    <div class="col-12">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="card-title">Default form</h4>
                          <p class="card-description"> Basic form layout </p>
                          <form class="forms-sample">
                            <div class="form-group" style={{ width: '100%' }}>

                              <label for="exampleInputEmail1">Email address</label>
                              <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                            </div>
                            <div class="form-group" style={{ width: '100%' }}>

                              <label for="exampleInputPassword1">Password</label>
                              <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                            </div>
                            <button style={{width:'47%', height:'50px'}} type="submit" class="btn btn-success mr-2">تاكيد</button>
                            <button style={{width:'47%', height:'50px'}} class="btn btn-light">إلغاء</button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 stretch-card">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="card-title">Horizontal Form</h4>
                          <p class="card-description"> Horizontal form layout </p>
                          <form class="forms-sample">
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label for="exampleInputEmail2" class="col-sm-3 col-form-label">Email</label>
                              <div class="col-sm-9">
                                <input type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter email" />
                              </div>
                            </div>
                            <div class="form-group row" style={{ width: '100%' }}>
                              <label for="exampleInputPassword2" class="col-sm-3 col-form-label">Password</label>
                              <div class="col-sm-9">
                                <input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password" />
                              </div>
                            </div>
                            <button style={{width:'47%', height:'50px'}} type="submit" class="btn btn-success mr-2">تاكيد</button>
                            <button style={{width:'47%', height:'50px'}} class="btn btn-light">إلغاء</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Basic form</h4>
                      <p class="card-description"> Basic form elements </p>
                      <form class="forms-sample">
                        <div class="form-group" style={{ width: '100%' }}>

                          <label for="exampleInputName1">Name</label>
                          <input type="text" class="form-control" id="exampleInputName1" placeholder="Name" />
                        </div>
                        <div class="form-group" style={{ width: '100%' }}>

                          <label for="exampleInputEmail3">Email address</label>
                          <input type="email" class="form-control" id="exampleInputEmail3" placeholder="Email" />
                        </div>
                        <div class="form-group" style={{ width: '100%' }}>

                          <label for="exampleInputPassword4">Password</label>
                          <input type="password" class="form-control" id="exampleInputPassword4" placeholder="Password" />
                        </div>
                        <div class="form-group" style={{ width: '100%' }}>

                          <label>File upload</label>
                          <input type="file" name="img[]" class="file-upload-default" />
                          <div class="input-group col-xs-12">
                            <input type="text" class="form-control file-upload-info" disabled placeholder="Upload Image" />
                            <span class="input-group-append">
                              <button style={{width:'47%', height:'50px'}} class="file-upload-browse btn btn-info" type="button">Upload</button>
                            </span>
                          </div>
                        </div>
                        <div class="form-group" style={{ width: '100%' }}>

                          <label for="exampleInputCity1">City</label>
                          <input type="text" class="form-control" id="exampleInputCity1" placeholder="Location" />
                        </div>
                        <div class="form-group" style={{ width: '100%' }}>

                          <label for="exampleTextarea1">Textarea</label>
                          <textarea class="form-control" id="exampleTextarea1" rows="2"></textarea>
                        </div>
                        <button style={{width:'47%', height:'50px'}} type="submit" class="btn btn-success mr-2">تاكيد</button>
                        <button style={{width:'47%', height:'50px'}} class="btn btn-light">إلغاء</button>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="col-md-5 d-flex align-items-stretch">
                  <div class="row flex-grow">
                    <div class="col-12 grid-margin">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="card-title">Basic input groups</h4>
                          <p class="card-description"> Basic bootstrap input groups </p>
                          <div class="form-group" style={{ width: '100%' }}>

                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text">@</span>
                              </div>
                              <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                          </div>
                          <div class="form-group" style={{ width: '100%' }}>

                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                              </div>
                              <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)" />
                              <div class="input-group-append">
                                <span class="input-group-text">.00</span>
                              </div>
                            </div>
                          </div>
                          <div class="form-group" style={{ width: '100%' }}>

                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                              </div>
                              <div class="input-group-prepend">
                                <span class="input-group-text">0.00</span>
                              </div>
                              <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 grid-margin stretch-card">
                      <div class="card">
                        <div class="card-body">
                          <h4 class="card-title">Colored input groups</h4>
                          <p class="card-description"> Input groups with colors </p>
                          <div class="form-group" style={{ width: '100%' }}>

                            <div class="input-group">
                              <div class="input-group-prepend bg-info">
                                <span class="input-group-text bg-transparent">
                                  <i class="mdi mdi-shield-outline text-white"></i>
                                </span>
                              </div>
                              <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon1" />
                            </div>
                          </div>
                          <div class="form-group" style={{ width: '100%' }}>

                            <div class="input-group">
                              <div class="input-group-prepend bg-primary border-primary">
                                <span class="input-group-text bg-transparent">
                                  <i class="mdi mdi mdi-menu text-white"></i>
                                </span>
                              </div>
                              <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon2" />
                            </div>
                          </div>
                          <div class="form-group" style={{ width: '100%' }}>

                            <div class="input-group">
                              <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon3" />
                              <div class="input-group-append bg-primary border-primary">
                                <span class="input-group-text bg-transparent">
                                  <i class="mdi mdi-menu text-white"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div class="form-group" style={{ width: '100%' }}>

                            <div class="input-group">
                              <div class="input-group-prepend bg-primary border-primary">
                                <span class="input-group-text bg-transparent text-white">$</span>
                              </div>
                              <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)" />
                              <div class="input-group-append bg-primary border-primary">
                                <span class="input-group-text bg-transparent text-white">.00</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-7 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Input size</h4>
                      <p class="card-description"> This is the default bootstrap form layout </p>
                      <div class="form-group" style={{ width: '100%' }}>

                        <label>Large input</label>
                        <input type="text" class="form-control form-control-lg" placeholder="Username" aria-label="Username" />
                      </div>
                      <div class="form-group" style={{ width: '100%' }}>

                        <label>Default input</label>
                        <input type="text" class="form-control" placeholder="Username" aria-label="Username" />
                      </div>
                      <div class="form-group" style={{ width: '100%' }}>

                        <label>Small input</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Username" aria-label="Username" />
                      </div>
                    </div>
                    <div class="card-body">
                      <h4 class="card-title">Selectize</h4>
                      <div class="form-group" style={{ width: '100%' }}>

                        <label for="exampleFormControlSelect1">Large select</label>
                        <select class="form-control form-control-lg" id="exampleFormControlSelect1">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="form-group" style={{ width: '100%' }}>

                        <label for="exampleFormControlSelect2">Default select</label>
                        <select class="form-control" id="exampleFormControlSelect2">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="form-group" style={{ width: '100%' }}>

                        <label for="exampleFormControlSelect3">Small select</label>
                        <select class="form-control form-control-sm" id="exampleFormControlSelect3">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Checkbox Controls</h4>
                      <p class="card-description">Checkbox and radio controls</p>
                      <form class="forms-sample">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group" style={{ width: '100%' }}>

                              <div class="form-check">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" /> Default </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" checked /> Checked </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" disabled /> Disabled </label>
                              </div>
                              <div class="form-check">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" disabled checked /> Disabled checked </label>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group" style={{ width: '100%' }}>

                              <div class="form-radio">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="" checked /> Option one </label>
                              </div>
                              <div class="form-radio">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2" /> Option two </label>
                              </div>
                            </div>
                            <div class="form-group" style={{ width: '100%' }}>

                              <div class="form-radio disabled">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="optionsRadios2" id="optionsRadios3" value="option3" disabled /> Option three is disabled </label>
                              </div>
                              <div class="form-radio disabled">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="optionsRadio2" id="optionsRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 grid-margin stretch-card">
                  <div class="card">
                    <div class="card-body">
                      <h4 class="card-title">Checkbox Flat Controls</h4>
                      <p class="card-description">Checkbox and radio controls with flat design</p>
                      <form class="forms-sample">
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group" style={{ width: '100%' }}>

                              <div class="form-check form-check-flat">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" /> Default </label>
                              </div>
                              <div class="form-check form-check-flat">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" checked /> Checked </label>
                              </div>
                              <div class="form-check form-check-flat">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" disabled /> Disabled </label>
                              </div>
                              <div class="form-check form-check-flat">
                                <label class="form-check-label">
                                  <input type="checkbox" class="form-check-input" disabled checked /> Disabled checked </label>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group" style={{ width: '100%' }}>

                              <div class="form-radio form-radio-flat">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="flatRadios1" id="flatRadios1" value="" checked /> Option one </label>
                              </div>
                              <div class="form-radio form-radio-flat">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="flatRadios2" id="flatRadios2" value="option2" /> Option two </label>
                              </div>
                            </div>
                            <div class="form-group" style={{ width: '100%' }}>

                              <div class="form-radio form-radio-flat disabled">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="flatRadios3" id="flatRadios3" value="option3" disabled /> Option three is disabled </label>
                              </div>
                              <div class="form-radio form-radio-flat disabled">
                                <label class="form-check-label">
                                  <input type="radio" class="form-check-input" name="flatRadios4" id="flatRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* </div>
    </div> */}
        </div>
      )}
    </detacontext.Consumer>
  )

}

export default Info

