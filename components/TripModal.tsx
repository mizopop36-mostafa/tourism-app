import React, { useState, useEffect } from 'react';
import { Trip } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface TripModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (trip: Trip) => void;
    trip: Trip | null;
}

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

const TripModal: React.FC<TripModalProps> = ({ isOpen, onClose, onSave, trip }) => {
    const { t } = useTranslation();
    
    const initialTripState: Omit<Trip, 'id'> = {
        name: '',
        costAdult: 0,
        costChild: 0,
        sellPrice: 0,
        sellPriceChild: 0,
        flightCost: 0,
        flightSellPrice: 0,
        carCost: 0,
        carSellPrice: 0,
    };

    const [formData, setFormData] = useState<Omit<Trip, 'id'>>({ ...initialTripState });

    useEffect(() => {
        if (trip) {
            setFormData({ ...trip });
        } else {
            setFormData({ ...initialTripState });
        }
    }, [trip, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: trip?.id || Date.now() });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6 text-gray-800">{trip ? t('edit_trip') : t('add_new_trip')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label={t('trip_name')} name="name" value={formData.name} onChange={handleChange} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label={t('sell_price_adult')} name="sellPrice" type="number" min="0" value={formData.sellPrice} onChange={handleChange} />
                        <InputField label={t('sell_price_child')} name="sellPriceChild" type="number" min="0" value={formData.sellPriceChild} onChange={handleChange} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label={t('cost_adult')} name="costAdult" type="number" min="0" value={formData.costAdult} onChange={handleChange} />
                        <InputField label={t('cost_child')} name="costChild" type="number" min="0" value={formData.costChild} onChange={handleChange} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label={t('flight_sell_price')} name="flightSellPrice" type="number" min="0" value={formData.flightSellPrice} onChange={handleChange} />
                        <InputField label={t('flight_cost')} name="flightCost" type="number" min="0" value={formData.flightCost} onChange={handleChange} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label={t('car_sell_price')} name="carSellPrice" type="number" min="0" value={formData.carSellPrice} onChange={handleChange} />
                        <InputField label={t('car_cost')} name="carCost" type="number" min="0" value={formData.carCost} onChange={handleChange} />
                    </div>
                    <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TripModal;