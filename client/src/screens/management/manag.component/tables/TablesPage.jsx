import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

const TablesPage = () => {


 // State for tables, active orders, products in active orders, and consumption in active orders
const [activeTable, setactiveTable] = useState([]);
const [orderactive, setOrderActive] = useState([]); // State for active orders
const [productsOrderActive, setproductsOrderActive] = useState([]); // State for active orders
const [allOrders, setAllOrders] = useState([]); // State for all orders

// Fetches orders from the API
const getOrdersFromAPI = async () => {
  try {
    // Fetch orders data from the API endpoint
    const orders = await axios.get('https://calma-api-puce.vercel.app/api/order');
    // Set all orders fetched from the API
    setAllOrders(orders.data);

    // Filter active orders from all orders
    const activeOrders = orders.data.filter((order) => order.isActive == true);
    console.log({ activeOrders });
    // Set active orders
    setOrderActive(activeOrders);

    // Extract table IDs from active orders
    const getactiveTable = activeOrders.filter((activeOrder) => activeOrder.table != null);

    console.log({ getactiveTable });
    // Set table IDs
    setactiveTable(getactiveTable);
  } catch (error) {
    console.log(error);
  }
};


  const [listoftable, setlistoftable] = useState([]);

  const getallTable = async () => {
    try {
      const response = await axios.get('https://calma-api-puce.vercel.app/api/table');
      const tables = response.data;
      console.log({ tables: tables})
      setlistoftable(tables);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getallTable()
    getOrdersFromAPI()
  }, [])
  

  return (
    <div className="container">
      <h1>صفحة الطاولات</h1>
      <div className="row">
        {listoftable.map(table => (
          <div key={table.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="text-center">
              <span style={{ fontSize: '60px', color: activeTable.find(active=>active.table==table._id)  ? 'green' : 'red' }} class="material-symbols-outlined">
                table_restaurant
              </span>
              <p style={{ fontSize: '30px' ,color:'black'}}>{table.tablenum}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesPage;
