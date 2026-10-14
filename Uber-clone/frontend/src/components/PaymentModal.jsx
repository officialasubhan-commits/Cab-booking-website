import React, { useState } from 'react';

export default function PaymentModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [walletBalance, setWalletBalance] = useState(185.50);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });

  const [savedCards, setSavedCards] = useState([
    { id: 'c1', type: 'Visa', last4: '4242', exp: '12/28', isDefault: true },
    { id: 'c2', type: 'Mastercard', last4: '8819', exp: '09/27', isDefault: false }
  ]);

  const handleTopUp = (amount) => {
    setWalletBalance((prev) => prev + amount);
    alert(`Successfully loaded $${amount} to your Velox Wallet!`);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.number || !newCard.holder) {
      alert('Please fill out card details');
      return;
    }
    const last4 = newCard.number.slice(-4) || '1234';
    setSavedCards((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, type: 'Visa', last4, exp: newCard.expiry || '01/29', isDefault: false }
    ]);
    setShowAddCard(false);
    setNewCard({ number: '', holder: '', expiry: '', cvv: '' });
    alert('Payment card added securely.');
  };

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

        <div className="border-b border-white/10 pb-4 mb-5">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>💳</span> Payment Methods & Wallet
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your payment cards, top up Velox Cash, and enjoy seamless 1-tap checkout.
          </p>
        </div>

        {/* Velox Wallet Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-black shadow-2xl mb-6 relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-20 text-7xl font-extrabold select-none">
            VELOX
          </div>

          <div className="relative z-10">
            <div className="text-xs uppercase font-extrabold tracking-wider opacity-80">
              Velox Cash Balance
            </div>
            <div className="text-3xl font-extrabold tracking-tight mt-1 mb-4">
              ${walletBalance.toFixed(2)}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold mr-1">Quick Top-Up:</span>
              {[20, 50, 100].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleTopUp(amt)}
                  className="px-3 py-1 rounded-full bg-black/80 hover:bg-black text-white text-xs font-bold transition-all shadow"
                >
                  +${amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Cards */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
            <span>Saved Payment Cards</span>
            <button
              onClick={() => setShowAddCard(!showAddCard)}
              className="text-amber-400 hover:underline text-xs capitalize font-bold"
            >
              {showAddCard ? 'Cancel' : '+ Add New Card'}
            </button>
          </div>

          {savedCards.map((card) => (
            <div
              key={card.id}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{card.type} ending in {card.last4}</span>
                    {card.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400">Expires {card.exp}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSavedCards((prev) =>
                    prev.map((c) => ({ ...c, isDefault: c.id === card.id }))
                  );
                }}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  card.isDefault
                    ? 'text-gray-500 cursor-default'
                    : 'text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                {card.isDefault ? 'Active' : 'Set Default'}
              </button>
            </div>
          ))}

          {/* Digital Wallets */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <div className="text-xs font-bold text-white">Apple Pay / Google Pay</div>
                <div className="text-[10px] text-emerald-400">Biometric 1-tap checkout enabled</div>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold">Connected</span>
          </div>
        </div>

        {/* Add New Card Form Drawer */}
        {showAddCard && (
          <form onSubmit={handleAddCard} className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 space-y-3 mb-4 animate-in fade-in duration-200">
            <div className="text-xs font-bold text-amber-400 uppercase">Enter Card Details</div>
            <div>
              <label className="text-[10px] text-gray-400 uppercase font-semibold">Card Number</label>
              <input
                type="text"
                placeholder="4000 1234 5678 9010"
                maxLength="19"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newCard.holder}
                  onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs mt-1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-semibold">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength="4"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono mt-1"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-xs py-2.5 mt-2"
            >
              Save Card Securely
            </button>
          </form>
        )}

        {/* Security Trust Badges */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <span>🔒</span> 256-Bit SSL Bank Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <span>🛡️</span> PCI-DSS Level 1 Compliant
          </span>
        </div>
      </div>
    </div>
  );
}
