import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Set Pickup & Destination',
      desc: 'Use our smart auto-suggest or tap directly on the live vector map to pinpoint exact coordinates.'
    },
    {
      num: '02',
      title: 'Choose Vehicle Class',
      desc: 'Select from Comfort Sedans, Executive Chauffeurs, 6-Seater SUVs, or Zero-Emission Green EVs.'
    },
    {
      num: '03',
      title: 'Lock In Upfront Fare',
      desc: 'Review itemized pricing with zero surprise surge markups. Apply promo codes for instant savings.'
    },
    {
      num: '04',
      title: 'Track Live & Ride in Peace',
      desc: 'Watch your chauffeur navigate in real-time, view vehicle license plate & 4-digit security OTP.'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Seamless Workflow
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-3 mb-3">
          How Velox Elevates Your Commute
        </h2>
        <p className="text-sm md:text-base text-gray-400">
          Four effortless steps to reach your destination in comfort and style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((st, i) => (
          <div
            key={i}
            className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300"
          >
            <div className="text-4xl font-black text-amber-500/20 group-hover:text-amber-500/40 transition-colors mb-3">
              {st.num}
            </div>
            <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{st.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
