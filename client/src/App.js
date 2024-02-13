import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Userscreen from './screens/user.screen/Userscreen';
import ManagLayout from './screens/management/ManagLayout';
import ManagerDash from './screens/management/manag.component/managerdash/ManagerDash';
import Orders from './screens/management/manag.component/orders/Orders';
import Products from './screens/management/manag.component/products/Products';
import Tables from './screens/management/manag.component/tables/Tables';
import Employees from './screens/management/manag.component/employees/Employees';
import Category from './screens/management/manag.component/category/Category';
import CategoryStock from './screens/management/manag.component/stock/CategoryStock';
import Kitchen from './screens/management/manag.component/kitchen/Kitchen';
import Waiter from './screens/management/manag.component/waiter/Waiter';
import DeliveryMan from './screens/management/manag.component/deliveryman/DeliveryMan';
import Login from './screens/management/manag.component/login/Login';
import POS from './screens/management/manag.component/pos/POS';
import StockItem from './screens/management/manag.component/stock/StockItem';
import StockManag from './screens/management/manag.component/stock/StockManag';
import ProductRecipe from './screens/management/manag.component/products/ProductRecipe';
import EmployeesSalary from './screens/management/manag.component/employees/EmployeesSalary';
import PayRoll from './screens/management/manag.component/employees/PayRoll';
import ExpenseItem from './screens/management/manag.component/expenses/Expense';
import DailyExpense from './screens/management/manag.component/expenses/dailyExpense';
import CashRegister from './screens/management/manag.component/cash/CashRegister';
import CashMovement from './screens/management/manag.component/cash/CashMovement';
import Users from './screens/management/manag.component/users/Users';
import KitchenConsumption from './screens/management/manag.component/stock/KitchenConsumption';
import TablesPage from './screens/management/manag.component/tables/TablesPage';

import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL, {
  reconnection: true,
});

export const detacontext = createContext({});

