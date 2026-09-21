import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

import Home from "@/pages/public/Home";
import Doctors from "@/pages/public/Doctors";
import DoctorDetail from "@/pages/public/DoctorDetail";
import Appointment from "@/pages/public/Appointment";
import Services from "@/pages/public/Services";
import ServiceDetail from "@/pages/public/ServiceDetail";
import PatientInfo from "@/pages/public/PatientInfo";
import About from "@/pages/public/About";
import Facilities from "@/pages/public/Facilities";
import Articles from "@/pages/public/Articles";
import ArticleDetail from "@/pages/public/ArticleDetail";
import Contact from "@/pages/public/Contact";
import PromoMicrosite from "@/pages/public/PromoMicrosite";
import Vacancies from "@/pages/public/Vacancies";

import Dashboard from "@/pages/admin/Dashboard";
import ManageDoctors from "@/pages/admin/ManageDoctors";
import ManageServices from "@/pages/admin/ManageServices";
import ManageArticles from "@/pages/admin/ManageArticles";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageAds from "@/pages/admin/ManageAds";
import ManageMedia from "@/pages/admin/ManageMedia";
import ManageSettings from "@/pages/admin/ManageSettings";
import ManageAppointments from "@/pages/admin/ManageAppointments";
import ManageVacancies from "@/pages/admin/ManageVacancies";
import Login from "@/pages/admin/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "tentang-kami", element: <About /> },
      { path: "layanan", element: <Services /> },
      { path: "layanan/:slug", element: <ServiceDetail /> },
      { path: "dokter", element: <Doctors /> },
      { path: "dokter/:slug", element: <DoctorDetail /> },
      { path: "pendaftaran", element: <Appointment /> },
      { path: "informasi-pasien", element: <PatientInfo /> },
      { path: "artikel", element: <Articles /> },
      { path: "artikel/:slug", element: <ArticleDetail /> },
      { path: "fasilitas", element: <Facilities /> },
      { path: "kontak", element: <Contact /> },
      { path: "karir", element: <Vacancies /> },
    ],
  },
  {
    path: "/promo/:slug",
    element: <PromoMicrosite />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "doctors", element: <ManageDoctors /> },
      { path: "services", element: <ManageServices /> },
      { path: "appointments", element: <ManageAppointments /> },
      { path: "articles", element: <ManageArticles /> },
      { path: "users", element: <ManageUsers /> },
      { path: "ads", element: <ManageAds /> },
      { path: "media", element: <ManageMedia /> },
      { path: "settings", element: <ManageSettings /> },
      { path: "vacancies", element: <ManageVacancies /> },
    ],
  },
]);






