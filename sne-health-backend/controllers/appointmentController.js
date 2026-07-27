import {
    createAppointment,
    getAppointments,
    checkAvailability
    }
    from "../models/Appointment.js";
    
    
    import {
    findPatient,
    createPatient
    }
    from "../models/Patient.js";
    
    
    
    export const addAppointment =
    async(req,res)=>{
    
    
    try{
    
    
    const data=req.body;

    const available =
    await checkAvailability(

    data.provider_id,

    data.date,

    data.time

    );



    if(!available){

    return res.status(400).json({

    message:
    "Time slot already booked"

    });

    }

    
    
    
    let patient =
    await findPatient(data.phone);
    
    
    
    if(!patient){
    
    
    patient =
    await createPatient(data);
    
    
    }
    
    
    
    const appointment =
    await createAppointment({
    
    ...data,
    
    patient_id:patient.id
    
    
    });
    
    
    
    res.status(201).json({
    
    message:"Appointment created",
    
    appointment
    
    });
    
    
    }
    catch(error){
    
    
    res.status(500).json({
    
    message:error.message
    
    });
    
    
    }
    
    
    };

    export const fetchAppointments =
async(req,res)=>{


try{


const appointments =
await getAppointments();


res.json(
appointments
);


}
catch(error){


res.status(500).json({

message:error.message

});


}


};
    