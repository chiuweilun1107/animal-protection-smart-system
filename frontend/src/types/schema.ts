import { z } from 'zod';

// 公開表單 Schema
export const reportSchema = z.object({
    contactName: z.string().optional(),
    contactPhone: z.string().regex(/^09\d{8}$/, { message: '請輸入有效的手機號碼 (e.g. 0912345678)' }).optional().or(z.literal('')),
    location: z.string().min(1, { message: '請輸入或釘選案件地點' }),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
    description: z.string().min(5, { message: '請至少輸入 5 個字的描述' }),

    // Captcha Input
    captchaInput: z.string().length(4, { message: '請輸入 4 位數驗證碼' }),

    // Bee specific (Conditional)
    beeHiveSize: z.enum(['fist', 'ball', 'tire']).optional(),
    beeHivePosition: z.enum(['tree', 'eaves', 'ground', 'other']).optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;

// 後台使用的數據類型
export type CaseStatus =
    | 'pending'                    // 待處理
    | 'authorized'                 // 已授理
    | 'assigned'                   // 已分派
    | 'processing'                 // 處理中
    | 'transferred'                // 轉移中
    | 'completed'                  // 已完成
    | 'resolved'                   // 已結案
    | 'rejected'                   // 責撤
    | 'overdue'                    // 超期
    | 'archived';                  // 歸檔

export type CaseWorkflowStage =
    | 'receipt'                    // 收簽
    | 'assignment'                 // 分派
    | 'undertaker'                 // 承辦
    | 'public'                     // 公文

export type CaseType = 'general' | 'bee' | '1999' | '1959';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'admin' | 'caseworker' | 'field_investigator' | 'supervisor' | 'public';
export type WorkflowStepStatus = 'pending' | 'completed' | 'skipped';

// 案件附件
export interface CaseAttachment {
    id: string;
    caseId: string;
    filename: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    uploadedAt: string;
    description?: string;
}

// 案件歷程記錄
export interface CaseHistory {
    id: string;
    caseId: string;
    action: string;
    description: string;
    performedBy: string;
    performedAt: string;
    previousStatus?: CaseStatus;
    newStatus?: CaseStatus;
    metadata?: Record<string, any>;
}

// 案件數據
export interface Case {
    id: string;
    type: CaseType;
    title: string;
    status: CaseStatus;
    workflowStage: CaseWorkflowStage;  // 當前所在工作流階段
    priority: CasePriority;
    date: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    reporterName: string;
    reporterPhone?: string;
    description: string;
    // 用語統一與截圖對齊
    petitionerName?: string;           // 陳情人姓名 (Alias for reporterName)
    petitionerPhone?: string;          // 陳情人電話 (Alias for reporterPhone)

    photos?: string[];
    attachments?: CaseAttachment[];    // 附件列表
    assignedTo?: string;
    assignees?: string[];              // 指派人員清單 (多位人員)
    history?: CaseHistory[];           // 案件歷程紀錄
    priorityLabel?: string;            // 優先度標籤 (e.g. 一般)
    signedAt?: string;                 // 簽收時間
    notes?: string;                    // 備註
    createdAt: string;
    updatedAt: string;
    workflowId?: string;

    // 進階欄位
    source?: 'web' | '1999' | '1959' | 'agriculture' | 'manual';  // 案件來源
    isAnomalous?: boolean;             // 是否標記為異常
    anomalyReason?: string;            // 異常原因（重複、偽報等）
    reportedAt?: string;               // 承辦人回報時間
    reportedBy?: string;               // 回報人 ID
    reportContent?: string;            // 回報內容
    externalCaseId?: string;           // 外部系統案件編號
    petChipId?: string;                // 寵物晶片號碼

    // 併案處理欄位
    mergeStatus?: 'original' | 'merged' | 'duplicate';  // 併案狀態
    mergedWith?: string;               // 併入的主案件 ID
    mergedCases?: string[];            // 被併入的子案件 ID 列表
    mergeNotes?: string;               // 併案備註
    mergedAt?: string;                 // 併案時間
    mergedBy?: string;                 // 併案操作人
    duplicateConfidence?: number;      // 重複相似度 (0-1)
    duplicateCheckStatus?: 'pending' | 'checked' | 'confirmed' | 'dismissed'; // 去重檢查狀態
}

// 用戶數據
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    unit: string;
    phone?: string;
    status: 'active' | 'inactive' | 'frozen';
    createdAt: string;

    // 進階欄位
    employeeId?: string;               // 員工編號
    department?: string;               // 部門
    isExternal?: boolean;              // 是否為外部人員（跨部會、其他單位）
    permissionLayer?: string;          // 權限層級（局、處、科等）
}

// 角色數據
export interface Role {
    id: string;
    name: string;
    permissions: string[];
    description: string;
}

// 權限定義
export interface Permission {
    id: string;
    name: string;
    category: string;
    description: string;
}

// 工作流程
export interface Workflow {
    id: string;
    name: string;
    type: CaseType;
    steps: WorkflowStep[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    // 進階欄位
    version?: string;                  // 版本號
    changelog?: string;                // 異動歷程
    publishedAt?: string;              // 發佈時間
    publishedBy?: string;              // 發佈人
}

export interface WorkflowStep {
    id: string;
    name: string;
    order: number;
    status: WorkflowStepStatus;
    description: string;
    requiredFields?: string[];
}

// 代理人設定
export interface ProxyAssignment {
    id: string;
    from: string; // User ID
    to: string; // User ID (代理人)
    startDate: string;
    endDate: string;
    reason: string;
    status: 'active' | 'expired';
}

// 報表
export interface Report {
    id: string;
    name: string;
    type: 'inspection' | 'visit' | 'stray_dog' | 'duty_form';
    data: any;
    createdAt: string;
}

// 稽核日誌
export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    resource: string;
    resourceId: string;
    changes?: any;
    metadata?: Record<string, any>;
    timestamp: string;
}

// 系統設定
export interface SystemConfig {
    key: string;
    value: any;
    description: string;
    category: string;
}

// 介接設定
export interface IntegrationConfig {
    id: string;
    name: string;
    type: '1999' | 'agriculture' | 'finance' | 'document';
    endpoint: string;
    status: 'connected' | 'disconnected' | 'error';
    lastSync?: string;
    configuration: Record<string, any>;
    retryStrategy?: {
        maxRetries: number;
        retryInterval: number;
    };
    schedule?: string;                 // 排程設定 (cron 格式)
}

// 介接日誌
export interface IntegrationLog {
    id: string;
    integrationId: string;
    integrationType: '1999' | 'agriculture' | 'finance' | 'document';
    action: 'import' | 'export' | 'sync' | 'query';
    status: 'success' | 'failed' | 'partial';
    recordCount?: number;
    errorMessage?: string;
    executedAt: string;
    duration?: number;                 // 執行時間（毫秒）
    metadata?: Record<string, any>;
}

// 備份記錄
export interface BackupRecord {
    id: string;
    filename: string;
    fileSize: number;
    backupType: 'auto' | 'manual';
    status: 'completed' | 'failed' | 'in_progress';
    createdAt: string;
    createdBy?: string;
    downloadUrl?: string;
    retentionDays: number;
}

// 系統參數
export interface SystemParameter {
    id: string;
    category: string;
    key: string;
    value: any;
    dataType: 'string' | 'number' | 'boolean' | 'json';
    description: string;
    isEditable: boolean;
    updatedAt?: string;
    updatedBy?: string;
}

// 版本控管記錄
export interface VersionHistory {
    id: string;
    resourceType: 'workflow' | 'parameter' | 'system';
    resourceId: string;
    version: string;
    changes: string;
    changedBy: string;
    changedAt: string;
    previousValue?: any;
    newValue?: any;
}

// 報表匯出格式
export type ReportFormat = 'pdf' | 'odt' | 'ods' | 'excel' | 'csv';

// 報表類型擴展
export type ReportType =
    | 'assessment'       // 動保評鑑表
    | 'home_visit'       // 家訪報表
    | 'stray_dog'        // 遊蕩犬報表
    | 'duty_slip'        // 勤務三聯單
    | 'statistics'       // 統計報表
    | 'audit'            // 稽核報表
    | 'custom';          // 自訂報表

// 報表查詢參數
export interface ReportQuery {
    type: ReportType;
    format: ReportFormat;
    filters?: {
        caseType?: CaseType[];
        status?: CaseStatus[];
        priority?: CasePriority[];
        dateRange?: { start: string; end: string };
        location?: string;
        assignedTo?: string[];
    };
    fields?: string[];             // 自訂欄位
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// 併案處理記錄
export interface CaseMergeRecord {
    id: string;
    primaryCaseId: string;      // 主案件 ID
    duplicateCaseId: string;    // 重複案件 ID
    mergeType: 'auto' | 'manual'; // 併案類型
    matchType: 'external_id' | 'chip_id' | 'location' | 'manual'; // 比對類型
    confidence: number;         // 相似度
    status: 'pending' | 'approved' | 'rejected'; // 審核狀態
    notes?: string;             // 備註
    createdBy: string;          // 建立人
    createdAt: string;          // 建立時間
    reviewedBy?: string;        // 審核人
    reviewedAt?: string;        // 審核時間
}
