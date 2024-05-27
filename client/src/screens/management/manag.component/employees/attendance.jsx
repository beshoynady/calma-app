import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import { detacontext } from '../../../../App';

const AttendanceManagement = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const formattedDate = (date) => {
    new Date(date).toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }



  const [listOfStatus, setlistOfStatus] = useState(['Attendance', 'Absence', 'Vacation']);

  const [recordId, setRecordId] = useState('');
  const [employee, setEmployee] = useState('');
  const [shift, setShift] = useState({});
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Attendance');
  const [isOvertime, setIsOvertime] = useState(false);
  const [overtimeMinutes, setOvertimeMinutes] = useState(0);
  const [isLate, setIsLate] = useState(false);
  const [lateMinutes, setLateMinutes] = useState(0);
  const [notes, setNotes] = useState('');


  const createAttendanceRecord = async (e) => {
    e.preventDefault();
    let newattendanceData = {
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

    console.log({ newattendanceData })
    try {
      const response = await axios.post(`${apiUrl}/api/attendance`, newattendanceData, config);
      console.log({ response })
      if (response.status === 201) {
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
  const handleEditRecord = (id) => {
    setRecordId(id);
    const getRecord = allAttendanceRecords.filter(record => record._id === id)[0];
    if (getRecord) {
      console.log({ getRecord })
      setrecordToUpdate(getRecord)
      setEmployee(getRecord.employee);
      setCurrentDate(getRecord.currentDate);
      setArrivalDate(getRecord.arrivalDate);
      setDepartureDate(getRecord.departureDate);
      setShift(getRecord.shift);
      setNotes(getRecord.notes);
      setOvertimeMinutes(getRecord.overtimeMinutes);
      setLateMinutes(getRecord.lateMinutes);
    }
  }

  const editAttendanceRecord = async (e) => {
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
    try {
      const response = await axios.get(`${apiUrl}/api/employee`, config);
      const data = response.data;
      setListOfEmployees(data);
      // console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };


  const handleSelectEmployee = (e) => {
    const employeeid = e.target.value
    // console.log({ employeeid })
    const employee = listOfEmployees.filter(employee => employee._id === employeeid)[0]
    // console.log({ employee: employee.shift })
    if (employee) {
      setEmployee(employeeid)
      if (employee.shift) {
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

  useEffect(() => {
    getEmployees()
    getallAttendanceRecords()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ allProducts, calcTotalSalesOfCategory, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>التصنيفات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addRecordModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه تصنيف</span></a>
                        <a href="#deleteRecordModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                        <button type="button" class="btn btn-47 btn-primary"><i class="fa fa-search"></i></button>
                        <div class="filter-group">
                          <label>اسم التصنيف</label>
                          {/* <input type="text" class="form-control" onChange={(e) => searchByCategory(e.target.value)} /> */}
                        </div>
                        {/* <div class="filter-group">
                          <label>Location</label>
                          <select class="form-control">
                            <option>All</option>
                            <option>Berlin</option>
                            <option>London</option>
                            <option>Madrid</option>
                            <option>New York</option>
                            <option>Paris</option>
                          </select>
                        </div>
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
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAttendanceRecords && allAttendanceRecords.map((Record, i) => {
                        if (i >= startpagination & i < endpagination) {
                          return (
                            <tr key={i}>
                              <td>
                                <span className="custom-checkbox">
                                  <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                  <label htmlFor="checkbox1"></label>
                                </span>
                              </td>
                              <td>{i + 1}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{Record.currentDate.split('T')[0]}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{Record.employee && Record.employee.fullname}</td>
                              <td>{Record.shift && Record.shift.shiftType}</td>
                              <td>{Record.status}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{Record.arrivalDate.split('T')[0]}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{new Date(Record.arrivalDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{Record.departureDate.split('T')[0]}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{new Date(Record.departureDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{Record.lateMinutes}</td>
                              <td className="text-nowrap overflow-hidden text-truncate">{Record.overtimeMinutes}</td>
                              <td>{Record.createdBy && Record.createdBy.fullname}</td>
                              <td>{Record.updatedBy && Record.updatedBy.fullname}</td>
                              <td>{Record.notes}</td>
                              <td>
                                <a href="#editRecordModal" className="edit" data-toggle="modal" onClick={() => handleEditRecord(Record._id)}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                <a href="#deleteRecordModal" className="delete" data-toggle="modal" onClick={() => setRecordId(Record._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
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
              <div id="addRecordModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createAttendanceRecord}>
                      <div className="modal-header">
                        <h4 className="modal-title">تسجيل سجل حضور الموظف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>تاريخ الحالي</label>
                          <input
                            type="date"
                            className="form-control"
                            readOnly={true}
                            name="currentDate"
                            value={currentDate}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الاسم</label>
                          <select
                            className="form-control"
                            required
                            name="status"
                            onChange={handleSelectEmployee}
                            style={{ width: "100%" }}
                          >
                            <option>اختر الموظف</option>
                            {listOfEmployees.map((employee, index) => (
                              <option key={index} value={employee._id}>{employee.fullname}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الشيفت</label>
                          <input
                            type="text"
                            className="form-control"
                            readOnly={true}
                            name="shift"
                            value={shift?.shiftType}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>تاريخ الوصول</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="arrivalDate"
                            defaultValue={new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            onChange={handleArrivealDate}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>تاريخ الانصراف</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="departureDate"
                            defaultValue={new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            onChange={handleDepartureDate}
                            style={{ width: "100%" }}
                          />
                        </div>

                        <div className="form-group form-group-47">
                          <label>الحالة</label>
                          <select
                            className="form-control"
                            required
                            name="status"
                            defaultValue={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ width: "100%" }}
                          >
                            {listOfStatus.map((statusOption, index) => (
                              <option key={index} value={statusOption}>{statusOption}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>دقائق التجاوز</label>
                          <input
                            type="text"
                            className="form-control"
                            name="overtimeMinutes"
                            readOnly
                            Value={overtimeMinutes}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>دقائق التأخر</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lateMinutes"
                            readOnly
                            Value={lateMinutes}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>ملاحظات</label>
                          <textarea
                            className="form-control"
                            name="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{ width: "100%" }}
                          ></textarea>
                        </div>
                        {/* Add more input fields for other form elements as needed */}
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>



              <div id="editRecordModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editAttendanceRecord}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل سجل</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>تاريخ الحالي</label>
                          <input
                            type="date"
                            className="form-control"
                            readOnly={true}
                            name="currentDate"
                            defaultValue={currentDate}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الاسم</label>
                          <input type='text' className="form-control" readOnly defaultValue={recordToUpdate && recordToUpdate.employee.fullname} />

                        </div>
                        <div className="form-group form-group-47">
                          <label>الشيفت</label>
                          <input
                            type="text"
                            className="form-control"
                            readOnly={true}
                            name="shift"
                            value={shift?.shiftType}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>تاريخ الوصول</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="arrivalDate"
                            defaultValue={arrivalDate ? new Date(arrivalDate).toISOString().slice(0, 16) : ''}
                            onChange={handleArrivealDate}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>تاريخ الانصراف</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="departureDate"
                            defaultValue={departureDate ? new Date(departureDate).toISOString().slice(0, 16) : ''}
                            onChange={handleDepartureDate}
                            style={{ width: "100%" }}
                          />
                        </div>


                        <div className="form-group form-group-47">
                          <label>الحالة</label>
                          <select
                            className="form-control"
                            required
                            name="status"
                            defaultValue={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ width: "100%" }}
                          >
                            {listOfStatus.map((statusOption, index) => (
                              <option key={index} value={statusOption}>{statusOption}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>دقائق التجاوز</label>
                          <input
                            type="text"
                            className="form-control"
                            name="overtimeMinutes"
                            readOnly
                            value={overtimeMinutes}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>دقائق التأخر</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lateMinutes"
                            readOnly
                            value={lateMinutes}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group form-group-47">
                          <label>ملاحظات</label>
                          <textarea
                            className="form-control"
                            name="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{ width: "100%" }}
                          ></textarea>
                        </div>
                        {/* Add more input fields for other form elements as needed */}
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteRecordModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteRecord}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا التصنيف?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
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

export default AttendanceManagement