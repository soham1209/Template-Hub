import React from 'react';
import {
  Settings as SettingsIcon,
  ArrowLeft, // Changed from X to ArrowLeft
  ImageIcon,
  Type,
  LayoutList,
  PlayCircle,
  Tag,
  Link as LinkIcon,
} from 'lucide-react';
import { Button, Input, Label, Textarea, Select, Separator } from '../ui';
import { cn } from '../../lib/utils';
import { BLOCK_TYPES } from '../../constants/block-types';
import useTemplateStore from '../../store/useTemplateStore';

/**
 * PropertiesPanel Component
 * Edit properties of the selected section
 */
export const PropertiesPanel = () => {
  // Add setEditorTab to the store hook
  const { getActiveSection, setEditorTab, updateSection } = useTemplateStore();
  const activeSection = getActiveSection();

  if (!activeSection) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center animate-in fade-in duration-300">
        <SettingsIcon className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Select a block from the structure list to edit properties.</p>
      </div>
    );
  }

  const getIcon = () => {
    switch (activeSection.type) {
      case BLOCK_TYPES.IMAGE: return <ImageIcon className="w-4 h-4" />;
      case BLOCK_TYPES.TEXT: return <Type className="w-4 h-4" />;
      case BLOCK_TYPES.HEADER: return <LayoutList className="w-4 h-4" />;
      case BLOCK_TYPES.BUTTON: return <PlayCircle className="w-4 h-4" />;
      case BLOCK_TYPES.FOOTER: return <Tag className="w-4 h-4" />;
      default: return <SettingsIcon className="w-4 h-4" />;
    }
  };

  // Logic to go back to structure tab
  const handleBack = () => {
    setEditorTab('structure');
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-300">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3 text-slate-800">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-8 w-8 -ml-2 text-slate-400 hover:text-slate-900"
            title="Back to Structure"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md">{getIcon()}</div>
            <span className="font-semibold capitalize text-sm">{activeSection.type}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Content</h4>

        {activeSection.type === BLOCK_TYPES.HEADER && (
          <>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={activeSection.data.title || ''}
                onChange={(e) => updateSection(activeSection.id, 'data', 'title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={activeSection.data.subtitle || ''}
                onChange={(e) =>
                  updateSection(activeSection.id, 'data', 'subtitle', e.target.value)
                }
              />
            </div>
          </>
        )}

        {activeSection.type === BLOCK_TYPES.IMAGE && (
          <>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <div className="flex gap-2">
                <Input
                  className="font-mono text-xs text-slate-500"
                  value={activeSection.data.url || ''}
                  onChange={(e) => updateSection(activeSection.id, 'data', 'url', e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={activeSection.data.alt || ''}
                onChange={(e) => updateSection(activeSection.id, 'data', 'alt', e.target.value)}
              />
            </div>
          </>
        )}

        {activeSection.type === BLOCK_TYPES.TEXT && (
          <div className="space-y-2">
            <Label>HTML Content</Label>
            <Textarea
              rows={6}
              className="font-mono text-xs"
              value={activeSection.data.content || ''}
              onChange={(e) =>
                updateSection(activeSection.id, 'data', 'content', e.target.value)
              }
            />
            <p className="text-[10px] text-slate-400">
              Supports simple HTML tags (b, i, strong, br).
            </p>
          </div>
        )}

        {activeSection.type === BLOCK_TYPES.BUTTON && (
          <>
            <div className="space-y-2">
              <Label>Button Label</Label>
              <Input
                value={activeSection.data.label || ''}
                onChange={(e) => updateSection(activeSection.id, 'data', 'label', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Action URL</Label>
              <Input
                value={activeSection.data.url || ''}
                onChange={(e) => updateSection(activeSection.id, 'data', 'url', e.target.value)}
              />
            </div>
          </>
        )}

        {activeSection.type === BLOCK_TYPES.FOOTER && (
          <div className="space-y-2">
            <Label>Footer Text</Label>
            <Input
              value={activeSection.data.text || ''}
              onChange={(e) => updateSection(activeSection.id, 'data', 'text', e.target.value)}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Appearance Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Appearance
        </h4>

        <div className="grid grid-cols-2 gap-4">
          {['header', 'button', 'footer'].includes(activeSection.type) && (
            <div className="space-y-2">
              <Label>Background</Label>
              <div className="flex items-center gap-2 border border-slate-200 p-1 rounded-md bg-white">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer border-none p-0"
                  value={activeSection.style.backgroundColor || '#ffffff'}
                  onChange={(e) =>
                    updateSection(activeSection.id, 'style', 'backgroundColor', e.target.value)
                  }
                />
                <span className="text-xs font-mono text-slate-500">
                  {activeSection.style.backgroundColor}
                </span>
              </div>
            </div>
          )}

          {['header', 'text', 'button', 'footer'].includes(activeSection.type) && (
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2 border border-slate-200 p-1 rounded-md bg-white">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer border-none p-0"
                  value={
                    activeSection.type === BLOCK_TYPES.HEADER
                      ? activeSection.style.textColor || '#000000'
                      : activeSection.style.color || '#000000'
                  }
                  onChange={(e) =>
                    updateSection(
                      activeSection.id,
                      'style',
                      activeSection.type === BLOCK_TYPES.HEADER ? 'textColor' : 'color',
                      e.target.value
                    )
                  }
                />
                <span className="text-xs font-mono text-slate-500">
                  {activeSection.type === BLOCK_TYPES.HEADER
                    ? activeSection.style.textColor
                    : activeSection.style.color}
                </span>
              </div>
            </div>
          )}
        </div>

        {(activeSection.type === BLOCK_TYPES.IMAGE || activeSection.type === BLOCK_TYPES.BUTTON) && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Corner Radius</Label>
              <span className="text-xs text-slate-500">
                {parseInt(activeSection.style.borderRadius) || 0}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              value={parseInt(activeSection.style.borderRadius) || 0}
              onChange={(e) =>
                updateSection(activeSection.id, 'style', 'borderRadius', `${e.target.value}px`)
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Padding</Label>
          <Select
            value={activeSection.style.padding || '0px'}
            onChange={(e) => updateSection(activeSection.id, 'style', 'padding', e.target.value)}
          >
            <option value="0px">None</option>
            <option value="12px">Small (12px)</option>
            <option value="20px">Medium (20px)</option>
            <option value="32px">Large (32px)</option>
            <option value="48px">Extra Large (48px)</option>
          </Select>
        </div>

        {(activeSection.type === BLOCK_TYPES.BUTTON || activeSection.type === BLOCK_TYPES.TEXT) && (
          <div className="space-y-2">
            <Label>Alignment</Label>
            <div className="flex bg-slate-100 p-1 rounded-md">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() =>
                    updateSection(
                      activeSection.id,
                      'style',
                      activeSection.type === BLOCK_TYPES.TEXT ? 'textAlign' : 'align',
                      align
                    )
                  }
                  className={cn(
                    'flex-1 py-1.5 text-xs font-medium capitalize rounded-sm transition-all',
                    (activeSection.style.textAlign === align ||
                    activeSection.style.align === align)
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection.type === BLOCK_TYPES.BUTTON && (
          <div className="space-y-2">
            <Label>Width Mode</Label>
            <div className="flex bg-slate-100 p-1 rounded-md">
              <button
                onClick={() => updateSection(activeSection.id, 'style', 'width', 'auto')}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium capitalize rounded-sm transition-all',
                  activeSection.style.width !== 'full'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                Auto
              </button>
              <button
                onClick={() => updateSection(activeSection.id, 'style', 'width', 'full')}
                className={cn(
                  'flex-1 py-1.5 text-xs font-medium capitalize rounded-sm transition-all',
                  activeSection.style.width === 'full'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                Full
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};