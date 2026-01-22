import React, { useState } from 'react';
import { Send, FileText, CheckCircle2 } from 'lucide-react';

interface CaseReportStepProps {
    onNext: (data: any) => void;
    onPrev: () => void;
    caseData: any;
}

export const CaseReportStep: React.FC<CaseReportStepProps> = ({ onNext, onPrev, caseData }) => {
    const [status, setStatus] = useState('resolved');
    const [summary, setSummary] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Mock submission
        setTimeout(() => {
            onNext({ status, summary, timestamp: new Date().toISOString() });
        }, 1500);
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 h-full">
            <div className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-right-8">

                {/* Main Single Container */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8">

                    {/* Header Section */}
                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-3xl font-black text-slate-900 mb-3">案件回報與結案</h2>
                        <p className="text-base text-slate-500 font-bold">請填寫最終辦理情形並回報系統。</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-base font-bold text-slate-700 block">案件處理狀態</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setStatus('resolved')}
                                    className={`py-4 rounded-xl text-base font-black transition-all flex items-center justify-center gap-3 ${status === 'resolved'
                                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                                        : 'bg-slate-50 text-slate-400 border-2 border-transparent hover:bg-slate-100'
                                        }`}
                                >
                                    <CheckCircle2 size={18} />
                                    已辦結 (Resolved)
                                </button>
                                <button
                                    onClick={() => setStatus('pending')}
                                    className={`py-4 rounded-xl text-base font-black transition-all flex items-center justify-center gap-3 ${status === 'pending'
                                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                                        : 'bg-slate-50 text-slate-400 border-2 border-transparent hover:bg-slate-100'
                                        }`}
                                >
                                    <FileText size={18} />
                                    需後續追蹤 (Pending)
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-base font-bold text-slate-700 block">辦理情形摘要</label>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="請輸入本案辦理重點摘要，將同步至案件歷程..."
                                rows={6}
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-slate-400 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none focus:bg-white text-base"
                            />
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-base text-slate-500 font-medium leading-relaxed">
                            <strong className="block mb-1 text-slate-700">系統提示</strong>
                            點擊提交後，系統將自動更新案件狀態、上傳所有訪查證據，並發送結案通知。
                        </div>
                    </div>

                </div>
            </div>

            <div className="p-6 sticky bottom-0 z-10 flex gap-4">
                <button
                    onClick={onPrev}
                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-2xl font-black text-lg uppercase tracking-widest transition-all active:scale-95"
                >
                    上一步
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !summary}
                    className={`flex-[2] py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${isSubmitting || !summary
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10 active:scale-95'
                        }`}
                >
                    {isSubmitting ? '資料上傳中...' : (
                        <>
                            <Send size={20} />
                            提交回報 (Submit)
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
