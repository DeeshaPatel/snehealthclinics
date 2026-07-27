import AppointmentCard from "./AppointmentCard";

import {
calculatePosition,
calculateHeight
}
from "./utils/calendarUtils";



const days=[
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday"
];



export default function TimeGrid({

appointments,
currentWeek

}){


return (

<div className="time-grid">


{
days.map(day=>(

<div className="day-column"
key={day}>


{
appointments
.filter(item=>{

const date =
new Date(item.appointment_date);


return (

date.toLocaleDateString(
"en-US",
{
weekday:"long"
}
)===day

)

})
.map(app=>(


<AppointmentCard

key={app.id}

appointment={app}

top={
calculatePosition(
app.start_time
)
}

height={
calculateHeight(
app.start_time,
app.end_time
)
}


/>


))


}


</div>


))

}


</div>

)

}