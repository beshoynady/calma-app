import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';




const PurchaseReturn = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const [AllStockactions, setAllStockactions] = useState([]);

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

  const Stockmovement = ['Purchase', 'ReturnPurchase'];

  const createStockAction = async (item, receiverid) => {
    const itemId = item.itemId;
    const quantity = item.quantity;
    const price = Number(item.price);
    const cost = item.cost;
    const expirationDate = item.expirationDate
    const movement = 'Purchase'
    const receiver = receiverid
    const itemPercentage = Number(price) / Number(netAmount)
    const itemAdditionalCost = additionalCost * itemPercentage
    const costOfItem = itemAdditionalCost + price
    const stockItem = StockItems.filter(item => item._id === itemId)[0]
    console.log({ stockItem })
    
    const itemName = stockItem.itemName
    const oldBalance = stockItem.currentBalance
    const parts = stockItem.parts
    const currentBalance = Number(quantity) + Number(oldBalance);
    const unit = stockItem.largeUnit
    const costOfPart = Math.round((Number(costOfItem) / Number(parts)) * 100) / 100;
    console.log({itemPercentage,itemAdditionalCost,costOfItem, parts, price, costOfPart })
    try {

      // Update the stock item's movement
      const changeItem = await axios.put(`${apiUrl}/api/stockitem/movement/${itemId}`,
        { currentBalance, price, costOfPart }, config);
      console.log(changeItem);

      if (changeItem.status === 200) {
        // Create a new stock action
        const response = await axios.post(apiUrl + '/api/stockmanag/', {
          itemId,
          movement,
          quantity,
          cost,
          unit,
          balance: currentBalance,
          oldBalance,
          price,
          supplier,
          receiver,
          expirationDate,
        }, config);

        console.log(response);

        for (const recipe of allrecipes) {
          const recipeid = recipe._id;
          const productname = recipe.productId.name;
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
          const updateRecipe = await axios.put(`${apiUrl}/api/recipe/${recipeid}`,
            { ingredients: newIngredients, totalcost }, config);

          console.log({ updateRecipe });

          // Toast for successful update based on recipe change
          toast.success(`تم تحديث وصفة  ${productname}`);
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


  const [listtransactionType, setlistTransactionType] = useState(['OpeningBalance', 'Purchase', 'Payment', 'PurchaseReturn', 'Refund']);
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const handleAddSupplierTransactionPurchase = async (invoiceNumber) => {
    try {
      let newCurrentBalance = 0
      const transactionType = 'Purchase'
      const amount = netAmount
      const transactionDate = invoiceDate
      const currentBalance = previousBalance + amount
      const requestData = { invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

      console.log({ requestData })

      const response = await axios.post(`${apiUrl}/api/suppliertransaction`, requestData, config);
      console.log({ response })
      if (response.status === 201) {
        const supplierresponse = await axios.put(`${apiUrl}/api/supplier/${supplier}`, { currentBalance }, config);

        newCurrentBalance = Number(supplierresponse.data.updatedSupplier.currentBalance)

        console.log({ supplierresponse })
        toast.success('تم انشاء العملية بنجاح');
      } else {
        toast.error('حدث خطأ أثناء انشاء العملية');
      }

      if (paidAmount > 0) {
        const transactionType = 'Payment'
        const amount = paidAmount
        const transactionDate = invoiceDate
        const previousBalance = newCurrentBalance
        const currentBalance = previousBalance - paidAmount
        const requestData = { invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

        console.log({ requestData })

        const response = await axios.post(`${apiUrl}/api/suppliertransaction`, requestData, config);
        console.log({ response })
        if (response.status === 201) {
          const supplierresponse = await axios.put(`${apiUrl}/api/supplier/${supplier}`, { currentBalance }, config);
          console.log({ supplierresponse })
          toast.success('تم انشاء العملية بنجاح');
        } else {
          toast.error('حدث خطأ أثناء انشاء العملية');
        }
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء انشاء العملية');
    }
  };




  const [items, setItems] = useState([{ itemId: '', quantity: 0, largeUnit: '', price: 0, cost: 0, expirationDate: '' }]);

  const handleNewItem = () => {
    setItems([...items, { itemId: '', quantity: 0, price: 0, largeUnit: '', cost: 0, expirationDate: '' }])
  }

  const handleDeleteItem = (index) => {
    const updatedItems = [...items]
    updatedItems.splice(index, 1)
    setItems(updatedItems)
    clacTotalAmount()
  }
  const handleItemId = (id, index) => {
    const stockitem = StockItems.filter(item => item._id === id)[0]
    const updatedItems = [...items]
    updatedItems[index].itemId = stockitem._id
    updatedItems[index].largeUnit = stockitem.largeUnit
    console.log({ updatedItems })
    setItems(updatedItems)

  }
  const handleQuantity = (quantity, index) => {
    const updatedItems = [...items]
    updatedItems[index].quantity = Number(quantity)
    updatedItems[index].cost = Number(quantity) * Number(updatedItems[index].price);
    console.log({ updatedItems })
    setItems(updatedItems)
    clacTotalAmount()
  }
  const handlePrice = (price, index) => {
    const updatedItems = [...items]
    updatedItems[index].price = Number(price)
    updatedItems[index].cost = Number(updatedItems[index].quantity) * Number(price);
    console.log({ updatedItems })
    setItems(updatedItems)
    clacTotalAmount()
  }
  const handleExpirationDate = (date, index) => {
    const updatedItems = [...items]
    updatedItems[index].expirationDate = new Date(date);
    console.log({ updatedItems })
    setItems(updatedItems)
  }
  const [totalAmount, setTotalAmount] = useState(0);
  const clacTotalAmount = () => {
    let total = 0
    items.forEach(item => {
      total += item.cost
    })
    setTotalAmount(total)
  }

  const [additionalCost, setAdditionalCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [salesTax, setSalesTax] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const calcNetAmount = () => {
    // let total = Number(totalAmount) + Number(additionalCost) + Number(salesTax) - Number(discount)
    let total = Number(totalAmount) + Number(salesTax) - Number(discount)
    setNetAmount(total)
    setBalanceDue(total)

  }


  useEffect(() => {
    calcNetAmount()
  }, [items, additionalCost, discount, salesTax])

  const [supplier, setSupplier] = useState('');
  const [financialInfo, setFinancialInfo] = useState('');
  const [supplierInfo, setsupplierInfo] = useState('');

  const handleSupplier = (id) => {
    setSupplier(id)
    const findSupplier = AllSuppliers.filter(supplier => supplier._id === id)[0]
    setsupplierInfo(findSupplier)
    setFinancialInfo(findSupplier.financialInfo)
    setPreviousBalance(findSupplier.currentBalance)
  }


  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setinvoiceDate] = useState(new Date());

  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [paymentType, setpaymentType] = useState('');

  const handlePaidAmount = (amount) => {
    setPaidAmount(amount);
    setBalanceDue(Number(netAmount) - Number(amount));
    if (amount == 0) {
      setPaymentStatus('unpaid');
      setpaymentType('credit');
    } else if (amount == netAmount) {
      setPaymentStatus('paid');
      setpaymentType('cash');
    } else if (amount < netAmount) {
      setPaymentStatus('partially_paid');
      setpaymentType('credit');
    }
  };



  const [cashRegister, setCashRegister] = useState('');
  const [CashRegisterBalance, setCashRegisterBalance] = useState(0);
  const handleCashRegister = (id) => {
    const filterCashRegister = AllCashRegisters.filter(CashRegister => CashRegister.id === id)[0]
    setCashRegister(filterCashRegister._id)
    setCashRegisterBalance(filterCashRegister.balance)
  };


  const [paymentMethod, setPaymentMethod] = useState('');
  const handlePaymentMethod = (Method, employeeId) => {
    setPaymentMethod(Method)
    handleCashRegister(employeeId)
  }

  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [notes, setNotes] = useState('');


  const createPurchaseInvoice = async (e, receiverId) => {

    e.preventDefault()
    try {
      const newInvoice = {
        invoiceNumber,
        invoiceDate,
        supplier,
        items,
        totalAmount,
        discount,
        salesTax,
        netAmount,
        additionalCost,
        paidAmount,
        balanceDue,
        paymentDueDate,
        cashRegister,
        paymentStatus,
        paymentType,
        paymentMethod,
        notes,
      }
      console.log({ newInvoice })
      const response = await axios.post(`${apiUrl}/api/purchaseinvoice`, newInvoice, config);
      console.log({ response })
      if (response.status === 201) {
        items.forEach(item => {
          createStockAction(item, receiverId)
        })

        await handleAddSupplierTransactionPurchase(response.data._id)
        getAllPurchases();
        toast.success('تم اضافه المشتريات بنجاح')
      } else {
        toast.error('فشل اضافه المشتريات ! حاول مره اخري')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
    }
  }

  const [invoice, setinvoice] = useState({})

  const getInvoice = async (id) => {
    try {
      const resInvoice = await axios.get(`${apiUrl}/api/purchaseinvoice/${id}`, config)
      if (resInvoice) {
        setinvoice(resInvoice.data)
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب الفاتوره ! اعد تحميل الصفحة و حاول مره اخري')
    }
  }

  const handlePurchaseReturn = async (e, receiverId) => {

    e.preventDefault()
    try {
      const newInvoice = {
        returnInvoice: true,
        invoiceNumber,
        invoiceDate,
        supplier,
        items,
        totalAmount,
        discount,
        salesTax,
        netAmount,
        additionalCost,
        paidAmount,
        balanceDue,
        paymentDueDate,
        cashRegister,
        paymentStatus,
        paymentType,
        paymentMethod,
        notes,
      }
      console.log({ newInvoice })
      const response = await axios.post(`${apiUrl}/api/purchaseinvoice`, newInvoice, config);
      console.log({ response })
      if (response.status === 201) {
        items.forEach(item => {
          createStockAction(item, receiverId)
        })

        await handleAddSupplierTransactionPurchase(response.data._id)
        getAllPurchases();
        toast.success('تم اضافه المشتريات بنجاح')
      } else {
        toast.error('فشل اضافه المشتريات ! حاول مره اخري')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
    }
  }

  const [allPurchaseInvoice, setallPurchaseInvoice] = useState([])
  const getAllPurchases = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/purchaseinvoice', config);
      console.log({ response })
      if (response.status === 200) {
        setallPurchaseInvoice(response.data.reverse())
      } else {
        toast.error('فشل جلب جميع فواتير المشتريات ! اعد تحميل الصفحة')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب فواتير المشتريات ! اعد تحميل الصفحة')
    }
  }


  const [StockitemFilterd, setStockitemFilterd] = useState([])
  const searchByitem = (item) => {
    const items = AllStockactions.filter((action) => action.itemId.itemName.startsWith(item) == true)
    setStockitemFilterd(items)
  }
  const searchByaction = (action) => {
    const items = AllStockactions.filter((Stockactions) => Stockactions.movement == action)
    setStockitemFilterd(items)
  }


  const confirmPayment = async (e) => {
    e.preventDefault();
    const updatedbalance = CashRegisterBalance - paidAmount; // Calculate the updated balance

    try {

      // await handleAddSupplierTransactionPaymentPurchase()

      const cashMovement = await axios.post(apiUrl + '/api/cashMovement/', {
        registerId: cashRegister,
        amount: paidAmount,
        type: 'Payment',
        description: `دفع فاتورة مشتريات رقم${invoiceNumber}`,
      }, config);
      console.log(cashMovement)
      console.log(cashMovement.data.cashMovement._id)

      if (cashMovement) {
        toast.success('تم تسجيل حركه الخزينه بنجاح');

        const updatecashRegister = await axios.put(`${apiUrl}/api/cashRegister/${cashRegister}`, {
          balance: updatedbalance, // Use the updated balance
        }, config);

        // Update the state after successful updates
        if (updatecashRegister) {
          // Toast notification for successful creation
          toast.success(' تم خصم المدفوع من الخزينة');
        }
      } else {
        toast.success('حدث خطا اثنا تسجيل حركه الخزينه ! حاول مره اخري');

      }

    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل في تسجيل المصروف !حاول مره اخري');

    }
  };


  useEffect(() => {
    getAllPurchases()
    getallStockaction()
    getaStockItems()
    getAllCashRegisters()
    getallrecipes()
    getAllSuppliers()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, formatDate, formatDateTime, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المشتريات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addPurchaseInvoiceModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <label>اضافه فاتورة جديدة</label></a>

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
                        <th>تسجيل في</th>
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
                              <td>{formatDate(invoice.date)}</td>
                              <td>{invoice.invoiceNumber}</td>
                              <td>{invoice.supplier.name}</td>
                              <td>{invoice.totalAmount}</td>
                              <td>{invoice.discount}</td>
                              <td>{invoice.salesTax}</td>
                              <td>{invoice.additionalCost}</td>
                              <td>{invoice.netAmount}</td>
                              <td>{invoice.paymentType}</td>
                              <td>{invoice.paidAmount}</td>
                              <td>{invoice.balanceDue}</td>
                              <td>{formatDate(invoice.paymentDueDate)}</td>
                              <td>{invoice.paymentMethod}</td>
                              <td>{invoice.paymentStatus}</td>
                              <td>{invoice.cashRegister.name}</td>
                              <td>{invoice.createdBy.fullname}</td>
                              <td>{formatDateTime(invoice.createdAt)}</td>
                              <td>{invoice.notes}</td>
                              <td>
                                <a href="#purchaseReturnModal" className="edit" data-toggle="modal" onClick={() => { getInvoice(invoice._id) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                {/* <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => }><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a> */}
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
                    <form onSubmit={(e) => createPurchaseInvoice(e, employeeLoginInfo.employeeinfo.id)}>
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
                                  <select required className="form-select" id="supplierSelect" onChange={(e) => handleSupplier(e.target.value)}>
                                    <option>اختر المورد</option>
                                    {AllSuppliers.map((supplier, i) => (
                                      <option value={supplier._id} key={i}>{supplier.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="notesInput">الرصيد</span>
                                  <input type="text" className="form-control" id="notesInput" readOnly value={supplierInfo.currentBalance} />
                                </div>

                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="invoiceNumberInput">رقم الفاتورة</span>
                                  <input type="text" className="form-control" required id="invoiceNumberInput" placeholder="رقم الفاتورة" onChange={(e) => setInvoiceNumber(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="invoiceDateInput">تاريخ الفاتورة</span>
                                  <input type="date" className="form-control" required id="invoiceDateInput" placeholder="تاريخ الفاتور" onChange={(e) => setinvoiceDate(e.target.value)} />
                                </div>
                              </div>
                            </div>

                            <table className="table table-bordered table-striped table-hover">
                              <thead className="table-success">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col" className="col-4">الصنف</th>
                                  <th scope="col" className="col-2">الكمية</th>
                                  <th scope="col" className="col-2">الوحده</th>
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
                                      <select className="form-select" required onChange={(e) => handleItemId(e.target.value, i)}>
                                        <option value="">
                                          {StockItems && StockItems.filter(stock => stock._id === item.item)[0]?.name}
                                        </option>
                                        {StockItems.map((stock, j) => (
                                          <option value={stock._id} key={j}>{stock.itemName}</option>
                                        ))}
                                      </select>
                                    </td>
                                    <td><input type="number" required className="form-control" name="qty" onChange={(e) => handleQuantity(e.target.value, i)} /></td>
                                    <td><input type="text" readOnly value={item.largeUnit} className="form-control" name="largeUnit" /></td>

                                    <td><input type="number" className="form-control" name="price" required onChange={(e) => handlePrice(e.target.value, i)} /></td>

                                    <td><input type="text" className="form-control" value={item.cost} name="amt" readOnly /></td>

                                    <td><input type="date" className="form-control" name="Exp" onChange={(e) => handleExpirationDate(e.target.value, i)} /></td>
                                    <td className="NoPrint"><button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="row">
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="totalInput">الإجمالي</span>
                                  <input type="text" className="form-control text-end" value={totalAmount} id="totalInput" readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setSalesTax(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">خصم</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setDiscount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="netAmountInput">المبلغ الصافي</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={netAmount} readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="notesInput">الملاحظات</span>
                                  <textarea className="form-control" id="notesInput" placeholder="الملاحظات" onChange={(e) => setNotes(e.target.value)} style={{ height: 'auto' }} />
                                </div>
                                {/* <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">تكلفه اضافية</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setAdditionalCost(e.target.value)} />
                                </div> */}
                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="paidAmount">مدفوع</span>
                                  <input type="number" className="form-control text-end" defaultValue={paidAmount} id="paidAmount" onChange={(e) => handlePaidAmount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">طريقه الدفع</span>
                                  <select className='form-select' name="paymentMethod" id="paymentMethod" onChange={(e) => handlePaymentMethod(e.target.value, employeeLoginInfo.id)}>
                                    <option>اختر طريقه الدفع</option>
                                    <option value="نقدي">نقدي</option>
                                    {financialInfo && financialInfo.map((financialInfo, i) => {
                                      return <option value={financialInfo.paymentMethodName}>{`${financialInfo.paymentMethodName} ${financialInfo.accountNumber}`}</option>
                                    })}
                                  </select>
                                </div>
                                {paymentMethod === 'نقدي' && cashRegister ?
                                  <div className="input-group mb-3">
                                    <span className="input-group-text" htmlFor="netAmountInput">رصيد  الخزينة</span>
                                    <input type="button" className="form-control text-end" id="netAmountInput" value={CashRegisterBalance} readOnly />
                                    <button type="button" className="btn btn-success" id="netAmountInput" onClick={confirmPayment} >تاكيد الدفع</button>
                                  </div>
                                  : <span className="input-group-text"> ليس لك خزينة للدفع النقدي</span>
                                }

                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="balanceDue">باقي المستحق</span>
                                  <input type="text" className="form-control text-end" id="balanceDue" value={balanceDue} readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">تاريخ الاستحقاق</span>
                                  <input type="date" className="form-control text-end" id="gstInput" onChange={(e) => setPaymentDueDate(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="netAmountInput">حالة الفاتورة</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={paymentStatus} readOnly />
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
              <div id="purchaseReturnModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => handlePurchaseReturn(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title"></h4>
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
                                  <select required className="form-select" id="supplierSelect" onChange={(e) => handleSupplier(e.target.value)}>
                                    <option>اختر المورد</option>
                                    {AllSuppliers.map((supplier, i) => (
                                      <option value={supplier._id} key={i}>{supplier.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="notesInput">الرصيد</span>
                                  <input type="text" className="form-control" id="notesInput" readOnly value={supplierInfo.currentBalance} />
                                </div>

                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="invoiceNumberInput">رقم الفاتورة</span>
                                  <input type="text" className="form-control" required id="invoiceNumberInput" placeholder="رقم الفاتورة" onChange={(e) => setInvoiceNumber(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="invoiceDateInput">تاريخ الفاتورة</span>
                                  <input type="date" className="form-control" required id="invoiceDateInput" placeholder="تاريخ الفاتور" onChange={(e) => setinvoiceDate(e.target.value)} />
                                </div>
                              </div>
                            </div>

                            <table className="table table-bordered table-striped table-hover">
                              <thead className="table-success">
                                <tr>
                                  <th scope="col">#</th>
                                  <th scope="col" className="col-4">الصنف</th>
                                  <th scope="col" className="col-2">الكمية</th>
                                  <th scope="col" className="col-2">الوحده</th>
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
                                      <select className="form-select" required onChange={(e) => handleItemId(e.target.value, i)}>
                                        <option value="">
                                          {StockItems && StockItems.filter(stock => stock._id === item.item)[0]?.name}
                                        </option>
                                        {StockItems.map((stock, j) => (
                                          <option value={stock._id} key={j}>{stock.itemName}</option>
                                        ))}
                                      </select>
                                    </td>
                                    <td><input type="number" required className="form-control" name="qty" onChange={(e) => handleQuantity(e.target.value, i)} /></td>
                                    <td><input type="text" readOnly value={item.largeUnit} className="form-control" name="largeUnit" /></td>

                                    <td><input type="number" className="form-control" name="price" required onChange={(e) => handlePrice(e.target.value, i)} /></td>

                                    <td><input type="text" className="form-control" value={item.cost} name="amt" readOnly /></td>

                                    <td><input type="date" className="form-control" name="Exp" onChange={(e) => handleExpirationDate(e.target.value, i)} /></td>
                                    <td className="NoPrint"><button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="row">
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="totalInput">الإجمالي</span>
                                  <input type="text" className="form-control text-end" value={totalAmount} id="totalInput" readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setSalesTax(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">خصم</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setDiscount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="netAmountInput">المبلغ الصافي</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={netAmount} readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="notesInput">الملاحظات</span>
                                  <textarea className="form-control" id="notesInput" placeholder="الملاحظات" onChange={(e) => setNotes(e.target.value)} style={{ height: 'auto' }} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">تكلفه اضافية</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setAdditionalCost(e.target.value)} />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="paidAmount">مدفوع</span>
                                  <input type="number" className="form-control text-end" defaultValue={paidAmount} id="paidAmount" onChange={(e) => handlePaidAmount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">طريقه الدفع</span>
                                  <select className='form-select' name="paymentMethod" id="paymentMethod" onChange={(e) => handlePaymentMethod(e.target.value, employeeLoginInfo.id)}>
                                    <option>اختر طريقه الدفع</option>
                                    <option value="نقدي">نقدي</option>
                                    {financialInfo && financialInfo.map((financialInfo, i) => {
                                      return <option value={financialInfo.paymentMethodName}>{`${financialInfo.paymentMethodName} ${financialInfo.accountNumber}`}</option>
                                    })}
                                  </select>
                                </div>
                                {paymentMethod === 'نقدي' && cashRegister ?
                                  <div className="input-group mb-3">
                                    <span className="input-group-text" htmlFor="netAmountInput">رصيد  الخزينة</span>
                                    <input type="button" className="form-control text-end" id="netAmountInput" value={CashRegisterBalance} readOnly />
                                    <button type="button" className="btn btn-success" id="netAmountInput" onClick={confirmPayment} >تاكيد الدفع</button>
                                  </div>
                                  : <span className="input-group-text"> ليس لك خزينة للدفع النقدي</span>
                                }

                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="balanceDue">باقي المستحق</span>
                                  <input type="text" className="form-control text-end" id="balanceDue" value={balanceDue} readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">تاريخ الاستحقاق</span>
                                  <input type="date" className="form-control text-end" id="gstInput" onChange={(e) => setPaymentDueDate(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="netAmountInput">حالة الفاتورة</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={paymentStatus} readOnly />
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

export default PurchaseReturn