import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast, ToastContainer } from 'react-toastify';



const KitchenConsumption = () => {
  const [stockItemId, setstockItemId] = useState('');
  const [stockItemName, setstockItemName] = useState('');
  const [quantityTransferredToKitchen, setquantityTransferredToKitchen] = useState();
  const [createdBy, setcreatedBy] = useState('');
  const [consumptionQuantity, setconsumptionQuantity] = useState('');
  const [unit, setunit] = useState('');

  const [bookBalance, setbookBalance] = useState();
  const [actualBalance, setactualBalance] = useState();
  const [KitchenItemId, setKitchenItemId] = useState();
  const [adjustment, setadjustment] = useState();

  // Function to add an item to kitchen consumption
  const addKitchenItem = async (e) => {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]; // تاريخ اليوم بتنسيق YYYY-MM-DD
    const kitconsumptionToday = allKitchenConsumption.filter((kitItem) => {
      const itemDate = new Date(kitItem.createdAt).toISOString().split('T')[0];
      return itemDate === today;
    });
    let kitconsumption = null;
    if (kitconsumptionToday.length > 0) {
      kitconsumption = kitconsumptionToday.find((item) => item.stockItemId == stockItemId);
    }
    if (kitconsumption) {
      try {
        // Make a POST request to add an item
        const newquantityTransferredToKitchen = kitconsumption.quantityTransferredToKitchen + quantityTransferredToKitchen
        const newBalance = kitconsumption.bookBalance + quantityTransferredToKitchen
        const response = await axios.put(`${apiUrl}/api/kitchenconsumption/${kitconsumption._id}`, {
          quantityTransferredToKitchen: newquantityTransferredToKitchen,
          createdBy,
          bookBalance:newBalance
        });

        // Check if the item was added successfully
        if (response.status === 200) {
          setstockItemId('')
          setstockItemName('')
          setquantityTransferredToKitchen(0)
          getKitchenConsumption()
          // Show a success toast if the item is added
          toast.success('quantity added successfully');
        } else {
          // Show an error toast if adding the item failed
          toast.error('Failed to add item');
        }
      } catch (error) {
        // Show an error toast if an error occurs during the request
        toast.error('Failed to add item');
        console.error(error);
      }

    } else {
      try {
        // Make a POST request to add an item
        const response = await axios.post('https://caviar-api.vercel.app/api/kitchenconsumption', {
          stockItemId,
          stockItemName,
          quantityTransferredToKitchen,
          bookBalance:quantityTransferredToKitchen,
          unit,
          createdBy
        });

        // Check if the item was added successfully
        if (response.status === 201) {
          setstockItemId('')
          setstockItemName('')
          setquantityTransferredToKitchen(0)
          getKitchenConsumption()
          // Show a success toast if the item is added
          toast.success('Item added successfully');
        } else {
          // Show an error toast if adding the item failed
          toast.error('Failed to add item');
        }
      } catch (error) {
        // Show an error toast if an error occurs during the request
        toast.error('Failed to add item');
        console.error(error);
      }

    }
  };

  const updateKitchenItem = async (e) => {
    e.preventDefault()
    console.log('updateKitchenItem')
    try {
      const update = await axios.put(`${apiUrl}/api/kitchenconsumption/${KitchenItemId}`, {
        adjustment,
        actualBalance
      });
      if(update.status === 200){
        try {
        // Make a POST request to add an item
        const response = await axios.post('https://caviar-api.vercel.app/api/kitchenconsumption', {
          stockItemId,
          stockItemName,
          quantityTransferredToKitchen:actualBalance,
          bookBalance:actualBalance,
          unit,
          createdBy
        });

        // Check if the item was added successfully
        if (response.status === 201) {
          setstockItemId('')
          setstockItemName('')
          setquantityTransferredToKitchen(0)
          getKitchenConsumption()
          // Show a success toast if the item is added
          toast.success('Item added successfully');
        } else {
          // Show an error toast if adding the item failed
          toast.error('Failed to add item');
        }
      } catch (error) {
        // Show an error toast if an error occurs during the request
        toast.error('Failed to add item');
        console.error(error);
      }
      }


    } catch (error) {
      console.error('Error occurred:', error);
      // Add toast for error
      toast.error('An error occurred');
    }
  };


  const [listOfOrders, setlistOfOrders] = useState([])
  // Fetch orders from API
  const getAllOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/order`);
      setlistOfOrders(res.data.reverse());
    } catch (error) {
      console.log(error);
      // Display toast or handle error
    }
  };


  const [AllStockItems, setAllStockItems] = useState([])
  // Function to retrieve all stock items
  const getStockItems = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/stockitem/');

      if (response.status === 200) {
        const stockItems = response.data.reverse();
        setAllStockItems(stockItems);
        console.log(response.data);
      } else {
        // Handle other statuses if needed
        console.log(`Unexpected status code: ${response.status}`);
        toast.error('Failed to retrieve stock items');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to retrieve stock items');
    }
  };


  // const [AllCategoryStock, setAllCategoryStock] = useState([])
  // // Function to retrieve all category stock
  // const getAllCategoryStock = async () => {
  //   try {
  //     const res = await axios.get('https://caviar-api.vercel.app/api/categoryStock/');
  //     setAllCategoryStock(res.data);
  //   } catch (error) {
  //     console.log(error);

  //     // Notify on error
  //     toast.error('Failed to retrieve category stock');
  //   }
  // };

  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/`);
      const products = await response.data;
      // console.log(response.data)
      setlistofProducts(products)
      // console.log(listofProducts)

    } catch (error) {
      console.log(error)
    }

  }


  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [allKitchenConsumption, setAllKitchenConsumption] = useState([]);
  const [filteredKitchenConsumptionToday, setFilteredKitchenConsumptionToday] = useState([]);

  const getKitchenConsumption = async () => {
    try {
      console.log('Fetching kitchen consumption...');
      const response = await axios.get('https://caviar-api.vercel.app/api/kitchenconsumption');
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

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    console.log('Selected Date:', selectedDate);
    setDate(selectedDate);
  };


  const [filteredKitchenConsumption, setfilteredKitchenConsumption] = useState([])

  const searchByKitchenConsumption = (name) => {
    const filter = filteredKitchenConsumptionToday.filter((item) => item.stockItemName.startsWith(name) == true);
    setfilteredKitchenConsumption(filter);
  };


  // Initialize state variables for date and filtered kitchen consumption
  // const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  // const [filteredKitchenConsumptionToday, setFilteredKitchenConsumptionToday] = useState([]);

  // // Function to filter kitchen consumption based on creation date
  // const filterByKitConsumCreatedAt = () => {
  //   console.log({datett:date})
  //   const filtered = allKitchenConsumption.filter((kitItem) => {
  //     new Date(kitItem.createdAt).toISOString().split('T')[0] == date;
  //     console.log({createdAt:kitItem.createdAt})
  //     return itemDate === date;
  //   });
  //   console.log({filtered})
  //   setFilteredKitchenConsumptionToday(filtered);
  // };




  useEffect(() => {
    getStockItems()
    getAllOrders()
    getallproducts()
    getKitchenConsumption()
    // filterByKitConsumCreatedAt()
  }, [date])

  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>الاستهلاك</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addItemModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#updateItemModal" className="btn btn-danger" data-toggle="modal" ><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter">
                    <div class="row text-dark">
                      <div class="col-sm-3">
                        <div class="show-entries">
                          <span>عرض</span>
                          <select class="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
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
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>التاريخ</label>
                          <input id="dateInput"
                            type="date"
                            value={date} class="form-control" onChange={handleDateChange} />
                        </div>

                        <div class="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByKitchenConsumption(e.target.value)} />
                        </div>

                        <div class="filter-group">
                          <label>اختر الصنف</label>
                          <select class="form-control" onChange={(e) => searchByKitchenConsumption(e.target.value)} >
                            <option value={""}>الكل</option>
                            {filteredKitchenConsumptionToday.map((consumption) => {
                              return (<option value={consumption.stockItemName}>{consumption.stockItemName}</option>)
                            })}
                          </select>
                        </div>
                        {/* <div class="filter-group">
                          <label>Location</label>
                          <select class="form-control">
                            <option>All</option>
                            <option>Berlin</option>
                            <option>London</option>
                            <option>Madrid</option>
                            <option>New York</option>
                            <option>Paris</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>Status</label>
                          <select class="form-control">
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
                        <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th>
                        <th>م</th>
                        <th>اسم الصنف</th>
                        <th>الكمية المضافه</th>
                        <th>الاستهلاك</th>
                        <th>الوحدة</th>
                        <th>الرصيد</th>
                        <th>التسويه</th>
                        <th>المنتجات</th>
                        <th>بواسطه</th>
                        <th>تاريخ الاضافه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filteredKitchenConsumption.length > 0 ? filteredKitchenConsumption.map((item, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span className="custom-checkbox">
                                    <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                    <label htmlFor="checkbox1"></label>
                                  </span>
                                </td>
                                <td>{i + 1}</td>
                                <td>{item.stockItemName}</td>
                                <td>{item.quantityTransferredToKitchen}</td>
                                <td>{item.consumptionQuantity}</td>
                                <td>{item.unit}</td>
                                <td>{item.bookBalance}</td>
                                <td>{item.adjustment}</td>
                                <td>
                                  {item.productsProduced.length > 0 ? item.productsProduced.map((product, j) => (
                                    <span key={j}>{`[${product.productionCount} * ${product.productName}]`}</span>
                                  )) : 'لا يوجد'}
                                </td>
                                <td>{item.createdBy ? usertitle(item.createdBy) : '--'}</td>
                                <td>{item.createdAt}</td>
                                <td>
                                  <a href="#updateKitchenItemModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteStockItemModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            );
                          }
                        })
                          : filteredKitchenConsumptionToday.length > 0 ? filteredKitchenConsumptionToday.map((item, i) => {
                            if (i >= startpagination & i < endpagination) {
                              return (
                                <tr key={i}>
                                  <td>
                                    <span className="custom-checkbox">
                                      <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                      <label htmlFor="checkbox1"></label>
                                    </span>
                                  </td>
                                  <td>{i + 1}</td>
                                  <td>{item.stockItemName}</td>
                                  <td>{item.quantityTransferredToKitchen}</td>
                                  <td>{item.consumptionQuantity}</td>
                                  <td>{item.unit}</td>
                                  <td>{item.bookBalance}</td>
                                  <td>{item.adjustment}</td>
                                  <td>
                                    {item.productsProduced.length > 0 ? item.productsProduced.map((product, j) => (
                                      <span key={j}>{`[${product.productionCount} * ${product.productName}]`}</span>
                                    )) : 'لا يوجد'}
                                  </td>
                                  <td>{item.createdBy ? usertitle(item.createdBy) : '--'}</td>
                                  <td>{item.createdAt}</td>
                                  <td>
                                    <a href="#updateKitchenItemModal" className="edit" data-toggle="modal" onClick={()=>{setcreatedBy(employeeLoginInfo.employeeinfo.id);setKitchenItemId(item._id);
                                      setstockItemId(item.stockItemId);setstockItemName(item.stockItemName);setquantityTransferredToKitchen(item.quantityTransferredToKitchen);setbookBalance(item.bookBalance);setunit(item.unit);
                                      setconsumptionQuantity(item.consumptionQuantity);
                                    }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                    <a href="#deleteStockItemModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                  </td>
                                </tr>
                              );
                            }
                          }) : ''
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{filteredKitchenConsumptionToday.length > endpagination ? endpagination : filteredKitchenConsumptionToday.length}</b> من <b>{filteredKitchenConsumptionToday.length}</b> عنصر</div>
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
                </div>
              </div>
              <div id="addItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => addKitchenItem(e)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف </h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">

                        <div className="form-group">
                          <label>الصنف</label>
                          <select name="category" id="category" form="carform" onChange={(e) => { setstockItemId(e.target.value); setunit(AllStockItems.filter(stock => stock._id == e.target.value)[0].smallUnit); setcreatedBy(employeeLoginInfo.employeeinfo.id); setstockItemName(AllStockItems.filter(it => it._id == e.target.value)[0].itemName) }}>
                            <option>اختر الصنف</option>
                            {AllStockItems.map((StockItems, i) => {
                              return <option value={StockItems._id} key={i} >{StockItems.itemName}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group">
                          <label>رصيد محول</label>
                          <input type='Number' className="form-control" required onChange={(e) => setquantityTransferredToKitchen(Number(e.target.value))} />
                        </div>
                        <div className="form-group">
                          <label>الوحدة </label>
                          <input type='text' className="form-control" required defaultValue={unit}></input>
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" Value={new Date().toLocaleDateString()} required readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="updateKitchenItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateKitchenItem(e)}>
                      <div className="modal-header">
                        <h4 className="modal-title">تسويه الرصيد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>اسم الصنف</label>
                          <input type="text" className="form-control" defaultValue={stockItemName} required />
                        </div>
                        <div className="form-group">
                          <label>الكمية المستلمة</label>
                          <input type="text" className="form-control" defaultValue={quantityTransferredToKitchen} required readOnly />
                        </div>
                        <div className="form-group">
                          <label>الكمية المستهلكه</label>
                          <input type="text" className="form-control" defaultValue={consumptionQuantity} required readOnly />
                        </div>
                        <div className="form-group">
                          <label>الرصيد الدفتري</label>
                          <input type="text" className="form-control" defaultValue={bookBalance} required readOnly/>
                        </div>
                        <div className="form-group">
                          <label>الرصيد الفعلي</label>
                          <input type="Number" className="form-control"  required onChange={(e)=>{
                            setadjustment(Number(e.target.value) - bookBalance);setactualBalance(e.target.value)
                          }} />
                        </div>
                        <div className="form-group">
                          <label>التسويه</label>
                          <input type="text" className="form-control" defaultValue={adjustment} required readOnly />
                        </div>
                        <div className="form-group">
                          <label>الوحدة </label>
                          <input type='text' className="form-control" defaultValue={unit} required></input>
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" defaultValue={new Date().toLocaleDateString()} required readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
                       

              {/* <div id="updateItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={updateKitchenItem}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-danger" value="تحديث" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>   */}

            </div>
          )
        }
      }
    </detacontext.Consumer>

  )
}

export default KitchenConsumption