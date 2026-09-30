import React, { useState } from 'react'; // <-- Added useState
import { Activity, Briefcase, List, Play } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore'; // <-- Ensure this is imported
import CandlestickChart from '../components/CandlestickChart';
import { Link } from 'react-router-dom';

export default function TradingTerminal() {
  // 1. Pull both the state and the action from Zustand
  const buyingPower = useWalletStore((state) => state.buyingPower);
  const deductFunds = useWalletStore((state) => state.deductFunds);

  // 2. Set up local state for the inputs
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState(2945.00);
  
  // 3. Dynamically calculate the total
  const totalOrderValue = quantity * price;

  const submitOrderToEngine = async (isBuyOrder) => {
    try {
        const response = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Ensure these map to your actual React state variables
            body: JSON.stringify({
                symbol: "RELIANCE.NS",       // Replace with your selected stock state
                isBuy: isBuyOrder,           // true for Buy, false for Sell
                price: parseFloat(price),    // Replace with your price input state
                quantity: parseInt(quantity) // Replace with your quantity input state
            }),
        });

        if (response.ok) {
            const message = await response.text();
            console.log("Success:", message);
            // You can add a success toast notification here
        } else {
            console.error("Order rejected by engine:", await response.text());
        }
    } catch (error) {
        console.error("Failed to reach Spring Boot server:", error);
    }
};

  // 4. Create the execution function
  const handleSubmitOrder = () => {
    if (totalOrderValue <= buyingPower) {
      deductFunds(totalOrderValue); // This instantly updates global state
      console.log(`Executed: Bought ${quantity} shares at ₹${price}`);
    } else {
      alert("Trade Rejected: Insufficient Buying Power.");
    }
  };
  // Mock OHLC data for RELIANCE.NS leading up to today
  const chartData = [
    { time: '2026-09-20', open: 2900, high: 2950, low: 2890, close: 2940 },
    { time: '2026-09-21', open: 2940, high: 2960, low: 2920, close: 2930 },
    { time: '2026-09-22', open: 2930, high: 2980, low: 2925, close: 2975 },
    { time: '2026-09-23', open: 2975, high: 2990, low: 2930, close: 2945 },
    { time: '2026-09-24', open: 2945, high: 2965, low: 2935, close: 2960 },
    { time: '2026-09-27', open: 2960, high: 2970, low: 2920, close: 2935 },
    { time: '2026-09-28', open: 2935, high: 2955, low: 2940, close: 2945.50 },
  ];
  return (
    <div className="h-screen w-full flex flex-col bg-base text-textMain">
      
      {/* Utility Nav */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface text-xs font-mono">
        <div className="flex gap-6 items-center">
          <span className="font-sans font-bold text-sm tracking-tight">PORTFOLIOPRO</span>
          <nav className="flex gap-4 border-l border-border pl-6">
            <Link to="/terminal" className="text-textMain font-bold">TERMINAL</Link>
            <Link to="/portfolio" className="text-textMuted hover:text-textMain transition-colors">PORTFOLIO</Link>
            <Link to="/profile" className="text-textMuted hover:text-textMain transition-colors">PROFILE</Link>
          </nav>
          <span className="text-textMuted">SYS_STATUS: <span className="text-askGreen">ONLINE</span></span>
          <span className="text-textMuted">MKT: <span className="text-textMain">NSE_EQ</span></span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex flex-col text-right">
            <span className="text-textMuted text-[10px] uppercase tracking-wider">H. Swarup</span>
            <span>ID: 2400320</span>
          </div>
          <div className="h-full border-l border-border pl-6 flex flex-col justify-center">
            <span className="text-textMuted text-[10px] uppercase tracking-wider">Buying Power</span>
            
            {/* 2. Inject the dynamic buyingPower variable here */}
            <span className="text-askGreen font-medium">
              ₹{buyingPower.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            
          </div>
        </div>
      </header>

      {/* Main Grid Layout continues below... */}

      {/* Main Grid Layout - Zero gap, separated by borders */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* Left Col: Watchlist & Portfolio summary */}
        <aside className="col-span-3 border-r border-border flex flex-col bg-surface">
          <PaneHeader title="MARKET WATCH" icon={<List size={14} />} />
          <div className="flex-1 overflow-auto p-2 space-y-1">
            <WatchlistItem symbol="RELIANCE" price="2,945.50" change="+1.2%" isUp={true} />
            <WatchlistItem symbol="TCS" price="3,890.00" change="-0.4%" isUp={false} />
            <WatchlistItem symbol="HDFCBANK" price="1,432.10" change="+0.1%" isUp={true} />
            <WatchlistItem symbol="INFY" price="1,645.20" change="-1.1%" isUp={false} />
          </div>
        </aside>

        {/* Center Col: The Chart (Placeholder) & The Order Book */}
        <section className="col-span-6 border-r border-border flex flex-col">
          {/* Chart Area */}
          <div className="h-1/2 border-b border-border bg-base p-4 flex flex-col">
            <div className="flex justify-between font-mono text-sm mb-4">
              <span className="text-xl font-bold">RELIANCE.NS</span>
              <span className="text-askGreen text-xl font-bold">₹2,945.50</span>
            </div>
            {/* Replaced placeholder with the Chart component */}
            <div className="flex-1 w-full border border-border">
              <CandlestickChart data={chartData} />
            </div>
          </div>
          
          {/* The Matching Engine Showcase (Order Book) */}
          <div className="h-1/2 flex flex-col bg-surface">
             <PaneHeader title="MATCHING ENGINE : ORDER BOOK" icon={<Activity size={14} />} />
             <div className="flex-1 flex font-mono text-xs">
                {/* Bids (Max-Heap) */}
                <div className="flex-1 border-r border-border flex flex-col">
                  <div className="grid grid-cols-3 text-textMuted p-2 border-b border-border bg-base text-right">
                    <span>QTY</span>
                    <span>BIDS (₹)</span>
                  </div>
                  <div className="p-2 space-y-1 text-right text-bidRed">
                    <div className="grid grid-cols-3"><span className="text-textMain">150</span><span>2,945.00</span></div>
                    <div className="grid grid-cols-3"><span className="text-textMain">45</span><span>2,944.80</span></div>
                    <div className="grid grid-cols-3"><span className="text-textMain">300</span><span>2,944.50</span></div>
                  </div>
                </div>
                {/* Asks (Min-Heap) */}
                <div className="flex-1 flex flex-col">
                  <div className="grid grid-cols-3 text-textMuted p-2 border-b border-border bg-base text-left">
                    <span>ASKS (₹)</span>
                    <span>QTY</span>
                  </div>
                  <div className="p-2 space-y-1 text-left text-askGreen">
                    <div className="grid grid-cols-3"><span>2,945.50</span><span className="text-textMain">100</span></div>
                    <div className="grid grid-cols-3"><span>2,946.00</span><span className="text-textMain">250</span></div>
                    <div className="grid grid-cols-3"><span>2,946.15</span><span className="text-textMain">50</span></div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Right Col: Order Ticket */}
        <aside className="col-span-3 flex flex-col bg-surface">
          <PaneHeader title="ORDER ENTRY" icon={<Play size={14} />} />
          <div className="p-4 flex flex-col gap-4 font-mono text-sm">
            <div className="flex border border-border">
              <button className="flex-1 bg-bidRed text-white py-2 font-bold hover:bg-opacity-90">BUY</button>
              <button className="flex-1 bg-base text-textMuted py-2 font-bold hover:bg-surface">SELL</button>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-textMuted text-xs">ORDER TYPE</label>
              <select className="bg-base border border-border p-2 outline-none focus:border-action text-textMain">
                <option>LIMIT</option>
                <option>MARKET</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-textMuted text-xs">QUANTITY</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))} // Updates local state on typing
                className="bg-base border border-border p-2 outline-none focus:border-action text-right text-textMain" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-textMuted text-xs">PRICE (₹)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))} // Updates local state on typing
                className="bg-base border border-border p-2 outline-none focus:border-action text-right text-textMain" 
              />
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between font-bold">
              <span className="text-textMuted">TOTAL</span>
              <span>₹{totalOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <button 
              onClick={handleSubmitOrder} // Fires the Zustand action
              className="mt-2 w-full bg-border text-textMain py-3 font-bold hover:bg-action hover:text-white transition-colors"
            >
              SUBMIT ORDER
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
}

// Sub-components
function PaneHeader({ title, icon }) {
  return (
    <div className="h-8 border-b border-border bg-base flex items-center gap-2 px-3 text-[10px] text-textMuted font-mono tracking-widest uppercase">
      {icon}
      {title}
    </div>
  );
}

function WatchlistItem({ symbol, price, change, isUp }) {
  const color = isUp ? 'text-askGreen' : 'text-bidRed';
  return (
    <div className="flex justify-between items-center p-2 hover:bg-base cursor-pointer font-mono text-xs border border-transparent hover:border-border">
      <span className="font-bold">{symbol}</span>
      <div className="flex flex-col text-right">
        <span>{price}</span>
        <span className={color}>{change}</span>
      </div>
    </div>
  );
}