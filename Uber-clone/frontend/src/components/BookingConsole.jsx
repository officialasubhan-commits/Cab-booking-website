import React, { useState } from 'react';
import { CAB_TYPES } from '../data/cabTypes';
import { POPULAR_LOCATIONS, calculateDistance, calculateDuration } from '../data/mockLocations';

export default function BookingConsole({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  selectedCab,
  setSelectedCab,
  rideStatus,
  setRideStatus,
  driverAssigned,
  setDriverAssigned,
  onOpenPayment,
  onOpenSupport
}) {
  const [step, setStep] = useState(1);
  const [pickupSearch, setPickupSearch] = useState('');
  const [dropoffSearch, setDropoffSearch] = useState('');
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
  const [scheduleType, setScheduleType] = useState('now'); // 'now' or 'later'
  const [scheduledTime, setScheduledTime] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'apple', 'wallet', 'cash'
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  const [ridePreferences, setRidePreferences] = useState({
    silentRide: true,
    acTemp: 'Cool (20°C)',
    luggageHelp: true
  });
  const [showDriverChat, setShowDriverChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: "Hello! I'm on my way in a silver Camry. Should be there in 3 minutes.", time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Calculate distance & duration based on selected locations
  const distanceKm = calculateDistance(pickup?.coords, dropoff?.coords);
  const durationMins = calculateDuration(distanceKm);

  // Fare calculations
  const baseRate = selectedCab.baseFare;
  const distanceRate = Math.round(distanceKm * selectedCab.perKmRate * 100) / 100;
  const serviceFee = 2.20;
  const subtotal = Math.round((baseRate + distanceRate + serviceFee) * 100) / 100;
  const discountAmount = Math.round((subtotal * (discountPercent / 100)) * 100) / 100;
  const finalFare = Math.max(5, Math.round((subtotal - discountAmount) * 100) / 100);

  // Handle promo code application
  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'VELOX50' || code === 'FIRST50') {
      setDiscountPercent(25);
      setPromoApplied(true);
    } else if (code === 'LUXE10') {
      setDiscountPercent(15);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code. Try "VELOX50" for 25% off your ride!');
    }
  };

  // Swap pickup & dropoff
  const handleSwap = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  // "Use My Current Location"
  const handleUseCurrentLocation = () => {
    const currentLocation = {
      id: 'current-gps',
      name: 'Current Location (Downtown Plaza)',
      address: 'Near Central Fountain, GPS High Accuracy',
      category: 'Current Location',
      coords: { x: 440, y: 360 }
    };
    setPickup(currentLocation);
    setPickupSearch(currentLocation.name);
    setShowPickupDropdown(false);
  };

  // Confirm booking & simulate driver matching
  const handleConfirmRide = () => {
    setIsSearchingDriver(true);
    setRideStatus('searching');

    setTimeout(() => {
      setIsSearchingDriver(false);
      setRideStatus('matched');
      setDriverAssigned({
        driverName: 'Marcus Vance',
        rating: 4.98,
        trips: 3420,
        car: selectedCab.carModel,
        plate: 'VX-889-NY',
        phone: '+1 (555) 392-8819',
        otp: '7429',
        etaMinutes: selectedCab.etaMinutes,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
    }, 2200);
  };

  // Cancel active ride
  const handleCancelRide = () => {
    if (confirm('Are you sure you want to cancel this ride?')) {
      setRideStatus('idle');
      setDriverAssigned(null);
      setStep(1);
    }
  };

  // Send message to driver
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'user', text: chatInput, time: 'Just now' };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'driver', text: "Got it! I see you near the main entrance.", time: 'Just now' }
      ]);
    }, 1500);
  };

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-5 md:p-7 flex flex-col justify-between transition-all duration-300">
      {/* 4-Step Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center">
              {step}
            </span>
            <span className="text-sm font-bold tracking-wide uppercase text-amber-400">
              {step === 1 && 'Step 1: Set Route'}
              {step === 2 && 'Step 2: Choose Cab'}
              {step === 3 && 'Step 3: Review Fare & Perks'}
              {step === 4 && 'Step 4: Confirm & Track'}
            </span>
          </div>

          <span className="text-xs text-gray-400 font-medium">Step {step} of 4</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: ENTER PICKUP & DROP LOCATION */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-1">
              Where can we take you?
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              Select verified pickup and dropoff points across the city.
            </p>
          </div>

          {/* Location Inputs with Swap button */}
          <div className="relative space-y-3">
            {/* Pickup Input */}
            <div className="relative">
              <label className="text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Pickup Point
                </span>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium hover:underline flex items-center gap-1"
                >
                  📍 Use My GPS
                </button>
              </label>

              <input
                type="text"
                value={pickup ? pickup.name : pickupSearch}
                onChange={(e) => {
                  setPickupSearch(e.target.value);
                  setPickup(null);
                  setShowPickupDropdown(true);
                }}
                onFocus={() => setShowPickupDropdown(true)}
                placeholder="Enter pickup address or landmark..."
                className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium"
              />

              {/* Autocomplete Dropdown */}
              {showPickupDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#111827] border border-white/15 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                  <div className="p-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Suggested Locations
                  </div>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setPickup(loc);
                        setPickupSearch(loc.name);
                        setShowPickupDropdown(false);
                      }}
                      className="px-3 py-2.5 hover:bg-amber-500/10 cursor-pointer flex items-center justify-between transition-colors border-b border-white/5 last:border-none"
                    >
                      <div>
                        <div className="text-xs font-bold text-gray-200">{loc.name}</div>
                        <div className="text-[10px] text-gray-400">{loc.address}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        {loc.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-end pr-3 -my-1">
              <button
                type="button"
                onClick={handleSwap}
                disabled={!pickup && !dropoff}
                className="p-1.5 rounded-full bg-gray-800 border border-white/10 hover:border-amber-500/50 text-gray-300 hover:text-amber-400 transition-all text-xs"
                title="Swap Locations"
              >
                ⇅ Swap
              </button>
            </div>

            {/* Dropoff Input */}
            <div className="relative">
              <label className="text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                Destination / Dropoff
              </label>

              <input
                type="text"
                value={dropoff ? dropoff.name : dropoffSearch}
                onChange={(e) => {
                  setDropoffSearch(e.target.value);
                  setDropoff(null);
                  setShowDropoffDropdown(true);
                }}
                onFocus={() => setShowDropoffDropdown(true)}
                placeholder="Where to? Airport, Mall, Hotel..."
                className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium"
              />

              {/* Autocomplete Dropdown */}
              {showDropoffDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#111827] border border-white/15 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                  <div className="p-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Popular Destinations
                  </div>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setDropoff(loc);
                        setDropoffSearch(loc.name);
                        setShowDropoffDropdown(false);
                      }}
                      className="px-3 py-2.5 hover:bg-emerald-500/10 cursor-pointer flex items-center justify-between transition-colors border-b border-white/5 last:border-none"
                    >
                      <div>
                        <div className="text-xs font-bold text-gray-200">{loc.name}</div>
                        <div className="text-[10px] text-gray-400">{loc.address}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        {loc.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Location Pills */}
          <div>
            <div className="text-[11px] text-gray-400 font-semibold mb-2 uppercase tracking-wider">
              Popular Quick Picks:
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_LOCATIONS.slice(0, 4).map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    if (!pickup) setPickup(loc);
                    else setDropoff(loc);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-gray-300 transition-all"
                >
                  {loc.name.split('(')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Ride Timing Toggle: Leave Now vs Schedule */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">⏱️</span>
              <span className="text-xs font-semibold text-gray-200">Ride Timing:</span>
            </div>
            <div className="flex items-center gap-1 bg-[#0B0F17] p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setScheduleType('now')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  scheduleType === 'now'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Depart Now
              </button>
              <button
                type="button"
                onClick={() => setScheduleType('later')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  scheduleType === 'later'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Schedule
              </button>
            </div>
          </div>

          {scheduleType === 'later' && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2">
              <label className="text-xs font-bold text-amber-300">Choose Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full glass-input rounded-lg px-3 py-2 text-xs"
              />
            </div>
          )}

          {/* Real-time Estimated Distance & Duration Preview */}
          {pickup && dropoff && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Route Metric</div>
                <div className="text-sm font-extrabold text-white">
                  {distanceKm} km • ~{durationMins} mins
                </div>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Optimal Traffic Route
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            type="button"
            disabled={!pickup || !dropoff}
            onClick={() => setStep(2)}
            className="w-full btn-primary text-sm py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Choose Vehicle Class & Rates →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: CHOOSE CAB TYPE */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Select Vehicle Class</h2>
              <p className="text-xs text-gray-400">
                {distanceKm} km trip • ~{durationMins} min travel time
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              ← Edit Route
            </button>
          </div>

          {/* Vehicle List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {CAB_TYPES.map((cab) => {
              const isSelected = selectedCab.id === cab.id;
              const estimatedTripPrice = Math.round((cab.baseFare + distanceKm * cab.perKmRate + serviceFee) * 100) / 100;
              return (
                <div
                  key={cab.id}
                  onClick={() => setSelectedCab(cab)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border"
                      style={{
                        backgroundColor: `${cab.color}15`,
                        borderColor: `${cab.color}40`,
                        color: cab.color
                      }}
                    >
                      {cab.id === 'comfort' && '🚕'}
                      {cab.id === 'executive' && '🚘'}
                      {cab.id === 'suv' && '🚙'}
                      {cab.id === 'electric' && '⚡'}
                      {cab.id === 'royale' && '👑'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{cab.name}</span>
                        {cab.tag && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">
                            {cab.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                        <span>👤 {cab.seats} seats</span>
                        <span>🧳 {cab.luggage} bags</span>
                        <span>⏱️ {cab.etaMinutes} min away</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-400">
                      ${estimatedTripPrice.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      ${cab.perKmRate}/km
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary text-xs py-3 px-4"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 btn-primary text-sm py-3"
            >
              Proceed to Fare Breakdown →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: FARE ESTIMATE & CUSTOMIZATION */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Fare Estimate & Perks</h2>
              <p className="text-xs text-gray-400">
                Transparent itemized pricing with zero hidden fees.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              ← Change Cab
            </button>
          </div>

          {/* Itemized Fare Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Base Pickup Fare ({selectedCab.name})</span>
              <span className="font-semibold text-white">${baseRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>Distance Charge ({distanceKm} km @ ${selectedCab.perKmRate}/km)</span>
              <span className="font-semibold text-white">${distanceRate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-300">
              <span>Standard Regulatory & Road Safety Fee</span>
              <span className="font-semibold text-white">${serviceFee.toFixed(2)}</span>
            </div>

            {promoApplied && (
              <div className="flex justify-between text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg">
                <span>Promo Code Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-2 flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-white">Guaranteed Total Fare</div>
                <div className="text-[10px] text-gray-400">Surge protected by Velox</div>
              </div>
              <div className="text-xl font-extrabold text-amber-400">
                ${finalFare.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={applyPromo} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter Promo Code (e.g. VELOX50)"
              className="flex-1 glass-input rounded-xl px-3 py-2 text-xs uppercase font-bold"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all"
            >
              Apply
            </button>
          </form>

          {/* Ride Customization Perks */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Trip Preferences:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setRidePreferences((p) => ({ ...p, silentRide: !p.silentRide }))
                }
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                  ridePreferences.silentRide
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                🤫 Quiet Ride: {ridePreferences.silentRide ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() =>
                  setRidePreferences((p) => ({
                    ...p,
                    acTemp: p.acTemp.includes('Cool') ? 'Ambient (24°C)' : 'Cool (20°C)'
                  }))
                }
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-left text-xs font-medium text-gray-300 hover:bg-white/10 transition-all"
              >
                ❄️ AC: {ridePreferences.acTemp}
              </button>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary text-xs py-3 px-4"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex-1 btn-primary text-sm py-3"
            >
              Proceed to Confirmation →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: CONFIRM BOOKING & REAL-TIME DRIVER TRACKING */}
      {/* ========================================================================= */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {!driverAssigned && !isSearchingDriver && (
            <>
              <div>
                <h2 className="text-xl font-extrabold text-white">Confirm Your Ride</h2>
                <p className="text-xs text-gray-400">
                  Select payment method and lock in your chauffeur reservation.
                </p>
              </div>

              {/* Ride Summary Pill */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400">{selectedCab.name}</div>
                  <div className="text-sm font-extrabold text-white">${finalFare.toFixed(2)}</div>
                </div>
                <div className="text-[11px] text-gray-300">
                  📍 {pickup?.name} → 🏁 {dropoff?.name}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-300 mb-2 block">
                  Select Payment Option:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'card', name: 'Visa •••• 4242', icon: '💳' },
                    { id: 'apple', name: 'Apple / Google Pay', icon: '📱' },
                    { id: 'wallet', name: 'Velox Wallet ($185)', icon: '👛' },
                    { id: 'cash', name: 'Cash to Driver', icon: '💵' }
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setPaymentMethod(pay.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                        paymentMethod === pay.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{pay.icon}</span>
                      <span>{pay.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Request Button */}
              <button
                type="button"
                onClick={handleConfirmRide}
                className="w-full btn-primary text-sm py-4 shadow-xl"
              >
                Confirm & Request Chauffeur (${finalFare.toFixed(2)})
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full text-xs text-gray-400 hover:text-white transition-all text-center"
              >
                ← Back to Fare Review
              </button>
            </>
          )}

          {/* SEARCHING RADAR STATE */}
          {isSearchingDriver && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative flex items-center justify-center w-24 h-24">
                <span className="w-24 h-24 rounded-full bg-amber-500/20 animate-ping absolute"></span>
                <span className="w-16 h-16 rounded-full bg-amber-500/30 animate-pulse absolute"></span>
                <span className="w-12 h-12 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-2xl shadow-xl">
                  🚕
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Matching with nearby {selectedCab.name}...
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Connecting with highest-rated verified chauffeurs within 3 km.
                </p>
              </div>
            </div>
          )}

          {/* ACTIVE DRIVER ASSIGNED CARD & TRACKING */}
          {driverAssigned && (
            <div className="space-y-4">
              {/* Driver Profile Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-black to-[#111827] border border-amber-500/30 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={driverAssigned.avatar}
                      alt={driverAssigned.driverName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div>
                      <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        {driverAssigned.driverName}
                        <span className="text-amber-400 text-xs">★ {driverAssigned.rating}</span>
                      </div>
                      <div className="text-xs text-gray-300 font-medium">
                        {driverAssigned.car}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {driverAssigned.trips} completed trips
                      </div>
                    </div>
                  </div>

                  {/* License Plate & OTP Pin */}
                  <div className="text-right">
                    <div className="px-2.5 py-1 rounded bg-black/80 border border-white/20 text-xs font-mono font-bold text-amber-300 tracking-wider">
                      {driverAssigned.plate}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      Ride PIN: <span className="font-bold text-emerald-400">{driverAssigned.otp}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-white">Chauffeur en route</span>
                  </div>
                  <span className="text-amber-400 font-extrabold">
                    {driverAssigned.etaMinutes} min away
                  </span>
                </div>

                {/* Driver Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => alert(`Calling driver at ${driverAssigned.phone}`)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    📞 Call
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDriverChat(!showDriverChat)}
                    className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    💬 Message
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenSupport()}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-gray-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    🛡️ Safety
                  </button>
                </div>
              </div>

              {/* In-App Driver Chat Drawer */}
              {showDriverChat && (
                <div className="p-3 rounded-2xl bg-black/90 border border-white/15 space-y-2 animate-in fade-in duration-200">
                  <div className="text-xs font-bold text-gray-300 border-b border-white/10 pb-1.5 flex justify-between">
                    <span>Chat with {driverAssigned.driverName}</span>
                    <button
                      onClick={() => setShowDriverChat(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`text-xs p-2 rounded-xl max-w-[85%] ${
                          msg.sender === 'user'
                            ? 'ml-auto bg-amber-500 text-black font-medium'
                            : 'bg-gray-800 text-gray-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type message to driver..."
                      className="flex-1 glass-input rounded-lg px-2.5 py-1.5 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-500 text-black font-bold text-xs rounded-lg"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

              {/* Cancel Ride Option */}
              <button
                type="button"
                onClick={handleCancelRide}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all text-center"
              >
                Cancel Ride
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
