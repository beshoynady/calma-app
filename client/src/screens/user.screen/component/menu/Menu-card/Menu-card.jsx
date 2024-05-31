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
            <div className="card mx-auto" style={{ maxWidth: "400px", width: "100%" }}>
            <div className="row g-0 h-100">
              <div className="col-5 d-flex flex-column justify-content-between">
                <img src={defaultsImage} className="img-fluid" alt="Delicious soup" />
                <button type="button" className="btn btn-success btn-block" style={{ fontSize: "14px" }}>أضف الى طلباتي</button>
              </div>
              <div className="col-7 d-flex flex-column p-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">بيتزا شاورما</h5>
                  <span className="material-icons" style={{ color: "red", fontSize: "24px" }}>note_alt</span>
                </div>
                <p className="card-text mb-2">بيتزا شاورما</p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <label className="btn btn-outline-secondary btn-sm">
                      <input type="radio" name="size" id="sizeS" /> S
                    </label>
                    <label className="btn btn-outline-secondary btn-sm active">
                      <input type="radio" name="size" id="sizeM" defaultChecked /> M
                    </label>
                    <label className="btn btn-outline-secondary btn-sm">
                      <input type="radio" name="size" id="sizeL" /> L
                    </label>
                  </div>
                  <div className="d-flex flex-column align-items-end">
                    <small className="text-muted"><s>150ج</s></small>
                    <span className="text-danger fw-bold">103ج</span>
                  </div>
                </div>
                <div className="input-group input-group-sm">
                  <button className="btn btn-outline-secondary" type="button">+</button>
                  <input type="text" className="form-control text-center" readOnly value="0" />
                  <button className="btn btn-outline-secondary" type="button">-</button>
                </div>
              </div>
            </div>
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

            //             {product.avaliable ?
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
            //             {product.avaliable ?
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