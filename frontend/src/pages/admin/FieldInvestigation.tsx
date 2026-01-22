import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FieldLayout } from '../../components/layout/FieldLayout';
import { WizardStepper } from '../../components/wizard/WizardStepper';
import { CheckInStep } from '../../components/field-investigation/CheckInStep';
import { InvestigationFormStep } from '../../components/field-investigation/InvestigationFormStep';
import { EvidenceStep } from '../../components/field-investigation/EvidenceStep';
import { SignatureStep } from '../../components/field-investigation/SignatureStep';
import { TriplicatePreviewStep } from '../../components/field-investigation/TriplicatePreviewStep';
import { CaseReportStep } from '../../components/field-investigation/CaseReportStep';
import { PageHeader } from '../../components/common/PageHeader';
import { Shield, ArrowLeft } from 'lucide-react';

type WizardStep = 'FORM' | 'EVIDENCE' | 'PREVIEW' | 'SIGNATURE' | 'REPORT' | 'COMPLETE';

export function FieldInvestigation() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<WizardStep>('FORM');
    const [investigationData, setInvestigationData] = useState({
        checkIn: null as any,
        form: null as any,
        evidence: null as any,
        signature: null as any
    });

    // Mock Case Info
    const caseInfo = {
        id: id || '載入中...',
        address: '新北市板橋區縣民大道二段 7 號',
        title: '發現橘色浪貓'
    };

    const handleCheckInComplete = (data: any) => {
        setInvestigationData(prev => ({ ...prev, checkIn: data }));
        setCurrentStep('FORM');
    };

    const handleFormComplete = (data: any) => {
        setInvestigationData(prev => ({ ...prev, form: data }));
        setCurrentStep('EVIDENCE');
    };

    const handleEvidenceComplete = (data: any) => {
        setInvestigationData(prev => ({ ...prev, evidence: data }));
        setCurrentStep('PREVIEW');
    };

    const handlePreviewComplete = () => {
        setCurrentStep('SIGNATURE');
    };

    const handleSignatureComplete = (data: any) => {
        setInvestigationData(prev => ({ ...prev, signature: data }));
        setCurrentStep('REPORT');
    };

    const handleReportComplete = (data: any) => {
        // Here you would typically submit all data to backend
        console.log('Final Submission:', { ...investigationData, report: data });
        // Navigate or show success
        alert('案件已回報並結案！');
        // navigate('/admin/tasks'); // Mock navigation
    };

    const STEPS = [
        { key: 'FORM', label: '訪查紀錄' },
        { key: 'EVIDENCE', label: '現場蒐證' },
        { key: 'PREVIEW', label: '三聯單' },
        { key: 'SIGNATURE', label: '電子簽核' },
        { key: 'REPORT', label: '案件回報' }
    ];

    return (
        <FieldLayout title="外勤執行中">
            <div className="max-w-7xl mx-auto px-6 w-full pt-12">

                {/* Wizard Stepper Container - Minimal */}
                <div className="relative z-40 mb-12">
                    <div className="p-0">
                        <WizardStepper currentStep={currentStep} steps={STEPS} />
                    </div>
                </div>

                {/* Step Content */}
                <div className="mb-32">
                    {currentStep === 'FORM' && (
                        <InvestigationFormStep
                            onNext={handleFormComplete}
                            onPrev={() => navigate('/field/tasks')}
                            caseData={caseInfo}
                        />
                    )}

                    {currentStep === 'EVIDENCE' && (
                        <EvidenceStep
                            onNext={handleEvidenceComplete}
                            onPrev={() => setCurrentStep('FORM')}
                        />
                    )}

                    {currentStep === 'PREVIEW' && (
                        <TriplicatePreviewStep
                            onNext={handlePreviewComplete}
                            onPrev={() => setCurrentStep('EVIDENCE')}
                            caseData={caseInfo}
                            formData={investigationData.form}
                        />
                    )}

                    {currentStep === 'SIGNATURE' && (
                        <SignatureStep
                            onNext={handleSignatureComplete}
                            onPrev={() => setCurrentStep('PREVIEW')}
                        />
                    )}

                    {currentStep === 'REPORT' && (
                        <CaseReportStep
                            onNext={handleReportComplete}
                            onPrev={() => setCurrentStep('SIGNATURE')}
                            caseData={caseInfo}
                        />
                    )}

                    {currentStep === 'COMPLETE' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in zoom-in-95 bg-white border border-slate-100 rounded-[3rem] shadow-xl">
                            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-8 animate-bounce">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 uppercase">任務順利達成</h2>
                            <p className="text-slate-500 font-bold text-lg">正在同步加密數據至中央指揮系統...</p>
                        </div>
                    )}
                </div>
            </div>
        </FieldLayout>
    );
}
