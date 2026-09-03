import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { loginUser } from "../../api/authApi";


import "./login.css";


export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            const data = await loginUser(
                email,
                password
            );


            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to sign in. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main className="login-page">

            {/* LEFT SIDE */}

            <section className="login-brand">

                <div className="brand-overlay">

                    <div className="brand-content">

                        <div className="brand-logo">

                            <div className="logo-symbol">
                                S
                            </div>

                            <span>
                                SNE Health
                            </span>

                        </div>


                        <div className="brand-message">

                            <span className="brand-eyebrow">
                                SNE HEALTH CLINIC
                            </span>

                            <h1>
                                Caring for people.
                                <br />
                                Empowering health.
                            </h1>

                            <p>
                                A secure and simple workspace
                                for the SNE Health Clinic team.
                            </p>

                        </div>


                        <div className="brand-features">

                            <div className="brand-feature">

                                <span className="feature-check">
                                    ✓
                                </span>

                                Secure staff portal

                            </div>


                            <div className="brand-feature">

                                <span className="feature-check">
                                    ✓
                                </span>

                                Patient management

                            </div>


                            <div className="brand-feature">

                                <span className="feature-check">
                                    ✓
                                </span>

                                Appointment management

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* RIGHT SIDE */}

            <section className="login-panel">

                <div className="login-container">

                    <div className="mobile-logo">

                        <div className="logo-symbol">
                            S
                        </div>

                        <span>
                            SNE Health
                        </span>

                    </div>


                    <div className="login-heading">

                        <span>
                            STAFF PORTAL
                        </span>

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to access your clinic dashboard.
                        </p>

                    </div>


                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="you@snehealth.com"
                                    autoComplete="email"
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <Link to="/forgot-password">
                                    Forgot password?
                                </Link>

                            </div>


                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"
                                    }
                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="login-error">

                                <span>
                                    !
                                </span>

                                {error}

                            </div>

                        )}


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>

                            ) : (

                                <>
                                    Sign in
                                    <span>→</span>
                                </>

                            )}

                        </button>

                    </form>


                    <div className="login-footer">

                        <p>
                            Authorized SNE Health Clinic staff only.
                        </p>

                        <span>
                            © {new Date().getFullYear()} SNE Health Clinic
                        </span>

                    </div>

                </div>

            </section>

        </main>

    );

}