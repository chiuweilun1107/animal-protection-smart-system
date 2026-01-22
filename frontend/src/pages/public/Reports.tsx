import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, ChevronRight, FilePlus, AlertCircle, Printer, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';

export const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'public' | 'application'>('public');

    // Application Form State
    const [formData, setFormData] = useState({
        caseId: '',
        reason: '',
        applicant: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applicationSuccess, setApplicationSuccess] = useState(false);

    const handleApplicationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setApplicationSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-40">
            <div className="max-w-7xl mx-auto px-6">
                <PageHeader
                    tag="數位記錄中心"
                    title="行政報表"
                    subtitle="申請服務"
                    description="提供各類動保行政報表公開查詢，以及民眾申請勤務三聯單（報案證明）的線上數位櫃台。"
                />

                {/* Tabs */}
                <div className="flex flex-col md:flex-row gap-4 mb-16 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('public')}
                        className={`px-10 py-5 rounded-full font-black text-base uppercase tracking-widest transition-all ${activeTab === 'public'
                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105'
                            : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                            }`}
                    >
                        公開報表查詢
                    </button>
                    <button
                        onClick={() => setActiveTab('application')}
                        className={`px-10 py-5 rounded-full font-black text-base uppercase tracking-widest transition-all ${activeTab === 'application'
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105'
                            : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                            }`}
                    >
                        三聯單申請
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'public' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Search Bar for Reports */}
                        <div className="bg-white p-4 rounded-[2rem] shadow-lg border border-slate-100 flex items-center gap-4 mb-12">
                            <div className="flex-1 relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input
                                    type="text"
                                    placeholder="搜尋報表名稱、年份或關鍵字..."
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                />
                            </div>
                            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-base uppercase tracking-widest hover:bg-slate-800 transition-all">
                                查詢
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: '112年動保評鑑績效報告', type: 'PDF', date: '2023.11.01', tag: '年度績效' },
                                { title: '流浪犬貓絕育執行成果表', type: 'ODF', date: '2023.10.15', tag: '絕育計畫' },
                                { title: '新北市遊蕩犬熱點分布統計', type: 'CSV', date: '2023.10.01', tag: 'Open Data' },
                                { title: '113年度預算執行情形表', type: 'PDF', date: '2023.11.20', tag: '財政公開' },
                                { title: '動保案件裁罰名冊 (去識別化)', type: 'PDF', date: '2023.11.10', tag: '執法統計' },
                                { title: '受虐動物安置與領養追蹤報表', type: 'ODF', date: '2023.09.30', tag: '收容安置' },
                                { title: '112年度飼主家訪執行報表', type: 'PDF', date: '2023.09.15', tag: '稽查管理' }
                            ].map((report, idx) => (
                                <div key={idx} className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-500 flex flex-col justify-between min-h-[300px]">
                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-xs font-black uppercase tracking-[0.1em] border border-slate-100">{report.tag}</span>
                                            <span className="text-xs font-bold text-slate-300">{report.date}</span>
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                                            {report.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-8 mt-auto">
                                        <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                <FileText size={14} />
                                            </div>
                                            {report.type}
                                        </div>
                                        <button className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:scale-110 hover:bg-indigo-600 transition-all shadow-lg">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700">

                        {!applicationSuccess ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                                {/* Left: Info */}
                                <div className="lg:col-span-5">
                                    <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden h-full flex flex-col justify-between">
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white mb-10 shadow-lg shadow-indigo-600/30">
                                                <FilePlus size={32} />
                                            </div>
                                            <h3 className="text-4xl font-black tracking-tighter mb-8 leading-tight">勤務三聯單<br />申請須知</h3>
                                            <ul className="space-y-8 text-slate-300 text-base font-medium leading-relaxed">
                                                <li className="flex gap-6">
                                                    <span className="text-2xl font-black text-indigo-500 opacity-60">01</span>
                                                    <div>
                                                        <strong className="text-white block mb-1">資格限制</strong>
                                                        申請僅限案件關係人（報案人、飼主），他人代辦需出具委託書。
                                                    </div>
                                                </li>
                                                <li className="flex gap-6">
                                                    <span className="text-2xl font-black text-indigo-500 opacity-60">02</span>
                                                    <div>
                                                        <strong className="text-white block mb-1">資料準備</strong>
                                                        需提供正確之案件編號 (ANS-開頭) 與原始報案聯絡資訊以供系統查核。
                                                    </div>
                                                </li>
                                                <li className="flex gap-6">
                                                    <span className="text-2xl font-black text-indigo-500 opacity-60">03</span>
                                                    <div>
                                                        <strong className="text-white block mb-1">核發方式</strong>
                                                        審核通過後，電子檔將寄送至您的信箱，紙本請至臨櫃辦理。
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="mt-12 pt-8 border-t border-white/10">
                                            <div className="flex gap-4 items-center opacity-60">
                                                <AlertCircle size={20} />
                                                <p className="text-xs font-medium">若為緊急司法調閱，請洽 1959 專線。</p>
                                            </div>
                                        </div>

                                        {/* Deco */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
                                    </div>
                                </div>

                                {/* Right: Form */}
                                <div className="lg:col-span-7">
                                    <form onSubmit={handleApplicationSubmit} className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 md:p-16">
                                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-10 uppercase">填寫申請表單</h2>

                                        <div className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">案件編號 Case ID</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="例如: ANS-2023..."
                                                        value={formData.caseId}
                                                        onChange={e => setFormData({ ...formData, caseId: e.target.value })}
                                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">申請人姓名 Applicant</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="請輸入真實姓名"
                                                        value={formData.applicant}
                                                        onChange={e => setFormData({ ...formData, applicant: e.target.value })}
                                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">申請事由 Reason</label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900 appearance-none"
                                                        value={formData.reason}
                                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                                    >
                                                        <option value="">請選擇申請用途...</option>
                                                        <option value="insurance">保險理賠證明需求</option>
                                                        <option value="legal">法律訴訟舉證使用</option>
                                                        <option value="record">個人留存備查</option>
                                                        <option value="other">其他</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none p-2 bg-white rounded-xl shadow-sm">
                                                        <ChevronRight className="rotate-90 text-slate-400" size={16} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email 信箱</label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="核准後將寄送至此信箱"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-900"
                                                />
                                            </div>

                                            <div className="pt-10">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-lg uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                                                >
                                                    {isSubmitting ? '處理中 Processing...' : '提交三聯單申請'}
                                                    {!isSubmitting && <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                                                </button>
                                                <p className="text-center mt-6 text-xs font-bold text-slate-300 uppercase tracking-widest">
                                                    Secure Transmission Protocol
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-3xl mx-auto text-center py-20 animate-in zoom-in-95 duration-500">
                                <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-emerald-500/20 rotate-3">
                                    <CheckCircle2 size={64} />
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-8 uppercase">申請已受理</h2>
                                <p className="text-slate-500 text-xl font-medium mb-16 max-w-lg mx-auto leading-relaxed">
                                    系統已收到您的三聯單申請，審核作業約需 1-3 個工作天。結果將會發送至您的 Email 信箱。
                                </p>
                                <div className="flex flex-col md:flex-row justify-center gap-6">
                                    <button
                                        onClick={() => {
                                            setFormData({ caseId: '', reason: '', applicant: '', email: '' });
                                            setApplicationSuccess(false);
                                        }}
                                        className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg"
                                    >
                                        繼續申請
                                    </button>
                                    <Link to="/" className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                                        返回首頁
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
