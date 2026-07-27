import Mission from "./Mission";
import Vision from "./Vision";
import Team from "./Team";

import "./about.css";


export default function About(){


return (

<main className="about-page">


{/* Hero */}

<section className="about-hero">


<div className="about-hero-content">

<span>
Trusted Healthcare Partner
</span>


<h1>
Providing Compassionate
Healthcare For Every Family
</h1>


<p>
At SNE Health Clinic, we combine
professional medical expertise with
personalized care to improve the health
and wellness of our community.
</p>


</div>


</section>





{/* Story */}

<section className="about-story">


<div className="story-content">


<h2>
Our Story
</h2>


<p>
SNE Health Clinic was founded with a simple
mission: to make healthcare more accessible,
personal, and patient-focused.
</p>


<p>
Our healthcare team provides preventive care,
diagnosis, treatment, and long-term wellness
support for individuals and families.
</p>



<div className="story-highlights">


<div>

<h3>
Patient First
</h3>

<p>
Every decision is made around your health needs.
</p>

</div>



<div>

<h3>
Quality Care
</h3>

<p>
Professional healthcare you can trust.
</p>

</div>


</div>



</div>





<div className="story-image">

<img

src="/images/clinic.jpg"

alt="SNE Health Clinic"

/>

</div>


</section>





<Mission/>


<Vision/>





{/* Values */}

<section className="values">


<div className="section-heading">

<h2>
Our Core Values
</h2>


<p>
The principles that guide every patient interaction.
</p>

</div>



<div className="values-grid">


<div className="value-card">

<div>
❤️
</div>

<h3>
Compassion
</h3>

<p>
We treat every patient with kindness,
respect, and understanding.
</p>

</div>



<div className="value-card">

<div>
🔒
</div>

<h3>
Integrity
</h3>

<p>
We protect patient privacy and build
lasting trust.
</p>

</div>




<div className="value-card">

<div>
⭐
</div>

<h3>
Excellence
</h3>

<p>
We provide reliable and high-quality
healthcare services.
</p>

</div>




<div className="value-card">

<div>
🌎
</div>

<h3>
Community
</h3>

<p>
We work towards creating healthier
communities.
</p>

</div>



</div>


</section>





<Team/>



</main>

)

}