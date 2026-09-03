import { useMemo } from "react";

import AppointmentCard from "./AppointmentCard";


/* =========================================================
   CONSTANTS
========================================================= */

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const CELL_HEIGHT = 64;


/* =========================================================
   TIME HELPERS
========================================================= */

function timeToMinutes(time) {

    if (!time) {
        return 0;
    }

    const clean =
        String(time).slice(0, 5);

    const [
        hours,
        minutes
    ] =
        clean.split(":").map(Number);

    return (
        (hours || 0) * 60 +
        (minutes || 0)
    );
}


function minutesToTime(minutes) {

    const safe =
        Math.max(
            0,
            Math.min(
                1439,
                Number(minutes) || 0
            )
        );

    const hours =
        Math.floor(
            safe / 60
        );

    const mins =
        safe % 60;

    return (
        `${String(hours).padStart(2, "0")}:` +
        `${String(mins).padStart(2, "0")}`
    );
}


function formatTime(time) {

    if (!time) {
        return "";
    }

    const total =
        timeToMinutes(time);

    const hours =
        Math.floor(total / 60);

    const minutes =
        total % 60;

    const suffix =
        hours >= 12
            ? "PM"
            : "AM";

    const displayHour =
        hours % 12 || 12;

    return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}


function getDateKey(date) {

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

    return `${year}-${month}-${day}`;
}


/* =========================================================
   BUSINESS HOURS
========================================================= */

function isBusinessHourEnabled(hour) {

    return (
        hour?.enabled ??
        hour?.is_open ??
        hour?.isOpen ??
        false
    );
}


/* =========================================================
   TIME GRID
========================================================= */

