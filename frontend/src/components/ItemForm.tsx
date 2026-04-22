import React from 'react';
import { useToast } from '@/src/context/ToastContext';

interface ItemFormData {
  title: string;
  description?: string;
  status: string;
}

interface ItemFormProps {
  initialData?: ItemFormData;
  onSubmit: (data: ItemFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function ItemForm({ initialData, onSubmit, isLoading = false }: ItemFormProps) {
  const [data, setData] = React.useState<ItemFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
  });
  const [errors, setErrors] = React.useState<{ title?: string }>({});
  const { showError, showSuccess } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }
    if (data.title.length > 200) {
      setErrors({ title: 'Title must be less than 200 characters' });
      return;
    }

    setErrors({});
    try {
      await onSubmit(data);
      showSuccess('Item saved successfully.');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'An error occurred.';
      showError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-slate-200 dark:border-slate-700">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className={`block w-full rounded-md border px-3 py-2 sm:text-sm bg-transparent dark:text-white ${
            errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
          }`}
          placeholder="Enter item title..."
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 sm:text-sm bg-transparent focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
          placeholder="Enter detailed description... (optional)"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Status
        </label>
        <select
          id="status"
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
          className="block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 sm:text-sm bg-white dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Item'}
        </button>
      </div>
    </form>
  );
}
