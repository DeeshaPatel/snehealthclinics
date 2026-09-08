import express from "express";
import pool from "../db.js";

const router = express.Router();


router.get("/", async (req, res) => {

    try {

        // =====================================================
        // SELECTED DATE
        // =====================================================
        // If ?date=2026-09-08 is provided, use that date.
        // Otherwise PostgreSQL CURRENT_DATE is used.
        // =====================================================

        const selectedDate =
            req.query.date || null;


        // =====================================================
        // TOTAL PATIENTS
        // =====================================================

        const patientsResult = await pool.query(`
            SELECT COUNT(*) AS count
            FROM patients
        `);


        // =====================================================
        // TOTAL PROVIDERS
        // =====================================================

        const providersResult = await pool.query(`
            SELECT COUNT(*) AS count
            FROM providers
        `);


        // =====================================================
        // APPOINTMENTS FOR SELECTED DATE
        // =====================================================

        const appointmentsResult = await pool.query(`

            SELECT COUNT(*) AS count

            FROM appointments a

            WHERE a.appointment_date =
                COALESCE($1::date, CURRENT_DATE)
                
            AND NOT (
                    LOWER(TRIM(COALESCE(a.title, ''))) LIKE '%blood%'
                    OR
                    LOWER(TRIM(COALESCE(a.reason, ''))) LIKE '%blood%'
                )

        `, [selectedDate]);


        // =====================================================
        // APPOINTMENT LIST FOR SELECTED DATE
        // =====================================================

        const appointmentsListResult = await pool.query(`

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

            WHERE a.appointment_date =
                COALESCE($1::date, CURRENT_DATE)

            ORDER BY a.start_time ASC

        `, [selectedDate]);


        // =====================================================
        // BLOOD WORK APPOINTMENTS
        // =====================================================
        //
        // We look for common Blood Work naming variations.
        //
        // Examples that will match:
        //
        // Blood Work
        // blood work
        // Bloodwork
        // Blood Test
        // Blood Test Appointment
        // Blood Work Appointment
        // =====================================================

        const bloodWorkAppointmentsResult = await pool.query(`

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

            WHERE a.appointment_date =
                COALESCE($1::date, CURRENT_DATE)

            AND (
                LOWER(TRIM(COALESCE(a.title, ''))) LIKE '%blood%'
                OR
                LOWER(TRIM(COALESCE(a.reason, ''))) LIKE '%blood%'
            )

            ORDER BY a.start_time ASC

        `, [selectedDate]);


        // =====================================================
        // BLOOD WORK COUNT
        // =====================================================

        const bloodWorkToday =
            bloodWorkAppointmentsResult.rows.length;


        // =====================================================
        // RECENT PATIENTS
        // =====================================================

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


        // =====================================================
        // DEBUGGING
        // =====================================================

        console.log(
            "========================================"
        );

        console.log(
            "Dashboard selected date:",
            selectedDate || "CURRENT_DATE"
        );

        console.log(
            "Total appointments:",
            appointmentsListResult.rows.length
        );

        console.log(
            "Blood Work appointments:",
            bloodWorkAppointmentsResult.rows.length
        );

        console.log(
            "Blood Work data:",
            bloodWorkAppointmentsResult.rows
        );

        console.log(
            "========================================"
        );


        // =====================================================
        // RESPONSE
        // =====================================================

        res.json({

            totalPatients:
                Number(
                    patientsResult.rows[0].count
                ),

            totalProviders:
                Number(
                    providersResult.rows[0].count
                ),

            todayAppointments:
                Number(
                    appointmentsResult.rows[0].count
                ),

            bloodWorkToday:
                bloodWorkToday,

            todayAppointmentsList:
                appointmentsListResult.rows,

            bloodWorkAppointments:
                bloodWorkAppointmentsResult.rows,

            recentPatients:
                recentPatientsResult.rows
                

        });

    } catch (error) {

        console.error(
            "Dashboard API error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to load dashboard data",

            error:
                error.message

        });

    }

});


export default router;