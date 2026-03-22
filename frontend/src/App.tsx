import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminGuard from './components/AdminGuard'
import AdminLayout from './components/AdminLayout'

import Home from './pages/Home'
import CohortFoodInsecurity from './pages/CohortFoodInsecurity'
import CohortClimateAction from './pages/CohortClimateAction'
import CohortHealthyFutures from './pages/CohortHealthyFutures'
import CohortK12Education from './pages/CohortK12Education'
import Contact from './pages/Contact'
import Updates from './pages/Updates'
import FAQ from './pages/FAQ'
import About from './pages/About'

import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Applicants from './pages/admin/Applicants'
import Contacts from './pages/admin/Contacts'
import Newsletters from './pages/admin/Newsletters'

import PortalLogin from './pages/portal/Login'
import MyApplication from './pages/portal/MyApplication'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public site */}
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/"                    element={<Home />} />
                    <Route path="/cohorts/food"        element={<CohortFoodInsecurity />} />
                    <Route path="/cohorts/climate"     element={<CohortClimateAction />} />
                    <Route path="/cohorts/health"      element={<CohortHealthyFutures />} />
                    <Route path="/cohorts/k12"         element={<CohortK12Education />} />
                    <Route path="/contact"             element={<Contact />} />
                    <Route path="/updates"             element={<Updates />} />
                    <Route path="/faq"                 element={<FAQ />} />
                    <Route path="/about"               element={<About />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* Applicant portal */}
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal" element={<MyApplication />} />

          {/* Admin login (no sidebar) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route
            path="/admin/*"
            element={
              <AdminGuard>
                <AdminLayout>
                  <Routes>
                    <Route path="/"            element={<Dashboard />} />
                    <Route path="/applicants"  element={<Applicants />} />
                    <Route path="/contacts"    element={<Contacts />} />
                    <Route path="/newsletters" element={<Newsletters />} />
                  </Routes>
                </AdminLayout>
              </AdminGuard>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
