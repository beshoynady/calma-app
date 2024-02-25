import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useReactToPrint } from 'react-to-print';
import { detacontext } from '../../../../App';
import { ToastContainer, toast } from 'react-toastify';



const ReservationTables = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [reservationNote, setReservationNote] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [tableInfo, setTableInfo] = useState({});
  const [reservationDate, setReservationDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startTimeClicked, setStartTimeClicked] = useState(false);
  const [endTimeClicked, setEndTimeClicked] = useState(false);


  const [listoftable, setlistoftable] = useState([]);

  const getAllTable = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/table');
      const tables = response.data;
      setlistoftable(tables);
    } catch (error) {
      console.log(error);
    }
  };

  const [userId, setUserId] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  const clientByName = (allusers, name) => {
    setCustomerName(name);
    const client = allusers.filter(user => user.username.startsWith(name) == true);
    setFilteredClients(client)
    const userId = client._id
    setUserId(userId)
    console.log(client);
    console.log(name);
    console.log(userId);
  }


  // const [tableFiltered, settableFiltered] = useState([])
  // const searchByNum = (num) => {
  //   const tables = allReservations.filter((table) => reservation.tablenum.toString().startsWith(num) == true)
  //   settableFiltered(tables)
  // }
  // const filterByStatus = (Status) => {
  //   const filter = allReservations.filter(table => reservation.isValid == Status)
  //   settableFiltered(filter)
  // }

  // const [selectedIds, setSelectedIds] = useState([]);
  // const handleCheckboxChange = (e) => {
  //   const Id = e.target.value;
  //   const isChecked = e.target.checked;

  //   if (isChecked) {
  //     setSelectedIds([...selectedIds, Id]);
  //   } else {
  //     const updatedSelectedIds = selectedIds.filter((id) => id !== Id);
  //     setSelectedIds(updatedSelectedIds);
  //   }
  // };

  // const deleteSelectedIds = async (e) => {
  //   e.preventDefault();
  //   console.log(selectedIds)
  //   try {
  //     for (const Id of selectedIds) {
  //       await axios.delete(`${apiUrl}/api/order/${Id}`);
  //     }
  //     getAllTable()
  //     toast.success('Selected orders deleted successfully');
  //     setSelectedIds([]);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error('Failed to delete selected orders');
  //   }
  // };


  useEffect(() => {
    getAllTable()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination, createReservations, updateReservation, getAllReservations, allReservations, getReservationById, deleteReservation, employeeLoginInfo, allusers }) => {

          const createBy = employeeLoginInfo?.employeeinfo?.id;
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>الطاولات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#createreservationModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>انشاء حجز جديد</span></a>
                        <a href="#deleteListTableModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                            <option value={35}>35</option>
                            <option value={40}>40</option>
                            <option value={45}>45</option>
                            <option value={50}>50</option>
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      {/* <div class="col-sm-9">
                        <div class="filter-group">
                          <label>رقم الطاولة</label>
                          <input type="text" class="form-control" onChange={(e) => searchByNum(e.target.value)} />
                        </div>

                        <div className="form-group">
                          <label>الحالة</label>
                          <select name="category" id="category" form="carform" onChange={(e) => filterByStatus(e.target.value)}>
                            <option >اختر</option>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                      </div> */}
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
                        <th>رقم الطاولة</th>
                        <th>الاسم</th>
                        <th>الموبايل</th>
                        <th>عدد الضيوف</th>
                        <th>التاريخ</th>
                        <th>من</th>
                        <th>الي</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        // tableFiltered.length > 0 ? tableFiltered.map((table, i) => {
                        //   if (i >= startpagination & i < endpagination) {
                        //     return (
                        //       <tr key={i}>
                        //         <td>
                        //           <span className="custom-checkbox">
                        //             <input
                        //               type="checkbox"
                        //               id={`checkbox${i}`}
                        //               name="options[]"
                        //               value={reservation._id}
                        //               onChange={handleCheckboxChange}
                        //             />
                        //             <label htmlFor={`checkbox${i}`}></label>
                        //           </span>
                        //         </td>
                        //         <td>{i + 1}</td>
                        //         <td>{reservation.tablenum}</td>
                        //         <td>{reservation.description}</td>
                        //         <td>{reservation.chairs}</td>
                        //         <td>{reservation.sectionNumber}</td>
                        //         <td>{reservation.isValid ? 'متاح' : 'غير متاح'}</td>
                        //         {/* <td>{reservation.reservation ? "Reserved" : "Unreserved"}</td> */}
                        //         <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(reservation._id); settablenum(reservation.tablenum); setqrimage('') }}>
                        //           <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                        //         </a></td>
                        //         <td>
                        //           <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(reservation._id); settablenum(reservation.tablenum); setchairs(reservation.chairs); settabledesc(reservation.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                        //           <a href="#deleteTableModal" className="delete" data-toggle="modal" onClick={() => settableid(reservation._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                        //         </td>
                        //       </tr>
                        //     )
                        //   }
                        // })
                        //   :
                        allReservations.map((reservation, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                <td>
                                  <span className="custom-checkbox">
                                    <input
                                      type="checkbox"
                                      id={`checkbox${i}`}
                                      name="options[]"
                                      value={reservation._id}
                                    // onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={`checkbox${i}`}></label>
                                  </span>
                                </td>
                                <td>{i + 1}</td>
                                <td>{reservation.tablenum}</td>
                                <td>{reservation.customerName}</td>
                                <td>{reservation.customerPhone}</td>
                                <td>{reservation.numberOfGuests}</td>
                                <td>{reservation.reservationDate}</td>
                                <td>{reservation.startTime}</td>
                                <td>{reservation.endTime}</td>

                                {/* <td>{reservation.reservation ? "Reserved" : "Unreserved"}</td> */}
                                <td>
                                  <a href="#editTableModal" className="edit" data-toggle="modal"
                                  ><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                  <a href="#deleteTableModal" className="delete" data-toggle="modal"
                                  >
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
                    <div className="hint-text text-dark">عرض <b>{allReservations.length > endpagination ? endpagination : allReservations.length}</b> من <b>{allReservations.length}</b> عنصر</div>
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
              <div id="createreservationModal" className="modal fade">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <form onSubmit={(e) => createReservations(e, tableInfo.id, tableInfo.tablenum, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createBy)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه حجز طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="container">
                          <div className="mb-1">
                            <label htmlFor="name" className="form-label">الاسم</label>
                            <input type="text" className="form-control" id="name" onChange={(e) => setCustomerName(e.target.value)} />
                          </div>
                          <div className="row mb-1">
                            <div className="col-md-6">
                              <label htmlFor="mobile" className="form-label">رقم الموبايل</label>
                              <input type="tel" className="form-control" id="mobile" onChange={(e) => setCustomerPhone(e.target.value)} />
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="tableNumber" className="form-label">رقم الطاولة</label>
                              <select className="form-control" id="tableNumber" onChange={(e) => setTableInfo({ id: e.target.value, tablenum: e.target.options[e.target.selectedIndex].text })}>
                                <option>اختار رقم الطاوله</option>
                                {listoftable.map((table, i) => (
                                  <option key={i} value={table._id}>{table.tablenum}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-3">
                              <label htmlFor="numberOfGuests" className="form-label">عدد الضيوف</label>
                              <input type="number" className="form-control" id="numberOfGuests" onChange={(e) => setNumberOfGuests(e.target.value)} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6 mb-1">
                              <label htmlFor="date" className="form-label">التاريخ</label>
                              <input
                                type="date"
                                className="form-control"
                                id="date"
                                onChange={(e) => {
                                  const selectedDate = new Date(e.target.value);
                                  setReservationDate(selectedDate);
                                }}
                              />
                            </div>
                            <div className="col-md-3 mb-1">
                              <label htmlFor="arrivalTime" className="form-label">وقت الحضور</label>
                              <input
                                type="time"
                                className="form-control"
                                id="arrivalTime"
                                required
                                onChange={(e) => {
                                  setStartTimeClicked(true);
                                  if (reservationDate) {
                                    const StartedDate = new Date(reservationDate);
                                    const timeParts = e.target.value.split(':');
                                    console.log({ timeParts })
                                    if (StartedDate) {
                                      StartedDate.setHours(parseInt(timeParts[0]));
                                      StartedDate.setMinutes(parseInt(timeParts[1]));
                                      console.log({ StartedDate })
                                      setStartTime(StartedDate);
                                    }
                                  } else {
                                    e.target.value = ''
                                  }
                                }}
                              />
                              {startTimeClicked && !reservationDate && (
                                <div style={{ color: 'red', fontSize: "18px", marginTop: '0.5rem' }}>يرجى تحديد التاريخ أولاً</div>
                              )}
                            </div>
                            <div className="col-md-3 mb-1">
                              <label htmlFor="departureTime" className="form-label">وقت الانصراف</label>
                              <input
                                type="time"
                                className="form-control"
                                id="departureTime"
                                required
                                onChange={(e) => {
                                  setEndTimeClicked(true);
                                  if (reservationDate) {
                                    const EndedDate = new Date(reservationDate);
                                    const timeParts = e.target.value.split(':');
                                    console.log({ timeParts })
                                    if (EndedDate) {
                                      EndedDate.setHours(parseInt(timeParts[0]));
                                      EndedDate.setMinutes(parseInt(timeParts[1]));
                                      console.log({ EndedDate })
                                      setEndTime(EndedDate);
                                    }
                                  } else {
                                    e.target.value = ''
                                  }
                                }}
                              />
                              {endTimeClicked && !reservationDate && (
                                <div style={{ color: 'red', fontSize: "18px", marginTop: '0.5rem' }}>يرجى تحديد التاريخ أولاً</div>
                              )}
                            </div>
                          </div>
                          <div className="mb-1">
                            <label htmlFor="notes" className="form-label">ملاحظات</label>
                            <textarea className="form-control" id="notes" rows="2" onChange={(e) => setReservationNote(e.target.value)}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="ضافه" />
                      </div>
                    </form>
                  </div>
                </div >
              </div >
              {/* {tableid && <div id="editTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editTable}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>رقم السكشن</label>
                          <input type="Number" className="form-control" required onChange={(e) => setsectionNumber(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>رقم الطاولة</label>
                          <input type="Number" defaultValue={allReservations.length > 0 ? listoftable[allReservations.length - 1].tablenum : ""} className="form-control" required onChange={(e) => settablenum(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>عدد المقاعد</label>
                          <input type="Number" defaultValue={allReservations.length > 0 ? allReservations.find((table, i) => reservation._id == tableid).chairs : ''} className="form-control" required onChange={(e) => setchairs(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الوصف</label>
                          <textarea defaultValue={allReservations.length > 0 ? allReservations.find((table, i) => reservation._id == tableid).description : ""} className="form-control" required onChange={(e) => settabledesc(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>متاح</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setisValid(e.target.value)}>
                            <option >اختر</option>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>}
              <div id="deleteTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteTable}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteListTableModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteSelectedIds}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
            </div >
          )
        }
      }
    </detacontext.Consumer >
  )
}

export default ReservationTables