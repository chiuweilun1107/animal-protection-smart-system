import { useEffect, useState } from 'react';
import {
  RefreshCw, Settings, AlertCircle, CheckCircle2,
  Link2, Zap, Shield, Cpu, ExternalLink,
  Terminal, Globe, Activity, ArrowRight
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { IntegrationConfig } from '../../types/schema';

export function IntegrationPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getIntegrations();
      setIntegrations(data);
      if (data.length > 0) setSelectedId(data[0].id);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIntegrations(integrations.map(i =>
        i.id === id ? { ...i, lastSync: new Date().toISOString() } : i
      ));
    } finally {
      setSyncingId(null);
    }
  };

  const selectedIntegration = integrations.find(i => i.id === selectedId);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Establishing Neural Uplinks...</p>
      </div>
    );
  }

  const integrationTypeLabels: Record<string, string> = {
    '1999': 'Smart City 1999',
    'agriculture': 'Pet Registry v4.0',
    'finance': 'Revenue & Ledger',
    'document': 'GovDoc Archive'
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-base font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">網路架構</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">介接</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-base font-black text-indigo-600 uppercase tracking-widest text-xs">Gateway Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Integration List Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-400 uppercase tracking-widest">外部樞紐</h3>
              <button className="text-indigo-600"><Settings size={14} /></button>
            </div>
            <div className="divide-y divide-slate-50">
              {integrations.map(int => (
                <button
                  key={int.id}
                  onClick={() => setSelectedId(int.id)}
                  className={`w-full text-left px-8 py-6 transition-all group relative overflow-hidden ${selectedId === int.id ? 'bg-white' : 'hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl transition-all ${selectedId === int.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'
                        }`}>
                        <Cpu size={18} />
                      </div>
                      <div>
                        <p className={`font-black text-sm uppercase tracking-tight ${selectedId === int.id ? 'text-slate-900' : 'text-slate-500'}`}>
                          {integrationTypeLabels[int.type] || int.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${int.status === 'connected' ? 'bg-green-500' :
                              int.status === 'disconnected' ? 'bg-slate-300' : 'bg-red-500'
                            }`}></div>
                          <span className="text-base font-black text-slate-400 uppercase tracking-widest">
                            {int.status === 'connected' ? '已穩定' : '離線'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className={`transition-all ${selectedId === int.id ? 'text-indigo-600 opacity-100 translate-x-0' : 'text-slate-200 opacity-0 -translate-x-2'}`} />
                  </div>
                  {selectedId === int.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Network Stats Card */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-base font-black text-indigo-400 uppercase tracking-widest mb-4">Global Throughput</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tabular-nums">1.2GB</span>
                <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">/ SEC</span>
              </div>
              <div className="mt-6 flex gap-1 h-1.5">
                {[30, 70, 45, 90, 65, 80, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/10 rounded-full relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-full transition-all duration-1000" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
            <Activity size={80} className="absolute -right-4 -bottom-4 text-white/5" />
          </div>
        </div>

        {/* Integration Details Canvas */}
        <div className="lg:col-span-8">
          {selectedIntegration && (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 animate-in slide-in-from-bottom-10 duration-500">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                    <Globe size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none mb-1">{selectedIntegration.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">{integrationTypeLabels[selectedIntegration.type]}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                      <span className="text-base font-black text-indigo-600 uppercase tracking-[0.2em]">Protocol V2.1</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSync(selectedIntegration.id)}
                    disabled={syncingId === selectedIntegration.id}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-base uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:bg-slate-300"
                  >
                    <RefreshCw size={14} className={syncingId === selectedIntegration.id ? 'animate-spin' : ''} />
                    {syncingId === selectedIntegration.id ? '同步中...' : '強制基線'}
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><Settings size={18} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-base font-black text-slate-400 uppercase tracking-widest mb-2">Endpoint URL</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-mono font-bold text-slate-700 truncate">{selectedIntegration.endpoint}</p>
                    <ExternalLink size={14} className="text-slate-300 flex-shrink-0" />
                  </div>
                </div>
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="text-base font-black text-slate-400 uppercase tracking-widest mb-2">Last Handshake</p>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {selectedIntegration.lastSync ? new Date(selectedIntegration.lastSync).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-base font-black text-slate-400 uppercase tracking-widest px-2">Configuration Environment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedIntegration.configuration).map(([key, value]) => (
                    <div key={key} className="p-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm">
                      <div>
                        <p className="text-base font-black text-indigo-600 uppercase tracking-widest mb-1">{key}</p>
                        <p className="text-xs font-mono text-slate-600">{String(value).length > 30 ? String(value).substring(0, 30) + '...' : String(value)}</p>
                      </div>
                      <div className="p-2 bg-slate-50 text-slate-300 rounded-lg"><Terminal size={14} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-10 bg-indigo-50/50 rounded-[3rem] border border-indigo-100 border-dashed relative overflow-hidden transition-all hover:bg-indigo-50">
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 animate-bounce">
                    <Link2 size={24} />
                  </div>
                  <h4 className="text-lg font-black tracking-tighter text-slate-900 uppercase">連線已驗證</h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm">所有安全握手已執行。資料完整性 99.99%。已準備進行同步交易。</p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
