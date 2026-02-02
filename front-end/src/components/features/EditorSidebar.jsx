import React from 'react';
import { Mail, LayoutList, Settings } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';
import { MOCK_USER_CONTEXT } from '../../constants/templates';

/**
 * EditorSidebar Component
 * Left sidebar navigation for the editor
 */
export const EditorSidebar = () => {
  const { editorTab, setEditorTab, setView } = useTemplateStore();

  return (
    <aside className="w-[70px] bg-slate-950 flex flex-col items-center py-6 gap-4 z-30 shadow-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setView('dashboard')}
        className="text-slate-400 hover:bg-slate-800 hover:text-white mb-4"
      >
        <Mail className="w-5 h-5" />
      </Button>

      <div className="w-full h-[1px] bg-slate-800 mb-2"></div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setEditorTab('structure')}
        className={cn(
          'w-10 h-10 rounded-lg transition-all',
          editorTab === 'structure'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        )}
      >
        <LayoutList className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setEditorTab('settings')}
        className={cn(
          'w-10 h-10 rounded-lg transition-all',
          editorTab === 'settings'
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        )}
      >
        <Settings className="w-5 h-5" />
      </Button>

      <div className="mt-auto">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 font-bold">
          {MOCK_USER_CONTEXT.name[0]}
        </div>
      </div>
    </aside>
  );
};
