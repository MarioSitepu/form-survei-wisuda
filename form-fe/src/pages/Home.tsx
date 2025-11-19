import { useEffect, useState } from 'react';
import { DynamicForm } from '@/components/dynamic-form';
import { FormConfig, initializeFormConfig } from '@/lib/storage';

export default function Home() {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const config = await initializeFormConfig();
        setFormConfig(config);
      } catch (error) {
        console.error('Error loading form config:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <div className="max-w-3xl mx-auto">
        {formConfig && <DynamicForm config={formConfig} />}
      </div>
    </main>
  );
}

