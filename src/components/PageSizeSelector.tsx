import React from 'react';

interface Props {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options: number[];
}

export function PageSizeSelector({ pageSize, onPageSizeChange, options }: Props) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-700">
      <label htmlFor="pageSize">Show:</label>
      <select
        id="pageSize"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size} items
          </option>
        ))}
      </select>
    </div>
  );
}