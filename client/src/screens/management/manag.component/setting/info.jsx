import React, { useState } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

const Info = () => {

  const daysOfWeek = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

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
          {/* 
                    <div className="container-scroller">
      <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
          <a className="navbar-brand brand-logo" href="../../index.html">
            <img src="../../assets/images/logo.svg" alt="logo" /> </a>
          <a className="navbar-brand brand-logo-mini" href="../../index.html">
            <img src="../../assets/images/logo-mini.svg" alt="logo" /> </a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center">
          <ul className="navbar-nav">
            <li className="nav-item font-weight-semibold d-none d-lg-block">Help : +050 2992 709</li>
            <li className="nav-item dropdown language-dropdown">
              <a className="nav-link dropdown-toggle px-2 d-flex align-items-center" id="LanguageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                <div className="d-inline-flex mr-0 mr-md-3">
                  <div className="flag-icon-holder">
                    <i className="flag-icon flag-icon-us"></i>
                  </div>
                </div>
                <span className="profile-text font-weight-medium d-none d-md-block">English</span>
              </a>
              <div className="dropdown-menu dropdown-menu-left navbar-dropdown py-2" aria-labelledby="LanguageDropdown">
                <a className="dropdown-item">
                  <div className="flag-icon-holder">
                    <i className="flag-icon flag-icon-us"></i>
                  </div>English
                </a>
                <a className="dropdown-item">
                  <div className="flag-icon-holder">
                    <i className="flag-icon flag-icon-fr"></i>
                  </div>French
                </a>
                <a className="dropdown-item">
                  <div className="flag-icon-holder">
                    <i className="flag-icon flag-icon-ae"></i>
                  </div>Arabic
                </a>
                <a className="dropdown-item">
                  <div className="flag-icon-holder">
                    <i className="flag-icon flag-icon-ru"></i>
                  </div>Russian
                </a>
              </div>
            </li>
          </ul>
          <form className="ml-auto search-form d-none d-md-block" action="#">
                                        <div className="form-group" style={{ width: '100%' }}>

              <input type="search" className="form-control" placeholder="Search Here"/>
            </div>
          </form>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown">
              <a className="nav-link count-indicator" id="messageDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                <i className="mdi mdi-bell-outline"></i>
                <span className="count">7</span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="messageDropdown">
                <a className="dropdown-item py-3">
                  <p className="mb-0 font-weight-medium float-left">You have 7 unread mails </p>
                  <span className="badge badge-pill badge-primary float-right">View all</span>
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="../../assets/images/faces/face10.jpg" alt="image" className="img-sm profile-pic"/>
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis font-weight-medium text-dark">Marian Garner </p>
                    <p className="font-weight-light small-text"> The meeting is cancelled </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="../../assets/images/faces/face12.jpg" alt="image" className="img-sm profile-pic"/>
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis font-weight-medium text-dark">David Grey </p>
                    <p className="font-weight-light small-text"> The meeting is cancelled </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img src="../../assets/images/faces/face1.jpg" alt="image" className="img-sm profile-pic"/>
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis font-weight-medium text-dark">Travis Jenkins </p>
                    <p className="font-weight-light small-text"> The meeting is cancelled </p>
                  </div>
                </a>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link count-indicator" id="notificationDropdown" href="#" data-toggle="dropdown">
                <i className="mdi mdi-email-outline"></i>
                <span className="count bg-success">3</span>
              </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0" aria-labelledby="notificationDropdown">
                <a className="dropdown-item py-3 border-bottom">
                  <p className="mb-0 font-weight-medium float-left">You have 4 new notifications </p>
                  <span className="badge badge-pill badge-primary float-right">View all</span>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-alert m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">Application Error</h6>
                    <p className="font-weight-light small-text mb-0"> Just now </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-settings m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">Settings</h6>
                    <p className="font-weight-light small-text mb-0"> Private message </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-airballoon m-auto text-primary"></i>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal text-dark mb-1">New user registration</h6>
                    <p className="font-weight-light small-text mb-0"> 2 days ago </p>
                  </div>
                </a>
              </div>
            </li>
            <li className="nav-item dropdown d-none d-xl-inline-block user-dropdown">
              <a className="nav-link dropdown-toggle" id="UserDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                <img className="img-xs rounded-circle" src="../../assets/images/faces/face8.jpg" alt="Profile image"/> </a>
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
                <div className="dropdown-header text-center">
                  <img className="img-md rounded-circle" src="../../assets/images/faces/face8.jpg" alt="Profile image"/>
                  <p className="mb-1 mt-3 font-weight-semibold">Allen Moreno</p>
                  <p className="font-weight-light text-muted mb-0">allenmoreno@gmail.com</p>
                </div>
                <a className="dropdown-item">My Profile <span className="badge badge-pill badge-danger">1</span><i className="dropdown-item-icon ti-dashboard"></i></a>
                <a className="dropdown-item">Messages<i className="dropdown-item-icon ti-comment-alt"></i></a>
                <a className="dropdown-item">Activity<i className="dropdown-item-icon ti-location-arrow"></i></a>
                <a className="dropdown-item">FAQ<i className="dropdown-item-icon ti-help-alt"></i></a>
                <a className="dropdown-item">Sign Out<i className="dropdown-item-icon ti-power-off"></i></a>
              </div>
            </li>
          </ul>
          <button style={{width:'47%', height:'50px'}} className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
      <div className="container-fluid page-body-wrapper">
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item nav-profile">
              <a href="#" className="nav-link">
                <div className="profile-image">
                  <img className="img-xs rounded-circle" src="../../assets/images/faces/face8.jpg" alt="profile image"/>
                  <div className="dot-indicator bg-success"></div>
                </div>
                <div className="text-wrapper">
                  <p className="profile-name">Allen Moreno</p>
                  <p className="designation">Premium user</p>
                </div>
              </a>
            </li>
            <li className="nav-item nav-category">Main Menu</li>
            <li className="nav-item">
              <a className="nav-link" href="../../index.html">
                <i className="menu-icon typcn typcn-document-text"></i>
                <span className="menu-title">Dashboard</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <i className="menu-icon typcn typcn-coffee"></i>
                <span className="menu-title">Basic UI Elements</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/ui-features/buttons.html">Buttons</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/ui-features/dropdowns.html">Dropdowns</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/ui-features/typography.html">Typography</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../pages/forms/basic_elements.html">
                <i className="menu-icon typcn typcn-shopping-bag"></i>
                <span className="menu-title">Form elements</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../pages/charts/chartjs.html">
                <i className="menu-icon typcn typcn-th-large-outline"></i>
                <span className="menu-title">Charts</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../pages/tables/basic-table.html">
                <i className="menu-icon typcn typcn-bell"></i>
                <span className="menu-title">Tables</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../pages/icons/font-awesome.html">
                <i className="menu-icon typcn typcn-user-outline"></i>
                <span className="menu-title">Icons</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
                <i className="menu-icon typcn typcn-document-add"></i>
                <span className="menu-title">User Pages</span>
                <i className="menu-arrow"></i>
              </a>
              <div className="collapse" id="auth">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/samples/blank-page.html"> Blank Page </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/samples/login.html"> Login </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/samples/register.html"> Register </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/samples/error-404.html"> 404 </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="../../pages/samples/error-500.html"> 500 </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav> */}


          {/* <div className="main-panel"> */}
          <div className="content-wrapper">
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">بيانات المطعم</h4>
                    <form className="form-sample">
                      {/* <p className="card-description"> Personal info </p> */}
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">الاسم</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">الوصف</label>
                            <div className="col-sm-9">
                              <textarea type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row" style={{ width: '100%' }}>
                              <label className="col-sm-3 col-form-label">Gender</label>
                              <div className="col-sm-9">
                                <select className="form-control">
                                  <option>Male</option>
                                  <option>Female</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row" style={{ width: '100%' }}>
                              <label className="col-sm-3 col-form-label">Date of Birth</label>
                              <div className="col-sm-9">
                                <input className="form-control" placeholder="dd/mm/yyyy" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group row" style={{ width: '100%' }}>
                              <label className="col-sm-3 col-form-label">Category</label>
                              <div className="col-sm-9">
                                <select className="form-control">
                                  <option>Category1</option>
                                  <option>Category2</option>
                                  <option>Category3</option>
                                  <option>Category4</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group row" style={{ width: '100%' }}>
                              <label className="col-sm-3 col-form-label">Membership</label>
                              <div className="col-sm-4">
                                <div className="form-radio">
                                  <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="membershipRadios" id="membershipRadios1" value="" checked /> Free </label>
                                </div>
                              </div>
                              <div className="col-sm-5">
                                <div className="form-radio">
                                  <label className="form-check-label">
                                    <input type="radio" className="form-check-input" name="membershipRadios" id="membershipRadios2" value="option2" /> Professional </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      <p className="card-description"> العنوان </p>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">الدولة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" />
                              {/* <select className="form-control">
                                  <option>America</option>
                                  <option>Italy</option>
                                  <option>Russia</option>
                                  <option>Britain</option>
                                </select> */}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">المحافظة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">المدينة</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">العنوان</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">اللوجو</label>
                            <input type="file" name="img[]" className="file-upload-default" />
                            <div className="input-group col-xs-12">
                              <input type="text" className="form-control file-upload-info" disabled placeholder="Upload Image" />
                              <span className="input-group-append">
                                <button className="file-upload-browse btn btn-info" type="button">Upload</button>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group row" style={{ width: '100%' }}>
                            <label className="col-sm-3 col-form-label">كود البريد</label>
                            <div className="col-sm-9">
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تاكيد</button>
                      <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                    </form>
                  </div>
                </div>
              </div>



              <div className="col-md-6 d-flex align-items-stretch grid-margin">
                <div className="row flex-grow">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">بيانات التواصل</h4>
                        <p className="card-description"> ادخل بيانات التواصل المتاحة لديك </p>
                        <form className="forms-sample">
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="phone">رقم الهاتف:</label>
                            <input type="text" className="form-control" id="phone" placeholder="ادخل رقم الهاتف" required />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="whatsapp">واتساب:</label>
                            <input type="text" className="form-control" id="whatsapp" placeholder="ادخل رقم واتساب" required />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="email">البريد الإلكتروني:</label>
                            <input type="email" className="form-control" id="email" placeholder="ادخل البريد الإلكتروني" required />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="facebook">فيسبوك:</label>
                            <input type="text" className="form-control" id="facebook" placeholder="ادخل رابط فيسبوك" />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="twitter">تويتر:</label>
                            <input type="text" className="form-control" id="twitter" placeholder="ادخل رابط تويتر" />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="instagram">انستجرام:</label>
                            <input type="text" className="form-control" id="instagram" placeholder="ادخل رابط انستجرام" />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="linkedin">لينكدإن:</label>
                            <input type="text" className="form-control" id="linkedin" placeholder="ادخل رابط لينكدإن" />
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="youtube">يوتيوب:</label>
                            <input type="text" className="form-control" id="youtube" placeholder="ادخل رابط يوتيوب" />
                          </div>
                          <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تاكيد</button>
                          <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">مواعيد العمل </h4>
                        <p className="card-description">ادخل مواعيد العمل اليومية </p>
                        <form className="forms-sample">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>اليوم</th>
                                <th>وقت الافتتاح</th>
                                <th>وقت الإغلاق</th>
                                <th>مغلق</th>
                              </tr>
                            </thead>
                            <tbody>
                              {daysOfWeek.map((day, index) => (
                                <tr key={index}>
                                  <td>{day}</td>
                                  <td><input type="time" className="form-control" name={`openingTime${day}`} disabled /></td>
                                  <td><input type="time" className="form-control" name={`closingTime${day}`} disabled /></td>
                                  <td><input type="checkbox" className="form-check-input" name={`closed${day}`} /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-3">
                            <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تاكيد</button>
                            <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Basic form</h4>
                    <p className="card-description"> Basic form elements </p>
                    <form className="forms-sample">
                      <div className="form-group" style={{ width: '100%' }}>

                        <label for="exampleInputName1">Name</label>
                        <input type="text" className="form-control" id="exampleInputName1" placeholder="Name" />
                      </div>
                      <div className="form-group" style={{ width: '100%' }}>

                        <label for="exampleInputEmail3">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail3" placeholder="Email" />
                      </div>
                      <div className="form-group" style={{ width: '100%' }}>

                        <label for="exampleInputPassword4">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword4" placeholder="Password" />
                      </div>
                      <div className="form-group" style={{ width: '100%' }}>

                        <label>File upload</label>
                        <input type="file" name="img[]" className="file-upload-default" />
                        <div className="input-group col-xs-12">
                          <input type="text" className="form-control file-upload-info" disabled placeholder="Upload Image" />
                          <span className="input-group-append">
                            <button style={{ width: '47%', height: '50px' }} className="file-upload-browse btn btn-info" type="button">Upload</button>
                          </span>
                        </div>
                      </div>
                      <div className="form-group" style={{ width: '100%' }}>

                        <label for="exampleInputCity1">City</label>
                        <input type="text" className="form-control" id="exampleInputCity1" placeholder="Location" />
                      </div>
                      <div className="form-group" style={{ width: '100%' }}>

                        <label for="exampleTextarea1">Textarea</label>
                        <textarea className="form-control" id="exampleTextarea1" rows="2"></textarea>
                      </div>
                      <button style={{ width: '47%', height: '50px' }} type="submit" className="btn btn-success mr-2">تاكيد</button>
                      <button style={{ width: '47%', height: '50px' }} className="btn btn-light">إلغاء</button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-5 d-flex align-items-stretch">
                <div className="row flex-grow">
                  <div className="col-12 grid-margin">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Basic input groups</h4>
                        <p className="card-description"> Basic bootstrap input groups </p>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">@</span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">$</span>
                            </div>
                            <div className="input-group-prepend">
                              <span className="input-group-text">0.00</span>
                            </div>
                            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title">Colored input groups</h4>
                        <p className="card-description"> Input groups with colors </p>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-info">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi-shield-outline text-white"></i>
                              </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon1" />
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-primary border-primary">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi mdi-menu text-white"></i>
                              </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon2" />
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="colored-addon3" />
                            <div className="input-group-append bg-primary border-primary">
                              <span className="input-group-text bg-transparent">
                                <i className="mdi mdi-menu text-white"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="form-group" style={{ width: '100%' }}>

                          <div className="input-group">
                            <div className="input-group-prepend bg-primary border-primary">
                              <span className="input-group-text bg-transparent text-white">$</span>
                            </div>
                            <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                            <div className="input-group-append bg-primary border-primary">
                              <span className="input-group-text bg-transparent text-white">.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-7 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Input size</h4>
                    <p className="card-description"> This is the default bootstrap form layout </p>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label>Large input</label>
                      <input type="text" className="form-control form-control-lg" placeholder="Username" aria-label="Username" />
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label>Default input</label>
                      <input type="text" className="form-control" placeholder="Username" aria-label="Username" />
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label>Small input</label>
                      <input type="text" className="form-control form-control-sm" placeholder="Username" aria-label="Username" />
                    </div>
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">Selectize</h4>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect1">Large select</label>
                      <select className="form-control form-control-lg" id="exampleFormControlSelect1">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect2">Default select</label>
                      <select className="form-control" id="exampleFormControlSelect2">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ width: '100%' }}>

                      <label for="exampleFormControlSelect3">Small select</label>
                      <select className="form-control form-control-sm" id="exampleFormControlSelect3">
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
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Checkbox Controls</h4>
                    <p className="card-description">Checkbox and radio controls</p>
                    <form className="forms-sample">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" /> Default </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" checked /> Checked </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled /> Disabled </label>
                            </div>
                            <div className="form-check">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled checked /> Disabled checked </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="" checked /> Option one </label>
                            </div>
                            <div className="form-radio">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2" /> Option two </label>
                            </div>
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadios2" id="optionsRadios3" value="option3" disabled /> Option three is disabled </label>
                            </div>
                            <div className="form-radio disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="optionsRadio2" id="optionsRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Checkbox Flat Controls</h4>
                    <p className="card-description">Checkbox and radio controls with flat design</p>
                    <form className="forms-sample">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" /> Default </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" checked /> Checked </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled /> Disabled </label>
                            </div>
                            <div className="form-check form-check-flat">
                              <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" disabled checked /> Disabled checked </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio form-radio-flat">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios1" id="flatRadios1" value="" checked /> Option one </label>
                            </div>
                            <div className="form-radio form-radio-flat">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios2" id="flatRadios2" value="option2" /> Option two </label>
                            </div>
                          </div>
                          <div className="form-group" style={{ width: '100%' }}>

                            <div className="form-radio form-radio-flat disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios3" id="flatRadios3" value="option3" disabled /> Option three is disabled </label>
                            </div>
                            <div className="form-radio form-radio-flat disabled">
                              <label className="form-check-label">
                                <input type="radio" className="form-check-input" name="flatRadios4" id="flatRadios4" value="option4" disabled checked /> Option four is selected and disabled </label>
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
          {/* </div> */}
          {/* </div>
    </div> */}
        </div>
      )}
    </detacontext.Consumer>
  )

}

export default Info

