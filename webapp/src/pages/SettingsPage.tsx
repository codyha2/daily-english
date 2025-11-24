import { motion } from 'framer-motion'
import { Settings, Moon, Volume2, Globe, RefreshCw, Monitor } from 'lucide-react'
import { useSettings } from '../contexts/SettingsContext'
import { toast } from '../utils/toast'
import { API_BASE_URL } from '../config/api'

export default function SettingsPage() {
    const {
        darkMode,
        autoPlayAudio,
        audioSpeed,
        language,
        notifications,
        updateSettings
    } = useSettings()



    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-500">Manage your app preferences</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Appearance */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-brand-600" />
                        Appearance
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Dark Mode</p>
                            <p className="text-sm text-gray-500">Easier on the eyes in low light</p>
                        </div>
                        <button
                            onClick={() => updateSettings({ darkMode: !darkMode })}
                            className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-brand-600' : 'bg-gray-200'
                                }`}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'
                                }`}>
                                {darkMode ? (
                                    <Moon className="w-3 h-3 text-brand-600 absolute top-1.5 left-1.5" />
                                ) : (
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full absolute top-1.5 left-1.5" />
                                )}
                            </div>
                        </button>
                    </div>
                </section>

                {/* Audio */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-brand-600" />
                        Audio
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Auto-play Audio</p>
                                <p className="text-sm text-gray-500">Play pronunciation automatically</p>
                            </div>
                            <button
                                onClick={() => updateSettings({ autoPlayAudio: !autoPlayAudio })}
                                className={`relative w-14 h-8 rounded-full transition-colors ${autoPlayAudio ? 'bg-brand-600' : 'bg-gray-200'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${autoPlayAudio ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-gray-900">Audio Speed</p>
                                <span className="text-sm font-bold text-brand-600">{audioSpeed}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.25"
                                value={audioSpeed}
                                onChange={(e) => updateSettings({ audioSpeed: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>0.5x</span>
                                <span>1.0x</span>
                                <span>1.5x</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Language & Notifications */}
                <section className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-brand-600" />
                        General
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Interface Language</p>
                                <p className="text-sm text-gray-500">Select your preferred language</p>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => updateSettings({ language: 'en' })}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => updateSettings({ language: 'vi' })}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'vi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Tiếng Việt
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                            <div>
                                <p className="font-medium text-gray-900">Notifications</p>
                                <p className="text-sm text-gray-500">Daily study reminders</p>
                            </div>
                            <button
                                onClick={() => updateSettings({ notifications: !notifications })}
                                className={`relative w-14 h-8 rounded-full transition-colors ${notifications ? 'bg-brand-600' : 'bg-gray-200'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-50 rounded-2xl border border-red-100 p-6">
                    <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-red-600" />
                        Danger Zone
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-red-900">Reset Progress</p>
                            <p className="text-sm text-red-700">Clear all learning history and start over</p>
                        </div>
                        <button
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                                    try {
                                        const API_BASE = API_BASE_URL;
                                        const USER_ID = 'user-1';
                                        const DECK_ID = 'deck-850-basic';

                                        const response = await fetch(`${API_BASE}/curriculum/reset-progress/${USER_ID}/${DECK_ID}`, {
                                            method: 'POST'
                                        });

                                        if (response.ok) {
                                            toast.success('Progress reset successfully');
                                            // Force reload to update all states
                                            window.location.href = '/';
                                        } else {
                                            toast.error('Failed to reset progress');
                                        }
                                    } catch (error) {
                                        toast.error('Error resetting progress');
                                    }
                                }
                            }}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                        >
                            Reset Progress
                        </button>
                    </div>
                </section>

                <div className="text-center text-sm text-gray-400 pt-4">
                    <p>Daily Basic English v1.0.0</p>
                    <p>Build 2025.11.24</p>
                </div>
            </div>
        </motion.div>
    )
}
