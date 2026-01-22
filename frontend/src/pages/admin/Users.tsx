import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, Search, Filter,
  ShieldCheck, UserCheck, ShieldAlert,
  Mail, Phone, X, Lock, Unlock, KeyRound,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import type { User } from '../../types/schema';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: User['role'];
    unit: string;
    phone: string;
    status: User['status'];
  }>({
    name: '',
    email: '',
    role: 'caseworker',
    unit: '',
    phone: '',
    status: 'active'
  });

  // 權限編輯對話框狀態
  const [roleEditDialog, setRoleEditDialog] = useState<{
    show: boolean;
    userId: string | null;
    userName: string | null;
    currentRole: User['role'] | null;
    newRole: User['role'] | null;
  }>({
    show: false,
    userId: null,
    userName: null,
    currentRole: null,
    newRole: null
  });

  // 確認對話框狀態
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    type: 'freeze' | 'activate' | 'reset' | 'delete' | null;
    userId: string | null;
    userName: string | null;
  }>({
    show: false,
    type: null,
    userId: null,
    userName: null
  });

  // 提示訊息狀態
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // 提示訊息自動隱藏
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await mockApi.updateUser(editingId, formData);
        setUsers(users.map(u => u.id === editingId ? { ...u, ...formData } : u));
      } else {
        const newId = await mockApi.createUser(formData as any);
        setUsers([...users, { id: newId, ...formData, createdAt: new Date().toISOString() } as User]);
      }
      resetForm();
    } catch (error) {
      console.error('Save failed');
    }
  };

  const handleEdit = (user: User) => {
    setRoleEditDialog({
      show: true,
      userId: user.id,
      userName: user.name,
      currentRole: user.role,
      newRole: user.role
    });
  };

  const handleRoleUpdate = async () => {
    const { userId, newRole } = roleEditDialog;
    if (!userId || !newRole) return;

    try {
      const success = await mockApi.updateUser(userId, { role: newRole });
      if (success) {
        showNotification('success', '權限已更新');
        await loadUsers();
      } else {
        showNotification('error', '更新失敗，請稍後重試');
      }
    } catch (error) {
      console.error('Role update failed:', error);
      showNotification('error', '操作過程中發生錯誤');
    } finally {
      setRoleEditDialog({ show: false, userId: null, userName: null, currentRole: null, newRole: null });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'caseworker', unit: '', phone: '', status: 'active' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFreezeAccount = async (userId: string, userName: string) => {
    setConfirmDialog({
      show: true,
      type: 'freeze',
      userId,
      userName
    });
  };

  const handleActivateAccount = async (userId: string, userName: string) => {
    setConfirmDialog({
      show: true,
      type: 'activate',
      userId,
      userName
    });
  };

  const handleResetPassword = async (userId: string, userName: string) => {
    setConfirmDialog({
      show: true,
      type: 'reset',
      userId,
      userName
    });
  };

  const handleDelete = (userId: string, userName: string) => {
    setConfirmDialog({
      show: true,
      type: 'delete',
      userId,
      userName
    });
  };

  const confirmAction = async () => {
    const { type, userId, userName } = confirmDialog;
    if (!type || !userId) return;

    try {
      let success = false;
      let message = '';

      if (type === 'freeze') {
        success = await mockApi.freezeAccount(userId, '由管理員凍結');
        message = '帳戶已凍結';
      } else if (type === 'activate') {
        success = await mockApi.activateAccount(userId);
        message = '帳戶已啟用';
      } else if (type === 'reset') {
        const tempPassword = await mockApi.resetPassword(userId);
        success = !!tempPassword;
        message = `密碼已重設，臨時密碼已發送至郵箱：${tempPassword}`;
      } else if (type === 'delete') {
        success = await mockApi.deleteUser(userId);
        message = `用戶 ${userName} 已移除`;
      }

      if (success) {
        showNotification('success', message);
        await loadUsers();
      } else {
        showNotification('error', '操作失敗，請稍後重試');
      }
    } catch (error) {
      console.error('Action failed:', error);
      showNotification('error', '操作過程中發生錯誤');
    } finally {
      setConfirmDialog({ show: false, type: null, userId: null, userName: null });
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-md text-base font-black uppercase tracking-widest border border-red-100"><ShieldAlert size={12} /> 管理員</span>;
      case 'supervisor': return <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-base font-black uppercase tracking-widest border border-indigo-100"><ShieldCheck size={12} /> 主管</span>;
      default: return <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-base font-black uppercase tracking-widest border border-blue-100"><UserCheck size={12} /> 承辦人</span>;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">

      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-indigo-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">存取控管</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">用戶管理</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-slate-950 text-white hover:bg-indigo-600 transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-3"
        >
          <Plus size={18} /> 新增用戶
        </button>
      </div>

      {/* Filter Bar - De-containerized */}
      <div className="flex flex-col lg:flex-row items-center gap-8 py-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-950 transition-colors" size={24} />
          <input
            type="text"
            placeholder="搜尋身份資料庫..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-transparent border-b-2 border-slate-100 focus:border-slate-950 outline-none transition-all font-black text-xl text-slate-950 placeholder:text-slate-200 uppercase tracking-widest"
          />
        </div>
        <div className="flex items-center gap-0 border-2 border-slate-100">
          <button className="px-8 py-3 bg-transparent hover:bg-slate-100 transition-colors font-black text-base uppercase tracking-widest text-slate-400 hover:text-slate-950 flex items-center gap-2">
            <Filter size={16} /> 篩選
          </button>
          <div className="w-0.5 h-6 bg-slate-100"></div>
          <button className="px-8 py-3 bg-transparent hover:bg-slate-100 transition-colors font-black text-base uppercase tracking-widest text-slate-400 hover:text-slate-950">
            匯出 CSV
          </button>
        </div>
      </div>

      {/* User List - Architectural Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-slate-950">
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em]">用戶檔案</th>
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em]">存取權限</th>
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em]">單位歸屬</th>
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em]">聯絡資訊</th>
              <th className="px-6 py-6 text-base font-black text-slate-950 uppercase tracking-[0.2em]">狀態</th>
              <th className="px-6 py-6 text-right text-base font-black text-slate-950 uppercase tracking-[0.2em]">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-8 border-b border-slate-100">
                    <div className="h-2 bg-slate-100 w-full mb-2"></div>
                    <div className="h-2 bg-slate-50 w-2/3"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-100">
                <td className="px-6 py-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-950 border-2 border-slate-200 group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white transition-all">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-950 tracking-tight">{user.name}</div>
                      <div className="text-base font-black text-slate-300 uppercase tracking-widest mt-1 font-mono">編號：{user.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-8">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-8">
                  <div className="text-base font-bold text-slate-900 uppercase tracking-wider">{user.unit}</div>
                </td>
                <td className="px-6 py-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-base font-bold text-slate-500">
                      <Mail size={14} className="text-slate-300" /> {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-base font-bold text-slate-500">
                        <Phone size={14} className="text-slate-300" /> {user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-8">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300 animate-pulse'}`}></div>
                    <span className={`text-base font-black uppercase tracking-widest ${user.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-8 text-right">
                  <div className="flex items-center justify-end gap-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-4 hover:bg-slate-200 text-slate-400 hover:text-slate-950 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleFreezeAccount(user.id, user.name)}
                        className="p-4 hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors"
                      >
                        <Lock size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivateAccount(user.id, user.name)}
                        className="p-4 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Unlock size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      className="p-4 hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Edit Dialog */}
      {roleEditDialog.show && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#fdfdfd] border-2 border-slate-950 w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-slate-950 uppercase mb-4 flex items-center gap-3">
              <ShieldCheck className="text-slate-950" size={24} />
              編輯權限
            </h3>
            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-slate-950 pl-4 py-2">
                <div className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">用戶</div>
                <div className="text-xl font-black text-slate-950">{roleEditDialog.userName}</div>
              </div>
              <div className="space-y-3">
                <label className="text-base font-black text-slate-400 uppercase tracking-widest">選擇角色權限</label>
                <select
                  value={roleEditDialog.newRole || ''}
                  onChange={(e) => setRoleEditDialog({ ...roleEditDialog, newRole: e.target.value as User['role'] })}
                  className="w-full py-4 px-4 bg-white border-2 border-slate-200 focus:border-slate-950 outline-none font-black text-xl text-slate-950 cursor-pointer"
                >
                  <option value="admin">🛡️ 系統管理員</option>
                  <option value="supervisor">👔 主管</option>
                  <option value="caseworker">📋 承辦人</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setRoleEditDialog({ show: false, userId: null, userName: null, currentRole: null, newRole: null })}
                className="flex-1 py-4 border-2 border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-950 font-black text-base uppercase tracking-widest transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRoleUpdate}
                disabled={roleEditDialog.newRole === roleEditDialog.currentRole}
                className="flex-1 py-4 bg-slate-950 text-white font-black text-base uppercase tracking-widest hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                更新權限
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs etc stay similar but cleaned up styling if needed... keeping them functional for now */}
      {/* Reusing existing dialog state logic but simplified container styles */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#fdfdfd] border-2 border-slate-950 w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-slate-950 uppercase mb-4 flex items-center gap-3">
              <AlertCircle className="text-slate-950" size={24} />
              確認操作
            </h3>
            <p className="text-lg font-bold text-slate-600 mb-8 border-l-4 border-slate-950 pl-4 py-2">
              {confirmDialog.type === 'freeze' && `確定要凍結「${confirmDialog.userName}」的帳戶嗎？`}
              {confirmDialog.type === 'activate' && `確定要啟用「${confirmDialog.userName}」的帳戶嗎？`}
              {confirmDialog.type === 'reset' && `確定要重設「${confirmDialog.userName}」的密碼嗎？`}
              {confirmDialog.type === 'delete' && (
                <>
                  確定要刪除用戶「{confirmDialog.userName}」嗎？
                  <br />
                  <span className="text-rose-600 font-black">⚠️ 此操作無法復原！</span>
                </>
              )}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDialog({ show: false, type: null, userId: null, userName: null })}
                className="flex-1 py-4 border-2 border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-950 font-black text-base uppercase tracking-widest transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 py-4 text-white font-black text-base uppercase tracking-widest transition-colors ${
                  confirmDialog.type === 'delete'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-slate-950 hover:bg-indigo-600'
                }`}
              >
                {confirmDialog.type === 'delete' ? '確認刪除' : '確認'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Notification */}
      {notification.show && (
        <div className="fixed bottom-8 right-8 bg-slate-950 text-white px-8 py-4 flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom duration-300 z-[60]">
          {notification.type === 'success' ? <CheckCircle className="text-emerald-400" /> : <XCircle className="text-rose-400" />}
          <div className="font-bold uppercase tracking-widest text-base">{notification.message}</div>
        </div>
      )}

      {/* Architectural Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-[#fdfdfd] w-full max-w-2xl max-h-[90vh] overflow-y-auto border-y-4 border-slate-950 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="p-12 space-y-12">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8">
                <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase">
                  {editingId ? '編輯身份' : '新增身份'}
                </h2>
                <button onClick={resetForm}>
                  <X size={32} className="text-slate-300 hover:text-slate-950 transition-colors" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2 group">
                    <label className="text-base font-black text-slate-300 uppercase tracking-[0.2em] group-focus-within:text-blue-600 transition-colors">完整姓名</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none font-black text-xl text-slate-950 rounded-none transition-colors placeholder:text-slate-200"
                      placeholder="姓名" required
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-base font-black text-slate-300 uppercase tracking-[0.2em] group-focus-within:text-blue-600 transition-colors">電子郵件</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none font-black text-xl text-slate-950 rounded-none transition-colors placeholder:text-slate-200"
                      placeholder="電子郵件" required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-2 group">
                    <label className="text-base font-black text-slate-300 uppercase tracking-[0.2em] group-focus-within:text-blue-600 transition-colors">角色權限</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none font-black text-xl text-slate-950 rounded-none appearance-none cursor-pointer"
                    >
                      <option value="admin">系統管理員</option>
                      <option value="supervisor">主管</option>
                      <option value="caseworker">承辦人</option>
                    </select>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-base font-black text-slate-300 uppercase tracking-[0.2em] group-focus-within:text-blue-600 transition-colors">單位</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full py-2 bg-transparent border-b-2 border-slate-200 focus:border-blue-600 outline-none font-black text-xl text-slate-950 rounded-none transition-colors placeholder:text-slate-200"
                      placeholder="單位"
                    />
                  </div>
                </div>

                <div className="pt-8 flex gap-6">
                  <button type="button" onClick={resetForm} className="flex-1 py-5 border-2 border-slate-200 hover:border-slate-950 text-slate-400 hover:text-slate-950 font-black text-base uppercase tracking-[0.2em] transition-all">
                    取消
                  </button>
                  <button type="submit" className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-base uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all">
                    {editingId ? '更新身份' : '建立身份'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

