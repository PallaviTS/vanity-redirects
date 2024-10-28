import React from 'react';
import { Plus, Loader, History, List } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { URLMappingForm } from './components/URLMappingForm';
import { URLMappingList } from './components/URLMappingList';
import { ActivityLogList } from './components/ActivityLogList';
import { Pagination } from './components/Pagination';
import { SearchBar } from './components/SearchBar';
import { Modal } from './components/Modal';
import { Tabs } from './components/Tabs';
import { PageSizeSelector } from './components/PageSizeSelector';
import type { URLMapping, ActivityLog } from './types';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Generate more mock data
const MOCK_DATA: URLMapping[] = Array.from({ length: 100 }, (_, i) => ({
  key: `mapping-${i + 1}`,
  url: `https://go.babbel.com/t?bsc=podcast-${i + 1}&btp=default&utm_term=generic_v1&utm_medium=podcast&utm_source=source${i + 1}&utm_content=podcast..source${i + 1}..USA..oxfordroad`
}));

const MOCK_LOGS: ActivityLog[] = Array.from({ length: 100 }, (_, i) => ({
  id: crypto.randomUUID(),
  operation: ['create', 'update', 'delete'][Math.floor(Math.random() * 3)] as ActivityLog['operation'],
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  user: ['Admin', 'John', 'Sarah'][Math.floor(Math.random() * 3)],
  details: {
    key: `mapping-${i + 1}`,
    previousUrl: 'https://old-url.com',
    newUrl: 'https://new-url.com'
  }
}));

const TABS = [
  { id: 'mappings', label: 'URL Mappings', icon: <List className="h-5 w-5" /> },
  { id: 'activity', label: 'Activity Log', icon: <History className="h-5 w-5" /> },
];

function App() {
  const [mappings, setMappings] = React.useState<URLMapping[]>(MOCK_DATA);
  const [activityLogs, setActivityLogs] = React.useState<ActivityLog[]>(MOCK_LOGS);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLogPage, setCurrentLogPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [logPageSize, setLogPageSize] = React.useState(10);
  const [showModal, setShowModal] = React.useState(false);
  const [editMapping, setEditMapping] = React.useState<URLMapping | null>(null);
  const [activeTab, setActiveTab] = React.useState('mappings');

  // Reset pages when page size changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  React.useEffect(() => {
    setCurrentLogPage(1);
  }, [logPageSize]);

  // URL Mappings pagination
  const filteredMappings = mappings.filter(
    mapping => 
      mapping.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.url.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredMappings.length / pageSize);
  const paginatedMappings = filteredMappings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Activity Logs pagination
  const totalLogPages = Math.ceil(activityLogs.length / logPageSize);
  const paginatedLogs = activityLogs.slice(
    (currentLogPage - 1) * logPageSize,
    currentLogPage * logPageSize
  );

  const addActivityLog = (
    operation: ActivityLog['operation'],
    details: ActivityLog['details']
  ) => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      operation,
      timestamp: new Date().toISOString(),
      user: 'Admin',
      details,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleSubmit = async (data: URLMapping) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingMapping = mappings.find(m => m.key === data.key);
      
      if (existingMapping && !editMapping) {
        toast.error('A mapping with this key already exists. Please edit the existing mapping instead.');
        return;
      }

      if (editMapping) {
        setMappings(prev => 
          prev.map(m => m.key === editMapping.key ? data : m)
        );
        addActivityLog('update', {
          key: data.key,
          previousUrl: editMapping.url,
          newUrl: data.url,
        });
        toast.success('Mapping updated successfully');
      } else {
        setMappings(prev => [...prev, data]);
        addActivityLog('create', {
          key: data.key,
          newUrl: data.url,
        });
        toast.success('Mapping created successfully');
      }
      setShowModal(false);
      setEditMapping(null);
    } catch (error) {
      toast.error('Failed to save mapping');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this mapping?')) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deletedMapping = mappings.find(m => m.key === key);
      setMappings(prev => prev.filter(m => m.key !== key));
      
      if (deletedMapping) {
        addActivityLog('delete', {
          key: deletedMapping.key,
          previousUrl: deletedMapping.url,
        });
      }
      
      toast.success('Mapping deleted successfully');
    } catch (error) {
      toast.error('Failed to delete mapping');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (mapping: URLMapping) => {
    setEditMapping(mapping);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">URL Manager</h1>
              {activeTab === 'mappings' && (
                <button
                  onClick={() => {
                    setEditMapping(null);
                    setShowModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </button>
              )}
            </div>

            <Tabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="py-6">
              {activeTab === 'mappings' ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <PageSizeSelector
                      pageSize={pageSize}
                      onPageSizeChange={setPageSize}
                      options={PAGE_SIZE_OPTIONS}
                    />
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <>
                      <URLMappingList
                        mappings={paginatedMappings}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />

                      <div className="mt-4 flex items-center justify-between">
                        {totalPages > 1 && (
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                          />
                        )}
                        <div className="text-sm text-gray-700">
                          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredMappings.length)} of {filteredMappings.length} entries
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="flex justify-end mb-4">
                    <PageSizeSelector
                      pageSize={logPageSize}
                      onPageSizeChange={setLogPageSize}
                      options={PAGE_SIZE_OPTIONS}
                    />
                  </div>

                  <ActivityLogList logs={paginatedLogs} />

                  <div className="mt-4 flex items-center justify-between">
                    {totalLogPages > 1 && (
                      <Pagination
                        currentPage={currentLogPage}
                        totalPages={totalLogPages}
                        onPageChange={setCurrentLogPage}
                      />
                    )}
                    <div className="text-sm text-gray-700">
                      Showing {((currentLogPage - 1) * logPageSize) + 1} to {Math.min(currentLogPage * logPageSize, activityLogs.length)} of {activityLogs.length} entries
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditMapping(null);
        }}
        title={editMapping ? 'Edit Mapping' : 'Add New Mapping'}
      >
        <URLMappingForm
          initialData={editMapping || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditMapping(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;