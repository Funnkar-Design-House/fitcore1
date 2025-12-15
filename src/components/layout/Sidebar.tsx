import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  ClipboardList,
  AlertTriangle,
  LogIn,
  Dumbbell,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/members', label: 'Members', icon: Users },
  { path: '/add-member', label: 'Add Member', icon: UserPlus },
  { path: '/plans', label: 'Membership Plans', icon: CreditCard },
  { path: '/payments', label: 'Payments', icon: ClipboardList },
  { path: '/entry-log', label: 'Entry Log', icon: LogIn },
  { path: '/expiry-alerts', label: 'Expiry Alerts', icon: AlertTriangle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Dumbbell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">FitCore</h1>
                <p className="text-xs text-muted-foreground">Gym Management</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <button className="nav-item w-full">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
