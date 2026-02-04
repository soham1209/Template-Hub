import React, { useState } from 'react';
import { GripVertical, Trash2, Eye } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';

/**
 * LayersList Component
 * Displays all sections with Drag-and-Drop reordering
 */
export const LayersList = () => {
  const {
    getActiveTemplate,
    selectedSectionId,
    setSelectedSectionId,
    setEditorTab,
    deleteSection,
    reorderSection,
  } = useTemplateStore();

  const activeTemplate = getActiveTemplate();
  
  // State to track the item currently being dragged
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);

  const handleLayerClick = (id) => {
    setSelectedSectionId(id);
    setEditorTab('settings');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteSection(id);
  };

  // --- DRAG AND DROP HANDLERS ---

  const onDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Removed the setDragImage line. 
    // Default browser behavior will now correctly show just the row being moved.
  };

  const onDragOver = (e, index) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedItemIndex === null) return;
    if (dragOverItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const onDragEnd = () => {
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const onDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;

    // Perform the reorder in the store
    if (draggedItemIndex !== dropIndex) {
      reorderSection(draggedItemIndex, dropIndex);
    }
    
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
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
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDrop={(e) => onDrop(e, idx)}
            onDragEnd={onDragEnd}
            onClick={() => handleLayerClick(section.id)}
            className={cn(
              'group flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all duration-200 select-none relative',
              // Active State
              selectedSectionId === section.id
                ? 'border-indigo-600 bg-indigo-50 shadow-sm z-10'
                : 'border-slate-200 bg-white hover:border-slate-300',
              // Dragging State: Only fade the original, don't mess with borders too much
              draggedItemIndex === idx && 'opacity-30',
              // Drop Target Visual: Add a blue line to show where it will land
              dragOverItemIndex === idx && draggedItemIndex !== idx && (
                idx > draggedItemIndex ? 'border-b-2 border-b-indigo-500' : 'border-t-2 border-t-indigo-500'
              )
            )}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-600 rounded">
                <GripVertical className="w-4 h-4" />
              </div>
              
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium capitalize text-slate-700 truncate">
                  {section.type} Block
                </span>
                {/* REMOVED THE ID TEXT HERE */}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* View/Edit Trigger */}
               <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-indigo-600"
                onClick={(e) => {
                    e.stopPropagation();
                    handleLayerClick(section.id);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>

              {/* Delete Trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-600"
                onClick={(e) => handleDelete(e, section.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {(!activeTemplate?.sections || activeTemplate.sections.length === 0) && (
          <div className="text-center text-sm text-slate-400 py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            No blocks added yet.
          </div>
        )}
      </div>
    </div>
  );
};