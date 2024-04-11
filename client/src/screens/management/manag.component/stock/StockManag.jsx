import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { detacontext } from '../../../../App'
import { toast } from 'react-toastify';


const StockManag = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  const [allrecipes, setallrecipes] = useState([]);

  const getallrecipes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/recipe`, config);
      console.log(response)
      const allRecipe = await response.data;
      setallrecipes(allRecipe)
      console.log(allRecipe)

    } catch (error) {
      console.log(error)
    }

  }

  const [StockItems, setStockItems] = useState([]);
  const getaStockItems = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/stockitem/', config);
      if(response){
        console.log(response.data)
        setStockItems(response.data.reverse())
      }
    } catch (error) {
      toast.error('فشل استيراد الاصناف بشكل صحيح !اعد تحميل الصفحة ')
    }

  }

  const Stockmovement = ['Purchase', 'ReturnPurchase', 'Issuance', 'ReturnIssuance', 'Wastage', 'Damaged'];
  const [movement, setmovement] = useState('');
  const [itemId, setitemId] = useState("");
  const [itemName, seitemName] = useState("");
  const [largeUnit, setlargeUnit] = useState('')
  const [smallUnit, setsmallUnit] = useState('')
  const [quantity, setquantity] = useState(0);
  const [price, setprice] = useState(0);
  const [cost, setcost] = useState(0)
  const [oldCost, setoldCost] = useState(0)
  const [newcost, setnewcost] = useState(0)
  const [oldBalance, setoldBalance] = useState(0)
  const [newBalance, setnewBalance] = useState(0)
  const [costOfPart, setcostOfPart] = useState();
  const [parts, setparts] = useState();
  const [expirationDate, setexpirationDate] = useState();
  const [cashRegister, setcashRegister] = useState('');
  const [expirationDateEnabled, setExpirationDateEnabled] = useState(false);


  const [AllCashRegisters, setAllCashRegisters] = useState([]);
  // Fetch all cash registers
  const getAllCashRegisters = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/cashregister', config);
      setAllCashRegisters(response.data.reverse());
    } catch (err) {
      toast.error('Error fetching cash registers');
    }
  };

  const [actionId, setactionId] = useState("")
  const actionAt = new Date().toLocaleString()
  const [AllStockactions, setAllStockactions] = useState([]);

  const createStockAction = async (e) => {
    console.log({
      itemId,
      movement,
      quantity,
      cost,
      oldCost,
      balance: newBalance,
      oldBalance,
      price,
    })
    e.preventDefault();
    console.log({ newBalance: newBalance })
    console.log({ newcost: newcost })
    console.log({ price: price })
    try {
      const unit = movement == 'Purchase' ? largeUnit : smallUnit

      // Update the stock item's movement
      const changeItem = await axios.put(`${apiUrl}/api/stockitem/movement/${itemId}`, { newBalance, price, newcost, costOfPart }, config);

      console.log(changeItem);

      if (changeItem.status === 200) {
        // Create a new stock action
        const response = await axios.post(apiUrl + '/api/stockmanag/', {
          itemId,
          movement,
          quantity,
          cost,
          oldCost,
          unit,
          balance: newBalance,
          oldBalance,
          price,
          ...(movement === 'Purchase' && { expirationDate }),
          actionAt,
        }, config);

        console.log(response.data);

        if (movement === 'Purchase') {
          for (const recipe of allrecipes) {
            const recipeid = recipe._id;
            const productname = recipe.product.name;
            const arrayingredients = recipe.ingredients;

            const newIngredients = arrayingredients.map((ingredient) => {
              if (ingredient.itemId === itemId) {
                const costofitem = costOfPart;
                const unit = ingredient.unit
                const amount = ingredient.amount
                const totalcostofitem = amount * costOfPart
                return { itemId, name: itemName, amount, costofitem, unit, totalcostofitem };
              } else {
                return ingredient;
              }
            });
            console.log({ newIngredients })
            const totalcost = newIngredients.reduce((acc, curr) => {
              return acc + (curr.totalcostofitem || 0);
            }, 0);
            // Update the product with the modified recipe and total cost
            const updateRecipe = await axios.put(`${apiUrl}/api/recipe/${recipeid}`, { ingredients: newIngredients, totalcost }, config);

            console.log({ updateRecipe });

            // Toast for successful update based on recipe change
            toast.success(`تم تحديث وصفة  ${productname}`);
          }
        }
      }

      // Update the stock actions list and stock items
      getallStockaction();
      getaStockItems();

      // Toast notification for successful creation
      toast.success('تم تسجيل حركه المخزن بنجاح');
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل تسجيل حركه المخزن ! حاول مره اخري');
    }
  };


  const updateStockaction = async (e, employeeId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token_e'); // Retrieve the token from localStorage
      const actionBy = employeeId;
      const unit = movement == 'Purchase' ? largeUnit : smallUnit

      // Update the stock item's movement
      const changeItem = await axios.put(`${apiUrl}/api/stockitem/movement/${itemId}`, { newBalance, price, newcost, costOfPart }, config);

      if (changeItem.status === 200) {
        // Update the existing stock action
        const response = await axios.put(`${apiUrl}/api/stockmanag/${actionId}`, {
          itemId, movement, quantity, cost, unit, newBalance, oldBalance, price, expirationDate,
          actionBy
        }, {
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data);

        if (movement === 'Purchase') {
          for (const recipe of allrecipes) {
            const recipeid = recipe._id;
            const productname = recipe.product.name;
            const arrayingredients = recipe.ingredients;

            const newIngredients = arrayingredients.map((ingredient) => {
              if (ingredient.itemId === itemId) {
                const costofitem = costOfPart;
                const unit = ingredient.unit
                const amount = ingredient.amount
                const totalcostofitem = amount * costOfPart
                return { itemId, name: itemName, amount, costofitem, unit, totalcostofitem };
              } else {
                return ingredient;
              }
            });
            console.log({ newIngredients })
            const totalcost = newIngredients.reduce((acc, curr) => {
              return acc + (curr.totalcostofitem || 0);
            }, 0);
            // Update the product with the modified recipe and total cost
            const updateRecipe = await axios.put(
              `${apiUrl}/api/recipe/${recipeid}`,
              { ingredients: newIngredients, totalcost }, config
            );

            console.log({ updateRecipe });

            // Toast for successful update based on recipe change
            toast.success(`تم تحديث وصفه ${productname}`);
          }
        }
        // Update the stock actions list and stock items
        getallStockaction();
        getaStockItems();

        // Toast notification for successful update
        toast.success('تم تحديث العنصر بنجاح');
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل في تحديث العنصر ! حاول مره اخري');
    }
  }


  const getallStockaction = async () => {
    try {
      const response = await axios.get(apiUrl + '/api/stockmanag/', config);
      console.log(response.data)
      const Stockactions = await response.data;
      setAllStockactions(Stockactions.reverse())
    } catch (error) {
      console.log(error)
    }
  }

  const deleteStockaction = async (e) => {
    e.preventDefault();
    try {
      // Delete the selected stock action
      const response = await axios.delete(`${apiUrl}/api/stockmanag/${actionId}`, config);
      console.log(response);

      if (response) {
        // Update the stock actions list after successful deletion
        getallStockaction();

        // Toast notification for successful deletion
        toast.success('تم حذف حركه المخزن بنجاح');
      }
    } catch (error) {
      console.log(error);
      // Toast notification for error
      toast.error('فشل حذف حركه المخزن ! حاول مره اخري ');
    }
  }


  const itemname = (id) => {
    const item = StockItems.filter(item => item._id == id)[0]
    if (item) {
      return item.itemName
    } else {
      return 'غير متوفر'
    }
  }

  const [StockitemFilterd, setStockitemFilterd] = useState([])
  const searchByitem = (item) => {
    const items = AllStockactions.filter((action) => itemname(action.itemId).startsWith(item) == true)
    setStockitemFilterd(items)
  }
  const searchByaction = (action) => {
    const items = AllStockactions.filter((Stockactions) => Stockactions.movement == action)
    setStockitemFilterd(items)
  }



  useEffect(() => {
    getallStockaction()
    getaStockItems()
    getAllCashRegisters()
    getallrecipes()
  }, [])

  // useEffect(() => {
  //   if (movement == "Issuance" || movement == "Wastage") {
  //     setnewBalance(Number(oldBalance) - Number(quantity / parts))
  //     setnewcost(Number(oldCost) - Number(cost))
  //     setcostOfPart(Number(price) / Number(parts))
  //   } else if (movement == 'Purchase') {
  //     const calcNewBalance = Number(oldBalance) + Number(quantity)
  //     const calcNewCost = Number(oldCost) + Number(cost)
  //     const calcCostOfPart = Math.round((calcNewCost / calcNewBalance) * 10) / 10;
  //     console.log({calcCostOfPart})
  //     setnewBalance(calcNewBalance)
  //     setnewcost(calcNewCost)
  //     setcostOfPart(calcCostOfPart)

  //   } else if (movement == "Return") {
  //     setnewBalance(Number(oldBalance) + Number(quantity / parts))
  //     setnewcost(Number(oldCost) + Number(cost))
  //     setcostOfPart(Number(price) / Number(parts))

  //   }
  // }, [quantity, price])

  useEffect(() => {
    if (movement === "Issuance" || movement === "Wastage" || movement === "Damaged") {
      const calcNewBalance = Number(oldBalance) - (Number(quantity) / Number(parts));
      const calcNewCost = Number(oldCost) - Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    } else if (movement === "ReturnIssuance") {
      const calcNewBalance = Number(oldBalance) + (Number(quantity) / Number(parts));
      const calcNewCost = Number(oldCost) + Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    } else if (movement === 'Purchase') {
      const calcNewBalance = Number(oldBalance) + Number(quantity);
      const calcNewCost = Number(oldCost) + Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      console.log({ calcNewBalance, calcNewCost, calcCostOfPart, countparts })
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    } else if (movement === "ReturnPurchase") {
      const calcNewBalance = Number(oldBalance) - Number(quantity);
      const calcNewCost = Number(oldCost) - Number(cost);
      const countparts = calcNewBalance * Number(parts)
      const calcCostOfPart = Math.round((calcNewCost / countparts) * 100) / 100;
      setnewBalance(calcNewBalance);
      setnewcost(calcNewCost);
      setcostOfPart(calcCostOfPart);
    }
  }, [quantity, price]);




  return (
    <detacontext.Consumer>
      {
        ({ employeeLoginInfo, usertitle, EditPagination, startpagination, endpagination, setstartpagination, setendpagination }) => {
          return (
            <div className="container-xl mlr-auto">
              <div className="table-responsive">
                <div className="table-wrapper">
                  <div className="table-title">
                    <div className="row">
                      <div className="col-sm-6">
                        <h2>ادارة <b>المخزون</b></h2>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <a href="#addStockactionModal" className="btn btn-47 btn-success" data-toggle="modal"><i className="material-icons">&#xE147;</i> <span>اضافه منتج جديد</span></a>

                        <a href="#deleteStockactionModal" className="btn btn-47 btn-danger" data-toggle="modal"><i className="material-icons">&#xE15C;</i> <span>حذف</span></a>
                      </div>
                    </div>
                  </div>
                  <div class="table-filter">
                    <div class="row text-dark">
                      <div class="col-sm-3">
                        <div class="show-entries">
                          <span>عرض</span>
                          <select class="form-control" onChange={(e) => { setstartpagination(0); setendpagination(e.target.value) }}>
                            {
                              (() => {
                                const options = [];
                                for (let i = 5; i < 100; i += 5) {
                                  options.push(<option key={i} value={i}>{i}</option>);
                                }
                                return options;
                              })()
                            }
                          </select>
                          <span>صفوف</span>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <button type="button" class="btn btn-47 btn-primary"><i class="fa fa-search"></i></button>
                        <div class="filter-group">
                          <label>اسم الصنف</label>
                          <input type="text" class="form-control" onChange={(e) => searchByitem(e.target.value)} />
                        </div>
                        <div class="filter-group">
                          <label>نوع الاوردر</label>
                          <select class="form-control" onChange={(e) => searchByaction(e.target.value)} >
                            <option value={""}>الكل</option>
                            {Stockmovement.map(movement => {
                              return <option value={movement}>{movement}</option>;
                            })}
                          </select>
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
                        <th>اسم الصنف</th>
                        <th>الحركة</th>
                        <th>الكمية</th>
                        <th>الوحدة</th>
                        <th>السعر</th>
                        <th>الثمن</th>
                        <th>الرصيدالقديم</th>
                        <th>الرصيد الجديد</th>
                        <th>تاريخ الحركه</th>
                        <th>تم بواسطه</th>
                        <th>اجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {StockitemFilterd.length > 0 ? StockitemFilterd.map((action, i) => {
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
                              <td>{itemname(action.itemId)}</td>
                              <td>{action.movement}</td>
                              <td>{action.quantity}</td>
                              <td>{action.unit}</td>
                              <td>{action.price}</td>
                              <td>{action.cost}</td>
                              <td>{action.oldBalance}</td>
                              <td>{action.balance}</td>
                              <td>{new Date(action.actionAt).toLocaleString('en-GB', { hour12: true })}</td>
                              <td>{usertitle(action.actionBy)}</td>
                              <td>
                                <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); seitemName(action.itemName); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                              </td>
                            </tr>
                          )
                        }
                      })
                        : AllStockactions.map((action, i) => {
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
                                <td>{itemname(action.itemId)}</td>
                                <td>{action.movement}</td>
                                <td>{action.quantity}</td>
                                <td>{action.unit}</td>
                                <td>{action.price}</td>
                                <td>{action.cost}</td>
                                <td>{action.oldBalance}</td>
                                <td>{action.balance}</td>
                                <td>{new Date(action.actionAt).toLocaleString('en-GB', { hour12: true })}</td>
                                <td>{usertitle(action.actionBy)}</td>
                                <td>
                                  <a href="#editStockactionModal" className="edit" data-toggle="modal" onClick={() => { setactionId(action._id); seitemName(action.itemName); setoldBalance(action.oldBalance); setoldCost(action.oldCost); setprice(action.price) }}><i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                                  <a href="#deleteStockactionModal" className="delete" data-toggle="modal" onClick={() => setactionId(action._id)}><i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                                </td>
                              </tr>
                            )
                          }
                        })
                      }
                    </tbody>
                  </table>
                  <div className="clearfix">
                    <div className="hint-text text-dark">عرض <b>{AllStockactions.length > endpagination ? endpagination : AllStockactions.length}</b> من <b>{AllStockactions.length}</b> عنصر</div>
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
              <div id="addStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => createStockAction(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="filter-group">
                          <label>نوع الحركه</label>
                          <select name="" id="" onChange={(e) => setmovement(e.target.value)}>
                            <option >اختر الاجراء</option>
                            {Stockmovement.map((status, i) => {
                              return <option key={i} defaultValue={status}>{status}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الصنف</label>
                          <select name="" id="" onChange={(e) => {
                            setitemId(e.target.value);
                            setlargeUnit(StockItems.filter(i => i._id == e.target.value)[0].largeUnit);
                            seitemName(StockItems.filter(i => i._id == e.target.value)[0].itemName);
                            setsmallUnit(StockItems.filter(i => i._id == e.target.value)[0].smallUnit);
                            setcostOfPart(StockItems.filter(i => i._id == e.target.value)[0].costOfPart);
                            setprice(StockItems.filter(i => i._id == e.target.value)[0].price)
                            setoldBalance(StockItems.filter(i => i._id == e.target.value)[0].Balance);
                            setoldCost(StockItems.filter(i => i._id == e.target.value)[0].totalCost);
                            setparts(StockItems.filter(i => i._id == e.target.value)[0].parts)
                          }}>
                            <option >اختر الصنف</option>
                            {StockItems.map((item, i) => {
                              return <option key={i} value={item._id}>{item.itemName}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الكمية</label>
                          {movement == "Issuance" || movement === "ReturnIssuance" || movement == "Wastage" || movement == "Damaged" ?
                            <>
                              <input type='Number' className="form-control" required onChange={(e) => { setquantity(e.target.value); setcost(Number(e.target.value) * costOfPart) }} />
                              <input type='text' className="form-control" defaultValue={smallUnit} readOnly />
                            </>
                            : movement == "Purchase" || movement == "ReturnPurchase" ? <>
                              <input type='Number' className="form-control" required onChange={(e) => { setquantity(e.target.value); }} />
                              <input type='text' className="form-control" defaultValue={largeUnit} readOnly />
                            </> : ''}
                        </div>
                        {/* {movement === "Purchase" &&
                          <>
                            <div className="form-group form-group-47">
                              <label>تاريخ الانتهاء</label>
                              <input type="checkbox" checked={expirationDateEnabled} onChange={() => setExpirationDateEnabled(!expirationDateEnabled)} />
                              {expirationDateEnabled &&
                                <input type='date' className="form-control" required onChange={(e) => { setexpirationDate(e.target.value); }} />}
                            </div>
                          </>
                        } */}

                        <div className="form-group form-group-47">
                          <label>السعر</label>
                          {movement == "Issuance" || movement == "ReturnIssuance" || movement == "Wastage" || movement == "Damaged" ?
                            <input type='text' className="form-control" readOnly required defaultValue={costOfPart} />
                            : <input type='Number' className="form-control" required onChange={(e) => { setprice(Number(e.target.value)); setcost(Number(e.target.value) * quantity) }} />
                          }
                        </div>
                        <div className="form-group form-group-47">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" Value={cost} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={oldBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد الجديد</label>
                          <input type='text' className="form-control" Value={newBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={actionAt} readOnly />
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
              <div id="editStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={(e) => updateStockaction(e, employeeLoginInfo.employeeinfo.id)}>
                      <div className="modal-header">
                        <h4 className="modal-title">اضافه صنف بالمخزن</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group form-group-47">
                          <label>نوع الحركه</label>
                          <select name="" id="" onChange={(e) => setmovement(e.target.value)}>
                            <option >اختر الاجراء</option>
                            {Stockmovement.map((statu, i) => {
                              return <option key={i} defaultValue={statu}>{statu}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الصنف</label>
                          <select name="" id="" onChange={(e) => {
                            setitemId(e.target.value);
                            setlargeUnit(StockItems.filter(i => i._id == e.target.value)[0].largeUnit);
                            setsmallUnit(StockItems.filter(i => i._id == e.target.value)[0].smallUnit);
                          }}>
                            <option >اختر الصنف</option>
                            {StockItems.map((item, i) => {
                              return <option key={i} value={item._id}>{item.itemName}</option>
                            })}
                          </select>
                        </div>
                        <div className="form-group form-group-47">
                          <label>الكمية</label>
                          {movement == "Issuance" || movement === "ReturnIssuance" || movement == "Wastage" || movement == "Damaged" ?
                            <>
                              <input type='Number' className="form-control" required onChange={(e) => { setquantity(e.target.value); setcost(Number(e.target.value) * costOfPart) }} />
                              <input type='text' className="form-control" defaultValue={smallUnit} readOnly />
                            </>
                            : movement == "Purchase" || movement == "ReturnPurchase" ? <>
                              <input type='Number' className="form-control" required onChange={(e) => { setquantity(e.target.value); }} />
                              <input type='text' className="form-control" defaultValue={largeUnit} readOnly />
                            </> : ''}
                        </div>

                        <div className="form-group form-group-47">
                          <label>السعر</label>
                          {movement == "Issuance" || movement === "ReturnIssuance" || movement == "Wastage" || movement == "Damaged" ?
                            <input type='Number' className="form-control" readOnly required defaultValue={price} />
                            : <input type='Number' className="form-control" required onChange={(e) => { setprice(Number(e.target.value)); setcost(e.target.value * quantity) }} />
                          }
                        </div>
                        <div className="form-group form-group-47">
                          <label>التكلفة</label>
                          <input type='Number' className="form-control" Value={cost} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد</label>
                          <input type='text' className="form-control" Value={oldBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>الرصيد الجديد</label>
                          <input type='text' className="form-control" Value={newBalance} readOnly />
                        </div>
                        <div className="form-group form-group-47">
                          <label>التاريخ</label>
                          <input type="text" className="form-control" Value={actionAt} readOnly />
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
              <div id="deleteStockactionModal" className="modal fade">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <form onSubmit={deleteStockaction}>
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
    </detacontext.Consumer>

  )
}

export default StockManag