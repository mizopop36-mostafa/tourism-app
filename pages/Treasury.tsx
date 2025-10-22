import React from 'react';
import { PrintIcon, WhatsAppIcon } from '../components/icons/Icons';
import { useTranslation } from '../hooks/useTranslation';

interface SummaryCardProps {
    title: string;
    amount: number;
    currency?: string;
    colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, currency, colorClass }) => {
    const { t } = useTranslation();
    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border-r-4 ${colorClass}`}>
            <h4 className="text-gray-500 text-md font-semibold">{title}</h4>
            <p className="text-3xl font-bold text-gray-800 mt-2">
                {amount.toLocaleString()} <span className="text-lg font-medium">{currency || t('EGP_currency')}</span>
            </p>
        </div>
    );
};

const Treasury: React.FC = () => {
    const { t } = useTranslation();
    
    const financials = {
        revenue: 250000,
        expenses: 85000,
        profits: 165000,
        losses: 0,
        bankBalance: 120000,
        eWalletBalance: 35000,
        usd: 5000,
        eur: 2000,
        gbp: 1500,
    };
    
    return (
        <div className="container mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-700">{t('treasury')}</h1>
                <div className="flex space-x-2 space-x-reverse">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <PrintIcon className="h-5 w-5"/> {t('print_report')}
                    </button>
                     <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                        <WhatsAppIcon className="h-5 w-5"/> {t('send_report')}
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-700 mt-10 mb-6">{t('financial_summary')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title={t('total_revenue')} amount={financials.revenue} colorClass="border-green-500" />
                <SummaryCard title={t('total_expenses')} amount={financials.expenses} colorClass="border-red-500" />
                <SummaryCard title={t('total_profits')} amount={financials.profits} colorClass="border-blue-500" />
                <SummaryCard title={t('total_losses')} amount={financials.losses} colorClass="border-yellow-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-700 mt-10 mb-6">{t('cash_balances')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title={t('bank_transfer_balance')} amount={financials.bankBalance} colorClass="border-cyan-500" />
                <SummaryCard title={t('e_wallet_balance')} amount={financials.eWalletBalance} colorClass="border-orange-500" />
            </div>

            <h2 className="text-xl font-bold text-gray-700 mt-10 mb-6">{t('total_currencies')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard title={t('USD')} amount={financials.usd} currency="$" colorClass="border-teal-500" />
                <SummaryCard title={t('EUR')} amount={financials.eur} currency="€" colorClass="border-indigo-500" />
                <SummaryCard title={t('GBP')} amount={financials.gbp} currency="£" colorClass="border-purple-500" />
            </div>
        </div>
    );
};

export default Treasury;