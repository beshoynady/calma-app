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
    console.log({ Permissions })
    const resource = permissionsListEn[i]
    const action = e.target.value
    let updatePermissions = [...Permissions]
    const findPermission = updatePermissions.filter(permission => permission.resource === resource)

    if (findPermission.length > 0) {
      updatePermissions.map((permission, ind) => {
        if (permission.resource === resource) {
          console.log({ permission })
          if (action === 'create') {
            updatePermissions[ind].create = !permission.create
          } else if (action === 'update') {
            updatePermissions[ind].update = !permission.update
          } else if (action === 'read') {
            updatePermissions[ind].read = !permission.read
          } else if (action === 'delete') {
            updatePermissions[ind].delete = !permission.delete
          }

          if (!permission.create && !permission.update && !permission.read && !permission.delete) {
            const update = updatePermissions.filter(per => per.resource !== resource)
            updatePermissions = [...update]
          }
        }

      })

    } else {
      let newPermission = {
        resource: resource,
        create: false,
        update: false,
        read: false,
        delete: false
      };
      newPermission[action] = true;
      updatePermissions.push(newPermission);
      // let newPermission = {
      //   resource:'',
      //   create: false,
      //   update: false,
      //   read: false,
      //   delete: false}

      // newPermission.resource = resource
      // console.log({newPermission})
      // if (action === 'create') {
      //   newPermission.create = true
      //   updatePermissions.push(newPermission);
      //   console.log({updatePermissions})
      // } else if (action === 'update') {
      //   newPermission.update = true
      //   updatePermissions.push(newPermission);
      //   console.log({updatePermissions})
      // } else if (action === 'read') {
      //   newPermission.read = true
      //   updatePermissions.push(newPermission);
      //   console.log({updatePermissions})
      // } else if (action === 'delete') {
      //   newPermission.delete = true
      //   updatePermissions.push(newPermission);
      //   console.log({updatePermissions})
      // }
      // updatePermissions.push(newPermission);
      newPermission = {
        resource: resource,
        create: false,
        update: false,
        read: false,
        delete: false
      }
      console.log({ newPermission })
    }
    console.log({ updatePermissions })
    setPermissions([...updatePermissions])

  }


  const addPermissions = async (e) => {
    e.preventDefault();
    console.log({employeeid, Permissions})
    try {
      let response;

      if (!permissionEmployee) {
        response = await axios.post(`${apiUrl}/api/permission`, {
          employee: employeeid,
          Permissions,
        }, config);

        if (response.status === 201) {
          const data = response.data;
          setPermissions(data);
          toast.success('تم إنشاء الصلاحيات بنجاح!');
        } else {
          toast.error('فشل في إنشاء الصلاحيات: كود حالة غير متوقع');
        }

      } else {
        const id = permissionEmployee._id;
        response = await axios.put(`${apiUrl}/api/permission/${id}`, {
          Permissions,
        }, config);

        if (response.status === 200) {
          const data = response.data;
          setPermissions(data);
          toast.success('تم تحديث الصلاحيات بنجاح!');
        } else {
          toast.error('فشل في تحديث الصلاحيات: كود حالة غير متوقع');
        }
      }

    } catch (error) {
      console.error('Error fetching permissions:', error.message);
      toast.error('حدث خطأ أثناء تحديث الصلاحيات');
    }
  };





  const [selectedEmployee, setselectedEmployee] = useState({})
  const [permissionEmployee, setpermissionEmployee] = useState({})

  const getEmployeesByName = (name) => {
    if (!name) {
      setselectedEmployee(null);
    } else if (listOfEmployees.length > 0) {
      const selectedEmployees = listOfEmployees.filter((employee) =>
        employee.fullname.toLowerCase().startsWith(name.toLowerCase())
      );

      if (selectedEmployees.length > 0) {
        const selectedEmployee = selectedEmployees[0];
        setselectedEmployee(selectedEmployee);
        setemployeeid(selectedEmployee._id);

        const permissionEmployee = permissionsList ?
          permissionsList.find(permission => permission.employee === selectedEmployee._id) :
          null;

        setpermissionEmployee(permissionEmployee);
        console.log({ permissionEmployee });
        console.log({ selectedEmployees });
      } else {
        setselectedEmployee(null);
      }
    }
  };


  const getEmployeesById = (id) => {
    if (!id) {
      setselectedEmployee(null);
    } else if (listOfEmployees.length > 0) {
      const selectedEmployee = listOfEmployees.find((employee) => employee._id === id);

      if (selectedEmployee) {
        setselectedEmployee(selectedEmployee);
        setemployeeid(selectedEmployee._id);

        const permissionEmployee = permissionsList ? permissionsList.find(permission => permission.employee === selectedEmployee._id) : null;
        setpermissionEmployee(permissionEmployee);
        console.log({ permissionEmployee });
        console.log({ selectedEmployee });

      }
    }
  };






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
                        <a className="btn btn-47 btn-success" onClick={addPermissions}><i className="material-icons">&#xE147;</i> <span>حفظ</span></a>
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
                        const resourceMatch = permissionEmployee && permissionEmployee.resource === permissionsListEn[i];

                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{permission}</td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="create"
                                className="form-check-input position-relative"
                                checked={resourceMatch && permissionEmployee.create}
                                onChange={(e) => handeladdPermissions(e, i)}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="update"
                                className="form-check-input position-relative"
                                checked={resourceMatch && permissionEmployee.update}
                                onChange={(e) => handeladdPermissions(e, i)}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="read"
                                className="form-check-input position-relative"
                                checked={resourceMatch && permissionEmployee.read}
                                onChange={(e) => handeladdPermissions(e, i)}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="delete"
                                className="form-check-input position-relative"
                                checked={resourceMatch && permissionEmployee.delete}
                                onChange={(e) => handeladdPermissions(e, i)}
                              />
                            </td>
                          </tr>
                        );
                      })}

                    </tbody>
                  </table>
                  
                </div>
              </div>
            
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default PermissionsComponent