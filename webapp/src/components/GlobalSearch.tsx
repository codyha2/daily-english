import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronRight, Book, GraduationCap, Settings, Home, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface SearchResult {
    id: string;
    title: string;
    description: string;
    path: string;
    icon: any;
    type: 'page' | 'grammar' | 'vocabulary';
}

const staticResults: SearchResult[] = [
    { id: 'home', title: 'Home', description: 'Go to dashboard', path: '/', icon: Home, type: 'page' },
    { id: 'learn', title: 'Learn Vocabulary', description: 'Practice 850 basic words', path: '/learn', icon: Book, type: 'page' },
    { id: 'settings', title: 'Settings', description: 'App preferences', path: '/settings', icon: Settings, type: 'page' },
    { id: 'tenses', title: 'English Tenses', description: 'Master 12 tenses', path: '/tenses', icon: GraduationCap, type: 'grammar' },
    { id: 'word-formation', title: 'Word Formation', description: 'Prefixes and suffixes', path: '/word-formation', icon: FileText, type: 'grammar' },
    { id: 'word-order', title: 'Word Order', description: 'Sentence structure rules', path: '/word-order', icon: FileText, type: 'grammar' },
    { id: 'articles', title: 'Articles (A, An, The)', description: 'Usage rules', path: '/articles', icon: FileText, type: 'grammar' },
];

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const filteredResults = staticResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (result: SearchResult) => {
        navigate(result.path);
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredResults[selectedIndex]) {
                handleSelect(filteredResults[selectedIndex]);
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 transition-all hover:scale-105 flex items-center justify-center z-40 md:hidden"
            >
                <Search className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200" onClick={() => setIsOpen(true)}>
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Search...</span>
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-50"
                        >
                            <div className="flex items-center border-b border-gray-100 p-4 gap-3">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search for pages, grammar, or settings..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 text-lg outline-none placeholder:text-gray-400"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {filteredResults.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredResults.map((result, index) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleSelect(result)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-left ${index === selectedIndex ? 'bg-brand-50 text-brand-900' : 'hover:bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    <result.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold">{result.title}</p>
                                                    <p className={`text-sm ${index === selectedIndex ? 'text-brand-600/70' : 'text-gray-500'
                                                        }`}>{result.description}</p>
                                                </div>
                                                {index === selectedIndex && (
                                                    <ChevronRight className="w-5 h-5 text-brand-400" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-gray-500">
                                        <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No results found for "{query}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500 flex items-center justify-between border-t border-gray-100">
                                <div className="flex gap-4">
                                    <span><kbd className="font-sans bg-white px-1.5 py-0.5 rounded border border-gray-200">↵</kbd> to select</span>
                                    <span><kbd className="font-sans bg-white px-1.5 py-0.5 rounded border border-gray-200">↑↓</kbd> to navigate</span>
                                    <span><kbd className="font-sans bg-white px-1.5 py-0.5 rounded border border-gray-200">esc</kbd> to close</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
