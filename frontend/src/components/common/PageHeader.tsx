import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    tag: string;
    title: string;
    subtitle: string;
    description: string;
    onBack?: () => void;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ tag, title, subtitle, description, onBack, children }) => {
    return (
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-8">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all active:scale-95 border border-slate-200"
                        >
                            <ArrowLeft size={20} strokeWidth={3} />
                        </button>
                    )}
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-[0.2em]">
                        {tag}
                    </div>
                </div>
                <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-slate-950 leading-[0.85] uppercase mb-10">
                    {title}<br />
                    <span className="text-blue-600">{subtitle}</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl border-l-4 border-blue-500/20 pl-8">
                    {description}
                </p>
            </div>
            {children && (
                <div className="w-full lg:w-auto">
                    {children}
                </div>
            )}
        </div>
    );
};
