import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Plus, Clock, Loader2, FolderOpen } from 'lucide-react';
import { Button, Card, Badge } from '../ui';
import useTemplateStore from '../../store/useTemplateStore';
import { EditorSidebar } from './EditorSidebar';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { templates, fetchTemplates, createNewTemplate, isLoading, activeId } = useTemplateStore();

  // Fetch data when component mounts
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Navigate to editor with the specific ID
  const handleTemplateClick = (id) => {
    navigate(`/editor/${id}`);
  };

  // Handle creating a new template
  const handleCreateNew = async () => {
    await createNewTemplate();
    // After creation, the store updates activeId. We grab it to navigate.
    // Note: Ideally your store action should return the ID, but we can grab it from state
    const newId = useTemplateStore.getState().activeId;
    if (newId) {
        navigate(`/editor/${newId}`);
    }
  };

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    const groups = {};
    templates.forEach((template) => {
      const cat = template.category || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(template);
    });
    return groups;
  }, [templates]);

  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* 1. Sidebar */}
      <EditorSidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 bg-white px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">MailForge</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your email campaigns and templates.</p>
          </div>
          <Button onClick={handleCreateNew} disabled={isLoading} className="gap-2 shadow-sm">
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
            Create New
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Loading State */}
            {isLoading && templates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin w-10 h-10 mb-4" />
                <p>Loading your workspace...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && templates.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No templates found</h3>
                <p className="text-slate-500 mt-2">Get started by creating your first email template.</p>
              </div>
            )}

            {/* Categorized Sections */}
            {!isLoading && Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
              <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    {category}
                  </h2>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {categoryTemplates.length}
                  </span>
                </div>

                {/* Grid for this Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTemplates.map((template) => (
                    <Card
                      key={template.id}
                      onClick={() => handleTemplateClick(template.id)}
                      className="group relative overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 bg-white"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                             <Clock className="w-3 h-3 text-slate-400" />
                             <span className="text-[10px] font-medium text-slate-500">
                                {new Date(template.updated_at || template.created_at).toLocaleDateString()}
                             </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {template.subject || 'No subject line set'}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};