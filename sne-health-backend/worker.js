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

/* ========================================================= 
CLOUDFLARE ENVIRONMENT 
========================================================= 
Make Hyperdrive's env available to db.js before 
any database route executes.
========================================================= */ 
app.use((req, res, next) => { 
    if (globalThis.__CF_ENV__) { 
        setDatabaseEnv(globalThis.__CF_ENV__); 
    } 
    next(); 
});


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());


// ===============================
// CORS
// ===============================

app.use((req, res, next) => {

    const allowedOrigins = [
        "https://snehealth.ca",
        "https://www.snehealth.ca",
        "http://localhost:5173"
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});


// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {

    res.json({
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
// ROUTES
// ===============================

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/settings/appointments",
    appointmentSettingsRoutes
);

app.use(
    "/api/appointment-types",
    appointmentTypesRouter
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/appointments",
    appointmentRoutes
);

app.use(
    "/api/patients",
    patientRoutes
);

app.use(
    "/api/providers",
    providerRoutes
);

app.use(
    "/api/services",
    serviceRoutes
);

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
// CLOUDFLARE WORKER
// ===============================

app.listen(3000);

const handler = httpServerHandler({
    port: 3000
});

export default {

    async fetch(request, env, ctx) {

        /*
        ================================================
        Make Cloudflare environment available to db.js
        ================================================
        */

        setDatabaseEnv(env);

        /*
        ================================================
        Pass request to Express
        ================================================
        */

        return handler.fetch(request, env, ctx);

    }

};
