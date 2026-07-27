import { Link } from "react-router-dom";

import {
    Stethoscope,
    Baby,
    HeartPulse,
    Syringe,
    FlaskConical,
    Brain
} from "lucide-react";


const services = [

{
    title:"Family Medicine",
    icon:<Stethoscope size={40}/>,
    description:
    "Comprehensive healthcare for individuals and families including preventive care and routine checkups.",
    benefits:[
        "Annual health checkups",
        "Chronic disease management",
        "Preventive healthcare"
    ]
},


{
    title:"Pediatrics",
    icon:<Baby size={40}/>,
    description:
    "Specialized healthcare services focused on children's growth, development, and wellness.",
    benefits:[
        "Child wellness visits",
        "Vaccinations",
        "Growth monitoring"
    ]
},


{
    title:"Women's Health",
    icon:<HeartPulse size={40}/>,
    description:
    "Complete healthcare solutions supporting women's health at every stage of life.",
    benefits:[
        "Wellness exams",
        "Prenatal care",
        "Health screenings"
    ]
},


{
    title:"Vaccination",
    icon:<Syringe size={40}/>,
    description:
    "Safe and reliable immunization services for children and adults.",
    benefits:[
        "Routine vaccines",
        "Travel vaccines",
        "Immunization records"
    ]
},


{
    title:"Laboratory Services",
    icon:<FlaskConical size={40}/>,
    description:
    "Accurate diagnostic testing to support better healthcare decisions.",
    benefits:[
        "Blood testing",
        "Health screening",
        "Diagnostic reports"
    ]
},


{
    title:"Mental Health",
    icon:<Brain size={40}/>,
    description:
    "Professional support for emotional wellness and mental health needs.",
    benefits:[
        "Counselling",
        "Stress management",
        "Mental wellness programs"
    ]
}


];


export default function ServicesPreview(){


return (

<section className="services-section">


<div className="section-header">

<h2>
Our Healthcare Services
</h2>


<p>
Comprehensive medical care designed around
your health and wellness needs.
</p>


</div>



<div className="services-grid">


{
services.map((service)=>(


<div
className="service-card"
key={service.title}
>


<div className="service-icon">

{service.icon}

</div>



<h3>
{service.title}
</h3>



<p className="service-description">

{service.description}

</p>



<ul>

{
service.benefits.map((benefit)=>(


<li key={benefit}>

✓ {benefit}

</li>


))
}


</ul>



<Link
to="/services"
className="service-link"
>

Learn More →

</Link>


</div>


))
}


</div>


</section>

)

}