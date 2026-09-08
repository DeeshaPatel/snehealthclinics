export default function DashboardCharts({ data }) {

    const todayAppointments =
        data?.todayAppointmentsList ?? [];

    const recentPatients =
        data?.recentPatients ?? [];

    const bloodWorkAppointments =
        data?.bloodWorkAppointments ?? [];


    return (

        <div className="dashboard-content">


            {/* =====================================================
                TODAY'S APPOINTMENTS
            ===================================================== */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Today's Appointments
                    </h2>

                    <span>
                        {data?.todayAppointments ?? 0}
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
                            There are no appointments scheduled
                            for today.
                        </p>

                    </div>

                ) : (

                    <div className="appointment-list">

                        {todayAppointments.map(
                            (appointment) => (

                                <div
                                    className="appointment-row"
                                    key={appointment.id}
                                >

                                    {/* Time */}

                                    <div className="appointment-time">

                                        {appointment.start_time}

                                    </div>


                                    {/* Patient / Appointment */}

                                    <div className="appointment-info">

                                        <strong>

                                            {appointment.patient_first_name}

                                            {" "}

                                            {appointment.patient_last_name}

                                        </strong>

                                        <span>

                                            {appointment.title}

                                        </span>

                                    </div>


                                    {/* Provider */}

                                    <div className="appointment-provider">

                                        Dr.{" "}

                                        {appointment.provider_first_name}

                                        {" "}

                                        {appointment.provider_last_name}

                                    </div>


                                    {/* Status */}

                                    <div className="appointment-status">

                                        {appointment.status}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =====================================================
                RECENT PATIENTS
            ===================================================== */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Recent Patients
                    </h2>

                </div>


                {recentPatients.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            👥
                        </div>

                        <h3>
                            No patients yet
                        </h3>

                        <p>
                            There are no patients in the system.
                        </p>

                    </div>

                ) : (

                    <div className="patient-list">

                        {recentPatients.map(
                            (patient) => (

                                <div
                                    className="patient-row"
                                    key={patient.id}
                                >

                                    {/* Patient Avatar */}

                                    <div className="patient-avatar">

                                        {patient.first_name
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                        {patient.last_name
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>


                                    {/* Patient Information */}

                                    <div className="patient-info">

                                        <strong>

                                            {patient.first_name}

                                            {" "}

                                            {patient.last_name}

                                        </strong>

                                        <span>

                                            {patient.phone || "No phone number"}

                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =====================================================
                BLOOD WORK APPOINTMENTS
            ===================================================== */}

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
                            There are no blood work appointments scheduled.
                        </p>

                    </div>

                ) : (

                    <div className="appointment-list">

                        {bloodWorkAppointments.map(
                            (appointment) => (

                                <div
                                    className="appointment-row"
                                    key={appointment.id}
                                >

                                    {/* Time */}

                                    <div className="appointment-time">

                                        {appointment.start_time}

                                    </div>


                                    {/* Patient */}

                                    <div className="appointment-info">

                                        <strong>

                                            {appointment.patient_first_name}

                                            {" "}

                                            {appointment.patient_last_name}

                                        </strong>

                                        <span>
                                            🩸 Blood Work
                                        </span>

                                    </div>


                                    {/* Provider */}

                                    <div className="appointment-provider">

                                        Dr.{" "}

                                        {appointment.provider_first_name}

                                        {" "}

                                        {appointment.provider_last_name}

                                    </div>


                                    {/* Status */}

                                    <div className="appointment-status">

                                        {appointment.status}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


        </div>

    );

}