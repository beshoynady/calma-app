import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Userscreen from './screens/user.screen/Userscreen';
import ManagLayout from './screens/management/ManagLayout';
import ManagerDash from './screens/management/manag.component/managerdash/ManagerDash';
import Info from './screens/management/manag.component/setting/info';
import Orders from './screens/management/manag.component/orders/Orders';
import Products from './screens/management/manag.component/products/Products';

import Tables from './screens/management/manag.component/tables/Tables';
import TablesPage from './screens/management/manag.component/tables/TablesPage';
import ReservationTables from './screens/management/manag.component/tables/ReservationTables';

import Employees from './screens/management/manag.component/employees/Employees';
import PermissionsComponent from './screens/management/manag.component/employees/Permissions';
import EmployeesSalary from './screens/management/manag.component/employees/EmployeesSalary';
import PayRoll from './screens/management/manag.component/employees/PayRoll';
import AttendanceManagement from './screens/management/manag.component/employees/attendance';

import Category from './screens/management/manag.component/category/Category';
import CategoryStock from './screens/management/manag.component/stock/CategoryStock';
import Kitchen from './screens/management/manag.component/kitchen/Kitchen';
import Waiter from './screens/management/manag.component/waiter/Waiter';
import DeliveryMan from './screens/management/manag.component/deliveryman/DeliveryMan';
import Login from './screens/management/manag.component/login/Login';
import POS from './screens/management/manag.component/pos/POS';

import Suppliers from './screens/management/manag.component/suppliers/Suppliers';
import Purchase from './screens/management/manag.component/suppliers/Purchase';
import PurchaseReturn from './screens/management/manag.component/suppliers/PurchaseReturn';
import SupplierTransaction from './screens/management/manag.component/suppliers/SupplierTransaction';
import StockItem from './screens/management/manag.component/stock/StockItem';
import StockManag from './screens/management/manag.component/stock/StockManag';
import ProductRecipe from './screens/management/manag.component/products/ProductRecipe';

import ExpenseItem from './screens/management/manag.component/expenses/Expense';
import DailyExpense from './screens/management/manag.component/expenses/dailyExpense';
import CashRegister from './screens/management/manag.component/cash/CashRegister';
import CashMovement from './screens/management/manag.component/cash/CashMovement';
import Users from './screens/management/manag.component/users/Users';
import CustomerMessage from './screens/management/manag.component/users/CustomerMessage';
import KitchenConsumption from './screens/management/manag.component/stock/KitchenConsumption';

// import io from 'socket.io-client';
// const socket = io(process.env.REACT_APP_API_URL, {
//   reconnection: true,
// });


export const detacontext = createContext({});

