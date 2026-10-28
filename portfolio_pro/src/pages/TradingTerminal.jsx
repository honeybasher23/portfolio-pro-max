import { useState, useEffect } from "react"; 
import { Activity, Briefcase, List, Play } from 'lucide-react';
import { useWalletStore } from '../store/useWalletStore'; 
import CandlestickChart from '../components/CandlestickChart';
import { Link } from 'react-router-dom';

export default function TradingTerminal() {
  const buyingPower = useWalletStore((state) => state.buyingPower);
  const deductFunds = useWalletStore((state) => state.deductFunds);
  
  const [isBuy, setIsBuy] = useState(true);
  const [symbol, setSymbol] = useState("RELIANCE");
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState(2945.00);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orders, setOrders] = useState([]);
  
  // NEW: Live Market Price State
  const [marketPrice, setMarketPrice] = useState(null);

  // NEW: Fetch Live Price from Spring Boot
  useEffect(() => {
    const fetchMarketData = async () => {
      if (!symbol) return;
      try {
        // Fetch Live Price
        const priceRes = await fetch(`http://localhost:8080/api/market/price/${symbol}`);
        if (priceRes.ok) {
          const livePrice = await priceRes.json();
          setMarketPrice(livePrice);
          setPrice(livePrice);
        }

        // Fetch Live Chart Data
        const chartRes = await fetch(`http://localhost:8080/api/market/chart/${symbol}`);
        if (chartRes.ok) {
          const data = await chartRes.json();
          setChartData(data);
        }

      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchMarketData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [symbol]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch order book:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmitOrder = async (e) => {
    e?.preventDefault();
    if (!price || !quantity || Number(price) <= 0 || Number(quantity) <= 0) {
      alert("Please enter a valid price and quantity.");
      return;
    }

    // 1. Calculate total order cost
    const totalCost = parseFloat(price) * parseInt(quantity, 10);

    // 2. Block Buy orders if funds are insufficient
    if (isBuy && totalCost > buyingPower) {
      setOrderStatus({ type: "error", text: "INSUFFICIENT BUYING POWER" });
      return;
    }

    setIsSubmitting(true);
    setOrderStatus(null);

    const payload = {
      symbol: symbol,
      isBuy: isBuy,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Order submission failed");
      }

      const result = await response.text();
      setOrderStatus({ type: "success", text: result || "Order placed successfully" });
      setQuantity("");
      
      // 3. Deduct the funds from Zustand store (Only for Buys)
      if (isBuy) {
        deductFunds(totalCost);
      }

      fetchOrders();
    } catch (err) {
      setOrderStatus({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const [chartData, setChartData] = useState([]);

  const bids = orders.filter(o => o.isBuy).sort((a, b) => b.price - a.price);
  const asks = orders.filter(o => !o.isBuy).sort((a, b) => a.price - b.price);

  return (
    <div className="h-screen w-full flex flex-col bg-base text-textMain">
      
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
            <span className="text-askGreen font-medium">
              ₹{buyingPower.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        
        <aside className="col-span-3 border-r border-border flex flex-col bg-surface">
          <PaneHeader title="MARKET WATCH" icon={<List size={14} />} />
          <div className="flex-1 overflow-auto p-2 space-y-1">
            <WatchlistItem symbol="RELIANCE" price="2,945.50" change="+1.2%" isUp={true} />
            <WatchlistItem symbol="TCS" price="3,890.00" change="-0.4%" isUp={false} />
            <WatchlistItem symbol="HDFCBANK" price="1,432.10" change="+0.1%" isUp={true} />
            <WatchlistItem symbol="INFY" price="1,645.20" change="-1.1%" isUp={false} />
          </div>
        </aside>

        <section className="col-span-6 border-r border-border flex flex-col">
          
          <div className="h-1/2 border-b border-border bg-base p-4 flex flex-col">
            <div className="flex justify-between font-mono text-sm mb-4">
              <span className="text-xl font-bold">{symbol ? `${symbol}.NS` : "SYMBOL"}</span>
              <span className="text-askGreen text-xl font-bold">
                {marketPrice ? `₹${marketPrice.toFixed(2)}` : "Fetching..."}
              </span>
            </div>
            <div className="flex-1 w-full border border-border">
              <CandlestickChart data={chartData} />
            </div>
          </div>
          
          {/* Rebuilt Matching Engine Order Book */}
          <div className="h-1/2 flex flex-col bg-surface">
            <PaneHeader title="MATCHING ENGINE : ORDER BOOK" icon={<Activity size={14} />} />
            <div className="flex-1 flex font-mono text-xs overflow-hidden">
              
              {/* Bids (Left Side) */}
              <div className="flex-1 border-r border-border flex flex-col">
                <div className="flex justify-between text-textMuted p-2 border-b border-border bg-base text-[10px]">
                  <span>QTY</span>
                  <span>BIDS (₹)</span>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto">
                  {bids.length === 0 ? (
                    <div className="text-textMuted italic text-center pt-4">No active bids</div>
                  ) : (
                    bids.map((bid) => (
                      <div key={bid.id} className="flex justify-between hover:bg-white/5 px-1 cursor-pointer">
                        <span className="text-textMuted">{bid.quantity}</span>
                        <span className="text-white">{Number(bid.price).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Asks (Right Side) */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between text-textMuted p-2 border-b border-border bg-base text-[10px]">
                  <span>ASKS (₹)</span>
                  <span>QTY</span>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto">
                  {asks.length === 0 ? (
                    <div className="text-textMuted italic text-center pt-4">No active asks</div>
                  ) : (
                    asks.map((ask) => (
                      <div key={ask.id} className="flex justify-between hover:bg-white/5 px-1 cursor-pointer">
                        <span className="text-white">{Number(ask.price).toFixed(2)}</span>
                        <span className="text-textMuted">{ask.quantity}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        <aside className="col-span-3 flex flex-col bg-surface border-l border-border">
          <PaneHeader title="ORDER ENTRY" icon={<Play size={14} />} />
          <form onSubmit={handleSubmitOrder} className="p-4 flex flex-col gap-4 font-mono text-sm">
            
            <div className="flex border border-border rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setIsBuy(true)}
                className={`flex-1 py-2 font-bold transition-colors ${
                  isBuy ? "bg-green-600 text-white" : "bg-base text-textMuted hover:bg-surface"
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setIsBuy(false)}
                className={`flex-1 py-2 font-bold transition-colors ${
                  !isBuy ? "bg-red-600 text-white" : "bg-base text-textMuted hover:bg-surface"
                }`}
              >
                SELL
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-textMuted uppercase">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full bg-base border border-border px-3 py-2 text-white outline-none focus:border-accent"
                placeholder="e.g. RELIANCE"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-textMuted uppercase">Limit Price</label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-base border border-border px-3 py-2 text-white outline-none focus:border-accent"
                placeholder="0.00"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-textMuted uppercase">Quantity</label>
              <input
                type="number"
                step="1"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-base border border-border px-3 py-2 text-white outline-none focus:border-accent"
                placeholder="Shares"
              />
            </div>

            <div className="flex justify-between text-xs text-textMuted pt-1 border-t border-border">
              <span>Estimated Total:</span>
              <span className="text-white font-semibold">
                {(parseFloat(price || 0) * parseInt(quantity || 0, 10)).toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 font-bold text-white transition-opacity mt-4 ${
                isBuy ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "SUBMITTING..." : `${isBuy ? "PLACE BUY ORDER" : "PLACE SELL ORDER"}`}
            </button>

            {orderStatus && (
              <div
                className={`p-2 text-xs border rounded ${
                  orderStatus.type === "success"
                    ? "border-askGreen/40 bg-askGreen/10 text-askGreen"
                    : "border-bidRed/40 bg-bidRed/10 text-bidRed"
                }`}
              >
                {orderStatus.text}
              </div>
            )}
          </form>
        </aside>

      </main>
    </div>
  );
}

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