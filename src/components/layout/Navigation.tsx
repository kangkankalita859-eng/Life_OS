import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, Plus, Search, Settings, User, Heart, Folder, BarChart3, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/capture', label: 'Capture', icon: Plus },
  { path: '/emotions', label: 'Emotions', icon: Heart },
  { path: '/categories', label: 'Categories', icon: Folder },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/statistics', label: 'Statistics', icon: BarChart3 },
  { path: '/timecapsules', label: 'Time Capsules', icon: Lock },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">L</span>
            </div>
            <span className="font-bold text-xl">Life OS</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
