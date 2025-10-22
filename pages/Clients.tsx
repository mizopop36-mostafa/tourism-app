
import React, { useState } from 'react';
// FIX: Import the 'Currency' enum to fix type errors.
import { Client, Supervisor, ClientType, Booking, TripTime, PaymentMethod, TripStatus, Currency } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { EditIcon, DeleteIcon, ChevronDownIcon } from '../components/icons/Icons';
import ClientSupervisorModal from '../components/ClientSupervisorModal';

// Mock bookings data (ideally this would come from a shared context or API call)
const mockBookings: Booking[] = [
  // FIX: Use Currency.EGP enum member instead of a string literal. The previous ternary was also incorrect.
  { id: 1, clientName: 'أحمد محمود', clientType: ClientType.INDIVIDUAL, hotel: 'فندق النيل', roomNumber: '502', adults: 2, children: 1, phone: '01234567890', tripName: 'رحلة الأهرامات', tripDate: '2024-08-15', tripTime: TripTime.MORNING, pricePerPerson: 500, supervisorName: 'محمد علي', paymentMethod: PaymentMethod.CASH, currency: Currency.EGP, paid: 1500, discount: 0, deliveryFee: 50, total: 1550, status: TripStatus.CONFIRMED },
  // FIX: Use Currency.EGP enum member instead of a string literal.
  { id: 2, clientName: 'شركة النور للسياحة', clientType: ClientType.COMPANY, hotel: 'N/A', roomNumber: 'N/A', adults: 15, children: 5, phone: '01098765432', tripName: 'رحلة الأقصر وأسوان', tripDate: '2024-09-01', tripTime: TripTime.EVENING, pricePerPerson: 2500, supervisorName: 'خالد إبراهيم', paymentMethod: PaymentMethod.BANK_TRANSFER, currency: Currency.EGP, paid: 40000, discount: 5, deliveryFee: 0, total: 47500, status: TripStatus.PENDING },
  // FIX: Use Currency.EGP enum member instead of a string literal.
  { id: 3, clientName: 'أحمد محمود', clientType: ClientType.INDIVIDUAL, hotel: 'فندق ماريوت', roomNumber: '1210', adults: 1, children: 0, phone: '01122334455', tripName: 'جولة في القاهرة القديمة', tripDate: '2024-08-20', tripTime: TripTime.MORNING, pricePerPerson: 300, supervisorName: 'محمد علي', paymentMethod: PaymentMethod.E_WALLET, currency: Currency.EGP, paid: 300, discount: 0, deliveryFee: 0, total: 300, status: TripStatus.CANCELED },
];

const mockClients: Client[] = [
    { id: 1, name: 'أحمد محمود', type: 'client', clientType: ClientType.INDIVIDUAL, phone: '01234567890', totalTrips: 2 },
    { id: 2, name: 'شركة النور للسياحة', type: 'client', clientType: ClientType.COMPANY, phone: '01098765432', totalTrips: 1 },
    { id: 3, name: 'سارة عبد الرحمن', type: 'client', clientType: ClientType.INDIVIDUAL, phone: '01122334455', totalTrips: 0 },
];

const mockSupervisors: Supervisor[] = [
    { id: 1, name: 'محمد علي', type: 'supervisor', phone: '01001001001', totalTrips: 25 },
    { id: 2, name: 'خالد إبراهيم', type: 'supervisor', phone: '01221221221', totalTrips: 18 },
];

type Person = Client | Supervisor;

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

