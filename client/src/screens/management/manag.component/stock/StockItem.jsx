import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';



const StockItem = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [itemName, setitemName] = useState('');
  const [stockItemId, setStockItemid] = useState('');
  const [categoryId, setcategoryId] = useState('');
  const [largeUnit, setlargeUnit] = useState('');
  const [smallUnit, setsmallUnit] = useState('');
  const [Balance, setBalance] = useState('');
  const [price, setprice] = useState('');
  const [totalCost, settotalCost] = useState('');
  const [parts, setparts] = useState('');
  const [costOfPart, setcostOfPart] = useState('');
  const [minThreshold, setminThreshold] = useState();


  // Function to create a stock item
  const createItem = async (e, userId) => {
    e.preventDefault();
    const createBy = userId;
    try {
      const response = await axios.post(apiUrl + '/api/stockitem/', {
        itemName,
        categoryId,
        smallUnit,
        parts,
        totalCost,
        costOfPart,
        largeUnit,
        Balance,
        minThreshold,
        price,
        createBy,
      });
      console.log(response.data);
      getStockItems(); // Update the list of stock items after creating a new one

      // Notify on success
      toast.success('تم إنشاء عنصر المخزون بنجاح');
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في إنشاء عنصر المخزون');
    }
  };

  // Function to edit a stock item
  const editStockItem = async (e, userId) => {
    e.preventDefault();
    const createBy = userId;
    try {

      const response = await axios.put(`${apiUrl}/api/stockitem/${stockItemId}`, {
        itemName,
        categoryId,
        smallUnit,
        parts,
        totalCost,
        costOfPart,
        largeUnit,
        Balance,
        minThreshold,
        price,
        createBy,
      });
      console.log(response.data);
      if (response) {
        getStockItems(); // Update the list of stock items after editing
      }

      // Notify on success
      toast.success('تم تحديث عنصر المخزون بنجاح');
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في تحديث عنصر المخزون');
    }
  };

  // Function to delete a stock item
  const deleteStockItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${apiUrl}/api/stockitem/${stockItemId}`);
      if (response.status === 200) {
        console.log(response);
        getStockItems(); // Update the list of stock items after deletion

        // Notify on success
        toast.success('تم حذف عنصر المخزون بنجاح');
      }
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في حذف عنصر المخزون');
    }
  };


  const [AllStockItems, setAllStockItems] = useState([])

  // Function to retrieve all stock items
  const getStockItems = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/stockitem/');
      const stockItems = await response.data.reverse();
      console.log(response.data);
      setAllStockItems(stockItems);
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في استرداد عناصر المخزون');
    }
  };

  const [AllCategoryStock, setAllCategoryStock] = useState([])

  // Function to retrieve all category stock
  const getAllCategoryStock = async () => {
    try {
      const res = await axios.get(apiUrl + '/api/categoryStock/');
      setAllCategoryStock(res.data);
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في استرداد فئة المخزون');
    }
  };


  useEffect(() => {
    getStockItems()
    getAllCategoryStock()
  }, [])
  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>المنتجات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addStockItemModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        {/* <a href="#deleteStockItemModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
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
                        {/* <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        <div class="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByitem(e.target.value)} />
                        </div> */}
                        {/* <div class="filter-group">
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

                        <th>م</th>
                        <th>اسم الصنف</th>
                        <th>المخزن</th>
                        <th>الرصيد الحالي</th>
                        <th>الحد الادني</th>
                        <th>الوحدة كبيرة</th>
                        <th>السعر</th>
                        <th>اجمالي التكلفة</th>
                        <th>عدد الوحدات</th>
                        <th>الوحدة صغيرة</th>
                        <th>تكلفة الوحده</th>
                        <th>اضيف بواسطه</th>
                        <th>تاريخ الاضافه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AllStockItems && AllStockItems.map((item, i) => {
                        if (i >= startpagination & i < endpagination) {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.itemName}</td>
                              <td>{AllCategoryStock.length > 0 ? AllCategoryStock.filter(c => c._id == item.categoryId)[0].name : ''}</td>
                              <td>{item.Balance}</td>
                              <td>{item.minThreshold}</td>
                              <td>{item.largeUnit}</td>
                              <td>{item.price}</td>
                              <td>{item.totalCost}</td>
                              <td>{item.parts}</td>
                              <td>{item.smallUnit}</td>
                              <td>{item.costOfPart}</td>
                              <td>{item.createBy ? usertitle(item.createBy) : '--'}</td>
                              <td>{item.createdAt}</td>
                              <td>
                                <a href="#editStockItemModal" className="edit" data-toggle="modal" onClick={() => { setStockItemid(item._id); setcategoryId(item.categoryId); setitemName(item.itemName); setBalance(item.Balance); setlargeUnit(item.largeUnit); setsmallUnit(item.smallUnit); setprice(item.price); setparts(item.parts); setcostOfPart(item.costOfPart); setminThreshold(item.minThreshold); settotalCost(item.totalCost) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteStockItemModal" className="delete" data-toggle="modal" onClick={() => setStockItemid(item._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{AllStockItems.length > endpagination ? endpagination : AllStockItems.length}</b> من <b>{AllStockItems.length}</b> عنصر</div>
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


              <div id="addStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => createItem(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>اسم الصنف</label>
                          <input type="text" className="form-control" required onChange={(e) => setitemName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>نوع المخزن</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setcategoryId(e.target.value)}>
                            <option>اختر نوع المخزن</option>
                            {AllCategoryStock.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الوحدة الكبيرة</label>
                          <input type='text' className="form-control" required onChange={(e) => setlargeUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>الوحدة الصغيره</label>
                          <input type='text' className="form-control" required onChange={(e) => setsmallUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>رصيد افتتاحي</label>
                          <input type='Number' className="form-control" required onChange={(e) => setBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الحد الادني</label>
                          <input type='number' className="form-control" required onChange={(e) => { setminThreshold(e.target.value); }} />
                        </div>
                        <div className="form-group">
                          <label>السعر</label>
                          <input type='Number' className="form-control" required onChange={(e) => { setprice(e.target.value); settotalCost(e.target.value * Balance) }} />
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" required defaultValue={totalCost} readOnly />
                        </div>
                        <div className="form-group">
                          <label>عدد الوحدات</label>
                          <input type='Number' className="form-control" required onChange={(e) => { setparts(e.target.value); setcostOfPart(price / e.target.value) }} />
                        </div>
                        <div className="form-group">
                          <label>تكلفة الوحده</label>
                          <input type='Number' className="form-control" required defaultValue={costOfPart} readOnly />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" Value={new Date().toLocaleDateString()} required readOnly />
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


              <div id="editStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => editStockItem(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>اسم الصنف</label>
                          <input type="text" className="form-control" defaultValue={itemName} required onChange={(e) => setitemName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>نوع المخزن</label>
                          <select name="category" id="category" defaultValue={categoryId} form="carform" onChange={(e) => setcategoryId(e.target.value)}>
                            {/* <option>{AllCategoryStock.length>0?AllCategoryStock.filter(c=>c._id == categoryId)[0].name:''}</option> */}
                            <option value={categoryId}>{AllCategoryStock.length > 0 ? AllCategoryStock.filter(c => c._id == categoryId)[0].name : ''}</option>
                            {AllCategoryStock.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>

                        <div className="form-group">
                          <label>الوحدة الكبيرة</label>
                          <input type='text' className="form-control" defaultValue={largeUnit} required onChange={(e) => setlargeUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>الوحدة الصغيره</label>
                          <input type='text' className="form-control" defaultValue={smallUnit} required onChange={(e) => setsmallUnit(e.target.value)}></input>
                        </div>
                        <div className="form-group">
                          <label>رصيد افتتاحي</label>
                          <input type='Number' className="form-control" defaultValue={Balance} required onChange={(e) => setBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الحد الادني</label>
                          <input type='number' className="form-control" required defaultValue={minThreshold} onChange={(e) => { setminThreshold(e.target.value); }} />
                        </div>

                        <div className="form-group">
                          <label>السعر</label>
                          <input type='Number' className="form-control" defaultValue={price} required onChange={(e) => { setprice(e.target.value); settotalCost(e.target.value * Balance) }} />
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='text' className="form-control" required defaultValue={totalCost} readOnly />
                        </div>
                        <div className="form-group">
                          <label>عدد الوحدات</label>
                          <input type='Number' className="form-control" defaultValue={parts} required onChange={(e) => { setparts(e.target.value); setcostOfPart(price / e.target.value) }} />
                        </div>
                        <div className="form-group">
                          <label>تكلفة الوحده</label>
                          <input type='Number' className="form-control" required defaultValue={costOfPart} readOnly />
                        </div>
                        <div className="form-group">
                          <label>التاريخ</label>
                          <input type='text' className="form-control" defaultValue={new Date().toLocaleDateString()} required readOnly />
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

              <div id="deleteStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockItem}>
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
          )
        }
      }
    </detacontext.Consumer>

  )
}

export default StockItem