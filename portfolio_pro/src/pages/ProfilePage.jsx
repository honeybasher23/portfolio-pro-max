import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, Key, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore';

export default function ProfilePage() {
  const buyingPower = useWalletStore((state) => state.buyingPower);
  const navigate = useNavigate();
  
  // Local state for UI tabs and API key visibility
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-base text-textMain">
      
      {/* Utility Nav */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface text-xs font-mono">
        <div className="flex gap-6 items-center">
          <span className="font-sans font-bold text-sm tracking-tight">PORTFOLIOPRO</span>
          
          <nav className="flex gap-4 border-l border-border pl-6">
            <Link to="/terminal" className="text-textMuted hover:text-textMain transition-colors">TERMINAL</Link>
            <Link to="/portfolio" className="text-textMuted hover:text-textMain transition-colors">PORTFOLIO</Link>
            <Link to="/profile" className="text-textMain font-bold">PROFILE</Link>
          </nav>
        </div>
        
        <div className="flex gap-6 items-center">
          <div className="flex flex-col text-right">
            <span className="text-textMuted text-[10px] uppercase tracking-wider">H. Swarup</span>
            <span>ID: 2400320230044</span>
          </div>
          <div className="h-full border-l border-border pl-6 flex flex-col justify-center">
            <span className="text-textMuted text-[10px] uppercase tracking-wider">Buying Power</span>
            <span className="text-askGreen font-medium">
              ₹{buyingPower.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Settings Navigation */}
        <aside className="w-64 border-r border-border bg-surface flex flex-col">
          <div className="h-8 border-b border-border bg-base flex items-center px-4 text-[10px] text-textMuted font-mono tracking-widest uppercase">
            ACCOUNT SETTINGS
          </div>
          <nav className="flex-1 p-2 space-y-1 font-mono text-sm">
            <TabButton icon={<User size={16} />} label="General" isActive={activeTab === 'general'} onClick={() => setActiveTab('general')} />
            <TabButton icon={<Shield size={16} />} label="Security & KYC" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
            <TabButton icon={<Key size={16} />} label="API Credentials" isActive={activeTab === 'api'} onClick={() => setActiveTab('api')} />
            <TabButton icon={<Settings size={16} />} label="Preferences" isActive={activeTab === 'prefs'} onClick={() => setActiveTab('prefs')} />
          </nav>
          
          <div className="p-2 border-t border-border">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-bidRed hover:bg-base transition-colors font-mono text-sm"
            >
              <LogOut size={16} />
              TERMINATE SESSION
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-1 bg-base overflow-y-auto">
          <div className="h-8 border-b border-border bg-surface flex items-center px-6 text-[10px] text-textMuted font-mono tracking-widest uppercase">
            {activeTab.toUpperCase()} CONFIGURATION
          </div>
          
          <div className="max-w-3xl p-8 space-y-8">
            
            {activeTab === 'general' && (
              <>
                <div className="flex items-start justify-between border-b border-border pb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-sans">Hanu Swarup</h2>
                    <p className="text-textMuted font-mono text-sm mt-1">Trader ID: 2400320230044</p>
                  </div>
                  <div className="flex items-center gap-2 text-askGreen font-mono text-xs border border-askGreen px-3 py-1 bg-askGreen/10">
                    <CheckCircle2 size={14} /> ACTIVE
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 font-mono text-sm">
                  <div className="space-y-1">
                    <label className="text-[10px] text-textMuted uppercase tracking-widest">Email Address</label>
                    <div className="p-3 border border-border bg-surface text-textMain">hanu.swarup@portfoliopro.local</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-textMuted uppercase tracking-widest">Phone Number</label>
                    <div className="p-3 border border-border bg-surface text-textMain">+91 ••••• •••••</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-textMuted uppercase tracking-widest">Location</label>
                    <div className="p-3 border border-border bg-surface text-textMain">Ghaziabad, Uttar Pradesh, IN</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-textMuted uppercase tracking-widest">Account Tier</label>
                    <div className="p-3 border border-border bg-surface text-textMain">Simulated / Paper Trading</div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-sans text-textMain">REST API Credentials</h3>
                  <p className="text-textMuted font-mono text-xs mt-1">Use these keys to authenticate your algorithmic trading bots.</p>
                </div>

                <div className="space-y-4 font-mono text-sm">
                  <div className="space-y-1">
                    <label className="text-[10px] text-textMuted uppercase tracking-widest">Public Key</label>
                    <div className="p-3 border border-border bg-surface text-textMuted select-all">
                      pk_test_a7f9b2c4e6d8h1j3k5l7m9n0p2q4r6s8t
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-textMuted uppercase tracking-widest flex justify-between">
                      <span>Secret Key</span>
                      <button onClick={() => setShowApiKey(!showApiKey)} className="text-action hover:text-white transition-colors">
                        {showApiKey ? 'HIDE' : 'REVEAL'}
                      </button>
                    </label>
                    <div className="p-3 border border-border bg-surface text-textMain select-all">
                      {showApiKey ? 'sk_test_9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h' : '••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                  </div>
                </div>

                <button className="border border-border text-textMain px-4 py-2 font-bold hover:bg-action hover:border-action hover:text-white transition-colors tracking-widest text-xs uppercase font-mono">
                  GENERATE NEW KEYS
                </button>
              </div>
            )}

            {/* Placeholders for other tabs */}
            {(activeTab === 'security' || activeTab === 'prefs') && (
              <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border text-textMuted font-mono text-xs uppercase tracking-widest">
                Module offline in simulation mode
              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

// Reusable tab button component
function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 transition-colors ${
        isActive 
          ? 'bg-border text-textMain border-l-2 border-action' 
          : 'text-textMuted hover:bg-base hover:text-textMain border-l-2 border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}