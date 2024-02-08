import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
import './Waiter.css'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';



const Waiter = () => {
 // Refs for buttons
 const start = useRef();
 const ready = useRef();

 // State for pending orders and payments
 const [pendingOrders, setPendingOrders] = useState([]);
 const [pendingPayments, setPendingPayments] = useState([]);

 // Function to fetch pending orders and payments
 const fetchPendingData = async () => {
   try {
     const res = await axios.get(apiUrl+'/api/order');
     const recentStatus = res.data.filter((order) => order.status === 'Pending');
     const recentPaymentStatus = res.data.filter((order) => order.payment_status === 'Pending');
     setPendingOrders(recentStatus);
     setPendingPayments(recentPaymentStatus);
   } catch (error) {
     console.log(error);
   }
 };

 // State for internal orders
 const [internalOrders, setInternalOrders] = useState([]);

 // Function to fetch internal orders
 const fetchInternalOrders = async () => {
  try {
    const orders = await axios.get(apiUrl+'/api/order');
    const activeOrders = orders.data.filter((order) => order.isActive === true);
    const internalOrdersData = activeOrders.filter(order => order.order_type === 'Internal');
    
    console.log({ internalOrdersData: internalOrdersData });
    const products = internalOrdersData.length > 0 ? internalOrdersData.flatMap(order => order.products) : [];
    console.log({ products: products });
    const productsFiltered = products.length > 0 ? products.filter((product) => product.isDone === true && product.isDeleverd === false) : [];
    
    console.log({ productsFiltered: productsFiltered });

    if (productsFiltered.length > 0) {
      setInternalOrders(internalOrdersData);
    }
  } catch (error) {
    console.log(error);
  }
};


  const updateOrderOnWay = async (id) => {
    try {
      const status = 'On the way';
      await axios.put(`${apiUrl}/api/order/${id}`, { status });
      fetchInternalOrders();
      fetchPendingData();
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
      const updateOrder= await axios.put(`${apiUrl}/api/order/${id}`, { status ,products});
      if(updateOrder.status == 200){
        fetchInternalOrders()
        fetchPendingData();
        toast.success('Order has been delivered!');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error delivering order!');
    }
  };

  const helpOnWay = async (id) => {
    try {
      const helpStatus = 'On the way';
      const res=await axios.put(`${apiUrl}/api/order/${id}`, { helpStatus });
      if(res.status==200){
        fetchInternalOrders();
        fetchPendingData();
        toast.success('Help is on the way!');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error sending help!');
    }
  };

  const helpDone = async (id) => {
    try {
      const helpStatus = 'Assistance done';
      await axios.put(`${apiUrl}/api/order/${id}`, { helpStatus });
      fetchPendingData();
      fetchInternalOrders();
      toast.success('Assistance has been provided!');
    } catch (error) {
      console.log(error);
      toast.error('Error providing assistance!');
    }
  };


 // Fetch initial data on component mount
  useEffect(() => {
    fetchPendingData();
    fetchInternalOrders();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, employeeLoginInfo }) => {
          return (
            <div className='container-fluid d-flex flex-wrap align-content-start justify-content-around align-items-start h-100 overflow-auto bg-transparent py-5 px-3'>
              <ToastContainer/>
              {pendingPayments && pendingPayments.filter((order) => order.helpStatus == 'Send waiter' || order.helpStatus == 'On the way').map((order, i) => {
                return (
                  <div className="card text-white bg-success" style={{ width: "265px" }}>
                    <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                      <div style={{ maxWidth: "50%" }}>
                        <p className="card-text">الطاولة: {usertitle(order.table)}</p>
                        <p className="card-text">رقم الفاتورة: {order.serial}</p>
                        <p className="card-text">نوع الطلب: {order.order_type}</p>
                      </div>
                      <div style={{ maxWidth: "50%" }}>
                        <p className="card-text">اسم الويتر: {usertitle(order.waiter)}</p>
                        <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="card-text">التنفيذ: {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <ul className="list-group list-group-flush">

                      <li className="list-group-item bg-light text-dark d-flex justify-content-between align-items-center" key={i}>
                        <span style={{ fontSize: "18px" }}>{i + 1}- {usertitle(order.table)}</span>
                        <span className="badge bg-secondary rounded-pill" style={{ fontSize: "16px" }}>{order.help == 'Requests assistance' ? 'يحتاج المساعدة' : order.help == 'Requests bill' ? 'يحتاج الفاتورة' : ''}</span>
                      </li>

                    </ul>
                    <div className="card-footer text-center">
                      {order.helpStatus === 'On the way' ?
                        <button className="btn btn-success btn-lg" style={{ width: "100%" }} onClick={() => helpDone(order._id)}>تم</button>
                        : 
                        <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => { helpOnWay(order._id) }}>متجة للعميل</button>
                      }
                    </div>
                  </div>
                )
              })
              }

              {internalOrders && internalOrders.map((order, i) => {
                if (order.products.filter((pr) => pr.isDone === true && pr.isDeleverd === false).length > 0) {
                  return (
                    <div className="card text-white bg-success" style={{ width: "265px" }}>
                      <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                        <div style={{ maxWidth: "50%" }}>
                          <p className="card-text">الطاولة: {usertitle(order.table)}</p>
                          <p className="card-text">رقم الفاتورة: {order.serial}</p>
                          <p className="card-text">نوع الطلب: {order.order_type}</p>
                        </div>
                        <div style={{ maxWidth: "50%" }}>
                          <p className="card-text">اسم الويتر: {usertitle(order.waiter)}</p>
                          <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="card-text">التنفيذ: {new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <ul className="list-group list-group-flush">
                        {order.products.filter((pr) => pr.isDone === true && pr.isDeleverd === false).map((product, i) => {
                          return (
                            <li className="list-group-item bg-light text-dark d-flex justify-content-between align-items-center" key={i}>
                              <span style={{ fontSize: "18px" }}>{i + 1}- {product.name}</span>
                              <span className="badge bg-secondary rounded-pill" style={{ fontSize: "16px" }}>× {product.quantity}</span>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="card-footer text-center">
                        {order.status === 'Prepared' ?
                          <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => { updateOrderOnWay(order._id) }}>استلام الطلب</button>
                          : <button className="btn btn-success btn-lg" style={{ width: "100%" }} onClick={() =>{ updateOrderDelivered(order._id)}}>تم التسليم</button>
                        }
                      </div>
                    </div>

                  )
                }

              })}
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Waiter