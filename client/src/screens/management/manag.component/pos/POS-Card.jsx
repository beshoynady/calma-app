import React, { useState } from 'react';
import { detacontext } from '../../../../App';
import defaultsImage from '../../../../image/menu/soup.jpg';

const POSCard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [noteArea, setnoteArea] = useState(false);
  const [extraArea, setextraArea] = useState(false);
  const [productid, setproductid] = useState('');
  const [size, setsize] = useState('');
  const [sizeId, setsizeId] = useState('');
  const [sizeQuantity, setsizeQuantity] = useState(0);
  const [sizePrice, setsizePrice] = useState();
  const [sizePriceAfterDescount, setsizePriceAfterDescount] = useState();

  const handleSelectSize = (size) => {
    setsize(size);
    setsizeId(size._id);
    setsizeQuantity(size.sizeQuantity);
    setsizePrice(size.sizePrice);
    if (size.sizeDiscount > 0) {
      setsizePriceAfterDescount(size.sizePrice - size.sizeDiscount);
    }
  };

  const [selectedButtonIndex, setSelectedButtonIndex] = useState(1);

  return (
    <detacontext.Consumer>
      {({ allProducts, categoryid, addItemToCart, deleteItemFromCart, incrementProductQuantity, decrementProductQuantity, setproductNote, addNoteToProduct, addExtrasToProduct, handleAddProductExtras, productExtras, itemId }) => {
        return (
          <div className="d-flex flex-wrap flex-md-row">
            {allProducts.length > 0
              ? allProducts
                .filter((pro) => pro.category._id === categoryid)
                .map((product, index) => {
                  if (product.hasSizes) {
                    return (
                      <div className="card mx-auto m-2 bg-light shadow-sm border-0" key={index} style={{ width: '180px', height: '280px', transition: 'transform 0.3s, border-color 0.3s' }}>
                        <div className="d-flex flex-column justify-content-between" style={{ width: '100%', height: '50%' }} onClick={() => { sizeId && addItemToCart(product._id, sizeId) }}>
                          <img src={defaultsImage} className="img-fluid h-100 w-100 rounded" alt="Delicious soup" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="d-flex row justify-content-between align-items-center mb-2">
                          <div className="btn-group w-100 p-0 m-0 btn-group-toggle" style={{ direction: 'ltr' }} data-toggle="buttons">
                            {product.sizes.length > 0 &&
                              product.sizes.map((size, i) => {
                                return (
                                  <label
                                    key={i}
                                    className={`d-flex justify-content-center align-items-center col-4 btn ${size._id === sizeId ? 'btn-info' : 'btn-primary'}`}
                                    style={{ height: '40px', fontSize: '12px', fontWeight: '600' }}
                                    defaultChecked={size._id === sizeId ? true : i === 0 ? true : false}
                                    onClick={() => handleSelectSize(size)}
                                  >
                                    <input type="radio" name="size" id={`sizeS${i}`} />
                                    {size.sizeName}
                                  </label>
                                );
                              })}
                          </div>
                        </div>

                        <div className="d-flex bg-light justify-content-between align-items-center p-0 mx-1">
                          <h5 className="card-title text-dark mb-0 text-truncate" style={{ width: '60%', fontSize: '14px', fontWeight: '700' }}>{product.name}</h5>
                          <div className="text-end">
                            {product.sizes.length > 0 &&
                              product.sizes.map((size, i) => {
                                if (size._id === sizeId) {
                                  return (
                                    <React.Fragment key={i}>
                                      {size.sizePriceAfterDescount > 0 ? (
                                        <>
                                          <span className="text-success fw-bold">{size.sizePriceAfterDescount}ج</span>
                                          <sup>
                                            <del className="text-muted" style={{ fontSize: '10px', fontWeight: '900' }}>
                                              {size.sizePrice}ج
                                            </del>
                                          </sup>
                                        </>
                                      ) : (
                                        <span className="text-success fw-bold">{size.sizePrice}ج</span>
                                      )}
                                    </React.Fragment>
                                  );
                                }
                                return null;
                              })}
                          </div>
                        </div>
                        <div className="d-flex bg-light justify-content-between align-items-center p-0 mx-1">
                          <h6 className="card-subtitle text-muted mb-0" style={{ fontSize: '12px' }}>{product.description}</h6>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="card mx-auto m-2 bg-light shadow-sm border-0" key={index} style={{ width: '180px', height: '250px', transition: 'transform 0.3s, border-color 0.3s' }} onClick={() => { addItemToCart(product._id, sizeId) }}>
                        <div className="d-flex flex-column justify-content-between" style={{ width: '100%', height: '50%' }}>
                          <img src={defaultsImage} className="img-fluid h-100 w-100 rounded" alt="Delicious soup" style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="d-flex bg-light justify-content-between align-items-center p-0 mx-1 mt-1">
                          <h5 className="card-title text-dark mb-0 text-truncate" style={{ width: '60%', fontSize: '14px', fontWeight: '700' }}>{product.name}</h5>
                          <div className="text-end">
                            {product.discount > 0 ? (
                              <>
                                <span className="text-success fw-bold">{product.priceAfterDiscount}ج</span>
                                <sup>
                                  <del className="text-muted" style={{ fontSize: '10px', fontWeight: '900' }}>
                                    {product.price}ج
                                  </del>
                                </sup>
                              </>
                            ) : (
                              <span className="text-success fw-bold">{product.price}ج</span>
                            )}
                          </div>
                        </div>
                        <div className="d-flex bg-light justify-content-between align-items-center p-0 mx-1">
                          <h6 className="card-subtitle text-muted mb-0" style={{ fontSize: '12px' }}>{product.description}</h6>
                        </div>
                      </div>
                    );
                  }
                })
              : ''}
          </div>
        );
      }}
    </detacontext.Consumer>
  );
};

export default POSCard;
