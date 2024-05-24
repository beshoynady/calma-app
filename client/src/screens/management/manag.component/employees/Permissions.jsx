import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Joi = require('joi')



const Permissions = () => {
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
      if (response.status === 200) {
        const data = response.data;
        setListOfEmployees(data);
        console.log({ data });
      } else {
        throw new Error('Failed to fetch employees: Unexpected status code');
      }
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  const [permissionsList, setpermissionsList] = useState(['الموظفين', 'تسجيل الحضور', 'المرتبات', 'سجل النقدية', 'حركة النقدية', 'المصروفات اليومية', 'عنصر المخزن', 'تصنيفات المخزن', 'إدارة المخزن', 'الطلبات', 'الطاولة', 'حجز الطاولات', 'اعدادات المطعم', 'الصلاحيات', 'مناطق التوصيل', 'الوردية', 'المصروفات', 'سجل المصروفات', 'تصنيفات المنيو', 'المنتجات', 'الوصفات', 'المشتريات', 'مرتجع المشتريات', 'بيانات الموردين', 'حساب المورد', 'حركه الموردين', 'المستخدمين', 'الرسائل', 'استهلاك المطبخ']);
  const [shifts, setshifts] = useState([]);

  const getShifts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/shift`, config);
      const data = response.data;
      setshifts(data);
      console.log({ Shifts: data });
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




  const [filterEmp, setfilterEmp] = useState([])
  const getEmployeesByJob = (role) => {
    if (listOfEmployees.length > 0) {
      const FilterEmployees = listOfEmployees.filter(employee => employee.role == role)
      setfilterEmp(FilterEmployees)
    }
  }
  const getEmployeesByShift = (shift) => {
    if (listOfEmployees.length > 0) {
      const FilterEmployees = listOfEmployees.filter(employee => employee.shift._id == shift)
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
      filteredEmployees = listOfEmployees.length > 0 ? listOfEmployees.filter((employee) => employee.isActive === true) : '';
    } else if (status === 'false') {
      filteredEmployees = listOfEmployees ? listOfEmployees.filter((employee) => employee.isActive === false) : "";
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

      const deleted = await axios.delete(`${apiUrl}/api/employee/${employeeid}`, config);
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





  useEffect(() => {
    getEmployees()
    getShifts()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>صلاحيات الموظفين</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addEmployeeModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>حفظ</span></a>
                        <a href="#deleteListEmployeeModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>الغاء</span></a>
                      </div>
                    </div>
                  </div>
                  <div className="table-filter">
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
                          <button type="button" className="btn btn-47 btn-primary"><i className="fa fa-search"></i></button>
                        </div>
                        <div className="filter-group">
                          <label>الوظيفة</label>
                          <select className="form-control" onChange={(e) => getEmployeesByJob(e.target.value)} >
                            <option>الكل</option>
                            <option value="manager">مدير</option>
                            <option value="casher">كاشير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                          </select>
                        </div>
                        <div className="filter-group">
                          <label>الشيفت</label>
                          <select className="form-control" onChange={(e) => getEmployeesByShift(e.target.value)} >
                            <option >اختر</option>
                            {shifts ? shifts.map((shift, i) =>
                              <option value={shift._id} key={i}>{shift.shiftType}</option>
                            ) : <option>لم يتم انشاء شفتات</option>}

                          </select>
                        </div>
                        <div className="filter-group">
                          <label>الحالة</label>
                          <select className="form-control" onChange={(e) => filterEmpByStatus(e.target.value)} >
                            <option >الكل</option>
                            <option value={true}>متاح</option>
                            <option value={false}>غير متاح</option>
                          </select>
                        </div>
                        {/* <span className="filter-icon"><i className="fa fa-filter"></i></span> */}
                      </div>
                    </div>
                  </div>
                  <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col"><i className="fas fa-plus-circle" data-toggle="tooltip" data-placement="top" title="Permission to create"></i></th>
                        <th scope="col" style={{ width: "30%" }}>اسم</th>
                        <th scope="col">إنشاء <i className="fas fa-plus-circle" data-toggle="tooltip" data-placement="top" title="Permission to create"></i></th>
                        <th scope="col">تعديل <i className="fas fa-edit" data-toggle="tooltip" data-placement="top" title="Permission to edit"></i></th>
                        <th scope="col">عرض <i className="fas fa-eye" data-toggle="tooltip" data-placement="top" title="Permission to view"></i></th>
                        <th scope="col">حذف <i className="fas fa-trash-alt" data-toggle="tooltip" data-placement="top" title="Permission to delete"></i></th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionsList.map((permission, i) => {
                        // if (i >= startpagination & i < endpagination) {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{permission}</td>
                            <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                            <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                            <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                            <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                          </tr>)

                        // )}
                      })}
                      {/* <tr>
                        <td>Warehouse Inventory</td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                      </tr>
                      <tr>
                        <td>Customers</td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                      </tr>
                      <tr>
                        <td>Orders</td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                      </tr>
                      <tr>
                        <td>Orders Being Shipped</td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                      </tr>
                      <tr>
                        <td>Distribution Tracking</td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                      </tr>
                      <tr>
                        <td>Supplier Ordering</td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                        <td className="text-center"><input type="checkbox" className="form-check-input position-relative" /></td>
                      </tr> */}
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
              {/* <div id="addEmployeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createEmployee}>
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
                            ):<option>لم يتم انشاء شفتات</option>}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
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
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-47 btn-success"  value="اضافه" />
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
                            <option>اختر</option>
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
                            ):<option>لم يتم انشاء شفتات</option>}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
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
                        <div className="form-group form-group-47">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" defaultValue={basicSalary} required onChange={(e) => setbasicSalary(e.target.value)} />
                        </div>
                      </div>
                      {role == 'waiter' ?
                        <div className="form-group form-group-47">
                          <label>رقم السكشن</label>
                          <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                        </div>
                        : ''}
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-47 btn-info" value="حفظ" />
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
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-47 btn-danger" value="حذف" />
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
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
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

export default Permissions