import React, { useState, useRef } from 'react'
import { detacontext } from '../../../../App'
import { useReactToPrint } from 'react-to-print';
import './POS.css'
import { number } from 'joi';

const POS = () => {
  const ordersText = useRef()
  const orderside = useRef()
  const printContainer = useRef()
  const handlePrint = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });
  const [typeOrderModal, settypeOrderModal] = useState(false)
  const [invoiceModal, setinvoiceModal] = useState(false)

  const [tableID, settableID] = useState('')
  const [itemid, setitemid] = useState([])
  const [noteArea, setnoteArea] = useState(false)
  const [productid, setproductid] = useState('')

  const [clientname, setclientname] = useState('')
  const [clientphone, setclientphone] = useState('')
  const [clientaddress, setclientaddress] = useState('')
  const [ordertype, setordertype] = useState('')
  const [delivercost, setdelivercost] = useState(0)

  const deleteOrderdetalis = () => {
    setclientname('')
    setclientaddress('')
    setclientphone('')
    setordertype('')
    settableID('')
  }

  return (
    <detacontext.Consumer>
      {
        ({ allProducts, allcategories, allTable, employeeLoginInfo, setcategoryid, categoryid, additemtocart, deleteitems, increment, descrement, setproductnote, addnotrstoproduct, usertitle, setItemsInCart, ItemsInCart, costOrder, createWaiterOrder, createCasherOrder, POSinvoice, myorder, list_products_order, ordertotal, ordersubtotal, ordertax, orderdeliveryCost }) => {
          if (employeeLoginInfo) {
            return (
              <section className='pos-section'>

                <div className='pos-content'>
                  <div className='categ-menu'>
                  <nav className='pos-category'>
                      <ul className='category-ul'>
                        {allcategories.map((c, i) => <li key={i} className='category-li' onClick={() => setcategoryid(c._id)}>
                          <a className='category-pos-btn'>{c.name}</a>
                        </li>
                        )}
                      </ul>
                    </nav>
                    <div className='pos-menu'>
                      {allProducts.filter(pro => pro.category === categoryid).map((product, index) => {
                        return (
                          <div className="pos-card" key={index} onClick={() => additemtocart(product._id)}>
                            <img className='pos-img-card' src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${product.image}`} alt="" />
                            <div className="pos-card-detalis">
                              <div className='card-name'>
                                <div className='product-name'>{product.name}</div>
                                <div className='product-price'>{product.discount > 0 ?
                                  <p><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p>
                                  : <p>{product.price}ج</p>}</div>
                              </div>
                              <div className='card-discription'>{product.description}</div>

                              <div className='pos-btn'>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      )}
                    </div>
                  </div>
                </div>


                
                {typeOrderModal ? (
                  <div className="modal fade show" style={{ display: 'block', zIndex: '1050', overflowY: 'auto' }}>
                    <div className="modal-dialog fixed-top mx-auto">
                      <div className="modal-content">
                        <form>
                          <div className="modal-header">
                            <h4 className="modal-title">ادخل بيانات العميل</h4>
                            <button type="button" className="close" onClick={() => { deleteOrderdetalis(); settypeOrderModal(!typeOrderModal) }}>&times;</button>
                          </div>
                          {ordertype ?
                            ordertype === 'Internal' ? (
                              <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                                <div className="w-100">
                                  <div className="form-group w-100">
                                    <label htmlFor='table' className='w-40'>رقم الطاولة:</label>
                                    <select id='table' className="w-60 form-control" required onChange={(e) => { settableID(e.target.value) }}>
                                      <option>اختر رقم الطاولة</option>
                                      {allTable.map((table, i) => (
                                        <option value={table._id} key={i}>{table.tablenum}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ) : ordertype === 'Delivery' ? (
                              <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                                <div className='w-100'>
                                  <div className="form-group w-100">
                                    <label htmlFor="name" className='w-40'>اسم العميل:</label>
                                    <input type='text' className="w-60 form-control" required onChange={(e) => setclientname(e.target.value)} />
                                  </div>
                                  <div className="form-group w-100">
                                    <label htmlFor="phone" className='w-40'>رقم الوبايل:</label>
                                    <input type='text' className="w-60 form-control" required onChange={(e) => setclientphone(e.target.value)} />
                                  </div>
                                  <div className="form-group w-100">
                                    <label htmlFor="address" className='w-40'>العنوان:</label>
                                    <textarea className="w-60 form-control" required onChange={(e) => setclientaddress(e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            ) : ordertype === 'Takeaway' ? (
                              <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                                <div className='w-100'>
                                  <div className="form-group w-100">
                                    <label htmlFor="name" className='w-40'>اسم العميل:</label>
                                    <input type='text' className="w-60 form-control" required onChange={(e) => setclientname(e.target.value)} />
                                  </div>
                                  <div className="form-group w-100">
                                    <label htmlFor="phone" className='w-40'>رقم الوبايل:</label>
                                    <input type='text' className="w-60 form-control" required onChange={(e) => setclientphone(e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            ) : null : ''}
                          <div className="modal-footer">
                            <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel" onClick={() => { deleteOrderdetalis(); settypeOrderModal(!typeOrderModal) }} />
                            <input type="submit" className="btn btn-success" value="Add" onClick={(e) => { e.preventDefault(); settypeOrderModal(!typeOrderModal) }} />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : ""}
                {invoiceModal ? (
                  <div className="modal fade show" style={{ display: 'block', zIndex: '1050', overflowY: 'auto' }}>
                    <div className="modal-dialog fixed-top mx-auto">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button className='btn btn-success m-0' onClick={handlePrint}>طباعه</button>
                          <button type="button" className="close" onClick={() => { setinvoiceModal(!invoiceModal) }}>&times;</button>
                        </div>

                        <div className="invoice side" >
                          <div ref={printContainer} className="max-w-400px p-1 mb-7 overflow-auto printpage" style={{ Width: '100%', textAlign: 'center' }}>

                            {/* Invoice Header */}
                            <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                              <h2>Restaurant Name</h2>
                              <p>Casher {usertitle(myorder.casher)} |Invoice #{myorder.serial} |{myorder.ordertype == 'Internal' ? `Table ${usertitle(myorder.table)}` : ''} |Date: {new Date().toLocaleString('en-GB', { hour12: true })}</p>
                            </div>

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

                            <table className="table table-bordered table-responsive-md" style={{ direction: 'rtl' }}>                              <thead className="thead-dark">
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
                                  <td colSpan="3">Subtotal</td>
                                  <td>{ordersubtotal}</td>
                                </tr>
                                {orderdeliveryCost > 0 ?
                                  <tr>
                                    <td colSpan="3">Delivery</td>
                                    <td>{orderdeliveryCost}</td>
                                  </tr>
                                  : ''}
                                <tr>
                                  <td colSpan="3">Tax</td>
                                  <td>{Math.round(ordertax * 100) / 100}</td>
                                </tr>
                                <tr>
                                  <td colSpan="3">Total</td>
                                  <td>{ordertotal}</td>
                                </tr>
                              </tfoot>
                            </table>

                            <div className="text-dark" style={{ marginTop: '20px', textAlign: 'center' }}>
                              <h4>Restaurant Details</h4>
                              <p>Restaurant Name</p>
                              <p>Mobile: 987-654-3210</p>
                              <p>Address: 456 Street, City</p>
                            </div>

                            <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                              <p>Developed by: <span style={{ color: '#5a6268' }}>esyservice</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : ""}


                <div className="container-fluid" style={{ width: '400px', height: '100%', padding: '0', margin: '0' }}>
                  <div className="row" style={{ padding: '0', margin: '0' }}>
                    <div className="col-12">
                      <div className="btn-group btn-block">
                        <a href="#typeOrderModal" type="button" className="btn btn-primary" data-toggle="modal" onClick={(e) => { setordertype('Internal'); settypeOrderModal(!typeOrderModal) }}>الصالة</a>
                        <a type="button" className="btn btn-success" href="#typeOrderModal" data-toggle="modal" onClick={(e) => { setordertype('Takeaway'); settypeOrderModal(!typeOrderModal) }}>التيك أوي</a>
                        <a type="button" className="btn btn-danger" href="#typeOrderModal" data-toggle="modal" onClick={(e) => { setordertype('Delivery'); settypeOrderModal(!typeOrderModal) }}>التوصيل</a>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ height: '50%', width: '100%', padding: '0', margin: '0', overflow: 'auto' }}>
                    <div className="col-12 col-md-8 overflow-auto" style={{ width: '100%' }}>
                      {ItemsInCart.map((i, index) => (
                        <div className="card mb-3" key={index}>
                          {i._id === productid && noteArea ? (
                            <form className="card-body" style={{ padding: '5px', margin: '0' }}>
                              <textarea className="form-control mb-2" placeholder='اضف تعليماتك الخاصة بهذا الطبق' name='note' rows='3' onChange={(e) => { setproductnote(e.target.value); }}></textarea>
                              <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary me-2" style={{ height: '35px' }}>تاكيد</button>
                                <button type="button" onClick={() => setnoteArea(!noteArea)} className="btn btn-secondary" style={{ height: '35px' }}>الغاء</button>
                              </div>
                            </form>
                          ) : (
                            <div className="card-body" style={{ padding: '5px', margin: '0' }}>
                              <div className="d-flex justify-content-between align-items-center py-2">
                                <div className="fw-bold" style={{ width: '50%' }}>{i.name}</div>
                                <span onClick={() => { setnoteArea(!noteArea); setproductid(i._id); }} className='material-symbols-outlined' style={{ width: '30%', fontSize: '40px', color: 'rgb(0, 238, 255)' }}>note_alt</span>
                                <button onClick={() => deleteitems(i._id)} className="btn btn-danger">حذف</button>
                              </div>
                              <div className="d-flex justify-content-between align-items-center py-2">
                                <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{i.discount ? i.priceAfterDiscount : i.price} ج</div>
                                <div className="d-flex justify-content-between" style={{ width: '50%' }}>
                                  <button onClick={() => descrement(i._id)} className="btn btn-light">-</button>
                                  <span>{i.quantity ?i.quantity:0}</span>
                                  <button onClick={() => increment(i._id)} className="btn btn-light">+</button>
                                </div>
                                <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{i.discount ? i.priceAfterDiscount * i.quantity : i.price * i.quantity} ج</div>
                              </div>
                              {i.notes && (
                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(29, 29, 255)' }}>
                                  {i.notes}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row d-flex align-items-start rounded-10 p-0 m-0" style={{ padding: '0', margin: '0' }}>
                    <div className="col">
                      <div className="order-details bg-white border" style={{ flexDirection: 'column-reverse' }}>
                        <p className="order-item mb-0 d-flex justify-content-between align-items-center text-black">
                          <span className="font-weight-bold">قيمة الأوردر:</span>
                          <span>{costOrder > 0 ? costOrder : 0}ج</span>
                        </p>
                        <p className="order-item border-bottom  mb-0 d-flex justify-content-between align-items-center text-black">
                          <span className="font-weight-bold">الضريبة:</span>
                          <span>{costOrder > 0 ? Math.round(costOrder * 0.10 * 100) / 100 : 0}ج</span>
                        </p>
                        {ordertype == 'Delivery' ?
                          <form className="order-item border-bottom mb-0 d-flex justify-content-between align-items-center text-black">
                            <label className="font-weight-bold">خدمة التوصيل:</label>
                            <select id='table' className="w-40 form-control" required onChange={(e) => { setdelivercost(Number(e.target.value)) }}>
                              <option>اختر</option>
                              <option value='10'>10</option>
                              <option value='15'>15</option>
                              <option value='20'>20</option>
                            </select>
                          </form> : ""}
                        <p className="order-item border-bottom mb-0 d-flex justify-content-between align-items-center text-black">
                          <span className="font-weight-bold">رسوم إضافية:</span>
                          <span>$2.00</span>
                        </p>
                        <p className="order-item border-bottom mb-0 d-flex justify-content-between align-items-center text-black">
                          <span className="font-weight-bold">الخصم:</span>
                          <span>$15.00</span>
                        </p>
                        <p className="order-item border-bottom mb-0 d-flex justify-content-between align-items-center text-black">
                          <span className="font-weight-bold">الإجمالي:</span>
                          <span>{costOrder > 0 ? costOrder + delivercost + Math.round(costOrder * 0.10 * 100) / 100 : 0}ج</span>
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="row w-100 mt-auto" style={{ padding: '0', margin: '0' }}>
                    <div className="col-12">
                      <div className="btn-group btn-block">
                        <button type="button" className="btn btn-danger" onClick={() => { setItemsInCart([]); deleteOrderdetalis() }}>إلغاء الطلب</button>
                        <button type="button" className="btn btn-secondary">رسوم</button>
                        <button type="button" className="btn btn-secondary">خصم</button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="btn-group btn-block">
                        <button type="button" className="btn btn-success" onClick={() => { POSinvoice(employeeLoginInfo.employeeinfo.id); setinvoiceModal(!invoiceModal) }}>طباعة</button>
                        <button type="button" className="btn btn-warning">كاش</button>
                        <button type="button" className="btn btn-info">كارت</button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="btn-group btn-block">
                        {ordertype === 'Internal' ?
                          <button type="button" className="btn btn-primary" onClick={() => createWaiterOrder(tableID, employeeLoginInfo.employeeinfo.id)}>تأكيد</button>

                          : ordertype === 'Delivery' ? <button type="button" className="btn btn-primary" onClick={() => createCasherOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype, delivercost)}>تأكيد</button>

                            : ordertype === 'Takeaway' ? <button type="button" className="btn btn-primary" onClick={() => createCasherOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype)}>تأكيد</button>

                              : <button type="button" className="btn btn-primary" onClick={() => alert('اختر نوع الاوردر و اكتب جميع البيانات')}>تأكيد</button>
                        }
                        <button type="button" className="btn btn-secondary">تعديل</button>
                      </div>
                    </div>
                  </div>

                </div>


              </section>
            )
          } else { return <></> }
        }
      }
    </detacontext.Consumer>

  )
}

export default POS