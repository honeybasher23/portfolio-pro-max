import { Outlet } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, Briefcase, Settings } from 'lucide-react';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background text-textPrimary">
      {/* Sidebar Navigation */}
      <aside className="w-16 md:w-64 border-r border-border bg-surface flex flex-col">
        <div className="p-4 border-b border-border font-bold text-xl hidden md:block">
          PortfolioPro
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem icon={<ArrowRightLeft size={20} />} label="Trade" />
          <NavItem icon={<Briefcase size={20} />} label="Positions" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header - Good place for Wallet Balance */}
        <header className="h-16 border-b border-border bg-surface flex items-center justify-end px-6">
          <div className="text-sm font-mono text-textSecondary">
            Buying Power: <span className="text-textPrimary font-semibold">₹1,00,000.00</span>
          </div>
        </header>

        {/* Dynamic Page Content goes here */}
        <div className="p-6 flex-1 overflow-y-auto">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}

// Simple reusable navigation item
function NavItem({ icon, label }) {
  return (
    <a href="#" className="flex items-center space-x-3 text-textSecondary hover:text-textPrimary hover:bg-border p-2 rounded-md transition-colors">
      {icon}
      <span className="hidden md:inline font-medium">{label}</span>
    </a>
  );
}