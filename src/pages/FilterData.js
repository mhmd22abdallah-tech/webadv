import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

function FilterData(){
    const filterrData =useSelector(state=> state.product.filteredData)
    return(
        <div>
               <div className="container mt-5">
                <h2 className="text-center mb-4">Shop</h2>
                <div className="row">
                    {filterrData.map((product) => (
                    <div key={product.id} className="col-md-3 col-sm-12 mb-4">
                        <ProductCard product={product} />
                    </div>
            ))}
        </div>
        </div>
        </div>
    )
}
export  default FilterData