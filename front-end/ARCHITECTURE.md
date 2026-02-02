# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         MailForge                            │
│                     (React Application)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │            Main App (App.jsx)           │
        │     Controls View: Dashboard/Editor     │
        └─────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌──────────────────┐
    │    Dashboard      │       │      Editor      │
    │   - Template Grid │       │  - Full Builder  │
    │   - Template Card │       │  - Live Preview  │
    └───────────────────┘       └──────────────────┘
                                         │
                        ┌────────────────┼────────────────┐
                        │                │                │
                        ▼                ▼                ▼
              ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
              │  Sidebar    │  │ Left Panel  │  │ Canvas Area  │
              │  Navigation │  │ Structure/  │  │ Email        │
              │             │  │ Properties  │  │ Preview      │
              └─────────────┘  └─────────────┘  └──────────────┘
```

## Component Hierarchy

```
App
├── Dashboard
│   └── TemplateCard (multiple)
│
└── Editor
    ├── EditorSidebar
    │   ├── Home Button
    │   ├── Structure Tab Button
    │   ├── Settings Tab Button
    │   └── User Avatar
    │
    ├── Left Panel Container
    │   ├── Header (Structure/Properties)
    │   │
    │   ├── Structure Tab
    │   │   ├── BlockPalette
    │   │   │   └── Block Buttons (6 types)
    │   │   │
    │   │   └── LayersList
    │   │       └── Layer Items (with controls)
    │   │
    │   └── Settings Tab
    │       └── PropertiesPanel
    │           ├── Block Header
    │           ├── Content Section
    │           │   └── (Dynamic based on block type)
    │           └── Appearance Section
    │               ├── Color Pickers
    │               ├── Range Sliders
    │               ├── Select Dropdowns
    │               └── Toggle Buttons
    │
    └── Canvas Area
        ├── EditorHeader
        │   ├── Template Name Input
        │   ├── Save Status Indicator
        │   ├── Mock Data Toggle
        │   └── Save Button
        │
        └── EmailPreview
            └── Iframe (Live HTML render)
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Zustand Store                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  State:                                         │    │
│  │  - templates[]                                  │    │
│  │  - activeId                                     │    │
│  │  - view (dashboard/editor)                      │    │
│  │  - selectedSectionId                            │    │
│  │  - editorTab (structure/settings)               │    │
│  │  - showMockData                                 │    │
│  │  - isSaved                                      │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
            │           │           │
            ▼           ▼           ▼
     ┌──────────┐ ┌──────────┐ ┌──────────┐
     │Dashboard │ │  Editor  │ │ Preview  │
     │Component │ │Components│ │Component │
     └──────────┘ └──────────┘ └──────────┘
            │           │           │
            └───────────┼───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  User Interactions    │
            │  - Click template     │
            │  - Add block          │
            │  - Edit properties    │
            │  - Save template      │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Store Actions        │
            │  - setActiveId()      │
            │  - addSection()       │
            │  - updateSection()    │
            │  - saveTemplate()     │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  State Updates        │
            │  (Triggers Re-render) │
            └───────────────────────┘
```

## Email Generation Flow

```
┌─────────────┐
│   Sections  │ (Array of block objects)
│   + Context │ (User data: name, company, etc.)
└──────┬──────┘
       │
       ▼
┌────────────────────┐
│ generateHTML()     │
│ /lib/email-        │
│ generator.js       │
└────────┬───────────┘
         │
         ├──► Process Variables ({{name}} → Soham)
         │
         ├──► Render Styles (Object → Inline CSS)
         │
         ├──► Generate Block HTML
         │    ├─► Header Block
         │    ├─► Text Block
         │    ├─► Image Block
         │    ├─► Button Block
         │    ├─► Spacer Block
         │    └─► Footer Block
         │
         └──► Wrap in Email Template
              (HTML/Head/Body structure)
              │
              ▼
      ┌──────────────────┐
      │  Complete HTML   │
      │  Email String    │
      └────────┬─────────┘
               │
               ▼
      ┌──────────────────┐
      │  Iframe Preview  │
      │  (Live Render)   │
      └──────────────────┘
```

## Block Structure

```
Block Object
├── id: string (unique identifier)
├── type: string (header|text|image|button|spacer|footer)
├── data: object
│   ├── [type-specific content]
│   │   Header:    { title, subtitle }
│   │   Text:      { content }
│   │   Image:     { url, alt }
│   │   Button:    { label, url }
│   │   Spacer:    { } (empty)
│   │   Footer:    { text }
│   └──
└── style: object
    ├── Common: { padding, backgroundColor, color }
    ├── Text: { textAlign, fontSize }
    ├── Image: { width, borderRadius, objectFit }
    ├── Button: { align, width, borderRadius }
    └── Header: { textColor }
```

## File Organization

```
src/
├── components/
│   ├── ui/                      # Design System
│   │   ├── button.jsx           # ✓ Reusable
│   │   ├── input.jsx            # ✓ Generic
│   │   ├── card.jsx             # ✓ No business logic
│   │   └── ...
│   │
│   └── features/                # Business Logic
│       ├── Dashboard.jsx        # ✓ Connects to store
│       ├── Editor.jsx           # ✓ App-specific
│       ├── PropertiesPanel.jsx  # ✓ Complex logic
│       └── ...
│
├── store/
│   └── useTemplateStore.js      # ✓ Single source of truth
│
├── lib/
│   ├── utils.js                 # ✓ Helper functions
│   └── email-generator.js       # ✓ Business logic
│
└── constants/
    ├── block-types.js           # ✓ Constants
    └── templates.js             # ✓ Initial data
```

## State Management Pattern

```javascript
// 1. Import store
import useTemplateStore from '../store/useTemplateStore';

// 2. Select needed state/actions (only what you need)
const { templates, setActiveId } = useTemplateStore();

// 3. Use in component
<button onClick={() => setActiveId('t1')}>
  Select Template
</button>

// 4. Store updates automatically trigger re-render
// (Thanks to Zustand's subscriptions)
```

## Styling Strategy

```
Tailwind Utility Classes
         │
         ├──► Base Styles (index.css)
         │    ├─► Custom animations
         │    ├─► Scrollbar styles
         │    └─► Theme variables
         │
         ├──► Component Styles
         │    ├─► className props
         │    ├─► cn() utility for merging
         │    └─► Conditional classes
         │
         └──► Variants (CVA)
              ├─► Button variants
              ├─► Badge variants
              └─► Size variations
```

## Development Workflow

```
1. User Action
   └─► Click/Type/Interact

2. Event Handler
   └─► onClick/onChange

3. Store Action
   └─► updateSection()

4. State Update
   └─► Zustand updates state

5. Component Re-render
   └─► React detects changes

6. UI Update
   └─► DOM updates

7. Preview Refresh
   └─► generateHTML() → iframe.write()
```

---

This modular architecture ensures:
- ✅ Separation of concerns
- ✅ Easy testing
- ✅ Scalability
- ✅ Maintainability
- ✅ Code reusability
