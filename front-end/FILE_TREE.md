# 🌳 Complete File Tree - MailForge

## Full Project Structure

```
TemplateHub/
└── front-end/
    │
    ├── 📄 Documentation (7 files)
    │   ├── README.md                    # Main project overview
    │   ├── DOCS_INDEX.md               # Documentation navigation
    │   ├── QUICKSTART.md               # Beginner tutorial
    │   ├── CHEATSHEET.md               # Quick reference
    │   ├── PROJECT_STRUCTURE.md        # Architecture overview
    │   ├── COMPONENT_DOCS.md           # API documentation
    │   ├── ARCHITECTURE.md             # Visual diagrams
    │   └── PROJECT_SUMMARY.md          # Complete summary
    │
    ├── 📦 Configuration (5 files)
    │   ├── package.json                # Dependencies & scripts
    │   ├── package-lock.json           # Lock file
    │   ├── vite.config.js              # Vite configuration
    │   ├── tailwind.config.js          # Tailwind configuration
    │   └── eslint.config.js            # ESLint rules
    │
    ├── 🌐 Entry Points (2 files)
    │   ├── index.html                  # HTML entry
    │   └── src/main.jsx                # JavaScript entry
    │
    ├── 📁 public/                      # Static assets
    │   └── (assets if any)
    │
    └── 📁 src/                         # Source code
        │
        ├── App.jsx                     # Main app component
        ├── App.css                     # App-specific styles
        ├── index.css                   # Global styles + Tailwind
        │
        ├── 📁 components/              # All React components
        │   │
        │   ├── 📁 ui/                  # Reusable UI components (8)
        │   │   ├── button.jsx          # Button with variants
        │   │   ├── input.jsx           # Text input
        │   │   ├── label.jsx           # Form label
        │   │   ├── textarea.jsx        # Multi-line input
        │   │   ├── select.jsx          # Dropdown select
        │   │   ├── card.jsx            # Container card
        │   │   ├── badge.jsx           # Status badge
        │   │   ├── separator.jsx       # Divider line
        │   │   └── index.js            # Barrel export
        │   │
        │   └── 📁 features/            # Feature components (8)
        │       ├── Dashboard.jsx       # Template gallery
        │       ├── Editor.jsx          # Main editor layout
        │       ├── EditorSidebar.jsx   # Left navigation
        │       ├── EditorHeader.jsx    # Top bar with save
        │       ├── EmailPreview.jsx    # Live iframe preview
        │       ├── BlockPalette.jsx    # Block type selector
        │       ├── LayersList.jsx      # Section manager
        │       ├── PropertiesPanel.jsx # Block property editor
        │       └── index.js            # Barrel export
        │
        ├── 📁 store/                   # State management (1)
        │   └── useTemplateStore.js     # Zustand store
        │
        ├── 📁 lib/                     # Utilities (2)
        │   ├── utils.js                # cn() utility
        │   └── email-generator.js      # HTML generator
        │
        ├── 📁 constants/               # Constants (2)
        │   ├── block-types.js          # Block type constants
        │   └── templates.js            # Initial templates
        │
        ├── 📁 hooks/                   # Custom hooks (empty)
        │   └── (future custom hooks)
        │
        └── 📁 assets/                  # Assets
            └── (images, fonts, etc.)
```

## File Count Summary

```
Total Files Created: 35+

Documentation:       8 files
Configuration:       5 files
UI Components:       9 files (8 + index)
Feature Components:  9 files (8 + index)
Store:              1 file
Utilities:          2 files
Constants:          2 files
Entry/App:          4 files
```

## By Directory

```
front-end/
├── root/           15 files (docs + config + entry)
└── src/
    ├── root/        3 files (App.jsx, App.css, index.css)
    ├── components/
    │   ├── ui/      9 files
    │   └── features/ 9 files
    ├── store/       1 file
    ├── lib/         2 files
    ├── constants/   2 files
    ├── hooks/       0 files (ready for custom hooks)
    └── assets/      (varies)
```

## Component Dependencies

```
App.jsx
├── imports Dashboard (from features)
└── imports Editor (from features)

Dashboard
├── imports { Button, Card, Badge } (from ui)
└── imports useTemplateStore (from store)

Editor
├── imports EditorSidebar (from features)
├── imports BlockPalette (from features)
├── imports LayersList (from features)
├── imports PropertiesPanel (from features)
├── imports EditorHeader (from features)
├── imports EmailPreview (from features)
└── imports useTemplateStore (from store)

EmailPreview
├── imports { Card } (from ui)
└── imports generateHTML (from lib)

PropertiesPanel
├── imports { Button, Input, Label, Textarea, Select, Separator } (from ui)
├── imports useTemplateStore (from store)
└── imports { BLOCK_TYPES } (from constants)
```

