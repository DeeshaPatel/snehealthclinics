import express from "express";

import {

addAppointment,

fetchAppointments

}
from "../controllers/appointmentController.js";


const router =
express.Router();



router.post(
"/",
addAppointment
);



router.get(
"/",
fetchAppointments
);



export default router;