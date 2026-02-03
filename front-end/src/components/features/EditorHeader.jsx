import React from 'react';
import { Settings, CheckCircle, Save } from 'lucide-react';
import { Button, Input } from '../ui';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';
import { Send } from 'lucide-react'; // Import Send icon
import { api } from '../../lib/api';

/**
 * EditorHeader Component
 * Top bar of the editor with template name and save controls
 */
export const EditorHeader = () => {
  const {
    getActiveTemplate,
    updateTemplateInfo,
    isSaved,
    saveTemplate,
    showMockData,
    toggleMockData,
  } = useTemplateStore();

  const activeTemplate = getActiveTemplate();

  const handleSave = () => {
    setTimeout(() => {
      saveTemplate();
    }, 600);
  };

  const handleSendTest = async () => {
    const email = prompt("Enter recipient email:");
    if (!email) return;
    
    try {
        await api.sendEmail(activeTemplate.id, email);
        alert("Email sent successfully!");
    } catch (error) {
        alert("Failed to send email.");
        console.error(error);
    }
};

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Editing</span>
        <Input
          value={activeTemplate?.name || ''}
          onChange={(e) => updateTemplateInfo('name', e.target.value)}
          className="font-semibold text-slate-900 border-none bg-transparent shadow-none px-0 h-auto focus-visible:ring-0 text-lg w-auto min-w-[200px]"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              isSaved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            )}
          />
          <span className="text-xs font-medium text-slate-500">
            {isSaved ? 'Saved' : 'Unsaved changes'}
          </span>
        </div>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleMockData}
          className={cn('gap-2', showMockData ? 'bg-slate-100 border-slate-300' : '')}
        >
          <Settings className="w-3 h-3" />
          {showMockData ? 'Hide Data' : 'Show Data'}
        </Button>

        <Button onClick={handleSave} size="sm" className="gap-2 min-w-[100px]">
          {isSaved ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </Button>

        <Button onClick={handleSendTest} size="sm" variant="secondary" className="gap-2 mr-2">
    <Send className="w-3 h-3" />
    <span>Send Test</span>
</Button>
      </div>
    </div>
  );
};
