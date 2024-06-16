import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App'
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import axios from 'axios';

import defaultsImage from '../../.././../image/menu/soup.jpg'

import './POS.css'
import { number } from 'joi';
import POSCard from './POS-Card';
import InvoiceComponent from '../invoice/invoice';

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
  const [areas, setAreas] = useState([]);
  const [extraArea, setextraArea] = useState(false)

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


  const getAllDeliveryAreas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/deliveryarea`)
      const data = await response.data
      console.log({ data })
      if (data) {
        setAreas(data)
      } else {
        toast.error('لا يوجد بيانات لمنطقه التوصيل ! اضف بيانات منطقه التوصيل ')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب بيانات منطقه التوصيل! اعد تحميل الصفحة')
    }
  }

  const [size, setsize] = useState('')
  const [sizeId, setsizeId] = useState('')
  const [sizeQuantity, setsizeQuantity] = useState(0)
  const [sizePrice, setsizePrice] = useState()
  const [sizePriceAfterDescount, setsizePriceAfterDescount] = useState()

  const handleSelectSize = (size) => {
    setsize(size)
    setsizeId(size._id)
    setsizeQuantity(size.sizeQuantity)
    setsizePrice(size.sizePrice);
    if (size.sizeDiscount > 0) {
      setsizePriceAfterDescount(size.sizePriceAfterDiscount);
    }
  };


  const [product, setproduct] = useState()
  const getProductDitalis = (allproducts, productID) => {
    const filter = allproducts.filter(product => product._id === productID)[0]
    setproduct(filter)
  }


  const [selectedButtonIndex, setSelectedButtonIndex] = useState(1);


  useEffect(() => {
    getAllDeliveryAreas()
  }, [])


  return (
    <detacontext.Consumer>
      {
        ({ allProducts, allcategories, allTable, employeeLoginInfo, setcategoryid, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, usertitle, setitemsInCart, itemsInCart, costOrder, createWaiterOrderForTable, createcashierOrder, lastInvoiceByCashier, myOrder, orderTotal, orderSubtotal, ordertax, orderdeliveryCost, setdiscount, setaddition, orderdiscount, orderaddition, discount, addition, getOrderProductForTable, itemId, addExtrasToProduct, handleAddProductExtras, productExtras, setproductExtras,
          orderDetalisBySerial, getOrderDetailsBySerial, updateOrder, productOrderToUpdate, putNumOfPaid, splitInvoice, subtotalSplitOrder, restaurantData
        }) => {
          if (employeeLoginInfo) {
            return (
              <section className='pos-section'>

                <div className='pos-content'>
                  <div className='categ-menu'>
                    <div className='pos-menu'>
                      <POSCard />
                    </div>
                    <nav className='pos-category'>
                      <ul className='category-ul'>
                        {allcategories && allcategories.map((c, i) =>
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
                      <form onSubmit={(e) => { e.preventDefault(); getOrderDetailsBySerial(e, serial) }}>
                        <div className="modal-header">
                          <h4 className="modal-title">رقم الفاتورة</h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div className="modal-body d-flex justify-content-center align-items-center" style={{ width: '400px', height: '50%' }}>
                          <div className="w-100">
                            <div className="form-group w-100 d-flex align-item-center justify-content-between">
                              <label htmlFor="serial" className="w-50">رقم الفاتورة:</label>
                              <input type="text" id="serial" className="form-control w-50" value={serial} onChange={(e) => setserial(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer d-flex align-item-center justify-content-between">
                          <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                          <input type="submit" className="btn w-50 btn-success" value="تم" />
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
                                {myOrder.products.map((item, i) => (
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
                                  <td>{myOrder.subtotalSplitOrder}</td>
                                </tr>
                                <tr>
                                  <td colSpan="4">الاجمالي</td>
                                  <td>{myOrder.total}</td>
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
                        <button className='btn btn-success m-0' onClick={handlePrint}>طباعة</button>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body p-4" style={{ direction: 'rtl' }}>
                        <div ref={printContainer} className="max-w-400px p-3 mb-7 overflow-auto printpage" style={{ width: '100%', textAlign: 'center' }}>
                          <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                            <h2>{restaurantData.name}</h2>
                            <p>الكاشير: {myOrder.cashier?.fullname} | فاتورة #{myOrder.serial} | {myOrder.ordertype === 'Internal' ? `الطاولة ${myOrder.table.tableNumber}` : ''} | التاريخ: {new Date().toLocaleString('en-GB', { hour12: true })}</p>
                          </div>

                          {myOrder.ordertype === 'Delivery' && (
                            <div className="customer-info text-dark my-3">
                              <h4>بيانات العميل</h4>
                              <p>الاسم: {myOrder.name}</p>
                              <p>الموبايل: {myOrder.phone}</p>
                              <p>العنوان: {myOrder.address}</p>
                              <p>الديلفري مان: {myOrder.deliveryMan&&myOrder.deliveryMan.fullname}</p>
                            </div>
                          )}
                          {myOrder.ordertype === 'Takeaway' && (
                            <div className="customer-info text-dark my-3">
                              <h4>بيانات العميل</h4>
                              <p>الاسم: {myOrder.name}</p>
                              <p>الموبايل: {myOrder.phone}</p>
                              <p>رقم الطلب: {myOrder.ordernum}</p>
                            </div>
                          )}

                          <table className="table table-bordered table-responsive-md text-center" style={{ direction: 'rtl' }}>
                            <thead className="thead-dark">
                              <tr>
                                <th scope="col" className="col-md-3">الصنف</th>
                                <th scope="col" className="col-md-2">السعر</th>
                                <th scope="col" className="col-md-2">الكمية</th>
                                <th scope="col" className="col-md-2">الإجمالي</th>
                              </tr>
                            </thead>
                            <tbody>
                              {myOrder.products && myOrder.products.map((item, i) => (
                                <React.Fragment key={i}>
                                  <tr>
                                    <td className="col-md-3 text-truncate">{item.name}</td>
                                    <td className="col-md-2 text-nowrap">{item.priceAfterDiscount || item.price}</td>
                                    <td className="col-md-2 text-nowrap">{item.quantity}</td>
                                    <td className="col-md-2 text-nowrap">{item.totalprice}</td>
                                  </tr>
                                  {item.extras && item.extras.length > 0 && item.extras.map((extra, j) => (
                                    extra && (
                                      <tr key={`${i}-${j}`}>
                                        <td className="col-md-3 text-truncate">
                                          <div className="d-flex flex-column flex-wrap w-100 align-items-center justify-content-between">
                                            {extra.extraDetails.map(detail => (
                                              <p className="badge badge-secondary m-1" key={detail.extraid._id}>{detail.name}</p>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="col-md-2 text-nowrap">
                                          <div className="d-flex flex-column flex-wrap w-100 align-items-center justify-content-between">
                                            {extra.extraDetails.map(detail => (
                                              <p className="badge badge-secondary m-1" key={detail.extraid._id}>{`${detail.price} ج`}</p>
                                            ))}
                                          </div>
                                        </td>
                                        <td className="col-md-2 text-nowrap">1</td>
                                        <td className="col-md-2 text-nowrap">
                                          {extra && (
                                            <p className="badge badge-info m-1">{`${extra.totalExtrasPrice} ج`}</p>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  ))}
                                </React.Fragment>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="3">المجموع</td>
                                <td>{myOrder.subTotal}</td>
                              </tr>
                              {myOrder.deliveryCost > 0 && (
                                <tr>
                                  <td colSpan="3">خدمة التوصيل</td>
                                  <td>{myOrder.deliveryCost}</td>
                                </tr>
                              )}
                              {myOrder.addition > 0 && (
                                <tr>
                                  <td colSpan="3">رسوم إضافية</td>
                                  <td>{myOrder.addition}</td>
                                </tr>
                              )}
                              {myOrder.discount > 0 && (
                                <tr>
                                  <td colSpan="3">الخصم</td>
                                  <td>{myOrder.discount}</td>
                                </tr>
                              )}
                              <tr>
                                <td colSpan="3">الإجمالي</td>
                                <td>{myOrder.total}</td>
                              </tr>
                            </tfoot>
                          </table>

                          <div className="text-dark my-3">
                            {restaurantData && (
                              <>
                                <p>{restaurantData.name}</p>
                                <p>موبايل: {restaurantData.contact?.phone?.[0]}</p>
                                <p>العنوان: {restaurantData.address?.state} {restaurantData.address?.city} {restaurantData.address?.street}</p>
                              </>
                            )}
                          </div>

                          <div className="footer mt-4 text-center" style={{ color: '#828282' }}>
                            <p>Developed by: <span style={{ color: '#5a6268' }}>Beshoy Nady</span></p>
                            <p>Mobile: <span style={{ color: '#5a6268' }}>01122455010</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {/* cart section */}
                <div className="container-fluid d-flex flex-column justify-content-between align-items-stretch align-content-between flex-nowrap " style={{ width: '450px', height: '100%', padding: '0', margin: '0' }}>
                  <div className="row w-100 p-0 m-0">
                    <div className="col-12 w-100 p-0 m-0">
                      <div className="btn btn-group btn btn-block w-100 p-0 m-0">
                        <a href="#typeOrderModal" type="button" className="btn btn-47 btn-primary" data-toggle="modal" onClick={(e) => { setordertype('Internal') }}>الصالة</a>
                        <a type="button" className="btn btn-47 btn-success" href="#typeOrderModal" data-toggle="modal" onClick={(e) => { setordertype('Takeaway') }}>التيك أوي</a>
                        <a type="button" className="btn btn-47 btn-danger" href="#typeOrderModal" data-toggle="modal" onClick={(e) => { setordertype('Delivery') }}>التوصيل</a>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ height: '60%', width: '100%', padding: '0', margin: '0', overflowY: 'auto' }}>
                    <div className="col-12 col-md-8 overflow=-auto" style={{ width: '100%' }}>
                      {
                        itemsInCart.length > 0 ? itemsInCart.map((item, index) => (
                          <div className="card mb-3" key={index}>


                            {product && item.sizeId && sizeId === item.sizeId && extraArea === true && product.sizes.filter(size => size._id === item.sizeId)[0].sizeQuantity > 0 ?
                              (<div className="position-absolute w-100 h-auto top-0 start-0 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
                                style={{ zIndex: 10 }}>
                                <form onSubmit={(e) => { if (product.extras.length > 0) { addExtrasToProduct(e, product._id, item.sizeId); }; setSelectedButtonIndex(1); setextraArea(!extraArea); }}
                                  className="w-100 h-100 top-0 start-0 bg-white rounded-3 d-flex flex-column align-items-center justify-content-between m-0 p-0" >
                                  {/* أزرار الأصناف */}
                                  <div className='d-flex align-items-center justify-content-center flex-wrap' style={{ width: '100%', height: 'auto' }}>
                                    {Array.from({ length: product.sizes.filter(size => size._id === item.sizeId)[0].sizeQuantity }).map((_, ind) => (
                                      <div key={ind} style={{ margin: '5px' }}>
                                        <button type="button" className='btn btn-info' onClick={() => setSelectedButtonIndex(ind + 1)}>
                                          {ind + 1}
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="form-group d-flex flex-wrap mt-1" style={{ width: '100%', height: '50%', padding: '0', margin: '0' }}>
                                    {Array.from({ length: product.sizes.filter(size => size._id === item.sizeId)[0].sizeQuantity }).map((_, ind) => (
                                      selectedButtonIndex === ind + 1 && (
                                        <div key={ind} className="form-group w-100 h-100 d-flex align-items-start justify-content-start flex-wrap" style={{ padding: '5px', overflowY: "auto" }}>
                                          {product.extras.map((extra, i) => (
                                            <div className="form-check form-check-flat mb-1 d-flex align-items-center" key={i} style={{ width: '47%', paddingLeft: '5px' }}>
                                              <input
                                                type="checkbox"
                                                className="form-check-input "
                                                value={extra._id}
                                                checked={
                                                  (productExtras && productExtras[ind] && productExtras[ind].extraDetails.some(detail => detail.extraId === extra._id)) ||
                                                  (product.sizes.filter(size => size._id === item.sizeId)[0].extrasSelected &&
                                                    product.sizes.filter(size => size._id === item.sizeId)[0].extrasSelected[ind] &&
                                                    product.sizes.filter(size => size._id === item.sizeId)[0].extrasSelected[ind].extraDetails.some(detail => detail.extraId === extra._id))
                                                }

                                                onChange={(e) => handleAddProductExtras(extra, ind)}
                                              />
                                              <label className="form-check-label mr-4" style={{ fontSize: '14px', fontWeight: '900' }} onClick={(e) => handleAddProductExtras(extra, ind)}>{`${extra.name} - ${extra.price} ج`} </label>
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    ))}
                                  </div>
                                  <div className="note-btn d-flex align-items-center justify-content-center w-100 mt-2" style={{ height: '40px' }}>
                                    <button className="btn btn-success rounded-2 me-2" style={{ width: '50%' }}>تأكيد</button>
                                    <button type="button" onClick={() => setextraArea(!extraArea)} className="btn btn-danger rounded-2" style={{ width: '50%' }}>إلغاء</button>
                                  </div>
                                </form>
                              </div>
                              )
                              : product && product._id && product._id === item.productid && extraArea === true && product.quantity > 0 ?
                                (<div className="position-absolute w-100 h-auto top-0 start-0 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
                                  style={{ zIndex: 10 }}>
                                  <form onSubmit={(e) => { if (product.extras.length > 0) { addExtrasToProduct(e, product._id, sizeId); }; setSelectedButtonIndex(1); setextraArea(!extraArea); }}
                                    className="w-100 h-100 top-0 start-0 bg-white rounded-3 d-flex flex-column align-items-center justify-content-between m-0 p-0" >
                                    {/* أزرار الأصناف */}
                                    <div className='d-flex align-items-center justify-content-center flex-wrap' style={{ width: '100%', height: 'auto' }}>
                                      {Array.from({ length: product.quantity }).map((_, ind) => (
                                        <div key={ind} style={{ margin: '5px' }}>
                                          <button type="button" className='btn btn-info' onClick={() => setSelectedButtonIndex(ind + 1)}>
                                            {ind + 1}
                                          </button>
                                        </div>
                                      ))}
                                    </div>


                                    <div className="form-group d-flex flex-wrap mt-1" style={{ width: '100%', height: '50%', padding: '0', margin: '0' }}>
                                      {Array.from({ length: product.quantity }).map((_, ind) => (
                                        selectedButtonIndex === ind + 1 && (
                                          <div key={ind} className="form-group w-100 h-100 d-flex align-items-start justify-content-start flex-wrap" style={{ padding: '5px', overflowY: "scroll" }}>
                                            {product.extras && product.extras.map((extra, i) => (
                                              <div className="form-check form-check-flat mb-1 d-flex align-items-center" key={i} style={{ width: '47%', height: '20px', paddingLeft: '5px' }}>
                                                {console.log({ productExtras })}
                                                <input
                                                  type="checkbox"
                                                  className="form-check-input "
                                                  value={extra._id}
                                                  defaultChecked={
                                                    (productExtras && productExtras[ind] && productExtras[ind].extraDetails.some(detail => detail.extraId === extra._id)) ||
                                                    (product.extrasSelected &&
                                                      product.extrasSelected[ind] &&
                                                      product.extrasSelected[ind].extraDetails.some(detail => detail.extraId === extra._id))
                                                  }
                                                  onChange={(e) => handleAddProductExtras(extra, ind)}
                                                />
                                                <label className="form-check-label mr-4" style={{ fontSize: '14px', fontWeight: '900' }} onClick={(e) => handleAddProductExtras(extra, ind)}>{`${extra.name} - ${extra.price} ج`} </label>
                                              </div>
                                            ))}
                                          </div>
                                        )
                                      ))}
                                    </div>
                                    <div className="note-btn d-flex align-items-center justify-content-center w-100 mt-2" style={{ height: '40px' }}>
                                      <button className="btn btn-success rounded-2 me-2" style={{ width: '50%' }}>تأكيد</button>
                                      <button type="button" onClick={() => setextraArea(!extraArea)} className="btn btn-danger rounded-2" style={{ width: '50%' }}>إلغاء</button>
                                    </div>
                                  </form>
                                </div>
                                )
                                // : <div className='position-absolute w-100 h-100 top-0 start-0 p-2 bg-white rounded-3 d-flex flex-column align-items-center justify-content-between overflow-hidden'
                                //   style={{ zIndex: 10 }}>
                                //   <p className='d-flex align-items-center justify-content-center w-100 h-75' style={{ fontSize: '18px', fontWeight: '900', textAlign: "center" }}>اختر اولا  الكمية</p>
                                //   <div className="note-btn d-flex align-items-center justify-content-center w-100 mt-2" style={{ height: '40px', button: '0' }}>
                                //     <button type="button" onClick={() => setextraArea(!extraArea)} className="btn btn-danger rounded-2" style={{ width: '100%' }}>اغلاق</button>
                                //   </div>
                                // </div>
                                : ''}





                            {item.productid === productid && noteArea ? (
                              <form className="card-body" style={{ padding: '5px', margin: '0' }} onSubmit={(e) => { addNoteToProduct(e, item.productid); setnoteArea(!noteArea) }}>
                                <textarea className="form-control mb-2" defaultValue={item.notes} placeholder='اضف تعليماتك الخاصة بهذا الطبق' name='note' rows='3' onChange={(e) => { setproductNote(e.target.value); }}></textarea>
                                <div className="d-flex justify-content-center">
                                  <button type="submit" className="btn btn-47 btn-primary me-2" style={{ height: '35px' }}>تاكيد</button>
                                  <button type="button" onClick={() => setnoteArea(!noteArea)} className="btn btn-47 btn-secondary" style={{ height: '35px' }}>اغلاق</button>
                                </div>
                              </form>
                            )
                              : (
                                <div className="card-body" style={{ padding: '5px', margin: '0' }}>
                                  <div className="d-flex justify-content-between align-items-center py-2">
                                    <div className="fw-bold" style={{ width: '50%' }}>{item.name}{item.size ? `- ${item.size}` : ''}</div>
                                    <span onClick={() => { setnoteArea(!noteArea); setproductid(item.productid); }} className='material-symbols-outlined' style={{ width: '30%', fontSize: '40px', cursor: 'pointer', color: 'rgb(0, 238, 255)' }}>note_alt</span>

                                    {item.hasExtras &&
                                      <span className="material-icons" style={{ color: "green", fontSize: "45px", cursor: 'pointer' }}
                                        onClick={() => { setproductExtras(item.extras); setextraArea(!extraArea); getProductDitalis(allProducts, item.productid); item.sizeId ? setsizeId(item.sizeId) : setproductid(item.productid) }}>add_circle</span>
                                    }

                                    <button onClick={() => deleteItemFromCart(item.productid)} className="btn btn-47 btn-danger">حذف</button>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center py-2">
                                    <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price} ج</div>
                                    <div className="d-flex justify-content-between" style={{ width: '50%' }}>
                                      <button onClick={() => decrementProductQuantity(item.productid, item.sizeId)} className="btn btn-47 btn-light">-</button>
                                      <span>{item.quantity > 0 ? item.quantity : 0}</span>
                                      <button onClick={() => incrementProductQuantity(item.productid, item.sizeId)} className="btn btn-47 btn-light">+</button>
                                    </div>
                                    <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{item.priceAfterDiscount ? item.priceAfterDiscount * item.quantity : item.price * item.quantity} ج</div>
                                  </div>

                                  {item.extras && (
                                    <div className="d-flex flex-columen flex-wrap mt-2">
                                      {item.extras.map((extra, i) => (
                                        extra && extra.extraDetails && <div key={i} className="d-flex w-100 flex-wrap m-0 mb-1 p-0" style={{ borderBottom: '1px solid black' }}>
                                          <div className='d-flex col-10 align-items-center justify-content-start flex-wrap p-0 m-0'>
                                            {extra.extraDetails && extra.extraDetails.map((detail) => {

                                              return (
                                                <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name} ${detail.price} ج`}</p>
                                              );
                                            })}
                                          </div>
                                          <p className="d-flex col-2 align-items-center justify-content-center badge badge-info">{extra.totalExtrasPrice} ج</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {item.notes && <div className="card-text mt-2 text-muted">{item.notes}</div>}
                                </div>
                              )}
                          </div>
                        ))
                          :
                          productOrderToUpdate.length > 0 ? productOrderToUpdate.map((item, index) => (
                            <div className="card mb-3" key={index}>
                              {item.productid === productid && noteArea ? (
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
                                    <div className="fw-bold" style={{ width: '50%' }}>{item.name}</div>

                                    <span onClick={() => { setnoteArea(!noteArea); setproductid(item.productid); }} className='material-symbols-outlined' style={{ width: '30%', fontSize: '40px', cursor: 'pointer', color: 'rgb(0, 238, 255)' }}>note_alt</span>

                                    <button onClick={() => deleteItemFromCart(item.productid)} className="btn btn-47 btn-danger">حذف</button>
                                  </div>

                                  <div className="d-flex justify-content-between align-items-center py-2">
                                    <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{item.priceAfterDiscount > 0 ? item.priceAfterDiscount : item.price} ج</div>
                                    <div className="d-flex justify-content-between" style={{ width: '50%' }}>
                                      <button onClick={() => decrementProductQuantity(item.productid)} className="btn btn-47 btn-light">-</button>
                                      <span>{item.quantity > 0 ? item.quantity : 0}</span>
                                      <button onClick={() => incrementProductQuantity(item.productid)} className="btn btn-47 btn-light">+</button>
                                    </div>
                                    <div className="fw-bold" style={{ width: '25%', textAlign: 'center' }}>{item.priceAfterDiscount > 0 ? item.priceAfterDiscount * item.quantity : item.price * item.quantity} ج</div>
                                  </div>
                                  {item.notes && (
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(29, 29, 255)' }}>
                                      {item.notes}
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
                      <div className="col p-0 m-0">
                        <div className="order-details bg-white border p-0 m-0" >
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


                    <div className="row w-100 p-0 m-0">
                      <div className="col-12 p-0 m-0">
                        <div className="btn btn-group btn btn-block p-0 m-0">
                          <button type="button" className="btn btn-47 btn-secondary" onClick={() => setaddaddition(!addaddition)}>رسوم</button>
                          <button type="button" className="btn btn-47 btn-secondary" onClick={() => setadddiscount(!adddiscount)}>خصم</button>
                          <button type="button" className="btn btn-47 btn-danger" onClick={() => { setitemsInCart([]); deleteOrderdetalis() }}>إلغاء الطلب</button>
                        </div>
                      </div>
                      <div className="col-12 p-0 m-0">
                        <div className="btn btn-group btn btn-block p-0 m-0">
                          {productOrderToUpdate.length > 0 ?
                            <button type="button" className="btn btn-47 btn-secondary" onClick={() => updateOrder()}>تاكيد التعديل</button>
                            : <a type="button" className="btn btn-47 btn-secondary" href="#getOrderDetalisModal" data-toggle="modal">تعديل</a>
                          }
                          <a type="button" className="btn btn-47 btn-warning" href="#getOrderTableModal" data-toggle="modal">دفع جزء</a>
                        </div>
                      </div>
                      <div className="col-12 p-0 m-0">
                        <div className="btn btn-group btn btn-block p-0 m-0">
                          {ordertype === 'Internal' ?
                            <button type="button" className="btn btn-47 btn-primary" onClick={() => { createWaiterOrderForTable(tableID, employeeLoginInfo.employeeinfo.id, addaddition, discount); setaddaddition(false); setadddiscount(false) }}>تأكيد</button>

                            : ordertype === 'Delivery' ?
                              <button type="button" className="btn btn-47 btn-primary" onClick={() => { createcashierOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype, deliverycost, discount, addition); setaddaddition(false); setadddiscount(false) }}>تأكيد</button>

                              : ordertype === 'Takeaway' ?
                                <button type="button" className="btn btn-47 btn-primary" onClick={() => { createcashierOrder(employeeLoginInfo.employeeinfo.id, clientname, clientphone, clientaddress, ordertype, discount, addition); setaddaddition(false); setadddiscount(false) }}>تأكيد</button>

                                : <button type="button" className="btn btn-47 btn-primary" onClick={() => alert('اختر نوع الاوردر و اكتب جميع البيانات')}>تأكيد</button>
                          }
                          <a type="button" className="btn btn-47 btn-success" href="#invoiceModal" data-toggle="modal" onClick={() => { lastInvoiceByCashier(employeeLoginInfo.employeeinfo.id); setinvoiceModal(!invoiceModal) }}>طباعة</a>

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