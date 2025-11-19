import { useEffect, useState } from 'react';
import { DynamicForm } from '@/components/dynamic-form';
import { FormConfig, getPrimaryFormConfig } from '@/lib/storage';

export default function Home() {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const config = await getPrimaryFormConfig();
      // Check if form is archived
      if (config.isArchived) {
        setError('Form ini telah diarsipkan dan tidak dapat diisi.');
        setFormConfig(null);
      } else {
        setFormConfig(config);
      }
    } catch (error: any) {
      console.error('Error loading form config:', error);
      setError(error.message || 'Failed to load form. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading form...</div>
          <p className="text-sm text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Error Loading Form</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadConfig}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl py-3 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        <div className="text-center">
          <p className="text-gray-600">No form configuration found.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <div className="max-w-3xl mx-auto">
        <DynamicForm config={formConfig} />
      </div>
    </main>
  );
}

