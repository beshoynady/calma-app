import React, { useState, useEffect, useRef, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import '../orders/Orders.css'

import { detacontext } from '../../../../App';


const Products = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e');
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };

  const { permissionsList,setisLoadiog, EditPagination, startpagination, endpagination, setstartpagination, setendpagination } = useContext(detacontext);



  const [productname, setproductname] = useState("");
  const [productprice, setproductprice] = useState(0);
  const [productdiscount, setproductdiscount] = useState(0)
  const [productdescription, setproductdescription] = useState("");
  const [productcategoryid, setproductcategoryid] = useState(null);
  const [available, setavailable] = useState(false);
  const [productimg, setproductimg] = useState("");

  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setsizes] = useState([]);

  const handleCheckboxChange = (e) => {
    setHasSizes(!hasSizes);
  };

  const handleIsHasExtrasCheckboxChange = (e) => {
    setHasExtras(!hasExtras);
  };

  const handleIsAddonCheckboxChange = (e) => {
    setIsAddon(!isAddon);
  };

  const addSize = () => {
    setsizes([...sizes, { sizeName: '', sizePrice: 0, sizeDiscount: 0, sizePriceAfterDiscount: 0 }]);
  };

  const removeSize = (index) => {
    const newsizes = sizes.filter((size, i) => i !== index);
    setsizes([...newsizes]);
  };


  const [hasExtras, setHasExtras] = useState(false);
  const [isAddon, setIsAddon] = useState(false);
  const [extras, setExtras] = useState([]);

  const addExtra = (extraId) => {
    console.log({ extraId })
    if (extras.includes(extraId)) {
      setExtras(extras.filter((item) => item !== extraId));
    } else {
      setExtras([...extras, extraId]);
    }
  };


  const createProduct = async (e) => {
    e.preventDefault();

    try {
      // إعداد جسم الطلب
      const requestBody = {
        productname: productname,
        productdescription: productdescription,
        productcategoryid: productcategoryid,
        available: available,
        isAddon: isAddon,
      };

      // إضافة الأحجام إلى جسم الطلب إذا كانت موجودة
      if (hasSizes) {
        requestBody.hasSizes = hasSizes;
        requestBody.sizes = sizes;
      } else {
        // تضمين السعر في الطلب إذا لم تكن هناك أحجام
        requestBody.productprice = productprice;

        // تضمين الخصم في الطلب إذا كان موجودا
        if (productdiscount > 0) {
          requestBody.productdiscount = productdiscount;
          const priceAfterDiscount = productprice - productdiscount;
          requestBody.priceAfterDiscount = priceAfterDiscount > 0 ? priceAfterDiscount : 0;
        }
      }

      // إضافة الإضافات إلى جسم الطلب إذا كانت موجودة
      if (hasExtras) {
        requestBody.hasExtras = hasExtras;
        requestBody.extras = extras;
      }

      // التحقق من توفر صورة المنتج
      if (productimg) {
        requestBody.image = productimg;
      }
      // else {
      //   toast.error('يجب إضافة صورة للمنتج');
      //   return;
      // }

      console.log({ requestBody });

      const response = await axios.post(apiUrl + '/api/product/', requestBody, config);
      console.log({ responsecreateproduct: response });

      if (response.status === 201) {
        getallproducts();
        console.log(response.data);
        toast.success("تم إنشاء المنتج بنجاح.");
      } else {
        throw new Error("فشلت عملية إضافة المنتج إلى القائمة! يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إضافة المنتج! يرجى المحاولة مرة أخرى:", error);

      // عرض إشعار الخطأ
      toast.error("فشل إنشاء المنتج. يرجى المحاولة مرة أخرى لاحقًا.", {
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


  const handelEditProductModal = (product) => {
    setproductid(product._id); setproductname(product.name); setproductdescription(product.description);
    setproductprice(product.price); setproductdiscount(product.discount); setproductcategoryid(product.category); setavailable(product.available); setsizes(product.sizes); setHasSizes(product.hasSizes);
    setIsAddon(product.isAddon); setHasExtras(product.hasExtras);
    if (product.hasExtras) {
      const list = product.extras.map(ext => ext._id);
      console.log({ list });
      setExtras(list);
    } else { setExtras([]) }
  }



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
        isAddon: isAddon,
      };

      // If product has sizes, include sizes in the request body
      if (hasSizes) {
        requestBody.hasSizes = hasSizes;
        requestBody.sizes = sizes;
      } else {
        requestBody.productprice = productprice
        requestBody.productdiscount = productdiscount;
        const priceAfterDiscount = productprice - productdiscount;
        requestBody.priceAfterDiscount = priceAfterDiscount > 0 ? priceAfterDiscount : 0;
      }

      if (hasExtras) {
        requestBody.hasExtras = hasExtras;
        requestBody.extras = extras;
      }


      if (productimg) {
        requestBody.image = productimg;
      }

      console.log({ requestBody })

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
  const [listofProductsAddon, setlistofProductsAddon] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/product/');
      if (response) {
        const products = await response.data;
        console.log({ products })
        setlistofProducts(products.reverse())
        const filterAddon = products.filter((product) => product.isAddon === true)
        if (filterAddon.length > 0) {
          setlistofProductsAddon(filterAddon)
        }
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

        filteredOrders.forEach((order) => {
          order.products.forEach((product) => {
            updatedListofProducts.forEach((pro) => {
              // console.log({pro})
              if (product.productid === pro._id) {
                pro.sales += product.quantity;
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


  // const [productFilterd, setproductFilterd] = useState([])
  const getemployeesByCategory = (category) => {
    const products = listofProducts.filter(product => product.category._id == category)
    setlistofProducts(products)
  }

  const searchByName = (name) => {
    const products = listofProducts.filter((pro) => pro.name.startsWith(name) == true)
    setlistofProducts(products)
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
      const response = await axios.get(apiUrl + '/api/menucategory/', config);
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
    <div className="w-100 px-3 d-flex align-itmes-center justify-content-start">
      <div className="table-responsive mt-1">
        <div className="table-wrapper p-3 mw-100">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>ادارة <b>المنتجات</b></h2>
              </div>
              <div className="col-5 d-flex flex-nowrap justify-content-end">
                <a href="#addProductModal" className="btn w-50 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                <a href="#deleteProductModal" className="btn w-50 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
              </div>
            </div>
          </div>
          <div class="table-filter print-hide">
            <div className="container">
              <div className="row text-dark">
                <div className="col-md-3">
                  <div className="show-entries">
                    <span>عرض</span>
                    <select className="form-select" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
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
                      <div className="filter-group d-flex align-items-center justify-content-between">
                        <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الاسم</label>
                        <input type="text" className="form-control" onChange={(e) => searchByName(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="filter-group d-flex align-items-center justify-content-between">
                        <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التصنيف</label>
                        <select className="form-select" onChange={(e) => getemployeesByCategory(e.target.value)} >
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
                <div className="col-md-8">
                  {/* <div className="filter-group d-flex align-items-center justify-content-between"> */}
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">عدد المبيعات في فتره محدده</label>
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">بداية التاريخ</label>
                  <input type="date" className="form-control" onChange={(e) => setStartDate(e.target.value)} />
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">نهاية التاريخ</label>
                  <input type="date" className="form-control" onChange={(e) => setEndDate(e.target.value)} />
                  <button type="button" className="btn w-50 btn-primary" onClick={calcsalseofproducts}>
                    <i className="fa fa-search"></i> فلتر
                  </button>
                  {/* </div> */}
                </div>
                <div className="col-md-8">
                  <button type="button" className="btn w-50 btn-primary" onClick={getallproducts}>
                    حذف الفلتر
                  </button>

                </div>
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
                <th>الصورة</th>
                <th>الاسم</th>
                <th>الوصف</th>
                <th>التصنيف</th>
                <th>الاحجام</th>
                <th>الاضافات</th>
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
              {

                listofProducts && listofProducts.map((product, i) => {
                  if (i >= startpagination && i < endpagination) {
                    return (
                      <React.Fragment key={i}>
                        <tr>
                          {/* <td>
            <span className="custom-checkbox">
              <input type="checkbox" id={`checkbox${i}`} name="options[]" value="1" />
              <label htmlFor={`checkbox${i}`}></label>
            </span>
          </td> */}
                          <td>{i + 1}</td>
                          <td><img src={`${apiUrl}/images/${product.image}`} style={{ width: "60px", height: "50px" }} /></td>
                          <td>{product.name}</td>
                          <td>{product.description}</td>
                          <td>{product.category.name}</td>
                          <td>{product.sizes.length}</td>
                          <td>{product.extras.length}</td>
                          <td>{product.totalcost}</td>
                          <td>{product.price}</td>
                          <td>{product.discount}</td>
                          <td>{product.priceAfterDiscount}</td>
                          <td>{product.sales ? product.sales : 0}</td>
                          <td>{product.available ? 'متاح' : 'غير متاح'}</td>
                          <td>
                            <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { handelEditProductModal(product) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                            <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => setproductid(product._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                          </td>
                        </tr>
                        {product.sizes.length > 0 && product.sizes.map((size, j) => (
                          <tr key={j + i}>
                            {/* <td>
              <span className="custom-checkbox">
                <input type="checkbox" id={`checkbox${j + i}`} name="options[]" value="1" />
                <label htmlFor={`checkbox${j + i}`}></label>
              </span>
            </td> */}
                            <td>{i + 1}</td>
                            <td>
                              {/* <img src={`${apiUrl}/images/${product.image}`} style={{ width: "60px", height: "50px" }} /> */}
                            </td>
                            <td>{size.sizeName}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{size.sizeCost}</td>
                            <td>{size.sizePrice}</td>
                            <td>{size.sizeDiscount}</td>
                            <td>{size.sizePriceAfterDiscount}</td>
                            <td>{size.sales ? size.sales : 0}</td>
                            <td></td>
                            <td>
                              {/* <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { handelEditProductModal(product) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
              <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => setproductid(product._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a> */}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
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
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">اضافه منتج</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الاسم</label>
                  <input type="text" className="form-control" required onChange={(e) => setproductname(e.target.value)} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الوصف</label>
                  <textarea className="form-control" onChange={(e) => setproductdescription(e.target.value)}></textarea>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التصنيف</label>
                  <select name="category" id="category" form="carform" onChange={(e) => setproductcategoryid(e.target.value)}>
                    <option defaultValue={productcategoryid}>اختر تصنيف</option>
                    {listofcategories.map((category, i) => {
                      return <option value={category._id} key={i} >{category.name}</option>
                    })
                    }
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">أحجام المنتج</label>
                  <input type="checkbox" checked={hasSizes} onChange={handleCheckboxChange} />
                </div>
                {hasSizes ? (
                  <div className="container">
                    {sizes.map((size, index) => (
                      <div key={index} className="row mb-3">
                        <div className="col-md-4">
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " style={{ width: '95%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">اسم الحجم</label>
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
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " style={{ width: '95%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">السعر</label>
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
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " style={{ width: '95%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التخفيض</label>
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
                          <button type="button" className="btn w-50 btn-danger" onClick={() => removeSize(index)}>حذف الحجم</button>
                        </div>
                      </div>
                    ))}

                    <div className="row">
                      <div className="col-md-12">
                        <button type="button" className="btn w-50 btn-primary" onClick={addSize}>إضافة حجم جديد</button>
                      </div>
                    </div>
                  </div>

                ) : (
                  <>
                    <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                      <label className="col-4 fs-4 text-wrap text-right fw-bolder ">السعر</label>
                      <input type='number' className="form-control" required onChange={(e) => setproductprice(e.target.value)} />
                    </div>
                    <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                      <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التخفيض</label>
                      <input type='number' className="form-control" defaultValue={listofProducts.filter(product => product._id == productid).length > 0 ? listofProducts.filter(product => product._id == productid)[0].discount : ""} required onChange={(e) => setproductdiscount(e.target.value)} />
                    </div>
                  </>
                )
                }
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">هل هذا المنتج اضافه</label>
                  <input type="checkbox" checked={isAddon} onChange={handleIsAddonCheckboxChange} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">هل له اضافات</label>
                  <input type="checkbox" checked={hasExtras} onChange={handleIsHasExtrasCheckboxChange} />
                </div>
                {hasExtras &&
                  <div className="form-group " style={{ fontSize: '16px', fontWeight: '900' }}>
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder ">اختر الاضافات</label>
                    {listofProductsAddon.length > 0 ?
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="form-group d-flex flex-wrap">
                            {listofProductsAddon && listofProductsAddon.map((ProductsAddon, i) => (
                              <div className="form-check form-check-flat mb-2 mr-4 d-flex align-items-center" key={i} style={{ minWidth: "200px" }}>
                                <input
                                  style={{ fontSize: '16px', border: '2px solid red' }}
                                  type="checkbox"
                                  className="form-check-input"
                                  value={ProductsAddon._id}
                                  checked={extras.includes(ProductsAddon._id)}
                                  onChange={(e) => addExtra(e.target.value)}
                                />
                                <label className="form-check-label mr-4" style={{ cursor: 'pointer' }} onClick={(e) => addExtra(ProductsAddon._id)}>{ProductsAddon.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      : <input type="text" className="form-control" value='لا يوجد اي اضافات' />
                    }
                  </div>
                }
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">متاح</label>
                  <select name="category" id="category" form="carform" onChange={(e) => setavailable(e.target.value)}>

                    <option defaultValue={available} >اختر الحاله</option>
                    <option value={true} >متاح</option>
                    <option value={false} >غير متاح</option>
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الصورة</label>
                  <input type="file" className="form-control" onChange={(e) => handleFileUpload(e)} />
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
      <div id="editProductModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={editProduct}>
              <div className="modal-header text-light bg-primary">
                <h4 className="modal-title">تعديل منتج</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الاسم</label>
                  <input type="text" className="form-control" defaultValue={listofProducts.filter(product => product._id == productid).length > 0 ? listofProducts.filter(product => product._id == productid)[0].name : ""} required onChange={(e) => setproductname(e.target.value)} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الوصف</label>
                  <textarea className="form-control" defaultValue={listofProducts.filter(product => product._id == productid).length > 0 ? listofProducts.filter(product => product._id == productid)[0].description : ""} required onChange={(e) => setproductdescription(e.target.value)}></textarea>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التصنيف</label>
                  <select name="category" id="category" form="carform" defaultValue={listofProducts.filter(product => product._id == productid).length > 0 ? listofProducts.filter(product => product._id == productid)[0].category : ""} onChange={(e) => setproductcategoryid(e.target.value)}>
                    {listofcategories.map((category, i) => {
                      return <option value={category._id} key={i} >{category.name}</option>
                    })
                    }
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">أحجام المنتج</label>
                  <input type="checkbox" checked={hasSizes} onChange={handleCheckboxChange} />
                </div>
                {hasSizes ? (
                  <div className="container">
                    {sizes.map((size, index) => (
                      <div key={index} className="row mb-3">
                        <div className="col-md-4">
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " style={{ width: '95%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">اسم الحجم</label>
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
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " style={{ width: '95%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">السعر</label>
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
                          <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 " style={{ width: '95%' }}>
                            <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التخفيض</label>
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
                          <button type="button" className="btn w-50 btn-danger" onClick={() => removeSize(index)}>حذف الحجم</button>
                        </div>
                      </div>
                    ))}

                    <div className="row">
                      <div className="col-md-12">
                        <button type="button" className="btn w-50 btn-primary" onClick={addSize}>إضافة حجم جديد</button>
                      </div>
                    </div>
                  </div>

                ) : (
                  <>
                    <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                      <label className="col-4 fs-4 text-wrap text-right fw-bolder ">السعر</label>
                      <input type='number' className="form-control" defaultValue={productprice} placeholder={productprice} required onChange={(e) => setproductprice(e.target.value)} />
                    </div>
                    <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                      <label className="col-4 fs-4 text-wrap text-right fw-bolder ">التخفيض</label>
                      <input type='number' className="form-control" defaultValue={productdiscount} placeholder={productdiscount} required onChange={(e) => setproductdiscount(e.target.value)} />
                    </div>
                  </>
                )
                }
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">هل هذا المنتج اضافه</label>
                  <input type="checkbox" checked={isAddon} onChange={handleIsAddonCheckboxChange} />
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">هل له اضافات</label>
                  <input type="checkbox" checked={hasExtras} onChange={handleIsHasExtrasCheckboxChange} />
                </div>
                {hasExtras &&
                  <div className="form-group " style={{ fontSize: '16px', fontWeight: '900' }}>
                    <label className="col-4 fs-4 text-wrap text-right fw-bolder ">اختر الاضافات</label>
                    {listofProductsAddon.length > 0 ?
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="form-group d-flex flex-wrap" >
                            {listofProductsAddon && listofProductsAddon.map((ProductsAddon, i) => (
                              <div className="form-check form-check-flat mb-2 mr-4 d-flex align-items-center" key={i} style={{ minWidth: "200px" }}>
                                <input
                                  style={{ fontSize: '16px', border: '2px solid red' }}
                                  type="checkbox"
                                  className="form-check-input"
                                  value={ProductsAddon._id}
                                  checked={extras.includes(ProductsAddon._id)}
                                  onChange={(e) => addExtra(e.target.value)}
                                />
                                <label className="form-check-label mr-4" style={{ cursor: 'pointer' }} onClick={(e) => addExtra(ProductsAddon._id)}>{ProductsAddon.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      : <input type="text" className="form-control" value='لا يوجد اي اضافات' />
                    }
                  </div>
                }
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">متاح</label>
                  <select name="category" id="category" form="carform" onChange={(e) => setavailable(e.target.value)}>
                    <option value={true} >متاح</option>
                    <option value={false} >غير متاح</option>
                  </select>
                </div>
                <div className="form-group w-100 h-auto px-3 d-flex align-itmes-center justify-content-start col-12  col-md-6 ">
                  <label className="col-4 fs-4 text-wrap text-right fw-bolder ">الصورة</label>
                  <input type="file" className="form-control" onChange={(e) => handleFileUpload(e)} />
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

      <div id="deleteProductModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={deleteProduct}>
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
  )


}

export default Products