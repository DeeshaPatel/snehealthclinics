import { useEffect, useMemo, useState } from "react";

import {
    getProviders,
    createAppointment
} from "../../api/appointmentApi";

import {
    getClinicHolidays,
    getAppointmentSettings,
    getBusinessHours,
    getAppointmentTypes
} from "../../api/appointmentSettingsApi";

import DatePicker from "./DatePicker";

import "./appointment.css";


// ============================================================
// FALLBACK APPOINTMENT TYPES
// ============================================================

const FALLBACK_APPOINTMENT_TYPES = [
    {
        id: "general-consultation",
        title: "General Consultation",
        description:
            "Primary care and general medical concerns"
    },
    {
        id: "annual-health-check",
        title: "Annual Health Check",
        description:
            "Comprehensive routine health examination"
    },
    {
        id: "follow-up-visit",
        title: "Follow-up Visit",
        description:
            "Follow-up for an existing condition"
    },
    {
        id: "prescription-consultation",
        title: "Prescription Consultation",
        description:
            "Medication and prescription consultation"
    }
];


// ============================================================
// EMPTY BOOKING
// ============================================================

const EMPTY_BOOKING = {
    service: "",
    provider_id: "",
    appointment_date: "",
    start_time: "",
    end_time: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    health_card: "",
    phone: "",
    emergency_contact: "",
    reason: ""
};


// ============================================================
// DAY HELPERS
// ============================================================

const DAY_NUMBERS = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
};


function normalizeDay(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const stringValue =
        String(value)
            .trim()
            .toLowerCase();

    const dayMap = {
        "0": "sunday",
        "1": "monday",
        "2": "tuesday",
        "3": "wednesday",
        "4": "thursday",
        "5": "friday",
        "6": "saturday",

        sun: "sunday",
        sunday: "sunday",

        mon: "monday",
        monday: "monday",

        tue: "tuesday",
        tues: "tuesday",
        tuesday: "tuesday",

        wed: "wednesday",
        wednesday: "wednesday",

        thu: "thursday",
        thur: "thursday",
        thurs: "thursday",
        thursday: "thursday",

        fri: "friday",
        friday: "friday",

        sat: "saturday",
        saturday: "saturday"
    };

    return (
        dayMap[stringValue] ||
        stringValue
    );
}


function getBusinessHourDay(item) {
    if (!item) {
        return "";
    }

    // IMPORTANT:
    // Your database uses day_of_week.
    return (
        item.day_of_week ??
        item.dayOfWeek ??
        item.day ??
        item.day_name ??
        item.dayName ??
        item.weekday ??
        item.weekday_name ??
        item.weekdayName ??
        item.name ??
        ""
    );
}


function getDayName(dateString) {
    if (!dateString) {
        return "";
    }

    const parts =
        dateString
            .split("-")
            .map(Number);

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    if (
        !year ||
        !month ||
        !day
    ) {
        return "";
    }

    // Use local date to prevent timezone shifts.
    const date =
        new Date(
            year,
            month - 1,
            day
        );

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long"
        }
    );
}


// ============================================================
// BUSINESS HOURS
// ============================================================

function getBusinessHoursForDate(
    dateString,
    businessHours
) {
    const dayName =
        normalizeDay(
            getDayName(dateString)
        );

    if (
        !dayName ||
        !Array.isArray(businessHours)
    ) {
        return null;
    }

    return (
        businessHours.find(
            item => {
                const itemDay =
                    normalizeDay(
                        getBusinessHourDay(item)
                    );

                return itemDay === dayName;
            }
        ) || null
    );
}


function isBusinessHoursEnabled(hours) {
    if (!hours) {
        return false;
    }

    const enabledValue =
        hours.enabled ??
        hours.is_open ??
        hours.isOpen ??
        hours.open ??
        hours.active;

    if (
        enabledValue === false ||
        enabledValue === 0 ||
        enabledValue === "false" ||
        String(enabledValue).toLowerCase() === "false"
    ) {
        return false;
    }

    return true;
}


function getOpeningTime(hours) {
    if (!hours) {
        return null;
    }

    return (
        hours.start_time ??
        hours.open_time ??
        hours.start ??
        hours.open ??
        null
    );
}