function App() {

  const apiUrl = process.env.REACT_APP_API_URL;


  axios.defaults.withCredentials = true;


  //++++++++++++++++++++ pagination ++++++++++

  const [startpagination, setstartpagination] = useState(0)
  const [endpagination, setendpagination] = useState(5)

  // const [pagination, setpagination] = useState(5)
  const EditPagination = (e) => {
    if (e.target.innerHTML == 'التالي') {
      setstartpagination(startpagination + 5)
      setendpagination(endpagination + 5)
    } else if (e.target.innerHTML == 'السابق') {
      if (endpagination <= 5) {
        setstartpagination(0)
        setendpagination(5)
      } else {
        setstartpagination(startpagination - 5)
        setendpagination(endpagination - 5)
      }
    } else {
      setstartpagination((e.target.innerHTML * 5) - 5)
      setendpagination(e.target.innerHTML * 5)

    }
  }

  const FullscreenButton = () => {
    const toggleFullscreen = () => {
      const doc = window.document;
      const docEl = doc.documentElement;

      const requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
      const exitFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      } else {
        exitFullScreen.call(doc);
      }
    };
  }

  const showdate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  //+++++++++++++++++ product ++++++++++++++++++++
  const [allProducts, setallProducts] = useState([])
  const getProducts = async () => {
    const token = localStorage.getItem('token_u');

    const products = await axios.get(apiUrl + '/api/product', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setallProducts(products.data)
  }

  //+++++++ category +++++++++++
  const [allcategories, setallcategories] = useState([])
  const getCategories = async () => {
    try {
      const allcategories = await axios.get(apiUrl + '/api/category')
      setallcategories(allcategories.data)
    } catch (error) {
      console.log(error)
    }
  }


  const calcTotalSalesOfCategory = (id) => {
    var totalsalesofcategory = 0
    const productofcategory = allProducts.filter((pro) => pro.category == id)
    // console.log(productofcategory.map((product)=>product.sales))
    for (let i = 0; i < productofcategory.length; i++) {
      totalsalesofcategory = productofcategory[i].sales + totalsalesofcategory
    }
    // console.log(totalsalesofcategory)
    return totalsalesofcategory
  }

  // ++++++++++ order ++++++++++++
  const [allOrders, setallOrders] = useState([])
  const getallOrders = async () => {
    const orders = await axios.get(apiUrl + '/api/order');
    setallOrders(orders.data)
  }



  //+++++++++++ table ++++++++++++++
  const [allTable, setallTable] = useState([])

  const getallTable = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/table');
      if (response.status === 200 && response.data) {
        console.log({ apiUrl: apiUrl + '/api/table' });
        console.log("Received tables data:", response.data);
        setallTable(response.data);
      } else {
        console.error("Failed to receive valid tables data");
      }
    } catch (error) {
      console.error("Error fetching tables data:", error);
    }
  };


  // +++++++++++++++ user +++++++++++++
  const [allUsers, setallUsers] = useState([])
  const getallUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user`);
      if (response.status === 200) {
        setallUsers(response.data);
      } else {
        console.error('Failed to fetch users data: Unexpected response status', response.status);
      }
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  };

  const [allemployees, setallemployees] = useState([])
  const getallemployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employee`);
      if (response.status === 200) {
        setallemployees(response.data);
      } else {
        console.error('Failed to fetch employees data: Unexpected response status', response.status);
      }
    } catch (error) {
      console.error('Error fetching employees data:', error);
    }
  };




  // ++++++++ client screen +++++++++++++ 
  const [categoryid, setcategoryid] = useState('65c56874584af14d9511fc1e')
  const filterByCategoryId = (e) => {
    // console.log(e.target.value)
    setcategoryid(e.target.value)
  }



  const [count, setcount] = useState(0)

  const increment = (id) => {
    setcount(count + 1)
    const product = productOrderTOupdate.length > 0 ? productOrderTOupdate.find(product => product._id == id) : allProducts.find(product => product._id == id)
    product.quantity += 1;
    console.log(product)
  };

  const descrement = (id) => {
    setcount(count - 1)
    const product = productOrderTOupdate.length > 0 ? productOrderTOupdate.find(product => product._id == id) : allProducts.find(product => product._id == id)
    // console.log(product.quantity)
    if (product.quantity < 1) {
      product.quantity = 0;
      product.notes = '';
      deleteitems(id)
    } else {
      product.quantity = product.quantity - 1
    }
  };
  const [productnote, setproductnote] = useState('')
  const addnotrstoproduct = (e, id) => {
    e.preventDefault()
    const product = productOrderTOupdate.length > 0 ? productOrderTOupdate.find(product => product._id == id) : allProducts.find(product => product._id == id)
    product.notes = productnote
  }

  //list of items id to add & delete btn
  const [itemid, setitemid] = useState([])
  // add items to cart
  const [ItemsInCart, setItemsInCart] = useState([])

  const additemtocart = (id) => {
    console.log(id)
    const cartitem = allProducts.filter(item => item._id === id)
    cartitem[0].productid = id
    console.log(cartitem)

    if (ItemsInCart.length > 0) {
      const repeateditem = ItemsInCart.filter(item => item._id === id)
      if (repeateditem.length == 0) {
        setItemsInCart([...ItemsInCart, ...cartitem])
        setitemid([...itemid, id])
      }
    } else {
      setItemsInCart([...cartitem])
      setitemid([id])

    }
  }



  // delete item from cart by id
  const quantityzero = (id) => {
    const product = productOrderTOupdate.length > 0 ?
      productOrderTOupdate.find(product => product._id == id)
      : allProducts.find(product => product._id == id)
    product.quantity = 0
    product.notes = ''
  }

  const deleteitems = (id) => {
    const withoutDeleted = productOrderTOupdate.length > 0 ?
      productOrderTOupdate.filter(product => product.productid !== id)
      : ItemsInCart.filter(item => item._id !== id);

    const updatedItemId = itemid.filter(itemId => itemId !== id);

    if (productOrderTOupdate.length > 0) {
      setproductOrderTOupdate(withoutDeleted);
    } else {
      setItemsInCart(withoutDeleted);
      setitemid(updatedItemId);
    }

    quantityzero(id); // استدعاء الوظيفة لتحديث الكمية والملاحظات
  }



  // Calculate costOrder of cart item
  const [costOrder, setcostOrder] = useState(0)
  // const [subcost, setsubcost] = useState(0)
  // const [costOrder, setcostOrder] = useState(0)
  // const [costOrder, setcostOrder] = useState(0)
  const costOfOrder = () => {
    if (ItemsInCart.length > 0) {
      let total = 0;
      ItemsInCart.map((item) => {
        item.totalprice = item.priceAfterDiscount > 0 ? item.priceAfterDiscount * item.quantity : item.price * item.quantity;
        total += item.totalprice
        setcostOrder(total)
      })
    } else if (productOrderTOupdate.length > 0) {
      let total = 0;
      productOrderTOupdate.map((item) => {
        item.totalprice = item.priceAfterDiscount > 0 ? item.priceAfterDiscount * item.quantity : item.price * item.quantity;
        total += item.totalprice
        setcostOrder(total)
      })
    } else {
      setcostOrder(0)
    }
  }



  const createClientOrderForUser = async (userId) => {
    try {
      const token = localStorage.getItem('token_u');

      const userorder = allOrders.filter((o, i) => o.user == userId);
      const lastuserorder = userorder.length > 0 ? userorder[userorder.length - 1] : [];
      const lastuserorderactive = lastuserorder.isActive;

      if (lastuserorderactive == true) {
        const id = await lastuserorder._id;
        const oldproducts = await allOrders.find((order) => order._id == id).products;
        const oldsubTotal = await allOrders.find((order) => order._id == id).subTotal;
        const subTotal = costOrder + oldsubTotal;
        // const tax = subTotal * 0.10;
        const deliveryCost = 10;
        // const total = subTotal + tax + deliveryCost;
        const total = subTotal + deliveryCost;

        if (lastuserorder.status == 'Preparing') {
          const additem = ItemsInCart.map((item) => ({ ...item, isAdd: true }));
          const products = [...additem, ...oldproducts];
          const status = 'Pending';
          const order_type = 'Delivery';
          const neworder = await axios.put(apiUrl + '/api/order/' + id, {
            products, subTotal, total, deliveryCost, status, order_type
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setItemsInCart([]);
          setitemid([])
          getProducts();
          toast.success("Items added to the current order!");
        } else {
          const products = [...ItemsInCart, ...oldproducts];
          const status = 'Pending';
          const order_type = 'Delivery';
          const neworder = await axios.put(apiUrl + '/api/order/' + id, {
            products, subTotal, total, deliveryCost, status, order_type
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setItemsInCart([]);
          getProducts();
        }

        setItemsInCart([]);
        getProducts();
        toast.success("Order updated successfully!");
      } else {
        try {
          console.log([...ItemsInCart])
          const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
          const finduser = allUsers.find((u, i) => u._id == userId);
          const user = finduser ? userId : null;
          const products = [...ItemsInCart];
          const subTotal = costOrder;
          // const tax = subTotal * 0.14;
          const name = finduser ? finduser.username : '';
          const phone = finduser ? finduser.phone : '';
          const address = finduser ? finduser.address : '';
          const order_type = 'Delivery';
          const deliveryCost = 10;
          // const total = subTotal + tax + deliveryCost;
          const total = subTotal + deliveryCost;
          const neworder = await axios.post(apiUrl + '/api/order', {
            serial,
            products,
            subTotal,
            // tax,
            deliveryCost,
            total,
            user,
            name,
            address,
            phone,
            order_type,
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setItemsInCart([]);
          setitemid([])
          getProducts();
          toast.success("New order created successfully!");
        } catch (error) {
          console.log(error);
          toast.error("An error occurred while creating the order");
        }
      }
      socket.emit("sendorder", "socket new order created")
      setItemsInCart([]);
      setitemid([])
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while processing the order");
    }
  };



  const createClientOrderForTable = async (tableId) => {
    try {
      const tableorder = allOrders.filter((o) => o.table === tableId);
      const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : {};
      const lasttableorderactive = lasttableorder.isActive;

      if (lasttableorderactive === true) {
        const id = lasttableorder._id;
        const oldproducts = (allOrders.find((order) => order._id === id)).products;
        const oldsubTotal = (allOrders.find((order) => order._id === id)).subTotal;
        const status = lasttableorder.status;
        const subTotal = costOrder + oldsubTotal;
        console.log(subTotal)
        // const tax = subTotal * 0.14;
        // const total = subTotal + tax;
        const total = subTotal;

        if (status == 'Preparing') {
          const additem = [];
          for (let i = 0; i < ItemsInCart.length; i++) {
            ItemsInCart[i].isAdd = true;
            additem.push(ItemsInCart[i]);
          }
          const products = [...additem, ...oldproducts];
          const status = 'Pending';
          const neworder = await axios.put(`${apiUrl}/api/order/${id}`, {
            products,
            subTotal,
            total,
            // tax,
            status,
          });
          setItemsInCart([]);
          setitemid([])
          getProducts();
          // Toast success message for updating order
          toast.success('Order updated successfully!');
        } else {
          const products = [...ItemsInCart, ...oldproducts];
          const status = 'Pending';
          const neworder = await axios.put(`${apiUrl}/api/order/${id}`, {
            products,
            subTotal,
            total,
            // tax,
            status,
          });
          setItemsInCart([]);
          setitemid([])
          getProducts();

          // Toast success message for updating order
          toast.success('Order updated successfully!');
        }
      } else {
        const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
        const table = allTable.find((t) => t._id === tableId) ? tableId : null;
        const finduser = allUsers.find((u) => u._id === tableId);
        const user = finduser ? tableId : null;
        const products = [...ItemsInCart];
        const subTotal = costOrder;
        // const tax = subTotal * 0.14;
        // const total = subTotal + tax;
        const total = subTotal;
        const order_type = 'Internal';

        const neworder = await axios.post(apiUrl + '/api/order', {
          serial,
          products,
          subTotal,
          // tax,
          total,
          table,
          user,
          order_type,
        });
        setItemsInCart([]);
        setitemid([])
        getProducts();
        // Toast success message for creating a new order
        toast.success('New order created successfully!');
      }
      setItemsInCart([]);
      setitemid([])
      getProducts();

    } catch (error) {
      console.log(error);
      // Display an error toast here
      toast.error('An error occurred while creating/updating the order');
    }
  };



  const [myorder, setmyorder] = useState({})
  const [list_products_order, setlist_products_order] = useState([])
  const [orderupdate_date, setorderupdate_date] = useState('')
  const [myorderid, setmyorderid] = useState()
  const [ordertax, setordertax] = useState()
  const [ordertotal, setordertotal] = useState()
  const [ordersubtotal, setordersubtotal] = useState()
  const [orderdeliveryCost, setorderdeliveryCost] = useState()
  const [orderdiscount, setorderdiscount] = useState(0)
  const [orderaddition, setorderaddition] = useState(0)
  const [discount, setdiscount] = useState(0)
  const [addition, setaddition] = useState(0)






  const invoice = async (clientid) => {
    console.log(clientid)
    // console.log(allOrders)
    const tableorder = allOrders.filter((o, i) => o.table == clientid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = lasttableorder.isActive

    const userorder = allOrders.filter((o, i) => o.user == clientid);
    const lastuserorder = userorder.length > 0 ? userorder[userorder.length - 1] : [];
    const lastuserorderactive = lastuserorder.isActive

    if (clientid) {
      if (lasttableorderactive) {
        const id = await lasttableorder._id
        const myorder = await axios.get(apiUrl + '/api/order/' + id,)
        const data = myorder.data
        console.log(data)
        console.log(data._id)
        setmyorder(data)
        setmyorderid(data._id)
        setlist_products_order(data.products)
        setorderupdate_date(data.updatedAt)
        setordertotal(data.total)
        setordersubtotal(data.subTotal)
        // setordertax(data.tax)
        setItemsInCart([])

      } else if (lastuserorderactive) {
        const id = await lastuserorder._id
        const myorder = await axios.get(apiUrl + '/api/order/' + id,)
        const data = await myorder.data
        console.log(data)
        setmyorder(data)
        setmyorderid(data._id)
        setlist_products_order(data.products)
        setorderupdate_date(data.updatedAt)
        setordertotal(data.total)
        setordersubtotal(data.subTotal)
        // setordertax(data.tax)
        setorderdeliveryCost(data.deliveryCost)
        setItemsInCart([])
      }
    } else {
      window.alert("Please login or scan qr")
    }

  }

  const checkout = async () => {
    try {
      const id = myorderid;
      const isActive = false;
      const help = 'Requesting the bill';

      // Update order to mark it for checkout
      const updatedOrder = await axios.put(`${apiUrl}/api/order/${id}`, {
        isActive,
        help
      });

      // Show success toast after successfully marking order for checkout
      toast.success('Order marked for checkout');

      // Redirect after 10 minutes
      setTimeout(() => {
        window.location.href = `https://${window.location.hostname}`;
      }, 60000 * 10);
    } catch (error) {
      console.log(error);
      // Show error toast if there's an issue with marking the order for checkout
      toast.error('Failed to mark order for checkout');
    }
  };


  const createWaiterOrder = async (tableid, waiterid) => {
    try {
      // Check for active orders for the table
      const tableorder = allOrders.filter((o, i) => o.table === tableid);
      const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : null;
      const lasttableorderactive = lasttableorder ? lasttableorder.isActive : false;

      if (lasttableorderactive) {
        // Update the existing order
        const id = lasttableorder._id;
        const orderData = allOrders.find((order) => order._id === id)
        const oldproducts = orderData.products;
        const oldtotal = orderData.total;
        const newAddition = orderData.addition + addition
        const newDiscount = orderData.discount + discount
        const products = [...ItemsInCart, ...oldproducts];
        const subTotal = costOrder + oldtotal;
        // const tax = subTotal * 0.14;
        // const total = subTotal + tax;
        const total = subTotal + addition - discount;
        const status = 'Pending';
        const createBy = waiterid;

        const updatedOrder = await axios.put(apiUrl + '/api/order/' + id, {
          products,
          subTotal,
          total,
          addition: newAddition,
          discount: newDiscount,
          status,
          createBy
        });

        toast.success('Order updated successfully!');
        setitemid([])
        setaddition(0)
        setdiscount(0)
        setItemsInCart([]);
        getProducts();
      } else {
        // Create a new order
        const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
        const products = [...ItemsInCart];
        const subTotal = costOrder;
        // const tax = subTotal * 0.14;
        // const total = subTotal + tax;
        const total = subTotal + addition - discount;
        const order_type = 'Internal';

        const neworder = await axios.post(apiUrl + '/api/order', {
          serial,
          table: tableid,
          products,
          subTotal,
          total,
          // tax,
          discount,
          addition,
          order_type,
          createBy: waiterid
        });

        toast.success('New order created successfully!');
        setitemid([])
        setaddition(0)
        setdiscount(0)
        setItemsInCart([]);
      }
    } catch (error) {
      console.log(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const [posOrderId, setposOrderId] = useState('')

  const createCasherOrder = async (casherid, clientname, clientphone, clientaddress, ordertype, deliveryCost, discount, addition) => {
    console.log({ discount })
    console.log({ addition })
    try {
      const dayOrders = allOrders.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString());
      const takeawayOrders = dayOrders.filter(order => order.order_type === 'Takeaway');
      const ordernum = ordertype === 'Takeaway' ? takeawayOrders.length === 0 ? 1 : takeawayOrders[takeawayOrders.length - 1].ordernum + 1 : null;

      const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';

      const products = [...ItemsInCart];
      const subTotal = costOrder;
      const total = deliveryCost > 0 ? subTotal + deliveryCost - discount + addition : subTotal - discount + addition;

      const name = clientname;
      const phone = clientphone;
      const address = clientaddress;
      const createBy = casherid;
      const order_type = ordertype;
      const casher = casherid;
      const status = 'Approved';

      const newOrder = await axios.post(apiUrl + '/api/order', {
        serial,
        ordernum,
        products,
        subTotal,
        deliveryCost,
        discount,
        addition,
        total,
        order_type,
        createBy,
        casher,
        name,
        phone,
        address,
        status
      });

      if (newOrder && newOrder.data._id) {
        setposOrderId(newOrder.data._id);
        toast.success('تم انشاء الاوردر');
        setItemsInCart([]);
        setitemid([]);
        setaddition(0)
        setdiscount(0)

      } else {
        throw new Error('هناك خطأ في انشاء الاوردر');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ ما. حاول مرة اخرى.');
    }
  };

  const [newlistofproductorder, setnewlistofproductorder] = useState([])
  const getOrderProduct = async (e, tableid) => {
    e.preventDefault()
    const tableorder = allOrders.filter((o, i) => o.table == tableid);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = lasttableorder.isActive
    console.log({ lasttableorder })
    console.log({ lasttableorderactive })
    if (lasttableorderactive) {
      const id = await lasttableorder._id
      const myorder = await axios.get(apiUrl + '/api/order/' + id,)
      const data = myorder.data
      console.log(data)
      console.log(data._id)
      console.log({ list_products_order: data.products })
      setmyorder(data)
      setmyorderid(data._id)
      setordertotal(data.total)
      setorderaddition(data.addition)
      setorderdiscount(data.discount)
      setordersubtotal(data.subTotal)
      setlist_products_order(data.products)
      setnewlistofproductorder(JSON.parse(JSON.stringify(data.products)))
    }
  }


  const putNumOfPaid = (id, numOfPaid) => {
    console.log({ numOfPaid })
    // setcount(count + 1)
    console.log({ list_products: list_products_order })
    // const arrayofproductorder = JSON.parse(JSON.stringify(list_products_order));
    console.log({ newlistofproductorder })
    newlistofproductorder.map((product) => {
      if (product.productid === id) {
        const oldproduct = list_products_order.find(pro => pro.productid === id);
        console.log({ oldproduct })
        console.log({ old_numOfPaid: oldproduct.numOfPaid })
        product.numOfPaid = oldproduct.numOfPaid + numOfPaid;
        ;
        console.log({ new_numOfPaid: product.numOfPaid })
      }

    })

    console.log({ newlistofproductorder })
    calcsubtotalSplitOrder()
  }

  const [subtotalSplitOrder, setsubtotalSplitOrder] = useState(0);

  const calcsubtotalSplitOrder = () => {
    let total = 0;

    newlistofproductorder.map((product) => {
      const oldproduct = list_products_order.find(pro => pro.productid == product.productid);
      if (oldproduct.numOfPaid != product.numOfPaid) {
        const newnumOfPaid = Math.abs(oldproduct.numOfPaid - product.numOfPaid)
        const subTotal = product.priceAfterDiscount > 0 ? newnumOfPaid * product.priceAfterDiscount : oldproduct.price * newnumOfPaid;
        total += subTotal
      }
    });

    setsubtotalSplitOrder(total);
  };


  // Function to split the invoice and pay a portion of it
  const splitInvoice = async (e) => {
    try {
      e.preventDefault();

      // Send a PUT request to update the order with split details
      const updateOrder = await axios.put(`${apiUrl}/api/order/${myorderid}`, {
        products: newlistofproductorder,
        isSplit: true,
        subtotalSplitOrder
      });
      if (updateOrder) {
        // Display a success toast message upon successful payment
        toast.success("تم دفع جزء من الفاتورة بنجاح");

        // Log the updated order details
        // console.log({ updateOrder });
      }
    } catch (error) {
      // Display an error toast message if payment fails
      toast.error("حدث خطأ أثناء دفع الجزء من الفاتورة");

      // Log the error to the console
      console.error('Error updating order:', error);
    }
  };




  const POSinvoice = async (checkid) => {
    // console.log(allOrders)
    // const tableorder = allOrders.filter((o, i) => o.table == checkid);
    // const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    // const lasttableorderactive = await lasttableorder.isActive

    const employeeorder = allOrders.filter((o, i) => o.createBy == checkid);
    const lastemployeeorder = employeeorder.length > 0 ? employeeorder[employeeorder.length - 1] : [];
    const lastemployeeorderactive = await lastemployeeorder.isActive

    // if (lasttableorderactive) {
    //   const id = await lasttableorder._id
    //   const myorder = await axios.get(apiUrl+'/api/order/' + id,)
    //   const data = await myorder.data
    //   setmyorder(data)
    //   setmyorderid(data._id)
    //   setlist_products_order(data.products)
    //   setorderupdate_date(data.updatedAt)
    //   setordertotal(data.total)
    //   setordersubtotal(data.subTotal)
    //   // setordertax(data.tax)
    //   setorderdeliveryCost(data.deliveryCost)
    //   setorderaddition(data.addition)
    //   setorderdiscount(data.discount)
    //   setItemsInCart([])
    // } else 
    if (lastemployeeorderactive) {
      const id = await lastemployeeorder._id
      const myorder = await axios.get(apiUrl + '/api/order/' + id,)
      const data = await myorder.data
      console.log(data)
      setmyorder(data)
      setmyorderid(data._id)
      setlist_products_order(data.products)
      setorderupdate_date(data.updatedAt)
      setordertotal(data.total)
      setorderaddition(data.addition)
      setorderdiscount(data.discount)
      setordersubtotal(data.subTotal)
      // setordertax(data.tax)
      setorderdeliveryCost(data.deliveryCost)
      setItemsInCart([])
    }
  };



  const updatecountofsales = async (id) => {
    const myorder = await axios.get(apiUrl + '/api/order/' + id,)
    const data = myorder.data
    for (var i = 0; i < data.products.length; i++) {
      const productid = await data.products[i]._id
      const productquantity = await data.products[i].quantity
      const findprduct = await axios.get(apiUrl + '/api/product/' + productid)
      const sales = await findprduct.data.sales + productquantity

      // console.log(productid)
      // console.log(findprduct)
      // console.log(sales)
      // console.log(productquantity)
      const updatprduct = await axios.put(apiUrl + '/api/product/withoutimage/' + productid, {
        sales
      })
      // console.log(updatprduct)

    }
  }

  const askingForHelp = async (tablenum) => {
    const tableorder = allOrders.filter((o, i) => o.table == tablenum);
    const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
    const lasttableorderactive = await lasttableorder.isActive

    const id = await lasttableorder._id
    console.log(id)
    const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
    console.log(serial)
    const help = 'Requests assistance';
    const table = tablenum
    if (!lasttableorderactive) {
      const neworder = await axios.post(apiUrl + '/api/order/', {
        serial, table, help
      })
      console.log(neworder)
    } else {
      const neworder = await axios.put(apiUrl + '/api/order/' + id, {
        help
      })
      console.log(neworder)
      // window.location.href = `http://localhost:3000/`;
    }
  }


  const usertitle = (id) => {
    const istable = allTable ? allTable.find((table) => table._id === id) : null;
    const isuser = allUsers ? allUsers.find((user) => user._id === id) : null;
    const isemployee = allemployees ? allemployees.find((employee) => employee._id === id) : null;

    if (istable) {
      const table_num = istable.tablenum;
      return table_num;
    } else if (isuser) {
      const user_name = isuser.username;
      return user_name;
    } else if (isemployee) {
      const employee_name = isemployee.username;
      return employee_name;
    }
  };



  //++++++++++++++++++++++++++ AUTH ++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




  const [userLoginInfo, setUserLoginInfo] = useState(null);
  const [employeeLoginInfo, setEmployeeLoginInfo] = useState(null);
  const [isLogin, setisLogin] = useState(false);

  axios.defaults.withCredentials = true;

  // Function to handle user signup
  const signup = async (e, username, password, phone, address, email, passconfirm) => {
    e.preventDefault();

    try {
      // Check if any field is empty
      if (!username || !password || !phone || !address || !email) {
        toast.error('هناك حقول فارغه.');
        return;
      }

      // Check if passwords match if passconfirm is provided
      if (passconfirm !== undefined && password !== passconfirm) {
        toast.error('كلمة السر غير متماثله.');
        return;
      }

      // Send signup request
      const response = await axios.post(apiUrl + '/api/auth/signup', {
        username,
        password,
        phone,
        address,
        email,
      });

      // Handle successful signup
      if (response && response.data) {
        const { accessToken, newUser } = response.data;
        toast.success('تم انشاء حساب !');
        // Perform actions with accessToken or newUser if needed
      }
    } catch (error) {
      // Handle signup error
      console.error('Signup error:', error);
      toast.error('حدث خطأ في انشاء الحساب . حاول مرة اخري');
    }
  };



  // Function to retrieve user info from tokens
  const getUserInfoFromToken = () => {
    const userToken = localStorage.getItem('token_u');
    const employeeToken = localStorage.getItem('token_e');

    let decodedToken = null;

    if (employeeToken && userToken) {
      decodedToken = jwt_decode(employeeToken);
      // Set employee login info
      setEmployeeLoginInfo(decodedToken);
      console.log(decodedToken.employeeinfo);

      decodedToken = jwt_decode(userToken);
      // Set user login info
      setUserLoginInfo(decodedToken);
    } else if (employeeToken) {
      decodedToken = jwt_decode(employeeToken);
      // Set employee login info
      setEmployeeLoginInfo(decodedToken);
      console.log(decodedToken.employeeinfo);
    } else if (userToken) {
      decodedToken = jwt_decode(userToken);
      // Set user login info
      setUserLoginInfo(decodedToken);
    } else {
      setUserLoginInfo(null);
      setEmployeeLoginInfo(null);
    }

    return decodedToken;
  };

  // Function for user login
  const login = async (e, phone, password) => {
    e.preventDefault();
    console.log({ phone, password })
    try {
      if (!phone || !password) {
        toast.error('رقم الموبايل او كلمة السر غير صحيحة.');
        return;
      }

      const response = await axios.post(apiUrl + '/api/auth/login', {
        phone,
        password,
      });

      if (response && response.data) {
        const { accessToken, findUser } = response.data;

        if (accessToken && findUser.isActive) {
          localStorage.setItem('token_u', accessToken);
          // Retrieve user info from token if needed
          getUserInfoFromToken();
          setisLogin(!isLogin)
          toast.success('تم تسجيل الدخول!');
        } else {
          toast.error('هذا المستخدم غير نشط .الرجاء الاتصال بنا');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 404) {
        toast.error('Phone number is not registered.');
      } else if (error.response && error.response.status === 401) {
        toast.error('Incorrect password.');
      } else {
        toast.error('حدث خطا في تسجيل الدخول. االرجاء مراجعه البيانات المحاوله مره اخري.');
      }
    }
  };



  const employeelogin = async (e, phone, password) => {
    e.preventDefault();

    if (!phone || !password) {
      toast('الموبايل و كلمة السره مطلوبان');
      return;
    }

    try {
      const response = await axios.post(apiUrl + '/api/employee/login', {
        phone,
        password,
      });

      if (response && response.data) {
        const { data } = response;

        console.log(data.message);
        toast(data.message);

        if (data.accessToken) {
          localStorage.setItem('token_e', data.accessToken);
          const userInfo = getUserInfoFromToken();

          console.log(userInfo);
        }

        if (data.findEmployee.isActive === true) {
          window.location.href = `https://${window.location.hostname}/management`;
        } else {
          toast('غير مسموح لك بالدخول');
        }
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data && error.response.data.message) {
        toast(error.response.data.message);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token_u');
    window.location.href = `https://${window.location.hostname}`;
  }

  const employeelogout = () => {
    localStorage.removeItem('token_e');
    window.location.href = `https://${window.location.hostname}/login`;
  }


  //######### get order ditalis by serial 
  const [OrderDetalisBySerial, setOrderDetalisBySerial] = useState({})
  const [productOrderTOupdate, setproductOrderTOupdate] = useState([])
  // Fetch orders from API
  const getOrderDetalisBySerial = async (e, serial) => {
    e.preventDefault()
    try {
      console.log({ serial })
      const res = await axios.get(apiUrl + '/api/order');
      const activeOrder = res.data.filter(o => o.isActive == true)
      const order = activeOrder.find(o => o.serial == serial)
      console.log({ activeOrder })
      console.log({ order })
      console.log({ products: order.products })
      setOrderDetalisBySerial(order)
      setproductOrderTOupdate(order.products)
      setaddition(order.addition)
      setdiscount(order.discount)
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };


  const updateOrder = async () => {
    const id = OrderDetalisBySerial._id
    console.log({ id })
    console.log({ discount })
    console.log({ addition })
    try {
      const subTotal = costOrder
      const total = subTotal + addition - discount;
      console.log({ subTotal })
      console.log({ total })
      console.log({ updatelist: productOrderTOupdate })

      const updatedOrder = await axios.put(apiUrl + '/api/order/' + id, {
        products: productOrderTOupdate,
        subTotal,
        discount,
        addition,
        total,
      })
      if (updatedOrder) {
        setOrderDetalisBySerial({})
        setproductOrderTOupdate([])
        setaddition(0)
        setdiscount(0)
        toast.success('تم تعديل الاوردر');

      } else {
        throw new Error('هناك خطأ في تعديل الاوردر');
      }
    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    getProducts()
    getCategories()
    getallOrders()
    getallTable();
    getallUsers();
    getallemployees()
  }, [])



  // useEffect(() => {
  //   Payment_pending_orders()
  // }, [allOrders])

  useEffect(() => {
    costOfOrder()
    getallTable();
    getallUsers();
    getallOrders()
    getUserInfoFromToken()
    // calcsubtotalSplitOrder()
    // Payment_pending_orders()

  }, [count, ItemsInCart, productOrderTOupdate, isLogin])

  return (
    <detacontext.Provider value={{
      // Functions related to authentication
      userLoginInfo, employeeLoginInfo, getUserInfoFromToken, login, signup, logout, employeelogin, employeelogout,

      // Functions related to products and categories
      allProducts, allcategories, filterByCategoryId, setcategoryid, deleteitems,

      // Functions related to users, tables, and orders
      allUsers, allTable, usertitle, allOrders, askingForHelp,

      // Functions related to manipulating product details
      setproductnote, addnotrstoproduct,

      // Functions related to order processing and calculations
      invoice, list_products_order, orderupdate_date, myorder,
      categoryid, ItemsInCart, costOrder,
      additemtocart, setItemsInCart, increment, descrement,
      getOrderProduct, setdiscount, setaddition, discount, addition, orderaddition, orderdiscount,

      // Functions related to creating different types of orders
      checkout, calcTotalSalesOfCategory, updatecountofsales,
      createWaiterOrder, createCasherOrder, POSinvoice,

      // Functions related to pagination
      EditPagination, startpagination, endpagination, setstartpagination, setendpagination,

      // Other utility functions or state variables
      itemid, setitemid, showdate,
      ordertotal, ordersubtotal, ordertax, orderdeliveryCost, setorderdeliveryCost,
      createClientOrderForTable, createClientOrderForUser,

      OrderDetalisBySerial, getOrderDetalisBySerial, updateOrder, productOrderTOupdate,
      putNumOfPaid, splitInvoice, subtotalSplitOrder

    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Userscreen />} />
          <Route path='/:id' element={<Userscreen />} />

          <Route path='/login' element={<Login />} />

          <Route path='/management/*' element={<ManagLayout />}>
            <Route index element={<ManagerDash />} />
            <Route path='orders' element={<Orders />} />
            <Route path='products' element={<Products />} />
            <Route path='productrecipe' element={<ProductRecipe />} />
            <Route path='tables' element={<Tables />} />
            <Route path='tablespage' element={<TablesPage />} />
            <Route path='employees' element={<Employees />} />
            <Route path='Employeessalary' element={<EmployeesSalary />} />
            <Route path='payroll' element={<PayRoll />} />
            <Route path='category' element={<Category />} />
            <Route path='kitchen' element={<Kitchen />} />
            <Route path='waiter' element={<Waiter />} />
            <Route path='users' element={<Users />} />
            <Route path='deliveryman' element={<DeliveryMan />} />
            <Route path='pos' element={<POS />} />
            <Route path='categoryStock' element={<CategoryStock />} />
            <Route path='stockitem' element={<StockItem />} />
            <Route path='stockmang' element={<StockManag />} />
            <Route path='kitchenconsumption' element={<KitchenConsumption />} />
            <Route path='expense' element={<ExpenseItem />} />
            <Route path='dailyexpense' element={<DailyExpense />} />
            <Route path='cashregister' element={<CashRegister />} />
            <Route path='cashmovement' element={<CashMovement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </detacontext.Provider>
  );
}

export default App;