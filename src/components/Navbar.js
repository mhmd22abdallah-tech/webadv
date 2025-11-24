import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Ensures Bootstrap JS functions work
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import logo from "../images/logo.svg";
import { Categories } from "../assests/mockData";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../redux/productSlice";

function Navbar({ isLoggedIn }) {
    const [pages, setPages] = useState(false);
    const [menu, setMenu] = useState(false);
    const [search, setSearch] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                                    <div className="d-flex justify-content-end ">
                                        <Link
                                            to={isLoggedIn ? "/login" : "/register"}
                                            className="dropdown-item text-white"
                                            style={{ fontWeight: 'bold', fontSize: '16px' }}
                                        >
                                            {isLoggedIn ? "Login" : "Register"}
                                        </Link>

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
