import React, { useRef, useState } from 'react';
import { detacontext } from '../../../../App'
import { ToastContainer, toast } from 'react-toastify';

import defaultsImage from '../../../../image/menu/soup.jpg'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './Offers.css';

// import required modules
import { EffectCoverflow, Pagination } from 'swiper/modules';

export default function Offers() {

  const apiUrl = process.env.REACT_APP_API_URL;

  const [noteArea, setnoteArea] = useState(false)
  const [productid, setproductid] = useState('')


  return (
    <detacontext.Consumer>
      {
        ({ allProducts, itemId, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, }) => {
          return (
            <section id='offer' className='offers-section'>
              <div className='section-title'>
                <h2>العروض</h2>
              </div>
              <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                  rotate: 30,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination]}
                className="mySwiper"
              >

                {allProducts.map((product, productIndex) => {
                  if (product.hasSizes) {
                    return product.sizes.map((size, sizeIndex) => {
                      if (size.sizeDiscount > 0) {
                        return (
                          <SwiperSlide key={size._id}>
                            <div className="offer-card">
                              <img className='offer-img' src={defaultsImage} alt="Delicious soup" />
                              {size._id === productid && noteArea && (
                                <div className='offers-note'>
                                  <form onSubmit={(e) => { addNoteToProduct(e, size._id); setnoteArea(!noteArea); }}>
                                    <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value); }}></textarea>
                                    <div className='note-btn'>
                                      <button type="submit">تاكيد</button>
                                      <button type="button" onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                                    </div>
                                  </form>
                                </div>
                              )}
                              <div className="offer-detalis">
                                <div className='offer-info'>
                                  <div className='p-info'>
                                    <h2 className='p-name'>{`${product.name} - ${size.sizeName}`}</h2>
                                    <span className="material-symbols-outlined note-icon" onClick={() => { setnoteArea(!noteArea); setproductid(size._id); }}>note_alt</span>
                                  </div>
                                  <div className='offer-description'>{size.description}</div>
                                </div>
                                <div className="offer-price">
                                  <div className="p-counter">
                                    <button className='counter-symb' onClick={() => { decrementProductQuantity(product._id, size._id) }}>-</button>
                                    <div className='counter-num'>{size.sizeQuantity}</div>
                                    <button className='counter-symb' onClick={() => { incrementProductQuantity(product._id, size._id) }}>+</button>
                                  </div>
                                  <div className='p-price'>
                                    {size.sizePriceAfterDiscount}ج <span>{size.sizePrice}</span>
                                  </div>
                                </div>
                                <div className='offer-card-btn'>
                                  {itemId.filter((i) => i === size._id).length > 0 && size.sizeQuantity > 0 ? (
                                    <button className='delcart' onClick={() => { deleteItemFromCart(product._id, size._id); }}>
                                      احذف من الطلبات
                                    </button>
                                  ) : (
                                    <button className='addtocart' onClick={() => { if (size.sizeQuantity > 0) { addItemToCart(product._id, size._id) } }}>
                                      اضف الي طلباتي
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      }
                      return null;
                    });
                  } else if (product.discount > 0) {
                    return (
                      <SwiperSlide key={product._id}>
                        <div className="offer-card">
                          <img className='offer-img' src={defaultsImage} alt="Delicious soup" />
                          {product._id === productid && noteArea && (
                            <div className='offers-note'>
                              <form onSubmit={(e) => { addNoteToProduct(e, product._id); setnoteArea(!noteArea); }}>
                                <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value); }}></textarea>
                                <div className='note-btn'>
                                  <button type="submit">تاكيد</button>
                                  <button type="button" onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                                </div>
                              </form>
                            </div>
                          )}
                          <div className="offer-detalis">
                            <div className='offer-info'>
                              <div className='p-info'>
                                <h2 className='p-name'>{product.name}</h2>
                                <span className="material-symbols-outlined note-icon" onClick={() => { setnoteArea(!noteArea); setproductid(product._id); }}>note_alt</span>
                              </div>
                              <div className='offer-description'>{product.description}</div>
                            </div>
                            <div className="offer-price">
                              <div className="p-counter">
                                <button className='counter-symb' onClick={() => { decrementProductQuantity(product._id) }}>-</button>
                                <div className='counter-num'>{product.quantity}</div>
                                <button className='counter-symb' onClick={() => { incrementProductQuantity(product._id) }}>+</button>
                              </div>
                              <div className='p-price'>
                                {product.price - product.discount}ج <span>{product.price}</span>
                              </div>
                            </div>
                            <div className='offer-card-btn'>
                              {itemId.filter((i) => i === product._id).length > 0 && product.quantity > 0 ? (
                                <button className='delcart' onClick={() => { deleteItemFromCart(product._id); }}>
                                  احذف من الطلبات
                                </button>
                              ) : (
                                <button className='addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id); } }}>
                                  اضف الي طلباتي
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  }
                  return null;
                })}


              </Swiper>
            </section>
          )
        }
      }
    </detacontext.Consumer>
  );

}
