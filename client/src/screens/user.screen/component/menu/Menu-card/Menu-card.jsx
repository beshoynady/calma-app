import React, { useState } from 'react';
// import './Menu-card.css';
import { detacontext } from '../../../../../App';


import defaultsImage from '../../../../../image/menu/soup.jpg'

const MenuCard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [noteArea, setnoteArea] = useState(false)
  const [extraArea, setextraArea] = useState(false)
  const [productid, setproductid] = useState('')
  const [size, setsize] = useState('')
  const [sizeId, setsizeId] = useState('')
  const [sizeQuantity, setsizeQuantity] = useState(0)
  const [sizePrice, setsizePrice] = useState()
  const [sizePriceAfterDescount, setsizePriceAfterDescount] = useState()
  // const [productExtras, setproductExtras] = useState([])

  // const handleAddProductExtras = (extraId) => {
  //   if (productExtras.length>0 && productExtras.includes(extraId)) {
  //     const extraList = productExtras.filter(ex => ex !== extraId);
  //     setproductExtras(extraList);
  //   } else {
  //     setproductExtras([...productExtras, extraId]);
  //   }
  // };

  const xax = (size) => {
    setsize(size)
    setsizeId(size._id)
    setsizeQuantity(size.sizeQuantity)
    setsizePrice(size.sizePrice);
    if (size.sizeDiscount > 0) {
      setsizePriceAfterDescount(size.sizePriceAfterDiscount);
    }
  };

  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);


  return (
    <detacontext.Consumer>
      {
        ({ allProducts, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, addExtrasToProduct, handleAddProductExtras, productExtras, itemId }) => {
          return (

            <div className="card-group d-flex">
              {allProducts.length > 0 ?
                allProducts.filter(pro => pro.category._id === categoryid).map((product, index) => {
                  if (product.hasSizes) {
                    return (
                      <div className="card mx-auto" key={index} style={{ maxWidth: "320px", minWidth: '300px', width: "100%", height: '200px', margin: '0 0 10px 10px' }}>
                        {product._id === productid && noteArea === true ?
                          <form onSubmit={(e) => { addNoteToProduct(e, product._id, sizeId); setnoteArea(!noteArea); }}
                            className="position-absolute w-100 h-100 top-0 start-0 p-2 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
                            style={{ zIndex: 10 }}
                          >
                            <textarea
                              placeholder='اضف تعليماتك الخاصة بهذا الطبق'
                              name="note"
                              cols="100"
                              rows="3"
                              onChange={(e) => { setproductNote(e.target.value) }}
                              className="w-100 h-100 my-1"
                              style={{ zIndex: 11 }}
                            ></textarea>
                            <div className='note-btn d-flex align-items-center justify-content-center w-100 mt-2' style={{ height: '40px' }}>
                              <button className="btn w-50 h-100 text-light btn-success rounded-2 me-2">تاكيد</button>
                              <button
                                onClick={() => { setnoteArea(!noteArea) }}
                                className="btn w-50 h-100 text-light btn-danger rounded-2"
                              >الغاء</button>
                            </div>
                          </form>
                          : ''}

                        {product._id === productid && extraArea === true ?
                          <form onSubmit={(e) => { addExtrasToProduct(e, product._id, sizeId); setextraArea(!extraArea) }}
                            className="position-absolute w-100 h-100 top-0 start-0 p-2 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
                            style={{ zIndex: 10, overflow: 'scroll', scrollbarWidth: 'thin' }}>
                            <div className="form-group d-flex flex-wrap w-100">
                              {product.extras.map((extra, i) => (
                                <div className="form-check form-check-flat mb-2 mr-1 d-flex align-items-center" key={i} style={{ width: '45%', paddingLeft: '10px' }}>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    value={extra._id}
                                    onChange={(e) => handleAddProductExtras(extra, i)}
                                  />
                                  <label className="form-check-label mr-4" style={{ fontSize: '18px', fontWeight: '900' }}>{extra.name}</label>
                                </div>
                              ))}
                            </div>
                            <div className='note-btn d-flex align-items-center justify-content-center w-100 mt-2' style={{ height: '40px' }}>
                              <button className="btn w-50 h-100 text-light btn-success rounded-2 me-2" >تاكيد</button>
                              <button
                                onClick={() => setextraArea(!extraArea)}
                                className="btn w-50 h-100 text-light btn-danger rounded-2"
                              >الغاء</button>
                            </div>
                          </form>
                          : ''}

                        <div className="row g-0 h-100">
                          <div className="col-5 d-flex flex-column justify-content-between">
                            <img src={defaultsImage} className="h-100 w-100" alt="Delicious soup" />
                            {product.available === true ? (
                              <>
                                {itemId.includes(sizeId) && sizeId && product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity > 0 ? (
                                  <button type="button" className="btn btn-danger btn-block" style={{ fontSize: "14px" }} onClick={() => { deleteItemFromCart(product._id, sizeId) }}>
                                    حذف من الطلبات
                                  </button>
                                ) : (
                                  <button type="button" className="btn btn-success btn-block" style={{ fontSize: "14px" }} onClick={() => { if (size.sizeQuantity > 0) { addItemToCart(product._id, size._id) } }}>
                                    أضف الى طلباتي
                                  </button>
                                )}
                              </>
                            ) : (
                              <button type="button" className="btn btn-warning btn-block" style={{ fontSize: "14px" }}>
                                غير متاح الان
                              </button>
                            )}

                          </div>
                          <div className="col-7 d-flex flex-column justify-content-between align-items-stretch p-2">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="card-title mb-0">{product.name}</h5>
                              <span className="material-icons" style={{ color: "red", fontSize: "45px" }}
                                onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <p className="card-text mb-2" style={{ fontSize: "12px", fontWeight: "700" }}>{product.description}</p>
                              {product.hasExtras &&
                                <span className="material-icons" style={{ color: "red", fontSize: "45px" }}
                                  onClick={() => { setextraArea(!extraArea); setproductid(product._id) }}>note_alt</span>
                              }
                            </div>

                            <div className="d-flex row justify-content-between align-items-center mb-2">
                              <div className="col-8 btn-group btn-group-toggle" style={{ direction: 'ltr' }} data-toggle="buttons">
                                {product.sizes.length > 0 && product.sizes?.map((size, i) => {
                                  return (
                                    <label key={i} className={`d-flex justify-content-center align-items-center col-4 btn btn-outline-secondary btn-sm ${size._id === sizeId ? "active" : i === 0 ? "active" : ''}`} style={{ height: "40px", fontSize: "24px", fontWeight: "600" }} defaultChecked={size._id === sizeId ? true : i === 0 ? true : false} onClick={() => xax(size)}>
                                      <input type="radio" name="size" id={`sizeS${i}`} />
                                      {size.sizeName}
                                    </label>
                                  )
                                })}
                              </div>

                              <div className="col-4 d-flex flex-column align-items-end">
                                {sizePriceAfterDescount > 0 ?
                                  <>
                                    <sup><small className="text-muted"><s>{sizePrice}ج</s></small></sup>
                                    <span className="text-danger fw-bold">{sizePriceAfterDescount}ج</span>
                                  </>
                                  : <span className="text-danger fw-bold">{sizePrice}ج</span>}
                              </div>
                            </div>
                            <div className="form-row align-items-center">
                              <div className="col-4">
                                <button className="btn btn-outline-secondary w-100" type="button" onClick={() => { incrementProductQuantity(product._id, sizeId); setsizeQuantity(sizeQuantity + 1) }}>+</button>
                              </div>
                              <div className="col-4">
                                <input type="text" className="form-control text-center w-100" readonly value={sizeId ? product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity : 0} />
                              </div>
                              <div className="col-4">
                                <button className="btn btn-outline-secondary w-100" type="button" onClick={() => { decrementProductQuantity(product._id, sizeId); setsizeQuantity(sizeQuantity - 1) }}>-</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )










                  } else {
                    return (
                      <div className="card mx-auto" key={index} style={{ maxWidth: "320px", minWidth: '300px', width: "100%", height: '200px', margin: '0 0 10px 10px' }}>

                        {product._id === productid && noteArea === true ?
                          <form onSubmit={(e) => { addNoteToProduct(e, product._id, sizeId); setnoteArea(!noteArea); }}
                            className="position-absolute w-100 h-100 top-0 start-0 p-2 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
                            style={{ zIndex: 10 }}
                          >
                            <textarea
                              placeholder='اضف تعليماتك الخاصة بهذا الطبق'
                              name="note"
                              cols="100"
                              rows="3"
                              onChange={(e) => { setproductNote(e.target.value) }}
                              className="w-100 h-100 my-1"
                              style={{ zIndex: 11 }}
                            ></textarea>
                            <div className='note-btn d-flex align-items-center justify-content-center w-100 mt-2' style={{ height: '40px' }}>
                              <button className="btn w-50 h-100 text-light btn-success rounded-2 me-2">تاكيد</button>
                              <button
                                onClick={() => setnoteArea(!noteArea)}
                                className="btn w-50 h-100 text-light btn-danger rounded-2"
                              >الغاء</button>
                            </div>
                          </form>
                          : ''}

                        {product._id === productid && extraArea === true ? (
                          <div className="position-absolute w-100 h-100 top-0 start-0 p-2 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden" style={{ zIndex: 10, overflow: 'scroll', scrollbarWidth: 'thin' }}>
                            <div className="d-flex align-items-center justify-content-center">
                              {Array.from({ length: product.quantity }).map((_, ind) => (
                                <div key={ind} className="d-flex w-100 h-20 align-items-center justify-content-center flex-wrap">
                                  <button type="button" className="btn btn-info">
                                    {ind + 1}
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="d-flex flex-column align-items-center justify-content-center flex-wrap" style={{ overflow: 'scroll', scrollbarWidth: 'thin' }}>
                              {Array.from({ length: product.quantity }).map((_, ind) => (
                                selectedButtonIndex === ind + 1 && (
                                  <div key={ind} className="form-group w-100 d-flex align-items-center justify-content-center flex-wrap">
                                    {product.extras.map((extra, i) => (
                                      <div className="form-check form-check-flat mb-2 mr-1 d-flex align-items-center" key={i} style={{ width: '45%', paddingLeft: '10px' }}>
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          value={extra._id}
                                          checked={product.extrasSelected ? product.extrasSelected[ind].extraId.includes(extra._id) : f}
                                          onChange={(e) => handleAddProductExtras(extra, ind)}
                                        />
                                        <label className="form-check-label mr-4" style={{ fontSize: '18px', fontWeight: '900' }}>{extra.name}</label>
                                      </div>
                                    ))}
                                  </div>
                                )
                              ))}
                            </div>

                            {/* أزرار التأكيد والإلغاء */}
                            <div className="note-btn d-flex align-items-center justify-content-center w-100 mt-2" style={{ height: '40px' }}>
                              <button className="btn btn-success rounded-2 me-2" style={{ width: '50%' }}>تأكيد</button>
                              <button type="button" onClick={() => setextraArea(!extraArea)} className="btn btn-danger rounded-2" style={{ width: '50%' }}>إلغاء</button>
                            </div>
                          </div>
                        ) : ''}


                        <div className="row g-0 h-100">
                          <div className="col-5 d-flex flex-column justify-content-between">
                            <img src={defaultsImage} className="h-100 w-100" alt="Delicious soup" />
                            {product.available === true ? (
                              itemId.filter((i) => i === product._id).length > 0 && product.quantity > 0 ?
                                (
                                  <button type="button" className="btn btn-danger btn-block" style={{ fontSize: "14px" }} onClick={() => { deleteItemFromCart(product._id, sizeId) }}>
                                    حذف من الطلبات
                                  </button>
                                ) : (
                                  <button type="button" className="btn btn-success btn-block" style={{ fontSize: "14px" }} onClick={() => { if (product.quantity > 0) { addItemToCart(product._id) } }}>
                                    أضف الى طلباتي
                                  </button>
                                )
                            ) : (
                              <button type="button" className="btn btn-warning btn-block" style={{ fontSize: "14px" }}>
                                غير متاح الان
                              </button>
                            )}
                          </div>
                          <div className="col-7 d-flex flex-column justify-content-between align-items-stretch p-2">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="card-title mb-0">{product.name}</h5>
                              <span className="material-icons" style={{ color: "red", fontSize: "45px" }}
                                onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <p className="card-text mb-2" style={{ fontSize: "12px", fontWeight: "700" }}>{product.description}</p>
                              {product.hasExtras &&
                                <span className="material-icons" style={{ color: "red", fontSize: "45px" }}
                                  onClick={() => { setextraArea(!extraArea); setproductid(product._id) }}>note_alt</span>
                              }
                            </div>
                            <div className="d-flex row justify-content-between align-items-center mb-2">
                              <div className="col-7"></div>
                              <div className="col-5 d-flex flex-column align-items-end">
                                {product.discount > 0 ?
                                  <>
                                    <sup><small className="text-muted"><s>{product.price}ج</s></small></sup>
                                    <span className="text-danger fw-bold">{product.priceAfterDiscount}ج</span>
                                  </>
                                  : <span className="text-danger fw-bold">{product.price}ج</span>}
                              </div>
                            </div>
                            <div className="form-row align-items-center">
                              <div className="col-4">
                                <button className="btn btn-outline-secondary w-100" type="button" onClick={() => incrementProductQuantity(product._id)}>+</button>
                              </div>
                              <div className="col-4">
                                <input type="text" className="form-control text-center w-100" readOnly value={product.quantity} />
                              </div>
                              <div className="col-4">
                                <button className="btn btn-outline-secondary w-100" type="button" onClick={() => decrementProductQuantity(product._id)}>-</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )

                  }
                }
                ) : ''}
            </div>

          )
        }
      }
    </detacontext.Consumer>
  )
}

export default MenuCard