import React from 'react';
import { z } from 'zod';
import { Save, X } from 'lucide-react';

const schema = z.object({
  key: z.string().min(1, "Key is required").max(50, "Key must be less than 50 characters"),
  url: z.string().url("Invalid URL format").max(1024, "URL must be less than 1KB")
});

interface Props {
  initialData?: { key: string; url: string };
  onSubmit: (data: { key: string; url: string }) => void;
  onCancel: () => void;
}

export function URLMappingForm({ initialData, onSubmit, onCancel }: Props) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formData, setFormData] = React.useState(initialData || { key: '', url: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = schema.parse(formData);
      setErrors({});
      onSubmit(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">Key</label>
        <input
          type="text"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., swe, swemily"
        />
        {errors.key && <p className="mt-1 text-sm text-red-600">{errors.key}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://example.com"
        />
        {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </button>
      </div>
    </form>
  );
}