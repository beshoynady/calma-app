import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { detacontext } from '../../../../App';

const CategoryStock = () => {
  const [categoryStockname, setcategoryStockname] = useState('')
  const [categoryStockId, setcategoryStockId] = useState('')

  const [allCategoryStock, setallCategoryStock] = useState([])

  const getallCategoryStock = async () => {
    const res = await axios.get("https://caviar-api.vercel.app/api/categoryStock/");
    setallCategoryStock(res.data.reverse())
  }

  const [AllStockItems, setAllStockItems] = useState([]);

  const getallStockItem = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/stockitem/');
      const StockItems = await response.data.reverse();
      console.log(response.data)
      setAllStockItems(StockItems)

    } catch (error) {
      console.log(error)
    }

  }


  const createCategoryStock = async () => {
    try {
      const send = await axios.post("https://caviar-api.vercel.app/api/categoryStock/", { name: categoryStockname });
      getallCategoryStock()
    } catch (error) {
      console.log(error)
    }
  }


  const editCategoryStock = async (e) => {
    e.preventDefault();
    console.log(categoryStockId)
    try {
      const edit = await axios.put("https://caviar-api.vercel.app/api/categoryStock/" + categoryStockId, { name: categoryStockname })
      console.log(edit)
      getallCategoryStock()
    } catch (error) {
      console.log(error)
    }
  }
  const deleteCategoryStock = async () => {
    try {
      const deleted = await axios.delete("https://caviar-api.vercel.app/api/categoryStock/" + categoryStockId)
      console.log(categoryStockId)
      console.log(deleted)
    } catch (error) {
      console.log(error)
    }
  }

  const [CategoryStockFilterd, setCategoryStockFilterd] = useState([])
  const searchByCategoryStock = (CategoryStock) => {
    const categories = allCategoryStock.filter((Category) => Category.name.startsWith(CategoryStock)== true)
    setCategoryStockFilterd(categories)
  }


  useEffect(() => {
    getallCategoryStock()
    getallStockItem()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({EditPagination, startpagination,endpagination,setstartpagination,setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>Manage <b>CategoryStocks</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addCategoryStockModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه تصنيف</span></a>
                        <a href="#deleteCategoryStockModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                        <div class="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByCategoryStock(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div>
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
                        <th>الاسم</th>
                        <th>عدد المنتجات</th>
                        <th>اجراءات</th>
                      </tr>
                      
                    </thead>
                    <tbody>
                      {CategoryStockFilterd.length>0? CategoryStockFilterd.map((categoryStock, i) => {
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
                              <td>{categoryStock.name}</td>
                              <td>{AllStockItems ? AllStockItems.filter((Items) => Items.categoryId == categoryStock._id).length : 0}</td>
                              <td>
                                <a href="#editCategoryStockModal" className="edit" data-toggle="modal" onClick={() => setcategoryStockId(categoryStock._id)}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                <a href="#deleteCategoryStockModal" className="delete" data-toggle="modal" onClick={() => setcategoryStockId(categoryStock._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })
                      :allCategoryStock.map((categoryStock, i) => {
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
                              <td>{categoryStock.name}</td>
                              <td>{AllStockItems ? AllStockItems.filter((Items) => Items.categoryId == categoryStock._id).length : 0}</td>
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
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setcategoryStockname(e.target.value)} />
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
              <div id="editCategoryStockModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editCategoryStock}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل التصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setcategoryStockname(e.target.value)} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteCategoryStockModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteCategoryStock}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا التصنيف?</p>
                        <p className="text-warning"><small>لا يمكن الرجوع فيه.</small></p>
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

export default CategoryStock