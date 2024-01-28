import React, {useState} from 'react'
import './Menu.css'
import MenuCard from './Menu-card/Menu-card';
import { detacontext } from '../../../../App'


const Menu = () => {
  const [activeItem, setActiveItem] = useState(null);
  return (
    <section id='menu'>
      <detacontext.Consumer>
        {
          ({ allcategories,setcategoryid, filterByCategoryId, categoryid }) => {
            return (
              <div className="container-lg">
                <div className='section-title'>
                  <h2>menu</h2>
                </div>
                <div className='section-content'>
                  <nav className="menu-nav">
                    <ul className='menu-ul'>
                      {allcategories.map((c, i) => <li key={i} className= 'menu-nav-li'>
                        <a className={`category-btn ${activeItem === i ? 'active' : ''}`} onClick={()=>{setcategoryid(c._id);setActiveItem(i)}}>{c.name}</a> 
                        </li>)}
                    </ul>
                  </nav>
                  <MenuCard />
                </div>
              </div>
            )
          }
        }
      </detacontext.Consumer>
    </section>
  )
}

export default Menu