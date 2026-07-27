import { useState } from "react";

import SectionTitle 
from "../../shared/components/SectionTitle";

import Button 
from "../../shared/components/Button";


import ServiceCard 
from "./ServiceCard";


import ServiceDetails 
from "./ServiceDetails";


import services 
from "./servicesData";


import "./services.css";



export default function Services(){


const [selectedService,setSelectedService]
=
useState(null);



return (

<main className="services-page">



<section className="services-hero">


<h1>

Healthcare Services

</h1>


<p>

Quality medical care designed around your needs.

</p>


</section>




<section className="services-container">


<SectionTitle

title="Our Medical Services"

subtitle="Comprehensive healthcare solutions for you and your family"

/>



<div className="services-grid">


{

services.map(service=>(


<ServiceCard

key={service.id}

service={service}

onSelect={setSelectedService}

/>


))


}


</div>


</section>




<section className="details-section">


<ServiceDetails

service={selectedService}

/>


</section>





<section className="services-cta">


<h2>

Ready to take care of your health?

</h2>


<p>

Schedule an appointment with our healthcare team.

</p>


<Button>

Book Appointment

</Button>


</section>



</main>

)

}