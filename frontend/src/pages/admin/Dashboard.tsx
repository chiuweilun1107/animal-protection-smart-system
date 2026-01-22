import { useEffect, useState } from 'react';
import {
  BarChart3, AlertCircle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Shield, TrendingUp
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { DateRangeSelector } from '../../components/DateRangeSelector';
import { TrendLineChart, ComparisonBarChart, StackedBarChart, DistributionPieChart } from '../../components/charts';
import { ChartWithAIAnalysis } from '../../components/ChartWithAIAnalysis';

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
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">初始化中...</p>
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
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Page Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">系統總覽</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">指揮中心</h1>
        </div>
        <div className="flex items-center gap-0 border-2 border-slate-950 bg-white">
          <button
            onClick={() => setViewMode('realtime')}
            className={`px-8 py-3 text-base font-black uppercase tracking-[0.2em] transition-all ${viewMode === 'realtime'
              ? 'bg-slate-950 text-white'
              : 'text-slate-400 hover:text-slate-950'
              }`}
          >
            即時
          </button>
          <div className="w-0.5 h-full bg-slate-950"></div>
          <button
            onClick={() => setViewMode('history')}
            className={`px-8 py-3 text-base font-black uppercase tracking-[0.2em] transition-all ${viewMode === 'history'
              ? 'bg-slate-950 text-white'
              : 'text-slate-400 hover:text-slate-950'
              }`}
          >
            歷史
          </button>
        </div>
      </div>

      {/* Metrics Grid - De-containerized */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 py-4">
        {metricCards.map((card, i) => (
          <div key={i} className="group cursor-default relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-100 group-hover:bg-blue-600 transition-colors"></div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 uppercase tracking-[0.2em] text-base font-black">
                {card.label}
                {card.up ? <ArrowUpRight size={12} className="text-emerald-500" /> : <ArrowDownRight size={12} className="text-rose-500" />}
              </div>
              <div className="text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                {card.value}
              </div>
              <div className={`text-base font-bold ${card.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.trend} <span className="text-slate-300 font-medium">相較上期</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-slate-100"></div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Left Column: Analytics / Charts */}
        <div className="lg:col-span-2 space-y-16">
          {viewMode === 'history' ? (
            <>
              <ChartWithAIAnalysis
                title="案件總量"
                analysis="每週案件量已穩定在 35 件。"
                insight="運作效能良好。"
              >
                <TrendLineChart
                  data={timeSeriesData}
                  lines={[
                    { dataKey: 'totalCases', name: 'Total', color: '#0f172a' },
                    { dataKey: 'resolvedCases', name: 'Resolved', color: '#3b82f6' },
                  ]}
                  title=""
                  subtitle=""
                  height={350}
                />
              </ChartWithAIAnalysis>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-950 uppercase tracking-widest border-b-2 border-slate-950 pb-2">每週分布</h3>
                  <ComparisonBarChart
                    data={weeklyData}
                    series={[{ dataKey: 'totalCases', name: '案件', color: '#3b82f6' }]}
                    title=""
                    subtitle=""
                    xAxisKey="week"
                    height={200}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-base font-black text-slate-950 uppercase tracking-widest border-b-2 border-slate-950 pb-2">案件狀態</h3>
                  <StackedBarChart
                    data={weeklyData}
                    stacks={[
                      { dataKey: 'resolved', name: '已完成', color: '#0f172a' },
                      { dataKey: 'pending', name: '待處理', color: '#cbd5e1' },
                    ]}
                    title=""
                    subtitle=""
                    xAxisKey="week"
                    height={200}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-950 text-white p-12 aspect-video flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="text-base font-black text-slate-500 uppercase tracking-widest">系統健康度</div>
                  </div>
                  <div className="text-7xl font-black tracking-tighter">98.4%</div>
                </div>

                <div className="grid grid-cols-3 gap-12 border-t border-white/10 pt-8">
                  <div>
                    <div className="text-base font-bold text-slate-500 uppercase tracking-widest mb-1">回應時間</div>
                    <div className="text-2xl font-black text-blue-500">12ms</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-500 uppercase tracking-widest mb-1">API 狀態</div>
                    <div className="text-2xl font-black text-emerald-500">正常</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-500 uppercase tracking-widest mb-1">佇列</div>
                    <div className="text-2xl font-black text-white">0</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none"></div>
            </div>
          )}
        </div>

        {/* Right Column: Infrastructure & Actions */}
        <div className="lg:col-span-1 space-y-12">

          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">快速部署</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 p-6 hover:bg-blue-100 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle size={24} className="text-blue-600" />
                  <ArrowUpRight size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-3xl font-black text-slate-950 mb-1">03</div>
                <div className="text-base font-black text-blue-600 uppercase tracking-widest">緊急案件</div>
              </div>

              <div className="bg-slate-50 p-6 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <Clock size={24} className="text-slate-950" />
                  <ArrowUpRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-3xl font-black text-slate-950 mb-1">12</div>
                <div className="text-base font-black text-slate-500 uppercase tracking-widest">待審核</div>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">基礎設施</h3>
            <div className="space-y-0">
              {[
                { label: '資料庫叢集', status: '正常' },
                { label: '地圖伺服器', status: '運作中' },
                { label: '通知服務', status: '閒置' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50">
                  <span className="text-base font-bold text-slate-950">{item.label}</span>
                  <span className="text-base font-black uppercase tracking-widest px-2 py-1 bg-emerald-50 text-emerald-600">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
