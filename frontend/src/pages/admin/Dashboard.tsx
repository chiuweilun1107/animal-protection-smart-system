import { useEffect, useState } from 'react';
import {
  BarChart3, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Shield, TrendingUp
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { DateRangeSelector } from '../../components/DateRangeSelector';
import { TrendLineChart, ComparisonBarChart, StackedBarChart, DistributionPieChart } from '../../components/charts';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<any[]>([]);
  const [priorityDistribution, setPriorityDistribution] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [assigneeStats, setAssigneeStats] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('month');
  const [viewMode, setViewMode] = useState<'realtime' | 'history'>('realtime');

  useEffect(() => {
    loadRealtimeData();
  }, []);

  useEffect(() => {
    if (viewMode === 'history') {
      loadHistoricalData();
    }
  }, [dateRange, viewMode]);

  const getDateRange = () => {
    const today = new Date('2026-01-21');
    let startDate = new Date(today);

    switch (dateRange) {
      case 'today':
        startDate = new Date(today);
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0]
        };
      case 'week':
        const dayOfWeek = today.getDay();
        startDate.setDate(today.getDate() - dayOfWeek);
        break;
      case 'month':
        startDate.setDate(1);
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        startDate.setMonth(quarter * 3, 1);
        break;
    }

    return {
      start: startDate.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };

  const loadRealtimeData = async () => {
    setLoading(true);
    try {
      const dashStats = await mockApi.getDashboardStats();
      setStats(dashStats);
    } catch (error) {
      console.error('Failed to load realtime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const dateRangeObj = getDateRange();
      const [timeSeries, types, priorities, weekly, assignees] = await Promise.all([
        mockApi.getDashboardTimeSeries(dateRangeObj),
        mockApi.getCaseTypeDistribution(),
        mockApi.getCasePriorityDistribution(),
        mockApi.getWeeklyStats(),
        mockApi.getCasesByAssignee(),
      ]);

      setTimeSeriesData(timeSeries);
      setTypeDistribution(types);
      setPriorityDistribution(priorities);
      setWeeklyData(weekly);
      setAssigneeStats(assignees);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">初始化中...</p>
      </div>
    );
  }

  const metricCards = [
    {
      label: '總收件數',
      value: stats?.totalCases || 0,
      trend: '+12.5%',
      up: true,
      icon: BarChart3,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: '待處理案件',
      value: stats?.pendingCases || 0,
      trend: '-2.4%',
      up: false,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      label: '處理中',
      value: stats?.processingCases || 0,
      trend: '+5.2%',
      up: true,
      icon: Zap,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: '已結案',
      value: stats?.resolvedCases || 0,
      trend: '+18.7%',
      up: true,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: '緊急事件',
      value: stats?.criticalCases || 0,
      trend: '+2',
      up: true,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">平台概覽</div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">儀表板</h1>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setViewMode('realtime')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${
              viewMode === 'realtime'
                ? 'bg-slate-900 text-white shadow-slate-900/20'
                : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            即時數據
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${
              viewMode === 'history'
                ? 'bg-slate-900 text-white shadow-slate-900/20'
                : 'text-slate-400 hover:text-slate-900'
            }`}
          >
            歷史數據
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/40 transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${card.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend}
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</div>
              <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{card.value}</div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-0 opacity-50"></div>
          </div>
        ))}
      </div>

      {/* 歷史數據：多維度統計分析區 */}
      {viewMode === 'history' && (
      <div className="space-y-8">
        {/* 時間範圍選擇器和標題 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">多維度統計分析</h2>
          <DateRangeSelector value={dateRange} onChange={setDateRange} isLoading={loading} />
        </div>

        {/* 趨勢分析圖表 */}
        {timeSeriesData.length > 0 && (
          <TrendLineChart
            data={timeSeriesData}
            lines={[
              { dataKey: 'totalCases', name: '總案件數', color: '#3b82f6' },
              { dataKey: 'resolvedCases', name: '已結案', color: '#10b981' },
              { dataKey: 'pendingCases', name: '待處理', color: '#f59e0b' },
            ]}
            title="案件趨勢分析"
            subtitle="過去 30 天的案件數據變化趨勢"
            height={350}
          />
        )}

        {/* 對比分析區 - 左右分欄 */}
        {weeklyData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ComparisonBarChart
              data={weeklyData}
              series={[
                { dataKey: 'totalCases', name: '總案件', color: '#3b82f6' }
              ]}
              title="每週案件統計"
              subtitle="最近 4 週的案件數統計"
              xAxisKey="week"
              height={300}
            />

            {weeklyData.length > 0 && (
              <StackedBarChart
                data={weeklyData}
                stacks={[
                  { dataKey: 'resolved', name: '已結案', color: '#10b981' },
                  { dataKey: 'pending', name: '待處理', color: '#f59e0b' },
                ]}
                title="每週狀態分布"
                subtitle="案件狀態的週度分布"
                xAxisKey="week"
                height={300}
              />
            )}
          </div>
        )}

        {/* 分布分析區 - 三等分 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {typeDistribution.length > 0 && (
            <DistributionPieChart
              data={typeDistribution}
              title="案件類型分布"
              subtitle="不同案件類型的佔比"
              height={280}
            />
          )}

          {priorityDistribution.length > 0 && (
            <DistributionPieChart
              data={priorityDistribution}
              title="優先級分布"
              subtitle="不同優先級案件的佔比"
              height={280}
            />
          )}

          {assigneeStats.length > 0 && (
            <ComparisonBarChart
              data={assigneeStats}
              series={[
                { dataKey: 'cases', name: '案件數', color: '#6366f1' }
              ]}
              title="承辦人工作量"
              subtitle="各承辦人處理的案件數"
              xAxisKey="name"
              height={280}
            />
          )}
        </div>
      </div>
      )}

      {/* 即時數據：效能分析和基礎設施 */}
      {viewMode === 'realtime' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Engagement */}
        <div className="lg:col-span-2 bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-12">
                <div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">效能分析</div>
                  <h3 className="text-3xl font-black tracking-tighter">處理量能分析</h3>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <TrendingUp className="text-blue-400" size={24} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">系統活躍度</div>
                  <div className="text-4xl font-black tracking-tighter">98%</div>
                  <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="w-[98%] h-full bg-blue-500"></div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">結案率 (平均)</div>
                  <div className="text-4xl font-black tracking-tighter">84.5%</div>
                  <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="w-[84%] h-full bg-emerald-500"></div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">平均回應時間 (h)</div>
                  <div className="text-4xl font-black tracking-tighter">1.2h</div>
                  <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                    <div className="w-[45%] h-full bg-indigo-500"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 flex items-center gap-6">
              <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                導出完整報告
              </button>
              <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                查看詳細趨勢
              </button>
            </div>
          </div>

          {/* Background Decors */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        {/* System Status Table */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
          <h3 className="text-xl font-black tracking-tighter text-slate-900 mb-8 uppercase flex items-center gap-3">
            <Shield className="text-blue-600" size={20} />
            基礎設施
          </h3>
          <div className="space-y-6">
            {[
              { name: '主要資料庫 Cluster', status: 'Healthy', val: '12ms', color: 'bg-emerald-500' },
              { name: 'API Gateway v2', status: 'Active', val: '99.9%', color: 'bg-emerald-500' },
              { name: '1999 系統介接', status: 'Synched', val: '2m ago', color: 'bg-blue-500' },
              { name: '地理資訊伺服器', status: 'Idle', val: '正常', color: 'bg-emerald-500' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-600 transition-all">
                <div>
                  <div className="text-sm font-black text-slate-900">{s.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-900">{s.val}</div>
                  <div className={`w-2 h-2 rounded-full ${s.color} ml-auto mt-1 animate-pulse`}></div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all">
            系統日誌中心
          </button>
        </div>
      </div>
      )}

      {/* Rapid Actions */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/30 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-3xl font-black tracking-tighter mb-2">需要處理緊急案件嗎？</h3>
          <p className="text-indigo-100 font-medium">系統已為您篩選出 3 個高優先等級案件，請立即指派承辦人。</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <a href="/admin/cases?priority=critical" className="flex-1 md:flex-none px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all text-center">
            立即處理
          </a>
        </div>
      </div>
    </div>
  );
}
