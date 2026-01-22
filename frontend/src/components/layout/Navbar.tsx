import React, { useState, useEffect } from 'react';
import { Menu, X, Home, FileText, Search, Map, BookOpen, Globe, Type, Shield, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [fontSize, setFontSize] = useState<'standard' | 'large'>('standard');
    const [authRole, setAuthRole] = useState<string | null>(localStorage.getItem('auth_role'));
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('#user-menu-button') && !target.closest('#user-menu-dropdown')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (fontSize === 'large') {
            document.documentElement.classList.add('text-lg');
        } else {
            document.documentElement.classList.remove('text-lg');
        }
    }, [fontSize]);

    // Track auth status changes
    useEffect(() => {
        const checkAuth = () => {
            setAuthRole(localStorage.getItem('auth_role'));
        };
        window.addEventListener('storage', checkAuth);
        // Also check on location change as login/logout might happen
        checkAuth();
        return () => window.removeEventListener('storage', checkAuth);
    }, [location]);

    const toggleMenu = () => setIsOpen(!isOpen);

    const logout = () => {
        localStorage.removeItem('auth_role');
        localStorage.removeItem('auth_token');
        setUserMenuOpen(false);
        window.location.href = '/';
    };

    const navItems = [
        { label: '首頁', path: '/', icon: <Home size={18} /> },
        { label: '案件通報', path: '/smart-guide', icon: <FileText size={18} /> },
        { label: '進度查詢', path: '/status', icon: <Search size={18} /> },
        { label: '案件地圖', path: '/map', icon: <Map size={18} /> },
        { label: '教育資源', path: '/resources', icon: <BookOpen size={18} /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    const isHome = location.pathname === '/';
    const isTransparent = !scrolled;

    return (
        <nav
            className={`fixed z-50 transition-all duration-500 ease-in-out ${scrolled
                ? 'top-4 left-4 right-4 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-white/20 py-3'
                : `top-0 left-0 right-0 rounded-none border-b border-white/5 py-5 backdrop-blur-xl ${isHome ? 'bg-white/0' : 'bg-white/20'}`
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">

                {/* 1. Official Identity Block */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-700 to-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <Shield size={24} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-base md:text-xs font-bold tracking-[0.15em] uppercase mb-0.5 transition-colors duration-300 ${!scrolled && isHome ? 'text-white/80' : 'text-slate-500'}`}>New Taipei City Government</span>
                            <span className={`font-black text-lg md:text-xl tracking-tight leading-none transition-colors duration-300 ${!scrolled && isHome ? 'text-white group-hover:text-blue-200' : 'text-slate-900 group-hover:text-blue-700'}`}>
                                新北市政府<span className="hidden md:inline"> </span> <br className="md:hidden" />
                                動物保護防疫處
                            </span>
                        </div>
                    </Link>
                </div>

                {/* 2. Desktop Navigation */}
                <div className={`hidden lg:flex items-center p-1.5 rounded-full border transition-all duration-300 ${!scrolled && isHome ? 'bg-white/10 border-white/10 backdrop-blur-sm' : 'bg-slate-100/50 border-slate-200/50'}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`px-5 py-2 rounded-full text-sm font-bold tracking-tight flex items-center gap-2 transition-all duration-300 ${isActive(item.path)
                                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                                : (!scrolled && isHome ? 'text-white hover:text-white hover:bg-white/20' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60')
                                }`}
                        >
                            <span className={`${isActive(item.path) ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto'} transition-all duration-300`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* 3. Utility Block (A11y + Admin Dropdown) */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Font Size Toggle */}
                    <div className={`flex items-center rounded-lg p-1 border backdrop-blur-sm transition-all duration-300 ${!scrolled && isHome ? 'bg-white/10 border-white/10' : 'bg-slate-100/80 border-slate-200/50'}`}>
                        <button
                            onClick={() => setFontSize('standard')}
                            className={`px-2 py-1 rounded-md transition-all text-sm font-medium ${fontSize === 'standard'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : (!scrolled && isHome ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                        >
                            <span className="text-xs">T</span>
                        </button>
                        <div className={`w-px h-3 mx-1 ${!scrolled && isHome ? 'bg-white/20' : 'bg-slate-300'}`}></div>
                        <button
                            onClick={() => setFontSize('large')}
                            className={`px-2 py-1 rounded-md transition-all text-sm font-medium ${fontSize === 'large'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : (!scrolled && isHome ? 'text-white/70 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                        >
                            <span className="text-lg">T</span>
                        </button>
                    </div>

                    {/* Auth Section with Dropdown */}
                    {authRole ? (
                        <div className="relative">
                            <button
                                id="user-menu-button"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className={`flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full border transition-all duration-300 transform active:scale-95 ${!scrolled && isHome
                                    ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                    : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-blue-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-inner border border-white/20">
                                    {authRole === 'admin' ? '王' : authRole === 'field_investigator' ? '林' : '李'}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-black leading-none mb-0.5 tracking-tighter">
                                        {authRole === 'admin' ? '王管理員' : authRole === 'field_investigator' ? '林外勤' : '李承辦'}
                                    </span>
                                    <span className={`text-[10px] font-bold ${!scrolled && isHome ? 'text-white/60' : 'text-slate-400'}`}>
                                        ID: {authRole === 'admin' ? 'A001' : authRole === 'field_investigator' ? 'F001' : 'C002'}
                                    </span>
                                </div>
                                <div className={`ml-1 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}>
                                    <Globe size={12} className="opacity-40" />
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div
                                    id="user-menu-dropdown"
                                    className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[60] origin-top-right"
                                >
                                    <div className="p-5 border-b border-slate-50">
                                        <div className="flex items-center gap-4 mb-1">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl">
                                                {authRole === 'admin' ? '王' : authRole === 'field_investigator' ? '林' : '李'}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 tracking-tighter">
                                                    {authRole === 'admin' ? '王管理員' : authRole === 'field_investigator' ? '林外勤' : '李承辦'}
                                                </div>
                                                <div className="text-xs text-slate-400 font-bold">
                                                    {authRole === 'admin' ? '系統管理員' : authRole === 'field_investigator' ? '稽查科 • 隊員' : '承辦科 • 專員'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <Link
                                            to={authRole === 'field_investigator' ? '/field/tasks' : '/admin/dashboard'}
                                            onClick={() => setUserMenuOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                <Home size={18} />
                                            </div>
                                            <span className="font-black text-sm tracking-tight text-left flex-1">
                                                {authRole === 'field_investigator' ? '我的勤務儀表板' : '公務後台管理面版'}
                                            </span>
                                        </Link>

                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                                                <LogOut size={18} />
                                            </div>
                                            <span className="font-black text-sm tracking-tight text-left flex-1">安全登出系統</span>
                                        </button>
                                    </div>

                                    <div className="p-4 bg-slate-50/50 text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest leading-loose">
                                        Last Login: {new Date().toLocaleDateString()}<br />
                                        Device Approved
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-base font-black tracking-[0.15em] hover:bg-blue-700 shadow-lg shadow-black/10 hover:shadow-blue-700/30 transition-all duration-300 transform hover:-translate-y-0.5 uppercase"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        type="button"
                        className={`p-3 rounded-xl transition-colors ${!scrolled && isHome ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Animate in) */}
            {isOpen && (
                <div className="absolute top-24 left-0 right-0 glass-panel rounded-3xl p-6 mx-0 md:hidden flex flex-col gap-2 shadow-2xl border-t border-slate-100 animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
                    {/* Mobile Utility Row */}
                    <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-slate-200">
                        {authRole ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black">
                                        {authRole === 'admin' ? '王' : authRole === 'field_investigator' ? '林' : '李'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900">{authRole === 'admin' ? '王管理員' : authRole === 'field_investigator' ? '林外勤' : '李承辦'}</span>
                                        <span className="text-xs text-slate-400 font-bold">{authRole === 'admin' ? '系統管理員' : '稽查員'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-3 bg-rose-50 text-rose-500 rounded-xl active:scale-95 transition-all"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold text-slate-400 italic font-mono">Guest Access Active</div>
                                <Link to="/login" className="px-5 py-2.5 bg-slate-950 text-white text-sm font-black tracking-tighter rounded-full border border-white/10 shadow-lg active:scale-95 transition-all">
                                    管理員登入
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setFontSize('standard')}
                                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${fontSize === 'standard' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}
                            >
                                標準字體
                            </button>
                            <button
                                onClick={() => setFontSize('large')}
                                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${fontSize === 'large' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}
                            >
                                特大字體
                            </button>
                        </div>
                    </div>

                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${isActive(item.path)
                                ? 'bg-blue-50 text-blue-700 font-black'
                                : 'text-slate-600 font-bold hover:bg-slate-50'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive(item.path) ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                {item.icon}
                            </div>
                            <span className="text-lg">{item.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};
