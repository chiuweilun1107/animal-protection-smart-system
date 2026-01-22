import { useEffect, useState } from 'react';
import {
  RefreshCw, Settings,
  Link2, Cpu, ExternalLink,
  Terminal, Globe, Activity, ArrowRight, Clock, AlertTriangle
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { IntegrationConfig } from '../../types/schema';

export function IntegrationPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [integrationLogs, setIntegrationLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadIntegrationLogs(selectedId);
    }
  }, [selectedId]);

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

  const loadIntegrationLogs = async (integrationId: string) => {
    setLogsLoading(true);
    try {
      const logs = await mockApi.getIntegrationLogs({ integrationId });
      setIntegrationLogs(logs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIntegrations(integrations.map(i =>
        i.id === id ? { ...i, lastSync: new Date().toISOString() } : i
      ));
      await loadIntegrationLogs(id);
    } finally {
      setSyncingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'partial':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'partial':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '成功';
      case 'failed':
        return '失敗';
      case 'partial':
        return '部分成功';
      default:
        return '未知';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const selectedIntegration = integrations.find(i => i.id === selectedId);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">建立連線中...</p>
      </div>
    );
  }

  const integrationTypeLabels: Record<string, string> = {
    '1999': '智慧城市 1999',
    'agriculture': '寵物登記系統 v4.0',
    'finance': '財務帳務系統',
    'document': '公文管理系統'
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-indigo-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">系統網路</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">系統整合</h1>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 border-2 border-emerald-500 bg-emerald-50 text-emerald-600 rounded-none font-black text-base uppercase tracking-widest">
          <Activity size={16} /> 閘道器連線中
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Integration List Sidebar - Architectural */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-6 border-b-2 border-slate-950 pb-2">連線節點</h3>
            <div className="flex flex-col gap-2">
              {integrations.map(int => (
                <button
                  key={int.id}
                  onClick={() => setSelectedId(int.id)}
                  className={`w-full text-left px-6 py-5 transition-all group relative border ${selectedId === int.id
                    ? 'bg-slate-950 text-white border-slate-950'
                    : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-950 hover:text-slate-950'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-base font-black uppercase tracking-widest ${selectedId === int.id ? 'text-indigo-400' : 'text-slate-300'}`}>0{integrations.indexOf(int) + 1}</span>
                      <span className="font-black text-base uppercase tracking-widest">{integrationTypeLabels[int.type] || int.name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${int.status === 'connected' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Network Stats - Raw Metrics */}
          <div>
            <h4 className="text-base font-black text-indigo-600 uppercase tracking-widest mb-4">傳輸速率</h4>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-7xl font-black text-slate-950 tracking-tighter leading-none">1.2</span>
              <span className="text-xl font-bold text-slate-400">GB/s</span>
            </div>

            <div className="flex gap-1 h-32 items-end">
              {[30, 70, 45, 90, 65, 80, 40, 60, 50, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 relative group">
                  <div className="absolute bottom-0 left-0 right-0 bg-indigo-600 transition-all duration-1000 group-hover:bg-slate-950" style={{ height: `${h}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integration Details - Blueprint Style */}
        <div className="lg:col-span-8">
          {selectedIntegration && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              {/* Detail Header */}
              <div className="flex items-end justify-between border-b-2 border-slate-100 pb-8">
                <div className="space-y-4">
                  <span className="text-base font-black bg-slate-950 text-white px-3 py-1 uppercase tracking-[0.2em]">{integrationTypeLabels[selectedIntegration.type]}</span>
                  <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase">{selectedIntegration.name}</h2>
                  <p className="text-base font-mono text-slate-400 uppercase tracking-widest">協定 V2.1 • 加密通道</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleSync(selectedIntegration.id)}
                    disabled={syncingId === selectedIntegration.id}
                    className="px-6 py-4 bg-indigo-600 text-white hover:bg-slate-950 transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-3 disabled:bg-slate-300"
                  >
                    <RefreshCw size={16} className={syncingId === selectedIntegration.id ? 'animate-spin' : ''} />
                    {syncingId === selectedIntegration.id ? '同步中...' : '強制同步'}
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b-2 border-slate-100 pb-12">
                <div>
                  <div className="text-base font-black text-slate-400 uppercase tracking-[0.2em] mb-2">端點位址</div>
                  <div className="font-mono text-base font-bold text-slate-950 break-all flex items-center gap-2">
                    {selectedIntegration.endpoint} <ExternalLink size={12} className="text-slate-300" />
                  </div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-400 uppercase tracking-[0.2em] mb-2">上次同步</div>
                  <div className="text-3xl font-black text-slate-950 tracking-tight">
                    {selectedIntegration.lastSync ? new Date(selectedIntegration.lastSync).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Configuration Parameters */}
              <div>
                <h4 className="flex items-center gap-4 text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-6">
                  <div className="w-2 h-2 bg-indigo-600"></div> 系統參數
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(selectedIntegration.configuration).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-slate-100 group hover:bg-slate-50 px-4 -mx-4 transition-colors">
                      <span className="font-black text-base text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">{key}</span>
                      <span className="font-mono text-base font-bold text-slate-950">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logs Section */}
              <div className="pt-12">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="flex items-center gap-4 text-base font-black text-slate-950 uppercase tracking-[0.2em]">
                    <div className="w-2 h-2 bg-slate-950"></div> 事件記錄
                  </h4>
                  {logsLoading && <span className="text-base uppercase font-black tracking-widest text-indigo-600 animate-pulse">讀取中...</span>}
                </div>

                <div className="border-t-2 border-slate-950">
                  {integrationLogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-300 font-black uppercase tracking-widest text-base">無事件記錄</div>
                  ) : (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="py-4 text-base font-black text-slate-400 uppercase tracking-widest">時間戳記</th>
                          <th className="py-4 text-base font-black text-slate-400 uppercase tracking-widest">動作</th>
                          <th className="py-4 text-base font-black text-slate-400 uppercase tracking-widest">狀態</th>
                          <th className="py-4 text-base font-black text-slate-400 uppercase tracking-widest text-right">記錄數</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {integrationLogs.map((log, idx) => (
                          <tr key={log.id || idx} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-4 font-mono text-base font-bold text-slate-500">{new Date(log.executedAt).toLocaleTimeString()}</td>
                            <td className="py-4 font-black text-base uppercase tracking-wide text-slate-950">{log.action}</td>
                            <td className="py-4">
                              <span className={`text-base font-black uppercase tracking-widest ${log.status === 'success' ? 'text-emerald-600' : log.status === 'failed' ? 'text-rose-600' : 'text-amber-600'}`}>
                                {log.status === 'failed' ? '嚴重錯誤' : log.status}
                              </span>
                            </td>
                            <td className="py-4 text-right font-mono text-base font-bold text-slate-950">{log.recordCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
