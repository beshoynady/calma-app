import React, { useState } from 'react';
import './Menu-card.css';
import { detacontext } from '../../../../../App';

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
            <div className="card-group">
              {allProducts.length > 0 ? allProducts.filter(pro => pro.category._id === categoryid).map((product, index) => {
                if (product.hasSizes) {
                  return (
                    <div className="menu-card" key={index}>
                      <img className='img-card' src={product.image ? `${apiUrl}/images/${product.image}` : ""} alt="" />
                      {product._id == productid & noteArea == true ? <form onSubmit={(e) => { addNoteToProduct(e, product._id); setnoteArea(!noteArea) }}>
                        <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
                        <div className='note-btn btn-47'>
                          <button>تاكيد</button>
                          <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                        </div>
                      </form> : ''}

                      <div className="detalis">
                        <div className='product-det'>
                          <div className='product-name'>
                            <h2>{product.name}</h2>
                            <span className="material-symbols-outlined" onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
                          </div>
                          <p>{product.description}</p>
                        </div>
                        <div class="btn btn-group" >
                          {product.sizes.map(size => (
                            <button  className="btn btn-47 btn-secondary" key={size.sizeId} onClick={() => handleSizeClick(size)}>
                              {size.sizeName}
                            </button>
                          ))}
                        <div className="price">
                          <div className="counter">
                            <button className='symb' onClick={() => {decrementProductQuantity(product._id, sizeId) ; setsizeQuantity(sizeQuantity-1)}}>-</button>
                            
                            <span className='num'>{sizeId?product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity:0}</span>
                            <button className='symb' onClick={() =>{ incrementProductQuantity(product._id , sizeId) ; setsizeQuantity(sizeQuantity+1) }}>+</button>
                          </div>
                          {sizePriceAfterDescount > 0 ?
                            <p><sup><del>{sizePrice}</del></sup>{sizePriceAfterDescount}ج</p> :
                            <p>{sizePrice} ج</p>}
                        </div>
                        </div>
                        {product.avaliable ?
                          <div className='card-btn btn-47'>
                            {itemId.filter((i) => i === sizeId).length > 0 && sizeId&&product.sizes.filter(size => size._id === sizeId)[0].sizeQuantity > 0 ?
                              <button type="button" className='btn btn-47 btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id, sizeId) }}>احذف من الطلبات</button>
                              : <button type="button" className='btn btn-47 btn-success addtocart' onClick={() =>  addItemToCart(product._id, sizeId)}> اضف الي طلباتي</button>
                              // : <button type="button" className='btn btn-47 btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id, sizeId) } }}> اضف الي طلباتي</button>
                            }
                          </div>
                          : <div className='card-btn btn-47'>
                            <button type="button" className='btn btn-47 btn-warning delfromcart'>غير متاح الآن</button>
                          </div>
                        }
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div className="menu-card" key={index}>
                      <img className='img-card' src={product.image ? `${apiUrl}/images/${product.image}` : ""} alt="" />
                      {product._id == productid & noteArea == true ? <form onSubmit={(e) => { addNoteToProduct(e, product._id);; setnoteArea(!noteArea) }}>
                        <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
                        <div className='note-btn btn-47'>
                          <button>تاكيد</button>
                          <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                        </div>
                      </form> : ''}

                      <div className="detalis">
                        <div className='product-det'>
                          <div className='product-name'>
                            <h2>{product.name}</h2>
                            <span className="material-symbols-outlined" onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
                          </div>
                          <p>{product.description}</p>
                        </div>
                        <div className="price">
                          <div className="counter">
                            <button className='symb' onClick={() => decrementProductQuantity(product._id)}>-</button>
                            <span className='num'>{product.quantity}</span>
                            <button className='symb' onClick={() => incrementProductQuantity(product._id)}>+</button>
                          </div>
                          {product.discount > 0 ?
                            <p><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p> :
                            <p>{product.price} ج</p>}
                        </div>
                        {product.avaliable ?
                          <div className='card-btn btn-47'>
                            {itemId.filter((i) => i === product._id).length > 0 && product.quantity > 0 ?
                              <button type="button" className='btn btn-47 btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id) }}>احذف من الطلبات</button>
                              : <button type="button" className='btn btn-47 btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id) } }}> اضف الي طلباتي</button>
                            }
                          </div>
                          : <div className='card-btn btn-47'>
                            <button type="button" className='btn btn-47 btn-warning delfromcart'>غير متاح الآن</button>
                          </div>
                        }
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