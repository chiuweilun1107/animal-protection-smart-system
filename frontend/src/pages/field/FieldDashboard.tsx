import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, AlertCircle, Search, Layers, CheckCircle2, Navigation, LayoutList, LayoutGrid, Bug, FileText, Phone, Shield } from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Case } from '../../types/schema';
import { PageHeader } from '../../components/common/PageHeader';

const CATEGORIES = [
    { id: 'all', label: '全部任務', icon: Layers },
    { id: 'general', label: '一般案件', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { id: 'bee', label: '蜂案通報', icon: Bug, color: 'text-orange-600 bg-orange-50' },
    { id: '1999', label: '1999 專案', icon: Phone, color: 'text-rose-600 bg-rose-50' },
    { id: '1959', label: '1959 專線', icon: Shield, color: 'text-indigo-600 bg-indigo-50' },
];

export const FieldDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCat, setActiveCat] = useState('all');
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            const allCases = await mockApi.getCases();
            setTasks(allCases);
            setLoading(false);
        };
        fetchTasks();
    }, []);

    const getCategoryCount = (catId: string) => {
        if (catId === 'all') return tasks.length;
        if (catId === 'general') return tasks.filter(t => t.type === 'general').length;
        if (catId === 'bee') return tasks.filter(t => t.type === 'bee').length;
        if (catId === '1999') return tasks.filter(t => t.type === '1999').length;
        if (catId === '1959') return tasks.filter(t => t.type === '1959').length;
        return 0;
    };

    const filteredTasks = tasks.filter(task => {
        let matchesCat = false;
        if (activeCat === 'all') matchesCat = true;
        else matchesCat = task.type === activeCat;

        const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.id.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCat && matchesSearch;
    });

    const getDeadlineText = (dateStr: string) => {
        // Mock deadline logic: Task Date + 3 days
        const taskDate = new Date(dateStr);
        const deadline = new Date(taskDate);
        deadline.setDate(deadline.getDate() + 3);

        const today = new Date(); // Mock 'today' is handled by mockApi, but here we use system time or assume mock 'today'
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return '已逾期';
        return `期限剩餘 ${diffDays} 天`;
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-32 relative">
            {/* Digital Alchemy Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-slate-50/50 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(51 65 85) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <PageHeader
                    tag="行動任務指揮中心"
                    title="勤務執行"
                    subtitle="我的外勤任務"
                    description="整合性的外勤任務清單，提供即時案件分派資訊、現場導航與電子化三聯單作業。請確認任務優先順序並準時簽到。"
                >
                    <div className="w-full md:w-96 flex flex-col gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="搜尋案件編號、地點或標題..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold text-sm shadow-sm"
                            />
                        </div>
                    </div>
                </PageHeader>

                {/* Controls Row: Categories + View Toggle */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <div className="flex flex-wrap gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCat(cat.id)}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-black tracking-tight transition-all ${activeCat === cat.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.02]' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'}`}
                            >
                                <cat.icon size={16} className={activeCat === cat.id ? 'text-white' : ''} />
                                {cat.label}
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] ${activeCat === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {getCategoryCount(cat.id)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'card' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="卡片模式"
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            title="清單模式"
                        >
                            <LayoutList size={20} />
                        </button>
                    </div>
                </div>

                {/* Task Grid / List */}
                {loading ? (
                    <div className="py-20 text-center text-slate-400 font-bold animate-pulse">載入任務中...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="py-32 text-center opacity-20 animate-in zoom-in duration-500">
                        <Search size={80} className="mx-auto mb-6" />
                        <p className="text-2xl font-black">目前無相符的通報任務</p>
                    </div>
                ) : (
                    <div className={viewMode === 'card' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-4"}>
                        {filteredTasks.map((task, idx) => (
                            <div
                                key={task.id}
                                className={`group bg-white border border-slate-100 hover:border-blue-200 transition-all duration-300 ${viewMode === 'card'
                                    ? 'rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col justify-between min-h-[340px]'
                                    : 'rounded-[1.5rem] p-6 hover:shadow-lg hover:shadow-slate-200/30 flex items-center gap-6'
                                    }`}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* ---- Content Section ---- */}
                                <div className={viewMode === 'card' ? 'w-full' : 'flex-1 flex items-center justify-between gap-6'}>

                                    {/* Header: Icon & Date */}
                                    <div className={viewMode === 'card' ? "flex items-center justify-between mb-8" : "flex items-center gap-4 shrink-0 min-w-[200px]"}>
                                        <div className={`rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${viewMode === 'card' ? 'w-14 h-14' : 'w-12 h-12'
                                            } ${task.type === '1999' ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white' :
                                                task.type === '1959' ? 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white' :
                                                    task.type === 'bee' ? 'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' :
                                                        'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white'
                                            }`}>
                                            {task.type === '1999' ? <Phone size={viewMode === 'card' ? 28 : 24} /> :
                                                task.type === '1959' ? <Shield size={viewMode === 'card' ? 28 : 24} /> :
                                                    task.type === 'bee' ? <Bug size={viewMode === 'card' ? 28 : 24} /> :
                                                        <FileText size={viewMode === 'card' ? 28 : 24} />}
                                        </div>
                                        <div className="flex flex-col items-end lg:items-start">
                                            {viewMode === 'list' && (
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-slate-300">#{task.id}</span>
                                                    {task.priority === 'critical' && <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 text-[10px] font-black uppercase">緊急優先</span>}
                                                </div>
                                            )}
                                            <div className="text-sm font-black text-slate-300 uppercase tracking-widest">{task.date}</div>
                                        </div>
                                    </div>

                                    {/* Status & ID (Card Only Layout) */}
                                    {viewMode === 'card' && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${task.type === '1999' ? 'bg-rose-100 text-rose-700' :
                                                task.type === '1959' ? 'bg-indigo-100 text-indigo-700' :
                                                    task.type === 'bee' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {task.type === '1999' ? '1999 專案' :
                                                    task.type === '1959' ? '1959 專線' :
                                                        task.type === 'bee' ? '蜂案通報' : '一般案件'}
                                            </span>
                                            <span className="text-xs font-bold text-slate-300">#{task.id}</span>
                                            {task.status !== 'completed' && (
                                                <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-600 animate-pulse">
                                                    {getDeadlineText(task.date)}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Title & Location */}
                                    <div className={viewMode === 'list' ? "flex-1 min-w-0" : ""}>
                                        <h3 className={`${viewMode === 'card' ? 'text-2xl mb-4' : 'text-lg mb-2'} font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1`}>
                                            {task.title || '無標題案件'}
                                        </h3>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-start gap-2 text-slate-500 text-sm font-medium">
                                                <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
                                                <span className="line-clamp-1">{task.location}</span>
                                            </div>

                                            {/* Navigation Button for Card View */}
                                            {viewMode === 'card' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`, '_blank');
                                                    }}
                                                    className="shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                    title="開啟地圖導航"
                                                >
                                                    <Navigation size={14} fill="currentColor" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                {/* ---- Action Section ---- */}
                                <div className={viewMode === 'card' ? 'mt-8' : 'w-48 shrink-0 flex items-center gap-3 justify-end border-l border-slate-100 pl-6'}>
                                    {viewMode === 'list' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.location)}`, '_blank');
                                            }}
                                            className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                            title="導航"
                                        >
                                            <Navigation size={18} fill="currentColor" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => navigate(`/field/investigation/${task.id}`)}
                                        className={`rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${viewMode === 'card'
                                            ? 'w-full py-5'
                                            : 'flex-1 py-4'
                                            } ${task.status === 'completed'
                                                ? 'bg-slate-50 text-slate-200 cursor-not-allowed'
                                                : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:text-white hover:shadow-blue-600/30 active:scale-[0.98]'
                                            }`}
                                        disabled={task.status === 'completed'}
                                    >
                                        {viewMode === 'card' && (task.status === 'completed' ? <CheckCircle2 size={16} /> : <ChevronRight size={16} strokeWidth={3} />)}
                                        {task.status === 'completed' ? '已結案' : '啟動'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
