import { FormResponse } from '@/lib/storage';

interface ResponsesTableProps {
  responses: FormResponse[];
}

export default function ResponsesTable({ responses }: ResponsesTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span>📋</span>
          Form Responses
        </h2>
      </div>
      <div className="p-6">
        {responses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No responses yet</p>
            <p className="text-sm text-gray-400 mt-1">Responses will appear here once users submit the form</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Email</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Rating</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {responses.map((response, index) => (
                  <tr key={response.id} className="hover:bg-purple-50 transition-colors duration-150">
                    <td className="py-4 px-4 text-gray-900 font-medium">{response.data.name || '-'}</td>
                    <td className="py-4 px-4 text-gray-700">{response.email || '-'}</td>
                    <td className="py-4 px-4">
                      {response.data.rating ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
                          ⭐ {response.data.rating}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {new Date(response.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
