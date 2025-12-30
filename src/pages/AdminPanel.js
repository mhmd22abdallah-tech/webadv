import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI, authAPI, categoriesAPI } from "../services/api";
import Swal from "sweetalert2";

function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'categories'
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: "",
        description: ""
    });
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image_url: "",
        stock: ""
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAdminAccess();
        fetchProducts();
        fetchCategories();
    }, []);

    const checkAdminAccess = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            if (response.success && response.user.role === 'admin') {
                setUser(response.user);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'Admin access required'
                });
                navigate('/');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please login as admin'
            });
            navigate('/login');
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getAll({ limit: 100 });
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch products'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            if (response.success) {
                setCategories(response.categories);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'image') {
            const file = e.target.files[0];
            if (file) {
                setSelectedImage(file);
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');
            
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', formData.stock);
            
            // Add image file if selected, otherwise use image_url
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            } else if (formData.image_url) {
                formDataToSend.append('image_url', formData.image_url);
            }
            
            if (editingProduct) {
                // Update product
                const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Don't set Content-Type, let browser set it with boundary for FormData
                    },
                    body: formDataToSend
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Product updated successfully'
                    });
                    fetchProducts();
                    resetForm();
                } else {
                    throw new Error(data.message);
                }
            } else {
                // Create product
                const response = await fetch(`${API_BASE_URL}/products`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Don't set Content-Type, let browser set it with boundary for FormData
                    },
                    body: formDataToSend
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Product created successfully'
                    });
                    fetchProducts();
                    resetForm();
                } else {
                    throw new Error(data.message);
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to save product'
            });
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            category: product.category || "",
            image_url: product.image_url || "",
            stock: product.stock || ""
        });
        setSelectedImage(null);
        setImagePreview(product.image_url ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image_url}` : null);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Product has been deleted.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    fetchProducts();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to delete product'
                });
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            image_url: "",
            stock: ""
        });
        setSelectedImage(null);
        setImagePreview(null);
        setEditingProduct(null);
        setShowForm(false);
    };

    // Category Management Functions
    const handleCategoryInputChange = (e) => {
        setCategoryFormData({
            ...categoryFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const response = await categoriesAPI.update(editingCategory.id, categoryFormData);
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Category updated successfully'
                    });
                    fetchCategories();
                    resetCategoryForm();
                }
            } else {
                const response = await categoriesAPI.create(categoryFormData);
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Category created successfully'
                    });
                    fetchCategories();
                    resetCategoryForm();
                }
            }
        } catch (error) {
            console.error('Category error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || error.errors?.[0] || 'Failed to save category'
            });
        }
    };

    const handleCategoryEdit = (category) => {
        setEditingCategory(category);
        setCategoryFormData({
            name: category.name || "",
            description: category.description || ""
        });
        setShowCategoryForm(true);
    };

    const handleCategoryDelete = async (categoryId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await categoriesAPI.delete(categoryId);
                if (response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Category has been deleted.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    fetchCategories();
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Failed to delete category'
                });
            }
        }
    };

    const resetCategoryForm = () => {
        setCategoryFormData({
            name: "",
            description: ""
        });
        setEditingCategory(null);
        setShowCategoryForm(false);
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-danger">Admin Panel</h2>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        Products
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Categories
                    </button>
                </li>
            </ul>

            {/* Products Tab */}
            {activeTab === 'products' && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>Product Management</h4>
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? "Cancel" : "Add New Product"}
                        </button>
                    </div>

            {showForm && (
                <div className="card mb-4">
                    <div className="card-header bg-danger text-white">
                        <h5 className="mb-0">{editingProduct ? "Edit Product" : "Add New Product"}</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Product Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Category *</label>
                                    <select
                                        className="form-control"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Product Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                    />
                                    <small className="form-text text-muted">
                                        Or enter image URL below (if no file selected)
                                    </small>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image URL (Alternative)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="/images/product.png or http://..."
                                    disabled={selectedImage !== null}
                                />
                                <small className="form-text text-muted">
                                    {selectedImage ? "File selected - URL field disabled" : "Use this if you don't upload a file"}
                                </small>
                            </div>
                            {imagePreview && (
                                <div className="mb-3">
                                    <label className="form-label">Image Preview</label>
                                    <div>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-danger">
                                    {editingProduct ? "Update Product" : "Create Product"}
                                </button>
                                {editingProduct && (
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Products List ({products.length})</h5>
                </div>
                <div className="card-body">
                    {products.length === 0 ? (
                        <p className="text-center text-muted">No products found</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>
                                                <span className="badge bg-secondary">{product.category}</span>
                                            </td>
                                            <td>${parseFloat(product.price).toFixed(2)}</td>
                                            <td>{product.stock || 0}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary me-2"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
                </>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>Category Management</h4>
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowCategoryForm(!showCategoryForm)}
                        >
                            {showCategoryForm ? "Cancel" : "Add New Category"}
                        </button>
                    </div>

                    {showCategoryForm && (
                        <div className="card mb-4">
                            <div className="card-header bg-danger text-white">
                                <h5 className="mb-0">{editingCategory ? "Edit Category" : "Add New Category"}</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleCategorySubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Category Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={categoryFormData.name}
                                            onChange={handleCategoryInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={categoryFormData.description}
                                            onChange={handleCategoryInputChange}
                                            rows="3"
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-danger">
                                            {editingCategory ? "Update Category" : "Create Category"}
                                        </button>
                                        {editingCategory && (
                                            <button type="button" className="btn btn-secondary" onClick={resetCategoryForm}>
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="card">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0">Categories List ({categories.length})</h5>
                        </div>
                        <div className="card-body">
                            {categories.length === 0 ? (
                                <p className="text-center text-muted">No categories found</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categories.map((category) => (
                                                <tr key={category.id}>
                                                    <td>{category.id}</td>
                                                    <td>
                                                        <span className="badge bg-primary">{category.name}</span>
                                                    </td>
                                                    <td>{category.description || '-'}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary me-2"
                                                            onClick={() => handleCategoryEdit(category)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleCategoryDelete(category.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminPanel;

