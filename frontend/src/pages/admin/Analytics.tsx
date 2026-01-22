import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, MapPin, Calendar,
  ArrowUpRight, ArrowDownRight, Activity,
  PieChart, Layers, Target, Clock
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { Case } from '../../types/schema';

export function AnalyticsPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const caseList = await mockApi.getCases();
      setCases(caseList);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">處理智慧資料中...</p>
      </div>
    );
  }

  const statusDistribution = [
    { name: '待處理', count: cases.filter(c => c.status === 'pending').length, color: 'bg-indigo-600', icon: Clock },
    { name: '處理中', count: cases.filter(c => c.status === 'processing').length, color: 'bg-blue-500', icon: Activity },
    { name: '已結案', count: cases.filter(c => c.status === 'resolved').length, color: 'bg-emerald-500', icon: Target }
  ];

  const typeDistribution = [
    { name: '一般案件', count: cases.filter(c => c.type === 'general').length, trend: '+12%', up: true },
    { name: '蜂蛇案件', count: cases.filter(c => c.type === 'bee').length, trend: '-5%', up: false },
    { name: '1999專案', count: cases.filter(c => c.type === '1999').length, trend: '+3%', up: true },
    { name: '1959救援', count: cases.filter(c => c.type === '1959').length, trend: '+20%', up: true }
  ];

  const topLocations = [
    { location: '板橋區', count: 324, percent: 85 },
    { location: '三重區', count: 218, percent: 62 },
    { location: '新莊區', count: 189, percent: 54 },
    { location: '中和區', count: 145, percent: 41 },
    { location: '永和區', count: 112, percent: 32 }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-indigo-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">智慧核心</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">數據分析</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-6 pr-12 py-3 bg-transparent border-2 border-slate-950 font-black text-base uppercase tracking-[0.2em] text-slate-950 cursor-pointer hover:bg-slate-950 hover:text-white transition-colors rounded-none"
            >
              <option value="week">過去 7 天</option>
              <option value="month">過去 30 天</option>
              <option value="year">過去一年</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-white text-slate-950 transition-colors">
              <Calendar size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row - Raw Architectural Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b-2 border-slate-100 pb-12">
        {[
          { label: '案件總量', value: cases.length, trend: '+8.4%', icon: Layers, color: 'text-indigo-600', sub: '已建檔案件' },
          { label: '結案率', value: '94.2%', trend: '+2.1%', icon: Target, color: 'text-emerald-600', sub: '執行效率' },
          { label: '平均回應', value: '14分鐘', trend: '-12.5%', icon: Clock, color: 'text-blue-600', sub: '回應時間' },
          { label: '緊急案件', value: cases.filter(c => c.priority === 'critical').length, trend: '+0.0%', icon: Activity, color: 'text-rose-600', sub: '立即處理' }
        ].map((kpi, idx) => (
          <div key={idx} className={`${idx !== 0 ? 'lg:border-l-2 lg:border-slate-100 lg:pl-12' : ''}`}>
            <div className="flex items-center gap-3 mb-2">
              <kpi.icon size={18} className="text-slate-300" />
              <p className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">{kpi.label}</p>
            </div>
            <div className="flex items-baseline gap-4">
              <h3 className="text-6xl font-black tracking-tighter text-slate-950 leading-none">{kpi.value}</h3>
              <div className={`flex items-center text-base font-black ${kpi.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </div>
            </div>
            <p className="text-base font-black uppercase tracking-widest text-slate-300 mt-2">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Distribution Chart - De-containerized */}
        <div className="lg:col-span-8 space-y-12">

          {/* Status Vector Distribution */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em]">系統處理量</h3>
              <PieChart size={18} className="text-slate-950" />
            </div>

            <div className="space-y-8">
              {statusDistribution.map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-4">
                      <div className="text-base font-black bg-slate-100 text-slate-950 px-2 py-1 uppercase tracking-widest min-w-[3rem] text-center">
                        {Math.round((item.count / cases.length) * 100)}%
                      </div>
                      <p className="font-black text-base uppercase tracking-widest text-slate-950">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-mono font-bold text-slate-400 group-hover:text-slate-950 transition-colors">{item.count} 件</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-slate-100 relative overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${item.name === '已結案' ? 'bg-emerald-600' :
                          item.name === '待處理' ? 'bg-indigo-600' :
                            'bg-blue-600'
                        }`}
                      style={{ width: `${(item.count / cases.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Trend - Architectural Grid */}
          <div className="border-t-2 border-slate-100 pt-12">
            <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-8">案件分類統計</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {typeDistribution.map((t, idx) => (
                <div key={idx} className="space-y-1 group">
                  <p className="text-base font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-transparent group-hover:border-slate-950 inline-block transition-all">{t.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-950 leading-none">{t.count}</span>
                    <span className={`text-base font-black px-1.5 py-0.5 ${t.up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {t.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hotspot Analysis - Dark Architectural Card */}
        <div className="lg:col-span-4">
          <div className="bg-slate-950 p-10 text-white h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-12 border-b border-slate-800 pb-6">
                <h3 className="text-base font-black tracking-[0.2em] uppercase text-slate-400">地理空間資料</h3>
                <MapPin size={18} className="text-indigo-500" />
              </div>

              <div className="space-y-8">
                {topLocations.map((loc, idx) => (
                  <div key={idx} className="group cursor-default">
                    <div className="flex justify-between items-baseline mb-2">
                      <p className="font-black text-base uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">{loc.location}</p>
                      <span className="text-base font-mono font-bold text-indigo-500">{loc.count}</span>
                    </div>
                    <div className="w-full h-0.5 bg-slate-900 group-hover:bg-slate-800 transition-colors">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-700"
                        style={{ width: `${loc.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 pt-8 border-t border-slate-900">
              <div className="flex items-center gap-3 mb-2">
                <Activity size={14} className="text-emerald-500" />
                <p className="text-base font-black text-slate-500 uppercase tracking-widest">AI 預測模型</p>
              </div>
              <p className="text-base font-bold text-slate-300 leading-relaxed uppercase tracking-wide">
                分析顯示下季東區案件量因季節性因素將增加 15%。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
