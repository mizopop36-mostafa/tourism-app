import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Bookings from './pages/Bookings';
import Trips from './pages/Trips';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import Treasury from './pages/Treasury';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage'; // Import LoginPage
import { MenuIcon } from './components/icons/Icons';
import { useTranslation } from './hooks/useTranslation';

type Page = 'bookings' | 'trips' | 'expenses' | 'reports' | 'clients' | 'treasury' | 'admin';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add authentication state
  const [activePage, setActivePage] = useState<Page>('bookings');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, setLanguage, language } = useTranslation();

  useEffect(() => {
    document.title = t('app_title');
  }, [t, language]);

  const renderPage = () => {
    switch (activePage) {
      case 'bookings':
        return <Bookings />;
      case 'trips':
        return <Trips />;
      case 'expenses':
        return <Expenses />;
      case 'reports':
        return <Reports />;
      case 'clients':
        return <Clients />;
      case 'treasury':
        return <Treasury />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Bookings />;
    }
  };
  
  const pageTitles: { [key in Page]: string } = {
    bookings: t('bookings'),
    trips: t('trips'),
    expenses: t('expenses'),
    reports: t('reports'),
    clients: t('clients_and_supervisors'),
    treasury: t('treasury'),
    admin: t('admin_panel_title')
  };

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
           <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 focus:outline-none">
             <MenuIcon className="h-6 w-6" />
           </button>
           <h1 className="text-2xl font-semibold text-gray-800">{pageTitles[activePage]}</h1>
          </div>
          <button onClick={toggleLanguage} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-300">
            {language === 'ar' ? 'English' : 'العربية'}
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;