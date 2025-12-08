import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormConfig, addFormResponse } from '@/lib/storage';

interface DynamicFormProps {
  config: FormConfig;
  onSuccess?: () => void;
}

export function DynamicForm({ config, onSuccess }: DynamicFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if form is archived
  const isArchived = config.isArchived === true;

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateField = (field: any, value: any): string | null => {
    if (field.required) {
      if (value === '' || value === null || value === undefined) {
        return `${field.label} wajib diisi`;
      }
      if (Array.isArray(value) && value.length === 0) {
        return `${field.label} wajib diisi`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all required fields
      const newErrors: Record<string, string> = {};
      let hasErrors = false;

      for (const field of config.fields) {
        const value = formData[field.name];
        const error = validateField(field, value);
        if (error) {
          newErrors[field.name] = error;
          hasErrors = true;
        }
      }

      if (hasErrors) {
        setErrors(newErrors);
        setIsSubmitting(false);
        // Scroll to first error
        const firstErrorField = Object.keys(newErrors)[0];
        const errorElement = document.querySelector(`[data-field-name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Clear errors if validation passes
      setErrors({});

      // Clean data: extract option text from format "option|||index" to just "option"
      const cleanedData: Record<string, any> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (Array.isArray(value)) {
          // For checkbox arrays, extract option text from each value
          cleanedData[key] = value.map((v: string) => {
            if (typeof v === 'string' && v.includes('|||')) {
              return v.split('|||')[0];
            }
            return v;
          });
        } else if (typeof value === 'string' && value.includes('|||')) {
          // For radio buttons, extract option text
          cleanedData[key] = value.split('|||')[0];
        } else {
          // Keep other values as is
          cleanedData[key] = value;
        }
      }

      // Save response via API
      await addFormResponse({
        formId: config.id,
        data: cleanedData,
        email: cleanedData.email,
      });

      // Reset form data
      setFormData({});
      onSuccess?.();

      // Redirect to success page
      navigate('/success');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.name] ?? '';
    const hasError = !!errors[field.name];
    const errorMessage = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div data-field-name={field.name}>
            <input
              key={field.id}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder || 'Your answer'}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className={`w-full px-3 py-2.5 border-2 rounded-lg bg-gray-50 text-[#202124] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                hasError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-200'
              }`}
              style={{ fontSize: '15px', lineHeight: '22px', minHeight: '44px' }}
            />
            {hasError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div data-field-name={field.name}>
            <textarea
              key={field.id}
              name={field.name}
              placeholder={field.placeholder || 'Your answer'}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              rows={4}
              className={`w-full px-3 py-2.5 border-2 rounded-lg bg-gray-50 text-[#202124] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 resize-none transition-all duration-200 ${
                hasError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-200'
              }`}
              style={{ fontSize: '15px', lineHeight: '22px', minHeight: '100px' }}
            />
            {hasError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div data-field-name={field.name}>
            <div className="relative group">
              <select
                key={field.id}
                name={field.name}
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                className={`w-full px-3 py-2.5 border-2 rounded-lg bg-gray-50 text-[#202124] focus:outline-none focus:bg-white focus:ring-2 appearance-none cursor-pointer transition-all duration-200 ${
                  hasError
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-cyan-500 focus:ring-cyan-200'
                }`}
                style={{ fontSize: '15px', lineHeight: '22px', minHeight: '44px' }}
              >
                <option value="" className="text-gray-400">Choose an option</option>
                {field.options?.map((option: string) => (
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
            {hasError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} data-field-name={field.name} className="space-y-2 pt-2">
            {field.options && field.options.length > 0 ? (
              field.options.map((option: string, optionIndex: number) => {
                // Create unique identifier for each option
                const optionId = `${field.name}-${optionIndex}`;
                const optionValue = `${option}|||${optionIndex}`;
                const isChecked = Array.isArray(value) ? value.some((v: string) => {
                  // Check if this specific option (with index) is checked
                  if (typeof v === 'string') {
                    return v === optionValue;
                  }
                  return false;
                }) : false;
                return (
                  <label 
                    key={optionId} 
                    className={`flex items-start gap-3 cursor-pointer group p-4 rounded-xl border-2 transition-all duration-200 ${
                      isChecked 
                        ? 'bg-gradient-to-r from-cyan-50 to-cyan-50 border-cyan-300 shadow-sm' 
                        : hasError
                        ? 'bg-red-50 border-red-300'
                        : 'bg-gray-50 border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
                    }`}
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        name={field.name}
                        value={optionValue}
                        checked={isChecked}
                        onChange={(e) => {
                          const currentValues = Array.isArray(value) ? value : [];
                          if (e.target.checked) {
                            // Add this specific option value if not already present
                            if (!currentValues.includes(optionValue)) {
                              handleChange(field.name, [...currentValues, optionValue]);
                            }
                          } else {
                            // Remove only this specific option value
                            handleChange(field.name, currentValues.filter((v: string) => v !== optionValue));
                          }
                        }}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        isChecked
                          ? 'bg-gradient-to-br from-cyan-600 to-cyan-600 border-cyan-600 shadow-md'
                          : 'bg-white border-gray-300 group-hover:border-cyan-400'
                      }`}>
                        {isChecked && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`flex-1 transition-colors font-medium ${isChecked ? 'text-[#00CCE7]-700' : hasError ? 'text-red-700' : 'text-[#202124] group-hover:text-[#00CCE7]-600'}`} style={{ fontSize: '15px', lineHeight: '22px' }}>
                      {option}
                    </span>
                  </label>
                );
              })
            ) : (
              <label className={`flex items-center gap-3 cursor-pointer group p-4 rounded-xl border-2 transition-all duration-200 ${
                value === true
                  ? 'bg-gradient-to-r from-cyan-50 to-cyan-50 border-cyan-300 shadow-sm'
                  : hasError
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
              }`}>
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={value === true}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    value === true
                      ? 'bg-gradient-to-br from-cyan-600 to-cyan-600 border-cyan-600 shadow-md'
                      : hasError
                      ? 'bg-white border-red-400'
                      : 'bg-white border-gray-300 group-hover:border-cyan-400'
                  }`}>
                    {value === true && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={`flex-1 transition-colors font-medium ${value === true ? 'text-[#00CCE7]-700' : hasError ? 'text-red-700' : 'text-[#202124] group-hover:text-[#00CCE7]-600'}`} style={{ fontSize: '15px', lineHeight: '22px' }}>
                  {field.label}
                </span>
              </label>
            )}
            {hasError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} data-field-name={field.name} className="space-y-2 pt-2">
            {field.options?.map((option: string, optionIndex: number) => {
              // Create unique identifier for each option
              const optionId = `${field.name}-${optionIndex}`;
              const optionValue = `${option}|||${optionIndex}`;
              // Check if current value matches this specific option (with index)
              const isChecked = typeof value === 'string' && value === optionValue;
              return (
                <label 
                  key={optionId} 
                  className={`flex items-start gap-3 cursor-pointer group p-4 rounded-xl border-2 transition-all duration-200 ${
                    isChecked
                      ? 'bg-gradient-to-r from-cyan-50 to-cyan-50 border-cyan-300 shadow-sm'
                      : hasError
                      ? 'bg-red-50 border-red-300'
                      : 'bg-gray-50 border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
                  }`}
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="radio"
                      name={field.name}
                      value={optionValue}
                      checked={isChecked}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isChecked
                        ? 'border-cyan-600'
                        : hasError
                        ? 'bg-white border-red-400'
                        : 'bg-white border-gray-300 group-hover:border-cyan-400'
                    }`}>
                      {isChecked && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-600 shadow-sm"></div>
                      )}
                    </div>
                  </div>
                  <span className={`flex-1 transition-colors font-medium ${isChecked ? 'text-[#00CCE7]-700' : hasError ? 'text-red-700' : 'text-[#202124] group-hover:text-[#00CCE7]-600'}`} style={{ fontSize: '15px', lineHeight: '22px' }}>
                    {option}
                  </span>
                </label>
              );
            })}
            {hasError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMessage}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // If form is archived, show message instead of form
  if (isArchived) {
    return (
      <div className="w-full animate-fade-in" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Form Telah Diarsipkan</h2>
            <p className="text-gray-600">
              Form ini telah diarsipkan dan tidak dapat diisi lagi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {/* Header Card - Enhanced Design */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 transform transition-all duration-300 hover:shadow-xl">
        <div className="px-8 py-10 bg-gradient-to-r from-cyan-50 to-cyan-50 rounded-t-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-500 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-cyan-600 to-cyan-600 bg-clip-text text-transparent" style={{ fontSize: '28px', fontWeight: 500 }}>
              {config.title || 'Untitled Form'}
            </h1>
            {config.isPrimary && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Primary
              </span>
            )}
          </div>
          {config.description && (
            <p className="text-[#5f6368] mt-3 ml-[52px]" style={{ fontSize: '15px', lineHeight: '22px' }}>
              {config.description}
            </p>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="px-8 py-6">
          {config.fields.map((field, index) => (
            <div 
              key={field.id} 
              className={`py-6 transition-all duration-300 hover:bg-gray-50 rounded-lg px-4 -mx-4 ${index !== config.fields.length - 1 ? 'border-b border-gray-200' : ''}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-[#202124]" style={{ fontSize: '15px', fontWeight: 500, lineHeight: '22px' }}>
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-100 flex items-center justify-center text-xs font-semibold text-[#00CCE7]-600 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="flex items-center gap-2">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 text-xs font-medium px-2 py-0.5 bg-red-50 rounded-md border border-red-200">
                        wajib diisi
                      </span>
                    )}
                  </span>
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
              className="bg-gradient-to-r from-cyan-600 to-cyan-600 text-white hover:from-cyan-700 hover:to-cyan-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-offset-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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
