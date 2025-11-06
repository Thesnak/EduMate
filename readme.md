# EduMate

<p align="center">
  <img src="build/logo.png" alt="EduMate Logo" width="200">
</p>

Your Study Mate — a lightweight local learning library and player built with Electron.

## What is EduMate?

EduMate helps you collect and organize courses and PDFs, play video lectures with subtitles (and optional translation), track progress, and build a bookshelf of documents.

## Features

- Course library with specializations (learning paths)
- Visual roadmap for specializations
- Video player with subtitle support, playback speed control, and auto-translate fallback
- PDF viewer for course materials and books
- Bookshelf to manage PDFs with optional covers
- Book categories and editing (add/edit/delete book metadata and categories)
- Local-only storage (data saved in localStorage)

## Quick start

Requirements:

- Node.js (16+) installed
- Windows / macOS / Linux (Electron app)

Run locally:

```powershell
# from project root
npm install
npm start
```

This will launch the Electron app.

## Adding Courses

1. Open `Courses` → `+ Add Course`.
2. Enter a course name and click `Browse Directory` to select the folder containing course content (videos, PDFs, subtitles).
3. Optionally assign the course to a Specialization.

Notes:
- Courses are scanned for a structure of modules/items. If scanning fails, check the app developer console (DevTools) for diagnostic logs.

## Creating Specializations

1. Click `+ Add Specialization` and give it a name.
2. Add existing courses to the specialization or create new ones within it.
3. Use the roadmap view to reorder courses and start the specialization.

## Books (PDFs)

Add a book: `Books` → `+ Add Book` → provide Title and select a PDF file. Optionally set a cover image and choose a Category.

Edit a book: On the bookshelf, click `Edit` to change title/path/cover/category.

Manage categories: `Books` → `Manage Categories` to add or delete categories. Deleting a category will unassign it from all books.

## Player & Subtitles

- Open a course and select a video from the sidebar.
- If subtitles are available, choose them in the subtitle selector.
- Auto-translate: If enabled, the app will attempt to translate subtitles. Translation uses an in-app bridge when provided; otherwise a public Translate endpoint fallback is used.

## Troubleshooting

- "Error scanning" when opening a course or specialization:
  - Ensure the course path is valid and accessible.
  - Check file permissions for the directory.
  - Open DevTools inside the app (press F12) and review the console logs for `scanDirectory` errors.

- File picker doesn't open:
  - In some environments, the app falls back to hidden file inputs. If the native file dialog isn't available, use the hidden input triggered by the UI.

- Corrupted library data (JSON parse error):
  - The app attempts to reset on parse failure. You can manually clear saved data by opening DevTools and running:

```javascript
localStorage.removeItem('course-library');
localStorage.removeItem('course-progress');
location.reload();
```

## Developer notes

- Translation: the app previously attempted to use `@vitalets/google-translate-api`. That integration was removed from the preload due to runtime issues; the renderer will try a preload-provided `electronAPI.translate()` if present, otherwise a fetch fallback is used.
- Preload API methods exposed to the renderer are (see `preload.js`):
  - `selectDirectory()`
  - `selectFile(options)`
  - `scanDirectory(path)`
  - `getFileUrl(path)`
  - `readSubtitle(path)`

If you want to enable a native translation implementation, implement an IPC handler in the main process that uses `@vitalets/google-translate-api` and expose it via `ipcRenderer.invoke('translate', text)` in the preload.

## Credits

Author: Mohamed Mahmoud Ali — Big Data & AI Engineer

Project started as a personal study tool. Contributions and improvements welcome.

## License

This project is provided as-is. Choose a license appropriate for your use.
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
