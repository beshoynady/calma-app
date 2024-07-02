import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

import { Link } from 'react-router-dom';
import './SideBar.css';

const SideBar = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const arrowRefs = {
    arrowsetting: useRef(),
    arrowmen: useRef(),
    arrowemp: useRef(),
    arrowsto: useRef(),
    arrowmessage: useRef(),
    arrowsexp: useRef(),
    arrowssupplier: useRef(),
    arrowsCash: useRef(),
    arrowtable: useRef(),
  };

  const sidebarRef = useRef();

  const openSubMenu = (arrowRef) => {
    arrowRef.current.classList.toggle('showMenu');
  };

  const openSidebar = () => {
    sidebarRef.current.classList.toggle('close');
  };

  const employeelogout = () => {
    try {
      // Remove admin token from local storage

      localStorage.removeItem('token_e');
      window.location.href = `https://${window.location.hostname}/login`;
    } catch (error) {
      // Handle any potential errors
      console.error('Logout error:', error);
      // Display a notification to the user about the error
      alert('حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.');
    }
  }


  return (
    <detacontext.Consumer>
      {
        ({ restaurantData,permissionsList, employeeLoginInfo }) => {
          const role = employeeLoginInfo ? employeeLoginInfo.employeeinfo.role : '';
          return (
            <>
              <div ref={sidebarRef} className="sidebar close" style={{scrollbarWidth:'thin'}}>
                <div className="logo-details">
                  <i className='bx bxl-c-plus-plus'></i>
                  <span className="logo_name">{restaurantData.name}</span>
                </div>
                <ul className="nav-links overflowX-hidden">
                  {/* Dashboard */}
                  {(role === 'cashier' || role === 'manager') && (
                    <li>
                      <Link to="/management">
                        <span className="material-symbols-outlined icon">dashboard</span>
                        <span className="link_name">Dashboard</span>
                      </Link>
                      <ul className="sub-menu blank">
                        <li><Link to="/" className="link_name">لوحة التحكم</Link></li>
                      </ul>
                    </li>
                  )}

                  {/* POS */}
                  {(role === 'cashier' || role === 'waiter' || role === 'manager') && (
                    <li>
                      <Link to="pos">
                        <span className="material-symbols-outlined icon">point_of_sale</span>
                        <span className="link_name">POS</span>
                      </Link>
                      <ul className="sub-menu blank">
                        <li><Link to="pos" className="link_name">نقطه البيع</Link></li>
                      </ul>
                    </li>
                  )}

                  {/* Kitchen */}
                  {(role === 'chef' || role === 'manager') && (
                    <li>
                      <Link to="kitchen">
                        <span className="material-symbols-outlined icon">cooking</span>
                        <span className="link_name">المطبخ</span>
                      </Link>
                      <ul className="sub-menu blank">
                        <li><Link to="kitchen" className="link_name">المطبخ</Link></li>
                      </ul>
                    </li>
                  )}

                  {/* Waiter */}
                  {(role === 'manager' || role ==='waiter') && (
                    <li>
                      <Link to="waiter">
                        <span className="material-symbols-outlined icon">concierge</span>
                        <span className="link_name">الويتر</span>
                      </Link>
                      <ul className="sub-menu blank">
                        <li><Link to="waiter" className="link_name">الويتر</Link></li>
                      </ul>
                    </li>
                  )}

                  {/* deliveryman */}
                  {(role === 'deliveryman' || role === 'manager') && (
                    <li>
                      <Link to="deliveryman">
                        <span className="material-symbols-outlined icon">directions_bike</span>
                        <span className="link_name">الديلفري</span>
                      </Link>
                      <ul className="sub-menu blank">
                        <li><Link to="deliveryman" className="link_name">الديلفري</Link></li>
                      </ul>
                    </li>
                  )}



                  {/* Orders */}
                  {permissionsList?.filter(permission => permission.resource === 'Orders')[0]?.read && (
                    <li>
                      <Link to="orders">
                        <span className="material-symbols-outlined icon">list_alt</span>
                        <span className="link_name">الاوردرات</span>
                      </Link>
                      <ul className="sub-menu blank">
                        <li><Link to="orders" className="link_name">الاوردرات</Link></li>
                      </ul>
                    </li>
                  )}

                  {/* Tables */}
                  {permissionsList?.filter(permission => permission.resource === 'Tables')[0]?.read && (
                    <li ref={arrowRefs.arrowtable} onClick={() => openSubMenu(arrowRefs.arrowtable)}>
                      <div className="iocn-link">
                        <a href="#">
                          <span className="material-symbols-outlined icon">table_restaurant</span>
                          <span className="link_name">الطاولات</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">
                        <li><a className="link_name" href="#">الطاولات</a></li>
                          <li><Link to="tables">ادارة الطاولات</Link></li>
                        {permissionsList?.filter(permission => permission.resource === 'Table Reservations')[0]?.read && (
                          <li><Link to="reservation">حجز الطاولات</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'Tables')[0]?.read && (
                          <li><Link to="tablespage">الطاولات</Link></li>
                        )}
                      </ul>
                    </li>
                  )}


                  {/* Menu */}
                  {permissionsList?.filter(permission => permission.resource === 'Products')[0]?.read && (
                    <li ref={arrowRefs.arrowmen} onClick={() => openSubMenu(arrowRefs.arrowmen)}>
                      <div className="icon-link">
                        <a href="#">
                          <span className="material-symbols-outlined icon">restaurant_menu</span>
                          <span className="link_name">المنيو</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">
                        <li><a className="link_name" href="#">المنيو</a></li>
                        {permissionsList?.filter(permission => permission.resource === 'Menu Categories')[0]?.read && (
                          <li><Link to="category">التصنيفات</Link></li>
                        )}
                        <li><Link to="products">الاطباق</Link></li>
                        {permissionsList?.filter(permission => permission.resource === 'Recipes')[0]?.read && (
                          <li><Link to="productrecipe">التكاليف</Link></li>
                        )}
                      </ul>
                    </li>
                  )}

                  {/* Employees */}
                  {(permissionsList?.filter(permission => permission.resource === 'Employees')[0]?.read ||
                  permissionsList?.filter(permission => permission.resource === 'Permissions')[0]?.read)&& (
                    <li ref={arrowRefs.arrowemp} onClick={() => openSubMenu(arrowRefs.arrowemp)}>
                      <div className="iocn-link">
                        <a href="#">
                          <span className="material-symbols-outlined icon">group_add</span>
                          <span className="link_name">الموظفون</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">
                        <li><a className="link_name" href="#">الموظفون</a></li>
                        <li><Link to="employees">البيانات</Link></li>
                        {permissionsList?.filter(permission => permission.resource === 'Permissions')[0]?.read && (
                          <li><Link to="permissions">الصلاحيات</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'Attendance')[0]?.read && (
                          <li><Link to="attendancerecord">الحضور و الانصراف</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'Salaries')[0]?.read && (
                          <li><Link to="employeetransactions">تعاملات</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'Payroll')[0]?.read && (
                          <li><Link to="payroll">المرتبات</Link></li>
                        )}
                      </ul>
                    </li>
                  )}

                  {/* Users */}
                  {permissionsList?.filter(permission => permission.resource === 'Users')[0]?.read ||
                  permissionsList?.filter(permission => permission.resource === 'Message')[0]?.read && (
                    <li ref={arrowRefs.arrowmessage} onClick={() => openSubMenu(arrowRefs.arrowmessage)}>
                      <div className="iocn-link">
                        <a href="#">
                          <span className="material-symbols-outlined icon">user_attributes</span>
                          <span className="link_name">المستخدمين</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">
                        <li><a className="link_name" href="#">العملاء</a></li>
                        <li><Link to="users">ادارة العملاء</Link></li>
                        {permissionsList?.filter(permission => permission.resource === 'Messages')[0]?.read && (
                          <li><Link to="message">رسائل العملاء</Link></li>
                        )}
                      </ul>
                    </li>
                  )}

                  {/* Stock */}
                  {permissionsList?.filter(permission => permission.resource === 'stock Item' || permission.resource === 'Kitchen Usage')[0]?.read && (
                    <li ref={arrowRefs.arrowsto} onClick={() => openSubMenu(arrowRefs.arrowsto)}>
                      <div className="iocn-link">
                        <a href="#">
                          <span className="material-symbols-outlined icon">receipt_long</span>
                          <span className="link_name">المخزن</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">
                        <li><a className="link_name" href="#">المخزن</a></li>
                        {permissionsList?.filter(permission => permission.resource === 'stock Categories')[0]?.read && (
                          <li><Link to="categoryStock">تصنيفات</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'stock Item')[0]?.read && (
                          <li><Link to="stockitem">الاصناف</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'stock Management')[0]?.read && (
                          <li><Link to="stockmang">حركه المخزن</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'Kitchen Usage')[0]?.read && (
                          <li><Link to="kitchenconsumption">استهلاك المطبخ</Link></li>
                        )}
                      </ul>
                    </li>
                  )}

                  {/* Suppliers */}
                  {permissionsList?.filter(permission => permission.resource === 'Supplier Data')[0]?.read && (
                    <li ref={arrowRefs.arrowssupplier} onClick={() => openSubMenu(arrowRefs.arrowssupplier)}>
                      <div className="iocn-link">
                        <a href="#">
                          <span className="material-symbols-outlined icon">request_page</span>
                          <span className="link_name">الموردين</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">

                        <li><a className="link_name" href="#">الموردين</a></li>
                        <li><Link to="supplier">الموردين</Link></li>

                        {permissionsList?.filter(permission => permission.resource === 'Purchases')[0]?.read && (
                          <li><Link to="purchase">المشتريات</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'Purchase Returns')[0]?.read && (
                          <li><Link to="purchasereturn">مرتجع المشتريات</Link></li>
                        )}
                        {permissionsList?.filter(permission => permission.resource === 'Supplier Movement')[0]?.read && (
                          <li><Link to="suppliertransaction">تعاملات الموردين</Link></li>
                        )}
                      </ul>
                    </li>
                  )}


                  {/* Expenses */}
                  {permissionsList?.filter(permission => permission.resource === 'Expenses')[0]?.read && (
                    <li ref={arrowRefs.arrowsexp} onClick={() => openSubMenu(arrowRefs.arrowsexp)}>
                      <div className="iocn-link">
                        <a href="#">
                          <span className="material-symbols-outlined icon">request_page</span>
                          <span className="link_name">المصروفات</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">

                        <li><a className="link_name" href="#">المصروفات</a></li>
                        <li><Link to="expense">المصروفات</Link></li>
                        {permissionsList?.filter(permission => permission.resource === 'Daily Expenses')[0]?.read && (
                          <li><Link to="dailyexpense">تسجيل مصروف</Link></li>
                        )}
                      </ul>
                    </li>
                  )}

                  {permissionsList?.filter(permission => permission.resource === 'Cash Register')[0]?.read && (
                    <li ref={arrowRefs.arrowsCash} onClick={() => openSubMenu(arrowRefs.arrowsCash)}>
                      <div className="iocn-link">
                        <a href="#">
                          <span class="material-symbols-outlined icon">monetization_on</span>
                          <span className="link_name">الخزينة</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow'></i>
                      </div>
                      <ul className="sub-menu">
                        <li><a className="link_name" href="#">الخزينة</a></li>
                        <li><Link to="cashregister">الرصيد</Link></li>
                        {permissionsList?.filter(permission => permission.resource === 'Cash Movement')[0]?.read && (
                          <li><Link to="cashmovement">تسجيل حركه</Link></li>
                        )}
                      </ul>
                    </li>
                  )}

                  {permissionsList?.filter(permission => permission.resource === 'Delivery Zones' || permission.resource === 'Shifts' || permission.resource === 'Restaurant Settings')[0]?.read && (
                    <li>
                      <Link to="info">
                        <span className="material-symbols-outlined icon">settings</span>
                        <span className="link_name">الاعدادات</span>
                      </Link>
                      <ul className="sub-menu blank">
                        <li><Link to="info" className="link_name">الاعدادات</Link></li>
                      </ul>
                    </li>
                  )}

                  <li className="profile-details">
                    <div className="profile-content">
                      <i className='bx bx-log-out' onClick={employeelogout}></i>
                    </div>
                    <div className="name-job">
                      <div className="profile_name">{employeeLoginInfo ? employeeLoginInfo.employeeinfo.username : ''}</div>
                      <div className="job">{employeeLoginInfo ? employeeLoginInfo.employeeinfo.role : ''}</div>
                    </div>
                  </li>
                </ul>
              </div>
              <section className="home-section" onClick={openSidebar}>
                <div className="home-content">
                  <i className='bx bx-menu' ></i>
                </div>
              </section>
            </>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default SideBar