## Import Paths

```javascript
// From root of src/

// UI Components
'./components/ui'
'./components/ui/button'
'./components/ui/input'
// etc.

// Feature Components
'./components/features'
'./components/features/Dashboard'
'./components/features/Editor'
// etc.

// Store
'./store/useTemplateStore'

// Utilities
'./lib/utils'
'./lib/email-generator'

// Constants
'./constants/block-types'
'./constants/templates'

// Hooks (future)
'./hooks/useCustomHook'
```

## File Sizes (Approximate)

```
Large Files (200+ lines):
- PropertiesPanel.jsx      ~300 lines
- useTemplateStore.js      ~170 lines
- email-generator.js       ~100 lines
- templates.js             ~90 lines

Medium Files (50-200 lines):
- Editor.jsx               ~60 lines
- EditorHeader.jsx         ~80 lines
- Dashboard.jsx            ~70 lines
- BlockPalette.jsx         ~90 lines
- LayersList.jsx           ~90 lines

Small Files (<50 lines):
- All UI components        ~20-50 lines each
- utils.js                 ~10 lines
- block-types.js           ~10 lines
- App.jsx                  ~20 lines
```

## Lines of Code

```
Category          Files    Lines (approx)
─────────────────────────────────────────
UI Components      8       ~300
Feature Components 8       ~800
Store             1       ~170
Utilities         2       ~110
Constants         2       ~100
App/Entry         3       ~40
─────────────────────────────────────────
Total Code       24      ~1,520 lines

Documentation     8      ~3,000 lines
Configuration     5       ~100 lines
─────────────────────────────────────────
Grand Total      37      ~4,620 lines
```

## File Types

```
JavaScript/JSX:  24 files (.js, .jsx)
CSS:             2 files (.css)
Markdown:        8 files (.md)
JSON:            2 files (.json)
HTML:            1 file (.html)
Config:          2 files (.js)
─────────────────────────────
Total:           39 files
```

## Component Hierarchy (Visual)

```
┌──────────────────────────────────────┐
│              App.jsx                  │
└──────────────────┬───────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
┌─────────────────┐  ┌──────────────────────────┐
│   Dashboard     │  │        Editor            │
└─────────────────┘  └───────────┬──────────────┘
         │                       │
         │           ┌───────────┼───────────┬──────────┐
         │           │           │           │          │
         ▼           ▼           ▼           ▼          ▼
    ┌────────┐  ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────┐
    │ Card   │  │Sidebar │ │ Block  │ │ Layers  │ │Props │
    │ Badge  │  │        │ │Palette │ │ List    │ │Panel │
    └────────┘  └────────┘ └────────┘ └─────────┘ └──────┘
                                │
                                ▼
                         ┌────────────┐
                         │   Header   │
                         │   Preview  │
                         └────────────┘
```

## Store Connection Map

```
Components using store:
├── App.jsx (view)
├── Dashboard.jsx (templates, setActiveId, setView, createNewTemplate)
├── Editor.jsx (editorTab, getActiveTemplate, showMockData)
├── EditorSidebar.jsx (editorTab, setEditorTab, setView)
├── EditorHeader.jsx (getActiveTemplate, updateTemplateInfo, isSaved, saveTemplate, showMockData, toggleMockData)
├── BlockPalette.jsx (addSection)
├── LayersList.jsx (getActiveTemplate, selectedSectionId, setSelectedSectionId, setEditorTab, deleteSection, moveSection)
└── PropertiesPanel.jsx (getActiveSection, setSelectedSectionId, updateSection)
```

## Documentation Map

```
For Beginners:
└── README.md → QUICKSTART.md → CHEATSHEET.md

For Developers:
└── PROJECT_STRUCTURE.md → COMPONENT_DOCS.md → CHEATSHEET.md

For Architects:
└── ARCHITECTURE.md → PROJECT_SUMMARY.md → COMPONENT_DOCS.md

Navigation:
└── DOCS_INDEX.md (master index)
```

## Future Expansion Points

```
Ready for:
├── src/hooks/          # Add custom hooks
├── src/types/          # Add TypeScript types
├── src/tests/          # Add unit tests
├── src/utils/          # Add more utilities
├── src/services/       # Add API services
├── src/contexts/       # Add React contexts
└── src/assets/         # Add static assets
```

---

**Legend:**
- 📄 Documentation files
- 📦 Configuration files
- 🌐 Entry point files
- 📁 Directories
- .jsx React components
- .js JavaScript modules
- .css Stylesheets
- .md Markdown docs

**Total Project Size**: ~5,000 lines across 39 files
**Last Updated**: February 2026
