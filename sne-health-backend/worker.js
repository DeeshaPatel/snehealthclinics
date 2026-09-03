import express from "express";
import { httpServerHandler } from "cloudflare:node";
import { setDatabaseEnv } from "./db.js";

// ===============================
// ROUTES
// ===============================

import appointmentRoutes from "./routes/appointmentRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentSettingsRoutes from "./routes/appointmentSettings.js";
import patientRoutes from "./routes/patientRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import appointmentTypesRouter from "./routes/appointmentTypes.js";

// ===============================
// EXPRESS APP
// ===============================

const app = express();

// ===============================
// CLOUDFLARE ENVIRONMENT
// ===============================
//
// Make Hyperdrive / Cloudflare environment
// available to db.js before database routes execute.
//

app.use((req, res, next) => {
    if (globalThis.__CF_ENV__) {
        setDatabaseEnv(globalThis.__CF_ENV__);
    }

    next();
});

// ===============================
// CORS
// ===============================
//
// IMPORTANT:
// This middleware must run BEFORE all API routes.
//

app.use((req, res, next) => {

    const allowedOrigins = [
        "https://snehealthclinics.ca",
        "https://www.snehealthclinics.ca",

        // Optional local development
        "http://localhost:5173",
        "http://localhost:5174"
    ];

    const origin = req.headers.origin;

    // --------------------------------
    // Allow matching frontend origins
    // --------------------------------

    if (origin && allowedOrigins.includes(origin)) {

        res.setHeader(
            "Access-Control-Allow-Origin",
            origin
        );

        res.setHeader(
            "Access-Control-Allow-Credentials",
            "true"
        );

        // Required when Access-Control-Allow-Origin
        // changes depending on the request origin.
        res.setHeader(
            "Vary",
            "Origin"
        );
    }

    // --------------------------------
    // Allowed HTTP methods
    // --------------------------------

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    // --------------------------------
    // Allowed request headers
    // --------------------------------

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    // --------------------------------
    // Handle preflight requests
    // --------------------------------

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// ===============================
// JSON BODY PARSER
// ===============================

app.use(express.json());

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "SNE Health API Running"
    });

});

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Backend is healthy"
    });

});

// ===============================
// API ROUTES
// ===============================

// Dashboard
app.use(
    "/api/dashboard",
    dashboardRoutes
);

// Appointment Settings
app.use(
    "/api/settings/appointments",
    appointmentSettingsRoutes
);

// Appointment Types
app.use(
    "/api/appointment-types",
    appointmentTypesRouter
);

// Authentication
app.use(
    "/api/auth",
    authRoutes
);

// Appointments
app.use(
    "/api/appointments",
    appointmentRoutes
);

// Patients
app.use(
    "/api/patients",
    patientRoutes
);

// Providers
app.use(
    "/api/providers",
    providerRoutes
);

// Services
app.use(
    "/api/services",
    serviceRoutes
);

// Users
app.use(
    "/api/users",
    usersRoutes
);

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        path: req.path
    });

});

// ===============================
// START EXPRESS SERVER
// ===============================
//
// Cloudflare's Node compatibility layer
// exposes the Express server through port 3000.
//

app.listen(3000);

// ===============================
// CLOUDFLARE HTTP SERVER HANDLER
// ===============================

const handler = httpServerHandler({
    port: 3000
});

// ===============================
// CLOUDFLARE WORKER
// ===============================

export default {

    async fetch(request, env, ctx) {

        // --------------------------------
        // Make Cloudflare environment
        // available to db.js
        // --------------------------------

        setDatabaseEnv(env);

        // --------------------------------
        // Make environment available to
        // the Express middleware as well
        // --------------------------------

        globalThis.__CF_ENV__ = env;

        // --------------------------------
        // Pass request to Express
        // --------------------------------

        return handler.fetch(
            request,
            env,
            ctx
        );

    }

};