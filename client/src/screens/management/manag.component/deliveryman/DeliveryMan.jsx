import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
// import './Waiter.css'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';


const DeliveryMan = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  // // State for pending orders and payments
  // const [pendingOrders, setPendingOrders] = useState([]);
  // const [pendingPayments, setPendingPayments] = useState([]);

  // // Function to fetch pending orders and payments
  // const fetchPendingData = async () => {
  //   try {
  //     const res = await axios.get(apiUrl+'/api/order');
  //     const recentStatus = res.data.filter((order) => order.status === 'Pending');
  //     const recentPaymentStatus = res.data.filter((order) => order.payment_status === 'Pending');
  //     setPendingOrders(recentStatus);
  //     setPendingPayments(recentPaymentStatus);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // State for internal orders


  // Function to fetch internal orders
  const [deliveryOrders, setDeliveryOrders] = useState([]);

  const fetchDeliveryOrders = async () => {
    try {
      const orders = await axios.get(apiUrl + '/api/order');
      const activeOrders = orders.data.filter(order => order.isActive === true && order.orderType === 'Delivery');
      console.log({ activeOrders: activeOrders });
      const deliveryOrdersData = activeOrders.filter(order => order.status === 'Prepared' || order.status === 'On the way');
      console.log({ deliveryOrdersData: deliveryOrdersData });
      // setDeliveryOrders(deliveryOrdersData);
      setDeliveryOrders(activeOrders);
    } catch (error) {
      console.log(error);
    }
  };


  const updateOrderOnWay = async (id) => {
    try {
      const status = 'On the way';
      await axios.put(`${apiUrl}/api/order/${id}`, { status });
      fetchDeliveryOrders();
      //  fetchPendingData();
      toast.success('Order is on the way!');
    } catch (error) {
      console.log(error);
      toast.error('Error updating order status!');
    }
  };

  const updateOrderDelivered = async (id) => {
    try {
      const orderData = await axios.get(`${apiUrl}/api/order/${id}`);
      const products = orderData.data.products.map((prod) => ({ ...prod, isDeleverd: true }));
      const status = 'Delivered';
      const updateOrder = await axios.put(`${apiUrl}/api/order/${id}`, { products, status });
      if (updateOrder) {
        fetchDeliveryOrders();
        toast.success('Order has been delivered!');
      }
      //  fetchPendingData();
    } catch (error) {
      console.log(error);
      toast.error('Error delivering order!');
    }
  };


  // Fetch initial data on component mount
  useEffect(() => {
    //  fetchPendingData();
    fetchDeliveryOrders();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, employeeLoginInfo }) => {
          return (
            <div className='container-fluid d-flex flex-wrap align-content-start justify-content-around align-items-start h-100 overflow-auto bg-transparent py-5 px-3'>
              <ToastContainer />

              {deliveryOrders && deliveryOrders.map((order, i) => {
                // const undeliveredProducts = order.products.filter(pr => !pr.isDeleverd);

                // if (undeliveredProducts.length > 0) {
                const { name, serial, address, deliveryMan, createdAt, updatedAt, _id, status, user, total, products } = order;

                return (
                  <div className="card text-white bg-success" style={{ width: "265px" }} key={i}>
                    <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                      <div style={{ maxWidth: "50%" }}>
                        <p className="card-text">العميل: {user ? usertitle(user) : name}</p>
                        <p className="card-text">رقم الفاتورة: {serial}</p>
                        <p className="card-text">العنوان: {address}</p>
                      </div>
                      <div style={{ maxWidth: "50%" }}>
                        <p className="card-text"> الطيار: {usertitle(deliveryMan)}</p>
                        <p className="card-text">الاستلام: {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="card-text">التنفيذ: {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <ul className="list-group list-group-flush">
                      {products.length > 0 ? products.map((product, j) => (
                        <>
                          <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={i}
                            style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                            <div className="d-flex justify-content-between align-items-center w-100">
                              <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                {i + 1}- {product.name}</p>
                              <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}> × {product.quantity}</span>
                            </div>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{product.notes}</div>
                          </li>
                          {product.extras && product.extras.length > 0 && (
                            product.extras.map((extra, j) => {
                              if (extra && extra.isDone === false) {
                                return (
                                  <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={`${i}-${j}`}
                                    style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                      {extra.extraDetails.map((detail) => (
                                        <p className="badge badge-secondary m-1" key={detail.extraid}>
                                          {`${detail.name}`}</p>
                                      ))}
                                    </div>
                                  </li>
                                );
                              } else {
                                return null;
                              }
                            })
                          )}
                        </>
                      )) : ''}
                    </ul>
                    <p>الاجمالي : {total}</p>
                    <div className="card-footer text-center">
                      {status === 'Prepared' ?
                        <button className="btn w-100 btn-primary btn btn-lg" onClick={() => { updateOrderOnWay(_id) }}>استلام الطلب</button> :
                        <button className="btn w-100 btn-warning btn btn-lg" onClick={() => { updateOrderDelivered(_id) }}>تم التسليم</button>
                      }
                    </div>
                  </div>
                );
                // }

                return null; // لا تقم بعرض شيء إذا كانت جميع المنتجات تم تسليمها
              })}
                    
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default DeliveryMan