import React, { useEffect, useState } from 'react';
// Force layout refresh 2026-01-22
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MoreHorizontal, Shield, CheckCircle, Save, MessageSquare
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Case, User as UserType, Workflow, CaseMergeRecord } from '../../types/schema';

import DuplicateAlert from '../../components/DuplicateAlert';

// 導入新組件
import { CaseSidebar } from '../../components/case/CaseSidebar';
import { CaseContentBody } from '../../components/case/CaseContentBody';

export function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCase] = useState<Case | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [notes, setNotes] = useState('');

  // 併案相關
  const [duplicateSuggestions, setDuplicateSuggestions] = useState<CaseMergeRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const [caseDetail, userList, suggestions] = await Promise.all([
            mockApi.getCaseById(id),
            mockApi.getUsers(),
            mockApi.getDuplicateSuggestions(id)
          ]);
          setCase(caseDetail);
          setUsers(userList);
          setDuplicateSuggestions(suggestions);
          if (caseDetail?.assignedTo) setSelectedUser(caseDetail.assignedTo);
        }
      } catch (error) {
        console.error('Failed to load case:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAssign = async () => {
    if (!id || !selectedUser) return;
    try {
      await mockApi.assignCase(id, selectedUser);
      setCase(prev => prev ? { ...prev, assignedTo: selectedUser, status: 'processing' } : null);
    } catch (error) {
      console.error('Assignment failed');
    }
  };

  const handleUpdateStatus = async (newStatus: any) => {
    if (!id) return;
    try {
      await mockApi.updateCase(id, { status: newStatus });
      setCase(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Status update failed');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-black uppercase tracking-widest">系統載入中...</p>
      </div>
    );
  }

  if (!caseData) return <div className="p-20 text-center text-rose-600 font-black text-2xl">無法讀取案件資料</div>;

  const assignedUser = users.find(u => u.id === caseData.assignedTo);

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
    <div id="case-detail-root" className="space-y-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto pb-32 px-8">
      {/* 頂部操作列 - 極簡設計 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-8 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-slate-400 hover:text-slate-950 font-black text-lg uppercase tracking-[0.2em] transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          返回列表
        </button>
        <div className="flex items-center gap-8">
          <button className="text-slate-400 hover:text-slate-950 transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* 重複案件警示 - 置於最上方 */}
      {duplicateSuggestions.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top duration-500">
          {duplicateSuggestions.map(suggestion => (
            <DuplicateAlert
              key={suggestion.id}
              matchType={suggestion.matchType}
              matchedCase={{
                id: suggestion.duplicateCaseId,
                title: '疑似重複案件搜尋中...',
                status: 'pending'
              } as any}
              confidence={suggestion.confidence}
              message={`系統偵測到與案件 ${suggestion.duplicateCaseId} 高度相似`}
              onViewCase={() => navigate(`/admin/case-merge?id=${id}`)}
              onProceedAnyway={() => {/* 忽略 */ }}
            />
          ))}
        </div>
      )}

      {/* 主版面：左右雙欄架構 */}
      <div className="flex flex-col lg:flex-row gap-20 items-start">
        {/* 左側：中繼資訊與狀態 (Sidebar) */}
        <CaseSidebar caseData={caseData} assignedUser={assignedUser} />

        {/* 右側：核心內容流 (Content Body) */}
        <div className="flex-1 space-y-16">
          <CaseContentBody caseData={caseData} />

          {/* 指派與備註控制項 (原位於頂部，現整合於內容流) */}
          <div className="border-t-4 border-slate-950 pt-16 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <CheckCircle size={20} className="text-slate-950" />
                <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.3em]">狀態變更與指派</h3>
              </div>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'processing', 'resolved'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      className={`px-6 py-4 text-base font-black uppercase tracking-widest transition-all border-2 ${caseData.status === status
                        ? 'bg-slate-950 text-white border-slate-950'
                        : 'text-slate-400 border-slate-100 hover:text-slate-950 hover:bg-slate-50'
                        }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="flex-1 bg-slate-50 border-2 border-slate-100 font-bold text-lg text-slate-950 uppercase tracking-widest outline-none focus:border-slate-950 py-4 px-6 transition-all"
                  >
                    <option value="">選擇負責人員...</option>
                    {users.filter(u => u.role === 'caseworker').map(u => (
                      <option key={u.id} value={u.id}>{u.name} [{u.unit}]</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssign}
                    className="px-8 py-4 bg-blue-600 text-white font-black text-lg uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    執行
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <MessageSquare size={20} className="text-slate-950" />
                <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.3em]">內部紀錄備註</h3>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="在此輸入案件追蹤備註..."
                className="w-full h-40 bg-slate-50 border-2 border-slate-100 p-6 font-bold text-lg text-slate-900 placeholder:text-slate-300 focus:border-slate-950 outline-none transition-all resize-none shadow-inner"
              />
              <button className="flex items-center gap-3 text-lg font-black text-slate-950 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] group">
                <Save size={18} className="group-hover:scale-110 transition-transform" /> 提交存檔備註
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
