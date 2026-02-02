# 🎯 MailForge - Developer Cheat Sheet

## Quick Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint (if configured)
npm run lint
```

## File Locations

| What | Where |
|------|-------|
| UI Components | `src/components/ui/` |
| Features | `src/components/features/` |
| Store | `src/store/useTemplateStore.js` |
| Utils | `src/lib/utils.js` |
| Email Gen | `src/lib/email-generator.js` |
| Constants | `src/constants/` |
| Styles | `src/index.css` |

## Common Imports

```javascript
// UI Components
import { Button, Input, Card, Badge } from '../ui';

// Features
import { Dashboard, Editor } from './components/features';

// Store
import useTemplateStore from '../store/useTemplateStore';

// Utils
import { cn } from '../lib/utils';
import { generateHTML } from '../lib/email-generator';

// Constants
import { BLOCK_TYPES } from '../constants/block-types';
import { MOCK_USER_CONTEXT } from '../constants/templates';
```

## Store Quick Reference

```javascript
const {
  // State
  templates,
  activeId,
  view,
  isSaved,
  editorTab,
  selectedSectionId,
  showMockData,
  
  // Getters
  getActiveTemplate,
  getActiveSection,
  
  // Actions
  setActiveId,
  setView,
  setEditorTab,
  setSelectedSectionId,
  toggleMockData,
  updateTemplateInfo,
  addSection,
  updateSection,
  deleteSection,
  moveSection,
  createNewTemplate,
  saveTemplate,
} = useTemplateStore();
```

## Component Patterns

### Creating a UI Component

```javascript
import React from 'react';
import { cn } from '../../lib/utils';

export const MyComponent = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('base-classes', className)}
        {...props}
      />
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### Creating a Feature Component

```javascript
import React from 'react';
import { Button } from '../ui';
import useTemplateStore from '../../store/useTemplateStore';

export const MyFeature = () => {
  const { data, action } = useTemplateStore();
  
  return (
    <div>
      <Button onClick={action}>Action</Button>
    </div>
  );
};
```

## Button Variants

```javascript
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

## Tailwind Classes

### Common Patterns

```javascript
// Flex
"flex items-center justify-between gap-4"

// Grid
"grid grid-cols-2 gap-4"

// Spacing
"p-4 px-6 py-8 m-4 space-y-4 gap-2"

// Colors
"bg-slate-100 text-slate-900 border-slate-200"

// Rounded
"rounded-md rounded-lg rounded-full"

// Shadow
"shadow-sm shadow-md shadow-lg"

// Hover
"hover:bg-slate-100 hover:text-slate-900"

// Transition
"transition-all duration-300"
```

## Block Structure

```javascript
// Header
{
  id: 's1',
  type: 'header',
  data: { title: '', subtitle: '' },
  style: { backgroundColor: '', textColor: '', padding: '' }
}

// Text
{
  id: 's2',
  type: 'text',
  data: { content: '' },
  style: { padding: '', textAlign: '', fontSize: '', color: '' }
}

// Image
{
  id: 's3',
  type: 'image',
  data: { url: '', alt: '' },
  style: { width: '', borderRadius: '' }
}

// Button
{
  id: 's4',
  type: 'button',
  data: { label: '', url: '' },
  style: { backgroundColor: '', color: '', borderRadius: '', align: '', width: '' }
}
```

## Template Variables

```javascript
// Available variables
{{name}}      // User name
{{company}}   // Company name
{{role}}      // User role
{{email}}     // User email
{{year}}      // Current year

// Usage in content
"Hi {{name}}, welcome to {{company}}!"

// Processing
import { MOCK_USER_CONTEXT } from '../constants/templates';
generateHTML(sections, MOCK_USER_CONTEXT);
```

## State Updates

```javascript
// Update template info
updateTemplateInfo('name', 'New Name');
updateTemplateInfo('subject', 'New Subject');

// Update section
updateSection(sectionId, 'data', 'title', 'New Title');
updateSection(sectionId, 'style', 'padding', '20px');

// Add section
const newSection = {
  id: `s_${Date.now()}`,
  type: BLOCK_TYPES.TEXT,
  data: { content: 'Text' },
  style: { padding: '10px' }
};
addSection(newSection);

// Delete section
deleteSection(sectionId);

// Move section
moveSection(index, -1); // Up
moveSection(index, 1);  // Down
```

## Debugging

```javascript
// Check store state
console.log(useTemplateStore.getState());

// Check specific value
const templates = useTemplateStore.getState().templates;

// Monitor changes
useTemplateStore.subscribe(
  state => state.activeId,
  activeId => console.log('Active ID:', activeId)
);
```

## CSS Animations

```css
/* Available classes */
.animate-in          /* Animation base */
.slide-in-from-left-4   /* Slide from left */
.slide-in-from-right-4  /* Slide from right */
.fade-in            /* Fade in */
.zoom-in-95         /* Zoom in */
.duration-300       /* 300ms */
.duration-500       /* 500ms */
```

## Common Tasks

### Add new block type

1. Add to `src/constants/block-types.js`
2. Update `BlockPalette.jsx`
3. Update `email-generator.js`
4. Update `PropertiesPanel.jsx`

### Add new template

```javascript
const newTemplate = {
  id: `t${Date.now()}`,
  name: 'My Template',
  category: 'Category',
  subject: 'Subject',
  lastModified: 'Just now',
  sections: []
};
```

### Export HTML

```javascript
import { generateHTML } from '../lib/email-generator';

const html = generateHTML(
  activeTemplate.sections,
  MOCK_USER_CONTEXT
);

// Download
const blob = new Blob([html], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'email.html';
a.click();
```

## Keyboard Shortcuts (Future)

```javascript
// To implement
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 's') {
        e.preventDefault();
        saveTemplate();
      }
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

## Useful Snippets

### cn utility

```javascript
import { cn } from '../lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes',
  className
)} />
```

### forwardRef

```javascript
const Component = React.forwardRef(({ ...props }, ref) => {
  return <div ref={ref} {...props} />;
});
Component.displayName = 'Component';
```

### Store selector

```javascript
// Only subscribe to what you need
const templates = useTemplateStore(state => state.templates);
const activeId = useTemplateStore(state => state.activeId);
```

## Documentation Links

- 📖 [README.md](./README.md) - Main overview
- 🏗️ [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Architecture
- 📚 [COMPONENT_DOCS.md](./COMPONENT_DOCS.md) - API docs
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - Tutorial
- 🎨 [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagrams

## Helpful Resources

- [React Docs](https://react.dev)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Pro Tip**: Keep this file open while developing! 📌
