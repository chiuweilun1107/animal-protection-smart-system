import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { mockApi } from '../../services/mockApi';
import type { Case, CaseMergeRecord } from '../../types/schema';
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    ArrowLeftRight,
    FileText,
    MapPin,
    Calendar,
    User,
    Phone,
    Hash,
    Smartphone,
    ExternalLink,
    ChevronRight,
    Search,
    ArrowLeft
} from 'lucide-react';

export default function CaseMerge() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [suggestions, setSuggestions] = useState<CaseMergeRecord[]>([]);
    const [selectedPair, setSelectedPair] = useState<{ primary: Case | null; duplicate: Case | null }>({ primary: null, duplicate: null });
    const [loading, setLoading] = useState(true);
    const [filterConfidence, setFilterConfidence] = useState<number>(0);
    const [filterMatchType, setFilterMatchType] = useState<string>('all');
    const [mergeHistory, setMergeHistory] = useState<CaseMergeRecord[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [mergeNotes, setMergeNotes] = useState('');
    const [dismissReason, setDismissReason] = useState('');

    // 載入疑似重複案件列表
    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        setLoading(true);
        try {
            const data = await mockApi.getDuplicateSuggestions();
            setSuggestions(data);
        } catch (error) {
            console.error('載入重複案件失敗:', error);
        } finally {
            setLoading(false);
        }
    };

    // 載入案件詳情進行比對
    const loadCasePair = async (record: CaseMergeRecord) => {
        const primary = await mockApi.getCaseById(record.primaryCaseId);
        const duplicate = await mockApi.getCaseById(record.duplicateCaseId);
        setSelectedPair({ primary, duplicate });
        setMergeNotes('');
        setDismissReason('');
    };

    // 執行併案
    const handleMerge = async () => {
        if (!selectedPair.primary || !selectedPair.duplicate) return;

        const confirmed = window.confirm(
            `確定要將案件 ${selectedPair.duplicate.id} 併入 ${selectedPair.primary.id} 嗎？`
        );

        if (confirmed) {
            await mockApi.mergeCases(
                selectedPair.primary.id,
                [selectedPair.duplicate.id],
                mergeNotes,
                'u1' // 當前用戶ID
            );

            alert('併案成功！');
            setSelectedPair({ primary: null, duplicate: null });
            loadSuggestions(); // 重新載入列表
        }
    };

    // 標記為非重複
    const handleDismiss = async () => {
        if (!selectedPair.primary || !selectedPair.duplicate || !dismissReason.trim()) {
            alert('請填寫原因說明');
            return;
        }

        await mockApi.dismissDuplicate(
            selectedPair.primary.id,
            selectedPair.duplicate.id,
            dismissReason,
            'u1'
        );

        alert('已標記為非重複案件');
        setSelectedPair({ primary: null, duplicate: null });
        loadSuggestions();
    };

    // 載入併案歷史
    const loadHistory = async () => {
        const history = suggestions.filter(s => s.status === 'approved' || s.status === 'rejected');
        setMergeHistory(history);
        setShowHistory(true);
    };

    // 篩選後的建議列表
    const filteredSuggestions = suggestions.filter(s => {
        if (s.status !== 'pending') return false;
        if (s.confidence < filterConfidence) return false;
        if (filterMatchType !== 'all' && s.matchType !== filterMatchType) return false;
        return true;
    });

    // 信心度顏色 (High Contrast)
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.9) return 'bg-slate-950 text-white';
        if (confidence >= 0.75) return 'bg-slate-800 text-white';
        return 'bg-slate-100 text-slate-500';
    };

    // 比對類型標籤
    const getMatchTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            external_id: '外部編號',
            chip_id: '晶片特徵',
            location: '時空特徵',
            manual: '手動關聯'
        };
        return labels[type] || type;
    };

    return (
        <div className="min-h-full animate-in fade-in duration-700 bg-[#fdfdfd]">
            {/* Main Content Container */}
            <div className="max-w-[1600px] mx-auto space-y-12 pb-24">

                {/* 1. Header Section - Architectural Type */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-4 border-slate-950">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <button
                                onClick={() => navigate('/admin/cases')}
                                className="bg-slate-100 p-2 hover:bg-slate-200 transition-colors"
                                title="返回案件列表"
                            >
                                <ArrowLeft size={18} className="text-slate-950" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-slate-950"></div>
                                <div className="text-base font-bold text-slate-400 uppercase tracking-[0.2em]">數據整合程序</div>
                            </div>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-950 uppercase leading-[0.8] mb-2">
                            併案處理中心
                        </h1>
                    </div>

                    <div className="flex items-end gap-4">
                        <button
                            onClick={loadHistory}
                            className="bg-white border-2 border-slate-200 hover:border-slate-950 text-slate-950 px-8 py-4 font-black uppercase tracking-widest transition-all flex items-center gap-3"
                        >
                            <Clock size={18} strokeWidth={3} />
                            <span>併案記錄</span>
                        </button>
                        <button
                            onClick={loadSuggestions}
                            className="bg-slate-950 text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center gap-3"
                        >
                            <ArrowLeftRight size={18} strokeWidth={3} />
                            <span>重新掃描</span>
                        </button>
                    </div>
                </div>

                {/* 2. Main Interface Grid */}
                <div className="grid grid-cols-12 gap-0 border border-slate-200">

                    {/* LEFT COLUMN: Queue List */}
                    <div className="col-span-12 lg:col-span-4 border-r border-slate-200 bg-slate-50/50">
                        {/* Filter Strip */}
                        <div className="p-6 border-b border-slate-200 space-y-6">
                            <div className="flex items-center gap-2 text-slate-950 font-black uppercase tracking-widest text-sm">
                                <Filter size={16} />
                                <span>篩選序列</span>
                            </div>

                            <div className="space-y-4">

                                <select
                                    value={filterMatchType}
                                    onChange={(e) => setFilterMatchType(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-200 p-3 font-bold text-slate-950 uppercase tracking-wide focus:border-slate-950 outline-none transition-colors"
                                >
                                    <option value="all">所有比對類型</option>
                                    <option value="external_id">外部編號 (External ID)</option>
                                    <option value="chip_id">晶片特徵 (Chip ID)</option>
                                    <option value="location">時空特徵 (Spatial)</option>
                                </select>
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="max-h-[800px] overflow-y-auto">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                    數據分析中...
                                </div>
                            ) : filteredSuggestions.length === 0 ? (
                                <div className="p-16 text-center text-slate-300">
                                    <CheckCircle2 size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-black uppercase tracking-widest text-lg">未發現衝突案件</p>
                                </div>
                            ) : (
                                <div>
                                    {filteredSuggestions.map((record) => {
                                        const isSelected = selectedPair.primary?.id === record.primaryCaseId && selectedPair.duplicate?.id === record.duplicateCaseId;
                                        return (
                                            <button
                                                key={record.id}
                                                onClick={() => loadCasePair(record)}
                                                className={`w-full p-6 text-left border-b border-slate-200 transition-all group
                                                    ${isSelected ? 'bg-white border-l-4 border-l-slate-950 shadow-xl z-10 relative' : 'hover:bg-white hover:border-l-4 hover:border-l-slate-200'}
                                                `}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className={`px-2 py-1 text-xs font-black uppercase tracking-widest ${isSelected ? 'bg-slate-950 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                                        {getMatchTypeLabel(record.matchType)}
                                                    </span>
                                                    <span className={`text-xl font-black tabular-nums ${isSelected ? 'text-blue-600' : 'text-slate-300'}`}>
                                                        {(record.confidence * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="space-y-1 font-mono text-sm font-bold text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                                        {record.primaryCaseId}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                                        {record.duplicateCaseId}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Comparison Workspace */}
                    <div className="col-span-12 lg:col-span-8 bg-white relative">
                        {/* Background Grid Pattern */}
                        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                        </div>

                        {!selectedPair.primary || !selectedPair.duplicate ? (
                            <div className="h-full flex flex-col items-center justify-center p-20 text-slate-300 z-10 relative">
                                <ArrowLeftRight size={64} strokeWidth={1} className="mb-6 opacity-50" />
                                <h3 className="text-2xl font-black uppercase tracking-widest">請選擇一對案件進行比對</h3>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full z-10 relative">
                                {/* Comparison Grid */}
                                <div className="flex-1 grid grid-cols-2 divide-x divide-slate-100">
                                    {/* Primary Case */}
                                    <div className="p-8 md:p-12 space-y-8 bg-slate-50/30">
                                        <div className="flex items-center justify-between pb-4 border-b-2 border-blue-600">
                                            <h3 className="text-lg font-black text-slate-950 uppercase tracking-widest">主案件 (正式)</h3>
                                            <span className="w-3 h-3 bg-blue-600"></span>
                                        </div>
                                        <CaseDetailView caseData={selectedPair.primary} highlightColor="text-blue-600" />
                                    </div>

                                    {/* Duplicate Case */}
                                    <div className="p-8 md:p-12 space-y-8 bg-orange-50/10">
                                        <div className="flex items-center justify-between pb-4 border-b-2 border-orange-500">
                                            <h3 className="text-lg font-black text-slate-950 uppercase tracking-widest">新進通報 (疑似重複)</h3>
                                            <span className="w-3 h-3 bg-orange-500"></span>
                                        </div>
                                        <CaseDetailView caseData={selectedPair.duplicate} highlightColor="text-orange-600" />
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="border-t-4 border-slate-950 p-8 md:p-12 bg-[#fdfdfd]">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">解決協議 / 處理動作</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {/* Merge Action */}
                                        <div className="space-y-4">
                                            <textarea
                                                value={mergeNotes}
                                                onChange={(e) => setMergeNotes(e.target.value)}
                                                placeholder="併案說明 / 備註內容..."
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-200 font-bold text-slate-950 placeholder:text-slate-300 focus:border-blue-600 outline-none transition-all resize-none h-32"
                                            />
                                            <button
                                                onClick={handleMerge}
                                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                                            >
                                                <CheckCircle2 size={20} strokeWidth={3} />
                                                確認執行併案
                                            </button>
                                        </div>

                                        {/* Dismiss Action */}
                                        <div className="space-y-4">
                                            <textarea
                                                value={dismissReason}
                                                onChange={(e) => setDismissReason(e.target.value)}
                                                placeholder="排除原因 (必填專用)..."
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-200 font-bold text-slate-950 placeholder:text-slate-300 focus:border-slate-950 outline-none transition-all resize-none h-32"
                                            />
                                            <button
                                                onClick={handleDismiss}
                                                className="w-full py-4 bg-white border-2 border-slate-200 hover:border-slate-950 text-slate-950 font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
                                            >
                                                <XCircle size={20} strokeWidth={3} />
                                                標記為獨立案件
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto" onClick={() => setShowHistory(false)} />
                    <div className="bg-white w-full md:w-[800px] h-[80vh] pointer-events-auto md:rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500">
                        <div className="p-8 border-b-4 border-slate-950 flex items-center justify-between bg-[#fdfdfd]">
                            <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">併案日誌</h2>
                            <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <XCircle size={32} className="text-slate-950" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                            {mergeHistory.length === 0 ? (
                                <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">尚無併案歷史記錄</div>
                            ) : (
                                <div className="space-y-4">
                                    {mergeHistory.map((record) => (
                                        <div key={record.id} className="bg-white p-6 border-2 border-slate-100 hover:border-slate-950 transition-colors group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="font-mono text-lg font-bold text-slate-950">
                                                    {record.primaryCaseId} <span className="text-slate-300 mx-2">←</span> {record.duplicateCaseId}
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest ${record.status === 'approved' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                    {record.status === 'approved' ? '已併案' : '已排除'}
                                                </span>
                                            </div>
                                            {record.notes && (
                                                <div className="text-slate-600 font-medium mb-2 pl-4 border-l-2 border-slate-200 text-sm">
                                                    "{record.notes}"
                                                </div>
                                            )}
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <Clock size={12} />
                                                {new Date(record.reviewedAt!).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 案件詳情視圖組件 (Architectural Style)
function CaseDetailView({ caseData, highlightColor = "text-slate-950" }: { caseData: Case, highlightColor?: string }) {
    return (
        <div className="space-y-8">
            {/* ID & Title */}
            <div className="group/title">
                <Link to={`/admin/cases/${caseData.id}`} className="block">
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-400 mb-1 group-hover/title:text-slate-950 transition-colors">
                        {caseData.id}
                        <ExternalLink size={12} className="opacity-0 group-hover/title:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-2xl font-black text-slate-950 uppercase leading-tight tracking-tight group-hover/title:text-blue-600 transition-colors">
                        {caseData.title}
                    </div>
                </Link>
            </div>

            {/* Critical Data Points */}
            <div className="space-y-6">
                <DetailRow icon={MapPin} label="發生地點" value={caseData.location} highlightColor={highlightColor} />
                <DetailRow icon={Calendar} label="通報日期" value={caseData.date || new Date(caseData.createdAt).toLocaleDateString()} />
                <DetailRow icon={User} label="通報人" value={caseData.reporterName} />
                {caseData.reporterPhone && <DetailRow icon={Phone} label="聯絡電話" value={caseData.reporterPhone} />}

                {caseData.externalCaseId && (
                    <DetailRow icon={ExternalLink} label="外部參考編號" value={caseData.externalCaseId} isHighlight />
                )}
                {caseData.petChipId && (
                    <DetailRow icon={Smartphone} label="寵物晶片 ID" value={caseData.petChipId} isHighlight />
                )}
            </div>

            {/* Description */}
            <div className="pt-6 border-t border-slate-200">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">現場通報內容</div>
                <div className="text-base font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {caseData.description}
                </div>
            </div>

            {/* Photos */}
            {(caseData.photos?.length || 0) > 0 && (
                <div className="pt-6">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">事證照片</div>
                    <div className="grid grid-cols-3 gap-2">
                        {caseData.photos?.slice(0, 3).map((photo, i) => (
                            <div key={i} className="aspect-square bg-slate-100 overflow-hidden border border-slate-200">
                                <img src={photo} className="w-full h-full object-cover" alt="Evidence" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ icon: Icon, label, value, highlightColor = "text-slate-950", isHighlight = false }: any) {
    return (
        <div className="group">
            <div className="flex items-center gap-3 mb-1">
                <Icon size={14} className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-base font-black pl-7 ${isHighlight ? 'text-blue-600' : highlightColor}`}>
                {value}
            </div>
        </div>
    );
}
