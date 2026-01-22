import { useEffect, useState } from 'react';
import {
  Plus, Edit2, Trash2, ChevronDown, Shield,
  Zap, Lock, CheckCircle2, MoreHorizontal,
  ArrowRight, UserCheck, X, Users
} from 'lucide-react';
import React from 'react';
import { mockApi } from '../../services/mockApi';
import type { Role, Permission } from '../../types/schema';

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 新增/編輯角色表單狀態
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // 新增權限表單狀態
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [permissionFormData, setPermissionFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roleList, permList] = await Promise.all([
        mockApi.getRoles(),
        mockApi.getPermissions()
      ]);
      setRoles(roleList);
      setPermissions(permList);
      if (roleList.length > 0) setExpandedId(roleList[0].id);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setLoading(false);
    }
  };

  // 處理角色表單提交
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoleId) {
        await mockApi.updateRole(editingRoleId, roleFormData);
      } else {
        await mockApi.createRole(roleFormData);
      }
      setShowRoleForm(false);
      setEditingRoleId(null);
      setRoleFormData({ name: '', description: '', permissions: [] });
      loadData();
    } catch (error) {
      console.error('Failed to save role:', error);
      alert('保存失敗，請重試');
    }
  };

  // 處理編輯角色
  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setRoleFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions
    });
    setShowRoleForm(true);
  };

  // 處理刪除角色
  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`確定要刪除角色「${roleName}」嗎？此操作無法復原。`)) return;
    try {
      await mockApi.deleteRole(roleId);
      if (expandedId === roleId) setExpandedId(null);
      loadData();
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert('刪除失敗，請重試');
    }
  };

  // 處理權限表單提交
  const handlePermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mockApi.createPermission(permissionFormData);
      setShowPermissionForm(false);
      setPermissionFormData({ id: '', name: '', description: '', category: '' });
      loadData();
    } catch (error) {
      console.error('Failed to create permission:', error);
      alert('新增失敗，請重試');
    }
  };

  // 切換權限選擇
  const togglePermission = (permId: string) => {
    setRoleFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-base">載入權限矩陣中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header - Architectural */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-indigo-600"></div>
            <div className="text-base font-black text-slate-400 uppercase tracking-[0.3em]">安全架構</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-950 uppercase leading-none">權限管理</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowPermissionForm(true)}
            className="px-8 py-4 bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <Lock size={18} /> 新增權限
          </button>
          <button
            onClick={() => {
              setEditingRoleId(null);
              setRoleFormData({ name: '', description: '', permissions: [] });
              setShowRoleForm(true);
            }}
            className="px-8 py-4 bg-slate-950 text-white hover:bg-indigo-600 transition-colors font-black text-base uppercase tracking-[0.2em] flex items-center gap-3"
          >
            <Users size={18} /> 新增角色
          </button>
        </div>
      </div>

      {/* Statistics - Architectural Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-8 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={18} className="text-indigo-600" />
            <h3 className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">已定義角色</h3>
          </div>
          <div className="text-7xl font-black tracking-tighter text-slate-950">{roles.length}</div>
        </div>
        <div className="md:border-l-2 md:border-slate-100 md:pl-12">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={18} className="text-emerald-600" />
            <h3 className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">權限節點</h3>
          </div>
          <div className="text-7xl font-black tracking-tighter text-slate-950">{permissions.length}</div>
        </div>
        <div className="md:border-l-2 md:border-slate-100 md:pl-12">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck size={18} className="text-blue-600" />
            <h3 className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">活躍綁定</h3>
          </div>
          <div className="text-7xl font-black tracking-tighter text-slate-950">{new Set(roles.flatMap(r => r.permissions)).size}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Role List Side - Minimal */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-6 border-b-2 border-slate-950 pb-2">可用定義</h3>
          <div className="flex flex-col gap-2">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setExpandedId(role.id)}
                className={`w-full text-left px-6 py-5 transition-all group relative border ${expandedId === role.id
                  ? 'bg-slate-950 text-white border-slate-950'
                  : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-950 hover:text-slate-950'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-base uppercase tracking-widest">{role.name}</span>
                  {expandedId === role.id && <ArrowRight size={16} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permission Details - Blueprint Style */}
        <div className="lg:col-span-8">
          {expandedId && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              {/* Detail Header */}
              <div className="flex items-end justify-between border-b-2 border-slate-100 pb-8">
                <div className="space-y-4">
                  <span className="text-base font-black bg-indigo-600 text-white px-3 py-1 uppercase tracking-[0.2em]">啟用情境</span>
                  <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase">{roles.find(r => r.id === expandedId)?.name}</h2>
                  <p className="text-lg font-bold text-slate-500 max-w-xl">{roles.find(r => r.id === expandedId)?.description}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const role = roles.find(r => r.id === expandedId);
                      if (role) handleEditRole(role);
                    }}
                    className="p-4 border-2 border-slate-200 text-slate-400 hover:text-slate-950 hover:border-slate-950 transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => {
                      const role = roles.find(r => r.id === expandedId);
                      if (role) handleDeleteRole(role.id, role.name);
                    }}
                    className="p-4 border-2 border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                {Object.entries(
                  (roles.find(r => r.id === expandedId)?.permissions || [])
                    .map(permId => permissions.find(p => p.id === permId))
                    .filter(Boolean)
                    .reduce((acc, perm) => {
                      if (!acc[perm!.category]) acc[perm!.category] = [];
                      acc[perm!.category].push(perm!);
                      return acc;
                    }, {} as Record<string, Permission[]>)
                ).map(([category, categoryPerms]: any) => (
                  <div key={category}>
                    <h4 className="flex items-center gap-4 text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2">
                      <div className="w-2 h-2 bg-indigo-600"></div> {category}
                    </h4>
                    <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                      {categoryPerms.map((perm: Permission) => (
                        <div key={perm.id} className="group">
                          <div className="flex items-center gap-3 mb-1">
                            <CheckCircle2 size={14} className="text-indigo-600" />
                            <div className="font-bold text-slate-900 text-base uppercase tracking-wide group-hover:text-indigo-600 transition-colors">{perm.name}</div>
                          </div>
                          <div className="text-base font-medium text-slate-400 pl-7">{perm.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Security Seal */}
              <div className="mt-12 pt-8 border-t-2 border-slate-950 flex items-center justify-between">
                <div className="font-mono text-base text-slate-300">SHA-256 簽章驗證通過</div>
                <div className="text-base font-black text-slate-950 uppercase tracking-[0.2em]">安全許可等級 3</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 新增/編輯角色表單 Modal */}
      {showRoleForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-8 border-b-2 border-slate-950">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase">
                  {editingRoleId ? '編輯角色' : '新增角色'}
                </h2>
                <p className="text-base font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">權限配置</p>
              </div>
              <button
                onClick={() => {
                  setShowRoleForm(false);
                  setEditingRoleId(null);
                  setRoleFormData({ name: '', description: '', permissions: [] });
                }}
                className="p-2 border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRoleSubmit} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">角色名稱</label>
                <input
                  type="text"
                  required
                  value={roleFormData.name}
                  onChange={e => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-bold text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                  placeholder="例如：審核人員"
                />
              </div>

              <div className="space-y-2">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">角色描述</label>
                <textarea
                  required
                  value={roleFormData.description}
                  onChange={e => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-medium text-base text-slate-950 outline-none focus:border-indigo-600 transition-all min-h-[80px] resize-none rounded-none"
                  placeholder="描述此角色的職責和用途..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">選擇權限</label>
                <div className="border-2 border-slate-100 p-6 space-y-6 max-h-[400px] overflow-y-auto">
                  {Object.entries(
                    permissions.reduce((acc, perm) => {
                      if (!acc[perm.category]) acc[perm.category] = [];
                      acc[perm.category].push(perm);
                      return acc;
                    }, {} as Record<string, Permission[]>)
                  ).map(([category, categoryPerms]) => (
                    <div key={category}>
                      <h4 className="text-base font-black text-slate-950 uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2">
                        {category}
                      </h4>
                      <div className="space-y-2 pl-4">
                        {categoryPerms.map(perm => (
                          <label key={perm.id} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={roleFormData.permissions.includes(perm.id)}
                              onChange={() => togglePermission(perm.id)}
                              className="mt-1 w-5 h-5 accent-indigo-600"
                            />
                            <div className="flex-1">
                              <div className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {perm.name}
                              </div>
                              <div className="text-base text-slate-400 mt-1">{perm.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-slate-950 text-white font-black text-base uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle2 size={18} /> {editingRoleId ? '更新角色' : '建立角色'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 新增權限表單 Modal */}
      {showPermissionForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
          <div className="bg-white w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-8 border-b-2 border-slate-950">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase">新增權限</h2>
                <p className="text-base font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">權限節點定義</p>
              </div>
              <button
                onClick={() => {
                  setShowPermissionForm(false);
                  setPermissionFormData({ id: '', name: '', description: '', category: '' });
                }}
                className="p-2 border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePermissionSubmit} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">權限 ID</label>
                <input
                  type="text"
                  required
                  value={permissionFormData.id}
                  onChange={e => setPermissionFormData({ ...permissionFormData, id: e.target.value })}
                  className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-mono text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                  placeholder="例如：case:approve"
                />
              </div>

              <div className="space-y-2">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">權限名稱</label>
                <input
                  type="text"
                  required
                  value={permissionFormData.name}
                  onChange={e => setPermissionFormData({ ...permissionFormData, name: e.target.value })}
                  className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-bold text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                  placeholder="例如：審核案件"
                />
              </div>

              <div className="space-y-2">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">權限描述</label>
                <textarea
                  required
                  value={permissionFormData.description}
                  onChange={e => setPermissionFormData({ ...permissionFormData, description: e.target.value })}
                  className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-medium text-base text-slate-950 outline-none focus:border-indigo-600 transition-all min-h-[80px] resize-none rounded-none"
                  placeholder="描述此權限的作用..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-base font-black text-slate-400 uppercase tracking-[0.2em]">權限類別</label>
                <input
                  type="text"
                  required
                  value={permissionFormData.category}
                  onChange={e => setPermissionFormData({ ...permissionFormData, category: e.target.value })}
                  className="w-full py-3 bg-transparent border-b-2 border-slate-200 font-bold text-base text-slate-950 outline-none focus:border-indigo-600 transition-all rounded-none"
                  placeholder="例如：案件管理"
                />
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-slate-950 text-white font-black text-base uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
              >
                <Lock size={18} /> 建立權限
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
