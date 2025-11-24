import React, { useState } from "react";
import logo from "../images/logo.svg";
import { Link } from "react-router-dom";

function Login({ setIsLoggedIn, isLoggedIn }) {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="row w-100 shadow-lg rounded overflow-hidden">
                {/* Left Side */}
                <div className="col-md-6 bg-danger text-white d-flex flex-column justify-content-center align-items-center p-4">
                    <h2>
                        <Link to="/"><img src={logo} alt="Logo" className="img-fluid mb-3" /></Link>
                    </h2>
                    <p className="text-center">
                        Welcome to Braca Store! Your one-stop shop for high-quality products, from stylish apparel to exclusive memorabilia. We are committed to providing the best shopping experience with great customer service, fast delivery, and secure payment options.
                    </p>
                    <Link to="/about" className="btn btn-light text-danger fw-bold mt-3">
                        Learn More About Us
                    </Link>
                </div>

                {/* Right Side - Login/Register Form */}
                <div className="col-md-6 bg-white p-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-danger">{isLoggedIn ? "Login" : "Register"}</h2>
                    </div>
                    <form>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Username" required />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Password" required />
                        </div>
                        {!isLoggedIn && (
                            <div className="mb-3">
                                <input type="password" className="form-control" placeholder="Confirm Password" required />
                            </div>
                        )}
                        <div className="d-grid">
                            <input type="submit" className="btn btn-danger" value={isLoggedIn ? "Sign In" : "Sign Up"} />
                        </div>
                        <div className="text-center mt-3">
                            {isLoggedIn ? (
                                <Link to="/register" className="text-danger" onClick={() => setIsLoggedIn(false)}>
                                    Create an account
                                </Link>
                            ) : (
                                <Link to="/login" className="text-danger text-decoration-none" onClick={() => setIsLoggedIn(true)}>
                                    Already have an account?
                                </Link>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
