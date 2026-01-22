import React, { useState } from 'react';
import { Play, BookOpen, Award, Clock, Search, ArrowRight, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';

const COURSES = [
    {
        id: 1,
        title: '新北市動物保護自治條例基礎導讀',
        category: '法規教育',
        duration: '45 min',
        level: '初級',
        image: '/course_law_bg.png',
        description: '深入淺出解說最新動保自治條例，適合所有新進同仁與關心動保議題的市民。',
        chapters: 5
    },
    {
        id: 2,
        title: '1959 緊急案件通報系統操作實務',
        category: '系統操作',
        duration: '90 min',
        level: '中級',
        image: '/course_system_bg.png',
        description: '完整演示從接獲通報、派案到結案的標準作業流程 (SOP)，包含行動版 App 操作教學。',
        chapters: 8
    },
    {
        id: 3,
        title: '常見遊蕩犬貓行為識別與安全接觸',
        category: '專業技能',
        duration: '60 min',
        level: '初級',
        image: '/course_behavior_bg.png',
        description: '學習判讀犬貓肢體語言，掌握安全接觸技巧，降低執勤風險並提升救援成功率。',
        chapters: 6
    },
    {
        id: 4,
        title: '危險性野生動物（蜂、蛇）緊急應變',
        category: '專業技能',
        duration: '120 min',
        level: '高級',
        image: '/course_snake_bg.png',
        description: '針對虎頭蜂與常見毒蛇的生態習性講解，以及遭遇時的緊急防護與移除裝備介紹。',
        chapters: 10
    }
];

export const Academy: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <PageHeader
                    tag="數位學院"
                    title="數位動保"
                    subtitle="專業學院"
                    description="賦能每一位守護者。透過線上課程與專業認證，提升動保意識與執勤專業度，共同構建友善動物城市。"
                >
                    <div className="flex flex-wrap gap-6">
                        <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-base uppercase tracking-widest hover:bg-blue-600 transition-all transform hover:scale-105 shadow-xl shadow-slate-900/10 flex items-center gap-3">
                            <Play size={18} fill="currentColor" /> 開始學習
                        </button>
                    </div>
                </PageHeader>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 relative z-20">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {[
                        { label: '線上課程', value: '24+', icon: Video, color: 'text-emerald-500' },
                        { label: '認證學員', value: '1,280', icon: Award, color: 'text-amber-400' },
                        { label: '學習時數', value: '5,000h', icon: Clock, color: 'text-blue-500' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex items-center gap-8 group hover:-translate-y-2 transition-transform duration-500">
                            <div className={`w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                <stat.icon size={36} className={`${stat.color}`} />
                            </div>
                            <div>
                                <div className="text-5xl font-black tracking-tighter text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-base font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                        {['all', '法規教育', '系統操作', '專業技能'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                    : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                                    }`}
                            >
                                {tab === 'all' ? '全部課程' : tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="搜尋課程關鍵字..."
                            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-full focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-base text-slate-900 shadow-sm"
                        />
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {COURSES.filter(c => activeTab === 'all' || c.category === activeTab).map(course => (
                        <div key={course.id} className="group bg-white rounded-[3rem] p-5 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 flex flex-col md:flex-row gap-8">
                            {/* Thumbnail */}
                            <div className="w-full md:w-56 aspect-[4/3] md:h-full rounded-[2.5rem] bg-slate-100 relative overflow-hidden flex-shrink-0">
                                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-300">
                                    <Video size={48} />
                                </div>
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent"></div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                                        <Play size={24} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 py-4 pr-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-4 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-full text-base font-black uppercase tracking-widest">{course.category}</span>
                                        <span className="flex items-center gap-1 text-base font-bold text-slate-400">
                                            <Clock size={16} /> {course.duration}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                                        {course.title}
                                    </h3>
                                    <p className="text-slate-500 text-base font-medium leading-relaxed mb-6 line-clamp-2">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-50 pt-5">
                                    <div className="flex items-center gap-2 text-base font-black text-slate-400 uppercase tracking-widest">
                                        <BookOpen size={16} /> {course.chapters} 章節
                                    </div>
                                    <button className="text-slate-900 font-black text-base uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                        開始上課 <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Banner */}
                <div className="mt-24 p-12 md:p-20 bg-slate-950 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-800/20 transition-colors duration-1000"></div>

                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-slate-400 text-base font-black tracking-[0.2em] uppercase mb-8 border border-white/5">
                            <Award size={16} /> CERTIFICATION CENTER
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">需要教育訓練證明？</h2>
                        <p className="text-slate-400 text-xl font-medium mb-12 leading-relaxed">
                            完成指定課程並通過線上測驗後，系統將自動核發電子研習證明。您也可透過「資源中心」查詢您的學習歷程。
                        </p>
                        <Link to="/reports" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-full font-black text-base uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-white/10 active:scale-95">
                            查詢研習紀錄 <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
