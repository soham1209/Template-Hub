# MailForge - Component Documentation

## Core Concepts

### 1. State Management (Zustand)

The application uses Zustand for centralized state management. The store is located in `/src/store/useTemplateStore.js`.

#### Store Structure

```javascript
{
  // State
  templates: [],           // All email templates
  activeId: string,        // Current template ID
  view: 'dashboard',       // Current view
  isSaved: true,          // Save state
  editorTab: 'structure', // Active editor tab
  selectedSectionId: null, // Selected block
  showMockData: false,    // Mock data toggle

  // Getters
  getActiveTemplate(),    // Returns active template
  getActiveSection(),     // Returns selected section

  // Actions
  setActiveId(id),
  setView(view),
  setEditorTab(tab),
  setSelectedSectionId(id),
  toggleMockData(),
  updateTemplateInfo(key, value),
  addSection(section),
  updateSection(id, field, key, value),
  deleteSection(id),
  moveSection(index, direction),
  createNewTemplate(),
  saveTemplate()
}
```

#### Usage Example

```javascript
import useTemplateStore from '../store/useTemplateStore';

function MyComponent() {
  const { templates, setActiveId } = useTemplateStore();
  
  return (
    <div>
      {templates.map(t => (
        <button key={t.id} onClick={() => setActiveId(t.id)}>
          {t.name}
        </button>
      ))}
    </div>
  );
}
```

### 2. UI Components

All UI components are in `/src/components/ui/` and follow shadcn patterns.

#### Button Component

```javascript
import { Button } from '../ui';

<Button variant="default">Click me</Button>
<Button variant="outline" size="sm">Small</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

**Variants**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes**: `default`, `sm`, `lg`, `icon`

#### Input Component

```javascript
import { Input } from '../ui';

<Input 
  placeholder="Enter text" 
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### Other Components

- **Label**: Form labels
- **Textarea**: Multi-line input
- **Select**: Dropdown select with custom styling
- **Card**: Container with shadow and border
- **Badge**: Status/category indicators
- **Separator**: Horizontal/vertical divider

### 3. Feature Components

#### Dashboard Component

Displays all templates in a grid. Clicking a template navigates to the editor.

```javascript
import { Dashboard } from './components/features';
```

#### Editor Component

Main editor layout that composes all editor sub-components.

```javascript
import { Editor } from './components/features';
```

**Sub-components**:
- `EditorSidebar`: Left navigation
- `EditorHeader`: Top bar with save controls
- `BlockPalette`: Available block types
- `LayersList`: Section management
- `PropertiesPanel`: Block property editor
- `EmailPreview`: Live preview iframe

### 4. Email Generation

Located in `/src/lib/email-generator.js`

```javascript
import { generateHTML } from '../lib/email-generator';

const html = generateHTML(sections, context);
// Returns complete HTML email string
```

**Features**:
- Template variable replacement (`{{name}}`, `{{company}}`)
- Inline CSS styling
- Responsive email structure
- Support for all block types

### 5. Block Types

Defined in `/src/constants/block-types.js`

```javascript
BLOCK_TYPES = {
  HEADER: 'header',
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  SPACER: 'spacer',
  FOOTER: 'footer'
}
```

Each block type has:
- `id`: Unique identifier
- `type`: Block type from BLOCK_TYPES
- `data`: Content data (varies by type)
- `style`: Styling properties

#### Block Schemas

**Header**:
```javascript
{
  id: 's1',
  type: 'header',
  data: { title: 'Welcome', subtitle: 'Subtitle text' },
  style: { backgroundColor: '#4f46e5', textColor: '#ffffff', padding: '32px' }
}
```

**Text**:
```javascript
{
  id: 's2',
  type: 'text',
  data: { content: 'HTML content with <strong>tags</strong>' },
  style: { padding: '24px', textAlign: 'left', fontSize: '16px', color: '#374151' }
}
```

**Image**:
```javascript
{
  id: 's3',
  type: 'image',
  data: { url: 'https://...', alt: 'Description' },
  style: { width: '100%', borderRadius: '8px' }
}
```

**Button**:
```javascript
{
  id: 's4',
  type: 'button',
  data: { label: 'Click Me', url: '#' },
  style: { backgroundColor: '#000', color: '#fff', borderRadius: '4px', align: 'center', width: 'auto' }
}
```

## Common Patterns

### Adding a New Block Type

1. Add to `BLOCK_TYPES` constant
2. Update `BlockPalette` with new block button
3. Add rendering logic in `email-generator.js`
4. Add property controls in `PropertiesPanel`
5. Add icon mapping in `PropertiesPanel` getIcon()

### Creating a Custom Hook

Place in `/src/hooks/` directory:

```javascript
// /src/hooks/useEmailExport.js
import { generateHTML } from '../lib/email-generator';

export const useEmailExport = () => {
  const exportHTML = (sections, context) => {
    const html = generateHTML(sections, context);
    // Export logic
  };
  
  return { exportHTML };
};
```

### Styling with Tailwind

```javascript
import { cn } from '../lib/utils';

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className // Allow override
)} />
```

## Best Practices

1. **Component Organization**
   - UI components: Generic, reusable
   - Feature components: Business logic
   - Keep components focused and small

2. **State Management**
   - Use Zustand store for global state
   - Use local state for UI-only state
   - Avoid prop drilling with store selectors

3. **Styling**
   - Use Tailwind utility classes
   - Use `cn()` for conditional classes
   - Follow mobile-first approach

4. **Performance**
   - Use `useMemo` for expensive computations
   - Use `useCallback` for function props
   - Lazy load heavy components if needed

5. **Type Safety**
   - Consider adding TypeScript
   - Use JSDoc comments for now
   - Validate prop types in development

## Troubleshooting

### Styles not applying
- Ensure Tailwind is properly configured
- Check that `index.css` imports Tailwind directives
- Verify content paths in `tailwind.config.js`

### State updates not reflecting
- Check if using store actions correctly
- Ensure component is subscribed to correct store slice
- Use React DevTools to inspect component tree

### Preview not updating
- Verify `useMemo` dependencies in EmailPreview
- Check iframe rendering in browser console
- Ensure sections array is properly structured

## Future Enhancements

- [ ] Add TypeScript support
- [ ] Implement undo/redo functionality
- [ ] Add template export (JSON/HTML)
- [ ] Implement template import
- [ ] Add more block types (divider, social media, etc.)
- [ ] Add template categories/tags
- [ ] Implement search/filter
- [ ] Add keyboard shortcuts
- [ ] Add collaboration features
- [ ] Implement dark mode
