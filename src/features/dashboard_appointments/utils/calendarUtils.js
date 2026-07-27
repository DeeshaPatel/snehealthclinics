export function calculatePosition(time){


    const [hour,minute] =
    time.split(":");
    
    
    const startHour = 8;
    
    
    const pixelsPerHour = 100;
    
    
    return (
    
    (hour-startHour)*pixelsPerHour
    +
    (minute/60)*pixelsPerHour
    
    );
    
    
    }
    
    
    
    export function calculateHeight(
    start,
    end
    ){
    
    
    const [sh,sm]=start.split(":");
    
    const [eh,em]=end.split(":");
    
    
    const minutes =
    
    (
    (eh*60+Number(em))
    -
    (sh*60+Number(sm))
    );
    
    
    
    return minutes * 1.67;
    
    
    }