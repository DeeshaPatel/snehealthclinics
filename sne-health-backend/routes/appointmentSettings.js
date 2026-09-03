import express from "express";

import pool from "../db.js";

const router = express.Router();


// =====================================================
// GET APPOINTMENT SETTINGS
// =====================================================

router.get("/", async (req, res) => {

    try {

        const settingsResult = await pool.query(`
            SELECT
                id,
                default_duration,
                default_status,
                cancellation_window,
                allow_double_booking,
                allow_outside_hours
            FROM appointment_settings
            LIMIT 1
        `);


        const hoursResult = await pool.query(`
            SELECT
                id,
                day_of_week,
                enabled,
                start_time,
                end_time
            FROM business_hours
            ORDER BY
                CASE day_of_week
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                END
        `);


        const typesResult = await pool.query(`
            SELECT
                id,
                name
            FROM appointment_types
            WHERE active = TRUE
            ORDER BY name
        `);


        const holidaysResult = await pool.query(`
            SELECT
                id,
                holiday_date,
                name
            FROM clinic_holidays
            ORDER BY holiday_date
        `);


        res.json({

            settings:
                settingsResult.rows[0] || null,

            businessHours:
                hoursResult.rows,

            appointmentTypes:
                typesResult.rows,

            holidays:
                holidaysResult.rows

        });

    } catch (error) {

        console.error(
            "Failed to load appointment settings:",
            error
        );

        res.status(500).json({

            message:
                "Failed to load appointment settings"

        });

    }

});

router.get("/business-hours", async (req, res) => {
    try {

        const result = await pool.query(`
            SELECT *
            FROM business_hours
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(
            "BUSINESS HOURS DATABASE ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to load business hours",
            error: error.message
        });
    }
});

// =====================================================
// GET CLINIC HOLIDAYS
// =====================================================

router.get("/clinic-holidays", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                holiday_date,
                name
            FROM clinic_holidays
            ORDER BY holiday_date
        `);


        res.json(
            result.rows
        );

    } catch (error) {

        console.error(
            "CLINIC HOLIDAYS DATABASE ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to load clinic holidays",

            error:
                error.message

        });

    }

});


// =====================================================
// UPDATE APPOINTMENT SETTINGS
// =====================================================

router.put("/", async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            settings,
            businessHours,
            appointmentTypes,
            holidays
        } = req.body;


        await client.query("BEGIN");


        // -------------------------------------------------
        // GENERAL SETTINGS
        // -------------------------------------------------

        await client.query(`
            UPDATE appointment_settings
            SET
                default_duration = $1,
                default_status = $2,
                cancellation_window = $3,
                allow_double_booking = $4,
                allow_outside_hours = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = (
                SELECT id
                FROM appointment_settings
                LIMIT 1
            )
        `, [

            Number(settings.defaultDuration),

            settings.defaultStatus,

            Number(settings.cancellationWindow),

            Boolean(settings.allowDoubleBooking),

            Boolean(settings.allowOutsideHours)

        ]);


        // -------------------------------------------------
        // BUSINESS HOURS
        // -------------------------------------------------

        for (const day of businessHours) {

            await client.query(`
                UPDATE business_hours
                SET
                    enabled = $1,
                    start_time = $2,
                    end_time = $3,
                    updated_at = CURRENT_TIMESTAMP
                WHERE day_of_week = $4
            `, [

                day.enabled,

                day.enabled
                    ? day.start
                    : null,

                day.enabled
                    ? day.end
                    : null,

                day.day

            ]);

        }


        // -------------------------------------------------
        // APPOINTMENT TYPES
        // -------------------------------------------------

        await client.query(`
            UPDATE appointment_types
            SET active = FALSE
        `);


        for (const type of appointmentTypes) {

            await client.query(`
                INSERT INTO appointment_types (
                    name,
                    active
                )
                VALUES ($1, TRUE)
                ON CONFLICT (name)
                DO UPDATE SET active = TRUE
            `, [
                type
            ]);

        }


        // -------------------------------------------------
        // HOLIDAYS
        // -------------------------------------------------

        await client.query(`
            DELETE FROM clinic_holidays
        `);


        for (const holiday of holidays) {

            await client.query(`
                INSERT INTO clinic_holidays (
                    holiday_date,
                    name
                )
                VALUES ($1, $2)
                ON CONFLICT (holiday_date)
                DO UPDATE SET name = EXCLUDED.name
            `, [

                holiday.date,

                holiday.name

            ]);

        }


        await client.query("COMMIT");


        res.json({

            message:
                "Appointment settings saved successfully"

        });

    } catch (error) {

        await client.query("ROLLBACK");


        console.error(
            "Failed to save appointment settings:",
            error
        );


        res.status(500).json({

            message:
                "Failed to save appointment settings"

        });

    } finally {

        client.release();

    }

});


export default router;