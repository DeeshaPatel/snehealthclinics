import { useState } from "react";

import { updateAppointment } from "../../api/appointmentApi";

import "./dashboard.css";


export default function DashboardCharts({ data, onRefresh }) {

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");


    /*
    =========================================================
    FORMAT TIME
    =========================================================
    */

    const formatTime = (time) => {

        if (!time) {
            return "N/A";
        }

        const [hours, minutes] = time.split(":");

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });

    };


    /*
    =========================================================
    FORMAT DATE
    =========================================================
    */

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return date;
        }

        return value.toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    };


    /*
    =========================================================
    OPEN APPOINTMENT
    =========================================================
    */

    const openAppointment = (appointment) => {

        setError("");

        setSelectedAppointment(appointment);

    };


    /*
    =========================================================
    CLOSE MODAL
    =========================================================
    */

    const closeAppointment = () => {

        if (actionLoading) {
            return;
        }

        setSelectedAppointment(null);

        setError("");

    };


    /*
    =========================================================
    CHECK IN PATIENT
    =========================================================
    */

    const handleCheckIn = async () => {

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


            /*
            Update modal immediately
            */

            setSelectedAppointment((previous) => ({
                ...previous,
                status: "Checked-In"
            }));


            /*
            Refresh dashboard data
            */

            if (onRefresh) {
                await onRefresh();
            }


        } catch (err) {

            console.error(
                "Dashboard check-in error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                "Unable to check in patient."
            );


        } finally {

            setActionLoading(false);

        }

    };


    /*
    =========================================================
    REGULAR APPOINTMENTS
    =========================================================
    */

    const todayAppointments =
        data?.todayAppointmentsList || [];


    /*
    =========================================================
    BLOOD WORK APPOINTMENTS
    =========================================================
    */

    const bloodWorkAppointments =
        data?.bloodWorkAppointments || [];


    /*
    =========================================================
    RENDER
    =========================================================
    */

    return (

        <>

            <div className="dashboard-content">


                {/* =================================================
                    TODAY'S APPOINTMENTS
                    ================================================= */}

                <div className="dashboard-section">

                    <div className="dashboard-section-header">

                        <div>
                            <h2>
                                Today's Appointments
                            </h2>

                            <p>
                                Patients scheduled for today
                            </p>
                        </div>

                        <span className="dashboard-section-count">
                            {todayAppointments.length}
                        </span>

                    </div>


                    <div className="dashboard-appointments-list">

                        {todayAppointments.length > 0 ? (

                            todayAppointments.map(
                                (appointment) => (

                                    <button
                                        key={appointment.id}
                                        type="button"
                                        className="dashboard-appointment-clickable"
                                        onClick={() =>
                                            openAppointment(
                                                appointment
                                            )
                                        }
                                    >

                                        <div className="appointment-row">


                                            <div className="appointment-time">

                                                {formatTime(
                                                    appointment.start_time
                                                )}

                                            </div>


                                            <div className="appointment-info">

                                                <strong>

                                                    {appointment.patient_first_name}{" "}

                                                    {appointment.patient_last_name}

                                                </strong>


                                                <span>

                                                    {appointment.title ||
                                                        "Appointment"}

                                                </span>

                                            </div>


                                            <div className="appointment-provider">

                                                {appointment.provider_first_name
                                                    ? `${appointment.provider_first_name} ${appointment.provider_last_name || ""}`
                                                    : "No Provider"}

                                            </div>


                                        </div>

                                    </button>

                                )
                            )

                        ) : (

                            <div className="dashboard-empty-state">

                                No appointments scheduled for today.

                            </div>

                        )}

                    </div>

                </div>



                {/* =================================================
                    RECENT PATIENTS
                    ================================================= */}

                <div className="dashboard-section">

                    <div className="dashboard-section-header">

                        <div>
                            <h2>
                                Recent Patients
                            </h2>

                            <p>
                                Recently registered patients
                            </p>
                        </div>

                    </div>


                    <div className="dashboard-patients-list">

                        {data?.recentPatients?.length > 0 ? (

                            data.recentPatients.map(
                                (patient) => (

                                    <div
                                        key={patient.id}
                                        className="dashboard-patient-row"
                                    >

                                        <div className="dashboard-patient-avatar">

                                            {patient.first_name
                                                ?.charAt(0)
                                                ?.toUpperCase()}

                                        </div>


                                        <div className="dashboard-patient-info">

                                            <strong>

                                                {patient.first_name}{" "}

                                                {patient.last_name}

                                            </strong>


                                            <span>

                                                {patient.phone ||
                                                    "No phone number"}

                                            </span>

                                        </div>

                                    </div>

                                )
                            )

                        ) : (

                            <div className="dashboard-empty-state">

                                No recent patients.

                            </div>

                        )}

                    </div>

                </div>



                {/* =================================================
                    BLOOD WORK APPOINTMENTS
                    ================================================= */}

                <div className="dashboard-section blood-work-section">

                    <div className="dashboard-section-header">

                        <div>

                            <h2>
                                🩸 Blood Work Appointments
                            </h2>

                            <p>
                                Patients scheduled for blood work today
                            </p>

                        </div>


                        <span className="dashboard-section-count">

                            {bloodWorkAppointments.length}

                        </span>

                    </div>


                    <div className="dashboard-appointments-list">

                        {bloodWorkAppointments.length > 0 ? (

                            bloodWorkAppointments.map(
                                (appointment) => (

                                    <button
                                        key={appointment.id}
                                        type="button"
                                        className="dashboard-appointment-clickable blood-work-appointment"
                                        onClick={() =>
                                            openAppointment(
                                                appointment
                                            )
                                        }
                                    >

                                        <div className="appointment-row">


                                            <div className="appointment-time">

                                                {formatTime(
                                                    appointment.start_time
                                                )}

                                            </div>


                                            <div className="appointment-info">

                                                <strong>

                                                    {appointment.patient_first_name}{" "}

                                                    {appointment.patient_last_name}

                                                </strong>


                                                <span>

                                                    🩸 Blood Work

                                                </span>

                                            </div>


                                            <div className="appointment-provider">

                                                {appointment.provider_first_name
                                                    ? `${appointment.provider_first_name} ${appointment.provider_last_name || ""}`
                                                    : "No Provider"}

                                            </div>


                                        </div>

                                    </button>

                                )
                            )

                        ) : (

                            <div className="dashboard-empty-state">

                                No blood work appointments today.

                            </div>

                        )}

                    </div>

                </div>

            </div>



            {/* =====================================================
                APPOINTMENT / PATIENT DETAILS MODAL
                ===================================================== */}

            {selectedAppointment && (

                <div
                    className="dashboard-appointment-overlay"
                    onClick={closeAppointment}
                >

                    <div
                        className="dashboard-appointment-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* =================================================
                            HEADER
                            ================================================= */}

                        <div className="dashboard-modal-header">

                            <div>

                                <h2>

                                    {selectedAppointment.patient_first_name}{" "}

                                    {selectedAppointment.patient_last_name}

                                </h2>


                                <p>

                                    {selectedAppointment.title ||
                                        "Appointment"}

                                </p>

                            </div>


                            <button
                                type="button"
                                className="dashboard-modal-close"
                                onClick={closeAppointment}
                                disabled={actionLoading}
                            >
                                ×
                            </button>

                        </div>



                        {/* =================================================
                            STATUS
                            ================================================= */}

                        <div className="dashboard-modal-status">

                            <strong>
                                Status:
                            </strong>{" "}

                            <span>
                                {selectedAppointment.status ||
                                    "Scheduled"}
                            </span>

                        </div>



                        {/* =================================================
                            APPOINTMENT DETAILS
                            ================================================= */}

                        <div className="dashboard-detail-grid">


                            <div className="dashboard-detail">

                                <label>
                                    Appointment Type
                                </label>

                                <span>

                                    {selectedAppointment.title ||
                                        "Appointment"}

                                </span>

                            </div>


                            <div className="dashboard-detail">

                                <label>
                                    Date
                                </label>

                                <span>

                                    {formatDate(
                                        selectedAppointment.appointment_date
                                    )}

                                </span>

                            </div>


                            <div className="dashboard-detail">

                                <label>
                                    Time
                                </label>

                                <span>

                                    {formatTime(
                                        selectedAppointment.start_time
                                    )}

                                    {" - "}

                                    {formatTime(
                                        selectedAppointment.end_time
                                    )}

                                </span>

                            </div>


                            <div className="dashboard-detail">

                                <label>
                                    Provider
                                </label>

                                <span>

                                    {selectedAppointment.provider_first_name
                                        ? `${selectedAppointment.provider_first_name} ${selectedAppointment.provider_last_name || ""}`
                                        : "No Provider"}

                                </span>

                            </div>


                        </div>



                        {/* =================================================
                            PATIENT INFORMATION
                            ================================================= */}

                        <div className="dashboard-patient-section">

                            <h3>
                                Patient Information
                            </h3>


                            <div className="dashboard-patient-grid">


                                <div>

                                    <label>
                                        First Name
                                    </label>

                                    <span>

                                        {selectedAppointment.patient_first_name ||
                                            "N/A"}

                                    </span>

                                </div>


                                <div>

                                    <label>
                                        Last Name
                                    </label>

                                    <span>

                                        {selectedAppointment.patient_last_name ||
                                            "N/A"}

                                    </span>

                                </div>


                                <div>

                                    <label>
                                        Date of Birth
                                    </label>

                                    <span>

                                        {selectedAppointment.date_of_birth
                                            ? selectedAppointment.date_of_birth.slice(
                                                  0,
                                                  10
                                              )
                                            : "N/A"}

                                    </span>

                                </div>


                                <div>

                                    <label>
                                        Health Card
                                    </label>

                                    <span>

                                        {selectedAppointment.health_card ||
                                            "N/A"}

                                    </span>

                                </div>


                                <div>

                                    <label>
                                        Phone
                                    </label>

                                    <span>

                                        {selectedAppointment.phone ||
                                            "N/A"}

                                    </span>

                                </div>


                                <div>

                                    <label>
                                        Emergency Contact
                                    </label>

                                    <span>

                                        {selectedAppointment.emergency_contact ||
                                            "N/A"}

                                    </span>

                                </div>


                            </div>

                        </div>



                        {/* =================================================
                            MEDICAL INFORMATION
                            ================================================= */}

                        <div className="dashboard-medical-info">

                            <h3>
                                Medical Information
                            </h3>


                            <div>

                                <label>
                                    Medications
                                </label>

                                <p>

                                    {selectedAppointment.medications ||
                                        "None provided"}

                                </p>

                            </div>


                            <div>

                                <label>
                                    Medical History
                                </label>

                                <p>

                                    {selectedAppointment.medical_history ||
                                        "None provided"}

                                </p>

                            </div>


                            <div>

                                <label>
                                    Reason
                                </label>

                                <p>

                                    {selectedAppointment.reason ||
                                        selectedAppointment.title ||
                                        "Blood Work"}

                                </p>

                            </div>


                            <div>

                                <label>
                                    Notes
                                </label>

                                <p>

                                    {selectedAppointment.notes ||
                                        "No notes"}

                                </p>

                            </div>


                        </div>



                        {/* =================================================
                            ERROR
                            ================================================= */}

                        {error && (

                            <div className="dashboard-modal-error">

                                {error}

                            </div>

                        )}



                        {/* =================================================
                            ACTIONS
                            ================================================= */}

                        <div className="dashboard-modal-actions">


                            {selectedAppointment.status !==
                                "Checked-In" && (

                                <button
                                    type="button"
                                    className="dashboard-check-in-button"
                                    onClick={handleCheckIn}
                                    disabled={actionLoading}
                                >

                                    {actionLoading
                                        ? "Checking In..."
                                        : "✓ Check In Patient"}

                                </button>

                            )}


                            {selectedAppointment.status ===
                                "Checked-In" && (

                                <div className="dashboard-checked-in">

                                    ✓ Patient Checked In

                                </div>

                            )}


                            <button
                                type="button"
                                className="dashboard-close-button"
                                onClick={closeAppointment}
                                disabled={actionLoading}
                            >

                                Close

                            </button>


                        </div>


                    </div>

                </div>

            )}

        </>

    );

}