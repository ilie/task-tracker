# 📘 Markdown Task Tracker

A powerful **Vue 3 + TailwindCSS** web app that transforms Markdown content into an interactive task management system with real-time tracking, filtering, and progress visualization.

The project was **created mostly by AI Claude Code** to speed up development and experimentation.

---

## 🚀 Overview

Markdown Task Tracker parses Markdown content and turns it into a complete task management interface with:

- **Live Markdown editor** with drag-and-drop support
- **Interactive task sidebar** with real-time completion tracking
- **Advanced search & filtering** by status, section, and keywords
- **Progress visualization** with statistics and completion metrics
- **Export functionality** for Markdown, JSON, and CSV formats
- **Theme customization** with light, dark, and system modes
- **Local storage persistence** to save your work automatically

Perfect for personal task lists, project planning, documentation tracking, or any structured Markdown workflow.

---

## ✨ Features

### 📝 Markdown Input & Parsing

- **Drag-and-drop** or paste Markdown content directly into the editor
- **Auto-parsing** of `- [ ]` and `- [x]` task checkboxes
- **Multi-section support** with collapsible sections
- **Live rendering** of formatted Markdown with syntax highlighting
- **Persistent storage** automatically saves your work to browser localStorage

### ✅ Interactive Task Management

- **Real-time task tracking** in a responsive sidebar
- **Click-to-toggle** task completion with instant UI updates
- **Progress indicators** showing completion percentage per section
- **Section collapsing** to focus on specific task groups
- **Task statistics** displaying total, completed, and pending counts

### 🔍 Advanced Search & Filtering

- **Keyword search** across all tasks with highlighting
- **Status filtering** (All, Completed, Pending)
- **Section filtering** to view tasks from specific sections only
- **Quick clear filters** to reset the view instantly
- **Keyboard shortcut** (Ctrl+K) for quick search access

### 📊 Export & Data Management

- **Multiple export formats**: Markdown, JSON, CSV
- **Preserve task state** when exporting data
- **Clear progress** option to reset task completion
- **Clear all** functionality to start fresh

### 🎨 Modern UI/UX

- **Responsive design** that works on desktop, tablet, and mobile
- **Theme switcher** with light, dark, and system preference modes
- **Smooth animations** and transitions throughout
- **Resizable sidebar** with drag-to-resize functionality
- **Custom scrollbars** styled for both light and dark modes
- **Accessible** with proper ARIA labels and keyboard navigation

---

## 🛠️ Tech Stack

- **Vue 3** (Composition API with `<script setup>`)
- **TailwindCSS v4** for styling
- **Vite** for lightning-fast development and builds
- **Marked** library for Markdown parsing and rendering
- **Lucide Vue** for beautiful, consistent icons
- **Composables** for reusable logic (theme, localStorage, filtering, etc.)

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ilie/task-tracker.git
cd task-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for production

```bash
npm run build
```

---

## 🎯 Usage

1. **Enter or paste** your Markdown content into the text area
2. **Click "Load Markdown"** to parse and render your tasks
3. **Use the sidebar** to view and check off tasks as you complete them
4. **Search and filter** to focus on specific tasks or sections
5. **Toggle the theme** using the icon button in the header
6. **Export your data** in your preferred format (Markdown, JSON, or CSV)
7. **Everything auto-saves** to localStorage, so your work is always preserved

---

## 🎨 Features in Detail

### Theme Switcher
Click the theme icon in the top-right to cycle through:
- ☀️ **Light mode** - Clean, bright interface
- 🌙 **Dark mode** - Easy on the eyes
- 💻 **System mode** - Matches your OS preference

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Focus search bar
- `Ctrl/Cmd + E` - Open export menu (mobile)

### Markdown Format
The app recognizes standard Markdown task syntax:
```markdown
# Section Name

- [ ] Incomplete task
- [x] Completed task
- [ ] Another pending task

## Subsection

- [ ] Nested tasks work too
```

---

## 🤝 Contributing

This project was built with AI assistance. Feel free to fork, modify, and submit pull requests!

---

## 📄 License

MIT License - feel free to use this project however you'd like.
