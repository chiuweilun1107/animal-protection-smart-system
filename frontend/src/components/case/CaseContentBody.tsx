import React from 'react';
// Force layout refresh 2026-01-22
import { MapPin, FileText, Camera, Tag, Clock } from 'lucide-react';
import type { Case } from '../../types/schema';

interface CaseContentBodyProps {
    caseData: Case;
}

export const CaseContentBody: React.FC<CaseContentBodyProps> = ({ caseData }) => {
    return (
        <div className="flex-1 space-y-20 animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
            {/* 標題區域 */}
            <section className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-[0.9] break-words">
                    {caseData.title}
                </h1>
                <div className="flex items-center gap-4 text-slate-400 font-bold text-lg tracking-widest uppercase">
                    <MapPin size={20} className="text-blue-600" />
                    {caseData.location}
                </div>
            </section>

            {/* 案件說明 */}
            <section className="space-y-8">
                <div className="flex items-center gap-4 border-b-2 border-slate-950 pb-4">
                    <FileText size={20} className="text-slate-950" />
                    <h3 className="text-lg font-black text-slate-950 uppercase tracking-[0.3em]">案情詳述</h3>
                </div>
                <div className="text-2xl font-bold text-slate-600 leading-tight max-w-4xl whitespace-pre-wrap bg-slate-50/50 p-10 border-l-8 border-slate-950">
                    {caseData.description}
                </div>
            </section>

            {/* 證據照片牆 */}
            {(caseData.photos?.length || 0) > 0 && (
                <section className="space-y-8">
                    <div className="flex items-center gap-4 border-b-2 border-slate-950 pb-4">
                        <Camera size={20} className="text-slate-950" />
                        <h3 className="text-lg font-black text-slate-950 uppercase tracking-[0.3em]">證據照片</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {caseData.attachments?.filter(a => a.fileType.startsWith('image/')).map((photo) => (
                            <div key={photo.id} className="space-y-4 group">
                                <div className="aspect-[16/10] overflow-hidden bg-slate-100 border-2 border-slate-100 group-hover:border-slate-950 transition-all duration-500 shadow-sm">
                                    <img
                                        src={photo.fileUrl}
                                        alt={photo.filename}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex items-center gap-3 text-base font-black text-slate-400 uppercase tracking-widest px-2">
                                    <Tag size={16} /> {photo.filename}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 歷史歷程 */}
            <section className="space-y-12">
                <div className="flex items-center justify-between border-b-4 border-slate-950 pb-6">
                    <div className="flex items-center gap-4">
                        <Clock size={20} className="text-slate-950" />
                        <h3 className="text-lg font-black text-slate-950 uppercase tracking-[0.3em]">處理歷程</h3>
                    </div>
                    <span className="text-base font-black text-slate-300 uppercase tracking-widest">系統稽核存證中</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {caseData.history?.map((entry) => {
                        const date = new Date(entry.performedAt);
                        return (
                            <div key={entry.id} className="grid grid-cols-12 gap-8 py-8 items-center hover:bg-slate-50 transition-colors px-6 group">
                                <div className="col-span-3 text-xl font-black text-slate-950 tracking-tighter">
                                    {date.getMonth() + 1}月{date.getDate()}日
                                </div>
                                <div className="col-span-3 text-lg font-bold text-slate-400 tabular-nums">
                                    {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
                                </div>
                                <div className="col-span-6 text-xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                                    {entry.description}
                                </div>
                            </div>
                        );
                    }) || (
                            <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-lg">
                                尚無歷程資訊
                            </div>
                        )}
                </div>
            </section>
        </div>
    );
};
