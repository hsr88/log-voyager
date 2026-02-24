# Log Voyager - Agent Documentation

## Project Overview

**Log Voyager** is a client-side log file analyzer designed for DevOps and Backend Developers. It allows users to analyze gigabyte-sized log files (10GB+) directly in the browser without crashing the device. The application uses a "streaming" approach similar to video streaming services - it reads files in small 50KB chunks rather than loading the entire file into memory.

**Key Value Propositions:**
- 100% client-side processing - files never leave the device
- Works offline (PWA support)
- Supports files larger than available RAM
- Zero installation required (web-based)
- Also available as Android app via Capacitor

## Technology Stack

### Core Technologies
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.3.0
- **Styling**: Tailwind CSS v4.0
- **UI Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useRef, useMemo)

### Mobile Development
- **Platform**: Capacitor 6.0 (@capacitor/core, @capacitor/android)
- **App ID**: `cc.logvoyager.app`

### PWA Support
- **Plugin**: vite-plugin-pwa
- **Features**: Auto-update, offline caching, standalone display mode
- **Cache Strategy**: Workbox caches all static assets (JS, CSS, HTML, images)

## Project Structure

```
log-voyager/
├── src/
│   ├── components/
│   │   ├── LogLine.tsx       # Individual log line rendering with syntax highlighting
│   │   ├── Minimap.tsx       # Visual file overview with bookmarks/errors
│   │   └── Modals.tsx        # Settings, Info, and Paste modals
│   ├── utils/
│   │   ├── helpers.ts        # formatBytes, getLogLevel utilities
│   │   └── decompression.ts  # GZIP decompression support
│   ├── types.ts              # TypeScript interfaces (BookmarkData, HistoryItem)
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # React entry point
│   ├── index.css             # Tailwind import
│   └── App.css               # (if needed for additional styles)
├── android/                  # Capacitor Android project
├── public/                   # Static assets (icons, manifest)
├── dist/                     # Build output (Vite)
├── index.html                # HTML entry point
├── vite.config.ts            # Vite + PWA configuration
├── capacitor.config.ts       # Capacitor mobile configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS with Tailwind v4
├── eslint.config.js          # ESLint configuration
├── tsconfig.*.json           # TypeScript configurations
├── Dockerfile                # Docker deployment config
└── package.json              # Dependencies and scripts
```

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Deployment Options

### 1. Docker Deployment
```bash
# Build Docker image
docker build -t log-voyager .

# Run container
docker run -d -p 8080:80 --name my-logs log-voyager

# Access at http://localhost:8080
```

### 2. Android App (Capacitor)
```bash
# Build web app first
npm run build

# Sync with Capacitor
npx cap sync android

# Open Android Studio
npx cap open android

# Or run directly
npx cap run android
```

### 3. Static Hosting
The `dist/` folder contains static files ready for deployment to any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

## Code Architecture

### Core Data Flow
1. **File Loading**: Files are read using `FileReader` with `slice()` API in 50KB chunks (`CHUNK_SIZE`)
2. **State Management**: React hooks manage file state, bookmarks, search, and UI state
3. **Chunk Navigation**: Slider controls percentage through file, triggering new chunk reads
4. **Search**: Performed on currently loaded chunk with regex and case-sensitivity options

### Key Components

#### App.tsx
- Main container managing all application state
- Handles file input (upload, clipboard paste)
- Manages chunk reading and navigation
- Coordinates search, bookmarks, and settings

#### LogLine.tsx
- Renders individual log lines
- Syntax highlighting for log levels (error=red, warn=orange, info=blue)
- Search term highlighting with regex support
- JSON detection and pretty-print toggle
- Bookmark toggle on line number click

#### Minimap.tsx
- Visual representation of current chunk
- Shows error (red), warning (orange), info (blue), and bookmark (magenta) indicators
- 2px bars for each line in chunk

#### Modals.tsx
- `SettingsModal`: Font size and line wrapping options
- `InfoModal`: About/FAQ with project information
- `PasteModal`: Fallback for clipboard paste when browser blocks auto-paste

### Utility Functions

#### helpers.ts
- `formatBytes()`: Convert bytes to human-readable format (B, KB, MB, GB)
- `getLogLevel()`: Detect log level from line content (error, warn, info)

