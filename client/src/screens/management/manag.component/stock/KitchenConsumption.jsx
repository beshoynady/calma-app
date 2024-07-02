import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast, ToastContainer } from 'react-toastify';
import '../orders/Orders.css'



const KitchenConsumption = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

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
    const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

    const today = new Date().toISOString().split('T')[0]; // Today's date in the format YYYY-MM-DD
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
        // Make a PUT request to update an item
        const newquantityTransferredToKitchen = kitconsumption.quantityTransferredToKitchen + quantityTransferredToKitchen
        const newBalance = kitconsumption.bookBalance + quantityTransferredToKitchen
        const response = await axios.put(`${apiUrl}/api/kitchenconsumption/${kitconsumption._id}`, {
          quantityTransferredToKitchen: newquantityTransferredToKitchen,
          createdBy,
          bookBalance: newBalance
        }, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        });

        // Check if the item was updated successfully
        if (response.status === 200) {
          setstockItemId('')
          setstockItemName('')
          setquantityTransferredToKitchen(0)
          getKitchenConsumption()
          // Show a success toast if the quantity is added
          toast.success('تمت إضافة الكمية بنجاح');
        } else {
          // Show an error toast if adding the quantity failed
          toast.error('فشلت عملية إضافة الكمية');
        }
      } catch (error) {
        // Show an error toast if an error occurs during the request
        toast.error('فشلت عملية إضافة الكمية');
        console.error(error);
      }

    } else {
      try {
        const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

        // Make a POST request to add an item
        const response = await axios.post(apiUrl + '/api/kitchenconsumption', {
          stockItemId,
          stockItemName,
          quantityTransferredToKitchen,
          bookBalance: quantityTransferredToKitchen,
          unit,
          createdBy
        }, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        });

        // Check if the item was added successfully
        if (response.status === 201) {
          setstockItemId('')
          setstockItemName('')
          setquantityTransferredToKitchen(0)
          getKitchenConsumption()
          // Show a success toast if the item is added
          toast.success('تمت إضافة العنصر بنجاح');
        } else {
          // Show an error toast if adding the item failed
          toast.error('فشلت عملية إضافة العنصر');
        }
      } catch (error) {
        // Show an error toast if an error occurs during the request
        toast.error('فشلت عملية إضافة العنصر');
        console.error(error);
      }

    }
  };

  const updateKitchenItem = async (e) => {
    e.preventDefault()
    console.log('updateKitchenItem')
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const update = await axios.put(`${apiUrl}/api/kitchenconsumption/${KitchenItemId}`, {
        adjustment,
        actualBalance
      }, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
      if (update.status === 200) {
        try {
          // Make a POST request to add an item
          const response = await axios.post(apiUrl + '/api/kitchenconsumption', {
            stockItemId,
            stockItemName,
            quantityTransferredToKitchen: actualBalance,
            bookBalance: actualBalance,
            unit,
            createdBy
          }, {
            headers: {
              'authorization': `Bearer ${token}`, // Send the token in the authorization header
            },
          });

          // Check if the item was added successfully
          if (response.status === 201) {
            setstockItemId('')
            setstockItemName('')
            setquantityTransferredToKitchen(0)
            getKitchenConsumption()
            // Show a success toast if the item is added
            toast.success('تمت تعديل العنصر بنجاح');
          } else {
            // Show an error toast if adding the item failed
            toast.error('فشلت عملية تعديل العنصر');
          }
        } catch (error) {
          // Show an error toast if an error occurs during the request
          toast.error('فشلت عملية تعديل العنصر');
          console.error(error);
        }
      }
    } catch (error) {
      console.error('Error occurred:', error);
      // Add toast for error
      toast.error('حدث خطأ');
    }
  };



  const [listOfOrders, setlistOfOrders] = useState([])
  // Fetch orders from API
  const getAllOrders = async () => {
    try {
      const res = await axios.get(apiUrl + '/api/order');
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
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const response = await axios.get(apiUrl + '/api/stockitem/', {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });

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
  //     const res = await axios.get(apiUrl+'/api/categoryStock/');
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
      const response = await axios.get(apiUrl + '/api/product/');
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
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      console.log('Fetching kitchen consumption...');
      const response = await axios.get(apiUrl + '/api/kitchenconsumption', {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
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
        ({ employeeLoginInfo, usertitle, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <ToastContainer />
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>الاستهلاك</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addItemModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        {/* <a href="#updateItemModal" className="btn w-50 btn-danger" data-toggle="modal" ><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
                      </div>
                    </div>
                  </div>
                  <div class="table-filter print-hide">
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
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التاريخ</label>
                          <input id="dateInput"
                            type="date"
                            value={date} class="form-control" onChange={handleDateChange} />
                        </div>

                        <div class="filter-group">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByKitchenConsumption(e.target.value)} />
                        </div>

                        <div class="filter-group">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">اختر الصنف</label>
                          <select class="form-control" onChange={(e) => searchByKitchenConsumption(e.target.value)} >
                            <option value={""}>الكل</option>
                            {filteredKitchenConsumptionToday.map((consumption) => {
                              return (<option value={consumption.stockItemName}>{consumption.stockItemName}</option>)
                            })}
                          </select>
                        </div>
                        {/* <div class="filter-group">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">Location</label>
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
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">Status</label>
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
                                    <a href="#updateKitchenItemModal" className="edit" data-toggle="modal" onClick={() => {
                                      setcreatedBy(employeeLoginInfo.employeeinfo.id); setKitchenItemId(item._id);
                                      setstockItemId(item.stockItemId); setstockItemName(item.stockItemName); setquantityTransferredToKitchen(item.quantityTransferredToKitchen); setbookBalance(item.bookBalance); setunit(item.unit);
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
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">اضافه صنف </h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">

                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الصنف</label>
                          <select name="category" id="category" form="carform" onChange={(e) => { setstockItemId(e.target.value); setunit(AllStockItems.filter(stock => stock._id == e.target.value)[0].smallUnit); setcreatedBy(employeeLoginInfo.employeeinfo.id); setstockItemName(AllStockItems.filter(it => it._id == e.target.value)[0].itemName) }}>
                            <option>اختر الصنف</option>
                            {AllStockItems.map((StockItems, i) => {
                              return <option value={StockItems._id} key={i} >{StockItems.itemName}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">رصيد محول</label>
                          <input type='Number' className="form-control" required onChange={(e) => setquantityTransferredToKitchen(Number(e.target.value))} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الوحدة </label>
                          <input type='text' className="form-control" required defaultValue={unit}></input>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التاريخ</label>
                          <input type='text' className="form-control" Value={new Date().toLocaleDateString()} required readOnly />
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn w-50 btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="updateKitchenItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateKitchenItem(e)}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">تسويه الرصيد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">اسم الصنف</label>
                          <input type="text" className="form-control" defaultValue={stockItemName} required />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الكمية المستلمة</label>
                          <input type="text" className="form-control" defaultValue={quantityTransferredToKitchen} required readOnly />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الكمية المستهلكه</label>
                          <input type="text" className="form-control" defaultValue={consumptionQuantity} required readOnly />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الرصيد الدفتري</label>
                          <input type="text" className="form-control" defaultValue={bookBalance} required readOnly />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الرصيد الفعلي</label>
                          <input type="Number" className="form-control" required onChange={(e) => {
                            setadjustment(Number(e.target.value) - bookBalance); setactualBalance(e.target.value)
                          }} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التسويه</label>
                          <input type="text" className="form-control" defaultValue={adjustment} required readOnly />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الوحدة </label>
                          <input type='text' className="form-control" defaultValue={unit} required></input>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التاريخ</label>
                          <input type='text' className="form-control" defaultValue={new Date().toLocaleDateString()} required readOnly />
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn w-50 btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>


              {/* <div id="updateItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={updateKitchenItem}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn w-50 btn-danger" value="تحديث" />
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