import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';


const DeliveryMan = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); 
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
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




  const [listProductsOrder, setlistProductsOrder] = useState([])
  const [serial, setserial] = useState('')
  const [orderType, setorderType] = useState('')
  const [name, setname] = useState('')
  const [address, setaddress] = useState('')
  const [phone, setphone] = useState('')
  const [ordertax, setordertax] = useState()
  const [orderTotal, setorderTotal] = useState()
  const [orderSubtotal, setorderSubtotal] = useState()
  const [subtotalSplitOrder, setsubtotalSplitOrder] = useState()
  const [orderdeliveryCost, setorderdeliveryCost] = useState()
  const [deliveryMan, setdeliveryMan] = useState()
  const [ordernum, setordernum] = useState()
  const [table, settable] = useState()
  const [cashier, setcashier] = useState()
  const [discount, setdiscount] = useState(0)
  const [addition, setaddition] = useState(0)

  const [ivocedate, setivocedate] = useState(new Date())


  const [orderdata, setorderdata] = useState({})


  // Fetch orders from API
  const getOrderDetalis = async (serial) => {
    try {
      const res = await axios.get(apiUrl + '/api/order/limit/50', config);
      const order = res.data.find(order => order.serial == serial)
      if (order) {

        setorderdata(order)
        setlistProductsOrder(order.products)
        setorderTotal(order.total)
        setsubtotalSplitOrder(order.subtotalSplitOrder)
        setorderSubtotal(order.subTotal)
        setordertax(order.tax)
        setorderdeliveryCost(order.deliveryCost)
        setserial(order.serial)
        setaddition(order.addition)
        setdiscount(order.discount)
        // setivocedate(order.createdAt)
        setcashier(order.cashier)
        settable(order.orderType == 'Internal' ? order.table : '')
        setordernum(order.orderType == 'Takeaway' ? order.ordernum : '')
        setorderType(order.orderType)
        setaddress(order.orderType == 'Delivery' ? order.address : "")
        setdeliveryMan(order.orderType == 'Delivery' ? order.deliveryMan : "")
        if (order.orderType != 'Internal') {
          setname(order.name)
          setphone(order.phone)
        }
      }
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };


  const printContainerInvoice = useRef();

  const PrintInvoice = useReactToPrint({
    content: () => printContainerInvoice.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage',
    printerName: 'cashier'
  });


  const handlePrintInvoice = (e) => {
    e.preventDefault();
    PrintInvoice();
  };

  // Fetch initial data on component mount
  useEffect(() => {
    //  fetchPendingData();
    fetchDeliveryOrders();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, formatDate }) => {
          return (
            <div className='container-fluid d-flex flex-wrap align-content-start justify-content-around align-items-start h-100 overflow-auto bg-transparent py-5 px-3'>
              {deliveryOrders && deliveryOrders.map((order, i) => {
                // const undeliveredProducts = order.products.filter(pr => !pr.isDeleverd);

                // if (undeliveredProducts.length > 0) {
                const { name, serial, address, deliveryMan, createdAt, updatedAt, _id, status, user, total, products } = order;

                return (
                  <div className="card text-white bg-success" style={{ width: "265px" }} key={i}>
                    <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                      <div style={{ maxWidth: "50%" }}>
                        <p className="card-text">العميل: {user ? user.username : name}</p>
                        <p className="card-text">رقم الفاتورة: 
                          <a href="#invoiceOrderModal" className='btn btn-primary' data-toggle="modal" onClick={() => getOrderDetalis(serial)}>
                          {serial} </a>
                        </p>
                        <p className="card-text">العنوان: {address}</p>
                      </div>
                      <div style={{ maxWidth: "50%" }}>
                        <p className="card-text"> الطيار: {deliveryMan.username}</p>
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
                                  <li className='list-group-item d-flex flex-column justify-content-start align-items-center' key={`${i}-${j}`}
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

              })}




              <div id="invoiceOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header">
                        <h4 className="modal-title text-light bg-success"></h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div ref={printContainerInvoice} className="p-1 mb-7 overflow-auto printpage" style={{ width: '100%', textAlign: 'center' }}>
                        {/* Invoice Header */}
                        <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                          <h2>{restaurantData.name}</h2>
                          <p>كاشير:{orderdata.cashier?.username} | فاتورة #{serial} | {orderdata.orderType === 'Internal' ? `طاولة' ${orderdata.table?.tableNumber}` : ''} | التاريخ: {formatDate(new Date())}</p>
                        </div>

                        {/* Customer Information */}
                        {orderdata.orderType == 'Delivery' ? <div className="customer-info text-dark" style={{ margin: '20px' }}>
                          <h4>بيانات العميل</h4>
                          <p>الاسم: {orderdata.name}</p>
                          <p>الموبايل: {orderdata.phone}</p>
                          <p>العنوان: {orderdata.address}</p>
                          <p>Delivery Man: {orderdata.deliveryMan?.username}</p>
                        </div>
                          : orderdata.orderType == 'Takeaway' ?
                            <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                              <h4>بيانات العميل</h4>
                              <p>الاسم: {orderdata.name}</p>
                              <p>الموبايل: {orderdata.phone}</p>
                              <p>رقم الاوردر: {orderdata.ordernum}</p>
                            </div>
                            : ''}
                        {/* Order Details Table */}
                        <table className="table table-bordered table-responsive-md" style={{ direction: 'rtl' }}>
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col" className="col-md-3">الصنف</th>
                              <th scope="col" className="col-md-2">السعر</th>
                              <th scope="col" className="col-md-2">الكمية</th>
                              <th scope="col" className="col-md-2">الاجمالي</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Replace this with your dynamic data */}
                            {listProductsOrder.map((item, i) => (
                              <>
                                <tr key={i}>
                                  <td className="col-md-3 text-truncate">{item.name}</td>
                                  <td className="col-md-2 text-nowrap">{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                  <td className="col-md-2 text-nowrap">{item.quantity}</td>
                                  <td className="col-md-2 text-nowrap">{item.totalprice}</td>
                                </tr>
                                {item.extras && item.extras.length > 0 && (
                                  item.extras.map((extra, j) => (
                                    extra && (
                                      <tr key={`${i}-${j}`}>
                                        <td className="col-md-3 text-truncate">
                                          <div className="d-flex flex-column flex-wrap w-100 align-items-center justify-content-between">
                                            {extra.extraDetails.map((detail) => {
                                              return (
                                                <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name}`}</p>
                                              );
                                            })}
                                          </div>
                                        </td>
                                        <td className="col-md-2 text-nowrap">
                                          <div className="d-flex  flex-column flex-wrap w-100 align-items-center justify-content-between">
                                            {extra.extraDetails.map((detail) => {

                                              return (
                                                <p className="badge badge-secondary m-1" key={detail.extraid}>{` ${detail.price} ج`}</p>
                                              );
                                            })}
                                          </div>
                                        </td>
                                        <td className="col-md-2 text-nowrap">1</td>
                                        <td className="col-md-2 text-nowrap">
                                          {extra && (
                                            <p className="badge badge-info m-1">{extra.totalExtrasPrice} ج</p>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  ))
                                )}
                              </>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3">المجموع</td>
                              <td>{orderSubtotal}</td>
                            </tr>
                            {orderdeliveryCost > 0 && (
                              <tr>
                                <td colSpan="3">خدمة التوصيل</td>
                                <td>{orderdeliveryCost}</td>
                              </tr>
                            )}
                            {addition > 0 ?
                              <tr>
                                <td colSpan="3">رسوم اضافيه</td>
                                <td>{addition}</td>
                              </tr>
                              : ''
                            }
                            {discount > 0 ?
                              <tr>
                                <td colSpan="3">خصم</td>
                                <td>{discount}</td>
                              </tr> : ''
                            }
                            <tr>
                              <td colSpan="3">الاجمالي</td>
                              <td>{orderTotal}</td>
                            </tr>
                          </tfoot>
                        </table>


                        {/* Restaurant Information */}
                        <div className="restaurant-info text-dark" style={{ marginTop: '20px', textAlign: 'center' }}>
                          {restaurantData && (
                            <>
                              <p>{restaurantData.name}</p>
                              <p>موبايل: {restaurantData.contact && restaurantData.contact.phone && restaurantData.contact.phone[0]}</p>
                              <p>العنوان: {restaurantData.address &&
                                <>
                                  {`${restaurantData.address.state} ${restaurantData.address.city} ${restaurantData.address.street}`}
                                </>}
                              </p>
                            </>
                          )}
                        </div>
                        {/* Footer */}
                        <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                          <p>Developed by: <span style={{ color: '#5a6268' }}>beshoy Nady</span></p>
                          <p>Mobaile: <span style={{ color: '#5a6268' }}>01122455010</span></p>
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn w-50 btn-success" value="Print" onClick={handlePrintInvoice} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default DeliveryMan