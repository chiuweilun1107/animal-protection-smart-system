import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Undo, CheckCircle2 } from 'lucide-react';

interface SignatureStepProps {
    onNext: (data: any) => void;
    onPrev: () => void;
}

export const SignatureStep: React.FC<SignatureStepProps> = ({ onNext, onPrev }) => {
    const inspectorCanvasRef = useRef<HTMLCanvasElement>(null);
    const citizenCanvasRef = useRef<HTMLCanvasElement>(null);
    const [signatures, setSignatures] = useState({ inspector: false, citizen: false });

    // Setup drawing for a specific canvas
    const setupCanvas = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000000';
            canvas.width = canvas.parentElement?.clientWidth || 300;
            canvas.height = 150;
        }
    };

    useEffect(() => {
        if (inspectorCanvasRef.current) setupCanvas(inspectorCanvasRef.current);
        if (citizenCanvasRef.current) setupCanvas(citizenCanvasRef.current);
    }, []);

    const startDrawing = (e: any, role: 'inspector' | 'citizen') => {
        const canvas = role === 'inspector' ? inspectorCanvasRef.current : citizenCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setSignatures(prev => ({ ...prev, [role]: true }));

        // Store drawing state in a way that handles multiple canvases (simplified for this context)
        (canvas as any).isDrawing = true;
    };

    const draw = (e: any, role: 'inspector' | 'citizen') => {
        const canvas = role === 'inspector' ? inspectorCanvasRef.current : citizenCanvasRef.current;
        if (!canvas || !(canvas as any).isDrawing) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = (role: 'inspector' | 'citizen') => {
        const canvas = role === 'inspector' ? inspectorCanvasRef.current : citizenCanvasRef.current;
        if (canvas) (canvas as any).isDrawing = false;
    };

    const clearSignature = (role: 'inspector' | 'citizen') => {
        const canvas = role === 'inspector' ? inspectorCanvasRef.current : citizenCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatures(prev => ({ ...prev, [role]: false }));
    };

    const handleConfirm = () => {
        onNext({ signatures });
    };


    return (
        <div className="flex-1 flex flex-col bg-slate-50 h-full">
            <div className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-right-8">

                {/* Main Single Container */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8">

                    <div className="border-b border-slate-100 pb-4">
                        <h2 className="text-3xl font-black text-slate-900 mb-3">電子簽名 (Electronic Signature)</h2>
                        <p className="text-slate-500 text-base font-bold">請承辦人員與受稽查人分別於下方欄位簽名。</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Inspector Signature */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded font-black uppercase">承辦人員</span>
                                <span className="text-base font-bold text-slate-700">稽查員簽章</span>
                            </div>
                            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-blue-200 overflow-hidden relative shadow-inner h-40 touch-none">
                                <canvas
                                    ref={inspectorCanvasRef}
                                    className="w-full h-full cursor-crosshair active:cursor-grabbing"
                                    onMouseDown={(e) => startDrawing(e, 'inspector')}
                                    onMouseMove={(e) => draw(e, 'inspector')}
                                    onMouseUp={() => stopDrawing('inspector')}
                                    onMouseLeave={() => stopDrawing('inspector')}
                                    onTouchStart={(e) => startDrawing(e, 'inspector')}
                                    onTouchMove={(e) => draw(e, 'inspector')}
                                    onTouchEnd={() => stopDrawing('inspector')}
                                />
                                {!signatures.inspector && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                        <span className="text-2xl font-black text-slate-300 uppercase">Inspector Sign</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => clearSignature('inspector')}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                                >
                                    <Undo size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Citizen Signature */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded font-black uppercase">受稽查人</span>
                                <span className="text-base font-bold text-slate-700">民眾/業者簽名</span>
                            </div>
                            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-orange-200 overflow-hidden relative shadow-inner h-40 touch-none">
                                <canvas
                                    ref={citizenCanvasRef}
                                    className="w-full h-full cursor-crosshair active:cursor-grabbing"
                                    onMouseDown={(e) => startDrawing(e, 'citizen')}
                                    onMouseMove={(e) => draw(e, 'citizen')}
                                    onMouseUp={() => stopDrawing('citizen')}
                                    onMouseLeave={() => stopDrawing('citizen')}
                                    onTouchStart={(e) => startDrawing(e, 'citizen')}
                                    onTouchMove={(e) => draw(e, 'citizen')}
                                    onTouchEnd={() => stopDrawing('citizen')}
                                />
                                {!signatures.citizen && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                        <span className="text-2xl font-black text-slate-300 uppercase">Citizen Sign</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => clearSignature('citizen')}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
                                >
                                    <Undo size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl text-base text-slate-500 font-medium leading-relaxed border border-slate-100">
                        <strong className="text-slate-700 block mb-1">法律效力聲明</strong>
                        本電子簽名具有與紙本簽名同等之法律效力。簽署即代表雙方已閱覽並確認本次稽查紀錄之內容無誤。
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
                    onClick={handleConfirm}
                    disabled={!signatures.inspector || !signatures.citizen}
                    className={`flex-[2] py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${signatures.inspector && signatures.citizen
                        ? 'bg-slate-900 text-white shadow-slate-900/30 hover:bg-blue-600 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    確認簽署並下一步
                    {(signatures.inspector && signatures.citizen) && <CheckCircle2 size={20} />}
                </button>
            </div>
        </div>
    );
};
