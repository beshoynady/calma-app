import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { ToastContainer, toast } from 'react-toastify';


const CashMovement = () => {
  const [registerId, setRegisterId] = useState('');
  const [createBy, setCreateBy] = useState('');
  const [amount, setAmount] = useState();
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [balance, setbalance] = useState();

  const [AllCashMovement, setAllCashMovement] = useState([]);
  const getCashMovement = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/cashmovement/');
      console.log(response.data)
      setAllCashMovement(response.data.reverse())

    } catch (error) {
      console.log(error)
    }

  }

  const [AllCashRegisters, setAllCashRegisters] = useState([]);
  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/cashregister');
      setAllCashRegisters(response.data.reverse());
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };

  const addCashMovementAndUpdateBalance = async () => {
    // e.preventDefault();

    try {
      // Send cash movement data to the API
      const cashMovementResponse = await axios.post('https://caviar-api.vercel.app/api/cashmovement/', {
        registerId,
        createBy,
        amount,
        type,
        description,
      });

      // Check if it's a withdrawal operation
      const isWithdrawal = type === 'Withdraw';
      // Calculate the update amount based on the operation type
      const updateAmount = isWithdrawal ? -amount : amount;

      // Update the balance locally
      const updatedBalance = balance + updateAmount;

      // Update the cash register balance on the server
      await axios.put(`https://caviar-api.vercel.app/api/cashregister/${registerId}`, {
        balance: updatedBalance,
      });

      // Show success toast message if the process was successful
      toast.success('Cash movement recorded successfully');

      // Refresh the displayed cash movements and registers
      getCashMovement();
      getAllCashRegisters();
    } catch (error) {
      // Show error toast message if the process failed
      toast.error('Failed to record cash movement');
    }
  };


  const handelCashMovement = (id, t) => {
    setSubmitted(false);
    const CashRegister = AllCashRegisters ? AllCashRegisters.find((cash => cash.employee == id)) : {}
    setRegisterId(CashRegister._id)
    setbalance(Number(CashRegister.balance))
    setType(t)
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
  useEffect(() => {
    getCashMovement()
    getAllCashRegisters()

  }, [])




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
                          <input type='Number' className="form-control" required onChange={(e) => setAmount(Number(e.target.value))} />
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
                          <input type='Number' className="form-control" required onChange={(e) => setAmount(Number(e.target.value))} />
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