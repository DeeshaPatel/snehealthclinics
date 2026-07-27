export default function AppointmentCard({

    appointment,
    top,
    height
    
    }){
    
    
    return (
    
    <div
    
    className="appointment-card"
    
    style={{
    
    top:`${top}px`,
    
    height:`${height}px`
    
    }}
    
    >
    
    
    <strong>
    
    {appointment.patient_name}
    
    </strong>
    
    
    <p>
    
    {appointment.service}
    
    </p>
    
    
    <span>
    
    {appointment.provider_name}
    
    </span>
    
    
    </div>
    
    )
    
    }