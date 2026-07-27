import { Link } from "react-router-dom";
import { CalendarCheck, PhoneCall, ShieldCheck } from "lucide-react";


export default function CTASection(){


return (

<section className="cta-section">


<div className="cta-container">


<div className="cta-content">


<h2>
Your Health Deserves
the Best Care
</h2>


<p>
Book an appointment with our experienced
healthcare professionals and take the first
step toward better health.
</p>



<div className="cta-buttons">


<Link
to="/book-appointment"
className="cta-primary"
>

<CalendarCheck size={20}/>

Book Appointment

</Link>



<a
href="tel:+15551234567"
className="cta-secondary"
>

<PhoneCall size={20}/>

Call Us

</a>


</div>


</div>




<div className="cta-features">


<div className="cta-feature">


<ShieldCheck size={32}/>


<div>

<h4>
Trusted Care
</h4>


<p>
Experienced medical professionals
</p>

</div>


</div>




<div className="cta-feature">


<CalendarCheck size={32}/>


<div>

<h4>
Easy Scheduling
</h4>


<p>
Flexible appointment options
</p>

</div>


</div>



</div>


</div>


</section>

)

}