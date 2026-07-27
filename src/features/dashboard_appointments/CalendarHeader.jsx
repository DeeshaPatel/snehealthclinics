import {
    ChevronLeft,
    ChevronRight
    } from "lucide-react";
    
    
    export default function CalendarHeader({
    
    currentWeek,
    previousWeek,
    nextWeek
    
    }){
    
    
    return (
    
    <div className="calendar-toolbar">
    
    
    <button onClick={previousWeek}>
    
    <ChevronLeft/>
    
    </button>
    
    
    
    <h2>
    
    {
    currentWeek.toLocaleDateString(
    "en-US",
    {
    month:"long",
    year:"numeric"
    }
    )
    
    }
    
    </h2>
    
    
    
    <button onClick={nextWeek}>
    
    <ChevronRight/>
    
    </button>
    
    
    </div>
    
    )
    
    }