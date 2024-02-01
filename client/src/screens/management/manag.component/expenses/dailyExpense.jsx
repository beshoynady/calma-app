import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { ToastContainer, toast } from 'react-toastify';

const DailyExpense = () => {
  const [expenseID, setexpenseID] = useState('');
  const [cashMovementId, setcashMovementId] = useState('');
  const [dailyexpenseID, setdailyexpenseID] = useState('');
  const [expenseDescription, setexpenseDescription] = useState('');
  const [amount, setamount] = useState();
  const [balance, setbalance] = useState();
  const [cashRegister, setcashRegister] = useState('');
  const [cashRegistername, setcashRegistername] = useState('');
  const [paidBy, setpaidBy] = useState('');
  const [notes, setnotes] = useState('');
  const [allExpenses, setallExpenses] = useState([]);
  const [allDailyExpenses, setallDailyExpenses] = useState([]);
  const [AllcashRegisters, setAllcashRegisters] = useState([]);

  const getAllcashRegisters = async () => {
    try {
      const response = await axios.get('https://calma-api-puce.vercel.app/api/cashRegister');
      setAllcashRegisters(response.data.reverse());
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };

  const handlecashRegister = (id) => {
    const cashRegister = AllcashRegisters ? AllcashRegisters.find((cash) => cash.employee === id) : {};
    setcashRegister(cashRegister._id);
    setcashRegistername(cashRegister.name);
    setbalance(cashRegister.balance);
    setpaidBy(id);
  };

  const getallExpenses = async () => {
    try {
      const response = await axios.get('https://calma-api-puce.vercel.app/api/expenses/');
      setallExpenses(response.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const createDailyExpense = async (e) => {
    e.preventDefault();
    const minsamount = - amount; // Calculate the updated balance

    try {
      const cashMovement = await axios.post('https://calma-api-puce.vercel.app/api/cashMovement/', {
        registerId: cashRegister,
        createBy: paidBy,
        amount,
        type: 'Withdraw',
        description: expenseDescription,
      });
      console.log(cashMovement)
      console.log(cashMovement.data.cashMovement._id)

      const cashMovementId = await cashMovement.data.cashMovement._id; // Retrieve the cashMovementId from the response data

      const dailyexpense = await axios.post('https://calma-api-puce.vercel.app/api/dailyexpense/', {
        expenseID,
        expenseDescription,
        cashRegister,
        cashMovementId,
        paidBy,
        amount,
        notes,
      });

      const updatecashRegister = await axios.put(`https://calma-api-puce.vercel.app/api/cashRegister/${cashRegister}`, {
        amount:minsamount, 
      });

      // Update the state after successful updates
      if (updatecashRegister) {
        setbalance(updatedbalance);
        // Toast notification for successful creation
        toast.success('Expense created successfully');

        getallExpenses();
        getAllcashRegisters()
        getallDailyExpenses()
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('Failed to create expense');

    }
  };


  const editDailyExpense = async (e) => {
    e.preventDefault();
    try {
      const prevExpense = await axios.get(`https://calma-api-puce.vercel.app/api/dailyexpense/${dailyexpenseID}`);
      const prevExpenseData = prevExpense.data;

      // Calculate the difference between the new amount and the previous amount
      const amountDifference = amount - prevExpenseData.amount < 0 ? (amount - prevExpenseData.amount) * -1 : amount - prevExpenseData.amount;

      const updatedbalance = balance + prevExpenseData.amount - amountDifference;

      if (cashMovementId) { // Ensure cashMovementId has a value before sending the request
        const response = await axios.put(`https://calma-api-puce.vercel.app/api/dailyexpense/${dailyexpenseID}`, {
          expenseID,
          expenseDescription,
          cashRegister,
          paidBy,
          amount,
          notes,
        });

        const data = response.data;
        console.log(response.data);

        const cashMovement = await axios.put(`https://calma-api-puce.vercel.app/api/cashMovement/${cashMovementId}`, {
          registerId: cashRegister,
          createBy: paidBy,
          amount,
          type: 'Withdraw',
          description: expenseDescription,
        });

        if (data) {
          const updatecashRegister = await axios.put(`https://calma-api-puce.vercel.app/api/cashRegister/${cashRegister}`, {
            balance: updatedbalance,
          });
          if (updatecashRegister) {
            // Toast notification for successful edit
            toast.success('Expense updated successfully');

            getallExpenses();
            getAllcashRegisters()
            getallDailyExpenses()

          }
        }
      } else {
        console.log('Cash movement ID value is empty.');
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('Failed to update expense');

    }
  };



  const deleteDailyExpense = async (e) => {
    e.preventDefault();
    try {
      // Fetch the previous expense data to calculate the balance update
      const prevExpense = await axios.get(`https://calma-api-puce.vercel.app/api/dailyexpense/${dailyexpenseID}`);
      const prevExpenseData = prevExpense.data;

      // Calculate the difference between the new balance and the previous amount
      const updatedbalance = balance + prevExpenseData.amount;

      if (cashMovementId) { // Ensure cashMovementId has a value before sending the request
        // Delete the expense record after extracting previous expense data
        const deleteExpenseRecord = await axios.delete(`https://calma-api-puce.vercel.app/api/dailyexpense/${dailyexpenseID}`);
        const data = deleteExpenseRecord.data;

        if (data) {
          // Update the cash register balance with the updatedbalance
          const updatecashRegister = await axios.put(`https://calma-api-puce.vercel.app/api/cashRegister/${cashRegister}`, {
            balance: updatedbalance,
          });

          if (updatecashRegister) {
            // Toast notification for successful deletion
            toast.success('Expense deleted successfully');

            // Fetch all daily expenses after the update
            getallExpenses();
            getAllcashRegisters()
            getallDailyExpenses()

          }
        }
      } else {
        console.log('Cash movement ID value is empty.');
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('Failed to delete expense');

    }
  };



  const getallDailyExpenses = async () => {
    try {
      const response = await axios.get('https://calma-api-puce.vercel.app/api/dailyexpense/');
      const dailyExpenses = await response.data.reverse();
      console.log(response.data);
      setallDailyExpenses(dailyExpenses);
    } catch (error) {
      console.log(error);
    }
  };




  const [fielterDailyExpenses, setfielterDailyExpenses] = useState([])
  const searchByDailyExpense = (expense) => {
    const filter = allDailyExpenses.filter(exp => exp.expenseDescription.startsWith(expense) == true)
    setfielterDailyExpenses(filter)
  }

  useEffect(() => {
    getallExpenses();
    getAllcashRegisters();
    getallDailyExpenses();
  }, []);

  return (
    <detacontext.Consumer>
      {({ employeeLoginInfo, usertitle, showdate, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
        return (
          <div className="container-xl mlr-auto">
            <ToastContainer />
            <div className="table-responsive mt-1">
              <div className="table-wrapper p-3 mw-100">
                <div className="table-title">
                  <div className="row">
                    <div className="col-sm-6 text-right">
                      <h2>ادارة <b>تسجيل المصروفات</b></h2>
                    </div>
                    <div className="col-sm-6 d-flex justify-content-end">
                      <a href="#addDailyExpensesModal" className="btn btn-success" data-toggle="modal" onClick={() => handlecashRegister(employeeLoginInfo.employeeinfo.id)}><i className="material-icons">&#xE147;</i> <span>اضافه مصروف جديد</span></a>

                      <a href="#deleteDailyExpensesModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                      <div class="filter-group">
                        <label>اسم المصروف</label>
                        <input type="text" class="form-control" onChange={(e) => searchByDailyExpense(e.target.value)} />
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
                      <th>اسم المصروف</th>
                      <th>المبلغ </th>
                      <th>الحزينه </th>
                      <th>بواسطه </th>
                      <th>ملاحظات</th>
                      <th>اضف في</th>
                      <th>رقم الحركه </th>
                      <th>اجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      fielterDailyExpenses.length > 0 ? fielterDailyExpenses.map((dailyexpense, i) => {
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
                              <td>{dailyexpense.expenseDescription}</td>
                              <td>{dailyexpense.amount}</td>
                              <td>
                                {AllcashRegisters && AllcashRegisters.find(cash => cash._id === dailyexpense.cashRegister) ?
                                  AllcashRegisters.find(cash => cash._id === dailyexpense.cashRegister).name : ''}
                              </td>
                              <td>{usertitle(dailyexpense.paidBy)}</td>
                              <td>{dailyexpense.notes}</td>
                              <td>{new Date(dailyexpense.date).toLocaleString('en-GB', { hour12: true })}</td>
                              <td>{dailyexpense.cashMovementId}</td>
                              <td>

                                <a href="#editDailyExpensesModal" className="edit" data-toggle="modal" onClick={() => {
                                  setexpenseID(dailyexpense._id); setexpenseDescription(dailyexpense.expenseexpenseDescription); setamount(dailyexpense.amount)
                                  setamount(dailyexpense.totalamount - dailyexpense.amount); setdailyexpenseID(dailyexpense._id)
                                }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteDailyExpensesModal" className="delete" data-toggle="modal" onClick={() => setdailyexpenseID(dailyexpense._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>

                            </tr>
                          )
                        }
                      })
                        : allDailyExpenses.map((dailyexpense, i) => {
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
                                <td>{dailyexpense.expenseDescription}</td>
                                <td>{dailyexpense.amount}</td>
                                <td>
                                  {AllcashRegisters && AllcashRegisters.find(cash => cash._id === dailyexpense.cashRegister) ?
                                    AllcashRegisters.find(cash => cash._id === dailyexpense.cashRegister).name : ''}
                                </td>
                                <td>{usertitle(dailyexpense.paidBy)}</td>
                                <td>{dailyexpense.notes}</td>
                                <td>{new Date(dailyexpense.date).toLocaleString('en-GB', { hour12: true })}</td>
                                <td>{dailyexpense.cashMovementId}</td>
                                <td>
                                  <a href="#editDailyExpensesModal" className="edit" data-toggle="modal" onClick={() => {
                                    handlecashRegister(employeeLoginInfo.employeeinfo.id); setcashMovementId(dailyexpense.cashMovementId);
                                    setexpenseID(dailyexpense._id); setexpenseDescription(dailyexpense.expenseexpenseDescription); setamount(dailyexpense.amount); setpaidBy(dailyexpense.paidBy); setdailyexpenseID(dailyexpense._id)
                                  }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteDailyExpensesModal" className="delete" data-toggle="modal" onClick={() => { setdailyexpenseID(dailyexpense._id); setcashMovementId(dailyexpense.cashMovementId) }}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })}
                  </tbody>
                </table>
                <div className="clearfix">
                  <div className="hint-text text-dark">عرض <b>{allDailyExpenses.length > endpagination ? endpagination : allDailyExpenses.length}</b> من <b>{allDailyExpenses.length}</b> عنصر</div>
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
            <div id="addDailyExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={createDailyExpense}>
                    <div className="modal-header">
                      <h4 className="modal-title">تسجيل مصروف</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>المصروف</label>
                        <select name="category" id="category" form="carform" onChange={(e) => {
                          setexpenseID(e.target.value);
                          setexpenseDescription(allExpenses.find(ex => ex._id == e.target.value).description);
                        }}>
                          {allExpenses.map((expense, i) => {
                            return <option value={expense._id} key={i} >{expense.description}</option>
                          })
                          }
                        </select>
                      </div>
                      <div className="form-group">
                        <label>المبلغ</label>
                        <input type="Number" className="form-control" required max={balance} onChange={(e) => {
                          setamount(e.target.value)
                        }} />
                      </div>
                      <div className="form-group">
                        <label>الخزينه </label>
                        <input type="text" className="form-control" value={cashRegistername} readOnly />
                      </div>
                      <div className="form-group">
                        <label>بواسطه </label>
                        <input type="text" className="form-control" value={usertitle(paidBy)} readOnly />
                      </div>
                      <div className="form-group w-100">
                        <label>ملاحظات</label>
                        <textarea className="form-control" rows={2} cols={50} onChange={(e) => { setnotes(e.target.value) }} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-success" value="اضافه" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="editDailyExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={editDailyExpense}>
                    <div className="modal-header">
                      <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>المصروف</label>
                        <select name="category" id="category" form="carform" onChange={(e) => {
                          setexpenseID(e.target.value);
                          setexpenseDescription(allExpenses.find(ex => ex._id == e.target.value).description);
                        }}>
                          {allExpenses.map((expense, i) => {
                            return <option value={expense._id} key={i} >{expense.description}</option>
                          })
                          }
                        </select>
                      </div>
                      <div className="form-group">
                        <label>المبلغ</label>
                        <input type="Number" className="form-control" value={amount} required max={balance} onChange={(e) => {
                          setamount(e.target.value)
                        }} />
                      </div>
                      <div className="form-group">
                        <label>الخزينه </label>
                        <input type="text" className="form-control" value={cashRegistername} readOnly />
                      </div>
                      <div className="form-group">
                        <label>بواسطه </label>
                        <input type="text" className="form-control" value={usertitle(paidBy)} readOnly />
                      </div>
                      <div className="form-group w-100">
                        <label>ملاحظات</label>
                        <textarea className="form-control" rows={2} cols={100} onChange={(e) => { setnotes(e.target.value) }} />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                      <input type="submit" className="btn btn-info" value="Save" />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div id="deleteDailyExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={deleteDailyExpense}>
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
            </div>
          </div>
        );
      }}
    </detacontext.Consumer>
  );
};

export default DailyExpense;
