import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, User, Calendar, AlertCircle, CheckCircle,
  ArrowLeft, Clock, Zap, Shield, MoreHorizontal, MessageSquare,
  Save, ChevronRight, FileText
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { Case, User as UserType, Workflow } from '../../types/schema';

export function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCase] = useState<Case | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const [caseDetail, userList, workflowList] = await Promise.all([
            mockApi.getCaseById(id),
            mockApi.getUsers(),
            mockApi.getWorkflows()
          ]);
          setCase(caseDetail);
          setUsers(userList);
          setWorkflows(workflowList);
          if (caseDetail?.assignedTo) setSelectedUser(caseDetail.assignedTo);
        }
      } catch (error) {
        console.error('Failed to load case:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAssign = async () => {
    if (!id || !selectedUser) return;
    try {
      await mockApi.assignCase(id, selectedUser);
      setCase(prev => prev ? { ...prev, assignedTo: selectedUser, status: 'processing' } : null);
    } catch (error) {
      console.error('Assignment failed');
    }
  };

  const handleUpdateStatus = async (newStatus: any) => {
    if (!id) return;
    try {
      await mockApi.updateCase(id, { status: newStatus });
      setCase(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Status update failed');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Retrieving Intelligence...</p>
      </div>
    );
  }

  if (!caseData) return <div className="p-20 text-center text-red-500 font-black">CANNOT RETRIEVE CASE DATA</div>;

  const assignedUser = users.find(u => u.id === caseData.assignedTo);
  const workflow = workflows.find(w => w.type === caseData.type);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-6xl">
      {/* Header Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-[0.2em] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Operations
        </button>
        <div className="flex items-center gap-3">
          <button className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
            <MoreHorizontal size={20} />
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center gap-2">
            <Zap size={16} /> 分派相關單位
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-base font-black text-blue-600 uppercase tracking-[0.3em] font-mono">{caseData.id}</span>
              <div className={`px-3 py-1 rounded-full text-base font-black uppercase tracking-widest border ${caseData.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                  caseData.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                {caseData.status}
              </div>
              <div className={`px-3 py-1 rounded-full text-base font-black uppercase tracking-widest border ${caseData.priority === 'critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                }`}>
                {caseData.priority} PRIORITY
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase leading-[0.9]">
              {caseData.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-6 min-w-[300px]">
          <div>
            <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Created At</div>
            <div className="text-sm font-black text-slate-900">{new Date(caseData.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Case Category</div>
            <div className="text-sm font-black text-slate-900 uppercase tracking-widest">{caseData.type}</div>
          </div>
          <div>
            <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Unit</div>
            <div className="text-sm font-black text-slate-900">{assignedUser?.unit || 'Unassigned'}</div>
          </div>
          <div>
            <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Lead Officer</div>
            <div className="text-sm font-black text-slate-900">{assignedUser?.name || 'Unassigned'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details & Timeline */}
        <div className="lg:col-span-8 space-y-10">

          {/* Location & Map Mini */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">地理位置資訊</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1 space-y-6">
                <div>
                  <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Address</div>
                  <div className="text-lg font-bold text-slate-900">{caseData.location}</div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Latitude</div>
                    <div className="text-sm font-mono font-bold text-slate-600">{caseData.coordinates?.lat.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Longitude</div>
                    <div className="text-sm font-mono font-bold text-slate-600">{caseData.coordinates?.lng.toFixed(6)}</div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 aspect-video md:aspect-square bg-slate-100 rounded-3xl overflow-hidden relative border border-slate-200 group">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-black uppercase text-base tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                  Interactive Mini Map
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl shadow-blue-600/50"></div>
              </div>
            </div>
          </div>

          {/* Reporter & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">報案人聯絡</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Name</div>
                  <div className="text-lg font-bold text-slate-900">{caseData.reporterName}</div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</div>
                  <div className="text-lg font-bold text-slate-900">{caseData.reporterPhone}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">案情描述資料</h3>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                {caseData.description}
              </p>
            </div>
          </div>

          {/* Timeline / Workflow */}
          {workflow && (
            <div className="bg-slate-950 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-2xl font-black tracking-tighter mb-12 uppercase flex items-center gap-3">
                <Shield className="text-blue-500" size={24} />
                案件生命週期追蹤
              </h3>

              <div className="space-y-12 relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-white/10"></div>

                {workflow.steps.map((step, idx) => (
                  <div key={step.id} className="flex gap-8 relative z-10 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 font-black text-xs ${step.status === 'completed' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white' : 'bg-slate-900 border-2 border-slate-800 text-slate-600'
                      }`}>
                      {step.status === 'completed' ? <CheckCircle size={18} /> : step.order}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-lg font-black tracking-tight ${step.status === 'completed' ? 'text-white' : 'text-slate-500'}`}>
                          {step.name}
                        </h4>
                        {step.status === 'completed' && <span className="text-base font-black text-blue-400 uppercase tracking-widest">Completed</span>}
                      </div>
                      <p className={`text-sm leading-relaxed ${step.status === 'completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-600/5 blur-[100px] rounded-full"></div>
            </div>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-4 space-y-10">

          {/* Dynamic Status Control */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-8">
            <h3 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase text-center pr-2">案件處置指令</h3>

            <div className="space-y-3">
              {(['pending', 'processing', 'resolved', 'rejected'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border ${caseData.status === status
                      ? 'bg-slate-900 text-white border-slate-900 scale-[1.02] shadow-xl shadow-slate-900/20'
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-900'
                    }`}
                >
                  {status === 'pending' ? <Clock size={16} /> : status === 'processing' ? <Zap size={16} /> : status === 'resolved' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {status === 'pending' ? '標記為待審核' : status === 'processing' ? '切換至處理中' : status === 'resolved' ? '確認完成結案' : '執行案件駁回'}
                </button>
              ))}
            </div>
          </div>

          {/* Assignment Control */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-6">
            <h3 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase">勤務分派設定</h3>
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-600 outline-none transition-all font-bold text-sm text-slate-900 appearance-none"
                >
                  <option value="">選擇責任承辦員</option>
                  {users.filter(u => u.role === 'caseworker').map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.unit})</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAssign}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20"
              >
                執行分派程序
              </button>
            </div>
            {assignedUser && (
              <div className="pt-4 mt-4 border-t border-slate-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                  {assignedUser.name[0]}
                </div>
                <div>
                  <div className="text-base font-black text-slate-400 uppercase tracking-widest">Active Officer</div>
                  <div className="text-sm font-black text-slate-900">{assignedUser.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Notes & Intel */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase">公務處理備註</h3>
              <MessageSquare className="text-slate-200" size={18} />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="請輸入案件處置相關備註..."
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-900 text-sm h-48 resize-none"
            />
            <button className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
              <Save size={16} /> 保存處置紀錄
            </button>
          </div>

          {/* Quick Access Sidebar link */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 group cursor-pointer overflow-hidden relative">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <p className="text-base font-black text-indigo-300 uppercase tracking-[0.3em] mb-4">Internal Links</p>
              <h4 className="text-xl font-black tracking-tight mb-8">查看案發區域<br />完整歷史報案數據</h4>
              <div className="flex items-center gap-2 text-indigo-200 font-black text-base uppercase tracking-widest group-hover:text-white transition-colors">
                地理數據中心 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <MapPin className="absolute -bottom-6 -right-6 text-white/5 w-32 h-32 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
