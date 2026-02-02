import React from 'react';
import {
  Type,
  Image as ImageIcon,
  LayoutList,
  PlayCircle,
  Maximize2,
  Tag,
} from 'lucide-react';
import { BLOCK_TYPES } from '../../constants/block-types';
import useTemplateStore from '../../store/useTemplateStore';

/**
 * BlockPalette Component
 * Grid of available block types to add
 */
export const BlockPalette = () => {
  const { addSection } = useTemplateStore();

  const handleAddBlock = (type) => {
    const newSection = { id: `s_${Date.now()}`, type, data: {}, style: {} };

    if (type === BLOCK_TYPES.HEADER) {
      newSection.data = { title: 'New Header', subtitle: 'Subtitle goes here' };
      newSection.style = { backgroundColor: '#ffffff', textColor: '#000000', padding: '20px' };
    } else if (type === BLOCK_TYPES.IMAGE) {
      newSection.data = { url: 'https://placehold.co/600x200', alt: 'Placeholder' };
      newSection.style = { width: '100%', borderRadius: '0px' };
    } else if (type === BLOCK_TYPES.TEXT) {
      newSection.data = { content: 'Edit this text block...' };
      newSection.style = { padding: '10px', color: '#333333', fontSize: '16px' };
    } else if (type === BLOCK_TYPES.BUTTON) {
      newSection.data = { label: 'Click Me', url: '#' };
      newSection.style = {
        backgroundColor: '#000000',
        color: '#ffffff',
        borderRadius: '4px',
        align: 'center',
      };
    } else if (type === BLOCK_TYPES.SPACER) {
      newSection.style = { height: '30px' };
    } else if (type === BLOCK_TYPES.FOOTER) {
      newSection.data = { text: '© 2024 Company Name' };
      newSection.style = { backgroundColor: '#f3f4f6', color: '#9ca3af', padding: '20px' };
    }

    addSection(newSection);
  };

  const blocks = [
    { type: BLOCK_TYPES.HEADER, icon: LayoutList, label: 'Header' },
    { type: BLOCK_TYPES.TEXT, icon: Type, label: 'Text' },
    { type: BLOCK_TYPES.IMAGE, icon: ImageIcon, label: 'Image' },
    { type: BLOCK_TYPES.BUTTON, icon: PlayCircle, label: 'Button' },
    { type: BLOCK_TYPES.SPACER, icon: Maximize2, label: 'Spacer' },
    { type: BLOCK_TYPES.FOOTER, icon: Tag, label: 'Footer' },
  ];

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Blocks
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {blocks.map((block) => (
          <button
            key={block.type}
            onClick={() => handleAddBlock(block.type)}
            className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900 group"
          >
            <block.icon className="w-5 h-5 mb-2 opacity-70 group-hover:opacity-100" />
            <span className="text-xs font-medium">{block.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
