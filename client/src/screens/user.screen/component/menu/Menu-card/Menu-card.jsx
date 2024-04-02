import React, { useState } from 'react';
import { detacontext } from '../../../../../App';
import { Card, Button, Form } from 'react-bootstrap';

const MenuCard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [noteArea, setNoteArea] = useState(false);
  const [productId, setProductId] = useState('');

  return (
    <detacontext.Consumer>
      {({ allProducts, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setProductNote, addNoteToProduct, itemId }) => (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {allProducts.length > 0 && allProducts.filter(pro => pro.category._id === categoryid).map((product, index) => (
            <div key={index} className="col">
              <Card className="h-100">
                <Card.Img variant="top" src={product.image ? `${apiUrl}/images/${product.image}` : ""} />
                {product._id === productId && noteArea && (
                  <Form onSubmit={(e) => { addNoteToProduct(e, product._id); setNoteArea(!noteArea) }} className="position-absolute w-100 h-100 top-0 end-0 d-flex flex-column align-items-center justify-content-center">
                    <Form.Control as="textarea" placeholder='اضف تعليماتك الخاصة بهذا الطبق' name="note" onChange={(e) => { setProductNote(e.target.value) }} className="w-75 mb-3" rows={3} />
                    <div className="w-100 d-flex justify-content-center">
                      <Button type="submit" className="me-2">تاكيد</Button>
                      <Button onClick={() => setNoteArea(!noteArea)}>الغاء</Button>
                    </div>
                  </Form>
                )}

                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Button variant="outline-primary" className="me-2" onClick={() => decrementProductQuantity(product._id)}>-</Button>
                      <span>{product.quantity}</span>
                      <Button variant="outline-primary" className="ms-2" onClick={() => incrementProductQuantity(product._id)}>+</Button>
                    </div>
                    <div>
                      {product.discount > 0 ?
                        <p className="m-0"><del>{product.price}</del> - {product.discount} ج</p> :
                        <p className="m-0">{product.price} ج</p>
                      }
                    </div>
                  </div>
                  <div className="mt-2">
                    {product.avaliable ?
                      itemId.includes(product._id) && product.quantity > 0 ?
                        <Button variant="danger" onClick={() => deleteItemFromCart(product._id)}>احذف من الطلبات</Button> :
                        <Button variant="success" onClick={() => addItemToCart(product._id)}>اضف الي طلباتي</Button> :
                      <Button variant="warning" disabled>غير متاح الآن</Button>
                    }
                    <Button variant="secondary" onClick={() => { setNoteArea(!noteArea); setProductId(product._id) }} className="ms-2">اضف ملاحظة</Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </detacontext.Consumer>
  );
}

export default MenuCard;