export default function TimeGrid({

    appointments = [],

    currentWeek,

    businessHours = [],

    defaultDuration = 30,

    onAppointmentClick,

    onTimeSlotClick

}) {

    /* =====================================================
       GRID INTERVAL

       THIS controls the actual calendar rows.
    ===================================================== */

    const gridInterval =
        Number(defaultDuration) > 0
            ? Number(defaultDuration)
            : 30;


    /* =====================================================
       ACTIVE BUSINESS HOURS
    ===================================================== */

    const activeBusinessHours =
        useMemo(() => {

            return businessHours.filter(
                hour =>
                    isBusinessHourEnabled(
                        hour
                    ) &&
                    hour.start_time &&
                    hour.end_time
            );

        }, [businessHours]);


    /* =====================================================
       TIME RANGE
    ===================================================== */

    const timeRange =
        useMemo(() => {

            if (
                activeBusinessHours.length === 0
            ) {

                return {
                    earliest: 9 * 60,
                    latest: 17 * 60
                };

            }

            const starts =
                activeBusinessHours.map(
                    hour =>
                        timeToMinutes(
                            hour.start_time
                        )
                );

            const ends =
                activeBusinessHours.map(
                    hour =>
                        timeToMinutes(
                            hour.end_time
                        )
                );

            return {

                earliest:
                    Math.min(
                        ...starts
                    ),

                latest:
                    Math.max(
                        ...ends
                    )

            };

        }, [activeBusinessHours]);


    /* =====================================================
       TIME SLOTS

       IMPORTANT:

       gridInterval comes from defaultDuration.
    ===================================================== */

    const timeSlots =
        useMemo(() => {

            const slots = [];

            let minutes =
                timeRange.earliest;

            while (
                minutes <
                timeRange.latest
            ) {

                slots.push(
                    minutes
                );

                minutes +=
                    gridInterval;
            }

            return slots;

        }, [
            timeRange,
            gridInterval
        ]);


    /* =====================================================
       WEEK DATES
    ===================================================== */

    const weekDates =
        useMemo(() => {

            return DAYS.map(
                (_, index) => {

                    const date =
                        new Date(
                            currentWeek
                        );

                    date.setDate(
                        currentWeek.getDate() +
                        index
                    );

                    date.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    return date;

                }
            );

        }, [currentWeek]);


    /* =====================================================
       PIXELS PER MINUTE

       Example:

       15 min interval:
       64 / 15 = 4.266 px/min

       30 min interval:
       64 / 30 = 2.133 px/min

       60 min interval:
       64 / 60 = 1.066 px/min
    ===================================================== */

    const pixelsPerMinute =
        CELL_HEIGHT /
        gridInterval;


    /* =====================================================
       CALCULATE APPOINTMENT TOP
    ===================================================== */

    function calculateTop(
        startTime
    ) {

        const start =
            timeToMinutes(
                startTime
            );

        const offset =
            start -
            timeRange.earliest;

        return (
            offset *
            pixelsPerMinute
        );

    }


    /* =====================================================
       CALCULATE APPOINTMENT HEIGHT
    ===================================================== */

    function calculateHeight(
        startTime,
        endTime
    ) {

        const start =
            timeToMinutes(
                startTime
            );

        const end =
            timeToMinutes(
                endTime
            );

        const duration =
            Math.max(
                end - start,
                1
            );

        return (
            duration *
            pixelsPerMinute
        );

    }


    /* =====================================================
       APPOINTMENTS FOR DAY
    ===================================================== */

    function getAppointmentsForDay(
        date
    ) {

        const dateKey =
            getDateKey(date);

        return appointments.filter(
            appointment => {

                if (
                    !appointment?.appointment_date
                ) {
                    return false;
                }

                const appointmentDate =
                    String(
                        appointment.appointment_date
                    ).slice(0, 10);

                return (
                    appointmentDate ===
                    dateKey
                );

            }
        );

    }


    /* =====================================================
       OVERLAP LAYOUT

       If two appointments have the same
       time, they will be placed side-by-side
       instead of covering each other.
    ===================================================== */

    function layoutAppointments(
        dayAppointments
    ) {

        const sorted =
            [...dayAppointments].sort(
                (a, b) =>
                    timeToMinutes(
                        a.start_time
                    ) -
                    timeToMinutes(
                        b.start_time
                    )
            );

        const columns = [];

        const result = [];


        sorted.forEach(
            appointment => {

                const start =
                    timeToMinutes(
                        appointment.start_time
                    );

                const end =
                    timeToMinutes(
                        appointment.end_time
                    );

                let columnIndex =
                    columns.findIndex(
                        columnEnd =>
                            columnEnd <= start
                    );

                if (
                    columnIndex === -1
                ) {

                    columnIndex =
                        columns.length;

                    columns.push(
                        end
                    );

                } else {

                    columns[columnIndex] =
                        end;

                }

                result.push({
                    appointment,
                    columnIndex
                });

            }
        );


        const totalColumns =
            Math.max(
                columns.length,
                1
            );


        return result.map(
            item => ({
                ...item,
                totalColumns
            })
        );

    }


    /* =====================================================
       TOTAL CALENDAR HEIGHT
    ===================================================== */

    const calendarHeight =
        timeSlots.length *
        CELL_HEIGHT;


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="calendar-wrapper">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="calendar-header-row">

                <div className="time-column-header">
                    Time
                </div>


                {weekDates.map(
                    (date, index) => {

                        const today =
                            getDateKey(date) ===
                            getDateKey(
                                new Date()
                            );

                        const hours =
                            businessHours.find(
                                item =>
                                    String(
                                        item.day_of_week
                                    ).toLowerCase() ===
                                    DAYS[index].toLowerCase()
                            );

                        const open =
                            isBusinessHourEnabled(
                                hours
                            );

                        return (

                            <div
                                key={
                                    getDateKey(
                                        date
                                    )
                                }
                                className={
                                    `day-header ${
                                        today
                                            ? "today"
                                            : ""
                                    } ${
                                        !open
                                            ? "closed"
                                            : ""
                                    }`
                                }
                            >

                                <span>
                                    {date.toLocaleDateString(
                                        "en-US",
                                        {
                                            weekday:
                                                "short"
                                        }
                                    )}
                                </span>

                                <strong>
                                    {date.getDate()}
                                </strong>

                            </div>

                        );

                    }
                )}

            </div>


            {/* =================================================
                BODY
            ================================================= */}

            <div className="calendar-body">

                {/* =================================================
                    TIME COLUMN
                ================================================= */}

                <div
                    className="calendar-time-column"
                    style={{
                        height:
                            `${calendarHeight}px`
                    }}
                >

                    {timeSlots.map(
                        minutes => (

                            <div
                                className="calendar-time-slot"
                                style={{
                                    height:
                                        `${CELL_HEIGHT}px`
                                }}
                                key={
                                    minutes
                                }
                            >

                                <span className="time-label">

                                    {formatTime(
                                        minutesToTime(
                                            minutes
                                        )
                                    )}

                                </span>

                            </div>

                        )
                    )}

                </div>


                {/* =================================================
                    DAY COLUMNS
                ================================================= */}

                {weekDates.map(
                    (date, dayIndex) => {

                        const dayAppointments =
                            getAppointmentsForDay(
                                date
                            );

                        const positionedAppointments =
                            layoutAppointments(
                                dayAppointments
                            );

                        const hours =
                            businessHours.find(
                                item =>
                                    String(
                                        item.day_of_week
                                    ).toLowerCase() ===
                                    DAYS[dayIndex].toLowerCase()
                            );

                        const isOpen =
                            isBusinessHourEnabled(
                                hours
                            );


                        return (

                            <div
                                className={
                                    `calendar-day-column ${
                                        !isOpen
                                            ? "closed-day"
                                            : ""
                                    }`
                                }
                                key={
                                    getDateKey(
                                        date
                                    )
                                }
                                style={{
                                    height:
                                        `${calendarHeight}px`
                                }}
                            >

                                {/* =================================
                                    GRID CELLS
                                ================================= */}

                                {timeSlots.map(
                                    minutes => (

                                        <div
                                            className="calendar-cell"
                                            style={{
                                                height:
                                                    `${CELL_HEIGHT}px`
                                            }}
                                            key={
                                                `${dayIndex}-${minutes}`
                                            }
                                            onClick={() => {

                                                if (!isOpen) {
                                                    return;
                                                }

                                                if (onTimeSlotClick) {
                                                    onTimeSlotClick({
                                                        date: getDateKey(date),
                                                        startTime: minutesToTime(minutes),
                                                        endTime: minutesToTime(
                                                            minutes + gridInterval
                                                        )
                                                    });
                                                }

                                             }}
                                        />

                                    )
                                )}


                                {/* =================================
                                    CLOSED OVERLAY
                                ================================= */}

                                {!isOpen && (

                                    <div className="closed-day-overlay">

                                        <span>
                                            Closed
                                        </span>

                                    </div>

                                )}


                                {/* =================================
                                    APPOINTMENTS
                                ================================= */}

                                {positionedAppointments.map(
                                    ({
                                        appointment,
                                        columnIndex,
                                        totalColumns
                                    }) => {

                                        const top =
                                            calculateTop(
                                                appointment.start_time
                                            );

                                        const height =
                                            calculateHeight(
                                                appointment.start_time,
                                                appointment.end_time
                                            );

                                        const gap =
                                            4;

                                        const width =
                                            `calc(${100 / totalColumns}% - ${gap}px)`;

                                        const left =
                                            `calc(${(
                                                columnIndex *
                                                100 /
                                                totalColumns
                                            )}% + 2px)`;


                                        return (

                                            <div
                                                className="appointment-slot"
                                                key={
                                                    appointment.id
                                                }
                                                style={{
                                                    top:
                                                        `${top}px`,
                                                    height:
                                                        `${height}px`,
                                                    width,
                                                    left
                                                }}
                                            >

                                                <AppointmentCard
                                                    appointment={
                                                        appointment
                                                    }
                                                    formatTime={
                                                        formatTime
                                                    }
                                                    onClick={
                                                        onAppointmentClick
                                                    }
                                                />

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );
}