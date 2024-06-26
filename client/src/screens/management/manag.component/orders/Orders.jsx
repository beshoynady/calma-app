import './Orders.css'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App'
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';


const Orders = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const formatdate = (d) => {
    let date = new Date(d)
    let form_dt = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return form_dt;
  }

  const [listOfOrders, setlistOfOrders] = useState([])
  // Fetch orders from API
  const getOrders = async () => {
    try {
      const res = await axios.get(apiUrl + '/api/order', config);
      setlistOfOrders(res.data.reverse());
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };
  const [listProductsOrder, setlistProductsOrder] = useState([])
  const [orderData, setorderData] = useState('')
  const [ivocedate, setivocedate] = useState(new Date())

  // Fetch orders from API
  const getOrderDataBySerial = async (serial) => {
    try {
      const res = await axios.get(apiUrl + '/api/order', config);
      const order = res.data.find(order => order.serial == serial)
      if (order) {
        setorderData(order)
        setlistProductsOrder(order.products)
      }

    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };


  const printContainer = useRef()

  const Print = useReactToPrint({
    content: () => printContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });
  const handlePrint = (e) => {
    e.preventDefault()
    Print()
  }

  // State to manage order deletion
  const [orderId, setOrderId] = useState('');

  // Delete order
  const deleteOrder = async (e) => {
    e.preventDefault();
    try {
      const id = orderId;
      await axios.delete(`${apiUrl}/api/order/${id}`, config);
      getOrders();
      toast.success('Order deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete order');
    }
  };


  const [selectedIds, setSelectedIds] = useState([]);
  const handleCheckboxChange = (e) => {
    const Id = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedIds([...selectedIds, Id]);
    } else {
      const updatedSelectedIds = selectedIds.filter((id) => id !== Id);
      setSelectedIds(updatedSelectedIds);
    }
  };

  const deleteSelectedIds = async (e) => {
    e.preventDefault();
    console.log(selectedIds)
    try {
      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/order/${Id}`, config);
      }
      getOrders();
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };


  // Filter orders by serial number
  const searchBySerial = (serial) => {
    if (serial) {
      const orders = listOfOrders.filter((order) => order.serial.toString().startsWith(serial));
      setlistOfOrders(orders);
    } else {
      getOrders()
    }
  };

  // Filter orders by order type
  const getOrdersByType = (type) => {
    if (!type) {
      getOrders()
    } else {
      const orders = listOfOrders.filter((order) => order.orderType === type);
      setlistOfOrders(orders.reverse());
    }
  };



  // Fetch orders on component mount
  useEffect(() => {
    getOrders();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, usertitle, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination, getOrderDetailsBySerial, orderDetalisBySerial }) => {
          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row text-dark">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الاوردرات</b></h2>
                      </div>
                      {/* <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addOrderModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة اوردر جديد</span></a>
                        <a href="#deleteListOrderModal" className="btn w-50 btn-danger" data-toggle="modal" ><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div> */}
                    </div>
                  </div>
                  <div class="table-filter print-hide">
                    <div class="row text-dark d-flex flex-wrap align-items-center justify-content-start">
                      <div class="col">
                        <div class="show-entries">
                          <span>عرض</span>
                          <select class="form-control col-8" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      <div class="col">
                        <div class="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">رقم الفاتورة</label>
                          <input type="text" class="form-control col-8" onChange={(e) => searchBySerial(e.target.value)} />
                         
                        </div>
                      </div>
                      <div class="col">
                        <div class="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">نوع الاوردر</label>
                          <select class="form-control col-8" onChange={(e) => getOrdersByType(e.target.value)} >
                            <option value={""}>الكل</option>
                            <option value="Internal" >Internal</option>
                            <option value="Delivery" >Delivery</option>
                            <option value="Takeaway" >Takeaway</option>
                          </select>
                        </div>
                        {/* <div class="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Status</label>
                  <select class="form-control col-8">
                    <option>Any</option>
                    <option>Delivered</option>
                    <option>Shipped</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <span class="filter-icon"><i class="fa fa-filter"></i></span> */}
                      </div>
                    </div>
                  </div>

                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        {/* <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th> */}
                        <th>م</th>
                        <th>رقم الفاتورة</th>
                        <th>رقم الاوردر</th>
                        <th>العميل</th>
                        <th>المكان</th>
                        <th>الاجمالي</th>
                        <th>حالة الطلب</th>
                        <th>الكاشير</th>
                        <th>حالة الدفع</th>
                        <th>تاريخ الدفع</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listOfOrders && listOfOrders.map((order, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                {/* <td>
                                  <span className="custom-checkbox">
                                  <input
                                      type="checkbox"
                                      id={`checkbox${i}`}
                                      name="options[]"
                                      value={order._id}
                                      onChange={handleCheckboxChange}
                                    />                                    
                                    <label htmlFor={`checkbox${i}`}></label>                                  </span>
                                </td> */}

                                <td>{i + 1}</td>
                                <td><a href="#invoiceOrderModal" data-toggle="modal" onClick={() => getOrderDataBySerial(order.serial)}>{order.serial} </a></td>

                                <td>{order.ordernum ? order.ordernum : '--'}</td>
                                <td>{order.table != null ? order.table.tableNumber
                                  : order.user ? order.user.username
                                    : order.createdBy ? order.createdBy.fullname : '--'}</td>

                                <td>{order.orderType}</td>
                                <td>{order.total}</td>
                                <td>{order.status}</td>
                                <td>{order.cashier && order.cashier.fullname}</td>
                                <td>{order.payment_status}</td>
                                <td>{new Date(order.payment_date).toLocaleString('en-GB', { hour12: true })}</td>

                                <td>
                                  {/* <a href="#editOrderModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a> */}
                                  <a href="#deleteOrderModal" className="delete" data-toggle="modal" onClick={() => setOrderId(order._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listOfOrders.length > endpagination ? endpagination : listOfOrders.length}</b> من <b>{listOfOrders.length}</b> عنصر</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item active"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                    </ul>
                  </div>
                </div>
              </div>




              <div id="invoiceOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title"></h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div ref={printContainer} style={{ maxWidth: '400px', padding: '5px' }}>
                        {/* Invoice Header */}
                        <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                          <h2>{restaurantData.name}</h2>
                          <p>
                            كاشير {orderData.cashier?.fullname} | فاتورة #{orderData.serial} |
                            {orderData.orderType === 'Internal' && `طاولة ${orderData.table?.tableNumber}`} |
                            التاريخ: {formatdate(new Date())}
                          </p>
                        </div>

                        {/* Customer Information */}
                        {orderData.orderType == 'Delivery' ? <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                          <h4>بيانات العميل</h4>
                          <p>الاسم: {orderData.name && orderData.name}</p>
                          <p>الموبايل: {orderData.phone && orderData.phone}</p>
                          <p>العنوان: {orderData.ordernum && orderData.address}</p>
                          <p>Delivery Man: {orderData.deliveryMan && orderData.deliveryMan.fullname}</p>
                        </div>
                          : orderData.orderType == 'Takeaway' ?
                            <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                              <h4>بيانات العميل</h4>
                              <p>الاسم: {orderData.name && orderData.name}</p>
                              <p>الموبايل: {orderData.phone && orderData.phone}</p>
                              <p>رقم الاوردر: {orderData.ordernum && orderData.ordernum}</p>
                            </div>
                            : ''}

                        {/* Order Details Table */}
                        <table className="table table-bordered">
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col" style={{ width: '30%', fontSize: '20px' }}>الصنف</th>
                              <th scope="col" style={{ width: '20%', fontSize: '20px' }}>السعر</th>
                              <th scope="col" style={{ width: '20%', fontSize: '20px' }}>الكمية</th>
                              <th scope="col" style={{ width: '20%', fontSize: '20px' }}>الاجمالي</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Example rows, replace with dynamic data */}
                            {listProductsOrder && listProductsOrder.map((item, i) => (
                              <tr key={i}>
                                <td className="text-truncate" style={{ maxWidth: '200px', fontSize: '18px' }}>{item.name}</td>
                                <td className="text-nowrap" style={{ fontSize: '18px' }}>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                <td className="text-nowrap" style={{ fontSize: '18px' }}>{item.quantity}</td>
                                <td className="text-nowrap" style={{ fontSize: '18px' }}>{item.totalprice}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr style={{ fontSize: '20px' }}>
                              <td colSpan="3">المجموع</td>
                              <td>{orderData.subTotal}</td>
                            </tr>
                            {orderData.deliveryCost > 0 && (
                              <tr>
                                <td colSpan="3">خدمة التوصيل</td>
                                <td>{orderData.deliveryCost}</td>
                              </tr>
                            )}
                            {orderData.addition > 0 ?
                              <tr>
                                <td colSpan="3">رسوم اضافيه</td>
                                <td>{orderData.addition}</td>
                              </tr>
                              : ''
                            }
                            {orderData.discount > 0 ?
                              <tr>
                                <td colSpan="3">خصم</td>
                                <td>{orderData.discount}</td>
                              </tr> : ''
                            }
                            {/* <tr style={{ fontSize: '20px' }}>
                              <td colSpan="3">الضريبه</td>
                              <td>{Math.round(ordertax * 100) / 100}</td>
                            </tr> */}
                            <tr style={{ fontSize: '20px' }}>
                              <td colSpan="3">الاجمالي</td>
                              <td>{orderData.total}</td>
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
                        <input type="submit" className="btn w-50 btn-success" value="Print" onClick={handlePrint} />
                      </div>
                    </form>
                  </div>

                </div>
              </div>
              {/* <div id="addOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title"></h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Name</label>
                          <input type="text" className="form-control col-8" required />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Email</label>
                          <input type="email" className="form-control col-8" required />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Address</label>
                          <textarea className="form-control col-8" required></textarea>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Phone</label>
                          <input type="text" className="form-control col-8" required />
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn w-50 btn-success" value="Add" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
              {/* <div id="editOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">Edit Order</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Name</label>
                          <input type="text" className="form-control col-8" required />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Email</label>
                          <input type="email" className="form-control col-8" required />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Address</label>
                          <textarea className="form-control col-8" required></textarea>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">Phone</label>
                          <input type="text" className="form-control col-8" required />
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn w-50 btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
              <div id="deleteOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteOrder}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">Delete Order</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-toggle="modal" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn w-50 btn-danger" value="Delete" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* <div id="deleteListOrderModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteSelectedIds}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">Delete Order</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-toggle="modal" data-dismiss="modal" value="Cancel" />
                        <input type="submit" className="btn w-50 btn-danger" value="Delete" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Orders