import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export const Report: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isBee = searchParams.get('type') === 'bee';

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-filled Form Data
    const [region, setRegion] = useState('新北市 - 板橋區');
    const [address, setAddress] = useState('四川路一段 157 巷口 7-11 前');
    const [description, setDescription] = useState('發現一隻橘色浪貓，左前腳似乎受傷跛行，但在路邊坐著不動，希望能派員協助救援。');
    const [contactName, setContactName] = useState('王小明');
    const [phone, setPhone] = useState('0912-345-678');
    const [hasImage, setHasImage] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/status?id=ANS-20231120001');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-40 overflow-hidden">
            {/* Dynamic Background */}
            <div className={`fixed top-0 left-0 w-full h-[500px] pointer-events-none transition-all duration-1000 ${isBee ? 'bg-orange-600' : 'bg-slate-900'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 pt-32 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl font-black text-xl ${isBee ? 'bg-orange-500 shadow-orange-500/50' : 'bg-slate-800 shadow-slate-900/50'}`}>
                            {isBee ? 'B' : 'A'}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mb-4">
                                {isBee ? '蜂蛇移除' : '一般案件'}<br />
                                <span className={isBee ? 'text-orange-200' : 'text-blue-500'}>通報程序系統</span>
                            </h1>
                            <p className="text-slate-400 font-medium">請提供詳細資訊，系統將自動分析並指派最合適的勤務單位進行處置。</p>
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
                                    <button type="button" className="px-8 py-3 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">定址偵測</button>
                                </div>

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
