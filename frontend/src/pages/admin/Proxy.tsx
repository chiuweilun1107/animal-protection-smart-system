import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, CheckCircle2, AlertCircle,
  UserPlus, ArrowRight, Calendar, UserCheck,
  Clock, RefreshCw, X
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { ProxyAssignment, User } from '../../types/schema';

export function ProxyPage() {
  const [proxies, setProxies] = useState<ProxyAssignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    reason: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [proxyList, userList] = await Promise.all([
        mockApi.getProxies(),
        mockApi.getUsers()
      ]);
      setProxies(proxyList);
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // 更新現有代理人
        await mockApi.updateProxy(editingId, {
          ...formData,
          status: 'active' as const
        });
      } else {
        // 建立新代理人
        await mockApi.createProxy({
          ...formData,
          status: 'active' as const
        });
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ from: '', to: '', reason: '', startDate: '', endDate: '' });
      loadData(); // 重新載入資料
    } catch (error) {
      console.error('Failed to save proxy:', error);
      alert('保存失敗，請重試');
    }
  };

  const handleEdit = (proxy: ProxyAssignment) => {
    setEditingId(proxy.id);
    setFormData({
      from: proxy.from,
      to: proxy.to,
      reason: proxy.reason,
      startDate: proxy.startDate,
      endDate: proxy.endDate
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此代理設定嗎？')) return;
    try {
      await mockApi.deleteProxy(id);
      loadData(); // 重新載入資料
    } catch (error) {
      console.error('Failed to delete proxy:', error);
      alert('刪除失敗，請重試');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">正在載入代理設定...</p>
      </div>
    );
  }

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-indigo-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">權限鏈</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">代理人管理</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-slate-950 text-white hover:bg-indigo-600 transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-2"
        >
          <UserPlus size={18} /> 指派代理人
        </button>
      </div>

      {/* Quick Stats - Raw Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b-2 border-slate-100 pb-12">
        {[
          { label: '活躍代理', value: proxies.filter(p => p.status === 'active').length, icon: UserCheck, color: 'text-emerald-600' },
          { label: '已到期', value: proxies.filter(p => p.status === 'expired').length, icon: Clock, color: 'text-slate-400' },
          { label: '涉及人數', value: new Set([...proxies.map(p => p.from), ...proxies.map(p => p.to)]).size, icon: UserPlus, color: 'text-indigo-600' }
        ].map((stat, idx) => (
          <div key={idx} className={`${idx !== 0 ? 'border-l-2 border-slate-100 pl-12' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={18} className={stat.color} />
              <p className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
            <h3 className="text-6xl font-black tracking-tighter text-slate-950 leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Table - De-containerized */}
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em]">代理登記簿</h3>
          <div className="flex gap-2">
            <button onClick={() => loadData()} className="flex items-center gap-2 text-slate-400 hover:text-slate-950 transition-colors uppercase text-base font-black tracking-widest">
              <RefreshCw size={14} /> 同步資料
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-950">
                <th className="py-4 text-base font-black text-slate-950 uppercase tracking-[0.2em]">發起人</th>
                <th className="py-4 text-base font-black text-slate-950 uppercase tracking-[0.2em]">代理對象</th>
                <th className="py-4 text-base font-black text-slate-950 uppercase tracking-[0.2em]">有效期間</th>
                <th className="py-4 text-base font-black text-slate-950 uppercase tracking-[0.2em]">狀態</th>
                <th className="py-4 text-right text-base font-black text-slate-950 uppercase tracking-[0.2em]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proxies.map(proxy => (
                <tr key={proxy.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-6 pr-8">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-base">
                        {getUserName(proxy.from).substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-black text-base text-slate-950 uppercase tracking-tight">{getUserName(proxy.from)}</p>
                        <p className="text-base font-bold text-slate-400 uppercase tracking-widest">來源</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 pr-8">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-base">
                        {getUserName(proxy.to).substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-black text-base text-slate-950 uppercase tracking-tight">{getUserName(proxy.to)}</p>
                        <p className="text-base font-bold text-slate-400 uppercase tracking-widest">代理人</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 pr-8">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-slate-950 font-mono">{proxy.startDate}</span>
                      <span className="text-base font-black text-slate-400 uppercase tracking-widest mt-1">至 {proxy.endDate}</span>
                    </div>
                  </td>
                  <td className="py-6 pr-8">
                    <div className={`inline-flex items-center gap-2 ${proxy.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${proxy.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                      <span className="text-base font-black uppercase tracking-widest">{proxy.status === 'active' ? '運作中' : '已終止'}</span>
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(proxy)}
                        className="text-slate-400 hover:text-slate-950 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(proxy.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form - Cleaner */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-12 border-b-2 border-slate-950 pb-6">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase">
                  {editingId ? '編輯代理' : '新增代理'}
                </h2>
                <p className="text-base font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">權限轉移設定</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ from: '', to: '', reason: '', startDate: '', endDate: '' });
                }}
                className="p-2 border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">發起人 (來源)</label>
                  <select
                    className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-bold text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                    value={formData.from}
                    onChange={e => setFormData({ ...formData, from: e.target.value })}
                  >
                    <option value="">選擇來源</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">代理人 (目標)</label>
                  <select
                    className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-bold text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                    value={formData.to}
                    onChange={e => setFormData({ ...formData, to: e.target.value })}
                  >
                    <option value="">選擇目標</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">開始日期</label>
                  <input
                    type="date"
                    className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-bold text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">結束日期</label>
                  <input
                    type="date"
                    className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-bold text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">理由說明</label>
                <textarea
                  className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-medium text-base text-slate-950 outline-none focus:border-indigo-600 transition-all min-h-[100px] resize-none rounded-none"
                  placeholder="轉移原因說明..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="w-full py-6 bg-slate-950 text-white font-black text-base uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 mt-4">
                <CheckCircle2 size={18} /> 建立代理鏈
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
