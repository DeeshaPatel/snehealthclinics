import { useEffect, useState } from "react";

import CalendarHeader from "./CalendarHeader";
import TimeGrid from "./TimeGrid";

import { getAppointments } from "../../api/appointmentApi";


export default function Appointment(){


const [appointments,setAppointments] = useState([]);

const [currentWeek,setCurrentWeek] =
useState(new Date());



useEffect(()=>{

    fetchAppointments();

},[currentWeek]);



const fetchAppointments = async()=>{

    try{

        const data = await getAppointments();

        setAppointments(data);

    }
    catch(error){

        console.error(
          "Failed loading appointments",
          error
        );

    }

};



const previousWeek = ()=>{

    const date = new Date(currentWeek);

    date.setDate(
        date.getDate()-7
    );

    setCurrentWeek(date);

};



const nextWeek = ()=>{

    const date = new Date(currentWeek);

    date.setDate(
        date.getDate()+7
    );

    setCurrentWeek(date);

};



return (

<div className="appointments-page">


<CalendarHeader

    currentWeek={currentWeek}

    previousWeek={previousWeek}

    nextWeek={nextWeek}

/>


<TimeGrid

    appointments={appointments}

    currentWeek={currentWeek}

/>


</div>

)

}