function getClosingTime(hours) {
    if (!hours) {
        return null;
    }

    return (
        hours.end_time ??
        hours.close_time ??
        hours.end ??
        hours.close ??
        null
    );
}


// ============================================================
// TIME HELPERS
// ============================================================

function timeToMinutes(time) {
    if (!time) {
        return null;
    }

    const value =
        String(time)
            .trim()
            .toLowerCase();

    // 9:00 AM
    const amPmMatch =
        value.match(
            /^(\d{1,2}):(\d{2})\s*(am|pm)$/
        );

    if (amPmMatch) {
        let hours =
            Number(amPmMatch[1]);

        const minutes =
            Number(amPmMatch[2]);

        const period =
            amPmMatch[3];

        if (hours === 12) {
            hours = 0;
        }

        if (period === "pm") {
            hours += 12;
        }

        return (
            hours * 60 +
            minutes
        );
    }

    // 09:00
    // 09:00:00
    const parts =
        value.split(":");

    if (parts.length < 2) {
        return null;
    }

    const hours =
        Number(parts[0]);

    const minutes =
        Number(parts[1]);

    if (
        !Number.isFinite(hours) ||
        !Number.isFinite(minutes)
    ) {
        return null;
    }

    return (
        hours * 60 +
        minutes
    );
}


function minutesToTime(totalMinutes) {
    const hours =
        Math.floor(
            totalMinutes / 60
        );

    const minutes =
        totalMinutes % 60;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0")
    );
}


function formatTime(time) {
    if (!time) {
        return "";
    }

    const parts =
        String(time).split(":");

    const hours =
        Number(parts[0]);

    const minutes =
        Number(parts[1]);

    const date =
        new Date();

    date.setHours(
        hours,
        minutes,
        0,
        0
    );

    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


// ============================================================
// HOLIDAY HELPERS
// ============================================================

function getHolidayDate(holiday) {
    if (!holiday) {
        return "";
    }

    return (
        holiday.holiday_date ??
        holiday.date ??
        holiday.holidayDate ??
        ""
    );
}


function getHolidayName(holiday) {
    if (!holiday) {
        return "Clinic Holiday";
    }

    return (
        holiday.name ??
        holiday.holiday_name ??
        holiday.holidayName ??
        "Clinic Holiday"
    );
}


function isHolidayDate(
    dateString,
    holidays
) {
    if (
        !dateString ||
        !Array.isArray(holidays)
    ) {
        return false;
    }

    return holidays.some(
        holiday =>
            getHolidayDate(
                holiday
            ) === dateString
    );
}


// ============================================================
// APPOINTMENT DURATION
// ============================================================

function getAppointmentDuration(
    settings
) {
    const sources = [];

    const addSource = value => {
        if (!value) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(
                item =>
                    addSource(item)
            );

            return;
        }

        if (
            typeof value === "object"
        ) {
            sources.push(value);
        }
    };

    addSource(settings);
    addSource(settings?.data);
    addSource(settings?.settings);
    addSource(
        settings?.appointment_settings
    );
    addSource(
        settings?.appointmentSettings
    );
    addSource(settings?.rows);

    const keys = [
        "default_duration",
        "default_appointment_duration",
        "appointment_duration",
        "duration",
        "duration_minutes",
        "defaultAppointmentDuration"
    ];

    for (
        const source of sources
    ) {
        for (
            const key of keys
        ) {
            const value =
                source?.[key];

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                continue;
            }

            const parsed =
                Number(value);

            if (
                Number.isFinite(parsed) &&
                parsed > 0
            ) {
                return parsed;
            }
        }
    }

    // Fallback
    return 15;
}


// ============================================================
// TIME SLOT GENERATOR
// ============================================================

