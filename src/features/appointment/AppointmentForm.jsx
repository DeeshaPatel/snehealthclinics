import {
    useState
    }
    from "react";
    
    
    import ProviderSelect 
    from "./ProviderSelect";
    
    import DatePicker
    from "./DatePicker";
    
    import TimeSlots
    from "./TimeSlots";
    
    
    import Button
    from "../../shared/components/Button";

    import { createAppointment } 
    from "../../api/appointmentApi";
    
    
    
    export default function AppointmentForm({
    
    onSuccess
    
    }){
    
    
    const [appointment,setAppointment]=useState({
    
    service_id:"",
    provider_id:"",
    date:"",
    time:"",
    
    firstName:"",
    lastName:"",
    dob:"",
    phone:"",
    email:"",
    reason:""
    
    });
    
    
    
    const updateField=(field,value)=>{
    
    setAppointment({
    
    ...appointment,
    
    [field]:value
    
    });
    
    };
    
    
    
    const submitAppointment = async(e)=>{


        e.preventDefault();
        
        
        try{
        
        
        const result = await createAppointment(
        appointment
        );
        
        
        console.log(
        "Appointment Created",
        result
        );
        
        
        onSuccess();
        
        
        
        }
        catch(error){
        
        
        console.log(
        error
        );
        
        
        alert(
        "Unable to book appointment"
        );
        
        
        }
        
        
        };
    
    
    
    return (
    
    <form
    
    className="appointment-form"
    
    onSubmit={submitAppointment}
    
    >
    
    
    <h2>
    Appointment Details
    </h2>
    
    
    
    <label>
    Select Service
    </label>
    
    
    <select
    
    onChange={(e)=>
    updateField(
    "service",
    e.target.value
    )}
    
    >
    
    
    <option>
    Choose Service
    </option>
    
    <option>
    Family Medicine
    </option>
    
    <option>
    Pediatrics
    </option>
    
    <option>
    Women's Health
    </option>
    
    <option>
    Mental Health
    </option>
    
    
    </select>
    
    
    
    <ProviderSelect
    
    value={appointment.provider}
    
    onChange={(value)=>
    updateField(
    "provider",
    value
    )
    }
    
    />
    
    
    
    <DatePicker
    
    value={appointment.date}
    
    onChange={(value)=>
    updateField(
    "date",
    value
    )
    }
    
    />
    
    
    
    <TimeSlots
    
    value={appointment.time}
    
    onChange={(value)=>
    updateField(
    "time",
    value
    )
    }
    
    />
    
    
    
    <h2>
    Patient Information
    </h2>
    
    
    
    <input
    
    placeholder="First Name"
    
    onChange={(e)=>
    updateField(
    "firstName",
    e.target.value
    )
    }
    
    />
    
    
    
    <input
    
    placeholder="Last Name"
    
    onChange={(e)=>
    updateField(
    "lastName",
    e.target.value
    )
    }
    
    />
    
    
    
    <input
    
    placeholder="Date of Birth"
    
    type="date"
    
    onChange={(e)=>
    updateField(
    "dob",
    e.target.value
    )
    }
    
    />
    
    
    
    <input
    
    placeholder="Phone"
    
    onChange={(e)=>
    updateField(
    "phone",
    e.target.value
    )
    }
    
    />
    
    
    
    <input
    
    placeholder="Email"
    
    type="email"
    
    onChange={(e)=>
    updateField(
    "email",
    e.target.value
    )
    }
    
    />
    
    
    
    <textarea
    
    placeholder="Reason for visit"
    
    onChange={(e)=>
    updateField(
    "reason",
    e.target.value
    )
    }
    
    />
    
    
    
    <Button
    
    type="submit"
    
    >
    
    Confirm Appointment
    
    </Button>
    
    
    
    </form>
    
    )
    
    }