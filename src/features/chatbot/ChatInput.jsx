import {useState} from "react";


export default function ChatInput({onSend}){


const [text,setText]=useState("");



function submit(e){

e.preventDefault();


if(!text.trim())
return;


onSend(text);

setText("");

}



return (

<form

className="chat-input"

onSubmit={submit}

>


<input

value={text}

onChange={(e)=>setText(e.target.value)}

placeholder="Type your answer..."

/>


<button>

Send

</button>


</form>

)

}