# 🚀 Quick Start Guide - MailForge

## Getting Started in 5 Minutes

### Step 1: Verify Installation

Make sure all dependencies are installed:

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 3: Explore the Dashboard

You'll see two pre-built templates:
- **Welcome Email** - Employee onboarding template
- **Product Launch** - Marketing campaign template

Click on any template to open the editor.

### Step 4: Create Your First Template

1. Click **"Create New"** button
2. You'll be taken to the editor with a blank canvas

### Step 5: Add Your First Block

In the left sidebar, click on any block type:
- **Header** - For titles and subtitles
- **Text** - For paragraph content
- **Image** - For photos
- **Button** - For CTAs
- **Spacer** - For spacing
- **Footer** - For copyright info

### Step 6: Customize the Block

1. Click on the block in the "Layers" list
2. The Properties panel will open
3. Edit content, colors, padding, alignment, etc.
4. See changes in real-time in the preview!

### Step 7: Reorder Blocks

Use the up/down arrows in the Layers list to reorder blocks.

### Step 8: Test with Mock Data

Click **"Show Data"** in the top-right to see how template variables render:
- `{{name}}` → Soham
- `{{company}}` → Sony Info Tech
- `{{year}}` → Current year

### Step 9: Save Your Template

Click the **"Save"** button. The status indicator will turn green.

### Step 10: Return to Dashboard

Click the mail icon in the left sidebar to return to the dashboard.

## 🎯 Common Tasks

### Change Template Name
Click on the template name in the editor header and type a new name.

### Delete a Block
Hover over a block in the Layers list and click the trash icon.

### Change Block Colors
1. Select the block
2. In Properties panel → Appearance
3. Click color picker to choose new colors

### Add HTML to Text Block
1. Add a Text block
2. In the content textarea, use HTML tags:
   ```html
   Hi {{name}},<br><br>
   Welcome to <strong>{{company}}</strong>!
   ```

### Make Button Full Width
1. Select button block
2. Properties → Appearance → Width Mode
3. Click "Full"

## 🔧 Keyboard Tips

- **Tab**: Navigate between fields
- **Esc**: Deselect block
- **Enter**: Confirm input

## 📱 Testing Responsiveness

The preview shows how the email will look on desktop. Email templates are automatically responsive with max-width of 600px.

## 🎨 Design Tips

1. **Consistent Padding**: Use Medium (20px) padding for most blocks
2. **Color Contrast**: Ensure text is readable on backgrounds
3. **Button Placement**: Center buttons for better engagement
4. **Spacing**: Add Spacer blocks between sections
5. **Footer**: Always include a footer with company info

## 🐛 Troubleshooting

### Preview not showing?
- Check browser console for errors
- Refresh the page
- Ensure blocks have valid data

### Colors not showing?
- Make sure you've selected a color in the color picker
- Check if the hex value is valid

### Changes not saving?
- Look for the amber "Unsaved changes" indicator
- Click the "Save" button explicitly

## 📚 Next Steps

Once you're comfortable:
1. Read [COMPONENT_DOCS.md](./COMPONENT_DOCS.md) for advanced usage
2. Explore [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) to understand the architecture
3. Check the codebase to see how everything works

## 🆘 Need Help?

- Check the browser console for errors
- Review the component documentation
- Look at the existing template examples for reference

---

Happy building! 🎉
