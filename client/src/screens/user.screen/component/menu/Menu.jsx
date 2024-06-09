import React, { useContext, useState } from 'react'
import './Menu.css'
import MenuCard from './Menu-card/Menu-card';
import { detacontext } from '../../../../App'


const Menu = () => {
  const [activeItem, setActiveItem] = useState(null);
  const { allcategories, setcategoryid } = useContext(detacontext)



  const handleCategoryClick = (id, index) => {
    setcategoryid(id);
    setActiveItem(index);
  };

  return (
    <section id='menu' className="d-flex flex-column align-items-center justify-content-center py-4 mt-3" style={{ scrollMarginTop: "90px", minHeight: "100vh" }}>
      <div className="container-lg d-flex flex-column align-items-center justify-content-start">
        <div className='section-title'>
          <h2>قائمة الطعام</h2>
        </div>
        <div className='section-content w-100 mt-3 d-flex flex-column flex-md-row'>
          <nav className="menu-nav w-100 d-flex flex-column align-items-center align-items-md-start justify-content-center my-2">
            <ul className='menu-ul list-unstyled d-flex flex-column align-items-center align-items-md-start justify-content-center p-0 m-0'>
              {allcategories.length > 0 ? (
                allcategories.map((category, index) => (
                  <li key={category._id} className='menu-nav-li d-flex align-items-center justify-content-center my-1'>
                    <a
                      href='#menu'
                      className={`category-btn btn ${activeItem === index ? 'btn-light text-dark' : 'btn-primary'} mx-2`}
                      style={{ fontSize: "22px", fontWeight: "600" }}
                      onClick={() => handleCategoryClick(category._id, index)}
                    >
                      <span className="rotated-text">{category.name}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li>لا توجد فئات متاحة</li>
              )}
            </ul>
          </nav>
          <div className="flex-grow-1">
            <MenuCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;