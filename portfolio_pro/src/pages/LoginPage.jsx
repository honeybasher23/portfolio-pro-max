import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Placeholder: bypass real auth for now and route to terminal
    navigate('/terminal');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-base text-textMain font-sans">
      
      {/* Main Auth Container */}
      <div className="w-full max-w-md bg-surface border border-border flex flex-col">
        
        {/* Pane Header */}
        <div className="h-10 border-b border-border bg-base flex items-center px-4 gap-2 text-[10px] font-mono text-textMuted tracking-widest uppercase">
          <Lock size={12} />
          SYSTEM_AUTHENTICATION
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-textMain">PORTFOLIOPRO</h1>
            <p className="text-textMuted text-xs mt-1 font-mono uppercase tracking-wider">Session ID_REQ</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-textMuted text-[10px] font-mono uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-base border border-border p-3 outline-none focus:border-action text-textMain font-mono text-sm transition-colors"
                placeholder="trader@system.local"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-textMuted text-[10px] font-mono uppercase tracking-widest flex justify-between">
                <span>Password</span>
                <a href="#" className="text-action hover:text-white transition-colors">RESET</a>
              </label>
              <input 
                type="password" 
                required
                className="w-full bg-base border border-border p-3 outline-none focus:border-action text-textMain font-mono text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-border text-textMain py-3 mt-4 font-bold hover:bg-action hover:text-white transition-colors tracking-widest text-xs uppercase"
            >
              INITIALIZE SESSION
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center text-xs font-mono text-textMuted">
            UNREGISTERED? <a href="#" className="text-action hover:text-white transition-colors ml-2">REQUEST ACCESS</a>
          </div>
        </div>
      </div>
      
    </div>
  );
}