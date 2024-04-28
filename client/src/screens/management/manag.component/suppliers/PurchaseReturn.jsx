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
    const currentBalance =  Number(oldBalance) - Number(quantity);
    const unit = stockItem.largeUnit
    const costOfPart = Math.round((Number(costOfItem) / Number(parts)) * 100) / 100;
    console.log({ itemPercentage, itemAdditionalCost, costOfItem, parts, price, costOfPart })
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

        // for (const recipe of allrecipes) {
        //   const recipeid = recipe._id;
        //   const productname = recipe.productId.name;
        //   const arrayingredients = recipe.ingredients;

        //   const newIngredients = arrayingredients.map((ingredient) => {
        //     if (ingredient.itemId === itemId) {
        //       const costofitem = costOfPart;
        //       const unit = ingredient.unit
        //       const amount = ingredient.amount
        //       const totalcostofitem = amount * costOfPart
        //       return { itemId, name: itemName, amount, costofitem, unit, totalcostofitem };
        //     } else {
        //       return ingredient;
        //     }
        //   });
        //   console.log({ newIngredients })
        //   const totalcost = newIngredients.reduce((acc, curr) => {
        //     return acc + (curr.totalcostofitem || 0);
        //   }, 0);
        //   // Update the product with the modified recipe and total cost
        //   const updateRecipe = await axios.put(`${apiUrl}/api/recipe/${recipeid}`,
        //     { ingredients: newIngredients, totalcost }, config);

        //   console.log({ updateRecipe });

        //   // Toast for successful update based on recipe change
        //   toast.success(`تم تحديث وصفة  ${productname}`);
        // }
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

  const handleAddSupplierTransactionPurchase = async (originalInvoice) => {
    try {
      let newCurrentBalance = 0
      const transactionType = 'Purchase'
      const amount = netAmount
      const transactionDate = returnDate
      const currentBalance = previousBalance + amount
      const requestData = { originalInvoice, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

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

      if (refundedAmount > 0) {
        const transactionType = 'Payment'
        const amount = refundedAmount
        const transactionDate = returnDate
        const previousBalance = newCurrentBalance
        const currentBalance = previousBalance - refundedAmount
        const requestData = { originalInvoice, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

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




  const [returnedItems, setreturnedItems] = useState([]);
  const handleNewItem = () => {
    setreturnedItems([...returnedItems, { itemId: '', quantity: 0, price: 0, largeUnit: '', cost: 0, expirationDate: '' }])
  }

  const handleDeleteItem = (index) => {
    const updatedItems = [...returnedItems]
    updatedItems.splice(index, 1)
    setreturnedItems(updatedItems)
    clacTotalAmount()
  }
  const handleItemId = (id, index) => {
    const stockitem = StockItems.filter(item => item._id === id)[0]
    const updatedItems = [...returnedItems]
    updatedItems[index].itemId = stockitem._id
    updatedItems[index].largeUnit = stockitem.largeUnit
    console.log({ updatedItems })
    setreturnedItems(updatedItems)

  }
  const handleQuantity = (quantity, index) => {
    const updatedItems = [...returnedItems]
    updatedItems[index].quantity = Number(quantity)
    updatedItems[index].cost = Number(quantity) * Number(updatedItems[index].price);
    console.log({ updatedItems })
    setreturnedItems(updatedItems)
    clacTotalAmount()
  }
  const handlePrice = (price, index) => {
    const updatedItems = [...returnedItems]
    updatedItems[index].price = Number(price)
    updatedItems[index].cost = Number(updatedItems[index].quantity) * Number(price);
    console.log({ updatedItems })
    setreturnedItems(updatedItems)
    clacTotalAmount()
  }
  const handleExpirationDate = (date, index) => {
    const updatedItems = [...returnedItems]
    updatedItems[index].expirationDate = new Date(date);
    console.log({ updatedItems })
    setreturnedItems(updatedItems)
  }
  const [totalAmount, setTotalAmount] = useState(0);
  const clacTotalAmount = () => {
    let total = 0
    returnedItems.forEach(item => {
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
  }, [returnedItems, additionalCost, discount, salesTax])

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


  const [originalInvoice, setoriginalInvoice] = useState('');
  const handleInvoice = (id) => {
    const invoice = allPurchaseInvoice.filter(invoice => invoice._id = id)[0]
    setinvoice(invoice)
    setreturnedItems(invoice.items)
    setoriginalInvoice(invoice.invoiceNumber)
    handleSupplier(invoice.supplier._id)
  }

  const [returnDate, setreturnDate] = useState(new Date());

  const [refundedAmount, setrefundedAmount] = useState(0);
  const [balanceDue, setBalanceDue] = useState(0);
  const [returnStatus, setreturnStatus] = useState('unpaid');
  const [refundMethod, setrefundMethod] = useState('');

  const handlerefundedAmount = (amount) => {
    setrefundedAmount(amount);
    setBalanceDue(Number(netAmount) - Number(amount));
    if (amount == 0) {
      setreturnStatus('unreturned');
    } else if (amount == netAmount) {
      setreturnStatus('fully_returned');
    } else if (amount < netAmount) {
      setreturnStatus('partially_returned');
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


  // const createPurchaseInvoice = async (e, receiverId) => {

  //   e.preventDefault()
  //   try {
  //     const newInvoice = {
  //       originalInvoice,
  //       returnDate,
  //       supplier,
  //       items,
  //       totalAmount,
  //       discount,
  //       salesTax,
  //       netAmount,
  //       additionalCost,
  //       refundedAmount,
  //       balanceDue,
  //       paymentDueDate,
  //       cashRegister,
  //       returnStatus,
  //       refundMethod,
  //       paymentMethod,
  //       notes,
  //     }
  //     console.log({ newInvoice })
  //     const response = await axios.post(`${apiUrl}/api/purchasereturn`, newInvoice, config);
  //     console.log({ response })
  //     if (response.status === 201) {
  //       items.forEach(item => {
  //         createStockAction(item, receiverId)
  //       })

  //       await handleAddSupplierTransactionPurchase(response.data._id)
  //       getAllPurchases();
  //       toast.success('تم اضافه المشتريات بنجاح')
  //     } else {
  //       toast.error('فشل اضافه المشتريات ! حاول مره اخري')
  //     }
  //   } catch (error) {
  //     toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
  //   }
  // }

  const [invoice, setinvoice] = useState({})

  const getInvoice = async (id) => {
    try {
      const resInvoice = await axios.get(`${apiUrl}/api/purchasereturn/${id}`, config)
      if (resInvoice) {
        setinvoice(resInvoice.data)
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب الفاتوره ! اعد تحميل الصفحة و حاول مره اخري')
    }
  }

  const createPurchaseReturn = async (e, receiverId) => {

    e.preventDefault()
    try {
      const newInvoice = {
        originalInvoice,
        returnDate,
        supplier,
        returnedItems,
        totalAmount,
        discount,
        netAmount,
        salesTax,
        refundedAmount,
        balanceDue,
        paymentDueDate,
        additionalCost,
        cashRegister,
        returnStatus,
        paymentMethod,
        refundMethod,
        notes,
      }
      console.log({ newInvoice })
      const response = await axios.post(`${apiUrl}/api/purchasereturn`, newInvoice, config);
      console.log({ response })
      if (response.status === 201) {
        returnedItems.forEach(item => {
          createStockAction(item, receiverId)
        })

        // await handleAddSupplierTransactionPurchaseReturn(response.data._id)
        getAllPurchasesReturn();
        toast.success('تم اضافه المشتريات بنجاح')
      } else {
        toast.error('فشل اضافه المشتريات ! حاول مره اخري')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء اضافه المشتريات ! حاول مره اخري')
    }
  }

  const [allPurchasesReturn, setallPurchasesReturn] = useState([])
  const getAllPurchasesReturn = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/purchasereturn', config);
      console.log({ response })
      if (response.status === 200) {
        setallPurchasesReturn(response.data.reverse())
      } else {
        toast.error('فشل جلب جميع فواتير المشتريات ! اعد تحميل الصفحة')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب فواتير المشتريات ! اعد تحميل الصفحة')
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
    const updatedbalance = CashRegisterBalance + refundedAmount; // Calculate the updated balance

    try {

      // await handleAddSupplierTransactionPaymentPurchase()

      const cashMovement = await axios.post(apiUrl + '/api/cashMovement/', {
        registerId: cashRegister,
        amount: refundedAmount,
        type: 'Payment',
        description: `استرداد مرتجع فاتورة مشتريات رقم${originalInvoice.invoiceNumber}`,
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
          toast.success(' تم اضافه المبلع المسترد الي الخزينة');
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
    getAllPurchasesReturn()
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
                        <th>الفاتوره الاصليه</th>
                        <th>المورد</th>
                        <th>مجموع المرتجع</th>
                        <th>الخصم</th>
                        <th>الضريبه</th>
                        <th>الاجمالي</th>
                        <th>اضافية</th>
                        {/* <th>الاجمالي بالمصاريف</th> */}
                        <th>نوع الفاتورة</th>
                        <th>استرد</th>
                        <th>باقي</th>
                        <th>تاريخ الاسترداد</th>
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
                      {allPurchasesReturn.length > 0 && allPurchasesReturn.map((invoice, i) => {
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
                              <td>{formatDate(invoice.returnDate)}</td>
                              <td>{invoice.originalInvoice.invoiceNumber}</td>
                              <td>{invoice.supplier.name}</td>
                              <td>{invoice.totalAmount}</td>
                              <td>{invoice.discount}</td>
                              <td>{invoice.salesTax}</td>
                              <td>{invoice.netAmount}</td>
                              <td>{invoice.additionalCost}</td>
                              <td>{invoice.refundMethod}</td>
                              <td>{invoice.refundedAmount}</td>
                              <td>{invoice.balanceDue}</td>
                              <td>{formatDate(invoice.paymentDueDate)}</td>
                              <td>{invoice.refundMethod}</td>
                              <td>{invoice.refundStatus}</td>
                              <td>{invoice.cashRegister.name}</td>
                              <td>{invoice.createdBy.fullname}</td>
                              <td>{formatDateTime(invoice.createdAt)}</td>
                              <td>{invoice.notes}</td>
                              <td>
                                {/* <a href="#purchaseReturnModal" className="edit" data-toggle="modal" onClick={() => { getInvoice(invoice._id) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a> */}
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
                    <div className="hint-text text-dark">عرض <b>{allPurchasesReturn.length > endpagination ? endpagination : allPurchasesReturn.length}</b> من <b>{allPurchasesReturn.length}</b> عنصر</div>
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
                    <form onSubmit={(e) => createPurchaseReturn(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">تسجيل مرتجع مشتريات</h4>
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
                                  <span className="input-group-text" htmlFor="supplierSelect">فاتورة المرتجع</span>
                                  <select required className="form-select" id="originalInvoiceInput" onChange={(e) => handleInvoice(e.target.value)}>
                                    <option>اختر الفاتورة</option>
                                    {allPurchaseInvoice.map((Invoice, i) => (
                                      <option value={Invoice._id} key={i}>{Invoice.invoiceNumber}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="returnDateInput">تاريخ المرتجع</span>
                                  <input type="date" className="form-control" required id="returnDateInput" placeholder="تاريخ الفاتور" onChange={(e) => setreturnDate(e.target.value)} />
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="supplierSelect">المورد</span>
                                  <input type="text" className="form-control" required id="originalInvoiceInput" value={supplierInfo.name} readOnly />

                                  {/* <select required className="form-select" id="supplierSelect" onChange={(e) => handleSupplier(e.target.value)}>
                                    <option>اختر المورد</option>
                                    {AllSuppliers.map((supplier, i) => (
                                      <option value={supplier._id} key={i}>{supplier.name}</option>
                                    ))}
                                  </select> */}
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="notesInput">الرصيد</span>
                                  <input type="text" className="form-control" id="notesInput" readOnly value={supplierInfo.currentBalance} />
                                </div>

                              </div>

                            </div>

                            <table className="table table-bordered table-striped table-hover">
                              <thead className="table-success">
                                <tr>
                                  <th scope="col" className="col-1">#</th>
                                  <th scope="col" className="col-3">الصنف</th>
                                  <th scope="col" className="col-1">الكمية</th>
                                  <th scope="col" className="col-1">الوحده</th>
                                  <th scope="col" className="col-1">السعر</th>
                                  <th scope="col" className="col-1">الثمن</th>
                                  <th scope="col" className="col-2">انتهاء</th>
                                  <th scope="col" className="col-2 NoPrint">
                                    <button type="button" className="btn btn-sm btn-success" onClick={handleNewItem}>+</button>
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="TBody">
                                {returnedItems.map((item, i) => (
                                  <tr id="TRow" key={i}>
                                    <th scope="row">{i + 1}</th>
                                    {/* <td>
                                      <select className="form-select" required onChange={(e) => handleItemId(e.target.value, i)}>
                                        <option value="">
                                          {StockItems && StockItems.filter(stock => stock._id === item.item)[0]?.name}
                                        </option>
                                        {StockItems.map((stock, j) => (
                                          <option value={stock._id} key={j}>{stock.itemName}</option>
                                        ))}
                                      </select>
                                    </td> */}
                                    <td><input type="text" className="form-control" name="qty" value={StockItems && StockItems.filter(stock => stock._id === item.itemId)[0]?.itemName} readOnly /></td>
                                    <td><input type="text" required className="form-control" value={item.quantity} name="qty" onChange={(e) => handleQuantity(Number(e.target.value), i)} /></td>

                                    <td><input type="text" readOnly value={item.largeUnit} className="form-control" name="largeUnit" /></td>

                                    <td><input type="number" className="form-control" name="price" required value={item.price} onChange={(e) => handlePrice(Number(e.target.value), i)} /></td>

                                    <td><input type="text" className="form-control" value={item.cost} name="amt" readOnly /></td>

                                    <td><input type="text" className="form-control" name="Exp" readOnly value={formatDate(item.expirationDate)} /></td>
                                    {/* <td className="NoPrint"><button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteItem(i)}>X</button></td> */}
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            <div className="row">
                              <div className="col-6">
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="totalInput">الإجمالي</span>
                                  <input type="text" className="form-control text-end" value={totalAmount > 0 ? totalAmount : invoice.totalAmount} id="totalInput" readOnly />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">ضريبة القيمة المضافة</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setSalesTax(e.target.value)} value={salesTax ? salesTax : invoice.salesTax} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="gstInput">خصم</span>
                                  <input type="number" className="form-control text-end" id="gstInput" onChange={(e) => setDiscount(e.target.value)} value={discount > 0 ? discount : invoice.discount} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="netAmountInput">المبلغ الصافي</span>
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={netAmount > 0 ? netAmount : invoice.netAmount} readOnly />
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
                                  <span className="input-group-text" style={{ width: "100%" }} htmlFor="refundMethod">طريقة السداد</span>
                                  <div style={{ display: "flex", width: "100%" }}>
                                    <div className="form-check" style={{ flex: "20%", textAlign: "right" }}>
                                      <input className="form-check-input" type="checkbox" value="cash" id="cashCheckbox" onChange={() => setrefundMethod("cash")} checked={refundMethod === "cash"} />
                                      <label className="form-check-label" htmlFor="cashCheckbox">نقدي</label>
                                    </div>
                                    <div className="form-check" style={{ flex: "20%", textAlign: "right" }}>
                                      <input className="form-check-input" type="checkbox" value="credit" id="creditCheckbox" onChange={() => setrefundMethod("credit")} checked={refundMethod === "credit"} />
                                      <label className="form-check-label" htmlFor="creditCheckbox">سداد مؤجل</label>
                                    </div>
                                    <div className="form-check" style={{ flex: "20%", textAlign: "right" }}>
                                      <input className="form-check-input" type="checkbox" value="deduct_supplier_balance" id="deductCheckbox" onChange={() => setrefundMethod("deduct_supplier_balance")} checked={refundMethod === "deduct_supplier_balance"} />
                                      <label className="form-check-label" htmlFor="deductCheckbox">خصم من رصيد المورد</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="refundedAmount">مدفوع</span>
                                  <input type="number" className="form-control text-end" defaultValue={refundedAmount} id="refundedAmount" onChange={(e) => handlerefundedAmount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="refundedAmount">مدفوع</span>
                                  <input type="number" className="form-control text-end" defaultValue={refundedAmount} id="refundedAmount" onChange={(e) => handlerefundedAmount(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="refundedAmount">مدفوع</span>
                                  <input type="number" className="form-control text-end" defaultValue={refundedAmount} id="refundedAmount" onChange={(e) => handlerefundedAmount(e.target.value)} />
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

                                {refundMethod === 'نقدي' && cashRegister ?
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
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={returnStatus} readOnly />
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
              {/* <div id="purchaseReturnModal" className="modal fade">
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
                                  <span className="input-group-text" htmlFor="originalInvoiceInput">رقم الفاتورة</span>
                                  <input type="text" className="form-control" required id="originalInvoiceInput" placeholder="رقم الفاتورة" onChange={(e) => setoriginalInvoice(e.target.value)} />
                                </div>
                                <div className="input-group mb-3">
                                  <span className="input-group-text" htmlFor="returnDateInput">تاريخ الفاتورة</span>
                                  <input type="date" className="form-control" required id="returnDateInput" placeholder="تاريخ الفاتور" onChange={(e) => setreturnDate(e.target.value)} />
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
                                  <span className="input-group-text" htmlFor="refundedAmount">مدفوع</span>
                                  <input type="number" className="form-control text-end" defaultValue={refundedAmount} id="refundedAmount" onChange={(e) => handlerefundedAmount(e.target.value)} />
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
                                  <input type="text" className="form-control text-end" id="netAmountInput" value={returnStatus} readOnly />
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

export default PurchaseReturn