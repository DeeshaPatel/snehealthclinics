import { Outlet } from "react-router-dom";


export default function DashboardLayout(){

return (

<div className="dashboard-layout">


<aside className="sidebar">


<h2>
SNE Health
</h2>


<nav>


<a href="/dashboard">
Dashboard
</a>


<a href="/appointments">
Appointments
</a>


<a href="/patients">
Patients
</a>


<a href="/providers">
Providers
</a>


<a href="/reports">
Reports
</a>


<a href="/settings">
Settings
</a>


</nav>


</aside>



<div className="dashboard-content">


<header className="dashboard-header">


<h3>
Clinic Management
</h3>


<div>
Admin
</div>


</header>



<main>


<Outlet/>


</main>


</div>


</div>


)

}