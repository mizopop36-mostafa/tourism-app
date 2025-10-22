import React, { useState } from 'react';
import { Expense, ExpenseCategory, PaymentMethod } from '../types';
import { EditIcon, DeleteIcon } from '../components/icons/Icons';
import { useTranslation } from '../hooks/useTranslation';
import ExpenseModal from '../components/ExpenseModal';

const mockExpenses: Expense[] = [
  { id: 1, category: ExpenseCategory.DRIVER_CUSTODY, description: 'عهدة للسائق/أحمد للسفر للأقصر', amount: 2000, date: '2024-08-10', paymentMethod: PaymentMethod.CASH },
  { id: 2, category: ExpenseCategory.CAR_MAINTENANCE, description: 'تغيير زيت وفلتر للسيارة رقم 123', amount: 500, date: '2024-08-11', paymentMethod: PaymentMethod.E_WALLET },
  { id: 3, category: ExpenseCategory.SALARIES, description: 'راتب شهر أغسطس - محمد علي', amount: 5000, date: '2024-08-31', paymentMethod: PaymentMethod.BANK_TRANSFER },
  { id: 4, category: ExpenseCategory.COMPANY_RENT, description: 'إيجار المكتب لشهر أغسطس', amount: 3000, date: '2024-08-01', paymentMethod: PaymentMethod.CASH },
  { id: 5, category: ExpenseCategory.CUSTODY_SETTLEMENT, description: 'تصفية عهدة السائق/أحمد', amount: 1850, date: '2024-08-14', paymentMethod: PaymentMethod.CASH },
];

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
    const [activeTab, setActiveTab] = useState<ExpenseCategory>(ExpenseCategory.DRIVER_CUSTODY);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const { t } = useTranslation();

    const tabs = Object.values(ExpenseCategory);
    const filteredExpenses = expenses.filter(exp => exp.category === activeTab);

    const handleOpenModalForNew = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
    };

    const handleSaveExpense = (expenseToSave: Expense) => {
        if (editingExpense) {
            setExpenses(expenses.map(e => e.id === expenseToSave.id ? expenseToSave : e));
        } else {
            setExpenses([{ ...expenseToSave, id: Date.now() }, ...expenses]);
        }
        handleCloseModal();
    };

    const handleDeleteExpense = (expenseId: number) => {
        if (window.confirm(t('confirm_delete_expense'))) {
            setExpenses(expenses.filter(e => e.id !== expenseId));
        }
    };
    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-700">{t('expenses_management')}</h1>
                <button onClick={handleOpenModalForNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                    {t('add_new_expense')}
                </button>
            </div>
            
            <div className="mb-4 border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap shrink-0 border-b-2 py-3 px-4 text-sm font-medium ${
                                activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {t(tab)}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('description')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('payment_method')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredExpenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{expense.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{expense.amount.toLocaleString()} {t('EGP_currency')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t(expense.paymentMethod)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <button onClick={() => handleOpenModalForEdit(expense)} className="text-blue-600 hover:text-blue-900" title={t('edit')}>
                                            <EditIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-900" title={t('delete')}>
                                            <DeleteIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveExpense}
                expense={editingExpense}
            />
        </div>
    );
};

export default Expenses;