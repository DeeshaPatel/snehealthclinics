import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    ShieldCheck
} from "lucide-react";

import {
    resetPassword
} from "../../api/authApi";

import "./login.css";


export default function ResetPassword() {

    const {
        token
    } = useParams();

    const navigate =
        useNavigate();


    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");


            if (password.length < 8) {

                setError(
                    "Password must be at least 8 characters long."
                );

                return;

            }


            if (password !== confirmPassword) {

                setError(
                    "Passwords do not match."
                );

                return;

            }


            setLoading(true);


            try {

                await resetPassword(
                    token,
                    password
                );


                setSuccess(true);


                setTimeout(() => {

                    navigate("/login");

                }, 2500);


            } catch (error) {

                console.error(
                    "Reset password error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to reset your password. Please try again."
                );


            } finally {

                setLoading(false);

            }

        };


    return (

        <main className="login-page">


            {/* =================================================
                BRAND
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
                                Secure access.
                                <br />
                                Peace of mind.
                            </h1>

                            <p>
                                Create a strong new password
                                to keep your SNE Health account
                                protected.
                            </p>

                        </div>


                        <div className="brand-features">

                            <div className="brand-feature">

                                <span className="feature-check">
                                    ✓
                                </span>

                                Secure password recovery

                            </div>


                            <div className="brand-feature">

                                <span className="feature-check">
                                    ✓
                                </span>

                                Encrypted passwords

                            </div>


                            <div className="brand-feature">

                                <span className="feature-check">
                                    ✓
                                </span>

                                Protected staff workspace

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                RESET PANEL
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


                    {!success && (

                        <Link
                            to="/login"
                            className="back-login"
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to login

                        </Link>

                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================= */}

                    {success ? (

                        <div className="password-reset-success">

                            <div className="success-icon">

                                <CheckCircle2
                                    size={34}
                                />

                            </div>


                            <div className="login-heading">

                                <span>
                                    PASSWORD UPDATED
                                </span>

                                <h2>
                                    Password changed
                                </h2>

                                <p>
                                    Your password has been
                                    successfully updated.
                                </p>

                            </div>


                            <p className="redirect-message">

                                Redirecting you to login...

                            </p>


                            <Link
                                to="/login"
                                className="login-button"
                            >

                                Go to login

                                <ArrowRight
                                    size={18}
                                />

                            </Link>

                        </div>

                    ) : (


                        <>


                            {/* HEADING */}

                            <div className="login-heading">

                                <span>
                                    PASSWORD RESET
                                </span>

                                <h2>
                                    Create a new password
                                </h2>

                                <p>
                                    Choose a strong password
                                    you haven't used before.
                                </p>

                            </div>


                            {/* FORM */}

                            <form
                                className="login-form"
                                onSubmit={handleSubmit}
                            >


                                {/* PASSWORD */}

                                <div className="form-group">

                                    <label htmlFor="password">
                                        New password
                                    </label>


                                    <div className="input-wrapper">

                                        <span className="input-icon">

                                            <Lock
                                                size={18}
                                            />

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
                                                setPassword(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter new password"
                                            autoComplete="new-password"
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
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >

                                            {showPassword ? (

                                                <EyeOff
                                                    size={18}
                                                />

                                            ) : (

                                                <Eye
                                                    size={18}
                                                />

                                            )}

                                        </button>

                                    </div>

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="form-group">

                                    <label htmlFor="confirmPassword">
                                        Confirm password
                                    </label>


                                    <div className="input-wrapper">

                                        <span className="input-icon">

                                            <Lock
                                                size={18}
                                            />

                                        </span>


                                        <input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(event) =>
                                                setConfirmPassword(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Confirm new password"
                                            autoComplete="new-password"
                                            required
                                        />


                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >

                                            {showConfirmPassword ? (

                                                <EyeOff
                                                    size={18}
                                                />

                                            ) : (

                                                <Eye
                                                    size={18}
                                                />

                                            )}

                                        </button>

                                    </div>

                                </div>


                                {/* PASSWORD REQUIREMENTS */}

                                <div className="password-requirements">

                                    <div>
                                        <span>✓</span>
                                        At least 8 characters
                                    </div>

                                    <div>
                                        <span>✓</span>
                                        Both passwords must match
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
                                            Updating password...
                                        </>

                                    ) : (

                                        <>
                                            Update password

                                            <ArrowRight
                                                size={18}
                                            />

                                        </>

                                    )}

                                </button>


                            </form>


                            {/* SECURITY */}

                            <div className="security-note">

                                <ShieldCheck
                                    size={18}
                                />

                                <span>
                                    Your password is securely
                                    encrypted before being stored.
                                </span>

                            </div>


                        </>

                    )}


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