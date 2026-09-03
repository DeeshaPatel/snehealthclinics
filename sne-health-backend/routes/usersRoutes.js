import express from "express";
import bcrypt from "bcryptjs";

import pool from "../db.js";


const router = express.Router();


// ==========================================
// GET USERS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                first_name,
                last_name,
                email,
                role,
                created_at
            FROM users
            ORDER BY last_name, first_name
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "Error loading users:",
            error
        );

        res.status(500).json({

            message:
                "Failed to load users"

        });

    }

});


// ==========================================
// CREATE USER
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            email,
            password,
            role
        } = req.body;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !first_name ||
            !last_name ||
            !email ||
            !password ||
            !role
        ) {

            return res.status(400).json({

                message:
                    "All fields are required."

            });

        }


        // ------------------------------------------
        // ROLE VALIDATION
        // ------------------------------------------

        const allowedRoles = [
            "admin",
            "receptionist"
        ];


        if (!allowedRoles.includes(role)) {

            return res.status(400).json({

                message:
                    "Invalid user role."

            });

        }


        // ------------------------------------------
        // CHECK EMAIL
        // ------------------------------------------

        const existingUser =
            await pool.query(
                `
                SELECT id
                FROM users
                WHERE email = $1
                `,
                [email.toLowerCase().trim()]
            );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({

                message:
                    "A user with this email already exists."

            });

        }


        // ------------------------------------------
        // HASH PASSWORD
        // ------------------------------------------

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );


        // ------------------------------------------
        // CREATE USER
        // ------------------------------------------

        const result =
            await pool.query(
                `
                INSERT INTO users
                (
                    first_name,
                    last_name,
                    email,
                    password_hash,
                    role
                )
                VALUES
                ($1, $2, $3, $4, $5)
                RETURNING
                    id,
                    first_name,
                    last_name,
                    email,
                    role,
                    created_at
                `,
                [
                    first_name.trim(),
                    last_name.trim(),
                    email.toLowerCase().trim(),
                    passwordHash,
                    role
                ]
            );


        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(
            "Error creating user:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create user"

        });

    }

});


// ==========================================
// DELETE USER
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const result =
            await pool.query(
                `
                DELETE FROM users
                WHERE id = $1
                RETURNING id
                `,
                [id]
            );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        res.json({

            message:
                "User deleted successfully"

        });

    } catch (error) {

        console.error(
            "Error deleting user:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete user"

        });

    }

});

// ==========================================
// UPDATE USER
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            first_name,
            last_name,
            email,
            password,
            role
        } = req.body;


        if (
            !first_name ||
            !last_name ||
            !email ||
            !role
        ) {

            return res.status(400).json({

                message:
                    "First name, last name, email, and role are required."

            });

        }


        const allowedRoles = [
            "admin",
            "receptionist"
        ];


        if (!allowedRoles.includes(role)) {

            return res.status(400).json({

                message:
                    "Invalid user role."

            });

        }


        // ------------------------------------------
        // CHECK EMAIL
        // ------------------------------------------

        const existingUser =
            await pool.query(
                `
                SELECT id
                FROM users
                WHERE LOWER(email) = LOWER($1)
                AND id != $2
                `,
                [
                    email.trim(),
                    id
                ]
            );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({

                message:
                    "Another user already uses this email."

            });

        }


        let result;


        // ------------------------------------------
        // UPDATE WITH NEW PASSWORD
        // ------------------------------------------

        if (password && password.trim()) {

            if (password.length < 8) {

                return res.status(400).json({

                    message:
                        "Password must be at least 8 characters."

                });

            }


            const passwordHash =
                await bcrypt.hash(
                    password,
                    12
                );


            result = await pool.query(
                `
                UPDATE users
                SET
                    first_name = $1,
                    last_name = $2,
                    email = $3,
                    password_hash = $4,
                    role = $5
                WHERE id = $6
                RETURNING
                    id,
                    first_name,
                    last_name,
                    email,
                    role,
                    created_at
                `,
                [
                    first_name.trim(),
                    last_name.trim(),
                    email.trim().toLowerCase(),
                    passwordHash,
                    role,
                    id
                ]
            );

        } else {

            // ------------------------------------------
            // UPDATE WITHOUT CHANGING PASSWORD
            // ------------------------------------------

            result = await pool.query(
                `
                UPDATE users
                SET
                    first_name = $1,
                    last_name = $2,
                    email = $3,
                    role = $4
                WHERE id = $5
                RETURNING
                    id,
                    first_name,
                    last_name,
                    email,
                    role,
                    created_at
                `,
                [
                    first_name.trim(),
                    last_name.trim(),
                    email.trim().toLowerCase(),
                    role,
                    id
                ]
            );

        }


        if (result.rows.length === 0) {

            return res.status(404).json({

                message:
                    "User not found."

            });

        }


        res.json(result.rows[0]);

    } catch (error) {

        console.error(
            "Error updating user:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update user."

        });

    }

});


export default router;