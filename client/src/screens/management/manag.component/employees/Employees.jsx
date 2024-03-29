import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Joi = require('joi')
const Employees = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const [listOfEmployees, setListOfEmployees] = useState([]);
  
  const getEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employee`, config);
      const data = response.data;
      setListOfEmployees(data);
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };
  const [shifts, setshifts] = useState([]);
  
  const getShifts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/shift`, config);
      const data = response.data;
      setshifts(data);
      console.log({Shifts: data });
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const [employeeid, setemployeeid] = useState("")
  const [fullname, setfullname] = useState("")
  const [numberID, setnumberID] = useState("")
  const [username, setusername] = useState("")
  const [basicSalary, setbasicSalary] = useState()
  const [shift, setshift] = useState('')
  const [password, setpassword] = useState("")
  const [address, setaddress] = useState("")
  const [phone, setphone] = useState("")
  const [email, setemail] = useState("")
  const [isActive, setisActive] = useState(true)
  const [role, setrole] = useState("")
  const [sectionNumber, setsectionNumber] = useState()

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Close after 3 seconds
    });
  };

  //   const EmployeeSchema = Joi.object({
  //     fullname: Joi.string().min(3).max(100),
  //     numberID: Joi.string().length(14),
  //     username: Joi.string().min(3).max(100),
  //     email: Joi.string().email(),
  //     address: Joi.string().min(3).max(150),
  //     phone: Joi.string().length(11),
  //     password: Joi.string().min(3),
  //     basicSalary: Joi.number().min(0),
  //     sectionNumber: Joi.string().valid('manager', 'casher', 'waiter', 'deliveryman', 'Chef'),
  //     isActive: Joi.boolean(),
  // });
  const createEmployee = async (e) => {
    e.preventDefault()
    // const { error } = EmployeeSchema.validate({ fullname, numberID, username, email, address, phone, password, basicSalary, role, isActive });
    // if (error) {
    //     notify(error.details[0].message, 'error');
    //     return;
    // }
    if (
      !fullname ||
      !basicSalary ||
      !numberID ||
      !username ||
      !password ||
      !address ||
      !phone ||
      !email ||
      !isActive ||
      !role
    ) {
      // Notify the user that some fields are missing
      notify('جميع الحقول مطلوبه ! رجاء ملئ جميع الحقول', 'error');
      return;
    }
    try {
      console.log(fullname)
      console.log(username)
      console.log(password)
      console.log(address)
      console.log(phone)
      console.log(email)
      console.log(shift)
      console.log(isActive)
      console.log(role)
      console.log(basicSalary)

      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const newemployee = await axios.post(apiUrl+'/api/employee', { fullname, basicSalary, numberID, username, password, address,shift, phone, email, isActive, role, sectionNumber }, {
        headers: {
          'authorization': `Bearer ${token}`,
        },
      })
      console.log(newemployee)
      notify('تم انشاء حساب الموظف بنجاح', 'success');
      getEmployees();
    } catch (error) {
      console.log(error);
      notify('فشل انشاء حساب الموظف ! حاول مره اخري', 'error');
    }
  };


  const editEmployee = async (e) => {
    e.preventDefault()
    console.log(fullname)
    console.log(username)
    console.log(password)
    console.log(address)
    console.log(phone)
    console.log(email)
    console.log(shift)
    console.log(isActive)
    console.log(role)
    console.log(basicSalary)
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      // const { error } = EmployeeSchema.validate({ fullname, numberID, username, email, address, phone, password, basicSalary, role, isActive });
      // if (error) {
      //     notify(error.details[0].message, 'error');
      //     return;
      // }

      const updateData = password
        ? { fullname, numberID, username, email,shift, address, phone, password, basicSalary, isActive, role, sectionNumber }
        : { fullname, numberID, username, email,shift, address, phone, basicSalary, isActive, role, sectionNumber };

      const update = await axios.put(`${apiUrl}/api/employee/${employeeid}`, updateData, {
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });
      if (update.status === 200) {
        getEmployees()
        notify('تم تحديث بيانات الموظف', 'success');
        // Additional logic if needed after successful update
      }

    } catch (error) {
      notify('فشل تحديث بيانات الموظف! حاول مره اخري', 'error');
      console.log(error);
      // Additional error handling
    }
  };


  const [filterEmp, setfilterEmp] = useState([])
  const getEmployeesByJob = (role) => {
    if (listOfEmployees.length > 0) {
      const FilterEmployees = listOfEmployees.filter(employee => employee.role == role)
      setfilterEmp(FilterEmployees)
    }
  }
  const getEmployeesByShift = (shift) => {
    if (listOfEmployees.length > 0) {
      const FilterEmployees = listOfEmployees.filter(employee => employee.shift == shift)
      setfilterEmp(FilterEmployees)
    }
  }
  const getEmployeesByName = (name) => {
    if (listOfEmployees.length > 0) {
      const employee = listOfEmployees.filter((employee) => employee.fullname.startsWith(name) == true)
      setfilterEmp(employee)
    }
  }
  const filterEmpByStatus = (status) => {
    console.log(status);
    let filteredEmployees;

    if (status === 'true') {
      filteredEmployees = listOfEmployees.length>0?listOfEmployees.filter((employee) => employee.isActive === true):'';
    } else if (status === 'false') {
      filteredEmployees = listOfEmployees?listOfEmployees.filter((employee) => employee.isActive === false):"";
    } else {
      filteredEmployees = listOfEmployees; // If status is not 'true' or 'false', show all employees
    }

    console.log(filteredEmployees);
    setfilterEmp(filteredEmployees);
  };

  const deleteEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const deleted = await axios.delete(`${apiUrl}/api/employee/${employeeid}`, {
        headers: {
          'authorization': `Bearer ${token}`,
        },
      });
      notify('تم حذف سجل الموظف بنجاح', 'success');
      getEmployees();
    } catch (error) {
      console.log(error);
      notify('فشل حذف سجل الموظف !حاول مره اخري', 'error');
    }
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
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/order/${Id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });
      }
      getEmployees()
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };



  useEffect(() => {
    getEmployees()
    getShifts()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({restaurantData, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الموظفين</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addEmployeeModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة موظف جديد</span></a>
                        <a href="#deleteListEmployeeModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
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
                          <span>عنصر</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>الاسم</label>
                          <input type="text" class="form-control" onChange={(e)=>getEmployeesByName(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="filter-group">
                          <label>الوظيفة</label>
                          <select class="form-control" onChange={(e) => getEmployeesByJob(e.target.value)} >
                            <option>الكل</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>الشيفت</label>
                          <select class="form-control" onChange={(e) => getEmployeesByShift(e.target.value)} >
                          <option >اختر</option>
                            {restaurantData.shifts ? restaurantData.shifts.map((shift, i) =>
                            <option value={shift._id} key={i}>{shift.shiftType}</option>
                            ):<option>لم يتم انشاء شفتات</option>}

                          </select>
                        </div>
                        <div class="filter-group">
                          <label>الحالة</label>
                          <select class="form-control" onChange={(e) => filterEmpByStatus(e.target.value)} >
                            <option >الكل</option>
                            <option value={true}>متاح</option>
                            <option value={false}>غير متاح</option>
                          </select>
                        </div>
                        {/* <span class="filter-icon"><i class="fa fa-filter"></i></span> */}
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>
                          <span className="custom-checkbox">
                          </span>
                        </th>
                        <th>م</th>
                        <th>الاسم</th>
                        <th>رقم قومي</th>
                        <th>العنوان</th>
                        <th>الموبايل</th>
                        <th>الوظيفه</th>
                        <th>الراتب</th>
                        <th>الحالة</th>
                        <th>السكشن</th>
                        <th>الشيفت</th>
                        <th>التاريخ</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterEmp.length > 0 ? filterEmp.map((emp, i) => {
                        if (i >= startpagination & i < endpagination) {
                          return (
                            <tr key={i}>
                              <td>
                                <span className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    id={`checkbox${i}`}
                                    name="options[]"
                                    value={emp._id}
                                    onChange={handleCheckboxChange}
                                  />
                                  <label htmlFor={`checkbox${i}`}></label>
                                </span>
                              </td>
                              <td>{i + 1}</td>
                              <td>{emp.fullname}</td>
                              <td>{emp.numberID}</td>
                              <td>{emp.address}</td>
                              <td>{emp.phone}</td>
                              <td>{emp.role}</td>
                              <td>{emp.basicSalary}</td>
                              <td>{emp.isActive ? 'متاح' : "غير متاح"}</td>
                              <td>{emp.sectionNumber}</td>
                              <td>{emp.shift}</td>
                              <td>{new Date(emp.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                              <td>
                                <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                  setemployeeid(emp._id); setnumberID(emp.numberID); setusername(emp.username); setaddress(emp.address); setemail(emp.email); setisActive(emp.isActive); setphone(emp.phone); setrole(emp.role); setbasicSalary(emp.basicSalary)
                                }}>&#xE254;</i></a>
                                <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setemployeeid(emp._id)}>&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })
                        : listOfEmployees.length>0?listOfEmployees.map((emp, i) => {
                          // if (i < pagination & i >= pagination - 5) {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span className="custom-checkbox">
                                    <input
                                      type="checkbox"
                                      id={`checkbox${i}`}
                                      name="options[]"
                                      value={emp._id}
                                      onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={`checkbox${i}`}></label>
                                  </span>
                                </td>
                                <td>{i + 1}</td>
                                <td>{emp.fullname}</td>
                                <td>{emp.numberID}</td>
                                <td>{emp.address}</td>
                                <td>{emp.phone}</td>
                                <td>{emp.role}</td>
                                <td>{emp.basicSalary}</td>
                                <td>{emp.isActive ? 'متاح' : "غير متاح"}</td>
                                <td>{emp.sectionNumber}</td> 
                                <td>{emp.shift}</td>
                                <td>{new Date(emp.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                <td>
                                  <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => {
                                    setemployeeid(emp._id); setfullname(emp.fullname); setnumberID(emp.numberID); setusername(emp.username); setaddress(emp.address); setemail(emp.email); setisActive(emp.isActive); setphone(emp.phone); setrole(emp.role); setbasicSalary(emp.basicSalary)
                                  }}>&#xE254;</i></a>
                                  <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setemployeeid(emp._id)}>&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      :""}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listOfEmployees.length > endpagination ? endpagination : listOfEmployees.length}</b> من <b>{listOfEmployees.length}</b> عنصر</div>
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
              <div id="addEmployeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createEmployee}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه موظف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required pattern="[A-Za-z\u0600-\u06FF\s]+" onChange={(e) => setfullname(e.target.value)} />
                          <div className="invalid-feedback">ادخل اسما صحيحا.</div>
                        </div>
                        <div className="form-group">
                          <label>اسم المستخدم</label>
                          <input type="text" className="form-control" required onChange={(e) => setusername(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الموبايل</label>
                          <input type="text" className="form-control" required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid phone number (11 digits).</div>
                        </div>
                        <div className="form-group">
                          <label>الباسورد</label>
                          <input type="text" className="form-control" required onChange={(e) => setpassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرقم القومي</label>
                          <input type="text" className="form-control" required onChange={(e) => setnumberID(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الايميل</label>
                          <input type="email" className="form-control" required onChange={(e) => setemail(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid email address.</div>
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <textarea className="form-control" required onChange={(e) => setaddress(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select form="carform" required onChange={(e) => setisActive(e.target.value)}>
                            <option >اختر</option>
                            <option value={true}>متاح</option>
                            <option value={false}>ليس متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الشيفت</label>
                          <select form="carform" required onChange={(e) => setshift(e.target.value)}>
                            <option >اختر</option>
                            {restaurantData.shifts ? restaurantData.shifts.map((shift, i) =>
                            <option value={shift._id} key={i}>{shift.shiftType}</option>
                            ):<option>لم يتم انشاء شفتات</option>}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الوظيفه</label>
                          <select name={role} form="carform" required onChange={(e) => setrole(e.target.value)}>
                            <option>اختار وظيفة</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="deliveryman">الديلفري</option>
                            <option value="waiter">ويتر</option>
                            <option value="chef">شيف</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" required onChange={(e) => setbasicSalary(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid salary.</div>
                        </div>
                        {role == 'waiter' ?
                          <div className="form-group">
                            <label>رقم السكشن</label>
                            <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                          </div>
                          : ''}

                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-success"  value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="editEmployeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editEmployee}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل بيانات الموظفين</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" defaultValue={fullname} required pattern="[A-Za-z\u0600-\u06FF\s]+" onChange={(e) => setfullname(e.target.value)} />
                          <div className="invalid-feedback">الرجاء إدخال اسم صحيح.</div>
                        </div>
                        <div className="form-group">
                          <label>اسم المستخدم</label>
                          <input type="text" className="form-control" defaultValue={username} required onChange={(e) => setusername(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الموبايل</label>
                          <input type="text" className="form-control" defaultValue={phone} required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                          <div className="invalid-feedback">الرجاء إدخال رقم هاتف صحيح (11 رقم).</div>
                        </div>
                        <div className="form-group">
                          <label>الباسورد</label>
                          <input type="password" className="form-control" onChange={(e) => setpassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرقم القومي</label>
                          <input type="text" className="form-control" defaultValue={numberID} required onChange={(e) => setnumberID(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الايميل</label>
                          <input type="email" className="form-control" defaultValue={email} required onChange={(e) => setemail(e.target.value)} />
                          <div className="invalid-feedback">الرجاء إدخال عنوان بريد إلكتروني صحيح.</div>
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <textarea className="form-control" defaultValue={address} required onChange={(e) => setaddress(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select form="carform" required defaultValue={isActive} onChange={(e) => setisActive(e.target.value)}>
                            <option>اختر</option>
                            <option value={true}>متاح</option>
                            <option value={false}>ليس متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الشيفت</label>
                          <select form="carform" required onChange={(e) => setshift(e.target.value)}>
                            <option >اختر</option>
                            {restaurantData.shifts ? restaurantData.shifts.map((shift, i) =>
                            <option value={shift._id} key={i}>{shift.shiftType}</option>
                            ):<option>لم يتم انشاء شفتات</option>}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الوظيفة</label>
                          <select name={role} form="carform" defaultValue={role} required onChange={(e) => setrole(e.target.value)}>
                            <option>اختار وظيفة</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="deliveryman">الديلفري</option>
                            <option value="waiter">ويتر</option>
                            <option value="chef">شيف</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" defaultValue={basicSalary} required onChange={(e) => setbasicSalary(e.target.value)} />
                        </div>
                      </div>
                      {role == 'waiter' ?
                        <div className="form-group">
                          <label>رقم السكشن</label>
                          <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                        </div>
                        : ''}
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="deleteEmployeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteEmployee}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف موظف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteListEmployeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteSelectedIds}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف الموظفين المحددين</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
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

export default Employees