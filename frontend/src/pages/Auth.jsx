import { useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Auth = ({ mode }) => {

    const isRegister = mode === "register";

    const { login, register } = useAuth();

    const navigate = useNavigate();

    const [form, setForm] = useState({

        name: "",
        email: "",
        password: ""

    });

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);

        try {

            if (isRegister) {

                await register(form);

            } else {

                await login({

                    email: form.email,

                    password: form.password

                });

            }

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-logo">

                    📚

                </div>

                <h2 className="fw-bold mt-3">

                    {isRegister
                        ? "Create Account"
                        : "Welcome Back"}

                </h2>

                <p className="text-secondary">

                    Library Management System

                </p>

                {error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    {isRegister && (

                        <div className="mb-3">

                            <label className="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter your name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    )}

                    <div className="mb-3">

                        <label className="form-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-4">

                        <label className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            minLength="6"
                            required
                        />

                    </div>

                    <button
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >

                        {loading
                            ? "Please wait..."
                            : isRegister
                                ? "Register"
                                : "Login"}

                    </button>

                </form>

                <p className="text-center mt-4">

                    {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}

                    {" "}

                    <Link to={isRegister ? "/login" : "/register"}>

                        {isRegister ? "Login" : "Register"}

                    </Link>

                </p>

            </div>

        </div>

    );

};

export default Auth;