import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';
import '../orders/Orders.css'



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

  const [phone, setphone] = useState([]);

  const handleAddPhone = () => {
    setphone([...phone, "رقم الموبايل"]);
  };
  const handleNewPhone = (index, e) => {
    const phoneList = [...phone];
    phoneList[index] = e.target.value
    setphone(phoneList)
  }


  const handleDeletePhone = (index) => {
    const phoneList = [...phone];
    phoneList.splice(index, 1);
    setphone(phoneList);
  };

  const [whatsapp, setwhatsapp] = useState('');
  const [email, setemail] = useState('');

  const [address, setAddress] = useState('');


  const [itemsSupplied, setItemsSupplied] = useState([]);

  const handleAddItemsSupplied = () => {
    setItemsSupplied([...itemsSupplied, "اضف خامة"]);
  }
  const handleNewItemsSupplied = (index, e) => {
    const itemsSuppliedList = [...itemsSupplied];
    itemsSuppliedList[index] = e.target.value
    setItemsSupplied(itemsSuppliedList)
  }

  const handleDeleteItemsSupplied = (index) => {
    const itemsSuppliedList = [...itemsSupplied];
    itemsSuppliedList.splice(index, 1);
    setItemsSupplied(itemsSuppliedList);
  };





  const [currentBalance, setCurrentBalance] = useState(0);
  const [notes, setnotes] = useState('');

  const [paymentType, setPaymentType] = useState('');
  const [financialInfo, setFinancialInfo] = useState([{ paymentMethodName: '', accountNumber: '' }]);
  const handleAddfinancialInfo = () => {
    setFinancialInfo([...financialInfo, { paymentMethodName: '', accountNumber: '' }]);
  }
  const handleNewFinancialInfo = (index, key, value) => {
    const financialInfoList = [...financialInfo];
    financialInfoList[index][key] = value;
    setFinancialInfo(financialInfoList);
  };
  const handleDeleteFinancialInfo = (index) => {
    const financialInfoList = [...financialInfo];
    financialInfoList.splice(index, 1);
    setFinancialInfo(financialInfoList);
  };

  // Function to create a Supplier
  const createSupplier = async (e) => {
    e.preventDefault();
    try {
      console.log({ phone, whatsapp, email })
      const supplierData = {
        name,
        contact: { phone, whatsapp, email },
        address,
        paymentType,
        itemsSupplied,
        currentBalance,
        financialInfo,
        notes
      };

      const response = await axios.post(apiUrl + '/api/supplier/', supplierData, config);
      console.log(response.data);
      if (response) {
        // Notify on success
        toast.success('تم إنشاء المورد بنجاح');
        getAllSuppliers()
      }
    } catch (error) {
      console.log(error);

      // Notify on error
      toast.error('فشل في إنشاء المورد');
    }
  }

  //Function to edit a Supplier item

  const updateSupplier = async (e) => {
    e.preventDefault();
    try {
      const updatedSupplierData = {
        name,
        contact: { phone, whatsapp, email },
        address,
        paymentType,
        itemsSupplied,
        currentBalance,
        financialInfo,
        notes
      };
      const response = await axios.put(apiUrl + '/api/supplier/' + supplierId, updatedSupplierData, config);
      console.log(response.data);
      if (response) {
        // Notify on success
        toast.success('تم تحديث المورد بنجاح');
        getAllSuppliers()
      }
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
        getAllSuppliers(); // Update the list of suppliers after deletion

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
      if (suppliers.length > 0) {
        setAllSuppliers(suppliers);
        toast.success('تم استرداد جميع الموردين بنجاح');
      }

      // Notify on success
    } catch (error) {
      console.error(error);

      // Notify on error
      toast.error('فشل في استرداد الموردين');
    }
  };

  const getOneSuppliers = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/supplier/${id}`, config);

      if (!response || !response.data) {
        // Handle unexpected response or empty data
        throw new Error('استجابة غير متوقعة أو بيانات فارغة');
      }

      const supplier = response.data;
      if (supplier) {
        setsupplierId(supplier._id)
        setName(supplier.name)
        setAddress(supplier.address)
        setphone(supplier.contact.phone)
        setwhatsapp(supplier.contact.whatsapp)
        setemail(supplier.contact.email)
        setCurrentBalance(supplier.currentBalance)
        setItemsSupplied(supplier.itemsSupplied)
        setPaymentType(supplier.paymentType)
        setFinancialInfo(supplier.financialInfo)
        setnotes(supplier.notes)
        toast.success('تم استرداد بيانات المورد بنجاح');
      }

      // Notify on success
    } catch (error) {
      console.error(error);

      // Notify on error
      toast.error('فشل في استرداد بيانات المورد');
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


  const searchSupplierByName = (name) => {
    if (!name) {
      getAllSuppliers(); // Reset or get all suppliers if name is empty
      return; // Exit early if name is empty
    }
  
    const findSupplier = AllSuppliers.filter(supplier => supplier.fullname.startsWith(name));
  
    if (findSupplier.length > 0) {
      setAllSuppliers(findSupplier); // Update state with filtered suppliers
    } else {
      setAllSuppliers([]); // Clear the list or show empty state
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
        ({ employeeLoginInfo, usertitle,formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>الموردين</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addSupplierModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        {/* <a href="#deleteStockItemModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
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
                        
                        <div class="filter-group">
                          <label className="col-4 fs-5 text fw-bold ">اسم المورد</label>
                          <input type="text" class="form-control" onChange={(e) => searchSupplierByName(e.target.value)} />
                        </div>
                        {/* <div class="filter-group">
                          <label className="col-4 fs-5 text fw-bold ">نوع الاوردر</label>
                          <select class="form-control" onChange={(e) => searchByaction(e.target.value)} >
                            <option value={""}>الكل</option>
                            <option value="Purchase" >Purchase</option>
                            <option value="Return" >Return</option>
                            <option value="Expense" >Expense</option>
                            <option value="Wastage" >Wastage</option>
                          </select>
                        </div> */}
                        {/* <div class="filter-group">
                          <label className="col-4 fs-5 text fw-bold ">Location</label>
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
                          <label className="col-4 fs-5 text fw-bold ">Status</label>
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
                        <th>الرصيد الحالي</th>
                        <th>العنوان</th>
                        <th>الموبايل</th>
                        <th>الواتس اب</th>
                        <th>الايميل</th>
                        <th>البيانات المالية</th>
                        <th>طريقه الدفع</th>
                        <th>الملاحظات</th>
                        <th>اضيف بواسطه</th>
                        <th>تاريخ الاضافه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AllSuppliers && AllSuppliers.map((supplier, i) => {
                        if (i >= startpagination & i < endpagination) {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{supplier.name}</td>
                              <td>{supplier.itemsSupplied.length > 0 ? supplier.itemsSupplied.map(item => `${item.itemName} - `) : 'لا يوجد'}</td>
                              <td>{supplier.currentBalance}</td>
                              <td>{supplier.address}</td>
                              <td>{supplier.contact.phone.length > 0 ? supplier.contact.phone.map(phone => `${phone} - `) : 'لا يوجد'}</td>
                              <td>{supplier.contact.whatsapp}</td>
                              <td>{supplier.contact.email}</td>
                              <td>{supplier.financialInfo ? supplier.financialInfo.map(financialInfo => `[${financialInfo.paymentMethodName}: ${financialInfo.accountNumber}]`) : 'لا يوجد'}</td>
                              <td>{supplier.paymentType}</td>
                              <td>{supplier.notes}</td>
                              <td>{supplier.createdBy?.fullname}</td>
                              <td>{formatDateTime(supplier.createdAt)}</td>
                              <td>
                                <a href="#editSupplierModal" className="edit" data-toggle="modal" onClick={() => { getOneSuppliers(supplier._id) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteSupplierModal" className="delete" data-toggle="modal" onClick={() => setsupplierId(supplier._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })}
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
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">إضافة مورد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">اسم المورد</label>
                          <input type="text" className="form-control" required onChange={(e) => setName(e.target.value)} />
                        </div>
                        {phone && phone.map((phoneNumber, index) => (
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " key={index}>
                            <label className="col-4 fs-5 text fw-bold ">الموبايل {index + 1}</label>
                            <input type="text" className="form-control" defaultValue={phoneNumber} required onChange={(e) => handleNewPhone(index, e)} />
                            <button type="button" className="btn w-50 btn-danger btn btn-sm" onClick={() => handleDeletePhone(index)}>حذف</button>
                          </div>
                        ))}
                        <button type="button" className="btn w-50 btn-success" onClick={handleAddPhone}>إضافة موبايل</button>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">الواتس اب</label>
                          <input type="text" className="form-control" onChange={(e) => setwhatsapp(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">الايميل</label>
                          <input type="text" className="form-control" onChange={(e) => setemail(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">العنوان</label>
                          <input type="text" className="form-control" required onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">نوع الدفع</label>
                          <select className="form-select" required onChange={(e) => setPaymentType(e.target.value)}>
                            <option value="">اختر...</option>
                            <option value="Cash">كاش</option>
                            <option value="Installments">تقسيط</option>
                          </select>
                        </div>
                        {itemsSupplied.map((item, index) => (
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " key={index}>
                            <label className="col-4 fs-5 text fw-bold ">العنصر المورد {index + 1}</label>
                            <select className="form-select" onChange={(e) => handleNewItemsSupplied(index, e)}>
                              <option value="">اختر...</option>
                              {AllStockItems.map(stockItem => {
                                return <option key={stockItem._id} value={stockItem._id}>{stockItem.itemName}</option>;
                              })}
                            </select>
                            <button type="button" className="btn w-50 btn-danger btn btn-sm" onClick={() => handleDeleteItemsSupplied(index)}>حذف</button>
                          </div>
                        ))}
                        <button type="button" className="btn w-50 btn-success" onClick={handleAddItemsSupplied}>إضافة عنصر مورد</button>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">الرصيد الافتتاحي</label>
                          <input type="number" className="form-control" onChange={(e) => setCurrentBalance(e.target.value)} />
                        </div>
                        {financialInfo.map((info, index) => (
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " key={index}>
                            <label className="col-4 fs-5 text fw-bold ">المعلومات المالية {index + 1}</label>
                            <input type="text" className="form-control" value={info.paymentMethodName} placeholder="اسم وسيلة الدفع" required onChange={(e) => handleNewFinancialInfo(index, 'paymentMethodName', e.target.value)} />
                            <input type="text" className="form-control" value={info.accountNumber} placeholder="رقم الحساب" required onChange={(e) => handleNewFinancialInfo(index, 'accountNumber', e.target.value)} />
                            <button type="button" className="btn w-50 btn-danger btn btn-sm" onClick={() => handleDeleteFinancialInfo(index)}>حذف</button>
                          </div>
                        ))}
                        <button type="button" className="btn w-50 btn-success" onClick={handleAddfinancialInfo}>إضافة معلومات مالية</button>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">ملاحظات</label>
                          <textarea className="form-control" onChange={(e) => setnotes(e.target.value)} />
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn w-50 btn-success" value="إضافة" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="editSupplierModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateSupplier(e)}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">تعديل مورد</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">اسم المورد</label>
                          <input type="text" className="form-control" defaultValue={name}  value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        {phone && phone.map((phoneNumber, index) => (
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " key={index}>
                            <label className="col-4 fs-5 text fw-bold ">الموبايل {index + 1}</label>
                            <input type="text" className="form-control" defaultValue={phoneNumber} onChange={(e) => handleNewPhone(index, e)} />
                            <button type="button" className="btn w-50 btn-danger btn btn-sm" onClick={() => handleDeletePhone(index)}>حذف</button>
                          </div>
                        ))}
                        <button type="button" className="btn w-50 btn-success" onClick={handleAddPhone}>إضافة موبايل</button>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">الواتس اب</label>
                          <input type="text" className="form-control" defaultValue={whatsapp} onChange={(e) => setwhatsapp(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">الايميل</label>
                          <input type="text" className="form-control" defaultValue={email} onChange={(e) => setemail(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">العنوان</label>
                          <input type="text" className="form-control"  defaultValue={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">نوع الدفع</label>
                          <select className="form-select" defaultValue={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                            <option value="">{paymentType === 'Cash' ? 'كاش' : "تقسيط"}</option>
                            <option value="Cash">كاش</option>
                            <option value="Installments">تقسيط</option>
                          </select>
                        </div>
                        {itemsSupplied.map((item, index) => (
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " key={index}>
                            <label className="col-4 fs-5 text fw-bold ">العنصر المورد {index + 1}</label>
                            <select className="form-select" onChange={(e) => handleNewItemsSupplied(index, e)}>
                              <option value="">{item ? item.itemName : ""}</option>
                              {AllStockItems.map(stockItem => {
                                return <option key={stockItem._id} value={stockItem._id}>{stockItem.itemName}</option>;
                              })}
                            </select>
                            <button type="button" className="btn w-50 btn-danger btn btn-sm" onClick={() => handleDeleteItemsSupplied(index)}>حذف</button>
                          </div>
                        ))}
                        <button type="button" className="btn w-50 btn-success" onClick={handleAddItemsSupplied}>إضافة عنصر مورد</button>
                        {financialInfo.map((info, index) => (
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " key={index}>
                            <label className="col-4 fs-5 text fw-bold ">المعلومات المالية {index + 1}</label>
                            <input type="text" className="form-control" defaultValue={info.paymentMethodName} placeholder="اسم وسيلة الدفع"  onChange={(e) => handleNewFinancialInfo(index, 'paymentMethodName', e.target.value)} />
                            <input type="text" className="form-control" defaultValue={info.accountNumber} placeholder="رقم الحساب"  onChange={(e) => handleNewFinancialInfo(index, 'accountNumber', e.target.value)} />
                            <button type="button" className="btn w-50 btn-danger btn btn-sm" onClick={() => handleDeleteFinancialInfo(index)}>حذف</button>
                          </div>
                        ))}
                        <button type="button" className="btn w-50 btn-success" onClick={handleAddfinancialInfo}>إضافة معلومات مالية</button>
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                          <label className="col-4 fs-5 text fw-bold ">ملاحظات</label>
                          <textarea className="form-control" defaultValue={notes} onChange={(e) => setnotes(e.target.value)} />
                        </div>
                      </div>
                      <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
                        <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn w-50 btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>


              <div id="deleteSupplierModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteSupplier}>
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
              </div>
            </div>
          )
        }
      }
    </detacontext.Consumer>

  )
}

export default Suppliers