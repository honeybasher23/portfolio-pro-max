import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../store/useWalletStore';
import { Clock } from 'lucide-react';

export default function TradeHistory() {
  const buyingPower = useWalletStore((state) => state.buyingPower);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/trades");
        if (res.ok) {
          const data = await res.json();
          setTrades(data);
        }
      } catch (err) {
        console.error("Failed to load trade history:", err);
      }
    };

    fetchTrades();
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-base text-textMain">
      
      {/* Utility Nav */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface text-xs font-mono">
        <div className="flex gap-6 items-center">
          <span className="font-sans font-bold text-sm tracking-tight">PORTFOLIOPRO</span>
          
          <nav className="flex gap-4 border-l border-border pl-6">
            <Link to="/terminal" className="text-textMuted hover:text-textMain transition-colors">TERMINAL</Link>
            <Link to="/portfolio" className="text-textMuted hover:text-textMain transition-colors">PORTFOLIO</Link>
            <Link to="/history" className="text-textMain font-bold">HISTORY</Link>
          </nav>
        </div>
        
        <div className="flex gap-6 items-center">
          <div className="flex flex-col text-right">
            <span className="text-textMuted text-[10px] uppercase tracking-wider">H. Swarup</span>
            <span>ID: 2400320</span>
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
      <main className="flex-1 flex flex-col overflow-hidden p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock size={24} className="text-textMuted" />
          <h1 className="text-2xl font-bold font-sans tracking-tight">Execution Ledger</h1>
        </div>

        <div className="flex-1 flex flex-col border border-border bg-surface rounded overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse font-mono text-sm">
              <thead className="bg-base sticky top-0 border-b border-border text-textMuted text-[10px] tracking-widest uppercase">
                <tr>
                  <th className="p-4 font-normal">Date & Time</th>
                  <th className="p-4 font-normal">Symbol</th>
                  <th className="p-4 font-normal">Action</th>
                  <th className="p-4 font-normal">Type</th>
                  <th className="p-4 font-normal text-right">Qty</th>
                  <th className="p-4 font-normal text-right">Execution Price</th>
                  <th className="p-4 font-normal text-right">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-textMuted italic">No trading history found.</td>
                  </tr>
                ) : (
                  trades.map((trade) => {
                    const tradeDate = new Date(trade.timestamp).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    });
                    const totalValue = trade.quantity * trade.executionPrice;
                    const isBuy = trade.isBuy;

                    return (
                      <tr key={trade.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-textMuted">{tradeDate}</td>
                        <td className="p-4 font-bold text-textMain">{trade.symbol}</td>
                        <td className={`p-4 font-bold ${isBuy ? 'text-askGreen' : 'text-bidRed'}`}>
                          {isBuy ? 'BUY' : 'SELL'}
                        </td>
                        <td className="p-4 text-textMuted">{trade.orderType}</td>
                        <td className="p-4 text-right">{trade.quantity}</td>
                        <td className="p-4 text-right">₹{trade.executionPrice.toFixed(2)}</td>
                        <td className="p-4 text-right">₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}