import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import appointmentRoutes 
from "./routes/appointmentRoutes.js";


import providerRoutes 
from "./routes/providerRoutes.js";


import serviceRoutes 
from "./routes/serviceRoutes.js";

import dashboardRoutes 
from "./routes/dashboard.js"

import authRoutes 
from "./routes/authRoutes.js";

import appointmentSettingsRoutes
from "./routes/appointmentSettings.js";

import patientRoutes from "./routes/patientRoutes.js";

import usersRoutes from "./routes/usersRoutes.js";

import appointmentTypesRouter
    from "./routes/appointmentTypes.js";


dotenv.config();


const app = express();



app.use(cors());

app.use(express.json());

app.use(
    "/api/dashboard", dashboardRoutes
)

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



app.get("/",(req,res)=>{

res.json({

message:"SNE Health API Running"

});

});




const PORT =
process.env.PORT || 5000;



app.listen(PORT,()=>{

console.log(
`Server running on port ${PORT}`
);

});