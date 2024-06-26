import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import '../orders/Orders.css'
import { detacontext } from '../../../../App';




const AttendanceManagement = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const {setStartDate, setEndDate, filterByDateRange, filterByTime, restaurantData, formatDateTime, permissionsList, setisLoadiog, formatDate, formatTime,
    EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext);

  const permissionsForAttendance = permissionsList?.filter(permission => permission.resource === 'Attendance')[0]

  const permissionsForEmployee = permissionsList?.filter(permission => permission.resource === 'Employees')[0]


  const listOfStatus = ['Attendance', 'Absence', 'Vacation'];
  const listOfStatusAR = ['حضور', 'غياب', 'اجازة'];

  const [recordId, setRecordId] = useState('');
  const [employee, setEmployee] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [shift, setShift] = useState({});
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeMinutes, setOvertimeMinutes] = useState(0);
  const [isLate, setIsLate] = useState(false);
  const [lateMinutes, setLateMinutes] = useState(0);
  const [notes, setNotes] = useState('');




  const recordArrival = async (e) => {
    e.preventDefault();
    if (permissionsForAttendance.create === false) {
      toast.info('ليس لك صلاحية لانشاء سجل');
      return;
    }
    if (!employee || !shift || !currentDate || !status) {
      toast.error('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    try {
      let newattendanceData = {
        employee,
        shift: shift._id,
        currentDate,
        status,
        notes,
      };

      if (status === 'Attendance') {
        if (!arrivalDate) {
          toast.error('يرجى تحديد وقت الحضور .');
          return;
        }
        newattendanceData.arrivalDate = arrivalDate;
        newattendanceData.isLate = isLate;
        newattendanceData.lateMinutes = lateMinutes;
      }

      console.log({ newattendanceData });

      const createRecord = await axios.post(`${apiUrl}/api/attendance`, newattendanceData, config);
      console.log({ createRecord });

      if (createRecord.status === 201) {
        if (status === 'Attendance') {
          const activeemployee = await axios.put(`${apiUrl}/api/employee/${employee}`, { isActive: true }, config);
          console.log({ activeemployee });
        }

        getallAttendanceRecords();
        toast.success('تم انشاء السجل بنجاح:');
      } else {
        toast.error('فشل عمليه انشاء السجل! حاول مره أخرى.');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء انشاء السجل! حاول مره أخرى:');
      console.error('Error recording arrival:', error);
    }
  };





  const recordDeparture = async (e) => {
    e.preventDefault();

    if (permissionsForAttendance.update === false) {
      toast.info('ليس لك صلاحية لتسجيل انصراف')
      return
    }
    try {
      let newattendanceData = {
        departureDate,
        isOvertime,
        overtimeMinutes,
        notes
      }
      console.log({ newattendanceData })
      const response = await axios.put(`${apiUrl}/api/attendance/${recordId}`, newattendanceData, config);
      if (response.status === 200) {
        const update = await axios.put(`${apiUrl}/api/employee/${employee}`, { isActive: false }, config);
        getallAttendanceRecords()
        // attendance created successfully
        toast.success('تم انشاء السجل بنجاح:');
        // Add any further logic here, such as updating UI or state
      } else {
        toast.error('فشل عمليه انشاء السجل!حاول مره اخري');
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء انشاء السجل !حاول مره اخري:');
      // Handle error, display message, etc.
    }
  };



  const [allAttendanceRecords, setallAttendanceRecords] = useState([])
  const getallAttendanceRecords = async () => {
    if (permissionsForAttendance && permissionsForAttendance.read === false) {
      toast.info('ليس لك صلاحية لعرض السجلات')
      return
    }
    try {
      const response = await axios.get(`${apiUrl}/api/attendance`, config);
      console.log({ response })
      if (response.status === 200) {
        setallAttendanceRecords(response.data)
      }
    } catch (error) {
      toast.error('حدث خطاء اثناء جلب سجل الحضور و الانصراف ! اعد تحميل الصفحة')
    }
  }



  const [recordToUpdate, setrecordToUpdate] = useState({})
  const handleEditRecord = (record) => {
    if (permissionsForAttendance.update === false) {
      toast.info('ليس لك صلاحية لتعديل السجلات')
      return
    }
    if (record) {
      console.log({ record })
      setrecordToUpdate(record)
      setRecordId(record._id);
      setEmployee(record.employee._id);
      setEmployeeName(record.employee.username);
      setCurrentDate(record.currentDate);
      setArrivalDate(record.arrivalDate);
      setDepartureDate(record.departureDate);
      setShift(record.shift);
      setOvertimeMinutes(record.overtimeMinutes);
      setLateMinutes(record.lateMinutes);
      setNotes(record.notes);
    }
  }

  const editAttendanceRecord = async (e) => {
    if (permissionsForAttendance.update === false) {
      toast.info('ليس لك صلاحية لتعديل السجلات')
      return
    }
    e.preventDefault();
    let editattendanceData = {
      employee,
      shift: shift._id,
      arrivalDate,
      departureDate,
      currentDate,
      status,
      isOvertime,
      overtimeMinutes,
      isLate,
      lateMinutes,
      notes
    }
    console.log({ editattendanceData })
    try {
      const response = await axios.put(`${apiUrl}/api/attendance/${recordId}`, editattendanceData, config);
      console.log({ response })
      if (response.status === 200) {
        getallAttendanceRecords()
        // attendance created successfully
        toast.success('تم تعديل السجل بنجاح:');
        // Add any further logic here, such as updating UI or state
      } else {
        toast.error('فشل عمليه تعديل السجل!حاول مره اخري');
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء تعديل السجل !حاول مره اخري:');
      // Handle error, display message, etc.
    }
  };

  const deleteRecord = async (e) => {
    if (permissionsForAttendance.delete === false) {
      toast.info('ليس لك صلاحية لحذف السجلات')
      return
    }
    e.preventDefault()
    try {
      const response = await axios.delete(`${apiUrl}/api/attendance/${recordId}`, config)
      if (response.status === 200) {
        getallAttendanceRecords()
        toast.success('تم حذف السجل بنجاح')
      } else {
        toast.error('فشل حذف السجل ! حاول مره اخري')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء حذف السجل')
    }
  }

  const [listOfEmployees, setListOfEmployees] = useState([]);

  const getEmployees = async () => {
    if (permissionsForEmployee && permissionsForEmployee.read === false) {
      toast.error('ليس لك صلاحية لعرض الموظفين ')
      return
    }
    try {
      const response = await axios.get(`${apiUrl}/api/employee`, config);
      const data = response.data;
      setListOfEmployees(data);
      // console.log({ data });
    } catch (error) {
      console.log(error);
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

  const handleSelectEmployee = (e) => {
    const employeeid = e.target.value
    // console.log({ employeeid })
    const employee = listOfEmployees.filter(employee => employee._id === employeeid)[0]
    // console.log({ employee: employee.shift })
    if (employee) {
      setEmployee(employeeid)
      if (employee && employee.shift) {
        setShift(employee.shift)
      } else {
        toast.warn('لم يتم تحديد له شيفت ! حدد للموظف شيف اولا')
      }
    } else {
      setEmployee('')
      setShift({})

    }
  }

  const handleArrivealDate = (e) => {
    const arrivalDateTime = new Date(e.target.value);
    console.log({ arrivalDateTime })
    setArrivalDate(arrivalDateTime);
    const arrivalTimeInMinutes = arrivalDateTime.getHours() * 60 + arrivalDateTime.getMinutes();
    console.log({ arrivalTimeInMinutes })

    const shiftStartTime = new Date();


    const shiftStartTimeArray = shift.startTime.split(":");
    console.log({ shiftStartTimeArray })
    shiftStartTime.setHours(shiftStartTimeArray[0]);
    shiftStartTime.setMinutes(shiftStartTimeArray[1]);
    console.log({ shiftStartTime })

    const shiftStartTimeInMinutes = new Date(shiftStartTime).getHours() * 60 + new Date(shiftStartTime).getMinutes();
    console.log({ shiftStartTimeInMinutes })

    // تحويل فرق الساعات إلى دقائق وجمعها مع فرق الدقائق
    const calculateLateMinutes = (arrivalTimeInMinutes - shiftStartTimeInMinutes);

    console.log({ calculateLateMinutes })
    setLateMinutes(calculateLateMinutes);
    if (calculateLateMinutes !== 0) {
      setIsLate(true)
    }
  }

  const handleDepartureDate = (e) => {
    const departureDateTime = new Date(e.target.value);
    setDepartureDate(departureDateTime);

    const departureTime = departureDateTime.getHours() * 60 + departureDateTime.getMinutes();

    const shiftEndTime = new Date();


    const shiftEndTimeArray = shift.endTime.split(":");

    shiftEndTime.setHours(shiftEndTimeArray[0]);
    shiftEndTime.setMinutes(shiftEndTimeArray[1]);

    console.log({ shiftEndTimeArray })

    const shiftEndTimeInMinutes = new Date(shiftEndTime).getHours() * 60 + new Date(shiftEndTime).getMinutes();

    const calculateExtraMinutes = departureTime - shiftEndTimeInMinutes;
    setOvertimeMinutes(calculateExtraMinutes);
    if (calculateExtraMinutes !== 0) {
      setIsOvertime(true)
    }
  }


  const searchByStatus = (status) => {
    if (status) {
      const filter = allAttendanceRecords.filter(record => record.status === status)
      if (filter.length > 0) {
        setallAttendanceRecords(filter)
      } else {
        setallAttendanceRecords([])
      }
    } else {
      getallAttendanceRecords()
    }
  }

  const getEmployeesByJob = (role) => {
    if (role === 'all') {
      getallAttendanceRecords()
      return
    }
    if (allAttendanceRecords.length > 0) {
      const filteredRecords = allAttendanceRecords.filter(record => record.employee.role == role)
      if (filteredRecords) {
        setallAttendanceRecords(filteredRecords)
      } else {
        getallAttendanceRecords([])
      }
    }
  }

  const getRecordsByShift = (shift) => {
    if (shift === 'all') {
      getallAttendanceRecords()
      return
    }
    if (allAttendanceRecords.length > 0 && shift) {
      const FilterEmployees = allAttendanceRecords.filter(record => record.shift._id == shift)
      if (FilterEmployees) {
        setallAttendanceRecords(FilterEmployees)
      } else {
        getallAttendanceRecords([])
      }
    }
  }

  const getEmployeesByName = (name) => {

    if (allAttendanceRecords.length > 0 && name) {
      const employee = allAttendanceRecords.filter((record) => record.employee && record.employee.fullname.startsWith(name) == true || record.employee.username.startsWith(name) == true)
      if (employee) {
        setallAttendanceRecords(employee)
      } else {
        setallAttendanceRecords([])
      }
    } else {
      getallAttendanceRecords();
    }
  }


  useEffect(() => {
    getEmployees()
    getShifts()
    getallAttendanceRecords()
  }, [])


  return (
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6 text-right">
                <h2>ادارة <b>تسجيل الحضور و الانصراف و الاجازات و الغياب</b></h2>
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <a href="#arrivalModal" className="btn w-50 btn-success" data-toggle="modal">
                  <i className="material-icons">&#xE147;</i> <span>اضافه تسجيل</span></a>
                {/* <a href="#deleteRecordModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
              </div>
            </div>
          </div>
          <div className="table-filter w-100">
            <div className="w-100 d-flex flex-row flex-wrap align-items-center justify-content-start text-dark">
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <div className="show-entries">
                  <span>عرض</span>
                  <select className="form-select col-8" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
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
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">نوع السجل</label>
                <select className="form-select col-8" onChange={(e) => searchByStatus(e.target.value)}>
                  <option value="">الكل</option>
                  {listOfStatus.map((statu, i) => (
                    <option key={i} value={statu}>{listOfStatusAR[i]}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                <input type="text" className="form-control col-8" onChange={(e) => getEmployeesByName(e.target.value)} />
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الوظيفة</label>
                <select className="form-select col-8" onChange={(e) => getEmployeesByJob(e.target.value)} >
                  <option value="all">الكل</option>
                  <option value="manager">مدير</option>
                  <option value="cashier">كاشير</option>
                  <option value="waiter">ويتر</option>
                  <option value="Chef">شيف</option>
                </select>
              </div>
              <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الشيفت</label>
                <select className="form-select col-8" onChange={(e) => getRecordsByShift(e.target.value)} >
                  <option value="all">الكل</option>
                  {shifts ? shifts.map((shift, i) =>
                    <option value={shift._id} key={i}>{shift.shiftType}</option>
                  ) : <option>لم يتم انشاء شفتات</option>}

                </select>
              </div>
              <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-select col-8" onChange={(e) => setallAttendanceRecords(filterByTime(e.target.value, allAttendanceRecords))}>
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
                    <input type="date" className="form-control col-8" onChange={(e) => setStartDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap mr-1">
                    <label className="form-label">إلى</label>
                    <input type="date" className="form-control col-8" onChange={(e) => setEndDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap justify-content-between w-25">
                    <button type="button" className="btn btn-primary w-50" onClick={()=>setallAttendanceRecords(filterByDateRange(allAttendanceRecords))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning w-50" onClick={getallAttendanceRecords}>
                      استعادة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>م</th>
                <th>اليوم</th>
                <th>الاسم</th>
                <th>الشيفت</th>
                <th>الحالة</th>
                <th>اليوم</th>
                <th>وقت الحضور</th>
                <th>اليوم</th>
                <th>وقت الانصراف</th>
                <th>تاخير</th>
                <th>اضافي</th>
                <th>تسجيل</th>
                <th>تعديل</th>
                <th>ملاحظات</th>
                <th>انصراف</th>
                <th>اجراءات</th>
              </tr>
            </thead>
            <tbody>
              {allAttendanceRecords && allAttendanceRecords.map((Record, i) => {
                if (i >= startpagination & i < endpagination) {
                  return (
                    <tr key={i}>

                      <td>{i + 1}</td>
                      <td className="text-nowrap text-truncate">{Record.currentDate && formatDateTime(Record.currentDate)}</td>
                      <td className="text-nowrap text-truncate">{Record.employee && Record.employee.fullname}</td>
                      <td className="text-nowrap text-truncate">{Record.shift && Record.shift.shiftType}</td>
                      <td className="text-nowrap text-truncate">{Record.status && Record.status === 'Attendance' ? 'حضور'
                        : Record.status === 'Absence' ? 'غياب'
                          : Record.status === 'Vacation' ? 'اجازة' : ''}
                      </td>
                      <td className="text-nowrap text-truncate">{Record.arrivalDate ? formatDate(Record.arrivalDate) : '-'}</td>
                      <td className="text-nowrap text-truncate">{Record.arrivalDate ? formatTime(Record.arrivalDate) : "-"}</td>
                      <td className="text-nowrap text-truncate">{Record.departureDate ? formatDate(Record.departureDate) : '-'}</td>
                      <td className="text-nowrap text-truncate">{Record.departureDate ? formatTime(Record.departureDate) : '-'}</td>
                      <td className="text-nowrap text-truncate">{Record.lateMinutes ? Record.lateMinutes : 0}</td>
                      <td className="text-nowrap text-truncate">{Record.overtimeMinutes ? Record.overtimeMinutes : 0}</td>
                      <td className="text-nowrap text-truncate">{Record.createdBy && Record.createdBy.username}</td>
                      <td className="text-nowrap text-truncate">{Record.updatedBy && Record.updatedBy.username}</td>
                      <td className="text-nowrap text-truncate">{Record.notes}</td>
                      <td>
                        {Record.arrivalDate && !Record.departureDate ? (
                          <a href="#departureModal" className="edit btn btn-info" data-toggle="modal" onClick={() => handleEditRecord(Record)}>
                            انصراف
                          </a>
                        ) : ''}

                      </td>
                      <td className='d-flex flex-nowrap'>
                        <a href="#editRecordModal" className="edit" data-toggle="modal" onClick={() => handleEditRecord(Record)}>
                          <i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                        <a href="#deleteRecordModal" className="delete" data-toggle="modal" onClick={() => setRecordId(Record._id)}>
                          <i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                      </td>
                    </tr>
                  )
                }
              })
              }

            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text text-dark">عرض <b>{allAttendanceRecords.length > endpagination ? endpagination : allAttendanceRecords.length}</b> من <b>{allAttendanceRecords.length}</b> عنصر</div>
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




      <div id="arrivalModal" className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded ">
            <form onSubmit={recordArrival}>
              <div className="modal-header bg-primary text-white">
                <h4 className="modal-title">تسجيل سجل حضور الموظف</h4>
                <button type="button" className="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
                <div className="row">
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تاريخ الحالي</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      readOnly
                      name="currentDate"
                      defaultValue={formatDate(currentDate)}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                    <select
                      className="form-control border-primary"
                      required
                      name="employee"
                      onChange={handleSelectEmployee}
                    >
                      <option>اختر الموظف</option>
                      {listOfEmployees.map((employee, index) => (
                        <option key={index} value={employee._id}>{employee.fullname}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الشيفت</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      readOnly
                      name="shift"
                      value={shift?.shiftType || ''}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تاريخ الوصول</label>
                    <input
                      type="datetime-local"
                      className="form-control border-primary"
                      name="arrivalDate"
                      defaultValue={formatDate(new Date())}
                      onChange={handleArrivealDate}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">نوع السجل</label>
                    <select
                      className="form-control border-primary"
                      required
                      name="status"
                      defaultValue={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option>اختر</option>
                      {listOfStatus.map((status, i) => (
                        <option key={i} value={status}>{listOfStatusAR[i]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">دقائق التأخر</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      name="lateMinutes"
                      readOnly
                      value={lateMinutes || ''}
                    />
                  </div>
                  <div className="form-group col-12">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">ملاحظات</label>
                    <textarea
                      className="form-control border-primary"
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer w-100 d-flex flex-nowrap">
                <input type="submit" className="btn w-50 btn-success" value="اضافه" />
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="departureModal" className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded">
            <form onSubmit={recordDeparture}>
              <div className="modal-header bg-primary text-white">
                <h4 className="modal-title">تسجيل انصراف الموظف</h4>
                <button type="button" className="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
                <div className="row">
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      readOnly
                      name="employee"
                      value={employeeName || ''}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الشيفت</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      readOnly
                      name="shift"
                      value={shift?.shiftType || ''}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تاريخ الانصراف</label>
                    <input
                      type="datetime-local"
                      className="form-control border-primary"
                      name="departureDate"
                      defaultValue={formatDate(new Date())}
                      onChange={handleDepartureDate}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">دقائق التجاوز</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      name="overtimeMinutes"
                      readOnly
                      value={overtimeMinutes || ''}
                    />
                  </div>
                  <div className="form-group col-12">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">ملاحظات</label>
                    <textarea
                      className="form-control border-primary"
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer w-100 d-flex flex-nowrap">
                <input type="submit" className="btn w-50 btn-success" value="اضافه" />
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="editRecordModal" className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content shadow-lg border-0 rounded">
            <form onSubmit={editAttendanceRecord}>
              <div className="modal-header bg-primary text-white">
                <h4 className="modal-title">تعديل سجل</h4>
                <button type="button" className="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
                <div className="row">
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تاريخ الحالي</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      readOnly
                      name="currentDate"
                      defaultValue={formatDate(currentDate)}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الاسم</label>
                    <input type="text" className="form-control border-primary" readOnly defaultValue={recordToUpdate?.employee?.fullname || ''} />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الشيفت</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      readOnly
                      name="shift"
                      value={shift?.shiftType || ''}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تاريخ الوصول</label>
                    <input
                      type="datetime-local"
                      className="form-control border-primary"
                      name="arrivalDate"
                      defaultValue={arrivalDate ? new Date(arrivalDate).toISOString().slice(0, 16) : ''}
                      onChange={handleArrivealDate}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">تاريخ الانصراف</label>
                    <input
                      type="datetime-local"
                      className="form-control border-primary"
                      name="departureDate"
                      defaultValue={departureDate ? new Date(departureDate).toISOString().slice(0, 16) : ''}
                      onChange={handleDepartureDate}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الحالة</label>
                    <select
                      className="form-control border-primary"
                      required
                      name="status"
                      defaultValue={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option>اختر</option>
                      {listOfStatus.map((status, i) => (
                        <option key={i} value={status}>{listOfStatusAR[i]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">دقائق التجاوز</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      name="overtimeMinutes"
                      readOnly
                      value={overtimeMinutes || ''}
                    />
                  </div>
                  <div className="form-group col-12 col-md-6">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">دقائق التأخر</label>
                    <input
                      type="text"
                      className="form-control border-primary"
                      name="lateMinutes"
                      readOnly
                      value={lateMinutes || ''}
                    />
                  </div>
                  <div className="form-group col-12">
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">ملاحظات</label>
                    <textarea
                      className="form-control border-primary"
                      name="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer w-100 d-flex flex-nowrap">
                <input type="submit" className="btn w-50 btn-success" value="حفظ" />
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="deleteRecordModal" className="modal fade" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content shadow-lg border-0 rounded">
            <form onSubmit={deleteRecord}>
              <div className="modal-header bg-danger text-white">
                <h4 className="modal-title">حذف تصنيف</h4>
                <button type="button" className="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body p-4 text-right">
                <p>هل انت متاكد من حذف هذا التصنيف?</p>
                <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
              </div>
              <div className="modal-footer w-100 d-flex flex-nowrap">
                <input type="submit" className="btn w-50 btn-warning" value="حذف" />
                <input type="button" className="btn w-50 btn-secondary" data-dismiss="modal" value="إغلاق" />
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )


}

export default AttendanceManagement