import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText, Search, UploadCloud, Zap, Bug, FileJson,
  X, Bookmark, ArrowDown, ArrowUp, Eye, EyeOff, Trash2, MapPin, Menu, History, Clipboard, Box, Settings, Download, ChevronDown, ChevronUp, CaseSensitive
} from 'lucide-react';

import LogLine from './components/LogLine';
import Minimap from './components/Minimap';
import { InfoModal, SettingsModal, PasteModal } from './components/Modals';
import { formatBytes } from './utils/helpers';
import type { BookmarkData, HistoryItem } from './types';

// --- BUILD FIX: Zakomentowano import, który powodował błąd na Vercel/Web ---
// import { SendIntent } from 'capacitor-plugin-send-intent';

/**
 * LOG VOYAGER - KO-FI EDITION
 * - Dodano przycisk "Buy me a Coffee" w sekcji ABOUT (Info Modal).
 * - Linkuje do: https://ko-fi.com/hsr
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
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #050505; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #00f3ff; }
  
  @keyframes highlight-fade {
    0% { background-color: rgba(0, 243, 255, 0.3); }
    100% { background-color: transparent; }
  }
  .animate-flash { animation: highlight-fade 1.5s ease-out; }
`;

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

  const [showPasteModal, setShowPasteModal] = useState(false);


  // --- Nowe Stany (Quality of Life & Smart Search) ---
  const [showSettings, setShowSettings] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [settings, setSettings] = useState({ fontSize: 'xs', lineWrap: true });

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => { const saved = localStorage.getItem('log_history_v2'); if (saved) setHistory(JSON.parse(saved)); }, []);
  useEffect(() => { const saved = localStorage.getItem('search_history'); if (saved) setSearchHistory(JSON.parse(saved)); }, []);

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
    try { const text = await navigator.clipboard.readText(); if (!text) { alert('Clipboard is empty'); return; } processPastedText(text); } catch (err) { console.warn("Clipboard access denied"); setShowPasteModal(true); }
  };

  const processPastedText = (text: string) => { const blob = new Blob([text], { type: 'text/plain' }); const f = new File([blob], "clipboard_content.log", { type: "text/plain", lastModified: Date.now() }); handleFile(f); setShowPasteModal(false); };

  useEffect(() => { if (!isLoading && pendingScrollLine !== null) { setTimeout(() => { const element = document.getElementById(`line-${pendingScrollLine}`); if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); element.classList.add('animate-flash'); setTimeout(() => element.classList.remove('animate-flash'), 1500); } setPendingScrollLine(null); }, 100); } }, [lines, isLoading, pendingScrollLine]);

  const readChunk = (offset: number, fileToRead: File | null = file) => {
    if (!fileToRead) { setIsLoading(false); return; } setIsLoading(true);
    const reader = new FileReader();
    const blob = fileToRead.slice(offset, offset + CHUNK_SIZE);
    reader.onload = (e) => {
      const text = e.target?.result as string; if (!text) return; let newLines = text.split('\n'); if (offset > 0) newLines.shift(); if (offset + CHUNK_SIZE < fileToRead.size) newLines.pop();
      setLines(newLines); setCurrentOffset(offset); setPercentage((offset / fileToRead.size) * 100); setIsLoading(false);
      if (pendingScrollLine === null && bottomRef.current?.parentElement) bottomRef.current.parentElement.scrollTop = 0;
    };
    reader.readAsText(blob);
  };

  const handleFile = (f: File) => { setFile(f); setFileSize(f.size); setBookmarks(new Map()); addToHistory(f); setTimeout(() => readChunk(0, f), 100); };

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => { if (!file) return; const val = parseFloat(e.target.value); const newOffset = Math.floor((val / 100) * file.size); setPercentage(val); readChunk(newOffset, file); };
  const toggleBookmark = (lineNum: number, content: string) => { const newBookmarks = new Map(bookmarks); if (newBookmarks.has(lineNum)) newBookmarks.delete(lineNum); else newBookmarks.set(lineNum, { lineNum, content: content.length > 50 ? content.substring(0, 50) + '...' : content, chunkOffset: currentOffset }); setBookmarks(newBookmarks); };
  const jumpToBookmark = (bookmark: BookmarkData) => { if (bookmark.chunkOffset === currentOffset) { const element = document.getElementById(`line-${bookmark.lineNum}`); if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); element.classList.add('animate-flash'); setTimeout(() => element.classList.remove('animate-flash'), 1500); } } else { readChunk(bookmark.chunkOffset); setPendingScrollLine(bookmark.lineNum); } setShowBookmarksList(false); };

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

  const filteredLines = useMemo(() => {
    if (!focusMode || !searchTerm) return lines;
    if (useRegex) { try { const regex = new RegExp(searchTerm, caseSensitive ? '' : 'i'); return lines.filter(l => regex.test(l)); } catch (e) { return lines; } }
    return lines.filter(l => caseSensitive ? l.includes(searchTerm) : l.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [lines, focusMode, searchTerm, useRegex, caseSensitive]);

  // --- Smart Search Navigation ---
  // Calculates indices of matches within the current chunk (lines)
  const matchIndices = useMemo(() => {
    if (!searchTerm) return [];
    return lines.map((line, i) => {
      if (useRegex) { try { return new RegExp(searchTerm, caseSensitive ? '' : 'i').test(line) ? i : -1; } catch { return -1; } }
      return (caseSensitive ? line.includes(searchTerm) : line.toLowerCase().includes(searchTerm.toLowerCase())) ? i : -1;
    }).filter(i => i !== -1);
  }, [lines, searchTerm, useRegex, caseSensitive]);

  const jumpToNextMatch = () => {
    if (matchIndices.length === 0) return;
    const nextIdx = matchIndices.find(idx => idx > currentMatchIndex);
    const targetIdx = nextIdx !== undefined ? nextIdx : matchIndices[0]; // Loop back to start
    setCurrentMatchIndex(targetIdx);
    scrollToLine(targetIdx);
  };

  const jumpToPrevMatch = () => {
    if (matchIndices.length === 0) return;
    const prevIdx = [...matchIndices].reverse().find(idx => idx < currentMatchIndex);
    const targetIdx = prevIdx !== undefined ? prevIdx : matchIndices[matchIndices.length - 1]; // Loop back to end
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



  return (
    <div className="bg-[#050505] text-slate-300 font-jetbrains h-[100dvh] overflow-hidden flex flex-col tech-grid relative">
      <style>{styles}</style>

      {/* --- TOP BAR --- */}
      <div className="glass-panel h-14 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowInfoModal(true)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><Menu size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00f3ff] to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)]"><Box size={18} className="text-white" /></div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wider neon-text">LOG VOYAGER <span className="text-[8px] bg-[#0088ff] text-white px-1 rounded ml-1">Log Files Analyzer</span></h1>
              {file && <p className="text-[10px] text-[#00f3ff] font-mono">{file.name} ({formatBytes(fileSize)})</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {file && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="View Settings"
            >
              <Settings size={20} />
            </button>
          )}
          {file && <button onClick={() => setFile(null)} className="text-white/50 hover:text-white transition-colors"><X size={20} /></button>}
        </div>
      </div>

      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
      {showPasteModal && <PasteModal onClose={() => setShowPasteModal(false)} onPaste={processPastedText} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} settings={settings} onUpdate={setSettings} />}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 overflow-hidden relative flex">
        {file ? (
          <>
            <div className="flex-1 flex flex-col min-w-0 relative">
              <div className="p-3 z-10 space-y-2">
                <div className="glass-panel rounded-lg p-2 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-black/40 rounded px-2 border border-white/5 relative group">
                      <Search size={14} className="text-[#00f3ff]" />
                      <input
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
                        {/* CASE SENSITIVE */}
                        <button
                          onClick={() => setCaseSensitive(!caseSensitive)}
                          className={`p-1 rounded text-[10px] font-bold border transition-colors ${caseSensitive ? 'border-[#00f3ff] text-[#00f3ff] bg-[#00f3ff]/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                          title="Match Case"
                        >
                          <CaseSensitive size={14} />
                        </button>

                        {/* REGEX TOGGLE */}
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

                    {/* DOWNLOAD FILTERED VIEW */}
                    {filteredLines.length > 0 && searchTerm && (
                      <button onClick={handleExportView} className="px-3 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Export Current View">
                        <Download size={14} />
                      </button>
                    )}

                    <button onClick={() => setFocusMode(!focusMode)} disabled={!searchTerm} className={`px-3 rounded border flex items-center gap-2 transition-all ${focusMode ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff]' : 'bg-white/5 border-white/10 text-slate-400'}`}>{focusMode ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  </div>
                  <div className="flex items-center gap-3 px-1"><span className="text-[10px] text-[#00f3ff] w-8 font-bold">{percentage.toFixed(0)}%</span><input type="range" min="0" max="100" step="0.1" value={percentage} onChange={handleSlider} className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00f3ff]" /></div>
                </div>
                <div className="flex gap-2 relative">
                  <button onClick={() => setShowBookmarksList(!showBookmarksList)} className={`glass-panel px-3 py-1.5 rounded text-[10px] flex items-center gap-2 transition-all ${showBookmarksList ? 'bg-[#ff00ff]/20 border-[#ff00ff] text-white' : 'text-slate-400 hover:bg-white/10'}`}><Bookmark size={10} className={`${bookmarks.size > 0 ? 'text-[#ff00ff] fill-current' : ''}`} /><span>{bookmarks.size} MARKED</span>{showBookmarksList ? <ArrowDown size={10} /> : <ArrowUp size={10} />}</button>
                  {bookmarks.size > 0 && (<button onClick={() => setBookmarks(new Map())} className="glass-panel px-3 py-1.5 rounded text-[10px] hover:bg-red-500/20 text-slate-400 hover:text-red-400"><Trash2 size={10} /></button>)}
                </div>
                {showBookmarksList && (
                  <div className="absolute top-[110px] left-3 right-3 glass-panel border border-[#ff00ff]/30 rounded-xl z-30 max-h-64 overflow-y-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 sticky top-0 bg-[#0d1117]/95 backdrop-blur border-b border-white/10 text-[10px] font-bold text-[#ff00ff] uppercase tracking-wider mb-1 flex justify-between"><span>Warp Destinations</span><span className="text-slate-500">{bookmarks.size} locs</span></div>
                    {bookmarks.size === 0 ? <div className="p-4 text-center text-xs text-slate-500 italic">No bookmarks yet.</div> : Array.from(bookmarks.values()).sort((a, b) => a.lineNum - b.lineNum).map((bkm) => (<div key={bkm.lineNum} onClick={() => jumpToBookmark(bkm)} className="p-2 border-b border-white/5 hover:bg-[#ff00ff]/10 cursor-pointer group flex gap-3 items-center"><div className="flex flex-col items-end w-12 shrink-0"><span className="text-[#ff00ff] font-bold text-xs">#{bkm.lineNum}</span>{bkm.chunkOffset !== currentOffset && (<span className="text-[9px] text-slate-500 flex items-center gap-0.5"><MapPin size={8} /> WARP</span>)}</div><span className="text-[10px] text-slate-300 font-mono truncate opacity-70 group-hover:opacity-100">{bkm.content}</span></div>))}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto relative scrollbar-hide px-2">
                {isLoading ? <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-20"><div className="flex flex-col items-center gap-2"><div className="w-12 h-1 border-t border-[#00f3ff] animate-ping" /><span className="text-xs text-[#00f3ff] tracking-widest animate-pulse">WARPING...</span></div></div> : <div className="pb-10">{filteredLines.length > 0 ? filteredLines.map((line, i) => { const originalIndex = Math.floor(currentOffset / 50) + i; return <LogLine key={i} id={`line-${originalIndex}`} content={line} number={originalIndex} highlight={searchTerm} isBookmarked={bookmarks.has(originalIndex)} onToggleBookmark={toggleBookmark} settings={settings} useRegex={useRegex} caseSensitive={caseSensitive} />; }) : <div className="text-center py-10 text-slate-500 text-xs">{focusMode ? 'No matches found.' : 'End of chunk.'}</div>}</div>}
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
              <h2 className="text-xl font-bold text-white mb-2 tracking-tight">LOG VOYAGER</h2>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Drop huge log files here.<br />Local processing. Zero latency.</p>

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