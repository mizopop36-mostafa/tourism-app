import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, PaymentMethod } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Expense) => void;
    expense: Expense | null;
}

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

const SelectField: React.FC<{label: string, options: {value: string, label: string}[], [key: string]: any}> = ({ label, options, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    </div>
);

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave, expense }) => {
    const { t } = useTranslation();
    
    const initialExpenseState: Omit<Expense, 'id'> = {
        category: ExpenseCategory.DRIVER_CUSTODY,
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: PaymentMethod.CASH,
    };

    const [formData, setFormData] = useState<Omit<Expense, 'id'>>({ ...initialExpenseState });

    useEffect(() => {
        if (expense) {
            setFormData({ ...expense });
        } else {
            setFormData({ ...initialExpenseState });
        }
    }, [expense, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: expense?.id || Date.now() });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6 text-gray-800">{expense ? t('edit_expense') : t('add_new_expense')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <SelectField 
                        label={t('expense_category')} 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        options={Object.values(ExpenseCategory).map(v => ({value: v, label: t(v)}))} 
                    />
                    <InputField label={t('description')} name="description" value={formData.description} onChange={handleChange} required />
                    <InputField label={t('amount')} name="amount" type="number" min="0" value={formData.amount} onChange={handleChange} required />
                    <SelectField 
                        label={t('payment_method')} 
                        name="paymentMethod" 
                        value={formData.paymentMethod} 
                        onChange={handleChange} 
                        options={Object.values(PaymentMethod).map(v => ({value: v, label: t(v)}))}
                    />
                    <InputField label={t('date')} name="date" type="date" value={formData.date} onChange={handleChange} required />
                    
                    <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;