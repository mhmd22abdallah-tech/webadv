import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Ensures Bootstrap JS functions work
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import logo from "../images/logo.svg";
import { Categories } from "../assests/mockData";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../redux/productSlice";
import { authAPI } from "../services/api";
import Swal from "sweetalert2";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const [pages, setPages] = useState(false);
    const [menu, setMenu] = useState(false);
    const [search, setSearch] = useState();
    const [userRole, setUserRole] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            checkUserRole();
        }
    }, [isLoggedIn]);

    const checkUserRole = async () => {
        try {
            const response = await authAPI.getCurrentUser();
            if (response.success) {
                setUserRole(response.user.role);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    function handleClickMenu() {
        setMenu(!menu);
    }

    function handleClick() {
        setPages(!pages);
    }

    const products = useSelector((state) => state.cart.products);

    function handleSubmit(e) {
        e.preventDefault();
        dispatch(setSearchTerm(search));
        navigate('/filter-data');
    }

    const handleLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                authAPI.logout();
                setIsLoggedIn(false);
                navigate('/');
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'You have been logged out successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    };

    return (
        <>
            <div className="container bg-seconadry">
                <div className="top-header">
                    <div className="container ">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <div className="logo">
                                    <Link to="/">
                                        <img src={logo} alt="Logo" />
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="search">
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <button>
                                            <FaSearch />
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="user">
                                    <div className="d-flex justify-content-end align-items-center gap-3">
                                        {isLoggedIn ? (
                                            <>
                                                {userRole === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        className="text-white text-decoration-none"
                                                        style={{ fontWeight: 'bold', fontSize: '16px' }}
                                                    >
                                                        Admin
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="btn btn-link text-white text-decoration-none"
                                                    style={{ fontWeight: 'bold', fontSize: '16px', border: 'none', padding: 0 }}
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        ) : (
                                            <Link
                                                to="/login"
                                                className="text-white text-decoration-none"
                                                style={{ fontWeight: 'bold', fontSize: '16px' }}
                                            >
                                                Login
                                            </Link>
                                        )}

                                        <Link to="/cart" style={{ position: 'relative' }} className="text-decoration-none text-danger">
                                            <FaShoppingCart className="fs-0 text-white" style={{ fontSize: '22px' }} />
                                            {products.length > 0 ? (
                                                <span
                                                    className="text-white"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-5px',
                                                        right: '-5px',
                                                        backgroundColor: 'red',
                                                        borderRadius: '50%',
                                                        padding: '5px',
                                                        fontSize: '12px',
                                                    }}
                                                >
                                                    {products.length}
                                                </span>
                                            ) : 0}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header">
                    <div className="container">
                        <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                            <Link to="/" className="navbar-brand text-danger">MENU</Link>
                            <button
                                type="button"
                                className="navbar-toggler"
                                onClick={handleClickMenu}
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div
                                className={`collapse navbar-collapse justify-content-between ${
                                    menu ? "show" : ""
                                }`}
                                id="navbarCollapse"
                            >
                                <div className="navbar-nav m-auto">
                                    <Link to="/" className="nav-item nav-link active text-danger">Home</Link>
                                    <Link to="/about" className="nav-item nav-link text-danger">About</Link>

                                    <div className="nav-item dropdown" onClick={handleClick}>
                                        <Link to="#" className="nav-link dropdown-toggle text-danger">Pages</Link>
                                        {pages && (
                                            <div className="dropdown-menu d-block">
                                                {Categories.map((category, index) => (
                                                    <Link
                                                        key={index}
                                                        to={`/category/${category}`}
                                                        className="dropdown-item"
                                                    >
                                                        {category}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Link to="/contact" className="nav-item nav-link text-danger">Contact Us</Link>
                                </div>
                            </div>
                        </nav>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
