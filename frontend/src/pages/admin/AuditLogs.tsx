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
  const [filterUser] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Parsing Audit Stream...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em] mb-2">不可變帳冊</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">智慧檔案庫</h1>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
            <Shield size={16} className="text-blue-400" /> Secure Protocol
          </div>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-base font-black text-slate-400 uppercase tracking-widest">Daily Flux</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">246 Actions</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <p className="text-base font-black text-slate-400 uppercase tracking-widest">Active Agents</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">12 Operators</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Database size={24} />
          </div>
          <div>
            <p className="text-base font-black text-slate-400 uppercase tracking-widest">Total Indexed</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{logs.length} Entries</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="搜尋審計流水、操作人或資源編號..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all font-bold text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-base uppercase tracking-widest outline-none appearance-none cursor-pointer"
          >
            <option value="">All Entities</option>
            <option value="case">Cases</option>
            <option value="user">Identity</option>
            <option value="workflow">Logic</option>
          </select>
          <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-base uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
            Refine Matrix
          </button>
          <button className="px-6 py-4 border border-slate-200 text-slate-400 rounded-2xl font-black text-base uppercase tracking-widest hover:text-slate-900 transition-all">
            Export Logs
          </button>
        </div>
      </div>

      {/* Audit List Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-base font-black text-slate-400 uppercase tracking-widest">時間向量</th>
              <th className="px-8 py-6 text-base font-black text-slate-400 uppercase tracking-widest">授權身分</th>
              <th className="px-8 py-6 text-base font-black text-slate-400 uppercase tracking-widest text-center">協議操作</th>
              <th className="px-8 py-6 text-base font-black text-slate-400 uppercase tracking-widest text-center">目標實體</th>
              <th className="px-8 py-6 text-base font-black text-slate-400 uppercase tracking-widest text-right px-10">驗證</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <React.Fragment key={log.id}>
                <tr className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                      <div>
                        <div className="text-sm font-black text-slate-950 font-mono tracking-tighter">
                          {new Date(log.timestamp).toLocaleTimeString('zh-TW')}
                        </div>
                        <div className="text-base font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs">
                        {log.userId[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 tracking-tight">{getUserName(log.userId)}</div>
                        <div className="text-base font-black text-slate-400 tracking-widest uppercase">ID: {log.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className={`inline-flex px-3 py-1.5 rounded-lg border text-base font-black uppercase tracking-widest ${actionStyles[log.action] || 'text-slate-400 bg-slate-50'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <div className="text-sm font-black text-slate-900 tracking-tight uppercase">{log.resource}</div>
                    <div className="text-base font-mono text-slate-400 tracking-tighter">{log.resourceId}</div>
                  </td>
                  <td className="px-8 py-8 text-right px-10">
                    <div className="flex justify-end">
                      {expandedId === log.id ? <ChevronUp size={20} className="text-slate-900" /> : <ChevronDown size={20} className="text-slate-300 group-hover:text-slate-900 transition-colors" />}
                    </div>
                  </td>
                </tr>
                {expandedId === log.id && (
                  <tr className="bg-slate-50/50">
                    <td colSpan={5} className="px-12 py-10">
                      <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-inner overflow-hidden relative">
                        <div className="flex items-center gap-3 mb-6">
                          <Terminal size={18} className="text-slate-400" />
                          <h4 className="text-base font-black text-slate-400 uppercase tracking-widest">Metadata Payload</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                          {Object.entries(log.metadata || {}).map(([key, value]) => (
                            <div key={key}>
                              <div className="text-base font-black text-slate-300 uppercase tracking-widest mb-1">{key}</div>
                              <div className="text-xs font-mono font-bold text-slate-600 break-all">{JSON.stringify(value)}</div>
                            </div>
                          ))}
                          {(!log.metadata || Object.keys(log.metadata).length === 0) && (
                            <div className="col-span-full py-4 text-center text-base font-black text-slate-300 uppercase tracking-widest italic">
                              No complex metadata payload attached
                            </div>
                          )}
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-slate-900/5"></div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-base font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Terminal size={14} /> End of Archived Flux Stream
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-base font-black ${p === 1 ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-200'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
