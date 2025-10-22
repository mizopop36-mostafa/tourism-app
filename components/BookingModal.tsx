
import React, { useState, useEffect } from 'react';
import { Booking, ClientType, TripTime, PaymentMethod, Currency, TripStatus } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (booking: Booking) => void;
    booking: Booking | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onSave, booking, onClose }) => {
    const { t } = useTranslation();
    
    const initialBookingState: Omit<Booking, 'id'> = {
        clientName: '',
        clientType: ClientType.INDIVIDUAL,
        hotel: '',
        roomNumber: '',
        adults: 1,
        children: 0,
        phone: '',
        tripName: '',
        tripDate: new Date().toISOString().split('T')[0],
        tripTime: TripTime.MORNING,
        pricePerPerson: 0,
        supervisorName: '',
        paymentMethod: PaymentMethod.CASH,
        currency: Currency.EGP,
        paid: 0,
        discount: 0,
        deliveryFee: 0,
        total: 0,
        status: TripStatus.PENDING,
    };

    const [formData, setFormData] = useState<Booking>({...initialBookingState, id: Date.now()});

    useEffect(() => {
        if (booking) {
            setFormData({ ...booking });
        } else {
            setFormData({ ...initialBookingState, id: Date.now() });
        }
    }, [booking, isOpen]);
    
    useEffect(() => {
        const totalAdults = Number(formData.adults) || 0;
        const price = Number(formData.pricePerPerson) || 0;
        const subtotal = (totalAdults + (Number(formData.children) || 0)) * price;
        const discountAmount = subtotal * ((Number(formData.discount) || 0) / 100);
        const delivery = Number(formData.deliveryFee) || 0;
        const finalTotal = subtotal - discountAmount + delivery;
        setFormData(prev => ({ ...prev, total: finalTotal }));
    }, [formData.adults, formData.children, formData.pricePerPerson, formData.discount, formData.deliveryFee]);


    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? Number(value) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const remaining = formData.total - formData.paid;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-6 text-gray-800">{booking ? t('edit_booking') : t('add_new_booking')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label={t('client_name')} name="clientName" value={formData.clientName} onChange={handleChange} required />
                        <SelectField label={t('client_type')} name="clientType" value={formData.clientType} onChange={handleChange} options={Object.values(ClientType).map(v => ({value: v, label: t(v)}))} />
                        <InputField label={t('hotel_pickup')} name="hotel" value={formData.hotel} onChange={handleChange} />
                        <InputField label={t('room_number')} name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
                        <InputField label={t('phone_number')} name="phone" value={formData.phone} onChange={handleChange} required />
                        <InputField label={t('trip_name')} name="tripName" value={formData.tripName} onChange={handleChange} required />
                        <InputField label={t('trip_date')} name="tripDate" type="date" value={formData.tripDate} onChange={handleChange} required />
                        <SelectField label={t('trip_time')} name="tripTime" value={formData.tripTime} onChange={handleChange} options={Object.values(TripTime).map(v => ({value: v, label: t(v)}))} />
                        <InputField label={t('supervisor_name')} name="supervisorName" value={formData.supervisorName} onChange={handleChange} />
                        <InputField label={t('adults_count')} name="adults" type="number" min="0" value={formData.adults} onChange={handleChange} />
                        <InputField label={t('children_count')} name="children" type="number" min="0" value={formData.children} onChange={handleChange} />
                        <InputField label={t('price_per_person')} name="pricePerPerson" type="number" min="0" step="0.01" value={formData.pricePerPerson} onChange={handleChange} />
                        <SelectField label={t('payment_method')} name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={Object.values(PaymentMethod).map(v => ({value: v, label: t(v)}))} />
                        <SelectField label={t('currency')} name="currency" value={formData.currency || ''} onChange={handleChange} options={Object.values(Currency).map(v => ({value: v, label: t(v)}))} />
                        <InputField label={t('paid_amount')} name="paid" type="number" min="0" step="0.01" value={formData.paid} onChange={handleChange} />
                        <InputField label={t('discount_percentage')} name="discount" type="number" min="0" max="100" value={formData.discount} onChange={handleChange} />
                        <InputField label={t('delivery_fee')} name="deliveryFee" type="number" min="0" step="0.01" value={formData.deliveryFee} onChange={handleChange} />
                        <SelectField label={t('booking_status')} name="status" value={formData.status} onChange={handleChange} options={Object.values(TripStatus).map(v => ({value: v, label: t(v)}))} />
                    </div>
                     <div className="mt-6 p-4 bg-gray-100 rounded-lg text-right grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="text-center">
                            <span className="text-md font-bold text-gray-700">{t('total')}: </span>
                            <span className="text-md font-bold text-blue-600">{formData.total.toLocaleString()} {t(formData.currency || 'EGP')}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-md font-bold text-gray-700">{t('paid_amount')}: </span>
                            <span className="text-md font-bold text-green-600">{formData.paid.toLocaleString()} {t(formData.currency || 'EGP')}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-md font-bold text-gray-700">{t('remaining_amount')}: </span>
                            <span className={`text-md font-bold ${remaining > 0 ? 'text-red-600' : 'text-gray-800'}`}>{remaining.toLocaleString()} {t(formData.currency || 'EGP')}</span>
                        </div>
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


export default BookingModal;