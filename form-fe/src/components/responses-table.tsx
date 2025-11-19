import { FormResponse, FormConfig } from '@/lib/storage';

interface ResponsesTableProps {
  responses: FormResponse[];
  config?: FormConfig | null;
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'boolean') {
    return value ? 'Ya' : 'Tidak';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

export default function ResponsesTable({ responses, config }: ResponsesTableProps) {
  // Filter responses by formId if config is provided
  const filteredResponses = config 
    ? responses.filter(r => r.formId === config.id)
    : responses;

  // Get all unique field names from filtered responses
  const allFieldNames = new Set<string>();
  filteredResponses.forEach((response) => {
    Object.keys(response.data).forEach((key) => allFieldNames.add(key));
  });

  // Get field labels from config if available
  const getFieldLabel = (fieldName: string): string => {
    if (config?.fields) {
      const field = config.fields.find((f) => f.name === fieldName);
      return field?.label || fieldName;
    }
    return fieldName;
  };

  const fieldNames = Array.from(allFieldNames).sort();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" style={{ fontSize: '20px', fontWeight: 600 }}>
              All Form Responses ({filteredResponses.length})
              {config && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  - {config.title}
                </span>
              )}
            </h2>
            {config && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Primary Form
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {filteredResponses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium" style={{ fontSize: '16px' }}>No responses yet</p>
            <p className="text-sm text-gray-500 mt-1" style={{ fontSize: '14px' }}>Responses will appear here once users submit the form</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/30">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider sticky left-0 bg-gradient-to-r from-gray-50 to-purple-50/30 z-10 border-r border-gray-200" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Email
                  </th>
                  {fieldNames.map((fieldName) => (
                    <th
                      key={fieldName}
                      className="text-left py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[150px]"
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      {getFieldLabel(fieldName)}
                    </th>
                  ))}
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider min-w-[180px]" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredResponses.map((response, index) => (
                  <tr 
                    key={response.id} 
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="py-4 px-4 text-gray-900 font-medium sticky left-0 bg-white z-10 border-r border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50" style={{ fontSize: '14px', fontWeight: 500 }}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-xs font-semibold text-purple-600 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span>{response.email || '-'}</span>
                      </div>
                    </td>
                    {fieldNames.map((fieldName) => (
                      <td key={fieldName} className="py-4 px-4 text-gray-700" style={{ fontSize: '14px', lineHeight: '20px' }}>
                        <div className="max-w-xs">
                          {Array.isArray(response.data[fieldName]) ? (
                            <div className="flex flex-wrap gap-1.5">
                              {response.data[fieldName].map((item: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-medium border border-purple-200 shadow-sm"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          ) : typeof response.data[fieldName] === 'boolean' ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm ${
                                response.data[fieldName]
                                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {response.data[fieldName] ? '✓ Ya' : '✗ Tidak'}
                            </span>
                          ) : (
                            <span className="break-words text-[#202124]" style={{ fontSize: '14px', lineHeight: '20px' }}>
                              {formatValue(response.data[fieldName])}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                    <td className="py-4 px-4 text-gray-600" style={{ fontSize: '13px' }}>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {new Date(response.submittedAt).toLocaleString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Response Cards */}
      {filteredResponses.length > 0 && (
        <div className="px-6 pb-6 pt-0">
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Detail Responses
            </h3>
            <div className="space-y-4">
              {filteredResponses.map((response, index) => (
                <div
                  key={response.id}
                  className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl border-2 border-gray-200 hover:border-purple-300 shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900" style={{ fontSize: '16px', fontWeight: 600 }}>
                            Response #{index + 1}
                          </h4>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {response.email || 'No email provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {new Date(response.submittedAt).toLocaleString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body - All Fields */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fieldNames.map((fieldName) => {
                        const fieldValue = response.data[fieldName];
                        const fieldLabel = getFieldLabel(fieldName);
                        const fieldConfig = config?.fields?.find((f) => f.name === fieldName);

                        return (
                          <div
                            key={fieldName}
                            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-200 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                  {fieldLabel}
                                </label>
                                <div className="mt-1">
                                  {fieldValue === null || fieldValue === undefined || fieldValue === '' ? (
                                    <span className="text-gray-400 italic text-sm">Tidak diisi</span>
                                  ) : Array.isArray(fieldValue) ? (
                                    <div className="flex flex-wrap gap-2">
                                      {fieldValue.map((item: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium border border-purple-200 shadow-sm"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  ) : typeof fieldValue === 'boolean' ? (
                                    <span
                                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm ${
                                        fieldValue
                                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                                      }`}
                                    >
                                      {fieldValue ? '✓ Ya' : '✗ Tidak'}
                                    </span>
                                  ) : (
                                    <p className="text-gray-900 text-sm leading-relaxed break-words" style={{ fontSize: '14px', lineHeight: '20px' }}>
                                      {String(fieldValue)}
                                    </p>
                                  )}
                                </div>
                                {fieldConfig && (
                                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                    {fieldConfig.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
