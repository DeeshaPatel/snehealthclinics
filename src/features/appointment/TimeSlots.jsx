const times=[

    "09:00 AM",
    
    "09:30 AM",
    
    "10:00 AM",
    
    "10:30 AM",
    
    "11:00 AM",
    
    "01:00 PM",
    
    "02:00 PM"
    
    ];
    
    
    export default function TimeSlots({
    
    value,
    
    onChange
    
    }){
    
    
    return (
    
    <div>
    
    <label>
    Available Time
    </label>
    
    
    <div className="time-grid">
    
    
    {
    
    times.map(time=>(
    
    
    <button
    
    type="button"
    
    className={
    
    value===time
    
    ?
    
    "selected-time"
    
    :
    
    ""
    
    }
    
    
    key={time}
    
    onClick={()=>
    onChange(time)
    }
    
    >
    
    
    {time}
    
    
    </button>
    
    
    ))
    
    
    }
    
    
    </div>
    
    
    </div>
    
    )
    
    }