import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

import { detacontext } from '../../../../App';


const Products = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };


  const [productname, setproductname] = useState("");
  const [productprice, setproductprice] = useState(0);
  const [productdiscount, setproductdiscount] = useState(0)
  const [productdescription, setproductdescription] = useState("");
  const [productcategoryid, setproductcategoryid] = useState(null);
  const [available, setavailable] = useState();
  const [productimg, setproductimg] = useState("");

  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setsizes] = useState([]);

  const handleCheckboxChange = (e) => {
    setHasSizes(e.target.checked);
  };
  const addSize = () => {
    setsizes([...sizes, { sizeName: '', sizePrice: 0, sizeDiscount: 0, sizePriceAfterDiscount: 0 }])
  }
  const removeSize = (index) => {
    const newsizes = sizes.filter((size, i) => i !== index)
    setsizes([...newsizes])
  }

  const createProduct = async (e) => {
    e.preventDefault();

    try {
      // Prepare request body
      const requestBody = {
        productname: productname,
        productdescription: productdescription,
        productcategoryid: productcategoryid,
        available: available,
      };
  
      // If product has sizes, include sizes in the request body
      if (hasSizes) {
        requestBody.hasSizes = hasSizes;
        requestBody.sizes = sizes;
      }else {
        requestBody.productprice = productprice
        // If product has discount, include discount details in the request body
        if (productdiscount > 0) {
          requestBody.productdiscount = productdiscount;
          const priceAfterDiscount = productprice - productdiscount;
          requestBody.priceAfterDiscount = priceAfterDiscount > 0 ? priceAfterDiscount : 0;
        }
      }


      if (productimg) {
        requestBody.image = productimg;
      }else{
        toast.error('يجب اضافه صوره للمنتج')
        return 
      }
      console.log({ requestBody })

      const response = await axios.post(apiUrl + '/api/product/', requestBody, config);

      if (response.status === 200) {
        getallproducts()
        console.log(response.data);
        toast.success("تم انشاء المنتج بنجاح.");
      } else {
        throw new Error("فشل اضافه المنتج للقائمه !حاول مره اخري.");
      }
    } catch (error) {
      console.error("حدث خطأ اثناء اضافه المنتج !حاول مره اخري:", error);

      // Display error toast notification
      toast.error("Failed to create product. Please try again later.", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file && file.size <= maxSize && allowedTypes.includes(file.type)) {
      setproductimg(file);
    } else {
      let errorMessage = "Invalid file.";

      if (file && !allowedTypes.includes(file.type)) {
        errorMessage = "Invalid file type. Only JPEG, PNG, and GIF are allowed.";
      } else if (file && file.size > maxSize) {
        errorMessage = "Maximum file size exceeded (1 MB). Please select a smaller file.";
      }

      toast.error(errorMessage);
    }
  };

  const [productid, setproductid] = useState("")
  const editProduct = async (e) => {
    e.preventDefault();
    try {
      // Prepare request body
      const requestBody = {
        productname: productname,
        productdescription: productdescription,
        productcategoryid: productcategoryid,
        available: available,
      };
  
      // If product has sizes, include sizes in the request body
      if (hasSizes) {
        requestBody.hasSizes = hasSizes;
        requestBody.sizes = sizes;
      }else {
        requestBody.productprice = productprice
        requestBody.productdiscount = productdiscount;
        const priceAfterDiscount = productprice - productdiscount;
        requestBody.priceAfterDiscount = priceAfterDiscount > 0 ? priceAfterDiscount : 0;


      }


      if (productimg) {
        requestBody.image = productimg;
      }
  
      console.log({requestBody})
      
      // Perform the API request to update the product
      const response = requestBody.image ?
        await axios.put(`${apiUrl}/api/product/${productid}`, requestBody, config)
        : await axios.put(`${apiUrl}/api/product/withoutimage/${productid}`, requestBody, config);
  
      // Handle successful response
      console.log(response.data);
      if (response) {
        // Refresh categories and products after successful update
        getallCategories();
        getallproducts();
  
        // Show success toast
        toast.success('تم تحديث المنتج بنجاح.');
      }
    } catch (error) {
      // Handle errors
      console.log(error);
  
      // Show error toast
      toast.error('حدث خطأ أثناء تحديث المنتج. الرجاء المحاولة مرة أخرى.');
    }
  };



  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/product/');
      const products = await response.data;
      if (products) {
        console.log({ products })
        setlistofProducts(products.reverse())
      }
    } catch (error) {
      console.log(error)
    }

  }

  const [StartDate, setStartDate] = useState(null);
  const [EndDate, setEndDate] = useState(null);

  const calcsalseofproducts = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/order', config);

      if (response.status === 200) {
        const allOrders = response.data;
        console.log({ allOrders });
        const updatedListofProducts = listofProducts.map((pro) => {
          return { ...pro, sales: 0 };
        });
        console.log({ updatedListofProducts })

        const filteredOrders = allOrders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          const startDateObj = new Date(StartDate);
          const endDateObj = new Date(EndDate);

          return (
            orderDate.getFullYear() === startDateObj.getFullYear() &&
            orderDate.getMonth() === startDateObj.getMonth() &&
            orderDate.getDate() >= startDateObj.getDate() &&
            orderDate.getFullYear() === endDateObj.getFullYear() &&
            orderDate.getMonth() === endDateObj.getMonth() &&
            orderDate.getDate() <= endDateObj.getDate()
          );
        });

        console.log({ filteredOrders });

        filteredOrders.forEach((order) => {
          order.products.forEach((product) => {
            updatedListofProducts.forEach((pro) => {
              // console.log({pro})
              if (product.productid === pro._id) {
                pro.sales += product.quantity;
                console.log({ pro })
              }
            });
          });
        });
        setlistofProducts(updatedListofProducts)
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };


  const [productFilterd, setproductFilterd] = useState([])
  const getemployeesByCategory = (category) => {
    const products = listofProducts.filter(product => product.category._id == category)
    setproductFilterd(products)
  }

  const searchByName = (name) => {
    const products = listofProducts.filter((pro) => pro.name.startsWith(name) == true)
    setproductFilterd(products)
  }

  const deleteProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${apiUrl}/api/product/${productid}`, config);
      if (response) {
        console.log(response);
        getallproducts();
      }
    } catch (error) {
      console.log(error)
    }
  }

  const [listofcategories, setlistofcategories] = useState([])
  const getallCategories = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/category/', config);
      const categories = await response.data;
      // console.log(response.data)
      setlistofcategories(categories)
      // console.log(listofcategories)

    } catch (error) {
      console.log(error)
    }
  }




  useEffect(() => {
    getallproducts()
    getallCategories()
    // getallStockItem()
  }, [])


  return (
    <detacontext.Consumer>
      {
        ({ setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive mt-1">
                <div className="table-wrapper p-3 mw-100">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المنتجات</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addProductModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#deleteProductModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter">
                    <div className="container">
                      <div className="row text-dark">
                        <div className="col-md-3">
                          <div className="show-entries">
                            <span>عرض</span>
                            <select className="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
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
                        <div className="col-md-9">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="filter-group">
                                <label>Name</label>
                                <input type="text" className="form-control" onChange={(e) => searchByName(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="filter-group">
                                <label>التصنيف</label>
                                <select className="form-control" onChange={(e) => getemployeesByCategory(e.target.value)} >
                                  <option value={""}>الكل</option>
                                  {listofcategories.map((category, i) => {
                                    return <option value={category._id} key={i} >{category.name}</option>
                                  })}
                                </select>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="row text-dark">
                        <div className="col-md-12">
                          {/* <div className="filter-group"> */}
                          <label>عدد المبيعات في فتره محدده</label>
                          <label>بداية التاريخ</label>
                          <input type="date" className="form-control" onChange={(e) => setStartDate(e.target.value)} />
                          <label>نهاية التاريخ</label>
                          <input type="date" className="form-control" onChange={(e) => setEndDate(e.target.value)} />
                          <button type="button" className="btn btn-47 btn-primary" onClick={calcsalseofproducts}>
                            <i className="fa fa-search"></i> فلتر
                          </button>
                          {/* </div> */}
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
                        <th>الصورة</th>
                        <th>الاسم</th>
                        <th>الوصف</th>
                        <th>التصنيف</th>
                        <th>التكلفة</th>
                        <th>السعر</th>
                        <th>التخفيض</th>
                        <th>بعد التخفيض</th>
                        <th>عدد المبيعات</th>
                        <th>متاح</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productFilterd.length > 0 ?
                        productFilterd.map((p, i) => {
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
                                <td><img src={`${apiUrl}/images/${p.image}`} style={{ "width": "60px", "height": "50px" }} /></td>
                                <td>{p.name}</td>
                                <td>{p.description}</td>
                                <td>{p.category.name}</td>
                                <td>{p.totalcost}</td>
                                <td>{p.price}</td>
                                <td>{p.discount}</td>
                                <td>{p.priceAfterDiscount}</td>
                                <td>{p.sales}</td>
                                <td>{p.available ? 'متاح' : 'غير متاح'}</td>
                                <td>
                                  <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { setproductid(p._id); setproductname(p.name); setproductdescription(p.description); setproductprice(p.price); setproductdiscount(p.discount); setproductcategoryid(p.category); setavailable(p.available); setsizes(p.sizes); setHasSizes(p.hasSizes) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                  {/* <a href="#recipeProductModal" className="edit" data-toggle="modal" onClick={() => { setproductid(p._id) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a> */}

                                  <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => setproductid(p._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                        : listofProducts.map((p, i) => {
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
                                <td><img src={`${apiUrl}/images/${p.image}`} style={{ "width": "60px", "height": "50px" }} /></td>
                                <td>{p.name}</td>
                                <td>{p.description}</td>
                                <td>{p.category.name}</td>
                                <td>{p.totalcost}</td>
                                <td>{p.price}</td>
                                <td>{p.discount}</td>
                                <td>{p.priceAfterDiscount}</td>
                                <td>{p.sales}</td>
                                <td>{p.available ? 'متاح' : 'غير متاح'}</td>
                                <td>
                                  <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { setproductid(p._id); setproductname(p.name); setproductdescription(p.description); setproductprice(p.price); setproductdiscount(p.discount); setproductcategoryid(p.category); setavailable(p.available); setsizes(p.sizes); setHasSizes(p.hasSizes) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  {/* <a href="#recipeProductModal" className="edit" data-toggle="modal" onClick={() => { setproductid(p._id) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a> */}
                                  <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => setproductid(p._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{listofProducts.length > endpagination ? endpagination : listofProducts.length}</b> من <b>{listofProducts.length}</b>عنصر</div>
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
              <div id="addProductModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createProduct}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setproductname(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الوصف</label>
                          <textarea className="form-control" onChange={(e) => setproductdescription(e.target.value)}></textarea>
                        </div>
                        <div className="form-group form-group-47">
                          <label>التصنيف</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setproductcategoryid(e.target.value)}>
                            <option defaultValue={productcategoryid}>اختر تصنيف</option>
                            {listofcategories.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>أحجام المنتج</label>
                          <input type="checkbox" checked={hasSizes} onChange={handleCheckboxChange} />
                        </div>
                        {hasSizes ? (
                          <div className="container">
                            {sizes.map((size, index) => (
                              <div key={index} className="row mb-3">
                                <div className="col-md-4">
                                  <div className="form-group form-group-47" style={{width:'95%'}}>
                                    <label>اسم الحجم</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={size.sizeName}
                                      onChange={(e) =>
                                        setsizes((prevState) => {
                                          const newSizes = [...prevState];
                                          newSizes[index].sizeName = e.target.value;
                                          return newSizes;
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group form-group-47" style={{width:'95%'}}>
                                    <label>السعر</label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={size.sizePrice}
                                        onChange={(e) =>
                                          setsizes((prevState) => {
                                            const newSizes = [...prevState];
                                            newSizes[index].sizePrice = parseFloat(e.target.value);
                                            return newSizes;
                                          })
                                        }
                                      />
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">جنية</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group form-group-47" style={{width:'95%'}}>
                                    <label>التخفيض</label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={size.sizeDiscount}
                                        onChange={(e) =>
                                          setsizes((prevState) => {
                                            const newSizes = [...prevState];
                                            newSizes[index].sizeDiscount = parseFloat(e.target.value);
                                            newSizes[index].sizePriceAfterDiscount = newSizes[index].sizePrice - parseFloat(e.target.value);
                                            return newSizes;
                                          })
                                        }
                                      />
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">جنية</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <button type="button" className="btn btn-47 btn-danger" onClick={() => removeSize(index)}>حذف الحجم</button>
                                </div>
                              </div>
                            ))}

                            <div className="row">
                              <div className="col-md-12">
                                <button type="button" className="btn btn-47 btn-primary" onClick={addSize}>إضافة حجم جديد</button>
                              </div>
                            </div>
                          </div>

                        ) : (
                          <>
                            <div className="form-group form-group-47">
                              <label>السعر</label>
                              <input type='Number' className="form-control" required onChange={(e) => setproductprice(e.target.value)} />
                            </div>
                            <div className="form-group form-group-47">
                              <label>التخفيض</label>
                              <input type='Number' className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].discount : ""} required onChange={(e) => setproductdiscount(e.target.value)} />
                            </div>
                          </>
                        )
                        }
                        <div className="form-group form-group-47">
                          <label>متاح</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setavailable(e.target.value)}>

                            <option defaultValue={available} >اختر الحاله</option>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الصورة</label>
                          <input type="file" className="form-control" onChange={(e) => handleFileUpload(e)} />
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
              <div id="editProductModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editProduct}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>الاسم</label>
                          <input type="text" className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].name : ""} required onChange={(e) => setproductname(e.target.value)} />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الوصف</label>
                          <textarea className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].description : ""} required onChange={(e) => setproductdescription(e.target.value)}></textarea>
                        </div>
                        <div className="form-group form-group-47">
                          <label>التصنيف</label>
                          <select name="category" id="category" form="carform" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].category : ""} onChange={(e) => setproductcategoryid(e.target.value)}>
                            {listofcategories.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>أحجام المنتج</label>
                          <input type="checkbox" checked={hasSizes} onChange={handleCheckboxChange} />
                        </div>
                        {hasSizes ? (
                          <div className="container">
                            {sizes.map((size, index) => (
                              <div key={index} className="row mb-3">
                                <div className="col-md-4">
                                  <div className="form-group form-group-47" style={{width:'95%'}}>
                                    <label>اسم الحجم</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={size.sizeName}
                                      onChange={(e) =>
                                        setsizes((prevState) => {
                                          const newSizes = [...prevState];
                                          newSizes[index].sizeName = e.target.value;
                                          return newSizes;
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group form-group-47" style={{width:'95%'}}>
                                    <label>السعر</label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={size.sizePrice}
                                        onChange={(e) =>
                                          setsizes((prevState) => {
                                            const newSizes = [...prevState];
                                            newSizes[index].sizePrice = parseFloat(e.target.value);
                                            return newSizes;
                                          })
                                        }
                                      />
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">جنية</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group form-group-47" style={{width:'95%'}}>
                                    <label>التخفيض</label>
                                    <div className="input-group">
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={size.sizeDiscount}
                                        onChange={(e) =>
                                          setsizes((prevState) => {
                                            const newSizes = [...prevState];
                                            newSizes[index].sizeDiscount = parseFloat(e.target.value);
                                            newSizes[index].sizePriceAfterDiscount = newSizes[index].sizePrice - parseFloat(e.target.value);
                                            return newSizes;
                                          })
                                        }
                                      />
                                      <div className="input-group-prepend">
                                        <span className="input-group-text">جنية</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <button type="button" className="btn btn-47 btn-danger" onClick={() => removeSize(index)}>حذف الحجم</button>
                                </div>
                              </div>
                            ))}

                            <div className="row">
                              <div className="col-md-12">
                                <button type="button" className="btn btn-47 btn-primary" onClick={addSize}>إضافة حجم جديد</button>
                              </div>
                            </div>
                          </div>

                        ) : (
                          <>
                            <div className="form-group form-group-47">
                              <label>السعر</label>
                              <input type='Number' className="form-control" required onChange={(e) => setproductprice(e.target.value)} />
                            </div>
                            <div className="form-group form-group-47">
                              <label>التخفيض</label>
                              <input type='Number' className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].discount : ""} required onChange={(e) => setproductdiscount(e.target.value)} />
                            </div>
                          </>
                        )
                        }
                        <div className="form-group form-group-47">
                          <label>متاح</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setavailable(e.target.value)}>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الصورة</label>
                          <input type="file" className="form-control" onChange={(e) => handleFileUpload(e)} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-47 btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-47 btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="deleteProductModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteProduct}>
                      <div className="modal-header">
                        <h4 className="modal-title">حذف منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <p>هل انت متاكد من حذف هذا السجل؟</p>
                        <p className="text-warning"><small>لا يمكن الرجوع في هذا الاجراء.</small></p>
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
    </detacontext.Consumer >
  )


}

export default Products