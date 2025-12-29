import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Calendar, CreditCard, Settings } from 'lucide-react';

const navItems = [
  { to: '/member-dashboard', icon: Dumbbell, label: 'Dashboard' },
  { to: '/member-calendar', icon: Calendar, label: 'Calendar' },
  { to: '/member-payments', icon: CreditCard, label: 'Payments' },
  { to: '/member-training', icon: Dumbbell, label: 'Training Plan' },
  { to: '/member-settings', icon: Settings, label: 'Settings' },
];

export function MemberNav() {
  const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-background border-r border-border flex flex-col z-40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Dumbbell className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="font-display text-lg font-bold text-foreground">Member Portal</span>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-base font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
