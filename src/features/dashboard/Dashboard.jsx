import { useEffect, useState } from "react";

import { getDashboard } from "../../api/dashboardApi";

import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";

import "./dashboard.css";


export default function Dashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    const loadDashboard =
        async () => {

            try {

                setLoading(true);

                setError(null);

                const data =
                    await getDashboard();

                console.log(
                    "Dashboard data:",
                    data
                );

                setDashboard(data);

            } catch (error) {

                console.error(
                    "Dashboard loading error:",
                    error
                );

                setError(
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }

        };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                Loading dashboard...

            </div>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="dashboard-error">

                {error}

            </div>

        );

    }


    if (!dashboard) {

        return null;

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="dashboard">

            <div className="dashboard-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Welcome back to SNE Health Clinic
                    </p>

                </div>

            </div>


            <DashboardCards
                stats={dashboard}
            />


            <DashboardCharts
                data={dashboard}
                onRefresh={loadDashboard}
            />

        </div>

    );

}