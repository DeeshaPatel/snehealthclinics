import { useEffect, useState } from "react";

import {
    Clock,
    CalendarDays,
    Plus,
    Trash2,
    Save,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    X
} from "lucide-react";

import {
    getAppointmentSettings,
    saveAppointmentSettings
} from "../../api/appointmentSettingsApi";

import "./appointmentSettings.css";


export default function AppointmentSettings() {

    // =====================================================
    // GENERAL SETTINGS
    // =====================================================

    const [settings, setSettings] = useState({

        defaultDuration: "30",

        defaultStatus: "Scheduled",

        cancellationWindow: "24",


    });


    // =====================================================
    // BUSINESS HOURS
    // =====================================================

    const [businessHours, setBusinessHours] = useState([

        {
            day: "Monday",
            enabled: true,
            start: "08:00",
            end: "17:00"
        },

        {
            day: "Tuesday",
            enabled: true,
            start: "08:00",
            end: "17:00"
        },

        {
            day: "Wednesday",
            enabled: true,
            start: "08:00",
            end: "17:00"
        },

        {
            day: "Thursday",
            enabled: true,
            start: "08:00",
            end: "17:00"
        },

        {
            day: "Friday",
            enabled: true,
            start: "08:00",
            end: "17:00"
        },

        {
            day: "Saturday",
            enabled: false,
            start: "09:00",
            end: "13:00"
        },

        {
            day: "Sunday",
            enabled: false,
            start: "09:00",
            end: "13:00"
        }

    ]);


    // =====================================================
    // APPOINTMENT TYPES
    // =====================================================

    const [appointmentTypes, setAppointmentTypes] = useState([

        "General Consultation",

        "Follow-up",

        "Annual Checkup",

        "Vaccination"

    ]);


    const [newAppointmentType, setNewAppointmentType] =
        useState("");


    // =====================================================
    // HOLIDAYS
    // =====================================================

    const [holidays, setHolidays] = useState([]);

    const [newHolidayDate, setNewHolidayDate] =
        useState("");

    const [newHolidayName, setNewHolidayName] =
        useState("");


    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // LOAD SETTINGS
    // =====================================================

    const loadSettings = async () => {

        try {

            setLoading(true);

            setError("");

            setSuccess("");


            const data =
                await getAppointmentSettings();


            // -------------------------------------------------
            // GENERAL SETTINGS
            // -------------------------------------------------

            if (data.settings) {

                setSettings({

                    defaultDuration:
                        String(
                            data.settings.default_duration
                        ),

                    defaultStatus:
                        data.settings.default_status ||
                        "Scheduled",

                    cancellationWindow:
                        String(
                            data.settings.cancellation_window
                        )

                });

            }


            // -------------------------------------------------
            // BUSINESS HOURS
            // -------------------------------------------------

            if (data.businessHours) {

                setBusinessHours(

                    data.businessHours.map(
                        (item) => ({

                            day:
                                item.day_of_week,

                            enabled:
                                Boolean(item.enabled),

                            start:
                                item.start_time
                                    ? String(
                                        item.start_time
                                    ).slice(0, 5)
                                    : "08:00",

                            end:
                                item.end_time
                                    ? String(
                                        item.end_time
                                    ).slice(0, 5)
                                    : "17:00"

                        })
                    )

                );

            }


            // -------------------------------------------------
            // APPOINTMENT TYPES
            // -------------------------------------------------

            if (data.appointmentTypes) {

                setAppointmentTypes(

                    data.appointmentTypes.map(
                        (item) => item.name
                    )

                );

            }


            // -------------------------------------------------
            // HOLIDAYS
            // -------------------------------------------------

            if (data.holidays) {

                setHolidays(

                    data.holidays.map(
                        (item) => ({

                            id:
                                item.id,

                            date:
                                String(
                                    item.holiday_date
                                ).slice(0, 10),

                            name:
                                item.name

                        })
                    )

                );

            }

        } catch (err) {

            console.error(
                "Failed to load appointment settings:",
                err
            );

            setError(
                "Unable to load appointment settings."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadSettings();

    }, []);


    // =====================================================
    // GENERAL SETTINGS HANDLER
    // =====================================================

    const handleSettingChange = (
        field,
        value
    ) => {

        setSettings(
            (previous) => ({

                ...previous,

                [field]: value

            })
        );

    };


    // =====================================================
    // BUSINESS HOURS HANDLER
    // =====================================================

    const handleBusinessHourChange = (
        index,
        field,
        value
    ) => {

        setBusinessHours(
            (previous) => {

                const updated = [
                    ...previous
                ];

                updated[index] = {

                    ...updated[index],

                    [field]: value

                };

                return updated;

            }
        );

    };


    // =====================================================
    // ADD APPOINTMENT TYPE
    // =====================================================

    const addAppointmentType = () => {

        const type =
            newAppointmentType.trim();


        if (!type) {
            return;
        }


        const exists =
            appointmentTypes.some(
                (item) =>
                    item.toLowerCase() ===
                    type.toLowerCase()
            );


        if (exists) {

            setError(
                "This appointment type already exists."
            );

            return;

        }


        setAppointmentTypes(
            (previous) => [
                ...previous,
                type
            ]
        );


        setNewAppointmentType("");

        setError("");

    };


    // =====================================================
    // REMOVE APPOINTMENT TYPE
    // =====================================================

    const removeAppointmentType = (
        index
    ) => {

        setAppointmentTypes(
            (previous) =>
                previous.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                )
        );

    };


    // =====================================================
    // ADD HOLIDAY
    // =====================================================

    const addHoliday = () => {

        const date =
            newHolidayDate.trim();

        const name =
            newHolidayName.trim();


        if (!date || !name) {

            setError(
                "Please enter both a holiday date and name."
            );

            return;

        }


        const exists =
            holidays.some(
                (holiday) =>
                    holiday.date === date
            );


        if (exists) {

            setError(
                "A holiday already exists for this date."
            );

            return;

        }


        setHolidays(
            (previous) => [

                ...previous,

                {
                    id:
                        Date.now(),

                    date,

                    name

                }

            ]
        );


        setNewHolidayDate("");

        setNewHolidayName("");

        setError("");

    };


    // =====================================================
    // REMOVE HOLIDAY
    // =====================================================

    const removeHoliday = (
        index
    ) => {

        setHolidays(
            (previous) =>
                previous.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                )
        );

    };


    // =====================================================
    // SAVE SETTINGS
    // =====================================================

    const handleSave = async () => {

        try {

            setSaving(true);

            setError("");

            setSuccess("");


            const payload = {

                settings: {

                    defaultDuration:
                        Number(
                            settings.defaultDuration
                        ),

                    defaultStatus:
                        settings.defaultStatus,

                    cancellationWindow:
                        Number(
                            settings.cancellationWindow
                        )

                },


                businessHours,


                appointmentTypes,


                holidays: holidays.map(
                    (holiday) => ({

                        date:
                            holiday.date,

                        name:
                            holiday.name

                    })
                )

            };


            await saveAppointmentSettings(
                payload
            );


            setSuccess(
                "Appointment settings saved successfully."
            );


            // Remove success message after 4 seconds

            setTimeout(() => {

                setSuccess("");

            }, 4000);


        } catch (err) {

            console.error(
                "Failed to save appointment settings:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to save appointment settings."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="appointment-settings-page">

                <div className="appointment-settings-loading">

                    <RefreshCw
                        size={24}
                        className="spin"
                    />

                    <p>
                        Loading appointment settings...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="appointment-settings-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="appointment-settings-header">

                <div>

                    <div className="settings-title-row">

                        <div className="settings-title-icon">

                            <CalendarDays
                                size={22}
                            />

                        </div>

                        <div>

                            <h1>
                                Appointment Settings
                            </h1>

                            <p>
                                Configure how appointments
                                are scheduled and managed.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="settings-header-actions">

                    <button
                        type="button"
                        className="settings-refresh-button"
                        onClick={loadSettings}
                        disabled={loading || saving}
                    >

                        <RefreshCw
                            size={17}
                        />

                        Refresh

                    </button>


                    <button
                        type="button"
                        className="settings-save-button"
                        onClick={handleSave}
                        disabled={saving}
                    >

                        {saving ? (

                            <>
                                <RefreshCw
                                    size={17}
                                    className="spin"
                                />

                                Saving...

                            </>

                        ) : (

                            <>
                                <Save
                                    size={17}
                                />

                                Save Changes

                            </>
                        )}

                    </button>

                </div>

            </div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            {success && (

                <div className="settings-success">

                    <CheckCircle
                        size={18}
                    />

                    <span>
                        {success}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                    >

                        <X size={16} />

                    </button>

                </div>

            )}


            {error && (

                <div className="settings-error">

                    <AlertCircle
                        size={18}
                    />

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >

                        <X size={16} />

                    </button>

                </div>

            )}


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="appointment-settings-content">


                {/* =================================================
                    GENERAL APPOINTMENT SETTINGS
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">

                            <Clock
                                size={19}
                            />

                        </div>

                        <div>

                            <h2>
                                General Appointment Settings
                            </h2>

                            <p>
                                Configure the default behavior
                                for new appointments.
                            </p>

                        </div>

                    </div>


                    <div className="settings-form-grid">


                        {/* DEFAULT DURATION */}

                        <div className="settings-field">

                            <label>
                                Default appointment duration
                            </label>

                            <select
                                value={
                                    settings.defaultDuration
                                }
                                onChange={(event) =>
                                    handleSettingChange(
                                        "defaultDuration",
                                        event.target.value
                                    )
                                }
                            >

                                <option value="15">
                                    15 minutes
                                </option>

                                <option value="30">
                                    30 minutes
                                </option>

                                <option value="45">
                                    45 minutes
                                </option>

                                <option value="60">
                                    60 minutes
                                </option>

                                <option value="90">
                                    90 minutes
                                </option>

                                <option value="120">
                                    120 minutes
                                </option>

                            </select>

                            <span className="field-help">
                                Used automatically when creating
                                a new appointment.
                            </span>

                        </div>


                        {/* DEFAULT STATUS */}

                        <div className="settings-field">

                            <label>
                                Default appointment status
                            </label>

                            <select
                                value={
                                    settings.defaultStatus
                                }
                                onChange={(event) =>
                                    handleSettingChange(
                                        "defaultStatus",
                                        event.target.value
                                    )
                                }
                            >

                                <option value="Scheduled">
                                    Scheduled
                                </option>

                                <option value="Confirmed">
                                    Confirmed
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                            </select>

                            <span className="field-help">
                                Status automatically assigned
                                to new appointments.
                            </span>

                        </div>


                        {/* CANCELLATION WINDOW */}

                        <div className="settings-field">

                            <label>
                                Cancellation window
                            </label>

                            <select
                                value={
                                    settings.cancellationWindow
                                }
                                onChange={(event) =>
                                    handleSettingChange(
                                        "cancellationWindow",
                                        event.target.value
                                    )
                                }
                            >

                                <option value="0">
                                    No restriction
                                </option>

                                <option value="2">
                                    2 hours
                                </option>

                                <option value="4">
                                    4 hours
                                </option>

                                <option value="12">
                                    12 hours
                                </option>

                                <option value="24">
                                    24 hours
                                </option>

                                <option value="48">
                                    48 hours
                                </option>

                                <option value="72">
                                    72 hours
                                </option>

                            </select>

                            <span className="field-help">
                                Minimum notice required before
                                an appointment can be cancelled.
                            </span>

                        </div>

                    </div>


                </section>


                {/* =================================================
                    BUSINESS HOURS
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">

                            <Clock
                                size={19}
                            />

                        </div>

                        <div>

                            <h2>
                                Available Appointment Hours
                            </h2>

                            <p>
                                Set the hours when appointments
                                can normally be scheduled.
                            </p>

                        </div>

                    </div>


                    <div className="business-hours-list">

                        {businessHours.map(
                            (item, index) => (

                                <div
                                    className="business-hours-row"
                                    key={item.day}
                                >

                                    <div className="business-day">

                                        <label className="settings-switch small">

                                            <input
                                                type="checkbox"
                                                checked={
                                                    item.enabled
                                                }
                                                onChange={(event) =>
                                                    handleBusinessHourChange(
                                                        index,
                                                        "enabled",
                                                        event.target.checked
                                                    )
                                                }
                                            />

                                            <span></span>

                                        </label>


                                        <strong>
                                            {item.day}
                                        </strong>

                                    </div>


                                    <div className="business-time-fields">

                                        <input
                                            type="time"
                                            value={
                                                item.start
                                            }
                                            disabled={
                                                !item.enabled
                                            }
                                            onChange={(event) =>
                                                handleBusinessHourChange(
                                                    index,
                                                    "start",
                                                    event.target.value
                                                )
                                            }
                                        />

                                        <span>
                                            to
                                        </span>

                                        <input
                                            type="time"
                                            value={
                                                item.end
                                            }
                                            disabled={
                                                !item.enabled
                                            }
                                            onChange={(event) =>
                                                handleBusinessHourChange(
                                                    index,
                                                    "end",
                                                    event.target.value
                                                )
                                            }
                                        />

                                    </div>


                                    <span
                                        className={
                                            item.enabled
                                                ? "business-status open"
                                                : "business-status closed"
                                        }
                                    >
                                        {item.enabled
                                            ? "Open"
                                            : "Closed"}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </section>


                {/* =================================================
                    APPOINTMENT TYPES
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">

                            <CalendarDays
                                size={19}
                            />

                        </div>

                        <div>

                            <h2>
                                Appointment Types
                            </h2>

                            <p>
                                Manage the appointment types
                                available to staff.
                            </p>

                        </div>

                    </div>


                    <div className="appointment-types-list">

                        {appointmentTypes.map(
                            (type, index) => (

                                <div
                                    className="appointment-type-item"
                                    key={`${type}-${index}`}
                                >

                                    <span>
                                        {type}
                                    </span>


                                    <button
                                        type="button"
                                        className="delete-setting-button"
                                        onClick={() =>
                                            removeAppointmentType(
                                                index
                                            )
                                        }
                                        title="Remove appointment type"
                                    >

                                        <Trash2
                                            size={16}
                                        />

                                    </button>

                                </div>

                            )
                        )}

                    </div>


                    <div className="add-setting-row">

                        <input
                            type="text"
                            placeholder="Enter appointment type..."
                            value={
                                newAppointmentType
                            }
                            onChange={(event) =>
                                setNewAppointmentType(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {

                                if (
                                    event.key === "Enter"
                                ) {

                                    event.preventDefault();

                                    addAppointmentType();

                                }

                            }}
                        />


                        <button
                            type="button"
                            className="add-setting-button"
                            onClick={
                                addAppointmentType
                            }
                        >

                            <Plus
                                size={17}
                            />

                            Add Type

                        </button>

                    </div>

                </section>


                {/* =================================================
                    CLINIC HOLIDAYS
                ================================================= */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div className="settings-card-icon">

                            <CalendarDays
                                size={19}
                            />

                        </div>

                        <div>

                            <h2>
                                Clinic Holidays
                            </h2>

                            <p>
                                Add dates when the clinic
                                will be closed.
                            </p>

                        </div>

                    </div>


                    {holidays.length > 0 && (

                        <div className="holidays-list">

                            {holidays.map(
                                (holiday, index) => (

                                    <div
                                        className="holiday-item"
                                        key={
                                            holiday.id ||
                                            `${holiday.date}-${index}`
                                        }
                                    >

                                        <div className="holiday-date">

                                            <CalendarDays
                                                size={17}
                                            />

                                            <span>
                                                {holiday.date}
                                            </span>

                                        </div>


                                        <strong>
                                            {holiday.name}
                                        </strong>


                                        <button
                                            type="button"
                                            className="delete-setting-button"
                                            onClick={() =>
                                                removeHoliday(
                                                    index
                                                )
                                            }
                                        >

                                            <Trash2
                                                size={16}
                                            />

                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {holidays.length === 0 && (

                        <div className="no-holidays">

                            <CalendarDays
                                size={22}
                            />

                            <p>
                                No clinic holidays have
                                been configured.
                            </p>

                        </div>

                    )}


                    <div className="add-holiday-row">

                        <div>

                            <label>
                                Date
                            </label>

                            <input
                                type="date"
                                value={
                                    newHolidayDate
                                }
                                onChange={(event) =>
                                    setNewHolidayDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div>

                            <label>
                                Holiday name
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Christmas Day"
                                value={
                                    newHolidayName
                                }
                                onChange={(event) =>
                                    setNewHolidayName(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <button
                            type="button"
                            className="add-setting-button holiday-add-button"
                            onClick={addHoliday}
                        >

                            <Plus
                                size={17}
                            />

                            Add Holiday

                        </button>

                    </div>

                </section>


                {/* =================================================
                    BOTTOM SAVE
                ================================================= */}

                <div className="settings-bottom-actions">

                    <button
                        type="button"
                        className="settings-refresh-button"
                        onClick={loadSettings}
                        disabled={saving}
                    >

                        <RefreshCw
                            size={17}
                        />

                        Reset Changes

                    </button>


                    <button
                        type="button"
                        className="settings-save-button"
                        onClick={handleSave}
                        disabled={saving}
                    >

                        {saving ? (

                            <>
                                <RefreshCw
                                    size={17}
                                    className="spin"
                                />

                                Saving...

                            </>

                        ) : (

                            <>
                                <Save
                                    size={17}
                                />

                                Save Changes

                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>

    );

}
