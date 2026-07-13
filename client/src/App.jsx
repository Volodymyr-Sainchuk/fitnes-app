import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ClassesPage from "./pages/ClassesPage/ClassesPage.jsx";
import TrainersPage from "./pages/TrainersPage/TrainersPage.jsx";
import MembershipsPage from "./pages/MembershipsPage/MembershipsPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import AIConsultant from "./components/common/AIConsultant/AIConsultant.jsx";
import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";

const VirtualTourPage = lazy(() => import("./features/virtual-tour/VirtualTourPage.tsx"));

function AppContent() {
  const location = useLocation();
  const inTour = location.pathname.startsWith("/virtual-tour");

  return (
    <>
      <Suspense fallback={<div className="tour-route-loading">Завантаження Virtual Tour...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/memberships" element={<MembershipsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/virtual-tour" element={<VirtualTourPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {inTour ? null : <AIConsultant />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
