import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, ChevronRight } from 'lucide-react';

interface SmartTriageStepProps {
    onNext: (priority: string) => void;
    onBack: () => void;
    caseType: 'animal' | 'bee' | 'snake';
}

export const SmartTriageStep: React.FC<SmartTriageStepProps> = ({ onNext, onBack, caseType }) => {
    const [selections, setSelections] = useState<Record<string, boolean>>({});

    const getTriageItems = () => {
        switch (caseType) {
            case 'animal':
                return [
                    { key: 'bleeding', label: '動物有明顯外傷、大量出血' },
                    { key: 'trapped', label: '受困於車道、高處或排水溝' },
                    { key: 'abuse', label: '目擊正在發生的人為虐待行為' },
                    { key: 'highway', label: '位於快速道路或車流龐大區域' }
                ];
            case 'bee':
                return [
                    { key: 'inside', label: '蜂群已進入室內或陽台區域' },
                    { key: 'aggressive', label: '蜂群數量龐大且有攻擊行為' },
                    { key: 'vulnerable', label: '附近有幼童、長者或過敏體質者' },
                    { key: 'unstable', label: '蜂巢搖搖欲墜，有隨時掉落風險' }
                ];
            case 'snake':
                return [
                    { key: 'inside', label: '蛇類已進入住宅、室內活動範圍' },
                    { key: 'biting', label: '正在攻擊或已咬傷人、寵物' },
                    { key: 'aggressive', label: '展現明顯追逐或攻擊性的姿態' },
                    { key: 'trapped', label: '受困於縫隙或受傷無法自行離開' }
                ];
            default:
                return [];
        }
    };

    const items = getTriageItems();

    const handleNext = () => {
        const hasUrgent = Object.values(selections).some(val => val === true);
        onNext(hasUrgent ? 'high' : 'normal');
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-16">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 uppercase">
                        現場情況確認
                    </h2>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        請勾選符合現場的描述，這將幫助我們更準確地準備救援器材與人力。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {items.map(item => (
                        <button
                            key={item.key}
                            onClick={() => setSelections(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                            className={`flex items-center justify-between p-8 rounded-[2rem] border-2 text-left transition-all duration-500 group ${selections[item.key]
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/20'
                                    : 'bg-white border-slate-100 text-slate-800 hover:border-slate-300'
                                }`}
                        >
                            <span className="font-black text-lg tracking-tight leading-tight">{item.label}</span>

                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${selections[item.key] ? 'border-white bg-white' : 'border-slate-100'}`}>
                                {selections[item.key] && <div className="w-3 h-3 bg-blue-600 rounded-full animate-in zoom-in-50"></div>}
                            </div>
                        </button>
                    ))}

                    {/* "Other" Option */}
                    <div className="md:col-span-2">
                        <button
                            onClick={() => setSelections(prev => ({ ...prev, other: !prev.other }))}
                            className={`w-full flex items-center justify-between p-8 rounded-[2rem] border-2 border-dashed text-left transition-all duration-500 ${selections.other
                                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                                    : 'bg-transparent border-slate-200 text-slate-400 hover:border-slate-300'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <MessageSquare size={20} className={selections.other ? 'text-slate-900' : 'text-slate-300'} />
                                <span className="font-black text-lg tracking-tight">其他情況描述</span>
                            </div>
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selections.other ? 'border-slate-400 bg-slate-400' : 'border-slate-200'}`}>
                                {selections.other && <div className="w-3 h-3 bg-white rounded-full animate-in zoom-in-50"></div>}
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mb-16 text-left">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">通報說明</p>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        請根據實際情況勾選。案件資訊將同步傳送至轄區勤務小組，並決定初步派勤的優先順序。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button
                        onClick={onBack}
                        className="w-full py-8 rounded-[2.5rem] bg-white border border-slate-100 font-black text-sm uppercase tracking-[0.4em] text-slate-400 hover:bg-slate-50 transition-all"
                    >
                        上一步
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-full py-8 rounded-[2.5rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.4em] hover:bg-blue-600 shadow-2xl shadow-blue-900/10 transition-all flex items-center justify-center gap-3 group active:scale-95"
                    >
                        確認資訊並繼續
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
