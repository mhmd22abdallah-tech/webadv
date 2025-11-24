
import React from "react";
import { useParams } from "react-router-dom";
import mockData from "../assests/mockData";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import Swal from "sweetalert2"



function CategoryPage() {
  const { category } = useParams();
  const filteredProducts = mockData.filter(product => product.category === category);
  
  const dispatch=useDispatch()
  function handleAddToCart(product){
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
    <div className="container mt-5">
      <h2 className="text-center text-danger mb-4">{category} Products</h2>
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div className="col-md-4" key={product.id}>
              <div className="card shadow-lg">
                <img src={product.image} className="card-img-top img-fluid rounded"  style={{height:'500px',objectFit: 'cover'}} alt={product.name} />
                <div className="card-body text-center">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price}</p>
                </div>
                <div className="card-footer text-center">
                <button className="btn btn-danger" onClick={(e) => handleAddToCart(product)}>Add To Cart</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products available in this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
