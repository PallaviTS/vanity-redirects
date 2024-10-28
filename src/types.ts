export interface URLMapping {
  key: string;
  url: string;
}

export interface PaginatedResponse {
  data: URLMapping[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ActivityLog {
  id: string;
  operation: 'create' | 'update' | 'delete';
  timestamp: string;
  user: string;
  details: {
    key: string;
    previousUrl?: string;
    newUrl?: string;
  };
}