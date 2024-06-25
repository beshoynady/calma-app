import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

const EmployeesSalary = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  // Existing state variables and useEffect
  const [listofemployee, setlistofemployee] = useState([])
  const getemployees = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/employee', config)
      const employee = await response.data
      setlistofemployee(employee)
    } catch (error) {
      console.log(error)
    }
  }

  const [listofmovement, setlistofmovement] = useState(['سلف', 'خصم', 'غياب', 'اضافي', 'مكافأة'])
  const [salarymovementId, setsalarymovementId] = useState("")
  const [employeeId, setemployeeId] = useState("")
  const [employeeName, setemployeeName] = useState("")
  const [movement, setmovement] = useState("")
  const [Amount, setAmount] = useState()
  const [oldAmount, setoldAmount] = useState(0)
  const [newAmount, setnewAmount] = useState()


  // Function to add new salary movement
  const addSalaryMovement = async (e) => {
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
      const response = await axios.post(apiUrl + '/api/salarymovement', data, config);
      console.log({ response })
      if (response) {
        getSalaryMovement();
        toast.success('تم اضافه السجل بنجاح');
      }

    } catch (error) {
      console.log(error);
      toast.error('An error occurred while adding the movement');
    }
  };

  // Function to update salary movement
  const updateSalaryMovement = async (e) => {
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
      const response = await axios.put(`${apiUrl}/api/salarymovement/${salarymovementId}`, data, config);
      
      getSalaryMovement();
      toast.success('تم تعديل السجل بنجاح');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while updating the movement');
    }
  };

  // Function to delete salary movement
  const deleteSalaryMovement = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${apiUrl}/api/salarymovement/${salarymovementId}`, config);
      getSalaryMovement();
      toast.success('تم حذف السجل بنجاح');
    } catch (error) {
      console.log(error);
      toast.error('An error occurred while deleting the movement');
    }
  };

  const [listofsalarymovement, setlistofsalarymovement] = useState([])
  const getSalaryMovement = async () => {
    try {
      const SalaryMovement = await axios.get(apiUrl + '/api/salarymovement', config)
      console.log({SalaryMovement})
      setlistofsalarymovement(movement.data.reverse())
      
    } catch (error) {
      console.log({error})  
    }
  }

  const [EmployeeSalaryMovement, setEmployeeSalaryMovement] = useState([])

  const filterEmployeeSalaryMovement = async (id) => {
    if(!id){
      getSalaryMovement()
    }
    const filterSalaryMovement = listofsalarymovement.length > 0 ? listofsalarymovement.filter(move => move.employeeId == id) : []
    console.log(filterSalaryMovement)
    if (filterSalaryMovement.length > 0) {
      setEmployeeSalaryMovement(filterSalaryMovement.reverse())
    }
  }


  const filterSalaryMovement = async (m) => {
    try {
      // Get the current month and year
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Filter movements using the current month and year
      const CurrentSalaryMovement = EmployeeSalaryMovement.filter((SalaryMovement) => {
        const SalaryMovementDate = new Date(SalaryMovement.actionAt);
        const SalaryMovementMonth = SalaryMovementDate.getMonth();
        const SalaryMovementYear = SalaryMovementDate.getFullYear();

        return SalaryMovementMonth === currentMonth && SalaryMovementYear === currentYear;
      });

      // Filter movements based on the specified 'm' parameter
      const filterMovement = CurrentSalaryMovement.filter((move) => move.movement === m);

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


  const getSalaryMovementByemp = (id) => {
    if(!id){
      getSalaryMovement()
      return
    } else {
      const FilterByEmployees = listofsalarymovement.filter(m => m.employeeId._id  === id)
      setlistofsalarymovement(FilterByEmployees.reverse())
    }
  }

  const filterEmpSalaryMovement = (mov) => {
    // console.log(mov)
    // console.log(filterEmp)
    // console.log(listofsalarymovement)
    if (filterEmp.length > 0) {
      const filterlist = filterEmp.filter(m => m.movement == mov)
      setlistofsalarymovement(filterlist.reverse())
    } else {
      const filterlist = listofsalarymovement.filter(m => m.movement == mov)
      console.log(filterlist)
      setlistofsalarymovement(filterlist.reverse())
    }
  }

  useEffect(() => {
    getSalaryMovement()
    getemployees()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle,setStartDate, setEndDate, filterByDateRange, filterByTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>تعاملات الموظفين</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addSalaryMovementModal" onClick={() => { setactionBy(employeeLoginInfo ? employeeLoginInfo.employeeinfo.id : '') }} className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة حركة</span></a>
                        <a href="#deleteSalaryMovementModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter">
                    <div class="row text-dark">
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
                          <span>عنصر</span>
                        </div>
                        <div class="filter-group">
                          <label>الاسم</label>
                          <input type="text" class="form-control" />
                          <button type="button" class="btn btn-47 btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="filter-group">
                          <label>الموظف</label>
                          <select class="form-control" onChange={(e) => getSalaryMovementByemp(e.target.value)} >
                            <option>الكل</option>
                            {listofemployee.map((em, i) => {
                              return (
                                <option value={em._id} key={i}>{em.fullname}</option>
                              )
                            })}
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>العملية</label>
                          <select class="form-control" onChange={(e) => filterEmpSalaryMovement(e.target.value)} >
                            <option >الكل</option>
                            {listofmovement.map((m, i) => {
                              return (
                                <option value={m} key={i}>{m}</option>
                              )
                            })}
                          </select>
                        </div>

                        <div className="filter-group">
                        <label>فلتر حسب الوقت</label>
                        <select className="form-control" onChange={(e) => setlistofsalarymovement(filterByTime(e.target.value, listofsalarymovement))}>
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
                          <button type="button" className="btn btn-primary w-50" onClick={()=>setlistofsalarymovement(filterByDateRange(listofsalarymovement))}>
                            <i className="fa fa-search"></i>
                          </button>
                          <button type="button" className="btn btn-warning w-50" onClick={getSalaryMovement}>
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
                      listofsalarymovement.length ? listofsalarymovement.map((mov, i) => {
                          // if (i < pagination & i >= pagination - 5) {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{mov.employeeId.username}</td>
                                <td>{mov.movement}</td>
                                <td>{mov.Amount}</td>
                                <td>{mov.oldAmount}</td>
                                <td>{mov.newAmount}</td>
                                <td>{mov.actionBy.username}</td>
                                <td>{formatDateTime(mov.createdAt)}</td>
                                <td>
                                  <a href="#editSalaryMovementModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                    setsalarymovementId(mov._id); setemployeeName(mov.employeeName); setAmount(mov.Amount); setoldAmount(mov.oldAmount); setnewAmount(mov.newAmount); 
                                   setmovement(mov.movement)
                                  }}>&#xE254;</i></a>
                                  <a href="#deleteSalaryMovementModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setsalarymovementId(mov._id)}>&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                          : ""}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listofsalarymovement.length > endpagination ? endpagination : listofsalarymovement.length}</b> من <b>{listofsalarymovement.length}</b> عنصر</div>
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



              <div id="addSalaryMovementModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={addSalaryMovement}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضف تعامل جديد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الاسم</label>
                          <select form="carform" required onChange={(e) => {
                            setemployeeName(listofemployee ? listofemployee.find(em => em._id == e.target.value).fullname : ""); setemployeeId(e.target.value);
                            filterEmployeeSalaryMovement(e.target.value)
                          }}>
                            <option>اختار</option>
                            {listofemployee.length > 0 ? listofemployee.map((employee, i) => {
                              return (
                                <option value={employee._id} key={i}>{employee.fullname}</option>
                              )
                            })
                              : ""}
                          </select>
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>التعامل</label>
                          <select form="carform" required onChange={(e) => { filterSalaryMovement(e.target.value); setmovement(e.target.value) }}>
                            <option>اختر</option>
                            {listofmovement.length > 0 ? listofmovement.map((movement, i) => {
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
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="Close" />
                        <input type="submit" className="btn btn-47 btn-success" value="Add" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="editSalaryMovementModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={updateSalaryMovement}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل تعامل</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الاسم</label>
                          <select form="carform" defaultValue={employeeName} required onChange={(e) => { setemployeeName(listofemployee.find(em => em._id == e.target.value).fullname); setemployeeId(e.target.value); filterEmployeeSalaryMovement(e.target.value) }}>
                            <option>اختر</option>
                            {listofemployee.length > 0 ? listofemployee.map(employee => {
                              return (
                                <option value={employee._id}>{employee.fullname}</option>
                              )
                            }) : ""}
                          </select>
                        </div>
                        <div className="form-group w-50 d-flex flex-nowrap"> 
                          <label>الحركه</label>
                          <select form="carform" defaultValue={movement} required onChange={(e) => { filterSalaryMovement(e.target.value); setmovement(e.target.value) }}>
                            <option>اختر</option>
                            {listofmovement.length > 0 ? listofmovement.map((movement, i) => {
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
                          <p className="form-control" readOnly>{formatDateTime(createdAt)}</p>                        
                          </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-47 btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteSalaryMovementModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteSalaryMovement}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف موظف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-47 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default EmployeesSalary