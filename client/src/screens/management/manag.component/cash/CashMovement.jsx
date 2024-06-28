import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';


const CashMovement = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const [EmployeeLoginInfo, setEmployeeLoginInfo] = useState({})
  // Function to retrieve user info from tokens
  const getEmployeeInfoFromToken = () => {
    const employeeToken = localStorage.getItem('token_e');
    let decodedToken = null;
    if (employeeToken) {
      decodedToken = jwt_decode(employeeToken);
      // Set employee login info
      // setEmployeeLoginInfo(decodedToken);
      console.log({ EmployeeInfoFromToken: decodedToken.employeeinfo });
      return decodedToken.employeeinfo
    }
  };



  const [AllCashRegisters, setAllCashRegisters] = useState([]);
  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/cashregister',config);
      setAllCashRegisters(response.data.reverse());
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };


  const [AllCashMovement, setAllCashMovement] = useState([]);
  const getCashMovement = async () => {
    try {
      const EmployeeLoginInfo = getEmployeeInfoFromToken()
      console.log({ EmployeeLoginInfo })
      const id = EmployeeLoginInfo.id
      console.log({ id })
      const getCashRegisters = await axios.get(apiUrl + '/api/cashregister', config);
      const CashRegisters = getCashRegisters.data
      console.log({ CashRegisters })

      const myregister = CashRegisters.find((register) => register.employee == id)
      console.log({ myregister })
      const myregisterid = myregister._id
      console.log({ myregisterid })
      const response = await axios.get(apiUrl + '/api/cashmovement/', config);
      const AllCashMovement = response.data
      console.log({ AllCashMovement })
      const mydata = AllCashMovement.filter(movement => movement.registerId == myregisterid)
      setAllCashMovement(mydata.reverse())
      console.log({ mydata })

    } catch (error) {
      console.log(error)
    }

  }



  const [registerId, setRegisterId] = useState('');
  const [createdBy, setcreatedBy] = useState('');
  const [amount, setAmount] = useState();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [balance, setbalance] = useState();

  // Function to add cash movement and update balance
  const addCashMovementAndUpdateBalance = async () => {
    try {
      // Send cash movement data to the API
      const cashMovementResponse = await axios.post(apiUrl + '/api/cashmovement/', {
        registerId,
        createdBy,
        amount,
        type,
        description,
      }, config);

      // If the cash movement is recorded successfully
      if (cashMovementResponse.data) {
        const isWithdrawal = type === 'Withdraw';
        const updateAmount = isWithdrawal ? -amount : amount;
        const newBalance = balance + updateAmount;

        // Update the cash register balance on the server
        const updateRegisterBalance = await axios.put(`${apiUrl}/api/cashregister/${registerId}`, {
          balance: newBalance,
        }, config);

        // If the cash register balance is updated successfully
        if (updateRegisterBalance.data) {
          // Show success toast message
          toast.success('تم تسجيل حركة النقدية بنجاح');
          // Refresh the displayed cash movements and registers
          getCashMovement();
          getAllCashRegisters();
        } else {
          // Show error toast message if updating cash register balance fails
          toast.error('فشل تحديث رصيد النقدية في الخزينة');
        }
      } else {
        // Show error toast message if recording cash movement fails
        toast.error('فشل تسجيل حركة النقدية');
      }
    } catch (error) {
      console.error('Error:', error);
      // Show error toast message if an error occurs during the request processing
      toast.error('حدث خطأ أثناء معالجة الطلب');
    }
  };



  const handelCashMovement = (id, Type) => {
    setSubmitted(false);
    const CashRegister = AllCashRegisters ? AllCashRegisters.find((cash => cash.employee == id)) : {}
    setRegisterId(CashRegister._id)
    setsendRegister(CashRegister._id)
    setbalance(Number(CashRegister.balance))
    setType(Type)
    console.log(CashRegister.balance)
    setcreatedBy(id)
  }


  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!submitted) {
      setSubmitted(true);

      await addCashMovementAndUpdateBalance();

      const modal = document.getElementById('DepositModal');
      if (modal) {
        modal.style.display = 'none';
      }
    }
  };
  const [sendRegister, setsendRegister] = useState(false);
  const [receivRegister, setreceivRegister] = useState(false);
  // const [statusTransfer, setstatusTransfer] = useState(false);

  const transferCash = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      // Send cash movement data to the API
      const sendCashMovementResponse = await axios.post(apiUrl + '/api/cashmovement/', {
        registerId: sendRegister,
        createdBy,
        amount,
        type: "Transfer",
        description,
        transferTo: receivRegister,
        status: 'Pending',
      }, config);

      const sendCashMovementData = sendCashMovementResponse.data;
      const movementId = sendCashMovementData.cashMovement._id;
      console.log({ movementId })
      // Send receiving cash movement data to the API
      const receivCashMovementResponse = await axios.post(apiUrl + '/api/cashmovement/', {
        registerId: receivRegister,
        createdBy,
        amount,
        type: "Transfer",
        description,
        transferFrom: sendRegister,
        status: 'Pending',
        movementId
      }, config);

      const receivCashMovementData = receivCashMovementResponse.data;
      console.log({ receivCashMovementData })
      if (receivCashMovementData) {
        // Show success toast message if the process was successful
        toast.success('تم تسجيل التحويل و ينتظر الموافقة من المستلم');

        // Refresh the displayed cash movements and registers
        getCashMovement();
        getAllCashRegisters();
      }
    } catch (error) {
      // Show error toast message if the process failed
      toast.error('حدث خطأ أثناء تسجيل حركة النقدية');
      console.error(error); // Log the error for debugging purposes
    }
  };


  const accepteTransferCash = async (id, statusTransfer) => {
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      // Fetch details of the cash movement
      const receivcashMovement = await axios.get(`${apiUrl}/api/cashmovement/${id}`, config);
      const movementId = receivcashMovement.data.movementId;
      const sendregister = receivcashMovement.data.transferFrom;
      const receivregister = receivcashMovement.data.registerId;
      const amount = receivcashMovement.data.amount;
      console.log({ movementId, sendregister, amount, receivregister })

      // Check the transfer status
      if (statusTransfer === 'Rejected') {
        // Reject transfer
        await axios.put(`${apiUrl}/api/cashmovement/${id}`, {
          status: 'Rejected',
        }, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        });

        // Update sender's cash movement status
        await axios.put(`${apiUrl}/api/cashmovement/${movementId}`, {
          status: 'Rejected',
        }, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        });

        toast.error('Transfer rejected successfully');
      } else if (statusTransfer === 'Completed') {
        // Update receiver's cash movement status
        const updatereceivcashMovement = await axios.put(`${apiUrl}/api/cashmovement/${id}`, {
          status: 'Completed',
        }, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        });
        console.log(updatereceivcashMovement)
        // Update receiver's cash register balance
        const receivregisterBalance = (await axios.get(`${apiUrl}/api/cashregister/${receivregister}`, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        })).data.balance;

        console.log({ receivregisterBalance })

        const newreceivBalance = receivregisterBalance + amount
        console.log({ newreceivBalance })
        const updatereceivregister = await axios.put(`${apiUrl}/api/cashregister/${receivregister}`, {
          balance: newreceivBalance,
        }, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        });
        console.log(updatereceivregister)

        // Update sender's cash movement status
        const updatesendercashMovement = await axios.put(`${apiUrl}/api/cashmovement/${movementId}`, {
          status: 'Completed',
        });

        console.log(updatesendercashMovement)

        // Update sender's cash register balance
        const senderregisterBalance = (await axios.get(`${apiUrl}/api/cashregister/${sendregister}`, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        })).data.balance;

        console.log({ senderregisterBalance })

        const newsenderBalance = senderregisterBalance - amount

        console.log({ newsenderBalance })
        const updatesenderregister = await axios.put(`${apiUrl}/api/cashregister/${sendregister}`, {
          balance: newsenderBalance,
        }, {
          headers: {
            'authorization': `Bearer ${token}`, // Send the token in the authorization header
          },
        });
        console.log(updatesenderregister)

      }
      toast.success('Transfer completed successfully');
    } catch (error) {
      console.error('Error accepting transfer:', error.message);
      toast.error('Error accepting transfer. Please try again.');

    }
  };





  useEffect(() => {
    // getEmployeeInfoFromToken()
    getAllCashRegisters()
    getCashMovement()
  }, [])

  // useEffect(() => {
  //   getAllCashRegisters()
  //   getCashMovement()
  // }, [EmployeeLoginInfo])


  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, formatDate, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>حركه النقدية</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#DepositModal" className="btn btn-47 btn-success" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Deposit')}><i className="material-icons">&#xE147;</i> <span>ايداع</span></a>
                        <a href="#WithdrawModal" className="btn btn-47 btn-danger" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Withdraw')}><i className="material-icons">&#xE15C;</i> <span>سحب</span></a>
                        <a href="#Transferodal" className="btn btn-47 btn-danger" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Transfer')}><i className="material-icons">&#xE15C;</i> <span>تحويل</span></a>
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
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <button type="button" class="btn btn-47 btn-primary"><i class="fa fa-search"></i></button>
                        {/* <div class="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByitem(e.target.value)} />
                        </div>
                        <div class="filter-group">
                          <label>نوع الاوردر</label>
                          <select class="form-control" onChange={(e) => searchByaction(e.target.value)} >
                            <option value={""}>الكل</option>
                            <option value="Purchase" >Purchase</option>
                            <option value="Return" >Return</option>
                            <option value="Expense" >Expense</option>
                            <option value="Wastage" >Wastage</option>
                          </select>
                        </div> */}
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
                        <th>الخزنه</th>
                        <th>المسؤل</th>
                        <th>النوع</th>
                        <th>بواسطه</th>
                        <th>المبلغ</th>
                        <th>الوصف</th>
                        <th>الحالة</th>
                        <th>التاريخ</th>
                        {/* <th>اجراءات</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {
                        // StockitemFilterd.length > 0 ? StockitemFilterd.map((action, i) => {
                        //   if (i >= startpagination & i < endpagination) {
                        //     return (
                        //       <tr key={i}>
                        //         <td>
                        //           <span className="custom-checkbox">
                        //             <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                        //             <label htmlFor="checkbox1"></label>
                        //           </span>
                        //         </td>
                        //         <td>{i + 1}</td>
                        //         <td>{itemname(action.itemId)}</td>
                        //         <td>{action.movement}</td>
                        //         <td>{action.Quantity}</td>
                        //         <td>{action.unit}</td>
                        //         <td>{action.price}</td>
                        //         <td>{action.cost}</td>
                        //         <td>{action.oldBalance}</td>
                        //         <td>{action.Balance}</td>
                        //         <td>{Date(action.actionAt).toLocaleString}</td>
                        //         <td>{usertitle(action.actionBy)}</td>
                        //         <td>
                        //           <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                        //           <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                        //         </td>
                        //       </tr>
                        //     )
                        //   }
                        // })
                        //   : 
                        AllCashMovement.length > 0 ? AllCashMovement.map((movement, i) => {
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
                                <td>{
                                  AllCashRegisters.find(cash => cash._id == movement.registerId)
                                    ? AllCashRegisters.find(cash => cash._id == movement.registerId).name
                                    : 'No register found'
                                }</td>
                                <td>{
                                  AllCashRegisters.find(cash => cash._id == movement.registerId)
                                    ? usertitle(AllCashRegisters.find(cash => cash._id == movement.registerId).employee)
                                    : 'No register found'
                                }</td>
                                <td>{movement.type}</td>
                                <td>{usertitle(movement.createdBy)}</td>
                                <td>{movement.amount}</td>
                                <td>{movement.description}</td>
                                <td>{movement.status == 'Pending' && movement.transferFrom ?
                                  <>
                                    <button className="btn btn-47 btn-success" onClick={() => { accepteTransferCash(movement._id, 'Completed') }}
                                    >قبول</button>
                                    <button className="btn btn-47 btn-warning" onClick={() => { accepteTransferCash(movement._id, 'Rejected') }}
                                    >رفض</button>
                                  </>
                                  : movement.status}</td>
                                <td>{new Date(movement.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                {/* <td>
                                  <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td> */}
                              </tr>
                            )
                          }
                        })
                          : ''}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{AllCashMovement.length > endpagination ? endpagination : AllCashMovement.length}</b> من <b>{AllCashMovement.length}</b> عنصر</div>
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
              <div id="DepositModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                      <div className="modal-header">
                        <h4 className="modal-title">ايداع بالخزينه</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>المبلغ</label>
                          <input type='text' className="form-control" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={balance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الوصف</label>
                          <textarea className="form-control" onChange={(e) => setDescription(e.target.value)}
                            required />
                        </div>
                        <div className="form-group form-group-47">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" value={formatDate(new Date())} readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="ايداع" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="WithdrawModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                      <div className="modal-header">
                        <h4 className="modal-title">سحب بالخزينه</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>المبلغ</label>
                          <input type='text' className="form-control" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={balance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الوصف</label>
                          <textarea rows="2" cols="80" className="form-control" onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="form-group form-group-47">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={formatDate(new Date())} readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="سحب" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="Transferodal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={transferCash}>
                      <div className="modal-header">
                        <h4 className="modal-title">تحويل بالخزينه</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>المبلغ</label>
                          <input type='text' className="form-control" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={balance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الوصف</label>
                          <textarea rows="2" cols="80" className="form-control" onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="filter-group">
                          <label>الخزينه المحول اليها</label>
                          <select className="form-control" onChange={(e) => setreceivRegister(e.target.value)}>
                            <option value={""}>اختر</option>
                            {AllCashRegisters.map((regsite, i) => (
                              <option key={i} value={regsite._id}>{regsite.name} المسؤول: {usertitle(regsite.employee)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={formatDate(new Date())} readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="تحويل " />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* <div id="deleteStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockaction}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
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

export default CashMovement