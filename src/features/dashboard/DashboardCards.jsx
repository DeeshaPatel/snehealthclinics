export default function DashboardCards({ stats }) {

    return (

        <div className="dashboard-cards">

            {/* Patients */}

            <div className="dashboard-card">

                <div className="card-icon">
                    👥
                </div>

                <div className="card-content">

                    <span className="card-label">
                        Total Patients
                    </span>

                    <strong className="card-value">
                        {stats.totalPatients}
                    </strong>

                </div>

            </div>


            {/* Appointments */}

            <div className="dashboard-card">

                <div className="card-icon">
                    📅
                </div>

                <div className="card-content">

                    <span className="card-label">
                        Today's Appointments
                    </span>

                    <strong className="card-value">
                        {stats.todayAppointments}
                    </strong>

                </div>

            </div>


            {/* Providers */}

            <div className="dashboard-card">

                <div className="card-icon">
                    👨‍⚕️
                </div>

                <div className="card-content">

                    <span className="card-label">
                        Providers
                    </span>

                    <strong className="card-value">
                        {stats.totalProviders}
                    </strong>

                </div>

            </div>

        </div>

    );

}