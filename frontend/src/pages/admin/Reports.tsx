import { useState, useEffect } from 'react';
import {
  Filter, Download, FileText, TrendingUp,
  ClipboardList, MapPin, RefreshCw, Shield, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Case } from '../../types/schema';

type ReportType = 'evaluation' | 'home_visit' | 'stray_dog' | 'duty_cert';

interface FilterParams {
  startDate: string;
  endDate: string;
  location: string;
  caseType: string;
  status: string;
}

export function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('evaluation');
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);

  const [filters, setFilters] = useState<FilterParams>({
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    location: '',
    caseType: '',
    status: ''
  });

  const reportTypes = [
    {
      id: 'evaluation' as ReportType,
      label: '動保評鑑表',
      description: '評鑑相關數據統計',
      icon: <TrendingUp size={20} />
    },
    {
      id: 'home_visit' as ReportType,
      label: '家訪報表',
      description: '家訪工作紀錄 (SOAP)',
      icon: <ClipboardList size={20} />
    },
    {
      id: 'stray_dog' as ReportType,
      label: '遊蕩犬管理報表',
      description: '遊蕩犬處理紀錄',
      icon: <MapPin size={20} />
    },
    {
      id: 'duty_cert' as ReportType,
      label: '受理案件證明單',
      description: '案件受理證明記錄',
      icon: <FileText size={20} />
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getCases();
      setCases(data);
    } catch (error) {
      console.error('Failed to load cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: 'odt' | 'pdf') => {
    alert(`正在匯出 ${format.toUpperCase()} 格式報表...`);
  };

  const filteredCases = cases.filter(c => {
    const caseDate = new Date(c.createdAt);
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);

    if (caseDate < start || caseDate > end) return false;
    if (filters.location && !c.location.includes(filters.location)) return false;
    if (filters.caseType && c.type !== filters.caseType) return false;
    if (filters.status && c.status !== filters.status) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-black uppercase tracking-widest text-slate-400">載入報表資料中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">智慧報表</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">報表中心</h1>
        </div>
        <button
          onClick={loadData}
          className="p-3 bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors"
          title="重新載入"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Report Type Selector */}
        <div className="lg:col-span-3 space-y-12">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-6 border-b-2 border-slate-950 pb-2">報表類型</h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {reportTypes.map(rt => (
                <button
                  key={rt.id}
                  onClick={() => {
                    setReportType(rt.id);
                  }}
                  className={`flex-shrink-0 w-64 lg:w-full text-left px-4 py-4 transition-all group relative overflow-hidden flex flex-col justify-center border-l-2 ${
                    reportType === rt.id
                      ? 'border-slate-950 bg-slate-50'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`transition-colors ${reportType === rt.id ? 'text-blue-600' : 'text-slate-300'}`}>
                      {rt.icon}
                    </div>
                    <div>
                      <p className={`font-black text-base uppercase tracking-widest ${reportType === rt.id ? 'text-slate-950' : 'text-slate-400'}`}>
                        {rt.label}
                      </p>
                      <p className="text-xs font-bold text-slate-400 mt-1">{rt.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="hidden lg:block bg-slate-950 p-8 text-white">
            <FileText className="text-blue-500 mb-6" size={24} />
            <h4 className="text-base font-black tracking-[0.2em] mb-4 uppercase">報表說明</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {reportType === 'evaluation' && '動保評鑑表彙整各項評鑑指標與執行成果。'}
              {reportType === 'home_visit' && '家訪報表採用 SOAP 格式記錄訪視內容。'}
              {reportType === 'stray_dog' && '遊蕩犬管理報表追蹤犬隻處理流程。'}
              {reportType === 'duty_cert' && '受理案件證明單提供案件受理證明。'}
            </p>
          </div>
        </div>

        {/* Right: Filters and Preview */}
        <div className="lg:col-span-9 space-y-12">
          {/* Filters */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Filter size={18} className="text-slate-950" />
              <h3 className="text-base font-black tracking-[0.2em] text-slate-950 uppercase">篩選條件</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="space-y-2 group">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                  起始日期
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none transition-all font-black text-xl text-slate-950 rounded-none cursor-pointer"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                  結束日期
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none transition-all font-black text-xl text-slate-950 rounded-none cursor-pointer"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                  地點
                </label>
                <input
                  type="text"
                  placeholder="輸入地點關鍵字..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none transition-all font-black text-xl text-slate-950 rounded-none placeholder:text-slate-200"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-blue-600 transition-colors">
                  案件狀態
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none transition-all font-black text-xl text-slate-950 rounded-none appearance-none cursor-pointer"
                >
                  <option value="">全部狀態</option>
                  <option value="pending">待處理</option>
                  <option value="processing">處理中</option>
                  <option value="resolved">已結案</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleExport('odt')}
                className="flex-1 py-5 bg-blue-600 text-white font-black text-base uppercase tracking-[0.3em] hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} /> 匯出 ODF
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex-1 py-5 bg-slate-950 text-white font-black text-base uppercase tracking-[0.3em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} /> 匯出 PDF
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 pt-8 border-t-2 border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em]">
                報表內容 ({filteredCases.length} 筆資料)
              </h3>
            </div>

            {/* Report Content Based on Type */}
            {reportType === 'evaluation' && <EvaluationReport cases={filteredCases} />}
            {reportType === 'home_visit' && <HomeVisitReport cases={filteredCases} />}
            {reportType === 'stray_dog' && <StrayDogReport cases={filteredCases} />}
            {reportType === 'duty_cert' && <DutyCertReport cases={filteredCases} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// 動保評鑑表組件 - 參考三聯單格式
function EvaluationReport({ cases }: { cases: Case[] }) {
  return (
    <div className="space-y-8">
      {/* Main Document Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-5xl mx-auto">
        <div className="border-4 border-double border-slate-200 p-8 rounded-sm shadow-inner relative overflow-hidden bg-slate-50/50">

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Shield size={400} />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-widest mb-2 font-serif">動物保護評鑑表</h1>
              <div className="flex justify-between items-end text-base font-bold text-slate-500 mt-6">
                <div>統計期間：{new Date().toLocaleDateString()}</div>
                <div>製表日期：{new Date().toLocaleDateString()}</div>
                <div>頁次：第 1 頁，共 1 頁</div>
              </div>
            </div>

            {/* Section 1: Summary Stats */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">壹、執行成果統計</h3>
              <div className="grid grid-cols-4 gap-6">
                <div className="border border-slate-200 p-4 text-center bg-white">
                  <div className="text-sm font-bold text-slate-500 mb-2">案件總數</div>
                  <div className="text-4xl font-black text-slate-900">{cases.length}</div>
                </div>
                <div className="border border-slate-200 p-4 text-center bg-white">
                  <div className="text-sm font-bold text-slate-500 mb-2">已結案</div>
                  <div className="text-4xl font-black text-emerald-600">{cases.filter(c => c.status === 'resolved').length}</div>
                </div>
                <div className="border border-slate-200 p-4 text-center bg-white">
                  <div className="text-sm font-bold text-slate-500 mb-2">處理中</div>
                  <div className="text-4xl font-black text-blue-600">{cases.filter(c => c.status === 'processing').length}</div>
                </div>
                <div className="border border-slate-200 p-4 text-center bg-white">
                  <div className="text-sm font-bold text-slate-500 mb-2">待處理</div>
                  <div className="text-4xl font-black text-orange-600">{cases.filter(c => c.status === 'pending').length}</div>
                </div>
              </div>
            </div>

            {/* Section 2: Case List */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">貳、案件明細列表</h3>
              <div className="overflow-x-auto bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-3 px-2 text-left font-black text-slate-900">案件編號</th>
                      <th className="py-3 px-2 text-left font-black text-slate-900">案件類型</th>
                      <th className="py-3 px-2 text-center font-black text-slate-900">處理狀態</th>
                      <th className="py-3 px-2 text-right font-black text-slate-900">建立日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.slice(0, 10).map((c) => (
                      <tr key={c.id} className="border-b border-slate-100">
                        <td className="py-3 px-2 font-mono font-bold text-blue-600">{c.id}</td>
                        <td className="py-3 px-2 font-bold text-slate-900">{c.type}</td>
                        <td className="py-3 px-2 text-center font-black text-slate-600 uppercase">{c.status}</td>
                        <td className="py-3 px-2 text-right font-mono text-slate-600">{new Date(c.createdAt).toLocaleDateString('zh-TW')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-slate-900 flex justify-between items-end">
              <div className="text-center w-40">
                <div className="h-24 border-b border-slate-300 mb-3"></div>
                <div className="text-base font-bold text-slate-500">製表人員</div>
              </div>
              <div className="text-center w-40">
                <div className="h-24 border-b border-slate-300 mb-3"></div>
                <div className="text-base font-bold text-slate-500">單位主管</div>
              </div>
            </div>

            <div className="text-sm text-center text-slate-400 font-mono mt-10">
              表單編號：EVAL-2026-REPORT-01 • 第一聯：機關存查 • 第二聯：業務單位
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 家訪報表組件 (SOAP格式) - 參考三聯單格式
function HomeVisitReport({ cases }: { cases: Case[] }) {
  return (
    <div className="space-y-8">
      {cases.slice(0, 3).map((c) => (
        <div key={c.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-5xl mx-auto">
          <div className="border-4 border-double border-slate-200 p-8 rounded-sm shadow-inner relative overflow-hidden bg-slate-50/50">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Shield size={400} />
            </div>

            <div className="relative z-10 space-y-8">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-widest mb-2 font-serif">家訪紀錄表 (SOAP格式)</h1>
                <div className="flex justify-between items-end text-base font-bold text-slate-500 mt-6">
                  <div>案號：{c.id}</div>
                  <div>訪視日期：{new Date(c.createdAt).toLocaleDateString()}</div>
                  <div>頁次：第 1 頁，共 1 頁</div>
                </div>
              </div>

              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">壹、基本資料</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-base">
                  <div className="border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">訪視對象：</span>
                    <span className="font-black text-slate-900">{c.reporterName || '未提供'}</span>
                  </div>
                  <div className="border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">聯絡電話：</span>
                    <span className="font-black text-slate-900">{c.reporterPhone || '未提供'}</span>
                  </div>
                  <div className="col-span-2 border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">訪視地點：</span>
                    <span className="font-black text-slate-900">{c.location}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: SOAP */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">貳、SOAP 訪視記錄</h3>

                {/* Subjective */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-black text-lg">S</div>
                    <h4 className="font-black text-blue-900">主觀描述 (Subjective)</h4>
                  </div>
                  <p className="text-base font-medium text-slate-700 pl-13">{c.description}</p>
                </div>

                {/* Objective */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center font-black text-lg">O</div>
                    <h4 className="font-black text-emerald-900">客觀資料 (Objective)</h4>
                  </div>
                  <div className="text-base font-medium text-slate-700 pl-13 space-y-1">
                    <p><strong>地點：</strong>{c.location}</p>
                    <p><strong>狀態：</strong>{c.status}</p>
                    <p><strong>類型：</strong>{c.type}</p>
                  </div>
                </div>

                {/* Assessment */}
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-600 text-white flex items-center justify-center font-black text-lg">A</div>
                    <h4 className="font-black text-orange-900">評估分析 (Assessment)</h4>
                  </div>
                  <p className="text-base font-medium text-slate-700 pl-13">
                    案件類型為 {c.type}，優先順序為 {c.priority || 'medium'}，需要進一步處理與追蹤。
                  </p>
                </div>

                {/* Plan */}
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-600 text-white flex items-center justify-center font-black text-lg">P</div>
                    <h4 className="font-black text-purple-900">處遇計畫 (Plan)</h4>
                  </div>
                  <div className="text-base font-medium text-slate-700 pl-13 space-y-1">
                    <p>1. 指派承辦人員進行實地訪查</p>
                    <p>2. 記錄現場狀況並拍照存證</p>
                    <p>3. 依標準作業流程完成後續處理</p>
                    <p>4. 定期追蹤案件進度</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t-2 border-slate-900 flex justify-between items-end">
                <div className="text-center w-40">
                  <div className="h-24 border-b border-slate-300 mb-3"></div>
                  <div className="text-base font-bold text-slate-500">訪視人員</div>
                </div>
                <div className="text-center w-40">
                  <div className="h-24 border-b border-slate-300 mb-3"></div>
                  <div className="text-base font-bold text-slate-500">督導</div>
                </div>
              </div>

              <div className="text-sm text-center text-slate-400 font-mono mt-10">
                表單編號：VISIT-2026-SOAP-01 • 第一聯：機關存查 • 第二聯：個案紀錄
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 遊蕩犬管理報表組件 - 參考三聯單格式
function StrayDogReport({ cases }: { cases: Case[] }) {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-5xl mx-auto">
        <div className="border-4 border-double border-slate-200 p-8 rounded-sm shadow-inner relative overflow-hidden bg-slate-50/50">

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Shield size={400} />
          </div>

          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-widest mb-2 font-serif">遊蕩犬管理報表</h1>
              <div className="flex justify-between items-end text-base font-bold text-slate-500 mt-6">
                <div>統計期間：{new Date().toLocaleDateString()}</div>
                <div>製表日期：{new Date().toLocaleDateString()}</div>
                <div>頁次：第 1 頁，共 1 頁</div>
              </div>
            </div>

            {/* Section 1: Summary */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">壹、執行統計</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="border border-slate-200 p-4 text-center bg-white">
                  <div className="text-sm font-bold text-slate-500 mb-2">捕捉數量</div>
                  <div className="text-4xl font-black text-slate-900">{cases.filter(c => c.status === 'resolved').length} 隻</div>
                </div>
                <div className="border border-slate-200 p-4 text-center bg-white">
                  <div className="text-sm font-bold text-slate-500 mb-2">安置中</div>
                  <div className="text-4xl font-black text-blue-600">{cases.filter(c => c.status === 'processing').length} 隻</div>
                </div>
                <div className="border border-slate-200 p-4 text-center bg-white">
                  <div className="text-sm font-bold text-slate-500 mb-2">待處理</div>
                  <div className="text-4xl font-black text-orange-600">{cases.filter(c => c.status === 'pending').length} 隻</div>
                </div>
              </div>
            </div>

            {/* Section 2: Case List */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">貳、案件處理明細</h3>
              <div className="overflow-x-auto bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="py-3 px-2 text-left font-black text-slate-900">案件編號</th>
                      <th className="py-3 px-2 text-left font-black text-slate-900">發現地點</th>
                      <th className="py-3 px-2 text-center font-black text-slate-900">處理方式</th>
                      <th className="py-3 px-2 text-right font-black text-slate-900">執行日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.slice(0, 10).map((c) => (
                      <tr key={c.id} className="border-b border-slate-100">
                        <td className="py-3 px-2 font-mono font-bold text-blue-600">{c.id}</td>
                        <td className="py-3 px-2 font-bold text-slate-900">{c.location}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-black uppercase ${
                            c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                            c.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {c.status === 'resolved' ? '已完成' : c.status === 'processing' ? '處理中' : '待處理'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-slate-600">{new Date(c.createdAt).toLocaleDateString('zh-TW')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t-2 border-slate-900 flex justify-between items-end">
              <div className="text-center w-40">
                <div className="h-24 border-b border-slate-300 mb-3"></div>
                <div className="text-base font-bold text-slate-500">製表人員</div>
              </div>
              <div className="text-center w-40">
                <div className="h-24 border-b border-slate-300 mb-3"></div>
                <div className="text-base font-bold text-slate-500">單位主管</div>
              </div>
            </div>

            <div className="text-sm text-center text-slate-400 font-mono mt-10">
              表單編號：STRAY-2026-REPORT-01 • 第一聯：機關存查 • 第二聯：業務單位
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 受理案件證明單組件（取代三聯單）- 參考三聯單格式
function DutyCertReport({ cases }: { cases: Case[] }) {
  return (
    <div className="space-y-8">
      {cases.slice(0, 3).map((c) => (
        <div key={c.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-5xl mx-auto">
          <div className="border-4 border-double border-slate-200 p-8 rounded-sm shadow-inner relative overflow-hidden bg-slate-50/50">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Shield size={400} />
            </div>

            <div className="relative z-10 space-y-8">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-widest mb-2 font-serif">受（處）理案件證明單</h1>
                <div className="flex justify-between items-end text-base font-bold text-slate-500 mt-6">
                  <div>證明單編號：{c.id}</div>
                  <div>受理時間：{new Date(c.createdAt).toLocaleString('zh-TW')}</div>
                  <div>頁次：第 1 頁，共 1 頁</div>
                </div>
              </div>

              {/* Section 1: Reporter Info */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">壹、報案人/陳情人資訊</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-base">
                  <div className="border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">姓名：</span>
                    <span className="font-black text-slate-900">{c.reporterName || '匿名'}</span>
                  </div>
                  <div className="border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">聯絡電話：</span>
                    <span className="font-black text-slate-900">{c.reporterPhone || '--'}</span>
                  </div>
                  <div className="border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">受理方式：</span>
                    <span className="font-black text-slate-900">電話通報</span>
                  </div>
                  <div className="border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">案件類型：</span>
                    <span className="font-black text-slate-900">{c.type}</span>
                  </div>
                  <div className="col-span-2 border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-500 w-32 inline-block">案發地點：</span>
                    <span className="font-black text-slate-900">{c.location}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Case Description */}
              <div className="space-y-4">
                <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">貳、案情摘要</h3>
                <div className="border border-slate-200 rounded p-6 bg-white min-h-[120px]">
                  <p className="text-base font-medium text-slate-700 leading-relaxed">{c.description}</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <div className="font-black text-yellow-800 mb-1">重要提醒</div>
                    <p className="text-sm text-yellow-700 leading-relaxed">
                      本證明單僅供證明案件受理，不代表調查結果或處理情形。如需了解案件進度，請洽承辦單位。
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t-2 border-slate-900 flex justify-between items-end">
                <div className="text-center w-40">
                  <div className="h-24 border-b border-slate-300 mb-3"></div>
                  <div className="text-base font-bold text-slate-500">受理人員</div>
                </div>
                <div className="text-center w-40">
                  <div className="h-24 border-b border-slate-300 mb-3"></div>
                  <div className="text-base font-bold text-slate-500">填表人員</div>
                </div>
                <div className="text-center w-40">
                  <div className="h-24 border-b border-slate-300 mb-3"></div>
                  <div className="text-base font-bold text-slate-500">單位主管</div>
                </div>
              </div>

              <div className="text-sm text-center text-slate-400 font-mono mt-10">
                表單編號：CERT-2026-CASE-01 • 第一聯：機關存查 • 第二聯：陳情人收執
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
