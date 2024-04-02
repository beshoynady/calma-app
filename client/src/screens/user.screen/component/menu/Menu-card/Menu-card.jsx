import React, { useState } from 'react';
import { detacontext } from '../../../../../App';
import { Form, Button, Card, Col, Row } from 'react-bootstrap';

const MenuCard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [noteArea, setnoteArea] = useState(false)
  const [productid, setproductid] = useState('')
  return (
    <detacontext.Consumer>
      {
        ({ allProducts, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, itemId }) => {
          return (
            <Row xs={1} md={2} className="g-4">
              {allProducts.length > 0 && allProducts.filter(pro => pro.category === categoryid).map((product, index) => (
                <Col key={index}>
                  <Card className="menu-card">
                    <Card.Img variant="top" src={product.image ? `${apiUrl}/images/${product.image}` : ""} className='img-card' />
                    {product._id === productid && noteArea && (
                      <Form onSubmit={(e) => { addNoteToProduct(e, product._id); setnoteArea(!noteArea) }}>
                        <Form.Control as="textarea" placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" rows="3" onChange={(e) => { setproductNote(e.target.value) }} />
                        <div className='note-btn'>
                          <Button type="submit">تاكيد</Button>
                          <Button onClick={() => setnoteArea(!noteArea)}>الغاء</Button>
                        </div>
                      </Form>
                    )}

                    <Card.Body>
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
                            <Button className='symb' onClick={() => decrementProductQuantity(product._id)}>-</Button>
                            <span className='num'>{product.quantity}</span>
                            <Button className='symb' onClick={() => incrementProductQuantity(product._id)}>+</Button>
                          </div>
                          {product.discount > 0 ?
                            <p><sup><del>{product.price}</del></sup>{product.price - product.discount}ج</p> :
                            <p>{product.price} ج</p>}
                        </div>
                        {product.avaliable ?
                          <div className='card-btn'>
                            {itemId.filter((i) => i === product._id).length > 0 && product.quantity > 0 ?
                              <Button type="button" className='btn btn-danger delfromcart' onClick={() => { deleteItemFromCart(product._id) }}>احذف من الطلبات</Button>
                              : <Button type="button" className='btn btn-success addtocart' onClick={() => { if (product.quantity > 0) { addItemToCart(product._id) } }}> اضف الي طلباتي</Button>
                            }
                          </div>
                          : <div className='card-btn'>
                            <Button type="button" className='btn btn-warning delfromcart'>غير متاح الآن</Button>
                          </div>
                        }
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )
        }
      }
    </detacontext.Consumer>
  )
}

export default MenuCard
