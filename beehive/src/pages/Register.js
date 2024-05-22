import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { BsLockFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NoBar from "../components/NoBar";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // State for email
    const [password, setPassword] = useState(""); // State for password
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        // Prepare the data to be sent to your server for registration
        const registrationData = { username, email, password };

        try {
            // Send a POST request to the registration endpoint
            const response = await fetch("http://localhost:3001/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registrationData),
            });

            if (response.status === 201) {
                // Registration successful, you can navigate to another page or show a success message
                console.log("Registration successful");
                navigate("/"); // Redirect to the login page after successful registration
            } else {
                // Registration failed, handle the error (e.g., user already exists or server error)
                const data = await response.json();
                console.error(data.msg); // Display the error message from the server
            }
        } catch (error) {
            // Handle network or request errors
            console.error("Registration request failed:", error);
        }
    };

    return (
        <>
        <NoBar/>
            <div className="register">
                <div className="register-form">
                <div className="register-title">
                    <h2>Registration</h2>
                    </div>
                    <form onSubmit={submitHandler}>
                        {/* Email input field */}
                        <div className="input-box">
                            <label ><FaUserAlt /></label>
                            <input
                                type="username"
                                placeholder="Username"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        
                        </div>
                        <div className="input-box">
                            <label ><MdEmail /></label>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            
                        </div>
                        {/* Password input field */}
                        <div className="input-box">
                            <label ><BsLockFill /></label>
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            
                            <button type="submit" className="btn">Register</button>
                            <div className="login-register">
                                <p>Already have an account? <a href="/" >Login</a></p>
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;