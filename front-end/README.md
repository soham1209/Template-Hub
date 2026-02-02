# ✉️ MailForge - Email Template Builder

A modern, feature-rich email template builder built with React, Zustand, and Tailwind CSS. Create stunning, responsive email templates with an intuitive drag-and-drop interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.3-blue.svg)
![Vite](https://img.shields.io/badge/vite-7.3-purple.svg)

## ✨ Features

- 🎨 **Visual Email Builder**: Intuitive drag-and-drop interface
- 🧩 **Modular Architecture**: Clean, scalable component structure
- 📦 **Zustand State Management**: Efficient, centralized state handling
- 🎭 **shadcn-style UI**: Beautiful, accessible components
- 🔄 **Live Preview**: Real-time email rendering
- 📱 **Responsive Design**: Mobile-first approach
- 🎯 **Template Variables**: Dynamic content with `{{variable}}` syntax
- 🎨 **Rich Block Types**: Header, Text, Image, Button, Spacer, Footer
- 💾 **Auto-save**: Track changes with save status
- 🔧 **Customizable**: Full control over styles and content

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Basic knowledge of React

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be running at [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
front-end/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── features/           # Feature components
│   ├── store/                  # Zustand store
│   ├── lib/                    # Utility functions
│   ├── constants/              # Constants and config
│   ├── hooks/                  # Custom React hooks
│   └── App.jsx                 # Main app component
├── public/                     # Static assets
└── [config files]
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed structure documentation.

## 📚 Documentation

**Start Here:**
- 📖 [Documentation Index](./DOCS_INDEX.md) - Navigate all documentation

**Essential Guides:**
- 🚀 [Quick Start Guide](./QUICKSTART.md) - Step-by-step tutorial for beginners
- 📋 [Cheat Sheet](./CHEATSHEET.md) - Quick reference for developers
- 🏗️ [Project Structure](./PROJECT_STRUCTURE.md) - Folder organization and architecture
- 📚 [Component Documentation](./COMPONENT_DOCS.md) - Detailed API and usage patterns
- 🎨 [Architecture Guide](./ARCHITECTURE.md) - Visual diagrams and system design
- 📊 [Project Summary](./PROJECT_SUMMARY.md) - Complete overview and metrics
- 🌳 [File Tree](./FILE_TREE.md) - Complete file structure visualization

## 🛠️ Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 7.3
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 🎯 Usage

### Creating a Template

1. Click "Create New" on the dashboard
2. Add blocks from the Block Palette
3. Customize block properties in the Settings panel
4. Preview your template in real-time
5. Save your template

### Block Types

| Block | Description |
|-------|-------------|
| **Header** | Title and subtitle with customizable colors |
| **Text** | Rich text content with HTML support |
| **Image** | Image with URL and alt text |
| **Button** | Call-to-action button with link |
| **Spacer** | Adjustable vertical spacing |
| **Footer** | Copyright and footer text |

### Template Variables

Use `{{variable}}` syntax for dynamic content:

```
Hi {{name}},
Welcome to {{company}}!
© {{year}} All rights reserved.
```

Available variables:
- `{{name}}` - User name
- `{{company}}` - Company name
- `{{role}}` - User role
- `{{email}}` - User email
- `{{year}}` - Current year

## 🎨 Customization

### Adding Custom Blocks

1. Define block type in `/src/constants/block-types.js`
2. Add to Block Palette in `/src/components/features/BlockPalette.jsx`
3. Implement rendering in `/src/lib/email-generator.js`
4. Add property controls in `/src/components/features/PropertiesPanel.jsx`

### Styling

The project uses Tailwind CSS with custom configuration. Modify `tailwind.config.js` to customize:
- Colors
- Spacing
- Border radius
- Animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Soham** - Sony Info Tech

## 🙏 Acknowledgments

- shadcn/ui for design inspiration
- Tailwind CSS team
- Zustand team
- React community

---

Made with ❤️ using React + Vite

