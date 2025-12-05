import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Search, UploadCloud, Zap, Bug, FileJson, 
  X, Bookmark, ArrowDown, ArrowUp, Eye, EyeOff, FileSearch, Trash2, MapPin, Menu, Shield, Cpu, HelpCircle, History, Clipboard, Check
} from 'lucide-react';

/**
 * LOG VIEWER - PRODUCTION BUILD (CDN FIX)
 * - Dodano automatyczne ładowanie Tailwind CDN.
 * - Naprawia to problem "braku stylów" na Vercel, gdy build CSS się nie powiedzie.
 */

const CHUNK_SIZE = 50 * 1024; // 50KB

// --- Styl CSS ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
  
  .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
  
  .tech-grid {
    background-color: #050505;
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  }
  
  .glass-panel {
    background: rgba(20, 20, 25, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }

  .neon-text {
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #050505; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #00f3ff; }
  
  @keyframes highlight-fade {
    0% { background-color: rgba(0, 243, 255, 0.3); }
    100% { background-color: transparent; }
  }
  .animate-flash { animation: highlight-fade 1.5s ease-out; }
`;

// --- Helpers ---
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getLogLevel = (line: string) => {
  const lower = line.toLowerCase();
  if (lower.includes('error') || lower.includes('fail') || lower.includes('fatal') || lower.includes('exception')) return 'error';
  if (lower.includes('warn')) return 'warn';
  if (lower.includes('info')) return 'info';
  return 'default';
};

// --- Typy ---
interface BookmarkData {
  lineNum: number;
  content: string;
  chunkOffset: number;
}

interface HistoryItem {
  name: string;
  size: string;
  date: string;
}

// --- Komponent: Info Modal ---
const InfoModal = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'faq'>('about');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-jetbrains">
      <div className="bg-[#0d1117] w-full max-w-md rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
          <h3 className="font-bold text-white tracking-wider flex items-center gap-2">
            <FileSearch size={18} className="text-[#00f3ff]" /> 
            LOG VIEWER <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">PRO</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 text-xs font-bold tracking-widest transition-colors ${activeTab === 'about' ? 'text-[#00f3ff] bg-[#00f3ff]/5 border-b-2 border-[#00f3ff]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            ABOUT
          </button>
          <button 
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-3 text-xs font-bold tracking-widest transition-colors ${activeTab === 'faq' ? 'text-[#ff00ff] bg-[#ff00ff]/5 border-b-2 border-[#ff00ff]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            FAQ
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Cpu size={16} className="text-[#00f3ff]" /> The Mission</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Log Viewer Pro is a specialized tool engineered for DevOps and Backend Developers who need to analyze massive log files (1GB+) on the go.
                  Standard mobile editors crash when opening gigabyte-sized files due to RAM limits. This tool solves that.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> Core Technology</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  We use <strong>File Slicing API</strong>. Instead of loading the entire file into memory, the application reads it in small, 50KB chunks—just like streaming a video. This allows you to open a 100GB log file on an old smartphone with zero latency.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Shield size={16} className="text-emerald-400" /> Privacy & Security</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  <strong>Local Execution Only.</strong> Your log files never leave your device. The application runs entirely within your browser's sandbox. No data is uploaded to any server. You can even use this app offline (Airplane Mode).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> Why not use Notepad?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Standard editors try to load the whole file into RAM. For a 2GB file, your device will likely freeze or crash. Log Viewer streams the file, using only ~10MB of RAM regardless of file size.
                </p>
              </div>
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> How do I format JSON?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The app automatically detects JSON objects within log lines. Look for the "JSON" button next to messy lines. Clicking it will pretty-print the object.
                </p>
              </div>
              <div className="border-b border-white/5 pb-4">
                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> What are Bookmarks?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click any line number to mark it. Since giant files are hard to navigate, bookmarks save the exact byte-offset position, allowing you to "warp" back to that location instantly later.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> Is it free?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yes, Log Viewer is a free, open-source tool for the developer community built by hsr88.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161b22] border-t border-white/10 text-center">
          <p className="text-[10px] text-slate-500 font-mono">v3.3.0 • Built by hsr88</p>
        </div>
      </div>
    </div>
  );
};

// --- Komponent: Paste Modal (Fallback) ---
const PasteModal = ({ onClose, onPaste }: { onClose: () => void, onPaste: (text: string) => void }) => {
  const [text, setText] = useState('');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-jetbrains">
      <div className="bg-[#0d1117] w-full max-w-lg rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[60vh]">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
          <h3 className="font-bold text-white tracking-wider flex items-center gap-2">
            <Clipboard size={18} className="text-[#00f3ff]" /> PASTE LOG
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 p-4 bg-[#050505]">
          <textarea 
            className="w-full h-full bg-[#111] text-slate-300 font-mono text-xs p-3 rounded border border-white/10 outline-none focus:border-[#00f3ff] resize-none placeholder-slate-600"
            placeholder="Browser blocked auto-paste. Please press Ctrl+V (or Cmd+V) here to paste your log content..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
        </div>
        <div className="p-4 bg-[#161b22] border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-bold px-4 py-2">CANCEL</button>
          <button 
            onClick={() => { if(text) onPaste(text); }}
            disabled={!text}
            className={`bg-[#00f3ff] hover:bg-[#00c2cc] text-black font-bold px-6 py-2 rounded text-xs transition-all flex items-center gap-2 ${!text && 'opacity-50 cursor-not-allowed'}`}
          >
            <Check size={14} /> ANALYZE
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Komponenty Wyświetlania ---
const Minimap = ({ lines, bookmarks, offset }: { lines: string[], bookmarks: Map<number, BookmarkData>, offset: number }) => (
  <div className="w-3 h-full bg-[#050505] border-l border-white/5 flex flex-col shrink-0 py-1 gap-[1px] overflow-hidden opacity-80">
    {lines.map((line, i) => {
      const globalIndex = Math.floor(offset / 50) + i;
      const level = getLogLevel(line);
      let color = 'bg-slate-800';
      if (bookmarks.has(globalIndex)) color = 'bg-[#ff00ff] shadow-[0_0_4px_#ff00ff] z-10'; 
      else if (level === 'error') color = 'bg-red-500';
      else if (level === 'warn') color = 'bg-orange-400';
      else if (level === 'info') color = 'bg-blue-500/30';
      return <div key={i} className={`h-[2px] w-full ${color}`} />;
    })}
  </div>
);

const LogLine = ({ content, number, highlight, isBookmarked, onToggleBookmark, id }: any) => {
  const level = getLogLevel(content);
  const [isExpanded, setIsExpanded] = useState(false);
  const jsonMatch = content.match(/(\{.*\})/);
  const renderContent = () => {
    if (!highlight) return <span className="text-slate-400">{content}</span>;
    const parts = content.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part: string, i: number) => part.toLowerCase() === highlight.toLowerCase() ? <span key={i} className="bg-[#00f3ff] text-black font-bold px-1 rounded-sm">{part}</span> : <span key={i} className="text-slate-400">{part}</span>);
  };
  const formatJson = () => { try { return JSON.stringify(JSON.parse(jsonMatch[0]), null, 2); } catch (e) { return null; } };
  
  let lineStyle = 'border-l-2 border-transparent hover:bg-white/5';
  let numStyle = 'text-slate-600 hover:text-[#00f3ff] cursor-pointer';
  if (level === 'error') { lineStyle = 'border-l-2 border-red-500 bg-red-500/5 hover:bg-red-500/10'; numStyle = 'text-red-500 font-bold cursor-pointer'; }
  else if (level === 'warn') { lineStyle = 'border-l-2 border-orange-400 bg-orange-400/5 hover:bg-orange-400/10'; numStyle = 'text-orange-400 cursor-pointer'; }
  if (isBookmarked) { lineStyle += ' bg-[#ff00ff]/10'; numStyle = 'text-[#ff00ff] font-bold cursor-pointer'; }

  return (
    <div id={id} className={`flex text-[11px] md:text-xs font-jetbrains leading-relaxed py-0.5 ${lineStyle} transition-colors group`}>
      <div className={`w-12 shrink-0 text-right pr-3 select-none flex justify-end gap-1 ${numStyle}`} onClick={() => onToggleBookmark(number, content)}>{isBookmarked && <Bookmark size={10} className="mt-0.5 fill-current" />}{number}</div>
      <div className="break-all flex-1 min-w-0">
        {renderContent()}
        {jsonMatch && (<div className="inline-block ml-2"><button onClick={() => setIsExpanded(!isExpanded)} className="text-[9px] uppercase font-bold text-[#00f3ff] hover:text-white border border-[#00f3ff]/30 px-1.5 rounded hover:bg-[#00f3ff]/20 transition-all">{isExpanded ? 'RAW' : 'JSON'}</button></div>)}
        {isExpanded && <pre className="mt-2 p-3 bg-black/80 rounded border border-white/10 text-[#00f3ff] overflow-x-auto shadow-2xl">{formatJson() || "Invalid JSON"}</pre>}
      </div>
    </div>
  );
};

// --- GŁÓWNA APLIKACJA ---
export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [fileSize, setFileSize] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [percentage, setPercentage] = useState(0);
  
  const [bookmarks, setBookmarks] = useState<Map<number, BookmarkData>>(new Map());
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [pendingScrollLine, setPendingScrollLine] = useState<number | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Paste Fallback State
  const [showPasteModal, setShowPasteModal] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CDN FIX: Automatyczne ładowanie stylów Tailwind w razie awarii builda ---
  useEffect(() => {
    // Sprawdzamy czy style działają (czy body ma czarne tło). Jeśli nie - ładujemy CDN.
    // Dla pewności ładujemy zawsze, bo na Vercel build CSS nie zadziałał.
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('log_history_v2');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (f: File) => {
    const newEntry: HistoryItem = { name: f.name, size: formatBytes(f.size), date: new Date().toLocaleDateString() };
    const filtered = history.filter(h => h.name !== f.name);
    const newHistory = [newEntry, ...filtered].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('log_history_v2', JSON.stringify(newHistory));
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) { 
        alert('Clipboard is empty'); 
        return; 
      }
      processPastedText(text);
    } catch (err) {
      console.warn("Clipboard access denied, switching to manual mode.");
      setShowPasteModal(true);
    }
  };

  const processPastedText = (text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const f = new File([blob], "clipboard_content.log", { type: "text/plain", lastModified: Date.now() });
    handleFile(f);
    setShowPasteModal(false);
  };

  useEffect(() => {
    if (!isLoading && pendingScrollLine !== null) {
      setTimeout(() => {
        const element = document.getElementById(`line-${pendingScrollLine}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('animate-flash');
          setTimeout(() => element.classList.remove('animate-flash'), 1500);
        }
        setPendingScrollLine(null);
      }, 100);
    }
  }, [lines, isLoading, pendingScrollLine]);

  const readChunk = (offset: number, fileToRead: File | null = file) => {
    if (!fileToRead) { setIsLoading(false); return; }
    setIsLoading(true);
    const reader = new FileReader();
    const blob = fileToRead.slice(offset, offset + CHUNK_SIZE);
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      let newLines = text.split('\n');
      if (offset > 0) newLines.shift();
      if (offset + CHUNK_SIZE < fileToRead.size) newLines.pop();
      setLines(newLines);
      setCurrentOffset(offset);
      setPercentage((offset / fileToRead.size) * 100);
      setIsLoading(false);
      if (pendingScrollLine === null && bottomRef.current?.parentElement) bottomRef.current.parentElement.scrollTop = 0;
    };
    reader.readAsText(blob);
  };

  const handleFile = (f: File) => {
    setFile(f);
    setFileSize(f.size);
    setBookmarks(new Map());
    addToHistory(f);
    setTimeout(() => readChunk(0, f), 100);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => { if (!file) return; const val = parseFloat(e.target.value); const newOffset = Math.floor((val / 100) * file.size); setPercentage(val); readChunk(newOffset, file); };
  const toggleBookmark = (lineNum: number, content: string) => { const newBookmarks = new Map(bookmarks); if (newBookmarks.has(lineNum)) newBookmarks.delete(lineNum); else newBookmarks.set(lineNum, { lineNum, content: content.length > 50 ? content.substring(0, 50) + '...' : content, chunkOffset: currentOffset }); setBookmarks(newBookmarks); };
  const jumpToBookmark = (bookmark: BookmarkData) => { if (bookmark.chunkOffset === currentOffset) { const element = document.getElementById(`line-${bookmark.lineNum}`); if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); element.classList.add('animate-flash'); setTimeout(() => element.classList.remove('animate-flash'), 1500); } } else { readChunk(bookmark.chunkOffset); setPendingScrollLine(bookmark.lineNum); } setShowBookmarksList(false); };
  const filteredLines = focusMode && searchTerm ? lines.filter(l => l.toLowerCase().includes(searchTerm.toLowerCase())) : lines;

  const loadDemo = () => { setIsLoading(true); setTimeout(() => { handleFile(generateDemoLog()); }, 600); }; // Demo function kept if needed, but not in UI

  return (
    <div className="bg-[#050505] text-slate-300 font-jetbrains h-[100dvh] overflow-hidden flex flex-col tech-grid relative">
      <style>{styles}</style>

      {/* --- TOP BAR --- */}
      <div className="glass-panel h-14 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowInfoModal(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Menu size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00f3ff] to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]"><FileSearch size={18} className="text-black" /></div>
            <div>
               <h1 className="text-sm font-bold text-white tracking-wider neon-text">LOG VIEWER <span className="text-[9px] bg-[#ff00ff] text-white px-1 rounded ml-1">PRO</span></h1>
               {file && <p className="text-[10px] text-[#00f3ff] font-mono">{file.name} ({formatBytes(fileSize)})</p>}
            </div>
          </div>
        </div>
        {file && <button onClick={() => setFile(null)} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>}
      </div>

      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
      {showPasteModal && <PasteModal onClose={() => setShowPasteModal(false)} onPaste={processPastedText} />}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 overflow-hidden relative flex">
        {file ? (
          <>
            <div className="flex-1 flex flex-col min-w-0 relative">
              <div className="p-3 z-10 space-y-2">
                <div className="glass-panel rounded-lg p-2 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-black/40 rounded px-2 border border-white/5"><Search size={14} className="text-[#00f3ff]" /><input className="bg-transparent border-none outline-none text-xs w-full py-2 text-white placeholder-white/30" placeholder="SEARCH..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                    <button onClick={() => setFocusMode(!focusMode)} disabled={!searchTerm} className={`px-3 rounded border flex items-center gap-2 transition-all ${focusMode ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]' : 'bg-white/5 border-white/10 text-slate-400'}`}>{focusMode ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  </div>
                  <div className="flex items-center gap-3 px-1"><span className="text-[10px] text-[#00f3ff] w-8 font-bold">{percentage.toFixed(0)}%</span><input type="range" min="0" max="100" step="0.1" value={percentage} onChange={handleSlider} className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00f3ff]" /></div>
                </div>
                <div className="flex gap-2 relative">
                  <button onClick={() => setShowBookmarksList(!showBookmarksList)} className={`glass-panel px-3 py-1.5 rounded text-[10px] flex items-center gap-2 transition-all ${showBookmarksList ? 'bg-[#ff00ff]/20 border-[#ff00ff] text-white' : 'text-slate-400 hover:bg-white/10'}`}><Bookmark size={10} className={`${bookmarks.size > 0 ? 'text-[#ff00ff] fill-current' : ''}`} /><span>{bookmarks.size} MARKED</span>{showBookmarksList ? <ArrowDown size={10}/> : <ArrowUp size={10}/>}</button>
                  {bookmarks.size > 0 && (<button onClick={() => setBookmarks(new Map())} className="glass-panel px-3 py-1.5 rounded text-[10px] hover:bg-red-500/20 text-slate-400 hover:text-red-400"><Trash2 size={10} /></button>)}
                </div>
                {showBookmarksList && (
                   <div className="absolute top-[110px] left-3 right-3 glass-panel border border-[#ff00ff]/30 rounded-xl z-30 max-h-64 overflow-y-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
                     <div className="p-2 sticky top-0 bg-[#0d1117]/95 backdrop-blur border-b border-white/10 text-[10px] font-bold text-[#ff00ff] uppercase tracking-wider mb-1 flex justify-between"><span>Warp Destinations</span><span className="text-slate-500">{bookmarks.size} locs</span></div>
                     {bookmarks.size === 0 ? <div className="p-4 text-center text-xs text-slate-500 italic">No bookmarks yet.</div> : Array.from(bookmarks.values()).sort((a,b) => a.lineNum - b.lineNum).map((bkm) => (<div key={bkm.lineNum} onClick={() => jumpToBookmark(bkm)} className="p-2 border-b border-white/5 hover:bg-[#ff00ff]/10 cursor-pointer group flex gap-3 items-center"><div className="flex flex-col items-end w-12 shrink-0"><span className="text-[#ff00ff] font-bold text-xs">#{bkm.lineNum}</span>{bkm.chunkOffset !== currentOffset && (<span className="text-[9px] text-slate-500 flex items-center gap-0.5"><MapPin size={8}/> WARP</span>)}</div><span className="text-[10px] text-slate-300 font-mono truncate opacity-70 group-hover:opacity-100">{bkm.content}</span></div>))}
                   </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto relative scrollbar-hide px-2">
                {isLoading ? <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-20"><div className="flex flex-col items-center gap-2"><div className="w-12 h-1 border-t border-[#00f3ff] animate-ping" /><span className="text-xs text-[#00f3ff] tracking-widest animate-pulse">WARPING...</span></div></div> : <div className="pb-10">{filteredLines.length > 0 ? filteredLines.map((line, i) => { const originalIndex = Math.floor(currentOffset/50) + i; return <LogLine key={i} id={`line-${originalIndex}`} content={line} number={originalIndex} highlight={searchTerm} isBookmarked={bookmarks.has(originalIndex)} onToggleBookmark={toggleBookmark} />; }) : <div className="text-center py-10 text-slate-500 text-xs">{focusMode ? 'No matches found.' : 'End of chunk.'}</div>}</div>}
                <div ref={bottomRef} />
              </div>
            </div>
            <Minimap lines={lines} bookmarks={bookmarks} offset={currentOffset} />
          </>
        ) : (
          /* --- EMPTY STATE / DASHBOARD --- */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 overflow-y-auto">
            <div className="max-w-xs w-full glass-panel rounded-2xl p-6 border-t border-t-[#00f3ff]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-6">
              <div className="mb-4 relative"><div className="absolute inset-0 bg-[#00f3ff] blur-[40px] opacity-10 rounded-full"></div><UploadCloud size={48} className="text-[#00f3ff] mx-auto relative z-10 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" /></div>
              <h2 className="text-xl font-bold text-white mb-2 tracking-tight">UPLOAD FILE</h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Drop huge log files here.<br/>Local processing. Zero latency.</p>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                 <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center gap-1"><Zap size={14} className="text-[#00f3ff]" /><span className="text-[9px] font-bold text-slate-300">INSTANT</span></div>
                 <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center gap-1"><Bug size={14} className="text-[#ff00ff]" /><span className="text-[9px] font-bold text-slate-300">DEBUG</span></div>
                 <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center gap-1"><FileJson size={14} className="text-yellow-400" /><span className="text-[9px] font-bold text-slate-300">JSON</span></div>
              </div>

              <div className="space-y-3">
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#00f3ff] hover:bg-[#00c2cc] text-black font-bold py-3 rounded-lg text-sm transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center gap-2"><FileText size={16} /> SELECT FILE</button>
                <button onClick={handlePasteClick} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"><Clipboard size={16} className="text-[#ff00ff]" /> PASTE CLIPBOARD</button>
              </div>
            </div>

            <div className="w-full max-w-xs">
               <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold mb-3 px-2 tracking-widest"><History size={10} /> Recent Sessions</div>
               {history.length === 0 ? <div className="glass-panel rounded-xl p-4 text-center"><p className="text-slate-600 text-[10px] italic">No local history found.</p></div> : <div className="glass-panel rounded-xl overflow-hidden text-left">{history.map((h, i) => (<div key={i} className="p-3 border-b border-white/5 last:border-0 flex justify-between items-center group hover:bg-white/5 transition-colors"><div className="min-w-0"><div className="text-xs text-slate-300 truncate font-mono mb-0.5">{h.name}</div><div className="text-[9px] text-[#00f3ff]/70 flex items-center gap-2"><span>{h.date}</span><span>•</span><span>{h.size}</span></div></div></div>))}</div>}
            </div>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
    </div>
  );
}