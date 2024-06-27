import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';

const Joi = require('joi')

const Employees = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const { restaurantData, formatDateTime, permissionsList, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext);


  const notify = (message, type) => {
    toast[type](message);
  };

  const permissionsForEmployee = permissionsList?.filter(permission => permission.resource === 'Employees')[0]

  const [listOfEmployees, setListOfEmployees] = useState([]);

  const getEmployees = async () => {
    if (permissionsForEmployee.read === true) {
      try {
        const response = await axios.get(`${apiUrl}/api/employee`, config);
        const data = response.data;
        setListOfEmployees(data);
        // console.log({ data });
      } catch (error) {
        // console.log(error);
        toast.error('حدث خطأاثناء جلب بيانات الموظفين اعد تحميل الصفحة')
      }
    } else {
      toast.error('ليس لك صلاحية لعرض بيانات الموظفين')
    }
  };


  const [shifts, setshifts] = useState([]);

  const getShifts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/shift`, config);
      if (response.status === 200 && response.data) {
        const { data } = response;
        setshifts(data);
        console.log({ Shifts: data });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
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


  const createEmployee = async (e, permissionsList) => {
    e.preventDefault();

    // Check if the user has the permission to create an employee

    if (permissionsForEmployee.create === false) {
      notify('ليس لك صلاحية لانشاء حساب موظف', 'info');
      return;
    }
    // Validate that all required fields are filled
    if (
      !fullname ||
      !basicSalary ||
      !numberID ||
      !username ||
      !password ||
      !address ||
      !phone ||
      !email ||
      typeof isActive !== 'boolean' || // Ensure isActive is explicitly checked
      !role
    ) {
      notify('جميع الحقول مطلوبه ! رجاء ملئ جميع الحقول', 'error');
      return;
    }

    try {
      const newEmployee = await axios.post(apiUrl + '/api/employee', {
        fullname,
        basicSalary,
        numberID,
        username,
        password,
        address,
        shift,
        phone,
        email,
        isActive,
        role,
        sectionNumber
      }, config);

      notify('تم انشاء حساب الموظف بنجاح', 'success');
      console.log(newEmployee);
      getEmployees();
    } catch (error) {
      console.error(error);
      notify('فشل انشاء حساب الموظف ! حاول مره اخري', 'error');
    }
  };



  const editEmployee = async (e, permissionsList) => {
    e.preventDefault()

    try {

      // const { error } = EmployeeSchema.validate({ fullname, numberID, username, email, address, phone, password, basicSalary, role, isActive });
      // if (error) {
      //     notify(error.details[0].message, 'error');
      //     return;
      // }
      if (permissionsForEmployee.update === true) {
        const updateData = password
          ? { fullname, numberID, username, email, shift, address, phone, password, basicSalary, isActive, role, sectionNumber }
          : { fullname, numberID, username, email, shift, address, phone, basicSalary, isActive, role, sectionNumber };

        const update = await axios.put(`${apiUrl}/api/employee/${employeeid}`, updateData, config);
        if (update.status === 200) {
          getEmployees()
          notify('تم تحديث بيانات الموظف', 'success');
          // Additional logic if needed after successful update
        }
      } else {
        notify('ليس لك صلاحية لتعديل حساب موظف', 'info');
      }

    } catch (error) {
      notify('فشل تحديث بيانات الموظف! حاول مره اخري', 'error');
      console.log(error);
      // Additional error handling
    }
  };

  const handleEditEmployeee = (employee) => {
    setemployeeid(employee._id); setfullname(employee.fullname); setnumberID(employee.numberID);
    setusername(employee.username); setaddress(employee.address); setemail(employee.email);
    setisActive(employee.isActive); setphone(employee.phone); setrole(employee.role);
    setbasicSalary(employee.basicSalary)
  }


  const getEmployeesByJob = (role) => {
    if (role === 'all') {
      getEmployees()
      return
    }
    if (listOfEmployees.length > 0) {
      const filteredEmployees = listOfEmployees.filter(employee => employee.role == role)
      if (filteredEmployees) {
        setListOfEmployees(filteredEmployees)
      } else {
        setListOfEmployees([])
      }
    }
  }
  const getEmployeesByShift = (shift) => {
    if (shift === 'all') {
      getEmployees()
      return
    }
    if (listOfEmployees.length > 0 && shift) {
      const FilterEmployees = listOfEmployees.filter(employee => employee.shift._id == shift)
      if (FilterEmployees) {
        setListOfEmployees(FilterEmployees)
      } else {
        setListOfEmployees([])
      }
    }
  }
  const getEmployeesByName = (name) => {

    if (listOfEmployees.length > 0 && name) {
      const employee = listOfEmployees.filter((employee) => employee.fullname.startsWith(name) == true)
      if (employee) {
        setListOfEmployees(employee)
      } else {
        setListOfEmployees([])
      }
    } else {
      getEmployees();
    }
  }
  const filterEmpByStatus = (status) => {

    if (status === 'true') {
      const filteredEmployees = listOfEmployees.length > 0 ? listOfEmployees.filter((employee) => employee.isActive === true) : '';
      setListOfEmployees(filteredEmployees);

    } else if (status === 'false') {
      const filteredEmployees = listOfEmployees ? listOfEmployees.filter((employee) => employee.isActive === false) : "";
      setListOfEmployees(filteredEmployees);

    } else if (status === 'all') {
      getEmployees()
    }
  };

  const deleteEmployee = async (e, permissionsList) => {
    e.preventDefault();
    try {
      if (permissionsForEmployee.delete === true) {
        const deleted = await axios.delete(`${apiUrl}/api/employee/${employeeid}`, config);
        notify('تم حذف سجل الموظف بنجاح', 'success');
        getEmployees();
      } else {

        notify('ليس لك صلاحية لحذف حساب الموظف', 'info');
      }
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

      for (const Id of selectedIds) {
        await axios.delete(`${apiUrl}/api/order/${Id}`, config);
      }
      getEmployees()
      toast.success('Selected orders deleted successfully');
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete selected orders');
    }
  };



  const exportToExcel = () => {
  if(permissionsForEmployee.read === false){
    toast.error('ليس لك صلاحية لعرض بيانات الموظفين')
    return
  }
    const data = listOfEmployees.map((employee, i) => ({
      'م': i + 1,
      'الاسم': employee.fullname,
      'اسم المستخدم': employee.username,
      'الرقم القومي': employee.numberID,
      'العنوان': employee.address,
      'الموبايل': employee.phone,
      'الوظيفة': employee.role,
      'الراتب': employee.basicSalary,
      'الحالة': employee.isActive ? 'متاح' : 'غير متاح',
      'السكشن': employee.sectionNumber,
      'الشيفت': employee.shift ? employee.shift.shiftType : '',
      'التاريخ': formatDateTime(employee.createdAt),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');

    XLSX.writeFile(wb, 'employees.xlsx');
  };



  const printEmployeeContainer = useRef()
  const handlePrint = useReactToPrint({
    content: () => printEmployeeContainer.current,
    copyStyles: true,
    removeAfterPrint: true,
    bodyClass: 'printpage'
  });

  useEffect(() => {
    getEmployees()
    getShifts()
  }, [])

  return (
    <div className="container-xl mlr-auto">
      <div className="table-responsive" ref={printEmployeeContainer}>
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-6">
                <h2>ادارة <b>الموظفين</b></h2>
              </div>
              <div className="col-6 d-flex justify-content-end print-hide">
                {
                  permissionsList?.filter(permission => permission.resource === 'Employees')[0]?.create === true ? (
                    <a href="#addEmployeeModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة موظف جديد</span></a>
                  )
                    : null
                }
                <a href="#" className="btn w-50 btn-info" data-toggle="modal" onClick={exportToExcel}><i className="material-icons">&#xE15C;</i> <span>تصدير</span></a>
                <a href="#" className="btn w-50 btn-primary" data-toggle="modal" onClick={handlePrint}><i className="material-icons">&#xE15C;</i> <span>طباعه</span></a>
              </div>
            </div>
          </div>
          <div className="table-filter print-hide">
            <div className="row text-dark">
              <div className="col-sm-3">
                <div className="show-entries">
                  <span>عرض</span>
                  <select className="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
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
              <div className="col-sm-9">
                <div className="filter-group">
                  <label>الاسم</label>
                  <input type="text" className="form-control" onChange={(e) => getEmployeesByName(e.target.value)} />
                </div>
                <div className="filter-group">
                  <label>الوظيفة</label>
                  <select className="form-control" onChange={(e) => getEmployeesByJob(e.target.value)} >
                    <option value="all">الكل</option>
                    <option value="manager">مدير</option>
                    <option value="cashier">كاشير</option>
                    <option value="waiter">ويتر</option>
                    <option value="Chef">شيف</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>الشيفت</label>
                  <select className="form-control" onChange={(e) => getEmployeesByShift(e.target.value)} >
                    <option value="all">الكل</option>
                    {shifts ? shifts.map((shift, i) =>
                      <option value={shift._id} key={i}>{shift.shiftType}</option>
                    ) : <option>لم يتم انشاء شفتات</option>}

                  </select>
                </div>
                <div className="filter-group">
                  <label>الحالة</label>
                  <select className="form-control" onChange={(e) => filterEmpByStatus(e.target.value)} >
                    <option value="all">الكل</option>
                    <option value={true}>متاح</option>
                    <option value={false}>غير متاح</option>
                  </select>
                </div>
                {/* <span className="filter-icon"><i className="fa fa-filter"></i></span> */}
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                {/* <th>
                          <span className="custom-checkbox">
                          </span>
                        </th> */}
                <th>م</th>
                <th>الاسم</th>
                <th>رقم قومي</th>
                <th>العنوان</th>
                <th>الموبايل</th>
                <th>اسم المستخدم</th>
                <th>الوظيفه</th>
                <th>الراتب</th>
                <th>الحالة</th>
                <th>السكشن</th>
                <th>الشيفت</th>
                <th>اضيف بواسطه</th>
                <th>تعديل</th>
                <th>التاريخ</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {listOfEmployees.length > 0 ? listOfEmployees.map((employee, i) => {
                // if (i < pagination & i >= pagination - 5) {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>
                      {/* <td>
                                <span className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    id={`checkbox${i}`}
                                    name="options[]"
                                    value={employee._id}
                                    onChange={handleCheckboxChange}
                                  />
                                  <label htmlFor={`checkbox${i}`}></label>
                                </span>
                              </td> */}
                      <td>{i + 1}</td>
                      <td>{employee.fullname}</td>
                      <td>{employee.numberID}</td>
                      <td>{employee.address}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.username}</td>
                      <td>{employee.role}</td>
                      <td>{employee.basicSalary}</td>
                      <td>{employee.isActive ? 'متاح' : "غير متاح"}</td>
                      <td>{employee.sectionNumber}</td>
                      <td>{employee.shift && employee.shift.shiftType}</td>
                      <td>{employee.creaedBy && employee.creaedBy.username}</td>
                      <td>{employee.updatedBy && employee.updatedBy.username}</td>
                      <td>{employee.createdAt && formatDateTime(employee.createdAt)}</td>
                      <td>
                        {permissionsList?.filter(permission => permission.resource === 'Employees')[0]?.update === true ? (
                          <a href="#editEmployeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => { handleEditEmployeee(employee) }}>&#xE254;</i></a>)
                          : permissionsList?.filter(permission => permission.resource === 'Employees')[0]?.delete === true ? (
                            <a href="#deleteEmployeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setemployeeid(employee._id)}>&#xE872;</i></a>)
                            : '--'}
                      </td>
                    </tr>
                  )
                }
              })
                : ""}
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
        {
          permissionsList?.filter(permission => permission.resource === 'Employees')[0]?.create === true ? (
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={(e) => createEmployee(e, permissionsList)}>
                  <div className="modal-header">
                    <h4 className="modal-title">اضافه موظف</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group form-group-47">
                      <label>الاسم</label>
                      <input type="text" className="form-control" required pattern="[A-Za-z\u0600-\u06FF\s]+" onChange={(e) => setfullname(e.target.value)} />
                      <div className="invalid-feedback">ادخل اسما صحيحا.</div>
                    </div>
                    <div className="form-group form-group-47">
                      <label>اسم المستخدم</label>
                      <input type="text" className="form-control" required onChange={(e) => setusername(e.target.value)} />
                    </div>
                    <div className="form-group form-group-47">
                      <label>الموبايل</label>
                      <input type="text" className="form-control" required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                      <div className="invalid-feedback">Please enter a valid phone number (11 digits).</div>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الباسورد</label>
                      <input type="text" className="form-control" required onChange={(e) => setpassword(e.target.value)} />
                    </div>
                    <div className="form-group form-group-47">
                      <label>الرقم القومي</label>
                      <input type="text" className="form-control" required onChange={(e) => setnumberID(e.target.value)} />
                    </div>
                    <div className="form-group form-group-47">
                      <label>الايميل</label>
                      <input type="email" className="form-control" required onChange={(e) => setemail(e.target.value)} />
                      <div className="invalid-feedback">Please enter a valid email address.</div>
                    </div>
                    <div className="form-group form-group-47">
                      <label>العنوان</label>
                      <textarea className="form-control" required onChange={(e) => setaddress(e.target.value)}></textarea>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الحالة</label>
                      <select form="carform" required onChange={(e) => setisActive(e.target.value)}>
                        <option >اختر</option>
                        <option value={true}>متاح</option>
                        <option value={false}>ليس متاح</option>
                      </select>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الشيفت</label>
                      <select form="carform" required onChange={(e) => setshift(e.target.value)}>
                        <option >اختر</option>
                        {shifts ? shifts.map((shift, i) =>
                          <option value={shift._id} key={i}>{shift.shiftType}</option>
                        ) : <option>لم يتم انشاء شفتات</option>}
                      </select>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الوظيفه</label>
                      <select name={role} form="carform" required onChange={(e) => setrole(e.target.value)}>
                        <option>اختار وظيفة</option>
                        <option value="manager">مدير</option>
                        <option value="cashier">كاشير</option>
                        <option value="deliveryman">الديلفري</option>
                        <option value="waiter">ويتر</option>
                        <option value="chef">شيف</option>
                      </select>
                    </div>
                    <div className="form-group form-group-47">
                      <label>المرتب الاساسي</label>
                      <input type="Number" min={0} className="form-control" required onChange={(e) => setbasicSalary(e.target.value)} />
                      <div className="invalid-feedback">Please enter a valid salary.</div>
                    </div>
                    {role == 'waiter' ?
                      <div className="form-group form-group-47">
                        <label>رقم السكشن</label>
                        <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                      </div>
                      : ''}

                  </div>
                  <div className="modal-footer flex-nowrap d-flex flex-row align-items-center justify-content-between">
                    <input type="submit" className="btn w-50 btn-success" value="اضافه" />
                    <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="اغلاق" />
                  </div>
                </form>
              </div>
            </div>) : null}
      </div>

      <div id="editEmployeeModal" className="modal fade">
        {
          permissionsList?.filter(permission => permission.resource === 'Employees')[0]?.update === true ? (
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={(e) => editEmployee(e, permissionsList)}>
                  <div className="modal-header">
                    <h4 className="modal-title">تعديل بيانات الموظفين</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group form-group-47">
                      <label>الاسم</label>
                      <input type="text" className="form-control" defaultValue={fullname} required pattern="[A-Za-z\u0600-\u06FF\s]+" onChange={(e) => setfullname(e.target.value)} />
                      <div className="invalid-feedback">الرجاء إدخال اسم صحيح.</div>
                    </div>
                    <div className="form-group form-group-47">
                      <label>اسم المستخدم</label>
                      <input type="text" className="form-control" defaultValue={username} required onChange={(e) => setusername(e.target.value)} />
                    </div>
                    <div className="form-group form-group-47">
                      <label>الموبايل</label>
                      <input type="text" className="form-control" defaultValue={phone} required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                      <div className="invalid-feedback">الرجاء إدخال رقم هاتف صحيح (11 رقم).</div>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الباسورد</label>
                      <input type="password" className="form-control" onChange={(e) => setpassword(e.target.value)} />
                    </div>
                    <div className="form-group form-group-47">
                      <label>الرقم القومي</label>
                      <input type="text" className="form-control" defaultValue={numberID} required onChange={(e) => setnumberID(e.target.value)} />
                    </div>
                    <div className="form-group form-group-47">
                      <label>الايميل</label>
                      <input type="email" className="form-control" defaultValue={email} required onChange={(e) => setemail(e.target.value)} />
                      <div className="invalid-feedback">الرجاء إدخال عنوان بريد إلكتروني صحيح.</div>
                    </div>
                    <div className="form-group form-group-47">
                      <label>العنوان</label>
                      <textarea className="form-control" defaultValue={address} required onChange={(e) => setaddress(e.target.value)}></textarea>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الحالة</label>
                      <select form="carform" required defaultValue={isActive} onChange={(e) => setisActive(e.target.value)}>
                        <option>{isActive ? 'متاح' : 'ليس متاح'}</option>
                        <option value={true}>متاح</option>
                        <option value={false}>ليس متاح</option>
                      </select>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الشيفت</label>
                      <select form="carform" required onChange={(e) => setshift(e.target.value)}>
                        <option>{shift.shiftType}</option>
                        {shifts ? shifts.map((shift, i) =>
                          <option value={shift._id} key={i}>{shift.shiftType}</option>
                        ) : <option>لم يتم انشاء شفتات</option>}
                      </select>
                    </div>
                    <div className="form-group form-group-47">
                      <label>الوظيفة</label>
                      <select name={role} form="carform" defaultValue={role} required onChange={(e) => setrole(e.target.value)}>
                        <option>{role}</option>
                        <option value="manager">مدير</option>
                        <option value="cashier">كاشير</option>
                        <option value="deliveryman">الديلفري</option>
                        <option value="waiter">ويتر</option>
                        <option value="chef">شيف</option>
                      </select>
                    </div>
                    <div className="form-group form-group-47">
                      <label>المرتب الاساسي</label>
                      <input type="Number" min={0} className="form-control" defaultValue={basicSalary} required onChange={(e) => setbasicSalary(e.target.value)} />
                    </div>
                    {role === 'waiter' && (
                      <div className="form-group form-group-47">
                        <label>رقم السكشن</label>
                        <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                      </div>
                    )}
                  </div>
                  <div className="modal-footer flex-nowrap d-flex flex-row align-items-center justify-content-between">
                    <input type="submit" className="btn w-50 btn-info" value="حفظ" />
                    <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="اغلاق" />
                  </div>
                </form>
              </div>
            </div>
          ) : null}
      </div>

      <div id="deleteEmployeeModal" className="modal fade">
        {
          permissionsList?.filter(permission => permission.resource === 'Employees')[0]?.delete === true ? (
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={(e) => deleteEmployee(e, permissionsList)}>
                  <div className="modal-header">
                    <h4 className="modal-title">حذف موظف</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                  </div>
                  <div className="modal-body">
                    <p>هل انت متاكد من حذف هذا السجل؟?</p>
                    <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                  </div>
                  <div className="modal-footer flex-nowrap d-flex flex-row align-items-center justify-content-between">
                    <input type="submit" className="btn w-50 btn-danger" value="حذف" />
                    <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="اغلاق" />
                  </div>
                </form>
              </div>
            </div>)
            : null}
      </div>
      {/* <div id="deleteListEmployeeModal" className="modal fade">
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
                      <div className="modal-footer flex-nowrap d-flex flex-row align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn w-50 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
    </div>
  )
}

export default Employees