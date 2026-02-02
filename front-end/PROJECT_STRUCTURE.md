# MailForge - Email Template Builder

A modern, modular React application for building and customizing email templates with a drag-and-drop interface.

## 🏗️ Project Structure

```
front-end/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components (shadcn-style)
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── select.jsx
│   │   │   ├── card.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── separator.jsx
│   │   │   └── index.js
│   │   └── features/              # Feature-specific components
│   │       ├── Dashboard.jsx      # Template selection dashboard
│   │       ├── Editor.jsx         # Main editor layout
│   │       ├── EditorSidebar.jsx  # Editor navigation sidebar
│   │       ├── EditorHeader.jsx   # Editor top bar
│   │       ├── EmailPreview.jsx   # Live email preview
│   │       ├── BlockPalette.jsx   # Available block types
│   │       ├── LayersList.jsx     # Section layers manager
│   │       ├── PropertiesPanel.jsx # Block properties editor
│   │       └── index.js
│   ├── store/
│   │   └── useTemplateStore.js    # Zustand state management
│   ├── lib/
│   │   ├── utils.js               # Utility functions (cn)
│   │   └── email-generator.js     # HTML email generator
│   ├── constants/
│   │   ├── block-types.js         # Block type constants
│   │   └── templates.js           # Initial templates & mock data
│   ├── hooks/                     # Custom React hooks (future)
│   ├── App.jsx                    # Main app component
│   ├── App.css
│   ├── index.css                  # Global styles & Tailwind
│   └── main.jsx
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with components, store, and utilities
- **State Management**: Zustand for efficient, centralized state management
- **UI Components**: shadcn-inspired components with class-variance-authority
- **Live Preview**: Real-time email preview with iframe rendering
- **Drag & Reorder**: Move sections up/down with visual feedback
- **Template Variables**: Support for dynamic content with `{{variable}}` syntax
- **Block Types**:
  - Header (with title/subtitle)
  - Text (HTML content)
  - Image (with URL and alt text)
  - Button (with label and action URL)
  - Spacer (adjustable height)
  - Footer (copyright text)

## 📦 Dependencies

- **React**: UI framework
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **class-variance-authority**: Component variants
- **clsx & tailwind-merge**: Utility class merging
- **Vite**: Build tool

## 🛠️ Development

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## 🎨 Styling

This project uses Tailwind CSS with custom configurations:
- Custom color palette for consistency
- shadcn-style design system variables
- Custom animations (slide-in, fade-in, zoom-in)
- Custom scrollbar styling

## 📝 State Management

The app uses Zustand with the following state structure:

```javascript
{
  templates: [],           // Array of all templates
  activeId: string,        // Currently active template ID
  view: string,           // 'dashboard' | 'editor'
  isSaved: boolean,       // Save status
  editorTab: string,      // 'structure' | 'settings'
  selectedSectionId: string, // Currently selected block
  showMockData: boolean   // Toggle for mock data preview
}
```

## 🔧 Component Guidelines

### UI Components (`/components/ui`)
- Reusable, generic components
- Follow shadcn/ui patterns
- Use `forwardRef` for proper ref handling
- Utilize class-variance-authority for variants

### Feature Components (`/components/features`)
- Business logic components
- Connect to Zustand store
- Contain application-specific logic
- Can compose multiple UI components

## 📄 License

MIT

## 👨‍💻 Author

Soham - Sony Info Tech
