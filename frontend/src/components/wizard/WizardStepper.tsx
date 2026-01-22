import React from 'react';
import { Check } from 'lucide-react';

export type WizardStep = 'SELECTION' | 'LOCATION' | 'FORM' | 'EVIDENCE' | 'REVIEW';

interface WizardStepperProps {
    currentStep: string;
    steps: { key: string; label: string; icon?: React.ReactNode }[];
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep, steps }) => {
    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
        <div className="w-full max-w-4xl mx-auto mb-16 px-6">
            <div className="relative flex justify-between items-center">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 rounded-full"
                    style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, idx) => {
                    const isActive = step.key === currentStep;
                    const isCompleted = idx < currentIndex;

                    return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${isActive
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30 scale-110'
                                    : isCompleted
                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                        : 'bg-white border-slate-200 text-slate-300'
                                    }`}
                            >
                                {isCompleted ? (
                                    <Check size={24} strokeWidth={3} className="animate-in zoom-in duration-300" />
                                ) : (
                                    <span className={`text-base md:text-xl font-black ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                        {idx + 1}
                                    </span>
                                )}
                            </div>
                            <div className={`absolute top-full mt-4 text-base font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ${isActive ? 'text-blue-600 opacity-100 mt-6' : 'text-slate-400 opacity-60'
                                }`}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
