import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TradingTerminal from './pages/TradingTerminal';
import LoginPage from './pages/LoginPage';
import PortfolioPage from './pages/PortfolioPage'; 
import ProfilePage from './pages/ProfilePage';
import TradeHistory from './pages/TradeHistory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set login as the default landing route for now */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terminal" element={<TradingTerminal />} />
        <Route path="/portfolio" element={<PortfolioPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/history" element={<TradeHistory />} />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}