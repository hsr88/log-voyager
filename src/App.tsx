import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  FileText, Search, UploadCloud, Zap, Bug, FileJson,
  X, Bookmark, ArrowDown, ArrowUp, Eye, EyeOff, Trash2, MapPin, Menu, History, Clipboard, Settings, Download, ChevronDown, ChevronUp, CaseSensitive,
  Keyboard, Command, Sun, Moon, Split, Filter, BarChart, AlertCircle, BookOpen, Plus, Check, Columns, Github, Coffee, Heart
} from 'lucide-react';

import LogLine from './components/LogLine';
import Minimap from './components/Minimap';
import { InfoModal, SettingsModal, PasteModal, ExportSelectionModal } from './components/Modals';
import { CommandPalette } from './components/CommandPalette';
import { MultiFilter, applyFilters } from './components/MultiFilter';
import { ErrorAggregation } from './components/ErrorAggregation';
import { LogStats } from './components/LogStats';
import { useKeyboardShortcuts, formatShortcut } from './hooks/useKeyboardShortcuts';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { formatBytes, getLogLevel } from './utils/helpers';
import type { BookmarkData, HistoryItem, Filter, Command as CommandType, KeyboardShortcut, Selection } from './types';
import { isGzip, decompressGzip } from './utils/decompression';

const CHUNK_SIZE = 50 * 1024; // 50KB

// --- Styl CSS ---
const getStyles = (isDark: boolean) => `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
  
  .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
  
  .tech-grid {
    background-color: ${isDark ? '#050505' : '#e2e8f0'};
    background-size: 40px 40px;
    background-image: linear-gradient(to right, ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 1px, transparent 1px),
                      linear-gradient(to bottom, ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'} 1px, transparent 1px);
  }
  
  .glass-panel {
    background: ${isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(203, 213, 225, 0.7)'};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  }

  .neon-text {
    text-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: ${isDark ? '#050505' : '#cbd5e1'}; }
  ::-webkit-scrollbar-thumb { background: ${isDark ? '#333' : '#94a3b8'}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #00f3ff; }
  
  @keyframes highlight-fade {
    0% { background-color: rgba(0, 243, 255, 0.3); }
    100% { background-color: transparent; }
  }
  .animate-flash { animation: highlight-fade 1.5s ease-out; }

  .line-selection {
    user-select: text;
  }
  .line-selection::selection {
    background: rgba(0, 243, 255, 0.3);
  }
`;

