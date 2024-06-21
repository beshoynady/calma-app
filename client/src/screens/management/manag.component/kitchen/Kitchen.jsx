import { useState, useEffect, useRef } from 'react';
// import './Kitchen.css'
import axios from 'axios';
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';

const Kitchen = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); 
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const start = useRef();
  const ready = useRef();

  const [waittime, setWaitTime] = useState(''); // State for waiting time

  const [orderactive, setOrderActive] = useState([]); // State for active orders
  const [productsOrderActive, setProductsOrderActive] = useState([]); // State for active orders
  const [consumptionOrderActive, setConsumptionOrderActive] = useState([]); // State for active orders
  const [allOrders, setAllOrders] = useState([]); // State for all orders



  const [allRecipe, setallRecipe] = useState([]); // State for all orders

  const getAllRecipe = async () => {
    try {

      const response = await axios.get(`${apiUrl}/api/recipe`, config);
      console.log({ response });
      setallRecipe(response.data)
    } catch (error) {
      console.error("Error fetching product recipe:", error.message);
    }
  };


  const getAllOrders = async () => {
    try {

      // Fetch orders from the API
      const ordersResponse = await axios.get(`${apiUrl}/api/order/limit/50`);
      const kitchenOrders = ordersResponse.data;
      console.log({ kitchenOrders })
      // Set all orders state
      setAllOrders(kitchenOrders);

      // Filter active orders based on certain conditions
      const activeOrders = kitchenOrders.filter(order => order.isActive && (order.status === 'Approved' || order.status === 'Preparing' || order.status === 'Prepared'));

      // Set active orders state
      setOrderActive(activeOrders);

      // Fetch recipes from the API
      const recipesResponse = await axios.get(`${apiUrl}/api/recipe`, config);
      const allRecipes = recipesResponse.data;

      // Process active orders to update productsOrderActive and consumptionOrderActive
      const updatedProductsOrderActive = [];
      const updatedConsumptionOrderActive = [];

      activeOrders.forEach(order => {
        order.products.forEach(product => {
          if (!product.isDone) {
            console.log({ product })

            const existingProductIndex = updatedProductsOrderActive.findIndex(p => p.productid._id === product.productid._id);
            const recipe = allRecipes.find(recipe => recipe.productId._id === product.productid)?.ingredients || [];
            console.log({ recipe })
            if (existingProductIndex !== -1) {
              // If the product already exists, update the quantity
              updatedProductsOrderActive[existingProductIndex].quantity += product.quantity;
            } else {
              // If the product does not exist, add it to the array
              updatedProductsOrderActive.push({
                productid: product.productid,
                quantity: product.quantity,
                recipe
              });
            }

            // Update consumptionOrderActive
            recipe.forEach(rec => {
              const existingItemIndex = updatedConsumptionOrderActive.findIndex(con => con.itemId == rec.itemId);
              const amount = rec.amount * product.quantity;

              if (existingItemIndex !== -1) {
                // If the item already exists, update the amount
                updatedConsumptionOrderActive[existingItemIndex].amount += amount;
              } else {
                // If the item does not exist, add it to the array
                updatedConsumptionOrderActive.push({
                  itemId: rec.itemId,
                  name: rec.name,
                  amount
                });
              }
            });
          }
        });
      });

      // Set updated productsOrderActive state
      setProductsOrderActive(updatedProductsOrderActive);

      // Set updated consumptionOrderActive state
      setConsumptionOrderActive(updatedConsumptionOrderActive);
    } catch (error) {
      // Handle errors
      console.error('Error fetching orders:', error);
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
      const response = await axios.get(apiUrl + '/api/kitchenconsumption', config);
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
      const response = await axios.get(apiUrl + '/api/product/');
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
  const [waitersId, setWaitersId] = useState([]); // State for active waiters ID

  const getAllWaiters = async () => {
    try {

      const allEmployees = await axios.get(apiUrl + '/api/employee', config);

      const allWaiters = allEmployees.data.length > 0 ? allEmployees.data.filter((employee) => employee.role === 'waiter') : [];
      const waiterActive = allWaiters.length > 0 ? allWaiters.filter((waiter) => waiter.isActive === true) : [];
      setAllWaiters(waiterActive);

      const waiterIds = waiterActive.length > 0 ? waiterActive.map((waiter) => waiter._id) : [];
      setWaitersId(waiterIds);
    } catch (error) {
      console.log(error);
    }
  };


  // Determines the next available waiter to take an order
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



  // Updates an order status to 'Preparing'

  const orderInProgress = async (id) => {
    try {
      const status = 'Preparing';
      const orderData = { status };
      const response = await axios.put(`${apiUrl}/api/order/${id}`, orderData, config);
      if (response.status === 200) {
        // Fetch orders from the API
        await getAllOrders()
        toast.success('الاوردر يجهز!');
      } else {
        toast.error('حدث خطأ اثناء قبول الاوردر ! حاول مره اهري');
      }
    } catch (error) {
      console.error(error);
      toast.error('فش بدء الاوردر ! اعد تحميل الصفحة ');
    }
  };




  const updateOrderDone = async (id, type) => {
    try {
      // Fetch order data by ID
      const orderData = await axios.get(`${apiUrl}/api/order/${id}`);
      const products = await orderData.data.products;

      // Loop through each product in the order
      for (const product of products) {
        if (!product.isDone) {
          // Fetch kitchen consumption data
          // await getKitchenConsumption();
          const getKitchenConsumption = await axios.get(apiUrl + '/api/kitchenconsumption', config);
          const Allkitchenconsumption = await getKitchenConsumption.data.data
          const quantity = product.quantity;
          const productId = product.productid;
          const name = product.name;
          console.log({ productId, quantity, name });

          // Find product details
          const foundProductRecipe = allRecipe.length > 0 ? allRecipe.find((Recipe) => Recipe.productId === product._id) : "";
          const ingredients = foundProductRecipe ? foundProductRecipe.ingredients : [];

          // Calculate consumption for each ingredient in the recipe
          for (const ingredient of ingredients) {
            const today = new Date().toISOString().split('T')[0]; // تاريخ اليوم بتنسيق YYYY-MM-DD
            const kitconsumptionToday = Allkitchenconsumption.filter((kitItem) => {
              const itemDate = new Date(kitItem.createdAt).toISOString().split('T')[0];
              return itemDate === today;
            });

            let kitconsumption = null;
            if (kitconsumptionToday.length > 0) {
              kitconsumption = kitconsumptionToday.find((kitItem) => kitItem.stockItemId === ingredient.itemId);
            }
            if (kitconsumption) {
              const productAmount = ingredient.amount * quantity;
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
                }, config);
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
      let waiter = '';

      if (type === 'Internal') {
        waiter = await specifiedWaiter(id);
      }
      const status = 'Prepared';
      const updateproducts = products.map((prod) => ({ ...prod, isDone: true }));
      await axios.put(`${apiUrl}/api/order/${id}`, { products: updateproducts, status, waiter });

      // Fetch orders from the API
      const orders = await axios.get(apiUrl + '/api/order');
      // Set all orders state
      getAllOrders()
      getKitchenConsumption()
      toast.success('تم تجهيز الاوردر !'); // Notifies success in completing order

    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ اثناء تعديل حاله الاودر !اعد تحميل الصفحة و حاول مره اخري ');
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
    getAllRecipe()
    getKitchenConsumption()
    getallproducts()
    getAllWaiters();
    getAllOrders();
  }, []);

  return (
    <detacontext.Consumer>
      {
        ({ usertitle, updatecountofsales }) => {
          return (
            <div className='container-fluid d-flex flex-wrap align-content-start justify-content-around align-items-start h-100 overflow-auto bg-transparent py-5 px-3'
              style={{ backgroundColor: 'rgba(0, 0, 255, 0.1)' }}>
              <div className="row justify-content-around align-items-start">
                {orderactive && consumptionOrderActive.map((item, index) => (
                  <div className="card bg-primary text-white" style={{ height: '100px', width: '130px' }} key={index}>
                    <div className="card-body d-flex flex-column justify-content-center text-center" style={{ padding: '5px' }}>
                      <h5 className="card-title text-center" style={{ fontSize: '16px', fontWeight: '600' }}>{item.name}</h5>
                      <p className="card-text text-center" style={{ fontSize: '14px', fontWeight: '500' }} >الرصيد: {filteredKitchenConsumptionToday.find((cons) => cons.stockItemId === item.itemId) ? filteredKitchenConsumptionToday.find((cons) => cons.stockItemId === item.itemId).bookBalance : '0'}</p>
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
                              <p className="card-text"> {order.table != null ? `طاولة: ${order.table.tableNumber}` : (order.user ? `العميل: ${order.user.username}` : '')}</p>
                              <p className="card-text">رقم الطلب: {order.ordernum ? order.ordernum : ''}</p>
                              <p className="card-text">الفاتورة: {order.serial}</p>
                              <p className="card-text">نوع الطلب: {order.orderType}</p>
                            </div>

                            <div style={{ maxWidth: "50%" }}>
                              {order.waiter ? <p className="card-text">الويتر: {order.waiter && order.waiter.fullname}</p> : ""}
                              <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="card-text">الانتظار: {waitingTime(order.createdAt)} دقيقه</p>
                            </div>
                          </div>
                          <ul className='list-group list-group-flush'>
                            {order.products.filter((pr) => pr.isDone === false).map((product, i) => {
                              return (
                                <>
                                  <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={i}
                                    style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
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
                                          <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={`${i}-${j}`}
                                            style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                              {extra.extraDetails.map((detail) => (
                                                <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name}`}</p>
                                              ))}
                                            </div>
                                          </li>
                                        );
                                      } else {
                                        return null;
                                      }
                                    })
                                  )}
                                </>

                              )
                            })}
                          </ul>
                          <div className="card-footer text-center w-100 d-flex flex-row">
                            {order.status === 'Preparing' ?
                              (<button className="btn w-100 btn-warning btn btn-lg"
                                onClick={() => {
                                  updateOrderDone(order._id, order.orderType);
                                }}>تم التنفيذ</button>)

                              : order.status === 'Approved' ?
                                (<button className="btn w-100 btn-primary btn btn-lg"
                                  onClick={() => orderInProgress(order._id)}
                                >بدء التنفيذ</button>)

                                : ""
                            }
                          </div>
                        </div>
                      </div>
                    )
                  } else if (order.status==='Prepared'&& order.products.filter((pr) =>  pr.isDone === true && pr.isDeleverd === false).length > 0){
                    return (
                      <div className="col-md-4 mb-4" key={i}>
                        <div className="card text-white bg-success" style={{ width: "265px" }}>
                          <div className="card-body text-right d-flex justify-content-between p-0 m-1">
                            <div style={{ maxWidth: "50%" }}>
                              <p className="card-text"> {order.table != null ? `طاولة: ${order.table.tableNumber}` : (order.user ? `العميل: ${order.user.username}` : '')}</p>
                              <p className="card-text">رقم الطلب: {order.ordernum ? order.ordernum : ''}</p>
                              <p className="card-text">الفاتورة: {order.serial}</p>
                              <p className="card-text">نوع الطلب: {order.orderType}</p>
                            </div>

                            <div style={{ maxWidth: "50%" }}>
                              {order.waiter ? <p className="card-text">الويتر: {order.waiter && order.waiter.fullname}</p> : ""}
                              <p className="card-text">الاستلام: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p className="card-text">الانتظار: {waitingTime(order.createdAt)} دقيقه</p>
                            </div>
                          </div>
                          <ul className='list-group list-group-flush'>
                            {order.products.filter((pr) => pr.isDone === true && pr.isDeleverd === false).map((product, i) => {
                              return (
                                <>
                                  <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={i}
                                    style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
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
                                          <li className='list-group-item d-flex flex-column justify-content-between align-items-center' key={`${i}-${j}`}
                                            style={product.isAdd ? { backgroundColor: 'red', color: 'white' } : { color: 'black' }}>
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                              {extra.extraDetails.map((detail) => (
                                                <p className="badge badge-secondary m-1" key={detail.extraid}>{`${detail.name}`}</p>
                                              ))}
                                            </div>
                                          </li>
                                        );
                                      } else {
                                        return null;
                                      }
                                    })
                                  )}
                                </>

                              )
                            })}
                          </ul>
                          <div className="card-footer text-center w-100 d-flex flex-row">
                            <button className="btn w-100 btn-info btn btn-lg"
                            >انتظار الاستلام</button>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )

}

export default Kitchen