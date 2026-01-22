// src/services/mockApi.ts
import type {
    Case, User, Role, Permission, Workflow,
    ProxyAssignment, AuditLog, SystemConfig, IntegrationConfig,
    CaseWorkflowStage, CaseMergeRecord
} from '../types/schema';
import { mockCases } from './mockCases';

// 模擬延遲
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ===== 模擬數據集合 =====

// 用戶數據
const mockUsers: User[] = [
    { id: 'u1', name: '王管理員', email: 'wang.admin@gov.tw', role: 'admin', unit: '動保處', phone: '0912345678', status: 'active', createdAt: '2025-01-01', employeeId: 'E001', department: '管理科' },
    { id: 'u2', name: '李承辦人', email: 'li.caseworker@gov.tw', role: 'caseworker', unit: '動保處', phone: '0987654321', status: 'active', createdAt: '2025-01-05', employeeId: 'E002', department: '業務科' },
    { id: 'u3', name: '張主管', email: 'zhang.supervisor@gov.tw', role: 'supervisor', unit: '動保處', phone: '0923456789', status: 'active', createdAt: '2025-01-05', employeeId: 'E003', department: '業務科', permissionLayer: '處' },
    { id: 'u4', name: '陳承辦人', email: 'chen.caseworker@gov.tw', role: 'caseworker', unit: '動保處', phone: '0934567890', status: 'active', createdAt: '2025-01-10', employeeId: 'E004', department: '業務科' },
    { id: 'u5', name: '黃承辦人', email: 'huang.caseworker@gov.tw', role: 'caseworker', unit: '動保處', phone: '0945678901', status: 'inactive', createdAt: '2025-01-15', employeeId: 'E005', department: '業務科' },
    { id: 'u6', name: '林承辦人', email: 'lin.caseworker@gov.tw', role: 'caseworker', unit: '動保處', phone: '0956789012', status: 'active', createdAt: '2025-01-20', employeeId: 'E006', department: '稽查科' },
    { id: 'u7', name: '吳外部人員', email: 'wu.external@other-agency.gov.tw', role: 'caseworker', unit: '農業局', phone: '0967890123', status: 'active', createdAt: '2025-02-01', isExternal: true, permissionLayer: '局' },
    { id: 'u8', name: '周報表專員', email: 'zhou.report@gov.tw', role: 'supervisor', unit: '動保處', phone: '0978901234', status: 'active', createdAt: '2025-02-05', employeeId: 'E007', department: '管理科' },
    { id: 'u9', name: '林外勤', email: 'lin.field@gov.tw', role: 'field_investigator', unit: '動保處', phone: '0911222333', status: 'active', createdAt: '2026-01-20', employeeId: 'F001', department: '稽查科' },
];

// 角色定義
const mockRoles: Role[] = [
    {
        id: 'r1',
        name: '管理員',
        permissions: ['case:create', 'case:read', 'case:update', 'case:delete', 'user:manage', 'role:manage', 'workflow:manage', 'report:view', 'audit:view'],
        description: '系統管理員，擁有所有權限'
    },
    {
        id: 'r2',
        name: '承辦人',
        permissions: ['case:read', 'case:update', 'case:dispatch', 'report:view'],
        description: '案件承辦人，可查詢和更新分派的案件'
    },
    {
        id: 'r3',
        name: '主管',
        permissions: ['case:read', 'case:approve', 'report:view', 'report:export', 'audit:view'],
        description: '部門主管，可審核和查看報表'
    },
];

// 權限定義
const mockPermissions: Permission[] = [
    { id: 'case:create', name: '新增案件', category: 'case', description: '允許新增案件' },
    { id: 'case:read', name: '查詢案件', category: 'case', description: '允許查詢案件' },
    { id: 'case:update', name: '編輯案件', category: 'case', description: '允許編輯案件' },
    { id: 'case:delete', name: '刪除案件', category: 'case', description: '允許刪除案件' },
    { id: 'case:dispatch', name: '分派案件', category: 'case', description: '允許分派案件給承辦人' },
    { id: 'case:approve', name: '審核案件', category: 'case', description: '允許審核和批准案件' },
    { id: 'user:manage', name: '管理用戶', category: 'user', description: '允許管理用戶帳號' },
    { id: 'role:manage', name: '管理角色', category: 'role', description: '允許管理角色和權限' },
    { id: 'workflow:manage', name: '管理工作流', category: 'workflow', description: '允許配置工作流程' },
    { id: 'report:view', name: '查詢報表', category: 'report', description: '允許查詢報表' },
    { id: 'report:export', name: '匯出報表', category: 'report', description: '允許匯出報表' },
    { id: 'audit:view', name: '查詢審計日誌', category: 'audit', description: '允許查詢審計日誌' },
];

// 案件數據已在 mockCases.ts 中定義，此處導入使用

// 工作流程定義
const mockWorkflows: Workflow[] = [
    {
        id: 'wf1',
        name: '一般案件流程',
        type: 'general',
        steps: [
            { id: 's1', name: '通報接收', order: 1, status: 'completed', description: '接收民眾通報' },
            { id: 's2', name: '初審', order: 2, status: 'pending', description: '初步審查案件內容' },
            { id: 's3', name: '分派', order: 3, status: 'pending', description: '分派給承辦人' },
            { id: 's4', name: '執行', order: 4, status: 'pending', description: '承辦人執行現場勘查' },
            { id: 's5', name: '回報', order: 5, status: 'pending', description: '承辦人回報結果' },
            { id: 's6', name: '結案', order: 6, status: 'pending', description: '案件結案歸檔' },
        ],
        isActive: true,
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
        version: '1.0',
        publishedAt: '2025-12-01T00:00:00Z',
        publishedBy: 'u1',
    },
    {
        id: 'wf2',
        name: '蜂案處理流程',
        type: 'bee',
        steps: [
            { id: 's1', name: '通報接收', order: 1, status: 'completed', description: '接收蜂案通報' },
            { id: 's2', name: '危險評估', order: 2, status: 'pending', description: '評估蜂窩危險程度' },
            { id: 's3', name: '緊急分派', order: 3, status: 'pending', description: '緊急分派相關單位' },
            { id: 's4', name: '現場處理', order: 4, status: 'pending', description: '現場蜂窩移除處理' },
            { id: 's5', name: '驗收回報', order: 5, status: 'pending', description: '驗收並回報完成' },
        ],
        isActive: true,
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
        version: '1.0',
        publishedAt: '2025-12-01T00:00:00Z',
        publishedBy: 'u1',
    },
    {
        id: 'wf3',
        name: '1999案件流程',
        type: '1999',
        steps: [
            { id: 's1', name: '1999系統接收', order: 1, status: 'completed', description: '從1999系統接收案件' },
            { id: 's2', name: '案件比對', order: 2, status: 'pending', description: '比對是否重複案件' },
            { id: 's3', name: '分派', order: 3, status: 'pending', description: '分派給承辦人' },
            { id: 's4', name: '執行', order: 4, status: 'pending', description: '承辦人執行處理' },
            { id: 's5', name: '同步回報', order: 5, status: 'pending', description: '回報至1999系統' },
        ],
        isActive: true,
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
        version: '1.0',
        publishedAt: '2025-12-01T00:00:00Z',
        publishedBy: 'u1',
    },
    {
        id: 'wf4',
        name: '1959動保專線流程',
        type: '1959',
        steps: [
            { id: 's1', name: '專線接收', order: 1, status: 'completed', description: '1959專線接收案件' },
            { id: 's2', name: '緊急評估', order: 2, status: 'pending', description: '評估案件緊急程度' },
            { id: 's3', name: '立即分派', order: 3, status: 'pending', description: '立即分派給值班承辦人' },
            { id: 's4', name: '現場處置', order: 4, status: 'pending', description: '現場處置動物保護案件' },
            { id: 's5', name: '後續追蹤', order: 5, status: 'pending', description: '後續追蹤動物狀況' },
            { id: 's6', name: '結案', order: 6, status: 'pending', description: '案件結案' },
        ],
        isActive: true,
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
        version: '1.0',
        publishedAt: '2025-12-01T00:00:00Z',
        publishedBy: 'u1',
    },
];

