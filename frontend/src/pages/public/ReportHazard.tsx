import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Bug, Phone, User, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ReportHazard: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialTarget = searchParams.get('target') as 'bee' | 'snake' | null;

    const [target, setTarget] = useState<'bee' | 'snake' | null>(initialTarget);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State (Sync with Report.tsx style)
    const [region, setRegion] = useState('新北市 - 板橋區');
    const [address, setAddress] = useState('四川路一段 157 巷口 7-11 前');
    const [locationDetail, setLocationDetail] = useState('');
    const [contactName, setContactName] = useState('王小明');
    const [phone, setPhone] = useState('0912-345-678');

    // Detection State
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionSuccess, setDetectionSuccess] = useState(false);
    const [detectedLocation, setDetectedLocation] = useState<string>('');
    const [hasImage, setHasImage] = useState(true);

    // Hazard Specific Data
    const [hivePosition, setHivePosition] = useState('2-6公尺');
    const [hiveSize, setHiveSize] = useState('籃球大小');
    const [snakeLocation, setSnakeLocation] = useState('庭院/陽台');
    const [snakeStatus, setSnakeStatus] = useState('盤據不動');

    useEffect(() => {
        if (initialTarget) setTarget(initialTarget);
    }, [initialTarget]);

    const handleGeoDetect = async () => {
        setIsDetecting(true);
        setDetectionSuccess(false);
        setDetectedLocation('');

        setTimeout(() => {
            const mockLocations = [
                { region: '新北市 - 板橋區', address: '四川路一段 157 巷口 7-11 前' },
                { region: '新北市 - 板橋區', address: '縣民大道二段 7 號附近' },
            ];
            const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

            setRegion(randomLocation.region);
            setAddress(randomLocation.address);
            setDetectedLocation(`${randomLocation.region} ${randomLocation.address}`);
            setIsDetecting(false);
            setDetectionSuccess(true);
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const notification = {
            id: `HAZ-${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`,
            type: target === 'bee' ? '蜂害移除' : '蛇類捕捉',
            location: `${region} ${address}`,
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
            <div className={`fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${target === 'snake' ? 'bg-emerald-400/5' : 'bg-orange-400/5'}`}></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-slate-400/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 px-6 pt-32 md:pt-40">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border ${target === 'snake' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                HAZARD REMOVAL
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase mb-6">
                                {target === 'bee' ? '蜂害移除' : target === 'snake' ? '蛇類捕捉' : '蜂蛇移除'}<br />
                                <span className={target === 'snake' ? 'text-emerald-500' : 'text-orange-500'}>勤務通報</span>
                            </h1>
                            <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed border-l-4 pl-6 border-slate-200">
                                此專區提供具危險性之蜂巢、蛇類入侵通報。請保持安全距離，切勿驚擾或嘗試自行處理。
                            </p>
                        </div>
                    </div>

                    {!target && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-20">
                            <button onClick={() => setTarget('bee')} className="group relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:border-orange-400 transition-all text-left overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6"><Bug size={32} /></div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">蜂害通報</h3>
                                    <p className="text-slate-500 font-medium">發現蜂巢、大量群舞或攻擊性蜂類。</p>
                                </div>
                            </button>
                            <button onClick={() => setTarget('snake')} className="group relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:border-emerald-400 transition-all text-left overflow-hidden">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M12 8c.5 0 1-.5 1-1S.5-1 1-1-1 .5-1 1 .5 1 1 1z" /><path d="M9.5 13c1.5 1.5 3.5 1.5 5 0" /></svg>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">蛇類捕捉</h3>
                                    <p className="text-slate-500 font-medium">發現蛇類出沒於住家或公共區域。</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {target && (
                        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">

                            {/* Safety Banner */}
                            <div className={`border rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start ${target === 'snake' ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse ${target === 'snake' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-lg font-black mb-2 ${target === 'snake' ? 'text-emerald-900' : 'text-orange-900'}`}>安全作業提示</h3>
                                    <p className={`font-medium ${target === 'snake' ? 'text-emerald-700/80' : 'text-orange-700/80'}`}>
                                        {target === 'bee'
                                            ? '發現蜂巢時請勿喧嘩或投擲物品。若遭蜂群攻擊，請用衣物護住頭部，迅速離開現場。'
                                            : '發現蛇類時請保持冷靜，注視其動向但不要逼近。大多數蛇類不會主動攻擊人。'}
                                    </p>
                                </div>
                                <button type="button" onClick={() => setTarget(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600 underline">
                                    重新選擇類別
                                </button>
                            </div>

                            {/* Section 01: Location Detection (Matching Report.tsx) */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
                                <div className="p-10 md:p-16">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                                        <div className="flex items-center gap-6">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">01</div>
                                            <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">地理座標數據</h2>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleGeoDetect}
                                            disabled={isDetecting}
                                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isDetecting
                                                ? 'bg-blue-500 text-white cursor-wait'
                                                : detectionSuccess
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'
                                                }`}
                                        >
                                            {isDetecting ? '定位中...' : detectionSuccess ? '重新定位' : '定址偵測'}
                                        </button>
                                    </div>

                                    {detectionSuccess && detectedLocation && (
                                        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-top-2 flex items-start gap-3">
                                            <MapPin className="text-emerald-600 mt-0.5" size={20} />
                                            <div>
                                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">偵測到的位置</div>
                                                <div className="text-sm font-bold text-slate-900">{detectedLocation}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">通報區域</label>
                                            <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-orange-500/10 outline-none transition-all">
                                                <option>新北市 - 板橋區</option>
                                                <option>新北市 - 新莊區</option>
                                                <option>新北市 - 中和區</option>
                                                <option>新北市 - 永和區</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">精確地址</label>
                                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="mt-8 space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">詳細位置描述</label>
                                        <input type="text" value={locationDetail} onChange={(e) => setLocationDetail(e.target.value)} placeholder="例如: 後陽台洗衣機下方、公園涼亭頂端" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-orange-500/10 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 02: Case Details Summary */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
                                <div className="p-10 md:p-16">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">02</div>
                                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">案件詳情簡述</h2>
                                    </div>

                                    {/* Target Specific Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                                        {target === 'bee' ? (
                                            <>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">位置高度</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {['2公尺以下', '2-6公尺', '6公尺以上', '無法確認'].map(opt => (
                                                            <button type="button" key={opt} onClick={() => setHivePosition(opt)} className={`p-4 rounded-2xl font-bold text-sm transition-all ${hivePosition === opt ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{opt}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">蜂巢大小</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {['拳頭大小', '籃球大小', '大於籃球', '僅見蜂群'].map(opt => (
                                                            <button type="button" key={opt} onClick={() => setHiveSize(opt)} className={`p-4 rounded-2xl font-bold text-sm transition-all ${hiveSize === opt ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{opt}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">發現區域</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {['屋內/室內', '庭院/陽台', '戶外公共區', '車內/其他'].map(opt => (
                                                            <button type="button" key={opt} onClick={() => setSnakeLocation(opt)} className={`p-4 rounded-2xl font-bold text-sm transition-all ${snakeLocation === opt ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{opt}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">目前狀態</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {['盤據不動', '緩慢移動', '快速逃竄', '已受困'].map(opt => (
                                                            <button type="button" key={opt} onClick={() => setSnakeStatus(opt)} className={`p-4 rounded-2xl font-bold text-sm transition-all ${snakeStatus === opt ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{opt}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Contact Info Integrated */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-50">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">報案人姓名</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className={`w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none transition-all focus:ring-4 ${target === 'snake' ? 'focus:ring-emerald-500/10' : 'focus:ring-orange-500/10'}`} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">手機聯絡電話</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none transition-all focus:ring-4 ${target === 'snake' ? 'focus:ring-emerald-500/10' : 'focus:ring-orange-500/10'}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Section 03: Visual Evidence (Matching Screenshot) */}
                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
                                <div className="p-10 md:p-16">
                                    <div className="flex items-center justify-between mb-16">
                                        <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">03</div>
                                            視覺影像上傳
                                        </h2>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">ENCRYPTED CHANNEL</span>
                                    </div>

                                    {hasImage ? (
                                        <div className="relative w-full h-80 rounded-[2.5rem] overflow-hidden group/image cursor-pointer">
                                            <img
                                                src={target === 'bee' ? '/report_bee_demo.png' : target === 'snake' ? '/report_snake_demo.png' : '/report_evidence_demo.png'}
                                                alt="Evidence"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <button type="button" onClick={() => setHasImage(false)} className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-red-500/80 transition-all border border-white/30">REMOVE</button>
                                                <div className="px-6 py-3 bg-white rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest">CHANGE PHOTO</div>
                                            </div>
                                            <div className="absolute top-6 right-6 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">UPLOADED</div>
                                        </div>
                                    ) : (
                                        <div onClick={() => setHasImage(true)} className="border-4 border-dashed border-slate-50 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-6 hover:bg-slate-50/50 transition-all group/upload cursor-pointer">
                                            <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover/upload:bg-orange-600 group-hover/upload:text-white transition-all duration-500 font-black text-2xl">+</div>
                                            <div className="text-center">
                                                <p className="font-black text-slate-900 uppercase tracking-tight">點擊或拖放照片</p>
                                                <p className="text-slate-400 text-xs mt-1 font-medium">支援 JPG, PNG 格式，辨識物種能顯著提升派遣效率</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>



                            {/* Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                                <Link to="/smart-guide" className="w-full py-8 rounded-[2.5rem] bg-white border border-slate-100 font-black text-xl uppercase tracking-[0.3em] text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all">STEP BACK</Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`md:col-span-2 w-full py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] text-white shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 ${isSubmitting ? 'bg-slate-300 cursor-not-allowed' : target === 'snake' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                                        }`}
                                >
                                    {isSubmitting ? '正在提交...' : '發送正式通報單'}
                                    {!isSubmitting && <CheckCircle2 />}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
