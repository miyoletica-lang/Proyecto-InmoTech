import { Routes, Route } from 'react-router-dom'
import Navbar from './shared/components/Navbar'
import Footer from './shared/components/Footer'
import ScrollToTop from './shared/components/ScrollToTop'
import { Toaster } from './shared/components/ui/toaster'
import DashboardLayout from './shared/components/dashboard/Layout/DashboardLayout'
import PrivateRoute from './components/PrivateRoute'

// Pages
import HomePage from './features/properties/pages/HomePage'
import PropertiesPage from './features/properties/pages/PropertiesPage'
import PropertyDetailsPage from './features/properties/pages/PropertyDetailsPage'
import ContactPage from './features/contact/pages/ContactPage'
import AboutPage from './features/about/pages/AboutPage'
import ServicesPage from './features/services/pages/ServicesPage'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'

// Dashboard pages
import DashboardPage from './features/dashboard/DashboardPage'
import { SalesManagementPage } from './features/dashboard/pages/sales/pages/SalesManagementPage'
import { BuyersManagementPage } from './features/dashboard/pages/sales/pages/BuyerManagementPage'
import { LeasesManagementPage } from './features/dashboard/pages/leases/pages/LeasesManagementPage'
import { RenantManagementPage } from './features/dashboard/pages/leases/pages/RenantManagementPage'
import AppointmentPage from './features/dashboard/pages/appointment/AppointmentPage'
import Reports from './features/dashboard/pages/reports/Reports'
import Roles from './features/dashboard/pages/roles/Roles'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Routes>

        {/* Public routes with navbar and footer */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/inmuebles"
          element={
            <>
              <Navbar />
              <PropertiesPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/inmuebles/:id"
          element={
            <>
              <Navbar />
              <PropertyDetailsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/contactanos"
          element={
            <>
              <Navbar />
              <ContactPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/nosotros"
          element={
            <>
              <Navbar />
              <AboutPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/servicios"
          element={
            <>
              <Navbar />
              <ServicesPage />
              <Footer />
            </>
          }
        />

        {/* Auth routes with navbar/footer */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <LoginPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/registro"
          element={
            <>
              <Navbar />
              <RegisterPage />
              <Footer />
            </>
          }
        />

        {/* Dashboard routes with sidebar layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['Empleado', 'Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/salesManagement"
          element={
            <PrivateRoute roles={['Empleado', 'Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <SalesManagementPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/buyersManagement"
          element={
            <PrivateRoute roles={['Empleado', 'Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <BuyersManagementPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/leasesManagement"
          element={
            <PrivateRoute roles={['Empleado', 'Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <LeasesManagementPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/renantManagement"
          element={
            <PrivateRoute roles={['Empleado', 'Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <RenantManagementPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/citas"
          element={
            <PrivateRoute roles={['Empleado', 'Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <AppointmentPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes/gestion"
          element={
            <PrivateRoute roles={['Empleado', 'Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/seguridad/roles"
          element={
            <PrivateRoute roles={['Administrador', 'Super Administrador']}>
              <DashboardLayout>
                <Roles />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App
