'use client';

import { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, LogOut, Menu, X, User, ChevronDown } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: pathname === '/dashboard' },
    { name: 'Items', href: '/dashboard/items', icon: Package, current: pathname.startsWith('/dashboard/items') },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Top Navigation Bar */}
        <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo and Mobile Menu Button */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
                <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                  <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">App</span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* User Menu */}
              <div className="flex items-center">
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-2 max-w-xs bg-white dark:bg-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1 pr-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {user?.email}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Role: <span className="font-medium capitalize">{user?.role}</span>
                          </p>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 dark:border-slate-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        item.current
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="py-6 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}