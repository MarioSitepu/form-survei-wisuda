import { useState } from 'react';
import { FormConfig, addFormResponse } from '@/lib/storage';

interface DynamicFormProps {
  config: FormConfig;
  onSuccess?: () => void;
}

export function DynamicForm({ config, onSuccess }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      for (const field of config.fields) {
        if (field.required && !formData[field.name]) {
          alert(`${field.label} is required`);
          setIsSubmitting(false);
          return;
        }
      }

      // Save response via API
      await addFormResponse({
        formId: config.id,
        data: formData,
        email: formData.email,
      });

      setShowSuccess(true);
      setFormData({});
      onSuccess?.();

      // Reset success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.name] ?? '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            key={field.id}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder || 'Your answer'}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#202124] placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
            style={{ fontSize: '15px', lineHeight: '22px', minHeight: '44px' }}
          />
        );

      case 'textarea':
        return (
          <textarea
            key={field.id}
            name={field.name}
            placeholder={field.placeholder || 'Your answer'}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            rows={4}
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#202124] placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 resize-none transition-all duration-200"
            style={{ fontSize: '15px', lineHeight: '22px', minHeight: '100px' }}
          />
        );

      case 'select':
        return (
          <div className="relative group">
            <select
              key={field.id}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-[#202124] focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 appearance-none cursor-pointer transition-all duration-200"
              style={{ fontSize: '15px', lineHeight: '22px', minHeight: '44px' }}
            >
              <option value="" className="text-gray-400">Choose an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option} className="text-[#202124]">
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-110">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-3 pt-2">
            {field.options && field.options.length > 0 ? (
              field.options.map((option: string) => (
                <label key={option} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-purple-50 transition-all duration-200">
                  <input
                    type="checkbox"
                    name={field.name}
                    value={option}
                    checked={Array.isArray(value) ? value.includes(option) : false}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        handleChange(field.name, [...currentValues, option]);
                      } else {
                        handleChange(field.name, currentValues.filter((v: string) => v !== option));
                      }
                    }}
                    className="mt-1 w-5 h-5 border-2 border-gray-300 rounded-md text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer transition-all"
                    style={{ accentColor: '#9333ea' }}
                  />
                  <span className="text-[#202124] group-hover:text-purple-600 transition-colors font-medium" style={{ fontSize: '15px', lineHeight: '22px' }}>{option}</span>
                </label>
              ))
            ) : (
              <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-purple-50 transition-all duration-200">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={value === true}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="w-5 h-5 border-2 border-gray-300 rounded-md text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer transition-all"
                  style={{ accentColor: '#9333ea' }}
                />
                <span className="text-[#202124] group-hover:text-purple-600 transition-colors font-medium" style={{ fontSize: '15px', lineHeight: '22px' }}>{field.label}</span>
              </label>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2 pt-2">
            {field.options?.map((option: string) => (
              <label key={option} className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-purple-50 transition-all duration-200">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="mt-1 w-5 h-5 border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer transition-all"
                  style={{ accentColor: '#9333ea' }}
                />
                <span className="text-[#202124] group-hover:text-purple-600 transition-colors font-medium" style={{ fontSize: '15px', lineHeight: '22px' }}>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full animate-fade-in" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* Header Card - Enhanced Design */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 transform transition-all duration-300 hover:shadow-xl">
        <div className="px-8 py-10 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" style={{ fontSize: '28px', fontWeight: 500 }}>
              {config.title || 'Untitled Form'}
            </h1>
          </div>
          {config.description && (
            <p className="text-[#5f6368] mt-3 ml-[52px]" style={{ fontSize: '15px', lineHeight: '22px' }}>
              {config.description}
            </p>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 mb-6 p-6 animate-slide-down">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg animate-bounce-in">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800" style={{ fontSize: '18px', fontWeight: 500 }}>
                Your response has been recorded! 🎉
              </h3>
              <p className="text-sm text-green-700 mt-1">Thank you for taking the time to fill out this form.</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="px-8 py-6">
          {config.fields.map((field, index) => (
            <div 
              key={field.id} 
              className={`py-6 transition-all duration-300 hover:bg-gray-50 rounded-lg px-4 -mx-4 ${index !== config.fields.length - 1 ? 'border-b border-gray-200' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-4 flex items-center gap-2">
                <label className="block text-sm font-medium text-[#202124] flex items-center gap-2" style={{ fontSize: '15px', fontWeight: 500, lineHeight: '22px' }}>
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-xs font-semibold text-purple-600">
                    {index + 1}
                  </span>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
                </label>
              </div>
              <div className="mt-3">
                {renderField(field)}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 pb-4 border-t border-gray-200 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                paddingLeft: '32px', 
                paddingRight: '32px',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '8px',
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-[#9ca3af]" style={{ fontSize: '13px', lineHeight: '18px' }}>
        <p className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure form powered by {typeof window !== 'undefined' ? window.location.hostname : 'this application'}
        </p>
      </div>
    </div>
  );
}
