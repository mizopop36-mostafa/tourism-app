import React, { useState } from 'react';
import { Trip } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import TripModal from '../components/TripModal';
import { EditIcon, DeleteIcon } from '../components/icons/Icons';

const mockTrips: Trip[] = [
  { id: 1, name: 'رحلة الأهرامات وأبو الهول', costAdult: 350, costChild: 200, sellPrice: 500, sellPriceChild: 300, flightCost: 0, flightSellPrice: 0, carCost: 100, carSellPrice: 150 },
  { id: 2, name: 'رحلة الأقصر وأسوان (3 أيام)', costAdult: 2000, costChild: 1200, sellPrice: 2500, sellPriceChild: 1500, flightCost: 800, flightSellPrice: 1000, carCost: 200, carSellPrice: 300 },
  { id: 3, name: 'جولة في القاهرة القديمة', costAdult: 200, costChild: 100, sellPrice: 300, sellPriceChild: 150, flightCost: 0, flightSellPrice: 0, carCost: 50, carSellPrice: 80 },
  { id: 4, name: 'رحلة سفاري الصحراء', costAdult: 400, costChild: 250, sellPrice: 550, sellPriceChild: 350, flightCost: 0, flightSellPrice: 0, carCost: 150, carSellPrice: 200 },
];

const Trips: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>(mockTrips);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const { t } = useTranslation();

    const handleOpenModalForNew = () => {
        setEditingTrip(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (trip: Trip) => {
        setEditingTrip(trip);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTrip(null);
    };

    const handleSaveTrip = (tripToSave: Trip) => {
        if (editingTrip) {
            setTrips(trips.map(t => t.id === tripToSave.id ? tripToSave : t));
        } else {
            setTrips([{ ...tripToSave, id: Date.now() }, ...trips]);
        }
        handleCloseModal();
    };

    const handleDeleteTrip = (tripId: number) => {
        if (window.confirm(t('confirm_delete_trip'))) {
            setTrips(trips.filter(t => t.id !== tripId));
        }
    };
    
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-700">{t('trips_list')}</h1>
                <button 
                    onClick={handleOpenModalForNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
                    {t('add_new_trip')}
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('trip_name')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('sell_price_adult')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('sell_price_child')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cost_adult')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cost_child')}</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {trips.map(trip => (
                            <tr key={trip.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trip.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{trip.sellPrice.toLocaleString()} {t('EGP_currency')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{trip.sellPriceChild.toLocaleString()} {t('EGP_currency')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{trip.costAdult.toLocaleString()} {t('EGP_currency')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{trip.costChild.toLocaleString()} {t('EGP_currency')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <button onClick={() => handleOpenModalForEdit(trip)} className="text-blue-600 hover:text-blue-900" title={t('edit')}>
                                            <EditIcon className="h-5 w-5"/>
                                        </button>
                                        <button onClick={() => handleDeleteTrip(trip.id)} className="text-red-600 hover:text-red-900" title={t('delete')}>
                                            <DeleteIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TripModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTrip}
                trip={editingTrip}
            />
        </div>
    );
};

export default Trips;