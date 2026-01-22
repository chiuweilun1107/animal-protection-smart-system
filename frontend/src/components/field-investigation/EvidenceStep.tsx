import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, ChevronRight, Plus } from 'lucide-react';

interface EvidenceStepProps {
    onNext: (data: any) => void;
    onPrev: () => void;
}

export const EvidenceStep: React.FC<EvidenceStepProps> = ({ onNext, onPrev }) => {
    const [photos, setPhotos] = useState<Array<{ id: string; url: string; type: 'before' | 'after' }>>([]);

    const handleAddPhoto = (type: 'before' | 'after') => {
        // Mock photo add
        const newPhoto = {
            id: Math.random().toString(),
            url: type === 'before' ? '/report_evidence_demo.png' : 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300',
            type
        };
        setPhotos([...photos, newPhoto]);
    };

    const removePhoto = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 h-full">
            <div className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-right-8">

                {/* Main Single Container */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8">

                    {/* Instructions - Integrated as text */}
                    <div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                            <Camera className="text-slate-900" size={24} />
                            現場蒐證 RE
                        </h3>
                        <p className="text-base text-slate-500 font-bold">
                            請拍攝現場照片以茲證明。建議包含 <span className="text-slate-800">全景環境</span> 與 <span className="text-slate-800">違規特寫</span>。
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Before Photos */}
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 pb-3 mb-4 flex justify-between items-end">
                                <span className="text-base font-black text-slate-900">改善前 / 違規事證</span>
                                <span className="text-base font-bold text-slate-400">{photos.filter(p => p.type === 'before').length} 張照片</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {photos.filter(p => p.type === 'before').map(photo => (
                                    <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200">
                                        <img src={photo.url} className="w-full h-full object-cover" alt="Evidence" />
                                        <button
                                            onClick={() => removePhoto(photo.id)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-2 left-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-base font-bold text-white uppercase">
                                            Original
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddPhoto('before')}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    <Plus size={28} />
                                    <span className="text-base font-bold uppercase">拍攝照片</span>
                                </button>
                            </div>
                        </div>

                        {/* After Photos */}
                        <div className="space-y-4">
                            <div className="border-b border-slate-100 pb-2 mb-4 flex justify-between items-end">
                                <span className="text-sm font-black text-slate-900">改善後 / 處置結果</span>
                                <span className="text-xs font-bold text-slate-400">{photos.filter(p => p.type === 'after').length} 張照片</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {photos.filter(p => p.type === 'after').map(photo => (
                                    <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-200">
                                        <img src={photo.url} className="w-full h-full object-cover" alt="Evidence" />
                                        <button
                                            onClick={() => removePhoto(photo.id)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                        <div className="absolute bottom-2 left-2 px-3 py-1.5 bg-emerald-600/80 backdrop-blur-sm rounded-lg text-base font-bold text-white uppercase">
                                            Fixed
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddPhoto('after')}
                                    className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                                >
                                    <Plus size={28} />
                                    <span className="text-base font-bold uppercase">拍攝照片</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 sticky bottom-0 z-10 flex gap-4">
                <button
                    onClick={onPrev}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-95"
                >
                    上一步
                </button>
                <button
                    onClick={() => onNext({ photos })}
                    className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    下一步
                </button>
            </div>
        </div>
    );
};
