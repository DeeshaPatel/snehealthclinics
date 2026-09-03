import { useEffect, useMemo, useState } from "react";
import {
    MessageCircle,
    X,
    CalendarDays,
    Clock,
    UserRound,
    Stethoscope,
    CheckCircle2,
    ChevronLeft
} from "lucide-react";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

import {
    getProviders,
    createAppointment,
    getAppointments
} from "../../api/appointmentApi";

import {
    getAppointmentSettings
} from "../../api/appointmentSettingsApi";

import "./chatbot.css";


// =====================================================
// HELPERS
// =====================================================

function formatDateForDatabase(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDateDisplay(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric"
        }
    );
}


function getDayName(dateString) {

    const date =
        new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long"
        }
    );
}


function timeToMinutes(time) {

    if (!time) {
        return 0;
    }

    const parts =
        String(time)
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


function isValidDate(dateString) {

    if (!dateString) {
        return false;
    }

    const date =
        new Date(`${dateString}T00:00:00`);

    return !Number.isNaN(
        date.getTime()
    );
}


function isSameDate(a, b) {

    return (
        String(a || "").substring(0, 10) ===
        String(b || "").substring(0, 10)
    );
}


// =====================================================
// COMPONENT
// =====================================================

export default function AppointmentChatbot() {

    const [open, setOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [bookingLoading, setBookingLoading] =
        useState(false);

    const [clinicError, setClinicError] =
        useState("");

    const [providers, setProviders] =
        useState([]);

    const [businessHours, setBusinessHours] =
        useState([]);

    const [clinicHolidays, setClinicHolidays] =
        useState([]);

    const [appointmentTypes, setAppointmentTypes] =
        useState([]);

    const [appointments, setAppointments] =
        useState([]);

    const [appointmentDuration, setAppointmentDuration] =
        useState(30);

    const [step, setStep] =
        useState("initial");

    const [messages, setMessages] =
        useState([
            {
                sender: "bot",
                text:
                    "Hi 👋 Welcome to SNE Health Clinics. How can I help you today?"
            }
        ]);

    const [form, setForm] =
        useState({

            firstName: "",
            lastName: "",
            dob: "",
            phone: "",
            email: "",

            provider: "",
            providerName: "",

            title: "",

            reason: "",

            date: "",
            time: ""

        });


    // =================================================
    // LOAD CLINIC DATA
    // =================================================

    useEffect(() => {

        if (!open) {
            return;
        }

        loadClinicData();

    }, [open]);


    async function loadClinicData() {

        try {

            setLoading(true);
            setClinicError("");

            const [
                clinicData,
                providerData,
                appointmentData
            ] = await Promise.all([

                getAppointmentSettings(),

                getProviders(),

                getAppointments()

            ]);


            console.log(
                "CHATBOT CLINIC DATA:",
                clinicData
            );


            console.log(
                "CHATBOT PROVIDERS:",
                providerData
            );


            console.log(
                "CHATBOT APPOINTMENTS:",
                appointmentData
            );


            // ---------------------------------------------
            // SETTINGS
            // ---------------------------------------------

            setAppointmentDuration(
                Number(
                    clinicData
                        ?.settings
                        ?.default_duration
                ) || 30
            );


            // ---------------------------------------------
            // BUSINESS HOURS
            // ---------------------------------------------

            setBusinessHours(
                clinicData?.businessHours || []
            );


            // ---------------------------------------------
            // HOLIDAYS
            // ---------------------------------------------

            setClinicHolidays(
                clinicData?.holidays || []
            );


            // ---------------------------------------------
            // APPOINTMENT TYPES
            // ---------------------------------------------

            setAppointmentTypes(
                clinicData?.appointmentTypes || []
            );


            // ---------------------------------------------
            // PROVIDERS
            // ---------------------------------------------

            const normalizedProviders =
                Array.isArray(providerData)
                    ? providerData
                    : providerData?.providers || [];

            setProviders(
                normalizedProviders
            );


            // ---------------------------------------------
            // EXISTING APPOINTMENTS
            // ---------------------------------------------

            const normalizedAppointments =
                Array.isArray(appointmentData)
                    ? appointmentData
                    : appointmentData?.appointments || [];

            setAppointments(
                normalizedAppointments
            );


        } catch (error) {

            console.error(
                "Chatbot clinic data error:",
                error
            );

            setClinicError(
                "Unable to load clinic availability. Please try again."
            );

        } finally {

            setLoading(false);

        }

    }


    // =================================================
    // AVAILABLE DATES
    // =================================================

    const availableDates =
        useMemo(() => {

            if (!businessHours.length) {
                return [];
            }

            const holidays =
                clinicHolidays || [];

            const results = [];

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            // Show next 60 days

            for (
                let i = 0;
                i < 60;
                i++
            ) {

                const date =
                    new Date(today);

                date.setDate(
                    today.getDate() + i
                );


                const dateString =
                    formatDateForDatabase(
                        date
                    );


                const dayName =
                    date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long"
                        }
                    );


                const hours =
                    businessHours.find(
                        item =>
                            String(
                                item.day_of_week
                            ).toLowerCase() ===
                            dayName.toLowerCase()
                    );


                // Clinic closed

                if (!hours) {
                    continue;
                }


                const enabled =
                    hours.enabled === true ||
                    hours.enabled === "true" ||
                    hours.enabled === 1 ||
                    hours.enabled === "1";


                if (!enabled) {
                    continue;
                }


                // Holiday

                const holiday =
                    holidays.find(
                        item =>
                            isSameDate(
                                item.holiday_date,
                                dateString
                            )
                    );


                if (holiday) {
                    continue;
                }


                // Check if this day has at least
                // one available time.

                const hasAvailability =
                    getAvailableSlots(
                        dateString
                    ).length > 0;


                if (!hasAvailability) {
                    continue;
                }


                results.push({

                    value: dateString,

                    label:
                        formatDateDisplay(
                            dateString
                        ),

                    dayName

                });

            }


            return results;

        }, [

            businessHours,
            clinicHolidays,
            appointments,
            appointmentDuration

        ]);


    // =================================================
    // GET AVAILABLE SLOTS
    // =================================================

    function getAvailableSlots(dateString) {

        if (!dateString) {
            return [];
        }


        const dayName =
            getDayName(dateString);


        const hours =
            businessHours.find(
                item =>
                    String(
                        item.day_of_week
                    ).toLowerCase() ===
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


            const booked =
                appointments.some(
                    appointment => {

                        const existingDate =
                            appointment
                                ?.appointment_date
                                ?.toString()
                                .substring(0, 10);


                        if (
                            existingDate !==
                            dateString
                        ) {
                            return false;
                        }


                        const existingStart =
                            timeToMinutes(
                                appointment.start_time
                            );


                        let existingEnd =
                            timeToMinutes(
                                appointment.end_time
                            );


                        // If backend does not provide
                        // end_time, calculate it.

                        if (
                            !existingEnd &&
                            appointment.start_time
                        ) {

                            existingEnd =
                                existingStart +
                                duration;

                        }


                        return (
                            slotStart <
                            existingEnd &&
                            slotEnd >
                            existingStart
                        );

                    }
                );


            if (!booked) {

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

    }


    // =================================================
    // INITIAL OPTION
    // =================================================

    function handleOption(option) {

        setMessages(prev => [

            ...prev,

            {
                sender: "user",
                text: option.label
            }

        ]);


        // ---------------------------------------------
        // APPOINTMENT
        // ---------------------------------------------

        if (
            option.value ===
            "appointment"
        ) {

            setStep(
                "firstName"
            );


            setMessages(prev => [

                ...prev,

                {
                    sender: "bot",
                    text:
                        "Great! I can help you schedule an appointment. What is your first name?"
                }

            ]);

            return;
        }


        // ---------------------------------------------
        // CONTACT
        // ---------------------------------------------

        if (
            option.value ===
            "contact"
        ) {

            setMessages(prev => [

                ...prev,

                {
                    sender: "bot",
                    text:
                        "📞 Phone: (289) 316-3141\n📠 Fax: (289) 316-3143\n✉ Email: contact@snehealthclinics.ca\n📍 15-247 Centennial Pkwy N, Hamilton, Ontario"
                }

            ]);

            return;
        }


        // ---------------------------------------------
        // HOURS
        // ---------------------------------------------

        if (
            option.value ===
            "hours"
        ) {

            const text =
                buildBusinessHoursMessage();


            setMessages(prev => [

                ...prev,

                {
                    sender: "bot",
                    text
                }

            ]);

        }

    }


    // =================================================
    // BUSINESS HOURS MESSAGE
    // =================================================

    function buildBusinessHoursMessage() {

        if (!businessHours.length) {

            return (
                "🕒 Clinic hours are currently unavailable."
            );

        }


        const lines =
            businessHours.map(day => {

                const enabled =
                    day.enabled === true ||
                    day.enabled === "true" ||
                    day.enabled === 1 ||
                    day.enabled === "1";


                if (!enabled) {

                    return `${day.day_of_week}: Closed`;

                }


                return (
                    `${day.day_of_week}: ` +
                    `${formatTime(day.start_time)} - ` +
                    `${formatTime(day.end_time)}`
                );

            });


        return (
            "🕒 Clinic Hours\n\n" +
            lines.join("\n")
        );

    }


    // =================================================
    // HANDLE TEXT ANSWERS
    // =================================================

    function handleSend(value) {

        const cleanValue =
            value.trim();


        if (!cleanValue) {
            return;
        }


        if (
            step === "firstName"
        ) {

            if (
                !/^[A-Za-z\s'-]+$/.test(
                    cleanValue
                )
            ) {

                addBotMessage(
                    "Please enter a valid first name."
                );

                return;
            }


            updateForm(
                "firstName",
                cleanValue
            );


            addUserMessage(
                cleanValue
            );


            setStep(
                "lastName"
            );


            addBotMessage(
                "Thanks! What is your last name?"
            );

            return;
        }


        if (
            step === "lastName"
        ) {

            if (
                !/^[A-Za-z\s'-]+$/.test(
                    cleanValue
                )
            ) {

                addBotMessage(
                    "Please enter a valid last name."
                );

                return;
            }


            updateForm(
                "lastName",
                cleanValue
            );


            addUserMessage(
                cleanValue
            );


            setStep(
                "dob"
            );


            addBotMessage(
                "What is your date of birth? Please use MM/DD/YYYY."
            );

            return;
        }


        if (
            step === "dob"
        ) {

            if (
                !isValidDOB(
                    cleanValue
                )
            ) {

                addBotMessage(
                    "Please enter a valid date of birth using MM/DD/YYYY."
                );

                return;
            }


            updateForm(
                "dob",
                cleanValue
            );


            addUserMessage(
                cleanValue
            );


            setStep(
                "phone"
            );


            addBotMessage(
                "What is your phone number?"
            );

            return;
        }


        if (
            step === "phone"
        ) {

            if (
                !/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(
                    cleanValue
                )
            ) {

                addBotMessage(
                    "Please enter a valid phone number."
                );

                return;
            }


            updateForm(
                "phone",
                cleanValue
            );


            addUserMessage(
                cleanValue
            );


            setStep(
                "email"
            );


            addBotMessage(
                "What is your email address?"
            );

            return;
        }


        if (
            step === "email"
        ) {

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    cleanValue
                )
            ) {

                addBotMessage(
                    "Please enter a valid email address."
                );

                return;
            }


            updateForm(
                "email",
                cleanValue
            );


            addUserMessage(
                cleanValue
            );


            setStep(
                "provider"
            );


            addBotMessage(
                "Which provider would you like to see?"
            );

            return;
        }


        if (
            step === "reason"
        ) {

            updateForm(
                "reason",
                cleanValue
            );


            addUserMessage(
                cleanValue
            );


            setStep(
                "date"
            );


            addBotMessage(
                "Thanks. Now choose an available appointment date below."
            );

            return;
        }

    }


    // =================================================
    // PROVIDER SELECTION
    // =================================================

    function handleProviderSelect(
        provider
    ) {

        const providerId =
            provider.id ||
            provider.provider_id;


        const providerName =
            provider.name ||
            provider.provider_name ||
            `${provider.first_name || ""} ${provider.last_name || ""}`.trim();


        setForm(prev => ({

            ...prev,

            provider:
                providerId,

            providerName

        }));


        addUserMessage(
            providerName
        );


        setStep(
            "title"
        );


        addBotMessage(
            "What type of appointment would you like?"
        );

    }


    // =================================================
    // TITLE / APPOINTMENT TYPE
    // =================================================

    function handleTitleSelect(
        type
    ) {

        const title =
            type.name ||
            type.title ||
            type.label ||
            type;


        setForm(prev => ({

            ...prev,

            title

        }));


        addUserMessage(
            title
        );


        setStep(
            "reason"
        );


        addBotMessage(
            "What is the reason for your visit?"
        );

    }


    // =================================================
    // DATE SELECTION
    // =================================================

    function handleDateSelect(
        date
    ) {

        setForm(prev => ({

            ...prev,

            date,

            time: ""

        }));


        addUserMessage(
            formatDateDisplay(date)
        );


        const slots =
            getAvailableSlots(
                date
            );


        if (!slots.length) {

            setStep(
                "date"
            );


            addBotMessage(
                "Sorry, there are no available appointment times on that date. Please choose another date."
            );

            return;
        }


        setStep(
            "time"
        );


        addBotMessage(
            "Great! Now choose an available time below."
        );

    }


    // =================================================
    // TIME SELECTION
    // =================================================

    function handleTimeSelect(
        time
    ) {

        setForm(prev => ({

            ...prev,

            time

        }));


        addUserMessage(
            formatTime(time)
        );


        setStep(
            "confirm"
        );


        setTimeout(() => {

            addBotMessage(
                "Please review your appointment details below and confirm."
            );

        }, 200);

    }


    // =================================================
    // CONFIRM APPOINTMENT
    // =================================================

    async function handleConfirm() {

        if (
            !form.provider ||
            !form.title ||
            !form.date ||
            !form.time
        ) {

            addBotMessage(
                "Provider, appointment type, date and time are required."
            );

            return;

        }


        try {

            setBookingLoading(
                true
            );


            // ---------------------------------------------
            // Calculate end time
            // ---------------------------------------------

            const startMinutes =
                timeToMinutes(
                    form.time
                );


            const endMinutes =
                startMinutes +
                Number(
                    appointmentDuration
                );


            const endTime =
                minutesToTime(
                    endMinutes
                );


            // ---------------------------------------------
            // FINAL PAYLOAD
            // ---------------------------------------------

            const appointmentData = {

                provider_id:
                    form.provider,

                title:
                    form.title,

                appointment_date:
                    form.date,

                start_time:
                    form.time,

                end_time:
                    endTime,

                first_name:
                    form.firstName,

                last_name:
                    form.lastName,

                dob:
                    form.dob,

                phone:
                    form.phone,

                email:
                    form.email,

                reason:
                    form.reason

            };


            console.log(
                "CREATING CHATBOT APPOINTMENT:",
                appointmentData
            );


            await createAppointment(
                appointmentData
            );


            setStep(
                "success"
            );


            addBotMessage(
                "✅ Your appointment request has been successfully submitted! Our team will contact you if any additional information is needed."
            );


        } catch (error) {

            console.error(
                "Chatbot appointment creation error:",
                error
            );


            const backendMessage =
                error
                    ?.response
                    ?.data
                    ?.message;


            addBotMessage(
                backendMessage ||
                "Sorry, I could not create the appointment. Please try again."
            );

        } finally {

            setBookingLoading(
                false
            );

        }

    }


    // =================================================
    // START OVER
    // =================================================

    function restartChat() {

        setStep(
            "initial"
        );


        setForm({

            firstName: "",
            lastName: "",
            dob: "",
            phone: "",
            email: "",

            provider: "",
            providerName: "",

            title: "",

            reason: "",

            date: "",
            time: ""

        });


        setMessages([

            {
                sender: "bot",
                text:
                    "Hi 👋 Welcome to SNE Health Clinics. How can I help you today?"
            }

        ]);

    }


    // =================================================
    // MESSAGE HELPERS
    // =================================================

    function addUserMessage(
        text
    ) {

        setMessages(prev => [

            ...prev,

            {
                sender: "user",
                text
            }

        ]);

    }


    function addBotMessage(
        text
    ) {

        setMessages(prev => [

            ...prev,

            {
                sender: "bot",
                text
            }

        ]);

    }


    function updateForm(
        key,
        value
    ) {

        setForm(prev => ({

            ...prev,

            [key]: value

        }));

    }


    // =================================================
    // DOB VALIDATION
    // =================================================

    function isValidDOB(
        value
    ) {

        const match =
            value.match(
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
            );


        if (!match) {
            return false;
        }


        const month =
            Number(match[1]);

        const day =
            Number(match[2]);

        const year =
            Number(match[3]);


        const date =
            new Date(
                year,
                month - 1,
                day
            );


        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {

            return false;

        }


        return (
            date < new Date()
        );

    }


    // =================================================
    // AVAILABLE TIME DATA
    // =================================================

    const selectedTimeSlots =
        form.date
            ? getAvailableSlots(
                form.date
            )
            : [];


    // =================================================
    // RENDER
    // =================================================

    return (

        <>

            {/* =========================================
                CHAT BUTTON
            ========================================== */}

            <button

                className="chat-button"

                onClick={() =>
                    setOpen(
                        !open
                    )
                }

                aria-label="Open health assistant"

            >

                {open ? (
                    <X size={26} />
                ) : (
                    <MessageCircle
                        size={26}
                    />
                )}

            </button>


            {/* =========================================
                CHAT WINDOW
            ========================================== */}

            {open && (

                <div className="chat-window">


                    {/* HEADER */}

                    <div className="chat-header">

                        <div className="chat-header-info">

                            <div className="chat-header-icon">

                                <Stethoscope
                                    size={20}
                                />

                            </div>


                            <div>

                                <div className="chat-header-title">

                                    SNE Health Assistant

                                </div>

                                <div className="chat-header-status">

                                    <span />

                                    Online

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* BODY */}

                    <div className="chat-body">


                        {clinicError && (

                            <div className="chat-error">

                                {clinicError}

                            </div>

                        )}


                        {loading && (

                            <div className="chat-loading">

                                Loading clinic availability...

                            </div>

                        )}


                        {/* MESSAGES */}

                        {messages.map(
                            (msg, index) => (

                                <ChatMessage

                                    key={index}

                                    message={msg}

                                />

                            )
                        )}


                        {/* =================================
                            INITIAL OPTIONS
                        ================================= */}

                        {step === "initial" && (

                            <div className="chat-options">

                                <button
                                    onClick={() =>
                                        handleOption({
                                            label:
                                                "📅 Book an Appointment",
                                            value:
                                                "appointment"
                                        })
                                    }
                                >

                                    📅 Book an Appointment

                                </button>


                                <button
                                    onClick={() =>
                                        handleOption({
                                            label:
                                                "📞 Contact Information",
                                            value:
                                                "contact"
                                        })
                                    }
                                >

                                    📞 Contact Information

                                </button>


                                <button
                                    onClick={() =>
                                        handleOption({
                                            label:
                                                "🕒 Clinic Hours",
                                            value:
                                                "hours"
                                        })
                                    }
                                >

                                    🕒 Clinic Hours

                                </button>

                            </div>

                        )}


                        {/* =================================
                            PROVIDERS
                        ================================= */}

                        {step === "provider" && (

                            <div className="chat-selection-section">

                                <div className="chat-selection-title">

                                    <UserRound
                                        size={17}
                                    />

                                    <span>
                                        Available Providers
                                    </span>

                                </div>


                                <div className="chat-provider-grid">

                                    {providers.length === 0 ? (

                                        <div className="chat-empty">

                                            No providers are currently available.

                                        </div>

                                    ) : (

                                        providers.map(
                                            provider => {

                                                const id =
                                                    provider.id ||
                                                    provider.provider_id;

                                                const name =
                                                    provider.name ||
                                                    provider.provider_name ||
                                                    `${provider.first_name || ""} ${provider.last_name || ""}`.trim();

                                                return (

                                                    <button

                                                        key={id}

                                                        type="button"

                                                        className="chat-provider-button"

                                                        onClick={() =>
                                                            handleProviderSelect(
                                                                provider
                                                            )
                                                        }

                                                    >

                                                        <UserRound
                                                            size={18}
                                                        />

                                                        <span>
                                                            {name}
                                                        </span>

                                                    </button>

                                                );

                                            }
                                        )

                                    )}

                                </div>

                            </div>

                        )}


                        {/* =================================
                            APPOINTMENT TYPES
                        ================================= */}

                        {step === "title" && (

                            <div className="chat-selection-section">

                                <div className="chat-selection-title">

                                    <Stethoscope
                                        size={17}
                                    />

                                    <span>
                                        Appointment Type
                                    </span>

                                </div>


                                <div className="chat-type-grid">

                                    {appointmentTypes.length === 0 ? (

                                        <div className="chat-empty">

                                            No appointment types are currently available.

                                        </div>

                                    ) : (

                                        appointmentTypes.map(
                                            type => {

                                                const id =
                                                    type.id ||
                                                    type.name;

                                                return (

                                                    <button

                                                        key={id}

                                                        type="button"

                                                        className="chat-type-button"

                                                        onClick={() =>
                                                            handleTitleSelect(
                                                                type
                                                            )
                                                        }

                                                    >

                                                        {type.name ||
                                                            type.title ||
                                                            type.label}

                                                    </button>

                                                );

                                            }
                                        )

                                    )}

                                </div>

                            </div>

                        )}


                        {/* =================================
                            AVAILABLE DATES
                        ================================= */}

                        {step === "date" && (

                            <div className="chat-selection-section">

                                <div className="chat-selection-title">

                                    <CalendarDays
                                        size={17}
                                    />

                                    <span>
                                        Available Dates
                                    </span>

                                </div>


                                {availableDates.length === 0 ? (

                                    <div className="chat-empty">

                                        No appointments are currently available.

                                    </div>

                                ) : (

                                    <div className="chat-date-grid">

                                        {availableDates.map(
                                            date => (

                                                <button

                                                    key={
                                                        date.value
                                                    }

                                                    type="button"

                                                    className={
                                                        form.date ===
                                                        date.value
                                                            ? "chat-date-button selected"
                                                            : "chat-date-button"
                                                    }

                                                    onClick={() =>
                                                        handleDateSelect(
                                                            date.value
                                                        )
                                                    }

                                                >

                                                    <span className="chat-date-weekday">

                                                        {date.dayName.substring(
                                                            0,
                                                            3
                                                        )}

                                                    </span>

                                                    <span className="chat-date-value">

                                                        {new Date(
                                                            `${date.value}T00:00:00`
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month:
                                                                    "short",
                                                                day:
                                                                    "numeric"
                                                            }
                                                        )}

                                                    </span>

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}


                        {/* =================================
                            AVAILABLE TIMES
                        ================================= */}

                        {step === "time" && (

                            <div className="chat-selection-section">

                                <div className="chat-selection-title">

                                    <Clock
                                        size={17}
                                    />

                                    <span>
                                        Available Times
                                    </span>

                                </div>


                                {selectedTimeSlots.length === 0 ? (

                                    <div className="chat-empty">

                                        No appointment times are available for this date.

                                    </div>

                                ) : (

                                    <div className="chat-time-grid">

                                        {selectedTimeSlots.map(
                                            slot => (

                                                <button

                                                    key={
                                                        slot.value
                                                    }

                                                    type="button"

                                                    className={
                                                        form.time ===
                                                        slot.value
                                                            ? "chat-time-button selected"
                                                            : "chat-time-button"
                                                    }

                                                    onClick={() =>
                                                        handleTimeSelect(
                                                            slot.value
                                                        )
                                                    }

                                                >

                                                    {slot.label}

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                        )}


                        {/* =================================
                            CONFIRMATION
                        ================================= */}

                        {step === "confirm" && (

                            <div className="chat-confirmation">

                                <div className="chat-confirmation-title">

                                    <CheckCircle2
                                        size={18}
                                    />

                                    Confirm Appointment

                                </div>


                                <div className="chat-confirmation-card">

                                    <div>

                                        <strong>
                                            Patient
                                        </strong>

                                        <span>
                                            {form.firstName}{" "}
                                            {form.lastName}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Provider
                                        </strong>

                                        <span>
                                            {form.providerName}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Appointment
                                        </strong>

                                        <span>
                                            {form.title}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Date
                                        </strong>

                                        <span>
                                            {formatDateDisplay(
                                                form.date
                                            )}
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            Time
                                        </strong>

                                        <span>
                                            {formatTime(
                                                form.time
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div className="chat-confirmation-actions">

                                    <button

                                        type="button"

                                        className="chat-confirm-button"

                                        disabled={
                                            bookingLoading
                                        }

                                        onClick={
                                            handleConfirm
                                        }

                                    >

                                        {bookingLoading
                                            ? "Booking..."
                                            : "Confirm Appointment"}

                                    </button>


                                    <button

                                        type="button"

                                        className="chat-back-button"

                                        disabled={
                                            bookingLoading
                                        }

                                        onClick={() =>
                                            setStep(
                                                "time"
                                            )
                                        }

                                    >

                                        <ChevronLeft
                                            size={16}
                                        />

                                        Change Time

                                    </button>

                                </div>

                            </div>

                        )}


                        {/* =================================
                            SUCCESS
                        ================================= */}

                        {step === "success" && (

                            <div className="chat-success">

                                <CheckCircle2
                                    size={42}
                                />

                                <h3>
                                    Appointment Request Submitted
                                </h3>

                                <p>
                                    Thank you, {form.firstName}.
                                    Your appointment request has been
                                    submitted successfully.
                                </p>


                                <button
                                    type="button"
                                    onClick={
                                        restartChat
                                    }
                                >

                                    Book Another Appointment

                                </button>

                            </div>

                        )}

                    </div>


                    {/* =====================================
                        INPUT
                    ====================================== */}

                    {(
                        step === "firstName" ||
                        step === "lastName" ||
                        step === "dob" ||
                        step === "phone" ||
                        step === "email" ||
                        step === "reason"
                    ) && (

                        <ChatInput

                            onSend={
                                handleSend
                            }

                        />

                    )}

                </div>

            )}

        </>

    );

}