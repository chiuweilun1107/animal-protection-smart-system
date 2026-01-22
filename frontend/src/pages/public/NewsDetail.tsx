import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2, Printer } from 'lucide-react';

// Mock Data Source (In real app this would be an API fetch)
const MOCK_NEWS_DB = {
    '1': {
        title: '【熱區警示】板橋區近期接獲多起蜂案通報，請民眾留意。',
        date: '2023-11-20',
        category: '安全警示',
        content: `
            <p class="text-xl leading-relaxed text-slate-600 mb-10 font-medium">新北市政府動物保護防疫處（以下簡稱動保處）近日透過智慧勤務系統大數據分析發現，本市板橋區大觀路一帶，近期連續接獲多起民眾通報發現虎頭蜂窩案件。經現場人員勘查，多位於公園樹叢及住宅屋簷下。</p>
            
            <h3 class="text-3xl font-black text-slate-900 mb-6 mt-12 tracking-tight uppercase">主要發生區域與特徵</h3>
            <p class="text-lg leading-relaxed text-slate-600 mb-8 font-medium">目前熱區集中於大觀路二段河濱公園周遭，以及浮洲橋下自行車道旁。該區域植被茂密，適合蜂類築巢。動保處已派遣專業團隊進行巡查與摘除作業，截至昨日已移除 5 處中型蜂巢。</p>

            <h3 class="text-3xl font-black text-slate-900 mb-6 mt-12 tracking-tight uppercase">民眾防護指引</h3>
            <ul class="list-disc pl-6 space-y-4 mb-10 text-lg font-medium text-slate-600 marker:text-slate-300">
                <li>行經該區域請勿大聲喧嘩或刻意搖晃樹木。</li>
                <li>避免穿著鮮豔衣物或噴灑濃香水，以免吸引蜂群。</li>
                <li>若發現蜂巢，請立即撥打 1999 或透過本系統線上通報，切和自行處理。</li>
                <li>若遭蜂螫，請立即就醫，並告知醫師叮咬地點。</li>
            </ul>

            <div class="p-8 bg-slate-50 border-l-4 border-slate-900 rounded-r-2xl my-10">
                <p class="text-lg font-black text-slate-800 m-0">動保處強調，秋冬季節雖蜂群活動力下降，但仍具攻擊性，請市民朋友提高警覺。我們將持續監控該區域狀況，確保公共安全。</p>
            </div>
        `,
        image: '/news_bee_alert.png',
        author: '新北市動保處 應變中心'
    },
    '2': {
        title: '「智慧勤務管理系統」正式啟動，提升報案反應速度 30%。',
        date: '2023-11-18',
        category: '機關新聞',
        content: `
            <p class="text-xl leading-relaxed text-slate-600 mb-10 font-medium">為提升動保案件處理效率，新北市政府今日正式宣布啟用全新「勤務及案管整合智慧系統」。這套系統整合了最新的 GIS 地理資訊技術與 AI 決策輔助模組，標誌著本市動保行政邁入數位轉型新紀元。</p>
            
            <p class="text-lg leading-relaxed text-slate-600 mb-8 font-medium">系統三大核心功能包含：</p>
            <ol class="list-decimal pl-6 space-y-6 mb-10 text-lg font-medium text-slate-600 marker:text-slate-900 marker:font-black">
                <li class="pl-2"><strong>智慧引導通報</strong><span class="block text-base text-slate-400 mt-2">透過前端互動式引導，協助民眾快速釐清案情，減少無效通報。</span></li>
                <li class="pl-2"><strong>自動化派案</strong><span class="block text-base text-slate-400 mt-2">系統依據案件地點與緊急程度，自動指派最近的勤務車輛，預計縮短平均抵達時間達 30%。</span></li>
                <li class="pl-2"><strong>透明化進度追蹤</strong><span class="block text-base text-slate-400 mt-2">民眾可隨時查詢案件處理進度，落實行政公開透明。</span></li>
            </ol>

            <p class="text-lg leading-relaxed text-slate-600 mb-8 font-medium">動保處處長表示：「生命的救援分秒必爭，科技的導入不僅是為了行政效率，更是為了每一個待援的生命。」未來系統將持續擴充功能，加入更多元的数据分析模組。</p>
        `,
        image: '/news_system_launch.png',
        author: '新北市動保處 秘書室'
    }
};

export const NewsDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);

    useEffect(() => {
        // Simulate fetch
        if (id && MOCK_NEWS_DB[id as keyof typeof MOCK_NEWS_DB]) {
            setArticle(MOCK_NEWS_DB[id as keyof typeof MOCK_NEWS_DB]);
        } else {
            // Fallback content for demo purposes if ID doesn't match mock
            setArticle({
                title: '系統公告：該文章內容已封存或不存在',
                date: '2023-01-01',
                category: '系統訊息',
                content: '<p>無法找到您請求的文章內容，可能已經移除或連結錯誤。</p>',
                author: 'System'
            });
        }
    }, [id]);

    if (!article) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-40">
            {/* Header / Nav */}
            <div className="bg-white/80 border-b border-slate-100 sticky top-0 z-40 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/news')}
                        className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="font-black text-base uppercase tracking-widest">其他公告</span>
                    </button>
                    <div className="flex gap-4">
                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="分享">
                            <Share2 size={20} />
                        </button>
                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="列印" onClick={() => window.print()}>
                            <Printer size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-12">
                    <span className={`px-4 py-2 rounded-full text-base font-black uppercase tracking-widest border ${article.category === '安全警示'
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {article.category}
                    </span>
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-base uppercase tracking-widest">
                        <Calendar size={16} /> {article.date}
                    </span>
                    <span className="text-slate-200">/</span>
                    <span className="text-slate-400 font-bold text-base uppercase tracking-widest">
                        POSTED BY {article.author}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-20 decoration-slate-900/10">
                    {article.title}
                </h1>

                {/* Body */}
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-slate prose-lg md:prose-xl max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    >
                    </div>

                    {/* Footer Section */}
                    <div className="mt-32 pt-16 border-t border-slate-200">
                        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">需要即時協助？</h3>
                                <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto leading-relaxed">如有任何疑問，或發現類似狀況，請使用下方按鈕進行通報或查詢。</p>
                                <div className="flex flex-col md:flex-row gap-6 justify-center">
                                    <Link to="/faq" className="px-10 py-5 bg-white/10 text-white border border-white/10 rounded-full font-black text-base uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                                        常見問答
                                    </Link>
                                    <Link to="/report/general" className="px-10 py-5 bg-white text-slate-950 rounded-full font-black text-base uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/10">
                                        前往通報
                                    </Link>
                                </div>
                            </div>

                            {/* Deco */}
                            <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-600/30 blur-[100px] rounded-full"></div>
                        </div>
                    </div>
                </div>

            </article>
        </div>
    );
};
