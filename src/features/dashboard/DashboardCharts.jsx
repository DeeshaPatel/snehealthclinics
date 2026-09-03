export default function DashboardCharts({ data }) {

    return (

        <div className="dashboard-content">


            {/* Today's Appointments */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Today's Appointments
                    </h2>

                    <span>
                        {data.todayAppointments}
                    </span>

                </div>


                {data.todayAppointmentsList.length === 0 ? (

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

                        {data.todayAppointmentsList.map(
                            (appointment) => (

                                <div
                                    className="appointment-row"
                                    key={appointment.id}
                                >

                                    <div className="appointment-time">

                                        {appointment.start_time}

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

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* Recent Patients */}

            <section className="dashboard-section">

                <div className="section-header">

                    <h2>
                        Recent Patients
                    </h2>

                </div>


                <div className="patient-list">

                    {data.recentPatients.map(
                        (patient) => (

                            <div
                                className="patient-row"
                                key={patient.id}
                            >

                                <div className="patient-avatar">

                                    {patient.first_name
                                        .charAt(0)}

                                    {patient.last_name
                                        .charAt(0)}

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

        </div>

    );

}