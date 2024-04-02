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
        ({ allProducts, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, itemId }) => {

          return (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {allProducts.length > 0 && allProducts.filter(pro => pro.category === categoryid).map((product, index) => (
                <div className="col" key={index}>
                  <div className="card h-100">
                    <img src={product.image ? `${apiUrl}/images/${product.image}` : ""} className="card-img-top img-card" alt="" />
                    {product._id === productId && noteArea &&
                      <form className="card-body" onSubmit={(e) => { addNoteToProduct(e, product._id); setNoteArea(!noteArea) }}>
                        <textarea className="form-control" placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setProductNote(e.target.value) }}></textarea>
                        <div className='note-btn'>
                          <button type="submit" className="btn btn-primary">تاكيد</button>
                          <button type="button" className="btn btn-secondary" onClick={() => setNoteArea(!noteArea)}>الغاء</button>
                        </div>
                      </form>
                    }

                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                    </div>

                    <div className="card-footer">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => decrementProductQuantity(product._id)}>-</button>
                          <span>{product.quantity}</span>
                          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => incrementProductQuantity(product._id)}>+</button>
                        </div>
                        <div>
                          {product.discount > 0 ?
                            <p className="price"><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p> :
                            <p className="price">{product.price} ج</p>}
                        </div>
                      </div>

                      {product.avaliable ?
                        <div className='card-btn'>
                          {itemId.filter((i) => i === product._id).length > 0 && product.quantity > 0 ?
                            <button type="button" className='btn btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id) }}>احذف من الطلبات</button>
                            : <button type="button" className='btn btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id) } }}> اضف الي طلباتي</button>
                          }
                        </div>
                        : <div className='card-btn'>
                          <button type="button" className='btn btn-warning delfromcart'>غير متاح الآن</button>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }}
    </detacontext.Consumer>
  )
}

export default MenuCard;