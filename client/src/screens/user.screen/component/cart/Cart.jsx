import React, { useRef } from 'react'
import { detacontext } from '../../../../App'
import { useParams } from 'react-router-dom';

import { useReactToPrint } from 'react-to-print';
import './Cart.css'
import defaultsImage from '../../.././../image/menu/soup.jpg'

import html2pdf from 'html2pdf.js';

const Cart = (props) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const open_cart = props.opencart
  const ordersText = useRef()
  const orderside = useRef()
  const printContainer = useRef();

  // const Print = useReactToPrint({
  //   content: () => printContainer.current,
  //   copyStyles: true,
  //   removeAfterPrint: true,
  //   bodyClass: 'printpage'
  // });

  // const handlePrint = (e) => {
  //   e.preventDefault();
  //   Print();
  // };

  const handlePrint = () => {
    const element = document.querySelector('.printpage');
    html2pdf(element);
  };

  // Function to format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(date).toLocaleDateString('en-GB', options);
  };



  const { id } = useParams()
  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, allProducts, clientInfo, userLoginInfo, usertitle, itemsInCart, costOrder, deleteItemFromCart, invoice, myOrder, listProductsOrder, orderTotal, orderSubtotal, ordertax, orderdeliveryCost
          , createDeliveryOrderByClient, createOrderForTableByClient, checkout }) => {
          return (
            <div className='cart-section' style={open_cart ? { 'display': 'flex' } : { 'display': 'none' }}>
              {console.log({ itemsInCart })}
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
                        : <label htmlFor="invoice-radio" className="slide invoice" onClick={() => {
                          orderside.current.style.marginRight = "-50%";
                          // ordersText.current.style.marginRight = "-50%";
                        }}>الفاتورة</label>}
                    <div className="slider-tab">

                    </div>
                  </div>
                  <div className="cart-inner">
                    <div ref={orderside} className="order side">
                      <div className="d-flex flex-column w-100 p-0 m-0" style={{ heitgh: 'max-content', overflowY: 'auto', overflowX: 'hidden', backgroundColor: 'gray' }}>
                        {itemsInCart.length > 0 ? itemsInCart.map((item, index) => {
                          return (
                            item.quantity > 0 &&
                            <div className="card mb-3 w-100" key={index}>
                              <div className="row no-gutters w-100">
                                <div className="col-md-3">

                                  {/* <img src={item.image ? `${apiUrl}/images/${item.image}` : {defaultsImage}} className="card-img" alt={item.name} /> */}
                                  <img src={defaultsImage} className="card-img" alt={item.name} />
                                </div>
                                <div className="col-md-9">
                                  <div className="card-body d-flex flex-column align-items-stretch justfiy-content-start">
                                    <div className="d-flex justfiy-content-between w-100">
                                      <h5 className="card-title">{item.name} {item.size ? `- ${item.size}` : ''}</h5>
                                      <button className="btn btn-danger btn-sm" onClick={() => deleteItemFromCart(item.productid, item.sizeId)}>حذف</button>
                                    </div>
                                    <div className="d-flex justfiy-content-between mt-2">
                                      <div className="d-flex justfiy-content-between w-50">
                                        <p className="card-text">{item.priceAfterDiscount ? item.priceAfterDiscount : item.price} ج</p>
                                        <p className="card-text">×{item.quantity}</p>
                                      </div>
                                      <p className="card-text">{item.priceAfterDiscount ? item.priceAfterDiscount * item.quantity : item.price * item.quantity} ج</p>
                                    </div>
                                    {item.extras && (
                                      <div className="d-flex flex-columen flex-wrap mt-2">
                                        {item.extras.map((extra, i) => (
                                          extra && extra.extraId && <div key={i} className="d-flex w-100 flex-wrap m-0 mb-1 p-0" style={{ borderBottom: '1px solid black' }}>
                                            <div className='d-flex col-10 align-items-center justfiy-content-between flex-wrap p-0 m-0'>
                                              {extra.extraId.map((extraid) => {
                                                const extradata = allProducts.find(pro => pro._id === extraid);
                                                return (
                                                  <p className="badge badge-secondary m-1" key={extraid}>{`${extradata.name} ${extradata.price} ج`}</p>
                                                );
                                              })}
                                            </div>
                                            <p className="d-flex col-2 align-items-center justfiy-content-center badge badge-info">{extra.priceExtras} ج</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {item.notes && <div className="card-text mt-2 text-muted">{item.notes}</div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }) : <p>لا توجد منتجات في العربة.</p>}
                      </div>
                      <div className="total-order">

                        {itemsInCart.length > 0 && (
                          <div className="total-order">
                            {id ? (
                              <button className='total-order-btn btn btn-success' onClick={() => createOrderForTableByClient(id)}>تأكيد الطلب</button>
                            ) : (userLoginInfo && userLoginInfo.userinfo) && (
                              <button className='total-order-btn btn btn-success' onClick={() => createDeliveryOrderByClient(clientInfo._id, clientInfo.address, clientInfo.deliveryArea.delivery_fee)}>تأكيد الطلب</button>
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
                      <div ref={printContainer} className="max-w-400px p-1 mb-7 overflow-auto printpage" style={{ Width: '100%', height: "80%", textAlign: 'center' }}>
                        {/* Invoice Header */}
                        <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                          <h2>{restaurantData.name}</h2>
                          <p>كاشير: {usertitle(myOrder.casher)} |فاتوره #{myOrder.serial} |{myOrder.orderType == 'Internal' ? `Table ${usertitle(myOrder.table)}` : ''} | التاريخ: {formatDate(new Date())}</p>
                        </div>

                        {/* Customer Information */}
                        {myOrder.orderType == 'Delivery' ?
                          <div className="customer-info text-dark" style={{ margin: '20px' }}>
                            <h4>بيانات العميل</h4>
                            <p>الاسم: {myOrder.name}</p>
                            <p>الموبايل: {myOrder.phone}</p>
                            <p>العنوان: {myOrder.address}</p>
                            <p>الديليفري: {usertitle(myOrder.deliveryMan)}</p>
                          </div> : myOrder.orderType == 'Takeaway' ?
                            <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                              <h4>بيانات العميل</h4>
                              <p>الاسم: {myOrder.name}</p>
                              <p>الموبايل: {myOrder.phone}</p>
                              <p>رقم الاوردر: {myOrder.ordernum}</p>
                            </div>
                            : ''}
                        {/* Order Details Table */}
                        <table className="table table-bordered table-responsive-md" style={{ direction: 'rtl' }}>
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col" className="col-md-4">الصنف</th>
                              <th scope="col" className="col-md-2">السعر</th>
                              <th scope="col" className="col-md-2">الكمية</th>
                              <th scope="col" className="col-md-2">الاجمالي</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listProductsOrder && listProductsOrder.map((item, i) => (
                              <>
                                <tr key={i}>
                                  <td className="col-md-4 text-truncate">
                                    <p>{item.name}</p>
                                  </td>
                                  <td className="col-md-2 text-nowrap">
                                    <p>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price} ج</p>
                                  </td>
                                  <td className="col-md-2 text-nowrap">{item.quantity}</td>
                                  <td className="col-md-2 text-nowrap">{item.totalprice} ج</td>
                                </tr>

                                {item.extras && item.extras.length > 0 && (
                                  item.extras.map((extra, i) => (
                                    <tr>
                                      <td className="col-md-4 text-truncate">
                                        <div className='d-flex flex-wrap w-100 align-items-center justfiy-content-between' style={{ borderBottom: '1px solid black' }}>
                                          {extra && extra.extraId && extra.extraId.map((extraid) => {
                                            const extradata = allProducts.find(pro => pro._id === extraid);
                                            return (
                                              <p className="badge badge-secondary m-1" key={extraid}>{`${extradata.name}`}</p>
                                            );
                                          })

                                          }
                                        </div>
                                      </td>
                                      <td className="col-md-2 text-nowrap">
                                      <div className='d-flex flex-wrap w-100 align-items-center justfiy-content-between' style={{ borderBottom: '1px solid black' }}>
                                          {extra && extra.extraId && extra.extraId.map((extraid) => {
                                            const extradata = allProducts.find(pro => pro._id === extraid);
                                            return (
                                              <p className="badge badge-secondary m-1" key={extraid}>{`${extradata.price}`}</p>
                                            );
                                          })

                                          }
                                        </div>
                                        
                                      </td>
                                      <td className="col-md-2 text-nowrap">1</td>
                                      <td className="col-md-2 text-nowrap">
                                        {item.extras && item.extras.length > 0 && (
                                          <div className="d-flex flex-wrap flex-column align-items-center justfiy-content-between  mt-2">
                                            <p className="badge badge-info m-1" key={i}>{extra.priceExtras} ج</p>
                                          </div>
                                        )}</td>
                                    </tr>
                                  )))}
                              </>
                            ))}
                            {/* {listProductsOrder && listProductsOrder.map((item, i) => (

                              <tr key={i}>
                                <td className="col-md-4 text-truncate">
                                  <p>{item.name}</p>
                                  {item.extras && item.extras.length > 0 && (
                                    <div className="d-flex flex-column w-100 mt-2"> 
                                      {item.extras.map((extra, i) => (
                                        <div className='d-flex flex-wrap w-100 align-items-center justfiy-content-between' style={{borderBottom:'1px solid black'}}>
                                          {
                                            extra && extra.extraId &&extra.extraId.map((extraid) => {
                                              const extradata = allProducts.find(pro => pro._id === extraid);
                                              return (
                                                <p className="badge badge-secondary m-1" key={extraid}>{`${extradata.name} ${extradata.price} ج`}</p>
                                              );
                                            })

                                          }
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </td>
                                <td className="col-md-2 text-nowrap">
                                  <p>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price} ج</p>
                                  {item.extras && item.extras.length > 0 && (
                                    <div className="d-flex flex-wrap flex-column align-items-center justfiy-content-between  mt-2">
                                      {item.extras.map((extra, i) => (
                                        extra&&<p className="badge badge-info m-1" key={i}>{extra.priceExtras} ج</p>
                                      ))}
                                    </div>
                                  )}
                                </td>
                                <td className="col-md-2 text-nowrap">{item.quantity}</td>
                                <td className="col-md-2 text-nowrap">{item.totalprice} ج</td>
                              </tr>
                            ))} */}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3">المجموع</td>
                              <td>{orderSubtotal > 0 ? orderSubtotal : 0} ج</td>
                            </tr>
                            {myOrder.deliveryCost > 0 && (
                              <tr>
                                <td colSpan="3">خدمة التوصيل</td>
                                <td>{myOrder.deliveryCost} ج</td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan="3">الاجمالي</td>
                              <td>{orderTotal > 0 ? orderTotal : 0} ج</td>
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
                        <div className="footer">
                          <p>Developed by: <span>beshoy Nady</span></p>
                          <p>Mobile: <span>01122455010</span></p>
                        </div>

                      </div>
                      <div className="total-order p-1 d-flex align-items-center justfiy-content-between mt-3">
                        {id ? (
                          <button className='total-order-btn btn btn-success' onClick={checkout}>طلب الحساب</button>
                        ) : null}
                        <button className='total-order-btn btn btn-info' onClick={handlePrint}>طباعه</button>
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
