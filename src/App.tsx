import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Agentation } from 'agentation';
import { Home, Image as ImageIcon, BookOpen, UserPlus, Layers } from 'lucide-react';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';
import BottomNav from './components/layout/BottomNav';
import SEOManager from './components/SEOManager';
import { services as serviceList } from './data/services';

// Public pages
import Landing from './pages/Landing';
import Brand from './pages/Brand';
import BrandForm from './pages/BrandForm';
import KOL from './pages/KOL';
import KOLRegister from './pages/KOLRegister';
import Portfolio from './pages/Portfolio';
import PortfolioDetail from './pages/PortfolioDetail';
import Kamus from './pages/Kamus';
import KamusDetail from './pages/KamusDetail';
import CaseStudyDetail from './pages/CaseStudyDetail';
import ServiceDetail from './pages/ServiceDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CampaignApply from './pages/CampaignApply';
import InvoicePayment from './pages/InvoicePayment';
import CampaignDashboard from './pages/CampaignDashboard';
import PortalLogin from './pages/PortalLogin';
import { hasOwnerAccess } from './hooks/useAuth';

// Admin pages are not SEO targets, so keep them out of the initial public bundle.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const Brands = lazy(() => import('./pages/admin/Brands'));
const BrandDetail = lazy(() => import('./pages/admin/BrandDetail'));
const PortfolioManager = lazy(() => import('./pages/admin/PortfolioManager'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCampaignDashboard = lazy(() => import('./pages/admin/CampaignDashboard'));
const CampaignNew = lazy(() => import('./pages/admin/CampaignNew'));
const CampaignDetail = lazy(() => import('./pages/admin/CampaignDetail'));
const CampaignSheet = lazy(() => import('./pages/admin/CampaignSheet'));
const Import = lazy(() => import('./pages/admin/Import'));
const Documents = lazy(() => import('./pages/admin/Documents'));
const FinanceRecap = lazy(() => import('./pages/admin/FinanceRecap'));
const WhatsApp = lazy(() => import('./pages/admin/WhatsApp'));
const WhatsAppInbox = lazy(() => import('./pages/admin/WhatsAppInbox'));
const WaTemplates = lazy(() => import('./pages/admin/WaTemplates'));
const LeadBotTemplates = lazy(() => import('./pages/admin/LeadBotTemplates'));
const Broadcast = lazy(() => import('./pages/admin/Broadcast'));
const Creators = lazy(() => import('./pages/admin/Creators'));
const CreatorDetail = lazy(() => import('./pages/admin/CreatorDetail'));
const PicUsers = lazy(() => import('./pages/admin/PicUsers'));
const ExtensionConnect = lazy(() => import('./pages/admin/ExtensionConnect'));

// Talent Portal, creator-facing, juga bukan target SEO
const TalentLayout = lazy(() => import('./components/layout/TalentLayout'));
const TalentCampaigns = lazy(() => import('./pages/talent/TalentCampaigns'));
const CreatorPortal = lazy(() => import('./pages/CreatorPortal'));

// PIC/Handle-by Portal, campaign contact-facing, akun bisa link banyak campaign
const PicLayout = lazy(() => import('./components/layout/PicLayout'));
const PicCampaigns = lazy(() => import('./pages/pic/PicCampaigns'));
const PicCampaignDetail = lazy(() => import('./pages/pic/PicCampaignDetail'));

function RouteFallback() {
  return <div style={{ minHeight: '100vh', background: 'var(--surface)' }} />;
}

const publicBottomPrimary = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Service', to: '/service', icon: Layers, popupItems: serviceList.map((s) => ({ label: s.navLabel, to: `/service/${s.slug}` })) },
  { label: 'Portfolio', to: '/portfolio', icon: ImageIcon },
  { label: 'Kamus', to: '/kamus', icon: BookOpen },
  { label: 'Daftar', to: '/daftar', icon: UserPlus, popupItems: [{ label: 'KOL', to: '/kol/register' }, { label: 'Brand', to: '/brand/form' }] },
];
const publicBottomMore: typeof publicBottomPrimary = [];

function PublicLayout() {
  const location = useLocation();
  const activeTo = [...publicBottomPrimary, ...publicBottomMore]
    .map((i) => i.to)
    .filter((to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <>
      <Navbar />
      {/* Ruang bottom nav mobile disediakan kartu footer, bukan main, supaya tidak ada celah terang di atas footer */}
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BottomNav primaryItems={publicBottomPrimary} moreItems={publicBottomMore} activeTo={activeTo} showLogout={false} />
    </>
  );
}

/** Role developer (setara owner) & admin: Inbox WhatsApp (chat pribadi) ditutup, API-nya juga menolak. */
function NoDeveloper({ children }: { children: React.ReactElement }) {
  let role: string | undefined;
  try { role = JSON.parse(localStorage.getItem('azera_admin') || '{}').role; } catch { role = undefined; }
  return role === 'developer' || role === 'admin' ? <Navigate to="/admin" replace /> : children;
}

/** Data keuangan (Rekap Keuangan; Invoice dicek di Documents) khusus owner & developer, API-nya juga menolak role lain. */
function OwnerOnly({ children }: { children: React.ReactElement }) {
  let role: string | undefined;
  try { role = JSON.parse(localStorage.getItem('azera_admin') || '{}').role; } catch { role = undefined; }
  return hasOwnerAccess(role) ? children : <Navigate to="/admin" replace />;
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
      <ScrollToTop />
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
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/kamus" element={<Kamus />} />
            <Route path="/kamus/:slug" element={<KamusDetail />} />
            <Route path="/service/:slug" element={<ServiceDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/apply/:slug" element={<CampaignApply />} />
          </Route>

          {/* Invoice payment, halaman publik transaksional, tanpa Navbar/Footer marketing */}
          <Route path="/invoice/:id" element={<InvoicePayment />} />

          {/* AD-48: dashboard PIC/Handle-by, akses via accessCode (query ?code=), tanpa login/Navbar/Footer */}
          <Route path="/campaign-dashboard/:id" element={<CampaignDashboard />} />
          <Route path="/client-dashboard/:id" element={<CampaignDashboard audience="client" />} />
          <Route path="/portal/:token" element={<CreatorPortal />} />

          {/* Admin login, no layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="campaigns" element={<AdminCampaignDashboard />} />
            {/* Menu Dashboard Campaign digabung ke Campaigns (tampilan card) */}
            <Route path="campaign-dashboard" element={<Navigate to="/admin/campaigns" replace />} />
            <Route path="campaigns/new" element={<CampaignNew />} />
            <Route path="campaigns/:id" element={<CampaignDetail />} />
            <Route path="campaigns/:id/sheet" element={<CampaignSheet />} />
            <Route path="import" element={<Import />} />
            <Route path="documents/:type" element={<Documents />} />
            <Route path="finance-recap" element={<OwnerOnly><FinanceRecap /></OwnerOnly>} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="whatsapp/inbox" element={<NoDeveloper><WhatsAppInbox /></NoDeveloper>} />
            <Route path="wa-templates" element={<WaTemplates />} />
            <Route path="lead-bot-templates" element={<LeadBotTemplates />} />
            <Route path="campaigns/:id/broadcast" element={<Broadcast />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:id" element={<BrandDetail />} />
            <Route path="creators" element={<Creators key="general" />} />
            <Route path="campaign-creators" element={<Creators key="campaign" scope="campaign" />} />
            <Route path="creators/:id" element={<CreatorDetail />} />
            <Route path="extension" element={<ExtensionConnect />} />
            <Route path="pic" element={<PicUsers />} />
            <Route path="portfolio" element={<PortfolioManager />} />
          </Route>

          {/* Unified sign in/up for Creator & PIC campaign portals, no layout */}
          <Route path="/login" element={<PortalLogin />} />
          <Route path="/talent/login" element={<Navigate to="/login" replace />} />

          {/* Talent Portal protected routes */}
          <Route path="/talent" element={<ProtectedTalentRoute />}>
            <Route index element={<Navigate to="/talent/campaigns" replace />} />
            <Route path="campaigns" element={<TalentCampaigns />} />
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
