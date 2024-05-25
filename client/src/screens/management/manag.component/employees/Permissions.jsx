import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Joi = require('joi')



const PermissionsComponent = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const notify = (message, type) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // Close after 3 seconds
    });
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


  const [permissionsList, setpermissionsList] = useState([]);

  const getPermissions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/permission`, config);
      if (response.status === 200) {
        const data = response.data;
        setpermissionsList(data);
        console.log({ data });
      } else {
        throw new Error('Failed to fetch permissions: Unexpected status code');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error.message);
    }
  };

  const [permissionsListEn, setpermissionsListEn] = useState(['Employees', 'Attendance', 'Salaries', 'Cash Register', 'Cash Movement', 'Daily Expenses', 'Inventory Item', 'Inventory Categories', 'Inventory Management', 'Orders', 'Tables', 'Table Reservations', 'Restaurant Settings', 'Permissions', 'Delivery Zones', 'Shifts', 'Expenses', 'Expense Log', 'Menu Categories', 'Products', 'Recipes', 'Kitchen Usage', 'Purchases', 'Purchase Returns', 'Supplier Data', 'Supplier Account', 'Supplier Movement', 'Users', 'Messages']);

  const [permissionsListAr, setpermissionsListAr] = useState(['الموظفين', 'تسجيل الحضور', 'المرتبات', 'سجل النقدية', 'حركة النقدية', 'المصروفات اليومية', 'عنصر المخزن', 'تصنيفات المخزن', 'إدارة المخزن', 'الطلبات', 'الطاولة', 'حجز الطاولات', 'اعدادات المطعم', 'الصلاحيات', 'مناطق التوصيل', 'الوردية', 'المصروفات', 'سجل المصروفات', 'تصنيفات المنيو', 'المنتجات', 'الوصفات', 'استهلاك المطبخ', 'المشتريات', 'مرتجع المشتريات', 'بيانات الموردين', 'حساب المورد', 'حركه الموردين', 'المستخدمين', 'الرسائل']);


  const [employeeid, setemployeeid] = useState("")
  const [Permissions, setPermissions] = useState([])

  const handeladdPermissions = (e, i) => {
    const resource = permissionsListEn[i]
    const action = e.target.value
    let updatePermissions = [...Permissions]
    const findPermission = updatePermissions.filter(permission => permission.resource === resource)

    if (findPermission.length > 0) {
      updatePermissions.map((permission, ind) => {
        if (action === 'create') {
          updatePermissions[ind].create = !permission.create
        } else if (action === 'update') {
          updatePermissions[ind].update = !permission.update
        } else if (action === 'read') {
          updatePermissions[ind].read = !permission.read
        } else if (action === 'delete') {
          updatePermissions[ind].delete = !permission.delete
        }

        if  (!permission.create && !permission.update && !permission.read && !permission.delete){
          const update = updatePermissions.filter(per => per.resource !== resource)
          updatePermissions = [...update]

        }
      })

    } else {
      let newPermission = {
        resource:'',
        create: false,
        update: false,
        read: false,
        delete: false}

      newPermission.resource = resource
      console.log({newPermission})
      if (action === 'create') {
        newPermission.create = true
        updatePermissions.push(newPermission);
        console.log({updatePermissions})
      } else if (action === 'update') {
        newPermission.update = true
        updatePermissions.push(newPermission);
        console.log({updatePermissions})
      } else if (action === 'read') {
        newPermission.read = true
        updatePermissions.push(newPermission);
        console.log({updatePermissions})
      } else if (action === 'delete') {
        newPermission.delete = true
        updatePermissions.push(newPermission);
        console.log({updatePermissions})
      }
      // updatePermissions.push(newPermission);
      newPermission = {
        resource:'',
        create: false,
        update: false,
        read: false,
        delete: false}
      console.log({newPermission})
    }
    console.log({updatePermissions})
    setPermissions(updatePermissions)

  }



  const addPermissions = async (createdBy) => {
    try {
      const response = await axios.post(`${apiUrl}/api/permission`, {
        employee: employeeid, Permissions, createdBy
      }, config);
      if (response.status === 200) {
        const data = response.data;
        setpermissionsList(data);
        console.log({ data });
      } else {
        throw new Error('Failed to fetch permissions: Unexpected status code');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error.message);
    }
  };





  const [selectedEmployee, setselectedEmployee] = useState({})

  const getEmployeesByName = (name) => {
    if (name == '') {
      setselectedEmployee(null)
    } else if (listOfEmployees.length > 0) {
      const selectedEmployees = listOfEmployees.filter((employee) => employee.fullname.startsWith(name) == true)
      console.log({ selectedEmployees })
      setselectedEmployee(selectedEmployees[0])
      setemployeeid(selectedEmployee[0]._id)
    }
  }
  const getEmployeesById = (id) => {
    if (id == '') {
      setselectedEmployee(null)
    } else if (listOfEmployees.length > 0) {
      const selectedEmployees = listOfEmployees.filter((employee) => employee._id === id)
      setselectedEmployee(selectedEmployees[0])
      setemployeeid(selectedEmployee[0]._id)

    }
  }





  useEffect(() => {
    getPermissions()
    getEmployees()
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
                    <div className="d-flex flex-column text-dark">
                      <div className='d-flex'>
                        <div className="filter-group" style={{ minWidth: '35%' }}>
                          <label>الاسم</label>
                          <input type="text" className="form-control" style={{ minWidth: '200px' }} onChange={(e) => getEmployeesByName(e.target.value)} />
                          {/* <button type="button" className="btn btn-47 btn-primary"><i className="fa fa-search"></i></button> */}
                        </div>
                        <div className="filter-group" style={{ minWidth: '40%' }}>
                          <label>الموظف</label>
                          <select className="form-control" style={{ minWidth: '200px' }} onChange={(e) => getEmployeesById(e.target.value)} >
                            <option value="">الكل</option>
                            {listOfEmployees && listOfEmployees.map((employee, i) => (
                              <option key={i} value={employee._id}>{employee.fullname}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='d-flex'>
                        <div className="filter-group" style={{ minWidth: '35%' }}>
                          <label>اسم الموظف</label>
                          <input type="text" className="form-control" style={{ minWidth: '200px' }} value={selectedEmployee ? selectedEmployee.fullname : ''} readOnly />
                        </div>

                        <div className="filter-group" style={{ minWidth: '35%' }}>
                          <label>الوظية</label>
                          <input type="text" className="form-control" style={{ minWidth: '200px' }} value={selectedEmployee ? selectedEmployee.role : ''} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                  <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col"></th>
                        <th scope="col" style={{ width: "30%" }}>اسم</th>
                        <th scope="col">إنشاء <i className="fas fa-plus-circle" data-toggle="tooltip" data-placement="top" title="Permission to create"></i></th>
                        <th scope="col">تعديل <i className="fas fa-edit" data-toggle="tooltip" data-placement="top" title="Permission to edit"></i></th>
                        <th scope="col">عرض <i className="fas fa-eye" data-toggle="tooltip" data-placement="top" title="Permission to view"></i></th>
                        <th scope="col">حذف <i className="fas fa-trash-alt" data-toggle="tooltip" data-placement="top" title="Permission to delete"></i></th>
                      </tr>
                    </thead>
                    <tbody>
                      {permissionsListAr.map((permission, i) => {
                        // if (i >= startpagination & i < endpagination) {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{permission}</td>
                            <td className="text-center"><input type="checkbox" value='create' className="form-check-input position-relative" onChange={(e)=>handeladdPermissions(e, i)} /></td>
                            <td className="text-center"><input type="checkbox" value='update' className="form-check-input position-relative" onChange={(e)=>handeladdPermissions(e, i)} /></td>
                            <td className="text-center"><input type="checkbox" value='read' className="form-check-input position-relative" onChange={(e)=>handeladdPermissions(e, i)} /></td>
                            <td className="text-center"><input type="checkbox" value='delete' className="form-check-input position-relative" onChange={(e)=>handeladdPermissions(e, i)} /></td>
                          </tr>)

                        // )}
                      })}
                    </tbody>
                  </table>
                  {/* <div className="clearfix">
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
                  </div> */}
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

export default PermissionsComponent