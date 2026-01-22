import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CheckInStepProps {
    onNext: (data: { timestamp: string; location: string; coordinates: [number, number] }) => void;
    caseLocation: string; // Target location to verify distance
}

export const CheckInStep: React.FC<CheckInStepProps> = ({ onNext, caseLocation }) => {
    const [status, setStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string>('');
    const [distance, setDistance] = useState<number | null>(null);

    const handleCheckIn = () => {
        setStatus('locating');

        // Mock geolocation
        setTimeout(() => {
            const mockLat = 25.0123;
            const mockLng = 121.4657;

            setCurrentLocation({ lat: mockLat, lng: mockLng });
            setAddress('新北市板橋區縣民大道二段 7 號');
            setDistance(45); // meters
            setStatus('success');
        }, 1500);
    };

    const handleConfirm = () => {
        if (currentLocation && address) {
            onNext({
                timestamp: new Date().toISOString(),
                location: address,
                coordinates: [currentLocation.lat, currentLocation.lng]
            });
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 p-6 h-full">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-bottom-4">

                {/* Map Visual (Mock) */}
                <div className="relative w-full aspect-square max-w-sm rounded-[2.5rem] bg-slate-200 overflow-hidden shadow-inner border-4 border-white group">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/121.465,25.012,15,0/600x600?access_token=pk.mock')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative ${status === 'locating' ? 'border-blue-500 bg-blue-500/10 scale-110' :
                            status === 'success' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-300 bg-white/50'
                            }`}>
                            {status === 'locating' && (
                                <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
                            )}
                            <MapPin size={48} className={`transition-colors ${status === 'locating' ? 'text-blue-600' :
                                status === 'success' ? 'text-emerald-600' : 'text-slate-400'
                                }`} />
                        </div>
                    </div>

                    {status === 'success' && (
                        <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-emerald-100 text-center animate-in slide-in-from-bottom-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">CURRENT LOCATION</div>
                            <div className="text-sm font-black text-slate-900 line-clamp-1">{address}</div>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                <CheckCircle2 size={10} /> GPS Locked ({distance}m)
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center max-w-xs mx-auto">
                    <h2 className="text-2xl font-black text-slate-900 mb-3">
                        {status === 'idle' ? '現場數位打卡' :
                            status === 'locating' ? '衛星定位中...' : '定位完成'}
                    </h2>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                        {status === 'idle' ? '請抵達指定案件地點後，點擊下方按鈕進行 GPS 定位簽到。' :
                            status === 'locating' ? '正在獲取精確座標數據，請稍候...' :
                                '系統已記錄您的到場時間與座標，請確認無誤後繼續。'}
                    </p>

                    {/* Manual Fallback Option */}
                    {status === 'idle' && (
                        <button
                            onClick={() => {
                                setAddress('手動輸入定位: 無法取得 GPS');
                                setCurrentLocation({ lat: 25.0123, lng: 121.4657 }); // Mock default
                                setStatus('success');
                            }}
                            className="mt-4 text-xs font-bold text-slate-400 hover:text-blue-600 underline decoration-dashed decoration-slate-300 hover:decoration-blue-600 underline-offset-4 transition-all"
                        >
                            GPS 訊號不良？切換至手動打卡
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-6">
                {status === 'success' ? (
                    <button
                        onClick={handleConfirm}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        確認並開始訪查
                    </button>
                ) : (
                    <button
                        onClick={handleCheckIn}
                        disabled={status === 'locating'}
                        className={`w-full py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${status === 'locating'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95'
                            }`}
                    >
                        {status === 'locating' ? '定位中...' : (
                            <>
                                <Navigation size={20} />
                                立即簽到 Check-in
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
