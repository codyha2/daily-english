import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
    darkMode: boolean;
    autoPlayAudio: boolean;
    audioSpeed: number;
    language: 'en' | 'vi';
    notifications: boolean;
}

interface SettingsContextType extends Settings {
    updateSettings: (newSettings: Partial<Settings>) => void;
    resetSettings: () => void;
}

const defaultSettings: Settings = {
    darkMode: false,
    autoPlayAudio: true,
    audioSpeed: 1,
    language: 'en',
    notifications: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() => {
        const saved = localStorage.getItem('app_settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('app_settings', JSON.stringify(settings));

        // Apply dark mode
        if (settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    return (
        <SettingsContext.Provider value={{ ...settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
