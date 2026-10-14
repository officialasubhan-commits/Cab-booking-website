import React, { useState } from 'react';

export default function Navbar({
  onOpenProfile,
  onOpenHistory,
  onOpenPayment,
  onOpenSupport,
  onScrollToSection
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-extrabold text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              <span>VELOX</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold tracking-wider">
                PRO
              </span>
            </div>
            <div className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold">
              Urban Mobility
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-300">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-amber-400 transition-colors"
          >
            Book Ride
          </button>
          <button
            onClick={() => onScrollToSection('fleet')}
            className="hover:text-amber-400 transition-colors"
          >
            Executive Fleet
          </button>
          <button
            onClick={() => onScrollToSection('how-it-works')}
            className="hover:text-amber-400 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => onScrollToSection('safety')}
            className="hover:text-amber-400 transition-colors"
          >
            Safety Shield
          </button>
          <button
            onClick={onOpenSupport}
            className="hover:text-amber-400 transition-colors"
          >
            24/7 Support
          </button>
        </nav>

        {/* Right Utility Navigation */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Wallet Balance Pill */}
          <button
            onClick={onOpenPayment}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all hover:border-amber-500/30"
            title="View Velox Wallet"
          >
            <span>👛</span>
            <span>$185.50</span>
          </button>

          {/* Ride History Pill */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all hover:border-amber-500/30"
            title="Your Trips"
          >
            <span>📜</span>
            <span className="hidden md:inline">Trips</span>
            <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile Avatar Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/40 text-xs font-bold text-amber-300 hover:brightness-110 transition-all"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center justify-center">
              AL
            </div>
            <span className="hidden md:inline">Ayush • Platinum</span>
          </button>

          {/* Emergency SOS Quick Button */}
          <button
            onClick={onOpenSupport}
            className="w-8 h-8 rounded-full bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/40 flex items-center justify-center text-xs font-bold transition-all"
            title="Emergency SOS"
          >
            🛡️
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center"
          >
            AL
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center text-lg"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenPayment();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-left flex items-center gap-2"
            >
              <span>👛</span> Wallet ($185.50)
            </button>
            <button
              onClick={() => {
                onOpenHistory();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-left flex items-center gap-2"
            >
              <span>📜</span> Ride History
            </button>
            <button
              onClick={() => {
                onOpenProfile();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-left flex items-center gap-2"
            >
              <span>👤</span> My Profile
            </button>
            <button
              onClick={() => {
                onOpenSupport();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold text-left flex items-center gap-2"
            >
              <span>💬</span> 24/7 Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
