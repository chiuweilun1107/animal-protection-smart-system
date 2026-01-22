import React from 'react';
// Force layout refresh 2026-01-22
import { Calendar, User, Clock, Shield, AlertCircle, FileText, Phone } from 'lucide-react';
import type { Case, User as UserType } from '../../types/schema';

interface CaseSidebarProps {
    caseData: Case;
    assignedUser?: UserType;
}

export const CaseSidebar: React.FC<CaseSidebarProps> = ({ caseData, assignedUser }) => {
    const statusMap: Record<string, string> = {
        'pending': '待處理',
        'authorized': '已受理',
        'assigned': '已分派',
        'processing': '處理中',
        'transferred': '轉移中',
        'overdue': '超期',
        'completed': '已完成',
        'resolved': '已結案',
        'rejected': '責撤'
    };

    const getStatusLabel = (status: string) => statusMap[status] || status;

    return (
        <aside className="w-full lg:w-96 space-y-12 pr-12 lg:border-r border-slate-100 animate-in fade-in slide-in-from-left-8 duration-700">
            {/* 案件編號與狀態 */}
            <div className="space-y-6">
                <div className="flex flex-col gap-2">
                    <span className="text-base font-black text-blue-600 uppercase tracking-[0.3em] font-mono border-b-2 border-blue-600 pb-1 w-fit">
                        案號 {caseData.id}
                    </span>
                    <div className="flex items-center gap-4 mt-2">
                        <div className={`text-2xl font-black uppercase tracking-widest ${caseData.status === 'pending' ? 'text-orange-600' :
                            caseData.status === 'processing' ? 'text-blue-600' : 'text-emerald-600'
                            }`}>
                            {getStatusLabel(caseData.status)}
                        </div>
                        {caseData.priority === 'critical' && (
                            <div className="flex items-center gap-2 text-rose-600 font-black text-base uppercase tracking-[0.3em] animate-pulse">
                                <AlertCircle size={16} /> 緊急優先
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 核心資訊網格 */}
            <div className="space-y-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-[0.2em]">
                        <Clock size={16} /> 申報時間
                    </div>
                    <div className="text-xl font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                        {caseData.date}
                        <span className="block text-base text-slate-400 mt-1">
                            {new Date(caseData.createdAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-[0.2em]">
                        <Shield size={16} /> 案件類型
                    </div>
                    <div className="text-xl font-black text-slate-950 tracking-tighter leading-none">
                        {caseData.type === 'bee' ? '蜂案通報' :
                            caseData.type === '1999' ? '1999 專案' :
                                caseData.type === '1959' ? '1959 專線' : '一般案件'}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-[0.2em]">
                        <User size={16} /> 陳情人資訊
                    </div>
                    <div className="text-xl font-black text-slate-950 tracking-tighter leading-none">
                        {caseData.petitionerName || caseData.reporterName || '匿名申報'}
                        <div className="flex items-center gap-2 mt-2 text-base font-bold text-slate-400 tracking-widest">
                            <Phone size={14} /> {caseData.petitionerPhone || caseData.reporterPhone || '--'}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-[0.2em]">
                        <User size={16} /> 負責人員
                    </div>
                    <div className="text-xl font-black text-slate-950 tracking-tighter leading-none">
                        {caseData.assignees && caseData.assignees.length > 0
                            ? caseData.assignees.join(', ')
                            : (assignedUser?.name || '尚未分派')}
                    </div>
                </div>
            </div>
        </aside>
    );
};
