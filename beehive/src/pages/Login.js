import React, { useState } from "react";
import './Login.css';
import { MdEmail } from "react-icons/md";
import { BsLockFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import NoBar from "../components/NoBar";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Prepare the data to be sent to your server for authentication
        const loginData = { email, password };

        try {
            // Send a POST request to your server for authentication
            const response = await fetch("http://localhost:3001/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
                credentials: 'include',
            });

            if (response.ok) {
                // If the response is successful, navigate to the home page
                navigate("/Home");
            } else {
                // Handle authentication errors here (e.g., show an error message to the user)
                console.error("Authentication failed");
                alert("Incorrect email or password. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <>
            <NoBar />
            <div className="container-slider"></div>
            
            <div className="login">
                <div className="login-form">
                <div className="login-title">
                <h2>Login</h2>
                </div>
                    <div className="login-form-box">
                        <div className="login-form-details">
                            <p>Welcome!</p>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="login-input-box" > 
                            <label htmlFor="email"> <MdEmail/></label>
                                <input 
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                /> 
                            </div> 

                            <div className="login-input-box"> 
                            <label htmlFor="password"> <BsLockFill/> </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                
                            </div>

                            {/* <div className="remember-forgot">
                            <label><input type="checkbox"/>Remember Me</label>
                            <a href="#">Forgot Password?</a> 
                            </div> */}

                            <button type="submit" className="login-btn">Login</button>
                            <div className="login-register">
                                <p>Don't have an account? <a href="/Register" >Register</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;