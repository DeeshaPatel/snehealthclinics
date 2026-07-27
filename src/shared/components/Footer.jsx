import { Link } from "react-router-dom";
import "../styles/components.css";


export default function Footer(){


return (

<footer className="footer">


<div className="footer-grid">


<div>

<h3>
SNE Health Clinic
</h3>

<p>
Providing compassionate healthcare
services for families and individuals.
</p>

</div>




<div>

<h4>
Quick Links
</h4>


<Link to="/about">
About
</Link>


<Link to="/services">
Services
</Link>


<Link to="/careers">
Careers
</Link>


<Link to="/contact">
Contact
</Link>


</div>





<div>

<h4>
Contact
</h4>

<p>
📍 Address:
15-247 Centennial Pkwy N, Hamilton, Ontario  
</p>

<p>
📞 Phone: (289) 316-3141
</p>

<p>
📠 Fax: (289) 316-3142
</p>


<p>
✉ Email: info@snehealth.com
</p>

</div>


</div>




<div className="footer-bottom">

© 2026 SNE Health Clinic. All rights reserved.

</div>


</footer>

)

}