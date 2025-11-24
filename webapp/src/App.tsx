import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom'
import { LayoutGrid, BookOpen, Settings, ChevronRight, GraduationCap, Sparkles, List, FileText } from 'lucide-react'
import HomePage from './pages/HomePage'
import LearnPage from './pages/LearnPage'
import TensesPage from './pages/TensesPage'
import TenseDetailPage from './pages/TenseDetailPage'
import DailyLessonPage from './pages/DailyLessonPage'
import WeeklyTestPage from './pages/WeeklyTestPage'
import WordFormationPage from './pages/WordFormationPage'
import WordOrderPage from './pages/WordOrderPage'
import ArticlesPage from './pages/ArticlesPage'
import SettingsPage from './pages/SettingsPage'
import { AnimatePresence, motion } from 'framer-motion'
import { MobileNav } from './components/MobileNav'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from './utils/toast'
import { SettingsProvider } from './contexts/SettingsContext'
import { GlobalSearch } from './components/GlobalSearch'

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <Link to={to} className="block mb-1 relative group">
            {isActive && (
                <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-brand-50/80 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive
                ? 'text-brand-700 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-500'}`} />
                <span className="text-sm">{label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-brand-400" />}
            </div>
        </Link>
    )
}

function Sidebar() {
    return (
        <div className="hidden md:flex w-64 h-screen glass-sidebar fixed left-0 top-0 flex-col z-50">
            <div className="p-6 pb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 text-white">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 leading-tight text-lg tracking-tight">Daily Basic</h1>
                        <p className="text-xs text-brand-600 font-medium">English Learning</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide">
                <div>
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
                    <NavItem to="/" icon={LayoutGrid} label="Dashboard" />
                    <NavItem to="/learn" icon={BookOpen} label="My Learning" />
                </div>

                <div>
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Grammar</p>
                    <NavItem to="/tenses" icon={GraduationCap} label="Tenses" />
                    <NavItem to="/word-formation" icon={Sparkles} label="Word Formation" />
                    <NavItem to="/word-order" icon={List} label="Word Order" />
                    <NavItem to="/articles" icon={FileText} label="Articles (A, An, The)" />
                </div>

                <div>
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">System</p>
                    <NavItem to="/settings" icon={Settings} label="Settings" />
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200/50">
                <div className="px-3 py-2.5 text-gray-500">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Author</p>
                    <p className="text-sm font-medium text-gray-600 break-all">sonbaodigi@gmail.com</p>
                </div>
            </div>
        </div>
    )
}

function AppContent() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
            <MobileNav />
            <Sidebar />
            <main className="flex-1 md:ml-64 w-full pt-16 md:pt-0">
                <div className="max-w-6xl mx-auto p-4 md:p-10">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/learn" element={<LearnPage />} />
                            <Route path="/daily-lesson" element={<DailyLessonPage />} />
                            <Route path="/daily-lesson/:day" element={<DailyLessonPage />} />
                            <Route path="/weekly-test/:day" element={<WeeklyTestPage />} />
                            <Route path="/tenses" element={<TensesPage />} />
                            <Route path="/tenses/:tenseId" element={<TenseDetailPage />} />
                            <Route path="/word-formation" element={<WordFormationPage />} />
                            <Route path="/word-order" element={<WordOrderPage />} />
                            <Route path="/articles" element={<ArticlesPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <footer className="mt-auto py-6 text-center text-sm text-gray-500 border-t border-gray-200/50 backdrop-blur-sm">
                    <p>Made with ❤️ by <span className="font-semibold text-brand-600">Cody Ha</span></p>
                    <p className="text-xs mt-1">© 2025 Daily Basic English • All rights reserved</p>
                </footer>
            </main>
            <GlobalSearch />
            <Toaster />
        </div>
    )
}

function App() {
    return (
        <ErrorBoundary>
            <SettingsProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </SettingsProvider>
        </ErrorBoundary>
    )
}

export default App
