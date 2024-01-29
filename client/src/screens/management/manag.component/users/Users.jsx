import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Users = () => {
  const [AllUsers, setAllUsers] = useState([])

  const getAllUsers = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/user');
      setAllUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  };
  const changeorderVarified = async (e, id) => {
    try {
      // Get the value from the event
      const isVarified = e.target.value;
      console.log(e.target.value)
      
      // Send a request to update the 'isVarified' status
      const response = await axios.put(`https://caviar-api.vercel.app/api/user/update-status/${id}`, { isVarified });
      console.log(response.data)

      // Notify success using toast
      toast.success('Status updated successfully');

      // Reload the user list or perform necessary actions
      getAllUsers();
    } catch (error) {
      // Handle errors and notify using toast
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const changeorderActive = async (e, id) => {
    try {
      // put the value from the event
      const isActive = e.target.value;

      // Send a request to update the 'isActive' status
      const response = await axios.put(`https://caviar-api.vercel.app/api/user/update-status/${id}`, { isActive });

      // Notify success using toast
      toast.success('Status updated successfully');

      // Reload the user list or perform necessary actions
      getAllUsers();
    } catch (error) {
      // Handle errors and notify using toast
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const [filteruser, setfilteruser] = useState([])
  const getUserByPhone = async (phone) => {
    const user = AllUsers.filter(user => user.phone.startsWith(phone));
    setfilteruser(user)
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المستخدمين</b></h2>
                      </div>
                      {/* <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#adduserloyeeModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة موظف جديد</span></a>
                        <a href="#deleteuserloyeeModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
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
                          <input type="text" class="form-control" onChange={(e) => getUserByPhone(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
                        {/* <div class="filter-group">
                          <label>الوظيفة</label>
                          <select class="form-control" onChange={(e) => getUsersByJob(e.target.value)} >
                            <option>الكل</option>
                            <option value="manager">مدير</option>
                            <option value="casher">Cashير</option>
                            <option value="waiter">ويتر</option>
                            <option value="Chef">شيف</option>
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>الحالة</label>
                          <select class="form-control" onChange={(e) => filteruserByStatus(e.target.value)} >
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
                        <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th>
                        <th>م</th>
                        <th>الاسم</th>
                        <th>الموبايل</th>
                        <th>العنوان</th>
                        <th>الايميل</th>
                        <th>نشط</th>
                        <th>موثق</th>
                        <th>التاريخ</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filteruser.length > 0 ? filteruser.map((user, i) => {
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
                                <td>{user.username}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>{user.email}</td>
                                <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changeorderActive(e, user._id) }}>
                                    <option>{user.isActive ? 'نشط' : "غير نشط"}</option>
                                    <option value={true} key={i}>نشط</option>
                                    <option value={false} key={i}>غير نشط"</option>
                                  </select>
                                </td>
                                <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changeorderVarified(e, user._id) }}>
                                    <option>{user.isVarified ? 'موثق' : "غير موثق"}</option>
                                    <option value={true} key={i}>موثق</option>
                                    <option value={false} key={i}>غير موثق"</option>
                                  </select>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                <td>
                                  <a href="#edituserloyeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit"
                                  //    onClick={() => {
                                  //     setuserloyeeid(user._id); setfullname(user.fullname); setnumberID(user.numberID); setusername(user.username); setaddress(user.address); setemail(user.email); setisActive(user.isActive); setphone(user.phone); setrole(user.role); setbasicSalary(user.basicSalary)
                                  //   }}
                                  >&#xE254;</i></a>
                                  <a href="#deleteuserloyeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete"
                                  //    onClick={() => setuserloyeeid(user._id)}
                                  >&#xE872;</i></a>
                                </td>

                              </tr>
                            )
                          }
                        })
                          : AllUsers.map((user, i) => {
                            // if (i < pagination & i >= pagination - 5) {
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
                                  <td>{user.username}</td>
                                  <td>{user.phone}</td>
                                  <td>{user.address}</td>
                                  <td>{user.email}</td>
                                  <td>
                                    <select name="status" id="status" form="carform" onChange={(e) => { changeorderActive(e, user._id) }}>
                                      <option>{user.isActive ? 'نشط' : "غير نشط"}</option>
                                      <option value={true}>نشط</option>
                                    <option value={false}>غير نشط"</option>
                                    </select>
                                  </td>
                                  <td>
                                    <select name="status" id="status" form="carform" onChange={(e) => { changeorderVarified(e, user._id) }}>
                                      <option>{user.isVarified ? 'موثق' : "غير موثق"}</option>
                                      <option value={true}>موثق</option>
                                      <option value={false}>غير موثق"</option>
                                    </select>
                                  </td>                                 
                                   <td>{new Date(user.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                  <td>
                                    <a href="#edituserloyeeModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit"
                                    //    onClick={() => {
                                    //     setuserloyeeid(user._id); setfullname(user.fullname); setnumberID(user.numberID); setusername(user.username); setaddress(user.address); setemail(user.email); setisActive(user.isActive); setphone(user.phone); setrole(user.role); setbasicSalary(user.basicSalary)
                                    //   }}
                                    >&#xE254;</i></a>
                                    <a href="#deleteuserloyeeModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete"
                                    //    onClick={() => setuserloyeeid(user._id)}
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
                    <div className="hint-text text-dark">عرض <b>{AllUsers.length > endpagination ? endpagination : AllUsers.length}</b> من <b>{AllUsers.length}</b> عنصر</div>
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
              {/* <div id="adduserloyeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createuserloyee}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه موظف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required pattern="[A-Za-z\s]+" onChange={(e) => setfullname(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid name.</div>
                        </div>
                        <div className="form-group">
                          <label>اسم المستخدم</label>
                          <input type="text" className="form-control" required onChange={(e) => setusername(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الموبايل</label>
                          <input type="text" className="form-control" required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid phone number (11 digits).</div>
                        </div>
                        <div className="form-group">
                          <label>الباسورد</label>
                          <input type="text" className="form-control" required onChange={(e) => setpassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرقم القومي</label>
                          <input type="text" className="form-control" required onChange={(e) => setnumberID(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الايميل</label>
                          <input type="email" className="form-control" required onChange={(e) => setemail(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid email address.</div>
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <textarea className="form-control" required onChange={(e) => setaddress(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select form="carform" required onChange={(e) => setisActive(e.target.value)}>
                            <option >اختر</option>
                            <option value={true}>متاح</option>
                            <option value={false}>ليس متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
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
                        <div className="form-group">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" required onChange={(e) => setbasicSalary(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid salary.</div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="edituserloyeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={edituserloyee}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل بيانات الموظفين</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" defaultValue={fullname} required pattern="[A-Za-z\s]+" onChange={(e) => setfullname(e.target.value)} />
                          <div className="invalid-feedback">الرجاء إدخال اسم صحيح.</div>
                        </div>
                        <div className="form-group">
                          <label>اسم المستخدم</label>
                          <input type="text" className="form-control" defaultValue={username} required onChange={(e) => setusername(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الموبايل</label>
                          <input type="text" className="form-control" defaultValue={phone} required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                          <div className="invalid-feedback">الرجاء إدخال رقم هاتف صحيح (11 رقم).</div>
                        </div>
                        <div className="form-group">
                          <label>الباسورد</label>
                          <input type="password" className="form-control" onChange={(e) => setpassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرقم القومي</label>
                          <input type="text" className="form-control" defaultValue={numberID} required onChange={(e) => setnumberID(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الايميل</label>
                          <input type="email" className="form-control" defaultValue={email} required onChange={(e) => setemail(e.target.value)} />
                          <div className="invalid-feedback">الرجاء إدخال عنوان بريد إلكتروني صحيح.</div>
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <textarea className="form-control" defaultValue={address} required onChange={(e) => setaddress(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select form="carform" required defaultValue={isActive} onChange={(e) => setisActive(e.target.value)}>
                            <option>اختر</option>
                            <option value={true}>متاح</option>
                            <option value={false}>ليس متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
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
                        <div className="form-group">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" defaultValue={basicSalary} required onChange={(e) => setbasicSalary(e.target.value)} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="deleteuserloyeeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteuserloyee}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف موظف</h4>
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
              </div> */}
            </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default Users