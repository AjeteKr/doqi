import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RoleGuard, { ROLES } from './components/RoleGuard'
import RedirectByRole from './components/RedirectByRole'
import AdminLayout from './layouts/AdminLayout'
import StaffLayout from './layouts/StaffLayout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Products from './pages/Products/Products'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Favorites from './pages/Favorites'
import Starflex from './pages/Starflex/Starflex'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import NotFound from './pages/NotFound'
import NotFound404 from './pages/NotFound404'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminUsers from './pages/Admin/Users'
import AdminProducts from './pages/Admin/Products'
import AdminSettings from './pages/Admin/Settings'
import AdminMessages from './pages/Admin/Messages'
import StaffDashboard from './pages/Staff/Dashboard'
import StaffProducts from './pages/Staff/Products'
import StaffJobs from './pages/Staff/Jobs'
import StaffApplications from './pages/Staff/Applications'
import Careers from './pages/Careers'

function AppContent() {
  const location = useLocation();
  const hideNavFooter = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/reset-password',
    '/404'
  ].includes(location.pathname) || 
  location.pathname.startsWith('/admin') || 
  location.pathname.startsWith('/staff');

  const hideFooterOnly = location.pathname === '/profile';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <RedirectByRole>
        {!hideNavFooter && <Navbar />}
        <main>
          <Routes>
            {/* Public Routes - Accessible to all */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/404" element={<NotFound404 />} />
            
            {/* Public Routes - Accessible to everyone (no authentication required) */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/starflex" element={<Starflex />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            
            {/* Protected Routes - Require authentication */}
            <Route path="/favorites" element={
              <RoleGuard allowedRoles={[ROLES.USER, ROLES.PREMIUM]} currentPath="/favorites">
                <Favorites />
              </RoleGuard>
            } />
            <Route path="/profile" element={
              <RoleGuard allowedRoles={[ROLES.USER, ROLES.PREMIUM]} currentPath="/profile">
                <Profile />
              </RoleGuard>
            } />
            
            {/* Admin Routes - ONLY for admins (role 1) */}
            <Route path="/admin" element={
              <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout />
              </RoleGuard>
            }>
              <Route path="dashboard" element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]} currentPath="/admin/dashboard">
                  <AdminDashboard />
                </RoleGuard>
              } />
              <Route path="products" element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]} currentPath="/admin/products">
                  <AdminProducts />
                </RoleGuard>
              } />
              <Route path="orders" element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]} currentPath="/admin/orders">
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Admin Orders Management</h1>
                    <p className="text-gray-600 mt-2">Order management coming soon...</p>
                  </div>
                </RoleGuard>
              } />
              <Route path="users" element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]} currentPath="/admin/users">
                  <AdminUsers />
                </RoleGuard>
              } />
              <Route path="settings" element={
                <RoleGuard allowedRoles={[ROLES.ADMIN]} currentPath="/admin/settings">
                  <AdminSettings />
                </RoleGuard>
              } />
            </Route>
            
            {/* Staff Routes - ONLY for staff (role 2) */}
            <Route path="/staff" element={
              <RoleGuard allowedRoles={[ROLES.STAFF]}>
                <StaffLayout />
              </RoleGuard>
            }>
              <Route path="dashboard" element={
                <RoleGuard allowedRoles={[ROLES.STAFF]} currentPath="/staff/dashboard">
                  <StaffDashboard />
                </RoleGuard>
              } />
              <Route path="messages" element={
                <RoleGuard allowedRoles={[ROLES.STAFF]} currentPath="/staff/messages">
                  <AdminMessages />
                </RoleGuard>
              } />
              <Route path="orders" element={
                <RoleGuard allowedRoles={[ROLES.STAFF]} currentPath="/staff/orders">
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Staff Orders</h1>
                    <p className="text-gray-600 mt-2">Order management coming soon...</p>
                  </div>
                </RoleGuard>
              } />
              <Route path="products" element={
                <RoleGuard allowedRoles={[ROLES.STAFF]} currentPath="/staff/products">
                  <StaffProducts />
                </RoleGuard>
              } />
              <Route path="jobs" element={
                <RoleGuard allowedRoles={[ROLES.STAFF]} currentPath="/staff/jobs">
                  <StaffJobs />
                </RoleGuard>
              } />
              <Route path="applications" element={
                <RoleGuard allowedRoles={[ROLES.STAFF]} currentPath="/staff/applications">
                  <StaffApplications />
                </RoleGuard>
              } />
            </Route>
            
            {/* Catch-all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!hideNavFooter && !hideFooterOnly && <Footer />}
      </RedirectByRole>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App