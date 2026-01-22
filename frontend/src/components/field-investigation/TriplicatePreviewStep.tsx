import React from 'react';
import { FileText, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TriplicatePreviewStepProps {
    onNext: () => void;
    onPrev: () => void;
    caseData: any;
    formData: any;
}

export const TriplicatePreviewStep: React.FC<TriplicatePreviewStepProps> = ({ onNext, onPrev, caseData, formData }) => {
    // Determine violation based on form data (Mock Logic)
    const getViolations = () => {
        const violations = [];
        if (formData.water === 'none' || formData.food === 'none') {
            violations.push({
                article: '第 5 條第 2 項',
                content: '飼主對於其管領之動物，應提供適當、乾淨且無害之食物及二十四小時充足、乾淨之飲水。',
                penalty: '經勸導未改善者，得依本法第 30-1 條處新臺幣三千元以上一萬五千元以下罰鍰。'
            });
        }
        if (formData.petRegistration === 'none' || formData.microchipStatus === 'none') {
            violations.push({
                article: '第 19 條第 1 項',
                content: '寵物之出生、取得、轉讓、遺失及死亡，飼主應向直轄市、縣（市）主管機關或其委託之民間機構、團體辦理登記；直轄市、縣（市）主管機關應給與登記寵物身分標識，並應植入晶片。',
                penalty: '違反者處新臺幣三千元以上一萬五千元以下罰鍰，並得限期令其改善。'
            });
        }
        return violations;
    };

    const violations = getViolations();
    const isClean = violations.length === 0;

    return (
        <div className="flex-1 flex flex-col bg-slate-50 h-full">

            <div className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-right-8">

                {/* Main Single Container */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-3xl mx-auto space-y-8">

                    <div className="text-center border-b border-slate-100 pb-6">
                        <h2 className="text-3xl font-black text-slate-900 mb-3">電子三聯單預覽</h2>
                        <p className="text-base text-slate-500 font-bold">請確認以下稽查紀錄無誤，此文件將具有法律效力。</p>
                    </div>

                    {/* The Triplicate Form Visual */}
                    <div className="border-4 border-double border-slate-200 p-8 rounded-sm shadow-inner relative overflow-hidden bg-slate-50/50">

                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                            <Shield size={400} />
                        </div>

                        <div className="relative z-10 space-y-8">
                            {/* Header */}
                            <div className="text-center border-b-2 border-slate-900 pb-6">
                                <h1 className="text-3xl font-black text-slate-900 tracking-widest mb-2 font-serif">動物保護稽查紀錄單</h1>
                                <div className="flex justify-between items-end text-base font-bold text-slate-500 mt-6">
                                    <div>案號：{caseData.id}</div>
                                    <div>日期：{new Date().toLocaleDateString()}</div>
                                    <div>頁次：第 1 頁，共 1 頁</div>
                                </div>
                            </div>

                            {/* Section 1: Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">壹、受稽查對象資料</h3>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-base">
                                    <div className="border-b border-dashed border-slate-300 pb-1">
                                        <span className="font-bold text-slate-500 w-32 inline-block">受稽查人：</span>
                                        <span className="font-black text-slate-900">{formData.ownerName || '現場無人 / 未提供'}</span>
                                    </div>
                                    <div className="border-b border-dashed border-slate-300 pb-1">
                                        <span className="font-bold text-slate-500 w-32 inline-block">聯絡電話：</span>
                                        <span className="font-black text-slate-900">09XX-XXX-XXX</span>
                                    </div>
                                    <div className="col-span-2 border-b border-dashed border-slate-300 pb-1">
                                        <span className="font-bold text-slate-500 w-32 inline-block">稽查地點：</span>
                                        <span className="font-black text-slate-900">{caseData.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Inspection Results */}
                            <div className="space-y-4">
                                <h3 className="text-base font-black text-white bg-slate-900 px-4 py-2 inline-block">貳、稽查事實與法規適用</h3>

                                {isClean ? (
                                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start gap-3">
                                        <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <div className="font-black text-emerald-800 mb-1">本次稽查符合規定</div>
                                            <p className="text-base text-emerald-600 leading-relaxed font-bold">
                                                經查核現場飼養環境、動物狀況及相關登記資料，目前尚無違反動物保護法之情事。已對受稽查人進行動保法規宣宣導。
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {violations.map((v, idx) => (
                                            <div key={idx} className="bg-rose-50 border border-rose-100 p-4 rounded-lg flex items-start gap-3">
                                                <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
                                                <div>
                                                    <div className="font-black text-rose-800 mb-1">違反動物保護法 {v.article}</div>
                                                    <p className="text-base text-rose-700 font-bold mb-3">{v.content}</p>
                                                    <div className="text-sm bg-white/50 px-3 py-1.5 rounded text-rose-600 font-mono">
                                                        罰則：{v.penalty}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Additional Notes area */}
                                <div className="border border-slate-200 rounded p-3 min-h-[100px]">
                                    <span className="text-base font-bold text-slate-400 block mb-3">其他現場紀錄 / 備註：</span>
                                    <p className="text-lg font-bold text-slate-800 whitespace-pre-wrap">{formData.notes || '無補充事項。'}</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-16 pt-8 border-t-2 border-slate-900 flex justify-between items-end">
                                <div className="text-center w-40">
                                    <div className="h-24 border-b border-slate-300 mb-3"></div>
                                    <div className="text-base font-bold text-slate-500">受稽查人簽名</div>
                                </div>
                                <div className="text-center w-40">
                                    <div className="h-24 border-b border-slate-300 mb-3 flex items-end justify-center pb-3">
                                        <span className="font-dancing-script text-2xl text-blue-800 transform -rotate-6">Officer Demo</span>
                                    </div>
                                    <div className="text-base font-bold text-slate-500">稽查員簽章</div>
                                </div>
                            </div>

                            <div className="text-sm text-center text-slate-400 font-mono mt-10">
                                表單編號：FORM-2026-QA92-01 • 第一聯：機關存查 • 第二聯：受稽查人收執
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
                    onClick={onNext}
                    className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-slate-900/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    確認預覽並簽名
                </button>
            </div>
        </div>
    );
};
