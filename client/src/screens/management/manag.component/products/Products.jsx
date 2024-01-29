import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const Products = () => {

  const [productname, setproductname] = useState("");
  const [productprice, setproductprice] = useState(0);
  const [productdescription, setproductdescription] = useState("");
  const [productcategoryid, setproductcategoryid] = useState(null);
  const [avaliable, setavaliable] = useState();
  const [productimg, setproductimg] = useState("");

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append('productname', productname);
      formdata.append('productprice', productprice);
      formdata.append('productdescription', productdescription);
      formdata.append('productcategoryid', productcategoryid);
      formdata.append('avaliable', avaliable);
      formdata.append('image', productimg);
      console.log(...formdata)

      const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post(`${apiUrl}/api/product/`, formdata, config);
      console.log(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  const [productid, setproductid] = useState("")
  const [productdiscount, setproductdiscount] = useState(null)
  const editProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage

      if (productimg) {
        const formdata = new FormData();
        formdata.append('productname', productname);
        formdata.append('productprice', productprice);
        formdata.append('productdescription', productdescription);
        formdata.append('productcategoryid', productcategoryid);
        formdata.append('productdiscount', productdiscount);
        formdata.append('avaliable', avaliable);
        formdata.append('image', productimg);

        const response = await axios.put(`${apiUrl}/api/product/${productid}`, formdata, {
          headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(response.data);
        if (response) {
          getallCategories();
          getallproducts();
        }
      } else {
        const response = await axios.put(`${apiUrl}/api/product/withoutimage/${productid}`, {
          productname,
          productprice,
          productdescription,
          productcategoryid,
          productdiscount,
          avaliable,
        }, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        console.log(response.data);
        if (response) {
          getallCategories();
          getallproducts();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };



  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/`);
      const products = await response.data;
      // console.log(response.data)
      setlistofProducts(products)
      // console.log(listofProducts)

    } catch (error) {
      console.log(error)
    }

  }

  const [StartDate, setStartDate] = useState(null);
  const [EndDate, setEndDate] = useState(null);

  const calcsalseofproducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/order`);

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
    const products = listofProducts.filter(product => product.category == category)
    setproductFilterd(products)
  }

  const searchByName = (name) => {
    const products = listofProducts.filter((pro) => pro.name.startsWith(name) == true)
    setproductFilterd(products)
  }

  const deleteProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`${apiUrl}/api/product/${productid}`);
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
      const response = await axios.get('https://caviar-api.vercel.app/api/category/');
      const categories = await response.data;
      // console.log(response.data)
      setlistofcategories(categories)
      // console.log(listofcategories)

    } catch (error) {
      console.log(error)
    }
  }


  // const [AllStockItems, setAllStockItems] = useState([]);

  // const getallStockItem = async () => {
  //   try {
  //     const response = await axios.get('https://caviar-api.vercel.app/api/stockitem/');
  //     const StockItems = await response.data;
  //     console.log(response.data)
  //     setAllStockItems(StockItems)

  //   } catch (error) {
  //     console.log(error)
  //   }

  // }

  // const [itemId, setitemId] = useState("")
  // const [name, setname] = useState("")
  // const [amount, setamount] = useState()
  // const [costofitem, setcostofitem] = useState()
  // const [unit, setunit] = useState("")
  // const [totalcostofitem, settotalcostofitem] = useState()

  // const [totalcost, settotalcost] = useState()


  // const [recipe, setrecipe] = useState([{ itemId: '', name: '', amount: 0, costofitem: 0, unit: '', totalcostofitem: 0 }])
  // const [recipe, setrecipe] = useState([])

  // const add = (e) => {
  //   e.preventDefault()
  //   console.log({ itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem })
  //   if (recipe.length > 0){
  //     setrecipe([...recipe, { itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }])
  //   }else{
  //     setrecipe([{ itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }])      
  //   }
  //   console.log(recipe)
  // }

  // const createRecipe = async () => {

  // }


  useEffect(() => {
    getallproducts()
    getallCategories()
    // getallStockItem()
  }, [])


  return (
    <detacontext.Consumer>
      {
        ({ EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
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
                        <a href="#addProductModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#deleteProductModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                            <div className="col-md-4">
                              <div className="filter-group">
                                <label>Name</label>
                                <input type="text" className="form-control" onChange={(e) => searchByName(e.target.value)} />
                              </div>
                            </div>
                            <div className="col-md-4">
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
                            <div className="col-md-4">
                              <div className="filter-group">
                                <label>بداية التاريخ</label>
                                <input type="date" className="form-control" onChange={(e) => setStartDate(e.target.value)} />
                                <label>نهاية التاريخ</label>
                                <input type="date" className="form-control" onChange={(e) => setEndDate(e.target.value)} />
                                <button type="button" className="btn btn-primary" onClick={calcsalseofproducts}>
                                  <i className="fa fa-search"></i> فلتر
                                </button>
                              </div>
                            </div>
                          </div>
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
                                <td><img src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${p.image}`} style={{ "width": "60px", "height": "50px" }} /></td>
                                <td>{p.name}</td>
                                <td>{p.description}</td>
                                <td>{listofcategories.length > 0 ? listofcategories.find(c => c._id == p.category).name : ""}</td>
                                <td>{p.totalcost}</td>
                                <td>{p.price}</td>
                                <td>{p.discount}</td>
                                <td>{p.priceAfterDiscount}</td>
                                <td>{p.sales}</td>
                                <td>{p.avaliable ? 'متاح' : 'غير متاح'}</td>
                                <td>
                                  <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { setproductid(p._id); setproductname(p.name); setproductdescription(p.description); setproductprice(p.price); setproductdiscount(p.discount); setproductcategoryid(p.category) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

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
                                <td><img src={`https://raw.githubusercontent.com/beshoynady/restaurant-api/main/server/images/${p.image}`} style={{ "width": "60px", "height": "50px" }} /></td>
                                <td>{p.name}</td>
                                <td>{p.description}</td>
                                <td>{listofcategories.length > 0 ? listofcategories.find(c => c._id == p.category).name : ""}</td>
                                <td>{p.totalcost}</td>
                                <td>{p.price}</td>
                                <td>{p.discount}</td>
                                <td>{p.priceAfterDiscount}</td>
                                <td>{p.sales}</td>
                                <td>{p.avaliable ? 'متاح' : 'غير متاح'}</td>
                                <td>
                                  <a href="#editProductModal" className="edit" data-toggle="modal" onClick={() => { setproductid(p._id); setproductname(p.name); setproductdescription(p.description); setproductprice(p.price); setproductdiscount(p.discount); setproductcategoryid(p.category) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
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
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" required onChange={(e) => setproductname(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الوصف</label>
                          <textarea className="form-control" required onChange={(e) => setproductdescription(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>السعر</label>
                          <input type='Number' className="form-control" required onChange={(e) => setproductprice(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>التصنيف</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setproductcategoryid(e.target.value)}>
                            {listofcategories.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group">
                          <label>متاح</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setavaliable(e.target.value)}>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الصورة</label>
                          <input type="file" className="form-control" required onChange={(e) => setproductimg(e.target.files[0])} />
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
              <div id="editProductModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editProduct}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type="text" className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].name : ""} required onChange={(e) => setproductname(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>الوصف</label>
                          <textarea className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].description : ""} required onChange={(e) => setproductdescription(e.target.value)}></textarea>
                        </div>
                        <div className="form-group">
                          <label>السعر</label>
                          <input type='Number' className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].price : ""} required onChange={(e) => setproductprice(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>التخفيض</label>
                          <input type='Number' className="form-control" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].discount : ""} required onChange={(e) => setproductdiscount(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>التصنيف</label>
                          <select name="category" id="category" form="carform" defaultValue={listofProducts.filter(p => p._id == productid).length > 0 ? listofProducts.filter(p => p._id == productid)[0].category : ""} onChange={(e) => setproductcategoryid(e.target.value)}>
                            {listofcategories.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group">
                          <label>متاح</label>
                          <select name="category" id="category" form="carform" onChange={(e) => setavaliable(e.target.value)}>
                            <option value={true} >متاح</option>
                            <option value={false} >غير متاح</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>الصورة</label>
                          <input type="file" className="form-control" onChange={(e) => setproductimg(e.target.files[0])} />
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
              {/* <div id="recipeProductModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createRecipe}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل منتج</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <select form="carform" onChange={(e) => { console.log(AllStockItems.find(s => s._id == e.target.value).costOfPart); setitemId(e.target.value); setname(AllStockItems.find(s => s._id == e.target.value).itemName); setunit(AllStockItems.find(s => s._id == e.target.value).smallUnit); setcostofitem(AllStockItems.find(s => s._id == e.target.value).costOfPart) }}>
                            <option >اختر</option>
                            {AllStockItems && AllStockItems.map((item, i) => {
                              return (
                                <option value={item._id} key={i} >{item.itemName}</option>
                              )
                            })
                            }
                          </select>
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" required defaultValue={costofitem} readOnly />
                        </div>
                        <div className="form-group">
                          <label>الكمية</label>
                          <input type="Number" className="form-control" required onChange={(e) => { setamount(e.target.value); settotalcostofitem(e.target.value * costofitem) }} />
                          <input type="text" className="form-control" defaultValue={unit} readOnly required />
                        </div>
                        <div className="form-group">
                          <label>التكلفة الاجمالية</label>
                          <input type='Number' className="form-control" defaultValue={totalcostofitem} required readOnly />
                        </div>
                        <div className="form-group">
                          <button onClick={add}>اضافه جديدة</button>
                        </div>

                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-info" value="Save" />
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
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
    </detacontext.Consumer >
  )


}

export default Products