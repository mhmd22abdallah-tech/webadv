import React, { useEffect, useState } from "react";


import carosal1 from "../images/carosal1.webp"
import carosal2 from "../images/carosal2.webp"
import CategoriesSection from "../components/CategoriesSection";
import {setProducts} from "../redux/productSlice"
import {useSelector,useDispatch} from "react-redux"
import mockData from "../assests/mockData"
import ProductCard from "../components/ProductCard";
import About from "../components/About";
import { Link } from "react-router-dom";



function Home (){
    const [display,setDisplay]=useState(false);
    function handleClick(){
        setDisplay(!display)
    }
    const dispatch = useDispatch();
    const products=useSelector(state => state.product.products);
    useEffect(() =>{
        dispatch(setProducts(mockData))
    },[])
return(
    <>
   
       
       <div className="container-fluid header-carousel px-0 py-1 mb-5">
    <div id="header-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
            {display ?
       <div className="carousel-item active">
       <img className="w-100 img-fluid" src={carosal1} alt="Image" height="1000px" />
       <div className="carousel-caption">
           <div className="container">
               <div className="row justify-content-start">
                   <div className="col-lg-7 text-start">
                       <h1 className="display-1 text-white animated slideInRight mb-3">Your One-Stop Shop for Quality Products</h1>
                       <p className="mb-5 animated slideInRight">Braca Store offers a diverse range of high-quality products, from trendy apparel to unique collectibles, all carefully curated to meet your needs and tastes.</p>
                       <Link to="/about" className="btn btn-danger py-3 px-5 animated slideInRight">Explore More</Link>
                   </div>
               </div>
           </div>
       </div>
   </div>
   :
   <div className="carousel-item active">
       <img className="w-100 img-fluid" src={carosal2} alt="Image" height="1000px" />
       <div className="carousel-caption">
           <div className="container">
               <div className="row justify-content-end">
                   <div className="col-lg-7 text-end">
                       <h1 className="display-1 text-white animated slideInLeft mb-3">Braca Store – Shop with Confidence</h1>
                       <p className="mb-5 animated slideInLeft">At Braca Store, we prioritize customer satisfaction with fast, secure delivery and a smooth shopping experience, ensuring you get the best products at great prices.</p>
                       <Link to='/about' className="btn btn-danger py-3 px-5 animated slideInLeft">Explore More</Link>
                   </div>
               </div>
           </div>
       </div>
   </div>
   
}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev" onClick={handleClick}>
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next " type="button" data-bs-target="#header-carousel" data-bs-slide="next" onClick={handleClick}>
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
        </button>
    </div>
</div>
<About />
<CategoriesSection />
<div className="container mt-5">
  <h2 className="text-center mb-4">Top Products</h2>
  <div className="row">
    {products.slice(0, 5).map((product) => (
      <div key={product.id} className="col-md-3 col-sm-12 mb-4">
        <ProductCard product={product} />
      </div>
    ))}
  </div>
  </div>
    </>
)
}
export default Home
