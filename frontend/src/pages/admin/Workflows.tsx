import { useEffect, useState } from 'react';
import {
  Plus, Edit3, Eye, Zap,
  ArrowRight, CheckCircle, Clock,
  Settings, Copy, Trash2, Shield,
  Activity, ChevronRight
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Workflow, WorkflowStep } from '../../types/schema';
import { WorkflowEditor } from '../../components/WorkflowEditor';

export function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getWorkflows();
      setWorkflows(data);
      if (data.length > 0) setSelectedWorkflow(data[0]);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">同步流程中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-yellow-500"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">流程引擎</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">工作流程</h1>
        </div>
        <div className="flex gap-4">
          {selectedWorkflow && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-8 py-4 transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-2 ${
                isEditMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-950 text-white hover:bg-yellow-500'
              }`}
            >
              {isEditMode ? (
                <>
                  <Eye size={18} /> 預覽模式
                </>
              ) : (
                <>
                  <Edit3 size={18} /> 編輯模式
                </>
              )}
            </button>
          )}
          <button className="px-8 py-4 bg-slate-950 text-white hover:bg-yellow-500 hover:text-white transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-2">
            <Plus size={18} /> 新建流程
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Workflow Registry Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-6 border-b-2 border-slate-950 pb-2">啟用的流程</h3>
            <div className="flex flex-col gap-2">
              {workflows.map(wf => (
                <button
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`w-full text-left px-6 py-5 transition-all group relative border ${selectedWorkflow?.id === wf.id
                    ? 'bg-slate-950 text-white border-slate-950'
                    : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-950 hover:text-slate-950'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-base font-black uppercase tracking-widest ${selectedWorkflow?.id === wf.id ? 'text-yellow-500' : 'text-slate-300'}`}>{wf.id}</span>
                        <span className="font-black text-base uppercase tracking-widest">{wf.name}</span>
                      </div>
                      <div className="text-base font-black uppercase tracking-widest text-slate-400 opacity-60">類別: {wf.type}</div>
                    </div>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${selectedWorkflow?.id === wf.id ? 'translate-x-1 text-yellow-500' : 'text-slate-300'}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Info - Raw */}
          <div>
            <h4 className="text-base font-black text-yellow-500 uppercase tracking-widest mb-4">系統狀態</h4>
            <div className="text-4xl font-black text-slate-950 tracking-tighter mb-2">{workflows.length} <span className="text-lg text-slate-400">個流程</span></div>
            <p className="text-base font-medium text-slate-400 leading-relaxed max-w-xs">
              所有流程運作正常，稽核軌跡已啟用。
            </p>
          </div>
        </div>

        {/* Workflow Logic Canvas - Blueprint */}
        <div className="lg:col-span-8">
          {selectedWorkflow && isEditMode ? (
            <div className="h-[800px] border-2 border-slate-950 animate-in slide-in-from-right-8 duration-500">
              <WorkflowEditor
                workflowId={selectedWorkflow.id}
                workflowName={selectedWorkflow.name}
                initialSteps={selectedWorkflow.steps}
                onSave={(nodes, edges) => {
                  console.log('Saved workflow:', { nodes, edges });
                }}
              />
            </div>
          ) : selectedWorkflow && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              {/* Detail Header */}
              <div className="pb-8 border-b-2 border-slate-100 flex items-end justify-between">
                <div className="space-y-4">
                  <span className={`inline-block px-3 py-1 text-base font-black uppercase tracking-[0.2em] ${selectedWorkflow.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {selectedWorkflow.isActive ? '系統啟用' : '系統閒置'}
                  </span>
                  <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase">{selectedWorkflow.name}</h2>
                  <p className="text-base font-mono text-slate-400 uppercase tracking-widest">流程類別: {selectedWorkflow.type}</p>
                </div>
                <div className="flex gap-4">
                  <button className="p-4 border border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-colors">
                    <Copy size={18} />
                  </button>
                  <button className="p-4 border border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-colors">
                    <Settings size={18} />
                  </button>
                </div>
              </div>

              {/* Logical Steps Visualization - Schematic Tree */}
              <div className="relative pl-4">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

                <div className="space-y-12">
                  {selectedWorkflow.steps.map((step, idx) => (
                    <div key={step.id} className="relative z-10 flex gap-8 group">
                      {/* Node */}
                      <div className={`w-10 h-10 rounded-full border-4 flex-shrink-0 flex items-center justify-center transition-colors bg-white ${step.status === 'completed' ? 'border-emerald-500 text-emerald-500' : 'border-slate-950 text-slate-950'
                        }`}>
                        <div className={`w-3 h-3 rounded-full ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-950'}`}></div>
                      </div>

                      {/* Content */}
                      <div className="pt-1 w-full">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <span className="text-base font-mono font-bold text-slate-300">0{step.order}</span>
                            <h4 className="text-2xl font-black tracking-tight text-slate-950 uppercase group-hover:text-yellow-600 transition-colors">{step.name}</h4>
                          </div>
                          {step.status === 'completed' && <CheckCircle size={18} className="text-emerald-500" />}
                        </div>
                        <p className="text-base text-slate-500 font-medium leading-relaxed max-w-xl mb-4 pl-10 border-l-2 border-transparent group-hover:border-yellow-500 transition-all">
                          {step.description}
                        </p>

                        {step.requiredFields && step.requiredFields.length > 0 && (
                          <div className="pl-10 flex flex-wrap gap-2">
                            {step.requiredFields.map(field => (
                              <span key={field} className="text-base font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-1">
                                Req: {field}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Controls */}
              <div className="pt-12 border-t-2 border-slate-100 flex gap-6">
                <button className="flex-1 py-6 bg-slate-950 text-white hover:bg-yellow-500 hover:text-white transition-colors font-black text-base uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                  <Edit3 size={18} /> 重新校正流程
                </button>
                <button className="px-12 py-6 border-2 border-slate-200 text-slate-400 hover:border-rose-500 hover:text-rose-500 transition-colors font-black text-base uppercase tracking-[0.2em]">
                  <Trash2 size={18} /> 終止
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
