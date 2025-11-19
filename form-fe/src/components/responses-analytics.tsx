import { FormResponse, FormConfig } from '@/lib/storage';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResponsesAnalyticsProps {
  responses: FormResponse[];
  config: FormConfig | null;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-purple-200 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name || 'Value'}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const COLORS = ['#9333ea', '#3b82f6', '#8b5cf6', '#6366f1', '#ec4899', '#10b981', '#f59e0b'];
const PIE_COLORS = ['#9333ea', '#e5e7eb'];

export default function ResponsesAnalytics({ responses, config }: ResponsesAnalyticsProps) {
  // Filter responses by formId if config is provided
  const filteredResponses = config 
    ? responses.filter(r => r.formId === config.id)
    : responses;

  // Responses over time (always shown)
  const timeSeriesData = filteredResponses.reduce((acc: any, r) => {
    const date = new Date(r.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const existing = acc.find((item: any) => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => {
    // Sort by date properly
    const dateA = new Date(a.date.split(' ').reverse().join(' '));
    const dateB = new Date(b.date.split(' ').reverse().join(' '));
    return dateA.getTime() - dateB.getTime();
  });

  // Generate analytics for each field based on type
  const generateFieldAnalytics = () => {
    if (!config || !config.fields || filteredResponses.length === 0) {
      return [];
    }

    const analytics: any[] = [];

    config.fields.forEach((field) => {
      const fieldData = filteredResponses.map(r => r.data[field.name]).filter(v => v !== null && v !== undefined && v !== '');

      if (fieldData.length === 0) {
        return; // Skip fields with no data
      }

      // Select or Radio - Distribution chart
      if (field.type === 'select' || field.type === 'radio') {
        const distribution = fieldData.reduce((acc: any, value: any) => {
          const key = Array.isArray(value) ? value.join(', ') : String(value);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(distribution).map(([name, count]) => ({
          name: name.length > 30 ? name.substring(0, 30) + '...' : name,
          count,
          fullName: name,
        }));

        if (chartData.length > 0) {
          analytics.push({
            field,
            type: 'distribution',
            data: chartData,
          });
        }
      }

      // Checkbox - Pie chart (Yes/No or multiple options)
      if (field.type === 'checkbox') {
        if (field.options && field.options.length > 0) {
          // Multiple checkbox options
          const distribution = fieldData.reduce((acc: any, value: any) => {
            const values = Array.isArray(value) ? value : [value];
            values.forEach((v: any) => {
              if (v === true || v === 'true') {
                acc['Selected'] = (acc['Selected'] || 0) + 1;
              } else if (v === false || v === 'false') {
                acc['Not Selected'] = (acc['Not Selected'] || 0) + 1;
              } else {
                acc[String(v)] = (acc[String(v)] || 0) + 1;
              }
            });
            return acc;
          }, {});

          const chartData = Object.entries(distribution).map(([name, value]) => ({
            name,
            value,
          }));

          if (chartData.length > 0) {
            analytics.push({
              field,
              type: 'pie',
              data: chartData,
            });
          }
        } else {
          // Single checkbox (boolean)
          const trueCount = fieldData.filter(v => v === true || v === 'true').length;
          const falseCount = fieldData.length - trueCount;

          if (trueCount > 0 || falseCount > 0) {
            analytics.push({
              field,
              type: 'pie',
              data: [
                { name: 'Ya', value: trueCount },
                { name: 'Tidak', value: falseCount },
              ],
            });
          }
        }
      }

      // Number - Statistics
      if (field.type === 'number') {
        const numbers = fieldData
          .map(v => {
            const num = typeof v === 'string' ? parseFloat(v) : Number(v);
            return isNaN(num) ? null : num;
          })
          .filter(n => n !== null) as number[];

        if (numbers.length > 0) {
          const sum = numbers.reduce((a, b) => a + b, 0);
          const avg = sum / numbers.length;
          const min = Math.min(...numbers);
          const max = Math.max(...numbers);

          analytics.push({
            field,
            type: 'statistics',
            data: {
              average: avg,
              min,
              max,
              count: numbers.length,
              total: sum,
            },
          });
        }
      }
    });

    return analytics;
  };

  const fieldAnalytics = generateFieldAnalytics();

  return (
    <div className="space-y-6" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* Form Info */}
      {config && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Analytics untuk</p>
              <p className="text-lg font-semibold text-gray-900">{config.title}</p>
              <p className="text-xs text-gray-500 mt-1">{filteredResponses.length} responses</p>
            </div>
          </div>
        </div>
      )}

      {/* Responses Over Time - Always shown */}
      {filteredResponses.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Responses Over Time</h3>
            </div>
          </div>
          <div className="p-6">
            {timeSeriesData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No time series data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={timeSeriesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9333ea" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#9333ea" 
                    strokeWidth={3}
                    dot={{ fill: '#9333ea', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Field-based Analytics */}
      {fieldAnalytics.length === 0 && filteredResponses.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Tidak ada data analytics yang tersedia</p>
          <p className="text-sm text-gray-500 mt-2">
            Analytics akan muncul untuk field dengan tipe select, radio, checkbox, atau number yang memiliki data
          </p>
        </div>
      ) : (
        fieldAnalytics.map((analytics, index) => {
          // Distribution Chart (Select/Radio)
          if (analytics.type === 'distribution') {
            return (
              <div key={`${analytics.field.id}-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{analytics.field.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Distribution</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analytics.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
                          <stop offset="100%" stopColor={COLORS[(index + 1) % COLORS.length]} stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#6b7280" 
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        tick={{ fill: '#6b7280' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        stroke="#6b7280" 
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        tick={{ fill: '#6b7280' }}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white border-2 border-purple-200 rounded-lg shadow-lg p-3">
                                <p className="font-semibold text-gray-900 mb-1">{data.fullName || data.name}</p>
                                <p className="text-sm text-purple-600">
                                  Count: <span className="font-semibold">{data.count}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill={`url(#barGradient-${index})`}
                        radius={[8, 8, 0, 0]}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          }

          // Pie Chart (Checkbox)
          if (analytics.type === 'pie') {
            return (
              <div key={`${analytics.field.id}-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{analytics.field.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Distribution</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={analytics.data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.data.map((entry: any, idx: number) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center">
                      {analytics.data.map((entry: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {entry.name}: {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Statistics (Number)
          if (analytics.type === 'statistics') {
            return (
              <div key={`${analytics.field.id}-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{analytics.field.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Statistics</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Rata-rata</p>
                      <p className="text-2xl font-bold text-purple-600">{analytics.data.average.toFixed(2)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Minimum</p>
                      <p className="text-2xl font-bold text-green-600">{analytics.data.min}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Maximum</p>
                      <p className="text-2xl font-bold text-orange-600">{analytics.data.max}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-blue-600">{analytics.data.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Berdasarkan <span className="font-semibold">{analytics.data.count}</span> responses
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })
      )}

      {/* No responses message */}
      {filteredResponses.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Belum ada responses</p>
          <p className="text-sm text-gray-500 mt-2">Analytics akan muncul setelah ada responses</p>
        </div>
      )}
    </div>
  );
}
