
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import RegisterSchoolPage from './pages/RegisterSchoolPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/SupabaseAuthContext';
import { Toaster } from "@/components/ui/toaster";

// Dashboard Imports
import DashboardLayout from './layouts/DashboardLayout';
import MainDashboard from './pages/dashboard/MainDashboard';
import StudentsPage from './pages/dashboard/StudentsPage';
import AcademicTermsPage from './pages/dashboard/AcademicTermsPage';
import ClassesPage from './pages/dashboard/ClassesPage';
import InvoicesPage from './pages/dashboard/InvoicesPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import SubscriptionPage from './pages/dashboard/SubscriptionPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import SettingsPage from './pages/dashboard/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-white">
          <Routes>
            {/* Public Layout Routes (Header/Footer handled inside layout or manually here) */}
            <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
            <Route path="/about" element={<><Header /><AboutPage /><Footer /></>} />
            <Route path="/features" element={<><Header /><FeaturesPage /><Footer /></>} />
            <Route path="/pricing" element={<><Header /><PricingPage /><Footer /></>} />
            <Route path="/contact" element={<><Header /><ContactPage /><Footer /></>} />
            <Route path="/register-school" element={<RegisterSchoolPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard Routes (Wrapped in Layout & ProtectedRoute) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<MainDashboard />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="academic-terms" element={<AcademicTermsPage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
