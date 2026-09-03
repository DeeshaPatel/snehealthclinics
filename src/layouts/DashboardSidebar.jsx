import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Stethoscope,
    UserCog,
    Settings,
    LogOut
} from "lucide-react";


export default function DashboardSidebar({
    onLogout
}) {

    const navigation = [

        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },

        {
            label: "Patients",
            path: "/patients",
            icon: Users
        },

        {
            label: "Appointments",
            path: "/appointments",
            icon: CalendarDays
        },

        {
            label: "Providers",
            path: "/providers",
            icon: Stethoscope
        },

        {
            label: "Users",
            path: "/users",
            icon: UserCog
        },

        {
            label: "Settings",
            path: "/settings",
            icon: Settings
        }

    ];

    const storedUser =
        localStorage.getItem("user");

    const user =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    return (

        <aside className="dashboard-sidebar">

            {/* Logo */}

            <div className="sidebar-logo">

                <div className="sidebar-logo-icon">
                    S
                </div>

                <div>

                    <strong>
                        SNE Health
                    </strong>

                    <span>
                        Clinic Portal
                    </span>

                </div>

            </div>


            {/* Navigation */}

            <nav className="sidebar-navigation">

                <p className="sidebar-section-title">
                    MAIN MENU
                </p>


                {navigation
                    .filter((item) => {

                        if (
                            item.path === "/providers" ||
                            item.path === "/users" ||
                            item.path === "/settings"
                        ) {

                            return user?.role === "admin";

                        }

                        return true;

                    })
                    .map((item) => {

                    const Icon = item.icon;


                    return (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <Icon size={19} />

                            <span>
                                {item.label}
                            </span>

                        </NavLink>

                    );

                })}

            </nav>


            {/* Bottom */}

            <div className="sidebar-bottom">

                <button
                    className="sidebar-logout"
                    onClick={onLogout}
                >

                    <LogOut size={18} />

                    <span>
                        Sign out
                    </span>

                </button>


                <div className="sidebar-version">

                    SNE Health Clinic

                    <span>
                        Staff Portal
                    </span>

                </div>

            </div>

        </aside>

    );

}