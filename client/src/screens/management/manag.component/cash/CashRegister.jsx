import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';

const CashRegister = () => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [cashRegisters, setCashRegisters] = useState([]);
  const [allEmployee, setallEmployee] = useState([]);
  const [name, setname] = useState('');
  const [balance, setbalance] = useState('');
  const [employee, setemployee] = useState('');
  const [cashID, setcashID] = useState('');

  // Fetch employees
  const getEmployees = async () => {
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const response = await axios.get(`${apiUrl}/api/employee`, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
      const data = response.data;
      setallEmployee(data);
    } catch (error) {
      if (error.response) {
        // يتم استخدام هذا الجزء إذا تم استرداد استجابة من الخادم برمز الحالة خاطئ
        console.error('Server responded with status code:', error.response.status);
        console.error('Error message:', error.response.data);
        toast.error('An error occurred while fetching employees. Please try again later.');
      } else if (error.request) {
        // يتم استخدام هذا الجزء إذا تم إرسال الطلب ولكن لم يتم الرد عليه بأي شكل
        console.error('No response received from server.');
        toast.error('No response received from server. Please check your internet connection.');
      } else {
        // يتم استخدام هذا الجزء لأي أخطاء أخرى تم التقاطها
        console.error('An unexpected error occurred:', error.message);
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };


  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const response = await axios.get(apiUrl + '/api/cashregister', {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
      setCashRegisters(response.data.reverse());
    } catch (err) {
      console.error('Error fetching cash registers:', err);
      toast.error('An error occurred while fetching cash registers. Please try again later.');
    }
  };

  // Fetch a cash register by ID
  const getCashRegisterById = async () => {
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const response = await axios.get(`${apiUrl}/api/cashregister/${cashID}`, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
      // Handle response (e.g., display details, update state)
    } catch (err) {
      toast.error('Cash register not found');
    }
  };

  // Create a new cash register
  const createCashRegister = async (e) => {
    e.preventDefault()
    const newCashRegister = { name, balance, employee };
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const response = await axios.post(apiUrl + '/api/cashregister', newCashRegister, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
      console.log(response);
      toast.success('Cash register created successfully');
      getAllCashRegisters()
    } catch (err) {
      console.log(err);
      toast.error('Failed to create cash register');
    }
  };

  // Update a cash register
  const updateCashRegister = async (e) => {
    e.preventDefault()
    const updatedCashRegister = { name, balance, employee };
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const response = await axios.put(`${apiUrl}/api/cashregister/${cashID}`, updatedCashRegister, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
      toast.success('Cash register updated successfully');
      getAllCashRegisters()
    } catch (err) {
      toast.error('Failed to update cash register');
    }
  };

  // Delete a cash register
  const deleteCashRegister = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const response = await axios.delete(`${apiUrl}/api/cashregister/${cashID}`, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });
      toast.success('Cash register deleted successfully');
    } catch (err) {
      toast.error('Failed to delete cash register');
    }
  };

  // Filter cash registers by employee ID
  const filterCashRegistersByEmployee = (employeeid) => {
    const filteredRegisters = cashRegisters.filter(register => register.employee === employeeid);
    setCashRegisters(filteredRegisters);
  };

  // Filter cash registers by name (startsWith comparison)
  const filterCashRegistersByName = (cashName) => {
    const filteredRegisters = cashRegisters.filter(register => register.name.startsWith(cashName));
    setCashRegisters(filteredRegisters);
  };


  const [selectedIds, setSelectedIds] = useState([]);
  const handleCheckboxChange = (e) => {
    const Id = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedIds([...selectedIds, Id]);
    } else {
      const updatedSelectedIds = selectedIds.filter((id) => id !== Id);
      setSelectedIds(updatedSelectedIds);
    }
  };

  const deleteSelectedIds = async (e) => {
    e.preventDefault();
    console.log(selectedIds)
    try {
      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/order/${Id}`);
      }
      getAllCashRegisters()
      getEmployees()
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };

  useEffect(() => {
    // Fetch initial data on component mount
    getAllCashRegisters()
    getEmployees()
  }, [])

  return (
    <detacontext.Consumer>
      {({ EditPagination, usertitle, startpagination, endpagination, setstartpagination, setendpagination }) => {
        return (
          <div className="container-xl mlr-auto">
            <div className="table-responsive">
              <div className="table-wrapper">
                <div className="table-title">
                  <div className="row">
                    <div className="col-sm-6 text-right">
                      <h2>ادارة <b>الخزينه</b></h2>
                    </div>
                    <div className="col-sm-6 d-flex justify-content-end">
                      <a href="#addCashRegisterModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه خزنه</span></a>
                      <a href="#deleteListCashRegisterModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                        <label>اسم الخزينه</label>
                        <input type="text" class="form-control" onChange={(e) => filterCashRegistersByName(e.target.value)} />
                        <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                      </div>
                      <div class="filter-group">
                        <label>المسؤل</label>
                        <select class="form-control" onChange={(e) => filterCashRegistersByEmployee(e.target.value)}>
                          <option >اختر</option>
                          {allEmployee && allEmployee.map((Employee, i) => {
                            return <option value={Employee._id} key={i} >{Employee.username}</option>
                          })
                          }
                        </select>
                      </div>
                      {/* 
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
                      <th>الخزينة</th>
                      <th>المسؤل</th>
                      <th>الرصيد</th>
                      <th>اجراءات</th>
                    </tr>

                  </thead>
                  <tbody>
                    {cashRegisters.length > 0 ? cashRegisters.map((cash, i) => {
                      if (i >= startpagination & i < endpagination) {
                        return (
                          <tr key={i}>
                            <td>
                              <span className="custom-checkbox">
                                <input
                                  type="checkbox"
                                  id={`checkbox${i}`}
                                  name="options[]"
                                  value={cash._id}
                                  onChange={handleCheckboxChange}
                                />
                                <label htmlFor={`checkbox${i}`}></label>
                              </span>
                            </td>
                            <td>{i + 1}</td>
                            <td>{cash.name}</td>
                            <td>{usertitle(cash.employee)}</td>
                            <td>{cash.balance}</td>
                            <td>
                              <a href="#editCashRegisterModal" className="edit" data-toggle="modal" onClick={() => { setcashID(cash._id); setname(cash.name); setemployee(cash.employee); setbalance(cash.balance) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                              <a href="#deleteCashRegisterModal" className="delete" data-toggle="modal" onClick={() => setcashID(cash._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                            </td>
                          </tr>
                        )
                      }
                    })
                      : ''}

                  </tbody>
                </table>
                <div className="clearfix">
                  <div className="hint-text text-dark">عرض <b>{cashRegisters.length > endpagination ? endpagination : cashRegisters.length}</b> من <b>{cashRegisters.length}</b> عنصر</div>
                  <ul className="pagination">
                    <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                    <li onClick={EditPagination} className="page-item active"><a href="#" className="page-link">3</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                    <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div id="addCashRegisterModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={createCashRegister}>
                    <div className="modal-header">
                      <h4 className="modal-title">اضافه خزينه</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>الاسم</label>
                        <input type="text" className="form-control" required onChange={(e) => setname(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>المسؤل</label>
                      <select name="Employee" id="Employee" form="carform" onChange={(e) => setemployee(e.target.value)}>
                        <option>احتر الموظف</option>
                        {allEmployee.map((Employee, i) => {
                          return <option value={Employee._id} key={i} >{Employee.username}</option>
                        })
                        }
                      </select>
                    </div>

                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-success" value="اضافه" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="editCashRegisterModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={updateCashRegister}>
                    <div className="modal-header">
                      <h4 className="modal-title">تعديل التصنيف</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>الاسم</label>
                        <input type="text" className="form-control" required defaultValue={name} onChange={(e) => setname(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>المسؤل</label>
                      <select name="category" id="category" form="carform" defaultValue={employee} onChange={(e) => setemployee(e.target.value)}>
                        <option>احتر الموظف</option>
                        {allEmployee.length > 0 ? allEmployee.map((Employee, i) => {
                          return <option value={Employee._id} key={i} >{Employee.username}</option>
                        })
                          : ""}
                      </select>
                    </div>
                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-info" value="حفظ" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="deleteCashRegisterModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={deleteCashRegister}>
                    <div className="modal-header">
                      <h4 className="modal-title">حذف تصنيف</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <p>هل انت متاكد من حذف هذا التصنيف?</p>
                      <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
                    </div>
                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-danger" value="حذف" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="deleteListCashRegisterModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={deleteSelectedIds}>
                    <div className="modal-header">
                      <h4 className="modal-title">حذف الخزن المحدده</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <p>هل انت متاكد من حذف هذا التصنيف?</p>
                      <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
                    </div>
                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-danger" value="حذف" />
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

export default CashRegister