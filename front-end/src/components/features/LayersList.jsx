import React from 'react';
import { GripVertical, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';

/**
 * LayersList Component
 * Displays all sections in the template with reordering controls
 */
export const LayersList = () => {
  const {
    getActiveTemplate,
    selectedSectionId,
    setSelectedSectionId,
    setEditorTab,
    deleteSection,
    moveSection,
  } = useTemplateStore();

  const activeTemplate = getActiveTemplate();

  const handleLayerClick = (id) => {
    setSelectedSectionId(id);
    setEditorTab('settings');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteSection(id);
  };

  const handleMove = (e, index, direction) => {
    e.stopPropagation();
    moveSection(index, direction);
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Layers
      </h3>
      <div className="space-y-2">
        {activeTemplate?.sections.map((section, idx) => (
          <div
            key={section.id}
            onClick={() => handleLayerClick(section.id)}
            className={cn(
              'group flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all',
              selectedSectionId === section.id
                ? 'border-slate-900 bg-slate-50 shadow-sm'
                : 'border-slate-100 bg-white hover:border-slate-300'
            )}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-slate-300 cursor-move" />
              <span className="text-sm font-medium capitalize text-slate-700">
                {section.type}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => handleMove(e, idx, -1)}
              >
                <ArrowUp className="w-3 h-3 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => handleMove(e, idx, 1)}
              >
                <ArrowDown className="w-3 h-3 text-slate-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => handleDelete(e, section.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {(!activeTemplate?.sections || activeTemplate.sections.length === 0) && (
          <div className="text-center text-sm text-slate-400 py-8 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            No blocks added yet.
          </div>
        )}
      </div>
    </div>
  );
};
