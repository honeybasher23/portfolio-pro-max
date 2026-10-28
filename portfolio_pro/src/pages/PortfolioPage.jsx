import React, { useState, useEffect } from 'react';
import { Briefcase, PieChart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore';
import { Link } from 'react-router-dom';

export default function PortfolioPage() {
  const buyingPower = useWalletStore((state) => state.buyingPower);

  // Replaced mock data with real state
  const [holdings, setHoldings] = useState([]);
  const [livePrices, setLivePrices] = useState({});

  useEffect(() => {
    // 1. Fetch holdings from Supabase via Spring Boot
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setHoldings(data);
          
          // 2. Fetch live Yahoo Finance prices for each holding
          data.forEach(async (position) => {
            try {
              const priceRes = await fetch(`http://localhost:8080/api/market/price/${position.symbol}`);
              if (priceRes.ok) {
                const livePrice = await priceRes.json();
                setLivePrices((prev) => ({ ...prev, [position.symbol]: livePrice }));
              }
            } catch (err) {
              console.error(`Failed to fetch price for ${position.symbol}`, err);
            }
          });
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err);
      }
    };

    fetchPortfolio();
  }, []);

  // Format backend data to match your UI's expected structure
  const positions = holdings.map((holding) => ({
    symbol: holding.symbol,
    qty: holding.totalShares,
    avgCost: holding.averagePrice,
    // Fallback to average price while the live price is fetching so P&L is cleanly 0
    cmp: livePrices[holding.symbol] || holding.averagePrice 
  }));

  // Calculate totals dynamically
  let totalInvested = 0;
  let totalCurrentValue = 0;

  const enrichedPositions = positions.map(pos => {
    // Fixed the missing math operators here
    const invested = pos.qty * pos.avgCost;
    const currentValue = pos.qty * pos.cmp;
    const pnl = currentValue - invested;
    const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
    
    totalInvested += invested;
    totalCurrentValue += currentValue;

    return { ...pos, invested, currentValue, pnl, pnlPercent };
  });

  const totalUnrealizedPnL = totalCurrentValue - totalInvested;
  const isTotalProfit = totalUnrealizedPnL >= 0;

  return (
    <div className="h-screen w-full flex flex-col bg-base text-textMain">
      
      {/* Utility Nav */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface text-xs font-mono">
        <div className="flex gap-6 items-center">
          <span className="font-sans font-bold text-sm tracking-tight">PORTFOLIOPRO</span>
          
          {/* Navigation Links */}
          <nav className="flex gap-4 border-l border-border pl-6">
            <Link to="/terminal" className="text-textMuted hover:text-textMain transition-colors">TERMINAL</Link>
            <Link to="/portfolio" className="text-textMain font-bold">PORTFOLIO</Link>
            <Link to="/profile" className="text-textMuted hover:text-textMain transition-colors">PROFILE</Link>
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
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Summary Panes */}
        <div className="grid grid-cols-3 border-b border-border h-32 bg-surface">
          {/* Net Liquidity */}
          <div className="border-r border-border p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-textMuted text-[10px] uppercase tracking-widest font-mono">
              <PieChart size={14} /> Net Liquidity (Value + Cash)
            </div>
            <div className="font-mono text-3xl">
              ₹{(totalCurrentValue + buyingPower).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          {/* Total Invested */}
          <div className="border-r border-border p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-textMuted text-[10px] uppercase tracking-widest font-mono">
              <Briefcase size={14} /> Total Invested
            </div>
            <div className="font-mono text-3xl">
              ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Unrealized P&L */}
          <div className="p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-textMuted text-[10px] uppercase tracking-widest font-mono">
              <Activity size={14} /> Unrealized P&L
            </div>
            <div className={`font-mono text-3xl flex items-center gap-2 ${isTotalProfit ? 'text-askGreen' : 'text-bidRed'}`}>
              {isTotalProfit ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
              {isTotalProfit ? '+' : ''}₹{totalUnrealizedPnL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Positions Ledger */}
        <div className="flex-1 flex flex-col bg-base overflow-hidden">
          <div className="h-8 border-b border-border bg-surface flex items-center px-4 text-[10px] text-textMuted font-mono tracking-widest uppercase">
            OPEN POSITIONS
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse font-mono text-sm">
              <thead className="bg-surface sticky top-0 border-b border-border text-textMuted text-[10px] tracking-widest uppercase">
                <tr>
                  <th className="p-3 font-normal">Symbol</th>
                  <th className="p-3 font-normal text-right">Qty</th>
                  <th className="p-3 font-normal text-right">Avg Cost</th>
                  <th className="p-3 font-normal text-right">CMP</th>
                  <th className="p-3 font-normal text-right">Current Value</th>
                  <th className="p-3 font-normal text-right">Unrealized P&L</th>
                  <th className="p-3 font-normal text-right">Return %</th>
                </tr>
              </thead>
              <tbody>
                {enrichedPositions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-textMuted italic">No active positions. Execute trades in the Terminal to build your portfolio.</td>
                  </tr>
                ) : (
                  enrichedPositions.map((pos) => {
                    const isProfit = pos.pnl >= 0;
                    const colorClass = isProfit ? 'text-askGreen' : 'text-bidRed';
                    const sign = isProfit ? '+' : '';

                    return (
                      <tr key={pos.symbol} className="border-b border-border hover:bg-surface transition-colors">
                        <td className="p-3 font-bold text-textMain">{pos.symbol}</td>
                        <td className="p-3 text-right">{pos.qty}</td>
                        <td className="p-3 text-right">₹{pos.avgCost.toFixed(2)}</td>
                        <td className="p-3 text-right">₹{pos.cmp.toFixed(2)}</td>
                        <td className="p-3 text-right">₹{pos.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className={`p-3 text-right ${colorClass}`}>
                          {sign}₹{pos.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`p-3 text-right ${colorClass}`}>
                          {sign}{pos.pnlPercent.toFixed(2)}%
                        </td>
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