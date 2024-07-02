import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';
import '../orders/Orders.css'



const SupplierTransaction = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const { permissionsList, setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)

  const [AllSupplierTransaction, setAllSupplierTransaction] = useState([])
  const getAllSupplierTransaction = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/suppliertransaction`, config);
      console.log({ response });
      if (response.status === 200) {
        const data = response.data;
        setAllSupplierTransaction(data.reverse());
        calcTotalpurchPayment(data);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب بيانات تعاملات الموردين! يرجى إعادة تحميل الصفحة');
    }
  };



  const [totalPurchases, settotalPurchases] = useState(0)
  const [totalPayment, settotalPayment] = useState(0)
  const [totalBalanceDue, settotalBalanceDue] = useState(0)
  const calcTotalpurchPayment = (array) => {
    let totalPurchases = 0;
    let totalPayment = 0;
    let totalBalanceDue = 0;

    if (array.length > 0) {
      array.forEach((item) => {
        if (item.transactionType === 'Purchase') {
          totalPurchases += item.amount;
        } else if (item.transactionType === 'Payment') {
          totalPayment += item.amount;
        } else if (item.transactionType === 'BalanceDue') {
          totalBalanceDue += item.balanceDue;
        }
      });
    }

    settotalPurchases(totalPurchases);
    settotalPayment(totalPayment);
    settotalBalanceDue(totalBalanceDue);
  };


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


  const [listtransactionType, setlistTransactionType] = useState(['OpeningBalance', 'Purchase', 'Payment', 'PurchaseReturn', 'Refund']);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [supplier, setSupplier] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [recordedBy, setRecordedBy] = useState('');

  const handleAddSupplierTransaction = async (e) => {
    e.preventDefault();
    try {
      const requestData = { invoiceNumber, supplier, transactionDate, transactionType, amount, previousBalance, currentBalance, paymentMethod, notes };

      console.log({ requestData })

      const response = await axios.post(`${apiUrl}/api/suppliertransaction`, requestData, config);
      console.log({ response })
      if (response.status === 201) {
        toast.success('تم انشاء العملية بنجاح');
      } else {
        toast.error('حدث خطأ أثناء انشاء العملية');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء انشاء العملية');
    }
  };


  const [supplierInfo, setsupplierInfo] = useState({});
  const handleSupplier = (id) => {
    setSupplier(id)
    const findSupplier = AllSuppliers.filter(supplier => supplier._id === id)[0]
    setsupplierInfo(findSupplier)
    setPreviousBalance(findSupplier.currentBalance)
    filterSupplierTransactionBySupplier(id)
  }

  const handlecurrentBalance = (m) => {
    setAmount(Number(m))
    const totalBalance = Number(m) + Number(previousBalance)
    setCurrentBalance(totalBalance)
  }


  const filterSupplierTransactionBySupplier = (supplierId) => {
    const filteredTransactions = AllSupplierTransaction.filter(transaction => transaction.supplier === supplierId);
    setAllSupplierTransaction(filteredTransactions);
    calcTotalpurchPayment(filteredTransactions);
    filterPurchaseInvoiceBySupplier(supplierId)
  }

  const filterSupplierTransactionByTransactionType = (transactionType) => {
    const filter = AllSupplierTransaction.filter(transaction => transaction.transactionType === transactionType)
    setAllSupplierTransaction(filter)
  }

  const filterSupplierTransactionByInvoiceNumber = (invoiceNumber) => {
    const filter = AllSupplierTransaction.filter(transaction => transaction.invoiceNumber === invoiceNumber)
    setAllSupplierTransaction(filter)
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

  const [allPurchaseInvoiceFilterd, setallPurchaseInvoiceFilterd] = useState([])
  const filterPurchaseInvoiceBySupplier = (supplier) => {
    const filterPurchaseInvoice = allPurchaseInvoice.filter(invoice => invoice.supplier._id === supplier)
    console.log({ filterPurchaseInvoice })
    setallPurchaseInvoiceFilterd(filterPurchaseInvoice)
  }

  useEffect(() => {
    getAllSuppliers()
    getAllPurchases()
    getAllSupplierTransaction()
  }, [])

  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive mt-1">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6 text-right">
                <h2>ادارة <b>تعاملات الموردين</b></h2>
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <a href="#addSupplierTransactionModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                {/* <a href="#deleteSupplierTransactionModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
              </div>
            </div>
          </div>

          <div className="table-filter print-hide">
            <div class="row text-dark d-flex flex-wrap align-items-center justify-content-start">
              <div className="show-entries">
                <label htmlFor="showEntries">عرض</label>
                <select
                  className="form-select col-8"
                  id="showEntries"
                  onChange={(e) => {
                    setstartpagination(0);
                    setendpagination(e.target.value);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                </select>
                <span>صفوف</span>
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label htmlFor="supplierSelect">المورد</label>
                <select
                  className="form-select col-8"
                  id="supplierSelect"
                  onChange={(e) => handleSupplier(e.target.value)}
                >
                  <option>كل الموردين</option>
                  {AllSuppliers.map((supplier, i) => (
                    <option value={supplier._id} key={i}>{supplier.name}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label htmlFor="transactionTypeSelect">نوع العملية</label>
                <select
                  className="form-select col-8"
                  id="transactionTypeSelect"
                  onChange={(e) => filterSupplierTransactionByTransactionType(e.target.value)}
                >
                  <option>جميع العمليات</option>
                  {listtransactionType.map((type, i) => (
                    <option value={type} key={i}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label htmlFor="invoiceNumberSelect">رقم الفاتورة</label>
                <select
                  className="form-select col-8"
                  id="invoiceNumberSelect"
                  onChange={(e) => filterSupplierTransactionByInvoiceNumber(e.target.value)}
                >
                  <option>اختر رقم الفاتورة</option>
                  {
                    allPurchaseInvoiceFilterd.length > 0 ? allPurchaseInvoiceFilterd.map((Invoice, i) => (
                      <option value={Invoice._id} key={i}>{Invoice.invoiceNumber}</option>
                    ))
                      : allPurchaseInvoice.map((Invoice, i) => (
                        <option value={Invoice._id} key={i}>{Invoice.invoiceNumber}</option>
                      ))
                  }
                </select>
              </div>

              <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-select col-8" onChange={(e) => setAllSupplierTransaction(filterByTime(e.target.value, AllSupplierTransaction))}>
                    <option value="">اختر</option>
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                    <option value="month">هذه السنه</option>
                  </select>
                </div>

                <div className="filter-group d-flex flex-nowrap w-75">
                  <label className="form-label"><strong>مدة محددة:</strong></label>

                  <div className="d-flex flex-nowrap mr-1">
                    <label className="form-label">من</label>
                    <input type="date" className="form-control w-auto" onChange={(e) => setStartDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap mr-1">
                    <label className="form-label">إلى</label>
                    <input type="date" className="form-control w-auto" onChange={(e) => setEndDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap justify-content-between w-25">
                    <button type="button" className="btn btn-primary w-50" onClick={() => setAllSupplierTransaction(filterByDateRange(AllSupplierTransaction))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning w-50 mr-2" onClick={getAllSupplierTransaction}>استعادة
                    </button>
                  </div>
                </div>
              </div>

              <div class="col-12 row text-dark d-flex flex-wrap align-items-center justify-content-start">
                <div className="show-entries">
                  <label htmlFor="totalPurchasesInput" className="col-12">اجمالي المشتريات</label>
                  <input
                    type="text"
                    className="form-control col-12"
                    id="totalPurchasesInput"
                    readOnly
                    value={totalPurchases}
                  />
                </div>
                <div className="show-entries">
                  <label htmlFor="totalPaymentInput" className="col-12">اجمالي المدفوع</label>
                  <input
                    type="text"
                    className="form-control col-12"
                    id="totalPaymentInput"
                    readOnly
                    value={totalPayment}
                  />
                </div>
                <div className="show-entries">
                  <label htmlFor="totalBalanceDueInput" className="col-12">اجمالي المستحق</label>
                  <input
                    type="text"
                    className="form-control col-12"
                    id="totalBalanceDueInput"
                    readOnly
                    value={totalBalanceDue}
                  />
                </div>
                <div className="show-entries">
                  <label htmlFor="previousBalanceInput" className="col-12">الرصيد الكلي</label>
                  <input
                    type="text"
                    className="form-control col-12"
                    id="previousBalanceInput"
                    readOnly
                    value={previousBalance}
                  />
                </div>
              </div>

            </div>
          </div>

          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>م</th>
                <th>التاريخ</th>
                <th>المورد</th>
                <th>الفاتورة</th>
                <th>نوع العملية</th>
                <th>المبلغ</th>
                <th>الرصيد السابق</th>
                <th>الرصيد الحالي</th>
                <th>طريقه الدفع</th>
                <th>بواسطه</th>
                <th>تاريخ التسجيل</th>
                {/* <th>اجراءات</th> */}
              </tr>
            </thead>
            <tbody>
              {AllSupplierTransaction && AllSupplierTransaction.map((Transaction, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{Transaction.transactionDate}</td>
                      <td>{Transaction.supplier?.name}</td>
                      <td>{Transaction.invoiceNumber?.invoiceNumber}</td>
                      <td>{Transaction.transactionType}</td>
                      <td>{Transaction.amount}</td>
                      <td>{Transaction.previousBalance}</td>
                      <td>{Transaction.currentBalance}</td>
                      <td>{Transaction.paymentMethod}</td>
                      <td>{Transaction.recordedBy?.fullname}</td>
                      <td>{Transaction.createdAt && formatDateTime(Transaction.createdAt)}</td>
                      <td>
                        {/* <a href="#editSupplierTransactionModal" className="edit" data-toggle="modal" onClick={() => { setStockItemid(item._id); setcategoryId(item.categoryId); setitemName(item.itemName); setBalance(item.Balance); setlargeUnit(item.largeUnit); setsmallUnit(item.smallUnit); setprice(item.price); setparts(item.parts); setcostOfPart(item.costOfPart); setminThreshold(item.minThreshold); settotalCost(item.totalCost) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteSupplierTransactionModal" className="delete" data-toggle="modal" onClick={() => setStockItemid(item._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a> */}
                      </td>
                    </tr>
                  )
                }
              })
              }
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{AllSupplierTransaction.length > endpagination ? endpagination : AllSupplierTransaction.length}</b> من <b>{AllSupplierTransaction.length}</b> عنصر</div>
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



      <div id="addSupplierTransactionModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleAddSupplierTransaction}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">اضافه تعامل جديد</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تاريخ العملية</label>
                  <input type="date" className="form-control col-8" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">المورد</label>
                  <select required className="form-select col-8" id="supplierSelect" onChange={(e) => handleSupplier(e.target.value)}>
                    <option>اختر المورد</option>
                    {AllSuppliers.map((supplier, i) => (
                      <option value={supplier._id} key={i}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">نوع العملية</label>
                  <select required className="form-select col-8" id="supplierSelect" onChange={(e) => setTransactionType(e.target.value)}>
                    <option>اختر نوع العملية</option>
                    {listtransactionType.map((type, i) => (
                      <option value={type} key={i}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">رقم الفاتورة</label>
                  <select required className="form-select col-8" id="supplierSelect" onChange={(e) => setInvoiceNumber(e.target.value)} >
                    <option>اختر رقم الفاتورة</option>
                    {allPurchaseInvoiceFilterd.map((Invoice, i) => (
                      <option value={Invoice._id} key={i}>{Invoice.invoiceNumber}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">المبلغ</label>
                  <input type="number" className="form-control col-8" defaultValue={amount} onChange={(e) => handlecurrentBalance(e.target.value)} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الرصيد السابق</label>
                  <input type="text" className="form-control col-8" value={previousBalance} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الرصيد الحالي</label>
                  <input type="text" className="form-control col-8" value={currentBalance} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">طريقة الدفع</label>
                  <input type="text" className="form-control col-8" defaultValue={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">ملاحظات</label>
                  <input type="text" className="form-control col-8" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                <input type="submit" className="btn w-50 btn-success" value="اضافه" />
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <div id="editSupplierTransactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => editStockItem(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">اسم الصنف</label>
                          <input type="text" className="form-control col-8" defaultValue={itemName} required onChange={(e) => setitemName(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">نوع المخزن</label>
                          <select name="category" id="category" defaultValue={categoryId} form="carform" onChange={(e) => setcategoryId(e.target.value)}>
                            <option>{AllCategoryStock.length>0?AllCategoryStock.filter(c=>c._id == categoryId)[0].name:''}</option>
                            <option value={categoryId}>{categoryId !== "" ? AllCategoryStock.filter(c => c._id == categoryId)[0].name : ''}</option>
                            {AllCategoryStock.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>

                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الوحدة الكبيرة</label>
                          <input type='text' className="form-control col-8" defaultValue={largeUnit} required onChange={(e) => setlargeUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الوحدة الصغيره</label>
                          <input type='text' className="form-control col-8" defaultValue={smallUnit} required onChange={(e) => setsmallUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">رصيد افتتاحي</label>
                          <input type='Number' className="form-control col-8" defaultValue={Balance} required onChange={(e) => setBalance(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الحد الادني</label>
                          <input type='number' className="form-control col-8" required defaultValue={minThreshold} onChange={(e) => { setminThreshold(e.target.value); }} />
                        </div>

                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">السعر</label>
                          <input type='Number' className="form-control col-8" defaultValue={price} required onChange={(e) => { setprice(e.target.value); settotalCost(e.target.value * Balance) }} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">التكلفة</label>
                          <input type='text' className="form-control col-8" required defaultValue={totalCost} readOnly />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">عدد الوحدات</label>
                          <input type='Number' className="form-control col-8" defaultValue={parts} required onChange={(e) => { setparts(e.target.value); setcostOfPart(price / e.target.value) }} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تكلفة الوحده</label>
                          <input type='Number' className="form-control col-8" required defaultValue={costOfPart} readOnly />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                          <input type='text' className="form-control col-8" defaultValue={new Date().toLocaleDateString()} required readOnly />
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn w-50 btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}

      {/* <div id="deleteSupplierTransactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockItem}>
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
                        <input type="submit" className="btn w-50 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
    </div>
  )
}

export default SupplierTransaction