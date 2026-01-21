import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Settings, LogOut, Shield, Users, Zap,
    BarChart3, FileCheck, Lock, GitBranch, ChevronDown, Menu, X
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { AIAssistantWidget } from '../ai-assistant/AIAssistantWidget';

interface AdminLayoutProps {
    children?: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['cases']));
    const [detailedCaseMenu, setDetailedCaseMenu] = useState<Record<string, any>>({});
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Simple mock auth guard
        if (!localStorage.getItem('auth_token')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Load detailed case menu
        loadDetailedCaseMenu();
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
        setIsMobileMenuOpen(false); // Close mobile menu on route change
    }, [location.pathname]);

    const loadDetailedCaseMenu = async () => {
        try {
            const menu = await mockApi.getDetailedCaseMenu();
            setDetailedCaseMenu(menu);
        } catch (error) {
            console.error('Failed to load detailed case menu:', error);
        }
    };

    const toggleMenu = (menuId: string) => {
        const newExpanded = new Set(expandedMenus);
        if (newExpanded.has(menuId)) {
            newExpanded.delete(menuId);
        } else {
            newExpanded.add(menuId);
        }
        setExpandedMenus(newExpanded);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_role');
        navigate('/login');
    };

    // 定義詳細的菜單項順序
    const caseMenuOrder = [
        'all', 'attention',
        'receipt_pending', 'receipt_authorized',
        'assignment_assigned',
        'undertaker_pending', 'undertaker_processing', 'undertaker_transferred', 'undertaker_overdue',
        'public_completed',
        'resolved', 'rejected'
    ];

    const caseMenuLabels: Record<string, string> = {
        'all': '全部案件',
        'attention': '關注案件',
        'receipt_pending': '收簽-待簽收',
        'receipt_authorized': '收簽-已授理',
        'assignment_assigned': '分派-已分派',
        'undertaker_pending': '承辦-待簽收',
        'undertaker_processing': '承辦-處理中',
        'undertaker_transferred': '承辦-轉移中',
        'undertaker_overdue': '承辦-超期',
        'public_completed': '公文-待審核',
        'resolved': '已結案',
        'rejected': '責撤'
    };

    const navItems = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: '總覽儀表板', category: '系統' },
        { to: '/admin/cases', icon: FileText, label: '案件管理', category: '核心業務', submenu: true, menuId: 'cases' },
        { to: '/admin/users', icon: Users, label: '用戶管理', category: '系統權限' },
        { to: '/admin/roles', icon: Lock, label: '權限角色', category: '系統權限' },
        { to: '/admin/workflows', icon: GitBranch, label: '工作流程', category: '設置' },
        { to: '/admin/reports', icon: FileCheck, label: '報表中心', category: '數據分析' },
        { to: '/admin/audit-logs', icon: BarChart3, label: '審計日誌', category: '數據分析' },
        { to: '/admin/integrations', icon: Zap, label: '外部介接', category: '設置' },
        { to: '/admin/settings', icon: Settings, label: '系統設定', category: '設置' },
    ];

    const Sidebar = () => (
        <aside className="h-full bg-slate-950 text-white flex flex-col relative z-20 shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8 flex items-center gap-4 border-b border-white/10 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 shrink-0">
                    <Shield size={22} />
                </div>
                <div>
                    <h1 className="font-black text-white text-base tracking-tight leading-tight uppercase">Smart Intel</h1>
                    <p className="text-base font-bold text-blue-400 uppercase tracking-widest opacity-80">Case Management</p>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden ml-auto p-2 text-slate-400 hover:text-white"
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto scrollbar-hide">
                {['系統', '核心業務', '系統權限', '數據分析', '設置'].map((category) => {
                    const items = navItems.filter(i => i.category === category);
                    return items.length > 0 ? (
                        <div key={category} className="space-y-3">
                            <p className="text-base font-black text-blue-500/80 uppercase tracking-[0.2em] px-3">{category}</p>
                            <div className="space-y-1">
                                {items.map((item: any) => {
                                    const isExpanded = item.menuId && expandedMenus.has(item.menuId);
                                    const isSubmenu = item.submenu;
                                    const isActiveRoute = location.pathname.startsWith(item.to);

                                    if (isSubmenu) {
                                        return (
                                            <div key={item.to} className="space-y-1">
                                                {/* 主菜單項 - 案件管理 */}
                                                <button
                                                    onClick={() => toggleMenu(item.menuId)}
                                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold
                                                        ${expandedMenus.has(item.menuId) || isActiveRoute ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon size={20} className={expandedMenus.has(item.menuId) || isActiveRoute ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} />
                                                        <span>{item.label}</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-300 text-slate-500 ${isExpanded ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {/* 子菜單項 - 詳細狀態 */}
                                                <div className={`space-y-0.5 pl-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                    <div className="relative border-l border-white/10 pl-2 space-y-1">
                                                        {caseMenuOrder.map((key) => {
                                                            const menuItem = detailedCaseMenu[key];
                                                            const count = menuItem?.count || 0;
                                                            const label = caseMenuLabels[key];
                                                            const searchParams = new URLSearchParams(location.search);
                                                            const currentFilter = searchParams.get('filter') || 'all';
                                                            const isItemActive = currentFilter === key;

                                                            return (
                                                                <NavLink
                                                                    key={key}
                                                                    to={`/admin/cases?filter=${key}`}
                                                                    className={`
                                                                        flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg transition-all text-xs font-semibold
                                                                        ${isItemActive
                                                                            ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                                                                            : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}
                                                                    `}
                                                                >
                                                                    <span className="truncate flex-1">{label}</span>
                                                                    {count > 0 && (
                                                                        <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-base font-black rounded-md flex-shrink-0 ${count > 9 ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'
                                                                            }`}>
                                                                            {count > 99 ? '99+' : count}
                                                                        </span>
                                                                    )}
                                                                </NavLink>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                className={({ isActive }) => `
                                                    flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold group
                                                    ${isActive
                                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                                        : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                                `}
                                            >
                                                <item.icon size={20} className={isActiveRoute ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    ) : null;
                })}
            </nav>

            <div className="p-6 border-t border-white/10 mt-auto bg-slate-950/50 backdrop-blur-sm">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all text-sm font-bold group"
                >
                    <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                    <span>登出系統</span>
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen bg-[#F0F4F8] overflow-hidden font-sans">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#F0F4F8] relative">
                <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden md:block w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-900">管理作業環境</h2>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3 md:pr-6 md:border-r border-slate-100">
                            <div className="hidden md:block text-right">
                                <div className="text-base font-black text-slate-400 uppercase tracking-widest">Connected User</div>
                                <div className="text-sm font-black text-slate-900">系統管理員</div>
                            </div>
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-600 shadow-sm text-xs md:text-sm">
                                AD
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 rounded-xl">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-auto bg-[#F0F4F8]">
                    <div className="p-4 md:p-10 max-w-[1600px] mx-auto min-h-full">
                        {children || <Outlet />}
                    </div>
                </div>
            </main>

            {/* AI Assistant Widget */}
            <AIAssistantWidget />
        </div>
    );
};
