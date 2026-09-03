import { useMemo } from "react";
import { Clock } from "lucide-react";


function timeToMinutes(time) {

    if (!time) {
        return 0;
    }

    const parts =
        time
            .toString()
            .substring(0, 5)
            .split(":");

    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}


function minutesToTime(minutes) {

    const hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;

    return (
        `${String(hours).padStart(2, "0")}:` +
        `${String(mins).padStart(2, "0")}`
    );

}


function formatTime(time) {

    const minutes =
        timeToMinutes(time);

    let hours =
        Math.floor(minutes / 60);

    const mins =
        minutes % 60;

    const period =
        hours >= 12
            ? "PM"
            : "AM";

    hours =
        hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return (
        `${hours}:${String(mins).padStart(2, "0")} ${period}`
    );

}


function getDayName(date) {

    const selectedDate =
        new Date(`${date}T00:00:00`);

    if (
        Number.isNaN(
            selectedDate.getTime()
        )
    ) {
        return null;
    }

    return selectedDate.toLocaleDateString(
        "en-US",
        {
            weekday: "long"
        }
    );

}


export default function TimeSelector({

    date,
    businessHours,
    appointmentDuration,
    appointments = [],
    value,
    onChange

}) {

    const availableSlots = useMemo(() => {

        if (!date) {
            return [];
        }


        const dayName =
            getDayName(date);


        if (!dayName) {
            return [];
        }


        const hours =
            businessHours?.find(
                item =>
                    item.day_of_week
                        ?.toString()
                        .toLowerCase() ===
                    dayName.toLowerCase()
            );


        if (!hours) {
            return [];
        }


        const enabled =
            hours.enabled === true ||
            hours.enabled === "true" ||
            hours.enabled === 1 ||
            hours.enabled === "1";


        if (!enabled) {
            return [];
        }


        if (
            !hours.start_time ||
            !hours.end_time
        ) {
            return [];
        }


        const start =
            timeToMinutes(
                hours.start_time
            );


        const end =
            timeToMinutes(
                hours.end_time
            );


        const duration =
            Number(
                appointmentDuration
            ) || 30;


        const slots = [];


        for (
            let current = start;

            current + duration <= end;

            current += duration
        ) {

            const slotStart =
                current;

            const slotEnd =
                current + duration;


            const isBooked =
                appointments.some(
                    appointment => {

                        const appointmentDate =
                            appointment
                                ?.appointment_date
                                ?.toString()
                                .substring(0, 10);


                        if (
                            appointmentDate !==
                            date
                        ) {
                            return false;
                        }


                        const existingStart =
                            timeToMinutes(
                                appointment.start_time
                            );


                        const existingEnd =
                            timeToMinutes(
                                appointment.end_time
                            );


                        return (
                            slotStart <
                            existingEnd &&
                            slotEnd >
                            existingStart
                        );

                    }
                );


            if (!isBooked) {

                const time =
                    minutesToTime(
                        current
                    );


                slots.push({

                    value: time,

                    label:
                        formatTime(time)

                });

            }

        }


        return slots;

    }, [

        date,
        businessHours,
        appointmentDuration,
        appointments

    ]);


    if (!date) {

        return (

            <div className="chat-selector-message">

                <Clock size={16} />

                Select a date first.

            </div>

        );

    }


    if (!availableSlots.length) {

        return (

            <div className="chat-selector-message">

                <Clock size={16} />

                No appointment times are available
                for this date.

            </div>

        );

    }


    return (

        <div className="chat-time-selector">

            <div className="chat-selector-heading">

                <Clock size={17} />

                <span>
                    Available Times
                </span>

            </div>


            <div className="chat-time-grid">

                {availableSlots.map(slot => (

                    <button

                        key={slot.value}

                        type="button"

                        className={
                            value === slot.value
                                ? "chat-time-button selected"
                                : "chat-time-button"
                        }

                        onClick={() =>
                            onChange(
                                slot.value
                            )
                        }

                    >

                        {slot.label}

                    </button>

                ))}

            </div>

        </div>

    );

}
