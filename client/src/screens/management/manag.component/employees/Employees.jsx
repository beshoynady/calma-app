import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';
import '../orders/Orders.css'

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
    if (permissionsForEmployee && permissionsForEmployee.read === true) {
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
  const [workingDays, setworkingDays] = useState(0)
  const [basicSalary, setbasicSalary] = useState(0)
  const [shift, setshift] = useState('')
  const [taxRate, settaxRate] = useState('')
  const [insuranceRate, setinsuranceRate] = useState('')
  const [password, setpassword] = useState("")
  const [address, setaddress] = useState("")
  const [phone, setphone] = useState("")
  const [email, setemail] = useState("")
  const [isActive, setisActive] = useState(true)
  const [role, setrole] = useState("")
  const [sectionNumber, setsectionNumber] = useState()

  const createEmployee = async (e) => {
    e.preventDefault();

    // Check if the user has the permission to create an employee

    if (permissionsForEmployee.create === false) {
      notify('ليس لك صلاحية لانشاء حساب موظف', 'info');
      return;
    }

    console.log({
      fullname, basicSalary, taxRate, insuranceRate, workingDays, numberID, username, password, address, shift, phone, email,
      isActive, role, sectionNumber
    })
    // Validate that all required fields are filled
    if (!fullname || !username || !basicSalary || !workingDays || !numberID || !password || !address || !phone
      || !shift || !role
    ) {
      notify('جميع الحقول مطلوبه ! رجاء ملئ جميع الحقول', 'error');
      return;
    }

    try {
      const newEmployee = await axios.post(apiUrl + '/api/employee', {
        fullname, basicSalary, taxRate, insuranceRate, workingDays, numberID, username, password, address, shift, phone, email,
        isActive, role, sectionNumber
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

      // const { error } = EmployeeSchema.validate({ fullname, numberID, username, email, address, phone, password, basicSalary,taxRate, insuranceRate , role, isActive });
      // if (error) {
      //     notify(error.details[0].message, 'error');
      //     return;
      // }
      if (permissionsForEmployee.update === true) {
        const updateData = password
          ? {
            fullname, numberID, username, email, shift, address, phone, password, basicSalary, taxRate, insuranceRate,
            workingDays, isActive, role, sectionNumber
          }
          : {
            fullname, numberID, username, email, shift, address, phone, basicSalary, taxRate, insuranceRate, workingDays,
            isActive, role, sectionNumber
          };

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
  const [employeeShift, setemployeeShift] = useState({})
  const handleEditEmployee = (employee) => {
    setemployeeid(employee._id);
    setfullname(employee.fullname);
    setnumberID(employee.numberID);
    setusername(employee.username);
    setaddress(employee.address);
    setemail(employee.email);
    setisActive(employee.isActive);
    setphone(employee.phone);
    setrole(employee.role);
    setbasicSalary(employee.basicSalary);
    setworkingDays(employee.workingDays);
    setshift(employee.shift._id);
    setemployeeShift(employee.shift);
    settaxRate(employee.taxRate);
    setinsuranceRate(employee.insuranceRate);
    setsectionNumber(employee.sectionNumber);
};



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

  const deleteEmployee = async (e) => {
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
    if (permissionsForEmployee.read === false) {
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
      'ايام العمل': employee.workingDays,
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
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
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
            <div className="d-flex flex-wrap flex-row w-100 text-dark">
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
              <div className="filter-group">
                <label>الاسم</label>
                <input type="text" className="form-control" onChange={(e) => getEmployeesByName(e.target.value)} />
              </div>
              <div className="filter-group">
                <label>الوظيفة</label>
                <select className="form-control" onChange={(e) => getEmployeesByJob(e.target.value)} >
                  <option value="all">الكل</option>
                  <option value="owner">مالك</option>
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
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>م</th>
                <th>الاسم</th>
                <th>رقم قومي</th>
                <th>العنوان</th>
                <th>الموبايل</th>
                <th>البريد الإلكتروني</th>
                <th>اسم المستخدم</th>
                <th>الوظيفة</th>
                <th>أيام العمل</th>
                <th>الراتب</th>
                <th>معدل الضريبة</th>
                <th>معدل التأمين</th>
                <th>الحالة</th>
                <th>السكشن</th>
                <th>الشيفت</th>
                <th>أضيف بواسطة</th>
                <th>تحديث بواسطة</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {listOfEmployees.length > 0 ? listOfEmployees.map((employee, i) => {
                if (i >= startpagination && i < endpagination) {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{employee.fullname}</td>
                      <td>{employee.numberID}</td>
                      <td>{employee.address}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.email}</td>
                      <td>{employee.username}</td>
                      <td>{employee.role}</td>
                      <td>{employee.workingDays}</td>
                      <td>{employee.basicSalary}</td>
                      <td>{employee.taxRate}</td>
                      <td>{employee.insuranceRate}</td>
                      <td>{employee.isActive ? 'متاح' : 'غير متاح'}</td>
                      <td>{employee.sectionNumber}</td>
                      <td>{employee.shift && employee.shift.shiftType}</td>
                      <td>{employee.createdBy && employee.createdBy.username}</td>
                      <td>{employee.updatedBy && employee.updatedBy.username}</td>
                      <td>{employee.createdAt && formatDateTime(employee.createdAt)}</td>
                      <td>
                        {permissionsForEmployee?.update ? (
                          <a href="#editEmployeeModal" className="edit" data-toggle="modal">
                            <i className="material-icons" data-toggle="tooltip" title="Edit" onClick={() => handleEditEmployee(employee)}>&#xE254;</i>
                          </a>
                        ) : permissionsForEmployee?.delete ? (
                          <a href="#deleteEmployeeModal" className="delete" data-toggle="modal">
                            <i className="material-icons" data-toggle="tooltip" title="Delete" onClick={() => setemployeeid(employee._id)}>&#xE872;</i>
                          </a>
                        ) : '--'}
                      </td>
                    </tr>
                  );
                }
                return null;
              }) : ""}
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
        {permissionsForEmployee?.create === true && (
          <div className="modal-dialog">
            <div className="modal-content">
              <form className='text-right' onSubmit={(e) => createEmployee(e)}>
                <div className="modal-header">
                  <h4 className="modal-title">إضافة موظف</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="fullname">الاسم</label>
                    <input type="text" id="fullname" className="form-control" required pattern="[A-Za-z\u0600-\u06FF\s]+" onChange={(e) => setfullname(e.target.value)} />
                    <div className="invalid-feedback">الرجاء إدخال اسم صحيح.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">اسم المستخدم</label>
                    <input type="text" id="username" className="form-control" onChange={(e) => setusername(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">الموبايل</label>
                    <input type="text" id="phone" className="form-control" required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                    <div className="invalid-feedback">الرجاء إدخال رقم هاتف صحيح (11 رقم).</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">الباسورد</label>
                    <input type="text" id="password" className="form-control" required onChange={(e) => setpassword(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numberID">الرقم القومي</label>
                    <input type="text" id="numberID" className="form-control" required onChange={(e) => setnumberID(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">الايميل</label>
                    <input type="email" id="email" className="form-control" required onChange={(e) => setemail(e.target.value)} />
                    <div className="invalid-feedback">الرجاء إدخال عنوان بريد إلكتروني صحيح.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">العنوان</label>
                    <textarea id="address" className="form-control" required onChange={(e) => setaddress(e.target.value)}></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="isActive">الحالة</label>
                    <select id="isActive" className="form-control" required onChange={(e) => setisActive(e.target.value)}>
                      <option value="">اختر</option>
                      <option value={true}>متاح</option>
                      <option value={false}>ليس متاح</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="shift">الشيفت</label>
                    <select id="shift" className="form-control" required onChange={(e) => setshift(e.target.value)}>
                      <option value="">اختر</option>
                      {shifts ? shifts.map((shift, i) =>
                        <option value={shift._id} key={i}>{shift.shiftType}</option>
                      ) : <option>لم يتم إنشاء شفتات</option>}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">الوظيفة</label>
                    <select id="role" className="form-control" required onChange={(e) => setrole(e.target.value)}>
                      <option value="">اختر وظيفة</option>
                      <option value="owner">مالك</option>
                      <option value="manager">مدير</option>
                      <option value="cashier">كاشير</option>
                      <option value="deliveryman">الديلفري</option>
                      <option value="waiter">ويتر</option>
                      <option value="chef">شيف</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="workingDays">ايام العمل الشهرية</label>
                    <input type="number" id="workingDays" className="form-control" min={0} max={31} required onChange={(e) => setworkingDays(Number(e.target.value))} />
                    <div className="invalid-feedback">الرجاء إدخال أيام عمل صحيحة.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="basicSalary">المرتب الأساسي</label>
                    <input type="number" id="basicSalary" className="form-control" min={0} required onChange={(e) => setbasicSalary(Number(e.target.value))} />
                    <div className="invalid-feedback">الرجاء إدخال راتب صحيح.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="taxRate">نسبة الضريبة</label>
                    <input type="number" id="taxRate" className="form-control" min={0} max={100} required onChange={(e) => settaxRate(Number(e.target.value))} />
                    <div className="invalid-feedback">الرجاء إدخال نسبة ضريبة صحيحة.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="insuranceRate">نسبة التأمين</label>
                    <input type="number" id="insuranceRate" className="form-control" min={0} max={100} required onChange={(e) => setinsuranceRate(Number(e.target.value))} />
                    <div className="invalid-feedback">الرجاء إدخال نسبة تأمين صحيحة.</div>
                  </div>
                  {role === 'waiter' && (
                    <div className="form-group">
                      <label htmlFor="sectionNumber">رقم السكشن</label>
                      <input type="number" id="sectionNumber" className="form-control" required onChange={(e) => setsectionNumber(Number(e.target.value))} />
                    </div>
                  )}
                </div>
                <div className="modal-footer flex-nowrap d-flex flex-row align-items-center justify-content-between">
                  <input type="submit" className="btn w-50 btn-success" value="إضافة" />
                  <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>



      <div id="editEmployeeModal" className="modal fade">
        {permissionsForEmployee?.update === true && (
          <div className="modal-dialog">
            <div className="modal-content">
              <form className='text-right' onSubmit={(e) => editEmployee(e, permissionsList)}>
                <div className="modal-header">
                  <h4 className="modal-title">تعديل بيانات الموظف</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="fullname">الاسم</label>
                    <input type="text" id="fullname" className="form-control" defaultValue={fullname} required pattern="[A-Za-z\u0600-\u06FF\s]+" onChange={(e) => setfullname(e.target.value)} />
                    <div className="invalid-feedback">الرجاء إدخال اسم صحيح.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">اسم المستخدم</label>
                    <input type="text" id="username" className="form-control" defaultValue={username} required onChange={(e) => setusername(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">الموبايل</label>
                    <input type="text" id="phone" className="form-control" defaultValue={phone} required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                    <div className="invalid-feedback">الرجاء إدخال رقم هاتف صحيح (11 رقم).</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">الباسورد</label>
                    <input type="password" id="password" className="form-control" onChange={(e) => setpassword(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numberID">الرقم القومي</label>
                    <input type="text" id="numberID" className="form-control" defaultValue={numberID} required onChange={(e) => setnumberID(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">الايميل</label>
                    <input type="email" id="email" className="form-control" defaultValue={email} required onChange={(e) => setemail(e.target.value)} />
                    <div className="invalid-feedback">الرجاء إدخال عنوان بريد إلكتروني صحيح.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">العنوان</label>
                    <textarea id="address" className="form-control" defaultValue={address} required onChange={(e) => setaddress(e.target.value)}></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="isActive">الحالة</label>
                    <select id="isActive" className="form-control" defaultValue={isActive} required onChange={(e) => setisActive(e.target.value)}>
                      <option value={true}>متاح</option>
                      <option value={false}>ليس متاح</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="shift">الشيفت</label>
                    <select id="shift" className="form-control" defaultValue={shift} required onChange={(e) => setshift(e.target.value)}>
                      {shifts ? shifts.map((shift, i) =>
                        <option value={shift._id} key={i}>{shift.shiftType}</option>
                      ) : <option>لم يتم إنشاء شفتات</option>}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">الوظيفة</label>
                    <select id="role" className="form-control" defaultValue={role} required onChange={(e) => setrole(e.target.value)}>
                      <option value="owner">مالك</option>
                      <option value="manager">مدير</option>
                      <option value="cashier">كاشير</option>
                      <option value="deliveryman">الديلفري</option>
                      <option value="waiter">ويتر</option>
                      <option value="chef">شيف</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="workingDays">ايام العمل الشهرية</label>
                    <input type="number" id="workingDays" className="form-control" defaultValue={workingDays} min={0} max={31} required onChange={(e) => setworkingDays(Number(e.target.value))} />
                    <div className="invalid-feedback">الرجاء إدخال أيام عمل صحيحة.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="basicSalary">المرتب الأساسي</label>
                    <input type="number" id="basicSalary" className="form-control" defaultValue={basicSalary} min={0} required onChange={(e) => setbasicSalary(e.target.value)} />
                    <div className="invalid-feedback">الرجاء إدخال راتب صحيح.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="taxRate">نسبة الضريبة</label>
                    <input type="number" id="taxRate" className="form-control" min={0} max={100} required onChange={(e) => settaxRate(Number(e.target.value))} />
                    <div className="invalid-feedback">الرجاء إدخال نسبة ضريبة صحيحة.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="insuranceRate">نسبة التأمين</label>
                    <input type="number" id="insuranceRate" className="form-control" min={0} max={100} required onChange={(e) => setinsuranceRate(Number(e.target.value))} />
                    <div className="invalid-feedback">الرجاء إدخال نسبة تأمين صحيحة.</div>
                  </div>
                  {role === 'waiter' && (
                    <div className="form-group">
                      <label htmlFor="sectionNumber">رقم السكشن</label>
                      <input type="number" id="sectionNumber" className="form-control" defaultValue={sectionNumber} required onChange={(e) => setsectionNumber(Number(e.target.value))} />
                    </div>
                  )}
                </div>
                <div className="modal-footer flex-nowrap d-flex flex-row align-items-center justify-content-between">
                  <input type="submit" className="btn w-50 btn-success" value="تعديل" />
                  <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>


      <div id="deleteEmployeeModal" className="modal fade">
        {permissionsForEmployee?.delete === true && (
          <div className="modal-dialog">
            <div className="modal-content">
              <form className='text-right' onSubmit={(e) => deleteEmployee(e)}>
                <div className="modal-header">
                  <h4 className="modal-title">حذف موظف</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>
                <div className="modal-body">
                  <p>هل أنت متأكد من حذف الموظف <strong>{fullname}</strong>؟</p>
                </div>
                <div className="modal-footer flex-nowrap d-flex flex-row align-items-center justify-content-between">
                  <input type="submit" className="btn w-50 btn-danger" value="حذف" />
                  <input type="button" className="btn w-50 btn-default" data-dismiss="modal" value="إلغاء" />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* <div id="deleteListEmployeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form className='text-right' onSubmit={deleteSelectedIds}>
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