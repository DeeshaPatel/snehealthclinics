import "./contact.css";

import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Printer,
    CalendarCheck
} from "lucide-react";

import { Link } from "react-router-dom";



export default function Contact(){


return (

<section className="contact-page">



{/* Header */}

<div className="contact-header">


<h1>
Contact SNE Health Clinics
</h1>


<p>
We are here to answer your questions,
provide information, and help you schedule
your healthcare visit.
</p>


</div>






<div className="contact-container">





{/* Contact Information */}


<div className="contact-info">


<h2>
Contact Information
</h2>




<div className="contact-item">

<Phone/>

<div>

<h4>
Phone
</h4>

<p>
(289) 316-3141
</p>

</div>

</div>





<div className="contact-item">

<Printer/>

<div>

<h4>
Fax
</h4>

<p>
(289) 316-3142
</p>

</div>

</div>





<div className="contact-item">

<Mail/>

<div>

<h4>
Email
</h4>

<p>
info@snehealth.com
</p>

</div>

</div>






<div className="contact-item">

<MapPin/>

<div>

<h4>
Address
</h4>

<p>
15-247 Centennial Pkwy N,<br/>
Hamilton, Ontario
</p>

</div>

</div>







<div className="contact-item">

<Clock/>

<div>

<h4>
Clinic Hours
</h4>

<p>
Mon - Fri: 9:00 AM - 6:00 PM
<br/>
Sat - Sun: Closed
</p>

</div>

</div>




</div>







{/* Contact Form */}


<div className="contact-form">


<h2>
Send Us A Message
</h2>



<form>


<div className="form-row">


<input
type="text"
placeholder="Full Name"
/>


<input
type="email"
placeholder="Email Address"
/>


</div>




<div className="form-row">


<input
type="tel"
placeholder="Phone Number"
/>


<input
type="text"
placeholder="Subject"
/>


</div>





<textarea

rows="5"

placeholder="Your Message"

/>




<button>

Send Message

</button>



</form>


</div>



</div>







{/* Appointment CTA */}


<div className="contact-cta">


<h2>
Need a Medical Appointment?
</h2>


<p>
Schedule your visit with our healthcare team today.
</p>



<Link

to="/book-appointment"

>

<CalendarCheck size={20}/>

Book Appointment

</Link>



</div>





</section>

)

}