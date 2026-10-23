import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/images/sne_logo.png";

import "../styles/components.css";


export default function Navbar(){


const [open,setOpen]=useState(false);



const links=[

{
name:"Home",
path:"/"
},

{
name:"About",
path:"/about"
},

{
name:"Services",
path:"/services"
},

{
name:"Careers",
path:"/careers"
},

{
name:"Contact",
path:"/contact"
}

];



return (

<header className="navbar">


<div className="navbar-brand">


<img

src={logo}

alt="SNE Health Clinics Logo"

className="navbar-logo-image"

/>


<div className="navbar-logo-text">

SNE Health Clinics

<span>
Compassionate Healthcare, Better Health, Stronger You
</span>

</div>


</div>




<button

className="menu-button"

onClick={()=>setOpen(!open)}

>

{
open 
?
<X size={28}/>
:
<Menu size={28}/>
}

</button>





<nav

className={
open
?
"navbar-links mobile-open"
:
"navbar-links"
}

>


{
links.map((link)=>(


<NavLink

key={link.name}

to={link.path}

onClick={()=>setOpen(false)}

className={({isActive})=>

isActive
?
"active-link"
:
""

}

>

{link.name}

</NavLink>


))

}


<a
    href="https://patient.medeohealth.com/booking/sne-health-clinics"
    className="navbar-button"
>
    Book Appointment
</a>



</nav>


</header>

)

}