import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Save, Send, X, Loader2, Mail, ArrowLeft, Copy, Globe, Lock, ChevronDown, CheckCircle, Pencil, Check 
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button, Input } from '../ui';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../lib/api';

// --- SUB-COMPONENT 1: MINIMAL CATEGORY EDIT ---
// This handles switching between "Dropdown" and "Type your own"
const CategorySelector = ({ value, onChange, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [options, setOptions] = useState(['Marketing', 'Newsletter', 'Transactional']);
  const inputRef = useRef(null);

  // Load categories from DB
  useEffect(() => {
    const load = async () => {
      try {
        const dbCats = await api.getCategories();
        // Combine DB categories + Current Value + Defaults -> Remove Duplicates -> Sort
        setOptions(prev => Array.from(new Set([...prev, ...dbCats, value || ''])).sort());
      } catch (e) {}
    };
    load();
  }, [value]);

  const saveCustomCategory = () => {
    const val = value?.trim();
    if (val) setOptions(prev => Array.from(new Set([...prev, val])).sort());
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveCustomCategory();
  };

  // MODE A: Typing a new category
  if (isEditing) {
    return (
      <div className="flex items-center gap-1 bg-indigo-50 px-1 rounded animate-in fade-in zoom-in duration-200">
        <input 
          ref={(el) => el?.focus()}
          type="text" 
          className="bg-transparent border-none text-xs font-medium text-indigo-700 p-0 w-24 focus:ring-0 placeholder:text-indigo-300"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveCustomCategory}
        />
        <button onMouseDown={(e) => { e.preventDefault(); saveCustomCategory(); }} className="text-emerald-600 hover:text-emerald-700">
          <Check className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // MODE B: Dropdown Selection
  return (
    <div className="relative group flex items-center gap-1">
      <div className="relative">
        <select
          value={value || 'Other'}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isOwner}
          className="appearance-none bg-transparent hover:text-indigo-600 transition-colors cursor-pointer pr-4 outline-none disabled:cursor-default text-xs font-medium text-slate-500"
        >
          {options.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {isOwner && <ChevronDown className="w-3 h-3 absolute right-0 top-0.5 pointer-events-none text-slate-400" />}
      </div>

      {/* The Pencil Button You Requested */}
      {isOwner && (
        <button 
          onClick={() => setIsEditing(true)} 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded"
          title="Type a custom category"
        >
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

// --- SUB-COMPONENT 2: VISIBILITY TOGGLE ---
const VisibilityToggle = ({ isPublic, isOwner, onToggle }) => {
  if (!isOwner) return <div className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded flex items-center gap-1"><Globe className="w-3 h-3" /> Community</div>;

  return (
    <button 
      onClick={onToggle}
      className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100"
      title={isPublic ? "Public: Click to make Private" : "Private: Click to make Public"}
    >
      {isPublic ? <Globe className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3" />}
      {isPublic ? "Public" : "Private"}
    </button>
  );
};

// --- SUB-COMPONENT 3: SEND MODAL ---
const SendTestModal = ({ isOpen, onClose, templateId }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      await api.sendEmail(templateId, email);
      setStatus('success');
      setTimeout(onClose, 2000);
    } catch (error) { setStatus('error'); }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-500" /> Send Test Email</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-3 flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
              <h4 className="text-lg font-medium text-slate-900">Email Sent!</h4>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Recipient Address</label>
                <Input placeholder="name@example.com" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" autoFocus />
              </div>
              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={status === 'sending' || !email}>
                    {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export const EditorHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getActiveTemplate, updateTemplateInfo, isSaved, saveTemplate, showMockData, toggleMockData } = useTemplateStore();
  const activeTemplate = getActiveTemplate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = !activeTemplate?.user_id || activeTemplate?.user_id === user?.id;
  const isForking = activeTemplate?.is_public && !isOwner;

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveTemplate();
    setIsSaving(false);
    if (result?.newId) navigate(`/editor/${result.newId}`);
  };

  return (
    <>
      <div className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-30 sticky top-0">
        
        {/* LEFT: BACK + INFO */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex flex-col min-w-0">
            {/* ROW 1: NAME + VISIBILITY */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={activeTemplate?.name || ''}
                onChange={(e) => updateTemplateInfo('name', e.target.value)}
                className="font-bold text-slate-900 text-lg border-none bg-transparent p-0 m-0 h-auto focus:ring-0 placeholder:text-slate-300 w-auto min-w-[150px] truncate"
                placeholder="Untitled Template"
                disabled={!isOwner}
              />
              <VisibilityToggle isPublic={activeTemplate?.is_public} isOwner={isOwner} onToggle={() => updateTemplateInfo('is_public', activeTemplate?.is_public ? 0 : 1)} />
            </div>

            {/* ROW 2: CATEGORY • SUBJECT */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              
              {/* RESTORED: Category Selector with Edit Button */}
              <CategorySelector 
                value={activeTemplate?.category} 
                onChange={(val) => updateTemplateInfo('category', val)} 
                isOwner={isOwner}
              />
              
              <span className="text-slate-300">•</span>
              
              <input 
                type="text"
                value={activeTemplate?.subject || ''}
                onChange={(e) => updateTemplateInfo('subject', e.target.value)}
                placeholder="Add a subject line..."
                disabled={!isOwner}
                className="bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-300 text-xs w-64"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2">
          <div className="mr-2 flex items-center gap-2" title={isSaved ? "All changes saved" : "Unsaved changes"}>
             <div className={cn("w-2 h-2 rounded-full transition-colors", isSaved ? "bg-emerald-400" : "bg-amber-400")} />
          </div>

          <div className="h-6 w-[1px] bg-slate-100 mx-1"></div>

          <Button variant="ghost" size="icon" onClick={toggleMockData} className={cn("text-slate-400 hover:text-indigo-600", showMockData && "text-indigo-600 bg-indigo-50")}>
            <Settings className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)} className="text-slate-400 hover:text-indigo-600">
            <Send className="w-5 h-5" />
          </Button>

          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className={cn(
                "ml-2 gap-2 text-white font-medium shadow-sm transition-all active:scale-95",
                isForking ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-900 hover:bg-slate-800"
            )}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : isForking ? <Copy className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isForking ? "Fork" : "Save"}
          </Button>
        </div>
      </div>

      <SendTestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} templateId={activeTemplate?.id} />
    </>
  );
};