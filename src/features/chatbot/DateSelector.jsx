import {isHoliday} from "./holidays";


function validateDate(selectedDate){


const date = new Date(selectedDate);


if(date.getDay()===0 || date.getDay()===6){

return "Weekends are unavailable";

}


if(isHoliday(date)){

return "Clinic is closed on Ontario holidays";

}


return null;

}