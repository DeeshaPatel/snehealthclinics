import { useState } from "react";

import AppointmentForm from "./AppointmentForm";
import Confirmation from "./Confirmation";

import "./appointment.css";


export default function BookAppointment(){

const [submitted,setSubmitted]=useState(false);


const handleSuccess=()=>{

setSubmitted(true);

};



return (

<main className="appointment-page">


<section className="appointment-header">

<h1>
Book Your Appointment
</h1>


<p>
Schedule a visit with our healthcare professionals.
</p>


</section>



{

submitted ?

<Confirmation/>

:

<AppointmentForm
onSuccess={handleSuccess}
/>

}



</main>

)

}