// --- Main App Content Component ---
function AppContent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  // --- State ---
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

  const [showPasteModal, setShowPasteModal] = useState(false);

  // --- New States ---
  const [showSettings, setShowSettings] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [settings, setSettings] = useState({ fontSize: 'xs', lineWrap: true });
  
  // Command Palette
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  
  // Multi-filter
  const [filters, setFilters] = useState<Filter[]>([]);
  const [showMultiFilter, setShowMultiFilter] = useState(false);
  
  // Error Aggregation
  const [showErrorAggregation, setShowErrorAggregation] = useState(false);
  
  // Log Stats
  const [showLogStats, setShowLogStats] = useState(false);
  
  // Split View
  const [splitView, setSplitView] = useState(false);
  const [secondaryOffset, setSecondaryOffset] = useState(0);
  const [secondaryLines, setSecondaryLines] = useState<string[]>([]);
  const [secondaryPercentage, setSecondaryPercentage] = useState(50);
  
  // Selection for export
  const [selection, setSelection] = useState<Selection>({ lineNumbers: [], contents: [] });
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => { 
    const saved = localStorage.getItem('log_history_v2'); 
    if (saved) setHistory(JSON.parse(saved)); 
  }, []);
  
  useEffect(() => { 
    const saved = localStorage.getItem('search_history'); 
    if (saved) setSearchHistory(JSON.parse(saved)); 
  }, []);

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

  // --- Helpers ---
  const addToHistory = (f: File) => {
    const newEntry: HistoryItem = { name: f.name, size: formatBytes(f.size), date: new Date().toLocaleDateString() };
    const filtered = history.filter(h => h.name !== f.name);
    const newHistory = [newEntry, ...filtered].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('log_history_v2', JSON.stringify(newHistory));
  };

  const saveSearchTerm = (term: string) => {
    if (!term) return;
    const prev = searchHistory.filter(t => t !== term);
    const newHist = [term, ...prev].slice(0, 10);
    setSearchHistory(newHist);
    localStorage.setItem('search_history', JSON.stringify(newHist));
  };

  const handlePasteClick = async () => {
    try { 
      const text = await navigator.clipboard.readText(); 
      if (!text) { alert('Clipboard is empty'); return; } 
      processPastedText(text); 
    } catch (err) { 
      console.warn("Clipboard access denied"); 
      setShowPasteModal(true); 
    }
  };

  const processPastedText = (text: string) => { 
    const blob = new Blob([text], { type: 'text/plain' }); 
    const f = new File([blob], "clipboard_content.log", { type: "text/plain", lastModified: Date.now() }); 
    handleFile(f); 
    setShowPasteModal(false); 
  };

  const readChunk = (offset: number, fileToRead: File | null = file, isSecondary = false) => {
    if (!fileToRead) { setIsLoading(false); return; } 
    if (!isSecondary) setIsLoading(true);
    
    const reader = new FileReader();
    const blob = fileToRead.slice(offset, offset + CHUNK_SIZE);
    
    reader.onload = (e) => {
      const text = e.target?.result as string; 
      if (!text) return; 
      let newLines = text.split('\n'); 
      if (offset > 0) newLines.shift(); 
      if (offset + CHUNK_SIZE < fileToRead.size) newLines.pop();
      
      if (isSecondary) {
        setSecondaryLines(newLines);
        setSecondaryOffset(offset);
        setSecondaryPercentage((offset / fileToRead.size) * 100);
      } else {
        setLines(newLines); 
        setCurrentOffset(offset); 
        setPercentage((offset / fileToRead.size) * 100); 
        setIsLoading(false);
        if (pendingScrollLine === null && bottomRef.current?.parentElement) {
          bottomRef.current.parentElement.scrollTop = 0;
        }
      }
    };
    reader.readAsText(blob);
  };

  const handleFile = async (f: File) => {
    setFile(f);
    setFileSize(f.size);
    setBookmarks(new Map());
    setFilters([]);
    setSplitView(false);
    addToHistory(f);

    try {
      if (await isGzip(f)) {
        setIsLoading(true);
        const text = await decompressGzip(f);
        setLines(text.split('\n'));
        setPercentage(0);
        setCurrentOffset(0);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Decompression failed", err);
      alert("Failed to decompress file. Opening as text.");
      setIsLoading(false);
    }

    setTimeout(() => readChunk(0, f), 100);
  };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>, isSecondary = false) => { 
    if (!file) return; 
    const val = parseFloat(e.target.value); 
    const newOffset = Math.floor((val / 100) * file.size); 
    readChunk(newOffset, file, isSecondary);
  };

  const toggleBookmark = (lineNum: number, content: string) => {
    const newBookmarks = new Map(bookmarks);
    if (newBookmarks.has(lineNum)) {
      newBookmarks.delete(lineNum);
    } else {
      newBookmarks.set(lineNum, { 
        lineNum, 
        content: content.length > 200 ? content.substring(0, 200) + '...' : content, 
        chunkOffset: currentOffset 
      });
    }
    setBookmarks(newBookmarks);
  };

  const jumpToBookmark = (bookmark: BookmarkData) => { 
    if (bookmark.chunkOffset === currentOffset) { 
      const element = document.getElementById(`line-${bookmark.lineNum}`); 
      if (element) { 
        element.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
        element.classList.add('animate-flash'); 
        setTimeout(() => element.classList.remove('animate-flash'), 1500); 
      } 
    } else { 
      readChunk(bookmark.chunkOffset); 
      setPendingScrollLine(bookmark.lineNum); 
    } 
    setShowBookmarksList(false); 
  };

  const handleExportView = () => {
    const content = filteredLines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyager_export_${new Date().getTime()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSelection = (format: 'txt' | 'json' | 'csv') => {
    let content = '';
    let mimeType = '';
    let extension = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(
          selection.contents.map((content, i) => ({
            lineNumber: selection.lineNumbers[i],
            content
          })),
          null,
          2
        );
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        content = 'Line Number,Content\n' + 
          selection.contents.map((content, i) => 
            `${selection.lineNumbers[i]},"${content.replace(/"/g, '""')}"`
          ).join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      default:
        content = selection.contents.join('\n');
        mimeType = 'text/plain';
        extension = 'log';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyager_selection_${new Date().getTime()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    setSelection({ lineNumbers: [], contents: [] });
  };

  const handleMinimapClick = (percentage: number) => {
    if (!file) return;
    const newOffset = Math.floor((percentage / 100) * file.size);
    readChunk(newOffset);
  };

  // --- Filtering ---
  const filteredLines = useMemo(() => {
    let result = lines;
    
    // Apply multi-filters
    if (filters.length > 0 && filters.some(f => f.term.trim())) {
      result = applyFilters(result, filters);
    }
    
    // Apply focus mode search
    if (focusMode && searchTerm) {
      if (useRegex) { 
        try { 
          const regex = new RegExp(searchTerm, caseSensitive ? '' : 'i'); 
          result = result.filter(l => regex.test(l)); 
        } catch (e) { /* invalid regex */ }
      } else {
        result = result.filter(l => caseSensitive ? l.includes(searchTerm) : l.toLowerCase().includes(searchTerm.toLowerCase()));
      }
    }
    
    return result;
  }, [lines, filters, focusMode, searchTerm, useRegex, caseSensitive]);

  // --- Search Navigation ---
  const matchIndices = useMemo(() => {
    if (!searchTerm) return [];
    return lines.map((line, i) => {
      if (useRegex) { 
        try { 
          return new RegExp(searchTerm, caseSensitive ? '' : 'i').test(line) ? i : -1; 
        } catch { return -1; }
      }
      return (caseSensitive ? line.includes(searchTerm) : line.toLowerCase().includes(searchTerm.toLowerCase())) ? i : -1;
    }).filter(i => i !== -1);
  }, [lines, searchTerm, useRegex, caseSensitive]);

  const jumpToNextMatch = () => {
    if (matchIndices.length === 0) return;
    const nextIdx = matchIndices.find(idx => idx > currentMatchIndex);
    const targetIdx = nextIdx !== undefined ? nextIdx : matchIndices[0];
    setCurrentMatchIndex(targetIdx);
    scrollToLine(targetIdx);
  };

  const jumpToPrevMatch = () => {
    if (matchIndices.length === 0) return;
    const prevIdx = [...matchIndices].reverse().find(idx => idx < currentMatchIndex);
    const targetIdx = prevIdx !== undefined ? prevIdx : matchIndices[matchIndices.length - 1];
    setCurrentMatchIndex(targetIdx);
    scrollToLine(targetIdx);
  };

  const scrollToLine = (localIndex: number) => {
    const globalIndex = Math.floor(currentOffset / 50) + localIndex;
    const element = document.getElementById(`line-${globalIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('animate-flash');
      setTimeout(() => element.classList.remove('animate-flash'), 1500);
    }
  };

  // --- Keyboard Shortcuts ---
  const shortcuts: KeyboardShortcut[] = useMemo(() => [
    { key: 'k', ctrl: true, description: 'Open Command Palette', action: () => setShowCommandPalette(true) },
    { key: '/', description: 'Focus search', action: () => searchInputRef.current?.focus() },
    { key: 'f', ctrl: true, description: 'Focus search', action: () => searchInputRef.current?.focus() },
    { key: 'enter', description: 'Next search match', action: jumpToNextMatch },
    { key: 'enter', shift: true, description: 'Previous search match', action: jumpToPrevMatch },
    { key: 'b', description: 'Toggle bookmark mode', action: () => setIsSelecting(prev => !prev) },
    { key: 'e', ctrl: true, shift: true, description: 'Export selection', action: () => {
      if (selection.lineNumbers.length > 0) setShowExportModal(true);
    }},
    { key: 'l', ctrl: true, shift: true, description: 'Toggle theme', action: toggleTheme },
    { key: '\\', ctrl: true, description: 'Toggle split view', action: () => setSplitView(v => !v) },
    { key: ',', ctrl: true, description: 'Show settings', action: () => setShowSettings(true) },
    { key: 's', ctrl: true, shift: true, description: 'Show stats', action: () => setShowLogStats(true) },
    { key: 'a', ctrl: true, shift: true, description: 'Show error aggregation', action: () => setShowErrorAggregation(true) },
    { key: 'escape', description: 'Close modals', action: () => {
      setShowCommandPalette(false);
      setShowSettings(false);
      setShowMultiFilter(false);
      setShowErrorAggregation(false);
      setShowLogStats(false);
      setShowExportModal(false);
      setIsSelecting(false);
    }},
  ], [toggleTheme, jumpToNextMatch, jumpToPrevMatch, selection.lineNumbers.length]);

  useKeyboardShortcuts(shortcuts);

  // --- Commands for Command Palette ---
  const commands: CommandType[] = useMemo(() => [
    { id: 'search', label: 'Focus Search', shortcut: '/', category: 'Navigation', action: () => searchInputRef.current?.focus() },
    { id: 'bookmarks', label: 'Toggle Bookmarks Panel', category: 'Navigation', action: () => setShowBookmarksList(!showBookmarksList) },
    { id: 'settings', label: 'Open Settings', shortcut: 'Ctrl+,', category: 'View', action: () => setShowSettings(true) },
    { id: 'theme', label: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme', shortcut: 'Ctrl+Shift+L', category: 'View', action: toggleTheme },
    { id: 'split', label: splitView ? 'Disable Split View' : 'Enable Split View', shortcut: 'Ctrl+\\', category: 'View', action: () => setSplitView(!splitView) },
    { id: 'filters', label: 'Open Multi-Filter', category: 'Filter', action: () => setShowMultiFilter(true) },
    { id: 'focus', label: focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode', category: 'Filter', action: () => setFocusMode(!focusMode) },
    { id: 'stats', label: 'Show Log Statistics', shortcut: 'Ctrl+Shift+S', category: 'Analysis', action: () => setShowLogStats(true) },
    { id: 'errors', label: 'Show Error Aggregation', shortcut: 'Ctrl+Shift+A', category: 'Analysis', action: () => setShowErrorAggregation(true) },
    { id: 'export', label: 'Export Current View', category: 'Export', action: handleExportView },
    { id: 'export-selection', label: 'Export Selection', shortcut: 'Ctrl+Shift+E', category: 'Export', action: () => {
      if (selection.lineNumbers.length > 0) setShowExportModal(true);
    }},
    { id: 'close', label: 'Close File', category: 'File', action: () => setFile(null) },
    { id: 'help', label: 'Show Help', category: 'Help', action: () => setShowInfoModal(true) },
  ], [isDark, splitView, focusMode, showBookmarksList, selection.lineNumbers.length, toggleTheme]);

  // --- Line Selection Handlers ---
  const handleLineSelect = (lineNum: number, content: string, isSelected: boolean) => {
    if (isSelected) {
      setSelection(prev => ({
        lineNumbers: [...prev.lineNumbers, lineNum],
        contents: [...prev.contents, content]
      }));
    } else {
      setSelection(prev => {
        const idx = prev.lineNumbers.indexOf(lineNum);
        if (idx === -1) return prev;
        return {
          lineNumbers: prev.lineNumbers.filter((_, i) => i !== idx),
          contents: prev.contents.filter((_, i) => i !== idx)
        };
      });
    }
  };

  // --- Render ---
  return (
    <>
      <div className={`${isDark ? 'bg-[#050505] text-slate-300' : 'bg-slate-200 text-slate-600'} font-jetbrains h-[100dvh] overflow-hidden flex flex-col tech-grid relative`}>
        <style>{getStyles(isDark)}</style>

        {/* --- TOP BAR --- */}
        <div className="glass-panel h-14 flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowInfoModal(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowCommandPalette(true)}>
              <div className="relative">
                <div className="absolute inset-0 bg-[#00f3ff] blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img src="/lv_new.png" alt="LV" className="w-8 h-8 object-contain relative z-10 brightness-125 filter drop-shadow-[0_0_8px_rgba(0,243,255,0.5)] transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wider group-hover:text-[#00f3ff] transition-colors duration-300 neon-text">
                  LOG VOYAGER <span className="text-[8px] bg-[#0088ff] text-white px-1.5 py-0.5 rounded ml-1 hidden sm:inline-block">Analyze huge log files instantly in your browser</span>
                </h1>
                {file && <p className="text-[10px] text-[#00f3ff] font-mono">{file.name} ({formatBytes(fileSize)})</p>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {file && (
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs"
              >
                <Command size={14} />
                <span>Cmd+K</span>
              </button>
            )}
            
            {file && (
              <button
                onClick={toggleTheme}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            
            {file && (
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="View Settings"
              >
                <Settings size={20} />
              </button>
            )}
            
            {file && (
              <button 
                onClick={() => setFile(null)} 
                className="text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 overflow-hidden relative flex">
          {file ? (
            <>
              {/* Primary View */}
              <div className={`flex-1 flex flex-col min-w-0 relative ${splitView ? 'border-r border-white/10' : ''}`}>
                <div className="p-3 z-10 space-y-2">
                  <div className="glass-panel rounded-lg p-2 flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <div className="flex-1 flex items-center gap-2 bg-black/40 rounded px-2 border border-white/5 relative group min-w-[200px]">
                        <Search size={14} className="text-[#00f3ff]" />
                        <input
                          ref={searchInputRef}
                          className="bg-transparent border-none outline-none text-xs w-full py-2 text-white placeholder-white/30"
                          placeholder={useRegex ? "REGEX SEARCH..." : "SEARCH..."}
                          value={searchTerm}
                          onChange={e => { setSearchTerm(e.target.value); setCurrentMatchIndex(-1); }}
                          onBlur={() => saveSearchTerm(searchTerm)}
                          list="search-history"
                        />
                        <datalist id="search-history">
                          {searchHistory.map((term, i) => <option key={i} value={term} />)}
                        </datalist>

                        {/* Search Controls */}
                        <div className="flex items-center gap-1 pr-1">
                          <button
                            onClick={() => setCaseSensitive(!caseSensitive)}
                            className={`p-1 rounded text-[10px] font-bold border transition-colors ${caseSensitive ? 'border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff]/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            title="Match Case"
                          >
                            <CaseSensitive size={14} />
                          </button>
                          <button
                            onClick={() => setUseRegex(!useRegex)}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-colors ${useRegex ? 'border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff]/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                            title="Use Regular Expression"
                          >
                            .*
                          </button>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      {searchTerm && !focusMode && (
                        <div className="flex gap-0.5">
                          <button onClick={jumpToPrevMatch} className="px-1.5 rounded-l border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-50" disabled={matchIndices.length === 0} title="Previous Match"><ChevronUp size={14} /></button>
                          <button onClick={jumpToNextMatch} className="px-1.5 rounded-r border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all disabled:opacity-50" disabled={matchIndices.length === 0} title="Next Match"><ChevronDown size={14} /></button>
                        </div>
                      )}

                      {/* Multi-filter */}
                      <MultiFilter filters={filters} onChange={setFilters} />

                      {/* Download Buttons */}
                      {filteredLines.length > 0 && (
                        <button onClick={handleExportView} className="px-3 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Export Current View">
                          <Download size={14} />
                        </button>
                      )}
                      
                      {selection.lineNumbers.length > 0 && (
                        <button 
                          onClick={() => setShowExportModal(true)} 
                          className="px-3 rounded border border-[#00f3ff]/30 bg-[#00f3ff]/10 hover:bg-[#00f3ff]/20 text-[#00f3ff] transition-all flex items-center gap-2"
                          title="Export Selection"
                        >
                          <Check size={14} />
                          <span className="text-xs font-bold">{selection.lineNumbers.length}</span>
                        </button>
                      )}

                      <button onClick={() => setFocusMode(!focusMode)} disabled={!searchTerm && filters.length === 0} className={`px-3 rounded border flex items-center gap-2 transition-all ${focusMode ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                        {focusMode ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      
                      {/* Split View Toggle */}
                      <button 
                        onClick={() => setSplitView(!splitView)}
                        className={`px-3 rounded border flex items-center gap-2 transition-all ${splitView ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]' : 'bg-white/5 border-white/10 text-slate-400'}`}
                        title="Toggle Split View"
                      >
                        <Columns size={14} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3 px-1">
                      <span className="text-[10px] text-[#00f3ff] w-8 font-bold">{percentage.toFixed(0)}%</span>
                      <input type="range" min="0" max="100" step="0.1" value={percentage} onChange={(e) => handleSlider(e)} className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00f3ff]" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 relative flex-wrap">
                    <button onClick={() => setShowBookmarksList(!showBookmarksList)} className={`glass-panel px-3 py-1.5 rounded text-[10px] flex items-center gap-2 transition-all ${showBookmarksList ? 'bg-[#ff00ff]/20 border-[#ff00ff] text-white' : 'text-slate-400 hover:bg-white/10'}`}>
                      <Bookmark size={10} className={`${bookmarks.size > 0 ? 'text-[#ff00ff] fill-current' : ''}`} />
                      <span>{bookmarks.size} MARKED</span>
                      {showBookmarksList ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                    </button>
                    
                    {bookmarks.size > 0 && (
                      <button onClick={() => setBookmarks(new Map())} className="glass-panel px-3 py-1.5 rounded text-[10px] hover:bg-red-500/20 text-slate-400 hover:text-red-400">
                        <Trash2 size={10} />
                      </button>
                    )}
                    
                    {/* Analysis Buttons */}
                    <button 
                      onClick={() => setShowErrorAggregation(true)}
                      className="glass-panel px-3 py-1.5 rounded text-[10px] flex items-center gap-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                    >
                      <AlertCircle size={10} />
                      ERRORS
                    </button>
                    
                    <button 
                      onClick={() => setShowLogStats(true)}
                      className="glass-panel px-3 py-1.5 rounded text-[10px] flex items-center gap-2 text-slate-400 hover:bg-[#00f3ff]/20 hover:text-[#00f3ff] transition-all"
                    >
                      <BarChart size={10} />
                      STATS
                    </button>
                    
                    {/* Selection Mode */}
                    <button 
                      onClick={() => setIsSelecting(!isSelecting)}
                      className={`glass-panel px-3 py-1.5 rounded text-[10px] flex items-center gap-2 transition-all ${isSelecting ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]' : 'text-slate-400 hover:bg-white/10'}`}
                    >
                      <Check size={10} />
                      SELECT
                    </button>
                  </div>
                  
                  {showBookmarksList && (
                    <div className="absolute top-[140px] left-3 right-3 glass-panel border border-[#ff00ff]/30 rounded-xl z-30 max-h-64 overflow-y-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-2 sticky top-0 bg-[#0d1117]/95 backdrop-blur border-b border-white/10 text-[10px] font-bold text-[#ff00ff] uppercase tracking-wider mb-1 flex justify-between">
                        <span>Warp Destinations</span>
                        <span className="text-slate-500">{bookmarks.size} locs</span>
                      </div>
                      {bookmarks.size === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500 italic">No bookmarks yet.</div>
                      ) : (
                        Array.from(bookmarks.values()).sort((a, b) => a.lineNum - b.lineNum).map((bkm) => (
                          <div key={bkm.lineNum} onClick={() => jumpToBookmark(bkm)} className="p-2 border-b border-white/5 hover:bg-[#ff00ff]/10 cursor-pointer group flex gap-3 items-center">
                            <div className="flex flex-col items-end w-12 shrink-0">
                              <span className="text-[#ff00ff] font-bold text-xs">#{bkm.lineNum}</span>
                              {bkm.chunkOffset !== currentOffset && (
                                <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                                  <MapPin size={8} /> WARP
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-300 font-mono truncate opacity-70 group-hover:opacity-100">{bkm.content}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto relative scrollbar-hide px-2">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-20">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-1 border-t border-[#00f3ff] animate-ping" />
                        <span className="text-xs text-[#00f3ff] tracking-widest animate-pulse">WARPING...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="pb-10">
                      {filteredLines.length > 0 ? (
                        filteredLines.map((line, i) => {
                          const originalIndex = Math.floor(currentOffset / 50) + i;
                          const isSelected = selection.lineNumbers.includes(originalIndex);
                          return (
                            <LogLine 
                              key={i} 
                              id={`line-${originalIndex}`} 
                              content={line} 
                              number={originalIndex} 
                              highlight={searchTerm} 
                              isBookmarked={bookmarks.has(originalIndex)} 
                              isSelected={isSelected}
                              isSelecting={isSelecting}
                              onToggleBookmark={toggleBookmark}
                              onSelect={handleLineSelect}
                              settings={settings}
                              useRegex={useRegex}
                              caseSensitive={caseSensitive}
                            />
                          );
                        })
                      ) : (
                        <div className="text-center py-10 text-slate-500 text-xs">
                          {focusMode || filters.length > 0 ? 'No matches found.' : 'End of chunk.'}
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Secondary View (Split View) */}
              {splitView && (
                <div className="flex-1 flex flex-col min-w-0 relative border-l border-white/10">
                  <div className="p-3 z-10 space-y-2">
                    <div className="glass-panel rounded-lg p-2">
                      <div className="flex items-center gap-3 px-1">
                        <span className="text-[10px] text-[#00f3ff] w-8 font-bold">{secondaryPercentage.toFixed(0)}%</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="0.1" 
                          value={secondaryPercentage} 
                          onChange={(e) => handleSlider(e, true)} 
                          className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#ff00ff]" 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] text-slate-500">Split View</span>
                      <button 
                        onClick={() => setSplitView(false)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto relative scrollbar-hide px-2">
                    <div className="pb-10">
                      {secondaryLines.map((line, i) => {
                        const originalIndex = Math.floor(secondaryOffset / 50) + i;
                        return (
                          <LogLine 
                            key={`sec-${i}`} 
                            id={`line-sec-${originalIndex}`} 
                            content={line} 
                            number={originalIndex} 
                            highlight=""
                            isBookmarked={bookmarks.has(originalIndex)} 
                            isSelected={false}
                            isSelecting={false}
                            onToggleBookmark={toggleBookmark}
                            onSelect={() => {}}
                            settings={settings}
                            useRegex={false}
                            caseSensitive={false}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <Minimap 
                lines={lines} 
                bookmarks={bookmarks} 
                offset={currentOffset} 
                fileSize={fileSize}
                showHeatmap={true}
                onPositionClick={handleMinimapClick}
              />
            </>
          ) : (
            /* --- EMPTY STATE / DASHBOARD --- */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 overflow-y-auto">
              <div className="max-w-xs w-full glass-panel rounded-2xl p-6 border-t border-t-[#00f3ff]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-6">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-[#00f3ff] blur-[40px] opacity-10 rounded-full"></div>
                  <UploadCloud size={48} className="text-[#00f3ff] mx-auto relative z-10 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">LOG VOYAGER</h2>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">Drop huge log files here.<br />Local processing. Zero latency.</p>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center gap-1">
                    <Zap size={14} className="text-[#00f3ff]" />
                    <span className="text-[9px] font-bold text-slate-300">INSTANT</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center gap-1">
                    <Bug size={14} className="text-[#ff00ff]" />
                    <span className="text-[9px] font-bold text-slate-300">DEBUG</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5 flex flex-col items-center gap-1">
                    <FileJson size={14} className="text-yellow-400" />
                    <span className="text-[9px] font-bold text-slate-300">JSON</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#00f3ff] hover:bg-[#00c2cc] text-black font-bold py-3 rounded-lg text-sm transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center gap-2">
                    <FileText size={16} /> SELECT FILE
                  </button>
                  <button onClick={handlePasteClick} className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2">
                    <Clipboard size={16} className="text-[#ff00ff]" /> PASTE CLIPBOARD
                  </button>
                </div>
              </div>

              <div className="w-full max-w-xs">
                <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold mb-3 px-2 tracking-widest">
                  <History size={10} /> Recent Sessions
                </div>
                {history.length === 0 ? (
                  <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-slate-600 text-[10px] italic">No local history found.</p>
                  </div>
                ) : (
                  <div className="glass-panel rounded-xl overflow-hidden text-left">
                    {history.map((h, i) => (
                      <div key={i} className="p-3 border-b border-white/5 last:border-0 flex justify-between items-center group hover:bg-white/5 transition-colors">
                        <div className="min-w-0">
                          <div className="text-xs text-slate-300 truncate font-mono mb-0.5">{h.name}</div>
                          <div className="text-[9px] text-[#00f3ff]/70 flex items-center gap-2">
                            <span>{h.date}</span>
                            <span>•</span>
                            <span>{h.size}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <footer className="glass-panel border-t border-white/5 py-2 px-4 shrink-0">
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/hsr88/log-voyager" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#00f3ff] transition-colors"
              >
                <Github size={12} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a 
                href="https://ko-fi.com/hsr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#ff5e5b] transition-colors"
              >
                <Coffee size={12} />
                <span className="hidden sm:inline">Support</span>
              </a>
            </div>
            
            <div className="flex items-center gap-1 text-slate-600">
              <span>Made with</span>
              <Heart size={10} className="text-red-500 fill-red-500" />
              <span>by <a href="https://x.com/hsrvibe" target="_blank" rel="noopener noreferrer" className="hover:text-[#00f3ff] transition-colors underline decoration-dotted">hsr</a></span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 hover:text-[#00f3ff] transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={12} /> : <Moon size={12} />}
                <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <span className="text-slate-600">© 2026 logvoyager.cc</span>
            </div>
          </div>
        </footer>

        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
      </div>

      {/* Modals */}
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
      {showPasteModal && <PasteModal onClose={() => setShowPasteModal(false)} onPaste={processPastedText} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} settings={settings} onUpdate={setSettings} />}
      {showCommandPalette && <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} commands={commands} />}
      {showErrorAggregation && file && (
        <ErrorAggregation
          lines={lines}
          offset={currentOffset}
          bookmarks={bookmarks}
          onJumpToLine={(lineNum, chunkOffset) => {
            if (chunkOffset !== currentOffset) {
              readChunk(chunkOffset);
              setPendingScrollLine(lineNum);
            } else {
              const element = document.getElementById(`line-${lineNum}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('animate-flash');
                setTimeout(() => element.classList.remove('animate-flash'), 1500);
              }
            }
            setShowErrorAggregation(false);
          }}
          onClose={() => setShowErrorAggregation(false)}
          onToggleBookmark={toggleBookmark}
        />
      )}
      {showLogStats && file && (
        <LogStats
          lines={lines}
          offset={currentOffset}
          fileSize={fileSize}
          fileName={file.name}
          onClose={() => setShowLogStats(false)}
        />
      )}
      {showExportModal && (
        <ExportSelectionModal
          selectedLines={selection.lineNumbers.map((num, i) => ({ number: num, content: selection.contents[i] }))}
          onClose={() => setShowExportModal(false)}
          onExport={handleExportSelection}
        />
      )}
    </>
  );
}

// --- Wrapper with Theme Provider ---
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
