import { useState } from "react";
import { Link } from "react-router-dom";

import {
    Mail,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ShieldCheck
} from "lucide-react";

import {
    forgotPassword
} from "../../api/authApi";

import "./login.css";


export default function ForgotPassword() {

    const [email, setEmail] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");
            setSuccess("");
            setLoading(true);


            try {

                const data =
                    await forgotPassword(
                        email
                    );


                setSuccess(
                    data.message ||
                    "If an account exists for this email, a password reset link has been sent."
                );


                setEmail("");


            } catch (error) {

                console.error(
                    "Forgot password error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to process your request. Please try again."
                );


            } finally {

                setLoading(false);

            }

        };


    return (

        <main className="login-page">


            {/* =================================================
                LEFT BRAND PANEL
            ================================================= */}

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
                                Your security
                                <br />
                                matters to us.
                            </h1>

                            <p>
                                We keep your clinic
                                workspace secure so you
                                can focus on providing
                                exceptional patient care.
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

                                Protected account recovery

                            </div>


                            <div className="brand-feature">

                                <span className="feature-check">
                                    ✓
                                </span>

                                Secure password management

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                RIGHT PANEL
            ================================================= */}

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


                    {/* BACK */}

                    <Link
                        to="/login"
                        className="back-login"
                    >

                        <ArrowLeft
                            size={17}
                        />

                        Back to login

                    </Link>


                    {/* HEADING */}

                    <div className="login-heading">

                        <span>
                            ACCOUNT RECOVERY
                        </span>

                        <h2>
                            Forgot your password?
                        </h2>

                        <p>
                            Enter your staff account
                            email and we'll send you
                            a secure password reset link.
                        </p>

                    </div>


                    {/* SUCCESS */}

                    {success && (

                        <div className="auth-success">

                            <CheckCircle2
                                size={20}
                            />

                            <div>

                                <strong>
                                    Check your email
                                </strong>

                                <p>
                                    {success}
                                </p>

                            </div>

                        </div>

                    )}


                    {/* FORM */}

                    {!success && (

                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >


                            <div className="form-group">

                                <label htmlFor="email">
                                    Email address
                                </label>


                                <div className="input-wrapper">

                                    <span className="input-icon">

                                        <Mail
                                            size={18}
                                        />

                                    </span>


                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@snehealth.com"
                                        autoComplete="email"
                                        required
                                    />

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


                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className="spinner"></span>
                                        Sending link...
                                    </>

                                ) : (

                                    <>
                                        Send reset link

                                        <ArrowRight
                                            size={18}
                                        />

                                    </>

                                )}

                            </button>


                        </form>

                    )}


                    {/* SUCCESS BACK TO LOGIN */}

                    {success && (

                        <Link
                            to="/login"
                            className="login-button success-login-button"
                        >

                            Return to login

                            <ArrowRight
                                size={18}
                            />

                        </Link>

                    )}


                    {/* SECURITY NOTE */}

                    <div className="security-note">

                        <ShieldCheck
                            size={18}
                        />

                        <span>
                            Your password reset link
                            is secure and expires after
                            1 hour.
                        </span>

                    </div>


                    {/* FOOTER */}

                    <div className="login-footer">

                        <p>
                            Authorized SNE Health Clinic
                            staff only.
                        </p>

                        <span>
                            © {new Date().getFullYear()}
                            {" "}
                            SNE Health Clinic
                        </span>

                    </div>


                </div>

            </section>

        </main>

    );

}