import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';



const Suppliers = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const [supplierId, setsupplierId] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [itemsSupplied, setItemsSupplied] = useState('');
  const [openingBalance, setopeningBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [financialInfo, setFinancialInfo] = useState('');


  // Function to create a Supplier
  const createSupplier = async (e) => {
    e.preventDefault();
    try {
      const supplierData = {
        name,
        contact,
        address,
        paymentType,
        itemsSupplied,
        openingBalance,
        currentBalance,
        financialInfo
      };

      const response = await axios.post(apiUrl + '/api/supplier/', supplierData, config);
      console.log(response.data);

      // Notify on success
      toast.success('تم إنشاء المورد بنجاح');
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في إنشاء المورد');
    }
  }

  // Function to edit a stock item
  const updateSupplier = async (e) => {
    e.preventDefault();
    try {
      const updatedSupplierData = {
        name,
        contact,
        address,
        paymentType,
        itemsSupplied,
        openingBalance,
        currentBalance,
        financialInfo
      };
      const response = await axios.put(apiUrl + '/api/supplier/' + supplierId, updatedSupplierData, config);
      console.log(response.data);

      // Notify on success
      toast.success('تم تحديث المورد بنجاح');
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في تحديث المورد');
    }
  };


  // Function to delete a supplier
  const deleteSupplier = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.delete(`${apiUrl}/api/supplier/${supplierId}`, config);
      if (response.status === 200) {
        console.log(response);
        // Optionally, you may want to update the list of suppliers after deletion
        // getSuppliers(); // Update the list of suppliers after deletion

        // Notify on success
        toast.success('تم حذف المورد بنجاح');
      }
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في حذف المورد');
    }
  };

  const [AllSuppliers, setAllSuppliers] = useState([]);
  // Function to retrieve all suppliers
  const getAllSuppliers = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/supplier/', config);

      if (!response || !response.data) {
        // Handle unexpected response or empty data
        throw new Error('استجابة غير متوقعة أو بيانات فارغة');
      }

      const suppliers = response.data.reverse();
      setAllSuppliers(suppliers);

      // Notify on success
      toast.success('تم استرداد جميع الموردين بنجاح');
    } catch (error) {
      console.error(error);

      // Notify on error
      toast.error('فشل في استرداد الموردين');
    }
  };


  const [AllStockItems, setAllStockItems] = useState([]);

  // Function to retrieve all stock items
  const getStockItems = async () => {
    try {

      const response = await axios.get(apiUrl + '/api/stockitem/', config);

      if (!response || !response.data) {
        // Handle unexpected response or empty data
        throw new Error('استجابة غير متوقعة أو بيانات فارغة');
      }

      const stockItems = response.data.reverse();
      setAllStockItems(stockItems);

      // Notify on success
      toast.success('تم استرداد عناصر المخزون بنجاح');
    } catch (error) {
      console.error(error);

      // Notify on error
      toast.error('فشل في استرداد عناصر المخزون');
    }
  };


  const [AllCategoryStock, setAllCategoryStock] = useState([]);

  // Function to retrieve all category stock
  const getAllCategoryStock = async () => {
    try {
      const res = await axios.get(apiUrl + '/api/categoryStock/', config);
      setAllCategoryStock(res.data);
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في استرداد فئة المخزون');
    }
  };



  useEffect(() => {
    getAllSuppliers()
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
                        <h2>ادارة <b>الموردين</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addSupplierModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

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
                        <th>الاسم</th>
                        <th>الاصناف</th>
                        <th>الرصيد الافتتاحي</th>
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
                      {/* {AllStockItems && AllStockItems.map((item, i) => {
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
                      })} */}
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{AllSuppliers.length > endpagination ? endpagination : AllSuppliers.length}</b> من <b>{AllSuppliers.length}</b> عنصر</div>
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


              <div id="addSupplierModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createSupplier}>
                      <div className="modal-header">
                        <h4 className="modal-title">إضافة مورد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>اسم المورد</label>
                          <input type="text" className="form-control" required onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>معلومات الاتصال</label>
                          <input type="text" className="form-control" required onChange={(e) => setContact(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <input type="text" className="form-control" required onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>نوع الدفع</label>
                          <input type="text" className="form-control" required onChange={(e) => setPaymentType(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>العناصر الموردة</label>
                          <input type="text" className="form-control" required onChange={(e) => setItemsSupplied(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرصيد الافتتاحي</label>
                          <input type="number" className="form-control" required onChange={(e) => setOpeningBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرصيد الحالي</label>
                          <input type="number" className="form-control" required onChange={(e) => setCurrentBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>المعلومات المالية</label>
                          <input type="text" className="form-control" required onChange={(e) => setFinancialInfo(e.target.value)} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="إضافة" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>



              <div id="editStockItemModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateSupplier(e)}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>اسم المورد</label>
                          <input type="text" className="form-control" required onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>معلومات الاتصال</label>
                          <input type="text" className="form-control" required onChange={(e) => setContact(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>العنوان</label>
                          <input type="text" className="form-control" required onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>نوع الدفع</label>
                          <input type="text" className="form-control" required onChange={(e) => setPaymentType(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>العناصر الموردة</label>
                          <input type="text" className="form-control" required onChange={(e) => setItemsSupplied(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرصيد الافتتاحي</label>
                          <input type="number" className="form-control" required onChange={(e) => setOpeningBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الرصيد الحالي</label>
                          <input type="number" className="form-control" required onChange={(e) => setCurrentBalance(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>المعلومات المالية</label>
                          <input type="text" className="form-control" required onChange={(e) => setFinancialInfo(e.target.value)} />
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
                    <form onSubmit={deleteSupplier}>
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

export default Suppliers