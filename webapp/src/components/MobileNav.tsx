import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, BookOpen, Settings, GraduationCap, Sparkles, Menu, X, ChevronRight, List, FileText } from 'lucide-react';

function NavItem({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className="block mb-1" onClick={onClick}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-brand-50 text-brand-700 font-medium shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-500'}`} />
                <span className="text-sm">{label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-brand-400" />}
            </div>
        </Link>
    );
}

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Header with Hamburger */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center text-white">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm text-gray-900">Daily Basic</h1>
                        <p className="text-xs text-brand-600">English Learning</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 pb-8 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 text-white">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 leading-tight">Daily Basic</h1>
                            <p className="text-xs text-brand-600 font-medium">English Learning</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
                    <div className="mb-8">
                        <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
                        <NavItem to="/" icon={LayoutGrid} label="Dashboard" onClick={() => setIsOpen(false)} />
                        <NavItem to="/learn" icon={BookOpen} label="My Learning" onClick={() => setIsOpen(false)} />
                    </div>

                    <div className="mb-8">
                        <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Grammar</p>
                        <NavItem to="/tenses" icon={GraduationCap} label="Tenses" onClick={() => setIsOpen(false)} />
                        <NavItem to="/word-formation" icon={Sparkles} label="Word Formation" onClick={() => setIsOpen(false)} />
                        <NavItem to="/word-order" icon={List} label="Word Order" onClick={() => setIsOpen(false)} />
                        <NavItem to="/articles" icon={FileText} label="Articles (A, An, The)" onClick={() => setIsOpen(false)} />
                    </div>

                    <div>
                        <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">System</p>
                        <NavItem to="/settings" icon={Settings} label="Settings" onClick={() => setIsOpen(false)} />
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="px-3 py-2.5 text-gray-500">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Author</p>
                        <p className="text-sm font-medium text-gray-600 break-all">sonbaodigi@gmail.com</p>
                    </div>
                </div>
            </div>
        </>
    );
}
