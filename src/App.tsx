import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SEOManager from './components/SEOManager';

// Public pages
import Landing from './pages/Landing';
import Brand from './pages/Brand';
import BrandForm from './pages/BrandForm';
import KOL from './pages/KOL';
import KOLRegister from './pages/KOLRegister';
import Portfolio from './pages/Portfolio';

// Admin pages are not SEO targets, so keep them out of the initial public bundle.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const BrandDetail = lazy(() => import('./pages/admin/BrandDetail'));
const KOLs = lazy(() => import('./pages/admin/KOLs'));
const KOLDetail = lazy(() => import('./pages/admin/KOLDetail'));
const PortfolioManager = lazy(() => import('./pages/admin/PortfolioManager'));

function RouteFallback() {
  return <div style={{ minHeight: '100vh', background: '#f8f9ff' }} />;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function ProtectedRoute() {
  const token = localStorage.getItem('azera_token');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SEOManager />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/brand/form" element={<BrandForm />} />
            <Route path="/kol" element={<KOL />} />
            <Route path="/kol/register" element={<KOLRegister />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Route>

          {/* Admin login — no layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/admin/brands" replace />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:id" element={<BrandDetail />} />
            <Route path="kols" element={<KOLs />} />
            <Route path="kols/:id" element={<KOLDetail />} />
            <Route path="portfolio" element={<PortfolioManager />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
