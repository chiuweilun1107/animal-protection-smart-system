import React, { useEffect, useState } from 'react';
import { CaseMap, type CaseMarker } from '../../components/map/CaseMap';
import { Filter, Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapView: React.FC = () => {
    // Mock Data
    const [cases, setCases] = useState<CaseMarker[]>([]);

    useEffect(() => {
        // Simulate API fetch
        const mockCases: CaseMarker[] = [
            { id: 'C20231021001', lat: 25.012, lng: 121.465, type: 'general', title: '板橋區流浪犬聚集', status: 'pending' },
            { id: 'C20231021002', lat: 25.008, lng: 121.460, type: 'bee', title: '民宅屋簷蜂窩', status: 'processing' },
            { id: 'C20231021003', lat: 25.020, lng: 121.470, type: 'general', title: '受傷貓咪救援', status: 'resolved' },
            { id: 'C20231021004', lat: 25.030, lng: 121.450, type: 'bee', title: '公園樹上蜂窩', status: 'pending' },
            { id: 'C20231021005', lat: 25.015, lng: 121.480, type: 'general', title: '疑似虐待動物', status: 'processing' },
        ];
        setCases(mockCases);
    }, []);

    return (
        <div className="flex flex-col h-screen relative bg-slate-950">
            {/* Floating Header */}
            <div className="absolute top-6 left-6 right-6 z-[1000] flex items-start justify-between pointer-events-none">
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] shadow-2xl pointer-events-auto flex items-center gap-6">
                    <Link to="/" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                LIVE MAP SYSTEM
                            </div>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">案件熱點圖資中心</h1>
                    </div>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-xl pointer-events-auto flex flex-col gap-2">
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center" title="圖層">
                        <Layers size={20} />
                    </button>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center" title="篩選">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative rounded-[3rem] overflow-hidden border-[8px] border-slate-950 shadow-2xl mx-4 mb-4 mt-24">
                <CaseMap cases={cases} />

                {/* Legend Overlay */}
                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl z-[1000] border border-white/10 min-w-[240px]">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">即時狀態圖例</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">一般案件 (處理中)</span>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                            </span>
                            <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">蜂案 (處理中)</span>
                        </div>
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">已結案</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