// 案件列表過濾定義
const CASE_FILTER_DEFINITIONS: Record<string, (c: Case) => boolean> = {
    'all': () => true,
    'attention': (c) => c.priority === 'critical',
    'receipt_pending': (c) => c.workflowStage === 'receipt' && c.status === 'pending',
    'receipt_authorized': (c) => c.workflowStage === 'receipt' && c.status === 'authorized',
    'assignment_assigned': (c) => c.workflowStage === 'assignment' && c.status === 'assigned',
    'undertaker_pending': (c) => c.workflowStage === 'undertaker' && c.status === 'assigned',
    'undertaker_processing': (c) => c.workflowStage === 'undertaker' && c.status === 'processing',
    'undertaker_transferred': (c) => c.workflowStage === 'undertaker' && c.status === 'transferred',
    'undertaker_overdue': (c) => c.workflowStage === 'undertaker' && c.status === 'overdue',
    'public_completed': (c) => c.workflowStage === 'public' && c.status === 'completed',
    'resolved': (c) => c.status === 'resolved',
    'rejected': (c) => c.status === 'rejected',
};

// 代理人設定
const mockProxies: ProxyAssignment[] = [
    {
        id: 'px1',
        from: 'u5',
        to: 'u2',
        startDate: '2026-01-15',
        endDate: '2026-02-15',
        reason: '公假期間',
        status: 'active'
    },
    {
        id: 'px2',
        from: 'u2',
        to: 'u4',
        startDate: '2026-02-20',
        endDate: '2026-03-05',
        reason: '教育訓練',
        status: 'active'
    },
    {
        id: 'px3',
        from: 'u4',
        to: 'u6',
        startDate: '2026-01-01',
        endDate: '2026-01-10',
        reason: '年假',
        status: 'expired'
    },
];

// 審計日誌
const mockAuditLogs: AuditLog[] = [
    {
        id: 'a1',
        userId: 'u1',
        action: 'create',
        resource: 'case',
        resourceId: 'C20260121001',
        timestamp: '2026-01-21T08:00:00Z'
    },
    {
        id: 'a2',
        userId: 'u1',
        action: 'assign',
        resource: 'case',
        resourceId: 'C20260121002',
        changes: { assignedTo: 'u2' },
        timestamp: '2026-01-21T08:15:00Z'
    },
    {
        id: 'a3',
        userId: 'u2',
        action: 'update',
        resource: 'case',
        resourceId: 'C20260121001',
        changes: { status: 'processing' },
        timestamp: '2026-01-21T09:00:00Z'
    },
    {
        id: 'a4',
        userId: 'u1',
        action: 'create',
        resource: 'user',
        resourceId: 'u7',
        metadata: { role: 'caseworker', isExternal: true },
        timestamp: '2026-01-21T10:00:00Z'
    },
    {
        id: 'a5',
        userId: 'u1',
        action: 'permission_change',
        resource: 'user',
        resourceId: 'u3',
        changes: { addedPermissions: ['report:export'] },
        timestamp: '2026-01-21T11:00:00Z'
    },
    {
        id: 'a6',
        userId: 'u3',
        action: 'report_download',
        resource: 'report',
        resourceId: 'AR20260121001',
        timestamp: '2026-01-21T12:00:00Z'
    },
    {
        id: 'a7',
        userId: 'u1',
        action: 'create',
        resource: 'proxy',
        resourceId: 'px2',
        metadata: { from: 'u2', to: 'u4', startDate: '2026-02-20' },
        timestamp: '2026-01-21T13:00:00Z'
    },
    {
        id: 'a8',
        userId: 'u2',
        action: 'report',
        resource: 'case',
        resourceId: 'C20260120005',
        metadata: { reportContent: '已完成現場勘查' },
        timestamp: '2026-01-21T14:00:00Z'
    },
];

// 系統設定
const mockSystemConfig: SystemConfig[] = [
    { key: 'system_timezone', value: 'Asia/Taipei', description: '系統時區', category: 'general' },
    { key: 'system_language', value: 'zh-TW', description: '系統語言', category: 'general' },
    { key: 'case_auto_close_days', value: 30, description: '案件自動結案天數', category: 'case' },
    { key: 'backup_schedule', value: 'daily', description: '備份排程', category: 'backup' },
    { key: 'backup_retention_days', value: 7, description: '備份保留天數', category: 'backup' },
    { key: 'security_password_min_length', value: 8, description: '密碼最小長度', category: 'security' },
    { key: 'security_session_timeout', value: 30, description: '會話逾時（分鐘）', category: 'security' },
    { key: 'security_max_login_attempts', value: 5, description: '最大登入嘗試次數', category: 'security' },
    { key: 'security_2fa_enabled', value: 'false', description: '啟用雙因素驗證', category: 'security' },
    { key: 'notification_email_enabled', value: 'true', description: '啟用電子郵件通知', category: 'notification' },
    { key: 'notification_sms_enabled', value: 'false', description: '啟用簡訊通知', category: 'notification' },
    { key: 'notification_case_assigned', value: 'true', description: '案件分派通知', category: 'notification' },
    { key: 'notification_case_completed', value: 'true', description: '案件完成通知', category: 'notification' },
];

// 介接配置
const mockIntegrations: IntegrationConfig[] = [
    {
        id: 'int1',
        name: '1999通報系統',
        type: '1999',
        endpoint: 'https://1999.ntpc.gov.tw/api',
        status: 'connected',
        lastSync: '2026-01-21T10:00:00Z',
        configuration: { apiKey: 'xxxx', syncInterval: 300 },
        retryStrategy: { maxRetries: 3, retryInterval: 60 },
        schedule: '*/5 * * * *', // 每 5 分鐘
    },
    {
        id: 'int2',
        name: '農業部寵物登記',
        type: 'agriculture',
        endpoint: 'https://pet.coa.gov.tw/api',
        status: 'connected',
        lastSync: '2026-01-21T09:30:00Z',
        configuration: { apiKey: 'yyyy', syncInterval: 600 },
        retryStrategy: { maxRetries: 3, retryInterval: 120 },
        schedule: '0 */1 * * *', // 每小時
    },
    {
        id: 'int3',
        name: '財政局罰鍰系統',
        type: 'finance',
        endpoint: 'https://finance.ntpc.gov.tw/api',
        status: 'connected',
        lastSync: '2026-01-21T08:00:00Z',
        configuration: { apiKey: 'zzzz', syncInterval: 3600 },
        retryStrategy: { maxRetries: 2, retryInterval: 300 },
        schedule: '0 8 * * *', // 每天早上 8 點
    },
    {
        id: 'int4',
        name: '公文系統',
        type: 'document',
        endpoint: 'https://doc.ntpc.gov.tw/api',
        status: 'connected',
        lastSync: '2026-01-21T11:00:00Z',
        configuration: { apiKey: 'aaaa', syncInterval: 1800 },
        retryStrategy: { maxRetries: 5, retryInterval: 60 },
        schedule: '*/30 * * * *', // 每 30 分鐘
    },
];

// 介接日誌
const mockIntegrationLogs: any[] = [
    {
        id: 'il1',
        integrationId: 'int1',
        integrationType: '1999',
        action: 'import',
        status: 'success',
        recordCount: 5,
        executedAt: '2026-01-21T10:00:00Z',
        duration: 1200,
    },
    {
        id: 'il2',
        integrationId: 'int1',
        integrationType: '1999',
        action: 'sync',
        status: 'success',
        recordCount: 3,
        executedAt: '2026-01-21T09:55:00Z',
        duration: 950,
    },
    {
        id: 'il3',
        integrationId: 'int2',
        integrationType: 'agriculture',
        action: 'query',
        status: 'success',
        recordCount: 12,
        executedAt: '2026-01-21T09:30:00Z',
        duration: 800,
    },
    {
        id: 'il4',
        integrationId: 'int3',
        integrationType: 'finance',
        action: 'query',
        status: 'failed',
        recordCount: 0,
        errorMessage: '連接超時',
        executedAt: '2026-01-21T08:00:00Z',
        duration: 30000,
    },
    {
        id: 'il5',
        integrationId: 'int1',
        integrationType: '1999',
        action: 'export',
        status: 'success',
        recordCount: 8,
        executedAt: '2026-01-21T11:00:00Z',
        duration: 1500,
        metadata: { casesReported: 8 },
    },
];

