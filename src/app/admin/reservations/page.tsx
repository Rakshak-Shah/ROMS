'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminReservationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    if (user) loadReservations();
  }, [user, loading, router]);

  const loadReservations = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    const tableNumber = prompt('Enter table number:');
    if (!tableNumber) return;
    try {
      await adminService.confirmReservation(id, parseInt(tableNumber));
      loadReservations();
    } catch (error) {
      console.error('Error confirming reservation:', error);
      alert('Failed to confirm reservation');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminService.updateReservationStatus(id, status);
      loadReservations();
    } catch (error) {
      console.error('Error updating reservation status:', error);
      alert('Failed to update reservation status');
    }
  };

  const filteredReservations = filter === 'all' ? reservations : reservations.filter(r => r.status === filter);

  if (loading || isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reservation Management</h1>
          <p className="text-gray-600 mt-2">Manage table reservations</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded capitalize whitespace-nowrap ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReservations.map((reservation) => (
            <div key={reservation._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{reservation.customerInfo?.name}</h3>
                  <p className="text-gray-600 text-sm">{reservation.customerInfo?.phone}</p>
                  <p className="text-gray-500 text-sm">{reservation.customerInfo?.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  reservation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {reservation.status}
                </span>
              </div>

              <div className="border-t pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{reservation.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">{reservation.guests} people</span>
                </div>
                {reservation.tableNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Table:</span>
                    <span className="font-medium">#{reservation.tableNumber}</span>
                  </div>
                )}
                {reservation.specialRequests && (
                  <div className="text-sm mt-2">
                    <span className="text-gray-600">Special Requests:</span>
                    <p className="text-gray-800 mt-1">{reservation.specialRequests}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {reservation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleConfirm(reservation._id)}
                      className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded hover:bg-green-100"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </>
                )}
                {reservation.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(reservation._id, 'completed')}
                      className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(reservation._id, 'no-show')}
                      className="flex-1 bg-orange-50 text-orange-600 px-4 py-2 rounded hover:bg-orange-100"
                    >
                      No Show
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredReservations.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No reservations found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

