import React from 'react';

export default function SafetyBanner({ onOpenSupport }) {
  const safetyFeatures = [
    {
      icon: '🛡️',
      title: '100% Background-Checked Drivers',
      desc: 'All chauffeurs undergo annual fingerprinting, driving record verifications, and professional hospitality training.'
    },
    {
      icon: '📍',
      title: '24/7 Live Telemetry & GPS',
      desc: 'Every trip is monitored in real-time by the Velox Safety Command Center. Route anomalies trigger proactive safety checks.'
    },
    {
      icon: '🔒',
      title: 'Encrypted Contact & Masking',
      desc: 'Phone calls and in-app messages are routed through encrypted virtual relays. Your personal phone number is never shared.'
    },
    {
      icon: '🚨',
      title: 'Discreet In-App SOS Shield',
      desc: '1-tap emergency dispatch button shares your live vehicle coordinates and driver details directly with emergency services.'
    }
  ];

  return (
    <section id="safety" className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="glass-panel-glow rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Gold-Standard Security
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-3 mb-3">
            Your Safety is Engineered into Every Mile
          </h2>
          <p className="text-sm md:text-base text-gray-300">
            We hold ourselves to the highest global standards in passenger protection, chauffeur vetting, and vehicle inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {safetyFeatures.map((f, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-2xl p-2 rounded-xl bg-gray-800/80 inline-block">{f.icon}</span>
              <h3 className="text-sm font-bold text-white">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Velox Safety Operations Center: <strong>Active & Monitoring</strong></span>
          </div>

          <button
            onClick={onOpenSupport}
            className="btn-secondary text-xs py-2.5 px-5 text-amber-300 border-amber-500/30 hover:border-amber-500"
          >
            Open 24/7 Safety Desk →
          </button>
        </div>
      </div>
    </section>
  );
}
