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
export type CaseStatus = 'pending' | 'processing' | 'resolved' | 'rejected' | 'archived';
export type CaseType = 'general' | 'bee' | '1999' | '1959';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'admin' | 'caseworker' | 'supervisor' | 'public';
export type WorkflowStepStatus = 'pending' | 'completed' | 'skipped';

// 案件數據
export interface Case {
    id: string;
    type: CaseType;
    title: string;
    status: CaseStatus;
    priority: CasePriority;
    date: string;
    location: string;
    coordinates?: { lat: number; lng: number };
    reporterName: string;
    reporterPhone?: string;
    description: string;
    photos?: string[];
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
    workflowId?: string;
}

// 用戶數據
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    unit: string;
    phone?: string;
    status: 'active' | 'inactive';
    createdAt: string;
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
}
