import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Agentation } from 'agentation';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import SEOManager from './components/SEOManager';

// Public pages
import Landing from './pages/Landing';
import Brand from './pages/Brand';
import BrandForm from './pages/BrandForm';
import KOL from './pages/KOL';
import KOLRegister from './pages/KOLRegister';
import Portfolio from './pages/Portfolio';
import CaseStudyDetail from './pages/CaseStudyDetail';
import ServiceDetail from './pages/ServiceDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CampaignApply from './pages/CampaignApply';
import InvoicePayment from './pages/InvoicePayment';
import CampaignDashboard from './pages/CampaignDashboard';
import PortalLogin from './pages/PortalLogin';

// Admin pages are not SEO targets, so keep them out of the initial public bundle.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const BrandDetail = lazy(() => import('./pages/admin/BrandDetail'));
const PortfolioManager = lazy(() => import('./pages/admin/PortfolioManager'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Campaigns = lazy(() => import('./pages/admin/Campaigns'));
const CampaignNew = lazy(() => import('./pages/admin/CampaignNew'));
const CampaignDetail = lazy(() => import('./pages/admin/CampaignDetail'));
const Import = lazy(() => import('./pages/admin/Import'));
const WhatsApp = lazy(() => import('./pages/admin/WhatsApp'));
const WhatsAppInbox = lazy(() => import('./pages/admin/WhatsAppInbox'));
const WaTemplates = lazy(() => import('./pages/admin/WaTemplates'));
const LeadBotTemplates = lazy(() => import('./pages/admin/LeadBotTemplates'));
const Broadcast = lazy(() => import('./pages/admin/Broadcast'));
const Creators = lazy(() => import('./pages/admin/Creators'));
const CreatorDetail = lazy(() => import('./pages/admin/CreatorDetail'));
const PicUsers = lazy(() => import('./pages/admin/PicUsers'));

// Talent Portal — creator-facing, juga bukan target SEO
const TalentLayout = lazy(() => import('./components/layout/TalentLayout'));
const TalentCampaigns = lazy(() => import('./pages/talent/TalentCampaigns'));
const TalentCampaignDetail = lazy(() => import('./pages/talent/TalentCampaignDetail'));

// PIC/Handle-by Portal — campaign contact-facing, akun bisa link banyak campaign
const PicLayout = lazy(() => import('./components/layout/PicLayout'));
const PicCampaigns = lazy(() => import('./pages/pic/PicCampaigns'));
const PicCampaignDetail = lazy(() => import('./pages/pic/PicCampaignDetail'));

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
      <FloatingWhatsApp />
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
  if (!token) return <Navigate to="/login" replace />;
  return <TalentLayout />;
}

function ProtectedPicRoute() {
  const token = localStorage.getItem('azera_pic_token');
  if (!token) return <Navigate to="/login" replace />;
  return <PicLayout />;
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
            <Route path="/service/:slug" element={<ServiceDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/apply/:slug" element={<CampaignApply />} />
          </Route>

          {/* Invoice payment — halaman publik transaksional, tanpa Navbar/Footer marketing */}
          <Route path="/invoice/:id" element={<InvoicePayment />} />

          {/* AD-48: dashboard PIC/Handle-by, akses via accessCode (query ?code=), tanpa login/Navbar/Footer */}
          <Route path="/campaign-dashboard/:id" element={<CampaignDashboard />} />

          {/* Admin login — no layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/new" element={<CampaignNew />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="import" element={<Import />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="whatsapp/inbox" element={<WhatsAppInbox />} />
            <Route path="wa-templates" element={<WaTemplates />} />
            <Route path="lead-bot-templates" element={<LeadBotTemplates />} />
            <Route path="campaigns/:id/broadcast" element={<Broadcast />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:id" element={<BrandDetail />} />
            <Route path="creators" element={<Creators />} />
            <Route path="creators/:id" element={<CreatorDetail />} />
            <Route path="pic" element={<PicUsers />} />
            <Route path="portfolio" element={<PortfolioManager />} />
          </Route>

          {/* Unified sign in/up for Creator & PIC campaign portals — no layout */}
          <Route path="/login" element={<PortalLogin />} />
          <Route path="/talent/login" element={<Navigate to="/login" replace />} />

          {/* Talent Portal protected routes */}
          <Route path="/talent" element={<ProtectedTalentRoute />}>
            <Route index element={<Navigate to="/talent/campaigns" replace />} />
            <Route path="campaigns" element={<TalentCampaigns />} />
            <Route path="campaigns/:id" element={<TalentCampaignDetail />} />
          </Route>

          {/* PIC/Handle-by Portal protected routes */}
          <Route path="/pic" element={<ProtectedPicRoute />}>
            <Route index element={<Navigate to="/pic/campaigns" replace />} />
            <Route path="campaigns" element={<PicCampaigns />} />
            <Route path="campaigns/:id" element={<PicCampaignDetail />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {import.meta.env.DEV && <Agentation />}
    </BrowserRouter>
  );
}
