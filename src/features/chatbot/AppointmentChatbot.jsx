import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

import "./chatbot.css";

const initialOptions = [

    {
    label:"📅 Book an Appointment",
    value:"appointment"
    },
    
    {
    label:"📞 Contact Information",
    value:"contact"
    },
    
    {
    label:"🕒 Clinic Hours",
    value:"hours"
    }
    
    ];


const questions = [

{
key:"firstName",
text:"What is your first name?"
},

{
key:"lastName",
text:"What is your last name?"
},

{
key:"dob",
text:"What is your date of birth?"
},

{
key:"phone",
text:"What is your phone number?"
},

{
key:"email",
text:"What is your email address?"
},

{
key:"reason",
text:"What is the reason for your visit?"
},

{
key:"date",
text:"Which date would you like to schedule your appointment?"
},

{
key:"time",
text:"What time works best for you?"
}

];



export default function AppointmentChatbot(){


const [open,setOpen]=useState(false);


const [step,setStep]=useState(0);
const [selectedOption,setSelectedOption]=useState(null);




const [messages,setMessages]=useState([

    {
    sender:"bot",
    text:
    "Hi 👋 Welcome to SNE Health Clinics. How can I help you today?"
    }
    
    ]);



const [form,setForm]=useState({

date:"",
time:"",

firstName:"",
lastName:"",
dob:"",
phone:"",
email:"",
reason:""

});




function handleSend(value){


const currentQuestion =
questions[step];



setMessages(prev=>[

...prev,

{
sender:"user",
text:value
}

]);




setForm(prev=>({

...prev,

[currentQuestion.key]:value

}));





if(step < questions.length-1){


setTimeout(()=>{


setMessages(prev=>[

...prev,

{
sender:"bot",
text:
questions[step+1].text
}

]);


},500);



setStep(step+1);



}

else{


setTimeout(()=>{


setMessages(prev=>[

...prev,

{
sender:"bot",
text:
"Thank you! Your appointment request has been collected. Our team will contact you shortly."
}

]);


console.log(form);


},500);


}



}



return (

<>


<button

className="chat-button"

onClick={()=>setOpen(!open)}

>

{
open
?
<X/>
:
<MessageCircle/>
}

</button>





{
open &&

<div className="chat-window">


<div className="chat-header">

SNE Health Assistant

</div>



<div className="chat-body">

{
messages.length === 1 && !selectedOption && (

<div className="chat-options">


{
initialOptions.map(option=>(


<button

key={option.value}

onClick={()=>handleOption(option)}

>

{option.label}

</button>


))

}


</div>

)

}


{
messages.map((msg,index)=>(

<ChatMessage

key={index}

message={msg}

/>

))

}


</div>



<ChatInput

onSend={handleSend}

/>



</div>

}



</>

)

}

function handleOption(option){


    setSelectedOption(option.value);
    
    
    
    setMessages(prev=>[
    
    ...prev,
    
    {
    sender:"user",
    text:option.label
    }
    
    ]);
    
    
    
    if(option.value==="appointment"){
    
    
    setMessages(prev=>[
    
    ...prev,
    
    {
    sender:"bot",
    text:
    "Great! I can help you schedule an appointment. What is your first name?"
    }
    
    ]);
    
    
    setStep(0);
    
    
    }
    
    
    
    if(option.value==="contact"){
    
    
    setMessages(prev=>[
    
    ...prev,
    
    {
    sender:"bot",
    text:
    "📞 Phone: (555) 123-4567\n📠 Fax: (555) 123-4568\n✉ Email: info@snehealth.com\n📍 123 Healthcare Avenue"
    }
    
    ]);
    
    
    }
    
    
    
    if(option.value==="hours"){
    
    
    setMessages(prev=>[
    
    ...prev,
    
    {
    sender:"bot",
    text:
    "🕒 Clinic Hours:\n\nMonday-Friday: 9:00 AM - 6:00 PM\nSaturday and Sunday: Closed"
    }
    
    ]);
    
    
    }
    
    
    }