function App() {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const [isLoadiog, setisLoadiog] = useState(false)
  axios.defaults.withCredentials = true;

  // Reataurant data //
  const [restaurantData, setrestaurantData] = useState({})
  const getRestaurant = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/restaurant/`, config);
      if (response.status === 200 && response.data.length > 0) {
        const restaurantData = response.data[0];
        console.log({ restaurantData });
        setrestaurantData(restaurantData);
        // toast.success('تم جلب بيانات المطعم بنجاح!');
      } else {
        toast.error('لم يتم العثور على بيانات المطعم..');
        throw new Error('لم يتم العثور على بيانات المطعم.');
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      toast.error('حدث خطأ أثناء جلب بيانات المطعم.');
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    return formattedTime;
  };
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    // Get the hour and minutes
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Convert the hour to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12-hour format 12 denotes noon

    // Add leading zero to hours and minutes if less than 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Format the time
    const formattedTime = hours + ':' + minutes + ' ' + ampm;

    // Format the date
    const formattedDate = date.toLocaleDateString();

    return formattedDate + ' ' + formattedTime;
  };

  //+++++++++++++++++ product ++++++++++++++++++++
  const [allProducts, setallProducts] = useState([])

  const getAllProducts = async () => {
    try {
      // Fetch products from the API
      const response = await axios.get(apiUrl + '/api/product');

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
      const response = await axios.get(apiUrl + '/api/category', config);

      // Check if response is successful
      if (response.status !== 200) {
        throw new Error('Failed to fetch categories.');
      }
      const activeCategories = await response.data.filter(category => category.status === true);
      // Set fetched categories in the state
      console.log({ activeCategories })

      setallcategories(activeCategories);

      const mainCategory = activeCategories.filter(category => category.isMain === true)[0]
      if (mainCategory) {
        setcategoryid(mainCategory._id)
      }
    } catch (error) {
      // Handle errors
      console.error('Error fetching categories:', error.message);
      // You can add additional error handling logic here, such as displaying an error message to the user.
    }
  }



  // const calcTotalSalesOfCategory = (id) => {
  //   try {
  //     let totalSalesOfCategory = 0;

  //     // Filter products based on the category ID
  //     const productsOfCategory = allProducts.filter((product) => product.category === id);

  //     // Calculate total sales
  //     for (let i = 0; i < productsOfCategory.length; i++) {
  //       totalSalesOfCategory += productsOfCategory[i].sales;
  //     }

  //     return totalSalesOfCategory;
  //   } catch (error) {
  //     console.error('Error calculating total sales of category:', error.message);
  //     return 0;
  //   }
  // }

  // ++++++++++ order ++++++++++++
  const [allOrders, setallOrders] = useState([])
  const getAllOrders = async () => {
    try {
      // Fetch all orders from the API
      const response = await axios.get(apiUrl + '/api/order', {
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });

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
      const response = await axios.get(apiUrl + '/api/table', { timeout: 5000 });
      if (response.status === 200 && response.data) {
        setallTable(response.data);
      } else {
        console.error("Failed to receive valid table data");
      }
    } catch (error) {
      // إعادة المحاولة عند حدوث خطأ
      if (error.code === 'ECONNABORTED') {
        console.error("Request timed out, retrying...");
        setTimeout(getAllTable, 3000);
      } else {
        console.error("Error fetching table data:", error);
      }
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
      if (!token) {
        // Handle case where token is not available
        throw new Error('توكن غير متاح');
      }
      const response = await axios.get(`${apiUrl}/api/employee`, config);

      if (response.status === 200) {
        setallemployees(response.data);
        console.log('Employees data fetched successfully:', response.data);
      } else {
        console.error('Failed to fetch employees data: Unexpected response status', response.status);
        // يمكنك إطلاق استثناء هنا أو عرض رسالة خطأ للمستخدم
      }
    } catch (error) {
      console.error('Error fetching employees data:', error);
      // يمكنك إطلاق استثناء هنا أو عرض رسالة خطأ للمستخدم
    }
  };





  // ++++++++ client screen +++++++++++++ 
  const [categoryid, setcategoryid] = useState('')

  const filterByCategoryId = (e) => {
    // console.log(e.target.value)
    setcategoryid(e.target.value)
  }



  const [count, setcount] = useState(0)
  // const incrementProductQuantity = (productId) => {
  //   try {
  //     // incrementProductQuantity the count state
  //     setcount(count + 1);

  //     // Find the product either in the order or in all products
  //     const findProduct = productOrderToUpdate.length > 0 ?
  //       productOrderToUpdate.find(product => product._id === productId) :
  //       allProducts.find(product => product._id === productId);

  //     if (!findProduct) {
  //       throw new Error('Product not found.');
  //     }

  //     // incrementProductQuantity the quantity of the found product
  //     findProduct.quantity += 1;

  //     console.log(findProduct);
  //   } catch (error) {
  //     console.error('Error incrementing product quantity:', error.message);
  //     // You can handle the error appropriately, such as displaying an error message to the user.
  //   }
  // };

  // const decrementProductQuantity = (productId) => {
  //   try {
  //     // Decrement the count state
  //     setcount(count - 1);

  //     // Find the product either in the order or in all products
  //     const findProduct = productOrderToUpdate.length > 0 ?
  //       productOrderToUpdate.find(product => product._id === productId) :
  //       allProducts.find(product => product._id === productId);

  //     if (!findProduct) {
  //       throw new Error('Product not found.');
  //     }

  //     // Decrease the quantity of the found product
  //     if (findProduct.quantity < 1) {
  //       findProduct.quantity = 0;
  //       findProduct.notes = '';
  //       deleteItemFromCart(productId);
  //     } else {
  //       findProduct.quantity -= 1;
  //     }
  //   } catch (error) {
  //     console.error('Error decrementing product quantity:', error.message);
  //   }
  // };

  const incrementProductQuantity = (productId, sizeId) => {
    try {
      // incrementProductQuantity the count state
      setcount(count + 1);
      console.log({ productOrderToUpdate, productId, sizeId })
      // Find the product either in the order or in all products
      const findProduct = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!findProduct) {
        throw new Error('Product not found.');
      }

      if (sizeId) {
        findProduct.sizes.map(size => {
          if (size._id === sizeId) {
            // incrementProductQuantity the quantity of the found product
            size.sizeQuantity += 1;
          }
        })
        itemsInCart.map(item => {
          if (item.productid === productId && item.sizeId === sizeId) {
            item.quantity += 1;
          }
        })
      } else {
        // incrementProductQuantity the quantity of the found product
        findProduct.quantity += 1;
        itemsInCart.map(item => {
          if (item.productid === productId) {
            item.quantity += 1;
          }
        })
      }

      console.log(findProduct);
      console.log(itemsInCart);
    } catch (error) {
      console.error('Error incrementing product quantity:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };


  const decrementProductQuantity = (productId, sizeId) => {
    try {
      // Decrement the count state
      setcount(count - 1);

      // Find the product either in the order or in all products
      const findProduct = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      console.log({ findProduct })
      if (!findProduct) {
        throw new Error('Product not found.');
      }

      if (sizeId) {
        findProduct.sizes.map(size => {
          if (size._id === sizeId) {
            // incrementProductQuantity the quantity of the found product
            if (size.sizeQuantity < 2) {
              size.sizeQuantity = 0;
              findProduct.notes = '';
              deleteItemFromCart(productId, sizeId);
            } else {
              size.sizeQuantity -= 1;

            }
          }
        })
        itemsInCart.map(item => {
          if (item.productid === productId) {
            // incrementProductQuantity the quantity of the found product
            if (item.quantity < 2) {
              item.quantity = 0;
              findProduct.notes = '';
              deleteItemFromCart(productId, sizeId);
            } else {
              item.quantity -= 1;
            }
          }
        })
      } else {
        // incrementProductQuantity the quantity of the found product
        if (findProduct.quantity < 2) {
          findProduct.quantity = 0;
          findProduct.notes = '';
          deleteItemFromCart(productId);

        } else {
          findProduct.quantity -= 1;
          itemsInCart.map(item => {
            if (item.productid === productId) {
              item.quantity -= 1;
            }
          })
        }

      }


    } catch (error) {
      console.error('Error decrementing product quantity:', error.message);
    }
  };



  const [productNote, setproductNote] = useState('')


  const addNoteToProduct = (e, productId, sizeId) => {
    try {
      e.preventDefault();
      console.log({ productNote, productId, sizeId })
      // Find the product either in the order or in all products
      const findProduct = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!findProduct) {
        throw new Error('Product not found.');
      }

      if (sizeId) {
        findProduct.sizes.map(size => {
          if (size._id === sizeId) {
            // incrementProductQuantity the quantity of the found product
            size.notes = productNote;
          }
        })
        itemsInCart.map(item => {
          if (item.productid === productId && item.sizeId === sizeId) {
            item.notes = productNote;
          }
        })
      } else {
        // incrementProductQuantity the quantity of the found product
        findProduct.notes = productNote;
        itemsInCart.map(item => {
          if (item.productid === productId) {
            item.notes = productNote;
          }
        })
      }

      console.log(findProduct);
      console.log(itemsInCart);
    } catch (error) {
      console.error('Error incrementing product quantity:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };



  const [productExtras, setproductExtras] = useState([])
  
  const handleAddProductExtras = (extra, ind) => {
    const newExtras = [...productExtras];
    
    if (newExtras.length > 0) {
      if (newExtras[ind]) {
        const existingExtra = newExtras[ind];
        
        if (existingExtra.extraId.includes(extra._id)) {
          existingExtra.extraId = existingExtra.extraId.filter(id => id !== extra._id);
          existingExtra.priceExtras -= extra.price; // تخفيض السعر بسعر الإضافة المزيلة
        } else {
          // إذا لم تكن الإضافة موجودة، قم بإضافتها
          existingExtra.extraId.push(extra._id);
          existingExtra.priceExtras += extra.price; // زيادة السعر بسعر الإضافة المضافة
        }
      } else {
        // إذا لم يكن هناك إضافات للمنتج بعد، قم بإنشاء إدخال جديد
        newExtras[ind] = {
          extraId: [extra._id],
          priceExtras: extra.price
        };
      }
    } else {
      // إذا كانت المصفوفة فارغة بالكامل، قم بإنشاء إدخال جديد
      newExtras[ind] = {
        extraId: [extra._id],
        priceExtras: extra.price
      };
    }
    
    setproductExtras(newExtras);
  };
  


  const addExtrasToProduct = (e, productId, sizeId) => {
    e.preventDefault();
    console.log({ productId, sizeId , productExtras})
    if (productExtras.length<1) {
      return
    }
    try {
      // Find the product either in the order or in all products
      const findProduct = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!findProduct) {
        throw new Error('Product not found.');
      }

      if (sizeId) {
        findProduct.sizes.map(size => {
          if (size._id === sizeId) {
            // incrementProductQuantity the quantity of the found product
            size.extrasSelected = productExtras;
          }
        })
        itemsInCart.map(item => {
          if (item.productid === productId && item.sizeId === sizeId) {
            item.extrasSelected = productExtras;
          }
        })
      } else {
        // incrementProductQuantity the quantity of the found product
        findProduct.extrasSelected = productExtras;
        itemsInCart.map(item => {
          if (item.productid === productId) {
            item.extrasSelected = productExtras;
          }
        })
      }

      console.log(findProduct);
      console.log(itemsInCart);
      setproductExtras([])
    } catch (error) {
      console.error('Error incrementing product quantity:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };


  const [itemId, setitemId] = useState([]);
  const [itemsInCart, setitemsInCart] = useState([]);

  const addItemToCart = (productId, sizeId) => {
    try {
      // Find the product to add to the cart
      const cartItem = allProducts.find(item => item._id === productId);

      console.log({ cartItem });
      if (cartItem) {
        let newItem = {
          productid: cartItem._id,
          name: cartItem.name,
          quantity: 0, // Default to adding one item
          notes: '',
          price: 0,
          priceAfterDiscount: 0,
        };

        if (sizeId && cartItem.sizes && cartItem.sizes.length > 0) {
          const size = cartItem.sizes.find(size => size._id === sizeId);
          console.log({ size });
          if (size) {
            newItem.sizeId = size._id;
            newItem.size = size.sizeName;
            newItem.price = size.sizePrice;
            newItem.quantity = size.sizeQuantity;
            newItem.priceAfterDiscount = size.sizePriceAfterDiscount;
            newItem.notes = size.notes?size.notes:''
            newItem.extras = size.extrasSelected?size.extrasSelected:[]
          }
        } else {
          newItem.quantity = cartItem.quantity; // Set default quantity for products without sizes
          newItem.price = cartItem.price;
          newItem.priceAfterDiscount = cartItem.priceAfterDiscount;
          newItem.notes = cartItem.notes?cartItem.notes :''             
          newItem.extras = cartItem.extrasSelected?cartItem.extrasSelected:[]             


        }

        console.log({ newItem });
        if (itemsInCart.length > 0) {
          if (sizeId) {
            const repeatedItem = itemsInCart.find(item => item.productid === productId && item.sizeId === sizeId);
            if (!repeatedItem) {
              setitemsInCart([...itemsInCart, newItem]);
              setitemId([...itemId, sizeId]);
            }
          } else {
            const repeatedItem = itemsInCart.find(item => item.productid === productId);
            if (!repeatedItem) {
              setitemsInCart([...itemsInCart, newItem]);
              setitemId([...itemId, productId]);
            }
          }
        } else {
          setitemsInCart([newItem]);
          setitemId([sizeId ? sizeId : productId]);
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error.message);
    }
  };



  // delete item from cart by id

  const resetProductQuantityAndNotes = (productId, sizeId) => {
    try {
      // Find the product either in the order or in all products
      const productToUpdate = productOrderToUpdate.length > 0 ?
        productOrderToUpdate.find(product => product._id === productId) :
        allProducts.find(product => product._id === productId);

      if (!productToUpdate) {
        throw new Error('Product not found.');
      }

      if (sizeId) {
        productToUpdate.sizes.filter(size => size._id === sizeId)[0].sizeQuantity = 0
      }
      console.log({ productToUpdate })
      // Reset the quantity and notes of the found product to zero
      productToUpdate.quantity = 0;
      productToUpdate.notes = '';
    } catch (error) {
      console.error('Error resetting product quantity and notes:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };


  const deleteItemFromCart = (id, sizeId) => {
    try {
      if (sizeId) {

        console.log({ itemsInCart })
        // Determine which list to operate on based on the presence of items in productOrderToUpdate
        const updatedList = productOrderToUpdate.length > 0 ?
          productOrderToUpdate.filter(product => product.sizeId !== sizeId) :
          itemsInCart.filter(item => item.sizeId !== sizeId);

        // Update the list of item IDs
        const updatedItemId = itemId.filter(itemId => itemId !== sizeId);

        console.log({ updatedItemId })
        console.log({ itemsInCart })
        // Update the state based on the list being modified
        if (productOrderToUpdate.length > 0) {
          setproductOrderToUpdate(updatedList);
        } else {
          setitemsInCart(updatedList);
          setitemId(updatedItemId);
        }

        // Reset the quantity and notes of the deleted item
        resetProductQuantityAndNotes(id, sizeId);
      } else {

        console.log({ itemsInCart })
        // Determine which list to operate on based on the presence of items in productOrderToUpdate
        const updatedList = productOrderToUpdate.length > 0 ?
          productOrderToUpdate.filter(product => product.productid !== id) :
          itemsInCart.filter(item => item.productid !== id);

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
        resetProductQuantityAndNotes(id, sizeId);
      }
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
        let totalExtras = 0;  // Reset totalExtras for each item
        const itemTotalPrice = item.priceAfterDiscount > 0 ? item.priceAfterDiscount * item.quantity : item.price * item.quantity;
  
        if (item.extras.length > 0) {
          item.extras.forEach(extra => {
            if (extra) {
              totalExtras += extra.priceExtras;
            }
          });
        }
  
        item.totalprice = itemTotalPrice + totalExtras;
        totalCost += item.totalprice;
      });
  
      console.log({ totalCost });
      // Update the state with the total cost
      setcostOrder(totalCost);
    } catch (error) {
      console.error('Error calculating order cost:', error.message);
      // You can handle the error appropriately, such as displaying an error message to the user.
    }
  };
  


  const createDeliveryOrderByClient = async (userId, currentAddress, delivery_fee) => {
    try {
      console.log({ itemsInCart })
      // Find the user's orders
      const userOrders = allOrders.filter((order) => order.user === userId);
      const lastUserOrder = userOrders.length > 0 ? userOrders[userOrders.length - 1] : null;

      // Check if the last user order is active
      if (lastUserOrder && lastUserOrder.isActive) {
        const orderId = lastUserOrder._id;
        const oldProducts = lastUserOrder.products;
        const oldSubTotal = lastUserOrder.subTotal;
        const subTotal = costOrder + oldSubTotal;
        const deliveryCost = delivery_fee;
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
          }, config);

          setitemsInCart([]);
          setitemId([]);
          getAllProducts();
          // socket.emit("sendorder", `اضافه طلبات الي اوردر ديليفري`);

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
          }, config);

          setitemsInCart([]);
          getAllProducts();
        }
        // socket.emit("sendorder", `تم تعديل ارودر ديفرري`);

        toast.success("تم تعديل الاوردر بنجاح!");
      } else {
        // Create a new order
        const serial = allOrders.length > 0 ? String(Number(allOrders[allOrders.length - 1].serial) + 1).padStart(6, '0') : '000001';
        const findUser = allUsers.find((u, i) => u._id == userId);
        const user = findUser ? userId : null;
        const products = [...itemsInCart];
        const subTotal = costOrder;
        const deliveryCost = delivery_fee;
        const name = findUser ? findUser.username : '';
        const phone = findUser ? findUser.phone : '';
        const address = currentAddress;
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
        }, config);

        setitemsInCart([]);
        setitemId([]);
        getAllProducts();
        toast.success("تم عمل اوردر جديد بنجاح!");
      }

      // socket.emit("sendorder", `اوردر ديليفري جديد`);
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
          // socket.emit("sendorder", ` اضافت طاولة${lastTableOrderActive.tableNumber} طلبات جديدة`);


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
          // socket.emit("sendorder", ` اضافت طاولة${lastTableOrderActive.tableNumber} طلبات جديدة`);

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
        // socket.emit("sendorder", `اوردر جديد علي طاوله ${table.tableNumber}`);

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
  const [tablenum, settablenum] = useState()
  const [ordertax, setordertax] = useState()
  const [orderTotal, setorderTotal] = useState()
  const [orderSubtotal, setorderSubtotal] = useState()
  const [orderDeliveryCost, setorderDeliveryCost] = useState()
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
          settablenum(data.tableNumber)
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
          setorderDeliveryCost(data.deliveryCost);
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
      // socket.emit("sendorder", `  طاولة${tablenum} تطلب الحساب`);

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
        }, config);

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
        }, config);

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
      const takeawayOrders = dayOrders.filter(order => order.orderType === 'Takeaway');
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
      }, config);

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
        // console.log({ JSONlistProductsOrder: JSON.parse(JSON.stringify(data.products)) });

      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء جلب بيانات الطلب. يرجى المحاولة مرة أخرى.');
    }
  };


  const putNumOfPaid = (id, numOfPaid) => {
    try {
      console.log({ id });
      console.log({ numOfPaid });
      console.log({ list_products: listProductsOrder });
      console.log({ newlistofproductorder });

      newlistofproductorder.map((product) => {
        if (product.productid === id) {
          const oldProduct = listProductsOrder.find(pro => pro.productid === id);
          console.log({ oldProduct });
          console.log({ old_numOfPaid: oldProduct.numOfPaid });
          product.numOfPaid = oldProduct.numOfPaid + numOfPaid;
          console.log({ new_numOfPaid: product.numOfPaid });
        }
      });

      console.log({ newlistofproductorder });
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
      console.log({ newlistofproductorder })
      newlistofproductorder.map((product) => {
        // Find the corresponding product in the original order list
        const oldProduct = listProductsOrder.find(pro => pro.productid === product.productid);
        console.log({ oldProduct })
        // Calculate subtotal only if the number of paid items has changed
        if (oldProduct.numOfPaid !== product.numOfPaid) {
          // Calculate the difference in the number of paid items
          const newNumOfPaid = Math.abs(oldProduct.numOfPaid - product.numOfPaid);

          // Calculate the subtotal based on the number of paid items and the product price
          const subTotal = product.priceAfterDiscount > 0 ? newNumOfPaid * product.priceAfterDiscount : oldProduct.price * newNumOfPaid;
          console.log({ subTotal })

          // Accumulate the subtotal to the total
          total += subTotal;
        }
      });

      // Set the calculated total as the subtotal for the split order

      console.log({ total })
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
        console.log({ updateOrder })
        // Display a success toast message upon successful payment
        toast.success("تم دفع جزء من الفاتورة بنجاح");

        // Log the updated order details
        // console.log({ updateOrder });
      }
    } catch (error) {
      // Display an error toast message if payment fails
      toast.error("حدث خطأ أثناء دفع جزء من الفاتورة");

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
        setorderDeliveryCost(orderData.deliveryCost);
        setitemsInCart([]);
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.error(error);

      // Display an error toast message
      toast.error('An error occurred while fetching the invoice.');
    }
  };




  // const updatecountofsales = async (id) => {
  //   const myOrder = await axios.get(apiUrl + '/api/order/' + id,)
  //   const data = myOrder.data
  //   for (var i = 0; i < data.products.length; i++) {
  //     const productid = await data.products[i]._id
  //     const productquantity = await data.products[i].quantity
  //     const findprduct = await axios.get(apiUrl + '/api/product/' + productid)
  //     const sales = await findprduct.data.sales + productquantity

  //     // console.log(productid)
  //     // console.log(findprduct)
  //     // console.log(sales)
  //     // console.log(productquantity)
  //     const updatprduct = await axios.put(apiUrl + '/api/product/withoutimage/' + productid, {
  //       sales
  //     })
  //     // console.log(updatprduct)

  //   }
  // }



  const askingForHelp = async (tableNumber) => {
    try {
      // Filter orders for the specified table
      const tableOrders = allOrders.filter((o, i) => o.table == tableNumber);

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
        const table = tableNumber;

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
    if (table) return table.tableNumber;

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


  const [isLogin, setisLogin] = useState(false);





  const [userLoginInfo, setUserLoginInfo] = useState(null);
  const [employeeLoginInfo, setEmployeeLoginInfo] = useState(null);

  const [clientInfo, setclientInfo] = useState({})

  // Function to retrieve user info from tokens
  const getUserInfoFromToken = async () => {
    const userToken = localStorage.getItem('token_u');
    const employeeToken = localStorage.getItem('token_e');
    // console.log("getUserInfoFromToken");
    // console.log({ userToken });

    let decodedToken = null;

    if (employeeToken) {
      decodedToken = jwt_decode(employeeToken);
      setEmployeeLoginInfo(decodedToken);
      console.log(decodedToken.employeeinfo);
    }

    if (userToken) {
      decodedToken = await jwt_decode(userToken);
      setUserLoginInfo(decodedToken);
      console.log({ decodedToken });
      if (decodedToken) {
        const userId = await decodedToken.userinfo.id
        console.log({ userId });
        if (userId) {
          const client = await axios.get(`${apiUrl}/api/user/${userId}`)
          console.log({ client });
          setclientInfo(client.data);
        }
      }
    }

    if (!employeeToken && !userToken) {
      setUserLoginInfo(null);
      setEmployeeLoginInfo(null);
    }
  };




  // const employeelogout = () => {
  //   try {
  //     // Remove admin token from local storage

  //     localStorage.removeItem('token_e');
  //     window.location.href = `https://${window.location.hostname}/login`;
  //   } catch (error) {
  //     // Handle any potential errors
  //     console.error('Logout error:', error);
  //     // Display a notification to the user about the error
  //     alert('حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.');
  //   }
  // }


  //######### get order ditalis by serial 
  const [orderDetalisBySerial, setorderDetalisBySerial] = useState({})
  const [productOrderToUpdate, setproductOrderToUpdate] = useState([])
  // Fetch orders from API
  const getorderDetailsBySerial = async (e, serial) => {
    e.preventDefault();
    try {
      // Fetch all orders
      const res = await axios.get(apiUrl + '/api/order');

      // Filter active orders
      const activeOrders = res.data.filter(o => o.isActive === true);

      // Find the order with the provided serial number
      const order = activeOrders.find(o => o.serial === serial);

      // Set order details and update states
      setorderDetalisBySerial(order);
      setproductOrderToUpdate(order.products);
      setaddition(order.addition);
      setdiscount(order.discount);
    } catch (error) {
      // Handle error
      console.error('Error fetching order details:', error);
      // Display a notification to the user about the error
      toast('حدث خطأ أثناء جلب تفاصيل الطلب. يرجى المحاولة مرة أخرى.');
    }
  };


  const updateOrder = async () => {
    const id = orderDetalisBySerial._id
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
        setorderDetalisBySerial({})
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


  // ----------- reservation table------------//
  //============================================
  const [allReservations, setallReservations] = useState([])
  const getAllReservations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/reservation`);
      if (response.data) {
        setallReservations(response.data);
      } else {
        console.log("No data returned from the server");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const [availableTableIds, setavailableTableIds] = useState([])

  const getAvailableTables = (reservationDate, startTime, endTime) => {
    try {
      // Filter reservations by selected date and time range
      const filterReservationsByTime = allReservations.filter(reservation => {
        const reservationDateObj = new Date(reservation.reservationDate);
        const selectedDateObj = new Date(reservationDate);

        // Check if the reservation date matches the selected date
        if (
          reservationDateObj.getFullYear() !== selectedDateObj.getFullYear() ||
          reservationDateObj.getMonth() !== selectedDateObj.getMonth() ||
          reservationDateObj.getDate() !== selectedDateObj.getDate()
        ) {
          return false;
        }

        const startReservationTime = new Date(reservation.startTime).getTime();
        const endReservationTime = new Date(reservation.endTime).getTime();
        const startSelectedTime = new Date(startTime).getTime();
        const endSelectedTime = new Date(endTime).getTime();

        // Check for overlapping time ranges
        return (
          (startReservationTime <= startSelectedTime && endReservationTime >= startSelectedTime) ||
          (startReservationTime <= endSelectedTime && endReservationTime >= endSelectedTime) ||
          (startSelectedTime <= startReservationTime && endSelectedTime >= endReservationTime)
        );
      });
      console.log({ filterReservationsByTime })
      // Create a list of all tableIds
      const allTableIds = allTable.map(table => table._id);
      console.log({ allTableIds })

      // Create a list of reserved tableIds in the selected time range
      const reservedTableIds = filterReservationsByTime.map(reservation => reservation.tableId);
      console.log({ reservedTableIds })

      // Find the difference between allTableIds and reservedTableIds to get available tableIds
      const availableTableIds = allTableIds.filter(tableId => !reservedTableIds.includes(tableId));
      console.log({ availableTableIds })
      setavailableTableIds(availableTableIds)
      return availableTableIds;
    } catch (error) {
      // Handle errors
      console.error("Error getting available tables by date and time:", error);
      return [];
    }
  };


  const createReservations = async (e, tableId, tableNumber, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createdBy) => {
    try {
      e.preventDefault();

      // Logging input data for debugging purposes
      console.log({ tableId, tableNumber, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createdBy });


      // Convert reservationDate to Date object
      const selectedDate = new Date(reservationDate);

      // Logging selectedDate for debugging purposes
      console.log({ selectedDate: selectedDate.getTime() });

      // Filter reservations by table and selected date
      const filterReservationsByTable = allReservations.filter(reservation => {
        const reservationDateObj = new Date(reservation.reservationDate);
        const selectedDateObj = new Date(selectedDate);

        return (
          reservation.tableId === tableId &&
          reservationDateObj.getFullYear() === selectedDateObj.getFullYear() &&
          reservationDateObj.getMonth() === selectedDateObj.getMonth() &&
          reservationDateObj.getDate() === selectedDateObj.getDate()
        );
      });

      // Logging filterReservationsByTable for debugging purposes
      console.log({ filterReservationsByTable });
      // Filter reservations by table and selected date
      const conflictingReservation = filterReservationsByTable.find(reservation => {
        const startReservationTime = new Date(reservation.startTime).getTime();
        const endReservationTime = new Date(reservation.endTime).getTime();
        const startSelectedTime = new Date(startTime).getTime();
        const endSelectedTime = new Date(endTime).getTime();
        return (
          (startReservationTime <= startSelectedTime && endReservationTime >= startSelectedTime) ||
          (startReservationTime <= endSelectedTime && endReservationTime >= endSelectedTime) ||
          (startSelectedTime <= startReservationTime && endSelectedTime >= endReservationTime)
        );
      });

      console.log({ conflictingReservation });

      // Display error message if there is a conflicting reservation
      if (conflictingReservation) {
        toast.error('هذه الطاولة محجوزة في هذا الوقت');
        return;
      }

      // Send request to the server
      const response = await axios.post(`${apiUrl}/api/reservation`, {
        tableId,
        tableNumber,
        numberOfGuests,
        customerName,
        customerPhone,
        reservationDate,
        startTime,
        endTime,
        userId: userId || null,
        createdBy: createdBy || null,
        reservationNote: reservationNote || "",
      });

      // Check if the request was successful
      if (response.status === 201) {
        // Update reservations data
        getAllReservations();
        // Display success message
        toast.success("تم حجز الطاولة بنجاح");
      } else {
        // Display error message if the request was unsuccessful
        toast.error("حدث خطأ أثناء عملية الحجز! الرجاء المحاولة مرة أخرى");
      }
    } catch (error) {
      // Display error message if an error occurred
      console.error(error);
      toast.error("فشل عملية الحجز! الرجاء المحاولة مرة أخرى");
    }
  };

  const getReservationById = async (id) => {
    try {
      if (!id) {
        toast.error("رجاء اختيار الحجز بشكل صحيح")
        return
      }

      const reservation = await axios.get(`${apiUrl}/api/reservation/${id}`)
      if (!reservation) {
        toast.error('هذا الحجز غير موجود')
      }

    } catch (error) {
      toast.error(' حدث خطأ اثناء الوصول الي الحجز !حاول مرة اخري')
    }
  }


  const updateReservation = async (e, id, tableId, tableNumber, numberOfGuests, reservationDate, startTime, endTime, status) => {
    e.preventDefault();

    try {
      if (!id) {
        toast.error("رجاء اختيار الحجز بشكل صحيح")
        return
      }

      const filterReservationsByTable = allReservations.filter(reservation => reservation.tableId === tableId && reservation.reservationDate === reservationDate)

      const filterReservationsByTime = filterReservationsByTable.filter(reservation =>
        (reservation.startTime <= startTime && reservation.endTime >= startTime) ||
        (reservation.startTime <= endTime && reservation.endTime >= endTime) ||
        (startTime <= reservation.startTime && endTime >= reservation.endTime)
      );

      if (filterReservationsByTime.length == 1 && filterReservationsByTime[0]._id == id) {
        const response = await axios.put(`${apiUrl}/api/reservation/${id}`, {
          tableId, tableNumber, numberOfGuests, reservationDate, startTime, endTime, status
        })
        if (response.status == 200) {
          getAllReservations()
          toast.success('تم تعديل ميعاد الحجز بنجاح')
        } else {
          getAllReservations()
          toast.error('حدث خطأ اثناء التعديل ! حاول مرة اخري')
        }
      } else {
        toast.error('لا يمكن تغير الحجز في هذا الميعاد')
      }

    } catch (error) {
      toast.error('حدث خطأاثناء تعديل الحجز ! حاول مرة اخري')
    }
  }


  const confirmReservation = async (id, status) => {
    try {
      if (!id) {
        toast.error("رجاء اختيار الحجز بشكل صحيح")
        return
      }

      const response = await axios.put(`${apiUrl}/api/reservation/${id}`, {
        status
      })
      if (response.status == 200) {
        getAllReservations()
        toast.success('تم تاكيد الحجز بنجاح')
      } else {
        getAllReservations()
        toast.error('حدث خطأ اثناء التاكيد ! حاول مرة اخري')
      }


    } catch (error) {
      toast.error('حدث خطأاثناء تاكيد الحجز ! حاول مرة اخري')
    }
  }

  const deleteReservation = async (id) => {
    try {
      if (!id) {
        toast.error("رجاء اختيار الحجز بشكل صحيح")
        return
      }

      const response = await axios.delete(`${apiUrl}/api/reservation/${id}`)
      if (response.status === 200) {
        getAllReservations()
        toast.success("تم حذف الحجز بنجاح")
      } else {
        toast.error("حدث خطأ اثناء حذف الحجز !حاول مره اخري")
      }

    } catch (error) {
      toast.error('حدث خطاء عملية الحذف !حاول مره اخري')
    }
  }


  useEffect(() => {
    getRestaurant()
    getAllProducts()
    getAllCategories()
    getAllOrders()
    getAllTable();
    getAllUsers();
    getAllemployees()
    getUserInfoFromToken()
    getAllReservations()
  }, [])



  // useEffect(() => {
  //   Payment_pending_orders()
  // }, [allOrders])

  useEffect(() => {
    calculateOrderCost()
    getAllOrders()
    // getAllUsers();
    // getAllTable();
    // getUserInfoFromToken()
    // calcsubtotalSplitOrder()
    // Payment_pending_orders()

  }, [count, itemsInCart, productOrderToUpdate, isLogin])

  return (
    <detacontext.Provider
      value={{
        restaurantData, clientInfo, apiUrl,
        // Functions related to authentication
        userLoginInfo, employeeLoginInfo, getUserInfoFromToken,
        // login, signup, logout,
        //  adminLogin, employeelogout,

        // Functions related to products and categories
        allProducts, allcategories, filterByCategoryId, setcategoryid, deleteItemFromCart,

        // Functions related to users, tables, and orders
        allUsers, allTable, usertitle, allOrders, askingForHelp,

        // Functions related to manipulating product details
        setproductNote, addNoteToProduct, addExtrasToProduct, handleAddProductExtras,setproductExtras, productExtras,

        // Functions related to order processing and calculations
        invoice, listProductsOrder, orderUpdateDate, myOrder,
        categoryid, itemsInCart, costOrder,
        addItemToCart, setitemsInCart, incrementProductQuantity, decrementProductQuantity,
        getOrderProductForTable, setdiscount, setaddition, discount, addition, orderaddition, orderdiscount,

        // Functions related to creating different types of orders
        checkout,
        createWaiterOrderForTable, createCasherOrder, lastInvoiceByCasher,

        // Functions related to pagination
        setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination,

        // Other utility functions or state variables
        itemId, setitemId,

        formatDateTime, formatDate, formatTime,
        orderTotal, orderSubtotal, ordertax, orderDeliveryCost, setorderDeliveryCost,
        createOrderForTableByClient, createDeliveryOrderByClient,

        orderDetalisBySerial, getorderDetailsBySerial, updateOrder, productOrderToUpdate,
        putNumOfPaid, splitInvoice, subtotalSplitOrder,
        createReservations, getAvailableTables, availableTableIds, confirmReservation, updateReservation, getAllReservations, allReservations, getReservationById, deleteReservation
        , isLoadiog, setisLoadiog
      }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Userscreen />} />
          <Route path='/:id' element={<Userscreen />} />

          <Route path='/login' element={<Login />} />

          <Route path='/management/*' element={<ManagLayout />}>
            <Route index element={<ManagerDash />} />
            <Route path='info' element={<Info />} />
            <Route path='orders' element={<Orders />} />
            <Route path='products' element={<Products />} />
            <Route path='productrecipe' element={<ProductRecipe />} />
            <Route path='tables' element={<Tables />} />
            <Route path='tablespage' element={<TablesPage />} />
            <Route path='reservation' element={<ReservationTables />} />
            <Route path='employees' element={<Employees />} />
            <Route path='permissions' element={<PermissionsComponent />} />
            <Route path='Employeessalary' element={<EmployeesSalary />} />
            <Route path='payroll' element={<PayRoll />} />
            <Route path='attendancerecord' element={<AttendanceManagement />} />
            <Route path='category' element={<Category />} />
            <Route path='kitchen' element={<Kitchen />} />
            <Route path='waiter' element={<Waiter />} />
            <Route path='users' element={<Users />} />
            <Route path='message' element={<CustomerMessage />} />
            <Route path='deliveryman' element={<DeliveryMan />} />
            <Route path='pos' element={<POS />} />
            <Route path='supplier' element={<Suppliers />} />
            <Route path='purchase' element={<Purchase />} />
            <Route path='purchasereturn' element={<PurchaseReturn />} />
            <Route path='suppliertransaction' element={<SupplierTransaction />} />
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