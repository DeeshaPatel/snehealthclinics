import "./careers.css";

import {
    Briefcase,
    HeartHandshake,
    Users,
    Mail
} from "lucide-react";


export default function Careers(){


return (

<section className="careers-page">


<div className="careers-hero">


<h1>
Join Our Healthcare Team
</h1>


<p>
At SNE Health Clinics, we are committed to building a team
of compassionate professionals who share our passion for
providing exceptional patient care.
</p>


</div>





<div className="careers-content">



<div className="career-card">


<Briefcase size={40}/>


<h2>
Current Opportunities
</h2>


<p>
We are not currently hiring for any open positions.
However, we are always interested in connecting with
talented healthcare professionals who share our values.
</p>


</div>





<div className="career-card">


<HeartHandshake size={40}/>


<h2>
Why Work With Us?
</h2>


<ul>

<li>
Patient-focused healthcare environment
</li>

<li>
Supportive and collaborative team culture
</li>

<li>
Commitment to professional growth
</li>

<li>
Meaningful work that improves lives
</li>

</ul>


</div>



</div>





<div className="career-contact">


<Users size={35}/>


<div>

<h3>
Stay Connected
</h3>


<p>
Future opportunities will be posted here.
We encourage interested candidates to check back
or send us their information for future consideration.
</p>


<a href="mailto:careers@snehealth.com">

<Mail size={18}/>

contact@snehealth.com

</a>


</div>


</div>



</section>

)

}