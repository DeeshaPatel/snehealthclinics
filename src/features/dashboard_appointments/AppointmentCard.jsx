export default function AppointmentCard({
    appointment,
    formatTime,
    onClick
}) {

    const patientName =
        `${appointment?.patient_first_name || ""} ${appointment?.patient_last_name || ""}`.trim();


    const appointmentTitle =
        appointment?.title ||
        appointment?.reason ||
        "Appointment";


    const providerName =
        `${appointment?.provider_first_name || ""} ${appointment?.provider_last_name || ""}`.trim();


    const status =
        appointment?.status || "";


    return (

        <button
            type="button"
            className="appointment-card"
            onClick={(event) => {

                event.stopPropagation();

                onClick?.(
                    appointment
                );

            }}
        >

            {/* TIME */}

            <div className="appointment-card-time">

                {formatTime(
                    appointment?.start_time
                )}

                <span>
                    –
                </span>

                {formatTime(
                    appointment?.end_time
                )}

            </div>


            {/* PATIENT */}

            <div className="appointment-card-patient">

                {patientName ||
                    "Unknown Patient"}

            </div>


            {/* TITLE */}

            <div className="appointment-card-title">

                {appointmentTitle}

            </div>


            {/* PROVIDER */}

            {providerName && (

                <div className="appointment-card-provider">

                    <span>
                        Dr.
                    </span>

                    {" "}

                    {providerName}

                </div>

            )}


            {/* STATUS */}

            {status && (

                <span
                    className={
                        `appointment-card-status ${
                            status
                                .toLowerCase()
                                .replace(
                                    /\s+/g,
                                    "-"
                                )
                        }`
                    }
                >
                    {status}
                </span>

            )}

        </button>

    );

}