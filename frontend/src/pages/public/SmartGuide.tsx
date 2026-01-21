import React, { useState, useEffect } from 'react';
import {
    Shield, ArrowRight, ArrowLeft, Heart, Zap,
    HelpCircle, CheckCircle2, AlertCircle, Sparkles,
    Activity, ShieldAlert, Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Step = 'start' | 'animal_v_bee' | 'is_injured' | 'is_aggressive' | 'result_general' | 'result_bee' | 'result_emergency';

export const SmartGuide: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('start');
    const [history, setHistory] = useState<Step[]>([]);
    const [animating, setAnimating] = useState(false);

    const goTo = (next: Step) => {
        setAnimating(true);
        setTimeout(() => {
            setHistory([...history, step]);
            setStep(next);
            setAnimating(false);
        }, 300);
    };

    const goBack = () => {
        if (history.length > 0) {
            setAnimating(true);
            setTimeout(() => {
                const prev = history[history.length - 1];
                setHistory(history.slice(0, -1));
                setStep(prev);
                setAnimating(false);
            }, 300);
        } else {
            navigate('/');
        }
    };

    const ChoiceCard = ({ title, desc, icon: Icon, onClick, color = 'blue' }: any) => (
        <button
            onClick={onClick}
            className="group relative w-full p-10 bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
        >
            <div className={`w-24 h-24 rounded-[2rem] bg-slate-50 text-slate-800 flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-sm`}>
                <Icon size={40} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xs">{desc}</p>
            <div className="mt-8 flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Select Option <ArrowRight size={14} />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
        </button>
    );

    return (
        <div className="fixed inset-0 bg-[#F8FAFC] overflow-hidden flex flex-col font-sans">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 blur-[150px] rounded-full"></div>
            </div>

            {/* Header Navigation */}
            <header className="relative z-20 p-10 flex items-center justify-between">
                <button
                    onClick={goBack}
                    className="flex items-center gap-4 px-6 py-4 bg-white/50 backdrop-blur-md rounded-2xl border border-white shadow-lg shadow-black/5 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all font-black text-xs uppercase tracking-widest"
                >
                    <ArrowLeft size={18} /> Exit Guidance
                </button>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1 leading-none">Intelligence Assistant</div>
                        <div className="text-sm font-black text-slate-900 uppercase">Diagnostic Flow v2.4</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-xl shadow-slate-900/20">
                        <Sparkles size={24} className="text-indigo-400" />
                    </div>
                </div>
            </header>

            {/* Main Guidance Canvas */}
            <main className={`flex-1 relative z-10 flex flex-col items-center justify-center px-6 transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

                {step === 'start' && (
                    <div className="max-w-6xl w-full flex flex-col items-center">
                        <div className="text-center mb-20 space-y-6">
                            <div className="inline-block px-4 py-2 bg-indigo-500/10 text-indigo-600 border border-indigo-200 rounded-full text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                                Initial Situation Assessment
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 leading-[0.85] uppercase">
                                What is the<br />
                                <span className="text-indigo-600">Scenario?</span>
                            </h1>
                            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
                                歡迎進入智慧勤務引導系統。請根據您現場觀察到的情況，選擇最符合的案件類型。
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
                            <ChoiceCard
                                title="一般動保案件"
                                desc="涉及流浪犬貓受傷、受困、非法買賣或疑似虐待動物等情況。"
                                icon={Heart}
                                onClick={() => goTo('animal_v_bee')}
                            />
                            <ChoiceCard
                                title="蜂蛇移除勤務"
                                desc="居家環境內發現蛇類入侵、虎頭蜂窩或其他具威脅性節肢動物。"
                                icon={Zap}
                                onClick={() => goTo('animal_v_bee')}
                            />
                        </div>
                    </div>
                )}

                {step === 'animal_v_bee' && (
                    <div className="max-w-6xl w-full flex flex-col items-center">
                        <div className="text-center mb-20 space-y-4">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-4">Diagnostic Level 02</div>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 uppercase">Is there an<br /><span className="text-indigo-600">Injury?</span></h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
                            <ChoiceCard
                                title="急迫性傷病"
                                desc="目前觀察到明顯外傷、大量出血、意識不清或無法站立，生命體徵不穩。"
                                icon={ShieldAlert}
                                onClick={() => goTo('result_emergency')}
                            />
                            <ChoiceCard
                                title="非急迫性諮詢"
                                desc="動物無明顯傷勢，但需要尋求安置、走失協尋或環境不潔等一般通報。"
                                icon={Activity}
                                onClick={() => goTo('result_general')}
                            />
                        </div>
                    </div>
                )}

                {/* Result Steps */}
                {step === 'result_general' && (
                    <div className="max-w-4xl w-full bg-white rounded-[4rem] border border-slate-100 shadow-2xl p-20 text-center animate-in zoom-in-95 duration-700 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-indigo-600/30">
                                <CheckCircle2 size={64} />
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter mb-8 uppercase text-slate-900">Standard Protocol</h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed mb-16 max-w-2xl">
                                診斷完畢。根據您的填報，此案件屬於 **「一般勤務通報」** 範疇。請前往填寫詳細案件內容，並確保上傳現場佐證照片。
                            </p>
                            <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
                                <button
                                    onClick={() => navigate('/report/general')}
                                    className="flex-1 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-4 group"
                                >
                                    Start Reporting <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-10 py-6 border-2 border-slate-100 text-slate-400 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all"
                                >
                                    Home
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-slate-50 rounded-full"></div>
                    </div>
                )}

                {step === 'result_emergency' && (
                    <div className="max-w-4xl w-full bg-slate-950 rounded-[4rem] text-white p-20 text-center animate-in zoom-in-95 duration-700 relative overflow-hidden shadow-[0_50px_100px_rgba(225,29,72,0.2)]">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 bg-rose-600 text-white rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-rose-600/50 animate-pulse">
                                <ShieldAlert size={64} />
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter mb-8 uppercase">Emergency Response</h2>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed mb-16 max-w-2xl">
                                系統判定為 **「緊急生命案件」** 。為了最快速度部署勤務，請立即撥打緊急熱線，線上調度員將引導您執行現場處置。
                            </p>

                            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[3rem] p-10 mb-16 backdrop-blur-md">
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em] mb-4">Priority Hotline</p>
                                <div className="text-8xl font-black tracking-tighter text-white">1959</div>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xl hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                            >
                                Acknowledgement (Back to Portal)
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-full h-full bg-rose-600/5 blur-[120px] rounded-full"></div>
                    </div>
                )}
            </main>

            {/* Bottom Progress Bar */}
            <footer className="relative z-20 p-10 flex items-center justify-center">
                <div className="flex gap-4">
                    {['start', 'animal_v_bee', 'result'].map((s, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-700 ${(s === 'start' && step === 'start') ||
                                    (s === 'animal_v_bee' && step === 'animal_v_bee') ||
                                    (s === 'result' && step.startsWith('result'))
                                    ? 'w-16 bg-indigo-600' : 'w-8 bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
            </footer>
        </div>
    );
};
