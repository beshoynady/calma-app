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

  const showDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  //+++++++++++++++++ product ++++++++++++++++++++
  const [allProducts, setallProducts] = useState([])

  const getAllProducts = async () => {
    try {
      // Retrieve user token from local storage
      const token = localStorage.getItem('token_u');

      // Check if token exists
      if (!token) {
        throw new Error('User token not found.');
      }

      // Fetch products from the API
      const response = await axios.get(apiUrl + '/api/product', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Check if response is successful
      if (response.status !== 200) {
        throw new Error('Failed to fetch products.');
      }

      // Set fetched products in the state
      setallProducts(response.data);
    } catch (error) {
      // Handle errors
      console.error('Error fetching products:', error.message);
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  }
  //+++++++ category +++++++++++
  const [allcategories, setallcategories] = useState([])
  const getAllCategories = async () => {
    try {
      // Fetch all categories from the API
      const response = await axios.get(apiUrl + '/api/category');

      // Check if response is successful
      if (response.status !== 200) {
        throw new Error('Failed to fetch categories.');
      }

      // Set fetched categories in the state
      setallcategories(response.data);
    } catch (error) {
      // Handle errors
      console.error('Error fetching categories:', error.message);
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  }


  const calcTotalSalesOfCategory = (id) => {
    try {
      let totalSalesOfCategory = 0;

      // Filter products based on the category ID
      const productsOfCategory = allProducts.filter((product) => product.category === id);

      // Calculate total sales
      for (let i = 0; i < productsOfCategory.length; i++) {
        totalSalesOfCategory += productsOfCategory[i].sales;
      }

      return totalSalesOfCategory;
    } catch (error) {
      console.error('Error calculating total sales of category:', error.message);
      return 0;
    }
  }

  // ++++++++++ order ++++++++++++
  const [allOrders, setallOrders] = useState([])
  const getAllOrders = async () => {
    try {
      // Fetch all orders from the API
      const response = await axios.get(apiUrl + '/api/order');

      // Check if response is successful
      if (response.status !== 200) {
        throw new Error('Failed to fetch orders.');
      }

      // Set fetched orders in the state
      setallOrders(response.data);
    } catch (error) {
      // Handle errors
      console.error('Error fetching orders:', error.message);
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  }



  //+++++++++++ table ++++++++++++++
  const [allTable, setallTable] = useState([])

  const getAllTable = async () => {
    try {
      // Fetch table data from the API
      const response = await axios.get(apiUrl + '/api/table');

      // Check if response is successful and contains data
      if (response.status === 200 && response.data) {
        // console.log("Received table data:", response.data);
        // Set fetched table data in the state
        setallTable(response.data);
      } else {
        console.error("Failed to receive valid table data");
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  };


  // +++++++++++++++ user +++++++++++++
  const [allUsers, setallUsers] = useState([])
  const getAllUsers = async () => {
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
  const getAllemployees = async () => {
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

  const incrementProductQuantity = (productId) => {
    try {
      // incrementProductQuantity the count state
      setcount(count + 1);

      // Find the product either in the order or in all products
      const findProduct = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!findProduct) {
        throw new Error('Product not found.');
      }

      // incrementProductQuantity the quantity of the found product
      findProduct.quantity += 1;

      console.log(findProduct);
    } catch (error) {
      console.error('Error incrementing product quantity:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };

  const decrementProductQuantity = (productId) => {
    try {
      // Decrement the count state
      setcount(count - 1);

      // Find the product either in the order or in all products
      const findProduct = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!findProduct) {
        throw new Error('Product not found.');
      }

      // Decrease the quantity of the found product
      if (findProduct.quantity < 1) {
        findProduct.quantity = 0;
        findProduct.notes = '';
        deleteItems(productId);
      } else {
        findProduct.quantity -= 1;
      }
    } catch (error) {
      console.error('Error decrementing product quantity:', error.message);
    }
  };



  const [productNote, setproductNote] = useState('')

  const addNoteToProduct = (e, productId) => {
    try {
      e.preventDefault();

      // Find the product either in the order or in all products
      const findProduct = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!findProduct) {
        throw new Error('Product not found.');
      }

      // Update the notes of the found product
      findProduct.notes = productNote;
    } catch (error) {
      console.error('Error adding note to product:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };

  //list of items id to add & delete btn
  const [itemId, setitemId] = useState([])
  // add items to cart
  const [itemsInCart, setitemsInCart] = useState([])

  const addItemToCart = (productId) => {
    try {
      console.log(productId);

      // Find the product to add to the cart
      const cartItem = allProducts.filter(item => item._id === productId);

      // Assign the product ID to the cart item
      cartItem[0].productId = productId;

      console.log(cartItem);

      // Check if the cart is not empty
      if (itemsInCart.length > 0) {
        // Check if the item is already in the cart
        const repeatedItem = itemsInCart.filter(item => item._id === productId);
        if (repeatedItem.length === 0) {
          // Add the item to the cart if it's not already in it
          setitemsInCart([...itemsInCart, ...cartItem]);
          setitemId([...itemId, productId]);
        }
      } else {
        // Add the item to the cart if the cart is empty
        setitemsInCart([...cartItem]);
        setitemId([productId]);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };



  // delete item from cart by id

  const resetProductQuantityAndNotes = (productId) => {
    try {
      // Find the product either in the order or in all products
      const productToUpdate = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!productToUpdate) {
        throw new Error('Product not found.');
      }

      // Reset the quantity and notes of the found product to zero
      productToUpdate.quantity = 0;
      productToUpdate.notes = '';
    } catch (error) {
      console.error('Error resetting product quantity and notes:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };


  const deleteItemFromCart = (id) => {
    try {
      // Determine which list to operate on based on the presence of items in productOrderToUpdate
      const updatedList = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.filter(product => product.productid !== id) :
        itemsInCart.filter(item => item._id !== id);

      // Update the list of item IDs
      const updatedItemId = itemId.filter(itemId => itemId !== id);

      // Update the state based on the list being modified
      if (productOrderToUpdate.length > 0) {
        setproductOrderToUpdate(updatedList);
      } else {
        setitemsInCart(updatedList);
        setitemId(updatedItemId);
      }

      // Reset the quantity and notes of the deleted item
      resetProductQuantityAndNotes(id);
    } catch (error) {
      console.error('Error deleting item:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };



  // Calculate costOrder of cart item
  const [costOrder, setcostOrder] = useState(0)
  const calculateOrderCost = () => {
    try {
      let totalCost = 0;

      // Determine which list to operate on based on the presence of items in itemsInCart or productOrderToUpdate
      const itemsList = itemsInCart.length > 0 ? itemsInCart : productOrderToUpdate;

      // Calculate total cost based on the items in the list
      itemsList.forEach(item => {
        const itemTotalPrice = item.priceAfterDiscount > 0 ? item.priceAfterDiscount * item.quantity : item.price * item.quantity;
        item.totalprice = itemTotalPrice;
        totalCost += itemTotalPrice;
      });

      // Update the state with the total cost
      setcostOrder(totalCost);
    } catch (error) {
      console.error('Error calculating order cost:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };


  const createDeliveryOrderByClient = async (userId) => {
    try {
      const token = localStorage.getItem('token_u');

      // Find the user's orders
      const userOrders = allOrders.filter((order) => order.user === userId);
      const lastUserOrder = userOrders.length > 0 ? userOrders[userOrders.length - 1] : null;

      // Check if the last user order is active
      if (lastUserOrder && lastUserOrder.isActive) {
        const orderId = lastUserOrder._id;
        const oldProducts = lastUserOrder.products;
        const oldSubTotal = lastUserOrder.subTotal;
        const subTotal = costOrder + oldSubTotal;
        const deliveryCost = 10;
        const total = subTotal + deliveryCost;

        // Update order if it's in 'Preparing' status
        if (lastUserOrder.status === 'Preparing') {
          const updatedProducts = itemsInCart.map((item) => ({ ...item, isAdd: true }));
          const products = [...updatedProducts, ...oldProducts];
          const status = 'Pending';
          const orderType = 'Delivery';

          await axios.put(`${apiUrl}/api/order/${orderId}`, {
            products,
            subTotal,
            total,
            deliveryCost,
            status,
            orderType
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setitemsInCart([]);
          setitemId([]);
          getAllProducts();
          toast.success("تم اضافه الاصناف الي الاوردر!");
        } else {
          const products = [...itemsInCart, ...oldProducts];
          const status = 'Pending';
          const orderType = 'Delivery';

          await axios.put(`${apiUrl}/api/order/${orderId}`, {
            products,
            subTotal,
            total,
            deliveryCost,
            status,
            orderType
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setitemsInCart([]);
          getAllProducts();
        }

        toast.success("تم تعديل الاوردر بنجاح!");
      } else {
        // Create a new order
        const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
        const user = userId;
        const products = [...itemsInCart];
        const subTotal = costOrder;
        const deliveryCost = 10;
        const name = findUser ? findUser.username : '';
        const phone = findUser ? findUser.phone : '';
        const address = findUser ? findUser.address : '';
        const orderType = 'Delivery';
        const total = subTotal + deliveryCost;

        await axios.post(`${apiUrl}/api/order`, {
          serial,
          products,
          subTotal,
          deliveryCost,
          total,
          user,
          name,
          address,
          phone,
          orderType,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setitemsInCart([]);
        setitemId([]);
        getAllProducts();
        toast.success("تم عمل اوردر جديد بنجاح!");
      }

      socket.emit("sendorder", "socket new order created");
      setitemsInCart([]);
      setitemId([]);
    } catch (error) {
      console.error("An error occurred while processing the order:", error);
      toast.error("حدث خطأ اثناء عمل الاوردر رجاء المحاوله مره اخري");
    }
  };




  const createOrderForTableByClient = async (tableId) => {
    try {
      // Find orders for the specified table
      const tableOrders = allOrders.filter((order) => order.table === tableId);
      const lastTableOrder = tableOrders.length > 0 ? tableOrders[tableOrders.length - 1] : {};
      const lastTableOrderActive = lastTableOrder.isActive;

      if (lastTableOrderActive) {
        const orderId = lastTableOrder._id;
        const oldProducts = (allOrders.find((order) => order._id === orderId)).products;
        const oldSubTotal = (allOrders.find((order) => order._id === orderId)).subTotal;
        const status = lastTableOrder.status;
        const subTotal = costOrder + oldSubTotal;
        const total = subTotal;

        // Update the existing order
        if (status === 'Preparing') {
          const updatedProducts = itemsInCart.map((item) => ({ ...item, isAdd: true }));
          const products = [...updatedProducts, ...oldProducts];
          const newOrderData = {
            products,
            subTotal,
            total,
            status: 'Pending',
          };

          await axios.put(`${apiUrl}/api/order/${orderId}`, newOrderData);
          // Toast for updating order
          toast.success('تم تحديث الطلب بنجاح!');
        } else {
          const products = [...itemsInCart, ...oldProducts];
          const newOrderData = {
            products,
            subTotal,
            total,
            status: 'Pending',
          };

          await axios.put(`${apiUrl}/api/order/${orderId}`, newOrderData);
          // Toast for updating order
          toast.success('تم تحديث الطلب بنجاح!');
        }
      } else {
        // Create a new order
        const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
        const table = allTable.find((t) => t._id === tableId) ? tableId : null;
        const user = allUsers.find((u) => u._id === tableId) ? tableId : null;
        const products = [...itemsInCart];
        const subTotal = costOrder;
        const total = subTotal;
        const orderType = 'Internal';

        const newOrderData = {
          serial,
          products,
          subTotal,
          total,
          table,
          user,
          orderType,
        };

        await axios.post(`${apiUrl}/api/order`, newOrderData);
        // Toast for creating a new order
        toast.success('تم إنشاء طلب جديد بنجاح!');
      }

      // Reset cart items and reload products
      setitemsInCart([]);
      setitemId([]);
      getAllProducts();
    } catch (error) {
      console.error(error);
      // Toast for error
      toast.error('حدث خطأ أثناء إنشاء/تحديث الطلب');
    }
  };




  const [myOrder, setmyOrder] = useState({})
  const [listProductsOrder, setlistProductsOrder] = useState([])
  const [orderUpdateDate, setorderUpdateDate] = useState('')
  const [myOrderId, setmyOrderId] = useState()
  const [ordertax, setordertax] = useState()
  const [orderTotal, setorderTotal] = useState()
  const [orderSubtotal, setorderSubtotal] = useState()
  const [orderdeliveryCost, setorderdeliveryCost] = useState()
  const [orderdiscount, setorderdiscount] = useState(0)
  const [orderaddition, setorderaddition] = useState(0)
  const [discount, setdiscount] = useState(0)
  const [addition, setaddition] = useState(0)


  const invoice = async (clientId) => {
    if (clientId) {
      try {
        console.log(clientId);

        const tableOrder = allOrders.filter((order) => order.table == clientId);
        const lastTableOrder = tableOrder.length > 0 ? tableOrder[tableOrder.length - 1] : {};
        const lastTableOrderActive = lastTableOrder.isActive;

        const userOrder = allOrders.filter((order) => order.user == clientId);
        const lastUserOrder = userOrder.length > 0 ? userOrder[userOrder.length - 1] : {};
        const lastUserOrderActive = lastUserOrder.isActive;

        if (lastTableOrderActive) {
          const orderId = lastTableOrder._id;
          const myOrder = await axios.get(`${apiUrl}/api/order/${orderId}`);
          const data = myOrder.data;
          console.log(data);
          console.log(data._id);
          setmyOrder(data);
          setmyOrderId(data._id);
          setlistProductsOrder(data.products);
          setorderUpdateDate(data.updatedAt);
          setorderTotal(data.total);
          setorderSubtotal(data.subTotal);
          // setOrderTax(data.tax);
          setitemsInCart([]);
        } else if (lastUserOrderActive) {
          const orderId = lastUserOrder._id;
          const myOrder = await axios.get(`${apiUrl}/api/order/${orderId}`);
          const data = myOrder.data;
          console.log(data);
          setmyOrder(data);
          setmyOrderId(data._id);
          setlistProductsOrder(data.products);
          setorderUpdateDate(data.updatedAt);
          setorderTotal(data.total);
          setorderSubtotal(data.subTotal);
          // setOrderTax(data.tax);
          setOrderDeliveryCost(data.deliveryCost);
          setitemsInCart([]);
        }
      } catch (error) {
        console.error(error);
        window.alert("حدث خطأ أثناء جلب الفاتورة");
      }
    } else {
      window.alert("يرجى تسجيل الدخول أو مسح رمز الاستجابة السريعة");
    }

  };

  const checkout = async () => {
    try {
      const id = myOrderId;
      const isActive = false;
      const help = 'Requesting the bill';

      // Update order to mark it for checkout
      const updatedOrder = await axios.put(`${apiUrl}/api/order/${id}`, {
        isActive,
        help
      });

      // Show success toast after successfully marking order for checkout
      toast.success('تم طلب الحساب');

      // Redirect after 10 minutes
      setTimeout(() => {
        window.location.href = `https://${window.location.hostname}`;
      }, 60000 * 10);
    } catch (error) {
      console.log(error);
      // Show error toast if there's an issue with marking the order for checkout
      toast.error('حدث خطأ اثناء طلب الحساب ! حاول مره اخري');
    }
  };


  const createWaiterOrderForTable = async (tableId, waiterId) => {
    try {
      // Check for active orders for the table
      const tableOrder = allOrders.filter((order) => order.table === tableId);
      const lastTableOrder = tableOrder.length > 0 ? tableOrder[tableOrder.length - 1] : null;
      const lastTableOrderActive = lastTableOrder ? lastTableOrder.isActive : false;

      if (lastTableOrderActive) {
        // Update the existing order
        const orderId = lastTableOrder._id;
        const orderData = allOrders.find((order) => order._id === orderId);
        const oldProducts = orderData.products;
        const oldTotal = orderData.total;
        const newAddition = orderData.addition + addition;
        const newDiscount = orderData.discount + discount;
        const products = [...itemsInCart, ...oldProducts];
        const subTotal = costOrder + oldTotal;
        const total = subTotal + addition - discount;
        const status = 'Pending';
        const createdBy = waiterId;

        const updatedOrder = await axios.put(`${apiUrl}/api/order/${orderId}`, {
          products,
          subTotal,
          total,
          addition: newAddition,
          discount: newDiscount,
          status,
          createdBy
        });

        toast.success('تم تحديث الطلب بنجاح!');
        setitemId([]);
        setaddition(0);
        setdiscount(0);
        setitemsInCart([]);
        getAllProducts();
      } else {
        // Create a new order
        const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
        const products = [...itemsInCart];
        const subTotal = costOrder;
        const total = subTotal + addition - discount;
        const orderType = 'Internal';

        const newOrder = await axios.post(`${apiUrl}/api/order`, {
          serial,
          table: tableId,
          products,
          subTotal,
          total,
          discount,
          addition,
          orderType,
          createdBy: waiterId
        });

        toast.success('تم إنشاء طلب جديد بنجاح!');
        setitemId([]);
        setaddition(0);
        setdiscount(0);
        setitemsInCart([]);
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ. يرجى المحاولة مرة أخرى.');
    }
  };


  const [posOrderId, setposOrderId] = useState('')

  const createCasherOrder = async (casherId, clientName, clientPhone, clientAddress, orderType, deliveryCost, discount, addition) => {
    // console.log({ discount });
    // console.log({ addition });
    try {
      const dayOrders = allOrders.filter(order => new Date(order.createdAt).toDateString() === new Date().toDateString());
      const takeawayOrders = dayOrders.filter(order => order.order_type === 'Takeaway');
      const orderNum = orderType === 'Takeaway' ? takeawayOrders.length === 0 ? 1 : takeawayOrders[takeawayOrders.length - 1].orderNum + 1 : null;

      const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';

      const products = [...itemsInCart];
      const subTotal = costOrder;
      const total = deliveryCost > 0 ? subTotal + deliveryCost - discount + addition : subTotal - discount + addition;

      const name = clientName;
      const phone = clientPhone;
      const address = clientAddress;
      const createdBy = casherId;
      const orderType = orderType;
      const casher = casherId;
      const status = 'Approved';

      const newOrder = await axios.post(`${apiUrl}/api/order`, {
        serial,
        orderNum,
        products,
        subTotal,
        deliveryCost,
        discount,
        addition,
        total,
        orderType,
        createdBy,
        casher,
        name,
        phone,
        address,
        status
      });

      if (newOrder && newOrder.data._id) {
        setposOrderId(newOrder.data._id);
        toast.success('تم إنشاء الطلب بنجاح');
        setitemsInCart([]);
        setitemId([]);
        setaddition(0);
        setdiscount(0);
      } else {
        throw new Error('هناك خطأ في إنشاء الطلب');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ. يرجى المحاولة مرة أخرى');
    }
  };


  const [newlistofproductorder, setnewlistofproductorder] = useState([])
  const getOrderProductForTable = async (e, tableId) => {
    try {
      e.preventDefault();
      const tableorder = allOrders.filter((o, i) => o.table == tableId);
      const lasttableorder = tableorder.length > 0 ? tableorder[tableorder.length - 1] : [];
      const lasttableorderactive = lasttableorder.isActive;
      console.log({ lasttableorder });
      console.log({ lasttableorderactive });
      if (lasttableorderactive) {
        const id = await lasttableorder._id;
        const myOrder = await axios.get(apiUrl + '/api/order/' + id);
        const data = myOrder.data;
        console.log(data);
        console.log(data._id);
        console.log({ listProductsOrder: data.products });
        setmyOrder(data);
        setmyOrderId(data._id);
        setorderTotal(data.total);
        setorderaddition(data.addition);
        setorderdiscount(data.discount);
        setorderSubtotal(data.subTotal);
        setlistProductsOrder(data.products);
        setnewlistofproductorder(JSON.parse(JSON.stringify(data.products)));
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء جلب بيانات الطلب. يرجى المحاولة مرة أخرى.');
    }
  };


  const putNumOfPaid = (id, numOfPaid) => {
    try {
      // console.log({ numOfPaid });
      // console.log({ list_products: listProductsOrder });
      // console.log({ newlistofproductorder });

      newlistofproductorder.map((product) => {
        if (product.productid === id) {
          const oldProduct = listProductsOrder.find(pro => pro.productid === id);
          // console.log({ oldProduct });
          // console.log({ old_numOfPaid: oldProduct.numOfPaid });
          product.numOfPaid = oldProduct.numOfPaid + numOfPaid;
          // console.log({ new_numOfPaid: product.numOfPaid });
        }
      });

      // console.log({ newlistofproductorder });
      calcsubtotalSplitOrder();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating the number of paid products.');
    }
  };



  const [subtotalSplitOrder, setsubtotalSplitOrder] = useState(0);

  const calcsubtotalSplitOrder = () => {
    try {
      let total = 0;

      // Iterate over each product in the split order list
      newlistofproductorder.map((product) => {
        // Find the corresponding product in the original order list
        const oldProduct = listProductsOrder.find(pro => pro.productid === product.productid);

        // Calculate subtotal only if the number of paid items has changed
        if (oldProduct.numOfPaid !== product.numOfPaid) {
          // Calculate the difference in the number of paid items
          const newNumOfPaid = Math.abs(oldProduct.numOfPaid - product.numOfPaid);

          // Calculate the subtotal based on the number of paid items and the product price
          const subTotal = product.priceAfterDiscount > 0 ? newNumOfPaid * product.priceAfterDiscount : oldProduct.price * newNumOfPaid;

          // Accumulate the subtotal to the total
          total += subTotal;
        }
      });

      // Set the calculated total as the subtotal for the split order
      setsubtotalSplitOrder(total);
    } catch (error) {
      // Log any errors that occur during the calculation
      console.error(error);

      // Display an error toast message
      toast.error('حدث خطأ أثناء حساب المجموع للطلب المقسم.');
    }
  };


  // Function to split the invoice and pay a portion of it
  const splitInvoice = async (e) => {
    try {
      e.preventDefault();

      // Send a PUT request to update the order with split details
      const updateOrder = await axios.put(`${apiUrl}/api/order/${myOrderId}`, {
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




  const lastInvoiceByCasher = async (checkid) => {
    try {
      // Filter orders created by the employee
      const employeeOrders = allOrders.filter((o, i) => o.createBy == checkid);

      // Get the last order created by the employee
      const lastEmployeeOrder = employeeOrders.length > 0 ? employeeOrders[employeeOrders.length - 1] : null;

      // Check if the last employee order is active
      const lastEmployeeOrderActive = lastEmployeeOrder ? await lastEmployeeOrder.isActive : false;

      if (lastEmployeeOrderActive) {
        // If the order is active, fetch its details
        const orderId = lastEmployeeOrder._id;
        const response = await axios.get(apiUrl + '/api/order/' + orderId);
        const orderData = response.data;

        // Update states with order details
        setmyOrder(orderData);
        setmyOrderId(orderData._id);
        setlistProductsOrder(orderData.products);
        setorderUpdateDate(orderData.updatedAt);
        setorderTotal(orderData.total);
        setorderaddition(orderData.addition);
        setorderdiscount(orderData.discount);
        setorderSubtotal(orderData.subTotal);
        setorderdeliveryCost(orderData.deliveryCost);
        setitemsInCart([]);
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error(error);

      // Display an error toast message
      toast.error('An error occurred while fetching the invoice.');
    }
  };




  const updatecountofsales = async (id) => {
    const myOrder = await axios.get(apiUrl + '/api/order/' + id,)
    const data = myOrder.data
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
    try {
      // Filter orders for the specified table
      const tableOrders = allOrders.filter((o, i) => o.table == tablenum);

      // Get the last order for the table
      const lastTableOrder = tableOrders.length > 0 ? tableOrders[tableOrders.length - 1] : null;

      // Check if the last table order is active
      const lastTableOrderActive = lastTableOrder ? await lastTableOrder.isActive : false;

      // Initialize variables for order ID and serial number
      let id, serial;

      // If the last table order is not active, create a new order
      if (!lastTableOrderActive) {
        // Generate a new serial number for the order
        serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';

        // Define the help request message
        const help = 'Requests assistance';

        // Define the table for the new order
        const table = tablenum;

        // Create a new order with the help request
        const newOrder = await axios.post(apiUrl + '/api/order/', { serial, table, help });

        console.log(newOrder);
      } else {
        // If the last table order is active, update the existing order with the help request
        id = lastTableOrder._id;
        const help = 'Requests assistance';
        const updatedOrder = await axios.put(apiUrl + '/api/order/' + id, { help });
        console.log(updatedOrder);
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error(error);

      // Display an error toast message
      toast.error('An error occurred while requesting assistance.');
    }
  };



  const usertitle = (id) => {
    if (!id) return null; // Handle edge case where id is falsy

    // Check if id corresponds to a table
    const table = allTable ? allTable.find((table) => table._id === id) : null;
    if (table) return table.tablenum;

    // Check if id corresponds to a user
    const user = allUsers ? allUsers.find((user) => user._id === id) : null;
    if (user) return user.username;

    // Check if id corresponds to an employee
    const employee = allemployees ? allemployees.find((employee) => employee._id === id) : null;
    if (employee) return employee.username;

    return null; // Handle case where id doesn't match any entity
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
        toast.error('هناك حقول فارغة.');
        return;
      }

      // Check if passwords match if passconfirm is provided
      if (passconfirm !== undefined && password !== passconfirm) {
        toast.error('كلمة المرور غير متطابقة.');
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
        toast.success('تم إنشاء الحساب بنجاح!');
        // Perform actions with accessToken or newUser if needed
      }
    } catch (error) {
      // Handle signup error
      console.error('Signup error:', error);
      toast.error('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
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
    console.log({ phone, password });

    try {
      // Check if phone and password are provided
      if (!phone || !password) {
        toast.error('رقم الموبايل أو كلمة السر غير مُقدمة.');
        return;
      }

      // Make a POST request to login endpoint
      const response = await axios.post(apiUrl + '/api/auth/login', { phone, password });

      // Handle response data
      if (response && response.data) {
        const { accessToken, findUser } = response.data;

        // Check if user is active and token is provided
        if (accessToken && findUser.isActive) {
          // Store access token in local storage
          localStorage.setItem('token_u', accessToken);
          // Retrieve user info from token if needed
          getUserInfoFromToken();
          // Update login state
          setisLogin(!isLogin);
          toast.success('تم تسجيل الدخول!');
        } else {
          toast.error('هذا المستخدم غير نشط. الرجاء الاتصال بنا.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle different error scenarios
      if (error.response && error.response.status === 404) {
        toast.error('رقم الهاتف غير مسجل.');
      } else if (error.response && error.response.status === 401) {
        toast.error('كلمة السر غير صحيحة.');
      } else {
        toast.error('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
      }
    }
  };




  const adminLogin = async (e, phone, password) => {
    e.preventDefault();

    // Input validation
    if (!phone || !password) {
      toast.error('Phone number and password are required');
      return;
    }

    try {
      // Send login request
      const response = await axios.post(apiUrl + '/api/employee/login', {
        phone,
        password,
      });

      // Handle response
      if (response && response.data) {
        const { data } = response;

        // Display response message
        toast.success('تم تسجيل الدخول بنجاح');

        if (data.accessToken) {
          localStorage.setItem('token_e', data.accessToken);
          // Retrieve user info from token if needed
          const userInfo = getUserInfoFromToken();
          console.log(userInfo);
        }

        // Redirect to management page if employee is active
        if (data.findEmployee.isActive === true) {
          window.location.href = `https://${window.location.hostname}/management`;
        } else {
          toast.error('غير مسموح لك بالدخول');
        }
      }
    } catch (error) {
      console.error(error);

      // Display error message from server response
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('حدث خطأ. الرجاء المحاولة مرة أخرى.');
      }
    }
  };


  const logout = () => {
    try {
      // Remove user token from local storage
      localStorage.removeItem('token_u');

      // Redirect to home page
      window.location.href = `https://${window.location.hostname}`;
    } catch (error) {
      // Handle any potential errors
      console.error('Logout error:', error);
      // Display a notification to the user about the error
      alert('حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.');
    }
  }

  const employeelogout = () => {
    try {
      // Remove admin token from local storage

      localStorage.removeItem('token_e');
      window.location.href = `https://${window.location.hostname}/login`;
    } catch (error) {
      // Handle any potential errors
      console.error('Logout error:', error);
      // Display a notification to the user about the error
      alert('حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.');
    }
  }


  //######### get order ditalis by serial 
  const [OrderDetalisBySerial, setOrderDetalisBySerial] = useState({})
  const [productOrderToUpdate, setproductOrderToUpdate] = useState([])
  // Fetch orders from API
  const getOrderDetailsBySerial = async (e, serial) => {
    e.preventDefault();
    try {
      // Fetch all orders
      const res = await axios.get(apiUrl + '/api/order');

      // Filter active orders
      const activeOrders = res.data.filter(o => o.isActive === true);

      // Find the order with the provided serial number
      const order = activeOrders.find(o => o.serial === serial);

      // Set order details and update states
      setOrderDetailsBySerial(order);
      setProductOrderToUpdate(order.products);
      setAddition(order.addition);
      setDiscount(order.discount);
    } catch (error) {
      // Handle error
      console.error('Error fetching order details:', error);
      // Display a notification to the user about the error
      toast('حدث خطأ أثناء جلب تفاصيل الطلب. يرجى المحاولة مرة أخرى.');
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
      console.log({ updatelist: productOrderToUpdate })

      const updatedOrder = await axios.put(apiUrl + '/api/order/' + id, {
        products: productOrderToUpdate,
        subTotal,
        discount,
        addition,
        total,
      })
      if (updatedOrder) {
        setOrderDetalisBySerial({})
        setproductOrderToUpdate([])
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
    getAllProducts()
    getAllCategories()
    getAllOrders()
    getAllTable();
    getAllUsers();
    getAllemployees()
  }, [])



  // useEffect(() => {
  //   Payment_pending_orders()
  // }, [allOrders])

  useEffect(() => {
    calculateOrderCost()
    getAllTable();
    getAllUsers();
    getAllOrders()
    getUserInfoFromToken()
    // calcsubtotalSplitOrder()
    // Payment_pending_orders()

  }, [count, itemsInCart, productOrderToUpdate, isLogin])

  return (
    <detacontext.Provider value={{
      // Functions related to authentication
      userLoginInfo, employeeLoginInfo, getUserInfoFromToken, login, signup, logout, adminLogin, employeelogout,

      // Functions related to products and categories
      allProducts, allcategories, filterByCategoryId, setcategoryid, deleteItemFromCart,

      // Functions related to users, tables, and orders
      allUsers, allTable, usertitle, allOrders, askingForHelp,

      // Functions related to manipulating product details
      setproductNote, addNoteToProduct,

      // Functions related to order processing and calculations
      invoice, listProductsOrder, orderUpdateDate, myOrder,
      categoryid, itemsInCart, costOrder,
      addItemToCart, setitemsInCart, incrementProductQuantity, decrementProductQuantity,
      getOrderProductForTable, setdiscount, setaddition, discount, addition, orderaddition, orderdiscount,

      // Functions related to creating different types of orders
      checkout, calcTotalSalesOfCategory, updatecountofsales,
      createWaiterOrderForTable, createCasherOrder, lastInvoiceByCasher,

      // Functions related to pagination
      EditPagination, startpagination, endpagination, setstartpagination, setendpagination,

      // Other utility functions or state variables
      itemId, setitemId, showDate,
      orderTotal, orderSubtotal, ordertax, orderdeliveryCost, setorderdeliveryCost,
      createOrderForTableByClient, createDeliveryOrderByClient,

      OrderDetalisBySerial, getOrderDetailsBySerial, updateOrder, productOrderToUpdate,
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