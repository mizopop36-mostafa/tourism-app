
import React from 'react';
import { BookingIcon, TripIcon, ExpenseIcon, ReportIcon, ClientIcon, TreasuryIcon, AdminIcon, CloseIcon, LogoutIcon } from './icons/Icons';
import { useTranslation } from '../hooks/useTranslation';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen, onLogout }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  
  const navItems = [
    { id: 'bookings', label: t('bookings'), icon: BookingIcon },
    { id: 'trips', label: t('trips'), icon: TripIcon },
    { id: 'expenses', label: t('expenses'), icon: ExpenseIcon },
    { id: 'reports', label: t('reports'), icon: ReportIcon },
    { id: 'clients', label: t('clients_and_supervisors'), icon: ClientIcon },
    { id: 'treasury', label: t('treasury'), icon: TreasuryIcon },
    { id: 'admin', label: t('admin_panel'), icon: AdminIcon },
  ];

  const handleNavClick = (page: any) => {
    setActivePage(page);
    if(window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const sidebarClasses = `
    bg-gray-800 text-white w-64 space-y-2 py-7 px-2
    absolute inset-y-0 ${document.dir === 'rtl' ? 'right-0' : 'left-0'} transform ${isOpen ? 'translate-x-0' : (document.dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
    md:relative md:translate-x-0 transition-transform duration-200 ease-in-out
    flex flex-col z-30
  `;

  return (
    <>
    {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}
    <nav className={sidebarClasses}>
      <div className="flex items-center justify-between px-4 min-h-[40px]">
        <div className="flex items-center gap-2">
          {settings.companyLogo && <img src={settings.companyLogo} alt="Company Logo" className="h-10 w-auto max-w-[40px] object-contain" />}
          <h2 className="text-xl font-extrabold text-white">{settings.companyName || t('company_name')}</h2>
        </div>
        <button onClick={() => setIsOpen(false)} className="md:hidden">
            <CloseIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-grow pt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className={`flex items-center space-x-2 space-x-reverse py-2.5 px-4 rounded transition duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
       <div className="mt-auto">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="flex items-center space-x-2 space-x-reverse py-2.5 px-4 rounded transition duration-200 text-gray-300 hover:bg-red-600 hover:text-white"
          >
            <LogoutIcon className="h-5 w-5" />
            <span>{t('logout')}</span>
          </a>
        </div>
    </nav>
    </>
  );
};

export default Sidebar;