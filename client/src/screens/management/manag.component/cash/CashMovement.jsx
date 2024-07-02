import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import '../orders/Orders.css'


const CashMovement = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };


  const { setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)

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
      const response = await axios.get(apiUrl + '/api/cashregister', config);
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



  const cashMovementTypeEn = ['Deposit', 'Withdraw', 'Revenue', 'Transfer', 'Expense', 'Payment', 'Refund'];
  const cashMovementTypeAr = ['إيداع', 'سحب', 'إيراد', 'تحويل', 'مصروف', 'دفع مشتريات', 'استرداد']
    ;
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


  const filterByType = (type) => {
    if (!type) {
      getCashMovement()
      return
    }
    const filterList = AllCashMovement.filter(movement => movement.type === type)
    setAllCashMovement(filterList)
  }



  // const filterByTime = (timeRange) => {
  //   if (!timeRange) {
  //     getCashMovement()
  //   }
  //   let filteredCashMovement = [];

  //   const now = new Date();
  //   const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //   const startOfWeek = new Date(now);
  //   startOfWeek.setDate(now.getDate() - now.getDay());
  //   startOfWeek.setHours(0, 0, 0, 0);
  //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  //   const startOfYear = new Date(now.getFullYear(), 0, 1);

  //   switch (timeRange) {
  //     case 'today':
  //       filteredCashMovement = AllCashMovement.filter(Movement =>
  //         new Date(Movement.createdAt) >= startOfToday
  //       );
  //       break;
  //     case 'week':
  //       filteredCashMovement = AllCashMovement.filter(Movement =>
  //         new Date(Movement.createdAt) >= startOfWeek
  //       );
  //       break;
  //     case 'month':
  //       filteredCashMovement = AllCashMovement.filter(Movement =>
  //         new Date(Movement.createdAt) >= startOfMonth
  //       );
  //       break;
  //     case 'year':
  //       filteredCashMovement = AllCashMovement.filter(Movement =>
  //         new Date(Movement.createdAt) >= startOfYear
  //       );
  //       break;
  //     default:
  //       filteredCashMovement = AllCashMovement;
  //   }

  //   setAllCashMovement(filteredCashMovement)
  // };

  // const [StartDate, setStartDate] = useState(new Date())
  // const [EndDate, setEndDate] = useState(new Date())

  // const filterByDateRange = async () => {
  //   const start = new Date(StartDate);
  //   const end = new Date(EndDate);

  //   const filteredRecords = AllCashMovement.filter(record => {
  //     const createdAt = new Date(record.createdAt);
  //     return createdAt >= start && createdAt <= end;
  //   });

  //   setAllCashMovement(filteredRecords)
  // };



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
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>ادارة <b>حركه النقدية</b></h2>
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <a href="#DepositModal" className="btn w-50 btn-success" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Deposit')}>
                  <i className="material-icons">&#xE147;</i> <span>ايداع</span></a>
                <a href="#WithdrawModal" className="btn w-50 btn-danger" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Withdraw')}>
                  <i className="material-icons">&#xE15C;</i> <span>سحب</span></a>
                <a href="#Transferodal" className="btn w-50 btn-danger" data-toggle="modal" onClick={() => handelCashMovement(employeeLoginInfo.employeeinfo.id, 'Transfer')}>
                  <i className="material-icons">&#xE15C;</i> <span>تحويل</span></a>
              </div>
            </div>
          </div>
          <div class="table-filter print-hide">
            <div class="row text-dark d-flex flex-wrap align-items-center justify-content-start">
              <div class="show-entries">
                <span>عرض</span>
                <select class="form-control col-8" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                </select>
                <span>صفوف</span>
              </div>
              <div class="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">نوع العملية</label>
                <select class="form-control col-8" onChange={(e) => filterByType(e.target.value)} >
                  <option value={""}>الكل</option>
                  {cashMovementTypeEn.map((type, i) => {
                    <option value={type} >{cashMovementTypeAr[i]}</option>
                  })}
                </select>
              </div>
              <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-select col-8" onChange={(e) => setAllCashMovement(filterByTime(e.target.value, AllCashMovement))}>
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
                    <input type="date" className="form-control w-auto" onChange={(e) => setStartDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap mr-1">
                    <label className="form-label">إلى</label>
                    <input type="date" className="form-control w-auto" onChange={(e) => setEndDate(e.target.value)} placeholder="اختر التاريخ" />
                  </div>

                  <div className="d-flex flex-nowrap justify-content-between w-25">
                    <button type="button" className="btn btn-primary w-50" onClick={() => setAllCashMovement(filterByDateRange(AllCashMovement))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning w-50 mr-2" onClick={getCashMovement}>استعادة
                    </button>
                  </div>
                </div>
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
                            <button className="btn w-50 btn-success" onClick={() => { accepteTransferCash(movement._id, 'Completed') }}
                            >قبول</button>
                            <button className="btn w-50 btn-warning" onClick={() => { accepteTransferCash(movement._id, 'Rejected') }}
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
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">ايداع بالخزينه</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">المبلغ</label>
                  <input type='text' className="form-control col-8" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الرصيد</label>
                  <input type='text' className="form-control col-8" Value={balance} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الوصف</label>
                  <textarea className="form-control col-8" onChange={(e) => setDescription(e.target.value)}
                    required />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                  <input type="text" className="form-control col-8" value={formatDate(new Date())} readOnly />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className="btn w-50 btn-success" value="ايداع" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="WithdrawModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">سحب بالخزينه</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">المبلغ</label>
                  <input type='text' className="form-control col-8" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الرصيد</label>
                  <input type='text' className="form-control col-8" Value={balance} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الوصف</label>
                  <textarea rows="2" cols="80" className="form-control col-8" onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                  <input type="text" className="form-control col-8" Value={formatDate(new Date())} readOnly />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className="btn w-50 btn-success" value="سحب" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="Transferodal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={transferCash}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">تحويل بالخزينه</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">المبلغ</label>
                  <input type='text' className="form-control col-8" required onChange={(e) => setAmount(parseFloat(e.target.value))} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الرصيد</label>
                  <input type='text' className="form-control col-8" Value={balance} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الوصف</label>
                  <textarea rows="2" cols="80" className="form-control col-8" onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">الخزينه المحول اليها</label>
                  <select className="form-select col-8" onChange={(e) => setreceivRegister(e.target.value)}>
                    <option value={""}>اختر</option>
                    {AllCashRegisters.map((regsite, i) => (
                      <option key={i} value={regsite._id}>{regsite.name} المسؤول: {usertitle(regsite.employee)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">التاريخ</label>
                  <input type="text" className="form-control col-8" Value={formatDate(new Date())} readOnly />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className="btn w-50 btn-success" value="تحويل " />
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div id="deleteStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockaction}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn w-50 btn-danger" value="حذف" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
    </div>
  )

}

export default CashMovement