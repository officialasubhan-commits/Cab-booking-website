import React, { useState } from 'react';

export default function ProfileModal({ isOpen, onClose, onQuickBookLocation }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    name: 'Ayush Lade',
    email: 'ayush.lade@example.com',
    phone: '+1 (555) 782-9910',
    emergencyContact: '+1 (555) 441-2099',
    memberTier: 'Platinum Elite',
    ridesCount: 48,
    riderRating: 4.97,
    co2SavedKg: 94
  });

  const savedPlaces = [
    { label: 'Home', address: 'Apartment 4B, 742 Evergreen Terrace', icon: '🏠' },
    { label: 'Work', address: 'Tech Horizon Tower, 88 Innovation Blvd', icon: '🏢' },
    { label: 'Fitness Center', address: 'Olympus Athletic Club, 12 Park Way', icon: '🏋️' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel-glow rounded-3xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm transition-all"
        >
          ✕
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-5 mb-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
            AL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">{userProfile.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {userProfile.memberTier}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{userProfile.email}</p>
            <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
              <span>★ {userProfile.riderRating} Rider Score</span>
              <span>•</span>
              <span>🚗 {userProfile.ridesCount} Rides</span>
              <span>•</span>
              <span className="text-emerald-400">🌱 {userProfile.co2SavedKg}kg CO₂ Saved</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('places')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'places'
                ? 'bg-amber-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Saved Places
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'safety'
                ? 'bg-amber-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Emergency & Safety
          </button>
        </div>

        {/* Tab 1: Personal Details */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">Email Address</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-400 uppercase">Preferred Language</label>
                <select className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium mt-1 bg-[#111827]">
                  <option>English (United States)</option>
                  <option>French (Français)</option>
                  <option>Spanish (Español)</option>
                  <option>Hindi (हिंदी)</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-amber-300">Platinum Elite Member Perks</div>
                <div className="text-[11px] text-gray-300">Zero cancellation penalties • Free 15 min wait time • Priority dispatch</div>
              </div>
              <span className="text-2xl">👑</span>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Places */}
        {activeTab === 'places' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">
              Save your frequent routes for effortless 1-click booking.
            </p>
            {savedPlaces.map((place, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl p-2 rounded-xl bg-gray-800">{place.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{place.label}</div>
                    <div className="text-[11px] text-gray-400">{place.address}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onQuickBookLocation) {
                      onQuickBookLocation(place.address);
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black text-xs font-bold transition-all"
                >
                  Book Ride
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Emergency & Safety */}
        {activeTab === 'safety' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <span>🛡️</span>
                <span>Velox 24/7 Safety Shield</span>
              </div>
              <p className="text-xs text-gray-300">
                Your trips are protected with end-to-end GPS monitoring, discreet emergency button, and automatic collision detection.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 uppercase">Emergency Contact Number</label>
              <input
                type="text"
                value={userProfile.emergencyContact}
                onChange={(e) => setUserProfile({ ...userProfile, emergencyContact: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium mt-1"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                This number is immediately notified with live trip tracking if you trigger the SOS button.
              </p>
            </div>

            <button
              onClick={() => alert('Emergency SOS test signal triggered. Live telemetry shared with contact.')}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/30"
            >
              Test Emergency SOS Broadcast
            </button>
          </div>
        )}

        {/* Save button */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              alert('Profile changes saved successfully!');
              onClose();
            }}
            className="btn-primary text-xs py-2.5 px-6"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
