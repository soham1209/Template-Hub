import React from 'react';
import { EditorSidebar } from './EditorSidebar';
import { BlockPalette } from './BlockPalette';
import { LayersList } from './LayersList';
import { PropertiesPanel } from './PropertiesPanel';
import { EditorHeader } from './EditorHeader';
import { EmailPreview } from './EmailPreview';
import useTemplateStore from '../../store/useTemplateStore';
import { MOCK_USER_CONTEXT } from '../../constants/templates';
import { Loader2 } from 'lucide-react';

/**
 * Editor Component
 * Main email template editor interface
 */
export const Editor = () => {
  const { editorTab, getActiveTemplate, showMockData, isLoading } = useTemplateStore();
  const activeTemplate = getActiveTemplate();

  // Loading State
  if (isLoading || !activeTemplate) {
    return (
        <div className="flex w-full h-full items-center justify-center bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-500">Loading editor...</span>
        </div>
    );
  }

  // ... Rest of your component (Sidebar, Panels, etc) remains the same ...
  // Ensure you are passing activeTemplate.sections to EmailPreview
  return (
     <div className="flex w-full h-full animate-in fade-in duration-500">
        <EditorSidebar />
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-20">
            {/* ... Panel Code ... */}
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                {editorTab === 'structure' && (
                    <div className="p-6 space-y-8">
                    <BlockPalette />
                    <LayersList />
                    </div>
                )}
                {editorTab === 'settings' && <PropertiesPanel />}
            </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-100/50 min-w-0">
            <EditorHeader />
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-100">
                <div className="w-full max-w-[650px] h-full flex flex-col animate-in zoom-in-95 duration-500">
                    <EmailPreview
                        sections={activeTemplate.sections || []}
                        data={MOCK_USER_CONTEXT}
                        showMockData={showMockData}
                    />
                </div>
            </div>
        </div>
     </div>
  );
};