import React, { useState } from 'react';

export default function SupportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'faq'
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm Velox AI Support Assistant. How can I assist you with your ride today?",
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickPrompts = [
    'How do I cancel a ride?',
    'I left an item in the cab!',
    'How does upfront fare work?',
    'Report a lost property',
    'Contact emergency response'
  ];

  const handleSend = (userText) => {
    const textToSend = userText || inputVal;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Simulated smart AI reply
    setTimeout(() => {
      let botResponse = "Thank you for reaching out. Our 24/7 dispatch supervisor has been notified.";
      const lower = textToSend.toLowerCase();

      if (lower.includes('cancel')) {
        botResponse = "You can cancel free of charge within 2 minutes of chauffeur dispatch. For Platinum members, cancellation penalties are completely waived.";
      } else if (lower.includes('lost') || lower.includes('item')) {
        botResponse = "We protect all lost properties! We have contacted your last chauffeur (Marcus Vance) to check the vehicle. You can also tap 'Call Driver' directly in your ride history.";
      } else if (lower.includes('fare') || lower.includes('price')) {
        botResponse = "Velox guarantees transparent upfront pricing. Once you confirm your route, your fare is locked in regardless of unexpected city traffic or delays.";
      } else if (lower.includes('emergency') || lower.includes('sos')) {
        botResponse = "If you feel in danger, tap the red SOS shield immediately. It will connect to 911 dispatch and broadcast your live vehicle GPS coordinates.";
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botResponse, time: 'Just now' }
      ]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel-glow rounded-3xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm transition-all"
        >
          ✕
        </button>

        <div className="border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-xl font-extrabold text-white">24/7 Velox Concierge & Support</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Instant AI ride resolution, trip assistance, lost item recovery, and safety desk.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            💬 Live AI Assistant
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'faq'
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            ❓ Quick FAQs
          </button>
        </div>

        {/* Tab 1: Live Chat */}
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-1 space-y-3">
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/30 text-[11px] text-gray-300 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto space-y-2 p-3 rounded-2xl bg-black/50 border border-white/10">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'ml-auto bg-amber-500 text-black font-semibold'
                      : 'bg-gray-800/90 text-gray-200 border border-white/10'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask anything about your ride, safety, or fare..."
                className="flex-1 glass-input rounded-xl px-3 py-2 text-xs"
              />
              <button type="submit" className="btn-primary text-xs py-2 px-4">
                Send
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {[
              {
                q: 'How are chauffeurs vetted and verified?',
                a: 'Every Velox driver undergoes comprehensive federal background checks, vehicle safety inspections, and hospitality concierge certification.'
              },
              {
                q: 'Can I request a child safety seat or pet-friendly vehicle?',
                a: 'Yes, select Velox Elite SUV or Velox Comfort and toggle the pet/child seat preference in Step 3.'
              },
              {
                q: 'What is the Velox Zero Surge Policy?',
                a: 'Unlike traditional rideshare apps, Velox caps surge multipliers and guarantees full fare transparency before you book.'
              }
            ].map((faq, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xs font-bold text-amber-300">{faq.q}</div>
                <div className="text-[11px] text-gray-300 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        )}

        {/* Emergency SOS Helpline bar */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <span>🛡️</span> Urgent Assistance:
          </div>
          <button
            onClick={() => alert('Dialing Velox 24/7 Emergency Dispatch Helpline: 1-800-VELOX-CAB')}
            className="px-3 py-1 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white font-bold transition-all border border-rose-500/30"
          >
            Call Helpline 1-800-VELOX-CAB
          </button>
        </div>
      </div>
    </div>
  );
}
