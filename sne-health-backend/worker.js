import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { httpServerHandler } from "cloudflare:node";

import appointmentRoutes from "./routes/appointmentRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentSettingsRoutes from "./routes/appointmentSettings.js";
import patientRoutes from "./routes/patientRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import appointmentTypesRouter from "./routes/appointmentTypes.js";

dotenv.config();

const app = express();

/*
=========================================================
CORS
=========================================================
*/

app.use(
    cors({
        origin: [
            "https://snehealth.ca",
            "https://www.snehealth.ca",
            "http://localhost:5173"
        ],
        credentials: true
    })
);

/*
=========================================================
MIDDLEWARE
=========================================================
*/

app.use(express.json());

/*
=========================================================
ROUTES
=========================================================
*/

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

/*
=========================================================
HEALTH CHECK
=========================================================
*/

app.get("/", (req, res) => {
    res.json({
        message: "SNE Health API Running"
    });
});

/*
=========================================================
CLOUDFLARE WORKER
=========================================================
*/

export default httpServerHandler({
    port: 8080,
    fetch: app.fetch
});