import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages (Existing)
import HomePage from './pages/HomePage';
import AboutUs from './pages/public/AboutUs';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Classes from './pages/Classes';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';

// New Public Pages
import { Professionals, FAQ, JoinProfessional } from './pages/public';
import ProfessionalProfile from './pages/public/ProfessionalProfile';

// Dashboard Pages
import {
  UserDashboard,
  MyAppointments,
  AppointmentDetails,
  Messages,
  Favorites,
  UserProfile,
  PaymentHistory,
} from './pages/dashboard';

// Admin (Legacy)
import AdminDashboard from './pages/AdminDashboard';
import AdminClasses from './pages/AdminClasses';

// Admin Pages (New)
import {
  AdminDashboardNew,
  VerificationRequests,
  ProfessionalManagement,
  UserManagement,
  AppointmentsManagement,
  PaymentsManagement,
  ReviewsModeration,
  PlatformAnalytics,
} from './pages/admin';

// Professional Pages
import {
  ProfessionalDashboard,
  ProfessionalAppointments,
  Schedule,
  Clients,
  ClientDetail,
  Earnings,
  Payouts,
  RequestPayout,
  ProfessionalMessages,
  ProfileEdit,
  Services as ProfessionalServices,
  Availability,
  VerificationStatus,
  Settings as ProfessionalSettings,
} from './pages/professional';

// AI Components
import AIPracticeStudio from './components/AIPracticeStudio';
import AIPracticeStats from './components/AIPracticeStats';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/how-it-works" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/professionals/:type" element={<Professionals />} />
              <Route path="/professional/:id" element={<ProfessionalProfile />} />
              <Route path="/join-professional" element={<JoinProfessional />} />
              <Route path="/faq" element={<FAQ />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Client Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'client']} />}>
              <Route element={<DashboardLayout userType="client" />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/appointments" element={<MyAppointments />} />
                <Route path="/appointments/:id" element={<AppointmentDetails />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/payment-history" element={<PaymentHistory />} />
              </Route>
            </Route>

            {/* AI Practice (Full Screen) - Protected */}
            <Route path="/ai-practice" element={
              <ProtectedRoute allowedRoles={['user', 'client']}>
                <AIPracticeStudio />
              </ProtectedRoute>
            } />
            <Route path="/ai-practice/stats" element={
              <ProtectedRoute allowedRoles={['user', 'client']}>
                <AIPracticeStats />
              </ProtectedRoute>
            } />

            {/* Professional Routes */}
            <Route element={<ProtectedRoute allowedRoles={['professional']} />}>
              <Route element={<DashboardLayout userType="professional" />}>
                <Route path="/professional-dashboard" element={<ProfessionalDashboard />} />
                <Route path="/professional/appointments" element={<ProfessionalAppointments />} />
                <Route path="/professional/schedule" element={<Schedule />} />
                <Route path="/professional/clients" element={<Clients />} />
                <Route path="/professional/clients/:id" element={<ClientDetail />} />
                <Route path="/professional/earnings" element={<Earnings />} />
                <Route path="/professional/payouts" element={<Payouts />} />
                <Route path="/professional/payouts/request" element={<RequestPayout />} />
                <Route path="/professional/messages" element={<ProfessionalMessages />} />
                <Route path="/professional/profile-edit" element={<ProfileEdit />} />
                <Route path="/professional/services" element={<ProfessionalServices />} />
                <Route path="/professional/availability" element={<Availability />} />
                <Route path="/professional/verification-status" element={<VerificationStatus />} />
                <Route path="/professional/settings" element={<ProfessionalSettings />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout userType="admin" />}>
                <Route path="/admin" element={<AdminDashboardNew />} />
                <Route path="/admin/classes" element={<AdminClasses />} />
                <Route path="/admin/verification-requests" element={<VerificationRequests />} />
                <Route path="/admin/professionals" element={<ProfessionalManagement />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/appointments" element={<AppointmentsManagement />} />
                <Route path="/admin/payments" element={<PaymentsManagement />} />
                <Route path="/admin/reviews" element={<ReviewsModeration />} />
                <Route path="/admin/analytics" element={<PlatformAnalytics />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </ThemeProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
