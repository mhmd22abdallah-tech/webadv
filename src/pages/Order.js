import React from "react";
import { useNavigate } from "react-router-dom";

function Order({ order }) {
    const navigate = useNavigate();
    return (
        <div className="container mt-5 text-center">
            <h2 className="text-danger">Thank you for Your Order</h2>
            <p className="lead">Your Order has been Placed</p>
            <div className="card shadow p-4 mt-4">
                <h3 className="text-danger">Order Summary</h3>
                <p className="fw-bold">Order Number: {order.orderNumber}</p>
                <div className="mt-3 border-top pt-3">
                    <h2 className="h5 text-secondary">Shipping Information</h2>
                    
                    <p>{order.shippingInformation.address}</p>
                    <p>{order.shippingInformation.city}, {order.shippingInformation.zip}</p>
                </div>
                <div className="mt-3 border-top pt-3">
                    <h3 className="text-secondary">Products Ordered</h3>
                    {order.products.map((product) => (
                        <div  className="d-flex justify-content-between border-bottom py-2">
                            <p className="mb-0">{product.name} x {product.quantity}</p>
                            <p className="mb-0">${product.price * product.quantity}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-3 border-top pt-3 d-flex justify-content-between">
                    <span className="fw-bold">Total Price:</span>
                    <span className="fw-bold text-danger">${order.totalPrice}</span>
                </div>
                <div className="mt-4 d-flex justify-content-center gap-3">
                    <button className="btn btn-secondary">Order Tracking</button>
                    <button className="btn btn-danger" onClick={() => navigate('/home')}>Continue Shopping</button>
                </div>
            </div>
        </div>
    );
}

export default Order;
