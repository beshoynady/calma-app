import React, { useState } from 'react';
// import './Menu-card.css';
import { detacontext } from '../../../../App';


import defaultsImage from '../../../../image/menu/soup.jpg'

const POSCard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;


  const [noteArea, setnoteArea] = useState(false)
  const [extraArea, setextraArea] = useState(false)
  const [productid, setproductid] = useState('')
  const [size, setsize] = useState('')
  const [sizeId, setsizeId] = useState('')
  const [sizeQuantity, setsizeQuantity] = useState(0)
  const [sizePrice, setsizePrice] = useState()
  const [sizePriceAfterDescount, setsizePriceAfterDescount] = useState()


  const handleSelectSize = (size) => {
    setsize(size)
    setsizeId(size._id)
    setsizeQuantity(size.sizeQuantity)
    setsizePrice(size.sizePrice);
    if (size.sizeDiscount > 0) {
      setsizePriceAfterDescount(size.sizePriceAfterDiscount);
    }
  };

  const [selectedButtonIndex, setSelectedButtonIndex] = useState(1);


  return (
    <detacontext.Consumer>
      {
        ({ allProducts, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, addExtrasToProduct, handleAddProductExtras, productExtras, itemId }) => {
          return (

            <div className="d-flex flex-wrap flex-md-row">
              {allProducts.length > 0 ?
                allProducts.filter(pro => pro.category._id === categoryid).map((product, index) => {
                  if (product.hasSizes) {
                    return (
                      <div className="card mx-auto" key={index} style={{ width: '180px', height: '150px' }} onClick={() => { addItemToCart(product._id, sizeId) }}>

                        {/* {product._id === productid && noteArea === true ?
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
                          : ''} */}

                        {/* {product._id === productid && extraArea === true ?
                          sizeId && product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity > 0 ?
                            (<div className="position-absolute w-100 h-100 top-0 start-0 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
                              style={{ zIndex: 10 }}>
                              <form onSubmit={(e) => { if (product.extras.length > 0) { addExtrasToProduct(e, product._id, sizeId); }; setSelectedButtonIndex(1); setextraArea(!extraArea); }}
                                className="w-100 h-100 top-0 start-0 bg-white rounded-3 d-flex flex-column align-items-center justify-content-between m-0 p-0" >

                                <div className='d-flex align-items-center justify-content-center flex-wrap' style={{ width: '100%', height: 'auto' }}>
                                  {Array.from({ length: product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity }).map((_, ind) => (
                                    <div key={ind} style={{ margin: '5px' }}>
                                      <button type="button" className='btn btn-info' onClick={() => setSelectedButtonIndex(ind + 1)}>
                                        {ind + 1}
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                <div className="form-group d-flex flex-wrap mt-1" style={{ width: '100%', height: '50%', padding: '0', margin: '0' }}>
                                  {Array.from({ length: product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity }).map((_, ind) => (
                                    selectedButtonIndex === ind + 1 && (
                                      <div key={ind} className="form-group w-100 h-100 d-flex flex-column align-items-start justify-content-start flex-wrap" style={{ padding: '5px', overflowY: "auto" }}>
                                        {product.extras.map((extra, i) => (
                                          <div className="form-check form-check-flat mb-1 d-flex align-items-center" key={i} style={{ width: '47%', paddingLeft: '5px' }}>
                                            <input
                                              type="checkbox"
                                              className="form-check-input "
                                              value={extra._id}
                                              checked={
                                                (productExtras && productExtras[ind] && productExtras[ind].extraDetails.some(detail => detail.extraId === extra._id)) ||
                                                (product.sizes.filter(size => size._id === sizeId)[0].extrasSelected &&
                                                  product.sizes.filter(size => size._id === sizeId)[0].extrasSelected[ind] &&
                                                  product.sizes.filter(size => size._id === sizeId)[0].extrasSelected[ind].extraDetails.some(detail => detail.extraId === extra._id))
                                              }

                                              onChange={(e) => handleAddProductExtras(extra, ind)}
                                            />
                                            <label className="form-check-label mr-4" style={{ fontSize: '14px', fontWeight: '900' }} onClick={(e) => handleAddProductExtras(extra, ind)}>{`${extra.name} - ${extra.price} ج`} </label>
                                          </div>
                                        ))}
                                      </div>
                                    )
                                  ))}
                                </div>
                                <div className="note-btn d-flex align-items-center justify-content-center w-100 mt-2" style={{ height: '40px' }}>
                                  <button className="btn btn-success rounded-2 me-2" style={{ width: '50%' }}>تأكيد</button>
                                  <button type="button" onClick={() => setextraArea(!extraArea)} className="btn btn-danger rounded-2" style={{ width: '50%' }}>إلغاء</button>
                                </div>
                              </form>
                            </div>
                            ) : <div className='position-absolute w-100 h-100 top-0 start-0 p-2 bg-white rounded-3 d-flex flex-column align-items-center justify-content-between overflow-hidden'
                              style={{ zIndex: 10 }}>
                              <p className='d-flex align-items-center justify-content-center w-100 h-75' style={{ fontSize: '18px', fontWeight: '900' }}>اختر اولا الحجم و الكمية</p>
                              <div className="note-btn d-flex align-items-center justify-content-center w-100 mt-2" style={{ height: '40px', button: '0' }}>
                                <button type="button" onClick={() => setextraArea(!extraArea)} className="btn btn-danger rounded-2" style={{ width: '100%' }}>اغلاق</button>
                              </div>
                            </div>
                          : ''} */}

                        <div className="d-flex flex-column g-0 h-100" >
                          <div className="d-flex flex-nowrap flex-column justify-content-between" style={{ width: '100%', height: '40%' }}>
                            <img src={defaultsImage} className="h-100 w-100" alt="Delicious soup" />
                            {/* {product.available === true ? (
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
                            )} */}

                          </div>
                          <div className="d-flex flex-column justify-content-between align-items-stretch p-0">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="card-title mb-0">{product.name}</h5>
                              {/* <span className="material-icons" style={{ color: "red", fontSize: "35px" }}
                                onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span> */}
                            </div>

                            {/* <div className="d-flex justify-content-between align-items-center mb-2">
                              <p className="card-text mb-2" style={{ fontSize: "12px", fontWeight: "700" }}>{product.description}</p>
                              {product.hasExtras &&
                                <span className="material-icons" style={{ color: "green", fontSize: "35px" }}
                                  onClick={() => { setextraArea(!extraArea); setproductid(product._id) }}>add_circle</span>
                              }
                            </div> */}

                            <div className="d-flex row justify-content-between align-items-center mb-2">
                              <div className="col-8 btn-group btn-group-toggle" style={{ direction: 'ltr' }} data-toggle="buttons">
                                {product.sizes.length > 0 && product.sizes?.map((size, i) => {
                                  return (
                                    <label key={i} className={`d-flex justify-content-center align-items-center col-4 btn btn-outline-secondary btn-sm ${size._id === sizeId ? "active" : i === 0 ? "active" : ''}`} style={{ height: "40px", fontSize: "24px", fontWeight: "600" }} defaultChecked={size._id === sizeId ? true : i === 0 ? true : false} onClick={() => handleSelectSize(size)}>
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
                            {/* <div className="form-row align-items-center">
                              <div className="col-4">
                                <button className="btn btn-outline-secondary w-100" type="button" onClick={() => { incrementProductQuantity(product._id, sizeId); setsizeQuantity(sizeQuantity + 1) }}>+</button>
                              </div>
                              <div className="col-4">
                                <input type="text" className="form-control text-center w-100" readonly value={sizeId ? product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity : 0} />
                              </div>
                              <div className="col-4">
                                <button className="btn btn-outline-secondary w-100" type="button" onClick={() => { decrementProductQuantity(product._id, sizeId); setsizeQuantity(sizeQuantity - 1) }}>-</button>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    )




                  } else {
                    return (
                      <div className="card mx-auto m-1 .bg-secondary" key={index} style={{ width: '180px', height: '150px', border: '2px solid black', transition: 'transform 0.3s, border-color 0.3s' }} onClick={() => { addItemToCart(product._id, sizeId) }}>
                        <div className="d-flex flex-column justify-content-between" style={{ width: '100%', height: '60%' }}>
                          <img src={defaultsImage} className="img-fluid h-100 w-100" alt="Delicious soup" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="d-flex .bg-secondary justify-content-between align-items-center p-2">
                          <h5 className="card-title text-light mb-0 text-truncate" style={{ width: '60%' }}>{product.name}</h5>
                          <div className="text-end ">
                            {product.discount > 0 ? (
                              <>
                                <span className="text-light fw-bold">{product.priceAfterDiscount}ج</span>
                                <sup><small className="text-muted text-light">{product.price}ج</small></sup>
                              </>
                            ) : (
                              <span className="text-light fw-bold">{product.price}ج</span>
                            )}
                          </div>
                        </div>
                      </div>
                      // <div className="card d-flex flex-column mx-auto" key={index} style={{ width: '180px', height: '150px', backgroundColor:'gray', border:'2px solid black' }}>
                      //   <div className="d-flex flex-column justify-content-between" style={{ width: '100%', height: '60%' }}>
                      //     <img src={defaultsImage} className=" h-100 w-100" alt="Delicious soup" />

                      //   </div>
                      //   <div className="d-flex  justify-content-between align-items-stretch p-0">
                      //     <div className="d-flex col-8 justify-content-between align-items-center mb-2">
                      //       <h5 className="card-title mb-0">{product.name}</h5>
                      //     </div>

                      //     <div className="col-4 d-flex flex-column align-items-end">
                      //       {product.discount > 0 ?
                      //         <>
                      //           <sup><small className="text-muted"><s>{product.price}ج</s></small></sup>
                      //           <span className="text-danger fw-bold">{product.priceAfterDiscount}ج</span>
                      //         </>
                      //         : <span className="text-danger fw-bold">{product.price}ج</span>}
                      //     </div>


                      //   </div>
                      // </div>
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

export default POSCard