
import React, { createContext, useState, useEffect } from 'react';
import { ar } from '../translations/ar';
import { en } from '../translations/en';

type Language = 'ar' | 'en';

interface I18nContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string, ...args: any[]) => string;
}

const translations: Record<Language, Record<string, string>> = { ar, en };

export const I18nContext = createContext<I18nContextType>({
    language: 'ar',
    setLanguage: () => {},
    t: (key) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('ar');

    useEffect(() => {
        // You could add logic here to detect browser language or load from localStorage
    }, []);
    
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);


    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};
