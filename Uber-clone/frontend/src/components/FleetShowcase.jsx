import React from 'react';
import { CAB_TYPES } from '../data/cabTypes';

export default function FleetShowcase({ onSelectCabType }) {
  return (
    <section id="fleet" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Curated Mobility
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-3 mb-3">
          Engineered for Every Journey
        </h2>
        <p className="text-sm md:text-base text-gray-400">
          From swift everyday city hops to white-glove executive chauffeur service, explore our state-of-the-art fleet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAB_TYPES.map((cab) => (
          <div
            key={cab.id}
            className="glass-panel hover:glass-panel-glow rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border"
                  style={{
                    backgroundColor: `${cab.color}15`,
                    borderColor: `${cab.color}40`
                  }}
                >
                  {cab.id === 'comfort' && '🚕'}
                  {cab.id === 'executive' && '🚘'}
                  {cab.id === 'suv' && '🚙'}
                  {cab.id === 'electric' && '⚡'}
                  {cab.id === 'royale' && '👑'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  {cab.category}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
                {cab.name}
              </h3>
              <p className="text-xs text-amber-300/80 font-medium mb-2">
                Typical vehicle: {cab.carModel}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {cab.description}
              </p>

              {/* Specs Pills */}
              <div className="flex items-center gap-3 text-xs text-gray-300 font-semibold mb-4 pb-4 border-b border-white/10">
                <span>👤 {cab.seats} Passengers</span>
                <span>•</span>
                <span>🧳 {cab.luggage} Luggage</span>
                <span>•</span>
                <span>⏱️ ~{cab.etaMinutes}m ETA</span>
              </div>

              {/* Feature Tags */}
              <div className="space-y-1.5 mb-6">
                {cab.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-amber-400 text-xs font-bold">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Base Rate</span>
                <div className="text-base font-extrabold text-white">
                  ${cab.baseFare.toFixed(2)} <span className="text-xs text-gray-400 font-normal">+ ${cab.perKmRate}/km</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectCabType) onSelectCabType(cab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                Book This Cab
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
