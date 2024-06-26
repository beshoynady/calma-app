import React, { useContext, useEffect, useRef } from 'react';
import { detacontext } from '../../../../App';
import '../orders/Orders.css'







function InvoiceComponent(props) {
    const { order, handlePrint } = props;
    const { restaurantData, formatdate, usertitle } = useContext(detacontext);
    const printContainer = useRef(null);

    const { cashier, serial, ordertype: orderType, table, name, phone, address, ordernum, listProductsOrder: products, subTotal: orderSubtotal, deliveryCost: orderdeliveryCost, addition, discount, total: orderTotal } = order;

    useEffect(() => {
        console.log({ order, cashier, serial, orderType, table, name, phone, address, ordernum, products, orderSubtotal, orderdeliveryCost, addition, discount, orderTotal });
    }, []);

    return (
        <div id="invoiceOrderModal" className="modal fade">
            {/* <div className="modal-dialog">
        <div className="modal-content">
          <form>
            <div className="modal-header text-light bg-primary">
              <h4 className="modal-title"></h4>
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div ref={printContainer} style={{ maxWidth: '400px', padding: '5px' }}>

<div className="invoice-header" style={{ backgroundColor: '#343a40', color: '#ffffff', padding: '20px', textAlign: 'center' }}>
                <h2>{restaurantData.name}</h2>
                <p>كاشير {cashier && cashier.fullname} | فاتورة #{serial} | {orderType === 'Internal' ? `طاولة ${table && table.tableNumber}` : ''} | التاريخ: </p>
              </div>

              {orderType === 'Delivery' && (
                <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                  <h4>بيانات العميل</h4>
                  <p>الاسم: {name}</p>
                  <p>الموبايل: {phone}</p>
                  <p>العنوان: {address}</p>
                </div>
              )}
              {orderType === 'Takeaway' && (
                <div className="customer-info text-dark" style={{ marginBottom: '20px' }}>
                  <h4>بيانات العميل</h4>
                  <p>الاسم: {name}</p>
                  <p>الموبايل: {phone}</p>
                  <p>رقم الاوردر: {ordernum}</p>
                </div>
              )}

              <table className="table table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" style={{ width: '30%', fontSize: '20px' }}>الصنف</th>
                    <th scope="col" style={{ width: '20%', fontSize: '20px' }}>السعر</th>
                    <th scope="col" style={{ width: '20%', fontSize: '20px' }}>الكمية</th>
                    <th scope="col" style={{ width: '20%', fontSize: '20px' }}>الاجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, i) => (
                    <tr key={i}>
                      <td className="text-truncate" style={{ maxWidth: '200px', fontSize: '18px' }}>{item.name}</td>
                      <td className="text-nowrap" style={{ fontSize: '18px' }}>{item.priceAfterDiscount ? item.priceAfterDiscount : item.price}</td>
                      <td className="text-nowrap" style={{ fontSize: '18px' }}>{item.quantity}</td>
                      <td className="text-nowrap" style={{ fontSize: '18px' }}>{item.totalprice}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ fontSize: '20px' }}>
                    <td colSpan="3">المجموع</td>
                    <td>{orderSubtotal}</td>
                  </tr>
                  {orderdeliveryCost > 0 && (
                    <tr>
                      <td colSpan="3">خدمة التوصيل</td>
                      <td>{orderdeliveryCost}</td>
                    </tr>
                  )}
                  {addition > 0 && (
                    <tr>
                      <td colSpan="3">رسوم إضافية</td>
                      <td>{addition}</td>
                    </tr>
                  )}
                  {discount > 0 && (
                    <tr>
                      <td colSpan="3">خصم</td>
                      <td>{discount}</td>
                    </tr>
                  )}
                  <tr style={{ fontSize: '20px' }}>
                    <td colSpan="3">الإجمالي</td>
                    <td>{orderTotal}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="restaurant-info text-dark" style={{ marginTop: '20px', textAlign: 'center' }}>
                {restaurantData && (
                  <>
                    <p>{restaurantData.name}</p>
                    <p>موبايل: {restaurantData.contact && restaurantData.contact.phone && restaurantData.contact.phone[0]}</p>
                    <p>العنوان: {restaurantData.address && `${restaurantData.address.state} ${restaurantData.address.city} ${restaurantData.address.street}`}</p>
                  </>
                )}
              </div>

              <div className="footer" style={{ marginTop: '30px', textAlign: 'center', color: '#828282' }}>
                <p>Developed by: <span style={{ color: '#5a6268' }}>beshoy Nady</span></p>
                <p>موبايل: <span style={{ color: '#5a6268' }}>01122455010</span></p>
              </div>
            </div>
            <div className="modal-footer d-flex flex-nowrap align-items-center justify-content-between">
              <input type="button" className="btn w-50 btn-danger" data-dismiss="modal" value="Cancel" />
              <input type="submit" className="btn w-50 btn-success" value="Print" onClick={handlePrint} />
            </div>
          </form>
        </div>
      </div> */}
        </div>
    );
}

export default InvoiceComponent;
