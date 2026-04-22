'use client';

import { useToast } from '@/src/context/ToastContext';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 w-full px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all duration-300 ease-in-out animate-in slide-in-from-right ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100'
              : 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <span className="flex-1 leading-relaxed">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded p-0.5 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
