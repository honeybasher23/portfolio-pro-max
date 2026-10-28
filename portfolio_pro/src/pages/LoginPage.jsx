import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Adjust path if needed

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) setMessage(error.message);
    else setMessage('Success! Check your email for the confirmation link, or log in if auto-confirm is enabled.');
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMessage(error.message);
    } else {
      // If successful, push them into the trading terminal
      navigate('/terminal');
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-base text-textMain font-mono">
      <div className="w-full max-w-md p-8 border border-border bg-surface rounded flex flex-col gap-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold font-sans tracking-tight mb-1">PORTFOLIOPRO</h1>
          <p className="text-textMuted text-xs uppercase tracking-widest">Authentication Required</p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textMuted uppercase">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-base px-3 py-2 outline-none focus:border-accent text-white"
              placeholder="trader@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-textMuted uppercase">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-base px-3 py-2 outline-none focus:border-accent text-white"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`p-3 text-xs border ${message.includes('Success') ? 'border-askGreen text-askGreen' : 'border-bidRed text-bidRed'}`}>
              {message}
            </div>
          )}

          <div className="flex gap-4 mt-2">
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-white text-black font-bold py-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              LOGIN
            </button>
            <button 
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 border border-border text-white font-bold py-2 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              SIGN UP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}