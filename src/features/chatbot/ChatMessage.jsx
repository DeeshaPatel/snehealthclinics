export default function ChatMessage({message}){


    return (
    
    <div
    
    className={
    
    message.sender==="bot"
    
    ?
    "bot-message"
    :
    "user-message"
    
    }
    
    >
    
    {message.text}
    
    </div>
    
    )
    
    }