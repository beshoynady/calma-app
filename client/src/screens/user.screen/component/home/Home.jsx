import React, { useRef, useState, useEffect } from 'react';
import './Home.css'
import { detacontext } from '../../../../App'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const {id} = useParams()
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };


  const askingForHelp = async (tableId) => {
    try {
      const allOrders = await axios.get(apiUrl+'/api/order/limit/30' ,config)
      // Filter orders for the specified table
      const tableOrders = allOrders.filter(order => order.table && order.table._id == tableId);
  
      // Get the last order for the table
      const lastTableOrder = tableOrders.length > 0 ? tableOrders[tableOrders.length - 1] : null;
  
      // Check if the last table order is active
      const lastTableOrderActive = lastTableOrder ? await lastTableOrder.isActive : false;
  
      // If the last table order is not active, create a new order
      if (!lastTableOrderActive) {
        // Generate a new serial number for the order
        const serial = allOrders.length > 0 ? 
          String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : 
          '000001';
  
        // Define the help request message
        const help = 'Requests assistance';
        const table = tableId;
  
        // Create a new order with the help request
        const newOrder = await axios.post(`${apiUrl}/api/order/`, { serial, table, help });
        console.log(newOrder);
      } else {
        // If the last table order is active, update the existing order with the help request
        const id = lastTableOrder._id;
        const help = 'Requests assistance';
        const helpStatus = 'Ns'
        const updatedOrder = await axios.put(`${apiUrl}/api/order/${id}`, { help, helpStatus});
        console.log(updatedOrder);
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error(error);
  
      // Display an error toast message
      toast.error('An error occurred while requesting assistance.');
    }
  };

  return (
    <detacontext.Consumer>
      {
        ({restaurantData,userLoginInfo, usertitle}) => {
          return (
            <main className='main-home' id='main'> 
              <div className="container">
                <div className="content">
                  {userLoginInfo&&userLoginInfo.userinfo && id  ?<p className='main-title'>مرحبا {usertitle(userLoginInfo.userinfo.id)} <br/>علي طاولة {usertitle(id)} <br/> في</p>
                  : userLoginInfo&&userLoginInfo.userinfo?<p className='main-title'>مرحبا {usertitle(userLoginInfo.userinfo.id)} <br/> في</p>
                  : id?<p className='main-title'>مرحبا ضيوف طاولة {usertitle(id)} <br/> في</p>
                  :<p className='main-title'>مرحبا بكم  <br/> في</p>
                  }
                  <p className='main-text'> {restaurantData.name} <br /> {restaurantData.description}</p>
                  <ul className="main-btn">

                    {id?<>
                    <li className='main-li' onClick={()=>askingForHelp(id)}>طلب الويتر</li>
                    <li className='main-li'><a href="#menu">المنيو</a></li>
                    </>
                    :<li className='main-li mrl-auto'><a href="#menu">المنيو</a></li>}
                  </ul>
                </div>
              </div>
            </main>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Home