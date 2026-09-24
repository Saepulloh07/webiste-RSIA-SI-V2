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

import { RoleGuard } from "@/components/auth/RoleGuard";

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
      {
        index: true,
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin", "Editor"]}>
            <Dashboard />
          </RoleGuard>
        ),
      },
      {
        path: "doctors",
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin"]}>
            <ManageDoctors />
          </RoleGuard>
        ),
      },
      {
        path: "services",
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin"]}>
            <ManageServices />
          </RoleGuard>
        ),
      },
      {
        path: "appointments",
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin"]}>
            <ManageAppointments />
          </RoleGuard>
        ),
      },
      {
        path: "articles",
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin", "Editor"]}>
            <ManageArticles />
          </RoleGuard>
        ),
      },
      {
        path: "users",
        element: (
          <RoleGuard allowedRoles={["Super Admin"]}>
            <ManageUsers />
          </RoleGuard>
        ),
      },
      {
        path: "ads",
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin", "Editor"]}>
            <ManageAds />
          </RoleGuard>
        ),
      },
      {
        path: "media",
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin", "Editor"]}>
            <ManageMedia />
          </RoleGuard>
        ),
      },
      {
        path: "settings",
        element: (
          <RoleGuard allowedRoles={["Super Admin"]}>
            <ManageSettings />
          </RoleGuard>
        ),
      },
      {
        path: "vacancies",
        element: (
          <RoleGuard allowedRoles={["Super Admin", "Admin", "Editor"]}>
            <ManageVacancies />
          </RoleGuard>
        ),
      },
    ],
  },
]);






