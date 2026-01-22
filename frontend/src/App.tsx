import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ScrollToTop } from './components/common/ScrollToTop';

// 首頁保持同步加載以提升首屏性能
import { Home } from './pages/public/Home';

// 公開頁面 - 按需加載
const Report = lazy(() => import('./pages/public/Report').then(m => ({ default: m.Report })));
const ReportHazard = lazy(() => import('./pages/public/ReportHazard').then(m => ({ default: m.ReportHazard })));
const ReportSuccess = lazy(() => import('./pages/public/ReportSuccess').then(m => ({ default: m.ReportSuccess })));
const MapView = lazy(() => import('./pages/public/MapView').then(m => ({ default: m.MapView })));
const Status = lazy(() => import('./pages/public/Status').then(m => ({ default: m.Status })));
const Resources = lazy(() => import('./pages/public/Resources').then(m => ({ default: m.Resources })));
const FAQ = lazy(() => import('./pages/public/FAQ').then(m => ({ default: m.FAQ })));
const News = lazy(() => import('./pages/public/News').then(m => ({ default: m.News })));
const NewsDetail = lazy(() => import('./pages/public/NewsDetail').then(m => ({ default: m.NewsDetail })));
const SmartGuide = lazy(() => import('./pages/public/SmartGuide').then(m => ({ default: m.SmartGuide })));
const Academy = lazy(() => import('./pages/public/Academy').then(m => ({ default: m.Academy })));
const Reports = lazy(() => import('./pages/public/Reports').then(m => ({ default: m.Reports })));

// 登入頁面
const AdminLogin = lazy(() => import('./pages/admin/Login').then(m => ({ default: m.AdminLogin })));

// 後台頁面 - 按需加載
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const CaseList = lazy(() => import('./pages/admin/CaseList').then(m => ({ default: m.CaseList })));
const CaseDetail = lazy(() => import('./pages/admin/CaseDetail').then(m => ({ default: m.CaseDetail })));
const CaseMerge = lazy(() => import('./pages/admin/CaseMerge'));
const UsersPage = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.UsersPage })));
const RolesPage = lazy(() => import('./pages/admin/Roles').then(m => ({ default: m.RolesPage })));
const WorkflowsPage = lazy(() => import('./pages/admin/Workflows').then(m => ({ default: m.WorkflowsPage })));
const ReportsPage = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.SettingsPage })));
const IntegrationPage = lazy(() => import('./pages/admin/Integration').then(m => ({ default: m.IntegrationPage })));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogs').then(m => ({ default: m.AuditLogsPage })));
const ProxyPage = lazy(() => import('./pages/admin/Proxy').then(m => ({ default: m.ProxyPage })));
const AnalyticsPage = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.AnalyticsPage })));

// 外勤頁面
const FieldInvestigation = lazy(() => import('./pages/admin/FieldInvestigation').then(m => ({ default: m.FieldInvestigation })));
const FieldDashboard = lazy(() => import('./pages/field/FieldDashboard').then(m => ({ default: m.FieldDashboard })));

// Loading 組件
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 公開路由 */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/report/success" element={<Layout><Suspense fallback={<PageLoader />}><ReportSuccess /></Suspense></Layout>} />
          <Route path="/report/hazard" element={<Layout><Suspense fallback={<PageLoader />}><ReportHazard /></Suspense></Layout>} />
          <Route path="/report/:type" element={<Layout><Suspense fallback={<PageLoader />}><Report /></Suspense></Layout>} />
          <Route path="/status" element={<Layout><Suspense fallback={<PageLoader />}><Status /></Suspense></Layout>} />
          <Route path="/map" element={<Suspense fallback={<PageLoader />}><MapView /></Suspense>} />
          <Route path="/resources" element={<Layout><Suspense fallback={<PageLoader />}><Resources /></Suspense></Layout>} />
          <Route path="/faq" element={<Layout><Suspense fallback={<PageLoader />}><FAQ /></Suspense></Layout>} />
          <Route path="/news" element={<Layout><Suspense fallback={<PageLoader />}><News /></Suspense></Layout>} />
          <Route path="/news/:id" element={<Layout><Suspense fallback={<PageLoader />}><NewsDetail /></Suspense></Layout>} />
          <Route path="/smart-guide" element={<Layout><Suspense fallback={<PageLoader />}><SmartGuide /></Suspense></Layout>} />
          <Route path="/academy" element={<Layout><Suspense fallback={<PageLoader />}><Academy /></Suspense></Layout>} />
          <Route path="/reports" element={<Layout><Suspense fallback={<PageLoader />}><Reports /></Suspense></Layout>} />

          {/* 登入 */}
          <Route path="/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />

          {/* 外勤作業前端路由 (Mobile First) */}
          <Route path="/field/tasks" element={<Layout><Suspense fallback={<PageLoader />}><FieldDashboard /></Suspense></Layout>} />
          <Route path="/field/investigation/:id" element={<Layout><Suspense fallback={<PageLoader />}><FieldInvestigation /></Suspense></Layout>} />

          {/* 後台路由 - 使用 AdminLayout 作為容器 */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
            <Route path="/admin/dashboard" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
            <Route path="/admin/cases" element={<Suspense fallback={<PageLoader />}><CaseList /></Suspense>} />
            <Route path="/admin/cases/:id" element={<Suspense fallback={<PageLoader />}><CaseDetail /></Suspense>} />
            <Route path="/admin/case-merge" element={<Suspense fallback={<PageLoader />}><CaseMerge /></Suspense>} />
            <Route path="/admin/users" element={<Suspense fallback={<PageLoader />}><UsersPage /></Suspense>} />
            <Route path="/admin/roles" element={<Suspense fallback={<PageLoader />}><RolesPage /></Suspense>} />
            <Route path="/admin/workflows" element={<Suspense fallback={<PageLoader />}><WorkflowsPage /></Suspense>} />
            <Route path="/admin/reports" element={<Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>} />
            <Route path="/admin/audit-logs" element={<Suspense fallback={<PageLoader />}><AuditLogsPage /></Suspense>} />
            <Route path="/admin/integrations" element={<Suspense fallback={<PageLoader />}><IntegrationPage /></Suspense>} />
            <Route path="/admin/proxy" element={<Suspense fallback={<PageLoader />}><ProxyPage /></Suspense>} />
            <Route path="/admin/analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
            <Route path="/admin/settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
          </Route>

          {/* 重定向與錯誤處理 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
