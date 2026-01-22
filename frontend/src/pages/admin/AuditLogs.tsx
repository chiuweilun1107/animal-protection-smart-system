import { useEffect, useState } from 'react';
import {
  User, Search,
  Activity, Terminal, Shield,
  ChevronDown, ChevronUp, Database
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { AuditLog, User as UserType } from '../../types/schema';

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filterUser) filters.userId = filterUser;
      if (filterResource) filters.resource = filterResource;
      const [logData, userData] = await Promise.all([
        mockApi.getAuditLogs(filters),
        mockApi.getUsers()
      ]);
      setLogs(logData);
      setUsers(userData);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId: string) =>
    users.find(u => u.id === userId)?.name || userId;

  // 過濾邏輯：基於搜尋詞進行即時搜尋
  const filteredLogs = logs.filter((log) => {
    const searchLower = searchTerm.toLowerCase();

    // 若無搜尋詞，回傳 true
    if (!searchLower) return true;

    // 搜尋：action（操作）
    if (log.action.toLowerCase().includes(searchLower)) return true;

    // 搜尋：resource（資源類型）
    if (log.resource.toLowerCase().includes(searchLower)) return true;

    // 搜尋：resourceId（資源編號）
    if (log.resourceId.toLowerCase().includes(searchLower)) return true;

    // 搜尋：userId（操作人）
    if (log.userId.toLowerCase().includes(searchLower)) return true;

    // 搜尋：使用者名稱
    const userName = getUserName(log.userId).toLowerCase();
    if (userName.includes(searchLower)) return true;

    return false;
  });

  const actionStyles: Record<string, string> = {
    'create': 'text-emerald-500 bg-emerald-50 border-emerald-100',
    'update': 'text-blue-500 bg-blue-50 border-blue-100',
    'delete': 'text-red-500 bg-red-50 border-red-100',
    'assign': 'text-indigo-500 bg-indigo-50 border-indigo-100',
    'approve': 'text-indigo-500 bg-indigo-50 border-indigo-100',
    'view': 'text-slate-400 bg-slate-50 border-slate-100'
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">正在載入稽核日誌...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">系統稽核</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">審計日誌</h1>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 border-2 border-red-500 bg-red-50 text-red-600 rounded-none font-black text-base uppercase tracking-widest">
          <Shield size={16} /> 安全協議啟動中
        </div>
      </div>

      {/* Metrics - De-containerized */}
      <div className="grid grid-cols-3 gap-12 border-b-2 border-slate-100 pb-12">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Activity size={20} className="text-slate-400" />
            <span className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">今日活動</span>
          </div>
          <div className="text-6xl font-black text-slate-950 tracking-tighter leading-none">246</div>
        </div>
        <div className="border-l-2 border-slate-100 pl-12">
          <div className="flex items-center gap-4 mb-2">
            <User size={20} className="text-slate-400" />
            <span className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">活躍使用者</span>
          </div>
          <div className="text-6xl font-black text-slate-950 tracking-tighter leading-none">12</div>
        </div>
        <div className="border-l-2 border-slate-100 pl-12">
          <div className="flex items-center gap-4 mb-2">
            <Database size={20} className="text-slate-400" />
            <span className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">總記錄數</span>
          </div>
          <div className="text-6xl font-black text-slate-950 tracking-tighter leading-none">{logs.length}</div>
        </div>
      </div>

      {/* Filters - Minimalist */}
      <div className="flex flex-col lg:flex-row items-center gap-8 py-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={24} />
          <input
            type="text"
            placeholder="搜尋稽核日誌..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-transparent border-b-2 border-slate-100 focus:border-slate-950 outline-none transition-all font-black text-xl text-slate-950 placeholder:text-slate-200 uppercase tracking-widest"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-6 py-4 bg-transparent border-b-2 border-slate-100 focus:border-slate-950 font-black text-base uppercase tracking-[0.2em] outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors text-slate-500 focus:text-slate-950"
          >
            <option value="">所有實體</option>
            <option value="case">案件</option>
            <option value="user">使用者</option>
            <option value="workflow">工作流程</option>
          </select>
          <button
            onClick={() => loadLogs()}
            className="px-8 py-4 bg-slate-950 text-white font-black text-base uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
          >
            重新整理
          </button>
        </div>
      </div>

      {/* Audit List Table - Architectural */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-950">
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em]">時間軸</th>
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em]">操作人員</th>
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em] text-center">操作動作</th>
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em] text-center">目標實體</th>
              <th className="px-6 py-6 text-right text-base font-black text-slate-950 uppercase tracking-[0.2em]">檢視</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-24 text-center border-b border-slate-100">
                  <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">
                    {searchTerm ? '無符合的記錄' : '稽核日誌為空'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr className="group hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-950 font-mono text-lg">{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}</span>
                        <span className="text-base font-black text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 flex items-center justify-center font-black text-slate-950 border border-slate-200">
                          {log.userId[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-950 text-base tracking-tight">{getUserName(log.userId)}</div>
                          <div className="text-base font-black text-slate-300 uppercase tracking-widest font-mono">ID: {log.userId.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-center">
                      <span className={`inline-block px-4 py-2 font-black text-base uppercase tracking-widest border-2 ${log.action === 'create' ? 'border-emerald-500 text-emerald-600' :
                        log.action === 'delete' ? 'border-rose-500 text-rose-600' :
                          'border-slate-200 text-slate-500'
                        }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col items-center">
                        <span className="font-black text-slate-950 uppercase tracking-widest text-base border-b border-slate-950 pb-1 mb-1">{log.resource}</span>
                        <span className="font-mono text-base text-slate-400">{log.resourceId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-right">
                      <div className="flex justify-end">
                        {expandedId === log.id ? <ChevronUp size={24} className="text-slate-950" /> : <ChevronDown size={24} className="text-slate-300 group-hover:text-slate-950 transition-colors" />}
                      </div>
                    </td>
                  </tr>

                  {expandedId === log.id && (
                    <tr className="bg-slate-50">
                      <td colSpan={5} className="px-12 py-12 border-b border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                          <div className="md:col-span-1">
                            <h4 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                              <Terminal size={16} /> 資料內容
                            </h4>
                            <p className="text-base font-bold text-slate-500 leading-relaxed">
                              執行時刻捕獲的詳細中繼資料。不可變更記錄。
                            </p>
                          </div>
                          <div className="md:col-span-3 grid grid-cols-2 gap-8">
                            {Object.entries(log.metadata || {}).map(([key, value]) => (
                              <div key={key} className="border-l-2 border-slate-200 pl-6">
                                <div className="text-base font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{key}</div>
                                <div className="font-mono text-base font-bold text-slate-950 break-all">{JSON.stringify(value)}</div>
                              </div>
                            ))}
                            {(!log.metadata || Object.keys(log.metadata).length === 0) && (
                              <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200">
                                <span className="font-black text-slate-300 uppercase tracking-widest text-base">無資料內容</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination - Minimal */}
        <div className="flex items-center justify-between pt-12 border-t-2 border-slate-950 mt-4">
          <div className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">
            第 {currentPage} 頁
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-10 h-10 flex items-center justify-center font-black text-base transition-all ${p === currentPage ? 'bg-slate-950 text-white' : 'text-slate-300 hover:text-slate-950 hover:bg-slate-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
