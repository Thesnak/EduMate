# EduMate - Your Study Mate

A powerful desktop learning management system that helps you organize and consume educational content efficiently. Built with Electron for a seamless desktop experience, EduMate supports course libraries, specializations, a digital bookshelf, and an advanced video player with smart subtitle features.

![EduMate Logo](assets/logo.png)

---

## Key Features

### 📚 Course Library Management
- Organize courses into specializations
- Create custom learning paths with reorderable courses
- Track progress for each course
- Visual roadmap with numbered progression

### 🎥 Smart Video Player
- Built-in video player with subtitle support
- Adjustable playback speed (0.25x - 2x)
- Automatic Arabic subtitle translation with caching
- Smart subtitle sync and overlay
- Keyboard shortcuts for playback control

### 📖 Digital Bookshelf
- Organize PDF materials in a beautiful shelf layout
- Support for custom book covers
- Built-in PDF viewer
- Quick access to your reading materials

### 🎯 Progress Tracking
- Mark lectures and materials as complete
- Track progress across all courses
- Visual progress indicators
- Persistent progress saving (stays on your machine)

### 🌙 Dark Mode & UI
- Eye-friendly dark theme
- Clean, modern interface
- Responsive layout
- Intuitive navigation

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Quick Installation

1. Clone and enter the repository:
```powershell
git clone [repository-url]
cd edumate
```

2. Install dependencies:
```powershell
npm install
```

3. Start EduMate:
```powershell
npm start
```

### Building from Source
```powershell
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

---

## How to use

- Open the app and use the header buttons to navigate: Home, Courses, Books, About.
- To add a book (PDF):
  1. Click `Books` → `+ Add Book`.
  2. Enter a title.
  3. Click `Browse PDF File` and select a PDF file.
  4. Optionally click `Browse Cover Image` to select a cover image.
  5. Click `Add`.
- To add a course (folder):
  1. Click `Courses` → `+ Add Course`.
  2. Provide name and select a directory (this scans subfolders for modules and supported files).

Notes:
- For Books, the UI prefers the native Electron file dialog. If the native dialog isn't available, the app falls back to a hidden file input.
- If a book has a cover image, the cover will be used. Otherwise a colored tile shows the title.

---

## Subtitles and Auto-Translate

- When playing a video, select a subtitle track from the Subtitles dropdown.
- Check `Auto-translate to Arabic` to translate the subtitle text. Translations are cached locally during the session.

Caveat: The auto-translate feature uses a public translate endpoint and may be rate-limited or change behavior; consider adding your own translation API key or service for production use.

---

## Development Guide

### Project Structure
```
edumate/
├── assets/          # Images and icons
├── main.js         # Main process (window, IPC)
├── preload.js      # Preload script (API bridge)
├── index.html      # Renderer (UI, logic)
└── package.json    # Dependencies and scripts
```

### Tech Stack
- Electron for cross-platform desktop app
- HTML/CSS/JavaScript for UI
- Node.js for backend operations
- Local Storage for data persistence

## Troubleshooting

### Common Issues

If the Add Book -> Browse PDF button doesn't respond:

1. Open DevTools (View → Toggle Developer Tools or `Ctrl+Shift+I`)
2. Check the Console for diagnostic logs:
   - `[Renderer] index.html script loaded` — confirms renderer script runs
   - `[AddBook] showAddBookModal:` — modal opened
   - `[AddBook] browseBookFile() called` — browse PDF clicked
   - `[AddBook] using electronAPI.selectFile for PDF` — using native dialog
   - `[AddBook] electronAPI.selectFile returned:` — native dialog returned a path
   - `[AddBook] fallback to hidden input available? true` — fallback used
   - `[AddBook] onBookFileInputChange file:` — hidden input fired
   - `[AddBook] addBook() called` — Add button clicked

If the Console shows an error like "Cannot read properties (reading 'push')" while adding a book, run the following in the Console to clear a potentially corrupted saved library, then restart the app:

```javascript
window.localStorage.removeItem('course-library');
window.location.reload();
```

If the hidden file input returns a File object with no `.path` property (some environments do not expose filesystem paths to the renderer), the app sets the display to the file name. For reliable behavior, use the app's native dialog.

If you see an IPC error (e.g., `select-file is not a function`), ensure `preload.js` exposes `selectFile` and `main.js` registers the `select-file` handler. The project already includes `preload.js` and `main.js` with these handlers; if you edited them, restore the original wiring.

---

## Data Management

### Resetting the Library
To start fresh (safe during development):
```javascript
window.localStorage.removeItem('course-library');
window.localStorage.removeItem('course-progress');
window.location.reload();
```

### Data Location
All data is stored locally in your browser's localStorage:
- `course-library`: Courses, specializations, and books
- `course-progress`: Learning progress and completion status

## Credits & Contact

Created by Mohamed Mahmoud Ali  
Big Data & AI Engineer

Connect on [LinkedIn](https://linkedin.com/in/mohamed-thesnak)

## License

[MIT License](LICENSE)

---

## Developer notes

- Main process handlers live in `main.js`. Exposed renderer helpers are in `preload.js` via `contextBridge` under `window.electronAPI`.
- Key exposed methods:
  - `selectDirectory()` — opens folder picker and returns path
  - `selectFile(options)` — opens file picker with provided filters and returns single path
  - `scanDirectory(path)` — scans course folders for supported files
  - `getFileUrl(path)` — returns `file://` URL for a given path
  - `readSubtitle(path)` — reads SRT/VTT text

- If you modify `preload.js` or `main.js`, restart the app to pick up changes.

---

## Author

Mohamed Mahmoud Ali — Big Data & AI Engineer
LinkedIn: https://linkedin.com/in/mohamed-thesnak

---

## License

This project is provided as-is for personal use and education. Add a license as needed.
