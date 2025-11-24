
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2"


function ProductDetail() {
    const { id } = useParams();
    const products = useSelector((state) => state.product.products);
    const [product, setProduct] = useState();
    const dispatch=useDispatch()

    useEffect(() => {
        const newProduct = products.find((product) => product.id === parseInt(id));
        setProduct(newProduct);
    }, [id]);



function handleAddToCart(e){

    e.preventDefault()
    dispatch(addToCart(product))
    showAlert()
  }
  function showAlert(){
      Swal.fire({
        title: "Product Added Sucessfully",
        text: "You clicked the button!",
        icon: "success"
      });
    }

    if (!product) {
        return <div className="text-center mt-5">Product not found</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.image} alt={product.name} className="img-fluid rounded shadow" />
                </div>
                <div className="col-md-6">
                    <h2 className="fw-bold">{product.name}</h2>
                    <p className="text-danger fs-4">$ {product.price}</p>
                    <div className="d-flex align-items-center gap-2">
                        <input id="quantity" type="number" min="1" className="form-control w-25" />
                        <button className="btn btn-danger" onClick={(e) => handleAddToCart(e,product.id)}>Add To Cart</button>
                    </div>
                   
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
