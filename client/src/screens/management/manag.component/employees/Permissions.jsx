import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'



const PermissionsComponent = () => {
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


  const [permissionsList, setpermissionsList] = useState([]);

  const getPermissions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/permission`, config);

      if (response.status === 200) {
        const data = response.data;
        setpermissionsList(data);
        console.log({ data });
      } else {
        throw new Error(`فشل في جلب الصلاحيات: رمز حالة غير متوقع ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error(`خطأ في جلب الصلاحيات: ${error.message || 'حدث خطأ غير متوقع'}`);
    }
  };



  const [permissionsListEn, setpermissionsListEn] = useState(['Employees', 'Attendance', 'Salaries', 'Payroll', 'Cash Register', 'Cash Movement', 'stock Item', 'stock Categories', 'stock Management', 'Orders', 'Tables', 'Table Reservations', 'Restaurant Settings', 'Permissions', 'Delivery Zones', 'Shifts', 'Expenses', 'Daily Expenses', 'Menu Categories', 'Products', 'Recipes', 'Kitchen Usage', 'Purchases', 'Purchase Returns', 'Supplier Data', 'Supplier Account', 'Supplier Movement', 'Users', 'Messages']);

  const [permissionsListAr, setpermissionsListAr] = useState(['الموظفين', 'تسجيل الحضور', 'المرتبات', 'دفع المرتبات', 'سجل النقدية', 'حركة النقدية', 'عنصر المخزن', 'تصنيفات المخزن', 'إدارة المخزن', 'الطلبات', 'الطاولة', 'حجز الطاولات', 'اعدادات المطعم', 'الصلاحيات', 'مناطق التوصيل', 'الوردية', 'المصروفات', 'سجل المصروفات', 'تصنيفات المنيو', 'المنتجات', 'الوصفات', 'استهلاك المطبخ', 'المشتريات', 'مرتجع المشتريات', 'بيانات الموردين', 'حساب المورد', 'حركه الموردين', 'المستخدمين', 'الرسائل']);


  const [employeeid, setemployeeid] = useState("")
  const [Permissions, setPermissions] = useState([])


  const handeladdPermissions = (e, i) => {
    // console.log({ permissionEmployee })
    // console.log({ Permissions })
    const resource = permissionsListEn[i]
    const action = e.target.value
    let updatePermissions = [...Permissions]
    const findPermission = updatePermissions.filter(permission => permission.resource === resource)

    if (findPermission.length > 0) {
      updatePermissions.map((permission, ind) => {
        if (permission.resource === resource) {
          console.log({ permission })
          if (action === 'create') {
            permission.create = !permission.create;
            if (permission.create === true) {
              permission.read = true
            }
          } else if (action === 'update') {
            permission.update = !permission.update;
            if (permission.update === true) {
              permission.read = true
            }
          } else if (action === 'read') {
            permission.read = !permission.read
          } else if (action === 'delete') {
            permission.delete = !permission.delete;
            if (permission.delete === true) {
              permission.read = true
            }
          }
          // console.log({ permission })

          if (!permission.create && !permission.update && !permission.read && !permission.delete) {
            const update = updatePermissions.filter(per => per.resource !== resource)
            updatePermissions = [...update]
          }
          // console.log({ permission })
        }

      })

    } else {
      let newPermission = {
        resource: resource,
        create: false,
        update: false,
        read: true,
        delete: false
      };
      newPermission[action] = true;
      updatePermissions.push(newPermission);

      newPermission = {
        resource: resource,
        create: false,
        update: false,
        read: false,
        delete: false
      }
      // console.log({ newPermission })
    }
    // console.log({ updatePermissions })
    setPermissions([...updatePermissions])
  }


  const addPermissions = async (e) => {
    e.preventDefault();
    // console.log({ permissionEmployee });
  
    try {
      if (!employeeid || !Permissions || Permissions.length === 0) {
        toast.error('اختار الموظف و الصلاحيات بشكل صحيح! اعد تحميل الصفحة ثم اعد المحاوله مره اخري.');
        return;
      }
  
      let response;
  
      if (!permissionEmployee || !permissionEmployee._id) {
        response = await axios.post(`${apiUrl}/api/permission`, {
          employee: employeeid,
          Permissions,
        }, config);
        toast.success('تم انشاء الصلاحيات بنجاح');
      } else {
        const id = permissionEmployee._id;
        if (!id) {
          toast.error('فشل في الوصول الي صلاحيات الموظف لتعديلها ! اعد تحميل الصفحة و حاول مره اخري.');
          return;
        }
  
        response = await axios.put(`${apiUrl}/api/permission/${id}`, {
          Permissions,
        }, config);
        if(response){
          toast.success('تم تعديل او اضافه الصلاحيات بنجاح');
        }else{
          toast.error('فشل تعديل صلاحيات الموظف ! اعد تحميل الصفحة و حاول مره اخري.');

        }
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('حدث خطأ اثناء اضافه الصلاحيات.');
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
          permissionsList.filter(permission => permission.employee?._id === selectedEmployee._id)[0] :
          null;
        
        if (permissionEmployee) {
          setpermissionEmployee(permissionEmployee);
          setPermissions(permissionEmployee.Permissions)
          // console.log({ permissionEmployee });
          // console.log({ selectedEmployee });
        } else {
          setpermissionEmployee([]);
          setPermissions([])
          toast.info('هذا الموظف ليس له اي صلاحيات')
        }
      } else {
        setselectedEmployee(null);
      }
    }
  };


  const getEmployeesById = (id) => {
    try {
      if (!id) {
        setselectedEmployee(null);
        setemployeeid('');
        setpermissionEmployee({});
        setPermissions([]);
        return;
      }

      if (!Array.isArray(listOfEmployees) || listOfEmployees.length === 0) {
        console.error("listOfEmployees is empty or not an array");
        return;
      }

      const selectedEmployee = listOfEmployees.find((employee) => employee._id === id);

      if (!selectedEmployee) {
        setselectedEmployee(null);
        setemployeeid('');
        setpermissionEmployee({});
        setPermissions([]);
        toast.error('لم يتم العثور على الموظف');
        return;
      }

      setselectedEmployee(selectedEmployee);
      setemployeeid(selectedEmployee._id);
      const permissionEmployee = permissionsList
        ? permissionsList.find(permission => permission.employee?._id === selectedEmployee._id)
        : null;

      if (permissionEmployee) {
        setpermissionEmployee(permissionEmployee);
        setPermissions(permissionEmployee.Permissions);
      } else {
        setpermissionEmployee({});
        setPermissions([]);
        toast.info('هذا الموظف ليس له أي صلاحيات');
      }

      console.log({ selectedEmployee, permissionEmployee });

    } catch (error) {
      console.error("An error occurred in getEmployeesById:", error);
      toast.error('حدث خطأ غير متوقع');
    }
  };





  useEffect(() => {
    getPermissions()
    getEmployees()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ restaurantData, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="containewPermissionEmployee-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>صلاحيات الموظفين</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a className="btn w-50 btn-success" onClick={addPermissions}><i className="material-icons">&#xE147;</i> <span>حفظ</span></a>
                        <a className="btn w-50 btn-danger" onClick={getPermissions}><i className="material-icons">&#xE15C;</i> <span>الغاء</span></a>
                      </div>
                    </div>
                  </div>
                  <div className="table-filter print-hide">
                    <div className="d-flex flex-column text-dark">
                      <div className='d-flex'>
                        <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2" style={{ minWidth: '35%' }}>
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                          <input type="text" className="form-control col-8" style={{ minWidth: '200px' }} onChange={(e) => getEmployeesByName(e.target.value)} />
                          {/* <button type="button" className="btn w-50 btn-primary"><i className="fa fa-search"></i></button> */}
                        </div>
                        <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2" style={{ minWidth: '40%' }}>
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الموظف</label>
                          <select className="form-select col-8" style={{ minWidth: '200px' }} onChange={(e) => getEmployeesById(e.target.value)} >
                            <option value="">الكل</option>
                            {listOfEmployees && listOfEmployees.map((employee, i) => (
                              <option key={i} value={employee._id}>{employee.fullname}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className='d-flex'>
                        <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2" style={{ minWidth: '35%' }}>
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">اسم الموظف</label>
                          <input type="text" className="form-control col-8" style={{ minWidth: '200px' }} value={selectedEmployee ? selectedEmployee.fullname : ''} readOnly />
                        </div>

                        <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2" style={{ minWidth: '35%' }}>
                          <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الوظية</label>
                          <input type="text" className="form-control col-8" style={{ minWidth: '200px' }} value={selectedEmployee ? selectedEmployee.role : ''} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
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
                        // console.log({permissionEmployee})
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{permission}</td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="create"
                                className="form-check-input position-relative"
                                checked={Array.isArray(Permissions) ? Permissions.filter(per => per.resource === permissionsListEn[i])[0]?.create : false}
                                onChange={(e) => handeladdPermissions(e, i)}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="update"
                                className="form-check-input position-relative"
                                checked={Array.isArray(Permissions) ? Permissions.filter(per => per.resource === permissionsListEn[i])[0]?.update : false}
                                onChange={(e) => handeladdPermissions(e, i)}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="read"
                                className="form-check-input position-relative"
                                checked={Array.isArray(Permissions) ? Permissions.filter(per => per.resource === permissionsListEn[i])[0]?.read : false}
                                onChange={(e) => handeladdPermissions(e, i)}
                              />
                            </td>
                            <td className="text-center">
                              <input
                                type="checkbox"
                                value="delete"
                                className="form-check-input position-relative"
                                checked={Array.isArray(Permissions) ? Permissions.filter(per => per.resource === permissionsListEn[i])[0]?.delete : false}
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