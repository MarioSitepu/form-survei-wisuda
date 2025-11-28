import { useState } from 'react';
import { FormConfig, FormField, updateFormConfig, updateFormById } from '@/lib/storage';

interface FormEditorProps {
  config: FormConfig;
  onUpdate: () => void;
}

export default function FormEditor({ config, onUpdate }: FormEditorProps) {
  const [title, setTitle] = useState(config.title);
  const [description, setDescription] = useState(config.description);
  const [fields, setFields] = useState<FormField[]>(config.fields);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    required: false,
  });
  
  // Initialize options array when type changes to radio/checkbox/select
  const handleTypeChange = (type: string) => {
    const needsOptions = type === 'select' || type === 'radio' || type === 'checkbox';
    if (needsOptions) {
      // If switching to a type that needs options, initialize with 1 empty option if not already set
      const currentOptions = newField.options && Array.isArray(newField.options) && newField.options.length > 0 
        ? newField.options 
        : [''];
      setNewField({ 
        ...newField, 
        type: type as any,
        options: currentOptions
      });
    } else {
      // If switching away from options type, clear options
      setNewField({ 
        ...newField, 
        type: type as any,
        options: undefined
      });
    }
  };

  const handleAddField = () => {
    if (!newField.name || !newField.label) {
      alert('Please fill in name and label');
      return;
    }

    // Process options - filter out empty strings
    let processedOptions: string[] = [];
    if (newField.options) {
      if (Array.isArray(newField.options)) {
        processedOptions = newField.options.filter((o: string) => o.trim());
      } else {
        const optionsStr = String(newField.options);
        processedOptions = optionsStr.split('\n').filter((o: string) => o.trim());
      }
    }

    const field: FormField = {
      id: Date.now().toString(),
      name: newField.name,
      label: newField.label,
      type: newField.type as any,
      required: newField.required || false,
      placeholder: newField.placeholder,
      options: processedOptions.length > 0 ? processedOptions : undefined,
    };

    setFields([...fields, field]);
    setNewField({ type: 'text', required: false, options: undefined });
  };

  const handleDeleteField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && window.confirm(`Are you sure you want to delete the field "${field.label}"?`)) {
      setFields(fields.filter((f) => f.id !== fieldId));
    }
  };

  const handleSave = async () => {
    try {
      const updatedConfig: Partial<FormConfig> = {
        title,
        description,
        fields,
      };

      // Use updateFormById if available, otherwise fallback to updateFormConfig
      if (config.id) {
        await updateFormById(config.id, updatedConfig);
      } else {
        await updateFormConfig({
          ...config,
          ...updatedConfig,
        } as FormConfig);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onUpdate();
    } catch (error: any) {
      console.error('Error saving form config:', error);
      alert(error.message || 'Error saving form configuration');
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      {showSuccess && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg border-2 border-green-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-800 font-semibold">Form updated successfully!</p>
          </div>
        </div>
      )}

      {/* Form Title & Description */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span>⚙️</span>
            Form Configuration
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              placeholder="Enter form title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 resize-none transition-all duration-200"
              placeholder="Enter form description"
            />
          </div>
        </div>
      </div>

      {/* Current Fields */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span>📝</span>
            Current Fields
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {fields.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No fields yet</p>
                <p className="text-sm text-gray-400 mt-1">Add fields using the form below</p>
              </div>
            ) : (
              fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">{field.label}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                        {field.type}
                      </span>
                      {field.required && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md font-medium">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="ml-4 px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-medium flex items-center gap-2 group"
                    title="Delete this field"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add New Field */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span>➕</span>
            Add New Field
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
              <input
                type="text"
                value={newField.name || ''}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                placeholder="e.g., company_name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Label</label>
              <input
                type="text"
                value={newField.label || ''}
                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                placeholder="e.g., Company Name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
              <select
                value={newField.type || 'text'}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
                <option value="checkbox">Checkbox</option>
                <option value="radio">Radio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required?</label>
              <select
                value={newField.required ? 'yes' : 'no'}
                onChange={(e) => setNewField({ ...newField, required: e.target.value === 'yes' })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder (optional)</label>
            <input
              type="text"
              value={newField.placeholder || ''}
              onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
              placeholder="e.g., Enter text here..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all duration-200"
            />
          </div>

          {(newField.type === 'select' || newField.type === 'radio' || newField.type === 'checkbox') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
              <div className="space-y-2">
                {Array.isArray(newField.options) && newField.options.length > 0 ? (
                  newField.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200">
                      {/* Angka urutan di kiri */}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                        {index + 1}
                      </div>
                      
                      {/* Input opsi */}
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updatedOptions = [...(newField.options as string[])];
                          updatedOptions[index] = e.target.value;
                          setNewField({ ...newField, options: updatedOptions });
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                      />
                      
                      {/* Tombol tambah dan kurang di kanan */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Tombol tambah */}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedOptions = [...(newField.options as string[])];
                            updatedOptions.splice(index + 1, 0, '');
                            setNewField({ ...newField, options: updatedOptions });
                          }}
                          className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 flex items-center justify-center group"
                          title="Tambah opsi setelah ini"
                        >
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        
                        {/* Tombol kurang (hapus) - hanya tampil jika lebih dari 1 opsi */}
                        {newField.options && newField.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedOptions = [...(newField.options as string[])];
                              updatedOptions.splice(index, 1);
                              setNewField({ ...newField, options: updatedOptions.length > 0 ? updatedOptions : [''] });
                            }}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center justify-center group"
                            title="Hapus opsi ini"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg bg-gray-50">
                    {/* Angka urutan di kiri */}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                      1
                    </div>
                    
                    {/* Input opsi */}
                    <input
                      type="text"
                      value=""
                      onChange={(e) => {
                        setNewField({ ...newField, options: [e.target.value] });
                      }}
                      placeholder="Option 1"
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                    />
                    
                    {/* Tombol tambah di kanan */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setNewField({ ...newField, options: ['', ''] });
                        }}
                        className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border-2 border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 flex items-center justify-center group"
                        title="Tambah opsi"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleAddField}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl py-3 font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Field
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl py-4 text-lg font-semibold flex items-center justify-center gap-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Save Form Configuration
      </button>
    </div>
  );
}
