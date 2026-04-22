'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import apiClient from '@/src/lib/api-client';
import { useToast } from '@/src/context/ToastContext';
import { Trash2, Pencil, Plus, Search, Filter, Package } from 'lucide-react';

interface Item {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { showSuccess, showError } = useToast();

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/v1/items');
      setItems(res.data);
    } catch (err) {
      showError('Failed to fetch items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await apiClient.delete(`/api/v1/items/${id}`);
      showSuccess('Item deleted successfully.');
      fetchItems();
    } catch (err) {
      showError('Failed to delete item.');
    }
  };

  // Filter and search items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Your Items</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and organize your items
          </p>
        </div>
        <Link
          href="/dashboard/items/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5" />
          Create New Item
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-white dark:bg-slate-700 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-slate-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm bg-white dark:bg-slate-700 transition-colors appearance-none cursor-pointer"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        {(searchQuery || statusFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Found {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            {items.length === 0 ? 'No items yet' : 'No items found'}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {items.length === 0 
              ? 'Get started by creating your first item.' 
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {items.length === 0 && (
            <Link
              href="/dashboard/items/new"
              className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Your First Item
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col transition-all hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 pr-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <span className={`flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  item.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : item.status === 'in_progress' 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow mb-4 line-clamp-3">
                {item.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/items/${item.id}/edit`} 
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                    title="Edit item"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}