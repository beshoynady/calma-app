import React, { useState, useEffect, useRef } from 'react'
import './ManagerDash.css'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import axios from 'axios'
// import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactToPrint } from 'react-to-print';



const ManagerDash = () => {

  // useEffect(() => {
  //   const socket = io('https://calma-api-puce.vercel.app', { withCredentials: true });

  //   socket.on('newOrderNotification', (data) => {
  //     console.log('New order received:', data);
  //     toast.success('New order received');
  //     // Do something with the received order data
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);


  const [pending_order, setpending_order] = useState([]);
  const [pending_payment, setpending_payment] = useState([]);
  const [allOrders, setallOrders] = useState([]);
  const [list_day_order, setlist_day_order] = useState([]);
  const [total_day_salse, settotal_day_salse] = useState(0);

  const fetchOrdersData = async () => {
    try {
      const res = await axios.get('https://calma-api-puce.vercel.app/api/order');
      const orders = res.data;
      setallOrders(orders);

      const pendingOrders = orders.filter((order) => order.status === 'Pending');
      setpending_order(pendingOrders);

      const pendingPayments = orders.filter((order) => order.payment_status === 'Pending');
      setpending_payment(pendingPayments.reverse());

      const today = new Date().toDateString();
      const dayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today);
      setlist_day_order(dayOrders);

      const paidDayOrders = dayOrders.filter((order) => order.payment_status === 'Paid');
      if (paidDayOrders.length > 0) {
        const totalDaySales = paidDayOrders.reduce((total, order) => total + order.total, 0);
        settotal_day_salse(totalDaySales);
      } else {
        settotal_day_salse(0);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const status = ['Pending', 'Approved', 'Cancelled']
  const [update, setupdate] = useState(false)

  const changeorderstauts = async (e, id) => {
    try {
      const status = e.target.value;
      await axios.put(`https://calma-api-puce.vercel.app/api/order/${id}`, { status });

      toast.success('تم تغيير حالة الطلب بنجاح');

      setupdate(!update);
    } catch (error) {
      console.error('خطأ في تغيير حالة الطلب:', error);
      toast.error('حدث خطأ أثناء تغيير حالة الطلب');
    }
  };

  const paymentstatus = ['Pending', 'Paid']
  const changePaymentorderstauts = async (e, id, casher) => {
    try {
      const payment_status = e.target.value;
      const isActive = payment_status === 'Paid' ? false : true;

      // استخدام await لضمان انتهاء الطلب قبل الانتقال إلى الخطوة التالية
      await axios.put(`https://calma-api-puce.vercel.app/api/order/${id}`, {
        payment_status,
        isActive,
        casher,
      });

      // إعادة جلب البيانات بعد تغيير حالة الطلب
      fetchOrdersData();

      // عرض رسالة نجاح
      toast.success('تم تغيير حالة الدفع بنجاح');

      // تحديث الحالة لإعادة تحميل البيانات
      setupdate(!update);
    } catch (error) {
      // معالجة الخطأ وعرض رسالة خطأ
      console.error('خطأ في تغيير حالة الدفع:', error);
      toast.error('حدث خطأ أثناء تغيير حالة الدفع');
    }
  };

  const [waiters, setWaiters] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);

  const fetchActiveEmployees = async () => {
    try {
      const response = await axios.get('https://calma-api-puce.vercel.app/api/employee');
      const activeEmployees = response.data.filter((employee) => employee.isActive === true);

      const waiters = activeEmployees.filter((employee) => employee.role === 'waiter');
      const waiterIds = waiters.map((waiter) => waiter._id);
      if (waiterIds.length > 0) {
        console.log(waiterIds);
        setWaiters(waiterIds);
      } else {
        // إذا لم يتم العثور على نوادل، قد يكون من الجيد إخطار المستخدم
        toast.warning('لم يتم العثور على نوادل.');
      }

      const deliverymen = activeEmployees.filter((employee) => employee.role === 'deliveryman');
      const deliverymenIds = deliverymen.map((deliveryman) => deliveryman._id);
      if (deliverymenIds.length > 0) {
        console.log(deliverymenIds);
        setDeliverymen(deliverymenIds);
      } else {
        // إذا لم يتم العثور على مندوبي توصيل، قد يكون من الجيد إخطار المستخدم
        toast.warning('لم يتم العثور على مندوبي توصيل.');
      }
    } catch (error) {
      // معالجة الخطأ وعرض رسالة خطأ
      console.error('خطأ في جلب بيانات الموظفين:', error);
      toast.error('حدث خطأ أثناء جلب بيانات الموظفين.');
    }
  };

  // const [waiter, setwaiter] = useState()
  const specifiedWaiter = () => {
    const ordertakewaiter = allOrders.filter((order) => order.waiter != null)
    console.log(ordertakewaiter)
    const lastwaiter = ordertakewaiter.length > 0 ? ordertakewaiter[ordertakewaiter.length - 1].waiter : ''
    console.log(lastwaiter)

    const indexoflastwaiter = lastwaiter != '' ? waiters.indexOf(lastwaiter) : 0

    if (waiters.length == indexoflastwaiter + 1) {
      const waiter = waiters[0]
      return waiter
    } else {
      const waiter = waiters[indexoflastwaiter + 1]
      return waiter
    }
  }



  const sendWaiter = async (id) => {
    const helpStatus = 'Send waiter';
    const waiter = specifiedWaiter();
    try {
      const order = await axios.put('https://calma-api-puce.vercel.app/api/order/' + id, {
        waiter,
        helpStatus,
      });
      setupdate(!update);
      console.log(order.data);
    } catch (error) {
      console.log(error);
    }
  };

  const putdeliveryman = async (e, orderid) => {
    try {
      const deliveryMan = await e.target.value
      const order = await axios.put('https://calma-api-puce.vercel.app/api/order/' + orderid, {
        deliveryMan
      });
      setupdate(!update);
      console.log(order.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [cashRegister, setcashRegister] = useState('');
  const [cashRegistername, setcashRegistername] = useState('');
  const [balance, setbalance] = useState();
  const [createBy, setcreateBy] = useState('');

  const [AllCashRegisters, setAllCashRegisters] = useState([]);

  const handleCashRegister = async (id) => {
    try {
      const response = await axios.get('https://calma-api-puce.vercel.app/api/cashregister');
      setAllCashRegisters(response.data.reverse());
      const data = response.data;
      const CashRegister = data ? data.find((cash) => cash.employee === id) : {};
      if (CashRegister) {
        setcashRegister(CashRegister._id);
        setcashRegistername(CashRegister.name);
        setbalance(CashRegister.balance);
        setcreateBy(id);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const RevenueRecording = async (id, amount, description) => {
    handleCashRegister(id);
    try {
      if (cashRegister) {
        const updatedBalance = balance + amount;
        const cashMovement = await axios.post('https://calma-api-puce.vercel.app/api/cashMovement/', {
          registerId: cashRegister,
          createBy,
          amount,
          type: 'Revenue',
          description,
        });
        const updatecashRegister = await axios.put(`https://calma-api-puce.vercel.app/api/cashregister/${cashRegister}`, {
          balance: updatedBalance,
        });
        if (updatecashRegister) {
          setbalance(updatedBalance);
          fetchOrdersData()
          toast.success('Expense created successfully');
          setupdate(!update);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create expense');
    }
  };


  const [employeeLoginInfo, setemployeeLoginInfo] = useState(null)
  const getUserInfoFromToken = () => {
    const employeetoken = localStorage.getItem('token_e');
    if (employeetoken) {
      const decodedToken = jwt_decode(employeetoken);
      setemployeeLoginInfo(decodedToken.employeeinfo);
      handleCashRegister(decodedToken.employeeinfo.id);
    } else {
      setemployeeLoginInfo(null);
    }
  };

  const [list_products_order, setlist_products_order] = useState([])
  const [serial, setserial] = useState('')
  const [ordertype, setordertype] = useState('')
  const [name, setname] = useState('')
  const [address, setaddress] = useState('')
  const [phone, setphone] = useState('')
  const [ordertax, setordertax] = useState()
  const [ordertotal, setordertotal] = useState()
  const [ordersubtotal, setordersubtotal] = useState()
  const [orderdeliveryCost, setorderdeliveryCost] = useState()
  const [deliveryMan, setdeliveryMan] = useState()
  const [ordernum, setordernum] = useState()
  const [table, settable] = useState()
  const [casher, setcasher] = useState()
  const [discount, setdiscount] = useState(0)
  const [addition, setaddition] = useState(0)

  const [ivocedate, setivocedate] = useState(new Date())

  // Fetch orders from API
  const getOrderDetalis = async (serial) => {
    try {
      const res = await axios.get('https://calma-api-puce.vercel.app/api/order');
      const order = res.data.find(o => o.serial == serial)
      setlist_products_order(order.products)
      setordertotal(order.total)
      setordersubtotal(order.subTotal)
      setordertax(order.tax)
      setorderdeliveryCost(order.deliveryCost)
      setserial(order.serial)
      setaddition(order.addition)
      setdiscount(order.discount)
      // setivocedate(order.createdAt)
      setcasher(order.casher)
      settable(order.order_type == 'Internal' ? order.table : '')
      setordernum(order.order_type == 'Takeaway' ? order.ordernum : '')
      setordertype(order.order_type)
      setaddress(order.order_type == 'Delivery' ? order.address : "")
      setdeliveryMan(order.order_type == 'Delivery' ? order.deliveryMan : "")
      if (order.order_type != 'Internal') {
        setname(order.name)
        setphone(order.phone)
      }

    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };


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

  // State for filtered orders
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Filter orders by serial number
  const searchBySerial = (serial) => {
    const orders = pending_payment.filter((order) => order.serial.toString().startsWith(serial));
    setFilteredOrders(orders);
  };

  // Filter orders by order type
  const getOrdersByType = (type) => {
    const orders = pending_payment.filter((order) => order.order_type === type);
    setFilteredOrders(orders);
  };


  useEffect(() => {
    fetchOrdersData()
    fetchActiveEmployees();
    getUserInfoFromToken();
  }, [update]);


  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <section className='dashboard'>
              <ToastContainer />
              <div className='container'>
                <div className="header">
                  <a href={`http://${window.location.hostname}`} className="website">
                    <i className='bx bx-cloud-download'></i>
                    <span>الموقع</span>
                  </a>
                  <div className="titel-dashbord">
                    <h1>الصفحة الرئيسيه</h1>
                  </div>
                </div>

                <ul className="insights">
                  <li>
                    <span className="info">
                      <p>اوردرات اليوم</p>
                      <h3>
                        {list_day_order ? list_day_order.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-calendar-check'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>في الانتظار</p>
                      <h3>
                        {pending_order ? pending_order.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-show-alt'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p> انتظار الدفع</p>
                      <h3>
                        {pending_payment ? pending_payment.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-line-chart'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>ايراد اليوم</p>
                      <h3>
                        {total_day_salse ? Math.round(total_day_salse / 10) * 10 : 0}
                      </h3>
                    </span>
                    <i className='bx bx-dollar-circle'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>رصيد الخزينه </p>
                      <h3>
                        {balance ? Math.round(balance / 10) * 10 : 0}
                      </h3>
                    </span>
                    <i class="fa-solid fa-box-dollar"></i>
                  </li>
                </ul>

                <div className="bottom-data">
                  <div className="reminders">
                    <div className="header">
                      {/* <i className='bx bx-note'></i> */}
                      <h3>متابعه الطاولة</h3>
                      <i className='bx bx-filter'></i>
                    </div>
                    <ul className="task-list">
                      {pending_payment.filter((order) => order.payment_status == 'Pending' && order.order_type == 'Internal' && order.isActive == false || order.help !== 'Not requested').map((order, i) => {
                        return (
                          <li className="completed" key={i}>
                            <div className="task-title">
                              <p><i className='bx bx-check-circle'></i> {usertitle(order.table)}</p>
                              <p>{order.help == 'Requests assistance' ? 'يحتاج المساعدة' : order.help == 'Requests bill' ? 'يحتاج الفاتورة' : ''}</p>
                              {order.helpStatus == 'Not send' ? <button type="button" className="btn btn-primary" onClick={() => sendWaiter(order._id)}>ارسال ويتر</button> :
                                <p>تم ارسال {usertitle(order.waiter)}</p>}
                            </div>
                            <i className='bx bx-dots-vertical-rounded'></i>
                          </li>
                        )

                      })}

                    </ul>
                  </div>

                  <div className="orders">
                    <div className="header">
                      <h3>الاوردرات الحالية</h3>
                    </div>
                    <div className="row text-dark">
                      <div className="col-md-3">
                        <div className="show-entries">
                          <span>عرض</span>
                          <select
                            className="form-control"
                            onChange={(e) => {
                              setstartpagination(0);
                              setendpagination(e.target.value);
                            }}
                          >
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
                      <div className="col-md-4">
                        <div className="filter-group">
                          <label>رقم الفاتورة</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              onChange={(e) => searchBySerial(e.target.value)}
                            />
                            <div className="input-group-append">
                              <button type="button" className="btn btn-primary">
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="filter-group">
                          <label>نوع الاوردر</label>
                          <select
                            className="form-control"
                            onChange={(e) => getOrdersByType(e.target.value)}
                          >
                            <option value={''}>الكل</option>
                            <option value="Internal">Internal</option>
                            <option value="Delivery">Delivery</option>
                            <option value="Takeaway">Takeaway</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th>م.</th>
                          <th>رقم الفاتورة</th>
                          <th>العميل</th>
                          <th>الاجمالي</th>
                          <th>حالة الاوردر</th>
                          <th>الويتر</th>
                          <th>الديلفري</th>
                          <th>مكان الاوردر</th>
                          <th>حاله الدفع</th>

                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length > 0 ? filteredOrders.map((recent, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>
                                  <a href="#invoiceOrderModal" data-toggle="modal" onClick={() => getOrderDetalis(recent.serial)}>
                                    {recent.serial}
                                  </a>
                                </td>
                                <td>{recent.order_type == 'Internal' ? usertitle(recent.table) : recent.order_type == 'Delivery' ? usertitle(recent.user) : recent.ordernum}</td>
                                <td>{recent.total}</td>
                                <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changeorderstauts(e, recent._id) }}>
                                    <option value={recent.status}>{recent.status}</option>
                                    {status.map((state, i) => {
                                      return (
                                        <option value={state} key={i}>{state}</option>
                                      )
                                    })
                                    }
                                  </select>
                                </td>
                                <td>{recent.waiter ? usertitle(recent.waiter) : ''}</td>
                                <td>
                                  {recent.order_type == 'Delivery' ?
                                    <select name="status" id="status" form="carform" onChange={(e) => { putdeliveryman(e, recent._id) }}>
                                      <option value={recent.deliveryMan}>{recent.deliveryMan ? usertitle(recent.deliveryMan) : "لم يحدد"}</option>
                                      {deliverymen.map((man, i) => {
                                        return (
                                          <option value={man} key={i}>{usertitle(man)}</option>
                                        )
                                      })
                                      }
                                    </select>
                                    : ''}
                                </td>
                                <td>{recent.order_type}</td>
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => { changePaymentorderstauts({ target: { value: 'Paid' } }, recent._id, employeeLoginInfo.employeeinfo.id); RevenueRecording(employeeLoginInfo.id, recent.total, `${recent.serial} ${recent.table != null ? usertitle(recent.table) : usertitle(recent.user)}`) }}
                                  >
                                    دفع
                                  </button>
                                </td>
                                {/* <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changePaymentorderstauts(e, recent._id) }}>
                                    {paymentstatus.map((state, i) => {
                                      return <option value={state} key={i}>{state}</option>
                                    })
                                    }
                                  </select>
                                </td> */}
                              </tr>
                            )
                          }
                        })
                          : pending_payment.length > 0 ? pending_payment.map((recent, i) => {
                            if (i >= startpagination & i < endpagination) {
                              return (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>
                                    <a href="#invoiceOrderModal" data-toggle="modal" onClick={() => getOrderDetalis(recent.serial)}>
                                      {recent.serial}
                                    </a>
                                  </td>
                                  <td>{recent.order_type == 'Internal' ? usertitle(recent.table) : recent.order_type == 'Delivery' ? usertitle(recent.user) : recent.ordernum}</td>
                                  <td>{recent.total}</td>
                                  <td>
                                    <select name="status" id="status" form="carform" onChange={(e) => { changeorderstauts(e, recent._id) }}>
                                      <option value={recent.status}>{recent.status}</option>
                                      {status.map((state, i) => {
                                        return (
                                          <option value={state} key={i}>{state}</option>
                                        )
                                      })
                                      }
                                    </select>
                                  </td>
                                  <td>{recent.waiter ? usertitle(recent.waiter) : ''}</td>
                                  <td>
                                    {recent.order_type == 'Delivery' ?
                                      <select name="status" id="status" form="carform" onChange={(e) => { putdeliveryman(e, recent._id) }}>
                                        <option value={recent.deliveryMan}>{recent.deliveryMan ? usertitle(recent.deliveryMan) : "لم يحدد"}</option>
                                        {deliverymen.map((man, i) => {
                                          return (
                                            <option value={man} key={i}>{usertitle(man)}</option>
                                          )
                                        })
                                        }
                                      </select>
                                      : ''}
                                  </td>
                                  <td>{recent.order_type}</td>
                                  <td>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => { changePaymentorderstauts({ target: { value: 'Paid' } }, recent._id, employeeLoginInfo.employeeinfo.id); RevenueRecording(employeeLoginInfo.id, recent.total, `${recent.serial} ${recent.table != null ? usertitle(recent.table) : usertitle(recent.user)}`) }}
                                    >
                                      دفع
                                    </button>
                                  </td>
                                  {/* <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changePaymentorderstauts(e, recent._id) }}>
                                    {paymentstatus.map((state, i) => {
                                      return <option value={state} key={i}>{state}</option>
                                    })
                                    }
                                  </select>
                                </td> */}
                                </tr>
                              )
                            }
                          })
                            : ''}
                      </tbody>
                    </table>
                    {filteredOrders.length > 0 ?
                      <div className="clearfix">
                        <div className="hint-text text-dark">عرض <b>{filteredOrders.length > startpagination ? startpagination : filteredOrders.length}</b> من <b>{filteredOrders.length}</b> عنصر</div>
                        <ul className="pagination">
                          <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                          <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                          <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                          <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">3</a></li>
                          <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                          <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                          <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                        </ul>
                      </div>
                      : pending_payment.length > 0 ?
                        <div className="clearfix">
                          <div className="hint-text text-dark">عرض <b>{pending_payment.length > startpagination ? startpagination : pending_payment.length}</b> من <b>{pending_payment.length}</b> عنصر</div>
                          <ul className="pagination">
                            <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                            <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                            <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                            <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">3</a></li>
                            <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                            <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                            <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                          </ul>
                        </div>
                        : ''}

                    <div id="invoiceOrderModal" className="modal fade">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <form>
                            <div className="modal-header">
                              <h4 className="modal-title"></h4>
                              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            </div>
                            <div ref={printContainer} className="max-w-400px p-1 mb-7 overflow-auto printpage" style={{ maxWidth: '400px', textAlign: 'center' }}>
                              {/* Invoice Header */}
                              <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                                <h2>Restaurant Name</h2>
                                <p>Casher {usertitle(casher)} | Invoice #{serial} | {ordertype === 'Internal' ? `Table ${usertitle(table)}` : ''} | Date: {formatDate(new Date())}</p>
                              </div>

                              {/* Customer Information */}
                              {ordertype == 'Delivery' ? <div className="customer-info text-dark" style={{ margin: '20px' }}>
                                <h4>Customer Details</h4>
                                <p>Name: {name}</p>
                                <p>Mobile: {phone}</p>
                                <p>Address: {address}</p>
                                <p>Delivery Man: {usertitle(deliveryMan)}</p>
                              </div> : ordertype == 'Takeaway' ?
                                <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                                  <h4>Customer Details</h4>
                                  <p>Name: {name}</p>
                                  <p>Mobile: {phone}</p>
                                  <p>order num: {ordernum}</p>
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
                                    <td>{ordersubtotal}</td>
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
                                      <td colSpan="3">رسوم اضافيه</td>
                                      <td>{discount}</td>
                                    </tr> : ''
                                  }
                                  <tr>
                                    <td colSpan="3">الاجمالي</td>
                                    <td>{ordertotal}</td>
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
                            <div className="modal-footer">
                              <input type="button" className="btn btn-danger" data-dismiss="modal" value="Cancel" />
                              <input type="submit" className="btn btn-success"  data-dismiss="modal" value="Print" onClick={handlePrint} />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>



                </div>
              </div>
            </section>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default ManagerDash