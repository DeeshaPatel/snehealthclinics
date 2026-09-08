import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Plus,
    RefreshCw,
    CalendarDays,
    Clock,
    UserRound,
    Stethoscope,
    X
} from "lucide-react";

import {
    getAppointments,
    getProviders,
    createAppointment,
    deleteAppointment,
    updateAppointment
} from "../../api/appointmentApi";

import {
    getAppointmentSettings,
    getBusinessHours
} from "../../api/appointmentSettingsApi";

import TimeGrid from "./TimeGrid";

import "./appointments.css";

import AppointmentModal from "./AppointmentModal";


/* =========================================================
   DEFAULT BUSINESS HOURS
========================================================= */

const DEFAULT_BUSINESS_HOURS = [
    {
        day_of_week: "Monday",
        enabled: true,
        start_time: "09:00",
        end_time: "17:00"
    },
    {
        day_of_week: "Tuesday",
        enabled: true,
        start_time: "09:00",
        end_time: "17:00"
    },
    {
        day_of_week: "Wednesday",
        enabled: true,
        start_time: "09:00",
        end_time: "17:00"
    },
    {
        day_of_week: "Thursday",
        enabled: true,
        start_time: "09:00",
        end_time: "17:00"
    },
    {
        day_of_week: "Friday",
        enabled: true,
        start_time: "09:00",
        end_time: "17:00"
    },
    {
        day_of_week: "Saturday",
        enabled: false,
        start_time: null,
        end_time: null
    },
    {
        day_of_week: "Sunday",
        enabled: false,
        start_time: null,
        end_time: null
    }
];


const EMPTY_APPOINTMENT = {
    patient_id: "",
    patient_first_name: "",
    patient_last_name: "",
    date_of_birth: "",
    health_card: "",
    phone: "",
    emergency_contact: "",
    medications: "",
    medical_history: "",

    provider_id: "",

    appointment_type: "",
    title: "",
    appointment_date: "",
    start_time: "",
    end_time: "",

    reason: "",
    notes: ""
};


/* =========================================================
   HELPERS
========================================================= */

function getMonday(date) {

    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    const day = result.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    result.setDate(
        result.getDate() + difference
    );

    return result;
}


function formatDateKey(date) {

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


function formatDisplayDate(date) {

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric"
        }
    );
}


