import { Bell } from "lucide-react";


export default function DashboardTopbar({
    user
}) {

    const firstName =
        user?.firstName || "User";

    const lastName =
        user?.lastName || "";


    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`
            .toUpperCase();


    return (

        <header className="dashboard-topbar">

            <div className="topbar-left">

                <div>

                    <h2>
                        SNE Health Clinic
                    </h2>

                    <span>
                        Staff Management Portal
                    </span>

                </div>

            </div>


            <div className="topbar-right">

                <button
                    className="notification-button"
                    type="button"
                >

                    <Bell size={19} />

                    <span className="notification-dot">
                    </span>

                </button>


                <div className="topbar-user">

                    <div className="user-avatar">

                        {initials}

                    </div>


                    <div className="user-details">

                        <strong>

                            {firstName} {lastName}

                        </strong>

                        <span>
                            {user?.role || "Staff"}
                        </span>

                    </div>

                </div>

            </div>

        </header>

    );

}