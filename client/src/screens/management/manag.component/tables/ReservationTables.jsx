import React, { useState, useEffect, useRef } from 'react'
import { detacontext } from '../../../../App';



const ReservationTables = () => {

  const [reservationId, setReservationId] = useState('');
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
  //   const tables = allReservations.filter((table) => reservation.tableNumber.toString().startsWith(num) == true)
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

  const translateStatus = (status) => {
    switch (status) {
      case 'confirmed':
        return 'تم التأكيد';
      case 'awaiting confirmation':
        return 'في انتظار التأكيد';
      case 'canceled':
        return 'تم الإلغاء';
      case 'Missed reservation time':
        return 'تم التخلف عن الميعاد';
      default:
        return status;
    }
  };



  return (
    <detacontext.Consumer>
      {
        ({ setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination, createReservations, confirmReservation, updateReservation, getAllReservations, allReservations, getReservationById, deleteReservation, employeeLoginInfo, allusers, allTable, getAvailableTables, availableTableIds,
          formatDate, formatTime }) => {

          const createdBy = employeeLoginInfo?.employeeinfo?.id;
          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>حجز الطاولات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#createreservationModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>انشاء حجز جديد</span></a>
                        <a href="#deleteListTableModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter print-hide">
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

                        <div className="form-group form-group-47">
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
                        <th>م</th>
                        <th>رقم الطاولة</th>
                        <th>الاسم</th>
                        <th>الموبايل</th>
                        <th>عدد الضيوف</th>
                        <th>التاريخ</th>
                        <th>من</th>
                        <th>الي</th>
                        <th>تاكيد</th>
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
                        //         <td>{reservation.tableNumber}</td>
                        //         <td>{reservation.description}</td>
                        //         <td>{reservation.chairs}</td>
                        //         <td>{reservation.sectionNumber}</td>
                        //         <td>{reservation.isValid ? 'متاح' : 'غير متاح'}</td>
                        //         {/* <td>{reservation.reservation ? "Reserved" : "Unreserved"}</td> */}
                        //         <td><a href="#qrTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(reservation._id); settableNumber(reservation.tableNumber); setqrimage('') }}>
                        //           <span className="material-symbols-outlined" data-toggle="tooltip" title="QR">qr_code_2_add</span>
                        //         </a></td>
                        //         <td>
                        //           <a href="#editTableModal" className="edit" data-toggle="modal" onClick={() => { settableid(reservation._id); settableNumber(reservation.tableNumber); setchairs(reservation.chairs); settabledesc(reservation.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

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
                                <td>{i + 1}</td>
                                <td>{reservation.tableNumber}</td>
                                <td>{reservation.customerName}</td>
                                <td>{reservation.customerPhone}</td>
                                <td>{reservation.numberOfGuests}</td>
                                <td>{formatDate(reservation.reservationDate)}</td>
                                <td>{formatTime(reservation.startTime)}</td>
                                <td>{formatTime(reservation.endTime)}</td>
                                <td>
                                  <select name="status" id="status" onChange={(e) => confirmReservation(reservation._id, e.target.value)}>
                                    <option >{translateStatus(reservation.status)}</option>
                                    <option value='confirmed'>تاكيد</option>
                                    <option value='awaiting confirmation'>انتظار التاكيد</option>
                                    <option value='canceled'>الغاء</option>
                                    <option value='Missed reservation time'>تخلف عن الميعاد</option>
                                  </select>
                                </td>
                                <td>
                                  <a href="#updatereservationModal" className="edit" data-toggle="modal" onClick={(e) => { setReservationId(reservation._id); setCustomerName(reservation.customerName); setCustomerPhone(reservation.customerPhone); setNumberOfGuests(reservation.numberOfGuests); setEndTime(reservation.endTime); setStartTime(reservation.startTime); setReservationDate(reservation.reservationDate); setReservationNote(reservation.reservationNotes); setTableInfo({ id: reservation.tableId, tableNumber: reservation.tableNumber }) }}
                                  ><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
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
                    <form onSubmit={(e) => createReservations(e, tableInfo.id, tableInfo.tableNumber, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createdBy)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه حجز طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="container">
                          <div className="row">
                            <div className="col-md-8 mb-1">
                              <label htmlFor="name" className="form-label">الاسم</label>
                              <input type="text" className="form-control" id="name" onChange={(e) => clientByName(allusers, e.target.value)} />
                              <ul>
                                {filteredClients && filteredClients.map((client, index) => (
                                  <li key={index}>{client.username}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="col-md-4 mb-1">
                              <label htmlFor="mobile" className="form-label">رقم الموبايل</label>
                              <input type="tel" className="form-control" id="mobile" onChange={(e) => setCustomerPhone(e.target.value)} />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-1">
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
                            <div className="col-md-4 mb-1">
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
                            <div className="col-md-4 mb-1">
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
                                      getAvailableTables(reservationDate, startTime, EndedDate)
                                    }
                                  } else {
                                    e.target.value = ''
                                  };

                                }}
                              />
                              {endTimeClicked && !reservationDate && (
                                <div style={{ color: 'red', fontSize: "18px", marginTop: '0.5rem' }}>يرجى تحديد التاريخ أولاً</div>
                              )}
                            </div>
                          </div>
                          <div className="row mb-1">
                            <div className="col-md-7">
                              <label htmlFor="tableNumber" className="form-label">رقم الطاولة</label>
                              <select className="form-control" id="tableNumber" onChange={(e) => setTableInfo({ id: e.target.value, tableNumber: e.target.options[e.target.selectedIndex].text })}>
                                <option>الطاولات المتاحة في هذا الوقت</option>
                                {allTable.map((table, i) => (
                                  availableTableIds.includes(table._id) && (
                                    <option key={i} value={table._id}>{table.tableNumber}</option>
                                  )
                                ))}
                              </select>
                            </div>

                            <div className="col-md-5">
                              <label htmlFor="numberOfGuests" className="form-label">عدد الضيوف</label>
                              <input type="number" className="form-control" id="numberOfGuests" onChange={(e) => setNumberOfGuests(e.target.value)} />
                            </div>
                          </div>
                          <div className="mb-1">
                            <label htmlFor="notes" className="form-label">ملاحظات</label>
                            <textarea className="form-control" id="notes" rows="2" onChange={(e) => setReservationNote(e.target.value)}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="submit" className="btn btn-47 btn-success" value="ضافه" />
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                      </div>
                    </form>
                  </div>
                </div >
              </div >


              <div id="updatereservationModal" className="modal fade">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateReservation(e, reservationId, tableInfo.id, tableInfo.tableNumber, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote, createdBy)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه حجز طاولة</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="container">
                          <div className='row'>
                            <div className="col-md-7 mb-1">
                            <label htmlFor="name" className="form-label">الاسم</label>
                              <input type="text" className="form-control" id="name" onChange={(e) => clientByName(allusers, e.target.value)} />
                              <ul>
                                {filteredClients && filteredClients.map((client, index) => (
                                  <li key={index}>{client.username}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="col-md-5 mb-1">
                              <label htmlFor="mobile" className="form-label">رقم الموبايل</label>
                              <input type="tel" className="form-control" id="mobile" defaultValue={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                            </div>
                          </div>

                          <div className="row mb-1">
                            <div className="col-md-4 mb-1">
                              <label htmlFor="date" className="form-label">التاريخ</label>
                              <input
                                type="date"
                                className="form-control"
                                id="date"
                                defaultValue={reservationDate ? new Date(reservationDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                  const selectedDate = new Date(e.target.value);
                                  setReservationDate(selectedDate);
                                }}
                              />
                            </div>
                            <div className="col-md-4 mb-1">
                              <label className="form-label">وقت الحضور</label>
                              <input
                                type="time"
                                className="form-control"
                                required
                                defaultValue={startTime ? new Date(startTime).toISOString().split('T')[1].slice(0, 5) : ''}
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
                            <div className="col-md-4 mb-1">
                              <label htmlFor="departureTime" className="form-label">وقت الانصراف</label>
                              <input
                                type="time"
                                className="form-control"
                                id="departureTime"
                                required
                                defaultValue={endTime ? new Date(endTime).toISOString().split('T')[1].slice(0, 5) : ''}
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
                                      getAvailableTables(reservationDate, startTime, EndedDate)
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

                          <div className="row mb-1">
                            <div className="col-md-7">
                              <label htmlFor="tableNumber" className="form-label">رقم الطاولة</label>
                              <select className="form-control" id="tableNumber" defaultValue={tableInfo.tableNumber} onChange={(e) => setTableInfo({ id: e.target.value, tableNumber: e.target.options[e.target.selectedIndex].text })}>
                                <option>{tableInfo.tableNumber}</option>
                                <option>الطاولات المتاحة في هذا الوقت</option>
                                {allTable.map((table, i) => (
                                  availableTableIds.includes(table._id) && (
                                    <option key={i} value={table._id}>{table.tableNumber}</option>
                                  )
                                ))}

                              </select>
                            </div>
                            <div className="col-md-5">
                              <label htmlFor="numberOfGuests" className="form-label">عدد الضيوف</label>
                              <input type="number" className="form-control" id="numberOfGuests" defaultValue={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} />
                            </div>
                          </div>
                          <div className="mb-1">
                            <label htmlFor="notes" className="form-label">ملاحظات</label>
                            <textarea className="form-control" id="notes" rows="2" defaultValue={reservationNote} onChange={(e) => setReservationNote(e.target.value)}></textarea>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="submit" className="btn btn-47 btn-success" value="ضافه" />
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                      </div>
                    </form>
                  </div>
                </div >
              </div >
            </div >
          )
        }
      }
    </detacontext.Consumer >
  )
}

export default ReservationTables