
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/public/Home';
import { Report } from './pages/public/Report';
import { ReportHazard } from './pages/public/ReportHazard';
import { ReportSuccess } from './pages/public/ReportSuccess';
import { MapView } from './pages/public/MapView';
import { Status } from './pages/public/Status';
import { Resources } from './pages/public/Resources';
import { FAQ } from './pages/public/FAQ';
import { News } from './pages/public/News';
import { NewsDetail } from './pages/public/NewsDetail';
import { SmartGuide } from './pages/public/SmartGuide';
import { Academy } from './pages/public/Academy';
import { Reports } from './pages/public/Reports';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { CaseList } from './pages/admin/CaseList';
import { CaseDetail } from './pages/admin/CaseDetail';
import CaseMerge from './pages/admin/CaseMerge';
import { UsersPage } from './pages/admin/Users';
import { RolesPage } from './pages/admin/Roles';
import { WorkflowsPage } from './pages/admin/Workflows';
import { ReportsPage } from './pages/admin/Reports';
import { SettingsPage } from './pages/admin/Settings';
import { IntegrationPage } from './pages/admin/Integration';
import { AuditLogsPage } from './pages/admin/AuditLogs';
import { ProxyPage } from './pages/admin/Proxy';
import { AnalyticsPage } from './pages/admin/Analytics';
import { FieldInvestigation } from './pages/admin/FieldInvestigation';
import { FieldDashboard } from './pages/field/FieldDashboard';
import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* 公開路由 */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/report/success" element={<Layout><ReportSuccess /></Layout>} />
        <Route path="/report/hazard" element={<Layout><ReportHazard /></Layout>} />
        <Route path="/report/:type" element={<Layout><Report /></Layout>} />
        <Route path="/status" element={<Layout><Status /></Layout>} />
        <Route path="/map" element={<MapView />} />
        <Route path="/resources" element={<Layout><Resources /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route path="/news" element={<Layout><News /></Layout>} />
        <Route path="/news/:id" element={<Layout><NewsDetail /></Layout>} />
        <Route path="/smart-guide" element={<Layout><SmartGuide /></Layout>} />
        <Route path="/academy" element={<Layout><Academy /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />

        {/* 登入 */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* 外勤作業前端路由 (Mobile First) */}
        <Route path="/field/tasks" element={<Layout><FieldDashboard /></Layout>} />
        <Route path="/field/investigation/:id" element={<Layout><FieldInvestigation /></Layout>} />

        {/* 後台路由 - 使用 AdminLayout 作為容器 */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cases" element={<CaseList />} />
          <Route path="/admin/cases/:id" element={<CaseDetail />} />
          <Route path="/admin/case-merge" element={<CaseMerge />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/workflows" element={<WorkflowsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          {/* <Route path="/admin/field-investigation/:id" element={<FieldInvestigation />} /> Moved to frontend */}
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admin/integrations" element={<IntegrationPage />} />
          <Route path="/admin/proxy" element={<ProxyPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        {/* 重定向與錯誤處理 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