const Clients: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'clients' | 'supervisors'>('clients');
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [supervisors, setSupervisors] = useState<Supervisor[]>(mockSupervisors);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerson, setEditingPerson] = useState<Person | null>(null);
    const { t } = useTranslation();

    const handleToggleRow = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };
    
    const handleOpenModalForNew = () => {
        setEditingPerson(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (person: Person) => {
        setEditingPerson(person);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPerson(null);
    };
    
    const handleSave = (personToSave: Omit<Person, 'id' | 'totalTrips'>) => {
        if (editingPerson) {
             if (activeTab === 'clients') {
                setClients(clients.map(c => c.id === editingPerson.id ? { ...c, ...personToSave } as Client : c));
            } else {
                setSupervisors(supervisors.map(s => s.id === editingPerson.id ? { ...s, ...personToSave } as Supervisor : s));
            }
        } else {
             if (activeTab === 'clients') {
                setClients([{ ...personToSave, id: Date.now(), totalTrips: 0, type: 'client' } as Client, ...clients]);
            } else {
                setSupervisors([{ ...personToSave, id: Date.now(), totalTrips: 0, type: 'supervisor' } as Supervisor, ...supervisors]);
            }
        }
        handleCloseModal();
    };
    
     const handleDelete = (id: number) => {
        const confirmText = activeTab === 'clients' ? t('confirm_delete_client') : t('confirm_delete_supervisor');
        if (window.confirm(confirmText)) {
            if (activeTab === 'clients') {
                setClients(clients.filter(c => c.id !== id));
            } else {
                setSupervisors(supervisors.filter(s => s.id !== id));
            }
        }
    };


    const renderTable = (data: Person[]) => {
       const bookingsForPerson = (person: Person) => {
            if (person.type === 'client') {
                return mockBookings.filter(b => b.clientName === person.name);
            }
            if (person.type === 'supervisor') {
                return mockBookings.filter(b => b.supervisorName === person.name);
            }
            return [];
        };

        return (
         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3"></th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                        {activeTab === 'clients' && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('phone_number')}</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('total_trips')}</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => {
                        const personBookings = bookingsForPerson(item);
                        return (
                        <React.Fragment key={item.id}>
                            <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => handleToggleRow(item.id)}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {personBookings.length > 0 && <ChevronDownIcon className={`h-5 w-5 transition-transform ${expandedRowId === item.id ? 'rotate-180' : ''}`} />}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                {item.type === 'client' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t(item.clientType)}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{personBookings.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => handleOpenModalForEdit(item)} className="text-blue-600 hover:text-blue-900" title={t('edit')}>
                                            <EditIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900" title={t('delete')}>
                                            <DeleteIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {expandedRowId === item.id && personBookings.length > 0 && (
                                <tr>
                                    <td colSpan={activeTab === 'clients' ? 6 : 5} className="p-4 bg-gray-50">
                                        <h4 className="text-md font-semibold mb-2 text-gray-700">{t('booking_history')}</h4>
                                        <div className="overflow-x-auto border rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">{t('trip_name')}</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">{t('date')}</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">{activeTab === 'clients' ? t('supervisor') : t('client')}</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">{t('total')}</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">{t('paid')}</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">{t('remaining')}</th>
                                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">{t('status')}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white">
                                                {personBookings.map(booking => (
                                                <tr key={booking.id}>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{booking.tripName}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{booking.tripDate}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm">{activeTab === 'clients' ? booking.supervisorName : booking.clientName}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold">{booking.total.toLocaleString()} {t('EGP_currency')}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">{booking.paid.toLocaleString()} {t('EGP_currency')}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-red-600">{(booking.total - booking.paid).toLocaleString()} {t('EGP_currency')}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm"><StatusBadge status={booking.status} /></td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {expandedRowId === item.id && personBookings.length === 0 && (
                                 <tr>
                                    <td colSpan={activeTab === 'clients' ? 6 : 5} className="p-4 bg-gray-50 text-center text-gray-500">
                                        {t('no_bookings_found')}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-700">
                    {activeTab === 'clients' ? t('clients') : t('supervisors')}
                </h1>
                <button onClick={handleOpenModalForNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                    {/* FIX: Use `supervisor_singular` to avoid duplicate key error in translation files. */}
                    {t('add_new')} {activeTab === 'clients' ? t('client') : t('supervisor_singular')}
                </button>
            </div>
            
             <div className="mb-4 border-b border-gray-200">
                <nav className="flex -mb-px" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`w-1/2 border-b-2 py-3 px-1 text-center text-sm font-medium ${
                            activeTab === 'clients'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t('clients')}
                    </button>
                    <button
                        onClick={() => setActiveTab('supervisors')}
                         className={`w-1/2 border-b-2 py-3 px-1 text-center text-sm font-medium ${
                            activeTab === 'supervisors'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t('trip_supervisors')}
                    </button>
                </nav>
            </div>

            {activeTab === 'clients' ? renderTable(clients) : renderTable(supervisors)}

            <ClientSupervisorModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                person={editingPerson}
                personType={activeTab}
            />
        </div>
    );
};

export default Clients;