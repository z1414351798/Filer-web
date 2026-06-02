# Filer Web

React frontend for the Filer file-transformation studio.

## Tech Stack

- **React 18** + React Router v6
- **Vite** (dev server + bundler)
- **Tailwind CSS** (utility-first styling, dark theme)
- **Framer Motion** (animations)
- **react-dropzone** (drag-and-drop upload)
- **Axios** (HTTP client with upload progress)
- **react-hot-toast** (notifications)
- **lucide-react** (icons)

## Quick Start

```bash
npm install
npm run dev       # starts on http://localhost:3000
npm run build     # production build → dist/
```

Requires the backend running on `http://localhost:8080` (Vite proxies `/api/*` automatically).

## Features (mirrors the backend)

| Category | Operations |
|---|---|
| **Image** | Convert to JPG/PNG/WEBP/BMP/GIF, Resize, Compress, Rotate, Flip, Grayscale, Watermark |
| **PDF** | Merge, Split, PDF→Images, Images→PDF, Extract Text, Encrypt, Decrypt |
| **OCR** | Scan text from images or scanned PDFs (8 languages) |
| **Office** | Excel→CSV, CSV→Excel, Word→Text |
| **Archive** | Create ZIP, Extract ZIP |

## UI Flow

```
1. Drag & drop (or click) to upload a file up to 200 MB
2. Pick an operation from the accordion panel
3. Fill in any options (resize dimensions, quality, password, …)
4. Click “Start Conversion”
5. Watch the live progress bar → download the result
6. All past jobs visible on the History page
```

## Project Structure

```
src/
  api/
    filerApi.js          # Axios wrappers + pollJob helper
  components/
    Header.jsx           # Sticky nav
    UploadZone.jsx       # Drag-drop upload with progress
    ConversionForm.jsx   # Dynamic options form per operation type
    JobTracker.jsx       # Live progress + download button
  pages/
    HomePage.jsx         # Main conversion workspace
    HistoryPage.jsx      # All past jobs table
  App.jsx
  main.jsx
  index.css
```
