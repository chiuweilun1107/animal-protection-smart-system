import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    AlertTriangle, MapPin, Send, Loader2, ArrowLeft,
    Camera, Shield, Zap, Sparkles, Globe,
    Info, CheckCircle2, X
} from 'lucide-react';
import { reportSchema, type ReportFormData } from '../../types/schema';
import { Captcha, type CaptchaHandle } from '../../components/common/Captcha';
import { PhotoUpload } from '../../components/common/PhotoUpload';
import { MapPicker } from '../../components/map/MapPicker';
import { mockApi } from '../../services/mockApi';

export const Report: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();
    const captchaRef = useRef<CaptchaHandle>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photos, setPhotos] = useState<File[]>([]);

    const isBee = type === 'bee';

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
    } = useForm<ReportFormData>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            location: '新北市板橋區中山路一段161號 (新北市政府)',
            description: '在政府門口發現一隻流浪貓，左耳有剪耳標記，但腳步蹣跚，疑似受傷需協助檢查。',
            contactName: '王小智',
            contactPhone: '0912345678',
            captchaInput: '8832',
        },
    });

    useEffect(() => {
        captchaRef.current?.refresh();
        window.scrollTo(0, 0);
    }, [type]);

    const onSubmit = async (data: ReportFormData) => {
        if (captchaRef.current && !captchaRef.current.validate(data.captchaInput)) {
            setError('captchaInput', { message: '驗證碼錯誤，請重新輸入' });
            captchaRef.current.refresh();
            setValue('captchaInput', '');
            return;
        }

        setIsSubmitting(true);
        try {
            const caseId = await mockApi.createCase({
                type: isBee ? 'bee' : 'general',
                ...data,
                photos: photos.map(f => f.name),
            });
            navigate('/report/success', { state: { caseId } });
        } catch (error) {
            console.error(error);
            alert('通報失敗，請稍後再試');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-40">
            {/* Immersive Header Background */}
            <div className={`fixed top-0 left-0 w-full h-[500px] pointer-events-none transition-all duration-1000 ${isBee ? 'bg-orange-600' : 'bg-slate-900'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 pt-32 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header Details */}
                    <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="max-w-2xl">
                            <Link to="/" className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all mb-10">
                                <ArrowLeft size={16} /> Global Portal
                            </Link>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl ${isBee ? 'bg-orange-500 shadow-orange-500/50' : 'bg-indigo-600 shadow-indigo-600/50'}`}>
                                    {isBee ? <Zap size={32} /> : <Shield size={32} />}
                                </div>
                                <div className="h-10 w-[2px] bg-white/20"></div>
                                <div className="text-white">
                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-1 leading-none">Intelligence Intake</div>
                                    <div className="text-sm font-black uppercase tracking-widest">{isBee ? 'Vespa Ops Unit' : 'Rescue Operations'}</div>
                                </div>
                            </div>
                            <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] uppercase mb-8">
                                {isBee ? 'Bee & Snake' : 'Emergency'}<br />
                                <span className="opacity-40">Report System</span>
                            </h1>
                        </div>
                        <div className="hidden lg:block">
                            <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] text-white max-w-[280px]">
                                <Sparkles size={24} className="text-indigo-400 mb-4" />
                                <p className="text-xs font-medium leading-relaxed opacity-60">
                                    您的通報將透過系統進行即時分類與優先度評估。請提供準確資訊以確保勤務部署精確度。
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Form Area */}
                        <div className="lg:col-span-8 space-y-12">
                            {/* Section 1: Location */}
                            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 md:p-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100">
                                <div className="flex items-center justify-between mb-12">
                                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">01</div>
                                        Geospatial Data
                                    </h2>
                                    <MapPin size={24} className="text-slate-200" />
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Deployment Address</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                                <Navigation size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                {...register('location')}
                                                className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                                placeholder="Enter location or use map below..."
                                            />
                                        </div>
                                        {errors.location && <p className="text-xs font-bold text-rose-500 mt-3 ml-2 flex items-center gap-2 animate-in fade-in"><AlertTriangle size={14} /> {errors.location.message}</p>}
                                    </div>

                                    <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
                                        <MapPicker
                                            onLocationSelect={(lat, lng) => {
                                                setValue('coordinates', { lat, lng });
                                                setValue('location', `${lat.toFixed(5)}, ${lng.toFixed(5)} (Pin Selection)`);
                                            }}
                                        />
                                    </div>
                                    <input type="hidden" {...register('coordinates')} />
                                </div>
                            </div>

                            {/* Section 2: Intel Details */}
                            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 md:p-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                                <div className="flex items-center justify-between mb-12">
                                    <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">02</div>
                                        Incident Intelligence
                                    </h2>
                                    <Info size={24} className="text-slate-200" />
                                </div>

                                <div className="space-y-8">
                                    {isBee && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Tier Classification</label>
                                                <select {...register('beeHiveSize')} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-900 appearance-none">
                                                    <option value="">Select Magnitude...</option>
                                                    <option value="fist">Standard (Small ~10cm)</option>
                                                    <option value="ball">Intermediate (~30cm)</option>
                                                    <option value="tire">Major Class (60cm+)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Positional Sector</label>
                                                <select {...register('beeHivePosition')} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-slate-900 appearance-none">
                                                    <option value="">Select Plane...</option>
                                                    <option value="tree">Aboreal (Tree)</option>
                                                    <option value="eaves">Residential Structure</option>
                                                    <option value="ground">Ground Level</option>
                                                    <option value="other">Anomalous Location</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Mission Description</label>
                                        <textarea
                                            {...register('description')}
                                            rows={5}
                                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-lg text-slate-900 placeholder:text-slate-300 resize-none"
                                            placeholder="Provide detailed situational report..."
                                        />
                                        {errors.description && <p className="text-xs font-bold text-rose-500 mt-3 ml-2 flex items-center gap-2"><AlertTriangle size={14} /> {errors.description.message}</p>}
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                                            Visual Capture <Sparkles size={12} className="text-indigo-400" />
                                        </label>
                                        <div className="p-2 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                                            <PhotoUpload onChange={setPhotos} photos={photos} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar: Submitter + Finalize */}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 animate-in fade-in slide-in-from-right-10 duration-700 delay-300">
                                <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase mb-8 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">03</div>
                                    Origin Details
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Agent Name</label>
                                        <input type="text" {...register('contactName')} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Comms (Phone)</label>
                                        <input type="text" {...register('contactPhone')} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                                        {errors.contactPhone && <p className="text-[10px] font-bold text-rose-500 mt-2 px-1">{errors.contactPhone.message}</p>}
                                    </div>

                                    <div className="pt-8 border-t border-slate-50">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1 block">Credential Hash</label>
                                        <div className="flex flex-col gap-4">
                                            <Captcha ref={captchaRef} />
                                            <input
                                                type="text"
                                                {...register('captchaInput')}
                                                placeholder="Verification Code"
                                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-center font-black tracking-[0.4em] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                                maxLength={4}
                                            />
                                        </div>
                                        {errors.captchaInput && <p className="text-[10px] font-bold text-rose-500 mt-3 px-1">{errors.captchaInput.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-8 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.3em] text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center justify-center gap-4 transition-all active:scale-95 ${isSubmitting ? 'bg-slate-300 cursor-not-allowed' : isBee ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/30' : 'bg-slate-900 hover:bg-indigo-600 shadow-indigo-600/30'}`}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                                    Deploy Report
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="w-full py-6 bg-white border border-slate-100 rounded-[2rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
                                >
                                    Abort Mission
                                </button>
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield size={18} className="text-indigo-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Privacy Protocol</span>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    您的個人資料將依照新北市政府隱私權政策進行加密處理，僅用於案件聯繫與地點核實。
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* Nav icons helper for mobile or decor */}
            <div className="fixed bottom-10 right-10 z-[100] hidden md:flex flex-col gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-slate-200 border border-slate-50">
                    <Globe size={20} />
                </div>
            </div>
        </div>
    );
};
import { Navigation } from 'lucide-react';
