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
                        {stats?.totalPatients ?? 0}
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
                        {stats?.todayAppointments ?? 0}
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
                        {stats?.totalProviders ?? 0}
                    </strong>

                </div>

            </div>


            {/* Blood Work */}

            <div className="dashboard-card">

                <div className="card-icon">
                    🩸
                </div>

                <div className="card-content">

                    <span className="card-label">
                        Blood Work Today
                    </span>

                    <strong className="card-value">
                        {stats?.bloodWorkToday ?? 0}
                    </strong>

                </div>

            </div>

        </div>

    );

}