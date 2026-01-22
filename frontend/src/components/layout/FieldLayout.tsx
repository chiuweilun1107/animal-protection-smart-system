import React from 'react';
import { Signal, Wifi, Battery, ChevronLeft, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FieldLayoutProps {
    children: React.ReactNode;
    title?: string;
    onBack?: () => void;
    backPath?: string; // If provided, renders a Link. If not, and no onBack, renders nothing.
}

export const FieldLayout: React.FC<FieldLayoutProps> = ({
    children,
    title = '外勤任務',
    onBack,
    backPath
}) => {
    // Mock system status
    const currentTime = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Digital Alchemy Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-slate-50/50 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(51 65 85) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col relative z-10 selection:bg-blue-100">
                {children}
            </div>

            {/* Offline/Status Indicator */}
            <div className="relative z-50 bg-slate-950 text-white/60 px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] border-t border-white/5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                System Link Online • Data Synchronizing
            </div>
        </div>
    );
};
