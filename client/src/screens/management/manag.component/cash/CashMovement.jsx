import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';


const CashMovement = () => {
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
      const response = await axios.get('https://calma-api-puce.vercel.app/api/cashregister');
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
      const getCashRegisters = await axios.get('https://calma-api-puce.vercel.app/api/cashregister');
      const CashRegisters = getCashRegisters.data
      console.log({ CashRegisters })

      const myregister = CashRegisters.find((register) => register.employee == id)
      console.log({ myregister })
      const myregisterid = myregister._id
      console.log({ myregisterid })
      const response = await axios.get('https://calma-api-puce.vercel.app/api/cashmovement/');
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
  const [createBy, setCreateBy] = useState('');
  const [amount, setAmount] = useState();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [balance, setbalance] = useState();

  const addCashMovementAndUpdateBalance = async () => {
    // e.preventDefault();
    console.log({ registerId })
    console.log({ createBy })
    console.log({ amount })
    console.log({ balance })
    console.log({ type })
    console.log({ description })
    try {
      // Send cash movement data to the API
      const cashMovementResponse = await axios.post('https://calma-api-puce.vercel.app/api/cashmovement/', {
        registerId,
        createBy,
        amount,
        type,
        description,
      });
      console.log({ cashMovementResponse })

      if (cashMovementResponse) {
        // Check if it's a withdrawal operation
        const isWithdrawal = type === 'Withdraw';
        // Calculate the update amount based on the operation type
        const nweAmount = isWithdrawal ? - amount : amount;
        console.log({ nweAmount })

        // const newBalance = balance + amount;

        // console.log({newBalance})
        // Update the cash register balance on the server
        const updateRegisterBalance = await axios.put(`https://calma-api-puce.vercel.app/api/cashregister/${registerId}`, {
          // balance: newBalance,
          amount: nweAmount
        });
        console.log({ updateRegisterBalance })
        // Show success toast message if the process was successful
        toast.success('Cash movement recorded successfully');

        // Refresh the displayed cash movements and registers
        getCashMovement();
        getAllCashRegisters();
      }

    } catch (error) {
      // Show error toast message if the process failed
      toast.error('Failed to record cash movement');
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
    setCreateBy(id)
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
      // Send cash movement data to the API
      const sendcashMovement = await axios.post('https://calma-api-puce.vercel.app/api/cashmovement/', {
        registerId: sendRegister,
        createBy,
        amount,
        type: "Transfer",
        description,
        transferTo: receivRegister,
        status: 'Pending',
      });

      if (sendcashMovement) {
        const movementId = await sendcashMovement.data.cashMovement._id
        console.log({ movementId })

        const receivcashMovement = await axios.post('https://calma-api-puce.vercel.app/api/cashmovement/', {
          registerId: receivRegister,
          createBy,
          amount,
          type: "Transfer",
          description,
          transferFrom: sendRegister,
          status: 'Pending',
          movementId
        });
      }

      // Show success toast message if the process was successful
      toast.success('تم تسجيل التحويل و ينظر الموافقه من المستلم');

      // Refresh the displayed cash movements and registers
      getCashMovement();
      getAllCashRegisters();
    } catch (error) {
      // Show error toast message if the process failed
      toast.error('Failed to record cash movement');
    }
  }

  const accepteTransferCash = async (id, statusTransfer) => {
    try {
      // Fetch details of the cash movement
      const receivcashMovement = await axios.get(`https://calma-api-puce.vercel.app/api/cashmovement/${id}`);
      const movementId = receivcashMovement.data.movementId;
      const sendregister = receivcashMovement.data.transferFrom;
      const receivregister = receivcashMovement.data.registerId;
      const amount = receivcashMovement.data.amount;
      console.log({ movementId, sendregister, amount, receivregister })

      // Check the transfer status
      if (statusTransfer === 'Rejected') {
        // Reject transfer
        await axios.put(`https://calma-api-puce.vercel.app/api/cashmovement/${id}`, {
          status: 'Rejected',
        });

        // Update sender's cash movement status
        await axios.put(`https://calma-api-puce.vercel.app/api/cashmovement/${movementId}`, {
          status: 'Rejected',
        });

        toast.error('Transfer rejected successfully');
      } else if (statusTransfer === 'Completed') {
        // Update receiver's cash movement status
        const updatereceivcashMovement = await axios.put(`https://calma-api-puce.vercel.app/api/cashmovement/${id}`, {
          status: 'Completed',
        });
        console.log(updatereceivcashMovement)
        // Update receiver's cash register balance
        const receivregisterBalance = (await axios.get(`https://calma-api-puce.vercel.app/api/cashregister/${receivregister}`)).data.balance;

        console.log({ receivregisterBalance })

        const newreceivBalance = receivregisterBalance + amount
        console.log({ newreceivBalance })
        const updatereceivregister = await axios.put(`https://calma-api-puce.vercel.app/api/cashregister/${receivregister}`, {
          balance: newreceivBalance,
        });
        console.log(updatereceivregister)

        // Update sender's cash movement status
        const updatesendercashMovement = await axios.put(`https://calma-api-puce.vercel.app/api/cashmovement/${movementId}`, {
          status: 'Completed',
        });

        console.log(updatesendercashMovement)

        // Update sender's cash register balance
        const senderregisterBalance = (await axios.get(`https://calma-api-puce.vercel.app/api/cashregister/${sendregister}`)).data.balance;

        console.log({ senderregisterBalance })

        const newsenderBalance = senderregisterBalance - amount

        console.log({ newsenderBalance })
        const updatesenderregister = await axios.put(`https://calma-api-puce.vercel.app/api/cashregister/${sendregister}`, {
          balance: newsenderBalance,
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
        ({ employeeLoginInfo, usertitle, showdate, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <ToastContainer />
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>حركه النقدية</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#DepositModal" className="btn btn-success" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Deposit')}><i className="material-icons">&#xE147;</i> <span>ايداع</span></a>

                        <a href="#WithdrawModal" className="btn btn-danger" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Withdraw')}><i className="material-icons">&#xE15C;</i> <span>سحب</span></a>
                        <a href="#Transferodal" className="btn btn-danger" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Transfer')}><i className="material-icons">&#xE15C;</i> <span>تحويل</span></a>
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
                        <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
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
                        AllCashMovement.map((movement, i) => {
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
                                <td>{usertitle(movement.createBy)}</td>
                                <td>{movement.type}</td>
                                <td>{movement.amount}</td>
                                <td>{movement.description}</td>
                                <td>{movement.status == 'Pending' ?
<<<<<<< HEAD
                                  AllCashRegisters.find(cash => cash.employee == movement.createBy) ?
                                    movement.status
                                    : <>
                                      <button className="btn btn-success" onClick={() => { accepteTransferCash(movement._id, 'Completed') }}
                                      >قبول</button>
                                      <button className="btn btn-warning" onClick={() => { accepteTransferCash(movement._id, 'Rejected') }}
                                      >رفض</button>
                                    </>
                                  : ""}</td>
=======
                                  <>
                                    <button className="btn btn-success" onClick={() => { accepteTransferCash(movement._id, 'Completed') }}
                                    >قبول</button>
                                    <button className="btn btn-warning" onClick={() => { accepteTransferCash(movement._id, 'Rejected') }}
                                    >رفض</button>
                                  </>
                                  : movement.status}</td>
>>>>>>> 559b8d757036881d7ae2c37b5651daffa3a4743d
                                <td>{new Date(movement.createdAt).toLocaleString('en-GB', { hour12: true })}</td>
                                {/* <td>
                                  <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td> */}
                              </tr>
                            )
                          }
                        })
                      }
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
                        <div className="form-group">
                          <label>المبلغ</label>
                          <input type='text' className="form-control" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={balance} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الوصف</label>
                          <textarea className="form-control" onChange={(e) => setDescription(e.target.value)}
                            required />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" value={showdate()} readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="ايداع" />
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
                        <div className="form-group">
                          <label>المبلغ</label>
                          <input type='text' className="form-control" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={balance} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الوصف</label>
                          <textarea rows="2" cols="80" className="form-control" onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={showdate} readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="سحب" />
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
                        <div className="form-group">
                          <label>المبلغ</label>
                          <input type='text' className="form-control" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                        </div>
                        <div className="form-group">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={balance} readOnly />
                        </div>
                        <div className="form-group">
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
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={showdate} readOnly />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="تحويل " />
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
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
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

export default CashMovement