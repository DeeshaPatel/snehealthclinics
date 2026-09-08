import { useState } from "react";

import {
    CalendarDays,
    Clock,
    Stethoscope,
    UserRound,
    Phone,
    HeartPulse,
    FileText,
    X
} from "lucide-react";

import { updateAppointment } from "../../api/appointmentApi";


function formatTime(time) {

    if (!time) {
        return "";
    }

    const cleanTime =
        String(time).slice(0, 5);

    const [hours, minutes] =
        cleanTime.split(":");

    let hour =
        Number(hours);

    const suffix =
        hour >= 12
            ? "PM"
            : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minutes} ${suffix}`;
}


function formatDate(date) {

    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


export default function DashboardCharts({
    data,
    onRefresh
}) {

    const [selectedAppointment, setSelectedAppointment] =
        useState(null);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // OPEN APPOINTMENT
    // =========================================================

    function handleAppointmentClick(appointment) {

        setError("");

        setSelectedAppointment(
            appointment
        );

    }


    // =========================================================
    // CLOSE MODAL
    // =========================================================

    function closeAppointment() {

        if (actionLoading) {
            return;
        }

        setSelectedAppointment(
            null
        );

    }


    // =========================================================
    // CHECK IN PATIENT
    // =========================================================

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


            // Update modal immediately

            setSelectedAppointment(
                previous => ({
                    ...previous,
                    status: "Checked-In"
                })
            );


            // Reload dashboard data

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
                err?.response?.data?.error ||
                "Unable to check in patient."
            );

        } finally {

            setActionLoading(false);

        }

    }


    const todayAppointments =
        data?.todayAppointmentsList || [];


    const bloodWorkAppointments =
        data?.bloodWorkAppointments || [];


    const recentPatients =
        data?.recentPatients || [];


    return (

        <div className="dashboard-content">


            {/* =================================================
                TODAY'S APPOINTMENTS
            ================================================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Today's Appointments
                    </h2>

                    <span>
                        {data?.todayAppointments || 0}
                    </span>

                </div>


                {todayAppointments.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            📅
                        </div>

                        <h3>
                            No appointments today
                        </h3>

                        <p>
                            There are no regular appointments
                            scheduled for today.
                        </p>

                    </div>

                ) : (

                    <div className="appointment-list">

                        {todayAppointments.map(
                            appointment => (

                                <button
                                    type="button"
                                    className="appointment-row dashboard-appointment-clickable"
                                    key={appointment.id}
                                    onClick={() =>
                                        handleAppointmentClick(
                                            appointment
                                        )
                                    }
                                >

                                    <div className="appointment-time">

                                        {formatTime(
                                            appointment.start_time
                                        )}

                                    </div>


                                    <div className="appointment-info">

                                        <strong>

                                            {
                                                appointment.patient_first_name
                                            }

                                            {" "}

                                            {
                                                appointment.patient_last_name
                                            }

                                        </strong>

                                        <span>
                                            {appointment.title}
                                        </span>

                                    </div>


                                    <div className="appointment-provider">

                                        Dr.{" "}

                                        {
                                            appointment.provider_first_name
                                        }

                                        {" "}

                                        {
                                            appointment.provider_last_name
                                        }

                                    </div>


                                    <div className="appointment-status">

                                        {appointment.status}

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                RECENT PATIENTS
            ================================================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Recent Patients
                    </h2>

                </div>


                <div className="patient-list">

                    {recentPatients.map(
                        patient => (

                            <div
                                className="patient-row"
                                key={patient.id}
                            >

                                <div className="patient-avatar">

                                    {patient.first_name
                                        ?.charAt(0)}

                                    {patient.last_name
                                        ?.charAt(0)}

                                </div>


                                <div className="patient-info">

                                    <strong>

                                        {patient.first_name}

                                        {" "}

                                        {patient.last_name}

                                    </strong>

                                    <span>

                                        {patient.phone}

                                    </span>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* =================================================
                BLOOD WORK APPOINTMENTS
            ================================================= */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Blood Work Appointments
                    </h2>

                    <span>
                        {bloodWorkAppointments.length}
                    </span>

                </div>


                {bloodWorkAppointments.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🩸
                        </div>

                        <h3>
                            No blood work appointments
                        </h3>

                        <p>
                            There are no blood work appointments
                            scheduled for today.
                        </p>

                    </div>

                ) : (

                    <div className="appointment-list">

                        {bloodWorkAppointments.map(
                            appointment => (

                                <button
                                    type="button"
                                    className="appointment-row dashboard-appointment-clickable"
                                    key={appointment.id}
                                    onClick={() =>
                                        handleAppointmentClick(
                                            appointment
                                        )
                                    }
                                >

                                    <div className="appointment-time">

                                        {formatTime(
                                            appointment.start_time
                                        )}

                                    </div>


                                    <div className="appointment-info">

                                        <strong>

                                            {
                                                appointment.patient_first_name
                                            }

                                            {" "}

                                            {
                                                appointment.patient_last_name
                                            }

                                        </strong>

                                        <span>
                                            🩸 Blood Work
                                        </span>

                                    </div>


                                    <div className="appointment-provider">

                                        Dr.{" "}

                                        {
                                            appointment.provider_first_name
                                        }

                                        {" "}

                                        {
                                            appointment.provider_last_name
                                        }

                                    </div>


                                    <div className="appointment-status">

                                        {appointment.status}

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                APPOINTMENT DETAILS MODAL
            ================================================= */}

            {selectedAppointment && (

                <div
                    className="dashboard-appointment-overlay"
                    onClick={closeAppointment}
                >

                    <div
                        className="dashboard-appointment-modal"
                        onClick={event =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="dashboard-modal-header">

                            <div>

                                <span className="modal-eyebrow">
                                    APPOINTMENT DETAILS
                                </span>

                                <h2>
                                    {selectedAppointment.patient_first_name}{" "}
                                    {selectedAppointment.patient_last_name}
                                </h2>

                            </div>


                            <button
                                type="button"
                                className="dashboard-modal-close"
                                onClick={closeAppointment}
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* STATUS */}

                        <div className="dashboard-modal-status">

                            <span
                                className={`appointment-status-badge ${
                                    selectedAppointment.status
                                        ?.toLowerCase()
                                        .replace(
                                            /\s+/g,
                                            "-"
                                        )
                                }`}
                            >
                                {selectedAppointment.status}
                            </span>

                        </div>


                        {/* APPOINTMENT */}

                        <div className="dashboard-detail-grid">

                            <div className="dashboard-detail">

                                <CalendarDays size={17} />

                                <div>

                                    <strong>
                                        Date
                                    </strong>

                                    <p>
                                        {formatDate(
                                            selectedAppointment.appointment_date
                                        )}
                                    </p>

                                </div>

                            </div>


                            <div className="dashboard-detail">

                                <Clock size={17} />

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


                            <div className="dashboard-detail">

                                <FileText size={17} />

                                <div>

                                    <strong>
                                        Appointment Type
                                    </strong>

                                    <p>
                                        {selectedAppointment.title}
                                    </p>

                                </div>

                            </div>


                            <div className="dashboard-detail">

                                <Stethoscope size={17} />

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

                        </div>


                        {/* PATIENT INFORMATION */}

                        <div className="dashboard-patient-section">

                            <h3>
                                <UserRound size={18} />
                                Patient Information
                            </h3>


                            <div className="dashboard-patient-grid">

                                <div>

                                    <span>
                                        Full Name
                                    </span>

                                    <strong>

                                        {
                                            selectedAppointment.patient_first_name
                                        }

                                        {" "}

                                        {
                                            selectedAppointment.patient_last_name
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Date of Birth
                                    </span>

                                    <strong>

                                        {
                                            selectedAppointment.date_of_birth
                                                ?.slice(0, 10) ||
                                            "Not provided"
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Health Card
                                    </span>

                                    <strong>

                                        {
                                            selectedAppointment.health_card ||
                                            "Not provided"
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Phone
                                    </span>

                                    <strong>

                                        <Phone
                                            size={14}
                                        />

                                        {
                                            selectedAppointment.phone ||
                                            "Not provided"
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Emergency Contact
                                    </span>

                                    <strong>

                                        {
                                            selectedAppointment.emergency_contact ||
                                            "Not provided"
                                        }

                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* MEDICAL INFORMATION */}

                        <div className="dashboard-patient-section">

                            <h3>
                                <HeartPulse size={18} />
                                Medical Information
                            </h3>


                            <div className="dashboard-medical-info">

                                <div>

                                    <span>
                                        Medications
                                    </span>

                                    <p>

                                        {
                                            selectedAppointment.medications ||
                                            "No medications recorded."
                                        }

                                    </p>

                                </div>


                                <div>

                                    <span>
                                        Medical History
                                    </span>

                                    <p>

                                        {
                                            selectedAppointment.medical_history ||
                                            "No medical history recorded."
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* REASON / NOTES */}

                        <div className="dashboard-patient-section">

                            <h3>
                                <FileText size={18} />
                                Appointment Information
                            </h3>


                            <div className="dashboard-medical-info">

                                <div>

                                    <span>
                                        Reason
                                    </span>

                                    <p>

                                        {
                                            selectedAppointment.reason ||
                                            "No reason recorded."
                                        }

                                    </p>

                                </div>


                                <div>

                                    <span>
                                        Notes
                                    </span>

                                    <p>

                                        {
                                            selectedAppointment.notes ||
                                            "No notes recorded."
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="dashboard-modal-error">
                                {error}
                            </div>

                        )}


                        {/* ACTIONS */}

                        <div className="dashboard-modal-actions">

                            {selectedAppointment.status !==
                                "Checked-In" && (

                                <button
                                    type="button"
                                    className="check-in-button"
                                    onClick={handleCheckIn}
                                    disabled={actionLoading}
                                >

                                    {actionLoading
                                        ? "Checking In..."
                                        : "Check In Patient"
                                    }

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

        </div>

    );

}