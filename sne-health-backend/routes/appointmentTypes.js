import express from "express";
import pool from "../db.js";

const router = express.Router();


/* =========================================================
   GET ALL APPOINTMENT TYPES
========================================================= */

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                name
            FROM appointment_types
            ORDER BY name ASC
        `);

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(
            "GET APPOINTMENT TYPES ERROR:",
            error
        );

        res.status(500).json({
            message: "Unable to load appointment types."
        });

    }

});


export default router;