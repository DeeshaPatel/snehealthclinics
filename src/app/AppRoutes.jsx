import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../features/home/Home";
import About from "../features/about/About";
import Services from "../features/services/Services";
import Careers from "../features/careers/Careers";
import Contact from "../features/contact/Contact";
import BookAppointment from "../features/appointment/BookAppointment";

// Auth
import Login from "../features/auth/Login";

// Dashboard
import Dashboard from "../features/dashboard/Dashboard";
import Patients from "../features/patients/Patients";
import Appointments from "../features/dashboard_appointments/Appointment";
import Providers from "../features/providers/Providers";
import Reports from "../features/reports/Reports";
import Settings from "../features/settings/Settings";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Website */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

    </Routes>
  );
}