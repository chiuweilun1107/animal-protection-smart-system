import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, AlertCircle, Home, Dog, Users } from 'lucide-react';

interface InvestigationFormStepProps {
    onNext: (data: any) => void;
    onPrev: () => void;
    caseData: any;
}

type FormType = 'household' | 'stray_dog' | 'generic';

// Mock specific types for the form data
interface HouseholdData {
    ownerName: string;
    environment: string;
    water: string;
    food: string;
    shelter: string;
    animalStatus: string;
    // New fields
    microchipStatus: 'scanned' | 'unscanned' | 'none';
    microchipNumber: string;
    vaccineStatus: 'valid' | 'expired' | 'none';
    neuteringStatus: 'done' | 'declared' | 'none';
}

interface StrayDogData {
    dogCount: number;
    feederInfo: string;
    behavior: string;
    trapPlaced: boolean;
    dogGender: string;
    dogColor: string;
    isEarNotched: string;
    environmentImpact: string;
    // New fields
    captureDifficulty: 'low' | 'medium' | 'high' | 'extreme';
    reporterCooperation: 'willing' | 'unwilling' | 'unknown';
}

export const InvestigationFormStep: React.FC<InvestigationFormStepProps> = ({ onNext, onPrev, caseData }) => {
    // Determine initial form type based on case title/type logic (Mock)
    const [formType, setFormType] = useState<FormType>('household');

    // specialized state
    const [formData, setFormData] = useState({
        // Common
        action: 'education',
        notes: '',
        // Household specific
        ownerName: '',
        environment: 'fair',
        water: 'adequate',
        food: 'adequate',
        shelter: 'yes',
        animalStatus: 'healthy',
        microchipStatus: 'unscanned',
        microchipNumber: '',
        vaccineStatus: 'none',
        neuteringStatus: 'none',
        // Stray Dog specific
        dogCount: 1,
        feederInfo: '',
        behavior: 'normal',
        trapPlaced: false,
        dogGender: 'unknown',
        dogColor: '',
        isEarNotched: 'none', // left, right, both, none
        environmentImpact: 'none',
        captureDifficulty: 'medium',
        reporterCooperation: 'unknown',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({ formType, ...formData });
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50 h-full">
            <div className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-right-8">

                {/* Main Single Container */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8">

                    {/* Form Type Selector - Integrated */}
                    <div className="flex gap-2 bg-slate-100 p-2 rounded-xl">
                        <button
                            onClick={() => setFormType('household')}
                            className={`flex-1 py-3.5 rounded-lg text-base font-bold transition-all ${formType === 'household' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
                        >
                            家戶訪查
                        </button>
                        <button
                            onClick={() => setFormType('stray_dog')}
                            className={`flex-1 py-3.5 rounded-lg text-base font-bold transition-all ${formType === 'stray_dog' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
                        >
                            遊蕩犬訪查
                        </button>
                    </div>

                    {/* Section: Basic Info */}
                    <div className="space-y-6">
                        <div className="border-b border-slate-100 pb-3 mb-4">
                            <span className="text-base font-black text-slate-900">基礎資訊</span>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {formType === 'household' && (
                                <div className="space-y-3">
                                    <label className="text-base font-bold text-slate-700">飼主姓名</label>
                                    <input
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                                        placeholder="請輸入姓名"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 outline-none transition-all font-bold text-slate-900 text-base"
                                    />
                                </div>
                            )}
                            {formType === 'stray_dog' && (
                                <div className="space-y-3">
                                    <label className="text-base font-bold text-slate-700">餵養人資訊</label>
                                    <input
                                        type="text"
                                        value={formData.feederInfo}
                                        onChange={e => setFormData({ ...formData, feederInfo: e.target.value })}
                                        placeholder="特徵或姓名"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-400 outline-none transition-all font-bold text-slate-900 text-base"
                                    />
                                </div>
                            )}
                            <div className="space-y-3">
                                <label className="text-base font-bold text-slate-700">查核地址</label>
                                <div className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-bold text-base">
                                    {caseData.address}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Form Details */}
                    {formType === 'household' && (
                        <div className="space-y-8 animate-in fade-in">
                            {/* Environment */}
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-2 mb-4 flex justify-between items-end">
                                    <span className="text-sm font-black text-slate-900">飼養環境與生活</span>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">環境清潔度</label>
                                        <div className="flex gap-2">
                                            {['clean', 'fair', 'messy'].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, environment: opt })}
                                                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${formData.environment === opt
                                                        ? 'bg-slate-800 text-white border-slate-800'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {opt === 'clean' ? '良好' : opt === 'fair' ? '尚可' : '髒亂'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500">飲水狀況</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setFormData({ ...formData, water: 'adequate' })} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.water === 'adequate' ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-400 border-slate-200'}`}>充足</button>
                                                <button type="button" onClick={() => setFormData({ ...formData, water: 'none' })} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.water === 'none' ? 'bg-rose-600 text-white border-rose-600' : 'text-slate-400 border-slate-200'}`}>缺乏</button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500">食物狀況</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => setFormData({ ...formData, food: 'adequate' })} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.food === 'adequate' ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-400 border-slate-200'}`}>充足</button>
                                                <button type="button" onClick={() => setFormData({ ...formData, food: 'none' })} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.food === 'none' ? 'bg-rose-600 text-white border-rose-600' : 'text-slate-400 border-slate-200'}`}>缺乏</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legal Compliance */}
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-2 mb-4">
                                    <span className="text-sm font-black text-slate-900">法定責任查核</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500">寵物登記 (Microchip)</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={formData.microchipStatus}
                                            onChange={e => setFormData({ ...formData, microchipStatus: e.target.value as any })}
                                            className="py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none"
                                        >
                                            <option value="unscanned">未掃描</option>
                                            <option value="scanned">已掃描 (有)</option>
                                            <option value="none">確認無晶片</option>
                                        </select>
                                        {formData.microchipStatus === 'scanned' && (
                                            <input
                                                type="text"
                                                placeholder="輸入晶片號碼"
                                                value={formData.microchipNumber}
                                                onChange={e => setFormData({ ...formData, microchipNumber: e.target.value })}
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-slate-400 outline-none"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">狂犬病疫苗</label>
                                        <div className="flex flex-col gap-2">
                                            {['valid', 'expired', 'none'].map(st => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, vaccineStatus: st })}
                                                    className={`py-2 px-3 rounded-lg text-xs font-bold border text-left transition-all ${formData.vaccineStatus === st ? 'bg-slate-800 text-white border-slate-800' : 'text-slate-400 border-slate-200'}`}
                                                >
                                                    {st === 'valid' ? '有效' : st === 'expired' ? '逾期' : '無/未施打'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">絕育狀況</label>
                                        <div className="flex flex-col gap-2">
                                            {['done', 'declared', 'none'].map(st => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, neuteringStatus: st })}
                                                    className={`py-2 px-3 rounded-lg text-xs font-bold border text-left transition-all ${formData.neuteringStatus === st ? 'bg-slate-800 text-white border-slate-800' : 'text-slate-400 border-slate-200'}`}
                                                >
                                                    {st === 'done' ? '已絕育' : st === 'declared' ? '免絕育申報' : '未絕育'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {formType === 'stray_dog' && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="space-y-4">
                                <div className="border-b border-slate-100 pb-2 mb-4">
                                    <span className="text-sm font-black text-slate-900">現場評估與特徵</span>
                                </div>

                                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">
                                    <span className="text-sm font-bold text-slate-700">目擊數量</span>
                                    <div className="flex items-center gap-4">
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, dogCount: Math.max(0, p.dogCount - 1) }))} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center">-</button>
                                        <span className="text-xl font-black text-slate-900">{formData.dogCount}</span>
                                        <button type="button" onClick={() => setFormData(p => ({ ...p, dogCount: p.dogCount + 1 }))} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center">+</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">犬隻行為</label>
                                        <select
                                            value={formData.behavior}
                                            onChange={e => setFormData({ ...formData, behavior: e.target.value })}
                                            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none"
                                        >
                                            <option value="normal">正常</option>
                                            <option value="shy">膽怯</option>
                                            <option value="aggressive">具攻擊性</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500">捕捉難度</label>
                                        <select
                                            value={formData.captureDifficulty}
                                            onChange={e => setFormData({ ...formData, captureDifficulty: e.target.value as any })}
                                            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none"
                                        >
                                            <option value="low">低</option>
                                            <option value="medium">中</option>
                                            <option value="high">高</option>
                                            <option value="extreme">極高</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500">特徵描述</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="毛色 (e.g. 黑黃)"
                                            value={formData.dogColor}
                                            onChange={e => setFormData({ ...formData, dogColor: e.target.value })}
                                            className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none"
                                        />
                                        <select
                                            value={formData.dogGender}
                                            onChange={e => setFormData({ ...formData, dogGender: e.target.value })}
                                            className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none"
                                        >
                                            <option value="unknown">性別未知</option>
                                            <option value="male">公犬</option>
                                            <option value="female">母犬</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500">絕育剪耳</label>
                                    <div className="flex gap-2">
                                        {[{ id: 'none', label: '無' }, { id: 'left', label: '左(公)' }, { id: 'right', label: '右(母)' }, { id: 'both', label: '雙耳' }].map(opt => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, isEarNotched: opt.id })}
                                                className={`flex-1 py-1.5 rounded text-xs font-bold border transition-all ${formData.isEarNotched === opt.id ? 'bg-slate-800 text-white border-slate-800' : 'text-slate-400 border-slate-200'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Common Section: Action & Notes */}
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                        <div className="space-y-3">
                            <label className="text-base font-bold text-slate-700">現場處置建議</label>
                            <div className="flex gap-3">
                                {[
                                    { id: 'education', label: '勸導' },
                                    { id: 'notice', label: '限改' },
                                    { id: 'fine', label: '裁罰' }
                                ].map(act => (
                                    <button
                                        key={act.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, action: act.id })}
                                        className={`flex-1 py-4 rounded-xl text-base font-black border transition-all ${formData.action === act.id
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {act.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-base font-bold text-slate-700">補充紀錄</label>
                            <textarea
                                rows={4}
                                placeholder="其他備註事項..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none focus:bg-white focus:border-slate-400 text-base"
                            />
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
                    取消並返回
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex-[2] py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    下一步
                </button>
            </div>
        </div>
    );
};
