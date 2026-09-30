import React, { useEffect, useRef } from 'react';
// Notice we are now importing CandlestickSeries directly
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

export default function CandlestickChart({ data }) {
  const chartContainerRef = useRef();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Initialize the chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0B0F17' }, 
        textColor: '#64748B', 
      },
      grid: {
        vertLines: { color: '#232D3F' }, 
        horzLines: { color: '#232D3F' },
      },
      crosshair: {
        mode: 1, // Magnet mode
        vertLine: { color: '#64748B', labelBackgroundColor: '#111621' },
        horzLine: { color: '#64748B', labelBackgroundColor: '#111621' },
      },
      // Ensure it mounts with a default height to prevent sizing crashes
      width: chartContainerRef.current.clientWidth || 600,
      height: chartContainerRef.current.clientHeight || 300,
    });

    // 2. V5 syntax: Use addSeries() and pass CandlestickSeries as the first argument
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981', 
      downColor: '#F43F5E', 
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#F43F5E',
    });

    candlestickSeries.setData(data);

    // 3. Make it responsive to window resizing
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };
    window.addEventListener('resize', handleResize);

    // 4. Fit content to screen initially
    chart.timeScale().fitContent();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-full min-h-[250px]" />;
}