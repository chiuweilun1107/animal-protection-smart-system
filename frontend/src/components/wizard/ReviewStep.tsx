import React from 'react';
import { CheckCircle2, ShieldCheck, MapPin, ClipboardList, Send } from 'lucide-react';

interface ReviewStepProps {
    data: any;
    onNext: () => void;
    onBack: () => void;
    isSubmitting: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data, onNext, onBack, isSubmitting }) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-12">
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase">最後核對與提交</h2>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                        請確認以下通報資訊正確無誤。點擊「正式發送」後，系統將立即通知轄區勤務人員。
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-12 text-left">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 md:p-14 space-y-12">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-xs">
                                    <MapPin size={16} /> 案發位置 (Location)
                                </div>
                                <div className="text-2xl font-black text-slate-900 leading-tight">
                                    {data.location?.region}<br />
                                    <span className="text-blue-600">{data.location?.address}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-xs">
                                    <ClipboardList size={16} /> 陳情人 (Petitioner)
                                </div>
                                <div className="text-2xl font-black text-slate-900">
                                    {data.form?.contactName}<br />
                                    <span className="text-slate-400 font-mono text-lg">{data.form?.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-50 pt-10">
                            <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-widest text-xs mb-4">
                                <ClipboardList size={16} /> 情況簡述 (Intelligence Summary)
                            </div>
                            <p className="text-xl font-medium text-slate-600 leading-relaxed italic border-l-4 border-blue-600 pl-6">
                                {data.form?.description || '已提供案情描述。'}
                            </p>
                        </div>

                        {/* Analysis Badge */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <p className="text-blue-900 font-bold text-lg leading-tight">您的個人資訊與案件座標已受加密保護</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <button
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="w-full py-8 rounded-[2rem] bg-white border border-slate-100 font-black text-sm uppercase tracking-[0.3em] text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        Review Steps
                    </button>
                    <button
                        onClick={onNext}
                        disabled={isSubmitting}
                        className="w-full py-8 rounded-[2rem] bg-blue-600 text-white font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-500 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center gap-4 group active:scale-95"
                    >
                        {isSubmitting ? '正在發送...' : '正式送出申報'}
                        {!isSubmitting && <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                    </button>
                </div>

            </div>
        </div>
    );
};
