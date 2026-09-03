import { Outlet, useNavigate } from "react-router-dom";

import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

import "./dashboardLayout.css";


export default function DashboardLayout() {

    const navigate = useNavigate();


    const token =
        localStorage.getItem("token");


    const storedUser =
        localStorage.getItem("user");


    const user =
        storedUser
            ? JSON.parse(storedUser)
            : null;


    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login", {
            replace: true
        });

    };


    return (

        <div className="dashboard-layout">

            <DashboardSidebar
                onLogout={handleLogout}
            />


            <div className="dashboard-main">

                <DashboardTopbar
                    user={user}
                />


                <main className="dashboard-page">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}