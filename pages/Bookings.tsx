
import React, { useState } from 'react';
import { Booking, ClientType, TripTime, PaymentMethod, Currency, TripStatus, Supervisor } from '../types';
import { PrintIcon, WhatsAppIcon, EditIcon, ClientIcon } from '../components/icons/Icons';
import BookingModal from '../components/BookingModal';
import { useTranslation } from '../hooks/useTranslation';

const mockBookings: Booking[] = [
  { id: 1, clientName: 'أحمد محمود', clientType: ClientType.INDIVIDUAL, hotel: 'فندق النيل', roomNumber: '502', adults: 2, children: 1, phone: '01234567890', tripName: 'رحلة الأهرامات', tripDate: '2024-08-15', tripTime: TripTime.MORNING, pricePerPerson: 500, supervisorName: 'محمد علي', paymentMethod: PaymentMethod.CASH, currency: Currency.EGP, paid: 1500, discount: 0, deliveryFee: 50, total: 1550, status: TripStatus.CONFIRMED },
  { id: 2, clientName: 'شركة النور للسياحة', clientType: ClientType.COMPANY, hotel: 'مكان التجمع: ميدان التحرير', roomNumber: 'N/A', adults: 15, children: 5, phone: '01098765432', tripName: 'رحلة الأقصر وأسوان', tripDate: '2024-09-01', tripTime: TripTime.EVENING, pricePerPerson: 2500, supervisorName: 'خالد إبراهيم', paymentMethod: PaymentMethod.BANK_TRANSFER, currency: Currency.EGP, paid: 40000, discount: 5, deliveryFee: 0, total: 47500, status: TripStatus.PENDING },
  { id: 3, clientName: 'سارة عبد الرحمن', clientType: ClientType.INDIVIDUAL, hotel: 'فندق ماريوت', roomNumber: '1210', adults: 1, children: 0, phone: '01122334455', tripName: 'جولة في القاهرة القديمة', tripDate: '2024-08-20', tripTime: TripTime.MORNING, pricePerPerson: 300, supervisorName: 'محمد علي', paymentMethod: PaymentMethod.E_WALLET, currency: Currency.USD, paid: 300, discount: 0, deliveryFee: 0, total: 300, status: TripStatus.CANCELED },
];

const mockSupervisors: Supervisor[] = [
    // FIX: The `type` for a Supervisor must be 'supervisor'.
    { id: 1, name: 'محمد علي', type: 'supervisor', phone: '01001001001', totalTrips: 25 },
    { id: 2, name: 'خالد إبراهيم', type: 'supervisor', phone: '01221221221', totalTrips: 18 },
];

const StatusBadge: React.FC<{ status: TripStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const statusClasses = {
    [TripStatus.CONFIRMED]: "bg-green-100 text-green-800",
    [TripStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [TripStatus.CANCELED]: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{t(status)}</span>;
};

const Bookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const { t } = useTranslation();

    const handlePrint = (bookingId: number) => {
        alert(`${t('print_booking_number')} ${bookingId}`);
    };

    const handleWhatsApp = (booking: Booking, recipient: 'client' | 'supervisor') => {
        const supervisor = mockSupervisors.find(s => s.name === booking.supervisorName);
        const recipientPhone = recipient === 'client' ? booking.phone : supervisor?.phone;

        if (!recipientPhone) {
            alert(t('phone_not_available'));
            return;
        }

        const message = `
*${t('al_salam_tourism')}*

*${t('booking_details')}*

*${t('client_name')}:* ${booking.clientName}
*${t('trip')}:* ${booking.tripName}
*${t('date')}:* ${booking.tripDate} - ${t(booking.tripTime)}
*${t('guests')}:* ${booking.adults} ${t('adults')}, ${booking.children} ${t('children')}
*${t('hotel_pickup')}:* ${booking.hotel}
*${t('supervisor')}:* ${booking.supervisorName}

*${t('financials')}*
*${t('total')}:* ${booking.total.toLocaleString()} ${t(booking.currency || 'EGP')}
*${t('paid_amount')}:* ${booking.paid.toLocaleString()} ${t(booking.currency || 'EGP')}
*${t('remaining_amount')}:* ${(booking.total - booking.paid).toLocaleString()} ${t(booking.currency || 'EGP')}

${t('whatsapp_footer')}
        `.trim();

        const whatsappUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleOpenModalForEdit = (booking: Booking) => {
        setEditingBooking(booking);
        setIsModalOpen(true);
    };

    const handleOpenModalForNew = () => {
        setEditingBooking(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBooking(null);
    };

    const handleSaveBooking = (bookingToSave: Booking) => {
        if (editingBooking) {
            setBookings(bookings.map(b => b.id === bookingToSave.id ? bookingToSave : b));
        } else {
            setBookings([bookingToSave, ...bookings]);
        }
        handleCloseModal();
    };
    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-700">{t('bookings_list')}</h1>
                <button 
                    onClick={handleOpenModalForNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                    {t('add_new_booking')}
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {[t('client_name'), t('trip_name'), t('supervisor'), t('guests'), t('financials'), t('status'), t('actions')].map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenModalForEdit(booking)}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{booking.clientName}</div>
                                    <div className="text-sm text-gray-500">{t(booking.clientType)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-800">{booking.tripName}</div>
                                    <div className="text-sm text-gray-500">{booking.tripDate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{booking.supervisorName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                    <div>{`${booking.adults} ${t('adults_short')}`}</div>
                                    <div>{`${booking.children} ${t('children_short')}`}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="text-gray-900">{`${t('total_short')}: ${booking.total.toLocaleString()} ${booking.currency || Currency.EGP}`}</div>
                                    <div className="text-green-600">{`${t('paid_short')}: ${booking.paid.toLocaleString()} ${booking.currency || Currency.EGP}`}</div>
                                    <div className="text-red-600">{`${t('remaining_short')}: ${(booking.total - booking.paid).toLocaleString()} ${booking.currency || Currency.EGP}`}</div>
                                    <div className="text-sm text-gray-500 mt-1">{t(booking.paymentMethod)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={booking.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => handleOpenModalForEdit(booking)} className="text-blue-600 hover:text-blue-900" title={t('edit')}>
                                          <EditIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handlePrint(booking.id)} className="text-gray-600 hover:text-gray-900" title={t('print')}>
                                          <PrintIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleWhatsApp(booking, 'client')} className="text-green-600 hover:text-green-900" title={t('whatsapp_client')}>
                                          <WhatsAppIcon className="h-5 w-5"/>
                                        </button>
                                         <button onClick={() => handleWhatsApp(booking, 'supervisor')} className="text-purple-600 hover:text-purple-900" title={t('whatsapp_supervisor')}>
                                          <ClientIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <BookingModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveBooking}
                booking={editingBooking}
            />
        </div>
    );
};

export default Bookings;