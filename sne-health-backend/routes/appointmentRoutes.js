import express from "express";
import pool from "../db.js";

const router = express.Router();

// ========================================
// GET ALL APPOINTMENTS
// ========================================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.appointment_date,
                a.start_time,
                a.end_time,
                a.reason,
                a.status,
                a.created_at,
                a.notes,

                p.id AS patient_id,
                p.first_name AS patient_first_name,
                p.last_name AS patient_last_name,
                p.date_of_birth AS date_of_birth,
                p.health_card AS health_card,
                p.phone AS phone,
                p.emergency_contact AS emergency_contact,
                p.medications AS medications,
                p.medical_history AS medical_history,

                pr.id AS provider_id,
                pr.first_name AS provider_first_name,
                pr.last_name AS provider_last_name,
                pr.specialty AS provider_specialty

            FROM appointments a

            LEFT JOIN patients p
                ON a.patient_id = p.id

            LEFT JOIN providers pr
                ON a.provider_id = pr.id

            ORDER BY
                a.appointment_date ASC,
                a.start_time ASC
        `);


        res.json(result.rows);


    } catch (error) {

        console.error(
            "GET APPOINTMENTS ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Failed to load appointments",

            error:
                error.message

        });

    }

});

router.post("/", async (req, res) => {

    let client = null;

    try {
        client = await pool.connect();
        const {
            first_name,
            last_name,
            date_of_birth,
            health_card,
            phone,
            emergency_contact,
            medications,
            medical_history,

            provider_id,
            title,
            appointment_date,
            start_time,
            end_time,
            reason
        } = req.body;


        console.log("BOOKING REQUEST:");
        console.log(req.body);


        // --------------------------------
        // Validate patient information
        // --------------------------------

        if (
            !first_name ||
            !last_name ||
            !phone
        ) {

            return res.status(400).json({
                message:
                    "Patient first name, last name and phone are required."
            });

        }


        // --------------------------------
        // Validate appointment information
        // --------------------------------

        if (
            !provider_id ||
            !title ||
            !appointment_date ||
            !start_time ||
            !end_time
        ) {

            return res.status(400).json({
                message:
                    "Provider, title, date and time are required."
            });

        }


        await client.query("BEGIN");


        // --------------------------------
        // Check provider
        // --------------------------------

        const providerResult = await client.query(
            `
            SELECT
                id,
                first_name,
                last_name,
                specialty

            FROM providers

            WHERE id = $1
            `,
            [provider_id]
        );


        if (providerResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message:
                    "Selected provider was not found."
            });

        }


        // --------------------------------
        // Check appointment conflict
        // --------------------------------

        const conflictResult = await client.query(
            `
            SELECT id

            FROM appointments

            WHERE provider_id = $1

            AND appointment_date = $2

            AND status != 'Cancelled'

            AND start_time < $4

            AND end_time > $3

            LIMIT 1
            `,
            [
                provider_id,
                appointment_date,
                start_time,
                end_time
            ]
        );


        if (conflictResult.rows.length > 0) {

            await client.query("ROLLBACK");

            return res.status(409).json({
                message:
                    "This appointment time is already booked. Please choose another time."
            });

        }


        // --------------------------------
        // Find patient
        // --------------------------------

        let patientResult;


        if (health_card) {

            patientResult = await client.query(
                `
                SELECT *
                FROM patients
                WHERE health_card = $1
                LIMIT 1
                `,
                [health_card]
            );

        } else {

            patientResult = await client.query(
                `
                SELECT *
                FROM patients

                WHERE LOWER(first_name) = LOWER($1)

                AND LOWER(last_name) = LOWER($2)

                AND phone = $3

                LIMIT 1
                `,
                [
                    first_name,
                    last_name,
                    phone
                ]
            );

        }


        let patient;


        // --------------------------------
        // Existing patient
        // --------------------------------

        if (patientResult.rows.length > 0) {

            patient =
                patientResult.rows[0];

        }


        // --------------------------------
        // New patient
        // --------------------------------

        else {

            const newPatientResult =
                await client.query(
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
                        phone,
                        emergency_contact || null,
                        medications || null,
                        medical_history || null
                    ]
                );


            patient =
                newPatientResult.rows[0];

        }


        // --------------------------------
        // Create appointment
        // --------------------------------

        const appointmentResult =
            await client.query(
                `
                INSERT INTO appointments (
                    patient_id,
                    provider_id,
                    title,
                    appointment_date,
                    start_time,
                    end_time,
                    reason,
                    status
                )

                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    'Scheduled'
                )

                RETURNING *
                `,
                [
                    patient.id,
                    provider_id,
                    title,
                    appointment_date,
                    start_time,
                    end_time,
                    reason || null
                ]
            );


        await client.query("COMMIT");


        // --------------------------------
        // Success
        // --------------------------------

        res.status(201).json({

            message:
                "Appointment booked successfully.",

            appointment:
                appointmentResult.rows[0],

            patient: {
                id: patient.id,
                first_name:
                    patient.first_name,
                last_name:
                    patient.last_name
            },

            provider:
                providerResult.rows[0]

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "CREATE APPOINTMENT ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Unable to book appointment.",
            error:
                error.message
        });

    } finally {

        client.release();

    }

});

// ========================================
// UPDATE APPOINTMENT
// ========================================

// ========================================
// UPDATE APPOINTMENT + PATIENT
// ========================================

router.put("/:id", async (req, res) => {

    const { id } = req.params;

    const {
        // Patient information
        first_name,
        last_name,
        date_of_birth,
        health_card,
        phone,
        emergency_contact,
        medications,
        medical_history,

        // Appointment information
        provider_id,
        title,
        appointment_date,
        start_time,
        end_time,
        reason,
        status,
        notes
    } = req.body;

    let client = null;

    try {
        client = await pool.connect();
        console.log(
            "UPDATE APPOINTMENT REQUEST:",
            {
                id,
                body: req.body
            }
        );

        await client.query("BEGIN");

        // ========================================
        // FIND APPOINTMENT + PATIENT
        // ========================================

        const existingAppointment = await client.query(
            `
            SELECT
                a.id,
                a.patient_id
            FROM appointments a
            WHERE a.id = $1
            `,
            [id]
        );

        if (existingAppointment.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Appointment not found."
            });

        }

        const patientId =
            existingAppointment.rows[0].patient_id;


        // ========================================
        // UPDATE PATIENT
        // ========================================

        if (patientId) {

            await client.query(
                `
                UPDATE patients

                SET
                    first_name = COALESCE($1, first_name),

                    last_name = COALESCE($2, last_name),

                    date_of_birth = COALESCE(
                        $3,
                        date_of_birth
                    ),

                    health_card = COALESCE(
                        $4,
                        health_card
                    ),

                    phone = COALESCE(
                        $5,
                        phone
                    ),

                    emergency_contact = COALESCE(
                        $6,
                        emergency_contact
                    ),

                    medications = COALESCE(
                        $7,
                        medications
                    ),

                    medical_history = COALESCE(
                        $8,
                        medical_history
                    )

                WHERE id = $9
                `,
                [
                    first_name ?? null,
                    last_name ?? null,
                    date_of_birth || null,
                    health_card ?? null,
                    phone ?? null,
                    emergency_contact ?? null,
                    medications ?? null,
                    medical_history ?? null,
                    patientId
                ]
            );

        }


        // ========================================
        // UPDATE APPOINTMENT
        // ========================================

        const appointmentResult =
            await client.query(
                `
                UPDATE appointments

                SET

                    provider_id = COALESCE(
                        $1,
                        provider_id
                    ),

                    title = COALESCE(
                        $2,
                        title
                    ),

                    appointment_date = COALESCE(
                        $3,
                        appointment_date
                    ),

                    start_time = COALESCE(
                        $4,
                        start_time
                    ),

                    end_time = COALESCE(
                        $5,
                        end_time
                    ),

                    reason = COALESCE(
                        $6,
                        reason
                    ),

                    status = COALESCE(
                        $7,
                        status
                    ),

                    notes = COALESCE(
                        $8,
                        notes
                    )

                WHERE id = $9

                RETURNING *
                `,
                [
                    provider_id ?? null,
                    title ?? null,
                    appointment_date ?? null,
                    start_time ?? null,
                    end_time ?? null,
                    reason ?? null,
                    status ?? null,
                    notes ?? null,
                    id
                ]
            );


        // ========================================
        // GET UPDATED PATIENT
        // ========================================

        let updatedPatient = null;

        if (patientId) {

            const patientResult =
                await client.query(
                    `
                    SELECT *
                    FROM patients
                    WHERE id = $1
                    `,
                    [patientId]
                );

            if (patientResult.rows.length > 0) {
                updatedPatient =
                    patientResult.rows[0];
            }

        }


        // ========================================
        // COMMIT
        // ========================================

        await client.query("COMMIT");


        // ========================================
        // SUCCESS
        // ========================================

        res.json({

            message:
                "Appointment and patient updated successfully.",

            appointment:
                appointmentResult.rows[0],

            patient:
                updatedPatient

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "UPDATE APPOINTMENT ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Unable to update appointment.",

            error:
                error.message

        });

    } finally {

        client.release();

    }

});


// ========================================
// DELETE APPOINTMENT
// ========================================

router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        // --------------------------------
        // Check appointment exists
        // --------------------------------

        const existingAppointment =
            await pool.query(
                `
                SELECT id
                FROM appointments
                WHERE id = $1
                `,
                [id]
            );


        if (
            existingAppointment.rows.length === 0
        ) {

            return res.status(404).json({
                message:
                    "Appointment not found."
            });

        }


        // --------------------------------
        // Delete appointment
        // --------------------------------

        const result =
            await pool.query(
                `
                DELETE FROM appointments

                WHERE id = $1

                RETURNING id
                `,
                [id]
            );


        res.json({

            message:
                "Appointment deleted successfully.",

            appointment_id:
                result.rows[0].id

        });


    } catch (error) {

        console.error(
            "DELETE APPOINTMENT ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Unable to delete appointment.",

            error:
                error.message

        });

    }

});


export default router;