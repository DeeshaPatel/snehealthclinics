import { Link } from "react-router-dom";
import {
    CalendarCheck,
    ShieldCheck,
    Users,
    Clock
} from "lucide-react";


export default function Hero(){


return (

<section className="hero">

<div className="hero-overlay">


<div className="hero-content">


<span className="hero-badge">
🏥 Family Doctor Accepting New Patients
</span>



<h1>

Family Doctor &

<br/>

Walk-in Clinic in 

<span>
 Hamilton
</span>

</h1>



<p>

SNE Health Clinic provides compassionate,
accessible healthcare for individuals and families.
Book your appointment today or visit our walk-in clinic.

</p>



<div className="hero-actions">


<Link
to="/book-appointment"
className="hero-primary-btn"
>

Book Appointment

</Link>



<Link
to="/services"
className="hero-secondary-btn"
>

Explore Services

</Link>


</div>



<div className="hero-info">


<div>

<h4>
🕒 Clinic Hours
</h4>

<p>
Monday - Friday
<br/>
9:00 AM - 6:00 PM
</p>

</div>



<div>

<h4>
📍 Location
</h4>

<p>
Hamilton, Ontario
</p>

</div>



<div>

<h4>
👨‍⚕️ New Patients
</h4>

<p>
Accepting Now
</p>

</div>


</div>


</div>


</div>


</section>

)

}