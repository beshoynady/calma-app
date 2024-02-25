import React, { useState } from 'react';
import { detacontext } from '../../../../App';
import { ToastContainer } from 'react-toastify';

const Reservation = () => {
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

  return (
    <detacontext.Consumer>
      {({ allTable, createReservations, updateReservation, getAllReservations, allReservations, getReservationById, deleteReservation, userLoginInfo }) => {
        const userId = userLoginInfo?.userinfo?.id;
        return (
          <div id='reservation' className='d-flex align-items-center flex-column justify-content-start' style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
            <div className='section-title'>
              <h2>حجز طاولة</h2>
            </div>
            <div className="container-lg p-2" style={{
              width: '70%',
              maxWidth: '70%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              paddingBottom: '50px',
            }}>
              <form className="w-100 text-white" style={{ fontSize: '20px', fontWeight: '800' }}
                onSubmit={(e) => createReservations(e, tableInfo.id,tableInfo.tablenum, userId, numberOfGuests, customerName, customerPhone, reservationDate, startTime, endTime, reservationNote)}>
                <div className="mb-1">
                  <label htmlFor="name" className="form-label">الاسم</label>
                  <input type="text" className="form-control" id="name" onChange={(e) => setCustomerName(e.target.value)} />
                </div>
                <div className="row mb-1">
                  <div className="col-md-">
                    <label htmlFor="mobile" className="form-label">رقم الموبايل</label>
                    <input type="tel" className="form-control" id="mobile" onChange={(e) => setCustomerPhone(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="tableNumber" className="form-label">رقم الطاولة</label>
                    <select className="form-control" id="tableNumber" onChange={(e) => setTableInfo({ id: e.target.value, tablenum: e.target.options[e.target.selectedIndex].text })}>
                      <option>اختار رقم الطاوله</option>
                      {allTable.map((table, i) => (
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
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px' }}>تأكيد الحجز</button>
              </form>
            </div>
          </div>
        )
      }}
    </detacontext.Consumer>
  );
}

export default Reservation;
