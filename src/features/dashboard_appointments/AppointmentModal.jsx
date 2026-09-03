import { useEffect, useState } from "react";
import { getAppointmentTypes } from "../../api/appointmentSettingsApi";

import {
    X,
    UserRound,
    CalendarDays,
    Clock,
    FileText,
    Stethoscope,
    Phone,
    HeartPulse
} from "lucide-react";

import "./appointmentModal.css";


/* =========================================================
   EMPTY FORM
========================================================= */

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

    title: "",
    appointment_date: "",
    start_time: "",
    end_time: "",

    reason: "",
    notes: ""
};


/* =========================================================
   TIME HELPERS
========================================================= */

function timeToMinutes(time) {

    if (!time) {
        return 0;
    }

    const clean =
        String(time).slice(0, 5);

    const [hours, minutes] =
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
        Math.floor(safe / 60);

    const mins =
        safe % 60;

    return (
        `${String(hours).padStart(2, "0")}:` +
        `${String(mins).padStart(2, "0")}`
    );
}


/* =========================================================
   COMPONENT
========================================================= */

export default function AppointmentModal({

    appointment = EMPTY_APPOINTMENT,

    setAppointment,

    providers = [],

    patients = [],

    onClose,

    onSubmit,

    loading = false,

    mode = "create"

}) {

    const [form, setForm] =
        useState({
            ...EMPTY_APPOINTMENT,
            ...appointment
        });

    const [appointmentTypes, setAppointmentTypes] =
        useState([]);

    const [loadingTypes, setLoadingTypes] =
        useState(false);


    /* =====================================================
       SYNC APPOINTMENT FROM PARENT

       This is important because TimeGrid can open the
       modal with a selected date/time.
    ===================================================== */

    useEffect(() => {

        setForm({
            ...EMPTY_APPOINTMENT,
            ...appointment
        });

    }, [appointment]);

    useEffect(() => {

        const loadAppointmentTypes = async () => {
    
            try {
    
                setLoadingTypes(true);
    
                const response =
                    await getAppointmentTypes();
    
                console.log(
                    "APPOINTMENT TYPES:",
                    response
                );
    
                const types =
                    Array.isArray(response)
                        ? response
                        : response?.appointmentTypes ||
                          response?.appointment_types ||
                          response?.data ||
                          [];
    
                setAppointmentTypes(types);
    
            } catch (error) {
    
                console.error(
                    "Failed to load appointment types:",
                    error
                );
    
                setAppointmentTypes([]);
    
            } finally {
    
                setLoadingTypes(false);
    
            }
    
        };
    
        loadAppointmentTypes();
    
    }, []);

    /* =====================================================
       UPDATE FIELD
    ===================================================== */

    const updateField = (
        field,
        value
    ) => {

        const updated = {
            ...form,
            [field]: value
        };

        setForm(updated);

        if (setAppointment) {
            setAppointment(updated);
        }
    };


    /* =====================================================
       START TIME CHANGE

       Automatically update end time using the duration
       between the existing start/end times.
    ===================================================== */

    const handleStartTimeChange = (
        newStart
    ) => {

        const oldStart =
            timeToMinutes(
                form.start_time
            );

        const oldEnd =
            timeToMinutes(
                form.end_time
            );

        let duration =
            oldEnd - oldStart;

        if (duration <= 0) {
            duration = 30;
        }

        const newStartMinutes =
            timeToMinutes(
                newStart
            );

        const newEnd =
            minutesToTime(
                newStartMinutes +
                duration
            );

        const updated = {
            ...form,
            start_time: newStart,
            end_time: newEnd
        };

        setForm(updated);

        if (setAppointment) {
            setAppointment(updated);
        }
    };


    /* =====================================================
       PATIENT SELECTION
    ===================================================== */

    const handlePatientChange = (
        patientId
    ) => {

        const patient =
            patients.find(
                item =>
                    String(item.id) ===
                    String(patientId)
            );

        if (!patient) {

            updateField(
                "patient_id",
                patientId
            );

            return;
        }


        const updated = {

            ...form,

            patient_id:
                patient.id,

            patient_first_name:
                patient.first_name ||
                "",

            patient_last_name:
                patient.last_name ||
                "",

            date_of_birth:
                patient.date_of_birth ||
                "",

            health_card:
                patient.health_card ||
                patient.health_card_number ||
                "",

            phone:
                patient.phone ||
                "",

            emergency_contact:
                patient.emergency_contact ||
                "",

            medications:
                patient.medications ||
                "",

            medical_history:
                patient.medical_history ||
                ""

        };


        setForm(updated);

        if (setAppointment) {
            setAppointment(updated);
        }

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (
        event
    ) => {

        event.preventDefault();

        if (!form.appointment_date) {
            return;
        }

        if (!form.start_time) {
            return;
        }

        if (!form.end_time) {
            return;
        }

        if (onSubmit) {
            onSubmit(form);
        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div
            className="appointment-modal-backdrop"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="appointment-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="appointment-modal-header">

                    <div className="appointment-modal-title">

                        <div className="appointment-modal-icon">

                            <CalendarDays
                                size={22}
                            />

                        </div>

                        <div>

                            <h2>
                                {mode === "edit"
                                    ? "Edit Appointment"
                                    : "New Appointment"
                                }
                            </h2>

                            <p>
                                {mode === "edit"
                                    ? "Update appointment details"
                                    : "Schedule a new patient appointment"
                                }
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="appointment-modal-close"
                        onClick={onClose}
                    >

                        <X size={22} />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="appointment-modal-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        APPOINTMENT DETAILS
                    ================================================= */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <CalendarDays
                                size={18}
                            />

                            <span>
                                Appointment Details
                            </span>

                        </div>


                        <div className="form-grid">

                            {/* DATE */}

                            <div className="form-group">

                                <label>
                                    Appointment Date
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="input-with-icon">

                                    <CalendarDays
                                        size={17}
                                    />

                                    <input
                                        type="date"
                                        value={
                                            form.appointment_date ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            updateField(
                                                "appointment_date",
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* START TIME */}

                            <div className="form-group">

                                <label>
                                    Start Time
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="input-with-icon">

                                    <Clock
                                        size={17}
                                    />

                                    <input
                                        type="time"
                                        value={
                                            form.start_time ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            handleStartTimeChange(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* END TIME */}

                            <div className="form-group">

                                <label>
                                    End Time
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="input-with-icon">

                                    <Clock
                                        size={17}
                                    />

                                    <input
                                        type="time"
                                        value={
                                            form.end_time ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            updateField(
                                                "end_time",
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* PROVIDER */}

                            <div className="form-group">

                                <label>
                                    Provider
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="input-with-icon">

                                    <Stethoscope
                                        size={17}
                                    />

                                    <select
                                        value={
                                            form.provider_id ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            updateField(
                                                "provider_id",
                                                event.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select provider
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

                                                    {provider.first_name ||
                                                        provider.firstName ||
                                                        ""}{" "}

                                                    {provider.last_name ||
                                                        provider.lastName ||
                                                        ""}

                                                    {provider.specialty
                                                        ? ` — ${provider.specialty}`
                                                        : ""
                                                    }

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PATIENT
                    ================================================= */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <UserRound
                                size={18}
                            />

                            <span>
                                Patient Information
                            </span>

                        </div>


                        {/* PATIENT DROPDOWN */}

                        {patients.length > 0 && (

                            <div className="form-group full-width">

                                <label>
                                    Existing Patient
                                </label>

                                <div className="input-with-icon">

                                    <UserRound
                                        size={17}
                                    />

                                    <select
                                        value={
                                            form.patient_id ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            handlePatientChange(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select existing patient
                                        </option>

                                        {patients.map(
                                            patient => (

                                                <option
                                                    key={
                                                        patient.id
                                                    }
                                                    value={
                                                        patient.id
                                                    }
                                                >

                                                    {patient.first_name}{" "}
                                                    {patient.last_name}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>

                        )}


                        <div className="form-grid">

                            {/* FIRST NAME */}

                            <div className="form-group">

                                <label>
                                    First Name
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.patient_first_name ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "patient_first_name",
                                            event.target.value
                                        )
                                    }
                                    placeholder="First name"
                                    required
                                />

                            </div>


                            {/* LAST NAME */}

                            <div className="form-group">

                                <label>
                                    Last Name
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.patient_last_name ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "patient_last_name",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Last name"
                                    required
                                />

                            </div>


                            {/* DOB */}

                            <div className="form-group">

                                <label>
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    value={
                                        form.date_of_birth ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "date_of_birth",
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* HEALTH CARD */}

                            <div className="form-group">

                                <label>
                                    Health Card Number
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.health_card ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "health_card",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Health card number"
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <div className="input-with-icon">

                                    <Phone
                                        size={17}
                                    />

                                    <input
                                        type="tel"
                                        value={
                                            form.phone ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            updateField(
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Phone number"
                                    />

                                </div>

                            </div>


                            {/* EMERGENCY CONTACT */}

                            <div className="form-group">

                                <label>
                                    Emergency Contact
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.emergency_contact ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "emergency_contact",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Emergency contact"
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        MEDICAL INFORMATION
                    ================================================= */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <HeartPulse
                                size={18}
                            />

                            <span>
                                Medical Information
                            </span>

                        </div>


                        <div className="form-grid">

                            {/* MEDICATIONS */}

                            <div className="form-group full-width">

                                <label>
                                    Current Medications
                                </label>

                                <textarea
                                    value={
                                        form.medications ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "medications",
                                            event.target.value
                                        )
                                    }
                                    placeholder="List current medications..."
                                    rows={3}
                                />

                            </div>


                            {/* MEDICAL HISTORY */}

                            <div className="form-group full-width">

                                <label>
                                    Medical History
                                </label>

                                <textarea
                                    value={
                                        form.medical_history ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "medical_history",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Relevant medical history..."
                                    rows={3}
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        APPOINTMENT REASON
                    ================================================= */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <FileText
                                size={18}
                            />

                            <span>
                                Appointment Information
                            </span>

                        </div>


                        <div className="form-grid">

                            {/* TITLE */}

                            <div className="form-group">

                                <label>
                                    Appointment Type
                                    <span className="required">
                                        *
                                    </span>
                                </label>

                                <div className="input-with-icon">

                                    <FileText size={17} />

                                    <select
                                        value={form.title || ""}
                                        onChange={(event) =>
                                            updateField(
                                                "title",
                                                event.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option value="">
                                            {loadingTypes
                                                ? "Loading appointment types..."
                                                : "Select appointment type"
                                            }
                                        </option>

                                        {appointmentTypes.map(
                                            type => (

                                                <option
                                                    key={type.id}
                                                    value={type.name}
                                                >
                                                    {type.name}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>


                            {/* REASON */}

                            <div className="form-group full-width">

                                <label>
                                    Reason for Visit
                                </label>

                                <textarea
                                    value={
                                        form.reason ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "reason",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Describe the reason for the appointment..."
                                    rows={3}
                                />

                            </div>


                            {/* NOTES */}

                            <div className="form-group full-width">

                                <label>
                                    Notes
                                </label>

                                <textarea
                                    value={
                                        form.notes ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "notes",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Additional notes..."
                                    rows={3}
                                />

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="appointment-modal-footer">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : mode === "edit"
                                    ? "Save Changes"
                                    : "Create Appointment"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}