// 併案處理記錄
const mockMergeRecords: CaseMergeRecord[] = [
    {
        id: 'mr1',
        primaryCaseId: 'C20260120001',
        duplicateCaseId: 'C20260120005',
        mergeType: 'manual',
        matchType: 'location',
        confidence: 0.85,
        status: 'approved',
        notes: '經承辦人確認為同一地點的重複通報',
        createdBy: 'u2',
        createdAt: '2026-01-20T14:30:00Z',
        reviewedBy: 'u2',
        reviewedAt: '2026-01-20T14:35:00Z',
    },
    {
        id: 'mr2',
        primaryCaseId: 'C20260119002',
        duplicateCaseId: 'C20260119008',
        mergeType: 'auto',
        matchType: 'external_id',
        confidence: 1.0,
        status: 'approved',
        notes: '1999系統重複推送,自動併案',
        createdBy: 'system',
        createdAt: '2026-01-19T09:00:00Z',
        reviewedBy: 'system',
        reviewedAt: '2026-01-19T09:00:00Z',
    },
    {
        id: 'mr3',
        primaryCaseId: 'C20260122005',
        duplicateCaseId: 'C20260122006',
        mergeType: 'manual',
        matchType: 'external_id',
        confidence: 1.0,
        status: 'pending',
        notes: '系統偵測到相同外部編號',
        createdBy: 'system',
        createdAt: '2026-01-22T10:30:00Z',
    },
    {
        id: 'mr4',
        primaryCaseId: 'C20260121001',
        duplicateCaseId: 'C20260121001_DUP',
        mergeType: 'manual',
        matchType: 'location',
        confidence: 0.92,
        status: 'pending',
        notes: '兩案通報時間僅差15分鐘，且地點在同一門牌相鄰位置',
        createdBy: 'system',
        createdAt: '2026-01-21T08:30:00Z',
    },
    {
        id: 'mr5',
        primaryCaseId: 'C20260122011',
        duplicateCaseId: 'C20260122012',
        mergeType: 'manual',
        matchType: 'location',
        confidence: 0.88,
        status: 'pending',
        notes: '淡水區同一區段（中山路）連續三筆棄養案件，通報時間極度密集（5分鐘內）',
        createdBy: 'system',
        createdAt: '2026-01-22T13:15:00Z',
    },
    {
        id: 'mr6',
        primaryCaseId: 'C20260122011',
        duplicateCaseId: 'C20260122013',
        mergeType: 'manual',
        matchType: 'location',
        confidence: 0.85,
        status: 'pending',
        notes: '與前述棄養案件地點與特徵高度重疊',
        createdBy: 'system',
        createdAt: '2026-01-22T13:15:00Z',
    },
    {
        id: 'mr7',
        primaryCaseId: 'C20260122007',
        duplicateCaseId: 'C20260122008',
        mergeType: 'manual',
        matchType: 'chip_id',
        confidence: 0.95,
        status: 'pending',
        notes: '偵測到完全相同的晶片號碼',
        createdBy: 'system',
        createdAt: '2026-01-22T11:30:00Z',
    },
];


// ===== 時間序列數據生成 =====
// 生成過去 90 天的時間序列數據（涵蓋本季度）
const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date('2026-01-21');

    for (let i = 89; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // 模擬每日數據變化
        data.push({
            date: dateStr,
            totalCases: Math.floor(Math.random() * 5) + 3,
            pendingCases: Math.floor(Math.random() * 3) + 1,
            processingCases: Math.floor(Math.random() * 3) + 1,
            resolvedCases: Math.floor(Math.random() * 3) + 1,
            criticalCases: Math.floor(Math.random() * 2),
        });
    }

    return data;
};

const mockTimeSeriesData = generateTimeSeriesData();

// ===== API 函數 =====

