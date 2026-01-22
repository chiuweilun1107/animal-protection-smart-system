import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Search, User, FileText, Smartphone, Lock } from 'lucide-react';
import { Captcha } from '../../components/common/Captcha';

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

    // Tab State
    const [activeTab, setActiveTab] = useState<'case' | 'identity'>('case');

    // Case Query Input
    const [caseId, setCaseId] = useState(searchParams.get('id') || 'ANS-20231120001');
    const [caseCaptchaValid, setCaseCaptchaValid] = useState(false);

    // Identity Query Input
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [identityCaptchaValid, setIdentityCaptchaValid] = useState(false);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CaseStatus | null>(null);
    const [error, setError] = useState('');

    const mockFetchStatus = (input: string, type: 'case' | 'identity') => {
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (type === 'case') {
                if (input.toUpperCase().startsWith('ANS-')) {
                    // Check if this is a newly submitted case
                    const isNewCase = input.toUpperCase() === 'ANS-20231120001';

                    setResult({
                        id: input.toUpperCase(),
                        type: '救援行動 / 動物保護',
                        status: isNewCase ? 'pending' : 'processing',
                        createDate: new Date().toLocaleString('zh-TW', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        location: '新北市板橋區四川路一段 157 巷口',
                        description: '發現受傷貓咪，左前肢骨折，需緊急救援。現場已由民眾初步固定。',
                        timeline: isNewCase ? [
                            {
                                date: new Date().toLocaleDateString('zh-TW'),
                                time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
                                title: '案件受理',
                                desc: '案件受理：系統已接收您的通報資料，案號已生成並鏈接至地理資訊中心。',
                                done: true
                            },
                            { date: '-', time: '-', title: '資料審核', desc: '等待中心人員審核資料內容並確認案件優先級。', done: false },
                            { date: '-', time: '-', title: '單位派勤', desc: '審核完成後將指派最近之勤務小組前往處理。', done: false },
                            { date: '-', time: '-', title: '現場處置', desc: '勤務人員將抵達現場進行處置。', done: false },
                            { date: '-', time: '-', title: '任務完成', desc: '完成處置後將更新最終結案報告。', done: false }
                        ] : [
                            { date: '2023-11-20', time: '14:30', title: '案件受理', desc: '案件受理：系統已接收您的通報資料，案號已生成並鏈接至地理資訊中心。', done: true },
                            { date: '2023-11-20', time: '14:45', title: '資料審核', desc: '初步審核：中心人員已審核資料內容，確認為緊急優先案件。', done: true },
                            { date: '2023-11-20', time: '15:10', title: '單位派勤', desc: '單位派勤：已指派最近之板橋區勤務小組前往，部署車號: ADC-8899。', done: true },
                            { date: '2023-11-20', time: '15:40', title: '現場處置', desc: '現場處置：勤務人員已抵達現場進行初步檢查與包紮處置。', done: true },
                            { date: '當前階段', time: '執行中', title: '醫療運送', desc: '醫療運送：動物正運送往合作之醫療機構進行近一步診治。', done: false },
                            { date: '-', time: '-', title: '任務完成', desc: '完成處置後將更新最終結案報告。', done: false }
                        ]
                    });
                } else {
                    setError('查無此案件編號，請確認輸入是否正確。');
                    setResult(null);
                }
            } else {
                // Identity Mock
                if (mobile.length >= 10 && password.length > 0) {
                    setResult({
                        id: 'ANS-20231120008',
                        type: '一般救援 (歷史查詢)',
                        status: 'resolved',
                        createDate: '2023/11/18 09:30',
                        location: '新北市三重區重新路五段',
                        description: '民眾通報流浪犬受困於水溝蓋縫隙。',
                        timeline: [
                            { date: '2023-11-18', time: '09:30', title: '案件受理', desc: '案件受理：系統已接收您的通報資料。', done: true },
                            { date: '2023-11-18', time: '11:00', title: '任務完成', desc: '現場人員回報：已成功將犬隻救出並安置。', done: true }
                        ]
                    });
                } else {
                    setError('登入失敗：手機號碼或查詢密碼錯誤。');
                    setResult(null);
                }
            }
            setLoading(false);
        }, 1200);
    };

    useEffect(() => {
        if (searchParams.get('id')) {
            const id = searchParams.get('id')!;
            setCaseId(id);
            // If coming from link, we might skip captcha in a real app or force it. 
            // For this user flow, let's assume valid if ID is passed
            mockFetchStatus(id, 'case');
        } else if (caseId === 'ANS-20231120001' && activeTab === 'case') {
            // Optional: Don't auto-fetch to show captcha first
            // mockFetchStatus(caseId, 'case'); 
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 pb-40">
            <div className="max-w-7xl mx-auto px-6">
                <PageHeader
                    tag="案件追蹤系統"
                    title="案件進度"
                    subtitle="查詢中心"
                    description="身為守護者的一部分，我們對透明度的承諾同樣堅實。您可以透過通報後取得的案號，在此隨時追蹤案件處理狀態與最新進度。"
                >
                    <div className="w-full lg:w-[480px]">
                        {/* Query Type Tabs */}
                        <div className="flex p-1 bg-slate-200 rounded-2xl mb-6">
                            <button
                                onClick={() => setActiveTab('case')}
                                className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'case' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <FileText size={16} /> 案件編號
                            </button>
                            <button
                                onClick={() => setActiveTab('identity')}
                                className={`flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'identity' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <User size={16} /> 身分查詢
                            </button>
                        </div>

                        <div className="bg-white border-2 border-slate-200 p-6 rounded-[2.5rem] shadow-xl">
                            {activeTab === 'case' ? (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Search size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={caseId}
                                            onChange={(e) => setCaseId(e.target.value)}
                                            placeholder="輸入案件編號..."
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-lg tracking-tight outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <Captcha onVerify={setCaseCaptchaValid} />
                                    <button
                                        onClick={() => mockFetchStatus(caseId, 'case')}
                                        disabled={!caseId || loading || !caseCaptchaValid}
                                        className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? '查詢中...' : '開始查詢'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Smartphone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            placeholder="通報時的手機號碼"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-lg tracking-tight outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="查詢密碼 (預設身分證後4碼)"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-lg tracking-tight outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    <Captcha onVerify={setIdentityCaptchaValid} />
                                    <button
                                        onClick={() => mockFetchStatus(mobile, 'identity')}
                                        disabled={!mobile || !password || loading || !identityCaptchaValid}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? '驗證中...' : '登入查詢'}
                                    </button>
                                </div>
                            )}
                        </div>
                        {error && <p className="mt-6 text-rose-500 font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ml-6 text-sm bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">{error}</p>}
                    </div>
                </PageHeader>

                {!result && !loading && !error && (
                    <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-200 rounded-[4rem] animate-in fade-in duration-1000">
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">等待案件編號輸入</p>
                    </div>
                )}

                {result && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-20 duration-1000">
                        {/* Mission Intelligence Overlay */}
                        <div className="lg:col-span-12">
                            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left border-r-0 md:border-r border-slate-100 pr-0 md:pr-16 md:min-w-[300px]">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-base font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
                                        LIVE STATUS
                                    </div>
                                    <h2 className="text-6xl font-black tracking-tighter text-slate-900 mb-2 uppercase leading-none">{result.id}</h2>
                                    <div className="text-base font-black text-slate-400 uppercase tracking-[0.4em] mb-10 pl-1">CASE IDENTIFIER</div>

                                    <div className={`px-10 py-6 rounded-3xl font-black text-3xl tracking-tighter uppercase shadow-xl ${result.status === 'processing' ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-900 text-white'}`}>
                                        {result.status === 'processing' ? '執行中任務' : result.status === 'resolved' ? '已結案' : '待處理'}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-10 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-3">
                                            <p className="text-base font-black text-slate-400 uppercase tracking-widest">地理位置</p>
                                            <p className="text-xl font-black text-slate-900 leading-tight">{result.location}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-base font-black text-slate-400 uppercase tracking-widest">通報時間</p>
                                            <p className="text-xl font-black text-slate-900">{result.createDate}</p>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group overflow-hidden transition-all hover:bg-white hover:border-blue-100 cursor-default">
                                        <div className="relative z-10">
                                            <p className="text-base font-black text-slate-400 uppercase tracking-widest mb-4">情況摘要</p>
                                            <p className="text-lg font-medium text-slate-600 leading-relaxed italic">{result.description}</p>
                                        </div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                                        歷程紀錄
                                    </h3>
                                    <div className="text-base font-black text-slate-400 uppercase tracking-widest">REAL-TIME UPDATES</div>
                                </div>

                                <div className="space-y-0 relative z-10">
                                    {result.timeline.map((item, idx) => (
                                        <div key={idx} className="relative pl-16 md:pl-24 pb-20 last:pb-0 group">
                                            {/* Vertical Connector */}
                                            {idx !== result.timeline.length - 1 && (
                                                <div className={`absolute left-5 md:left-[27px] top-6 w-[2px] h-full ${item.done ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                                            )}

                                            {/* Node Indicator */}
                                            <div className={`absolute left-0 md:left-[10px] top-1 w-[36px] h-[36px] rounded-2xl border-2 flex items-center justify-center transition-all bg-white z-10 ${item.done ? 'border-blue-600 shadow-lg shadow-blue-600/20' : 'border-slate-100'}`}>
                                                {item.done ? (
                                                    <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-white scale-110">
                                                        DONE
                                                    </div>
                                                ) : (
                                                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                                                )}
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-20">
                                                <div className="md:w-40 py-1">
                                                    <div className={`text-sm font-black tracking-widest uppercase ${item.done ? 'text-slate-900' : 'text-slate-300'}`}>{item.date}</div>
                                                    <div className={`text-base font-black uppercase tracking-widest mt-1 ${item.done ? 'text-blue-400' : 'text-slate-200'}`}>{item.time}</div>
                                                </div>
                                                <div className="flex-1 bg-slate-50/50 p-8 rounded-[2rem] border border-transparent group-hover:border-slate-100 group-hover:bg-white transition-all">
                                                    <h4 className={`text-xl font-black tracking-tight mb-3 uppercase ${item.done ? 'text-slate-900' : 'text-slate-300'}`}>{item.title}</h4>
                                                    <p className={`text-lg font-medium leading-relaxed max-w-2x ${item.done ? 'text-slate-500' : 'text-slate-200'}`}>{item.desc}</p>
                                                </div>
                                                {item.done && (
                                                    <div className="hidden lg:flex shrink-0 mt-8">
                                                        <div className="flex items-center gap-2 text-blue-600 font-black text-base uppercase tracking-[0.3em] bg-blue-50 px-6 py-2 rounded-full border border-blue-100">
                                                            VERIFIED
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Visual Backdrop */}
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] -mr-40 -mb-40 rounded-full"></div>
                            </div>
                        </div>

                        <div className="lg:col-span-12">
                            <Link to="/" className="w-full py-8 bg-white border border-slate-100 rounded-[3rem] text-slate-400 font-black text-base uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-slate-200/20 flex items-center justify-center gap-4">
                                EXIT SYSTEM
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
