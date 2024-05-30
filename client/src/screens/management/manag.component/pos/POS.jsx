import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import axios from 'axios';

import './POS.css'
import { number } from 'joi';

const POS = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const ordersText = useRef()
  const orderside = useRef()
  const printContainer = useRef()
  const handlePrint = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });


  // const [getOrderTableModal, setgetOrderTableModal] = useState(false)
  // const [typeOrderModal, settypeOrderModal] = useState(false)
  const [invoiceModal, setinvoiceModal] = useState(false)
  // const [getOrderDetalisModal, setgetOrderDetalisModal] = useState(false)
  const [serial, setserial] = useState('')

  const [tableID, settableID] = useState('')
  // const [itemId, setitemId] = useState([])
  const [noteArea, setnoteArea] = useState(false)
  const [productid, setproductid] = useState('')

  const [clientname, setclientname] = useState('')
  const [clientphone, setclientphone] = useState('')
  const [clientaddress, setclientaddress] = useState('')
  const [ordertype, setordertype] = useState('')
  const [deliverycost, setdeliverycost] = useState(0)

  const [adddiscount, setadddiscount] = useState(false)
  const [addaddition, setaddaddition] = useState(false)

  const deleteOrderdetalis = () => {
    setclientname('')
    setclientaddress('')
    setclientphone('')
    setordertype('')
    settableID('')
    setaddaddition(false)
    setadddiscount(false)
  }

  const [areas, setAreas] = useState([]);

  
    const getAllDeliveryAreas= async()=>{
    try {
      const response = await axios.get(`${apiUrl}/api/deliveryarea`)
      const data = await response.data
      console.log({ data })
      if(data){
        setAreas(data)
      }else{
        toast.error('لا يوجد بيانات لمنطقه التوصيل ! اضف بيانات منطقه التوصيل ')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب بيانات منطقه التوصيل! اعد تحميل الصفحة')
    }
  }

  useEffect(() => {
    getAllDeliveryAreas()
  }, [])
  

  return (
    <detacontext.Consumer>
      {
        ({ allProducts, allcategories, allTable, employeeLoginInfo, setcategoryid, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, usertitle, setitemsInCart, itemsInCart, costOrder, createWaiterOrderForTable, createCasherOrder, lastInvoiceByCasher, myOrder, listProductsOrder, orderTotal, orderSubtotal, ordertax, orderdeliveryCost, setdiscount, setaddition, orderdiscount, orderaddition, discount, addition, getOrderProductForTable,
          OrderDetalisBySerial, getOrderDetailsBySerial, updateOrder, productOrderToUpdate, putNumOfPaid, splitInvoice, subtotalSplitOrder , restaurantData
        }) => {
          if (employeeLoginInfo) {
            return (
              <section className='pos-section'>

                <div className='pos-content'>
                  <div className='categ-menu'>
                    <div className='pos-menu'>
                      {allProducts.filter(pro => pro.category === categoryid).map((product, index) => {
                        return (
                          <div className="pos-card" key={index} onClick={() => addItemToCart(product._id)}>
                            <img className='pos-img-card' src={`${apiUrl}/images/${product.image}`} alt="" />
                            <div className="pos-card-detalis">
                              <div className='card-name'>
                                <div className='product-name'>{product.name}</div>
                                <div className='product-price'>{product.discount > 0 ?
                                  <p><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p>
                                  : <p>{product.price}ج</p>}</div>
                              </div>
                              <div className='card-discription'>{product.description}</div>

                              <div className='pos-btn btn-47'>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      )}
                    </div>
                    <nav className='pos-category'>
                      <ul className='category-ul'>
                        {allcategories.map((c, i) => 
                        <li key={i} className='category-li' onClick={() => setcategoryid(c._id)}>
                          <a className='category-pos-btn '>{c.name}</a>
                        </li>
                        )}
                      </ul>
                    </nav>

                  </div>
                </div>
                {/* تعديل اوردر */}
                <div id="getOrderDetalisModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form onSubmit={(e) => { getOrderDetailsBySerial(e, serial) }}>
                        <div className="modal-header">
                          <h4 className="modal-title">رقم الفاتوره</h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                          <div className="w-100">
                            <div className="form-group form-group-47 w-100">
                              <label htmlFor='table' className='w-40'>رقم الفاتورة:</label>
                              <input type="text" min={0} className="font-weight-bold w-25 " onChange={(e) => setserial(e.target.value)} />

                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <div className="modal-footer">
                            <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                            <input type="submit" className="btn btn-47 btn-success" value="تم" />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* دفع جزء */}
                <div id="getOrderTableModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form onSubmit={(e) => { splitInvoice(e) }}>
                        <div className="modal-header">
                          <h4 className="modal-title">اختر الطاوله</h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                          <div className="w-100">
                            <div className="form-group form-group-47 w-100">
                              <label htmlFor='table' className='w-40'>رقم الطاولة:</label>
                              <select id='table' className="w-60 form-control" required onChange={(e) => getOrderProductForTable(e, e.target.value)}>
                                <option>اختر رقم الطاولة</option>
                                {allTable.map((table, i) => (
                                  <option value={table._id} key={i}>{table.tableNumber}</option>
                                ))}
                              </select>
                            </div>
                            <table className="table table-bordered table-responsive-md" style={{ direction: 'rtl' }}>
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" className="col-md-3">الصنف</th>
                                  <th scope="col" className="col-md-2">السعر</th>
                                  <th scope="col" className="col-md-1">الكمية</th>
                                  <th scope="col" className="col-md-1">الاجمالي</th>
                                  <th scope="col" className="col-md-2">الجزء</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Replace this with your dynamic data */}
                                {listProductsOrder.map((item, i) => (
                                  <tr key={i}>
                                    <td className="col-md-3 text-truncate">{item.name}</td>
                                    <td className="col-md-2 text-nowrap">{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                    <td className="col-md-1 text-nowrap">{item.quantity - item.numOfPaid}</td>
                                    <td className="col-md-1 text-nowrap">{item.totalprice}</td>
                                    <td className="col-md-2 text-nowrap">
                                      <input type='number' min={0} max={item.quantity - item.numOfPaid} defaultValue={0} onChange={(e) => { putNumOfPaid(item.productid, Number(e.target.value)) }} style={{ width: "50px" }} />
                                    </td>
                                  </tr>
                                ))}

                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan="4">المجموع</td>
                                  <td>{subtotalSplitOrder}</td>
                                </tr>
                                <tr>
                                  <td colSpan="4">الاجمالي</td>
                                  <td>{orderTotal}</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                          <input type="submit" className="btn btn-47 btn-success" value="تم" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* اختيار نوع الاوردر */}
                {/* {typeOrderModal ? ( */}
                <div id="typeOrderModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form>
                        <div className="modal-header">
                          <h4 className="modal-title">ادخل بيانات العميل</h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        {ordertype ?
                          ordertype === 'Internal' ? (
                            <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                              <div className="w-100">
                                <div className="form-group form-group-47 w-100">
                                  <label htmlFor='table' className='w-40'>رقم الطاولة:</label>
                                  <select id='table' className="w-60 form-control" required onChange={(e) => { settableID(e.target.value) }}>
                                    <option>اختر رقم الطاولة</option>
                                    {allTable.map((table, i) => (
                                      <option value={table._id} key={i}>{table.tableNumber}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ) : ordertype === 'Delivery' ? (
                            <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                              <div className='w-100'>
                                <div className="form-group form-group-47 w-100">
                                  <label htmlFor="name" className='w-40'>اسم العميل:</label>
                                  <input type='text' className="w-60 form-control" required onChange={(e) => { setclientname(e.target.value) }} />
                                </div>
                                <div className="form-group form-group-47 w-100">
                                  <label htmlFor="phone" className='w-40'>رقم الوبايل:</label>
                                  <input type='text' className="w-60 form-control" required onChange={(e) => setclientphone(e.target.value)} />
                                </div>
                                <div className="form-group form-group-47 w-100">
                                  <select required onChange={(e) => setdeliverycost(e.target.value)}>
                                    <option>اختر المنطقة</option>
                                    {areas ? (
                                      areas.map((area, i) => (
                                        <option value={area.delivery_fee} key={i}>{area.name}</option>
                                      ))
                                    ) : (
                                      <option>لا توجد مناطق توصيل متاحة</option>
                                    )}
                                  </select>
                                </div>
                                <div className="form-group form-group-47 w-100">
                                  <label htmlFor="address" className='w-40'>العنوان:</label>
                                  <textarea className="w-60 form-control" required onChange={(e) => setclientaddress(e.target.value)} />
                                </div>
                              </div>
                            </div>
                          ) : ordertype === 'Takeaway' ? (
                            <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                              <div className='w-100'>
                                <div className="form-group form-group-47 w-100">
                                  <label htmlFor="name" className='w-40'>اسم العميل:</label>
                                  <input type='text' className="w-60 form-control" required onChange={(e) => { setclientname(e.target.value) }} />
                                </div>
                                <div className="form-group form-group-47 w-100">
                                  <label htmlFor="phone" className='w-40'>رقم الوبايل:</label>
                                  <input type='text' className="w-60 form-control" required onChange={(e) => setclientphone(e.target.value)} />
                                </div>
                              </div>
                            </div>
                          ) : null : ''}
                        <div className="modal-footer">
                          <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" onClick={() => { deleteOrderdetalis() }} />
                          <input type="save" className="btn btn-47 btn-success" value="تم" data-dismiss="modal" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* ) : ""}  */}
                {/* الفاتوره */}
                <div id="invoiceModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button className='btn btn-47 btn-success m-0' onClick={handlePrint}>طباعه</button>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>

                      <div className="invoice side" style={{ height: "100%" }} >
                        <div ref={printContainer} className="max-w-400px p-1 mb-7 overflow-auto printpage" style={{ Width: '100%', textAlign: 'center' }}>

                          {/* Invoice Header */}
                          <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                            <h2>{restaurantData.name}</h2>
                            <p>الكاشير: {usertitle(myOrder.casher)} |Invoice #{myOrder.serial} |{myOrder.ordertype == 'Internal' ? `Table ${usertitle(myOrder.table)}` : ''} |التاريخ: {new Date().toLocaleString('en-GB', { hour12: true })}</p>
                          </div>

                          {myOrder.ordertype == 'Delivery' ? <div className="customer-info text-dark" style={{ margin: '20px' }}>
                            <h4>بيانات العميل</h4>
                            <p>الاسم: {myOrder.name}</p>
                            <p>الموبايل: {myOrder.phone}</p>
                            <p>العنوان: {myOrder.address}</p>
                            <p>الديلفري مان: {usertitle(myOrder.deliveryMan)}</p>
                          </div> : myOrder.ordertype == 'Takeaway' ?
                            <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                              <h4>بيانات العميل</h4>
                              <p>الاسم: {myOrder.name}</p>
                              <p>الموبايل: {myOrder.phone}</p>
                              <p>رقم الاوردر: {myOrder.ordernum}</p>
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
                              {listProductsOrder.map((item, i) => (
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
                                <td>{orderSubtotal}</td>
                              </tr>
                              {orderdeliveryCost > 0 ?
                                <tr>
                                  <td colSpan="3">خدمة التوصيل</td>
                                  <td>{orderdeliveryCost}</td>
                                </tr>
                                : ''}
                              {orderaddition > 0 ?
                                <tr>
                                  <td colSpan="3">رسوم اضافيه</td>
                                  <td>{orderaddition}</td>
                                </tr>
                                : ''
                              }
                              {orderdiscount > 0 ?
                                <tr>
                                  <td colSpan="3">رسوم اضافيه</td>
                                  <td>{orderdiscount}</td>
                                </tr> : ''
                              }
                              <tr>
                                <td colSpan="3">الاجمالي</td>
                                <td>{orderTotal}</td>
                              </tr>
                            </tfoot>
                          </table>

                          <div className="text-dark" style={{ marginTop: '20px', textAlign: 'center' }}>
                          {restaurantData && (
                            <>
                              <p>{restaurantData.name}</p>
                              <p>موبايل: {restaurantData.contact && restaurantData.contact.phone && restaurantData.contact.phone[0]}</p>
                              <p>العنوان: {restaurantData.address &&
                              <>
                              {`${restaurantData.address.state} ${restaurantData.address.city} ${restaurantData.address.street}`}
                              </> }
                              </p>
                            </>
                          )}
                          </div>

                          <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                          <p>Developed by: <span style={{ color: '#5a6268' }}>beshoy Nady</span></p>
                          <p>Mobaile: <span style={{ color: '#5a6268' }}>01122455010</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* cart section */}
                <div className="container-fluid d-flex flex-column justify-content-between align-items-stretch align-content-between flex-nowrap " style={{ width: '400px', height: '96%', padding: '0', margin: '0' }}>
                  <div className="row" style={{ padding: '0', margin: '0' }}>
                    <div className="col-12">
                      <div className="btn btn-group btn btn-block">
                        <a href="#typeOrderModal" type="button" className="btn btn-47 btn-primary" data-toggle="modal" onClick={(e) => { setordertype('Internal') }}>الصالة</a>
                        <a type="button" className="btn btn-47 btn-success" href="#typeOrderModal" data-toggle="modal" onClick={(e) => { setordertype('Takeaway') }}>التيك أوي</a>
                        <a type="button" className="btn btn-47 btn-danger" href="#typeOrderModal" data-toggle="modal" onClick={(e) => { setordertype('Delivery') }}>التوصيل</a>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ height: '60%', width: '100%', padding: '0', margin: '0', overflow: 'auto' }}>
                    <div className="col-12 col-md-8 overflow-auto" style={{ width: '100%' }}>
                      {
                        itemsInCart.length > 0 ? itemsInCart.map((i, index) => (
                          <div className="card mb-3" key={index}>
                            {i._id === productid && noteArea ? (
                              <form className="card-body" style={{ padding: '5px', margin: '0' }}>
                                <textarea className="form-control mb-2" placeholder='اضف تعليماتك الخاصة بهذا الطبق' name='note' rows='3' onChange={(e) => { setproductNote(e.target.value); }}></textarea>
                                <div className="d-flex justify-content-center">
                                  <button type="submit" className="btn btn-47 btn-primary me-2" style={{ height: '35px' }}>تاكيد</button>
                                  <button type="button" onClick={() => setnoteArea(!noteArea)} className="btn btn-47 btn-secondary" style={{ height: '35px' }}>اغلاق</button>
                                </div>
                              </form>
                            ) : (
                              <div className="card-body" style={{ padding: '5px', margin: '0' }}>
                                <div className="d-flex justify-content-between align-items-center py-2">
                                  <div className="fw-bold" style={{ width: '50%' }}>{i.name}</div>
                                  <span onClick={() => { setnoteArea(!noteArea); setproductid(i._id); }} className='material-symbols-outlined' style={{ width: '30%', fontSize: '40px', color: 'rgb(0, 238, 255)' }}>note_alt</span>
                                  <button onClick={() => deleteItemFromCart(i._id)} className="btn btn-47 btn-danger">حذف</button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center py-2">
                                  <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{i.discount ? i.priceAfterDiscount : i.price} ج</div>
                                  <div className="d-flex justify-content-between" style={{ width: '50%' }}>
                                    <button onClick={() => decrementProductQuantity(i._id)} className="btn btn-47 btn-light">-</button>
                                    <span>{i.quantity ? i.quantity : 0}</span>
                                    <button onClick={() => incrementProductQuantity(i._id)} className="btn btn-47 btn-light">+</button>
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
                        ))
                          :
                          productOrderToUpdate.length > 0 ? productOrderToUpdate.map((i, index) => (
                            <div className="card mb-3" key={index}>
                              {i.productid === productid && noteArea ? (
                                <form className="card-body" style={{ padding: '5px', margin: '0' }}>
                                  <textarea className="form-control mb-2" placeholder='اضف تعليماتك الخاصة بهذا الطبق' name='note' rows='3' onChange={(e) => { setproductNote(e.target.value); }}></textarea>
                                  <div className="d-flex justify-content-center">
                                    <button type="submit" className="btn btn-47 btn-primary me-2" style={{ height: '35px' }}>تاكيد</button>
                                    <button type="button" onClick={() => setnoteArea(!noteArea)} className="btn btn-47 btn-secondary" style={{ height: '35px' }}>اغلاق</button>
                                  </div>
                                </form>
                              ) : (
                                <div className="card-body" style={{ padding: '5px', margin: '0' }}>
                                  <div className="d-flex justify-content-between align-items-center py-2">
                                    <div className="fw-bold" style={{ width: '50%' }}>{i.name}</div>

                                    <span onClick={() => { setnoteArea(!noteArea); setproductid(i.productid); }} className='material-symbols-outlined' style={{ width: '30%', fontSize: '40px', color: 'rgb(0, 238, 255)' }}>note_alt</span>

                                    <button onClick={() => deleteItemFromCart(i.productid)} className="btn btn-47 btn-danger">حذف</button>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center py-2">
                                    <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{i.priceAfterDiscount > 0 ? i.priceAfterDiscount : i.price} ج</div>
                                    <div className="d-flex justify-content-between" style={{ width: '50%' }}>
                                      <button onClick={() => decrementProductQuantity(i.productid)} className="btn btn-47 btn-light">-</button>
                                      <span>{i.quantity > 0 ? i.quantity : 0}</span>
                                      <button onClick={() => incrementProductQuantity(i.productid)} className="btn btn-47 btn-light">+</button>
                                    </div>
                                    <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{i.priceAfterDiscount > 0 ? i.priceAfterDiscount * i.quantity : i.price * i.quantity} ج</div>
                                  </div>
                                  {i.notes && (
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(29, 29, 255)' }}>
                                      {i.notes}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))

                            : ""}
                    </div>
                  </div>
                  <div>
                    <div className="row d-flex align-items-start rounded-10 p-0 m-0" style={{ padding: '0', margin: '0', direction: 'rtl' }}>
                      <div className="col">
                        <div className="order-details bg-white border" >
                          <p className="order-item mb-0 d-flex justify-content-between align-items-center text-black">
                            <span className="font-weight-bold">قيمة الأوردر:</span>
                            <span>{costOrder > 0 ? costOrder : 0}ج</span>
                          </p>

                          {ordertype == 'Delivery' ?
                            <p className="order-item mb-0 d-flex justify-content-between align-items-center text-black">
                            <span className="font-weight-bold">خدمة التوصيل:</span>
                            <span>{deliverycost > 0 ? deliverycost : 0}ج</span>
                          </p> : ""}
                          {addaddition || addition > 0 ?
                            <p className="order-item border-bottom mb-0 d-flex justify-content-between align-items-center text-black">
                              <span className="font-weight-bold">رسوم إضافية:</span>
                              <input type="Number" min={0} className="font-weight-bold w-25" defaultValue={addition} onChange={(e) => setaddition(Number(e.target.value))} />
                            </p> : ''
                          }
                          {adddiscount || discount > 0 ?
                            <p className="order-item border-bottom mb-0 d-flex justify-content-between align-items-center text-black">
                              <span className="font-weight-bold">الخصم:</span>
                              <input type="Number" min={0} className="font-weight-bold w-25 " defaultValue={discount} onChange={(e) => setdiscount(Number(e.target.value))} />
                            </p> : ''
                          }
                          <p className="order-item border-bottom mb-0 d-flex justify-content-between align-items-center text-black">
                            <span className="font-weight-bold">الإجمالي:</span>
                            <span>{costOrder > 0 ? costOrder + deliverycost + addition - discount : 0}ج</span>
                          </p>
                        </div>
                      </div>
                    </div>


                    <div className="row w-100 mt-auto" style={{ padding: '0', margin: '0' }}>
                      <div className="col-12">
                        <div className="btn btn-group btn btn-block">
                          <button type="button" className="btn btn-47 btn-secondary" onClick={() => setaddaddition(!addaddition)}>رسوم</button>
                          <button type="button" className="btn btn-47 btn-secondary" onClick={() => setadddiscount(!adddiscount)}>خصم</button>
                          <button type="button" className="btn btn-47 btn-danger" onClick={() => { setitemsInCart([]); deleteOrderdetalis() }}>إلغاء الطلب</button>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="btn btn-group btn btn-block">
                          {productOrderToUpdate.length > 0 ?
                            <button type="button" className="btn btn-47 btn-secondary" onClick={() => updateOrder()}>تاكيد التعديل</button>
                            : <a type="button" className="btn btn-47 btn-secondary" href="#getOrderDetalisModal" data-toggle="modal">تعديل</a>
                          }
                          <a type="button" className="btn btn-47 btn-warning" href="#getOrderTableModal" data-toggle="modal">دفع جزء</a>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="btn btn-group btn btn-block">
                          {ordertype === 'Internal' ?
                            <button type="button" className="btn btn-47 btn-primary" onClick={() => { createWaiterOrderForTable(tableID, employeeLoginInfo.employeeinfo.id); setaddaddition(false); setadddiscount(false) }}>تأكيد</button>

                            : ordertype === 'Delivery' ?
                              <button type="button" className="btn btn-47 btn-primary" onClick={() => { createCasherOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype, deliverycost, discount, addition); setaddaddition(false); setadddiscount(false) }}>تأكيد</button>

                              : ordertype === 'Takeaway' ?
                                <button type="button" className="btn btn-47 btn-primary" onClick={() => { createCasherOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype, discount, addition); setaddaddition(false); setadddiscount(false) }}>تأكيد</button>

                                : <button type="button" className="btn btn-47 btn-primary" onClick={() => alert('اختر نوع الاوردر و اكتب جميع البيانات')}>تأكيد</button>
                          }
                          <a type="button" className="btn btn-47 btn-success" href="#invoiceModal" data-toggle="modal" onClick={() => { lastInvoiceByCasher(employeeLoginInfo.employeeinfo.id); setinvoiceModal(!invoiceModal) }}>طباعة</a>

                        </div>
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