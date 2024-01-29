import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { detacontext } from '../../../../App';

const ExpenseItem = () => {
    const [expenseId, setexpenseId] = useState('');
    const [description, setDescription] = useState('');
    const [createAt] = useState(new Date().toLocaleString());
    const [allExpenses, setAllExpenses] = useState([]);

    const createExpense = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://caviar-api.vercel.app/api/expenses/', { description });
            console.log(response.data);
            getAllExpenses();
        } catch (error) {
            console.log(error);
        }
    };

    const editExpense = async (e) => {
      e.preventDefault();
        try {
            const response = await axios.put(`https://caviar-api.vercel.app/api/expenses/${expenseId}`, {
                description
            });
            console.log(response.data);
            if (response.status === 200) {
                getAllExpenses();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteExpense = async (e) => {
      e.preventDefault();
        try {
            const response = await axios.delete(`https://caviar-api.vercel.app/api/expenses/${expenseId}`);
            if (response.status === 200) {
                console.log(response);
                getAllExpenses();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAllExpenses = async () => {
        try {
            const response = await axios.get('https://caviar-api.vercel.app/api/expenses/');
            const expenses = await response.data.reverse();
            console.log(response.data);
            setAllExpenses(expenses);
        } catch (error) {
            console.log(error);
        }
    };

    const [fielterlist, setfielterlist] = useState([])
    const searchByExpense = (expense) => {
      const filter =  allExpenses.filter(exp => exp.description.startsWith(expense) == true)
        setfielterlist(filter)
    }

    useEffect(() => {
        getAllExpenses();
    }, []);

    return (
        <detacontext.Consumer>
            {({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination  }) => {
                return (
                    <div className="container-xl mlr-auto">
                        <div className="table-responsive mt-1">
                            <div className="table-wrapper p-3 mw-100">
                                <div className="table-title">
                                    <div className="row">
                                        <div className="col-sm-6 text-right">
                                            <h2>ادارة <b>المصروفات</b></h2>
                                        </div>
                                        <div className="col-sm-6 d-flex justify-content-end">
                                            <a href="#addExpensesModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه مصروف جديد</span></a>

                                            <a href="#deleteExpensesModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                                                <input type="text" class="form-control" onChange={(e) => searchByExpense(e.target.value)} />
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
                                        {fielterlist.length > 0 ? fielterlist.map((expense, i) => {
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
                                                            <a href="#editExpensesModal" className="edit" data-toggle="modal" onClick={() => { setexpenseId(expense._id); setDescription(expense.description)
                                                            }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                                            <a href="#deleteExpensesModal" className="delete" data-toggle="modal" onClick={() => setexpenseId(expense._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        })
                                            : allExpenses.map((expense, i) => {
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
                                                                <a href="#editExpensesModal" className="edit" data-toggle="modal" onClick={() => { setexpenseId(expense._id); setDescription(expense.description)}}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                                                <a href="#deleteExpensesModal" className="delete" data-toggle="modal" onClick={() => setexpenseId(expense._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })}
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
                                        <div className="modal-header">
                                            <h4 className="modal-title">اضافه مصروف</h4>
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label>اسم المصروف</label>
                                                <input type="text" className="form-control" required onChange={(e) => setDescription(e.target.value)} />
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
                        <div id="editExpensesModal" className="modal fade">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <form onSubmit={editExpense}>
                                        <div className="modal-header">
                                            <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label>اسم المصروف</label>
                                                <input type="text" className="form-control" defaultValue={description} required onChange={(e) => setDescription(e.target.value)} />
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

                        <div id="deleteExpensesModal" className="modal fade">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <form onSubmit={deleteExpense}>
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

export default ExpenseItem;
