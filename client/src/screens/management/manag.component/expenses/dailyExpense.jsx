import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'


const DailyExpense = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const { setStartDate, setEndDate, filterByDateRange, filterByTime,
    employeeLoginInfo, usertitle, formatDate, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)


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
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
      const response = await axios.get(apiUrl + '/api/cashRegister', config);
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

      const response = await axios.get(apiUrl + '/api/expenses/', config);
      setallExpenses(response.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const createDailyExpense = async (e) => {
    e.preventDefault();
    const updatedbalance = balance - amount; // Calculate the updated balance

    try {

      const cashMovement = await axios.post(apiUrl + '/api/cashMovement/', {
        registerId: cashRegister,
        createdBy: paidBy,
        amount,
        type: 'Withdraw',
        description: expenseDescription,
      }, config);
      console.log(cashMovement)
      console.log(cashMovement.data.cashMovement._id)

      const cashMovementId = await cashMovement.data.cashMovement._id; // Retrieve the cashMovementId from the response data

      const dailyexpense = await axios.post(apiUrl + '/api/dailyexpense/', {
        expenseID,
        expenseDescription,
        cashRegister,
        cashMovementId,
        paidBy,
        amount,
        notes,
      }, config);

      const updatecashRegister = await axios.put(`${apiUrl}/api/cashRegister/${cashRegister}`, {
        balance: updatedbalance, // Use the updated balance
      }, config);

      // Update the state after successful updates
      if (updatecashRegister) {
        setbalance(updatedbalance);
        // Toast notification for successful creation
        toast.success('تم تسجيل المصروف');

        getallExpenses();
        getAllcashRegisters()
        getallDailyExpenses()
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل في تسجيل المصروف !حاول مره اخري');

    }
  };


  const editDailyExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      const prevExpense = await axios.get(`${apiUrl}/api/dailyexpense/${dailyexpenseID}`, config);
      const prevExpenseData = prevExpense.data;

      // Calculate the difference between the new amount and the previous amount
      const amountDifference = amount - prevExpenseData.amount < 0 ? (amount - prevExpenseData.amount) * -1 : amount - prevExpenseData.amount;

      const updatedbalance = balance + prevExpenseData.amount - amountDifference;

      if (cashMovementId) { // Ensure cashMovementId has a value before sending the request
        const response = await axios.put(`${apiUrl}/api/dailyexpense/${dailyexpenseID}`, {
          expenseID,
          expenseDescription,
          cashRegister,
          paidBy,
          amount,
          notes,
        }, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log(response.data);

        const cashMovement = await axios.put(`${apiUrl}/api/cashMovement/${cashMovementId}`, {
          registerId: cashRegister,
          createdBy: paidBy,
          amount,
          type: 'Withdraw',
          description: expenseDescription,
        }, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        if (data) {
          const updatecashRegister = await axios.put(`${apiUrl}/api/cashRegister/${cashRegister}`, {
            balance: updatedbalance,
          }, {
            headers: {
              'authorization': `Bearer ${token}`,
            },
          });
          if (updatecashRegister) {
            // Toast notification for successful edit
            toast.success('تم تحديث تفاصيل المصروف بنجاح');

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
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

      // Fetch the previous expense data to calculate the balance update
      const prevExpense = await axios.get(`${apiUrl}/api/dailyexpense/${dailyexpenseID}`, config);
      const prevExpenseData = prevExpense.data;

      // Calculate the difference between the new balance and the previous amount
      const updatedbalance = balance + prevExpenseData.amount;

      if (cashMovementId) { // Ensure cashMovementId has a value before sending the request
        // Delete the expense record after extracting previous expense data
        const deleteExpenseRecord = await axios.delete(`${apiUrl}/api/dailyexpense/${dailyexpenseID}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });
        const data = deleteExpenseRecord.data;

        if (data) {
          // Update the cash register balance with the updatedbalance
          const updatecashRegister = await axios.put(`${apiUrl}/api/cashRegister/${cashRegister}`, {
            balance: updatedbalance,
          }, {
            headers: {
              'authorization': `Bearer ${token}`,
            },
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
      const response = await axios.get(apiUrl + '/api/dailyexpense/', config);
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
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive mt-1">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6 text-right">
                <h2>ادارة <b>تسجيل المصروفات</b></h2>
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <a href="#addDailyExpensesModal" className="btn w-50 btn-success" data-toggle="modal" onClick={() => handlecashRegister(employeeLoginInfo.employeeinfo.id)}><i className="material-icons">&#xE147;</i> <span>اضافه مصروف جديد</span></a>

                {/* <a href="#deleteDailyExpensesModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
              </div>
            </div>
          </div>
          <div class="table-filter print-hide">
            <div class="row text-dark d-flex -flex-wrap align-items-center justify-content-start">
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
                <button type="button" class="btn w-50 btn-primary"><i class="fa fa-search"></i></button>
                <div class="filter-group">
                  <label>اسم المصروف</label>
                  <input type="text" class="form-control" onChange={(e) => searchByDailyExpense(e.target.value)} />
                </div>
              <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group">
                  <label>فلتر حسب الوقت</label>
                  <select className="form-select" onChange={(e) => setallDailyExpenses(filterByTime(e.target.value, allDailyExpenses))}>
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
                    <button type="button" className="btn btn-primary w-50" onClick={() => setallDailyExpenses(filterByDateRange(allDailyExpenses))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning w-50 mr-2" onClick={getallDailyExpenses}>استعادة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
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
                  : allDailyExpenses.length > 0 ? allDailyExpenses.map((dailyexpense, i) => {
                    if (i >= startpagination & i < endpagination) {
                      return (
                        <tr key={i}>

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
                  }) : ""}
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
              <div className="modal-header text-light bg-success">
                <h4 className="modal-title">تسجيل مصروف</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>المصروف</label>
                  <select name="category" id="category" form="carform" onChange={(e) => {
                    setexpenseID(e.target.value);
                    setexpenseDescription(allExpenses.length > 0 ? allExpenses.find(ex => ex._id == e.target.value).description : "");
                  }}>
                    {allExpenses.length > 0 ? allExpenses.map((expense, i) => {
                      return <option value={expense._id} key={i} >{expense.description}</option>
                    })
                      : ""}
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>المبلغ</label>
                  <input type="Number" className="form-control" required max={balance} onChange={(e) => {
                    setamount(e.target.value)
                  }} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>الخزينه </label>
                  <input type="text" className="form-control" value={cashRegistername} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>بواسطه </label>
                  <input type="text" className="form-control" value={usertitle(paidBy)} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12   w-100">
                  <label>ملاحظات</label>
                  <textarea className="form-control" rows={2} cols={50} onChange={(e) => { setnotes(e.target.value) }} />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className="btn w-50 btn-success" value="اضافه" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div id="editDailyExpensesModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={editDailyExpense}>
              <div className="modal-header text-light bg-success">
                <h4 className="modal-title">تعديل مصروف</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>المصروف</label>
                  <select name="category" id="category" form="carform" onChange={(e) => {
                    setexpenseID(e.target.value);
                    setexpenseDescription(allExpenses ? allExpenses.find(ex => ex._id == e.target.value).description : "");
                  }}>
                    {allExpenses ? allExpenses.map((expense, i) => {
                      return <option value={expense._id} key={i} >{expense.description}</option>
                    })
                      : ""}
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>المبلغ</label>
                  <input type="Number" className="form-control" value={amount} required max={balance} onChange={(e) => {
                    setamount(e.target.value)
                  }} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>الخزينه </label>
                  <input type="text" className="form-control" value={cashRegistername} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12 " >
                  <label>بواسطه </label>
                  <input type="text" className="form-control" value={usertitle(paidBy)} readOnly />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-6  col-md-12   w-100">
                  <label>ملاحظات</label>
                  <textarea className="form-control" rows={2} cols={100} onChange={(e) => { setnotes(e.target.value) }} />
                </div>
              </div>
              <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                <input type="submit" className="btn w-50 btn-info" value="Save" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="deleteDailyExpensesModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={deleteDailyExpense}>
              <div className="modal-header text-light bg-success">
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
      </div>
    </div>
  );
};

export default DailyExpense;
