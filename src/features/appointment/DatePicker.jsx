import { DayPicker } from "react-day-picker";
import { useMemo } from "react";

import "react-day-picker/dist/style.css";


export default function DatePicker({

    value,

    onChange,

    holidays = [],

    disabledDates = [],

    closedWeekdays = []

}) {


    /* =================================================
       SELECTED DATE
    ================================================= */

    const selectedDate = value
        ? new Date(`${value}T00:00:00`)
        : undefined;


    /* =================================================
       TODAY
    ================================================= */

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    /* =================================================
       HOLIDAY DATES
    ================================================= */

    const holidayDates = useMemo(() => {

        return holidays
            .map(holiday => {

                const rawDate =
                    holiday.holiday_date ??
                    holiday.date ??
                    holiday.holidayDate;

                if (!rawDate) {
                    return null;
                }

                return new Date(
                    `${String(rawDate).substring(0, 10)}T00:00:00`
                );

            })
            .filter(Boolean);

    }, [holidays]);


    /* =================================================
       DISABLED DAYS
    ================================================= */

    const disabled = [

        /* Past dates */

        {
            before: today
        },


        /* Clinic closed weekdays */

        ...(closedWeekdays.length > 0
            ? [
                {
                    dayOfWeek:
                        closedWeekdays
                }
            ]
            : []),


        /* Explicit disabled dates */

        ...disabledDates,


        /* Holidays */

        ...holidayDates

    ];


    /* =================================================
       RENDER
    ================================================= */

    return (

        <div className="appointment-date-picker">

            <label>
                Appointment Date
            </label>


            <DayPicker

                mode="single"

                selected={selectedDate}


                onSelect={(date) => {

                    if (!date) {
                        return;
                    }


                    const year =
                        date.getFullYear();

                    const month =
                        String(
                            date.getMonth() + 1
                        ).padStart(2, "0");

                    const day =
                        String(
                            date.getDate()
                        ).padStart(2, "0");


                    onChange(
                        `${year}-${month}-${day}`
                    );

                }}


                disabled={disabled}


                modifiers={{

                    holiday:
                        holidayDates

                }}


                modifiersClassNames={{

                    holiday:
                        "holiday-date"

                }}

            />

        </div>

    );

}