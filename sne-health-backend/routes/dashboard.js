import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        // Total patients
        const patientsResult = await pool.query(`
            SELECT COUNT(*) AS count
            FROM patients
        `);


        // Total providers
        const providersResult = await pool.query(`
            SELECT COUNT(*) AS count
            FROM providers
        `);


        // Today's appointments
        const appointmentsResult = await pool.query(`
            SELECT COUNT(*) AS count
            FROM appointments
            WHERE appointment_date = CURRENT_DATE
        `);


        // Today's appointment list
        const todayAppointmentsResult = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.appointment_date,
                a.start_time,
                a.end_time,
                a.status,
                a.reason,

                p.first_name AS patient_first_name,
                p.last_name AS patient_last_name,

                pr.first_name AS provider_first_name,
                pr.last_name AS provider_last_name

            FROM appointments a

            LEFT JOIN patients p
                ON a.patient_id = p.id

            LEFT JOIN providers pr
                ON a.provider_id = pr.id

            WHERE a.appointment_date = CURRENT_DATE

            ORDER BY a.start_time ASC
        `);


        // Recent patients
        const recentPatientsResult = await pool.query(`
            SELECT
                id,
                first_name,
                last_name,
                date_of_birth,
                phone,
                created_at

            FROM patients

            ORDER BY created_at DESC

            LIMIT 5
        `);


        res.json({

            totalPatients: Number(
                patientsResult.rows[0].count
            ),

            totalProviders: Number(
                providersResult.rows[0].count
            ),

            todayAppointments: Number(
                appointmentsResult.rows[0].count
            ),

            todayAppointmentsList:
                todayAppointmentsResult.rows,

            recentPatients:
                recentPatientsResult.rows

        });

    } catch (error) {

        console.error(
            "Dashboard API error:",
            error
        );

        res.status(500).json({
            message: "Failed to load dashboard data",
            error: error.message
        });
    }

});

export default router;