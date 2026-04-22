'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/src/lib/api-client';
import ItemForm from '@/src/components/ItemForm';
import { ChevronLeftIcon } from 'lucide-react';

export default function NewItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await apiClient.post('/api/v1/items', data);
      router.push('/dashboard/items');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Link href="/dashboard/items" className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Items
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Item</h1>
      </div>

      <ItemForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}