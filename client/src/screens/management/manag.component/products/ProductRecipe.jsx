import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App';
import { toast } from 'react-toastify';


const ProductRecipe = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [listofProducts, setlistofProducts] = useState([]);

  const getallproducts = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/product/');
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
      const response = await axios.get(apiUrl + '/api/category/');
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
      const response = await axios.get(apiUrl + '/api/stockitem/');
      const StockItems = await response.data;
      console.log(response.data)
      setAllStockItems(StockItems)

    } catch (error) {
      console.log(error)
    }

  }

  // const getProductRecipe = async (id) => {
  //   console.log(id)
  //   const product = await axios.get(`${apiUrl}/api/product/${id}`)
  //   console.log({ product: product })
  //   const productRecipe = await product.data.Recipe
  //   console.log({ productRecipe: productRecipe })

  //   if (productRecipe) {
  //     setingredients(productRecipe.reverse())
  //   }
  //   const totalProductRecipe = await product.data.totalcost
  //   if (totalProductRecipe) {
  //     setproducttotalcost(totalProductRecipe)
  //   }
  // }

  // const createRecipe = async (e) => {
  //   e.preventDefault()
  //   // console.log(productRecipe)
  //   const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage

  //   if (productRecipe.length > 0) {
  //     const Recipe = [...productRecipe, { itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }]

  //     const totalcost = Math.round((producttotalcost + totalcostofitem) * 100) / 100;

  //     const addRecipetoProduct = await axios.put(`${apiUrl}/api/recipe/${productid}`, { Recipe, totalcost },
  //       {
  //         headers: {
  //           'authorization': `Bearer ${token}`,
  //         },
  //       }
  //     )

  //     console.log({ addRecipetoProduct: addRecipetoProduct })

  //     getProductRecipe(productid)
  //   } else {
  //     const Recipe = [{ itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }]
  //     const totalcost = totalcostofitem

  //     const addRecipetoProduct = await axios.put(`${apiUrl}/api/product/addrecipe/${productid}`, { Recipe, totalcost },
  //       {
  //         headers: {
  //           'authorization': `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     console.log({ addRecipetoProduct: addRecipetoProduct })
  //     getProductRecipe(productid)
  //     setitemId('')
  //     setname('')
  //     setamount()
  //     setunit('')
  //     setcostofitem()
  //   }
  // }



  const [productid, setproductid] = useState("");
  const [productname, setproductname] = useState("");

  const [recipeOfProduct, setrecipeOfProduct] = useState();
  const [ingredients, setingredients] = useState([]);
  const [producttotalcost, setproducttotalcost] = useState();

  const getProductRecipe = async (id) => {
    try {
      console.log(id);
      const allRecipe = await axios.get(`${apiUrl}/api/recipe`);
      console.log({ allRecipe });
      const recipeOfProduct = allRecipe.data && allRecipe.data.find(recipe => recipe.product.id === id);
      if(recipeOfProduct){
        console.log({ recipeOfProduct });
        setrecipeOfProduct(recipeOfProduct);
        const ingredients = await recipeOfProduct.ingredients;
        if (ingredients) {
          setingredients(ingredients.reverse());
        }
        const totalrecipeOfProduct = await recipeOfProduct.totalcost;
        console.log({ totalrecipeOfProduct });
        if (totalrecipeOfProduct) {
          setproducttotalcost(totalrecipeOfProduct);
        }else{setrecipeOfProduct({});
        console.log({ recipeOfProduct });
        }
      }
    } catch (error) {
      console.error("Error fetching product recipe:", error.message);
    }
  };

  const [itemId, setitemId] = useState("");
  const [name, setname] = useState("");
  const [amount, setamount] = useState();
  const [costofitem, setcostofitem] = useState();
  const [unit, setunit] = useState("");
  const [totalcostofitem, settotalcostofitem] = useState();

