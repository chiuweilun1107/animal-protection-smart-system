import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search, ArrowRight, Clock, CheckCircle,
    AlertCircle, MapPin, Calendar, MoreHorizontal,
    ChevronLeft, ChevronRight, Zap, Menu, Tag, X,
    ArrowLeftRight, Copy, AlertTriangle
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { CaseDetailPanel } from '../../components/CaseDetailPanel';
import type { Case } from '../../types/schema';

export function CaseList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
    const [filterType, setFilterType] = useState(searchParams.get('type') || 'all');
    const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);

    // 併案處理相關狀態
    const [selectedCases, setSelectedCases] = useState<Set<string>>(new Set());
    const [duplicateWarnings, setDuplicateWarnings] = useState<Map<string, number>>(new Map());
    const [checkingDuplicates, setCheckingDuplicates] = useState(false);

    const currentFilter = searchParams.get('filter') || 'all';

    useEffect(() => {
        const loadCases = async () => {
            setLoading(true);
            try {
                const filters = {
                    status: filterStatus === 'all' ? undefined : filterStatus,
                    type: filterType === 'all' ? undefined : filterType,
                    tabFilter: currentFilter,
                };
                const data = await mockApi.getCases(filters);
                setCases(data);
            } catch (error) {
                console.error('Failed to load cases:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCases();
    }, [filterStatus, filterType, currentFilter]);

    const filteredCases = cases.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.reporterName?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { label: '待簽收', color: 'orange', icon: Clock };
            case 'authorized': return { label: '已受理', color: 'blue', icon: CheckCircle };
            case 'assigned': return { label: '已分派', color: 'indigo', icon: MapPin };
            case 'processing': return { label: '處理中', color: 'purple', icon: Zap };
            case 'transferred': return { label: '移交中', color: 'pink', icon: ArrowRight };
            case 'completed': return { label: '待審核', color: 'emerald', icon: CheckCircle };
            case 'resolved': return { label: '已結案', color: 'slate', icon: CheckCircle };
            case 'rejected': return { label: '責任撤銷', color: 'rose', icon: X };
            case 'overdue': return { label: '案件逾期', color: 'rose', icon: AlertCircle };
            default: return { label: '狀態存疑', color: 'slate', icon: AlertCircle };
        }
    };

    // 切換案件選中狀態
    const toggleCaseSelection = (caseId: string) => {
        const newSelected = new Set(selectedCases);
        if (newSelected.has(caseId)) {
            newSelected.delete(caseId);
        } else {
            newSelected.add(caseId);
        }
        setSelectedCases(newSelected);
    };

    // 批次檢測重複案件
    const handleBatchCheckDuplicates = async () => {
        if (selectedCases.size === 0) {
            alert('請先選擇要檢測的案件');
            return;
        }

        setCheckingDuplicates(true);
        try {
            const results = await mockApi.findAllDuplicates(Array.from(selectedCases));
            const warnings = new Map<string, number>();

            results.forEach((suggestions, caseId) => {
                if (suggestions.length > 0) {
                    warnings.set(caseId, suggestions.length);
                }
            });

            setDuplicateWarnings(warnings);

            if (warnings.size > 0) {
                const confirmed = window.confirm(
                    `檢測到 ${warnings.size} 個案件有重複疑慮，是否前往併案處理頁面？`
                );
                if (confirmed) {
                    navigate('/admin/case-merge');
                }
            } else {
                alert('未檢測到重複案件');
            }
        } catch (error) {
            console.error('檢測重複失敗:', error);
            alert('檢測失敗，請稍後再試');
        } finally {
            setCheckingDuplicates(false);
        }
    };


    const caseMenuLabels: Record<string, string> = {
        'all': '全部案件列表',
        'attention': '特別關注案件',
        'receipt_pending': '收簽：待簽收',
        'receipt_authorized': '收簽：已受理',
        'assignment_assigned': '分派：已分派',
        'undertaker_pending': '承辦：待簽收',
        'undertaker_processing': '承辦：處理中',
        'undertaker_transferred': '承辦：移交中',
        'undertaker_overdue': '承辦：逾期提醒',
        'public_completed': '公文：待審核',
        'resolved': '結案案件存檔',
        'rejected': '責撤案件記錄'
    };

    return (
        <div className="min-h-full animate-in fade-in duration-700">
            {/* Main Content Container */}
            <div className="max-w-[1400px] mx-auto space-y-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-slate-950"></div>
                            <div className="text-base font-bold text-slate-400 uppercase tracking-[0.2em]">智慧勤務</div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-950 uppercase leading-[0.8]">
                            {caseMenuLabels[currentFilter] || '案件管理'}
                        </h1>
                    </div>
                </div>

                {/* Filter & Search Bar - Architectural Minimal */}
                <div className="sticky top-0 z-20 bg-[#fdfdfd]/95 backdrop-blur-sm pt-4 pb-4 flex flex-col xl:flex-row items-center gap-8 border-b-2 border-slate-100">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={24} />
                        <input
                            type="text"
                            placeholder="搜尋案件資料庫..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 bg-transparent border-b-2 border-slate-100 focus:border-slate-950 outline-none transition-all font-black text-xl placeholder:text-slate-200 uppercase tracking-tight text-slate-950"
                        />
                    </div>

                    <div className="flex items-center gap-8 w-full xl:w-auto">
                        <div className="flex items-center gap-3 border-b-2 border-slate-100 py-4 px-2 xl:w-64 focus-within:border-slate-950 transition-colors">
                            <Menu size={20} className="text-slate-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent border-none outline-none font-bold text-base text-slate-950 cursor-pointer w-full uppercase tracking-widest"
                            >
                                <option value="all">所有工作狀態</option>
                                <option value="pending">待簽收</option>
                                <option value="authorized">已受理</option>
                                <option value="assigned">已分派</option>
                                <option value="processing">處理中</option>
                                <option value="resolved">已結案</option>
                                <option value="rejected">已責撤</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 border-b-2 border-slate-100 py-4 px-2 xl:w-64 focus-within:border-slate-950 transition-colors">
                            <Tag size={20} className="text-slate-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent border-none outline-none font-bold text-base text-slate-950 cursor-pointer w-full uppercase tracking-widest"
                            >
                                <option value="all">所有案件來源</option>
                                <option value="general">一般案件</option>
                                <option value="bee">蜂案通報</option>
                                <option value="1999">1999 專案</option>
                                <option value="1959">1959 專線</option>
                            </select>
                        </div>

                        {/* 批次操作按鈕 */}
                        {selectedCases.size > 0 && (
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 bg-slate-950 text-white font-black text-sm uppercase tracking-widest rounded-full">
                                    已選 {selectedCases.size} 筆
                                </div>
                                <button
                                    onClick={handleBatchCheckDuplicates}
                                    disabled={checkingDuplicates}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ArrowLeftRight size={18} />
                                    {checkingDuplicates ? '檢測中...' : '檢測重複'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Case List - Floating Rows */}
                {/* Case List - Architectural Rows */}
                <div className="space-y-0">
                    {/* Header Row */}
                    <div className="hidden lg:grid grid-cols-12 gap-8 px-8 py-4 border-b-2 border-slate-950 text-base font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="col-span-1 flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedCases.size === filteredCases.length && filteredCases.length > 0}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedCases(new Set(filteredCases.map(c => c.id)));
                                    } else {
                                        setSelectedCases(new Set());
                                    }
                                }}
                                className="w-5 h-5 cursor-pointer"
                            />
                        </div>
                        <div className="col-span-4">案件資訊</div>
                        <div className="col-span-2">類別</div>
                        <div className="col-span-3">狀態</div>
                        <div className="col-span-2 text-right">操作</div>
                    </div>

                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-24 bg-slate-50 animate-pulse border-b border-slate-100"></div>
                        ))
                    ) : filteredCases.length > 0 ? (
                        filteredCases.map((c) => {
                            const statusInfo = getStatusInfo(c.status);
                            const StatusIcon = statusInfo.icon;
                            const isSelected = selectedCases.has(c.id);
                            const duplicateCount = duplicateWarnings.get(c.id) || 0;

                            return (
                                <div
                                    key={c.id}
                                    className={`group relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-8 py-8 border-b border-slate-100 transition-all duration-300 
                                        ${selectedCaseId === c.id ? 'bg-slate-50' : 'hover:bg-slate-50'}
                                        ${isSelected ? 'bg-blue-50/50' : ''}
                                    `}
                                >
                                    {/* 勾選框 */}
                                    <div className="col-span-1 flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleCaseSelection(c.id);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                    </div>

                                    {/* ID & Title */}
                                    <div className="col-span-4 flex flex-col justify-center" onClick={() => setSelectedCaseId(c.id)}>
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-base font-black text-slate-300 font-mono tracking-tighter uppercase">{c.id}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="flex items-center gap-2 text-base font-bold text-slate-400 uppercase tracking-widest">
                                                <Calendar size={14} /> {c.date || new Date(c.updatedAt).toLocaleDateString()}
                                            </span>

                                            {/* 重複標記 - 顯眼的警告 */}
                                            {duplicateCount > 0 && (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/case-merge?id=${c.id}`);
                                                    }}
                                                    className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-rose-500/30 animate-pulse hover:bg-rose-600 transition-colors cursor-pointer"
                                                >
                                                    <AlertTriangle size={12} strokeWidth={3} />
                                                    {duplicateCount} 筆重複疑慮
                                                </div>
                                            )}

                                            {/* 併案狀態標記 */}
                                            {c.mergeStatus === 'merged' && (
                                                <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-slate-500/20 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-full">
                                                    <Copy size={12} strokeWidth={3} />
                                                    已併案
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-950 tracking-tighter group-hover:text-blue-600 transition-colors mb-2">{c.title}</h3>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-base font-bold text-slate-500">
                                                <MapPin size={16} className="text-slate-400" />
                                                {c.location}
                                            </div>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <div className="text-base font-bold text-slate-400">
                                                {c.petitionerName || c.reporterName}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Type */}
                                    <div className="col-span-2 flex items-center">
                                        <div className={`inline-flex items-center gap-2 px-0 py-0 font-black text-base tracking-tight uppercase 
                                            ${c.type === '1999' ? 'text-rose-600' :
                                                c.type === '1959' ? 'text-indigo-600' :
                                                    c.type === 'bee' ? 'text-orange-600' :
                                                        'text-blue-600'}
                                        `}>
                                            <Tag size={18} strokeWidth={3} />
                                            {c.type === '1999' ? '1999專案' :
                                                c.type === '1959' ? '1959專線' :
                                                    c.type === 'bee' ? '蜂案通報' : '一般案件'}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-3 flex items-center">
                                        <div className={`flex items-center gap-3 px-0 py-0 font-black text-base uppercase tracking-widest
                                            ${c.status === 'pending' ? 'text-orange-600' :
                                                c.status === 'resolved' ? 'text-slate-400' :
                                                    c.status === 'rejected' ? 'text-rose-600' :
                                                        'text-blue-600'}
                                        `}>
                                            <StatusIcon size={20} strokeWidth={3} />
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            to={`/admin/cases/${c.id}`}
                                            className="w-12 h-12 bg-slate-950 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                                        >
                                            <ArrowRight size={20} strokeWidth={3} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 p-32 text-center">
                            <div className="flex flex-col items-center max-w-sm mx-auto">
                                <Search size={64} className="text-slate-200 mb-8" />
                                <h3 className="text-3xl font-black text-slate-950 tracking-tighter mb-4 uppercase">找不到符合的案件</h3>
                                <p className="text-slate-400 font-bold leading-relaxed">請調整搜尋條件或篩選器。</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination - Modern Minimal */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-200/60 pb-20">
                    <div className="px-6 py-2 bg-slate-900 rounded-full text-base font-black text-white uppercase tracking-[0.3em]">
                        資料集：{filteredCases.length} / {cases.length} 筆記錄
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-14 h-14 rounded-2xl border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-3">
                            {[1, 2, 3].map(p => (
                                <button key={p} className={`w-14 h-14 rounded-2xl font-black text-base transition-all
                                    ${p === 1 ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200'}
                                `}>
                                    0{p}
                                </button>
                            ))}
                        </div>

                        <button className="w-14 h-14 rounded-2xl border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Case Detail Panel */}
            <CaseDetailPanel
                caseId={selectedCaseId}
                onClose={() => setSelectedCaseId(undefined)}
            />
        </div>
    );
}
