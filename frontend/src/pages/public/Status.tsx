import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search, MapPin, Clock, CheckCircle2, AlertCircle,
    ArrowLeft, Loader2, Calendar, FileText, Activity,
    Shield, Target, Zap, ChevronRight, Globe, Info,
    Navigation, Crosshair
} from 'lucide-react';

interface CaseStatus {
    id: string;
    type: string;
    status: 'pending' | 'processing' | 'resolved';
    createDate: string;
    location: string;
    description: string;
    timeline: {
        date: string;
        time: string;
        title: string;
        desc: string;
        done: boolean;
    }[];
}

export const Status: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [caseId, setCaseId] = useState(searchParams.get('id') || 'ANS-20231120001');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CaseStatus | null>(null);
    const [error, setError] = useState('');

    const mockFetchStatus = (id: string) => {
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (id.toUpperCase().startsWith('ANS-')) {
                setResult({
                    id: id.toUpperCase(),
                    type: 'Rescue Ops / Animal Prot.',
                    status: 'processing',
                    createDate: '2023-11-20 14:30',
                    location: '新北市板橋區四川路一段 157 巷口',
                    description: '發現受傷貓咪，左前肢骨折，需緊急救援。現場已由民眾初步固定。',
                    timeline: [
                        { date: '2023-11-20', time: '14:30', title: 'Intelligence Intake', desc: '案件受理：系統已接收您的通報資料，案號已生成並鏈接至地理資訊中心。', done: true },
                        { date: '2023-11-20', time: '14:45', title: 'Data Verification', desc: '初步審核：中心人員已審核資料內容，確認為緊急優先案件。', done: true },
                        { date: '2023-11-20', time: '15:10', title: 'Unit Deployment', desc: '單位派勤：已指派最近之板橋區勤務小組前往，部署車號: ADC-8899。', done: true },
                        { date: '2023-11-20', time: '15:40', title: 'Field Operation', desc: '現場處置：勤務人員已抵達現場進行初步檢查與包紮處置。', done: true },
                        { date: 'Today', time: 'In Progress', title: 'Medical Transfer', desc: '醫療運送：動物正運送往合作之醫療機構進行近一步診治。', done: false },
                        { date: '-', time: '-', title: 'Mission Complete', desc: '完成處置後將更新最終結案報告。', done: false }
                    ]
                });
            } else {
                setError('Authentication failed. Case ID not found in system registers.');
                setResult(null);
            }
            setLoading(false);
        }, 1200);
    };

    useEffect(() => {
        if (searchParams.get('id')) {
            mockFetchStatus(searchParams.get('id')!);
        } else if (caseId === 'ANS-20231120001') {
            mockFetchStatus(caseId); // Auto-load demo on enter if ID matches default
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-40 overflow-hidden">
            {/* Background Layer */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-slate-900 pointer-events-none rounded-b-[5rem] overflow-hidden transition-all duration-1000">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-transparent"></div>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 pt-32 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header Command Area */}
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="max-w-2xl">
                            <Link to="/" className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all mb-10">
                                <ArrowLeft size={16} /> Global Portal
                            </Link>
                            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] uppercase">
                                Mission<br />
                                <span className="text-indigo-400">Tracking Center</span>
                            </h1>
                        </div>

                        <div className="w-full lg:w-[480px]">
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-2 pr-2 rounded-[2.5rem] flex items-center shadow-2xl">
                                <div className="relative flex-1 group pl-4">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={caseId}
                                        onChange={(e) => setCaseId(e.target.value)}
                                        placeholder="Enter Intelligence ID..."
                                        className="w-full pl-16 pr-6 py-5 bg-transparent text-white font-black text-xl tracking-tight outline-none placeholder:text-slate-600"
                                    />
                                </div>
                                <button
                                    onClick={() => mockFetchStatus(caseId)}
                                    disabled={!caseId || loading}
                                    className="p-6 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-500 transition-all flex items-center justify-center shadow-xl shadow-indigo-600/30 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Target size={24} />}
                                </button>
                            </div>
                            {error && <p className="mt-6 text-rose-500 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ml-6 text-sm"><AlertCircle size={16} /> {error}</p>}
                        </div>
                    </div>

                    {!result && !loading && !error && (
                        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-200 rounded-[4rem] animate-in fade-in duration-1000">
                            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-8">
                                <FileText size={48} />
                            </div>
                            <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Awaiting Identification Input</p>
                        </div>
                    )}

                    {result && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-20 duration-1000">
                            {/* Mission Intelligence Overlay */}
                            <div className="lg:col-span-12">
                                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left border-r-0 md:border-r border-slate-100 pr-0 md:pr-16 md:min-w-[300px]">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-indigo-100 shadow-sm">
                                            <Activity size={14} className="animate-pulse" /> Live Status Node
                                        </div>
                                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 mb-2 uppercase leading-none">{result.id}</h2>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 pl-1">Global Incident Identifier</div>

                                        <div className={`px-10 py-6 rounded-3xl font-black text-3xl tracking-tighter uppercase shadow-xl ${result.status === 'processing' ? 'bg-indigo-600 text-white shadow-indigo-600/30' : 'bg-slate-900 text-white'}`}>
                                            {result.status === 'processing' ? 'Active Mission' : result.status === 'resolved' ? 'Archived' : 'In Queue'}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-10 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Navigation size={12} className="text-indigo-600" /> Geospatial Node
                                                </p>
                                                <p className="text-xl font-black text-slate-900 leading-tight">{result.location}</p>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock size={12} className="text-indigo-600" /> Intake Cycle
                                                </p>
                                                <p className="text-xl font-black text-slate-900">{result.createDate}</p>
                                            </div>
                                        </div>
                                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group overflow-hidden transition-all hover:bg-white hover:border-indigo-100 cursor-default">
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Situational Intelligence</p>
                                                <p className="text-lg font-medium text-slate-600 leading-relaxed italic">{result.description}</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </div>

                                    {/* Decorative Element */}
                                    <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -mr-20 pointer-events-none transform skew-x-12 border-l border-slate-100"></div>
                                </div>
                            </div>

                            {/* Mission Timeline - Full Width */}
                            <div className="lg:col-span-12">
                                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-10 md:p-20 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-20 relative z-10">
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.5em] flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
                                                <Clock size={20} />
                                            </div>
                                            Mission Chronology
                                        </h3>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updates every 15m</div>
                                    </div>

                                    <div className="space-y-0 relative z-10">
                                        {result.timeline.map((item, idx) => (
                                            <div key={idx} className="relative pl-16 md:pl-24 pb-20 last:pb-0 group">
                                                {/* Vertical Connector */}
                                                {idx !== result.timeline.length - 1 && (
                                                    <div className={`absolute left-5 md:left-[27px] top-6 w-[2px] h-full ${item.done ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
                                                )}

                                                {/* Node Indicator */}
                                                <div className={`absolute left-0 md:left-[10px] top-1 w-[36px] h-[36px] rounded-2xl border-2 flex items-center justify-center transition-all bg-white z-10 ${item.done ? 'border-indigo-600 shadow-lg shadow-indigo-600/20' : 'border-slate-100'}`}>
                                                    {item.done ? (
                                                        <div className="w-5 h-5 bg-indigo-600 rounded-lg flex items-center justify-center text-white scale-110">
                                                            <CheckCircle2 size={12} />
                                                        </div>
                                                    ) : (
                                                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-20">
                                                    <div className="md:w-40 py-1">
                                                        <div className={`text-sm font-black tracking-widest uppercase ${item.done ? 'text-slate-900' : 'text-slate-300'}`}>{item.date}</div>
                                                        <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.done ? 'text-indigo-400' : 'text-slate-200'}`}>{item.time}</div>
                                                    </div>
                                                    <div className="flex-1 bg-slate-50/50 p-8 rounded-[2rem] border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all">
                                                        <h4 className={`text-xl font-black tracking-tight mb-3 uppercase ${item.done ? 'text-slate-900' : 'text-slate-300'}`}>{item.title}</h4>
                                                        <p className={`text-lg font-medium leading-relaxed max-w-2x ${item.done ? 'text-slate-500' : 'text-slate-200'}`}>{item.desc}</p>
                                                    </div>
                                                    {item.done && (
                                                        <div className="hidden lg:flex shrink-0 mt-8">
                                                            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] bg-indigo-50 px-6 py-2 rounded-full border border-indigo-100">
                                                                <CheckCircle2 size={14} /> Node Verified
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Visual Backdrop */}
                                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] -mr-40 -mb-40 rounded-full"></div>
                                </div>
                            </div>

                            <div className="lg:col-span-12">
                                <Link to="/" className="w-full py-8 bg-white border border-slate-100 rounded-[3rem] text-slate-400 font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200/20 flex items-center justify-center gap-4">
                                    <ArrowLeft size={20} /> Exit Intelligence Tracking
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tactical Grid Decoration */}
            <div className="fixed bottom-10 right-10 z-[100] hidden md:flex flex-col gap-4">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-2xl flex items-center justify-center text-slate-200 border border-slate-50">
                    <Globe size={24} />
                </div>
                <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] shadow-2xl flex items-center justify-center text-indigo-500 border border-slate-900">
                    <Crosshair size={24} />
                </div>
            </div>
        </div>
    );
};
