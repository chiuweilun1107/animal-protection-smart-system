import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, FileText, Settings, LogOut, Shield, Users, Zap,
    BarChart3, FileCheck, Lock, GitBranch, ChevronDown, Menu, X, ArrowLeftRight
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
        { to: '/admin/case-merge', icon: ArrowLeftRight, label: '併案處理', category: '核心業務' },
        { to: '/admin/users', icon: Users, label: '用戶管理', category: '系統權限' },
        { to: '/admin/roles', icon: Lock, label: '權限管理', category: '系統權限' },
        { to: '/admin/workflows', icon: GitBranch, label: '工作流程', category: '設置' },
        { to: '/admin/reports', icon: FileCheck, label: '報表中心', category: '數據分析' },
        { to: '/admin/audit-logs', icon: BarChart3, label: '審計日誌', category: '數據分析' },
        { to: '/admin/integrations', icon: Zap, label: '外部介接', category: '設置' },
        { to: '/admin/settings', icon: Settings, label: '系統設定', category: '設置' },
    ];

    const Sidebar = () => (
        <aside className="h-screen bg-[#fdfdfd] text-slate-950 flex flex-col border-r-2 border-slate-100">
            <div className="p-8 flex items-center gap-5 border-b-2 border-slate-100 shrink-0">
                <div className="w-12 h-12 bg-slate-950 flex items-center justify-center text-white shrink-0">
                    <Shield size={24} strokeWidth={3} />
                </div>
                <div>
                    <h1 className="font-black text-slate-950 text-xl tracking-tighter leading-none uppercase">Smart Intel</h1>
                    <p className="text-base font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">管理系統</p>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden ml-auto p-2 text-slate-950 hover:bg-slate-100 rounded-lg"
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 p-6 overflow-y-auto space-y-8">
                {['系統', '核心業務', '系統權限', '數據分析', '設置'].map((category) => {
                    const items = navItems.filter(i => i.category === category);
                    return items.length > 0 ? (
                        <div key={category}>
                            <p className="text-base font-black text-slate-300 uppercase tracking-[0.2em] px-4 mb-4">{category}</p>
                            <div className="space-y-2">
                                {items.map((item: any) => {
                                    const isExpanded = item.menuId && expandedMenus.has(item.menuId);
                                    const isSubmenu = item.submenu;
                                    const isActiveRoute = location.pathname.startsWith(item.to);

                                    if (isSubmenu) {
                                        return (
                                            <div key={item.to} className="space-y-2">
                                                {/* 主菜單項 - 案件管理 */}
                                                <button
                                                    onClick={() => toggleMenu(item.menuId)}
                                                    className={`w-full flex items-center justify-between gap-4 px-4 py-4 rounded-none transition-all text-base font-black
                                                        ${expandedMenus.has(item.menuId) || isActiveRoute
                                                            ? 'text-slate-950'
                                                            : 'text-slate-400 hover:text-slate-950'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <item.icon size={22} strokeWidth={2.5} className={expandedMenus.has(item.menuId) || isActiveRoute ? 'text-slate-950' : 'text-slate-300 group-hover:text-slate-950'} />
                                                        <span className="tracking-tight">{item.label}</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={18}
                                                        strokeWidth={3}
                                                        className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-slate-950' : 'text-slate-200'}`}
                                                    />
                                                </button>

                                                {/* 子菜單項 - 詳細狀態 */}
                                                {isExpanded && (
                                                    <div className="pl-4 relative">
                                                        {/* Architectural Line */}
                                                        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                                                        <div className="pl-6 space-y-1">
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
                                                                            flex items-center justify-between gap-3 px-4 py-3 transition-all text-base font-bold uppercase tracking-wide relative group/sub
                                                                            ${isItemActive
                                                                                ? 'text-slate-950'
                                                                                : 'text-slate-400 hover:text-slate-600'}
                                                                        `}
                                                                    >
                                                                        <span className="truncate flex-1">{label}</span>
                                                                        {count > 0 && (
                                                                            <span className={`text-base font-black ${isItemActive ? 'text-slate-950' : 'text-slate-300'}`}>
                                                                                {count > 99 ? '99+' : count}
                                                                            </span>
                                                                        )}
                                                                    </NavLink>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <NavLink
                                                key={item.to}
                                                to={item.to}
                                                className={({ isActive }) => `
                                                    flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-base font-black group
                                                    ${isActive
                                                        ? 'bg-slate-950 text-white shadow-xl shadow-slate-950/20'
                                                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-950'}
                                                `}
                                            >
                                                <item.icon size={22} strokeWidth={2.5} className={isActiveRoute ? 'text-white' : 'text-slate-300 group-hover:text-slate-950 transition-colors'} />
                                                <span className="tracking-tight">{item.label}</span>
                                            </NavLink>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    ) : null;
                })}
            </nav>

            <div className="p-8 border-t-2 border-slate-100 mt-auto bg-[#fdfdfd]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-4 text-slate-400 hover:text-rose-600 w-full transition-all text-base font-black uppercase tracking-widest group"
                >
                    <LogOut size={20} className="group-hover:text-rose-600 transition-colors" />
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
                    className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - 桌面版始終顯示，移動版通過 fixed 定位 */}
            <div className={`w-72 shrink-0 hidden md:block`}>
                <Sidebar />
            </div>

            {/* Sidebar - 移動版 */}
            {isMobileMenuOpen && (
                <div className="fixed inset-y-0 left-0 w-72 z-50 md:hidden">
                    <Sidebar />
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#fdfdfd] relative">
                <header className="h-16 md:h-24 bg-[#fdfdfd]/80 backdrop-blur-xl border-b-2 border-slate-100 px-4 md:px-10 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-xl"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg md:text-2xl font-black tracking-tighter text-slate-950 uppercase">管理作業環境</h2>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-3 md:pr-6 md:border-r-2 border-slate-100">
                            <div className="hidden md:block text-right">
                                <div className="text-base font-black text-slate-300 uppercase tracking-widest">當前用戶</div>
                                <div className="text-base font-black text-slate-950">系統管理員</div>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 text-white flex items-center justify-center font-black shadow-lg text-base">
                                AD
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-950 transition-colors hover:bg-slate-50 rounded-xl">
                            <Settings size={24} />
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-auto bg-[#fdfdfd]">
                    <div className="p-4 md:p-12 max-w-[1600px] mx-auto min-h-full">
                        {children || <Outlet />}
                    </div>
                </div>
            </main>

            {/* AI Assistant Widget */}
            <AIAssistantWidget />
        </div>
    );
};
