import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import appointmentRoutes 
from "./routes/appointmentRoutes.js";


import providerRoutes 
from "./routes/providerRoutes.js";


import serviceRoutes 
from "./routes/serviceRoutes.js";



dotenv.config();


const app = express();



app.use(cors());

app.use(express.json());



app.use(
"/api/appointments",
appointmentRoutes
);


app.use(
"/api/providers",
providerRoutes
);


app.use(
"/api/services",
serviceRoutes
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