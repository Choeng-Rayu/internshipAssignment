'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/src/lib/api-client';
import ItemForm from '@/src/components/ItemForm';
import { useToast } from '@/src/context/ToastContext';
import { ChevronLeftIcon } from 'lucide-react';

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await apiClient.get(`/api/v1/items/${id}`);
        setInitialData({
          title: res.data.title,
          description: res.data.description,
          status: res.data.status,
        });
      } catch (err) {
        showError('Failed to fetch item details.');
        router.push('/dashboard/items');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id, router, showError]);

  const handleSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await apiClient.patch(`/api/v1/items/${id}`, data);
      router.push('/dashboard/items');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Link href="/dashboard/items" className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center transition-colors">
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Back to Items
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Item</h1>
      </div>

      <ItemForm initialData={initialData} onSubmit={handleSubmit} isLoading={isSaving} />
    </div>
  );
}