function formatTime(time) {

    if (!time) {
        return "";
    }

    const cleanTime =
        String(time).slice(0, 5);

    const [
        hourString,
        minuteString
    ] =
        cleanTime.split(":");

    let hour =
        Number(hourString);

    const minute =
        Number(minuteString);

    const suffix =
        hour >= 12
            ? "PM"
            : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${String(minute).padStart(2, "0")} ${suffix}`;
}


/* =========================================================
   APPOINTMENT TYPE HELPERS
========================================================= */

/*
 * Blood Work is treated as a separate resource from
 * regular doctor appointments.
 *
 * Example:
 *
 * Doctor appointment
 *     -> Doctor resource
 *
 * Blood Work
 *     -> RN resource
 */
function isBloodWorkAppointment(appointment) {

    const title =
        appointment?.title ||
        appointment?.appointment_type ||
        "";

    return (
        String(title)
            .trim()
            .toLowerCase() === "blood work"
    );
}


/*
 * Two appointments conflict only when:
 *
 * 1. Same date
 * 2. Same provider/resource
 * 3. Same appointment category
 * 4. Times overlap
 *
 * Blood Work + Doctor appointment
 * does NOT conflict.
 */
function appointmentsOverlap(
    firstStart,
    firstEnd,
    secondStart,
    secondEnd
) {

    if (
        !firstStart ||
        !firstEnd ||
        !secondStart ||
        !secondEnd
    ) {
        return false;
    }

    return (
        firstStart < secondEnd &&
        firstEnd > secondStart
    );
}


/* =========================================================
   NORMALIZE SETTINGS
========================================================= */

function normalizeSettings(response) {

    if (
        response &&
        typeof response === "object"
    ) {

        if (
            response.settings &&
            typeof response.settings === "object"
        ) {
            return response.settings;
        }

        if (
            response.appointmentSettings &&
            typeof response.appointmentSettings === "object"
        ) {
            return response.appointmentSettings;
        }

        if (
            response.data &&
            typeof response.data === "object"
        ) {
            return response.data;
        }

        return response;
    }

    return {};
}


/* =========================================================
   GET APPOINTMENT TITLE FROM SETTINGS
========================================================= */

function getAppointmentTitleFromSettings(settings) {

    const values = [
        settings?.appointment_title,
        settings?.default_title,
        settings?.title,
        settings?.appointmentTitle,
        settings?.defaultAppointmentTitle
    ];

    const validTitle =
        values.find(
            value =>
                typeof value === "string" &&
                value.trim().length > 0
        );

    return validTitle
        ? validTitle.trim()
        : "";
}


/* =========================================================
   GET DEFAULT DURATION
========================================================= */

function getDurationFromSettings(settings) {

    const values = [
        settings?.default_duration,
        settings?.default_appointment_duration,
        settings?.appointment_duration,
        settings?.defaultAppointmentDuration,
        settings?.duration,
        settings?.duration_minutes
    ];

    const validValue =
        values.find(
            value => {

                const number =
                    Number(value);

                return (
                    Number.isFinite(number) &&
                    number > 0
                );
            }
        );

    return Number(validValue) > 0
        ? Number(validValue)
        : 30;
}


/* =========================================================
   NORMALIZE APPOINTMENTS
========================================================= */

function normalizeAppointments(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (
        response &&
        Array.isArray(response.appointments)
    ) {
        return response.appointments;
    }

    if (
        response &&
        Array.isArray(response.data)
    ) {
        return response.data;
    }

    return [];
}


/* =========================================================
   NORMALIZE PROVIDERS
========================================================= */

function normalizeProviders(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (
        response &&
        Array.isArray(response.providers)
    ) {
        return response.providers;
    }

    if (
        response &&
        Array.isArray(response.data)
    ) {
        return response.data;
    }

    return [];
}


/* =========================================================
   NORMALIZE BUSINESS HOURS
========================================================= */

function normalizeBusinessHours(response) {

    if (Array.isArray(response)) {
        return response;
    }

    if (
        response &&
        Array.isArray(response.businessHours)
    ) {
        return response.businessHours;
    }

    if (
        response &&
        Array.isArray(response.business_hours)
    ) {
        return response.business_hours;
    }

    if (
        response &&
        Array.isArray(response.hours)
    ) {
        return response.hours;
    }

    if (
        response &&
        Array.isArray(response.data)
    ) {
        return response.data;
    }

    return [];
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Appointment() {

    /* =====================================================
       STATE
    ===================================================== */

    const [appointments, setAppointments] =
        useState([]);

    const [providers, setProviders] =
        useState([]);

    const [selectedProviderId, setSelectedProviderId] =
        useState("");

    const [appointmentSettings, setAppointmentSettings] =
        useState(null);

    const [businessHours, setBusinessHours] =
        useState(DEFAULT_BUSINESS_HOURS);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [currentWeek, setCurrentWeek] =
        useState(
            getMonday(new Date())
        );

    const [selectedAppointment, setSelectedAppointment] =
        useState(null);

    const [showEditAppointment, setShowEditAppointment] =
        useState(false);

    const [showNotesAppointment, setShowNotesAppointment] =
        useState(false);

    const [editAppointment, setEditAppointment] =
        useState(EMPTY_APPOINTMENT);

    const [appointmentNotes, setAppointmentNotes] =
        useState("");

    const [showNewAppointment, setShowNewAppointment] =
        useState(false);

    const [newAppointment, setNewAppointment] =
        useState(EMPTY_APPOINTMENT);

    const [actionLoading, setActionLoading] =
        useState(false);


    /* =====================================================
       SETTINGS
    ===================================================== */

    const appointmentTitle =
        useMemo(() => {

            return getAppointmentTitleFromSettings(
                appointmentSettings
            );

        }, [appointmentSettings]);


    const defaultDuration =
        useMemo(() => {

            return getDurationFromSettings(
                appointmentSettings
            );

        }, [appointmentSettings]);


    /* =====================================================
       FILTER APPOINTMENTS BY PROVIDER
    ===================================================== */

    const filteredAppointments =
        useMemo(() => {

            if (!selectedProviderId) {
                return appointments;
            }

            return appointments.filter(
                appointment =>
                    String(appointment.provider_id) ===
                    String(selectedProviderId)
            );

        }, [
            appointments,
            selectedProviderId
        ]);


    /* =====================================================
       WEEK DATES
    ===================================================== */

    const weekDates =
        useMemo(() => {

            return Array.from(
                { length: 7 },
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
       WEEK LABEL
    ===================================================== */

    const weekLabel =
        useMemo(() => {

            if (!weekDates.length) {
                return "";
            }

            const first =
                weekDates[0];

            const last =
                weekDates[6];

            return `${formatDisplayDate(first)} – ${last.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            )}`;

        }, [weekDates]);


    /* =====================================================
       LOAD APPOINTMENTS
    ===================================================== */

    const loadAppointments =
        useCallback(
            async () => {

                try {

                    const response =
                        await getAppointments();

                    const data =
                        normalizeAppointments(
                            response
                        );

                    setAppointments(data);

                    return data;

                } catch (err) {

                    console.error(
                        "Appointment loading error:",
                        err
                    );

                    throw err;
                }

            },
            []
        );


    /* =====================================================
       LOAD PROVIDERS
    ===================================================== */

    const loadProviders =
        useCallback(
            async () => {

                try {

                    const response =
                        await getProviders();

                    setProviders(
                        normalizeProviders(
                            response
                        )
                    );

                } catch (err) {

                    console.error(
                        "Provider loading error:",
                        err
                    );

                }

            },
            []
        );


    /* =====================================================
       LOAD SETTINGS
    ===================================================== */

    const loadSettings =
        useCallback(
            async () => {

                try {

                    const response =
                        await getAppointmentSettings();

                    const settings =
                        normalizeSettings(
                            response
                        );

                    setAppointmentSettings(
                        settings
                    );

                } catch (err) {

                    console.error(
                        "Appointment settings loading error:",
                        err
                    );

                    setAppointmentSettings(
                        {}
                    );
                }

            },
            []
        );


    /* =====================================================
       LOAD BUSINESS HOURS
    ===================================================== */

    const loadHours =
        useCallback(
            async () => {

                try {

                    const response =
                        await getBusinessHours();

                    const hours =
                        normalizeBusinessHours(
                            response
                        );

                    setBusinessHours(
                        hours.length
                            ? hours
                            : DEFAULT_BUSINESS_HOURS
                    );

                } catch (err) {

                    console.error(
                        "Business hours loading error:",
                        err
                    );

                    setBusinessHours(
                        DEFAULT_BUSINESS_HOURS
                    );

                }

            },
            []
        );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        let cancelled = false;

        async function load() {

            setLoading(true);
            setError("");

            try {

                const results =
                    await Promise.allSettled([
                        loadAppointments(),
                        loadProviders(),
                        loadSettings(),
                        loadHours()
                    ]);

                if (cancelled) {
                    return;
                }

                const appointmentResult =
                    results[0];

                if (
                    appointmentResult.status ===
                    "rejected"
                ) {

                    setError(
                        "Unable to load appointments. Please check your appointment API."
                    );

                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        }

        load();

        return () => {
            cancelled = true;
        };

    }, [
        loadAppointments,
        loadProviders,
        loadSettings,
        loadHours
    ]);


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh =
        async () => {

            try {

                setRefreshing(true);
                setError("");

                await loadAppointments();

            } catch (err) {

                setError(
                    "Unable to refresh appointments."
                );

            } finally {

                setRefreshing(false);
            }

        };


    /* =====================================================
       CHECK APPOINTMENT AVAILABILITY
       
       IMPORTANT:
       Blood Work and Doctor appointments can overlap.

       Same provider/resource cannot overlap.
    ===================================================== */

    function isAppointmentTimeAvailable({
        appointmentId = null,
        appointmentDate,
        startTime,
        endTime,
        providerId,
        title
    }) {

        if (
            !appointmentDate ||
            !startTime ||
            !endTime ||
            !providerId
        ) {
            return true;
        }

        const bookingIsBloodWork =
            isBloodWorkAppointment({
                title
            });


        const conflict =
            appointments.find(
                appointment => {

                    /*
                     * Do not compare the appointment
                     * against itself during editing.
                     */
                    if (
                        appointmentId &&
                        Number(appointment.id) ===
                        Number(appointmentId)
                    ) {
                        return false;
                    }


                    /*
                     * Different date = no conflict.
                     */
                    const existingDate =
                        String(
                            appointment.appointment_date || ""
                        ).slice(0, 10);

                    const requestedDate =
                        String(
                            appointmentDate
                        ).slice(0, 10);

                    if (
                        existingDate !==
                        requestedDate
                    ) {
                        return false;
                    }


                    /*
                     * Cancelled appointments do not
                     * block the resource.
                     */
                    const status =
                        String(
                            appointment.status || ""
                        )
                            .trim()
                            .toLowerCase();

                    if (
                        status === "cancelled" ||
                        status === "canceled"
                    ) {
                        return false;
                    }


                    /*
                     * Different provider/resource
                     * means there is no conflict.
                     */
                    if (
                        String(
                            appointment.provider_id
                        ) !==
                        String(providerId)
                    ) {
                        return false;
                    }


                    /*
                     * Determine whether existing
                     * appointment is Blood Work.
                     */
                    const existingIsBloodWork =
                        isBloodWorkAppointment(
                            appointment
                        );


                    /*
                     * Blood Work uses the RN resource.
                     *
                     * Regular appointment uses the
                     * doctor resource.
                     *
                     * Therefore Blood Work + Doctor
                     * can happen at the same time.
                     */
                    if (
                        bookingIsBloodWork !==
                        existingIsBloodWork
                    ) {
                        return false;
                    }


                    /*
                     * Same resource and same
                     * appointment category.
                     *
                     * Now check time overlap.
                     */
                    return appointmentsOverlap(
                        startTime,
                        endTime,
                        String(
                            appointment.start_time
                        ).slice(0, 5),
                        String(
                            appointment.end_time
                        ).slice(0, 5)
                    );

                }
            );


        return !conflict;
    }


    /* =====================================================
       CALENDAR TIME SLOT CLICK
    ===================================================== */

    const handleCalendarTimeSlotClick =
        ({
            date,
            startTime,
            endTime
        }) => {

            /*
             * If a provider is selected in the
             * calendar filter, automatically use
             * that provider for the new appointment.
             */
            const providerId =
                selectedProviderId || "";


            setNewAppointment({
                ...EMPTY_APPOINTMENT,

                title:
                    appointmentTitle,

                provider_id:
                    providerId,

                appointment_date:
                    date,

                start_time:
                    startTime,

                end_time:
                    endTime
            });

            setShowNewAppointment(
                true
            );

        };


    /* =====================================================
       WEEK NAVIGATION
    ===================================================== */

    function previousWeek() {

        setCurrentWeek(
            previous => {

                const next =
                    new Date(
                        previous
                    );

                next.setDate(
                    next.getDate() - 7
                );

                return next;
            }
        );
    }


    function nextWeek() {

        setCurrentWeek(
            previous => {

                const next =
                    new Date(
                        previous
                    );

                next.setDate(
                    next.getDate() + 7
                );

                return next;
            }
        );
    }


    function goToToday() {

        setCurrentWeek(
            getMonday(
                new Date()
            )
        );

    }


    /* =====================================================
       APPOINTMENT CLICK
    ===================================================== */

    function handleAppointmentClick(
        appointment
    ) {

        setSelectedAppointment(
            appointment
        );

    }


    /* =====================================================
       CLOSE DETAILS
    ===================================================== */

    function closeDetails() {

        setSelectedAppointment(
            null
        );

    }


    /* =====================================================
       EDIT APPOINTMENT
    ===================================================== */

    function handleEditClick() {

        if (!selectedAppointment) {
            return;
        }

        setEditAppointment({

            patient_id:
                selectedAppointment.patient_id || "",

            patient_first_name:
                selectedAppointment.patient_first_name || "",

            patient_last_name:
                selectedAppointment.patient_last_name || "",

            date_of_birth:
                selectedAppointment.date_of_birth?.slice(0, 10) || "",

            health_card:
                selectedAppointment.health_card || "",

            phone:
                selectedAppointment.phone || "",

            emergency_contact:
                selectedAppointment.emergency_contact || "",

            medications:
                selectedAppointment.medications || "",

            medical_history:
                selectedAppointment.medical_history || "",

            provider_id:
                selectedAppointment.provider_id || "",

            title:
                selectedAppointment.title || "",

            appointment_date:
                selectedAppointment.appointment_date?.slice(0, 10) || "",

            start_time:
                selectedAppointment.start_time?.slice(0, 5) || "",

            end_time:
                selectedAppointment.end_time?.slice(0, 5) || "",

            reason:
                selectedAppointment.reason || "",

            notes:
                selectedAppointment.notes || ""

        });

        setShowEditAppointment(
            true
        );
    }


    /* =====================================================
       NOTES
    ===================================================== */

    function handleNotesClick() {

        if (!selectedAppointment) {
            return;
        }

        setAppointmentNotes(
            selectedAppointment.notes || ""
        );

        setShowNotesAppointment(
            true
        );
    }


    async function handleSaveNotes() {

        if (!selectedAppointment?.id) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");

            const notes =
                appointmentNotes.trim();

            await updateAppointment(
                selectedAppointment.id,
                {
                    notes
                }
            );

            setAppointments(
                previous =>
                    previous.map(
                        appointment =>
                            appointment.id ===
                            selectedAppointment.id
                                ? {
                                    ...appointment,
                                    notes
                                }
                                : appointment
                    )
            );

            setSelectedAppointment(
                previous => ({
                    ...previous,
                    notes
                })
            );

            setShowNotesAppointment(
                false
            );

        } catch (err) {

            console.error(
                "SAVE NOTES ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to save appointment notes."
            );

        } finally {

            setActionLoading(false);

        }

    }


    /* =====================================================
       DELETE APPOINTMENT
    ===================================================== */

    async function handleDeleteAppointment() {

        if (!selectedAppointment?.id) {
            return;
        }

        const patientName =
            `${selectedAppointment.patient_first_name || ""} ${selectedAppointment.patient_last_name || ""}`.trim();

        const confirmed =
            window.confirm(
                `Delete the appointment for ${patientName || "this patient"}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");

            await deleteAppointment(
                selectedAppointment.id
            );

            setAppointments(
                previous =>
                    previous.filter(
                        appointment =>
                            appointment.id !==
                            selectedAppointment.id
                    )
            );

            setSelectedAppointment(
                null
            );

        } catch (err) {

            console.error(
                "Delete appointment error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to delete appointment."
            );

        } finally {

            setActionLoading(false);
        }

    }


    /* =====================================================
       CHECK IN
    ===================================================== */

    async function handleCheckIn() {

        if (!selectedAppointment?.id) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");

            await updateAppointment(
                selectedAppointment.id,
                {
                    status: "Checked-In"
                }
            );

            setAppointments(
                previous =>
                    previous.map(
                        appointment =>
                            appointment.id ===
                            selectedAppointment.id
                                ? {
                                    ...appointment,
                                    status: "Checked-In"
                                }
                                : appointment
                    )
            );

            setSelectedAppointment(
                previous => ({
                    ...previous,
                    status: "Checked-In"
                })
            );

        } catch (err) {

            console.error(
                "Check-in error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to check in patient."
            );

        } finally {

            setActionLoading(false);
        }

    }


    /* =====================================================
       CREATE APPOINTMENT
    ===================================================== */

    async function handleCreateAppointment() {

        try {

            setActionLoading(true);
            setError("");


            /* ---------------------------------------------
               PREPARE DATA
            --------------------------------------------- */

            const appointmentData = {

                patient_id:
                    newAppointment.patient_id || null,

                first_name:
                    newAppointment.patient_first_name?.trim(),

                last_name:
                    newAppointment.patient_last_name?.trim(),

                date_of_birth:
                    newAppointment.date_of_birth || null,

                health_card:
                    newAppointment.health_card?.trim() || "",

                phone:
                    newAppointment.phone?.trim(),

                emergency_contact:
                    newAppointment.emergency_contact?.trim() || "",

                medications:
                    newAppointment.medications?.trim() || "",

                medical_history:
                    newAppointment.medical_history?.trim() || "",

                provider_id:
                    newAppointment.provider_id || null,

                title:
                    newAppointment.title?.trim() || "",

                appointment_date:
                    newAppointment.appointment_date,

                start_time:
                    newAppointment.start_time,

                end_time:
                    newAppointment.end_time,

                reason:
                    newAppointment.reason?.trim() || "",

                notes:
                    newAppointment.notes?.trim() || ""

            };


            console.log(
                "SUBMITTING APPOINTMENT:",
                appointmentData
            );


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!appointmentData.first_name) {

                setError(
                    "Patient first name is required."
                );

                return;
            }


            if (!appointmentData.last_name) {

                setError(
                    "Patient last name is required."
                );

                return;
            }


            if (!appointmentData.phone) {

                setError(
                    "Patient phone is required."
                );

                return;
            }


            if (!appointmentData.provider_id) {

                setError(
                    "Please select a provider."
                );

                return;
            }


            if (!appointmentData.appointment_date) {

                setError(
                    "Appointment date is required."
                );

                return;
            }


            if (!appointmentData.start_time) {

                setError(
                    "Appointment start time is required."
                );

                return;
            }


            if (!appointmentData.end_time) {

                setError(
                    "Appointment end time is required."
                );

                return;
            }


            /* ---------------------------------------------
               CHECK PROVIDER/RESOURCE AVAILABILITY
            --------------------------------------------- */

            const available =
                isAppointmentTimeAvailable({

                    appointmentDate:
                        appointmentData.appointment_date,

                    startTime:
                        appointmentData.start_time,

                    endTime:
                        appointmentData.end_time,

                    providerId:
                        appointmentData.provider_id,

                    title:
                        appointmentData.title

                });


            if (!available) {

                const bloodWork =
                    isBloodWorkAppointment(
                        appointmentData
                    );

                setError(
                    bloodWork
                        ? "This RN already has a Blood Work appointment during this time."
                        : "This provider already has an appointment during this time."
                );

                return;
            }


            /* ---------------------------------------------
               CREATE
            --------------------------------------------- */

            const response =
                await createAppointment(
                    appointmentData
                );


            console.log(
                "APPOINTMENT CREATED:",
                response
            );


            /* ---------------------------------------------
               RELOAD
            --------------------------------------------- */

            await loadAppointments();


            /* ---------------------------------------------
               CLOSE MODAL
            --------------------------------------------- */

            setShowNewAppointment(
                false
            );


            /* ---------------------------------------------
               RESET FORM
            --------------------------------------------- */

            setNewAppointment({
                ...EMPTY_APPOINTMENT
            });


        } catch (err) {

            console.error(
                "CREATE APPOINTMENT ERROR:",
                err
            );

            console.error(
                "BACKEND RESPONSE:",
                err?.response?.data
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to create appointment."
            );

        } finally {

            setActionLoading(false);

        }

    }


    /* =====================================================
       UPDATE APPOINTMENT
    ===================================================== */

    async function handleUpdateAppointment(
        updatedAppointment
    ) {

        if (!selectedAppointment?.id) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");


            const appointmentData = {

                first_name:
                    updatedAppointment.patient_first_name?.trim(),

                last_name:
                    updatedAppointment.patient_last_name?.trim(),

                date_of_birth:
                    updatedAppointment.date_of_birth || null,

                health_card:
                    updatedAppointment.health_card?.trim() || "",

                phone:
                    updatedAppointment.phone?.trim(),

                emergency_contact:
                    updatedAppointment.emergency_contact?.trim() || "",

                medications:
                    updatedAppointment.medications?.trim() || "",

                medical_history:
                    updatedAppointment.medical_history?.trim() || "",

                provider_id:
                    updatedAppointment.provider_id
                        ? Number(
                            updatedAppointment.provider_id
                        )
                        : null,

                title:
                    updatedAppointment.title?.trim() || "",

                appointment_date:
                    updatedAppointment.appointment_date,

                start_time:
                    updatedAppointment.start_time,

                end_time:
                    updatedAppointment.end_time,

                reason:
                    updatedAppointment.reason?.trim() || "",

                notes:
                    updatedAppointment.notes?.trim() || ""

            };


            console.log(
                "UPDATING APPOINTMENT:",
                appointmentData
            );


            /* ---------------------------------------------
               VALIDATION
            --------------------------------------------- */

            if (!appointmentData.provider_id) {

                setError(
                    "Please select a provider."
                );

                return;
            }


            if (!appointmentData.appointment_date) {

                setError(
                    "Appointment date is required."
                );

                return;
            }


            if (!appointmentData.start_time) {

                setError(
                    "Appointment start time is required."
                );

                return;
            }


            if (!appointmentData.end_time) {

                setError(
                    "Appointment end time is required."
                );

                return;
            }


            /* ---------------------------------------------
               CHECK AVAILABILITY
               
               IMPORTANT:
               Excludes the appointment being edited.
            --------------------------------------------- */

            const available =
                isAppointmentTimeAvailable({

                    appointmentId:
                        selectedAppointment.id,

                    appointmentDate:
                        appointmentData.appointment_date,

                    startTime:
                        appointmentData.start_time,

                    endTime:
                        appointmentData.end_time,

                    providerId:
                        appointmentData.provider_id,

                    title:
                        appointmentData.title

                });


            if (!available) {

                const bloodWork =
                    isBloodWorkAppointment(
                        appointmentData
                    );

                setError(
                    bloodWork
                        ? "This RN already has a Blood Work appointment during this time."
                        : "This provider already has an appointment during this time."
                );

                return;
            }


            /* ---------------------------------------------
               SAVE
            --------------------------------------------- */

            await updateAppointment(
                selectedAppointment.id,
                appointmentData
            );


            /* ---------------------------------------------
               GET FRESH DATA
            --------------------------------------------- */

            const freshAppointments =
                await loadAppointments();


            const updated =
                freshAppointments.find(
                    appointment =>
                        Number(appointment.id) ===
                        Number(
                            selectedAppointment.id
                        )
                );


            if (updated) {

                setSelectedAppointment(
                    updated
                );

            }


            /* ---------------------------------------------
               CLOSE EDIT MODAL
            --------------------------------------------- */

            setShowEditAppointment(
                false
            );


            setEditAppointment({
                ...EMPTY_APPOINTMENT
            });


        } catch (err) {

            console.error(
                "UPDATE APPOINTMENT ERROR:",
                err
            );

            console.error(
                "BACKEND RESPONSE:",
                err?.response?.data
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to update appointment."
            );

        } finally {

            setActionLoading(false);

        }

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="appointments-page">

                <div className="appointments-loading">

                    <div className="button-spinner" />

                    <span>
                        Loading appointments...
                    </span>

                </div>

            </div>

        );
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="appointments-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="appointments-header">

                <div>

                    <span className="page-eyebrow">
                        SNE HEALTH CLINICS
                    </span>

                    <h1>
                        Appointments
                    </h1>

                    <p>
                        Manage and view scheduled
                        patient appointments.
                    </p>

                </div>


                <div className="appointments-header-actions">

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing
                        }
                    >

                        <RefreshCw
                            size={15}
                            className={
                                refreshing
                                    ? "refresh-spinning"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"
                        }

                    </button>


                    <button
                        type="button"
                        className="new-appointment-button"
                        onClick={() =>
                            setShowNewAppointment(
                                true
                            )
                        }
                    >

                        <Plus size={16} />

                        New Appointment

                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="appointments-error">

                    {error}

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        ×
                    </button>

                </div>

            )}


            {/* =================================================
                CALENDAR TOOLBAR
            ================================================= */}

            <div className="calendar-toolbar">

                <div className="calendar-date-area">

                    <div className="calendar-title-row">

                        <CalendarDays
                            size={19}
                        />

                        <h2>
                            {weekLabel}
                        </h2>

                    </div>

                    <div className="calendar-duration-info">

                        <Clock size={13} />

                        <span>
                            Appointment interval:
                        </span>

                        <strong>
                            {defaultDuration} min
                        </strong>

                    </div>

                </div>


                <div className="calendar-toolbar-right">

                    <div className="provider-filter">

                        <label htmlFor="provider-filter">
                            Provider
                        </label>

                        <select
                            id="provider-filter"
                            value={
                                selectedProviderId
                            }
                            onChange={
                                event =>
                                    setSelectedProviderId(
                                        event.target.value
                                    )
                            }
                        >

                            <option value="">
                                All Providers
                            </option>

                            {providers.map(
                                provider => (

                                    <option
                                        key={
                                            provider.id
                                        }
                                        value={
                                            provider.id
                                        }
                                    >
                                        Dr.{" "}
                                        {
                                            provider.first_name
                                        }{" "}
                                        {
                                            provider.last_name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="week-navigation">

                        <button
                            type="button"
                            onClick={
                                previousWeek
                            }
                        >
                            ‹
                        </button>

                        <button
                            type="button"
                            onClick={
                                goToToday
                            }
                        >
                            Today
                        </button>

                        <button
                            type="button"
                            onClick={
                                nextWeek
                            }
                        >
                            ›
                        </button>

                    </div>

                </div>

            </div>


            {/* =================================================
                CALENDAR
            ================================================= */}

            <div className="calendar-container">

                <TimeGrid
                    appointments={
                        filteredAppointments
                    }
                    currentWeek={
                        currentWeek
                    }
                    businessHours={
                        businessHours
                    }
                    defaultDuration={
                        defaultDuration
                    }
                    onAppointmentClick={
                        handleAppointmentClick
                    }
                    onTimeSlotClick={
                        handleCalendarTimeSlotClick
                    }
                />

            </div>


            {/* =================================================
                APPOINTMENT DETAILS MODAL
            ================================================= */}

            {selectedAppointment && (

                <div
                    className="appointment-modal-overlay"
                    onClick={
                        closeDetails
                    }
                >

                    <div
                        className="appointment-modal"
                        onClick={
                            event =>
                                event.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="modal-close"
                            onClick={
                                closeDetails
                            }
                        >
                            <X size={20} />
                        </button>


                        <div className="appointment-modal-header">

                            <div>

                                <span className="modal-eyebrow">
                                    APPOINTMENT DETAILS
                                </span>

                                <h2>
                                    Appointment
                                </h2>

                            </div>

                            {selectedAppointment.status && (

                                <span
                                    className={`appointment-status-badge ${selectedAppointment.status
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                >
                                    {
                                        selectedAppointment.status
                                    }
                                </span>

                            )}

                        </div>


                        {/* PATIENT */}

                        <div className="appointment-patient-section">

                            <div className="patient-avatar">

                                {
                                    selectedAppointment
                                        .patient_first_name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "P"
                                }

                            </div>

                            <div>

                                <h3>

                                    {
                                        selectedAppointment.patient_first_name
                                    }

                                    {" "}

                                    {
                                        selectedAppointment.patient_last_name
                                    }

                                </h3>

                                <p>

                                    {
                                        selectedAppointment.title ||
                                        selectedAppointment.reason ||
                                        "Appointment"
                                    }

                                </p>

                            </div>

                        </div>


                        {/* DETAILS */}

                        <div className="appointment-details-grid">

                            <div className="appointment-detail">

                                <div className="detail-icon">
                                    <CalendarDays size={15} />
                                </div>

                                <div>

                                    <strong>
                                        Date
                                    </strong>

                                    <p>
                                        {
                                            selectedAppointment.appointment_date
                                                ?.slice(0, 10)
                                        }
                                    </p>

                                </div>

                            </div>


                            <div className="appointment-detail">

                                <div className="detail-icon">
                                    <Clock size={15} />
                                </div>

                                <div>

                                    <strong>
                                        Time
                                    </strong>

                                    <p>

                                        {formatTime(
                                            selectedAppointment.start_time
                                        )}

                                        {" – "}

                                        {formatTime(
                                            selectedAppointment.end_time
                                        )}

                                    </p>

                                </div>

                            </div>


                            <div className="appointment-detail">

                                <div className="detail-icon">
                                    <Stethoscope size={15} />
                                </div>

                                <div>

                                    <strong>
                                        Provider
                                    </strong>

                                    <p>

                                        Dr.{" "}

                                        {
                                            selectedAppointment.provider_first_name
                                        }

                                        {" "}

                                        {
                                            selectedAppointment.provider_last_name
                                        }

                                    </p>

                                </div>

                            </div>


                            <div className="appointment-detail">

                                <div className="detail-icon">
                                    <UserRound size={15} />
                                </div>

                                <div>

                                    <strong>
                                        Reason
                                    </strong>

                                    <p>
                                        {
                                            selectedAppointment.reason ||
                                            "No reason recorded."
                                        }
                                    </p>

                                </div>

                            </div>


                            <div className="appointment-detail appointment-notes-detail">

                                <strong>
                                    Notes
                                </strong>

                                <p>

                                    {
                                        selectedAppointment.notes ||
                                        "No notes recorded."
                                    }

                                </p>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="appointment-actions">

                            {
                                selectedAppointment.status !==
                                "Checked-In" && (

                                    <button
                                        type="button"
                                        className="check-in-button"
                                        onClick={
                                            handleCheckIn
                                        }
                                        disabled={
                                            actionLoading
                                        }
                                    >

                                        {actionLoading
                                            ? "Processing..."
                                            : "Check In Patient"
                                        }

                                    </button>

                                )
                            }


                            <button
                                type="button"
                                className="edit-appointment-button"
                                onClick={
                                    handleEditClick
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                Edit Appointment
                            </button>


                            <button
                                type="button"
                                className="notes-button"
                                onClick={
                                    handleNotesClick
                                }
                                disabled={
                                    actionLoading
                                }
                            >

                                {
                                    selectedAppointment.notes
                                        ? "Edit Notes"
                                        : "Add Notes"
                                }

                            </button>


                            <button
                                type="button"
                                className="delete-appointment-button"
                                onClick={
                                    handleDeleteAppointment
                                }
                                disabled={
                                    actionLoading
                                }
                            >
                                Delete Appointment
                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                NEW APPOINTMENT MODAL
            ================================================= */}

            {showNewAppointment && (

                <AppointmentModal

                    appointment={
                        newAppointment
                    }

                    setAppointment={
                        setNewAppointment
                    }

                    providers={
                        providers
                    }

                    defaultDuration={
                        defaultDuration
                    }

                    onClose={() => {

                        setShowNewAppointment(
                            false
                        );

                        setNewAppointment(
                            EMPTY_APPOINTMENT
                        );

                    }}

                    onSubmit={
                        handleCreateAppointment
                    }

                    loading={
                        actionLoading
                    }

                />

            )}


            {/* =================================================
                NOTES MODAL
            ================================================= */}

            {showNotesAppointment &&
                selectedAppointment && (

                    <div
                        className="appointment-modal-overlay"
                        onClick={() =>
                            setShowNotesAppointment(
                                false
                            )
                        }
                    >

                        <div
                            className="appointment-notes-modal"
                            onClick={
                                event =>
                                    event.stopPropagation()
                            }
                        >

                            <div className="appointment-notes-modal-header">

                                <div>

                                    <span className="modal-eyebrow">
                                        APPOINTMENT NOTES
                                    </span>

                                    <h2>

                                        {
                                            selectedAppointment.patient_first_name
                                        }

                                        {" "}

                                        {
                                            selectedAppointment.patient_last_name
                                        }

                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() =>
                                        setShowNotesAppointment(
                                            false
                                        )
                                    }
                                >

                                    <X size={20} />

                                </button>

                            </div>


                            <div className="appointment-notes-form">

                                <label htmlFor="appointment-notes">
                                    Notes
                                </label>

                                <textarea
                                    id="appointment-notes"
                                    value={
                                        appointmentNotes
                                    }
                                    onChange={
                                        event =>
                                            setAppointmentNotes(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Enter appointment notes..."
                                    rows={8}
                                    autoFocus
                                />

                                <div className="notes-character-count">

                                    {
                                        appointmentNotes.length
                                    }{" "}
                                    characters

                                </div>

                            </div>


                            <div className="appointment-notes-actions">

                                <button
                                    type="button"
                                    className="notes-cancel-button"
                                    onClick={() =>
                                        setShowNotesAppointment(
                                            false
                                        )
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="notes-save-button"
                                    onClick={
                                        handleSaveNotes
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >

                                    {actionLoading
                                        ? "Saving..."
                                        : "Save Notes"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )}


            {/* =================================================
                EDIT APPOINTMENT MODAL
            ================================================= */}

            {showEditAppointment &&
                selectedAppointment && (

                    <AppointmentModal

                        appointment={
                            editAppointment
                        }

                        setAppointment={
                            setEditAppointment
                        }

                        providers={
                            providers
                        }

                        defaultDuration={
                            defaultDuration
                        }

                        onClose={() => {

                            setShowEditAppointment(
                                false
                            );

                        }}

                        onSubmit={
                            handleUpdateAppointment
                        }

                        loading={
                            actionLoading
                        }

                    />

                )}

        </div>

    );
}