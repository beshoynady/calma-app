import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';


const Purchase = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const [allrecipes, setallrecipes] = useState([]);

  const getallrecipes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/recipe`, config);
      console.log(response)
      const allRecipe = await response.data;
      setallrecipes(allRecipe)
      console.log(allRecipe)

    } catch (error) {
      console.log(error)
    }

  }

  const [StockItems, setStockItems] = useState([]);
  const getaStockItems = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/stockitem/', config);
      if (response) {
        console.log(response.data)
        setStockItems(response.data.reverse())
      }
    } catch (error) {
      toast.error('فشل استيراد الاصناف بشكل صحيح !اعد تحميل الصفحة ')
    }

  }

  const Stockmovement = ['Purchase', 'ReturnPurchase', 'Issuance', 'ReturnIssuance', 'Wastage', 'Damaged'];
  const [movement, setmovement] = useState('');
  const [itemId, setitemId] = useState("");
  const [itemName, seitemName] = useState("");
  const [largeUnit, setlargeUnit] = useState('')
  const [smallUnit, setsmallUnit] = useState('')
  const [quantity, setquantity] = useState(0);
  const [price, setprice] = useState(0);
  const [cost, setcost] = useState(0)
  const [oldCost, setoldCost] = useState(0)
  const [newcost, setnewcost] = useState(0)
  const [oldBalance, setoldBalance] = useState(0)
  const [newBalance, setnewBalance] = useState(0)
  const [costOfPart, setcostOfPart] = useState();
  const [parts, setparts] = useState();
  const [expirationDate, setexpirationDate] = useState();
  const [cashRegister, setcashRegister] = useState('');
  const [expirationDateEnabled, setExpirationDateEnabled] = useState(false);


  const [AllCashRegisters, setAllCashRegisters] = useState([]);
  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/cashregister', config);
      setAllCashRegisters(response.data.reverse());
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };

  const [actionId, setactionId] = useState("")
  const actionAt = new Date().toLocaleString()
  const [AllStockactions, setAllStockactions] = useState([]);

  const createStockAction = async (e) => {
    console.log({
      itemId,
      movement,
      quantity,
      cost,
      oldCost,
      balance: newBalance,
      oldBalance,
      price,
    })
    e.preventDefault();
    console.log({ newBalance: newBalance })
    console.log({ newcost: newcost })
    console.log({ price: price })
    try {
      const unit = movement == 'Purchase' ? largeUnit : smallUnit

      // Update the stock item's movement
      const changeItem = await axios.put(`${apiUrl}/api/stockitem/movement/${itemId}`, { newBalance, price, newcost, costOfPart }, config);

      console.log(changeItem);

      if (changeItem.status === 200) {
        // Create a new stock action
        const response = await axios.post(apiUrl + '/api/stockmanag/', {
          itemId,
          movement,
          quantity,
          cost,
          oldCost,
          unit,
          balance: newBalance,
          oldBalance,
          price,
          ...(movement === 'Purchase' && { expirationDate }),
          actionAt,
        }, config);

        console.log(response.data);

        if (movement === 'Purchase') {
          for (const recipe of allrecipes) {
            const recipeid = recipe._id;
            const productname = recipe.product.name;
            const arrayingredients = recipe.ingredients;

            const newIngredients = arrayingredients.map((ingredient) => {
              if (ingredient.itemId === itemId) {
                const costofitem = costOfPart;
                const unit = ingredient.unit
                const amount = ingredient.amount
                const totalcostofitem = amount * costOfPart
                return { itemId, name: itemName, amount, costofitem, unit, totalcostofitem };
              } else {
                return ingredient;
              }
            });
            console.log({ newIngredients })
            const totalcost = newIngredients.reduce((acc, curr) => {
              return acc + (curr.totalcostofitem || 0);
            }, 0);
            // Update the product with the modified recipe and total cost
            const updateRecipe = await axios.put(`${apiUrl}/api/recipe/${recipeid}`, { ingredients: newIngredients, totalcost }, config);

            console.log({ updateRecipe });

            // Toast for successful update based on recipe change
            toast.success(`تم تحديث وصفة  ${productname}`);
          }
        }
      }

      // Update the stock actions list and stock items
      getallStockaction();
      getaStockItems();

      // Toast notification for successful creation
      toast.success('تم تسجيل حركه المخزن بنجاح');
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل تسجيل حركه المخزن ! حاول مره اخري');
    }
  };


  const updateStockaction = async (e, employeeId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
      const actionBy = employeeId;
      const unit = movement == 'Purchase' ? largeUnit : smallUnit

      // Update the stock item's movement
      const changeItem = await axios.put(`${apiUrl}/api/stockitem/movement/${itemId}`, { newBalance, price, newcost, costOfPart }, config);

      if (changeItem.status === 200) {
        // Update the existing stock action
        const response = await axios.put(`${apiUrl}/api/stockmanag/${actionId}`, {
          itemId, movement, quantity, cost, unit, newBalance, oldBalance, price, expirationDate,
          actionBy
        }, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data);

        if (movement === 'Purchase') {
          for (const recipe of allrecipes) {
            const recipeid = recipe._id;
            const productname = recipe.product.name;
            const arrayingredients = recipe.ingredients;

            const newIngredients = arrayingredients.map((ingredient) => {
              if (ingredient.itemId === itemId) {
                const costofitem = costOfPart;
                const unit = ingredient.unit
                const amount = ingredient.amount
                const totalcostofitem = amount * costOfPart
                return { itemId, name: itemName, amount, costofitem, unit, totalcostofitem };
              } else {
                return ingredient;
              }
            });
            console.log({ newIngredients })
            const totalcost = newIngredients.reduce((acc, curr) => {
              return acc + (curr.totalcostofitem || 0);
            }, 0);
            // Update the product with the modified recipe and total cost
            const updateRecipe = await axios.put(
              `${apiUrl}/api/recipe/${recipeid}`,
              { ingredients: newIngredients, totalcost }, config
            );

            console.log({ updateRecipe });

            // Toast for successful update based on recipe change
            toast.success(`تم تحديث وصفه ${productname}`);
          }
        }
        // Update the stock actions list and stock items
        getallStockaction();
        getaStockItems();

        // Toast notification for successful update
        toast.success('تم تحديث العنصر بنجاح');
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل في تحديث العنصر ! حاول مره اخري');
    }
  }


  const getallStockaction = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/stockmanag/', config);
      console.log(response.data)
      const Stockactions = await response.data;
      setAllStockactions(Stockactions.reverse())
    } catch (error) {
      console.log(error)
    }
  }

  const deleteStockaction = async (e) => {
    e.preventDefault();
    try {
      // Delete the selected stock action
      const response = await axios.delete(`${apiUrl}/api/stockmanag/${actionId}`, config);
      console.log(response);

      if (response) {
        // Update the stock actions list after successful deletion
        getallStockaction();

        // Toast notification for successful deletion
        toast.success('تم حذف حركه المخزن بنجاح');
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل حذف حركه المخزن ! حاول مره اخري ');
    }
  }


  const itemname = (id) => {
    const item = StockItems.filter(item => item._id == id)[0]
    if (item) {
      return item.itemName
    } else {
      return 'غير متوفر'
    }
  }

  const [StockitemFilterd, setStockitemFilterd] = useState([])
  const searchByitem = (item) => {
    const items = AllStockactions.filter((action) => itemname(action.itemId).startsWith(item) == true)
    setStockitemFilterd(items)
  }
  const searchByaction = (action) => {
    const items = AllStockactions.filter((Stockactions) => Stockactions.movement == action)
    setStockitemFilterd(items)
  }

  const [AllSuppliers, setAllSuppliers] = useState([]);
  // Function to retrieve all suppliers
  const getAllSuppliers = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/supplier/', config);

      if (!response || !response.data) {
        // Handle unexpected response or empty data
        throw new Error('استجابة غير متوقعة أو بيانات فارغة');
      }

      const suppliers = response.data.reverse();
      if (suppliers.length > 0) {
        setAllSuppliers(suppliers);
        toast.success('تم استرداد جميع الموردين بنجاح');
      }

      // Notify on success
    } catch (error) {
      console.error(error);

      // Notify on error
      toast.error('فشل في استرداد الموردين');
    }
  };


  const [items, setItems] = useState([{ item: '', quantity: 0, price: 0, total: 0, expirationDate: '' }]);
  const handleNewItem = () => {
    setItems([...items, { item: '', quantity: 0, price: 0, total: 0, expirationDate: '' }])
  }
  const handleDeleteItem = (index) => {
    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
  }
  const handleItemId = (id, index) => {
    const updatedItems = [...items]
    updatedItems[index].item = id
    console.log({updatedItems})
    setItems(updatedItems)
  }
  const handleQuantity = (quantity, index) => {
    const updatedItems = [...items]
    updatedItems[index].quantity = Number(quantity)
    updatedItems[index].total = Number(quantity) * Number(updatedItems[index].price);
    console.log({updatedItems})
    setItems(updatedItems)

  }
  const handlePrice = (price, index) => {
    const updatedItems = [...items]
    updatedItems[index].price = Number(price)
    updatedItems[index].total = Number(updatedItems[index].quantity) * Number(price);
    console.log({updatedItems})
    setItems(updatedItems)
  }
  const handleExpirationDate = (date, index) => {
    const updatedItems = [...items]
    updatedItems[index].expirationDate = new Date(date);
    console.log({updatedItems})
    setItems(updatedItems)
  }
  const [totalAmount, setTotalAmount] = useState(0);
  const clacTotalAmount =()=>{
    let total = 0 
    items.forEach(item=>{
      total += item.total
    })
    setTotalAmount(total)
  }
  useEffect(()=>{
    clacTotalAmount()
  },[price, quantity])

  const [additionalCost, setAdditionalCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const calcNetAmount=()=>{
    let total = totalAmount + additionalCost + salesTax - discount
    setNetAmount(total)
  }
  useEffect(()=>{
    calcNetAmount()
  },[additionalCost,discount,salesTax])
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [CashRegister, setCashRegister] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [invoiceType, setInvoiceType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');


  const createPurchaseInvoice = async (e) => {
    e.preventDefault()
    try {
      const newInvoice = {
        invoiceNumber,
        date,
        supplier,
        items,
        totalAmount,
        discount,
        netAmount,
        salesTax,
        additionalCost,
        paidAmount,
        balanceDue,
        paymentDueDate,
        CashRegister,
        paymentStatus,
        invoiceType,
        paymentMethod,
        notes,
      }
      const response = await axios.post(`${apiUrl}/api/invoice`, newInvoice, config);
      if (response.status === 200) {
        getAallPurchases();
        toast.success('تم اضافه المشتريات بنجاح')
      } else {
        toast.error('فشل اضافه المشتريات ! حاول مره اخري')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
    }
  }

  const [allPurchaseInvoice, setallPurchaseInvoice] = useState([])
  const getAallPurchases = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/purchaseinvoice', config);
      if (response.status === 200) {
        setallPurchaseInvoice(response.data)
      } else {
        toast.error('فشل جلب جميع فواتير المشتريات ! اعد تحميل الصفحة')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب فواتير المشتريات ! اعد تحميل الصفحة')
    }
  }



  useEffect(() => {
    getAallPurchases()
    getallStockaction()
    getaStockItems()
    getAllCashRegisters()
    getallrecipes()
    getAllSuppliers()
  }, [])


  useEffect(() => {
    if (movement === "Issuance" || movement === "Wastage" || movement === "Damaged") {
      const calcNewBalance = Number(oldBalance) - (Number(quantity) / Number(parts));
      const calcNewCost = Number(oldCost) - Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    } else if (movement === "ReturnIssuance") {
      const calcNewBalance = Number(oldBalance) + (Number(quantity) / Number(parts));
      const calcNewCost = Number(oldCost) + Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    } else if (movement === 'Purchase') {
      const calcNewBalance = Number(oldBalance) + Number(quantity);
      const calcNewCost = Number(oldCost) + Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      console.log({ calcNewBalance, calcNewCost, calcCostOfPart, countparts })
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    } else if (movement === "ReturnPurchase") {
      const calcNewBalance = Number(oldBalance) - Number(quantity);
      const calcNewCost = Number(oldCost) - Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    }
  }, [quantity, price]);


  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المخزون</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addPurchaseInvoiceModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <label>اضافه منتج جديد</label></a>

                        <a href="#deleteStockactionModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <label>حذف</label></a>
                      </div>
                    </div>
                  </div>
                  <div className="table-filter">
                    <div className="row text-dark">
                      <div className="col-sm-3">
                        <div className="show-entries">
                          <label>عرض</label>
                          <select className="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                            {
                              (() => {
                                const options = [];
                                for (let i = 5; i < 100; i += 5) {
                                  options.push(<option key={i} value={i}>{i}</option>);
                                }
                                return options;
                              })()
                            }
                          </select>
                          <label>صفوف</label>
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <button type="button" className="btn btn-47 btn-primary"><i className="fa fa-search"></i></button>
                        <div className="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" className="form-control" onChange={(e) => searchByitem(e.target.value)} />
                        </div>
                        <div className="filter-group">
                          <label>نوع الاوردر</label>
                          <select className="form-control" onChange={(e) => searchByaction(e.target.value)} >
                            <option value={""}>الكل</option>
                            {Stockmovement.map(movement => {
                              return <option value={movement}>{movement}</option>;
                            })}
                          </select>
                        </div>

                        {/* <div className="filter-group">
                          <label>Location</label>
                          <select className="form-control">
                            <option>All</option>
                            <option>Berlin</option>
                            <option>London</option>
                            <option>Madrid</option>
                            <option>New York</option>
                            <option>Paris</option>
                          </select>
                        </div>
                        <div className="filter-group">
                          <label>Status</label>
                          <select className="form-control">
                            <option>Any</option>
                            <option>Delivered</option>
                            <option>Shipped</option>
                            <option>Pending</option>
                            <option>Cancelled</option>
                          </select>
                        </div>
                        <label className="filter-icon"><i className="fa fa-filter"></i></label> */}
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>
                          <label className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </label>
                        </th>
                        <th>م</th>
                        <th>التاريخ</th>
                        <th>الفاتوره</th>
                        <th>المورد</th>
                        <th>الاجمالي</th>
                        <th>الخصم</th>
                        <th>الضريبه</th>
                        <th>اضافية</th>
                        <th>الاجمالي</th>
                        <th>نوع الفاتورة</th>
                        <th>دفع</th>
                        <th>باقي</th>
                        <th>تاريخ الاستحقاق</th>
                        <th>طريقه الدفع</th>
                        <th>الحالة</th>
                        <th>الخزينه</th>
                        <th>تم بواسطه</th>
                        <th>ملاحظات</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allPurchaseInvoice.length > 0 && allPurchaseInvoice.map((invoice, i) => {
                        if (i >= startpagination & i < endpagination) {
                          return (
                            <tr key={i}>
                              <td>
                                <label className="custom-checkbox">
                                  <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                  <label htmlFor="checkbox1"></label>
                                </label>
                              </td>
                              <td>{i + 1}</td>
                              <td>{invoice.date}</td>
                              <td>{invoice.invoiceNumber}</td>
                              <td>{invoice.supplier.name}</td>
                              <td>{invoice.totalAmount}</td>
                              <td>{invoice.discount}</td>
                              <td>{invoice.salesTax}</td>
                              <td>{invoice.additionalCost}</td>
                              <td>{invoice.netAmount}</td>
                              <td>{invoice.invoiceType}</td>
                              <td>{invoice.paidAmount}</td>
                              <td>{invoice.balanceDue}</td>
                              <td>{invoice.paymentStatus}</td>
                              <td>{invoice.paymentStatus}</td>
                              <td>{invoice.paymentMethod}</td>
                              <td>{invoice.CashRegister}</td>
                              <td>{usertitle(invoice.createdBy)}</td>
                              <td>{usertitle(invoice.notes)}</td>
                              <td>
                                {/* <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); seitemName(action.itemName); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a> */}
                              </td>
                            </tr>
                          )
                        }
                      })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{allPurchaseInvoice.length > endpagination ? endpagination : allPurchaseInvoice.length}</b> من <b>{allPurchaseInvoice.length}</b> عنصر</div>
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
              <div id="addPurchaseInvoiceModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => createPurchaseInvoice(e)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body container ">

                        <div className="card">
                          <div className="card-header text-center">
                            <h4>ادخل بيانات فاتورة الشراء</h4>
                          </div>

                          <div className="card-body min-content">
                            <div className="row">
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="supplierSelect">المورد</span>
                                  <select className="form-select" id="supplierSelect" onChange={(e) => setAllSuppliers(e.target.value)}>
                                    {AllSuppliers.map((supplier, i) => (
                                      <option value={supplier._id} key={i}>{supplier.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="notesInput">الملاحظات</span>
                                  <input type="text" className="form-control" id="notesInput" placeholder="الملاحظات" onChange={(e) => setNotes(e.target.value)} />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="invoiceNumberInput">رقم الفاتورة</span>
                                  <input type="text" className="form-control" id="invoiceNumberInput" placeholder="رقم الفاتورة" onChange={(e) => setInvoiceNumber(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="invoiceDateInput">تاريخ الفاتورة</span>
                                  <input type="date" className="form-control" id="invoiceDateInput" placeholder="تاريخ الفاتور" />
                                </div>
                              </div>
                            </div>

                            <table className="table table-bordered table-striped table-hover">
                              <thead className="table-success">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col" className="col-4">الصنف</th>
                                  <th scope="col" className="col-2">الكمية</th>
                                  <th scope="col" className="col-2">السعر</th>
                                  <th scope="col" className="col-2">الثمن</th>
                                  <th scope="col" className="col-2">انتهاء</th>
                                  <th scope="col" className="col-4 NoPrint">
                                    <button type="button" className="btn btn-sm btn-success" onClick={handleNewItem}>+</button>
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="TBody">
                                {items.map((item, i) => (
                                  <tr id="TRow" key={i}>
                                    <th scope="row">{i + 1}</th>
                                    <td>
                                      <select className="form-select" onChange={(e)=>handleItemId(e.target.value, i)}>
                                        <option value="">
                                          {StockItems && StockItems.filter(stock => stock._id === item.item)[0]?.name}
                                        </option>
                                        {StockItems.map((stock, j) => (
                                          <option value={stock._id} key={j}>{stock.itemName}</option>
                                        ))}
                                      </select>
                                    </td>
                                    <td><input type="number" className="form-control" name="qty" onChange={(e) => handleQuantity(e.target.value, i)} /></td>
                                    <td><input type="number" className="form-control" name="price" onChange={(e) => handlePrice(e.target.value, i)} /></td>
                                    <td><input type="text" className="form-control" defaultValue={item.total} name="amt" readOnly /></td>
                                    <td><input type="date" className="form-control" name="Exp" onChange={(e) => handleExpirationDate(e.target.value, i)} /></td>
                                    <td className="NoPrint"><button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>


                            <div className="row">
                              <div className="col-6">
                                <button type="button" className="btn btn-primary" >Print</button>
                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="totalInput">الإجمالي</span>
                                  <input type="text" className="form-control text-end" defaultValue={totalAmount} id="totalInput" readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e)=>setSalesTax(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">خصم</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e)=>setDiscount(e.target.value)}/>
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">تكلفه اضافية</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e)=>setAdditionalCost(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="netAmountInput">المبلغ الصافي</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" defaultValue={netAmount} readOnly/>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* <div id="editStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateStockaction(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <span>نوع الحركه</span>
                          <select name="" id="" onChange={(e) => setmovement(e.target.value)}>
                            <option >اختر الاجراء</option>
                            {Stockmovement.map((statu, i) => {
                              return <option key={i} defaultValue={statu}>{statu}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الصنف</label>
                          <select name="" id="" onChange={(e) => {
                            setitemId(e.target.value);
                            setlargeUnit(StockItems.filter(i => i._id == e.target.value)[0].largeUnit);
                            setsmallUnit(StockItems.filter(i => i._id == e.target.value)[0].smallUnit);
                          }}>
                            <option >اختر الصنف</option>
                            {StockItems.map((item, i) => {
                              return <option key={i} value={item._id}>{item.itemName}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الكمية</label>
                          {movement == "Issuance" || movement === "ReturnIssuance" || movement == "Wastage" || movement == "Damaged" ?
                            <>
                              <input type='Number' className="form-control" required onChange={(e) => { setquantity(e.target.value); setcost(Number(e.target.value) * costOfPart) }} />
                              <input type='text' className="form-control" defaultValue={smallUnit} readOnly />
                            </>
                            : movement == "Purchase" || movement == "ReturnPurchase" ? <>
                              <input type='Number' className="form-control" required onChange={(e) => { setquantity(e.target.value); }} />
                              <input type='text' className="form-control" defaultValue={largeUnit} readOnly />
                            </> : ''}
                        </div>

                        <div className="form-group form-group-47">
                          <label>السعر</label>
                          {movement == "Issuance" || movement === "ReturnIssuance" || movement == "Wastage" || movement == "Damaged" ?
                            <input type='Number' className="form-control" readOnly required defaultValue={price} />
                            : <input type='Number' className="form-control" required onChange={(e) => { setprice(Number(e.target.value)); setcost(e.target.value * quantity) }} />
                          }
                        </div>
                        <div className="form-group form-group-47">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" Value={cost} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={oldBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد الجديد</label>
                          <input type='text' className="form-control" Value={newBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={actionAt} readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
              {/* <div id="deleteStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockaction}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
            </div>


          )
        }
      }
    </detacontext.Consumer >

  )
}

export default Purchase