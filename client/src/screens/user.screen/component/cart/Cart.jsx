import React, { useEffect, useState, useRef } from 'react'
import { detacontext } from '../../../../App'
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './Cart.css'

const Cart = (props) => {
  const open_cart = props.opencart
  const ordersText = useRef()
  const orderside = useRef()
  const printContainer = useRef();

  const Print = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });

  const handlePrint = (e) => {
    e.preventDefault();
    Print();
  };

  // Function to format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  // const [list_products_order, setlist_products_order] = useState([])
  // const [serial, setserial] = useState('')
  // const [ordertype, setordertype] = useState('')
  // const [name, setname] = useState('')
  // const [address, setaddress] = useState('')
  // const [phone, setphone] = useState('')
  // const [ordertax, setordertax] = useState()
  // const [ordertotal, setordertotal] = useState()
  // const [ordersubtotal, setordersubtotal] = useState()
  // const [orderdeliveryCost, setorderdeliveryCost] = useState()
  // const [deliveryMan, setdeliveryMan] = useState()
  // const [ordernum, setordernum] = useState()
  // const [table, settable] = useState()
  // const [casher, setcasher] = useState()
  // const [ivocedate, setivocedate] = useState('')

  // // Fetch orders from API
  // const getOrderDetalis = async (id) => {
  //   try {

  //     const res = await axios.get('https://caviar-api.vercel.app/api/order');

  //     const order = res.data.find(o => o.serial == serial)

  //     setlist_products_order(order.products)
  //     setordertotal(order.total)
  //     setordersubtotal(order.subTotal)
  //     setordertax(order.tax)
  //     setorderdeliveryCost(order.deliveryCost)
  //     setserial(order.serial)
  //     setivocedate(order.createdAt)
  //     setcasher(order.casher)
  //     settable(order.order_type == 'Internal' ? order.table : '')
  //     setordernum(order.order_type == 'Takeaway' ? order.ordernum : '')
  //     setordertype(order.order_type)
  //     setaddress(order.order_type == 'Delivery' ? order.address : "")
  //     setdeliveryMan(order.order_type == 'Delivery' ? order.deliveryMan : "")
  //     if (order.order_type != 'Internal') {
  //       setname(order.name)
  //       setphone(order.phone)
  //     }

  //   } catch (error) {
  //     console.log(error);
  //     // Display toast or handle error
  //   }
  // };

  const { id } = useParams()
  return (
    <detacontext.Consumer>
      {
        ({ userLoginInfo, usertitle, ItemsInCart, costOrder, deleteitems, invoice, myorder, list_products_order, ordertotal, ordersubtotal, ordertax, orderdeliveryCost
          , createClientOrderForUser, createClientOrderForTable, checkout }) => {
          return (
            <div className='cart-section' style={open_cart ? { 'display': 'flex' } : { 'display': 'none' }}>
              <div className="cart-wrapper">
                {/* <div className="title-text">
                  <div ref={ordersText} className="title order" >
                    طلباتك الحالية
                  </div>
                  <div className="title invoice">
                    الفاتورة
                  </div>
                </div> */}
                <div className="cart-container">
                  <div className="slide-controler">
                    <input type="radio" name="slide" id="order-radio" defaultChecked />
                    <input type="radio" name="slide" id="invoice-radio" />
                    <label htmlFor="order-radio" className="slide order" onClick={() => {
                      orderside.current.style.marginRight = "0%";
                      // ordersText.current.style.marginRight = "0%";
                    }}>طلباتك الحالية</label>
                    {id ? <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                      invoice(id);
                      orderside.current.style.marginRight = "-50%";
                      // ordersText.current.style.marginRight = "-50%";
                    }}>الفاتورة</label>
                      : userLoginInfo ? <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                        invoice(userLoginInfo.userinfo.id);
                        orderside.current.style.marginRight = "-50%";
                        // ordersText.current.style.marginRight = "-50%";
                      }}>الفاتورة</label>
                        : ""}
                    <div className="slider-tab">

                    </div>
                  </div>
                  <div className="cart-inner">
                    <div ref={orderside} className="order side">
                      <div className='side-content'>
                        {ItemsInCart.map((i, index) => {
                          return (
                            i.quantity > 0 ?
                              <div className="cart-item" key={index}>
                                <div className="cart-img">
                                  <img src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${i.image}`} />
                                </div>
                                <div className='cart-det'>
                                  <div className="item-head">
                                    <p>{i.name}</p>
                                    <button onClick={() => deleteitems(i._id)}>حذف</button>
                                  </div>
                                  <div className="del-cost">
                                    <div className='cart-price'>
                                      <p>{i.discount ? i.priceAfterDiscount : i.price} ج</p>
                                      <p>×{i.quantity}</p>
                                    </div>
                                    <p>{i.discount ? i.priceAfterDiscount * i.quantity : i.price * i.quantity}</p>
                                  </div>
                                  {i.notes ? <div className='cart-note'>{i.notes}</div> : ''}
                                </div>

                              </div>
                              : ''
                          )
                        })
                        }
                      </div>
                      <div className="total-order">

                        {ItemsInCart.length > 0 && (
                          <div className="total-order">
                            {id ? (
                              <button className='total-order-btn' onClick={() => createClientOrderForTable(id)}>تأكيد الطلب</button>
                            ) : (userLoginInfo && userLoginInfo.userinfo) && (
                              <button className='total-order-btn' onClick={() => createClientOrderForUser(userLoginInfo.userinfo.id)}>تأكيد الطلب</button>
                            )}
                            <div className='total-order-details'>
                              <h2>المجموع</h2>
                              <p>{costOrder}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="invoice side" >
                      <div ref={printContainer} className="max-w-400px p-1 mb-7 overflow-auto printpage" style={{Width:'100%' , textAlign: 'center' }}>
                        {/* Invoice Header */}
                        <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                          <h2>Restaurant Name</h2>
                          <p>Casher {usertitle(myorder.casher)} |Invoice #{myorder.serial} |{myorder.ordertype == 'Internal' ? `Table ${usertitle(myorder.table)}` : ''} | Date: {formatDate(new Date())}</p>
                        </div>

                        {/* Customer Information */}
                        {myorder.ordertype == 'Delivery' ? <div className="customer-info text-dark" style={{ margin: '20px' }}>
                          <h4>Customer Details</h4>
                          <p>Name: {myorder.name}</p>
                          <p>Mobile: {myorder.phone}</p>
                          <p>Address: {myorder.address}</p>
                          <p>Delivery Man: {usertitle(myorder.deliveryMan)}</p>
                        </div> : myorder.ordertype == 'Takeaway' ?
                          <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                            <h4>Customer Details</h4>
                            <p>Name: {myorder.name}</p>
                            <p>Mobile: {myorder.phone}</p>
                            <p>order num: {myorder.ordernum}</p>
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
                            {list_products_order.map((item, i) => (
                              <tr key={i}>
                                <td className="col-md-3 text-truncate">{item.name}</td>
                                <td className="col-md-2 text-nowrap">{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                <td className="col-md-2 text-nowrap">{item.quantity}</td>
                                <td className="col-md-2 text-nowrap">{item.totalprice}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3">المجموع</td>
                              <td>{ordersubtotal>0?ordersubtotal:0}</td>
                            </tr>
                            {orderdeliveryCost > 0 && (
                              <tr>
                                <td colSpan="3">خدمة التوصيل</td>
                                <td>{orderdeliveryCost}</td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan="3">الضريبه</td>
                              <td>{ordertax>0?Math.round(ordertax * 100) / 100:0}</td>
                            </tr>
                            <tr>
                              <td colSpan="3">الاجمالي</td>
                              <td>{ordertotal>0?ordertotal:0}</td>
                            </tr>
                          </tfoot>
                        </table>



                        {/* Restaurant Information */}
                        <div className="restaurant-info text-dark" style={{ marginTop: '20px', textAlign: 'center' }}>
                          <h4>Restaurant Details</h4>
                          <p>Restaurant Name</p>
                          <p>Mobile: 987-654-3210</p>
                          <p>Address: 456 Street, City</p>
                        </div>

                        {/* Footer */}
                        <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                          <p>Developed by: <span style={{ color: '#5a6268' }}>esyservice</span></p>
                        </div>
                      </div>
                      <div className="total-order">
                        {id ? <button className='total-order-btn' onClick={() => checkout()}>طلب الحساب</button> : ""}

                        <button className='total-order-btn' onClick={handlePrint}>طباعه</button>
                        <div className='total-order-details'>
                          <h2>الاجمالي</h2>
                          <p>{ordertotal}</p>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div >
            </div >
          )
        }
      }
    </detacontext.Consumer >
  )
}

export default Cart
