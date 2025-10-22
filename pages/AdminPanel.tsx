
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { EditIcon, DeleteIcon } from '../components/icons/Icons';
import { useSettings } from '../contexts/SettingsContext';

const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">{title}</h3>
        <div>
            {children}
        </div>
    </div>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
     <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <div className="md:col-span-2">
            {children}
        </div>
    </div>
);

const PermissionRow: React.FC<{ section: string }> = ({ section }) => {
    const { t } = useTranslation();
    const permissions = [t('view'), t('add'), t('edit'), t('delete')];
    return (
        <div className="grid grid-cols-5 items-center gap-4 py-2 border-b">
            <span className="text-sm font-medium text-gray-700 col-span-1">{section}</span>
            <div className="col-span-4 grid grid-cols-4">
                {permissions.map(perm => (
                    <label key={perm} className="flex items-center justify-center space-x-2 space-x-reverse">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    </label>
                ))}
            </div>
        </div>
    )
};


const AdminPanel: React.FC = () => {
    const { t } = useTranslation();
    const { settings, setSettings } = useSettings();
    const sections = [t('bookings'), t('trips'), t('expenses'), t('reports'), t('clients'), t('treasury')];
    
    const [userForm, setUserForm] = useState({
        username: '',
        password: '',
        jobTitle: '',
    });
    
    const [companyName, setCompanyName] = useState(settings.companyName);

    useEffect(() => {
        setCompanyName(settings.companyName);
    }, [settings.companyName]);

    const tripCategoryKeys = ['safari_trips', 'cultural_trips', 'entertainment_trips'];
    const expenseTypes = Object.keys(t('DRIVER_CUSTODY') ? {
        'DRIVER_CUSTODY': '', 'CUSTODY_SETTLEMENT': '', 'CAR_MAINTENANCE': '', 'COMPANY_RENT': '', 'SALARIES': '', 'COMMISSIONS': ''
    } : {});

    const handleAction = (action: string, item: string) => {
        alert(`${action}: ${item}`);
    }

    const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUserFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!userForm.username || !userForm.password) {
            alert(t('username_password_required'));
            return;
        }
        alert(`${t('user_updated')}: ${userForm.username}`);
        setUserForm({ username: '', password: '', jobTitle: '' });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setSettings(prev => ({ ...prev, companyLogo: event.target.result as string }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSettingsSave = () => {
        setSettings(prev => ({ ...prev, companyName: companyName || '' }));
        alert(t('settings_saved_success'));
    };

    const handleRemoveLogo = () => {
        setSettings(prev => ({...prev, companyLogo: ''}));
    }

    return (
        <div className="container mx-auto max-w-4xl">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-700">{t('admin_panel_title')}</h1>
            </div>

            <SettingSection title={t('general_settings')}>
                <div className="space-y-4">
                    <FormRow label={t('company_name_label')}>
                        <input 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={t('company_name_placeholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </FormRow>
                    <FormRow label={t('company_logo_label')}>
                        <div className="flex items-center gap-4">
                            {settings.companyLogo && <img src={settings.companyLogo} alt="Company Logo" className="h-16 w-auto max-h-16 object-contain border rounded-md" />}
                            <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            <label htmlFor="logo-upload" className="cursor-pointer bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300">
                                {t('upload_logo')}
                            </label>
                            {settings.companyLogo && (
                                <button onClick={handleRemoveLogo} className="bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200">
                                    {t('remove_logo')}
                                </button>
                            )}
                        </div>
                    </FormRow>
                    <div className="flex justify-end mt-4">
                        <button onClick={handleSettingsSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            {t('save_settings')}
                        </button>
                    </div>
                </div>
            </SettingSection>

            <SettingSection title={t('user_management')}>
                <form onSubmit={handleUserFormSubmit} className="space-y-4">
                    <FormRow label={t('username')}>
                        <input 
                            name="username"
                            value={userForm.username}
                            onChange={handleUserFormChange}
                            placeholder={t('username_placeholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            required
                        />
                    </FormRow>
                    <FormRow label={t('password')}>
                        <input
                            name="password"
                            type="password"
                            value={userForm.password}
                            onChange={handleUserFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            required
                        />
                    </FormRow>
                    <FormRow label={t('job_title')}>
                         <input
                            name="jobTitle"
                            value={userForm.jobTitle}
                            onChange={handleUserFormChange}
                            placeholder={t('job_title_placeholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </FormRow>
                    <div className="flex justify-end mt-4">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            {t('create_update_user')}
                        </button>
                    </div>
                </form>
            </SettingSection>

            <SettingSection title={t('employee_permissions')}>
                 <div className="space-y-4">
                    <FormRow label={t('select_employee')}>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option>{t('supervisor_mohamed')}</option>
                            <option>{t('supervisor_khaled')}</option>
                        </select>
                    </FormRow>
                    <div className="space-y-2">
                        <div className="grid grid-cols-5 items-center gap-4 py-2 font-semibold text-xs text-gray-500 uppercase">
                            <span className="col-span-1">{t('section')}</span>
                            <div className="col-span-4 grid grid-cols-4 text-center">
                                <span>{t('view')}</span>
                                <span>{t('add')}</span>
                                <span>{t('edit')}</span>
                                <span>{t('delete')}</span>
                            </div>
                        </div>
                       {sections.map(section => (
                            <PermissionRow key={section} section={section} />
                       ))}
                    </div>
                     <div className="flex justify-end mt-4">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            {t('save_permissions')}
                        </button>
                    </div>
                </div>
            </SettingSection>

            <SettingSection title={t('trip_settings')}>
                 <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 mb-2">{t('trip_categories')}</h4>
                    <div className="space-y-2">
                        {tripCategoryKeys.map(catKey => (
                            <div key={catKey} className="flex justify-between items-center p-2 border rounded-md">
                                <span>{t(catKey)}</span>
                                <div className="flex space-x-2 space-x-reverse">
                                    <button onClick={() => handleAction(t('edit'), t(catKey))} className="text-blue-600 hover:text-blue-800"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => handleAction(t('delete'), t(catKey))} className="text-red-600 hover:text-red-800"><DeleteIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            {t('add_new_category')}
                        </button>
                    </div>
                </div>
            </SettingSection>

            <SettingSection title={t('expense_settings')}>
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 mb-2">{t('expense_types')}</h4>
                    <div className="space-y-2">
                        {expenseTypes.map(typeKey => (
                             <div key={typeKey} className="flex justify-between items-center p-2 border rounded-md">
                                <span>{t(typeKey)}</span>
                                <div className="flex space-x-2 space-x-reverse">
                                    <button onClick={() => handleAction(t('edit'), t(typeKey))} className="text-blue-600 hover:text-blue-800"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => handleAction(t('delete'), t(typeKey))} className="text-red-600 hover:text-red-800"><DeleteIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            {t('add_new_type')}
                        </button>
                    </div>
                </div>
            </SettingSection>
            
        </div>
    );
};

export default AdminPanel;