
import React, { createContext, useState, useEffect, useContext } from 'react';

interface Settings {
    companyName: string;
    companyLogo: string;
}

interface SettingsContextType {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({
        companyName: '',
        companyLogo: '',
    });

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem('app-settings');
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (settings.companyName || settings.companyLogo) {
            try {
                localStorage.setItem('app-settings', JSON.stringify(settings));
            } catch (error) {
                console.error("Failed to save settings to localStorage", error);
            }
        }
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
