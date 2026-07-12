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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/memberships" element={<MembershipsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
