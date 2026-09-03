import express from "express";

import pool from "../db.js";


const router = express.Router();


// ==========================================
// GET ALL PROVIDERS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                first_name,
                last_name,
                specialty,
                email,
                phone,
                created_at
            FROM providers
            ORDER BY last_name, first_name
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "Error loading providers:",
            error
        );

        res.status(500).json({

            message:
                "Failed to load providers"

        });

    }

});


// ==========================================
// ADD PROVIDER
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            specialty,
            email,
            phone
        } = req.body;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !first_name ||
            !last_name ||
            !specialty
        ) {

            return res.status(400).json({

                message:
                    "First name, last name, and specialty are required."

            });

        }


        // ------------------------------------------
        // INSERT PROVIDER
        // ------------------------------------------

        const result = await pool.query(
            `
            INSERT INTO providers
            (
                first_name,
                last_name,
                specialty,
                email,
                phone
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                first_name,
                last_name,
                specialty,
                email,
                phone,
                created_at
            `,
            [
                first_name.trim(),
                last_name.trim(),
                specialty.trim(),
                email?.trim() || null,
                phone?.trim() || null
            ]
        );


        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(
            "Error creating provider:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create provider"

        });

    }

});


router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;


        const result = await pool.query(
            `
            DELETE FROM providers
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({

                message:
                    "Provider not found"

            });

        }


        res.json({

            message:
                "Provider deleted successfully",

            id: result.rows[0].id

        });

    } catch (error) {

        console.error(
            "Error deleting provider:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete provider"

        });

    }

});

export default router;