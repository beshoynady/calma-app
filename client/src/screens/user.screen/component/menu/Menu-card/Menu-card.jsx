import React, { useState } from 'react';
// import './Menu-card.css';
import { detacontext } from '../../../../../App';


import defaultsImage from '../../../../../image/menu/soup.jpg'

const MenuCard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [noteArea, setnoteArea] = useState(false)
  const [productid, setproductid] = useState('')
  const [size, setsize] = useState('')
  const [sizeId, setsizeId] = useState('')
  const [sizeQuantity, setsizeQuantity] = useState(0)
  const [sizePrice, setsizePrice] = useState()
  const [sizePriceAfterDescount, setsizePriceAfterDescount] = useState()


  const handleSizeClick = (size) => {
    setsize(size)
    setsizeId(size._id)
    setsizeQuantity(size.sizeQuantity)
    setsizePrice(size.sizePrice);
    if (size.sizeDiscount > 0) {
      setsizePriceAfterDescount(size.sizePriceAfterDiscount);
    }
  };

  return (
    <detacontext.Consumer>
      {
        ({ allProducts, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, itemId }) => {
          return (
            // <div className="card mx-auto" style={{ maxWidth: "400px", width: "100%", height: '200px' }}>
            //   <div className="row g-0 h-100">
            //     <div className="col-5 d-flex flex-column justify-content-between">
            //       <img src={defaultsImage} className="h-100 w-100" alt="Delicious soup" />
            //       <button type="button" className="btn btn-success btn-block" style={{ fontSize: "14px" }}>أضف الى طلباتي</button>
            //     </div>
            //     <div className="col-7 d-flex flex-column justify-content-between align-items-stretch p-2">
            //       <div className="d-flex justify-content-between align-items-center mb-2">
            //         <h5 className="card-title mb-0">بيتزا شاورما</h5>
            //         <span className="material-icons" style={{ color: "red", fontSize: "45px" }}>note_alt</span>
            //       </div>
            //       <p className="card-text mb-2">بيتزا شاورما</p>

            //       <div className="d-flex row justify-content-between align-items-center mb-2">
            //         <div className="col-md-8 btn-group btn-group-toggle" data-toggle="buttons">
            //           <label className="d-flex justify-content-center align-items-center col-sm-4 btn btn-outline-secondary btn-sm" style={{ height: "40px", fontSize: "24px", fontWeight: "600" }}>
            //             <input type="radio" name="size" id="sizeS" /> S
            //           </label>
            //           <label className="d-flex justify-content-center align-items-center col-sm-4 btn btn-outline-secondary btn-sm active" style={{ height: "40px", fontSize: "24px", fontWeight: "600" }}>
            //             <input type="radio" name="size" id="sizeM" defaultChecked /> M
            //           </label>
            //           <label className="d-flex justify-content-center align-items-center col-sm-4 btn btn-outline-secondary btn-sm" style={{ height: "40px", fontSize: "24px", fontWeight: "600" }}>
            //             <input type="radio" name="size" id="sizeL" /> L
            //           </label>
            //         </div>

            //         <div className="col-4 d-flex flex-column align-items-end">
            //           <small className="text-muted"><s>150ج</s></small>
            //           <span className="text-danger fw-bold">103ج</span>
            //         </div>
            //       </div>
            //       <div className="form-row align-items-center">
            //         <div className="col-4">
            //           <button className="btn btn-outline-secondary w-100" type="button">+</button>
            //         </div>
            //         <div className="col-4">
            //           <input type="text" className="form-control text-center w-100" readonly value="0" />
            //         </div>
            //         <div className="col-4">
            //           <button className="btn btn-outline-secondary w-100" type="button">-</button>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </div>

            <div className="card-group">
              {allProducts.length > 0 ?
                allProducts.filter(pro => pro.category._id === categoryid).map((product, index) => {
                  if (product.hasSizes) {
                    return (
                      <div className="card mx-auto" key={index} style={{ maxWidth: "320px", width: "100%", height: '200px' }}>

                        {product._id === productid && noteArea === true ?
                          <form onSubmit={(e) => { addNoteToProduct(e, product._id, sizeId); setnoteArea(!noteArea); }} 
                          className="position-absolute w-100 h-100 top-0 start-0 p-3 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
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
                            <div className='note-btn d-flex align-items-center justify-content-center w-100 mt-2' style={{height: '40px'}}>
                              <button className="btn w-50 h-100 text-light btn-success rounded-2 me-2">تاكيد</button>
                              <button
                                onClick={() => setnoteArea(!noteArea)}
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
                                  <button type="button" className="btn btn-success btn-block" style={{ fontSize: "14px" }} onClick={() => addItemToCart(product._id, sizeId)}>
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
                            <p className="card-text mb-2">{product.description}</p>

                            <div className="d-flex row justify-content-between align-items-center mb-2">
                              <div className="col-8 btn-group btn-group-toggle" style={{ direction: 'ltr' }} data-toggle="buttons">
                                {product.sizes.length > 0 && product.sizes?.map((size, i) => {
                                  return (
                                    <label key={i} className={`d-flex justify-content-center align-items-center col-4 btn btn-outline-secondary btn-sm ${size._id === sizeId ? "active" : i === 0 ? "active" : ''}`} style={{ height: "40px", fontSize: "24px", fontWeight: "600" }} defaultChecked={size._id === sizeId ? true : i === 0 ? true : false} onClick={() => handleSizeClick(size)}>
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
                    // <div className="menu-card" key={index}>
                    //   {/* <img className='img-card' src={product.image ? `${apiUrl}/images/${product.image}` : ""} alt="" /> */}
                    //   <img className='img-card' src={defaultsImage} alt="Delicious soup" />
                    //   {product._id == productid & noteArea == true ?
                    //     <form onSubmit={(e) => { addNoteToProduct(e, product._id); setnoteArea(!noteArea) }}>
                    //       <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
                    //       <div className='note-btn'>
                    //         <button>تاكيد</button>
                    //         <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                    //       </div>
                    //     </form> : ''}

                    //   <div className="detalis">
                    //     <div className='product-det'>
                    //       <div className='product-name'>
                    //         <h2>{product.name}</h2>
                    //         <span className="material-symbols-outlined" onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
                    //       </div>
                    //       <p>{product.description}</p>
                    //     </div>
                    //     <div className="btn btn-group" >
                    //       {product.sizes.map(size => (
                    //         <button className="btn btn-secondary" key={size.sizeId} onClick={() => handleSizeClick(size)}>
                    //           {size.sizeName}
                    //         </button>
                    //       ))}
                    //       <div className="price">
                    //         <div className="counter">
                    //           <button className='symb' onClick={() => { decrementProductQuantity(product._id, sizeId); setsizeQuantity(sizeQuantity - 1) }}>-</button>

                    //           <span className='num'>{sizeId ? product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity : 0}</span>
                    //           <button className='symb' onClick={() => { incrementProductQuantity(product._id, sizeId); setsizeQuantity(sizeQuantity + 1) }}>+</button>
                    //         </div>
                    //         {sizePriceAfterDescount > 0 ?
                    //           <p><sup><del>{sizePrice}</del></sup>{sizePriceAfterDescount}ج</p> :
                    //           <p>{sizePrice} ج</p>}
                    //       </div>
                    //     </div>

                    //     {product.available ?
                    //       <div className='card-btn'>
                    //         {itemId.filter((i) => i === sizeId).length > 0 && sizeId && product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity > 0 ?
                    //           <button type="button" className='btn btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id, sizeId) }}>احذف من الطلبات</button>


                    //           : <button type="button" className='btn btn-success addtocart' onClick={() => addItemToCart(product._id, sizeId)}> اضف الي طلباتي</button>
                    //           // : <button type="button" className='btn btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id, sizeId) } }}> اضف الي طلباتي</button>
                    //         }
                    //       </div>
                    //       : <div className='card-btn'>
                    //         <button type="button" className='btn btn-warning delfromcart'>غير متاح الآن</button>
                    //       </div>
                    //     }
                    //   </div>
                    // </div>
                  } else {
                    return (
                      <div className="card mx-auto rounded-3 position-relative" key={index} style={{ maxWidth: "320px", width: "100%", height: '200px' }}>
                        {product._id === productid && noteArea === true ?
                          <form
                            onSubmit={(e) => {
                              addNoteToProduct(e, product._id, '');
                              setnoteArea(!noteArea);
                            }}
                            className="position-absolute w-100 h-100 top-0 start-0 p-3 bg-white rounded-3 d-flex flex-column align-items-center justify-content-center overflow-hidden"
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
                            <div className='note-btn d-flex align-items-center justify-content-center w-100 mt-2' style={{height: '40px'}}>
                              <button className="btn w-50 h-100 text-light btn-success rounded-2 me-2">تاكيد</button>
                              <button
                                onClick={() => setnoteArea(!noteArea)}
                                className="btn w-50 h-100 text-light btn-danger rounded-2"
                              >الغاء</button>
                            </div>
                          </form>
                          : ''}
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
                                  <button type="button" className="btn btn-success btn-block" style={{ fontSize: "14px" }} onClick={() => addItemToCart(product._id, sizeId)}>
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
                            <p className="card-text mb-2">بيتزا شاورما</p>
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

                      // <div className="menu-card" key={index}>
                      //   {/* <img className='img-card' src={product.image ? `${apiUrl}/images/${product.image}` : ""} alt="" /> */}
                      //   <img className='img-card' src={defaultsImage} alt="Delicious soup" />
                      //   {product._id == productid & noteArea == true ? <form onSubmit={(e) => { addNoteToProduct(e, product._id);; setnoteArea(!noteArea) }}>
                      //     <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
                      //     <div className='note-btn'>
                      //       <button>تاكيد</button>
                      //       <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                      //     </div>
                      //   </form> : ''}

                      //   <div className="detalis">
                      //     <div className='product-det'>
                      //       <div className='product-name'>
                      //         <h2>{product.name}</h2>
                      //         <span className="material-symbols-outlined" onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
                      //       </div>
                      //       <p>{product.description}</p>
                      //     </div>
                      //     <div className="price">
                      //       <div className="counter">
                      //         <button className='symb' onClick={() => decrementProductQuantity(product._id)}>-</button>
                      //         <span className='num'>{product.quantity}</span>
                      //         <button className='symb' onClick={() => incrementProductQuantity(product._id)}>+</button>
                      //       </div>
                      //       {product.discount > 0 ?
                      //         <p><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p> :
                      //         <p>{product.price} ج</p>}
                      //     </div>
                      //     {product.available ?
                      //       <div className='card-btn'>
                      //         {itemId.filter((i) => i === product._id).length > 0 && product.quantity > 0 ?
                      //           <button type="button" className='btn btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id) }}>احذف من الطلبات</button>
                      //           : <button type="button" className='btn btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id) } }}> اضف الي طلباتي</button>
                      //         }
                      //       </div>
                      //       : <div className='card-btn'>
                      //         <button type="button" className='btn btn-warning delfromcart'>غير متاح الآن</button>
                      //       </div>
                      //     }
                      //   </div>
                      // </div>
                    )

                  }
                }
                ) : ''}
            </div>



            // <div className="card-group">
            //   {allProducts.length > 0 ? allProducts.filter(pro => pro.category._id === categoryid).map((product, index) => {

            //     if (product.hasSizes) {
            //       return (
            //         <div className="menu-card" key={index}>
            //           {/* <img className='img-card' src={product.image ? `${apiUrl}/images/${product.image}` : ""} alt="" /> */}
            //           <img className='img-card' src={defaultsImage} alt="Delicious soup" />
            //           {product._id == productid & noteArea == true ? 
            //           <form onSubmit={(e) => { addNoteToProduct(e, product._id); setnoteArea(!noteArea) }}>
            //             <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
            //             <div className='note-btn'>
            //               <button>تاكيد</button>
            //               <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
            //             </div>
            //           </form> : ''}

            //           <div className="detalis">
            //             <div className='product-det'>
            //               <div className='product-name'>
            //                 <h2>{product.name}</h2>
            //                 <span className="material-symbols-outlined" onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
            //               </div>
            //               <p>{product.description}</p>
            //             </div>
            //             <div className="btn btn-group" >
            //               {product.sizes.map(size => (
            //                 <button  className="btn btn-secondary" key={size.sizeId} onClick={() => handleSizeClick(size)}>
            //                   {size.sizeName}
            //                 </button>
            //               ))}
            //             <div className="price">
            //               <div className="counter">
            //                 <button className='symb' onClick={() => {decrementProductQuantity(product._id, sizeId) ; setsizeQuantity(sizeQuantity-1)}}>-</button>

            //                 <span className='num'>{sizeId?product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity:0}</span>
            //                 <button className='symb' onClick={() =>{ incrementProductQuantity(product._id , sizeId) ; setsizeQuantity(sizeQuantity+1) }}>+</button>
            //               </div>
            //               {sizePriceAfterDescount > 0 ?
            //                 <p><sup><del>{sizePrice}</del></sup>{sizePriceAfterDescount}ج</p> :
            //                 <p>{sizePrice} ج</p>}
            //             </div>
            //             </div>

            //             {product.available ?
            //               <div className='card-btn'>
            //                 {itemId.filter((i) => i === sizeId).length > 0 && sizeId && product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity > 0 ?
            //                   <button type="button" className='btn btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id, sizeId) }}>احذف من الطلبات</button>


            //                   : <button type="button" className='btn btn-success addtocart' onClick={() =>  addItemToCart(product._id, sizeId)}> اضف الي طلباتي</button>
            //                   // : <button type="button" className='btn btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id, sizeId) } }}> اضف الي طلباتي</button>
            //                 }
            //               </div>
            //               : <div className='card-btn'>
            //                 <button type="button" className='btn btn-warning delfromcart'>غير متاح الآن</button>
            //               </div>
            //             }
            //           </div>
            //         </div>
            //       )
            //     } else {
            //       return (
            //         <div className="menu-card" key={index}>
            //           {/* <img className='img-card' src={product.image ? `${apiUrl}/images/${product.image}` : ""} alt="" /> */}
            //           <img className='img-card' src={defaultsImage} alt="Delicious soup" />
            //           {product._id == productid & noteArea == true ? <form onSubmit={(e) => { addNoteToProduct(e, product._id);; setnoteArea(!noteArea) }}>
            //             <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
            //             <div className='note-btn'>
            //               <button>تاكيد</button>
            //               <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
            //             </div>
            //           </form> : ''}

            //           <div className="detalis">
            //             <div className='product-det'>
            //               <div className='product-name'>
            //                 <h2>{product.name}</h2>
            //                 <span className="material-symbols-outlined" onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
            //               </div>
            //               <p>{product.description}</p>
            //             </div>
            //             <div className="price">
            //               <div className="counter">
            //                 <button className='symb' onClick={() => decrementProductQuantity(product._id)}>-</button>
            //                 <span className='num'>{product.quantity}</span>
            //                 <button className='symb' onClick={() => incrementProductQuantity(product._id)}>+</button>
            //               </div>
            //               {product.discount > 0 ?
            //                 <p><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p> :
            //                 <p>{product.price} ج</p>}
            //             </div>
            //             {product.available ?
            //               <div className='card-btn'>
            //                 {itemId.filter((i) => i === product._id).length > 0 && product.quantity > 0 ?
            //                   <button type="button" className='btn btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id) }}>احذف من الطلبات</button>
            //                   : <button type="button" className='btn btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id) } }}> اضف الي طلباتي</button>
            //                 }
            //               </div>
            //               : <div className='card-btn'>
            //                 <button type="button" className='btn btn-warning delfromcart'>غير متاح الآن</button>
            //               </div>
            //             }
            //           </div>
            //         </div>
            //       )

            //     }
            //   }
            //   ) : ''}
            // </div>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default MenuCard