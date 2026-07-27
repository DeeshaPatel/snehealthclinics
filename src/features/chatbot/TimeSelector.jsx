const slots=[

    "9:00 AM",
    "9:15 AM",
    "9:30 AM",
    "9:45 AM",
    "10:00 AM",
    "10:15 AM",
    "10:30 AM",
    "10:45 AM",
    "11:00 AM",
    "11:15 AM",
    "11:30 AM",
    "11:45 AM",
    "12:00 PM",
    "12:15 PM",
    "12:30 PM",
    "12:45 PM",
    "1:00 PM",
    "1:15 PM",
    "1:30 PM",
    "1:45 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "5:00 PM", 
    "5:30 PM"
    
    ];
    
    
    export default function TimeSelector({
    value,
    onChange
    }){
    
    
    return (
    
    <select
    
    value={value}
    
    onChange={(e)=>
    onChange(e.target.value)
    }
    
    >
    
    
    <option>
    Select time
    </option>
    
    
    {
    slots.map(slot=>(
    
    <option
    key={slot}
    >
    
    {slot}
    
    </option>
    
    ))
    
    }
    
    
    </select>
    
    )
    
    }