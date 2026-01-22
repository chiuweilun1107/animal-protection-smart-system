import React from 'react';
import { MapPin, Target, Send, LocateFixed } from 'lucide-react';

interface LocationStepProps {
    onNext: (data: { region: string; address: string }) => void;
    onBack: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({ onNext, onBack }) => {
    const [isDetecting, setIsDetecting] = React.useState(false);
    const [detectionSuccess, setDetectionSuccess] = React.useState(false);
    const [region, setRegion] = React.useState('新北市 - 板橋區');
    const [address, setAddress] = React.useState('');

    const handleDetect = () => {
        setIsDetecting(true);
        setTimeout(() => {
            setIsDetecting(false);
            setDetectionSuccess(true);
            setAddress('四川路一段 157 巷口 7-11 前');
        }, 1500);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase">地理座標數據偵測</h2>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl">系統正透過 GPS 與地理資訊中心連線，請確認案發精確位置。</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Mock Map Visual */}
                    <div className="relative aspect-square lg:aspect-auto lg:h-full bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
                        {/* SVG Mock Map (Hidden when image shows) */}
                        <div className={`absolute inset-0 opacity-20 transition-opacity duration-700 ${detectionSuccess ? 'opacity-0' : 'opacity-20'}`}>
                            <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 100H800M0 200H800M0 300H800M0 400H800M0 500H800M0 600H800M0 700H800" stroke="white" strokeWidth="1" />
                                <path d="M100 0V800M200 0V800M300 0V800M400 0V800M500 0V800M600 0V800M700 0V800" stroke="white" strokeWidth="1" />
                                <circle cx="400" cy="400" r="150" stroke="white" strokeDasharray="10 10" />
                            </svg>
                        </div>

                        {/* User Provided Mock Map Image */}
                        {detectionSuccess && (
                            <img
                                src="/mock_map_result.png"
                                alt="偵測位置地圖"
                                className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000"
                            />
                        )}

                        {/* Scanning Effect */}
                        {isDetecting && (
                            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                                <div className="w-full h-2 bg-blue-500/50 blur-lg animate-scan-y"></div>
                            </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`relative transition-all duration-700 ${detectionSuccess ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                                <div className="absolute -inset-8 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl relative z-10 border-2 border-white/20">
                                    <LocateFixed size={32} />
                                </div>
                            </div>
                            {!detectionSuccess && !isDetecting && (
                                <div className="text-slate-500 font-black tracking-widest uppercase flex items-center gap-3">
                                    <Target className="animate-pulse" />
                                    等待訊號中
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/5">
                            <div className="text-white font-mono text-xs tracking-wider">{detectionSuccess ? '座標: 25.0125, 121.4658' : 'GPS 訊號: 搜尋中...'}</div>
                        </div>
                    </div>

                    {/* Form Controls */}
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1">通報區域</label>
                                    <select
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all appearance-none"
                                    >
                                        <option>新北市 - 板橋區</option>
                                        <option>新北市 - 新莊區</option>
                                        <option>新北市 - 中和區</option>
                                        <option>新北市 - 永和區</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1">精確地址</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="請輸入地址或點擊偵測..."
                                            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                                        />
                                        <button
                                            onClick={handleDetect}
                                            disabled={isDetecting}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-slate-900 hover:text-white rounded-xl shadow-lg border border-slate-100 transition-all text-slate-400"
                                        >
                                            <Target size={20} className={isDetecting ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-500 text-sm font-medium leading-relaxed">
                                    系統將自動紀錄當前座標。若無法取得精確地址，請盡量描述週遭醒目地標（如：XX路口、XX公園涼亭旁）。
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={onBack}
                                className="w-full py-8 rounded-[2rem] bg-white border border-slate-100 font-black text-sm uppercase tracking-[0.3em] text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                上一步
                            </button>
                            <button
                                onClick={() => onNext({ region, address })}
                                disabled={!address}
                                className="w-full py-8 rounded-[2rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-600 shadow-xl shadow-blue-900/10 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                            >
                                Continue
                                <Send size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
