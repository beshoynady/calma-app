import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';


const CustomerMessage = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messageId, setmessageId] = useState('');
  const [allCustomerMessage, setallCustomerMessage] = useState([])

  const getAllCustomerMessage = async () => {
    try {
      const token = localStorage.getItem('token_e');

      const response = await axios.get(`${apiUrl}/api/message`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
      setallCustomerMessage(response.data)
    } catch (error) {
      console.log(error)
    }
  };
  const deleteCustomerMessage = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token_e');

      const response = await axios.delete(`${apiUrl}/api/message/${messageId}` , {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if(response){
      toast.success('تم حذف الرسالة بنجاح')
    }
    getAllCustomerMessage()
    } catch (error) {
      console.log(error)
    }
  };


  const [filtermessage, setfiltermessage] = useState([])
  const getCustomerMessageByPhone = async (phone) => {
    const message = allCustomerMessage.filter(message => message.phone.startsWith(phone));
    setfiltermessage(message)
  }


  useEffect(() => {
    getAllCustomerMessage()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>رسائل العملاء</b></h2>
                      </div>
                      {/* <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addmessageModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة موظف جديد</span></a>
                        <a href="#deletemessageModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
                      </div> */}
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
                          <span>عنصر</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>الموبايل</label>
                          <input type="text" class="form-control" onChange={(e) => getCustomerMessageByPhone(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        {/*
                        <div class="filter-group">
                          <label>الحالة</label>
                          <select class="form-control" onChange={(e) => filtermessageByStatus(e.target.value)} >
                            <option >الكل</option>
                            <option value={true}>متاح</option>
                            <option value={false}>غير متاح</option>
                          </select>
                        </div> */}
                        {/* <span class="filter-icon"><i class="fa fa-filter"></i></span> */}
                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        {/* <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th> */}
                        <th>م</th>
                        <th>الاسم</th>
                        <th>الموبايل</th>
                        <th>الايميل</th>
                        <th>الرساله</th>
                        <th>التاريخ</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filtermessage.length > 0 ? filtermessage.map((message, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                {/* <td>
                                  <span className="custom-checkbox">
                                    <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                    <label htmlFor="checkbox1"></label>
                                  </span>
                                </td> */}
                                <td>{i + 1}</td>
                                <td>{message.name}</td>
                                <td>{message.phone}</td>
                                <td>{message.email}</td>
                                <td>{message.message}</td>
                                <td>{new Date(message.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                <td>
                                <a href="#editmessageModal" className="edit" data-toggle="modal"onClick={()=>{
                                      setName(message.name);setPhone(message.phone);setMessage(message.message); setEmail(message.email);setmessageId(message._id);
                                    }}><i className="material-icons" data-toggle="tooltip" title="Edit"
                                    >&#xE254;</i></a>
                                    <a href="#deletemessageModal" className="delete" data-toggle="modal" onClick={()=>setmessageId(message._id)}><i className="material-icons" data-toggle="tooltip" title="Delete"
                                    >&#xE872;</i></a>
                                </td>

                              </tr>
                            )
                          }
                        })
                          : allCustomerMessage.map((message, i) => {
                            // if (i < pagination & i >= pagination - 5) {
                            if (i >= startpagination & i < endpagination) {
                              return (
                                <tr key={i}>
                                  {/* <td>
                                    <span className="custom-checkbox">
                                      <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                      <label htmlFor="checkbox1"></label>
                                    </span>
                                  </td> */}
                                  <td>{i + 1}</td>
                                  <td>{message.name}</td>
                                  <td>{message.phone}</td>
                                  <td>{message.email}</td>
                                  <td>{message.message}</td>
                                  <td>{new Date(message.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                  <td>
                                    <a href="#editmessageModal" className="edit" data-toggle="modal"onClick={()=>{
                                      setName(message.name);setPhone(message.phone);setMessage(message.message); setEmail(message.email);setmessageId(message._id);
                                    }}><i className="material-icons" data-toggle="tooltip" title="Edit"
                                    >&#xE254;</i></a>
                                    <a href="#deletemessageModal" className="delete" data-toggle="modal" onClick={()=>setmessageId(message._id)}><i className="material-icons" data-toggle="tooltip" title="Delete"
                                    >&#xE872;</i></a>
                                  </td>
                                </tr>
                              )
                            }
                          })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{allCustomerMessage.length > endpagination ? endpagination : allCustomerMessage.length}</b> من <b>{allCustomerMessage.length}</b> عنصر</div>
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

              <div id="editmessageModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form>
                      <div className="modal-header">
                        <h4 className="modal-title">رساله عميل</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47" >
                          <label>الاسم</label>
                          <input type="text" className="form-control" defaultValue={name} required readOnly />
                        </div>

                        <div className="form-group form-group-47" >
                          <label>الموبايل</label>
                          <input type="text" className="form-control" defaultValue={phone} required readOnly />
                        </div>
                        <div className="form-group form-group-47" >
                          <label>الايميل</label>
                          <input type="email" className="form-control" defaultValue={email} required readOnly />
                        </div>
                        <div className="form-group form-group-47" >
                          <label>الرسالة</label>
                          <textarea className="form-control" defaultValue={message} required readOnly></textarea>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-info" value="تم" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="deletemessageModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteCustomerMessage}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف رساله</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-danger" value="حذف" />
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

export default CustomerMessage