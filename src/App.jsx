import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthSync } from "./hooks/useAuthSync";
import { useAdsSync } from "./hooks/useAdsSync";
import DynamicNavbar from "./components/DynamicNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

// Auth pages
import Connexion from "./pages/auth/Connexion";
import Inscription from "./pages/auth/Inscription";

// User pages
import Home from "./pages/user/Home";
import Recherche from "./pages/user/Recherche";
import AnnonceDetail from "./pages/user/AnnonceDetail";
import Publier from "./pages/user/Publier";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdsPage from "./pages/admin/AdsPage";
import UsersPage from "./pages/admin/UsersPage";

export default function App() {
  useAuthSync();
  useAdsSync();

  return (
    <>
      <DynamicNavbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/recherche" element={<Recherche />} />
        <Route path="/annonce/:id" element={<AnnonceDetail />} />

        <Route
          path="/connexion"
          element={
            <ProtectedRoute allowedRoles={[]} redirectIfAuthenticated={true}>
              <Connexion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inscription"
          element={
            <ProtectedRoute allowedRoles={[]} redirectIfAuthenticated={true}>
              <Inscription />
            </ProtectedRoute>
          }
        />

        {/* Protected routes - User or Admin */}
        <Route
          path="/publier"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Publier />
            </ProtectedRoute>
          }
        />

        {/* Admin only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="ads" element={<AdsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
