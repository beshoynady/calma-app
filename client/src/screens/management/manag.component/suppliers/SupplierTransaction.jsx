import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';



const SupplierTransaction = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const [AllSupplierTransaction, setAllSupplierTransaction] = useState([])
  const getAllSupplierTransaction = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/suppliertransaction`, config);
      console.log({ response });
      if (response.status === 200) {
        const data = response.data;
        setAllSupplierTransaction(data);
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
        } else if (item.transactionType === 'Balance Due') {
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
  }

  const handlecurrentBalance = (m) => {
    setAmount(Number(m))
    const totalBalance = Number(m) + Number(previousBalance)
    setCurrentBalance(totalBalance)
  }

  const [SupplierTransactionBySupplier, setSupplierTransactionBySupplier] = useState([]);

  const filterSupplierTransactionBySupplier = (supplierId) => {
    const filteredTransactions = AllSupplierTransaction.filter(transaction => transaction.supplier === supplierId);
    setSupplierTransactionBySupplier(filteredTransactions); 
    calcTotalpurchPayment(filteredTransactions);
  }
  const filterSupplierTransactionByTransactionType = (transactionType) => {
    const filter = AllSupplierTransaction.filter(transaction => transaction.transactionType === transactionType)
    setSupplierTransactionBySupplier(filter)
  }

  useEffect(() => {
    getAllSuppliers()
    getAllSupplierTransaction()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>تعاملات الموردين</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addSupplierTransactionModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        {/* <a href="#deleteSupplierTransactionModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
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
                      <div class="col-sm-3">
                        <div class="filter-group">
                          <label>المورد</label>
                          <select required className="form-select" id="supplierSelect" onChange={(e) => filterSupplierTransactionBySupplier(e.target.value)}>
                            <option>كل الموردين</option>
                            {AllSuppliers.map((supplier, i) => (
                              <option value={supplier._id} key={i}>{supplier.name}</option>
                            ))}
                          </select>
                        </div>
                        <div class="col-sm-3">
                          <div class="filter-group">
                            <label>نوع العملية</label>
                            <select required className="form-select" id="supplierSelect" onChange={(e) => filterSupplierTransactionByTransactionType(e.target.value)}>
                              <option>جميع العمليات</option>
                              {listtransactionType.map((type, i) => (
                                <option value={type} key={i}>{type}</option>
                              ))}
                            </select>
                          </div>
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
                    <div class="row text-dark">
                      <div class="col-sm-3">
                        <div class="show-entries">
                          <span className="input-group-text" htmlFor="notesInput">اجمالي المشتريات</span>
                          <input type="text" className="form-control" id="notesInput" readOnly value={totalPurchases} />
                        </div>
                      </div>
                      <div class="col-sm-3">
                        <div class="filter-group">
                          <span className="input-group-text" htmlFor="notesInput">اجمالي المدفوع</span>
                          <input type="text" className="form-control" id="notesInput" readOnly value={totalPayment} />
                        </div>
                        <div class="col-sm-3">
                          <div class="filter-group">
                            <span className="input-group-text" htmlFor="notesInput">اجمالي المستحق</span>
                            <input type="text" className="form-control" id="notesInput" readOnly value={totalBalanceDue} />
                          </div>
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
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        SupplierTransactionBySupplier.length > 0 ? SupplierTransactionBySupplier.map((Transaction, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{Transaction.transactionDate}</td>
                                <td>{Transaction.supplier.name}</td>
                                <td>{Transaction.invoiceNumber.invoiceNumber}</td>
                                <td>{Transaction.transactionType}</td>
                                <td>{Transaction.amount}</td>
                                <td>{Transaction.previousBalance}</td>
                                <td>{Transaction.currentBalance}</td>
                                <td>{Transaction.paymentMethod}</td>
                                <td>{Transaction.recordedBy.fullname}</td>
                                <td>{Transaction.createdAt}</td>
                                <td>
                                  {/* <a href="#editSupplierTransactionModal" className="edit" data-toggle="modal" onClick={() => { setStockItemid(item._id); setcategoryId(item.categoryId); setitemName(item.itemName); setBalance(item.Balance); setlargeUnit(item.largeUnit); setsmallUnit(item.smallUnit); setprice(item.price); setparts(item.parts); setcostOfPart(item.costOfPart); setminThreshold(item.minThreshold); settotalCost(item.totalCost) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteSupplierTransactionModal" className="delete" data-toggle="modal" onClick={() => setStockItemid(item._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a> */}
                                </td>
                              </tr>
                            )
                          }
                        })
                          : AllSupplierTransaction && AllSupplierTransaction.map((Transaction, i) => {
                            if (i >= startpagination & i < endpagination) {
                              return (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{Transaction.transactionDate}</td>
                                  <td>{Transaction.supplier.name}</td>
                                  <td>{Transaction.invoiceNumber.invoiceNumber}</td>
                                  <td>{Transaction.transactionType}</td>
                                  <td>{Transaction.amount}</td>
                                  <td>{Transaction.previousBalance}</td>
                                  <td>{Transaction.currentBalance}</td>
                                  <td>{Transaction.paymentMethod}</td>
                                  <td>{Transaction.recordedBy.fullname}</td>
                                  <td>{Transaction.createdAt}</td>
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
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه تعامل جديد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>تاريخ العملية</label>
                          <input type="date" className="form-control" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>المورد</label>
                          <select required className="form-select" id="supplierSelect" onChange={(e) => handleSupplier(e.target.value)}>
                            <option>اختر المورد</option>
                            {AllSuppliers.map((supplier, i) => (
                              <option value={supplier._id} key={i}>{supplier.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>رقم الفاتورة</label>
                          <input type="text" className="form-control" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>نوع العملية</label>
                          <select required className="form-select" id="supplierSelect" onChange={(e) => setTransactionType(e.target.value)}>
                            <option>اختر نوع العملية</option>
                            {listtransactionType.map((type, i) => (
                              <option value={type} key={i}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>المبلغ</label>
                          <input type="number" className="form-control" defaultValue={amount} onChange={(e) => handlecurrentBalance(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد السابق</label>
                          <input type="text" className="form-control" value={previousBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد الحالي</label>
                          <input type="text" className="form-control" value={currentBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>طريقة الدفع</label>
                          <input type="text" className="form-control" defaultValue={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>ملاحظات</label>
                          <input type="text" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
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

              {/* <div id="editSupplierTransactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => editStockItem(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>اسم الصنف</label>
                          <input type="text" className="form-control" defaultValue={itemName} required onChange={(e) => setitemName(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>نوع المخزن</label>
                          <select name="category" id="category" defaultValue={categoryId} form="carform" onChange={(e) => setcategoryId(e.target.value)}>
                            <option>{AllCategoryStock.length>0?AllCategoryStock.filter(c=>c._id == categoryId)[0].name:''}</option>
                            <option value={categoryId}>{categoryId !== "" ? AllCategoryStock.filter(c => c._id == categoryId)[0].name : ''}</option>
                            {AllCategoryStock.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>

                        <div className="form-group form-group-47">
                          <label>الوحدة الكبيرة</label>
                          <input type='text' className="form-control" defaultValue={largeUnit} required onChange={(e) => setlargeUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الوحدة الصغيره</label>
                          <input type='text' className="form-control" defaultValue={smallUnit} required onChange={(e) => setsmallUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group form-group-47">
                          <label>رصيد افتتاحي</label>
                          <input type='Number' className="form-control" defaultValue={Balance} required onChange={(e) => setBalance(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الحد الادني</label>
                          <input type='number' className="form-control" required defaultValue={minThreshold} onChange={(e) => { setminThreshold(e.target.value); }} />
                        </div>

                        <div className="form-group form-group-47">
                          <label>السعر</label>
                          <input type='Number' className="form-control" defaultValue={price} required onChange={(e) => { setprice(e.target.value); settotalCost(e.target.value * Balance) }} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>التكلفة</label>
                          <input type='text' className="form-control" required defaultValue={totalCost} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>عدد الوحدات</label>
                          <input type='Number' className="form-control" defaultValue={parts} required onChange={(e) => { setparts(e.target.value); setcostOfPart(price / e.target.value) }} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>تكلفة الوحده</label>
                          <input type='Number' className="form-control" required defaultValue={costOfPart} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" defaultValue={new Date().toLocaleDateString()} required readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}

              {/* <div id="deleteSupplierTransactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockItem}>
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
    </detacontext.Consumer>

  )
}

export default SupplierTransaction