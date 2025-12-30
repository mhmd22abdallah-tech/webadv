import React, { useState } from "react";
import logo from "../images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import Swal from "sweetalert2";

function Login({ setIsLoggedIn, isLoggedIn }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLoggedIn) {
                // Login
                const response = await authAPI.login(username, password);
                if (response.success) {
                    setIsLoggedIn(true);
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful!',
                        text: 'Welcome back!',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    navigate("/");
                }
            } else {
                // Register
                if (password !== confirmPassword) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Passwords do not match!'
                    });
                    setLoading(false);
                    return;
                }

                const response = await authAPI.register({
                    username,
                    email,
                    password,
                    phone: phone || undefined
                });

                if (response.success) {
                    setIsLoggedIn(true);
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful!',
                        text: 'Welcome to Braca Store!',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    navigate("/");
                }
            }
        } catch (error) {
            // Handle validation errors
            let errorMessage = error.message || 'An error occurred. Please try again.';
            
            // If error has errors array (validation errors), show them
            if (error.errors && Array.isArray(error.errors)) {
                errorMessage = error.errors.join('\n');
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                html: error.errors && Array.isArray(error.errors) 
                    ? '<ul style="text-align: left;"><li>' + error.errors.join('</li><li>') + '</li></ul>'
                    : errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

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
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>
                        {!isLoggedIn && (
                            <div className="mb-3">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        {!isLoggedIn && (
                            <>
                                <div className="mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        placeholder="Confirm Password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        placeholder="Phone (Optional)" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        <div className="d-grid">
                            <button 
                                type="submit" 
                                className="btn btn-danger" 
                                disabled={loading}
                            >
                                {loading ? "Processing..." : (isLoggedIn ? "Sign In" : "Sign Up")}
                            </button>
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