function generateTimeSlotsForDate(
    dateString,
    businessHours,
    holidays,
    appointmentDuration
) {
    if (!dateString) {
        return [];
    }

    if (
        isHolidayDate(
            dateString,
            holidays
        )
    ) {
        return [];
    }

    const hours =
        getBusinessHoursForDate(
            dateString,
            businessHours
        );

    if (!hours) {
        return [];
    }

    if (
        !isBusinessHoursEnabled(hours)
    ) {
        return [];
    }

    const openingTime =
        getOpeningTime(hours);

    const closingTime =
        getClosingTime(hours);

    const startMinutes =
        timeToMinutes(
            openingTime
        );

    const endMinutes =
        timeToMinutes(
            closingTime
        );

    if (
        startMinutes === null ||
        endMinutes === null ||
        endMinutes <= startMinutes
    ) {
        return [];
    }

    const duration =
        Number(appointmentDuration);

    if (
        !Number.isFinite(duration) ||
        duration <= 0
    ) {
        return [];
    }

    const slots = [];

    for (
        let current = startMinutes;

        current + duration <= endMinutes;

        current += duration
    ) {
        slots.push({
            start:
                minutesToTime(
                    current
                ),

            end:
                minutesToTime(
                    current + duration
                )
        });
    }

    return slots;
}


// ============================================================
// PROVIDER HELPER
// ============================================================

function getProviderName(
    providers,
    providerId
) {
    const provider =
        providers.find(
            item =>
                String(item.id) ===
                String(providerId)
        );

    if (!provider) {
        return "";
    }

    return `Dr. ${provider.first_name} ${provider.last_name}`;
}


// ============================================================
// APPOINTMENT TYPE HELPERS
// ============================================================

function getAppointmentTypeId(type) {
    if (!type) {
        return "";
    }

    return (
        type.id ??
        type.appointment_type_id ??
        type.appointmentTypeId ??
        type.value ??
        ""
    );
}


function getAppointmentTypeTitle(type) {
    if (!type) {
        return "";
    }

    return (
        type.title ??
        type.name ??
        type.type_name ??
        type.appointment_type ??
        type.appointment_type_name ??
        ""
    );
}


function getAppointmentTypeDescription(
    type
) {
    if (!type) {
        return "";
    }

    return (
        type.description ??
        type.details ??
        ""
    );
}


// ============================================================
// COMPONENT
// ============================================================

