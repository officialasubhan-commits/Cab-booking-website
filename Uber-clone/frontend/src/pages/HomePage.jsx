import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TrackingMap from '../components/TrackingMap';
import BookingConsole from '../components/BookingConsole';
import FleetShowcase from '../components/FleetShowcase';
import HowItWorks from '../components/HowItWorks';
import SafetyBanner from '../components/SafetyBanner';
import Footer from '../components/Footer';

import ProfileModal from '../components/ProfileModal';
import RideHistoryModal from '../components/RideHistoryModal';
import PaymentModal from '../components/PaymentModal';
import SupportModal from '../components/SupportModal';

import { CAB_TYPES } from '../data/cabTypes';
import { POPULAR_LOCATIONS } from '../data/mockLocations';

export default function HomePage() {
  // Prepopulate with realistic initial route for instant visual wow factor
  const [pickup, setPickup] = useState(POPULAR_LOCATIONS[1]); // Downtown Financial Center
  const [dropoff, setDropoff] = useState(POPULAR_LOCATIONS[0]); // International Airport
  const [selectedCab, setSelectedCab] = useState(CAB_TYPES[0]);
  const [rideStatus, setRideStatus] = useState('idle'); // 'idle' | 'searching' | 'matched'
  const [driverAssigned, setDriverAssigned] = useState(null);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Smooth scroll helper
  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick book from saved place
  const handleQuickBookLocation = (address) => {
    setDropoff({
      id: `saved-${Date.now()}`,
      name: address.split(',')[0],
      address: address,
      category: 'Saved Place',
      coords: { x: 380, y: 520 }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Rebook route from ride history
  const handleRebookRoute = (pickupName, dropoffName) => {
    const foundPickup = POPULAR_LOCATIONS.find((l) => l.name === pickupName) || {
      id: `hist-p-${Date.now()}`,
      name: pickupName,
      address: pickupName,
      coords: { x: 420, y: 350 }
    };
    const foundDrop = POPULAR_LOCATIONS.find((l) => l.name === dropoffName) || {
      id: `hist-d-${Date.now()}`,
      name: dropoffName,
      address: dropoffName,
      coords: { x: 780, y: 160 }
    };
    setPickup(foundPickup);
    setDropoff(foundDrop);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-gray-100 selection:bg-amber-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPayment={() => setIsPaymentOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Hero Section with Dual-Pane Booking & Real-time Live Map */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Top Hero Headline Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              Executive Urban Transit System
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Elevate Your Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Commute</span>.
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-xl">
              On-demand verified chauffeurs, instant upfront fares, and real-time GPS fleet tracking across the metropolitan area.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-6 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
            <div>
              <div className="text-xs font-extrabold text-amber-400">2.4 mins</div>
              <div className="text-[10px] text-gray-400 uppercase">Avg Dispatch</div>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div>
              <div className="text-xs font-extrabold text-emerald-400">4.97 ★</div>
              <div className="text-[10px] text-gray-400 uppercase">Driver Quality</div>
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div>
              <div className="text-xs font-extrabold text-white">0% Surge</div>
              <div className="text-[10px] text-gray-400 uppercase">Guaranteed</div>
            </div>
          </div>
        </div>

        {/* Dual-Pane Core Workspace: 4-Step Booking Console & Real-Time Tracking Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 4-Step Booking Console (5 cols on lg) */}
          <div className="lg:col-span-5 w-full">
            <BookingConsole
              pickup={pickup}
              setPickup={setPickup}
              dropoff={dropoff}
              setDropoff={setDropoff}
              selectedCab={selectedCab}
              setSelectedCab={setSelectedCab}
              rideStatus={rideStatus}
              setRideStatus={setRideStatus}
              driverAssigned={driverAssigned}
              setDriverAssigned={setDriverAssigned}
              onOpenPayment={() => setIsPaymentOpen(true)}
              onOpenSupport={() => setIsSupportOpen(true)}
            />
          </div>

          {/* Right Column: Interactive Real-Time Map (7 cols on lg) */}
          <div className="lg:col-span-7 w-full h-full min-h-[500px] lg:min-h-[640px]">
            <TrackingMap
              pickup={pickup}
              dropoff={dropoff}
              onSelectMapLocation={(loc) => {
                if (!pickup) setPickup(loc);
                else setDropoff(loc);
              }}
              activeCab={selectedCab}
              rideStatus={rideStatus}
              driverAssigned={driverAssigned}
            />
          </div>
        </div>
      </main>

      {/* Fleet Showcase Section */}
      <FleetShowcase
        onSelectCabType={(cab) => {
          setSelectedCab(cab);
        }}
      />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Safety Standards Banner */}
      <SafetyBanner
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Footer */}
      <Footer
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onQuickBookLocation={handleQuickBookLocation}
      />

      <RideHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onRebookRoute={handleRebookRoute}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
}
