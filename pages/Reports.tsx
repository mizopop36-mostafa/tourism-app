import React, { useState, useEffect } from 'react';
import { PrintIcon, WhatsAppIcon } from '../components/icons/Icons';
import { useTranslation } from '../hooks/useTranslation';

const Reports: React.FC = () => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const reportTypes = [
        'reports_revenue_expenses',
        'reports_bookings',
        'reports_trips',
        'reports_profit_loss',
        'reports_currency_exchange',
        'reports_driver_custody',
    ];
    
    const [selectedReportType, setSelectedReportType] = useState(reportTypes[0]);


    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(firstDayOfMonth.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
    }, []);
    
    const handleAction = (action: 'print' | 'whatsapp') => {
        const reportName = t(selectedReportType);
        const actionText = action === 'print' ? t('print') : t('send');
        const dateRangeText = startDate && endDate ? ` ${t('from_date_label')} ${startDate} ${t('to_date_label')} ${endDate}` : '';
        alert(`${actionText} ${t('report')}: ${reportName}${dateRangeText}`);
    };

    return (
        <div className="container mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-700">{t('reports')}</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">{t('select_report_period')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">{t('report_type')}</label>
                        <select 
                            id="report-type"
                            value={selectedReportType}
                            onChange={(e) => setSelectedReportType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {reportTypes.map(type => (
                                <option key={type} value={type}>{t(type)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">{t('from_date')}</label>
                        <input 
                            type="date" 
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">{t('to_date')}</label>
                         <input 
                            type="date" 
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                 <div className="flex justify-end space-x-2 space-x-reverse mt-6 pt-4 border-t">
                     <button onClick={() => handleAction('print')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <PrintIcon className="h-5 w-5"/>
                        <span>{t('print_report')}</span>
                     </button>
                     <button onClick={() => handleAction('whatsapp')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                        <WhatsAppIcon className="h-5 w-5"/>
                        <span>{t('send_report_whatsapp')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;