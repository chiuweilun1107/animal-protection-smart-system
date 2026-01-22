import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WizardStepper, type WizardStep } from '../../components/wizard/WizardStepper';
import { LocationStep } from '../../components/wizard/LocationStep';
import { DynamicFormStep } from '../../components/wizard/DynamicFormStep';
import { SmartTriageStep } from '../../components/wizard/SmartTriageStep';
import { ReviewStep } from '../../components/wizard/ReviewStep';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const ChoiceCard: React.FC<{
    title: string;
    description: string;
    onClick: () => void;
    active?: boolean;
    label?: string;
    warning?: boolean;
}> = ({ title, description, onClick, active, label, warning }) => (
    <button
        onClick={onClick}
        className={`w-full group relative p-10 bg-white rounded-[3rem] border-2 transition-all duration-500 text-left overflow-hidden ${warning ? 'hover:border-rose-300' : 'hover:border-blue-300'} ${active ? 'border-blue-600 shadow-2xl shadow-blue-600/10' : 'border-slate-100'}`}
    >
        <div className="relative z-10">
            {label && (
                <div className={`inline-block px-4 py-1.5 rounded-full text-base font-black uppercase tracking-widest mb-6 ${warning ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    {label}
                </div>
            )}
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 mb-4 uppercase">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">{description}</p>
        </div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] blur-[80px] rounded-full transition-all duration-700 ${warning ? 'bg-rose-600/5' : 'bg-blue-600/5'} ${active ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`}></div>
    </button>
);

export const SmartGuide: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<WizardStep>('SELECTION');
    const [caseType, setCaseType] = useState<'animal' | 'bee' | 'snake'>('animal');
    const [isEmergency, setIsEmergency] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Wizard Data State
    const [wizardData, setWizardData] = useState({
        selection: {},
        location: { region: '', address: '' },
        form: {},
        priority: 'normal'
    });

    const steps = [
        { key: 'SELECTION' as WizardStep, label: '情境選擇' },
        { key: 'LOCATION' as WizardStep, label: '地點偵測' },
        { key: 'FORM' as WizardStep, label: '通報詳情' },
        { key: 'EVIDENCE' as WizardStep, label: '智慧分流' },
        { key: 'REVIEW' as WizardStep, label: '最終核對' }
    ];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API
        setTimeout(() => {
            setIsSubmitting(false);
            const caseId = `ANS-2023${Math.floor(Math.random() * 90000) + 10000}`;
            navigate('/report/success', { state: { caseId } });
        }, 2000);
    };

    const renderContent = () => {
        switch (currentStep) {
            case 'SELECTION':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-12 uppercase">
                                您需要<br />
                                <span className="text-blue-600">哪種協助？</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl leading-relaxed">
                                歡迎使用多步驟智慧通報系統。請根據您現場觀察到的情況選擇類型，我們將引導您完成數據採集與通報流程。
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <ChoiceCard
                                    onClick={() => { setCaseType('animal'); setCurrentStep('LOCATION'); }}
                                    title="一般動保"
                                    description="受傷救援、棄養通報"
                                />
                                <ChoiceCard
                                    onClick={() => { setCaseType('bee'); setCurrentStep('LOCATION'); }}
                                    title="蜂害移除"
                                    description="蜂巢摘除、大量蜂群"
                                />
                                <ChoiceCard
                                    onClick={() => { setCaseType('snake'); setCurrentStep('LOCATION'); }}
                                    title="蛇類捕捉"
                                    description="民宅侵入、公共區域"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'LOCATION':
                return <LocationStep
                    onNext={(loc) => { setWizardData({ ...wizardData, location: loc }); setCurrentStep('FORM'); }}
                    onBack={() => setCurrentStep('SELECTION')}
                />;

            case 'FORM':
                return <DynamicFormStep
                    caseType={caseType}
                    onNext={(form) => { setWizardData({ ...wizardData, form }); setCurrentStep('EVIDENCE'); }}
                    onBack={() => setCurrentStep('LOCATION')}
                />;

            case 'EVIDENCE':
                return <SmartTriageStep
                    caseType={caseType}
                    onNext={(priority) => { setWizardData({ ...wizardData, priority }); setCurrentStep('REVIEW'); }}
                    onBack={() => setCurrentStep('FORM')}
                />;

            case 'REVIEW':
                return <ReviewStep
                    data={wizardData}
                    isSubmitting={isSubmitting}
                    onNext={handleSubmit}
                    onBack={() => setCurrentStep('EVIDENCE')}
                />;

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center pb-40">
            {/* Layered Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-slate-50/50 pointer-events-none"></div>
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(51 65 85) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

            <div className="relative z-10 w-full px-6 pt-12">
                <WizardStepper currentStep={currentStep} steps={steps} />
                {renderContent()}
            </div>


        </div>
    );
};
