import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/productSlice";
import { productsAPI } from "../services/api";
import ProductCard from "../components/ProductCard";

function Shop(){
    const dispatch = useDispatch();
    const products=useSelector(state => state.product.products);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productsAPI.getAll();
                if (response.success) {
                    const mappedProducts = response.products.map(product => ({
                        id: product.id,
                        name: product.name,
                        image: product.image_url || `/images/top${product.id % 9 + 1}.png`,
                        price: parseFloat(product.price),
                        category: product.category
                    }));
                    dispatch(setProducts(mappedProducts));
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [dispatch]);

    return(
        <div>
            <div className="container mt-5">
                <h2 className="text-center mb-4">Shop</h2>
                <div className="row">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="col-md-3 col-sm-12 mb-4">
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>Loading products...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}
export default Shop;