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

                {allProducts.map((product, index) => {
                  if(product.hasSize){
                    product.sizes.map(size=>{
                      if(size.sizeDiscount>0){
                        return (
                          <SwiperSlide>
                            <div className="offer-card" key={index}>
                              {/* <img className='offer-img' src={`${apiUrl}/images/${product.image}`} alt="" /> */}
                              <img className='offer-img' src={defaultsImage} alt="Delicious soup" />
                              {size._id == productid & noteArea == true ?
                                <div className='offers-note'>
                                  <form onSubmit={(e) => { addNoteToProduct(e, size._id); setnoteArea(!noteArea) }}>
                                    <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق ' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
                                    <div className='note-btn'>
                                      <button>تاكيد</button>
                                      <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                                    </div>
                                  </form>
                                </div>
                                : ''}
      
                              <div className="offer-detalis">
                                <div className='offer-info'>
                                  <div className='p-info'>
                                    <h2 className='p-name'>{product.name}</h2>
                                    <span className="material-symbols-outlined note-icon" onClick={() => { setnoteArea(!noteArea); setproductid(size._id) }}>note_alt</span>
                                  </div>
                                  <div className='offer-description'>{size.description}</div>
                                </div>
                                <div className="offer-price">
                                  <div className="p-counter">
                                    <button className='counter-symb' onClick={() => {decrementProductQuantity(product._id, size._id) ; setsizeQuantity(sizeQuantity-1)}}>-</button>
                                    <div className='counter-num'>{size.sizeQuantity}</div>
                                    <button className='counter-symb' onClick={() =>{incrementProductQuantity(product._id , size._id) ; setsizeQuantity(sizeQuantity+1) }}>+</button>
      
                                  </div>
                                  <div className='p-price'>{product.price - product.discount}ج <span>{product.price}</span></div>
                                </div>
                                <div className='offer-card-btn'>
                                  {
                                    (itemId.includes(product._id) ||
                                      (sizeId && itemId.includes(sizeId) && product.sizes.some(size => size._id === sizeId && size.sizeQuantity > 0)))
                                      ? (
                                        <button className='delcart' onClick={() => { deleteItemFromCart(product._id, size._id) }}>
                                          احذف من الطلبات
                                        </button>
                                      ) : (
                                        <button className='addtocart' onClick={() => { addItemToCart(product._id, size._id) }}>
                                          اضف الي طلباتي
                                        </button>
                                      )
                                  }
      
                                </div>
                              </div>
                            </div>
      
                          </SwiperSlide>
                        )
                      }
                    }
                    )
                  }else
                  return (
                    <SwiperSlide>
                      <div className="offer-card" key={index}>
                        {/* <img className='offer-img' src={`${apiUrl}/images/${product.image}`} alt="" /> */}
                        <img className='offer-img' src={defaultsImage} alt="Delicious soup" />
                        {product._id == productid & noteArea == true ?
                          <div className='offers-note'>
                            <form onSubmit={(e) => { addNoteToProduct(e, product._id); setnoteArea(!noteArea) }}>
                              <textarea placeholder='اضف تعليماتك الخاصة بهذا الطبق ' name="note" cols="100" rows="3" onChange={(e) => { setproductNote(e.target.value) }}></textarea>
                              <div className='note-btn'>
                                <button>تاكيد</button>
                                <button onClick={() => setnoteArea(!noteArea)}>الغاء</button>
                              </div>
                            </form>
                          </div>
                          : ''}

                        <div className="offer-detalis">
                          <div className='offer-info'>
                            <div className='p-info'>
                              <h2 className='p-name'>{product.name}</h2>
                              <span className="material-symbols-outlined note-icon" onClick={() => { setnoteArea(!noteArea); setproductid(product._id) }}>note_alt</span>
                            </div>
                            <div className='offer-description'>{product.description}</div>
                          </div>
                          <div className="offer-price">
                            <div className="p-counter">
                              <button className='counter-symb' onClick={() => {decrementProductQuantity(product._id, sizeId) ; setsizeQuantity(sizeQuantity-1)}}>-</button>
                              <div className='counter-num'>{product.quantity}</div>
                              <button className='counter-symb' onClick={() =>{incrementProductQuantity(product._id , sizeId) ; setsizeQuantity(sizeQuantity+1) }}>+</button>

                            </div>
                            <div className='p-price'>{product.price - product.discount}ج <span>{product.price}</span></div>
                          </div>
                          <div className='offer-card-btn'>
                            {
                              (itemId.includes(product._id) ||
                                (sizeId && itemId.includes(sizeId) && product.sizes.some(size => size._id === sizeId && size.sizeQuantity > 0)))
                                ? (
                                  <button className='delcart' onClick={() => { deleteItemFromCart(product._id) }}>
                                    احذف من الطلبات
                                  </button>
                                ) : (
                                  <button className='addtocart' onClick={() => { addItemToCart(product._id, sizeId) }}>
                                    اضف الي طلباتي
                                  </button>
                                )
                            }

                          </div>
                        </div>
                      </div>

                    </SwiperSlide>
                  )
                }
                )}
              </Swiper>
            </section>
          )
        }
      }
    </detacontext.Consumer>
  );

}
