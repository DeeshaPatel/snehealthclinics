import express from "express";
import pool from "../db.js";

const router = express.Router();


/*
    GET ALL PATIENTS
*/

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                first_name,
                last_name,
                date_of_birth,
                health_card,
                phone,
                emergency_contact,
                medications,
                medical_history,
                created_at
            FROM patients
            ORDER BY created_at DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "Get patients error:",
            error
        );

        res.status(500).json({
            message: "Failed to load patients"
        });

    }

});


/*
    GET SINGLE PATIENT
*/

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                id,
                first_name,
                last_name,
                date_of_birth,
                health_card,
                phone,
                emergency_contact,
                medications,
                medical_history,
                created_at
            FROM patients
            WHERE id = $1
            `,
            [id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }


        res.json(result.rows[0]);

    } catch (error) {

        console.error(
            "Get patient error:",
            error
        );

        res.status(500).json({
            message: "Failed to load patient"
        });

    }

});


/*
    CREATE PATIENT
*/

router.post("/", async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            date_of_birth,
            health_card,
            phone,
            emergency_contact,
            medications,
            medical_history
        } = req.body;


        if (!first_name || !last_name) {

            return res.status(400).json({
                message:
                    "First name and last name are required"
            });

        }


        const result = await pool.query(
            `
            INSERT INTO patients (
                first_name,
                last_name,
                date_of_birth,
                health_card,
                phone,
                emergency_contact,
                medications,
                medical_history
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
            )
            RETURNING *
            `,
            [
                first_name,
                last_name,
                date_of_birth || null,
                health_card || null,
                phone || null,
                emergency_contact || null,
                medications || null,
                medical_history || null
            ]
        );


        res.status(201).json(
            result.rows[0]
        );

    } catch (error) {

        console.error(
            "Create patient error:",
            error
        );

        res.status(500).json({
            message: "Failed to create patient"
        });

    }

});


/*
    UPDATE PATIENT
*/

router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            first_name,
            last_name,
            date_of_birth,
            health_card,
            phone,
            emergency_contact,
            medications,
            medical_history
        } = req.body;


        const result = await pool.query(
            `
            UPDATE patients
            SET
                first_name = $1,
                last_name = $2,
                date_of_birth = $3,
                health_card = $4,
                phone = $5,
                emergency_contact = $6,
                medications = $7,
                medical_history = $8
            WHERE id = $9

            RETURNING *
            `,
            [
                first_name,
                last_name,
                date_of_birth || null,
                health_card || null,
                phone || null,
                emergency_contact || null,
                medications || null,
                medical_history || null,
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }


        res.json(
            result.rows[0]
        );

    } catch (error) {

        console.error(
            "Update patient error:",
            error
        );

        res.status(500).json({
            message: "Failed to update patient"
        });

    }

});


/*
    DELETE PATIENT
*/

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM patients
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }


        res.json({
            message: "Patient deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete patient error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete patient"
        });

    }

});

/* 
    FIND HISTORY OF PATIENT
*/

router.get("/:id/history", async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                a.id,
                a.title,
                a.appointment_date,
                a.start_time,
                a.end_time,
                a.reason,
                a.status,
                a.notes,
                a.created_at,

                pr.id AS provider_id,
                pr.first_name AS provider_first_name,
                pr.last_name AS provider_last_name,
                pr.specialty AS provider_specialty

            FROM appointments a

            LEFT JOIN providers pr
                ON a.provider_id = pr.id

            WHERE a.patient_id = $1

            ORDER BY
                a.appointment_date DESC,
                a.start_time DESC
            `,
            [id]
        );


        res.json(result.rows);

    } catch (error) {

        console.error(
            "GET PATIENT HISTORY ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Unable to load patient history.",
            error:
                error.message
        });

    }

});


export default router;