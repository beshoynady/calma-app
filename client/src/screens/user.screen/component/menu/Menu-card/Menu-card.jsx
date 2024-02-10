import React, { useState } from 'react';
import './Menu-card.css';
import { detacontext } from '../../../../../App';

const MenuCard = () => {
   const apiUrl = process.env.REACT_APP_API_URL;

   const [noteArea, setnoteArea] = useState(false)
   const [productid, setproductid] = useState('')
   return (
      <detacontext.Consumer>
         {
            ({ allProducts, categoryid, additemtocart, deleteitems, increment, descrement, setproductnote, addnotrstoproduct, itemid }) => {
               return (
                  <div className="card-group">
                     {allProducts.length > 0 ? allProducts.filter(pro => pro.category === categoryid).map((product, index) => {
                        return (
                           <div className="menu-card" key={index}>
                              <img className='img-card' src={product.image ? `${apiUrl}/images/${product.image}` : ''} alt="" />
                              {product._id == productid & noteArea == true ? <form onSubmit={(e) => { addnotrstoproduct(e, product._id);; setnoteArea(!noteArea) }}>
                                 <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductnote(e.target.value) }}></textarea>
                                 <div className='note-btn'>
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
                                       <button className='symb' onClick={() => descrement(product._id)}>-</button>
                                       <span className='num'>{product.quantity}</span>
                                       <button className='symb' onClick={() => increment(product._id)}>+</button>
                                    </div>
                                    {product.discount > 0 ?
                                       <p><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p> :
                                       <p>{product.price} ج</p>}
                                 </div>
                                 {product.avaliable ?
                                    <div className='card-btn'>
                                       {
                                          itemid.filter((i) => i === product._id).length > 0  && product.quantity > 0 ?
                                             <button type="button" className='btn btn-danger delfromcart' onClick={() => { deleteitems(product._id) }}>احذف من الطلبات</button>
                                             : <button type="button" className='btn btn-success addtocart' onClick={() => { if (product.quantity > 0) { additemtocart(product._id) } }}> اضف الي طلباتي</button>
                                       }
                                    </div>
                                    : <div className='card-btn'>
                                       <button type="button" className='btn btn-warning delfromcart'>غير متاح الآن</button>
                                    </div>


                                 }
                              </div>
                           </div>
                        )
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