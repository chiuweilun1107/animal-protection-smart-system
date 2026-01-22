import React from 'react';
import { ClipboardList, AlertCircle } from 'lucide-react';

interface DynamicFormStepProps {
    caseType: 'animal' | 'bee' | 'snake';
    onNext: (data: any) => void;
    onBack: () => void;
}

export const DynamicFormStep: React.FC<DynamicFormStepProps> = ({ caseType, onNext, onBack }) => {
    const [formData, setFormData] = React.useState({
        description: '',
        contactName: '王小明',
        phone: '0912-345-678',
        // Bee specific
        hivePosition: '2-6公尺',
        hiveSize: '籃球大小',
        // Snake specific
        snakeLocation: '庭院/陽台',
        snakeStatus: '盤據不動'
    });

    const isBee = caseType === 'bee';
    const isSnake = caseType === 'snake';

    return (
        <div className="animate-in fade-in slide-in-from-right-10 duration-700">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6 uppercase">
                        {isBee ? '蜂害移除詳情' : isSnake ? '蛇類捕捉詳情' : '動物救援詳情'}
                    </h2>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl">
                        請提供更詳細的案件資訊，我們的智慧調度系統將自動為您匹配最合適的勤務小組。
                    </p>
                </div>

                <div className="space-y-8 mb-12">
                    {/* Conditionally Rendered Fields based on Case Type */}
                    <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                            {isBee ? (
                                <>
                                    <div className="space-y-6">
                                        <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1">蜂巢概略位置高度</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['2公尺以下', '2-6公尺', '6公尺以上', '無法確認'].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, hivePosition: opt })}
                                                    className={`p-4 rounded-2xl font-bold text-sm transition-all ${formData.hivePosition === opt ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1">蜂巢大小估計</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['拳頭大小', '籃球大小', '大於籃球', '僅見蜂群'].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, hiveSize: opt })}
                                                    className={`p-4 rounded-2xl font-bold text-sm transition-all ${formData.hiveSize === opt ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1">蛇類發現區域</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['屋內/室內', '庭院/陽台', '戶外公共區', '車內/其他'].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, snakeLocation: opt })}
                                                    className={`p-4 rounded-2xl font-bold text-sm transition-all ${formData.snakeLocation === opt ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1">目前移動狀態</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['盤據不動', '緩慢移動', '快速逃竄', '已受困'].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, snakeStatus: opt })}
                                                    className={`p-4 rounded-2xl font-bold text-sm transition-all ${formData.snakeStatus === opt ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* General Fields for all Case Types */}
                    <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-xl space-y-12">
                        <div className="space-y-4">
                            <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <ClipboardList size={18} /> 案件具體情況描述
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="請盡可能詳細描述您觀察到的情況..."
                                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1 uppercase tracking-widest">聯絡人姓名</label>
                                <input
                                    type="text"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-base font-black text-slate-400 uppercase tracking-widest ml-1 uppercase tracking-widest">手機聯絡電話</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                                <AlertCircle size={24} className="text-blue-600" />
                            </div>
                            <p className="text-sm font-bold text-blue-900/70">
                                詳細的描述能幫助勤務小組精確判斷派遣資源，縮短案件處置時間。
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <button
                            onClick={onBack}
                            className="w-full py-8 rounded-[2rem] bg-white border border-slate-100 font-black text-sm uppercase tracking-[0.3em] text-slate-400 hover:bg-slate-50 transition-all"
                        >
                            上一步
                        </button>
                        <button
                            onClick={() => onNext(formData)}
                            className="w-full py-8 rounded-[2rem] bg-slate-900 text-white font-black text-sm uppercase tracking-[0.3em] hover:bg-blue-600 shadow-xl shadow-blue-900/10 transition-all flex items-center justify-center gap-3 group"
                        >
                            儲存並繼續
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
