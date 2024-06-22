import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';

import { detacontext } from '../../../../App';

const Category = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const [categoryName, setcategoryName] = useState('')
  const [mainCategory, setmainCategory] = useState({})
  const [status, setstatus] = useState('')
  const [isMain, setisMain] = useState(false)

  const [categoryId, setcategoryId] = useState('')

  const [allCategory, setallCategory] = useState([])

  const getallCategory = async () => {
    try {
      const res = await axios.get(apiUrl + "/api/category/");
      if (res) {
        const categories = res.data
        setallCategory(categories);
        const filterMain = categories.filter(category => category.isMain === true)[0];
        if (filterMain) {
          setmainCategory(filterMain)
        }
      }
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

  const searchByCategory = (category) => {
    if(category){
      const categories = allCategory ? allCategory.filter((Category) => Category.name.startsWith(category) == true) : []
      setallCategory(categories)
    }else{
      getallCategory()
    }
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
      console.log({allCategory})
      // Initialize a variable to track if all requests are done
      let done = true;
      // Iterate over all categories
      for (let index = 0; index < allCategory.length; index++) {
        const category = allCategory[index];
        const id = category._id;
        const order = category.order;
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

  const handleCategoryChange = async (e) => {
    e.preventDefault()
    const id = e.target.value
    try {
      // Iterate over all categories
      for (let index = 0; index < allCategory.length; index++) {
        const category = allCategory[index];
        if (category.isMain === true) {
          // Send a PUT request to edit the category order
          const edit = await axios.put(`${apiUrl}/api/category/${category._id}`, { isMain: false }, config);
        }
      }

      const mainCategory = await axios.put(`${apiUrl}/api/category/${id}`, { isMain: true }, config);
      // Check if all requests were successful
      if (mainCategory) {
        // Call the function to get all categories
        getallCategory();
        // Display a success toast
        toast.success("تم اختيار التصنيف", {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        throw new Error("حدث خطا اثناء الاختيار ! حاول مره اخري");
      }

    } catch (error) {
      toast.error("فشل في اختيار التصنيف الرئيسي ! حاول مره اخري")
    }
  }



  const createCategory = async (event, setLoading) => {
    event.preventDefault();
    // setLoading(true);

    const categoryData = {
      name: categoryName,
      isMain,
      status,
    };

    console.log({ categoryData })
    try {
      const response = await axios.post(`${apiUrl}/api/category/`, categoryData, config);
      console.log({ response })
      if (response.status === 201) {
        await getallCategory();
        toast.success("تم إنشاء الفئة بنجاح.");
      } else {
        throw new Error("حدث خطأ أثناء إنشاء الفئة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الطلب:", error.message);

      toast.error("حدث خطأ أثناء إنشاء الفئة. الرجاء المحاولة مرة أخرى.", {
        position: toast.POSITION.TOP_RIGHT
      });
    // } finally {
    //   setLoading(false);
    }
  };


  useEffect(() => {
    getallCategory()
  }, [])

  return (
    <detacontext.Consumer>
      {
        ({ allProducts, setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row align-items-center mb-3">
                      <div className="col-sm-4 text-sm-right text-center mb-3 mb-sm-0">
                        <h2>ادارة <b>التصنيفات</b></h2>
                      </div>
                      <div className="col-sm-8 d-flex flex-column flex-sm-row justify-content-between align-items-center">
                        <div className="d-flex flex-column flex-sm-row align-items-center mb-3 mb-sm-0">
                          <a href="#orderCategoryModal" className="btn btn-info mb-2 mb-sm-0 mr-0 mr-sm-2" data-toggle="modal">
                            <i className="material-icons">&#xE164;</i><span>ترتيب</span>
                          </a>
                          <div className="d-flex align-items-center">
                            <label htmlFor="categorySelect" className="mb-0 mr-2" style={{ width: '55%' }}>اختر التصنيف الرئيسي:</label>
                            <select id="categorySelect" className="form-control" style={{ width: '40%' }}
                              onChange={handleCategoryChange}>
                              <option value="">{mainCategory ? mainCategory.name : ""}</option>
                              {allCategory.map((category, index) => (
                                <option key={index} value={category._id}>{category.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="d-flex flex-column flex-sm-row align-items-center">
                          <a href="#addCategoryModal" className="btn btn-success mb-2 mb-sm-0 mr-0 mr-sm-2" data-toggle="modal">
                            <i className="material-icons">&#xE147;</i><span>اضافه تصنيف</span>
                          </a>
                          <a href="#deleteCategoryModal" className="btn btn-danger" data-toggle="modal">
                            <i className="material-icons">&#xE15C;</i><span>حذف</span>
                          </a>
                        </div>
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
                        <button type="button" class="btn btn-47 btn-primary"><i class="fa fa-search"></i></button>
                        <div class="filter-group">
                          <label>اسم التصنيف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByCategory(e.target.value)} />
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
                        <th>الاسم</th>
                        <th>الترتيب</th>
                        <th>الحالة</th>
                        <th>عدد المنتجات</th>
                        <th>بواسطة</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCategory && allCategory.map((category, i) => {
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
                                <td>{category.name}</td>
                                <td>{category.order}</td>
                                <td>{category.status ? "متاحة" : "ليست متاحة"}</td>
                                <td>{allProducts ? allProducts.filter((product) => product.category._id == category._id).length : 0}</td>
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
                    <form onSubmit={(e) => createCategory(e, setisLoadiog)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه تصنيف</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
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
                        <div className="form-group form-group-47">
                          <label>الحالة</label>
                          <select
                            className="form-control"
                            value={status.toString()} // تحويل قيمة status إلى سلسلة نصية
                            onChange={(e) => setstatus(e.target.value === "true")} // تحويل القيمة المحددة إلى قيمة بوليانية
                            style={{ width: "100%" }}
                          >
                            <option >اختر الحالة</option>
                            <option value="true">متاح</option>
                            <option value="false">غير متاح</option>
                          </select>
                        </div>

                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-success" value="اضافه" />
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
                        <div className="form-group form-group-47">
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
                        <div className="form-group form-group-47">
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

                        {/* <div className="form-group form-group-47">
                          <label>
                            <input
                              type="checkbox"
                              checked={isMain}
                              onChange={(e) => setisMain(e.target.checked)}
                            />
                            هل هذا التصنيف الرئيس؟
                          </label>
                        </div> */}
                      </div>

                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-info" value="حفظ" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div id="orderCategoryModal" className="modal fade">
                <div className="modal-dialog ">
                  <div className="modal-content p-1">
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
                            className='btn btn-primary btn btn-sm mb-2 mr-md-2 w-15 w-md-100'>
                            {category.name}
                          </div>
                        ))}
                      </div>
                      <div className="d-flex flex-row">
                        <input type="submit" className="btn btn-47  btn-success btn-block" value="حفظ" />
                        <input type="button" className="btn btn-47  btn-danger btn-block" data-dismiss="modal" value="إغلاق" />
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
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-danger" value="حذف" />
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