const createRecipe = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage

  try {
    if (ingredients.length > 0) {
      // If there are existing ingredients, create a new array with the added ingredient
      const newIngredients = [...ingredients, { itemId, name, amount, costofitem, unit, totalcostofitem }];
      // Calculate the total cost by adding the cost of the new ingredient
      const totalCost = Math.round((producttotalcost + totalcostofitem) * 100) / 100;

      // Update the recipe by sending a PUT request
      const addRecipeToProduct = await axios.put(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, { ingredients: newIngredients, totalcost: totalCost }, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });

      console.log({ addRecipeToProduct }); // Log the response from the server

      getProductRecipe(productid); // Refresh the product recipe
    } else {
      // If there are no existing ingredients, create a new array with the single ingredient
      const newIngredients = [{ itemId, name, amount, costofitem, unit, totalcostofitem }];
      const totalCost = totalcostofitem; // Total cost is the cost of the single ingredient

      console.log({ productid, productname, newIngredients }); // Log the product ID, name, and ingredients

      // Add the new recipe to the product by sending a POST request
      const addRecipeToProduct = await axios.post(`${apiUrl}/api/recipe`, { productid, productname, ingredients: newIngredients, totalcost: totalCost }, {
        headers: {
          'authorization': `Bearer ${token}`, // Send the token in the authorization header
        },
      });

      if (addRecipeToProduct.status === 201) {
        console.log({ addRecipeToProduct }); // Log the response from the server
        getProductRecipe(productid); // Refresh the product recipe
        setitemId(''); // Clear the input fields
        setname('');
        setamount('');
        setunit('');
        setcostofitem('');
        settotalcostofitem('');
        toast.success("تم إضافة المكون بنجاح"); // Notify success in adding ingredient
      }
    }
  } catch (error) {
    console.error("Error creating/updating recipe:", error.message); // Log any errors that occur during the process
    toast.error("حدث خطأ أثناء إنشاء/تحديث الوصفة"); // Notify error in creating/updating recipe
  }
};



  const [recipeid, setrecipeid] = useState('')

  // const editRecipe = async (e) => {
  //   e.preventDefault()
  //   console.log({ingredients})
  //   const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage
  //   const newingredients = ingredients.map((ingredient, i) =>{ 
  //     if(ingredient.itemId == itemId){
  //       ingredient = { itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }
  //     }})
  //   // console.log({getRecipe})
  //   // const recipeIndex = productRecipe.findIndex(recipe => recipe === getRecipe)
  //   // console.log(recipeIndex)
  //   // getRecipe = { itemId: itemId, name: name, amount: amount, costofitem: costofitem, unit: unit, totalcostofitem: totalcostofitem }
  //   console.log({newingredients})
  //   let total = 0;

  //   for (let i = 0; i < newingredients.length; i++) {
  //     total += newingredients[i].totalcostofitem;
  //   }

  //   const totalcost = Math.round(total * 100) / 100;

  //   console.log({ totalcost: total })
  //   // productRecipe.map(rec=>totalcost = totalcost + rec.totalcostofitem)
  //   const editRecipetoProduct = await axios.put(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, { ingredients:newingredients, totalcost },
  //   {
  //     headers: {
  //       'authorization': `Bearer ${token}`,
  //     },
  //   }
  //   )
  //   getProductRecipe(productid)
  //   setitemId('')
  //   setname('')
  //   setamount()
  //   setunit('')
  //   setcostofitem()
  // }

const editRecipe = async (e) => {
  try {
    e.preventDefault();
    console.log({ingredients});
    const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
    const newIngredients = ingredients.map((ingredient) => { 
      if (ingredient.itemId === itemId) {
        return { itemId, name, amount, costofitem, unit, totalcostofitem };
      } else {
        return ingredient;
      }
    });

    console.log({newIngredients});

    let total = 0;
    for (let i = 0; i < newIngredients.length; i++) {
      total += newIngredients[i].totalcostofitem;
    }
    const totalcost = Math.round(total * 100) / 100;

    console.log({ totalcost });

    const editRecipeToProduct = await axios.put(
      `${apiUrl}/api/recipe/${recipeOfProduct._id}`,
      { ingredients: newIngredients, totalcost },
      {
        headers: {
          'authorization': `Bearer ${token}`,
        },
      }
    );

    console.log({ editRecipeToProduct });
    getProductRecipe(productid);
    setitemId('');
    setname('');
    setamount('');
    setunit('');
    setcostofitem('');
  } catch (error) {
    console.error("Error editing recipe:", error.message);
    toast.error("حدث خطأ أثناء تعديل الوصفة");
  }
};



  const deleteRecipe = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token_e'); // Assuming the token is stored in localStorage

    if(ingredients.length>2){
    const newingredients = ingredients.filter(ingredient => ingredient.itemId != itemId)
    console.log({newingredients})
    let total = 0
    for (let i = 0; i < newingredients.length; i++) {
      total += newingredients[i].totalcostofitem
    }
    console.log({ totalcost: total })
    // productRecipe.map(rec=>totalcost = totalcost + rec.totalcostofitem)
    const deleteRecipetoProduct = await axios.put(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, { ingredients:newingredients, totalcost: total },
    {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    })
  }else{
    const deleteRecipetoProduct = await axios.delete(`${apiUrl}/api/recipe/${recipeOfProduct._id}`
    ,{
      headers: {
        'authorization': `Bearer ${token}`,
      },
    })
    console.log(deleteRecipetoProduct)
  }
    getProductRecipe(productid)
  }


  const deleteAllRecipe = async (e) => {
    try {
      e.preventDefault();
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  
      if (recipeOfProduct) {
        const deleteRecipeToProduct = await axios.delete(`${apiUrl}/api/recipe/${recipeOfProduct._id}`, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });
  
        console.log(deleteRecipeToProduct);
        getProductRecipe(productid);
  
        deleteRecipeToProduct.status === 200 ? toast.success('تم حذف الوصفة بنجاح') : toast.error('حدث خطأ أثناء الحذف');
        getProductRecipe(productid)

      } else {
        toast.error('يرجى اختيار الصفنف والمنتج أولاً');
      }
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      toast.error('فشل عملية الحذف! يرجى المحاولة مرة أخرى');
      getProductRecipe(productid)
    }
  };
  


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

                        <a href="#deleteAllProductModal" className="btn btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف الكل</span></a>
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
                          <select class="form-control" onChange={(e) => { setproductid(e.target.value); setproductname(e.target.selectedOptions[0].innerText); getProductRecipe(e.target.value) }} >
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
                      {ingredients.length > 0 ? ingredients.map((rec, i) => {
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

                                <a href="#deleteProductModal" className="delete" data-toggle="modal" onClick={() => { setitemId(rec.itemId) }}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
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
              <div id="deleteAllProductModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteAllRecipe}>
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