export const mockApi = {
    // ===== 認證相關 =====
    login: async (username: string): Promise<User | null> => {
        await delay(800);
        if (username === 'admin') {
            return mockUsers.find(u => u.id === 'u1') || null;
        }
        if (username === 'caseworker') {
            return mockUsers.find(u => u.id === 'u2') || null;
        }
        if (username === 'supervisor') {
            return mockUsers.find(u => u.id === 'u3') || null;
        }
        if (username === 'field01') {
            return mockUsers.find(u => u.id === 'u9') || null;
        }
        return null;
    },

    // ===== 公開 API =====
    getNews: async () => {
        await delay(300);
        return [
            { id: 1, title: '颱風期間請注意戶外招牌與盆栽', date: '2026-01-01', urgent: true },
            { id: 2, title: '狂犬病疫苗巡迴施打時程表', date: '2025-12-28', urgent: false },
            { id: 3, title: '新北市動保處愛心認養活動', date: '2025-12-25', urgent: false },
        ];
    },

    createCase: async (data: any): Promise<string> => {
        await delay(1500);

        // 1. 產生新編號
        const caseId = await mockApi.generateCaseId();

        // 2. 建立案件物件 (模擬)
        const newCase: Case = {
            ...data,
            id: caseId,
            status: 'pending',
            workflowStage: 'receipt',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 3. 儲存至 Mock 資料庫 (讓 ID 生成邏輯能感知到)
        mockCases.push(newCase);

        console.log('[MockAPI] Case Created:', caseId, data);
        return caseId;
    },

    // ===== 去重與編號生成 =====

    // 檢查重複案件
    // 回傳詳細的比對結果，供前端 UI 決定顯示什麼警示
    findDuplicate: async (caseData: any): Promise<{ isDuplicate: boolean; matchType: 'external_id' | 'chip_id' | 'location' | null; matchedCaseId: string | null; message: string }> => {
        await delay(500);

        // 1. 外部編號比對 (Level 1 - 確信)
        // 適用於介接案件 (1999, 公文, 外部系統)
        if (caseData.externalCaseId) {
            const externalMatch = mockCases.find(c => c.externalCaseId === caseData.externalCaseId);
            if (externalMatch) {
                return {
                    isDuplicate: true,
                    matchType: 'external_id',
                    matchedCaseId: externalMatch.id,
                    message: `發現相同外部編號案件 (${externalMatch.id} / 外號: ${caseData.externalCaseId})，系統將自動執行資料同步與更新。`
                };
            }
        }

        // 2. 晶片號碼比對 (Level 2 - 確信)
        // 適用於有掃瞄晶片的動物案件
        if (caseData.petChipId) {
            const chipMatch = mockCases.find(c => c.petChipId === caseData.petChipId);
            if (chipMatch) {
                return {
                    isDuplicate: true,
                    matchType: 'chip_id',
                    matchedCaseId: chipMatch.id,
                    message: `系統比對發現相同寵物晶片 (${caseData.petChipId}) 之歷史案件 (${chipMatch.id})，建議直接關聯至該動物歷史紀錄。`
                };
            }
        }

        // 3. 時空特徵比對 (Level 3 - 疑似) -- 地點 + 時間 + 類型
        // 適用於所有案件的最後一道防線
        if (caseData.coordinates && caseData.date && caseData.type) {
            const suspectMatch = mockCases.find(c => {
                if (c.type !== caseData.type) return false;

                // 時間差 < 24小時 (簡單模擬：同一天)
                if (c.date !== caseData.date) return false;

                // 距離檢查 (簡易座標差，假設 1度約 111km, 0.00045 約 50m)
                if (c.coordinates && caseData.coordinates) {
                    const latDiff = Math.abs(c.coordinates.lat - caseData.coordinates.lat);
                    const lngDiff = Math.abs(c.coordinates.lng - caseData.coordinates.lng);
                    return latDiff < 0.00045 && lngDiff < 0.00045;
                }
                return false;
            });

            if (suspectMatch) {
                return {
                    isDuplicate: true,
                    matchType: 'location',
                    matchedCaseId: suspectMatch.id,
                    message: `系統偵測到臨近地點與時間的高度相似案件 (${suspectMatch.id})，請確認是否為重複通報？`
                };
            }
        }

        return { isDuplicate: false, matchType: null, matchedCaseId: null, message: '' };
    },

    // 產生新案件編號
    // 格式: CASE-{YYYYMMDD}-{SEQ}
    generateCaseId: async (): Promise<string> => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}${mm}${dd}`;

        // 格式: CASE-20240121-001
        const prefix = `CASE-${dateStr}-`;

        const existingIds = mockCases
            .filter(c => c.id.startsWith(prefix))
            .map(c => {
                const parts = c.id.split('-');
                return parts.length === 3 ? parseInt(parts[2], 10) : 0;
            });

        const nextSeq = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        return `${prefix}${String(nextSeq).padStart(3, '0')}`;
    },

    // ===== 案件管理 =====
    getCases: async (filters?: any): Promise<Case[]> => {
        await delay(600);
        let result = [...mockCases];

        // 優先處理 tabFilter (與側邊欄邏輯一致)
        if (filters?.tabFilter && CASE_FILTER_DEFINITIONS[filters.tabFilter]) {
            result = result.filter(CASE_FILTER_DEFINITIONS[filters.tabFilter]);
        }

        if (filters?.status && filters.status !== 'all') { // Only filter if not 'all'
            result = result.filter(c => c.status === filters.status);
        }
        if (filters?.type && filters.type !== 'all') {
            result = result.filter(c => c.type === filters.type);
        }
        if (filters?.priority && filters.priority !== 'all') {
            result = result.filter(c => c.priority === filters.priority);
        }
        return result;
    },

    getCaseById: async (id: string): Promise<Case | null> => {
        await delay(300);
        return mockCases.find(c => c.id === id) || null;
    },

    updateCase: async (id: string, data: Partial<Case>): Promise<boolean> => {
        await delay(800);
        const caseIndex = mockCases.findIndex(c => c.id === id);
        if (caseIndex !== -1) {
            mockCases[caseIndex] = { ...mockCases[caseIndex], ...data, updatedAt: new Date().toISOString() };
            return true;
        }
        return false;
    },

    assignCase: async (caseId: string, userId: string): Promise<boolean> => {
        await delay(600);
        const caseIndex = mockCases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            mockCases[caseIndex] = { ...mockCases[caseIndex], assignedTo: userId, status: 'assigned' as const, updatedAt: new Date().toISOString() };
            return true;
        }
        return false;
    },

    // ===== 用戶管理 =====
    getUsers: async (filters?: any): Promise<User[]> => {
        await delay(400);
        let result = [...mockUsers];
        if (filters?.role) {
            result = result.filter(u => u.role === filters.role);
        }
        if (filters?.status) {
            result = result.filter(u => u.status === filters.status);
        }
        return result;
    },

    getUserById: async (id: string): Promise<User | null> => {
        await delay(300);
        return mockUsers.find(u => u.id === id) || null;
    },

    createUser: async (data: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
        await delay(800);
        const newUser: User = {
            ...data,
            id: `u${mockUsers.length + 1}`,
            createdAt: new Date().toISOString()
        };
        mockUsers.push(newUser);
        return newUser.id;
    },

    updateUser: async (id: string, data: Partial<User>): Promise<boolean> => {
        await delay(600);
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
            return true;
        }
        return false;
    },

    deleteUser: async (id: string): Promise<boolean> => {
        await delay(500);
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            mockUsers.splice(userIndex, 1);
            return true;
        }
        return false;
    },

    // ===== 角色與權限 =====
    getRoles: async (): Promise<Role[]> => {
        await delay(300);
        return mockRoles;
    },

    getPermissions: async (): Promise<Permission[]> => {
        await delay(300);
        return mockPermissions;
    },

    // ===== 工作流程 =====
    getWorkflows: async (): Promise<Workflow[]> => {
        await delay(400);
        return mockWorkflows;
    },

    getWorkflowById: async (id: string): Promise<Workflow | null> => {
        await delay(300);
        return mockWorkflows.find(w => w.id === id) || null;
    },

    // ===== 代理人 =====
    getProxies: async (): Promise<ProxyAssignment[]> => {
        await delay(300);
        return mockProxies;
    },

    // ===== 審計日誌 =====
    getAuditLogs: async (filters?: any): Promise<AuditLog[]> => {
        await delay(500);
        let result = [...mockAuditLogs];
        if (filters?.userId) {
            result = result.filter(a => a.userId === filters.userId);
        }
        if (filters?.resource) {
            result = result.filter(a => a.resource === filters.resource);
        }
        return result;
    },

    // ===== 系統設定 =====
    getSystemConfig: async (): Promise<SystemConfig[]> => {
        await delay(400);
        return mockSystemConfig;
    },

    // ===== 介接設定 =====
    getIntegrations: async (): Promise<IntegrationConfig[]> => {
        await delay(400);
        return mockIntegrations;
    },

    // ===== 儀表板數據 =====
    getDashboardStats: async () => {
        await delay(800);
        return {
            totalCases: mockCases.length,
            pendingCases: mockCases.filter(c => c.status === 'pending').length,
            processingCases: mockCases.filter(c => c.status === 'processing').length,
            resolvedCases: mockCases.filter(c => c.status === 'resolved').length,
            criticalCases: mockCases.filter(c => c.priority === 'critical').length,
            totalUsers: mockUsers.length,
            activeUsers: mockUsers.filter(u => u.status === 'active').length,
        };
    },

    // 時間序列統計
    getDashboardTimeSeries: async (dateRange?: { start: string; end: string }) => {
        await delay(400);
        if (dateRange) {
            return mockTimeSeriesData.filter(
                d => d.date >= dateRange.start && d.date <= dateRange.end
            );
        }
        return mockTimeSeriesData;
    },

    // 案件類型統計
    getCaseTypeDistribution: async () => {
        await delay(300);
        const general = mockCases.filter(c => c.type === 'general').length;
        const bee = mockCases.filter(c => c.type === 'bee').length;
        const c1999 = mockCases.filter(c => c.type === '1999').length;
        const c1959 = mockCases.filter(c => c.type === '1959').length;

        return [
            { name: '一般案件', value: general, color: '#3b82f6' },
            { name: '蜂案通報', value: bee, color: '#f59e0b' },
            { name: '1999專案', value: c1999, color: '#e11d48' },
            { name: '1959專線', value: c1959, color: '#4f46e5' },
        ];
    },

    // 案件優先級統計
    getCasePriorityDistribution: async () => {
        await delay(300);
        return [
            {
                name: '最緊急',
                value: mockCases.filter(c => c.priority === 'critical').length,
                color: '#ef4444'
            },
            {
                name: '高',
                value: mockCases.filter(c => c.priority === 'high').length,
                color: '#f59e0b'
            },
            {
                name: '普通',
                value: mockCases.filter(c => c.priority === 'medium').length,
                color: '#3b82f6'
            },
            {
                name: '低',
                value: mockCases.filter(c => c.priority === 'low').length,
                color: '#6b7280'
            },
        ];
    },

    // 承辦人工作量統計
    getCasesByAssignee: async () => {
        await delay(300);
        const assigneeCounts: Record<string, number> = {};

        mockCases.forEach(c => {
            if (c.assignedTo) {
                assigneeCounts[c.assignedTo] = (assigneeCounts[c.assignedTo] || 0) + 1;
            }
        });

        return Object.entries(assigneeCounts).map(([userId, count]) => {
            const user = mockUsers.find(u => u.id === userId);
            return {
                name: user?.name || userId,
                cases: count,
            };
        });
    },

    // 每週統計（最近 4 週）
    getWeeklyStats: async () => {
        await delay(400);
        return [
            { week: '第 1 週', totalCases: 8, resolved: 5, pending: 3 },
            { week: '第 2 週', totalCases: 12, resolved: 8, pending: 4 },
            { week: '第 3 週', totalCases: 15, resolved: 11, pending: 4 },
            { week: '第 4 週', totalCases: 13, resolved: 9, pending: 4 },
        ];
    },

    // 按工作流程階段分組案件
    getCasesByWorkflowStage: async (stage: CaseWorkflowStage) => {
        await delay(300);
        return mockCases.filter(c => c.workflowStage === stage);
    },

    // 工作流程菜單項目（帶未處理計數）
    getWorkflowMenuItems: async () => {
        await delay(400);
        const stages: CaseWorkflowStage[] = ['receipt', 'assignment', 'undertaker', 'public'];
        const menuItems: Record<string, { items: Case[], label: string, unresolvedCount: number }> = {};

        stages.forEach(stage => {
            const items = mockCases.filter(c => c.workflowStage === stage);
            const unresolvedCount = items.filter(c =>
                c.status !== 'resolved' && c.status !== 'rejected' && c.status !== 'archived'
            ).length;

            const stageLabels: Record<CaseWorkflowStage, string> = {
                'receipt': '收簽',
                'assignment': '分派',
                'undertaker': '承辦',
                'public': '公文'
            };

            menuItems[stage] = {
                items,
                label: stageLabels[stage],
                unresolvedCount
            };
        });

        return menuItems;
    },

    // 獲取未處理計數統計
    getUnresolvedCounts: async () => {
        await delay(300);
        const stages: CaseWorkflowStage[] = ['receipt', 'assignment', 'undertaker', 'public'];
        const counts: Record<string, number> = {};

        stages.forEach(stage => {
            const items = mockCases.filter(c => c.workflowStage === stage);
            counts[stage] = items.filter(c =>
                c.status !== 'resolved' && c.status !== 'rejected' && c.status !== 'archived'
            ).length;
        });

        return counts;
    },

    // 獲取詳細的案件菜單項目（按狀態和優先級分組）
    getDetailedCaseMenu: async () => {
        await delay(400);
        const menuItems: Record<string, { items: Case[]; count: number }> = {};

        // 定義詳細的菜單項目
        const menuDefinitions = [
            { key: 'all', label: '全部案件' },
            { key: 'attention', label: '關注案件' },
            { key: 'receipt_pending', label: '收簽-待簽收' },
            { key: 'receipt_authorized', label: '收簽-已授理' },
            { key: 'assignment_assigned', label: '分派-已分派' },
            { key: 'undertaker_pending', label: '承辦-待簽收' },
            { key: 'undertaker_processing', label: '承辦-處理中' },
            { key: 'undertaker_transferred', label: '承辦-轉移中' },
            { key: 'undertaker_overdue', label: '承辦-超期' },
            { key: 'public_completed', label: '公文-待審核' },
            { key: 'resolved', label: '已結案' },
            { key: 'rejected', label: '責撤' },
        ];

        menuDefinitions.forEach(def => {
            const filterFn = CASE_FILTER_DEFINITIONS[def.key];
            const items = filterFn ? mockCases.filter(filterFn) : [];
            menuItems[def.key] = {
                items,
                count: items.length
            };
        });

        return menuItems;
    },

    // ===== 報表 =====
    generateReport: async (type: string, filters?: any) => {
        await delay(1200);
        let filteredCases = [...mockCases];

        // 應用過濾條件
        if (filters?.priority) {
            filteredCases = filteredCases.filter(c => c.priority === filters.priority);
        }
        if (filters?.status) {
            filteredCases = filteredCases.filter(c => c.status === filters.status);
        }
        if (filters?.type) {
            filteredCases = filteredCases.filter(c => c.type === filters.type);
        }

        // 統計數據
        const totalCases = filteredCases.length;
        const resolvedCases = filteredCases.filter(c => c.status === 'resolved').length;
        const pendingCases = filteredCases.filter(c => c.status === 'pending').length;
        const urgentCases = filteredCases.filter(c => c.priority === 'critical').length;

        const chartData = {
            statusDistribution: [
                { name: '已結案', value: resolvedCases, percentage: Math.round((resolvedCases / totalCases) * 100) || 0 },
                { name: '待處理', value: pendingCases, percentage: Math.round((pendingCases / totalCases) * 100) || 0 },
                { name: '處理中', value: filteredCases.filter(c => c.status === 'processing').length, percentage: Math.round((filteredCases.filter(c => c.status === 'processing').length / totalCases) * 100) || 0 },
            ],
            priorityDistribution: [
                { name: '緊急', value: urgentCases, color: '#ef4444' },
                { name: '普通', value: filteredCases.filter(c => c.priority === 'medium').length, color: '#f59e0b' },
                { name: '低', value: filteredCases.filter(c => c.priority === 'low').length, color: '#10b981' },
            ],
            weeklyStats: [
                { week: '第1週', cases: Math.floor(Math.random() * 20) + 5, resolved: Math.floor(Math.random() * 15) + 2 },
                { week: '第2週', cases: Math.floor(Math.random() * 20) + 5, resolved: Math.floor(Math.random() * 15) + 2 },
                { week: '第3週', cases: Math.floor(Math.random() * 20) + 5, resolved: Math.floor(Math.random() * 15) + 2 },
                { week: '第4週', cases: Math.floor(Math.random() * 20) + 5, resolved: Math.floor(Math.random() * 15) + 2 },
            ],
        };

        return {
            id: `R${Date.now()}`,
            type,
            generatedAt: new Date().toISOString(),
            summary: {
                totalCases,
                resolvedCases,
                pendingCases,
                urgentCases,
                averageResolutionTime: '3.5 天',
                satisfactionRate: '92%',
            },
            chartData,
            topCaseWorkers: [
                { name: '李承辦人', casesHandled: 28, avgResolutionTime: '2.8 天' },
                { name: '陳承辦人', casesHandled: 24, avgResolutionTime: '3.2 天' },
                { name: '張主管', casesHandled: 18, avgResolutionTime: '3.1 天' },
            ],
            data: filteredCases.slice(0, 10), // 只返回前 10 筆案件作為詳細資料
        };
    },

    // ===== 代理人管理進階 API =====
    createProxy: async (data: Omit<ProxyAssignment, 'id'>): Promise<string> => {
        await delay(600);
        const newProxy: ProxyAssignment = {
            ...data,
            id: `px${mockProxies.length + 1}`,
        };
        mockProxies.push(newProxy);
        return newProxy.id;
    },

    updateProxy: async (id: string, data: Partial<ProxyAssignment>): Promise<boolean> => {
        await delay(500);
        const proxyIndex = mockProxies.findIndex(p => p.id === id);
        if (proxyIndex !== -1) {
            mockProxies[proxyIndex] = { ...mockProxies[proxyIndex], ...data };
            return true;
        }
        return false;
    },

    deleteProxy: async (id: string): Promise<boolean> => {
        await delay(400);
        const proxyIndex = mockProxies.findIndex(p => p.id === id);
        if (proxyIndex !== -1) {
            mockProxies.splice(proxyIndex, 1);
            return true;
        }
        return false;
    },

    validateProxyPeriod: async (userId: string, startDate: string, endDate: string): Promise<boolean> => {
        await delay(300);
        // 檢查是否有時間重疊的代理設定
        const hasOverlap = mockProxies.some(p =>
            p.from === userId &&
            p.status === 'active' &&
            ((startDate >= p.startDate && startDate <= p.endDate) ||
                (endDate >= p.startDate && endDate <= p.endDate))
        );
        return !hasOverlap;
    },

    getActiveProxy: async (userId: string): Promise<ProxyAssignment | null> => {
        await delay(300);
        const today = new Date().toISOString().split('T')[0];
        return mockProxies.find(p =>
            p.from === userId &&
            p.status === 'active' &&
            p.startDate <= today &&
            p.endDate >= today
        ) || null;
    },

    // ===== 外部系統介接 API =====
    // 1999 通報系統同步
    syncWith1999: async (): Promise<{ success: boolean; imported: number; errors: number }> => {
        await delay(1500);
        // 模擬從 1999 系統匯入案件
        const imported = Math.floor(Math.random() * 5) + 1;
        console.log(`[MockAPI] Synced with 1999: ${imported} cases imported`);
        return { success: true, imported, errors: 0 };
    },

    // 農業部寵物登記查詢
    queryPetRegistry: async (chipId?: string, ownerId?: string): Promise<any[]> => {
        await delay(800);
        // 模擬寵物登記資料
        return [
            {
                chipId: '900123456789012',
                petName: '小黑',
                species: '犬',
                breed: '混種',
                ownerName: '王小明',
                ownerId: 'A123456789',
                registeredAt: '2023-05-15',
            },
        ];
    },

    // 財政局罰鍰查詢
    queryPenaltyRecords: async (ownerId: string): Promise<any[]> => {
        await delay(700);
        // 模擬罰鍰記錄
        return [
            {
                penaltyId: 'P2026010001',
                ownerId,
                caseId: 'C20260115001',
                amount: 3000,
                status: 'unpaid',
                issuedAt: '2026-01-15',
                dueDate: '2026-02-15',
            },
        ];
    },

    // 公文系統生成公文
    generateDocument: async (caseId: string, templateType: string): Promise<string> => {
        await delay(1000);
        const docId = `DOC${Date.now()}`;
        console.log(`[MockAPI] Generated document ${docId} for case ${caseId}`);
        return docId;
    },

    // 外部案件匯入
    importExternalCase: async (source: string, externalData: any): Promise<string> => {
        await delay(1200);
        const caseId = `C${Date.now()}`;
        console.log(`[MockAPI] Imported case ${caseId} from ${source}`);
        return caseId;
    },

    // 案件去重比對
    deduplicateCases: async (caseId: string): Promise<{ duplicates: string[]; confidence: number }[]> => {
        await delay(900);
        // 模擬找到相似案件
        return [
            { duplicates: ['C20260120003'], confidence: 0.85 },
        ];
    },

    // 同步狀態推送（回報至外部系統）
    syncCaseStatus: async (caseId: string, status: string): Promise<boolean> => {
        await delay(600);
        console.log(`[MockAPI] Synced case ${caseId} status to external systems`);
        return true;
    },

    // 更新介接設定
    updateIntegration: async (id: string, data: Partial<IntegrationConfig>): Promise<boolean> => {
        await delay(500);
        const index = mockIntegrations.findIndex(i => i.id === id);
        if (index !== -1) {
            mockIntegrations[index] = { ...mockIntegrations[index], ...data };
            return true;
        }
        return false;
    },

    // 測試介接連線
    testIntegrationConnection: async (id: string): Promise<{ success: boolean; latency?: number; error?: string }> => {
        await delay(1000);
        return {
            success: true,
            latency: Math.floor(Math.random() * 200) + 50,
        };
    },

    // 取得介接日誌
    getIntegrationLogs: async (filters?: { integrationId?: string; status?: string }): Promise<any[]> => {
        await delay(500);
        let result = [...mockIntegrationLogs];
        if (filters?.integrationId) {
            result = result.filter(l => l.integrationId === filters.integrationId);
        }
        if (filters?.status) {
            result = result.filter(l => l.status === filters.status);
        }
        return result;
    },

    // ===== 案件管理進階功能 API =====
    // 承辦人回報案件
    reportCase: async (caseId: string, reportData: { content: string; attachments?: string[] }): Promise<boolean> => {
        await delay(800);
        const caseIndex = mockCases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            mockCases[caseIndex] = {
                ...mockCases[caseIndex],
                reportContent: reportData.content,
                reportedAt: new Date().toISOString(),
                reportedBy: 'u2', // 模擬承辦人 ID
                status: 'completed' as const,
                updatedAt: new Date().toISOString(),
            };
            return true;
        }
        return false;
    },

    // 上傳附件
    uploadAttachment: async (caseId: string, file: File | { name: string; size: number }): Promise<string> => {
        await delay(1000);
        const attachmentId = `ATT${Date.now()}`;
        console.log(`[MockAPI] Uploaded attachment ${attachmentId} for case ${caseId}`);
        return attachmentId;
    },

    // 標記異常案件
    markAnomalous: async (caseId: string, reason: string): Promise<boolean> => {
        await delay(500);
        const caseIndex = mockCases.findIndex(c => c.id === caseId);
        if (caseIndex !== -1) {
            mockCases[caseIndex] = {
                ...mockCases[caseIndex],
                isAnomalous: true,
                anomalyReason: reason,
                updatedAt: new Date().toISOString(),
            };
            return true;
        }
        return false;
    },

    // 取得案件完整歷程
    getCaseHistory: async (caseId: string): Promise<any[]> => {
        await delay(400);
        // 模擬案件歷程記錄
        return [
            {
                id: 'h1',
                caseId,
                action: 'created',
                description: '案件建立',
                performedBy: '系統',
                performedAt: '2026-01-15T08:00:00Z',
            },
            {
                id: 'h2',
                caseId,
                action: 'assigned',
                description: '分派給承辦人',
                performedBy: 'u1',
                performedAt: '2026-01-15T09:00:00Z',
            },
            {
                id: 'h3',
                caseId,
                action: 'processing',
                description: '開始處理',
                performedBy: 'u2',
                performedAt: '2026-01-15T10:00:00Z',
            },
        ];
    },

    // 推送工作流程給用戶
    pushWorkflowToUser: async (workflowId: string, userIds: string[]): Promise<boolean> => {
        await delay(600);
        console.log(`[MockAPI] Pushed workflow ${workflowId} to users:`, userIds);
        return true;
    },

    // 搜索案件（進階多條件）
    searchCases: async (query: {
        keyword?: string;
        type?: string[];
        status?: string[];
        dateRange?: { start: string; end: string };
        location?: string;
        priority?: string[];
    }): Promise<Case[]> => {
        await delay(700);
        let result = [...mockCases];

        if (query.keyword) {
            result = result.filter(c =>
                c.title.includes(query.keyword!) ||
                c.description.includes(query.keyword!)
            );
        }
        if (query.type) {
            result = result.filter(c => query.type!.includes(c.type));
        }
        if (query.status) {
            result = result.filter(c => query.status!.includes(c.status));
        }
        if (query.priority) {
            result = result.filter(c => query.priority!.includes(c.priority));
        }
        if (query.location) {
            result = result.filter(c => c.location.includes(query.location!));
        }
        if (query.dateRange) {
            result = result.filter(c =>
                c.date >= query.dateRange!.start && c.date <= query.dateRange!.end
            );
        }

        return result;
    },

    // 批次更新案件
    batchUpdateCases: async (caseIds: string[], updates: Partial<Case>): Promise<number> => {
        await delay(1000);
        let updated = 0;
        caseIds.forEach(id => {
            const index = mockCases.findIndex(c => c.id === id);
            if (index !== -1) {
                mockCases[index] = { ...mockCases[index], ...updates, updatedAt: new Date().toISOString() };
                updated++;
            }
        });
        return updated;
    },

    // ===== 權限控管進階 API =====
    // 檢查用戶是否具有特定權限
    checkPermission: async (userId: string, permission: string): Promise<boolean> => {
        await delay(200);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return false;

        const role = mockRoles.find(r => r.name === user.role);
        return role ? role.permissions.includes(permission) : false;
    },

    // 取得分層權限的資料
    getLayeredData: async (userId: string, resourceType: string): Promise<any[]> => {
        await delay(400);
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return [];

        // 模擬分層權限：管理員可看全部，其他角色僅看本單位
        if (user.role === 'admin') {
            return resourceType === 'case' ? mockCases : [];
        }

        return resourceType === 'case'
            ? mockCases.filter(c => c.assignedTo === userId)
            : [];
    },

    // 密碼重設
    resetPassword: async (userId: string): Promise<string> => {
        await delay(600);
        const tempPassword = Math.random().toString(36).slice(-8);
        console.log(`[MockAPI] Password reset for user ${userId}: ${tempPassword}`);
        return tempPassword;
    },

    // 帳號凍結
    freezeAccount: async (userId: string, reason: string): Promise<boolean> => {
        await delay(500);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            mockUsers[userIndex].status = 'frozen' as any;
            mockAuditLogs.push({
                id: `a${mockAuditLogs.length + 1}`,
                userId: 'u1',
                action: 'freeze',
                resource: 'user',
                resourceId: userId,
                metadata: { reason },
                timestamp: new Date().toISOString(),
            });
            return true;
        }
        return false;
    },

    // 帳號啟用
    activateAccount: async (userId: string): Promise<boolean> => {
        await delay(500);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            mockUsers[userIndex].status = 'active';
            mockAuditLogs.push({
                id: `a${mockAuditLogs.length + 1}`,
                userId: 'u1',
                action: 'activate',
                resource: 'user',
                resourceId: userId,
                timestamp: new Date().toISOString(),
            });
            return true;
        }
        return false;
    },

    // 權限異動稽核
    auditPermissionChange: async (userId: string, changes: any): Promise<boolean> => {
        await delay(400);
        mockAuditLogs.push({
            id: `a${mockAuditLogs.length + 1}`,
            userId: 'u1',
            action: 'permission_change',
            resource: 'user',
            resourceId: userId,
            changes,
            timestamp: new Date().toISOString(),
        });
        return true;
    },

    // 設定外部人員特殊權限
    setSpecialPermission: async (userId: string, permissions: string[]): Promise<boolean> => {
        await delay(500);
        const userIndex = mockUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            // 標記為外部人員並記錄特殊權限
            mockUsers[userIndex].isExternal = true;
            console.log(`[MockAPI] Set special permissions for external user ${userId}:`, permissions);
            return true;
        }
        return false;
    },

    // ===== 系統設定與維運管理 API =====
    // 取得系統參數清單
    getSystemParameters: async (category?: string): Promise<any[]> => {
        await delay(400);
        const params = [
            { id: 'p1', category: 'general', key: 'system_timezone', value: 'Asia/Taipei', dataType: 'string', description: '系統時區', isEditable: true },
            { id: 'p2', category: 'general', key: 'system_language', value: 'zh-TW', dataType: 'string', description: '系統語言', isEditable: true },
            { id: 'p3', category: 'case', key: 'case_auto_close_days', value: 30, dataType: 'number', description: '案件自動結案天數', isEditable: true },
            { id: 'p4', category: 'backup', key: 'backup_schedule', value: 'daily', dataType: 'string', description: '備份排程', isEditable: true },
            { id: 'p5', category: 'backup', key: 'backup_retention_days', value: 7, dataType: 'number', description: '備份保留天數', isEditable: true },
        ];
        return category ? params.filter(p => p.category === category) : params;
    },

    // 更新系統參數
    updateSystemParameter: async (key: string, value: any): Promise<boolean> => {
        await delay(500);
        const configIndex = mockSystemConfig.findIndex(c => c.key === key);
        if (configIndex !== -1) {
            mockSystemConfig[configIndex].value = value;
            return true;
        }
        return false;
    },

    // 取得版本控管歷程
    getVersionHistory: async (resourceType: string, resourceId: string): Promise<any[]> => {
        await delay(400);
        return [
            {
                id: 'v1',
                resourceType,
                resourceId,
                version: '1.0',
                changes: '初始版本',
                changedBy: 'u1',
                changedAt: '2026-01-01T00:00:00Z',
            },
            {
                id: 'v2',
                resourceType,
                resourceId,
                version: '1.1',
                changes: '調整流程步驟',
                changedBy: 'u1',
                changedAt: '2026-01-10T00:00:00Z',
            },
        ];
    },

    // 資料庫備份
    backupDatabase: async (type: 'auto' | 'manual' = 'manual'): Promise<string> => {
        await delay(2000);
        const backupId = `BKP${Date.now()}`;
        console.log(`[MockAPI] Database backup created: ${backupId} (${type})`);
        return backupId;
    },

    // 資料庫還原
    restoreDatabase: async (backupId: string): Promise<boolean> => {
        await delay(2500);
        console.log(`[MockAPI] Database restored from backup: ${backupId}`);
        return true;
    },

    // 取得備份清單
    getBackupList: async (): Promise<any[]> => {
        await delay(500);
        return [
            {
                id: 'bkp1',
                filename: 'backup_20260121_080000.sql',
                fileSize: 1024 * 1024 * 50, // 50MB
                backupType: 'auto',
                status: 'completed',
                createdAt: '2026-01-21T08:00:00Z',
                retentionDays: 7,
            },
            {
                id: 'bkp2',
                filename: 'backup_20260120_080000.sql',
                fileSize: 1024 * 1024 * 48,
                backupType: 'auto',
                status: 'completed',
                createdAt: '2026-01-20T08:00:00Z',
                retentionDays: 7,
            },
        ];
    },

    // 取得資料庫日誌
    getDatabaseLog: async (filters?: { level?: string; startDate?: string; endDate?: string }): Promise<any[]> => {
        await delay(600);
        return [
            {
                id: 'log1',
                level: 'info',
                message: '資料庫連接正常',
                timestamp: '2026-01-21T10:00:00Z',
            },
            {
                id: 'log2',
                level: 'warning',
                message: '查詢效能警告：執行時間超過 2 秒',
                timestamp: '2026-01-21T09:45:00Z',
            },
        ];
    },

    // ===== 報表進階功能 API =====
    // 匯出報表（ODF 格式）
    exportReportODF: async (reportId: string, format: 'odt' | 'ods'): Promise<string> => {
        await delay(1500);
        const fileUrl = `https://mock-api.example.com/reports/${reportId}.${format}`;
        console.log(`[MockAPI] Report exported: ${fileUrl}`);
        return fileUrl;
    },

    // 取得分層報表
    getLayeredReport: async (userId: string, reportType: string): Promise<any> => {
        await delay(800);
        const user = mockUsers.find(u => u.id === userId);
        const isAdmin = user?.role === 'admin';

        return {
            id: `R${Date.now()}`,
            type: reportType,
            dataScope: isAdmin ? '全機關' : '本單位',
            data: isAdmin ? mockCases : mockCases.filter(c => c.assignedTo === userId),
        };
    },

    // 動保評鑑表
    getAssessmentReport: async (filters?: any): Promise<any> => {
        await delay(1000);
        return {
            id: `AR${Date.now()}`,
            type: 'assessment',
            generatedAt: new Date().toISOString(),
            data: {
                totalCases: mockCases.length,
                resolvedRate: '85%',
                avgResolutionTime: '3.5 天',
                satisfactionScore: 4.2,
            },
        };
    },

    // 家訪報表
    getHomeVisitReport: async (filters?: any): Promise<any> => {
        await delay(900);
        return {
            id: `HVR${Date.now()}`,
            type: 'home_visit',
            generatedAt: new Date().toISOString(),
            data: {
                totalVisits: 28,
                completedVisits: 24,
                pendingVisits: 4,
            },
        };
    },

    // 遊蕩犬報表
    getStrayDogReport: async (filters?: any): Promise<any> => {
        await delay(900);
        return {
            id: `SDR${Date.now()}`,
            type: 'stray_dog',
            generatedAt: new Date().toISOString(),
            data: {
                totalReports: 45,
                captured: 32,
                adopted: 15,
            },
        };
    },

    // 勤務三聯單
    getDutySliponReport: async (caseId: string): Promise<any> => {
        await delay(800);
        const caseData = mockCases.find(c => c.id === caseId);
        return {
            id: `DS${Date.now()}`,
            type: 'duty_slip',
            caseId,
            caseData,
            generatedAt: new Date().toISOString(),
        };
    },

    // 報表查詢稽核追蹤
    trackReportAccess: async (userId: string, reportId: string, action: 'view' | 'download' | 'print'): Promise<boolean> => {
        await delay(300);
        mockAuditLogs.push({
            id: `a${mockAuditLogs.length + 1}`,
            userId,
            action: `report_${action}`,
            resource: 'report',
            resourceId: reportId,
            timestamp: new Date().toISOString(),
        });
        return true;
    },

    // ===== 併案處理相關 API =====

    // 合併案件
    mergeCases: async (primaryId: string, duplicateIds: string[], notes?: string, userId?: string): Promise<boolean> => {
        await delay(800);

        const primaryCase = mockCases.find(c => c.id === primaryId);
        if (!primaryCase) return false;

        // 更新主案件
        primaryCase.mergeStatus = 'original';
        primaryCase.mergedCases = [...(primaryCase.mergedCases || []), ...duplicateIds];
        primaryCase.updatedAt = new Date().toISOString();

        // 更新重複案件
        duplicateIds.forEach(dupId => {
            const dupCase = mockCases.find(c => c.id === dupId);
            if (dupCase) {
                dupCase.mergeStatus = 'merged';
                dupCase.mergedWith = primaryId;
                dupCase.mergeNotes = notes;
                dupCase.mergedAt = new Date().toISOString();
                dupCase.mergedBy = userId || 'u1';
                dupCase.duplicateCheckStatus = 'confirmed';
                dupCase.updatedAt = new Date().toISOString();
            }

            // 創建併案記錄
            mockMergeRecords.push({
                id: `mr${mockMergeRecords.length + 1}`,
                primaryCaseId: primaryId,
                duplicateCaseId: dupId,
                mergeType: 'manual',
                matchType: 'manual',
                confidence: 1.0,
                status: 'approved',
                notes: notes || '手動併案',
                createdBy: userId || 'u1',
                createdAt: new Date().toISOString(),
                reviewedBy: userId || 'u1',
                reviewedAt: new Date().toISOString(),
            });
        });

        // 記錄審計日誌
        mockAuditLogs.push({
            id: `a${mockAuditLogs.length + 1}`,
            userId: userId || 'u1',
            action: 'merge_case',
            resource: 'case',
            resourceId: primaryId,
            metadata: { duplicateIds, notes },
            timestamp: new Date().toISOString(),
        });

        console.log(`[MockAPI] Merged cases ${duplicateIds.join(', ')} into ${primaryId}`);
        return true;
    },

    // 獲取疑似重複案件建議
    getDuplicateSuggestions: async (caseId?: string): Promise<CaseMergeRecord[]> => {
        await delay(600);

        // 如果指定案件ID,返回該案件的重複建議
        if (caseId) {
            const targetCase = mockCases.find(c => c.id === caseId);
            if (!targetCase) return [];

            // 模擬檢測重複
            const suggestions: CaseMergeRecord[] = [];

            mockCases.forEach(c => {
                if (c.id === caseId) return;

                let matchType: 'external_id' | 'chip_id' | 'location' | 'manual' | null = null;
                let confidence = 0;

                // Level 1: 外部ID比對
                if (targetCase.externalCaseId && c.externalCaseId === targetCase.externalCaseId) {
                    matchType = 'external_id';
                    confidence = 1.0;
                }
                // Level 2: 晶片比對
                else if (targetCase.petChipId && c.petChipId === targetCase.petChipId) {
                    matchType = 'chip_id';
                    confidence = 0.95;
                }
                // Level 3: 時空比對
                else if (
                    targetCase.coordinates && c.coordinates &&
                    targetCase.date === c.date &&
                    targetCase.type === c.type
                ) {
                    const latDiff = Math.abs(targetCase.coordinates.lat - c.coordinates.lat);
                    const lngDiff = Math.abs(targetCase.coordinates.lng - c.coordinates.lng);
                    if (latDiff < 0.00045 && lngDiff < 0.00045) {
                        matchType = 'location';
                        confidence = 0.75;
                    }
                }

                if (matchType && confidence > 0) {
                    suggestions.push({
                        id: `temp_${suggestions.length}`,
                        primaryCaseId: caseId,
                        duplicateCaseId: c.id,
                        mergeType: 'manual',
                        matchType,
                        confidence,
                        status: 'pending',
                        createdBy: 'system',
                        createdAt: new Date().toISOString(),
                    });
                }
            });

            return suggestions.sort((a, b) => b.confidence - a.confidence);
        }

        // 返回所有待審核的重複建議
        return mockMergeRecords.filter(mr => mr.status === 'pending');
    },

    // 獲取併案歷史記錄
    getMergeHistory: async (caseId: string): Promise<CaseMergeRecord[]> => {
        await delay(400);
        return mockMergeRecords.filter(
            mr => mr.primaryCaseId === caseId || mr.duplicateCaseId === caseId
        );
    },

    // 標記為非重複
    dismissDuplicate: async (caseId: string, duplicateId: string, reason: string, userId?: string): Promise<boolean> => {
        await delay(500);

        const targetCase = mockCases.find(c => c.id === caseId);
        const dupCase = mockCases.find(c => c.id === duplicateId);

        if (!targetCase || !dupCase) return false;

        // 更新重複檢查狀態
        dupCase.duplicateCheckStatus = 'dismissed';
        dupCase.updatedAt = new Date().toISOString();

        // 創建併案記錄(狀態為rejected)
        mockMergeRecords.push({
            id: `mr${mockMergeRecords.length + 1}`,
            primaryCaseId: caseId,
            duplicateCaseId: duplicateId,
            mergeType: 'manual',
            matchType: 'manual',
            confidence: 0,
            status: 'rejected',
            notes: `非重複案件: ${reason}`,
            createdBy: userId || 'u1',
            createdAt: new Date().toISOString(),
            reviewedBy: userId || 'u1',
            reviewedAt: new Date().toISOString(),
        });

        // 記錄審計日誌
        mockAuditLogs.push({
            id: `a${mockAuditLogs.length + 1}`,
            userId: userId || 'u1',
            action: 'dismiss_duplicate',
            resource: 'case',
            resourceId: caseId,
            metadata: { duplicateId, reason },
            timestamp: new Date().toISOString(),
        });

        console.log(`[MockAPI] Dismissed duplicate: ${caseId} vs ${duplicateId}`);
        return true;
    },

    // 批次檢測重複案件
    findAllDuplicates: async (caseIds: string[]): Promise<Map<string, CaseMergeRecord[]>> => {
        await delay(1000);

        const result = new Map<string, CaseMergeRecord[]>();

        for (const caseId of caseIds) {
            const suggestions = await mockApi.getDuplicateSuggestions(caseId);
            if (suggestions.length > 0) {
                result.set(caseId, suggestions);
            }
        }

        return result;
    },

    // ===== 角色管理 =====
    createRole: async (roleData: { name: string; description: string; permissions: string[] }): Promise<Role> => {
        await delay(500);
        const newRole: Role = {
            id: `r${mockRoles.length + 1}`,
            name: roleData.name,
            description: roleData.description,
            permissions: roleData.permissions
        };
        mockRoles.push(newRole);
        console.log('[MockAPI] Role Created:', newRole);
        return newRole;
    },

    updateRole: async (roleId: string, roleData: Partial<Role>): Promise<Role> => {
        await delay(500);
        const roleIndex = mockRoles.findIndex(r => r.id === roleId);
        if (roleIndex === -1) throw new Error('角色不存在');

        mockRoles[roleIndex] = { ...mockRoles[roleIndex], ...roleData };
        console.log('[MockAPI] Role Updated:', mockRoles[roleIndex]);
        return mockRoles[roleIndex];
    },

    deleteRole: async (roleId: string): Promise<boolean> => {
        await delay(500);
        const roleIndex = mockRoles.findIndex(r => r.id === roleId);
        if (roleIndex === -1) return false;

        mockRoles.splice(roleIndex, 1);
        console.log('[MockAPI] Role Deleted:', roleId);
        return true;
    },

    // ===== 權限管理 =====
    createPermission: async (permData: { id: string; name: string; description: string; category: string }): Promise<Permission> => {
        await delay(500);
        const newPermission: Permission = {
            id: permData.id,
            name: permData.name,
            description: permData.description,
            category: permData.category
        };
        mockPermissions.push(newPermission);
        console.log('[MockAPI] Permission Created:', newPermission);
        return newPermission;
    },

    updatePermission: async (permId: string, permData: Partial<Permission>): Promise<Permission> => {
        await delay(500);
        const permIndex = mockPermissions.findIndex(p => p.id === permId);
        if (permIndex === -1) throw new Error('權限不存在');

        mockPermissions[permIndex] = { ...mockPermissions[permIndex], ...permData };
        console.log('[MockAPI] Permission Updated:', mockPermissions[permIndex]);
        return mockPermissions[permIndex];
    },

    deletePermission: async (permId: string): Promise<boolean> => {
        await delay(500);
        const permIndex = mockPermissions.findIndex(p => p.id === permId);
        if (permIndex === -1) return false;

        mockPermissions.splice(permIndex, 1);
        console.log('[MockAPI] Permission Deleted:', permId);
        return true;
    },
};
