import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  Building,
  User,
  Plus,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    roles: ['super_admin', 'client_admin', 'product_admin', 'support_agent'],
  },
  {
    id: 'tickets',
    label: 'Tickets',
    icon: Ticket,
    path: '/tickets',
    roles: ['super_admin', 'client_admin', 'product_admin', 'support_agent'],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/users',
    roles: ['super_admin', 'client_admin'],
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    path: '/products',
    roles: ['super_admin', 'client_admin', 'product_admin'],
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: Building,
    path: '/organizations',
    roles: ['super_admin'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    roles: ['super_admin', 'client_admin', 'product_admin', 'support_agent'],
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    path: '/profile',
    roles: ['super_admin', 'client_admin', 'product_admin', 'support_agent'],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    roles: ['super_admin', 'client_admin'],
  },
];

// End user menu items
const endUserMenuItems: MenuItem[] = [
  {
    id: 'my-tickets',
    label: 'My Tickets',
    icon: Ticket,
    path: '/my-tickets',
    roles: ['end_user'],
  },
  {
    id: 'create-ticket',
    label: 'Create Ticket',
    icon: Plus,
    path: '/create-ticket',
    roles: ['end_user'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: MessageSquare,
    path: '/feedback',
    roles: ['end_user'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const availableItems = user.role === 'end_user' 
    ? endUserMenuItems
    : menuItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Ticket className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TicketPro</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {availableItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};