export default function BookAppointment() {

    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    const [step, setStep] =
        useState(1);

    const [
        appointmentTypes,
        setAppointmentTypes
    ] = useState([]);

    const [
        providers,
        setProviders
    ] = useState([]);

    const [
        loadingProviders,
        setLoadingProviders
    ] = useState(true);

    const [
        appointmentSettings,
        setAppointmentSettings
    ] = useState(null);

    const [
        businessHours,
        setBusinessHours
    ] = useState([]);

    const [
        holidays,
        setHolidays
    ] = useState([]);

    const [
        booking,
        setBooking
    ] = useState(
        EMPTY_BOOKING
    );

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        confirmation,
        setConfirmation
    ] = useState(null);

    const [
        loadingScheduling,
        setLoadingScheduling
    ] = useState(false);


    // --------------------------------------------------------
    // LOAD INITIAL DATA
    // --------------------------------------------------------

    useEffect(() => {

        const loadData =
            async () => {

                setLoading(true);
                setError("");

                try {

                    const [
                        providersData,
                        settingsData,
                        businessHoursData,
                        holidaysData,
                        appointmentTypesData
                    ] =
                        await Promise.all([
                            getProviders(),
                            getAppointmentSettings(),
                            getBusinessHours(),
                            getClinicHolidays(),
                            getAppointmentTypes()
                        ]);


                    // ----------------------------------------
                    // PROVIDERS
                    // ----------------------------------------

                    const normalizedProviders =
                        Array.isArray(
                            providersData
                        )
                            ? providersData
                            : (
                                providersData?.providers ??
                                providersData?.data ??
                                []
                            );

                    setProviders(
                        normalizedProviders
                    );


                    // ----------------------------------------
                    // APPOINTMENT SETTINGS
                    // ----------------------------------------

                    setAppointmentSettings(
                        settingsData
                    );


                    console.log(
                        "Appointment Settings API response:",
                        settingsData
                    );

                    console.log(
                        "Resolved appointment duration:",
                        getAppointmentDuration(
                            settingsData
                        )
                    );


                    // ----------------------------------------
                    // BUSINESS HOURS
                    // ----------------------------------------

                    const normalizedBusinessHours =
                        Array.isArray(
                            businessHoursData
                        )
                            ? businessHoursData
                            : (
                                businessHoursData?.businessHours ??
                                businessHoursData?.business_hours ??
                                businessHoursData?.data ??
                                []
                            );

                    setBusinessHours(
                        normalizedBusinessHours
                    );


                    // ----------------------------------------
                    // HOLIDAYS
                    // ----------------------------------------

                    const normalizedHolidays =
                        Array.isArray(
                            holidaysData
                        )
                            ? holidaysData
                            : (
                                holidaysData?.holidays ??
                                holidaysData?.data ??
                                []
                            );

                    setHolidays(
                        normalizedHolidays
                    );


                    // ----------------------------------------
                    // APPOINTMENT TYPES
                    // ----------------------------------------

                    let normalizedAppointmentTypes = [];

                    if (
                        Array.isArray(
                            appointmentTypesData
                        )
                    ) {

                        normalizedAppointmentTypes =
                            appointmentTypesData;

                    } else if (
                        Array.isArray(
                            appointmentTypesData?.appointmentTypes
                        )
                    ) {

                        normalizedAppointmentTypes =
                            appointmentTypesData.appointmentTypes;

                    } else if (
                        Array.isArray(
                            appointmentTypesData?.appointment_types
                        )
                    ) {

                        normalizedAppointmentTypes =
                            appointmentTypesData.appointment_types;

                    } else if (
                        Array.isArray(
                            appointmentTypesData?.data
                        )
                    ) {

                        normalizedAppointmentTypes =
                            appointmentTypesData.data;

                    }


                    console.log(
                        "Appointment Types API response:",
                        appointmentTypesData
                    );

                    console.log(
                        "Appointment Types:",
                        normalizedAppointmentTypes
                    );


                    setAppointmentTypes(
                        normalizedAppointmentTypes
                    );


                } catch (err) {

                    console.error(
                        "Failed to load appointment data:",
                        err
                    );

                    setError(
                        "Unable to load appointment information. Please try again."
                    );

                } finally {

                    setLoading(false);
                    setLoadingProviders(false);
                }
            };


        loadData();

    }, []);


    // --------------------------------------------------------
    // APPOINTMENT DURATION
    // --------------------------------------------------------

    const appointmentDuration =
        useMemo(
            () =>
                getAppointmentDuration(
                    appointmentSettings
                ),
            [appointmentSettings]
        );


    // --------------------------------------------------------
    // CLOSED WEEKDAYS
    // --------------------------------------------------------

    const closedWeekdays =
        useMemo(() => {

            if (
                !Array.isArray(
                    businessHours
                )
            ) {
                return [];
            }

            return businessHours
                .filter(
                    hours =>
                        !isBusinessHoursEnabled(
                            hours
                        )
                )
                .map(
                    hours =>
                        DAY_NUMBERS[
                            normalizeDay(
                                getBusinessHourDay(
                                    hours
                                )
                            )
                        ]
                )
                .filter(
                    day =>
                        Number.isInteger(
                            day
                        )
                );

        }, [businessHours]);


    // --------------------------------------------------------
    // AVAILABLE APPOINTMENT TYPES
    // --------------------------------------------------------

    const availableAppointmentTypes =
        useMemo(() => {

            if (
                appointmentTypes.length > 0
            ) {
                return appointmentTypes;
            }

            return FALLBACK_APPOINTMENT_TYPES;

        }, [appointmentTypes]);


    // --------------------------------------------------------
    // AVAILABLE TIME SLOTS
    // --------------------------------------------------------

    const availableTimeSlots =
        useMemo(
            () =>
                generateTimeSlotsForDate(
                    booking.appointment_date,
                    businessHours,
                    holidays,
                    appointmentDuration
                ),
            [
                booking.appointment_date,
                businessHours,
                holidays,
                appointmentDuration
            ]
        );


    // --------------------------------------------------------
    // UPDATE BOOKING
    // --------------------------------------------------------

    const updateBooking = (
        field,
        value
    ) => {

        setBooking(
            previous => ({
                ...previous,
                [field]: value
            })
        );

    };


    // --------------------------------------------------------
    // DATE CHANGE
    // --------------------------------------------------------

    const handleDateChange = (
        date
    ) => {

        setBooking(
            previous => ({
                ...previous,
                appointment_date: date,
                start_time: "",
                end_time: ""
            })
        );

        setError("");
    };


    // --------------------------------------------------------
    // TIME SELECTION
    // --------------------------------------------------------

    const selectTime = (
        start,
        end
    ) => {

        setBooking(
            previous => ({
                ...previous,
                start_time: start,
                end_time: end
            })
        );

        setError("");
    };


    // --------------------------------------------------------
    // CLINIC OPEN CHECK
    // --------------------------------------------------------

    const isClinicOpen = (
        dateString
    ) => {

        if (!dateString) {
            return false;
        }

        if (
            isHolidayDate(
                dateString,
                holidays
            )
        ) {
            return false;
        }

        const hours =
            getBusinessHoursForDate(
                dateString,
                businessHours
            );

        if (!hours) {
            return false;
        }

        if (
            !isBusinessHoursEnabled(
                hours
            )
        ) {
            return false;
        }

        return Boolean(
            getOpeningTime(hours) &&
            getClosingTime(hours)
        );
    };


    // --------------------------------------------------------
    // SELECT APPOINTMENT TYPE
    // --------------------------------------------------------

    const handleAppointmentTypeSelect = (
        type
    ) => {

        const title =
            getAppointmentTypeTitle(
                type
            );

        setBooking(
            previous => ({
                ...previous,
                service: title
            })
        );

        setError("");
    };


    // --------------------------------------------------------
    // NEXT STEP
    // --------------------------------------------------------

    const handleNext = () => {

        setError("");

        // STEP 1
        if (step === 1) {

            if (!booking.service) {

                setError(
                    "Please select an appointment type."
                );

                return;
            }
        }


        // STEP 2
        if (step === 2) {

            if (
                !booking.provider_id
            ) {

                setError(
                    "Please select a provider."
                );

                return;
            }
        }


        // STEP 3
        if (step === 3) {

            if (
                !booking.appointment_date
            ) {

                setError(
                    "Please select a date."
                );

                return;
            }

            if (
                !isClinicOpen(
                    booking.appointment_date
                )
            ) {

                setError(
                    "The clinic is closed on this date."
                );

                return;
            }

            if (
                !booking.start_time ||
                !booking.end_time
            ) {

                setError(
                    "Please select an available time."
                );

                return;
            }

            const selectedSlot =
                availableTimeSlots.find(
                    slot =>
                        slot.start ===
                        booking.start_time
                );

            if (!selectedSlot) {

                setError(
                    "The selected time is no longer available. Please choose another time."
                );

                return;
            }
        }


        setStep(
            previous =>
                Math.min(
                    previous + 1,
                    4
                )
        );

    };


    // --------------------------------------------------------
    // PREVIOUS STEP
    // --------------------------------------------------------

    const handleBack = () => {

        setError("");

        setStep(
            previous =>
                Math.max(
                    previous - 1,
                    1
                )
        );

    };


    // --------------------------------------------------------
    // SUBMIT
    // --------------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        setError("");
    
        // --------------------------------------------
        // VALIDATION
        // --------------------------------------------
    
        if (!booking.service) {
            setError("Please select an appointment type.");
            return;
        }
    
        if (!booking.provider_id) {
            setError("Please select a provider.");
            return;
        }
    
        if (!booking.appointment_date) {
            setError("Please select an appointment date.");
            return;
        }
    
        if (!booking.start_time || !booking.end_time) {
            setError("Please select an appointment time.");
            return;
        }
    
        // --------------------------------------------
        // CREATE PAYLOAD
        // --------------------------------------------
    
        const appointmentData = {
            provider_id: Number(booking.provider_id),
    
            // IMPORTANT:
            // Backend requires "title", not "service"
            title: booking.service,
    
            appointment_date: booking.appointment_date,
    
            start_time: booking.start_time,
    
            end_time: booking.end_time,
    
            first_name: booking.first_name,
    
            last_name: booking.last_name,
    
            date_of_birth:
                booking.date_of_birth || null,
    
            health_card:
                booking.health_card || null,
    
            phone: booking.phone,
    
            emergency_contact:
                booking.emergency_contact || null,
    
            reason:
                booking.reason || null
        };
    
        console.log(
            "Submitting appointment:",
            appointmentData
        );
    
        try {
    
            setLoadingScheduling(true);
    
            const response =
                await createAppointment(
                    appointmentData
                );
    
            console.log(
                "Appointment created:",
                response
            );
    
            setConfirmation(response);
    
        } catch (err) {
    
            console.error(
                "Appointment creation failed:",
                err
            );
    
            console.error(
                "Backend response:",
                err?.response?.data
            );
    
            setError(
                err?.response?.data?.message ||
                "Unable to schedule your appointment. Please try again."
            );
    
        } finally {
    
            setLoadingScheduling(false);
    
        }
    };


    // --------------------------------------------------------
    // TODAY
    // --------------------------------------------------------

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <div className="book-appointment-page">

                <div className="appointment-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading appointment information...
                    </p>

                </div>

            </div>
        );
    }


    // ========================================================
    // CONFIRMATION
    // ========================================================

    if (confirmation) {

        return (
            <div className="book-appointment-page">

                <div className="appointment-confirmation">

                    <div className="confirmation-icon">
                        ✓
                    </div>

                    <h1>
                        Appointment Scheduled
                    </h1>

                    <p>
                        Your appointment has been successfully scheduled.
                    </p>


                    <div className="confirmation-details">

                        <div className="confirmation-row">

                            <span>
                                Appointment Type
                            </span>

                            <strong>
                                {booking.service}
                            </strong>

                        </div>


                        <div className="confirmation-row">

                            <span>
                                Provider
                            </span>

                            <strong>
                                {getProviderName(
                                    providers,
                                    booking.provider_id
                                )}
                            </strong>

                        </div>


                        <div className="confirmation-row">

                            <span>
                                Date
                            </span>

                            <strong>
                                {booking.appointment_date}
                            </strong>

                        </div>


                        <div className="confirmation-row">

                            <span>
                                Time
                            </span>

                            <strong>
                                {formatTime(
                                    booking.start_time
                                )}
                                {" - "}
                                {formatTime(
                                    booking.end_time
                                )}
                            </strong>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => {

                            setConfirmation(null);

                            setBooking(
                                EMPTY_BOOKING
                            );

                            setStep(1);

                        }}
                    >
                        Book Another Appointment
                    </button>

                </div>

            </div>
        );
    }


    // ========================================================
    // MAIN
    // ========================================================

    return (

        <div className="book-appointment-page">

            <div className="book-appointment-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="appointment-page-header">

                    <div>

                        <h1>
                            Book an Appointment
                        </h1>

                        <p>
                            Schedule an appointment with one of our healthcare providers.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    PROGRESS
                ================================================= */}

                <div className="appointment-progress">

                    {[1, 2, 3, 4].map(
                        number => (

                            <div
                                key={number}
                                className={
                                    step >= number
                                        ? "progress-step active"
                                        : "progress-step"
                                }
                            >

                                <div className="progress-number">
                                    {number}
                                </div>

                                <span>

                                    {number === 1 &&
                                        "Appointment Type"}

                                    {number === 2 &&
                                        "Provider"}

                                    {number === 3 &&
                                        "Date & Time"}

                                    {number === 4 &&
                                        "Your Information"}

                                </span>

                            </div>

                        )
                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="appointment-error">

                        {error}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="appointment-form"
                >


                    {/* =================================================
                        STEP 1
                    ================================================= */}

                    {step === 1 && (

                        <div className="appointment-step">

                            <div className="step-header">

                                <h2>
                                    Select Appointment Type
                                </h2>

                                <p>
                                    What type of appointment would you like to schedule?
                                </p>

                            </div>


                            <div className="appointment-type-grid">

                                {availableAppointmentTypes.map(
                                    type => {

                                        const typeId =
                                            getAppointmentTypeId(
                                                type
                                            );

                                        const title =
                                            getAppointmentTypeTitle(
                                                type
                                            );

                                        const description =
                                            getAppointmentTypeDescription(
                                                type
                                            );

                                        const selected =
                                            booking.service ===
                                            title;


                                        return (

                                            <button
                                                type="button"
                                                key={
                                                    typeId ||
                                                    title
                                                }
                                                className={
                                                    selected
                                                        ? "appointment-type-card selected"
                                                        : "appointment-type-card"
                                                }
                                                onClick={() =>
                                                    handleAppointmentTypeSelect(
                                                        type
                                                    )
                                                }
                                            >

                                                <div className="appointment-type-content">

                                                    <h3>
                                                        {title}
                                                    </h3>

                                                    {description && (

                                                        <p>
                                                            {description}
                                                        </p>

                                                    )}

                                                </div>


                                                <div className="appointment-type-radio">

                                                    <span
                                                        className={
                                                            selected
                                                                ? "radio-dot selected"
                                                                : "radio-dot"
                                                        }
                                                    ></span>

                                                </div>

                                            </button>

                                        );

                                    }
                                )}

                            </div>


                            <div className="step-actions">

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        handleNext
                                    }
                                >
                                    Continue
                                </button>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        STEP 2
                    ================================================= */}

                    {step === 2 && (

                        <div className="appointment-step">

                            <div className="step-header">

                                <h2>
                                    Select Provider
                                </h2>

                                <p>
                                    Choose the healthcare provider you would like to see.
                                </p>

                            </div>


                            {loadingProviders ? (

                                <div className="appointment-loading">

                                    <div className="loading-spinner"></div>

                                    <p>
                                        Loading providers...
                                    </p>

                                </div>

                            ) : providers.length === 0 ? (

                                <div className="empty-state">

                                    <p>
                                        No providers are currently available.
                                    </p>

                                </div>

                            ) : (

                                <div className="provider-grid">

                                    {providers.map(
                                        provider => {

                                            const selected =
                                                String(
                                                    booking.provider_id
                                                ) ===
                                                String(
                                                    provider.id
                                                );


                                            return (

                                                <button
                                                    type="button"
                                                    key={
                                                        provider.id
                                                    }
                                                    className={
                                                        selected
                                                            ? "provider-card selected"
                                                            : "provider-card"
                                                    }
                                                    onClick={() =>
                                                        updateBooking(
                                                            "provider_id",
                                                            provider.id
                                                        )
                                                    }
                                                >

                                                    <div className="provider-avatar">

                                                        {provider.first_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                        {provider.last_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>


                                                    <div className="provider-info">

                                                        <h3>
                                                            Dr.{" "}
                                                            {
                                                                provider.first_name
                                                            }{" "}
                                                            {
                                                                provider.last_name
                                                            }
                                                        </h3>

                                                        {provider.specialty && (

                                                            <p>
                                                                {
                                                                    provider.specialty
                                                                }
                                                            </p>

                                                        )}

                                                    </div>


                                                    <div className="appointment-type-radio">

                                                        <span
                                                            className={
                                                                selected
                                                                    ? "radio-dot selected"
                                                                    : "radio-dot"
                                                            }
                                                        ></span>

                                                    </div>

                                                </button>

                                            );

                                        }
                                    )}

                                </div>

                            )}


                            <div className="step-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        handleBack
                                    }
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        handleNext
                                    }
                                >
                                    Continue
                                </button>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        STEP 3
                    ================================================= */}

                    {step === 3 && (

                        <div className="appointment-step">

                            <div className="step-header">

                                <h2>
                                    Select Date & Time
                                </h2>

                                <p>
                                    Choose an available date and appointment time.
                                </p>

                            </div>


                            <div className="date-time-layout">


                                {/* DATE */}

                                <div className="date-section">

                                    <DatePicker
                                        value={
                                            booking.appointment_date
                                        }
                                        onChange={
                                            handleDateChange
                                        }
                                        holidays={
                                            holidays
                                        }
                                        closedWeekdays={
                                            closedWeekdays
                                        }
                                    />

                                </div>


                                {/* TIMES */}

                                <div className="time-section">

                                    <div className="time-section-header">

                                        <h3>
                                            Available Times
                                        </h3>

                                        <span>
                                            Appointment duration:{" "}
                                            <strong>
                                                {
                                                    appointmentDuration
                                                }{" "}
                                                minutes
                                            </strong>
                                        </span>

                                    </div>


                                    {!booking.appointment_date ? (

                                        <div className="time-empty">

                                            <p>
                                                Please select a date to see available times.
                                            </p>

                                        </div>

                                    ) : isHolidayDate(
                                        booking.appointment_date,
                                        holidays
                                    ) ? (

                                        <div className="time-empty">

                                            <p>
                                                This date is a clinic holiday.
                                            </p>

                                            <strong>
                                                {
                                                    getHolidayName(
                                                        holidays.find(
                                                            holiday =>
                                                                getHolidayDate(
                                                                    holiday
                                                                ) ===
                                                                booking.appointment_date
                                                        )
                                                    )
                                                }
                                            </strong>

                                        </div>

                                    ) : !isClinicOpen(
                                        booking.appointment_date
                                    ) ? (

                                        <div className="time-empty">

                                            <p>
                                                The clinic is closed on this date.
                                            </p>

                                        </div>

                                    ) : availableTimeSlots.length === 0 ? (

                                        <div className="time-empty">

                                            <p>
                                                No appointment times are available for this date.
                                            </p>

                                        </div>

                                    ) : (

                                        <div className="time-slot-grid">

                                            {availableTimeSlots.map(
                                                slot => (

                                                    <button
                                                        type="button"
                                                        key={
                                                            slot.start
                                                        }
                                                        className={
                                                            booking.start_time ===
                                                            slot.start
                                                                ? "time-slot selected"
                                                                : "time-slot"
                                                        }
                                                        onClick={() =>
                                                            selectTime(
                                                                slot.start,
                                                                slot.end
                                                            )
                                                        }
                                                    >
                                                        {
                                                            formatTime(
                                                                slot.start
                                                            )
                                                        }
                                                    </button>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>


                            <div className="step-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        handleBack
                                    }
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        handleNext
                                    }
                                >
                                    Continue
                                </button>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        STEP 4
                    ================================================= */}

                    {step === 4 && (

                        <div className="appointment-step">

                            <div className="step-header">

                                <h2>
                                    Your Information
                                </h2>

                                <p>
                                    Please provide your information to complete the appointment.
                                </p>

                            </div>


                            <div className="appointment-summary">

                                <h3>
                                    Appointment Summary
                                </h3>


                                <div className="summary-row">

                                    <span>
                                        Appointment Type
                                    </span>

                                    <strong>
                                        {booking.service}
                                    </strong>

                                </div>


                                <div className="summary-row">

                                    <span>
                                        Provider
                                    </span>

                                    <strong>
                                        {
                                            getProviderName(
                                                providers,
                                                booking.provider_id
                                            )
                                        }
                                    </strong>

                                </div>


                                <div className="summary-row">

                                    <span>
                                        Date
                                    </span>

                                    <strong>
                                        {
                                            booking.appointment_date
                                        }
                                    </strong>

                                </div>


                                <div className="summary-row">

                                    <span>
                                        Time
                                    </span>

                                    <strong>

                                        {
                                            formatTime(
                                                booking.start_time
                                            )
                                        }

                                        {" - "}

                                        {
                                            formatTime(
                                                booking.end_time
                                            )
                                        }

                                    </strong>

                                </div>

                            </div>


                            <div className="form-grid">

                                <div className="form-field">

                                    <label>
                                        First Name *
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            booking.first_name
                                        }
                                        onChange={event =>
                                            updateBooking(
                                                "first_name",
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Last Name *
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            booking.last_name
                                        }
                                        onChange={event =>
                                            updateBooking(
                                                "last_name",
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            booking.date_of_birth
                                        }
                                        max={today}
                                        onChange={event =>
                                            updateBooking(
                                                "date_of_birth",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Health Card Number
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            booking.health_card
                                        }
                                        onChange={event =>
                                            updateBooking(
                                                "health_card",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Phone *
                                    </label>

                                    <input
                                        type="tel"
                                        value={
                                            booking.phone
                                        }
                                        onChange={event =>
                                            updateBooking(
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Emergency Contact
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            booking.emergency_contact
                                        }
                                        onChange={event =>
                                            updateBooking(
                                                "emergency_contact",
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field full-width">

                                    <label>
                                        Reason for Visit
                                    </label>

                                    <textarea
                                        rows="4"
                                        value={
                                            booking.reason
                                        }
                                        onChange={event =>
                                            updateBooking(
                                                "reason",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Please briefly describe the reason for your visit."
                                    />

                                </div>

                            </div>


                            <div className="step-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        handleBack
                                    }
                                >
                                    Back
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        loadingScheduling
                                    }
                                >

                                    {loadingScheduling
                                        ? "Scheduling..."
                                        : "Schedule Appointment"}

                                </button>

                            </div>

                        </div>

                    )}

                </form>

            </div>

        </div>
    );
}