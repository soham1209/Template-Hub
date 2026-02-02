import React from 'react';
import { EditorSidebar } from './EditorSidebar';
import { BlockPalette } from './BlockPalette';
import { LayersList } from './LayersList';
import { PropertiesPanel } from './PropertiesPanel';
import { EditorHeader } from './EditorHeader';
import { EmailPreview } from './EmailPreview';
import useTemplateStore from '../../store/useTemplateStore';
import { MOCK_USER_CONTEXT } from '../../constants/templates';

/**
 * Editor Component
 * Main email template editor interface
 */
export const Editor = () => {
  const { editorTab, getActiveTemplate, showMockData } = useTemplateStore();
  const activeTemplate = getActiveTemplate();

  return (
    <div className="flex w-full h-full animate-in fade-in duration-500">
      {/* Sidebar Navigation */}
      <EditorSidebar />

      {/* Left Panel - Structure/Settings */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="h-16 border-b border-slate-100 flex items-center px-6">
          <h2 className="font-semibold text-slate-900 text-lg">
            {editorTab === 'structure' ? 'Structure' : 'Properties'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {editorTab === 'structure' && (
            <div className="p-6 space-y-8 animate-in slide-in-from-left-4 duration-300">
              <BlockPalette />
              <LayersList />
            </div>
          )}
          {editorTab === 'settings' && <PropertiesPanel />}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col bg-slate-100/50 min-w-0">
        <EditorHeader />

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-100">
          <div className="w-full max-w-[650px] h-full flex flex-col animate-in zoom-in-95 duration-500">
            <EmailPreview
              sections={activeTemplate?.sections || []}
              data={MOCK_USER_CONTEXT}
              showMockData={showMockData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
