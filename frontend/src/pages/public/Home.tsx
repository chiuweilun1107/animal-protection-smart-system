import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Activity, Globe, Phone, Info, Download, Play, Pause } from 'lucide-react';

import heroShiba from '../../assets/images/hero_shiba.png';
import heroRescue from '../../assets/images/hero_rescue.png';
import heroBee from '../../assets/images/hero_bee.png';
import resourceAdminReportsBg from '../../assets/images/resource_admin_reports_bg.png';
import imgGeneralReport from '../../assets/images/image_general_report.png';
import imgBeeRemoval from '../../assets/images/image_bee_removal.png';
import photoStepAnalysis from '../../assets/images/photo_step_analysis.png';
import photoStepDocs from '../../assets/images/photo_step_docs.png';
import photoStepRescue from '../../assets/images/photo_step_rescue.png';
import imgStepDispatch from '../../assets/images/img_step_dispatch.png';
import bgMapNtpc from '../../assets/images/bg_map_ntpc_ultra.png';

const HERO_SLIDES = [
    {
        id: 1,
        image: heroShiba,
        title: '守護每一顆心跳',
        subtitle: '守護每一個生命，不只是口號，更是我們對新北市動物的最高承諾',
        cta: '即刻通報',
        link: '/smart-guide',
        color: 'from-orange-500/20 to-orange-900/40',
        tag: '核心任務'
    },
    {
        id: 2,
        image: heroRescue,
        title: '專業精英救援',
        subtitle: '專業救援團隊：24小時全年無休，守護受難生命的第一線部署',
        cta: '了解流程',
        link: '/smart-guide',
        color: 'from-blue-600/20 to-slate-900/40',
        tag: '快速響應'
    },
    {
        id: 3,
        image: heroBee,
        title: '環境安全維護',
        subtitle: '生態與安全共存：專業蜂案處理團隊，平衡城市安全與生態保護',
        cta: '通報處理',
        link: '/smart-guide',
        color: 'from-yellow-400/20 to-yellow-900/40',
        tag: '特殊勤務'
    }
];

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const steps = [
        {
            step: '01',
            tag: '情境分析',
            title: '案件情境識別',
            desc: '系統自動判讀案件急迫性與屬性，協助您決定通報優先順序與應對策略。',
            image: photoStepAnalysis
        },
        {
            step: '02',
            tag: '資料整備',
            title: '報案資料整備',
            desc: '即時列出所需照片與證明文件，確保通報內容準確無誤，加速派勤效率。',
            image: photoStepDocs
        },
        {
            step: '03',
            tag: '精準派案',
            title: '精準派案處置',
            desc: '案件自動直達權責單位與最近勤務點，縮短 50% 以上現場處理時間。',
            image: photoStepRescue
        },
        {
            step: '04',
            tag: '透明追蹤',
            title: '全程透明追蹤',
            desc: '提供案件即時狀態查詢與處理進度通知，讓報案人隨時掌握救援最新動態。',
            image: imgStepDispatch
        }
    ];


    useEffect(() => {
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
            }, 6000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying]);

    return (
        <div className="-mt-28 min-h-screen bg-white selection:bg-slate-900 selection:text-white pb-32">
            {/* 1. HERO SECTION */}
            <section className="relative h-[90vh] min-h-[700px] overflow-hidden bg-slate-950">
                {HERO_SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                    >
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    </div>
                ))}

                <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-8 relative z-10">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/90 text-base font-black tracking-[0.3em] uppercase animate-in fade-in slide-in-from-left-4 duration-700">
                                {HERO_SLIDES[currentSlide].tag}
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] uppercase mix-blend-overlay">
                                {HERO_SLIDES[currentSlide].title}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                                {HERO_SLIDES[currentSlide].subtitle}
                            </p>
                            <div className="flex flex-wrap gap-6 pt-8">
                                <Link to={HERO_SLIDES[currentSlide].link} className="px-10 py-5 bg-white text-slate-950 rounded-full font-black text-base uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all transform hover:scale-105 shadow-xl shadow-white/10 flex items-center gap-3">
                                    {HERO_SLIDES[currentSlide].cta} <ArrowRight size={18} />
                                </Link>
                                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-base uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm flex items-center gap-3">
                                    <Play size={18} fill="currentColor" /> 觀看簡介
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-0 right-0 z-20 px-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between border-t border-white/10 pt-8">
                        <div className="flex gap-4">
                            {HERO_SLIDES.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`h-1 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-16 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 text-white/50 hover:text-white transition-colors">
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. REPORTING HUB (Compact Version) */}
            <section className="-mt-16 relative z-30 px-6 mb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-4 flex flex-col md:flex-row overflow-hidden border border-slate-100">
                        {/* Emergency Lines */}
                        <div className="bg-slate-950 rounded-[2rem] p-10 md:p-14 text-white md:w-1/3 flex flex-col justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-none">緊急<br />通報專線</h3>
                                <p className="text-slate-400 text-base font-medium leading-relaxed mb-8">
                                    發現緊急生命救援需求？請優先撥打智慧勤務熱線，由全球調度員直接為您部署。
                                </p>
                            </div>
                            <div className="space-y-4 relative z-10">
                                <a href="tel:1959" className="group/btn flex items-center justify-between p-6 bg-rose-600 rounded-3xl hover:bg-rose-500 transition-all cursor-pointer shadow-lg shadow-rose-900/40 transform active:scale-95">
                                    <div className="flex flex-col">
                                        <span className="text-base font-black uppercase tracking-widest opacity-80 mb-1">動物救援</span>
                                        <span className="text-4xl font-black tracking-tighter">1959</span>
                                    </div>
                                    <Phone className="opacity-50 group-hover/btn:opacity-100 transition-opacity" size={32} />
                                </a>
                                <div onClick={() => navigate('/report/general?category=1999')} className="group/btn flex items-center justify-between p-6 bg-slate-800 rounded-3xl hover:bg-slate-700 transition-all cursor-pointer border border-white/5 active:scale-95">
                                    <div className="flex flex-col">
                                        <span className="text-base font-black uppercase tracking-widest opacity-60 mb-1">市民服務</span>
                                        <span className="text-4xl font-black tracking-tighter">1999</span>
                                    </div>
                                    <Info className="opacity-50 group-hover/btn:opacity-100 transition-opacity" size={32} />
                                </div>
                            </div>
                        </div>

                        {/* Digital Reporting Field */}
                        <div className="flex-1 p-10 md:p-14 bg-white">
                            <div className="flex items-end justify-between mb-10 border-b border-slate-50 pb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                                    <div className="mb-6 md:mb-0">
                                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">案件通報</h3>
                                    </div>
                                    <div className="flex-1 max-w-md relative">
                                        <input
                                            type="text"
                                            placeholder="輸入案件編號追蹤進度..."
                                            id="home-query-input"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all font-bold text-base text-slate-900 placeholder:text-slate-400"
                                        />
                                        <button
                                            onClick={() => {
                                                const val = (document.getElementById('home-query-input') as HTMLInputElement)?.value;
                                                if (val) navigate(`/status?id=${val}`);
                                            }}
                                            className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-black text-base uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                                        >
                                            查詢
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                <Link to="/smart-guide" className="group relative aspect-square rounded-[2rem] overflow-hidden">
                                    <img src={imgGeneralReport} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-base font-black uppercase tracking-widest mb-3">一般案件通報</span>
                                        <h4 className="text-3xl font-black tracking-tighter">動物救援</h4>
                                        <div className="flex items-center gap-2 text-base font-black uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            開始通報 <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/smart-guide" className="group relative aspect-square rounded-[2rem] overflow-hidden">
                                    <img src={imgBeeRemoval} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <span className="inline-block px-3 py-1 bg-amber-500/80 backdrop-blur-md border border-amber-400/20 rounded-full text-base font-black uppercase tracking-widest mb-3">特殊勤務</span>
                                        <h4 className="text-3xl font-black tracking-tighter">蜂蛇案件</h4>
                                        <div className="flex items-center gap-2 text-base font-black uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            開始通報 <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Intelligent Guidance (Circular Steps) */}
            <section id="process-guide" className="py-32 bg-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase mb-8">
                            智慧通報引導
                        </h2>
                        <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                            不確定如何開始？智慧引導系統將協助您判斷案件類別、準備必要文件，並優化通報流程速率。
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-24 left-0 right-0 h-[2px] border-t-2 border-dashed border-slate-200 z-0"></div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
                            {steps.map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="group relative mb-8">
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg z-20 shadow-xl border-4 border-white">
                                            {item.step}
                                        </div>

                                        {/* Circular Image Frame */}
                                        <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl relative transition-all duration-500 group-hover:scale-105 group-hover:border-slate-100">
                                            <img src={item.image} className="absolute inset-0 w-full h-full object-cover transition-all duration-700" />
                                            <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                    </div>

                                    <div className="text-center px-4">
                                        <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-2">{item.tag}</div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tighter mb-3">{item.title}</h4>
                                        <p className="text-slate-500 text-base font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center mt-16">
                        <Link to="/guide" className="group flex items-center gap-6 py-6 px-10 bg-slate-900 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                            開始智慧引導 <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Global Map Experience */}
            <section className="relative h-[650px] flex items-center justify-center bg-fixed bg-center bg-cover" style={{ backgroundImage: `url(${bgMapNtpc})` }}>
                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <div className="p-12 md:p-20 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[4rem] text-center shadow-2xl animate-in fade-in zoom-in duration-1000">
                        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 drop-shadow-md">
                            即時動保地圖
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
                            即時掌握全新北市動保案件熱點與勤務車輛動態，<br className="hidden md:block" />透明化數據助您了解城市脈動。
                        </p>
                        <Link to="/map" className="inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-lg font-black text-slate-950 uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-lg">
                            <Activity className="mr-3 h-5 w-5 text-rose-500 animate-pulse" />
                            進入地圖系統
                        </Link>
                    </div>
                </div>
                <div className="absolute inset-0 bg-black/40"></div>
            </section>

            {/* 5. Resource Hub (Redesigned) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="rounded-[3rem] bg-white border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                        {/* Left Sidebar (Dark) - Stats Center */}
                        <div className="md:w-1/3 bg-slate-950 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-none">資源<br />數據中心</h3>
                                <p className="text-slate-400 text-base font-medium leading-relaxed mb-8">
                                    即時監控全系統文件索引狀態與無障礙服務指標，確保資訊透明公開。
                                </p>
                            </div>

                            {/* Stats Cards - Matching Emergency Lines Style */}
                            <div className="space-y-4 relative z-10">
                                <div className="group/btn flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-base font-black uppercase tracking-widest opacity-60 mb-1">文件索引</span>
                                        <span className="text-4xl font-black tracking-tighter text-slate-200">12k+</span>
                                    </div>
                                    <Globe className="opacity-50 group-hover/btn:opacity-100 transition-opacity text-slate-400" size={32} />
                                </div>
                                <div className="group/btn flex items-center justify-between p-6 bg-slate-800 rounded-3xl hover:bg-slate-700 transition-all cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-base font-black uppercase tracking-widest opacity-80 mb-1">無障礙率</span>
                                        <span className="text-4xl font-black tracking-tighter">99.8%</span>
                                    </div>
                                    <Activity className="opacity-50 group-hover/btn:opacity-100 transition-opacity" size={32} />
                                </div>
                            </div>


                        </div>

                        {/* Right Content (Light) */}
                        <div className="flex-1 p-10 md:p-14 bg-white">
                            {/* Header with Search - EXACT MATCH to Reporting Hub */}
                            <div className="flex items-end justify-between mb-10 border-b border-slate-50 pb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                                    <div className="mb-6 md:mb-0">
                                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">政務資源</h3>
                                    </div>
                                    <div className="flex-1 max-w-md relative">
                                        <input
                                            type="text"
                                            placeholder="搜尋相關文件與報表..."
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all font-bold text-base text-slate-900 placeholder:text-slate-400"
                                        />
                                        <button className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-black text-base uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
                                            查詢
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                {/* Card 1: Administrative Reports */}
                                <Link to="/reports" className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <img src={resourceAdminReportsBg} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="px-3 py-1 bg-slate-800 text-white text-base font-black rounded-full uppercase tracking-widest inline-block mb-3">
                                            STATISTICAL DATA
                                        </div>
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">行政報表</h3>
                                        <p className="text-slate-300 text-lg font-medium opacity-80 mb-6">獲取透明、開源的動保數據</p>
                                        <div className="flex items-center gap-2 text-white font-black text-base uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                            立即下載 <Download size={20} />
                                        </div>
                                    </div>
                                </Link>

                                {/* Card 2: Education Training */}
                                <Link to="/academy" className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <img src={photoStepAnalysis} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-base font-black rounded-full uppercase tracking-widest inline-block mb-3 border border-white/10">
                                            ACADEMY MODULE
                                        </div>
                                        <h3 className="text-3xl font-black text-white tracking-tight mb-2">教育訓練</h3>
                                        <p className="text-slate-200 text-lg font-medium opacity-80 mb-6">專業人員教育訓練與資源庫</p>
                                        <div className="flex items-center gap-2 text-white font-black text-base uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                            進入學院 <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Knowledge Index (Redesigned) */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="rounded-[3rem] bg-white border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                        {/* Left Sidebar (Dark) - FAQ Center */}
                        <div className="md:w-1/3 bg-slate-950 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">服務百科</h3>
                                    <p className="text-slate-400 text-base font-bold tracking-widest uppercase">百科全書 • FAQ</p>
                                </div>

                                <div className="space-y-4 mb-10">
                                    {[
                                        { q: '如何通報受傷野貓？', a: '您可以撥打 24 小時專線 1959，或在本門戶點擊「一般案件通報」。提供正確的地點、照片將有助於加速救援。' },
                                        { q: '具體通報文件清單', a: '基本需提供：1. 現場影像 2. 精確位置 3. 報案者基本聯絡資訊，確保後續查核。' },
                                        { q: '案件與法律責任', a: '虐待動物最高處二年徒刑及 200 萬罰金。本處針對所有舉報案均進行嚴格司法稽核。' },
                                        { q: '蜂蛇案件處理時效', a: '蜂蛇案件為緊急響應勤務，系統將自動派發最近分隊，平均抵達時間約 30-60 分鐘。' },
                                        { q: '誘捕籠申請流程', a: '請至資源中心下載申請表並提交至動保處核准，核准後即可前往指定地點借用。' },
                                        { q: '絕育補助申請條件', a: '設籍新北市且完成寵物登記之飼主，可依當年度預算申請 1,000-2,000 元補助。' }
                                    ].map((item, i) => {
                                        const isOpen = openFaqIndex === i;
                                        return (
                                            <div key={i} className={`group/item flex flex-col p-6 bg-white/5 border transition-all cursor-pointer rounded-2xl ${isOpen ? 'bg-white/10 border-white/20' : 'border-white/5 hover:bg-white/10'}`} onClick={() => setOpenFaqIndex(isOpen ? null : i)}>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className={`text-xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-slate-300 group-hover/item:text-white'}`}>{item.q}</span>
                                                    <ChevronRight size={20} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-90 text-white' : 'group-hover/item:translate-x-1'}`} />
                                                </div>
                                                <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-60 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                                    <p className="text-base text-slate-400 leading-relaxed font-medium">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Link to="/faq" className="group/btn flex items-center justify-between p-6 bg-slate-800 rounded-3xl hover:bg-slate-700 transition-all cursor-pointer border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-base font-black uppercase tracking-widest opacity-80 mb-1">知識庫入口</span>
                                        <span className="text-xl font-black tracking-tight">瀏覽全問答</span>
                                    </div>
                                    <ArrowRight className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all" size={24} />
                                </Link>
                            </div>

                            {/* Background Deco */}
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
                        </div>

                        {/* Right Content (Light) - Universal News Feed */}
                        <div className="flex-1 p-10 md:p-14 bg-white">
                            {/* Header with Search - EXACT MATCH to Master Style */}
                            <div className="flex items-end justify-between mb-10 border-b border-slate-50 pb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                                    <div className="mb-6 md:mb-0">
                                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">最新公告</h3>
                                    </div>
                                    <div className="flex-1 max-w-md relative">
                                        <input
                                            type="text"
                                            placeholder="搜尋歷史公告或關鍵字..."
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all font-bold text-base text-slate-900 placeholder:text-slate-400"
                                        />
                                        <button className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-black text-base uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
                                            搜尋
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { date: '2023.11.20', title: '【重要】新北市動保處年終防疫總檢討會議通知', urgent: true, tag: '官方' },
                                    { date: '2023.11.18', title: '動物保護法部分條文修正案正式施行，請關注相關法規更新', urgent: false, tag: '法規' },
                                    { date: '2023.11.15', title: '年度狂犬病疫苗巡迴施打時程表出爐（112年12月至113年2月）', urgent: false, tag: '公告' },
                                    { date: '2023.11.12', title: '關於「流浪犬貓收容中心」冬季保暖物資募集與捐贈說明', urgent: false, tag: '活動' }
                                ].map((item, i) => (
                                    <Link key={i} to="/news" className="group flex items-center gap-8 p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                                        <div className="flex flex-col items-center justify-center min-w-[70px] py-4 bg-slate-900 border border-white/5 rounded-2xl text-white">
                                            <span className="text-base font-black opacity-40 uppercase mb-1">{item.date.split('.')[1]}月</span>
                                            <span className="text-xl font-black">{item.date.split('.')[2]}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {item.urgent && (
                                                    <span className="px-3 py-1 bg-rose-600 text-base font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-rose-600/20">優先</span>
                                                )}
                                                <span className="px-3 py-1 bg-slate-100 text-base font-black text-slate-600 rounded-full uppercase tracking-widest border border-slate-200">{item.tag}</span>
                                            </div>
                                            <h4 className="text-lg font-black tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-1">{item.title}</h4>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:border-slate-300 transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                                            <ArrowRight size={18} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
