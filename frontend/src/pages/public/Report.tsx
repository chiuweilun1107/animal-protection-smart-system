import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export const Report: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isBee = searchParams.get('type') === 'bee';
    const isEmergency = searchParams.get('emergency') === 'true';

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-filled Form Data
    const [region, setRegion] = useState('新北市 - 板橋區');
    const [address, setAddress] = useState('四川路一段 157 巷口 7-11 前');
    const [description, setDescription] = useState('發現一隻橘色浪貓，左前腳似乎受傷跛行，但在路邊坐著不動，希望能派員協助救援。');
    const [contactName, setContactName] = useState('王小明');
    const [phone, setPhone] = useState('0912-345-678');
    const [hasImage, setHasImage] = useState(true);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionSuccess, setDetectionSuccess] = useState(false);
    const [detectedLocation, setDetectedLocation] = useState<string>('');

    const handleGeoDetect = async () => {
        setIsDetecting(true);
        setDetectionSuccess(false);
        setDetectedLocation('');

        // Mock geolocation detection (simulating GPS + Geocoding)
        setTimeout(() => {
            // Mock detected location data
            const mockLocations = [
                { region: '新北市 - 板橋區', address: '四川路一段 157 巷口 7-11 前' },
                { region: '新北市 - 板橋區', address: '縣民大道二段 7 號附近' },
                { region: '新北市 - 新莊區', address: '中正路 516 號前' },
                { region: '新北市 - 板橋區', address: '文化路一段 188 巷 5 弄口' },
            ];
            const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

            setRegion(randomLocation.region);
            setAddress(randomLocation.address);
            setDetectedLocation(`${randomLocation.region} ${randomLocation.address}`);
            setIsDetecting(false);
            setDetectionSuccess(true);

            // Keep success state visible (don't auto-hide)
        }, 1500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Store notification for map page
        const notification = {
            id: 'ANS-20231120001',
            type: isBee ? '捕蜂抓蛇' : '一般救援',
            location: `${region} ${address}`,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('newCaseNotification', JSON.stringify(notification));

        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/status?id=ANS-20231120001');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-40 overflow-hidden relative">
            {/* Layered Background */}
            <div className="fixed inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-slate-50/50 pointer-events-none"></div>
            <div className="fixed inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(51 65 85) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            {/* Ambient Light Effects */}
            <div className={`fixed top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${isEmergency ? 'bg-red-400/5' : isBee ? 'bg-orange-400/5' : 'bg-blue-400/5'}`}></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-slate-400/5 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Emergency Alert Banner */}
            {isEmergency && (
                <div className="fixed top-24 left-6 right-6 z-40 animate-in slide-in-from-top-5 pointer-events-none">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 px-6 shadow-2xl rounded-2xl flex items-center gap-4 pointer-events-auto">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl animate-pulse">
                            !!!
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-lg tracking-tight">緊急案件快速通道</h3>
                            <p className="text-sm text-white/90 font-medium">此案件已標記為高優先級</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 px-6 pt-32 md:pt-40">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border ${isEmergency ? 'bg-red-50 text-red-600 border-red-100' :
                                isBee ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                {isEmergency ? 'EMERGENCY DISPATCH' : isBee ? 'HAZARD REMOVAL' : 'GENERAL REPORT'}
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase mb-6">
                                {isEmergency ? '緊急案件' : isBee ? '蜂蛇移除' : '一般案件'}<br />
                                <span className={isEmergency ? 'text-red-600' : isBee ? 'text-orange-500' : 'text-blue-600'}>通報程序</span>
                            </h1>
                            <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed border-l-4 pl-6 border-slate-200">
                                {isEmergency
                                    ? '此為高優先級緊急案件，系統將優先調度並立即派遣最近單位處置。'
                                    : '請提供詳細資訊，系統將自動分析並指派最合適的勤務單位進行處置。'
                                }
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">
                        {/* Section 01: Location */}
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
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
                                        {isDetecting ? (
                                            <>
                                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                定位中...
                                            </>
                                        ) : detectionSuccess ? (
                                            '重新定位'
                                        ) : (
                                            '定址偵測'
                                        )}
                                    </button>
                                </div>

                                {/* Detected Location Display */}
                                {detectionSuccess && detectedLocation && (
                                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">偵測到的位置</div>
                                                <div className="text-sm font-bold text-slate-900">{detectedLocation}</div>
                                                <div className="text-xs text-slate-500 mt-1">地址已自動填入下方表單</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">通報區域</label>
                                            <select
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            >
                                                <option>新北市 - 板橋區</option>
                                                <option>新北市 - 新莊區</option>
                                                <option>新北市 - 中和區</option>
                                                <option>新北市 - 永和區</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">精確地址</label>
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="例如：四川路一段 157 巷口..."
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 02: Description */}
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                            <div className="p-10 md:p-16">
                                <div className="flex items-center gap-4 mb-16">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">02</div>
                                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">案件詳情簡述</h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">具體情況描述</label>
                                        <textarea
                                            rows={4}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="請描述現場動物狀況、數量、種類，或蜂巢概略位置高度..."
                                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">聯絡人姓名 (選填)</label>
                                            <input
                                                type="text"
                                                value={contactName}
                                                onChange={(e) => setContactName(e.target.value)}
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">手機聯絡電話</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 03: Photo Upload */}
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
                            <div className="p-10 md:p-16">
                                <div className="flex items-center justify-between mb-16">
                                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">03</div>
                                        視覺影像上傳
                                    </h2>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                        ENCRYPTED CHANNEL
                                    </span>
                                </div>

                                {hasImage ? (
                                    <div className="relative w-full h-80 rounded-[2.5rem] overflow-hidden group/image cursor-pointer">
                                        <img
                                            src="/report_evidence_demo.png"
                                            alt="Uploaded Evidence"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setHasImage(false)}
                                                className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-red-500/80 transition-all border border-white/30"
                                            >
                                                REMOVE
                                            </button>
                                            <div className="px-6 py-3 bg-white rounded-2xl text-slate-900 font-black text-xs uppercase tracking-widest">
                                                CHANGE PHOTO
                                            </div>
                                        </div>
                                        <div className="absolute top-6 right-6 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                            UPLOADED
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setHasImage(true)}
                                        className="border-4 border-dashed border-slate-50 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-6 hover:bg-slate-50/50 transition-all group/upload cursor-pointer"
                                    >
                                        <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover/upload:scale-110 group-hover/upload:bg-blue-600 group-hover/upload:text-white transition-all duration-500 font-black text-2xl">
                                            +
                                        </div>
                                        <div className="text-center">
                                            <p className="font-black text-slate-900 uppercase tracking-tight">點擊或拖放照片</p>
                                            <p className="text-slate-400 text-xs mt-1 font-medium">支援 JPG, PNG 格式，單一檔案不超過 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
                            <Link to="/smart-guide" className="w-full py-8 rounded-[2.5rem] bg-white border border-slate-100 font-black text-xl uppercase tracking-[0.3em] text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all">
                                STEP BACK
                            </Link>

                            <button
                                type="submit"
                                disabled={isSubmitting || (isBee ? false : !hasImage)}
                                className={`md:col-span-2 w-full py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center gap-4 transition-all active:scale-95 
                                    ${isSubmitting
                                        ? 'bg-slate-300 cursor-not-allowed'
                                        : isBee
                                            ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30'
                                            : 'bg-slate-900 hover:bg-blue-600 shadow-blue-600/30'
                                    }`}
                            >
                                {isSubmitting ? '正在提交...' : '發送正式通報單'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-20 text-center">
                        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
                            End-to-End Encryption Secured • Citizens Protection Protocol
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
