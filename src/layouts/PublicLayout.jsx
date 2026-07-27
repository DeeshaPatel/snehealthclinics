import { Outlet } from "react-router-dom";

import Navbar from "../shared/components/Navbar";
import Footer from "../shared/components/Footer";
import AppointmentChatbot from "../features/chatbot/AppointmentChatbot";


export default function PublicLayout(){

return (

<div className="public-layout">


<Navbar/>


<main>

<Outlet/>

</main>

<AppointmentChatbot/>


<Footer/>


</div>

)

}