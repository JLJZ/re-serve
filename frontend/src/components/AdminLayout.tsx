import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboardIcon, BuildingIcon, CalendarOffIcon, CreditCardIcon, MonitorIcon, LogOutIcon, MenuIcon, XIcon } from 'lucide-react';
const AdminLayout = ({
  user,
  onLogout,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navItems = [{
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboardIcon className="w-5 h-5" />
  }, {
    path: '/admin/facilities',
    label: 'Facility Manager',
    icon: <BuildingIcon className="w-5 h-5" />
  }, {
    path: '/admin/blocking',
    label: 'Block Facilities',
    icon: <CalendarOffIcon className="w-5 h-5" />
  }, {
    path: '/admin/credits',
    label: 'Credit Management',
    icon: <CreditCardIcon className="w-5 h-5" />
  }, {
    path: '/admin/monitor',
    label: 'Booking Monitor',
    icon: <MonitorIcon className="w-5 h-5" />
  }];
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-purple-600">Admin Panel</h1>
            </div>
            <div className="mt-8 flex flex-col flex-grow">
              <nav className="flex-1 px-2 space-y-1 bg-white">
                {navItems.map(item => <Link key={item.path} to={item.path} className={`${location.pathname === item.path ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}>
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>)}
              </nav>
            </div>
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium text-purple-600">
                    Administrator
                  </div>
                </div>
              </div>
              <button onClick={onLogout} className="mt-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <LogOutIcon className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-purple-600">Admin Panel</h1>
          <button onClick={toggleMobileMenu} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none">
            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
          <div className="text-sm font-medium text-purple-600">
            Administrator
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-25" onClick={toggleMobileMenu}>
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h1 className="text-xl font-bold text-purple-600">
                  Admin Panel
                </h1>
                <button onClick={toggleMobileMenu} className="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1 bg-white overflow-y-auto">
                {navItems.map(item => <Link key={item.path} to={item.path} className={`${location.pathname === item.path ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} group flex items-center px-2 py-2 text-base font-medium rounded-md`} onClick={toggleMobileMenu}>
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>)}
              </nav>
              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-sm font-medium text-purple-600">
                      Administrator
                    </div>
                  </div>
                </div>
                <button onClick={onLogout} className="mt-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                  <LogOutIcon className="w-5 h-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="relative flex-1 overflow-y-auto focus:outline-none pt-16 md:pt-0">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>;
};
export default AdminLayout;