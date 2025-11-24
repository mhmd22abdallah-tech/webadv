
import React from "react";
import { FaStar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported
import { addToCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2"



function ProductCard({ product }) {
  const dispatch=useDispatch()
  function handleAddToCart(e,product){
    
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
 
  return (
    <Link to={`/product/${product.id}`} className="text-decoration-none">
    <div className="card text-center p-3 shadow-sm h-100">
      <img
        src={product.image}
        alt={product.name}
        className="card-img-top img-fluid rounded"
        style={{height:'100%'}}
      />
      <h3 className="card-title mt-3">{product.name}</h3>
      <p className="card-text text-muted">$ {product.price}</p>
      <div className="mb-3">
        <FaStar className="text-warning" />
        <FaStar className="text-warning" />
        <FaStar className="text-warning" />
        <FaStar className="text-warning" />
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <button className="btn btn-danger text-center me-2" onClick={(e) => handleAddToCart(e,product)} >Add To Cart</button>
        </div>
        
    </div>
    </Link>
  );
}

export default ProductCard;