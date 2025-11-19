import { useState, useEffect } from 'react';
import { FormConfig, FormResponse, getFormResponses, getPrimaryFormConfig } from '@/lib/storage';
import FormEditor from './form-editor';
import FormManagement from './form-management';
import ResponsesTable from './responses-table';
import ResponsesAnalytics from './responses-analytics';
import UsersList from './users-list';

type TabType = 'responses' | 'analytics' | 'users' | 'form-editor' | 'form-management';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('responses');
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get primary form
      const primaryForm = await getPrimaryFormConfig();
      setFormConfig(primaryForm);
      
      // Get all responses and filter by primary form ID
      const allResponses = await getFormResponses();
      const filteredResponses = primaryForm 
        ? allResponses.filter(r => r.formId === primaryForm.id)
        : allResponses;
      setResponses(filteredResponses);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormUpdate = async () => {
    await loadData();
    setShowCreateForm(false);
    if (activeTab !== 'form-management') {
      setActiveTab('responses');
    }
  };

  const stats = {
    totalResponses: responses.length,
    totalUsers: new Set(responses.map((r) => r.email).filter(Boolean)).size,
    primaryFormTitle: formConfig?.title || 'No Form',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('form-management');
                  setShowCreateForm(true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Form Baru
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Primary Form Info */}
        {formConfig && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Primary Form</p>
                  <p className="text-lg font-semibold text-gray-900">{formConfig.title}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Active
              </span>
            </div>
            {formConfig.description && (
              <p className="text-sm text-gray-600 mt-2 ml-[52px]">{formConfig.description}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              {stats.totalResponses}
            </div>
            <p className="text-sm font-medium text-gray-600">Total Responses</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
              {stats.totalUsers}
            </div>
            <p className="text-sm font-medium text-gray-600">Unique Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">
              {responses.length > 0
                ? (
                    (responses.filter((r) => r.data.subscribe === true).length /
                      responses.length) *
                    100
                  ).toFixed(1)
                : 0}
              <span className="text-2xl">%</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Newsletter Signup Rate</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap bg-white rounded-xl shadow-lg border border-gray-200 p-2">
          {[
            { id: 'responses', label: 'All Responses', icon: '📋' },
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'form-management', label: 'Form Management', icon: '📝' },
            { id: 'form-editor', label: 'Edit Form', icon: '✏️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'responses' && <ResponsesTable responses={responses} config={formConfig} />}
        {activeTab === 'analytics' && <ResponsesAnalytics responses={responses} config={formConfig} />}
        {activeTab === 'users' && <UsersList responses={responses} formId={formConfig?.id} />}
        {activeTab === 'form-management' && (
          <FormManagement 
            onUpdate={handleFormUpdate} 
            autoShowCreate={showCreateForm}
            key={showCreateForm ? 'create' : 'list'}
          />
        )}
        {activeTab === 'form-editor' && formConfig && (
          <FormEditor config={formConfig} onUpdate={handleFormUpdate} />
        )}
      </div>
    </div>
  );
}
