import React, { useState, useEffect, useRef } from 'react'
import '../orders/Orders.css'
import './ManagerDash.css'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import axios from 'axios'
// import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';



const ManagerDash = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  // useEffect(() => {
  //   const socket = io(apiUrl+'', { withCredentials: true });

  //   socket.on('newOrderNotification', (data) => {
  //     console.log('New order received:', data);
  //     toast.success('New order received');
  //     // Do something with the received order data
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);


  // const [pendingOrder, setpendingOrder] = useState([]);
  // const [pendingPayment, setpendingPayment] = useState([]);
  // const [allOrders, setallOrders] = useState([]);
  // const [listDayOrder, setlistDayOrder] = useState([]);
  // const [totalDaySales, settotalDaySales] = useState(0);

  // const fetchOrdersData = async () => {
  //   try {
  //     if (!token) {
  //       // Handle case where token is not available
  //       throw new Error('الرجاء تسجيل الدخول ');
  //     }
  //     const res = await axios.get(apiUrl + '/api/order', config);
  //     const orders = res.data;
  //     setallOrders(orders);

  //     const pendingOrders = orders.filter((order) => order.status === 'Pending');
  //     setpendingOrder(pendingOrders);

  //     const pendingPayments = orders.filter((order) => order.payment_status === 'Pending' && order.status !== "Cancelled");
  //     setpendingPayment(pendingPayments.reverse());

  //     const today = new Date().toDateString();
  //     const dayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today);
  //     setlistDayOrder(dayOrders);

  //     const paidDayOrders = dayOrders.filter((order) => order.payment_status === 'Paid');
  //     if (paidDayOrders.length > 0) {
  //       const totalDaySales = paidDayOrders.reduce((total, order) => total + order.total, 0);
  //       settotalDaySales(totalDaySales);
  //     } else {
  //       settotalDaySales(0);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };



  // State initialization
  const [pendingOrder, setPendingOrder] = useState([]);
  const [pendingPayment, setPendingPayment] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [listDayOrder, setListDayOrder] = useState([]);
  const [totalDaySales, setTotalDaySales] = useState(0);

  // Helper function to get today's date as a string
  const getTodayDateString = () => {
    return new Date().toDateString();
  };

  const fetchOrdersData = async () => {
    try {
      // Check if token is available
      if (!token) {
        throw new Error('الرجاء تسجيل الدخول');
      }

      // Fetch orders from API
      const res = await axios.get(apiUrl + '/api/order', config);
      const orders = res.data;

      // Update all orders state
      setAllOrders(orders);

      // Filter pending orders
      const pendingOrders = orders.filter(order => order.status === 'Pending');
      setPendingOrder(pendingOrders);

      // Filter pending payments (excluding cancelled orders)
      const pendingPayments = orders.filter(order => order.payment_status === 'Pending' && order.status !== 'Cancelled');
      setPendingPayment(pendingPayments.reverse());

      // Filter today's orders
      const today = getTodayDateString();
      const dayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today);
      setListDayOrder(dayOrders);

      // Calculate total sales for paid orders of today
      const paidDayOrders = dayOrders.filter(order => order.payment_status === 'Paid');
      const totalDaySales = paidDayOrders.reduce((total, order) => total + order.total, 0);
      setTotalDaySales(totalDaySales);

    } catch (error) {
      // Handle and log error
      console.error('Error fetching orders data:', error.message);
    }
  };


  const status = ['Pending', 'Approved', 'Cancelled']
  const statusAR = ['انتظار', 'موافق', 'ملغي']
  const [update, setupdate] = useState(false)

  const changeorderstauts = async (e, orderId, cashier) => {
    try {
      const status = e.target.value;
      const isActive = status === 'Cancelled' ? false : true;

      await axios.put(`${apiUrl}/api/order/${orderId}`, { status, isActive, cashier });

      fetchOrdersData();

      toast.success('تم تغيير حالة الطلب بنجاح');

      setupdate(!update);
    } catch (error) {
      console.error('خطأ في تغيير حالة الطلب:', error);
      toast.error('حدث خطأ أثناء تغيير حالة الطلب');
    }
  };

  const paymentstatus = ['Pending', 'Paid']
  const changePaymentorderstauts = async (e, id, cashier) => {
    try {
      const payment_status = e.target.value;
      const isActive = payment_status === 'Paid' ? false : true;

      // استخدام await لضمان انتهاء الطلب قبل الانتقال إلى الخطوة التالية
      await axios.put(`${apiUrl}/api/order/${id}`, {
        payment_status,
        isActive,
        cashier,
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

  const [AllWaiters, setAllWaiters] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);

  const fetchActiveEmployees = async () => {
    try {
      const allEmployees = await axios.get(apiUrl + '/api/employee', config);
      const activeEmployees = allEmployees.data.filter((employee) => employee.isActive === true)
      const allWaiters = activeEmployees.length > 0 ? activeEmployees.filter((employee) => employee.role === 'waiter') : [];
      if (allWaiters) {
        setAllWaiters(allWaiters);
      } else {
        // إذا لم يتم العثور على نوادل، قد يكون من الجيد إخطار المستخدم
        toast.warning('لم يتم العثور على ويتر نشط الان.');
      }

      const alldeliverymens = activeEmployees.length > 0 ? activeEmployees.filter((employee) => employee.role === 'deliveryman') : [];
      if (alldeliverymens) {
        setDeliverymen(alldeliverymens);
      } else {
        // إذا لم يتم العثور على نوادل، قد يكون من الجيد إخطار المستخدم
        toast.warning('لم يتم العثور على مندوبي توصيل نشططين الان.');
      }

    } catch (error) {
      // معالجة الخطأ وعرض رسالة خطأ
      console.error('خطأ في جلب بيانات الموظفين:', error);
      toast.error('حدث خطأ أثناء جلب بيانات الموظفين.');
    }
  };


  const specifiedWaiter = async (id) => {
    try {
      // البحث عن الطلب بالمعرف المحدد
      const getorder = allOrders.find((order) => order._id == id);
      if (!getorder) {
        throw new Error('Order not found');
      }

      // استخراج رقم القسم من بيانات الطاولة المرتبطة بالطلب
      const tablesectionNumber = getorder.table && getorder.table.sectionNumber;
      if (!tablesectionNumber) {
        throw new Error('Table section number not found');
      }

      // البحث عن النوادل في القسم المحدد
      const sectionWaiters = AllWaiters.filter((waiter) => waiter.sectionNumber == tablesectionNumber);
      if (sectionWaiters.length === 0) {
        throw new Error('No waiters found in the specified section');
      }

      const OrderSection = allOrders.filter(order => order.waiter && order.waiter.sectionNumber === tablesectionNumber).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      let waiterId = '';

      if (OrderSection.length > 0) {
        const lastWaiterId = OrderSection[0]?.waiter?._id;
        const lastWaiterIndex = sectionWaiters.findIndex(waiter => waiter._id === lastWaiterId);
        console.log({ lastWaiterId, lastWaiterIndex });

        waiterId = (lastWaiterIndex !== -1 && lastWaiterIndex < sectionWaiters.length - 1)
          ? sectionWaiters[lastWaiterIndex + 1]._id
          : sectionWaiters[0]._id;
      } else {
        console.log('لا توجد طلبات سابقة لهذه الطاولة');
        waiterId = sectionWaiters[0]._id;
      }

      console.log({ waiterId });

      return waiterId;
    } catch (error) {
      console.error('Error fetching table or waiter data:', error);
      return ''; // التعامل مع حالة الخطأ هنا، وإرجاع سلسلة فارغة كقيمة افتراضية لمعرف النادل
    }
  };




  const sendWaiter = async (id) => {
    try {
      const helpStatus = 'Send waiter';
      const waiter = await specifiedWaiter(id);
      const order = await axios.put(apiUrl + '/api/order/' + id, {
        waiter,
        helpStatus,
      });
      setupdate(!update);
      console.log(order.data);
    } catch (error) {
      console.log(error);
    }
  };



  const putdeliveryman = async (id, orderid) => {
    try {
      const deliveryMan = id
      const order = await axios.put(apiUrl + '/api/order/' + orderid, {
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
  const [createdBy, setcreatedBy] = useState('');

  const [AllCashRegisters, setAllCashRegisters] = useState([]);

  const handleCashRegister = async (id) => {
    try {
      // جلب بيانات جميع السجلات النقدية
      const response = await axios.get(`${apiUrl}/api/cashregister`, config);
      if (response) {
        // تحديث حالة جميع السجلات النقدية بالبيانات الجديدة وعكس ترتيبها
        setAllCashRegisters(response.data.reverse());
        const data = response.data;

        // البحث عن السجل النقدي المرتبط بمعرّف الموظّف
        const CashRegister = data ? data.find((cash) => cash.employee === id) : {};

        if (CashRegister) {
          // تحديث حالة السجل النقدي المحدد
          setcashRegister(CashRegister._id);
          setcashRegistername(CashRegister.name);
          setbalance(CashRegister.balance);
          setcreatedBy(id);
        }
      }
    } catch (error) {
      // سجل الخطأ في وحدة التحكم للتصحيح
      console.log(error);
      return toast.error('لا يوجد لك حساب خزينه ليتم تسجيل بها الايراد ')
    }
  };



  const RevenueRecording = async (id, amount, description) => {
    // تأكد من معالجة السجل النقدي للمعرف المحدد
    handleCashRegister(id);

    try {
      if (cashRegister) {
        // احسب الرصيد المحدث
        const updatedBalance = balance + amount;

        // إنشاء سجل حركة نقدية
        const cashMovement = await axios.post(
          `${apiUrl}/api/cashMovement/`,
          {
            registerId: cashRegister,
            createdBy,
            amount,
            type: 'Revenue',
            description,
          },
          config
        );

        // تحديث رصيد السجل النقدي
        const updateCashRegister = await axios.put(
          `${apiUrl}/api/cashregister/${cashRegister}`,
          {
            balance: updatedBalance,
          },
          config
        );

        if (updateCashRegister) {
          // تحديث حالة الرصيد المحلية
          setbalance(updatedBalance);
          // جلب بيانات الطلبات المحدثة
          fetchOrdersData();
          // إخطار المستخدم بالنجاح
          toast.success('تم تسجيل الإيراد بنجاح');
          // تفعيل التحديث لإعادة تحميل المكونات إذا لزم الأمر
          setupdate(!update);
        }
      }
    } catch (error) {
      // سجل الخطأ في وحدة التحكم للتصحيح
      console.log(error);
      // إخطار المستخدم بالفشل
      toast.error('فشل في تسجيل الإيراد');
    }
  };



  // const [employeeLoginInfo, setemployeeLoginInfo] = useState(null)
  const getUserInfoFromToken = () => {
    const employeetoken = localStorage.getItem('token_e');
    if (employeetoken) {
      const decodedToken = jwt_decode(employeetoken);
      // setemployeeLoginInfo(decodedToken.employeeinfo);
      handleCashRegister(decodedToken.employeeinfo.id);
      // } else {
      //   setemployeeLoginInfo(null);
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
      const res = await axios.get(apiUrl + '/api/order', config);
      const order = res.data.find(o => o.serial == serial)
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
  const printContainerInvoiceSplit = useRef();
  const printContainerKitchen = useRef();

  const PrintInvoice = useReactToPrint({
    content: () => printContainerInvoice.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage',
    printerName: 'cashier'
  });

  const PrintInvoiceSplit = useReactToPrint({
    content: () => printContainerInvoiceSplit.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage',
    printerName: 'cashier'
  });

  const PrintKitchen = useReactToPrint({
    content: () => printContainerKitchen.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage',
    printerName: 'Kitchen'

  });


  const handlePrintInvoice = (e) => {
    e.preventDefault();
    PrintInvoice();
    setisPrint(true);
  };

  const handlePrintInvoiceSplit = (e) => {
    e.preventDefault();
    PrintInvoiceSplit();
    setisPrint(true);
  };

  const handlePrintKitchen = (e) => {
    e.preventDefault();
    PrintKitchen();
    setisPrint(true);
  };


  // Function to format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(date).toLocaleDateString('en-GB', options);
  };


  // Filter orders by serial number
  const searchBySerial = (serial) => {
    const orders = pendingPayment.filter((order) => order.serial.toString().startsWith(serial));
    setPendingPayment(orders);
  };

  // Filter orders by order type
  const getOrdersByType = (type) => {
    const orders = pendingPayment.filter((order) => order.orderdata.orderType === type);
    setPendingPayment(orders);
  };


  const [kitchenOrder, setkitchenOrder] = useState({})
  const [kitchenProducts, setkitchenProducts] = useState([])
  const [kitchenExtras, setkitchenExtras] = useState([])
  const getKitchenCard = (id) => {
    const neworder = pendingPayment.find((order) => order._id === id);
    setkitchenOrder(neworder);
    const orderproducts = neworder.products
    const newproducts = orderproducts.filter((product) => product.isDone === false)
    const newExreas = orderproducts.filter((extra) => extra.isDone === false)
    setkitchenExtras(newExreas)
    setkitchenProducts(newproducts)

  }

  const [isPrint, setisPrint] = useState(false)

  const aproveOrder = async (e, cashier) => {
    e.preventDefault()
    try {

      // Fetch order data by ID
      const order = await axios.get(`${apiUrl}/api/order/${kitchenOrder._id}`, config);
      const products = await order.data.products;
      const aproveorder = "Approved"

      // Loop through each product in the order
      // for (const product of products) {
      //   if (!product.isDone) {
      //     // Fetch kitchen consumption data
      //     // await getKitchenConsumption();
      //     const getKitchenConsumption = await axios.get(apiUrl+'/api/kitchenconsumption');
      //     const Allkitchenconsumption = await getKitchenConsumption.data.data
      //     const quantity = product.quantity;
      //     const productId = product.productid;
      //     const name = product.name;
      //     console.log({ productId, quantity, name });

      //     // Find product details
      //     const foundProduct = listofProducts.length>0?listofProducts.find((p) => p._id === productId):"";
      //     const recipe = foundProduct ? foundProduct.Recipe : [];

      //     // Calculate consumption for each ingredient in the recipe
      //     for (const rec of recipe) {
      //       const today = new Date().toISOString().split('T')[0]; // تاريخ اليوم بتنسيق YYYY-MM-DD
      //       const kitconsumptionToday = Allkitchenconsumption.filter((kitItem) => {
      //         const itemDate = new Date(kitItem.createdAt).toISOString().split('T')[0];
      //         return itemDate === today;
      //       });

      //       let kitconsumption = null;
      //       if (kitconsumptionToday.length > 0) {
      //         kitconsumption = kitconsumptionToday.find((kitItem) => kitItem.stockItemId === rec.itemId);
      //       }
      //       if (kitconsumption) {
      //         const productAmount = rec.amount * quantity;
      //         console.log({ productAmount });

      //         const consumptionQuantity = kitconsumption.consumptionQuantity + productAmount;
      //         console.log({ consumptionQuantity });

      //         const bookBalance = kitconsumption.quantityTransferredToKitchen - consumptionQuantity;

      //         let foundProducedProduct = kitconsumption.productsProduced.find((produced) => produced.productId === productId);

      //         if (!foundProducedProduct) {
      //           foundProducedProduct = { productId: productId, productionCount: quantity, productName: name };
      //           kitconsumption.productsProduced.push(foundProducedProduct);
      //         } else {
      //           foundProducedProduct.productionCount += quantity;
      //         }
      //         try {
      //           // Update kitchen consumption data
      //           const update = await axios.put(`${apiUrl}/api/kitchenconsumption/${kitconsumption._id}`, {
      //             consumptionQuantity,
      //             bookBalance,
      //             productsProduced: kitconsumption.productsProduced
      //           });
      //           console.log({ update: update });
      //         } catch (error) {
      //           console.log({ error: error });
      //         }
      //       } else {

      //       }
      //     }
      //   }
      // }

      // Update order status or perform other tasks
      const status = 'Prepared';
      const updateproducts = products.map((prod) => ({ ...prod, isDone: true }));
      const updateorder = await axios.put(`${apiUrl}/api/order/${kitchenOrder._id}`, { products: updateproducts, status: aproveorder, cashier }, config);
      if (updateorder.status === 200) {
        toast.success('تم ارسال الاوردر'); // Notifies success in completing order
        setkitchenOrder("")
        setisPrint(false)
        setkitchenProducts([])
      }
    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ اثناء ارسال الاوردر!');
    }
  };


  useEffect(() => {
    fetchOrdersData()
    fetchActiveEmployees();
    getUserInfoFromToken();
  }, [update]);


  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, employeeLoginInfo, usertitle, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <section className='dashboard ' style={{ scrollbarWidth: 'none' }}>
              <div className='container w-100 mw-100 p-2 m-0'>
                <div className="header">
                  <div className="titel-dashbord">
                    <h1>الصفحة الرئيسيه</h1>
                  </div>
                  <a href={`http://${window.location.hostname}`} className="website">
                    <i className='bx bx-cloud-download'></i>
                    <span>الموقع</span>
                  </a>
                </div>

                <ul className="insights">
                  <li>
                    <span className="info">
                      <p>اوردرات اليوم</p>
                      <h3>
                        {listDayOrder ? listDayOrder.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-calendar-check'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>في الانتظار</p>
                      <h3>
                        {pendingOrder ? pendingOrder.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-show-alt'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p> انتظار الدفع</p>
                      <h3>
                        {pendingPayment ? pendingPayment.length : 0}
                      </h3>
                    </span>
                    <i className='bx bx-line-chart'></i>
                  </li>
                  <li>
                    <span className="info">
                      <p>ايراد اليوم</p>
                      <h3>
                        {totalDaySales ? Math.round(totalDaySales / 10) * 10 : 0}
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

                  <div className="orders">
                    <div className="header">
                      <h3>الاوردرات الحالية</h3>
                    </div>
                    {/* <div className="container-fluid"> */}
                    <div className="table-filter print-hide" style={{ width: 'max-content' }}>
                      <div className="row d-flex flex-row flex-nowrap align-content-center justify-content-between align-items-center d-inline-block" style={{ width: 'max-content' }}>
                        <div className="col">
                          <div className="show-entries" style={{ width: '100%' }}>
                            <span>عرض</span>
                            <select className="form-select" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
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
                        <div className="col">
                          <div className="filter-group d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">رقم الفاتورة</label>
                            <input type="text" className="form-control" onChange={(e) => searchBySerial(e.target.value)} />
                            {/* <button type="button" className="btn w-50 btn-primary"><i className="fa fa-search"></i></button> */}
                          </div>
                        </div>
                        <div className="col">
                          <div className="filter-group d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">نوع الاوردر</label>
                            <select className="form-select" onChange={(e) => getOrdersByType(e.target.value)} >
                              <option value={""}>الكل</option>
                              <option value="Internal" >صاله</option>
                              <option value="Delivery" >ديليفري</option>
                              <option value="Takeaway" >تيك اوي</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </div> */}


                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>م</th>
                          <th>رقم الفاتورة</th>
                          <th>العميل</th>
                          <th>الاجمالي</th>
                          <th>دفع جزء</th>
                          <th>حالة الاوردر</th>
                          <th>الاوردر</th>
                          <th>الويتر</th>
                          <th>الديلفري</th>
                          <th>مكان الاوردر</th>
                          <th>حاله الدفع</th>
                        </tr>
                      </thead>
                      <tbody>

                        {
                          pendingPayment.length > 0 ? pendingPayment.map((recent, i) => {
                            if (i >= startpagination & i < endpagination) {
                              return (
                                <tr key={i} className={recent.status === "Pending" ? "bg-warning" : recent.status === "Approved" ? "bg-success" : recent.status === "Cancelled" ? "bg-danger" : "bg-secondary"}>
                                  <td>{i + 1}</td>
                                  <td>
                                    <a href="#invoiceOrderModal" data-toggle="modal" onClick={() => getOrderDetalis(recent.serial)}>
                                      {recent.serial}
                                    </a>
                                  </td>
                                  <td>{recent.orderType == 'Internal' ? `${recent.table.tableNumber}` : recent.orderType == 'Delivery' ? `${recent.user.username}` : `num ${recent.ordernum}`}</td>
                                  <td>{recent.total}</td>
                                  <td>
                                    {recent.status !== "Cancelled" ? (
                                      recent.isSplit && recent.subtotalSplitOrder < recent.total ? (
                                        <a href="#invoiceSplitModal" type="button" className="btn btn-primary" data-toggle="modal" onClick={() => getOrderDetalis(recent.serial)}>
                                          باقي
                                        </a>
                                      ) : (
                                        "كاملة"
                                      )
                                    ) : (
                                      "ملغاه"
                                    )}
                                  </td>
                                  <td>
                                    <select name="status" id="status" form="carform" onChange={(e) => { changeorderstauts(e, recent._id, employeeLoginInfo.employeeinfo.id) }}>
                                      <option value={recent.status}>{recent.status}</option>
                                      {status.map((state, i) => {
                                        return (
                                          <option value={state} key={i}>{state}</option>
                                        )
                                      })
                                      }
                                    </select>
                                  </td>
                                  <td onClick={() => getKitchenCard(recent._id)}>
                                    <a href='#kitchenorderModal' data-toggle="modal"
                                      className="btn btn-47 .bg-info"
                                    >
                                      جديد
                                    </a>
                                  </td>
                                  <td>{recent.waiter ? recent.waiter.username : ''}</td>
                                  <td>
                                    {recent.orderType === 'Delivery' && (
                                      <select
                                        name="status"
                                        id="status"
                                        form="carform"
                                        onChange={(e) => putdeliveryman(e.target.value, recent._id)}
                                      >
                                        <option value={recent.deliveryMan?._id}>
                                          {console.log({deliveryMan})}
                                          {recent.deliveryMan ? recent.deliveryMan.username : "لم يحدد"}
                                        </option>
                                        {deliverymen.map((man, i) => (
                                          <option value={man._id} key={i}>
                                            {man.username}
                                          </option>
                                        ))}
                                      </select>
                                    )}

                                  </td>
                                  <td>{recent.orderType}</td>
                                  <td>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => { changePaymentorderstauts({ target: { value: 'Paid' } }, recent._id, employeeLoginInfo.employeeinfo.id); RevenueRecording(employeeLoginInfo.id, recent.total, `${recent.serial} ${recent.table != null ? recent.table.tableNumber : recent.user.username}`) }}
                                    >
                                      دفع
                                    </button>
                                  </td>
                                </tr>
                              )
                            }
                          })
                            : ''}
                      </tbody>
                    </table>
                    {
                      pendingPayment.length > 0 ?
                        <div className="clearfix">
                          <div className="hint-text text-dark">عرض <b>{pendingPayment.length > startpagination ? startpagination : pendingPayment.length}</b> من <b>{pendingPayment.length}</b> عنصر</div>
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
                  </div>

                  <div className="reminders">
                    <div className="header">
                      {/* <i className='bx bx-note'></i> */}
                      <h3>متابعه الطاولة</h3>
                      <i className='bx bx-filter'></i>
                    </div>
                    <ul className="task-list list-group">
                      {pendingPayment.filter(order =>
                        order.orderType === 'Internal' &&
                        order.payment_status === 'Pending' &&
                        order.status !== 'Cancelled' &&
                        order.isActive === true &&
                        order.help !== 'Not requested'
                      ).map((order, i) => (
                        <li className={`card list-group-item ${order.helpStatus === 'Not send' ? 'bg-warning text-dark' : order.helpStatus === 'Assistance done' ? 'bg-success' : 'bg-info'} mb-2`}
                          key={i}
                        >
                          <div className="task-title card-body d-flex justify-content-between align-items-center p-0 m-0">
                            <div className='d-flex w-50 justify-content-between align-items-center'>
                              <p className='w-50 text-dark' style={{ fontSize: '18px', fontWeight: "900" }}>طاوله : {order.table && order.table.tableNumber}</p>
                              <p className='w-50 text-dark' style={{ fontSize: '18px', fontWeight: "900" }}>
                                {order.help === 'Requests assistance'
                                  ? 'يحتاج المساعدة'
                                  : order.help === 'Requests bill'
                                    ? 'يحتاج الفاتورة'
                                    : ''}
                              </p>
                            </div>

                            {order.helpStatus === 'Not send' ? (
                              <button
                                type="button"
                                className="btn w-50 text-dark btn-primary"
                                onClick={() => sendWaiter(order._id)}
                              >
                                ارسال ويتر
                              </button>
                            ) : (
                              <div className='d-flex flex-nowrap w-50 text-dark justify-content-between align-items-center'>
                                <p className='w-50 text-dark text-center' style={{ fontSize: '18px', fontWeight: "900" }}> {order.waiter?.username}</p>
                                <p className='w-50 text-dark text-center' style={{ fontSize: '18px', fontWeight: "900" }}>{order.helpStatus === 'Send waiter' ? 'تم ارسال'
                                  : order.helpStatus === 'On the way' ? 'في الطريق'
                                    : order.helpStatus === 'Assistance done' ? 'تمت'
                                      : ''
                                }
                                </p>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
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


                <div id="invoiceSplitModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form>
                        <div className="modal-header text-light bg-primary">
                          <h4 className="modal-title"></h4>
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        </div>
                        <div ref={printContainerInvoiceSplit} className="w-100 p-1 mb-7 overflow-auto printpage" style={{ textAlign: 'center' }}>
                          {/* Invoice Header */}
                          <div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                            <h2>{restaurantData.name}</h2>
                            <p>كاشير {orderdata.cashier && orderdata.cashier.username} | فاتورة باقي #{serial} | {orderdata.orderType === 'Internal' ? `Table ${orderdata.table && orderdata.table.tableNumber}` : ''} | التاريخ: {formatDate(new Date())}</p>
                          </div>

                          {/* Customer Information */}
                          {orderType == 'Delivery' ? <div className="customer-info text-dark" style={{ margin: '20px' }}>
                            <h4>بيانات العميل</h4>
                            <p>الاسم: {orderdata.name}</p>
                            <p>الموبايل: {orderdata.phone}</p>
                            <p>العنوان: {orderdata.address}</p>
                            {/* <p>Delivery Man: {usertitle(deliveryMan)}</p> */}
                          </div> : orderType == 'Takeaway' ?
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
                                item.quantity - item.numOfPaid > 0 ?
                                  <>
                                    <tr key={i}>
                                      <td className="col-md-3 text-truncate">{item.name}</td>
                                      <td className="col-md-2 text-nowrap">{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                                      <td className="col-md-2 text-nowrap">{item.quantity - item.numOfPaid}</td>
                                      <td className="col-md-2 text-nowrap">{item.priceAfterDiscount ? item.priceAfterDiscount * (item.quantity - item.numOfPaid) : item.price * (item.quantity - item.numOfPaid)}</td>
                                    </tr>
                                    {item.extras && item.extras.length > 0 && (
                                      item.extras.map((extra, j) => {
                                        if (extra && extra.isPaid === false) {
                                          return (
                                            <tr key={`${i}-${j}`}>
                                              <td className="col-md-3 text-truncate">
                                                <div className="d-flex flex-column flex-wrap w-100 align-items-center justify-content-between">
                                                  {extra.extraDetails.map((detail) => (
                                                    <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name}`}</p>
                                                  ))}
                                                </div>
                                              </td>
                                              <td className="col-md-2 text-nowrap">
                                                <div className="d-flex  flex-column flex-wrap w-100 align-items-center justify-content-between">
                                                  {extra.extraDetails.map((detail) => (
                                                    <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.price} ج`}</p>
                                                  ))}
                                                </div>
                                              </td>
                                              <td className="col-md-2 text-nowrap">1</td>
                                              <td className="col-md-2 text-nowrap">
                                                {extra && (
                                                  <p className="badge badge-info m-1">{extra.totalExtrasPrice} ج</p>
                                                )}
                                              </td>
                                            </tr>
                                          );
                                        } else {
                                          return null; // Return null if extra.isPaid !== false
                                        }
                                      })
                                    )}


                                  </>
                                  : ''
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="3">المجموع</td>
                                <td>{orderSubtotal - subtotalSplitOrder}</td>
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
                                <td>{orderTotal - subtotalSplitOrder}</td>
                              </tr>
                            </tfoot>
                          </table>


                          {/* Restaurant Information */}
                          <div className="restaurant-info text-dark" style={{ marginTop: '20px', textAlign: 'center' }}>
                            <p>{restaurantData.name}</p>
                            <p>موبايل: 01144001433</p>
                            <p>العنوان: بني سويف - الفشن -أخر شارع البحر الأعظم بجوار ماركت طيبة </p>
                          </div>
                          {/* Footer */}
                          <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                            <p>webapp: <span style={{ color: '#5a6268' }}>Smart Menu</span></p>
                            <p>Developed by: <span style={{ color: '#5a6268' }}>Beshoy Nady</span></p>
                          </div>
                        </div>
                        <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                          <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="Cancel" />
                          <input type="submit" className="btn w-50 btn-success" value="Print" onClick={handlePrintInvoiceSplit} />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>


                <div id="kitchenorderModal" className="modal fade">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form>
                        <div className="modal-header text-light bg-primary">
                          {/* <h4 className="modal-title"></h4> */}
                          <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                          <button type="button" className="btn btn-primary" value="طباعه للشيف" onClick={(e) => handlePrintKitchen(e)}>طباعه للشيف</button>
                        </div>
                        <div ref={printContainerKitchen} className="w-100 p-1 mb-7 overflow-auto printpage" style={{ textAlign: 'center' }}>
                          <div className="mb-4" style={{ direction: 'rtl' }}>
                            <div className="card text-white bg-success" style={{ width: "265px" }}>
                              <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                                <div style={{ maxWidth: "50%" }}>
                                  <p className="card-text"> {kitchenOrder.table ? (`طاولة: ${kitchenOrder.table.tableNumber}`) : (kitchenOrder.user ? `العميل: ${kitchenOrder.user.username}` : '')}</p>
                                  <p className="card-text">نوع الطلب: {kitchenOrder.orderType}</p>
                                  {kitchenOrder.ordernum ? `<p className="card-text"> رقم الطلب:  ${kitchenOrder.ordernum} </p>` : ''}
                                </div>

                                <div style={{ maxWidth: "50%" }}>
                                  <p className="card-text">الفاتورة: {kitchenOrder.serial}</p>
                                  <p className="card-text">الكاشير: {employeeLoginInfo && employeeLoginInfo.employeeinfo ? usertitle(employeeLoginInfo.employeeinfo.id) : ''}</p>
                                  {kitchenOrder.waiter ? <p className="card-text">الويتر: {kitchenOrder.waiter.username}</p> : ""}
                                  <p className="card-text">الاستلام: {new Date(kitchenOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                  <p className="card-text">الانتظار: {55} دقيقه</p>
                                </div>
                              </div>
                              <ul className='list-group list-group-flush'>
                                {kitchenProducts.map((product, i) => {
                                  return (
                                    <>
                                      <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={i} style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                                        <div className="d-flex justify-content-between align-items-center w-100">
                                          <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{i + 1}- {product.name}</p>
                                          <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}> × {product.quantity}</span>
                                        </div>
                                        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{product.notes}</div>
                                      </li>
                                      {product.extras && product.extras.length > 0 && (
                                        product.extras.map((extra, j) => {
                                          if (extra && extra.isDone === false) {
                                            return (
                                              <tr key={`${i}-${j}`}>
                                                <td className="col-md-3 text-truncate">
                                                  <div className="d-flex flex-column flex-wrap w-100 align-items-center justify-content-between">
                                                    {extra.extraDetails.map((detail) => (
                                                      <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name}`}</p>
                                                    ))}
                                                  </div>
                                                </td>
                                                <td className="col-md-2 text-nowrap">
                                                  <div className="d-flex  flex-column flex-wrap w-100 align-items-center justify-content-between">
                                                    {extra.extraDetails.map((detail) => (
                                                      <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.price} ج`}</p>
                                                    ))}
                                                  </div>
                                                </td>
                                                <td className="col-md-2 text-nowrap">1</td>
                                                <td className="col-md-2 text-nowrap">
                                                  {extra && (
                                                    <p className="badge badge-info m-1">{extra.totalExtrasPrice} ج</p>
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          } else {
                                            return null; // Return null if extra.isPaid !== false
                                          }
                                        })
                                      )}
                                    </>
                                  )
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                          <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="اغلاق" />
                          <input type="button" className="btn w-50 btn-success" value="تم الموافقه" onClick={(e) => isPrint ? aproveOrder(e, employeeLoginInfo.employeeinfo.id) : alert("لم تتم الطباعه ! يجب طباعه اولا")} />
                        </div>
                      </form>
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