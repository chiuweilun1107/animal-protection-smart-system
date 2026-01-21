import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapPin, Camera, AlertTriangle, Bug, Phone, User, CheckCircle2 } from 'lucide-react';

export const ReportHazard: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialTarget = searchParams.get('target') as 'bee' | 'snake' | null;

    const [target, setTarget] = useState<'bee' | 'snake' | null>(initialTarget);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [address, setAddress] = useState('新北市 - 板橋區');
    const [locationDetail, setLocationDetail] = useState('');

    // Bee Specific
    const [hivePosition, setHivePosition] = useState('');
    const [hiveSize, setHiveSize] = useState('');

    // Snake Specific
    const [snakeLocation, setSnakeLocation] = useState('');
    const [snakeStatus, setSnakeStatus] = useState('');

    useEffect(() => {
        if (initialTarget) setTarget(initialTarget);
    }, [initialTarget]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const notification = {
            id: `HAZ-${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`,
            type: target === 'bee' ? '蜂害移除' : '蛇類捕捉',
            location: address,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('newCaseNotification', JSON.stringify(notification));

        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/report/success', { state: { caseId: notification.id } });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-40 overflow-hidden relative">
            {/* Layered Background */}
            <div className="fixed inset-0 bg-gradient-to-b from-orange-50/30 via-transparent to-slate-50/50 pointer-events-none"></div>
            <div className="fixed inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(51 65 85) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            {/* Ambient Light Effects */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none bg-orange-400/5"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-slate-400/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 px-6 pt-32 md:pt-40">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border bg-orange-50 text-orange-600 border-orange-100">
                                HAZARD REMOVAL
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase mb-6">
                                蜂蛇移除<br />
                                <span className="text-orange-500">勤務通報</span>
                            </h1>
                            <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed border-l-4 pl-6 border-slate-200">
                                此專區提供具危險性之蜂巢、蛇類入侵通報。請保持安全距離，切勿驚擾或嘗試自行處理。
                            </p>
                        </div>
                    </div>

                    {/* Step 1: Target Selection (if not pre-selected) */}
                    {!target && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-20">
                            <button
                                onClick={() => setTarget('bee')}
                                className="group relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:border-orange-400 transition-all text-left overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                        <Bug size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">蜂害通報</h3>
                                    <p className="text-slate-500 font-medium">發現蜂巢、大量群舞或攻擊性蜂類。</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setTarget('snake')}
                                className="group relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:border-emerald-400 transition-all text-left overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8c.5 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .5 1 1 1z" /><path d="M9.5 13c1.5 1.5 3.5 1.5 5 0" /></svg>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">蛇類捕捉</h3>
                                    <p className="text-slate-500 font-medium">發現蛇類出沒於住家或公共區域。</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Step 2: Form */}
                    {target && (
                        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-20">

                            {/* Alert Banner for Safety */}
                            <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-orange-900 mb-2">請務必保持安全距離</h3>
                                    <p className="text-orange-700/80 font-medium">
                                        {target === 'bee'
                                            ? '發現蜂巢時請勿喧嘩或投擲物品。若遭蜂群攻擊，請用衣物護住頭部，迅速離開現場。'
                                            : '發現蛇類時請保持冷靜，注視其動向但不要逼近。大多數蛇類不會主動攻擊人。'}
                                    </p>
                                </div>
                                <button type="button" onClick={() => setTarget(null)} className="ml-auto text-xs font-bold text-orange-400 hover:text-orange-600 underline">
                                    重新選擇類別
                                </button>
                            </div>

                            {/* Section: Location */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 md:p-12">
                                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm">01</div>
                                    發生地點
                                </h3>
                                <div className="space-y-6">
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-none font-bold text-lg text-slate-900 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300 transition-all"
                                            placeholder="請輸入地址或點擊定位"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={locationDetail}
                                        onChange={(e) => setLocationDetail(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-900 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300 transition-all"
                                        placeholder="詳細位置描述 (例如: 後陽台洗衣機下方、公園涼亭頂端)"
                                    />
                                </div>
                            </div>

                            {/* Section: Hazard Details */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 md:p-12">
                                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm">02</div>
                                    {target === 'bee' ? '蜂巢資訊' : '蛇隻資訊'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {target === 'bee' ? (
                                        <>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">位置高度</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['2公尺以下', '2-6公尺', '6公尺以上', '無法確認'].map(opt => (
                                                        <button
                                                            type="button"
                                                            key={opt}
                                                            onClick={() => setHivePosition(opt)}
                                                            className={`p-4 rounded-2xl font-bold text-sm transition-all ${hivePosition === opt ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">蜂巢大小</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['拳頭大小', '籃球大小', '大於籃球', '僅見蜂群'].map(opt => (
                                                        <button
                                                            type="button"
                                                            key={opt}
                                                            onClick={() => setHiveSize(opt)}
                                                            className={`p-4 rounded-2xl font-bold text-sm transition-all ${hiveSize === opt ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">發現區域</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['屋內/室內', '庭院/陽台', '戶外公共區', '車內/其他'].map(opt => (
                                                        <button
                                                            type="button"
                                                            key={opt}
                                                            onClick={() => setSnakeLocation(opt)}
                                                            className={`p-4 rounded-2xl font-bold text-sm transition-all ${snakeLocation === opt ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">目前狀態</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['盤據不動', '緩慢移動', '快速逃竄', '已受困'].map(opt => (
                                                        <button
                                                            type="button"
                                                            key={opt}
                                                            onClick={() => setSnakeStatus(opt)}
                                                            className={`p-4 rounded-2xl font-bold text-sm transition-all ${snakeStatus === opt ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Section: Contact */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 md:p-12">
                                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm">03</div>
                                    聯絡資訊
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input type="text" placeholder="聯絡人姓名" className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-none font-bold text-lg text-slate-900 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300 transition-all" />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input type="tel" placeholder="聯絡電話" className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border-none font-bold text-lg text-slate-900 focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-300 transition-all" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${isSubmitting ? 'bg-slate-100 text-slate-400 cursor-wait' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30'
                                    }`}
                            >
                                {isSubmitting ? '處理中...' : '確認通報'}
                                {!isSubmitting && <CheckCircle2 />}
                            </button>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
