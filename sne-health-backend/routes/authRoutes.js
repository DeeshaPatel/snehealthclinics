import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import pool from "../db.js";

const router = express.Router();


// ============================================================
// EMAIL TRANSPORTER
// ============================================================

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,

    secure:
        Number(process.env.SMTP_PORT) === 465,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});


// ============================================================
// LOGIN
// ============================================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }

        const normalizedEmail =
            email.trim().toLowerCase();


        const result = await pool.query(
            `
            SELECT
                id,
                first_name,
                last_name,
                email,
                password_hash,
                role
            FROM users
            WHERE LOWER(email) = $1
            `,
            [normalizedEmail]
        );


        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        const user = result.rows[0];


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from .env"
            );

            return res.status(500).json({
                message: "Server configuration error"
            });

        }


        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "8h"
            }
        );


        res.json({

            message: "Login successful",

            token,

            user: {

                id: user.id,

                firstName:
                    user.first_name,

                lastName:
                    user.last_name,

                email:
                    user.email,

                role:
                    user.role

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ============================================================
// FORGOT PASSWORD
// ============================================================

router.post("/forgot-password", async (req, res) => {

    try {

        const { email } = req.body;


        if (!email) {

            return res.status(400).json({
                message: "Email address is required"
            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // ------------------------------------------------------
        // Find user
        // ------------------------------------------------------

        const result = await pool.query(
            `
            SELECT
                id,
                first_name,
                last_name,
                email
            FROM users
            WHERE LOWER(email) = $1
            `,
            [normalizedEmail]
        );


        /*
         * IMPORTANT:
         *
         * We return the same response whether the account
         * exists or not.
         *
         * This prevents attackers from discovering
         * which emails are registered.
         */

        if (result.rows.length === 0) {

            return res.json({

                message:
                    "If an account exists for this email, a password reset link has been sent."

            });

        }


        const user = result.rows[0];


        // ------------------------------------------------------
        // Delete previous reset tokens
        // ------------------------------------------------------

        await pool.query(
            `
            DELETE FROM password_reset_tokens
            WHERE user_id = $1
            `,
            [user.id]
        );


        // ------------------------------------------------------
        // Generate secure reset token
        // ------------------------------------------------------

        const resetToken =
            crypto.randomBytes(32).toString("hex");


        // ------------------------------------------------------
        // Hash token
        // ------------------------------------------------------

        const tokenHash =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");


        // ------------------------------------------------------
        // Token expires in 1 hour
        // ------------------------------------------------------

        const expiresAt =
            new Date(
                Date.now() +
                60 * 60 * 1000
            );


        // ------------------------------------------------------
        // Save hashed token
        // ------------------------------------------------------

        await pool.query(
            `
            INSERT INTO password_reset_tokens
            (
                user_id,
                token_hash,
                expires_at
            )
            VALUES
            (
                $1,
                $2,
                $3
            )
            `,
            [
                user.id,
                tokenHash,
                expiresAt
            ]
        );


        // ------------------------------------------------------
        // Create reset URL
        // ------------------------------------------------------

        const resetUrl =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


        console.log(
            "Password reset URL:",
            resetUrl
        );


        // ------------------------------------------------------
        // Send email
        // ------------------------------------------------------

        await transporter.sendMail({

            from:
                process.env.SMTP_FROM,

            to:
                user.email,

            subject:
                "Reset your SNE Health password",

            html: `

                <!DOCTYPE html>

                <html>

                <head>

                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >

                </head>

                <body
                    style="
                        margin:0;
                        padding:0;
                        background:#f1f5f9;
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;
                    "
                >

                    <div
                        style="
                            max-width:600px;
                            margin:0 auto;
                            padding:40px 20px;
                        "
                    >

                        <!-- LOGO -->

                        <div
                            style="
                                text-align:center;
                                margin-bottom:30px;
                            "
                        >

                            <div
                                style="
                                    display:inline-flex;
                                    align-items:center;
                                    justify-content:center;
                                    width:56px;
                                    height:56px;
                                    border-radius:14px;
                                    background:#0f766e;
                                    color:#ffffff;
                                    font-size:26px;
                                    font-weight:bold;
                                "
                            >
                                S
                            </div>

                            <h2
                                style="
                                    margin:
                                        12px 0 4px;
                                    color:#0f172a;
                                "
                            >
                                SNE Health
                            </h2>

                            <p
                                style="
                                    margin:0;
                                    color:#64748b;
                                    font-size:14px;
                                "
                            >
                                Health Clinic Staff Portal
                            </p>

                        </div>


                        <!-- CARD -->

                        <div
                            style="
                                background:#ffffff;
                                border-radius:16px;
                                padding:40px;
                                box-shadow:
                                    0 10px 30px
                                    rgba(
                                        15,
                                        23,
                                        42,
                                        0.08
                                    );
                            "
                        >

                            <h1
                                style="
                                    margin-top:0;
                                    color:#0f172a;
                                    font-size:25px;
                                "
                            >
                                Reset your password
                            </h1>


                            <p
                                style="
                                    color:#475569;
                                    line-height:1.6;
                                "
                            >
                                Hello
                                ${user.first_name},
                            </p>


                            <p
                                style="
                                    color:#475569;
                                    line-height:1.6;
                                "
                            >
                                We received a request to reset
                                the password for your SNE Health
                                staff account.
                            </p>


                            <p
                                style="
                                    color:#475569;
                                    line-height:1.6;
                                "
                            >
                                Click the button below to create
                                a new password.
                            </p>


                            <div
                                style="
                                    text-align:center;
                                    margin:35px 0;
                                "
                            >

                                <a
                                    href="${resetUrl}"
                                    style="
                                        display:inline-block;
                                        padding:
                                            14px 28px;
                                        background:#0f766e;
                                        color:#ffffff;
                                        text-decoration:none;
                                        border-radius:8px;
                                        font-weight:bold;
                                    "
                                >
                                    Reset Password
                                </a>

                            </div>


                            <div
                                style="
                                    padding:16px;
                                    background:#f8fafc;
                                    border-radius:8px;
                                "
                            >

                                <p
                                    style="
                                        margin:0;
                                        color:#64748b;
                                        font-size:14px;
                                        line-height:1.5;
                                    "
                                >
                                    This link expires in
                                    <strong>
                                        1 hour
                                    </strong>.
                                </p>

                            </div>


                            <p
                                style="
                                    margin-top:25px;
                                    color:#64748b;
                                    font-size:14px;
                                    line-height:1.5;
                                "
                            >
                                If you did not request a password
                                reset, you can safely ignore this
                                email.
                            </p>

                        </div>


                        <!-- FOOTER -->

                        <p
                            style="
                                text-align:center;
                                color:#94a3b8;
                                font-size:12px;
                                margin-top:25px;
                            "
                        >
                            © ${new Date().getFullYear()}
                            SNE Health Clinic
                        </p>

                    </div>

                </body>

                </html>

            `

        });


        res.json({

            message:
                "If an account exists for this email, a password reset link has been sent."

        });


    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to process password reset request."

        });

    }

});


// ============================================================
// RESET PASSWORD
// ============================================================

router.post("/reset-password", async (req, res) => {

    const client =
        await pool.connect();


    try {

        const {
            token,
            password
        } = req.body;


        // ------------------------------------------------------
        // Validate input
        // ------------------------------------------------------

        if (!token || !password) {

            return res.status(400).json({

                message:
                    "Reset token and new password are required."

            });

        }


        // ------------------------------------------------------
        // Password validation
        // ------------------------------------------------------

        if (password.length < 8) {

            return res.status(400).json({

                message:
                    "Password must be at least 8 characters long."

            });

        }


        // ------------------------------------------------------
        // Hash received token
        // ------------------------------------------------------

        const tokenHash =
            crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");


        // ------------------------------------------------------
        // Find valid token
        // ------------------------------------------------------

        const tokenResult =
            await client.query(
                `
                SELECT
                    id,
                    user_id,
                    expires_at
                FROM password_reset_tokens
                WHERE token_hash = $1
                  AND used_at IS NULL
                  AND expires_at > NOW()
                LIMIT 1
                `,
                [tokenHash]
            );


        if (tokenResult.rows.length === 0) {

            return res.status(400).json({

                message:
                    "This password reset link is invalid or has expired."

            });

        }


        const resetRecord =
            tokenResult.rows[0];


        // ------------------------------------------------------
        // Hash new password
        // ------------------------------------------------------

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        // ------------------------------------------------------
        // Start transaction
        // ------------------------------------------------------

        await client.query(
            "BEGIN"
        );


        // ------------------------------------------------------
        // Update password
        // ------------------------------------------------------

        const updateResult =
            await client.query(
                `
                UPDATE users
                SET password_hash = $1
                WHERE id = $2
                `,
                [
                    passwordHash,
                    resetRecord.user_id
                ]
            );


        if (updateResult.rowCount === 0) {

            await client.query(
                "ROLLBACK"
            );

            return res.status(400).json({

                message:
                    "Unable to reset password."

            });

        }


        // ------------------------------------------------------
        // Mark token as used
        // ------------------------------------------------------

        await client.query(
            `
            UPDATE password_reset_tokens
            SET used_at = NOW()
            WHERE id = $1
            `,
            [resetRecord.id]
        );


        // ------------------------------------------------------
        // Delete other reset tokens
        // ------------------------------------------------------

        await client.query(
            `
            DELETE FROM password_reset_tokens
            WHERE user_id = $1
              AND id != $2
            `,
            [
                resetRecord.user_id,
                resetRecord.id
            ]
        );


        // ------------------------------------------------------
        // Commit
        // ------------------------------------------------------

        await client.query(
            "COMMIT"
        );


        res.json({

            message:
                "Your password has been reset successfully."

        });


    } catch (error) {

        await client.query(
            "ROLLBACK"
        );


        console.error(
            "Reset password error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to reset password."

        });


    } finally {

        client.release();

    }

});


export default router;