import React from 'react';

export default function Footer({ onOpenSupport }) {
  return (
    <footer className="w-full border-t border-white/10 bg-[#070B12] pt-14 pb-8 px-4 md:px-8 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-extrabold text-lg shadow-md">
              ⚡
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">VELOX</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            Velox Urban Mobility is the premier ride-hailing and chauffeur platform designed for modern professionals, travelers, and city commuters.
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span>📞 1-800-VELOX-CAB</span>
            <span>•</span>
            <span>✉️ concierge@veloxcabs.com</span>
          </div>
        </div>

        {/* Mobility Solutions */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mobility</h4>
          <ul className="space-y-1.5">
            <li><a href="#fleet" className="hover:text-amber-400 transition-colors">Executive Fleet</a></li>
            <li><a href="#fleet" className="hover:text-amber-400 transition-colors">Airport Transfers</a></li>
            <li><a href="#fleet" className="hover:text-amber-400 transition-colors">Zero-Emission EVs</a></li>
            <li><a href="#fleet" className="hover:text-amber-400 transition-colors">Corporate Travel</a></li>
          </ul>
        </div>

        {/* Trust & Safety */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Safety & Trust</h4>
          <ul className="space-y-1.5">
            <li><a href="#safety" className="hover:text-amber-400 transition-colors">Safety Shield</a></li>
            <li><a href="#safety" className="hover:text-amber-400 transition-colors">Chauffeur Standards</a></li>
            <li><a href="#safety" className="hover:text-amber-400 transition-colors">Zero-Surge Policy</a></li>
            <li><button onClick={onOpenSupport} className="hover:text-amber-400 text-left transition-colors">Emergency Assistance</button></li>
          </ul>
        </div>

        {/* Cities */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Operating Hubs</h4>
          <ul className="space-y-1.5">
            <li><span className="text-gray-300">New York & Tri-State</span></li>
            <li><span className="text-gray-300">San Francisco & Bay Area</span></li>
            <li><span className="text-gray-300">London & Heathrow Express</span></li>
            <li><span className="text-gray-300">Dubai & Abu Dhabi Core</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-[11px]">
        <div>
          © {new Date().getFullYear()} Velox Urban Mobility Systems Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Chauffeur Portal</span>
        </div>
      </div>
    </footer>
  );
}
