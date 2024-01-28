import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';


const ProductRecipe = () => {

  const [productid, setproductid] = useState("")
  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/product/');
      const products = await response.data;
      // console.log(response.data)
      setlistofProducts(products)
      // console.log(listofProducts)

    } catch (error) {
      console.log(error)
    }

  }

  const [productFilterd, setproductFilterd] = useState([])
  const getproductByCategory = (category) => {
    const products = listofProducts.filter(product => product.category == category)
    setproductFilterd(products)
  }

  // const searchByName = (name) => {
  //   const products = listofProducts.filter((pro) => pro.name.startsWith(name) == true)
  //   setproductFilterd(products)
  // }


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


  const [AllStockItems, setAllStockItems] = useState([]);

  const getallStockItem = async () => {
    try {
      const response = await axios.get('https://caviar-api.vercel.app/api/stockitem/');
      const StockItems = await response.data;
      console.log(response.data)
      setAllStockItems(StockItems)

    } catch (error) {
      console.log(error)
    }

  }

  const [productRecipe, setproductRecipe] = useState([])
  const [producttotalcost, setproducttotalcost] = useState()
  const getProductRecipe = async (id) => {
    console.log(id)
    const product = await axios.get(`https://caviar-api.vercel.app/api/product/${id}`)
    console.log({ product: product })
    const productRecipe = await product.data.Recipe
    console.log({ productRecipe: productRecipe })

    if (productRecipe) {
      setproductRecipe(productRecipe.reverse())
    }
    const totalProductRecipe = await product.data.totalcost
    if (totalProductRecipe) {
      setproducttotalcost(totalProductRecipe)
    }
  }

  const [itemId, setitemId] = useState("")
  const [name, setname] = useState("")
  const [amount, setamount] = useState()
  const [costofitem, setcostofitem] = useState()
  const [unit, setunit] = useState("")
  const [totalcostofitem, settotalcostofitem] = useState()


  const createRecipe = async (e) => {
    e.preventDefault()
    // console.log(productRecipe)
    const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage

    if (productRecipe.length > 0) {
      const Recipe = [...productRecipe, { itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }]

      const totalcost = Math.round((producttotalcost + totalcostofitem) * 100) / 100;

      const addRecipetoProduct = await axios.put(`https://caviar-api.vercel.app/api/product/addrecipe/${productid}`, { Recipe, totalcost },
        {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        }
      )

      console.log({ addRecipetoProduct: addRecipetoProduct })

      getProductRecipe(productid)
    } else {
      const Recipe = [{ itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }]
      const totalcost = totalcostofitem

      const addRecipetoProduct = await axios.put(`https://caviar-api.vercel.app/api/product/addrecipe/${productid}`, { Recipe, totalcost },
        {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        }
      )
      console.log({ addRecipetoProduct: addRecipetoProduct })
      getProductRecipe(productid)
      setitemId('')
      setname('')
      setamount()
      setunit('')
      setcostofitem()
    }
  }


  const [recipeid, setrecipeid] = useState('')
  const editRecipe = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage
    const getRecipe = productRecipe.find(recipe => recipe._id == recipeid)
    console.log(getRecipe)
    const recipeIndex = productRecipe.findIndex(recipe => recipe === getRecipe)
    console.log(recipeIndex)
    productRecipe[recipeIndex] = { itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }
    console.log(productRecipe)
    let total = 0;

    for (let i = 0; i < productRecipe.length; i++) {
      total += productRecipe[i].totalcostofitem;
    }
    
    const totalcost = Math.round(total * 100) / 100;
    
    console.log({ totalcost: total })
    // productRecipe.map(rec=>totalcost = totalcost + rec.totalcostofitem)
    const editRecipetoProduct = await axios.put(`https://caviar-api.vercel.app/api/product/addrecipe/${productid}`, { Recipe: productRecipe, totalcost },
    {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    }
    )
    getProductRecipe(productid)
    setitemId('')
    setname('')
    setamount()
    setunit('')
    setcostofitem()

  }

  const deleteRecipe = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage
    console.log(productRecipe)
    const newRecipe = productRecipe.filter(recipe => recipe._id != recipeid)
    console.log(newRecipe)
    let total = 0
    for (let i = 0; i < newRecipe.length; i++) {
      total += newRecipe[i].totalcostofitem
    }
    console.log({ totalcost: total })
    // productRecipe.map(rec=>totalcost = totalcost + rec.totalcostofitem)
    const deleteRecipetoProduct = await axios.put(`https://caviar-api.vercel.app/api/product/addrecipe/${productid}`, { Recipe: newRecipe, totalcost: total },
    {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    })
    console.log(deleteRecipetoProduct)
    getProductRecipe(productid)
  }


  useEffect(() => {
    getallproducts()
    getallCategories()
    getallStockItem()
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
                        <h2>ادارة <b>تكاليف الانتاج</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addRecipeModal" className="btn btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#deleteProductModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
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
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <div class="filter-group">
                          <label>التصنيف</label>
                          <select class="form-control" onChange={(e) => getproductByCategory(e.target.value)} >
                            <option value={""}>الكل</option>
                            {listofcategories.map((category, i) => {
                              return <option value={category._id} key={i} >{category.name}</option>
                            })
                            }
                          </select>
                        </div>
                        <div class="filter-group">
                          <label>المنتج</label>
                          <select class="form-control" onChange={(e) => { setproductid(e.target.value); getProductRecipe(e.target.value) }} >
                            <option value={""}>الكل</option>
                            {productFilterd.map((product, i) => {
                              return <option value={product._id} key={i} >{product.name}</option>
                            })
                            }
                          </select>
                        </div>
                        {/* <div class="filter-group">
                          <label>Name</label>
                          <input type="text" class="form-control" onChange={(e) => searchByName(e.target.value)} />
                          <button type="button" class="btn btn-primary"><i class="fa fa-search"></i></button>
                        </div> */}
                        <div class="filter-group">
                          <label>اجمالي التكاليف</label>
                          <input type="Number" class="form-control" readOnly defaultValue={producttotalcost} />
                        </div>
                        {/* <div class="filter-group">
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
                        <th>التكلفة</th>
                        <th>الوحدة</th>
                        <th>الكمية</th>
                        <th>تكلفة المكون</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productRecipe.length > 0 ? productRecipe.map((rec, i) => {
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
                              <td>{rec.name}</td>
                              {/* <td>{AllStockItems.find(item=>item._id == rec.itemId).costOfPart}</td> */}
                              <td>{rec.costofitem}</td>
                              <td>{rec.unit}</td>
                              <td>{rec.amount}</td>
                              <td>{rec.totalcostofitem}</td>
                              <td>
                                <a href="#editRecipeModal" className="edit" data-toggle="modal" onClick={() => {
                                  setrecipeid(rec._id)
                                  setitemId(rec.itemId);
                                  setname(rec.name);
                                  setamount(rec.amount)
                                  setunit(rec.unit)
                                  setcostofitem(rec.costofitem);
                                  settotalcostofitem(rec.settotalcostofitem)
                                }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>

                                <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => { setrecipeid(rec._id) }}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      }) : ''
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
              <div id="addRecipeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={createRecipe}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه مكون</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <select form="carform" onChange={(e) => { setitemId(e.target.value); setname(AllStockItems.find(s => s._id == e.target.value).itemName); setunit(AllStockItems.find(s => s._id == e.target.value).smallUnit); setcostofitem(AllStockItems.find(s => s._id == e.target.value).costOfPart) }}>
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
                        {/* <div className="form-group">
                          <button onClick={add}>اضافه جديدة</button>
                        </div> */}

                      </div>
                      <div className="modal-footer">
                        <input type="button" className="btn btn-danger" data-dismiss="modal" value="إغلاق" />
                        <input type="submit" className="btn btn-success" value="اضافه" />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div id="editRecipeModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={editRecipe}>
                      <div className="modal-header">
                        <h4 className="modal-title">تعديل مكون</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label>الاسم</label>
                          <input type='text' className="form-control" defaultValue={name} readOnly />
                        </div>
                        <div className="form-group">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" required defaultValue={costofitem} readOnly />
                          <input type="text" className="form-control" defaultValue={unit} readOnly required />
                        </div>
                        <div className="form-group">
                          <label>الكمية</label>
                          <input type="Number" className="form-control" defaultValue={amount} required onChange={(e) => { setamount(e.target.value); settotalcostofitem(e.target.value * costofitem) }} />
                        </div>
                        <div className="form-group">
                          <label>التكلفة الاجمالية</label>
                          <input type='Number' className="form-control" defaultValue={totalcostofitem} required readOnly />
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
              <div id="deleteProductModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteRecipe}>
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

export default ProductRecipe