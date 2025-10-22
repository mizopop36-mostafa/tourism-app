import React, { useState, useEffect } from 'react';
import { Client, Supervisor, ClientType } from '../types';
import { useTranslation } from '../hooks/useTranslation';

type Person = Client | Supervisor;

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (person: any) => void;
    person: Person | null;
    personType: 'clients' | 'supervisors';
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

const ClientSupervisorModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, person, personType }) => {
    const { t } = useTranslation();
    
    const isClient = personType === 'clients';
    
    const getInitialState = () => ({
        name: '',
        phone: '',
        ...(isClient && { clientType: ClientType.INDIVIDUAL }),
    });

    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        if (person) {
            const { id, totalTrips, type, ...editableData } = person;
            setFormData(editableData);
        } else {
            setFormData(getInitialState());
        }
    }, [person, isOpen, personType]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const getTitle = () => {
        if (person) { // Editing
            return isClient ? t('edit_client') : t('edit_supervisor');
        }
        // Adding new
        return isClient ? t('add_new_client') : t('add_new_supervisor');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6 text-gray-800">{getTitle()}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label={t('name')} name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label={t('phone_number')} name="phone" value={formData.phone} onChange={handleChange} required />
                    {isClient && (
                         <SelectField 
                            label={t('client_type')} 
                            name="clientType" 
                            value={(formData as any).clientType} 
                            onChange={handleChange} 
                            options={Object.values(ClientType).map(v => ({value: v, label: t(v)}))} 
                        />
                    )}
                    
                    <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientSupervisorModal;