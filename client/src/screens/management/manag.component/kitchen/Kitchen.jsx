import { useState, useEffect, useRef } from 'react';
// import './Kitchen.css'
import axios from 'axios';
import { detacontext } from '../../../../App'
import { toast, ToastContainer } from 'react-toastify'; // Importing toast from 'react-toastify' for notifications
import 'react-toastify/dist/ReactToastify.css'; // Importing default CSS for toast notifications

const Kitchen = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

  const start = useRef();
  const ready = useRef();

  const [waittime, setWaitTime] = useState(''); // State for waiting time

  const [orderactive, setOrderActive] = useState([]); // State for active orders
  const [productsOrderActive, setproductsOrderActive] = useState([]); // State for active orders
  const [consumptionOrderActive, setconsumptionOrderActive] = useState([]); // State for active orders
  const [allOrders, setAllOrders] = useState([]); // State for all orders


  const getOrdersFromAPI = async () => {
    try {
      // Fetch orders from the API
      const orders = await axios.get(apiUrl+'/api/order');
      // Set all orders state
      setAllOrders(orders.data);

      // Filter active orders based on certain conditions
      const activeOrders = orders.data.filter(
        (order) => order.isActive && (order.status === 'Approved' || order.status === 'Preparing')
      );
      console.log({ activeOrders });
      // Set active orders state
      setOrderActive(activeOrders);

      // Fetch all products from the API
      const getAllProducts = await axios.get(apiUrl+'/api/product/');
      // Extract product data
      const listAllProducts = await getAllProducts.data;

      // Create a copy of the existing productsOrderActive array
      const updatedProductsOrderActive = [...productsOrderActive];

      // Iterate through active orders and update the productsOrderActive array
      activeOrders.forEach((order) => {
        order.products.forEach((product) => {
          if (product.isDone === false) {
            const existingProduct = updatedProductsOrderActive.find((p) => p.productid === product.productid);
            if (existingProduct) {
              // If the product already exists, update the quantity
              existingProduct.quantity += product.quantity;
            } else {
              // If the product does not exist, add it to the array
              console.log({ listAllProducts });
              const recipe = listAllProducts.find((pro) => pro._id == product.productid).Recipe;
              updatedProductsOrderActive.push({ productid: product.productid, quantity: product.quantity, recipe });
            }
          }
        });
      });

      // Create a copy of the existing consumptionOrderActive array
      const updatedconsumptionOrderActive = [...consumptionOrderActive];

      // Iterate through updatedProductsOrderActive and update the consumptionOrderActive array
      updatedProductsOrderActive.forEach((product) => {
        product.recipe.forEach((rec) => {
          const existingItem = updatedconsumptionOrderActive.find((con) => con.itemId == rec.itemId);
          if (existingItem) {
            // If the item already exists, update the amount
            const Amount = rec.amount * product.quantity;
            existingItem.amount += Amount;
          } else {
            // If the item does not exist, add it to the array
            const Amount = rec.amount * product.quantity;
            updatedconsumptionOrderActive.push({ itemId: rec.itemId, name: rec.name, amount: Amount });
          }
        });
      });

      console.log({ updatedProductsOrderActive });
      // Set updated productsOrderActive state
      setproductsOrderActive(updatedProductsOrderActive);
      console.log({ updatedconsumptionOrderActive });
      // Set updated consumptionOrderActive state
      setconsumptionOrderActive(updatedconsumptionOrderActive);
    } catch (error) {
      // Handle errors
      console.log(error);
    }
  };


  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [allKitchenConsumption, setAllKitchenConsumption] = useState([]);
  const [filteredKitchenConsumptionToday, setFilteredKitchenConsumptionToday] = useState([]);

  const getKitchenConsumption = async () => {
    try {
      setFilteredKitchenConsumptionToday([])
      console.log('Fetching kitchen consumption...');
      const response = await axios.get(apiUrl+'/api/kitchenconsumption');
      if (response && response.data) {
        const kitchenConsumptions = response.data.data || [];
        setAllKitchenConsumption(kitchenConsumptions);

        const filtered = kitchenConsumptions.filter((kitItem) => {
          const itemDate = new Date(kitItem.createdAt).toISOString().split('T')[0];
          return itemDate === date;
        });
        console.log('Filtered kitchen consumption for the selected date:', filtered);
        setFilteredKitchenConsumptionToday(filtered);
      } else {
        console.log('Unexpected response or empty data');
      }
    } catch (error) {
      console.error('Error fetching kitchen consumption:', error);
      // Handle error: Notify user, log error, etc.
    }
  };

  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get(apiUrl+'/api/product/');
      const products = await response.data;
      // console.log(response.data)
      setlistofProducts(products)
      // console.log(listofProducts)

    } catch (error) {
      console.log(error)
    }

  }
  // Fetches all active waiters from the API
  const [AllWaiters, setAllWaiters] = useState([]); // State for active waiters
  const [waiters, setWaiters] = useState([]); // State for active waiters ID

  const getAllWaiters = async () => {
    try {
      const allEmployees = await axios.get(apiUrl+'/api/employee');
      const allWaiters = allEmployees.length>0?allEmployees.data.filter((employee) => employee.role === 'waiter'):"";
      const waiterActive = allWaiters.length>0?allWaiters.filter((waiter) => waiter.isActive):"";
      setAllWaiters(waiterActive);

      const waiterIds = waiterActive?waiterActive.map((waiter) => waiter._id):"";
      setWaiters(waiterIds);
    } catch (error) {
      console.log(error);
    }
  };

  // Determines the next available waiter to take an order
  const specifiedWaiter = async (id) => {
    const getorder = allOrders.find((order) => order._id == id);
    console.log({ getorder: getorder });

    const tableId = getorder.table;
    console.log({ tableId: tableId });

    try {
      const getTable = await axios.get(`${apiUrl}/api/table/${tableId}`);
      console.log({ getTable: getTable });

      const tablesectionNumber = await getTable.data.sectionNumber;
      console.log({ tablesectionNumber: tablesectionNumber });

      console.log({ AllWaiters: AllWaiters });

      const findwaiter =AllWaiters? AllWaiters.find((waiter) => waiter.sectionNumber == tablesectionNumber):"";
      console.log({ findwaiter: findwaiter });

      const waiterId = findwaiter ? findwaiter._id : '';
      console.log({ waiterId: waiterId });

      return waiterId;
    } catch (error) {
      console.error('Error fetching table or waiter data:', error);
      return ''; // Handle the error case here, returning an empty string for waiterId
    }
  };

  // const specifiedWaiter = () => {
  //   const orderTakeWaiter = allOrders.filter((order) => order.waiter !== null);
  //   const lastWaiter = orderTakeWaiter.length > 0 ? orderTakeWaiter[orderTakeWaiter.length - 1].waiter : '';

  //   const indexLastWaiter = lastWaiter ? waiters.indexOf(lastWaiter) : 0;

  //   if (waiters.length === indexLastWaiter + 1) {
  //     return waiters[0];
  //   } else {
  //     return waiters[indexLastWaiter + 1];
  //   }
  // };



  // Updates an order status to 'Preparing'
  const orderInProgress = async (id, type) => {
    try {
      const status = 'Preparing';
      let waiter = '';

      if (type === 'Internal') {
        waiter = await specifiedWaiter(id);
      }
      const orderData = { status };
      if (waiter) {
        orderData.waiter = waiter;
      }

      const response = await axios.put(`${apiUrl}/api/order/${id}`, orderData);
      if (response.status === 200) {
        // Fetch orders from the API
        const orders = await axios.get(apiUrl+'/api/order');
        // Set all orders state
        setAllOrders(orders.data);

        // Filter active orders based on certain conditions
        const activeOrders = orders.length>0?orders.data.filter(
          (order) => order.isActive && (order.status === 'Approved' || order.status === 'Preparing')
        ):"";
        console.log({ activeOrders });
        // Set active orders state
        setOrderActive(activeOrders);
        toast.success('Order is in progress!');
      } else {
        toast.error('Failed to start order!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to start order!');
    }
  };




  const updateOrderDone = async (id) => {
    try {
      // Fetch order data by ID
      const orderData = await axios.get(`${apiUrl}/api/order/${id}`);
      const products = await orderData.data.products;

      // Loop through each product in the order
      for (const product of products) {
        if (!product.isDone) {
          // Fetch kitchen consumption data
          // await getKitchenConsumption();
          const getKitchenConsumption = await axios.get(apiUrl+'/api/kitchenconsumption');
          const Allkitchenconsumption = await getKitchenConsumption.data.data
          const quantity = product.quantity;
          const productId = product.productid;
          const name = product.name;
          console.log({ productId, quantity, name });

          // Find product details
          const foundProduct = listofProducts.length>0?listofProducts.find((p) => p._id === productId):"";
          const recipe = foundProduct ? foundProduct.Recipe : [];

          // Calculate consumption for each ingredient in the recipe
          for (const rec of recipe) {
            const today = new Date().toISOString().split('T')[0]; // تاريخ اليوم بتنسيق YYYY-MM-DD
            const kitconsumptionToday = Allkitchenconsumption.filter((kitItem) => {
              const itemDate = new Date(kitItem.createdAt).toISOString().split('T')[0];
              return itemDate === today;
            });

            let kitconsumption = null;
            if (kitconsumptionToday.length > 0) {
              kitconsumption = kitconsumptionToday.find((kitItem) => kitItem.stockItemId === rec.itemId);
            }
            if (kitconsumption) {
              const productAmount = rec.amount * quantity;
              console.log({ productAmount });

              const consumptionQuantity = kitconsumption.consumptionQuantity + productAmount;
              console.log({ consumptionQuantity });

              const bookBalance = kitconsumption.quantityTransferredToKitchen - consumptionQuantity;

              let foundProducedProduct = kitconsumption.productsProduced.find((produced) => produced.productId === productId);

              if (!foundProducedProduct) {
                foundProducedProduct = { productId: productId, productionCount: quantity, productName: name };
                kitconsumption.productsProduced.push(foundProducedProduct);
              } else {
                foundProducedProduct.productionCount += quantity;
              }

              try {
                // Update kitchen consumption data
                const update = await axios.put(`${apiUrl}/api/kitchenconsumption/${kitconsumption._id}`, {
                  consumptionQuantity,
                  bookBalance,
                  productsProduced: kitconsumption.productsProduced
                });
                console.log({ update: update });
              } catch (error) {
                console.log({ error: error });
              }
            } else {

            }
          }
        }
      }

      // Perform other operations if needed after the loop completes
      // Update order status or perform other tasks
      const status = 'Prepared';
      const updateproducts = products.map((prod) => ({ ...prod, isDone: true }));
      await axios.put(`${apiUrl}/api/order/${id}`, { products: updateproducts, status });

      // Fetch orders from the API
      const orders = await axios.get(apiUrl+'/api/order');
      // Set all orders state
      setAllOrders(orders.data);

      // Filter active orders based on certain conditions
      const activeOrders = orders.data.filter(
        (order) => order.isActive && (order.status === 'Approved' || order.status === 'Preparing')
      );
      console.log({ activeOrders });
      // Set active orders state
      setOrderActive(activeOrders);
      getKitchenConsumption()
      toast.success('Order is prepared!'); // Notifies success in completing order

    } catch (error) {
      console.log(error);
      toast.error('Failed to complete order!');
    }
  };



  // Calculates the waiting time for an order
  const waitingTime = (t) => {
    const t1 = new Date(t).getTime();
    const t2 = new Date().getTime();
    const elapsedTime = t2 - t1;

    const minutesPassed = Math.floor(elapsedTime / (1000 * 60));
    setWaitTime(minutesPassed);

    if (t) {
      setTimeout(() => waitingTime(t), 60000);
    }

    return minutesPassed;
  };




  // Fetches orders and active waiters on initial render
  useEffect(() => {
    getKitchenConsumption()
    getallproducts()
    getAllWaiters();
    getOrdersFromAPI();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, updatecountofsales }) => {
          return (
            <>
              <div className="container-fluid py-5 px-3" style={{ backgroundColor: 'rgba(0, 0, 255, 0.1)' }}>
                <div className="row justify-content-around align-items-start">
                  {orderactive && consumptionOrderActive.map((item, index) => (
                    <div className="card bg-primary text-white" style={{ height: '100px', width: '130px' }} key={index}>
                      <div className="card-body d-flex flex-column justify-content-center text-center" style={{ padding: '5px' }}>
                        <h5 className="card-title text-center" style={{ fontSize: '16px', fontWeight: '600' }}>{item.name}</h5>
                        <p className="card-text text-center"style={{ fontSize: '14px', fontWeight: '500' }} >الرصيد: {filteredKitchenConsumptionToday.find((cons) => cons.stockItemId === item.itemId) ? filteredKitchenConsumptionToday.find((cons) => cons.stockItemId === item.itemId).bookBalance : '0'}</p>
                        <p className="card-text text-center" style={{ fontSize: '14px', fontWeight: '500' }}>المطلوب: {item.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr style={{ borderTop: '2px solid black' }} />

                <div className="row justify-content-around align-items-start">
                  {orderactive && orderactive.map((order, i) => {
                    if (order.products.filter((pr) => pr.isDone === false).length > 0) {
                      return (
                        <div className="col-md-4 mb-4" key={i}>
                          <div className="card text-white bg-success" style={{ width: "265px" }}>
                            <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                              <div style={{ maxWidth: "50%" }}>
                                <p className="card-text"> {order.table != null ? `طاولة: ${usertitle(order.table)}` : (order.user ? `العميل: ${usertitle(order.user)}` : '')}</p>
                                <p className="card-text">رقم الطلب: {order.ordernum ? order.ordernum : ''}</p>
                                <p className="card-text">الفاتورة: {order.serial}</p>
                                <p className="card-text">نوع الطلب: {order.order_type}</p>
                              </div>

                              <div style={{ maxWidth: "50%" }}>
                                {order.waiter ? <p className="card-text">الويتر: {usertitle(order.waiter)}</p> : ""}
                                <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p className="card-text">الانتظار: {waitingTime(order.createdAt)} دقيقه</p>
                              </div>
                            </div>
                            <ul className='list-group list-group-flush'>
                              {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                                return (
                                  <li className='list-group-item d-flex justify-content-between align-items-center' key={i} style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                      <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{i + 1}- {product.name}</p>
                                      <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}> × {product.quantity}</span>
                                    </div>
                                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{product.notes}</div>
                                  </li>

                                )
                              })}
                            </ul>
                            <div className="card-footer text-center">
                              {order.status === 'Preparing' ?
                                <button className="btn btn-warning btn-lg" style={{ width: "100%" }} onClick={() => {
                                  updateOrderDone(order._id);
                                  updatecountofsales(order._id)
                                }}>تم التنفيذ</button>
                                : <button className="btn btn-primary btn-lg" style={{ width: "100%" }} onClick={() => orderInProgress(order._id, order.order_type)}>بدء التنفيذ</button>
                              }
                            </div>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            </>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Kitchen