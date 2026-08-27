import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Agentation } from 'agentation';
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
import CaseStudyDetail from './pages/CaseStudyDetail';
import CampaignApply from './pages/CampaignApply';
import InvoicePayment from './pages/InvoicePayment';

// Admin pages are not SEO targets, so keep them out of the initial public bundle.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const BrandDetail = lazy(() => import('./pages/admin/BrandDetail'));
const PortfolioManager = lazy(() => import('./pages/admin/PortfolioManager'));
const Campaigns = lazy(() => import('./pages/admin/Campaigns'));
const CampaignNew = lazy(() => import('./pages/admin/CampaignNew'));
const CampaignDetail = lazy(() => import('./pages/admin/CampaignDetail'));
const Import = lazy(() => import('./pages/admin/Import'));
const WhatsApp = lazy(() => import('./pages/admin/WhatsApp'));
const WaTemplates = lazy(() => import('./pages/admin/WaTemplates'));
const Broadcast = lazy(() => import('./pages/admin/Broadcast'));
const Creators = lazy(() => import('./pages/admin/Creators'));
const CreatorDetail = lazy(() => import('./pages/admin/CreatorDetail'));

// Talent Portal — creator-facing, juga bukan target SEO
const TalentLayout = lazy(() => import('./components/layout/TalentLayout'));
const TalentLogin = lazy(() => import('./pages/talent/TalentLogin'));
const TalentCampaigns = lazy(() => import('./pages/talent/TalentCampaigns'));
const TalentCampaignDetail = lazy(() => import('./pages/talent/TalentCampaignDetail'));

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

function ProtectedTalentRoute() {
  const token = localStorage.getItem('azera_creator_token');
  if (!token) return <Navigate to="/talent/login" replace />;
  return <TalentLayout />;
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
            <Route path="/portfolio/case-study/:id" element={<CaseStudyDetail />} />
            <Route path="/apply/:slug" element={<CampaignApply />} />
          </Route>

          {/* Invoice payment — halaman publik transaksional, tanpa Navbar/Footer marketing */}
          <Route path="/invoice/:id" element={<InvoicePayment />} />

          {/* Admin login — no layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/admin/campaigns" replace />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/new" element={<CampaignNew />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="import" element={<Import />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="wa-templates" element={<WaTemplates />} />
            <Route path="campaigns/:id/broadcast" element={<Broadcast />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:id" element={<BrandDetail />} />
            <Route path="creators" element={<Creators />} />
            <Route path="creators/:id" element={<CreatorDetail />} />
            <Route path="portfolio" element={<PortfolioManager />} />
          </Route>

          {/* Talent Portal login — no layout */}
          <Route path="/talent/login" element={<TalentLogin />} />

          {/* Talent Portal protected routes */}
          <Route path="/talent" element={<ProtectedTalentRoute />}>
            <Route index element={<Navigate to="/talent/campaigns" replace />} />
            <Route path="campaigns" element={<TalentCampaigns />} />
            <Route path="campaigns/:id" element={<TalentCampaignDetail />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {import.meta.env.DEV && <Agentation />}
    </BrowserRouter>
  );
}
