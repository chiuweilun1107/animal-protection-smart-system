import { useEffect, useState } from 'react';
import {
  Save, RefreshCw, Shield, Globe, Bell,
  Database, Cpu, Clock, CheckCircle,
  Zap, HardDrive, Lock, User, ChevronDown
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { SystemConfig } from '../../types/schema';

export function SettingsPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getSystemConfig();
      setConfigs(data);
      const values: Record<string, any> = {};
      data.forEach(c => {
        values[c.key] = c.value;
      });
      setFormValues(values);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setFormValues({ ...formValues, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">正在載入系統設定...</p>
      </div>
    );
  }

  const categories = [
    { id: 'general', label: '基礎設置', icon: <Globe size={18} /> },
    { id: 'security', label: '資安等級', icon: <Shield size={18} /> },
    { id: 'notification', label: '通知矩陣', icon: <Bell size={18} /> },
    { id: 'database', label: '備份存檔', icon: <Database size={18} /> }
  ];

  const filteredConfigs = configs.filter(c => {
    if (activeTab === 'general') return c.category === 'general' || c.category === 'case';
    if (activeTab === 'database') return c.category === 'backup';
    if (activeTab === 'security') return c.category === 'security';
    if (activeTab === 'notification') return c.category === 'notification';
    return false;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-slate-950"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">系統核心</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">系統設定</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={loadConfigs}
            className="p-4 bg-transparent text-slate-300 hover:text-slate-950 transition-colors"
            title="重新載入"
          >
            <RefreshCw size={24} />
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-4 bg-slate-950 text-white hover:bg-indigo-600 transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-2"
          >
            <Save size={18} /> 儲存變更
          </button>
        </div>
      </div>

      {saved && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-8 py-4 font-black text-base uppercase tracking-widest shadow-2xl animate-in slide-in-from-top-4 duration-500 flex items-center gap-3">
          <CheckCircle size={18} /> 系統參數已同步
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Side Navigation - Architectural Vertical Tabs */}
        <div className="lg:col-span-3">
          <div className="sticky top-8 space-y-1">
            <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-6 border-b-2 border-slate-950 pb-2">模組</h3>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-4 font-black text-base uppercase tracking-widest transition-all border-l-2 ${activeTab === cat.id
                  ? 'border-slate-950 text-slate-950 bg-slate-50'
                  : 'border-transparent text-slate-400 hover:text-slate-950 hover:border-slate-200'
                  }`}
              >
                <div className="flex items-center gap-4">
                  {cat.icon}
                  {cat.label}
                </div>
                {activeTab === cat.id && <div className="w-1.5 h-1.5 bg-slate-950"></div>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Settings Panel - Blueprint Form */}
        <div className="lg:col-span-9 space-y-16">
          <div>
            <div className="flex items-center gap-4 mb-12">
              <span className="text-6xl font-thin text-slate-200">/</span>
              <h3 className="text-4xl font-black tracking-tighter text-slate-950 uppercase">
                {categories.find(c => c.id === activeTab)?.label}
              </h3>
            </div>

            <div className="space-y-12 max-w-4xl">
              {filteredConfigs.length > 0 ? (
                filteredConfigs.map(config => (
                  <div key={config.key} className="group">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                      <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-indigo-600 transition-colors">
                        {config.description}
                      </label>
                      <span className="text-base font-mono text-slate-300 tracking-tight">{config.key}</span>
                    </div>

                    {config.key === 'system_language' ? (
                      <div className="relative">
                        <select
                          value={formValues[config.key]}
                          onChange={(e) => handleChange(config.key, e.target.value)}
                          className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-black text-2xl text-slate-950 appearance-none rounded-none cursor-pointer"
                        >
                          <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
                          <option value="en-US">English (US)</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-950 pointer-events-none" size={24} />
                      </div>
                    ) : config.key === 'system_timezone' ? (
                      <div className="relative">
                        <select
                          value={formValues[config.key]}
                          onChange={(e) => handleChange(config.key, e.target.value)}
                          className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-black text-2xl text-slate-950 appearance-none rounded-none cursor-pointer"
                        >
                          <option value="Asia/Taipei">亞洲/台北 (UTC+8)</option>
                          <option value="UTC">世界協調時間 (UTC)</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-950 pointer-events-none" size={24} />
                      </div>
                    ) : (
                      <input
                        type={typeof config.value === 'number' ? 'number' : 'text'}
                        value={formValues[config.key]}
                        onChange={(e) => handleChange(config.key, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-black text-2xl text-slate-950 rounded-none placeholder:text-slate-200"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="py-24 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-6">
                  <Lock size={48} className="text-slate-200" />
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-300 uppercase tracking-widest">受限協議</p>
                    <p className="text-base font-bold text-slate-300">需要第 5 級安全權限</p>
                  </div>
                  <button className="px-8 py-4 bg-slate-950 text-white font-black text-base uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors">請求存取權限</button>
                </div>
              )}
            </div>
          </div>

          {/* Hardware / Engine Metrics - raw minimal */}
          {activeTab === 'general' && (
            <div className="pt-16 border-t-2 border-slate-100">
              <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-8">系統遙測</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="text-slate-400" size={20} />
                    <h4 className="text-base font-black text-slate-400 uppercase tracking-widest">運算負載</h4>
                  </div>
                  <div className="text-6xl font-black text-slate-950 tracking-tighter">42.8<span className="text-2xl text-slate-300">%</span></div>
                  <div className="w-full bg-slate-100 h-1">
                    <div className="bg-slate-950 w-[42.8%] h-full"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <HardDrive className="text-slate-400" size={20} />
                    <h4 className="text-base font-black text-slate-400 uppercase tracking-widest">儲存空間</h4>
                  </div>
                  <div className="text-6xl font-black text-slate-950 tracking-tighter">2.4<span className="text-2xl text-slate-300">TB</span></div>
                  <div className="w-full bg-slate-100 h-1">
                    <div className="bg-slate-950 w-[78%] h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
