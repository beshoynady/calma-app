import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

import { detacontext } from '../../../../App';

const Category = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const [categoryName, setcategoryName] = useState('')
  const [status, setstatus] = useState('')
  const [isMain, setisMain] = useState(false)

  const [categoryId, setcategoryId] = useState('')

  const [allCategory, setallCategory] = useState([])

  const getallCategory = async () => {
    try {
      const res = await axios.get(apiUrl + "/api/category/");
      setallCategory(res.data);
    } catch (error) {
      if (error.response) {
        console.error("حدث خطأ أثناء استلام البيانات:", error.response.data);
      } else if (error.request) {
        console.error("لم يتم الرد على الطلب:", error.request);
      } else {
        console.error("حدث خطأ أثناء إعداد الطلب:", error.message);
      }
      alert("حدث خطأ أثناء جلب البيانات، يرجى المحاولة مرة أخرى لاحقًا.");
    }
  }


  const handleCategoryData = (category) => {
    setcategoryId(category._id)
    setcategoryName(category.name)
    setstatus(category.status)
    setisMain(category.isMain)
  }


  const createCategory = async (e) => {
    e.preventDefault();

    try {
      const bodydata = {
        name: categoryName,
        isMain,
        status,
      }
      const response = await axios.post(apiUrl + "/api/category/", bodydata, config);

      if (response.status === 200) {
        getallCategory();
        toast.success("تم إنشاء الفئة بنجاح.");
      } else {
        throw new Error("حدث خطأ أثناء إنشاء الفئة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الطلب:", error.message);

      // عرض رسالة الخطأ باستخدام toast
      toast.error("حدث خطأ أثناء إنشاء الفئة. الرجاء المحاولة مرة أخرى.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  // Function to edit a category
  const editCategory = async (e) => {
    e.preventDefault();
    try {
      const bodydata = {
        name: categoryName,
        isMain,
        status,
      }

      // Send a PUT request to edit the category
      const edit = await axios.put(apiUrl + "/api/category/" + categoryId, bodydata, config);
      // Check if the request was successful
      if (edit.status === 200) {
        // Call the function to get all categories
        getallCategory();
        // Display a success toast
        toast.success("تم تعديل التصنيف", {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        throw new Error("Failed to edit category");
      }
    } catch (error) {
      // Handle errors if any exception occurs
      console.error("Error occurred while editing category:", error);

      // Display an error toast
      toast.error("Failed to edit category. Please try again later.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };


  const deleteCategory = async (e) => {
    e.preventDefault()
    try {
      const deleted = await axios.delete(apiUrl + "/api/category/" + categoryId);

      if (deleted.status === 200) {
        getallCategory()
        console.log("Category deleted successfully.");
        toast.success("Category deleted successfully.");
      } else {
        throw new Error("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error occurred while deleting category:", error);

      // Display error toast notification
      toast.error("Failed to delete category. Please try again later.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const [CategoryFilterd, setCategoryFilterd] = useState([])
  const searchByCategory = (category) => {
    const categories = allCategory ? allCategory.filter((Category) => Category.name.startsWith(category) == true) : []
    setCategoryFilterd(categories)
  }



  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newIndex) => {
    const oldIndex = e.dataTransfer.getData('index');
    const draggedCategory = allCategory[oldIndex];

    // Remove the dragged category from its old position
    const updatedCategories = allCategory.filter((_, index) => index != oldIndex);

    // Insert the dragged category at the new position
    updatedCategories.splice(newIndex, 0, draggedCategory);

    // Update the state with the new order
    setallCategory(updatedCategories);
  };


  const handleOrderCategory = async (e) => {
    e.preventDefault();
    try {
      // Initialize a variable to track if all requests are done
      let done = true;
      // Iterate over all categories
      for (let index = 0; index < allCategory.length; index++) {
        const category = allCategory[index];
        const id = category._id;
        const order = index + 1;
        // Send a PUT request to edit the category order
        const edit = await axios.put(`${apiUrl}/api/category/${id}`, { order }, config);
        // If any request fails, set done to false
        if (!edit) {
          done = false;
        }
      }
      // Check if all requests were successful
      if (done) {
        // Call the function to get all categories
        getallCategory();
        // Display a success toast
        toast.success("تم تعديل التصنيف", {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        throw new Error("Failed to edit category");
      }
    } catch (error) {
      // Handle errors if any exception occurs
      console.error("Error occurred while editing category:", error);
      // Display an error toast
      toast.error("Failed to edit category. Please try again later.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };



  useEffect(() => {
    getallCategory()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ allProducts, calcTotalSalesOfCategory, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6 text-right">
                        <h2>ادارة <b>التصنيفات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addCategoryModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه تصنيف</span></a>
                        <a href="#orderCategoryModal" className="btn btn-info" data-toggle="modal"><i className="material-icons">&#xE164;</i><span>ترتيب</span></a>
                        <a href="#deleteCategoryModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                          <label>اسم التصنيف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByCategory(e.target.value)} />
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
                        <th>الرئيسة</th>
                        <th>الحالة</th>
                        <th>عدد المنتجات</th>
                        <th>عدد المنتجات المباعه</th>
                        <th>بواسطة</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CategoryFilterd.length > 0 ?
                        CategoryFilterd.map((category, i) => {
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
                                <td>{category.name}</td>
                                <td>{category.isMain ? "رئيسيه" : "ليست"}</td>
                                <td>{category.status ? "متاحة" : "ليست متاحة"}</td>
                                <td>{allProducts ? allProducts.filter((pro) => pro.category == category._id).length : 0}</td>
                                <td>{calcTotalSalesOfCategory(category._id)}</td>
                                <td>{category.createdBy ? category.createdBy.username : 'غير معروف'}</td>
                                <td>
                                  <a href="#editCategoryModal" className="edit" data-toggle="modal" onClick={() => handleCategoryData(category)}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                  <a href="#deleteCategoryModal" className="delete" data-toggle="modal" onClick={() => setcategoryId(category._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                        : allCategory && allCategory.map((category, i) => {
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
                                <td>{category.name}</td>
                                <td>{category.isMain ? "رئيسيه" : "ليست"}</td>
                                <td>{category.status ? "متاحة" : "ليست متاحة"}</td>
                                <td>{allProducts ? allProducts.filter((pro) => pro.category == category._id).length : 0}</td>
                                <td>{calcTotalSalesOfCategory(category._id)}</td>
                                <td>{category.createdBy ? category.createdBy.username : 'غير معروف'}</td>
                                <td>
                                  <a href="#editCategoryModal" className="edit" data-toggle="modal" onClick={() => handleCategoryData(category)}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                  <a href="#deleteCategoryModal" className="delete" data-toggle="modal" onClick={() => setcategoryId(category._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }

                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{allCategory.length > endpagination ? endpagination : allCategory.length}</b> من <b>{allCategory.length}</b> عنصر</div>
                    <ul className="pagination">
                      <li onClick={EditPagination} className="page-item disabled"><a href="#">السابق</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">1</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">2</a></li>
                      <li onClick={EditPagination} className="page-item true"><a href="#" className="page-link">3</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">4</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">5</a></li>
                      <li onClick={EditPagination} className="page-item"><a href="#" className="page-link">التالي</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="addCategoryModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createCategory}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={categoryName}
                            onChange={(e) => setcategoryName(e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select
                            className="form-control"
                            value={status.toString()} // تحويل قيمة status إلى سلسلة نصية
                            onChange={(e) => setstatus(e.target.value === "true")} // تحويل القيمة المحددة إلى قيمة بوليانية
                            style={{ width: "100%" }}
                          >
                            <option value="true">متاح</option>
                            <option value="false">غير متاح</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={isMain}
                              onChange={(e) => setisMain(e.target.checked)}
                            />
                            هل هذا التصنيف الرئيس؟
                          </label>
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
              <div id="editCategoryModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editCategory}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل التصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={categoryName}
                            onChange={(e) => setcategoryName(e.target.value)}
                            style={{ width: "100%" }}
                          />
                        </div>
                        <div className="form-group">
                          <label>الحالة</label>
                          <select
                            className="form-control"
                            value={status.toString()} // تحويل قيمة status إلى سلسلة نصية
                            onChange={(e) => setstatus(e.target.value === "true")} // تحويل القيمة المحددة إلى قيمة بوليانية
                            style={{ width: "100%" }}
                          >
                            <option value="true">متاح</option>
                            <option value="false">غير متاح</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={isMain}
                              onChange={(e) => setisMain(e.target.checked)}
                            />
                            هل هذا التصنيف الرئيس؟
                          </label>
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
              <div id="orderCategoryModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={handleOrderCategory}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل التصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body d-flex flex-column flex-md-row flex-wrap">
                        {allCategory.map((category, index) => (
                          <div key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className='btn btn-primary btn-sm mb-2 mr-md-2 w-md-100' style={{ width: "23%" }}>
                            {category.name}
                          </div>
                        ))}
                      </div>
                      <div className="modal-footer d-flex flex-row">
                        <div className="col-6">
                          <input type="button" className="btn btn-danger btn-block" data-dismiss="modal" value="إغلاق" />
                        </div>
                        <div className="col-6">
                          <input type="submit" className="btn btn-info btn-block" value="حفظ" />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="deleteCategoryModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteCategory}>
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

export default Category