#### decompression.ts
- `isGzip()`: Detect GZIP files by extension or magic bytes (0x1f 0x8b)
- `decompressGzip()`: Decompress using browser's DecompressionStream API

### TypeScript Types

```typescript
// types.ts
interface BookmarkData {
  lineNum: number;
  content: string;
  chunkOffset: number;  // Byte offset for "warp" navigation
}

interface HistoryItem {
  name: string;
  size: string;
  date: string;
}
```

## Key Features Implementation

### 1. Large File Handling
- **Chunk Size**: 50KB (`CHUNK_SIZE = 50 * 1024`)
- **Reading**: Uses `File.prototype.slice()` and `FileReader`
- **Performance**: Constant memory usage regardless of file size

### 2. Search Functionality
- Case-sensitive toggle
- Regex support with validation
- Navigation: Next/Previous match buttons
- History: Last 10 search terms saved to localStorage

### 3. Bookmarks ("Warp Jump")
- Click line number to toggle bookmark
- Saves line number, content preview, and byte offset
- Allows instant navigation between file positions
- Visual indicator in minimap (magenta)

### 4. JSON Prettifier
- Auto-detects JSON objects in log lines
- "JSON/RAW" toggle button
- Formatted display with syntax highlighting

### 5. GZIP Support
- Detects `.gz` extension or magic bytes
- Decompresses entire file to memory (note: large compressed files may hit memory limits)
- Uses native browser DecompressionStream API

## Data Persistence

### localStorage Keys
- `log_history_v2`: Recent file history (max 5 items)
- `search_history`: Recent search terms (max 10 items)

## Styling Conventions

### Color Scheme
- **Background**: `#050505` (near black)
- **Primary Accent**: `#00f3ff` (cyan)
- **Bookmark Accent**: `#ff00ff` (magenta)
- **Log Levels**:
  - Error: Red (`red-500`)
  - Warning: Orange (`orange-400`)
  - Info: Blue (`blue-500`)

### Typography
- **Font**: JetBrains Mono (monospace)
- **Sizes**: xs (10px), sm, base - configurable in settings

### CSS Classes
- `.font-jetbrains`: Monospace font family
- `.tech-grid`: Background grid pattern
- `.glass-panel`: Frosted glass effect with backdrop blur
- `.neon-text`: Cyan glow text effect
- `.animate-flash`: Highlight animation for navigation

## Development Guidelines

### Code Style
- **Language**: English for code, Polish comments occasionally present
- **Formatting**: Default ESLint/TypeScript rules
- **Strict Mode**: TypeScript strict mode enabled
- **Imports**: ES modules with explicit extensions

### Adding New Features
1. Components go in `src/components/`
2. Utilities go in `src/utils/`
3. Types go in `src/types.ts`
4. Update main App.tsx to integrate

### Mobile Considerations
- Touch-friendly targets (min 44px)
- Responsive design with Tailwind
- Capacitor plugins for native features
- Keyboard handling configured in `capacitor.config.ts`

## Security Considerations

1. **Client-Side Only**: No file upload to servers
2. **Clipboard Access**: Uses `navigator.clipboard` with fallback modal
3. **File Processing**: All processing in browser sandbox
4. **No External Dependencies for Core**: Only dev/build dependencies

## Performance Notes

1. **Chunk Loading**: 50KB provides good balance of performance and usability
2. **Memory Usage**: Constant ~10MB regardless of file size (for non-GZIP)
3. **Rendering**: React handles list virtualization implicitly via chunk size
4. **Search**: Synchronous on current chunk only - no full-file search

## Known Limitations

1. **GZIP Files**: Entire file decompressed to memory (not chunked)
2. **Search Scope**: Only searches current 50KB chunk, not entire file
3. **String Length**: JavaScript string limits (~512MB-1GB) may apply for decompressed GZIP
4. **Browser Support**: Requires modern browser with DecompressionStream API for GZIP

## Testing

Currently, there is no automated testing framework configured. Testing is manual:

1. **Development**: `npm run dev` for local testing
2. **Mobile**: Use Android Studio with Capacitor
3. **Production**: Build and test with various log file sizes

## Future Enhancements

Potential areas for contribution:
- Full-text search across entire file (Web Worker + IndexedDB)
- Log filtering/exclusion patterns
- Export filtered results
- Dark/light theme toggle
- Additional log format parsers
- Unit tests with Vitest/Jest
