import React, { useState, useEffect ,useContext} from 'react'
import axios from 'axios';
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';
import '../orders/Orders.css'


const CategoryStock = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const { permissionsList, setStartDate, setEndDate, filterByDateRange, filterByTime, employeeLoginInfo, usertitle, formatDate, formatDateTime, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext)


  
  const [categoryStockname, setcategoryStockname] = useState('')
  const [categoryStockId, setcategoryStockId] = useState('')

  const [allCategoryStock, setallCategoryStock] = useState([])

  const getallCategoryStock = async () => {

    try {
      const response = await axios.get(apiUrl + "/api/categoryStock/", config);
      setallCategoryStock(response.data.reverse());
    } catch (error) {
      console.error('Error fetching category stock:', error);
    }
  }


  const [AllStockItems, setAllStockItems] = useState([]);

  const getallStockItem = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/stockitem/', config);
      const StockItems = await response.data.reverse();
      console.log(response.data)
      setAllStockItems(StockItems)

    } catch (error) {
      console.log(error)
    }

  }


  const createCategoryStock = async (e) => {
    e.preventDefault()
    try {
      // Validate category stock name
      if (!categoryStockname.trim()) {
        throw new Error("اسم التصنيف مطلوب");
      }

      const response = await axios.post(apiUrl + "/api/categoryStock/", { name: categoryStockname });

      // Check if the response indicates success
      if (response) {
        // Update the list of category stocks after successfully creating a new one
        getallCategoryStock();

        // Display success toast message
        toast.success("تم إنشاء التصنيف بنجاح");
      } else {
        throw new Error("حدث خطأ أثناء إنشاء التصنيف. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      // Log the error
      console.error("Error creating category stock:", error);

      // Display error toast message
      toast.error(error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    }
  }



  const editCategoryStock = async (e) => {
    e.preventDefault();
    // console.log(categoryStockId); // Log the category stock ID
    try {
      // Attempt to send a PUT request to update the category stock
      const edit = await axios.put(apiUrl + "/api/categoryStock/" + categoryStockId, { name: categoryStockname });
      console.log(edit); // Log the response from the server
      getallCategoryStock(); // Fetch updated category stock data
      getallStockItem(); // Fetch updated stock item data
      // Display success toast message
      toast.success("تم تعديل التصنيف بنجاح");
    } catch (error) {
      console.log(error); // Log any errors that occur
      // Display error toast message
      toast.error("حدث خطأ أثناء تعديل التصنيف. يرجى المحاولة مرة أخرى.");
    }
  }


  const deleteCategoryStock = async (e) => {
    e.preventDefault();

    try {
      // Attempt to send a DELETE request to delete the category stock
      const deleted = await axios.delete(apiUrl + "/api/categoryStock/" + categoryStockId);
      // console.log(categoryStockId); // Log the category stock ID
      // console.log(deleted); // Log the response from the server

      if (deleted) {
        getallCategoryStock(); // Fetch updated category stock data
        getallStockItem(); // Fetch updated stock item data
        // Display success toast message
        toast.success("تم حذف التصنيف بنجاح");
      }
    } catch (error) {
      console.log(error); // Log any errors that occur
      // Display error toast message
      toast.error("حدث خطأ أثناء حذف التصنيف. يرجى المحاولة مرة أخرى.");
    }
  }


  const searchByCategoryStock = (CategoryStock) => {
    if(!CategoryStock){
      getallCategoryStock()
      return
    }
    const categories = allCategoryStock.filter((Category) => Category.name.startsWith(CategoryStock) == true)
    setAllStockItems(categories)
  }


  useEffect(() => {
    getallStockItem()
    getallCategoryStock()
  }, [])

          return (
            <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row ">
                      <div className="col-sm-6 text-right">
                        <h2>إدارة <b>المخازن</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addCategoryStockModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه تصنيف</span></a>
                        {/* <a href="#deleteCategoryStockModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a> */}
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
                          <label className="col-4 fs-5 text fw-bold ">اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByCategoryStock(e.target.value)} />
                          
                        </div>
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
                        {/* <th>
                          <span className="custom-checkbox">
                            <input type="checkbox" id="selectAll" />
                            <label htmlFor="selectAll"></label>
                          </span>
                        </th> */}
                        <th>م</th>
                        <th>الاسم</th>
                        <th>عدد المنتجات</th>
                        <th>اضيف في</th>
                        <th>اجراءات</th>
                      </tr>

                    </thead>
                    <tbody>
                      { allCategoryStock.map((categoryStock, i) => {
                          if (i >= startpagination & i < endpagination) {
                            return (
                              <tr key={i}>
                                {/* <td>
                                <span className="custom-checkbox">
                                  <input type="checkbox" id="checkbox1" name="options[]" value="1" />
                                  <label htmlFor="checkbox1"></label>
                                </span>
                              </td> */}
                                <td>{i + 1}</td>
                                <td>{categoryStock.name}</td>
                                <td>{AllStockItems ? AllStockItems.filter((Item) => Item.categoryId._id === categoryStock._id).length : 0}</td>
                                <td>{formatDateTime(categoryStock.createdAt)}</td>
                                <td>
                                  <a href="#editCategoryStockModal" className="edit" data-toggle="modal" onClick={() => setcategoryStockId(categoryStock._id)}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                  <a href="#deleteCategoryStockModal" className="delete" data-toggle="modal" onClick={() => setcategoryStockId(categoryStock._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })}

                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{allCategoryStock.length > endpagination ? endpagination : allCategoryStock.length}</b> من <b>{allCategoryStock.length}</b> عنصر</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item active"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="addCategoryStockModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createCategoryStock}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">اضافه تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12 ">
                          <label className="col-4 fs-5 text fw-bold ">الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setcategoryStockname(e.target.value)} />
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
              <div id="editCategoryStockModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editCategoryStock}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">تعديل التصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12 ">
                          <label className="col-4 fs-5 text fw-bold ">الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setcategoryStockname(e.target.value)} />
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
              <div id="deleteCategoryStockModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteCategoryStock}>
                      <div className="modal-header text-light bg-primary">
                        <h4 className="modal-title">حذف تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا التصنيف?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
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

export default CategoryStock