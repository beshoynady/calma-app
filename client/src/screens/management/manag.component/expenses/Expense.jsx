import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'




const ExpenseItem = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const {setStartDate, setEndDate, filterByDateRange, filterByTime, EditPagination, startpagination, endpagination, setstartpagination, setendpagination}= useContext(detacontext)

  const [expenseId, setexpenseId] = useState('');
  const [description, setDescription] = useState('');
  const [allExpenses, setAllExpenses] = useState([]);


  const createExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl + '/api/expenses/', { description }, config);
      console.log(response.data);
      getAllExpenses();
      toast.success('تم إنشاء المصروف بنجاح');
    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ أثناء إنشاء المصروف');
    }
  };
  
  const editExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/api/expenses/${expenseId}`, { description }, config);
      console.log(response.data);
      if (response.status === 200) {
        getAllExpenses();
        toast.success('تم تعديل المصروف بنجاح');
      }
    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ أثناء تعديل المصروف');
    }
  };
  
  const deleteExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${apiUrl}/api/expenses/${expenseId}`, config);
      if (response.status === 200) {
        console.log(response);
        getAllExpenses();
        toast.success('تم حذف المصروف بنجاح');
      }
    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ أثناء حذف المصروف');
    }
  };
  
  const getAllExpenses = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/expenses/', config);
      const expenses = await response.data.reverse();
      console.log(response.data);
      setAllExpenses(expenses);
    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ أثناء جلب المصاريف');
    }
  };
  
  const searchByExpense = (expense) => {
    if (!expense) {
      getAllExpenses();
      return;
    }
    const filter = allExpenses.filter(exp => exp.description.startsWith(expense));
    setAllExpenses(filter);
  };

  useEffect(() => {
    getAllExpenses();
  }, []);

        return (
          <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
            <div className="table-responsive mt-1">
              <div className="table-wrapper p-3 mw-100">
                <div className="table-title">
                  <div className="row">
                    <div className="col-sm-6 text-right">
                      <h2>ادارة <b>المصروفات</b></h2>
                    </div>
                    <div className="col-sm-6 d-flex justify-content-end">
                      <a href="#addExpensesModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه مصروف جديد</span></a>

                      <a href="#deleteExpensesModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                      <div class="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                        <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">اسم المصروف</label>
                        <input type="text" class="form-control" onChange={(e) => searchByExpense(e.target.value)} />
                      </div>
                      <div className='col-12 d-flex align-items-center justify-content-between'>
                <div className="filter-group d-flex align-items-center justify-content-between col-4 p-0 mx-2">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">فلتر حسب الوقت</label>
                  <select className="form-select col-8" onChange={(e) => setAllExpenses(filterByTime(e.target.value, allExpenses))}>
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
                    <button type="button" className="btn btn-primary w-50" onClick={() => setAllExpenses(filterByDateRange(allExpenses))}>
                      <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-warning w-50 mr-2" onClick={getAllExpenses}>استعادة
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
                      <th>اسم المصروف</th>
                      <th>اجمالي </th>
                      <th>اضف في</th>
                      <th>اجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                     allExpenses.length>0?allExpenses.map((expense, i) => {
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
                              <td>{expense.description}</td>
                              <td>{expense.amount}</td>
                              <td>{new Date(expense.date).toLocaleString('en-GB', { hour12: true })}</td>
                              <td>
                                <a href="#editExpensesModal" className="edit" data-toggle="modal" onClick={() => { setexpenseId(expense._id); setDescription(expense.description) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteExpensesModal" className="delete" data-toggle="modal" onClick={() => setexpenseId(expense._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })
                    :""}
                  </tbody>
                </table>
                <div className="clearfix">
                  <div className="hint-text text-dark">عرض <b>{allExpenses.length > endpagination ? endpagination : allExpenses.length}</b> من <b>{allExpenses.length}</b> عنصر</div>
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
            <div id="addExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={createExpense}>
                    <div className="modal-header text-light bg-primary">
                      <h4 className="modal-title">اضافه مصروف</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                        <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">اسم المصروف</label>
                        <input type="text" className="form-control" required onChange={(e) => setDescription(e.target.value)} />
                      </div>
                    </div>
                    <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                      <input type="submit" className="btn w-50 btn-success" value="اضافه" />
                      <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div id="editExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={editExpense}>
                    <div className="modal-header text-light bg-primary">
                      <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                        <label className="col-4 fs-4 text-wrap text-right fw-bolder p-0 m-0">اسم المصروف</label>
                        <input type="text" className="form-control" defaultValue={description} required onChange={(e) => setDescription(e.target.value)} />
                      </div>
                    </div>
                    <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                      <input type="submit" className="btn w-50 btn-info" value="حفظ" />
                      <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div id="deleteExpensesModal" className="modal fade">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={deleteExpense}>
                    <div className="modal-header text-light bg-primary">
                      <h4 className="modal-title">حذف منتج</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div className="modal-body">
                      <p>هل انت متاكد من حذف هذا السجل؟</p>
                      <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
                    </div>
                    <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                      <input type="submit" className="btn w-50 btn-danger" value="حذف" />
                      <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
};

export default ExpenseItem;
