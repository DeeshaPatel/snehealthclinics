import Hero from "./Hero";
import ServicesPreview from "./ServicesPreview";
import WhyChooseUs from "./WhyChooseUs";
import Testimonials from "./Testimonials";
import CTASection from "./CTASection";

import "./home.css";


export default function Home(){

return (

<div className="home">


<Hero />


<ServicesPreview />


<WhyChooseUs />


{/* <Testimonials /> */}


<CTASection />


</div>

);

}