// src/components/features/Dashboard.jsx
import React, { useEffect } from 'react';
import { Mail, Plus, Clock, Loader2 } from 'lucide-react'; // Import Loader2
import { Button, Card, Badge } from '../ui';
import useTemplateStore from '../../store/useTemplateStore';

export const Dashboard = () => {
  // Grab fetchTemplates and isLoading from store
  const { templates, fetchTemplates, loadTemplate, createNewTemplate, isLoading } = useTemplateStore();

  // FETCH ON MOUNT
  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateClick = async (id) => {
    await loadTemplate(id); // This will switch view to 'editor' automatically
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">MailForge</h1>
            <p className="text-slate-500 mt-1">Select a template to launch the builder.</p>
          </div>
          <Button onClick={createNewTemplate} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="animate-spin w-4 h-4"/> : <Plus className="w-4 h-4" />} 
            Create New
          </Button>
        </div>

        {isLoading && templates.length === 0 ? (
           <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-slate-400"/></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                onClick={() => handleTemplateClick(template.id)}
                className="p-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group border-slate-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-slate-50 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{template.subject || 'No subject'}</p>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {/* Handle date formatting simply */}
                  {new Date(template.updated_at || template.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};