import React, { useState } from 'react';

export default function RideHistoryModal({ isOpen, onClose, onRebookRoute }) {
  if (!isOpen) return null;

  const [filter, setFilter] = useState('completed');
  const [ratedTrips, setRatedTrips] = useState({});

  const rides = [
    {
      id: 'trip-9081',
      date: 'Today, 2:30 PM',
      pickup: 'Downtown Financial Center',
      dropoff: 'International Airport (Terminal 3)',
      cabType: 'Velox Executive',
      car: 'Mercedes-Benz E-Class',
      driver: 'Elena Rostova',
      fare: 34.50,
      distance: '18.4 km',
      duration: '28 mins',
      status: 'completed',
      payment: 'Visa •••• 4242'
    },
    {
      id: 'trip-9044',
      date: 'Yesterday, 8:15 PM',
      pickup: 'The Ritz Luxury Promenade & Mall',
      dropoff: 'Apartment 4B, 742 Evergreen Terrace',
      cabType: 'Velox Comfort',
      car: 'Toyota Camry Hybrid',
      driver: 'Marcus Vance',
      fare: 16.80,
      distance: '9.2 km',
      duration: '16 mins',
      status: 'completed',
      payment: 'Velox Wallet'
    },
    {
      id: 'trip-8991',
      date: 'Oct 11, 10:00 AM',
      pickup: 'Grand Central Metro & Rail Hub',
      dropoff: 'Silicon Cyber Technology Park',
      cabType: 'Velox Zero EV',
      car: 'Tesla Model Y',
      driver: 'Sophia Miller',
      fare: 22.10,
      distance: '12.5 km',
      duration: '20 mins',
      status: 'completed',
      payment: 'Apple Pay'
    }
  ];

  const handleRate = (tripId, stars) => {
    setRatedTrips((prev) => ({ ...prev, [tripId]: stars }));
  };

  const handleDownloadReceipt = (trip) => {
    const receiptContent = `
========================================
           VELOX URBAN MOBILITY
             Official Tax Receipt
========================================
Receipt ID:    ${trip.id}
Date:          ${trip.date}
Vehicle Class: ${trip.cabType} (${trip.car})
Chauffeur:     ${trip.driver}
----------------------------------------
Pickup:        ${trip.pickup}
Dropoff:       ${trip.dropoff}
Trip Distance: ${trip.distance}
Trip Duration: ${trip.duration}
----------------------------------------
Total Paid:    $${trip.fare.toFixed(2)}
Payment:       ${trip.payment}
Status:        PAID & VERIFIED
========================================
Thank you for traveling with Velox.
========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Velox-Receipt-${trip.id}.txt`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-panel-glow rounded-3xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm transition-all"
        >
          ✕
        </button>

        <div className="border-b border-white/10 pb-4 mb-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>📜</span> Your Ride History
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Review past receipts, download invoices, rate drivers, and rebook routes instantly.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-4">
          {['completed', 'upcoming', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Rides List */}
        {filter === 'completed' && (
          <div className="space-y-3">
            {rides.map((trip) => {
              const currentRating = ratedTrips[trip.id] || 5;
              return (
                <div
                  key={trip.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400">{trip.cabType}</span>
                      <span className="text-xs text-gray-400">• {trip.date}</span>
                    </div>
                    <div className="text-base font-extrabold text-white">
                      ${trip.fare.toFixed(2)}
                    </div>
                  </div>

                  {/* Route Visualizer */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-gray-200">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      <span className="font-medium">{trip.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      <span className="font-medium">{trip.dropoff}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
                    <div className="text-gray-400 flex items-center gap-3">
                      <span>👤 {trip.driver}</span>
                      <span>📏 {trip.distance}</span>
                      <span>⏱️ {trip.duration}</span>
                    </div>

                    {/* Interactive Star Rating */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400 mr-1">Rate:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(trip.id, star)}
                          className={`text-sm transition-transform hover:scale-125 ${
                            star <= currentRating ? 'text-amber-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleDownloadReceipt(trip)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-gray-300 border border-white/10 transition-all"
                    >
                      📄 Download Invoice
                    </button>
                    <button
                      onClick={() => {
                        onRebookRoute(trip.pickup, trip.dropoff);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-black text-[11px] font-bold text-amber-300 transition-all border border-amber-500/40"
                    >
                      🔄 Rebook Route
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filter !== 'completed' && (
          <div className="py-12 text-center text-gray-400 text-xs">
            No {filter} rides found. Your upcoming reservations will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
