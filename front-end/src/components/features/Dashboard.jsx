import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Plus, Clock, Loader2, FolderOpen, Globe, Lock, Trash2 } from 'lucide-react';
import { Button, Card } from '../../components/ui';
import useTemplateStore from '../../store/useTemplateStore';
import useAuthStore from '../../store/useAuthStore';
import { EditorSidebar } from '../../components/features';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { templates, fetchTemplates, createNewTemplate, deleteTemplate, isLoading } = useTemplateStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('mine');

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTemplateClick = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleCreateNew = async () => {
    await createNewTemplate();
    const newId = useTemplateStore.getState().activeId;
    if (newId) navigate(`/editor/${newId}`);
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Stop the card from opening
    if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
      await deleteTemplate(id);
    }
  };

  // 1. FILTER templates based on Active Tab
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (activeTab === 'mine') {
        return t.user_id === user?.id; // Show ONLY my templates
      } else {
        return t.is_public && t.user_id !== user?.id; // Show Community templates
      }
    });
  }, [templates, activeTab, user?.id]);

  // 2. GROUP by Category
  const groupedTemplates = useMemo(() => {
    const groups = {};
    filteredTemplates.forEach((template) => {
      const cat = template.category || 'Uncategorized';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <EditorSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="border-b border-slate-200 bg-white px-8 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">MailForge</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your email campaigns and templates.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button 
                    onClick={() => setActiveTab('mine')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                        activeTab === 'mine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Lock className="w-3 h-3" /> My Projects
                </button>
                <button 
                    onClick={() => setActiveTab('community')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                        activeTab === 'community' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Globe className="w-3 h-3" /> Community
                </button>
            </div>

            <Button onClick={handleCreateNew} disabled={isLoading} className="gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white">
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />}
              Create New
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {isLoading && templates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin w-10 h-10 mb-4" />
                <p>Loading your workspace...</p>
              </div>
            )}

            {!isLoading && filteredTemplates.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                    {activeTab === 'mine' ? "No projects found" : "No community templates yet"}
                </h3>
                <p className="text-slate-500 mt-2">
                    {activeTab === 'mine' ? "Create a new template to get started." : "Check back later for public templates."}
                </p>
              </div>
            )}

            {!isLoading && Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
              <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{category}</h2>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{categoryTemplates.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTemplates.map((template) => (
                    <Card
                      key={template.id}
                      onClick={() => handleTemplateClick(template.id)}
                      className="group relative overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 bg-white flex flex-col h-full"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                            <Mail className="w-5 h-5" />
                          </div>
                          
                          <div className="flex gap-2">
                            {template.is_public ? (
                                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100 text-[10px] font-bold uppercase">
                                    <Globe className="w-3 h-3" /> Public
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200 text-[10px] font-bold uppercase">
                                    <Lock className="w-3 h-3" /> Private
                                </span>
                            )}
                          </div>
                        </div>

                        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                          {template.description || template.subject || 'No description provided'}
                        </p>

                        {/* CARD FOOTER */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-medium text-slate-500">
                                    {new Date(template.updated_at || template.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            {/* DELETE BUTTON (Only visible in 'My Projects') */}
                            {activeTab === 'mine' && (
                                <button 
                                    onClick={(e) => handleDelete(e, template.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Template"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
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