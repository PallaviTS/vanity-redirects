import React from 'react';
import { Clock, User, Edit2, Trash2, Plus } from 'lucide-react';
import type { ActivityLog } from '../types';

interface Props {
  logs: ActivityLog[];
}

export function ActivityLogList({ logs }: Props) {
  const getOperationIcon = (operation: ActivityLog['operation']) => {
    switch (operation) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit2 className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
    }
  };

  const getOperationClass = (operation: ActivityLog['operation']) => {
    switch (operation) {
      case 'create':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'update':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'delete':
        return 'bg-red-50 text-red-700 ring-red-600/20';
    }
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {logs.map((log, idx) => (
          <li key={log.id}>
            <div className="relative pb-8">
              {idx !== logs.length - 1 && (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              )}
              <div className="relative flex space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  {getOperationIcon(log.operation)}
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900 mr-1">
                        {log.user}
                      </span>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getOperationClass(log.operation)}`}>
                        {log.operation}
                      </span>
                      <span className="mx-1">mapping</span>
                      <span className="font-medium text-gray-900">{log.details.key}</span>
                    </p>
                    {log.operation !== 'delete' && log.details.newUrl && (
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        New URL: {log.details.newUrl}
                      </p>
                    )}
                    {log.operation === 'update' && log.details.previousUrl && (
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        Previous URL: {log.details.previousUrl}
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={log.timestamp}>
                      {new Date(log.timestamp).toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}