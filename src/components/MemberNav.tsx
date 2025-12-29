import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Calendar, CreditCard, Settings } from 'lucide-react';

const navItems = [
  { to: '/member-dashboard', icon: Dumbbell, label: 'Dashboard' },
  { to: '/member-calendar', icon: Calendar, label: 'Calendar' },
  { to: '/member-payments', icon: CreditCard, label: 'Payments' },
  { to: '/member-settings', icon: Settings, label: 'Settings' },
];

export function MemberNav() {
  const location = useLocation();
  return (
    <nav className="flex justify-center gap-4 py-4 border-b border-border bg-background/80 sticky top-0 z-20">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center px-3 py-1.5 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
