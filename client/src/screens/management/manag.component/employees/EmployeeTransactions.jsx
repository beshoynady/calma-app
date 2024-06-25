import React, { useState, useEffect, useRef,useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';




const EmployeeTransactions = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const {employeeLoginInfo,formatDateTime, allEmployees,setStartDate, setEndDate, filterByDateRange, filterByTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination}= useContext(detacontext)

  const [listofTransactions, setlistofTransactions] = useState(['سلف', 'خصم', 'غياب', 'اضافي', 'مكافأة'])
  const [EmployeeTransactionsId, setEmployeeTransactionsId] = useState("")
  const [employeeId, setemployeeId] = useState("")
  const [employeeName, setemployeeName] = useState("")
  const [movement, setmovement] = useState("")
  const [Amount, setAmount] = useState()
  const [oldAmount, setoldAmount] = useState(0)
  const [newAmount, setnewAmount] = useState()


  // Function to add new salary movement
  const addEmployeeTransactions = async (e) => {
    e.preventDefault();
    const data = {
      employeeId,
      employeeName,
      movement,
      Amount,
      oldAmount,
      newAmount,
    };

    try {
      const response = await axios.post(apiUrl + '/api/employeetransactions', data, config);
      console.log({ response })
      if (response) {
        getEmployeeTransactions();
        toast.success('تم اضافه السجل بنجاح');
      }

    } catch (error) {
      console.log(error);
      toast.error('An error occurred while adding the movement');
    }
  };

  // Function to update salary movement
  const updateEmployeeTransactions = async (e) => {
    e.preventDefault();
    const data = {
      employeeId,
      employeeName,
      movement,
      Amount,
      oldAmount,
      newAmount,
    };

    try {
      const response = await axios.put(`${apiUrl}/api/employeetransactions/${EmployeeTransactionsId}`, data, config);
      
      getEmployeeTransactions();
      toast.success('تم تعديل السجل بنجاح');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while updating the movement');
    }
  };

  // Function to delete salary movement
  const deleteEmployeeTransactions = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${apiUrl}/api/employeetransactions/${EmployeeTransactionsId}`, config);
      getEmployeeTransactions();
      toast.success('تم حذف السجل بنجاح');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while deleting the movement');
    }
  };

  const [listofEmployeeTransactions, setlistofEmployeeTransactions] = useState([])
  const getEmployeeTransactions = async () => {
    try {
      const EmployeeTransactions = await axios.get(apiUrl + '/api/employeetransactions', config)
      console.log({EmployeeTransactions})
      setlistofEmployeeTransactions(EmployeeTransactions.data.reverse())
      
    } catch (error) {
      console.log({error})  
    }
  }




  const filterEmployeeTransactions = async (m) => {
    try {
      // Get the current month and year
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Filter movements using the current month and year
      const CurrentEmployeeTransactions = EmployeeTransactions.filter((EmployeeTransactions) => {
        const EmployeeTransactionsDate = new Date(EmployeeTransactions.actionAt);
        const EmployeeTransactionsMonth = EmployeeTransactionsDate.getMonth();
        const EmployeeTransactionsYear = EmployeeTransactionsDate.getFullYear();

        return EmployeeTransactionsMonth === currentMonth && EmployeeTransactionsYear === currentYear;
      });

      // Filter movements based on the specified 'm' parameter
      const filterMovement = CurrentEmployeeTransactions.filter((move) => move.transactionType === m);

      console.log(filterMovement);

      // Set 'oldAmount' based on the filtered movement data
      if (filterMovement.length > 0) {
        setoldAmount(filterMovement[filterMovement.length - 1].newAmount);
      } else {
        setoldAmount(0);
      }
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };


  const getEmployeeTransactionsByEmp = (id) => {
    if(!id){
      getEmployeeTransactions()
      return
    } else {
      const FilterByEmployees = listofEmployeeTransactions.filter(m => m.employeeId._id  === id)
      setlistofEmployeeTransactions(FilterByEmployees.reverse())
    }
  }

  const filterEmpEmployeeTransactions = (transaction) => {

    if (!transaction) {
      getEmployeeTransactions()
    } else {
      const filterlist = listofEmployeeTransactions.filter(trans => trans.transactionType == transaction)
      setlistofEmployeeTransactions(filterlist.reverse())
    }
  }


  
  const exportToExcel = () => {
    const data = listofEmployeeTransactions.map((transaction, i) => ({
      'م': i + 1,
      'الاسم': transaction.employeeId && transaction.employeeId.username,
      'الحركة': transaction.transactionType,
      'المبلغ': transaction.Amount,
      'المبلغ السابق': transaction.oldAmount,
      'الاجمالي': transaction.newAmount,
      'بواسطه': transaction.actionBy && transaction.actionBy.username,
      'اليوم': transaction.createdAt && formatDateTime(transaction.createdAt),
    }));
  
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'EmployeeTransactions');
  
    XLSX.writeFile(wb, 'employee_transactions.xlsx');
  };
  



  const printEmployeeTransactionsContainer = useRef()
  const handlePrint = useReactToPrint({
    content: () => printEmployeeTransactionsContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });

  useEffect(() => {
    getEmployeeTransactions()
  }, [])

          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive" ref={printEmployeeTransactionsContainer}>
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>تعاملات الموظفين</b></h2>
                      </div>
                      <div className="col-6 d-flex justify-content-end print-hide">
                        <a href="#addEmployeeTransactionsModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة حركة</span></a>
                        <a href="#" className="btn w-50 btn-info" data-toggle="modal" onClick={exportToExcel}><i className="material-icons">&#xE15C;</i> <span>تصدير</span></a>
                        <a href="#" className="btn w-50 btn-primary" data-toggle="modal" onClick={handlePrint}><i className="material-icons">&#xE15C;</i> <span>طباعه</span></a>

                        {/* <a href="#deleteEmployeeTransactionsModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a> */}
                      </div>
                    </div>
                  </div>
                  <div class="table-filter print-hide">
                    <div class="w-100 d-flex flex-wrap flex-row text-dark">
                        <div class="show-entries d-flex flex-nowrap">
                          <span>عرض</span>
                          <select class="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                          </select>
                          <span>عنصر</span>
                        </div>
                        <div class="filter-group d-flex flex-nowrap">
                          <label>الاسم</label>
                          <input type="text" class="form-control" />
                        </div>
                        <div class="filter-group d-flex flex-nowrap">
                          <label>الموظف</label>
                          <select class="form-control" onChange={(e) => getEmployeeTransactionsByEmp(e.target.value)} >
                            <option>الكل</option>
                            {allEmployees.map((em, i) => {
                              return (
                                <option value={em._id} key={i}>{em.fullname}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div class="filter-group d-flex flex-nowrap">
                          <label>العملية</label>
                          <select class="form-control" onChange={(e) => filterEmpEmployeeTransactions(e.target.value)} >
                            <option >الكل</option>
                            {listofTransactions.map((m, i) => {
                              return (
                                <option value={m} key={i}>{m}</option>
                              )
                            })}
                          </select>
                        </div>

                        <div className="filter-group d-flex flex-nowrap">
                        <label>فلتر حسب الوقت</label>
                        <select className="form-control" onChange={(e) => setlistofEmployeeTransactions(filterByTime(e.target.value, listofEmployeeTransactions))}>
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
                          <input type="date" className="form-control" onChange={(e) => setStartDate(e.target.value)} placeholder="اختر التاريخ" />
                        </div>

                        <div className="d-flex flex-nowrap mr-1">
                          <label className="form-label">إلى</label>
                          <input type="date" className="form-control" onChange={(e) => setEndDate(e.target.value)} placeholder="اختر التاريخ" />
                        </div>

                        <div className="d-flex flex-nowrap justify-content-between w-25">
                          <button type="button" className="btn btn-primary w-50" onClick={()=>setlistofEmployeeTransactions(filterByDateRange(listofEmployeeTransactions))}>
                            <i className="fa fa-search"></i>
                          </button>
                          <button type="button" className="btn btn-warning w-50" onClick={getEmployeeTransactions}>
                            استعادة
                          </button>
                        </div>
                      </div>
                        {/* <span class="filter-icon"><i class="fa fa-filter"></i></span> */}
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>م</th>
                        <th>الاسم</th>
                        <th>الحركة</th>
                        <th>المبلغ</th>
                        <th>المبلغ السابق</th>
                        <th>الاجمالي</th>
                        <th>بواسطه</th>
                        <th>اليوم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                      listofEmployeeTransactions && listofEmployeeTransactions.map((transaction, i) => {
                          // if (i < pagination & i >= pagination - 5) {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{transaction.employeeId&&transaction.employeeId.username}</td>
                                <td>{transaction.transactionType}</td>
                                <td>{transaction.Amount}</td>
                                <td>{transaction.oldAmount}</td>
                                <td>{transaction.newAmount}</td>
                                <td>{transaction.actionBy&&transaction.actionBy.username}</td>
                                <td>{transaction.createdAt&&formatDateTime(transaction.createdAt)}</td>
                                <td>
                                  <a href="#editEmployeeTransactionsModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                    setEmployeeTransactionsId(transaction._id); setemployeeName(transaction.employeeName); setAmount(transaction.Amount); setoldAmount(transaction.oldAmount); setnewAmount(transaction.newAmount); 
                                   setmovement(transaction.transactionType)
                                  }}>&#xE254;</i></a>
                                  <a href="#deleteEmployeeTransactionsModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setEmployeeTransactionsId(transaction._id)}>&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listofEmployeeTransactions.length > endpagination ? endpagination : listofEmployeeTransactions.length}</b> من <b>{listofEmployeeTransactions.length}</b> عنصر</div>
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



              <div id="addEmployeeTransactionsModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={addEmployeeTransactions}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضف تعامل جديد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الاسم</label>
                          <select form="carform" required onChange={(e) => {
                            setemployeeName(allEmployees ? allEmployees.find(em => em._id == e.target.value).fullname : ""); setemployeeId(e.target.value);
                            filterEmployeeTransactions(e.target.value)
                          }}>
                            <option>اختار</option>
                            {allEmployees.length > 0 ? allEmployees.map((employee, i) => {
                              return (
                                <option value={employee._id} key={i}>{employee.fullname}</option>
                              )
                            })
                              : ""}
                          </select>
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>التعامل</label>
                          <select form="carform" required onChange={(e) => { filterEmployeeTransactions(e.target.value); setmovement(e.target.value) }}>
                            <option>اختر</option>
                            {listofTransactions.length > 0 ? listofTransactions.map((movement, i) => {
                              return (
                                <option value={movement} key={i}>{movement}</option>
                              )
                            }) : ""}
                          </select>
                        </div>
                       
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>المبلغ</label>
                          <input type="number" min={0} className="form-control" required pattern="[0-9]+" onChange={(e) => { setAmount(e.target.value); setnewAmount(Number(oldAmount) + Number(e.target.value)) }} />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الرصيد</label>
                          <input type="number" className="form-control" value={oldAmount > 0 ? oldAmount : 0} readOnly />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الاجمالي</label>
                          <input type="number" className="form-control" readOnly defaultValue={newAmount} />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>بواسطه</label>
                          <input type="text" className="form-control" readOnly defaultValue={employeeLoginInfo ? employeeLoginInfo.employeeinfo.username : ''} />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>التاريخ</label>
                          <p className="form-control" readOnly>{formatDateTime(new Date())}</p>
                        </div>
                      </div>
                      <div className="modal-footer w-100 d-flex flex-nowrap">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="Close" />
                        <input type="submit" className="btn w-50 btn-success" value="Add" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="editEmployeeTransactionsModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={updateEmployeeTransactions}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل تعامل</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الاسم</label>
                          <select form="carform" defaultValue={employeeName} required onChange={(e) => { setemployeeName(allEmployees.find(em => em._id == e.target.value).fullname); setemployeeId(e.target.value); filterEmployeeTransactions(e.target.value) }}>
                            <option>اختر</option>
                            {allEmployees.length > 0 ? allEmployees.map(employee => {
                              return (
                                <option value={employee._id}>{employee.fullname}</option>
                              )
                            }) : ""}
                          </select>
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الحركه</label>
                          <select form="carform" defaultValue={movement} required onChange={(e) => { filterEmployeeTransactions(e.target.value); setmovement(e.target.value) }}>
                            <option>اختر</option>
                            {listofTransactions.length > 0 ? listofTransactions.map((movement, i) => {
                              return (
                                <option value={movement} key={i}>{movement}</option>
                              )
                            }) : ""}
                          </select>
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>المبلغ</label>
                          <input type="Number" className="form-control" defaultValue={Amount} required onChange={(e) => { setAmount(e.target.value); setnewAmount(Number(oldAmount) + Number(e.target.value)) }} />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>المبلغ السابق</label>
                          <input type="Number" className="form-control" Value={oldAmount > 0 ? oldAmount : 0} readOnly />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الاجمالي</label>
                          <input type="Number" className="form-control" readOnly defaultValue={newAmount} />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>بواسطة</label>
                          <input type="text" className="form-control" readOnly defaultValue={employeeLoginInfo ? employeeLoginInfo.employeeinfo.username : ''} />
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>التاريخ</label>
                          <p className="form-control" readOnly>{formatDateTime(new Date())}</p>                        
                          </div>
                      </div>
                      <div className="modal-footer w-100 d-flex flex-nowrap">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn w-50 btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteEmployeeTransactionsModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteEmployeeTransactions}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف موظف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer w-100 d-flex flex-nowrap">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn w-50 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )

}

export default EmployeeTransactions