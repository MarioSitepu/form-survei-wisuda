import { useState, useEffect } from 'react';
import { FormConfig } from '@/lib/storage';
import { formAPI } from '@/services/api';
import FormEditor from './form-editor';

interface FormManagementProps {
  onUpdate?: () => void;
  autoShowCreate?: boolean;
}

export default function FormManagement({ onUpdate, autoShowCreate = false }: FormManagementProps) {
  const [forms, setForms] = useState<FormConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<FormConfig | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(autoShowCreate);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormDescription, setNewFormDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    // Auto focus on title input when form is shown
    if (showCreateForm) {
      const timer = setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('input[placeholder*="Contoh: Survey"]');
        input?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showCreateForm]);

  // Handle autoShowCreate prop
  useEffect(() => {
    if (autoShowCreate) {
      setShowCreateForm(true);
    }
  }, [autoShowCreate]);

  const loadForms = async () => {
    setIsLoading(true);
    try {
      const allForms = await formAPI.getAllForms();
      setForms(allForms);
    } catch (error) {
      console.error('Error loading forms:', error);
      alert('Gagal memuat daftar form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForm = async () => {
    if (!newFormTitle.trim()) {
      alert('Judul form wajib diisi');
      return;
    }

    setIsCreating(true);
    try {
      const newForm: Partial<FormConfig> = {
        title: newFormTitle.trim(),
        description: newFormDescription.trim() || '',
        fields: [],
        isPrimary: false,
        isArchived: false,
      };

      await formAPI.createForm(newForm);
      setNewFormTitle('');
      setNewFormDescription('');
      setShowCreateForm(false);
      await loadForms();
      onUpdate?.();
      // Show success message and reset create form state
      setShowCreateForm(false);
      // Show success message
      alert('Form berhasil dibuat! Silakan edit form untuk menambahkan field.');
    } catch (error: any) {
      console.error('Error creating form:', error);
      alert(error.message || 'Gagal membuat form baru');
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleCreateForm();
    }
  };

  const handleSetPrimary = async (formId: string) => {
    if (!confirm('Yakin ingin mengatur form ini sebagai primary? Form primary lainnya akan diubah. Data responses dan analytics akan di-filter berdasarkan form ini.')) {
      return;
    }

    try {
      await formAPI.setPrimaryForm(formId);
      await loadForms();
      // Trigger update to reload data with new primary form
      onUpdate?.();
      alert('Form berhasil diatur sebagai primary. Responses dan analytics sekarang menampilkan data untuk form ini.');
    } catch (error: any) {
      console.error('Error setting primary form:', error);
      alert(error.message || 'Gagal mengatur form sebagai primary');
    }
  };

  const handleArchive = async (formId: string, isArchived: boolean) => {
    const action = isArchived ? 'mengarsipkan' : 'membatalkan arsip';
    if (!confirm(`Yakin ingin ${action} form ini?`)) {
      return;
    }

    try {
      await formAPI.archiveForm(formId, isArchived);
      await loadForms();
      onUpdate?.();
      alert(`Form berhasil ${isArchived ? 'diarsipkan' : 'dibatalkan arsip'}`);
    } catch (error: any) {
      console.error('Error archiving form:', error);
      alert(error.message || `Gagal ${action} form`);
    }
  };

  const handleDelete = async (formId: string) => {
    if (!confirm('Yakin ingin menghapus form ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      await formAPI.deleteForm(formId);
      await loadForms();
      if (selectedForm?.id === formId) {
        setSelectedForm(null);
      }
      onUpdate?.();
      alert('Form berhasil dihapus');
    } catch (error: any) {
      console.error('Error deleting form:', error);
      alert(error.message || 'Gagal menghapus form');
    }
  };

  const handleFormUpdate = async () => {
    await loadForms();
    onUpdate?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (selectedForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedForm(null)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Form
          </button>
        </div>
        <FormEditor config={selectedForm} onUpdate={handleFormUpdate} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Manajemen Form</h2>
          <p className="text-gray-600 mt-1">Kelola semua form yang tersedia</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showCreateForm ? 'Batal' : 'Tambah Form Baru'}
        </button>
      </div>

      {/* Create Form Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Buat Form Baru</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul Form <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newFormTitle}
                onChange={(e) => setNewFormTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Contoh: Survey Kepuasan Pelanggan"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                disabled={isCreating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi <span className="text-gray-400 text-xs">(opsional)</span>
              </label>
              <textarea
                value={newFormDescription}
                onChange={(e) => setNewFormDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan deskripsi form yang akan ditampilkan kepada pengguna"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                disabled={isCreating}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Setelah form dibuat, Anda dapat menambahkan field dengan mengklik tombol "Edit" pada form tersebut.</span>
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateForm}
                disabled={isCreating || !newFormTitle.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Membuat...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Form
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewFormTitle('');
                  setNewFormDescription('');
                }}
                disabled={isCreating}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Tekan <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">Ctrl + Enter</kbd> untuk membuat form
            </p>
          </div>
        </div>
      )}

      {/* Forms List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Form
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Fields
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Dibuat
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada form. Buat form baru untuk memulai.
                  </td>
                </tr>
              ) : (
                forms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{form.title}</div>
                        {form.description && (
                          <div className="text-sm text-gray-500 mt-1">{form.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {form.isPrimary && (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Primary
                          </span>
                        )}
                        {form.isArchived && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            Archived
                          </span>
                        )}
                        {!form.isPrimary && !form.isArchived && (
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {form.fields?.length || 0} field(s)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(form.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedForm(form)}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                          title="Edit Form"
                        >
                          Edit
                        </button>
                        {!form.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(form.id)}
                            className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                            title="Set as Primary"
                          >
                            Set Primary
                          </button>
                        )}
                        {!form.isPrimary && (
                          <button
                            onClick={() => handleArchive(form.id, !form.isArchived)}
                            className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            title={form.isArchived ? 'Unarchive' : 'Archive'}
                          >
                            {form.isArchived ? 'Unarchive' : 'Archive'}
                          </button>
                        )}
                        {!form.isPrimary && (
                          <button
                            onClick={() => handleDelete(form.id)}
                            className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                            title="Delete Form"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

