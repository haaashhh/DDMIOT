import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  AlertTriangle, 
  Network, 
  Archive,
  BarChart3,
  Settings,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Tableau de Bord', href: '/', icon: LayoutDashboard },
  { name: 'Serveurs', href: '/servers', icon: Server },
  { name: 'Alertes', href: '/alerts', icon: AlertTriangle },
  { name: 'Réseau', href: '/network', icon: Network },
  { name: 'Racks', href: '/racks', icon: Archive },
  { name: 'Rapports', href: '/reports', icon: BarChart3 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none lg:border-r lg:border-gray-200',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:flex items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pt-12 pb-8 space-y-2 flex flex-col justify-start">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => clsx(
                  'sidebar-nav-item',
                  isActive && 'active'
                )}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Version 2.0.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;