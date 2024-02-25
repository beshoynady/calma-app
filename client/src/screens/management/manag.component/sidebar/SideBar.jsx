import React, { useRef } from 'react';
import './SideBar.css';
import { detacontext } from '../../../../App';
import { Link } from 'react-router-dom';

const SideBar = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

  const arrowRefs = {
    arrowmen: useRef(),
    arrowemp: useRef(),
    arrowsto: useRef(),
    arrowsexp: useRef(),
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

  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, employeelogout }) => {
          return (
            <>
              <div ref={sidebarRef} className="sidebar close">
                <div className="logo-details">
                  <i className='bx bxl-c-plus-plus'></i>
                  <span className="logo_name">CALMA</span>
                </div>
                <ul className="nav-links">
                  {/* Dashboard */}
                  <li>
                    <Link to="/management">
                      <span className="material-symbols-outlined icon">dashboard</span>
                      <span className="link_name">Dashboard</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="/" className="link_name">Dashboard</Link></li>
                    </ul>
                  </li>

                  {/* POS */}
                  <li>
                    <Link to="pos">
                      <span className="material-symbols-outlined icon">point_of_sale</span>
                      <span className="link_name">POS</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="pos" className="link_name">POS</Link></li>
                    </ul>
                  </li>

                  {/* Kitchen */}
                  <li>
                    <Link to="kitchen">
                      <span className="material-symbols-outlined icon">cooking</span>
                      <span className="link_name">المطبخ</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="kitchen" className="link_name">المطبخ</Link></li>
                    </ul>
                  </li>

                  {/* Waiter */}
                  <li>
                    <Link to="waiter">
                      <span className="material-symbols-outlined icon">concierge</span>
                      <span className="link_name">الويتر</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="waiter" className="link_name">الويتر</Link></li>
                    </ul>
                  </li>
                  
                  {/* deliveryman */}
                  <li>
                    <Link to="deliveryman">
                      <span class="material-symbols-outlined icon">directions_bike</span>                      
                      <span className="link_name">الديلفري</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="deliveryman" className="link_name">الديلفري</Link></li>
                    </ul>
                  </li>

                  {/* Users */}
                  <li>
                    <Link to="users">
                      <span className="material-symbols-outlined icon">user_attributes</span>
                      <span className="link_name">المستخدمين</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="users" className="link_name">المستخدمين</Link></li>
                    </ul>
                  </li>
                  {/* Orders */}
                  <li>
                    <Link to="orders">
                      <span className="material-symbols-outlined icon">list_alt</span>
                      <span className="link_name">الاوردرات</span>
                    </Link>
                    <ul className="sub-menu blank">
                      <li><Link to="orders" className="link_name">الاوردرات</Link></li>
                    </ul>
                  </li>

                  {/* Tables */}
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
                      <li><Link to="reservation">حجز الطاولات</Link></li>
                      <li><Link to="tablespage">الطاولات</Link></li>
                    </ul>
                  </li>

                  {/* Menu */}
                  <li ref={arrowRefs.arrowmen} onClick={() => openSubMenu(arrowRefs.arrowmen)}>
                    <div className="iocn-link">
                      <a href="#">
                        <span className="material-symbols-outlined icon">restaurant_menu</span>
                        <span className="link_name">المنيو</span>
                      </a>
                      <i className='bx bxs-chevron-down arrow'></i>
                    </div>
                    <ul className="sub-menu">
                      <li><a className="link_name" href="#">المنيو</a></li>
                      <li><Link to="category">التصنيفات</Link></li>
                      <li><Link to="products">الاطباق</Link></li>
                      <li><Link to="productrecipe">التكاليف</Link></li>
                    </ul>
                  </li>

                  {/* Employees */}
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
                      <li><Link to="employeessalary">تعاملات</Link></li>
                      <li><Link to="payroll">المرتبات</Link></li>
                    </ul>
                  </li>

                  {/* Stock */}
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
                      <li><Link to="categoryStock">تصنيفات</Link></li>
                      <li><Link to="stockitem">الاصناف</Link></li>
                      <li><Link to="stockmang">حركه المخزن</Link></li>
                      <li><Link to="kitchenconsumption">استهلاك المطبخ</Link></li>
                    </ul>
                  </li>

                  {/* Expenses */}
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
                      <li><Link to="dailyexpense">تسجيل مصروف</Link></li>
                    </ul>
                  </li>
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
                      <li><Link to="cashmovement">تسجيل حركه</Link></li>
                    </ul>
                  </li>
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