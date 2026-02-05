import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, CheckCircle, Save, Send, X, Loader2, Mail, ArrowLeft, Pencil, Check, Copy, Globe, Lock, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button, Input } from '../ui';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../lib/api';

export const EditorHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    getActiveTemplate,
    updateTemplateInfo,
    isSaved,
    saveTemplate,
    showMockData,
    toggleMockData,
  } = useTemplateStore();

  const activeTemplate = getActiveTemplate();
  
  // Ownership Check
  const isOwner = !activeTemplate?.user_id || activeTemplate?.user_id === user?.id;
  const isForking = activeTemplate?.is_public && !isOwner;

  // Category Logic
  const DEFAULT_CATEGORIES = ['Marketing', 'Newsletter', 'Transactional', 'Holiday', 'Other'];
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      let merged = [...DEFAULT_CATEGORIES];
      try {
        const dbCategories = await api.getCategories();
        merged = [...merged, ...dbCategories];
      } catch (e) {}
      if (activeTemplate?.category) {
        merged.push(activeTemplate.category);
      }
      setCategoryOptions(Array.from(new Set(merged)).sort());
    };
    loadData();
  }, [activeTemplate?.id]);

  const handleSelectChange = (e) => updateTemplateInfo('category', e.target.value);
  
  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const finishEditing = () => {
    const val = activeTemplate?.category?.trim();
    if (!val) updateTemplateInfo('category', 'Other');
    else setCategoryOptions(prev => Array.from(new Set([...prev, val])).sort());
    setIsEditing(false);
  };

  const handleInputKeyDown = (e) => { if (e.key === 'Enter') finishEditing(); };

  // --- VISIBILITY TOGGLE (New Feature) ---
  const toggleVisibility = () => {
    const currentStatus = activeTemplate?.is_public ? 1 : 0;
    const newStatus = currentStatus === 1 ? 0 : 1; // Flip it
    updateTemplateInfo('is_public', newStatus);
  };

  // Save & Fork Logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingStatus, setSendingStatus] = useState('idle');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveTemplate();
    setIsSaving(false);
    if (result && result.newId) navigate(`/editor/${result.newId}`);
  };

  const openSendModal = () => { setSendingStatus('idle'); setTestEmail(''); setIsModalOpen(true); };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testEmail) return;
    setSendingStatus('sending');
    try {
      await api.sendEmail(activeTemplate.id, testEmail);
      setSendingStatus('success');
      setTimeout(() => { setIsModalOpen(false); }, 2000);
    } catch (error) { setSendingStatus('error'); }
  };

  return (
    <>
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-30 sticky top-0">
        <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5 text-slate-500" />
            </Button>

            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={activeTemplate?.name || ''}
                        onChange={(e) => updateTemplateInfo('name', e.target.value)}
                        className="font-semibold text-slate-900 border-none bg-transparent shadow-none px-0 h-6 focus-visible:ring-0 text-sm w-64 placeholder:text-slate-400"
                        placeholder="Untitled Template"
                        disabled={!isOwner} // Disable renaming if not owner
                    />
                    
                    {/* VISIBILITY BADGE / TOGGLE */}
                    {isOwner ? (
                        <button 
                            onClick={toggleVisibility}
                            className={cn(
                                "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border transition-all hover:bg-opacity-80",
                                activeTemplate?.is_public 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                            )}
                            title={activeTemplate?.is_public ? "Click to make Private" : "Click to make Public"}
                        >
                            {activeTemplate?.is_public ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {activeTemplate?.is_public ? "Public" : "Private"}
                        </button>
                    ) : (
                        // View Only Badge
                        <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-indigo-100">
                            <Eye className="w-3 h-3" /> Community View
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 h-6">
                    {/* Category Selection */}
                    {isEditing ? (
                        <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded px-1 animate-in fade-in zoom-in duration-200">
                            <input 
                                ref={inputRef}
                                type="text" 
                                className="bg-transparent border-none text-[10px] uppercase font-bold text-indigo-700 p-1 w-32 focus:ring-0 placeholder:text-indigo-300"
                                value={activeTemplate?.category || ''}
                                onChange={(e) => updateTemplateInfo('category', e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                onBlur={finishEditing}
                            />
                            <button onMouseDown={(e) => { e.preventDefault(); finishEditing(); }} className="text-emerald-600 hover:text-emerald-800 p-1"><Check className="w-3 h-3" /></button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 group">
                            <select
                                value={activeTemplate?.category || 'Other'}
                                onChange={handleSelectChange}
                                disabled={!isOwner}
                                className="text-[10px] uppercase tracking-wider font-medium text-slate-600 bg-slate-100 border-none rounded px-2 py-1 cursor-pointer hover:bg-slate-200 outline-none appearance-none min-w-[100px] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {categoryOptions.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {isOwner && (
                                <button onClick={startEditing} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"><Pencil className="w-3 h-3" /></button>
                            )}
                        </div>
                    )}

                    <span className="text-slate-300 mx-1">|</span>

                    <input 
                        type="text"
                        value={activeTemplate?.subject || ''}
                        onChange={(e) => updateTemplateInfo('subject', e.target.value)}
                        placeholder="Subject Line..."
                        disabled={!isOwner}
                        className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 w-48 disabled:opacity-70"
                    />
                </div>
            </div>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <div className={cn('w-2 h-2 rounded-full', isSaved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse')} />
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">{isSaved ? 'Saved' : 'Unsaved'}</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          
          <Button variant="outline" size="sm" onClick={toggleMockData} className={cn('gap-2', showMockData ? 'bg-slate-100 border-slate-300' : '')}>
            <Settings className="w-3 h-3" /> <span className="hidden sm:inline">{showMockData ? 'Hide Data' : 'Show Data'}</span>
          </Button>

          <Button 
            onClick={handleSave} 
            size="sm" 
            disabled={isSaving}
            className={cn("gap-2 min-w-[100px] text-white transition-all", 
                isForking ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : isForking ? <Copy className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            <span>{isSaving ? 'Saving...' : isForking ? 'Fork Copy' : 'Save'}</span>
          </Button>

          <Button onClick={openSendModal} size="sm" variant="secondary" className="gap-2 border border-slate-200">
            <Send className="w-3 h-3" /> <span className="hidden sm:inline">Send Test</span>
          </Button>
        </div>
      </div>

      {/* SEND MODAL (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-500" /> Send Test Email</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              {sendingStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3"><CheckCircle className="w-6 h-6" /></div>
                  <h4 className="text-lg font-medium text-slate-900">Email Sent!</h4>
                </div>
              ) : (
                <form onSubmit={handleSendTest} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Recipient Address</label>
                    <Input placeholder="name@example.com" type="email" required value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="w-full" autoFocus />
                  </div>
                  {sendingStatus === 'error' && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">Failed to send email.</div>}
                  <div className="pt-2 flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)} disabled={sendingStatus === 'sending'}>Cancel</Button>
                    <Button type="submit" className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={sendingStatus === 'sending' || !testEmail}>
                        {sendingStatus === 'sending' ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Now</>}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};