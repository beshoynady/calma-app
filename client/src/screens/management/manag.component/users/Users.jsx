import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';


const Users = () => {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [AllUsers, setAllUsers] = useState([])

  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem('token_e');

      const response = await axios.get(apiUrl + '/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAllUsers(response.data)
      console.log({ AllUsers: response })
    } catch (error) {
      console.log(error)
    }
  };
  const changeorderVarified = async (e, id) => {
    try {
      const token = localStorage.getItem('token_e');

      // Get the value from the event
      const isVarified = e.target.value;
      console.log(e.target.value)

      // Send a request to update the 'isVarified' status
      const response = await axios.put(`${apiUrl}/api/user/update-status/${id}`, { isVarified }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data)

      // Notify success using toast
      toast.success('تم تغير الحاله بنجاح');

      // Reload the user list or perform necessary actions
      getAllUsers();
    } catch (error) {
      // Handle errors and notify using toast
      console.error(error);
      toast.error('فشل تغير الحاله');
    }
  };

  const changeorderActive = async (e, id) => {
    try {
      const token = localStorage.getItem('token_e');

      // put the value from the event
      const isActive = e.target.value;

      // Send a request to update the 'isActive' status
      const response = await axios.put(`${apiUrl}/api/user/update-status/${id}`, { isActive }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Notify success using toast
      toast.success('تم تغير الحاله بنجاح');

      // Reload the user list or perform necessary actions
      getAllUsers();
    } catch (error) {
      // Handle errors and notify using toast
      console.error(error);
      toast.error('فشل تغير الحاله');
    }
  };

  const [userid, setUserid] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isVarified, setIsVarified] = useState(false);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      console.log({username,
        email,
        address,
        deliveryArea,
        phone,
        isActive,
        isVarified,})
      const response = await axios.put(`${apiUrl}/api/user/${userid}`, {
        username,
        email,
        address,
        deliveryArea,
        phone,
        // password,
        isActive,
        isVarified,
      });
      console.log({response})
      if(response.status === 200){
        toast.success('تم تحديث المستخدم بنجاح');
      }
    } catch (error) {
      toast.error(error.response.data.message || 'حدث خطأ ما');
    }
  };
  const handelEditUser = (user) => {
    setUserid(user._id);
    setUsername(user.username);
    setEmail(user.email);
    setAddress(user.address);
    setDeliveryArea(user.deliveryArea);
    setPhone(user.phone);
    setIsActive(user.isActive);
    setIsVarified(user.isVarified);
  };

  const [filteruser, setfilteruser] = useState([])
  const getUserByPhone = async (phone) => {
    const user = AllUsers.filter(user => user.phone.startsWith(phone));
    setfilteruser(user)
  }

  const [Areas, setAreas] = useState([])
  const getAllDeliveryAreas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/deliveryarea`)
      const data = await response.data
      console.log({ data })
      if (data) {
        setAreas(data)
      } else {
        toast.error('لا يوجد بيانات لمنطقه التوصيل ! اضف بيانات منطقه التوصيل ')
      }
    } catch (error) {
      toast.error('حدث خطأ اثناء جلب بيانات منطقه التوصيل! اعد تحميل الصفحة')
    }
  }

  useEffect(() => {
    getAllUsers()
    getAllDeliveryAreas()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination, restaurantData }) => {
          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المستخدمين</b></h2>
                      </div>
                      {/* <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#adduserModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافة موظف جديد</span></a>
                        <a href="#deleteuserModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
                      </div> */}
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
                          </select>
                          <span>عنصر</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>الموبايل</label>
                          <input type="text" class="form-control" onChange={(e) => getUserByPhone(e.target.value)} />
                          <button type="button" class="btn btn-47 btn-primary"><i class="fa fa-search"></i></button>
                        </div>

                      </div>
                    </div>
                  </div>
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>

                        <th>م</th>
                        <th>الاسم</th>
                        <th>الموبايل</th>
                        <th>المنطقه</th>
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

                                <td>{i + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.phone}</td>
                                <td>{user.deliveryArea ? user.deliveryArea.name : 'لم يحدد'}</td>
                                <td>{user.address}</td>
                                <td>{user.email}</td>
                                <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changeorderActive(e, user._id) }}>
                                    <option>{user.isActive ? 'نشط' : "غير نشط"}</option>
                                    <option value={true} key={i}>نشط</option>
                                    <option value={false} key={i}>غير نشط</option>
                                  </select>
                                </td>
                                <td>
                                  <select name="status" id="status" form="carform" onChange={(e) => { changeorderVarified(e, user._id) }}>
                                    <option>{user.isVarified ? 'موثق' : "غير موثق"}</option>
                                    <option value={true} key={i}>موثق</option>
                                    <option value={false} key={i}>غير موثق</option>
                                  </select>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                <td>
                                  <a href="#edituserModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit"
                                    onClick={() => { handelEditUser(user) }}
                                  >&#xE254;</i></a>
                                  <a href="#deleteuserModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete"
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
                                  {/* <td>
                                    <span className="custom-checkbox">
                                      <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                      <label htmlFor="checkbox1"></label>
                                    </span>
                                  </td> */}
                                  <td>{i + 1}</td>
                                  <td>{user.username}</td>
                                  <td>{user.phone}</td>
                                  <td>{user.deliveryArea ? user.deliveryArea.name : 'لم يحدد'}</td>
                                  <td>{user.address}</td>
                                  <td>{user.email}</td>
                                  <td>
                                    <select name="status" id="status" form="carform" onChange={(e) => { changeorderActive(e, user._id) }}>
                                      <option>{user.isActive ? 'نشط' : "غير نشط"}</option>
                                      <option value={true}>نشط</option>
                                      <option value={false}>غير نشط</option>
                                    </select>
                                  </td>
                                  <td>
                                    <select name="status" id="status" form="carform" onChange={(e) => { changeorderVarified(e, user._id) }}>
                                      <option>{user.isVarified ? 'موثق' : "غير موثق"}</option>
                                      <option value={true}>موثق</option>
                                      <option value={false}>غير موثق</option>
                                    </select>
                                  </td>
                                  <td>{new Date(user.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                  <td>
                                    <a href="#edituserModal" className="edit" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Edit"
                                      onClick={() => { handelEditUser(user) }}
                                    >&#xE254;</i></a>
                                    <a href="#deleteuserModal" className="delete" data-toggle="modal"><i className="material-icons" data-toggle="tooltip" title="Delete"
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
              {/* <div id="adduserModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createuserloyee}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه موظف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required pattern="[A-Za-z\u0600-\u06FF\s]+" onChange={(e) => setusername(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid name.</div>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>اسم المستخدم</label>
                          <input type="text" className="form-control" required onChange={(e) => setusername(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>الموبايل</label>
                          <input type="text" className="form-control" required pattern="[0-9]{11}" onChange={(e) => setphone(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid phone number (11 digits).</div>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>الباسورد</label>
                          <input type="text" className="form-control" required onChange={(e) => setpassword(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>الرقم القومي</label>
                          <input type="text" className="form-control" required onChange={(e) => setnumberID(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>الايميل</label>
                          <input type="email" className="form-control" required onChange={(e) => setemail(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid email address.</div>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>العنوان</label>
                          <textarea className="form-control" required onChange={(e) => setaddress(e.target.value)}></textarea>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>الحالة</label>
                          <select form="carform" required onChange={(e) => setisActive(e.target.value)}>
                            <option >اختر</option>
                            <option value={true}>متاح</option>
                            <option value={false}>ليس متاح</option>
                          </select>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>الوظيفه</label>
                          <select name={role} form="carform" required onChange={(e) => setrole(e.target.value)}>
                            <option>اختار وظيفة</option>
                            <option value="manager">مدير</option>
                            <option value="cashier">كاشير</option>
                            <option value="deliveryman">الديلفري</option>
                            <option value="waiter">ويتر</option>
                            <option value="chef">شيف</option>
                          </select>
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 ">
                          <label>المرتب الاساسي</label>
                          <input type="Number" min={0} className="form-control" required onChange={(e) => setbasicSalary(e.target.value)} />
                          <div className="invalid-feedback">Please enter a valid salary.</div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-47 btn-success"  value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
              <div id="edituserModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={handleUpdateUser}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل بيانات العملاء</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input
                            type="text"
                            className="form-control"
                            value={username}
                            required
                            pattern="[A-Za-z\u0600-\u06FF\s]+"
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <div className="invalid-feedback">الرجاء إدخال اسم صحيح.</div>
                        </div>
                        <div className="form-group">
                          <label>الموبايل</label>
                          <input
                            type="text"
                            className="form-control"
                            value={phone}
                            required
                            pattern="[0-9]{11}"
                            onChange={(e) => setPhone(e.target.value)}
                          />
                          <div className="invalid-feedback">الرجاء إدخال رقم هاتف صحيح (11 رقم).</div>
                        </div>
                        <div className="form-group">
                          <label>الباسورد</label>
                          <input
                            type="password"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>الايميل</label>
                          <input
                            type="email"
                            className="form-control"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <div className="invalid-feedback">الرجاء إدخال عنوان بريد إلكتروني صحيح.</div>
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <textarea
                            className="form-control"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select
                            className="form-control"
                            value={isActive}
                            required
                            onChange={(e) => setIsActive(e.target.value === 'true')}
                          >
                            <option value="">اختر</option>
                            <option value="true">متاح</option>
                            <option value="false">ليس متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>المنطقة</label>
                          <select
                            name="area"
                            className="form-control"
                            value={deliveryArea}
                            required
                            onChange={(e) => setDeliveryArea(e.target.value)}
                          >
                            <option value="">اختار المنطقه</option>
                            {Areas.map((area) => (
                              <option key={area._id} value={area._id}>{area.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger btn-47" data-dismiss="modal" value="اغلاق" />
                        <input type="submit" className="btn btn-success btn-47" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* <div id="deleteuserModal" className="modal fade">
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

export default Users