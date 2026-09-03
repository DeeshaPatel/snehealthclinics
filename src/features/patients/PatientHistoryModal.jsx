import {
    X,
    UserRound,
    CalendarDays,
    Clock,
    FileText,
    Pill,
    Stethoscope
} from "lucide-react";

import "./patients.css";


export default function PatientHistoryModal({
    patient,
    history,
    loading,
    onClose
}) {

    return (

        <div
            className="modal-backdrop"
            onClick={onClose}
        >

            <div
                className="patient-history-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="history-modal-header">

                    <div className="history-patient-info">

                        <div className="history-avatar">

                            {patient.first_name?.charAt(0)}
                            {patient.last_name?.charAt(0)}

                        </div>

                        <div>

                            <h2>
                                {patient.first_name}{" "}
                                {patient.last_name}
                            </h2>

                            <p>
                                Patient #{patient.id}
                            </p>

                        </div>

                    </div>


                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* PATIENT SUMMARY */}

                <div className="patient-history-summary">

                    <div className="history-summary-card">

                        <span>
                            Date of Birth
                        </span>

                        <strong>

                            {patient.date_of_birth
                                ? new Date(
                                    patient.date_of_birth
                                ).toLocaleDateString(
                                    "en-US"
                                )
                                : "Not provided"}

                        </strong>

                    </div>


                    <div className="history-summary-card">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {patient.phone || "Not provided"}
                        </strong>

                    </div>


                    <div className="history-summary-card">

                        <span>
                            Health Card
                        </span>

                        <strong>
                            {patient.health_card || "Not provided"}
                        </strong>

                    </div>

                </div>


                {/* MEDICAL INFORMATION */}

                <div className="history-section">

                    <div className="history-section-title">

                        <div className="history-section-icon">
                            <Pill size={18} />
                        </div>

                        <div>

                            <h3>
                                Medical Information
                            </h3>

                            <p>
                                Current patient information
                            </p>

                        </div>

                    </div>


                    <div className="medical-history-grid">

                        <div>

                            <label>
                                Medications
                            </label>

                            <p>
                                {patient.medications ||
                                    "No medications recorded."}
                            </p>

                        </div>


                        <div>

                            <label>
                                Medical History
                            </label>

                            <p>
                                {patient.medical_history ||
                                    "No medical history recorded."}
                            </p>

                        </div>


                        <div>

                            <label>
                                Emergency Contact
                            </label>

                            <p>
                                {patient.emergency_contact ||
                                    "Not provided"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* APPOINTMENT HISTORY */}

                <div className="patient-history-scroll">
                    <div className="history-section">

                        <div className="history-section-title">

                            <div className="history-section-icon">
                                <CalendarDays size={18} />
                            </div>

                            <div>

                                <h3>
                                    Appointment History
                                </h3>

                                <p>
                                    Previous visits and clinical notes
                                </p>

                            </div>

                        </div>


                        {loading ? (

                            <div className="history-loading">

                                Loading patient history...

                            </div>

                        ) : history.length === 0 ? (

                            <div className="history-empty">

                                <CalendarDays size={32} />

                                <h4>
                                    No appointment history
                                </h4>

                                <p>
                                    This patient has no recorded appointments yet.
                                </p>

                            </div>

                        ) : (

                            <div className="appointment-history-list">

                                {history.map(
                                    (appointment) => (

                                        <div
                                            className="history-appointment-card"
                                            key={appointment.id}
                                        >

                                            {/* DATE */}

                                            <div className="history-date">

                                                <CalendarDays size={18} />

                                                <div>

                                                    <strong>

                                                        {new Date(
                                                            appointment.appointment_date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                weekday: "long",
                                                                month: "long",
                                                                day: "numeric",
                                                                year: "numeric"
                                                            }
                                                        )}

                                                    </strong>

                                                    <span>

                                                        <Clock size={14} />

                                                        {formatTime(
                                                            appointment.start_time
                                                        )}

                                                        {" – "}

                                                        {formatTime(
                                                            appointment.end_time
                                                        )}

                                                    </span>

                                                </div>

                                            </div>


                                            {/* STATUS */}

                                            <span
                                                className={
                                                    `history-status ${
                                                        appointment.status
                                                            ?.toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )
                                                    }`
                                                }
                                            >
                                                {appointment.status}
                                            </span>


                                            {/* DETAILS */}

                                            <div className="history-appointment-details">

                                                <div>

                                                    <label>
                                                        Appointment
                                                    </label>

                                                    <strong>
                                                        {appointment.title ||
                                                            "Appointment"}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <label>
                                                        Provider
                                                    </label>

                                                    <strong>

                                                        <Stethoscope
                                                            size={15}
                                                        />

                                                        Dr.{" "}
                                                        {appointment.provider_first_name}{" "}
                                                        {appointment.provider_last_name}

                                                    </strong>

                                                </div>


                                                <div>

                                                    <label>
                                                        Reason
                                                    </label>

                                                    <p>
                                                        {appointment.reason ||
                                                            "No reason recorded."}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* NOTES */}

                                            <div className="appointment-notes">

                                                <div className="notes-header">

                                                    <FileText
                                                        size={16}
                                                    />

                                                    <strong>
                                                        Clinical Notes
                                                    </strong>

                                                </div>

                                                <p>

                                                    {appointment.notes
                                                        ? appointment.notes
                                                        : "No notes recorded for this appointment."}

                                                </p>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                        </div>
                </div>

                


                {/* FOOTER */}

                <div className="history-modal-footer">

                    <button
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );

}


function formatTime(time) {

    if (!time) return "";

    const [
        hours,
        minutes
    ] = time.split(":");


    const date = new Date();

    date.setHours(
        Number(hours),
        Number(minutes)
    );


    return date.toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}