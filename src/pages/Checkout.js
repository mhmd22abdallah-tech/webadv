import React, { useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Checkout({setOrder}) {
    const [billiningToggle, setBillingToggle] = useState(true);
    const [shippingToggle, setShippingToggle] = useState(false);
    const [paymentToggle, setPaymentToggle] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const cart = useSelector(state => state.cart);
    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        zip: ''
    });
    const navigate=useNavigate()
    function handleOrder(){
       const newOrder = {
            products:cart.products,
            totalPrice:cart.totalPrice,
            orderNumber:"12344",
            shippingInformation: shippingInfo


        }
        console.log("Placing Order:", newOrder);
        setOrder(newOrder)
        setTimeout(() => navigate('/order-confirmation'), 100);
    }

    return (
        <div className="container py-4">
            <h3 className="mb-4">Checkout</h3>
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center" onClick={() => setBillingToggle(!billiningToggle)}>
                            <h5 className="mb-0">Billing Information</h5>
                            {billiningToggle ? <FaAngleDown /> : <FaAngleUp />}
                        </div>
                        {billiningToggle &&
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" name="name" placeholder="Enter Name" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" placeholder="Enter Email" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="number" className="form-control" name="phone" placeholder="Enter Phone" />
                                </div>
                            </div>
                        }
                    </div>
                    <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center" onClick={() => setShippingToggle(!shippingToggle)}>
                            <h5 className="mb-0">Shipping Information</h5>
                            {shippingToggle ? <FaAngleDown /> : <FaAngleUp />}
                        </div>
                        {shippingToggle &&
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <input type="text" className="form-control" name="address" placeholder="Enter Address" onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">City</label>
                                    <input type="text" className="form-control" name="city" placeholder="Enter City" onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Zip Code</label>
                                    <input type="text" className="form-control" name="zipcode" placeholder="Enter Zip Code" onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })} />
                                </div>
                            </div>
                        }
                    </div>
                    <div className="card mb-3">
                        <div className="card-header d-flex justify-content-between align-items-center" onClick={() => setPaymentToggle(!paymentToggle)}>
                            <h5 className="mb-0">Payment Information</h5>
                            {paymentToggle ? <FaAngleDown /> : <FaAngleUp />}
                        </div>
                        {paymentToggle &&
                            <div className="card-body">
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                                    <label className="form-check-label">Cash on Delivery</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="radio" name="payment" checked={paymentMethod === 'dc'} onChange={() => setPaymentMethod('dc')} />
                                    <label className="form-check-label">Debit Card</label>
                                </div>
                                {paymentMethod === 'dc' && (
                                    <div className="mt-3">
                                        <h5>Debit Card Information</h5>
                                        <div className="mb-3">
                                            <label className="form-label">Card Number</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Card Holder Name</label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Expire Date</label>
                                                <input type="text" className="form-control" />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">CVV</label>
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Order Summary</h5>
                        </div>
                        <div className="card-body">
                            {cart.products.map(product => (
                                <div className="d-flex mb-2" key={product.id}>
                                    <img src={product.image} alt="" className="img-thumbnail me-2" style={{ width: '60px' }} />
                                    <div>
                                        <h6 className="mb-0">{product.name}</h6>
                                        <p className="mb-0">${product.price} × {product.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between mt-3">
                                <span>Total Price:</span>
                                <span className="fw-bold">$ {cart.totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-danger w-100 mt-3" onClick={handleOrder}>Place Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
