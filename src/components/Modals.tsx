import { useState } from 'react';
import {
    X, Settings, Type, AlignLeft, Box, Cpu, Zap, Shield, Coffee, HelpCircle, Github, Clipboard, Check, Keyboard, Command, 
    Search, Eye, Bookmark, Monitor, Moon, Sun, Split, Filter, BarChart3, AlertCircle, Columns, Download, Sparkles, Layers
} from 'lucide-react';
import type { KeyboardShortcut } from '../types';
import { formatShortcut } from '../hooks/useKeyboardShortcuts';

// --- Komponent: Settings Modal ---
export const SettingsModal = ({ onClose, settings, onUpdate }: any) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-jetbrains">
            <div className="bg-[#0d1117] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
                    <h3 className="font-bold text-white tracking-wider flex items-center gap-2"><Settings size={18} className="text-[#00f3ff]" /> VIEW SETTINGS</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-6">
                    {/* Font Size */}
                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-3 block flex items-center gap-2"><Type size={14} /> Font Size</label>
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                            {['xs', 'sm', 'base'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => onUpdate({ ...settings, fontSize: size })}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${settings.fontSize === size ? 'bg-[#00f3ff]/20 text-[#00f3ff] shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {size === 'xs' ? 'TINY' : size === 'sm' ? 'NORMAL' : 'LARGE'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Line Wrap */}
                    <div>
                        <label className="text-xs text-slate-500 font-bold uppercase mb-3 block flex items-center gap-2"><AlignLeft size={14} /> Text Wrapping</label>
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                            <button onClick={() => onUpdate({ ...settings, lineWrap: true })} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${settings.lineWrap ? 'bg-[#00f3ff]/20 text-[#00f3ff]' : 'text-slate-500'}`}>WRAP</button>
                            <button onClick={() => onUpdate({ ...settings, lineWrap: false })} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${!settings.lineWrap ? 'bg-[#00f3ff]/20 text-[#00f3ff]' : 'text-slate-500'}`}>NO WRAP</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Komponent: Keyboard Shortcuts Modal ---
interface KeyboardShortcutsModalProps {
    onClose: () => void;
    shortcuts: KeyboardShortcut[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose, shortcuts }) => {
    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
        const category = shortcut.description.includes('search') ? 'Search' :
                        shortcut.description.includes('bookmark') ? 'Bookmarks' :
                        shortcut.description.includes('navigation') ? 'Navigation' :
                        shortcut.description.includes('Export') ? 'Export' :
                        shortcut.description.includes('Split') ? 'View' :
                        shortcut.description.includes('Theme') ? 'View' :
                        'General';
        
        if (!acc[category]) acc[category] = [];
        acc[category].push(shortcut);
        return acc;
    }, {} as Record<string, KeyboardShortcut[]>);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-jetbrains">
            <div className="bg-[#0d1117] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
                    <h3 className="font-bold text-white tracking-wider flex items-center gap-2">
                        <Keyboard size={18} className="text-[#00f3ff]" /> 
                        KEYBOARD SHORTCUTS
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {Object.entries(groupedShortcuts).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                                {category}
                            </h4>
                            <div className="space-y-2">
                                {items.map((shortcut, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                        <span className="text-sm text-slate-300">{shortcut.description}</span>
                                        <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-[#00f3ff] font-mono">
                                            {formatShortcut(shortcut)}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-4 bg-[#161b22] border-t border-white/10 text-center">
                    <p className="text-[10px] text-slate-500">
                        Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Ctrl+K</kbd> to open Command Palette
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- Komponent: Info Modal (WITH KO-FI BUTTON) ---
export const InfoModal = ({ onClose }: { onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'faq' | 'shortcuts' | 'features'>('about');
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-jetbrains">
            <div className="bg-[#0d1117] w-full max-w-md rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
                    <h3 className="font-bold text-white tracking-wider flex items-center gap-2">
                        <Box size={18} className="text-[#00f3ff]" />
                        LOG VOYAGER <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">INFO</span>
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
                        onClick={() => setActiveTab('features')}
                        className={`flex-1 py-3 text-xs font-bold tracking-widest transition-colors ${activeTab === 'features' ? 'text-yellow-400 bg-yellow-400/5 border-b-2 border-yellow-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        FEATURES
                    </button>
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`flex-1 py-3 text-xs font-bold tracking-widest transition-colors ${activeTab === 'faq' ? 'text-[#ff00ff] bg-[#ff00ff]/5 border-b-2 border-[#ff00ff]' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        FAQ
                    </button>
                    <button
                        onClick={() => setActiveTab('shortcuts')}
                        className={`flex-1 py-3 text-xs font-bold tracking-widest transition-colors ${activeTab === 'shortcuts' ? 'text-[#00f3ff] bg-[#00f3ff]/5 border-b-2 border-[#00f3ff]' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        SHORTCUTS
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Cpu size={16} className="text-[#00f3ff]" /> The Mission</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Log Voyager is a specialized tool engineered for DevOps and Backend Developers who need to analyze massive log files (1GB+) on the go.
                                    Standard mobile editors crash when opening gigabyte-sized files due to RAM limits. This tool solves that problem entirely.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> Core Technology</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    We use <strong>File Slicing API</strong>. Instead of loading the entire file into memory (which kills the browser), the application reads it in small, 50KB chunks—just like streaming a video on YouTube. This allows you to open a 100GB log file on an old smartphone with zero latency.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Shield size={16} className="text-emerald-400" /> Privacy & Security</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    <strong>Local Execution Only.</strong> This is the most important feature. Your log files never leave your device. The application runs entirely within your browser's sandbox. No data is uploaded to any server. You can even use this app offline (Airplane Mode) for maximum security.
                                </p>
                            </div>

                            {/* KO-FI BUTTON */}
                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-xs text-slate-400 mb-3">If this tool saved your production deployment:</p>
                                <a
                                    href="https://ko-fi.com/hsr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#FF5E5B] hover:bg-[#ff403d] text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-[0_0_15px_rgba(255,94,91,0.4)] transition-all transform hover:scale-105"
                                >
                                    <Coffee size={16} className="fill-white" /> Buy me a Coffee
                                </a>
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="space-y-5">
                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Zap size={16} className="text-yellow-400" /> 
                                    ⚡ Infinity Scroll Engine
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                    Open files larger than 10GB instantly using File Slicing API. Reads in 50KB chunks like streaming video.
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-[10px] rounded">10GB+ Support</span>
                                    <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-[10px] rounded">~10MB RAM</span>
                                </div>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Search size={16} className="text-[#00f3ff]" /> 
                                    🔍 Smart Search 2.0
                                </h4>
                                <ul className="space-y-1 text-xs text-slate-400">
                                    <li>• <strong>Case Sensitivity:</strong> Match "Error" vs "error"</li>
                                    <li>• <strong>Regex Support:</strong> Full pattern matching</li>
                                    <li>• <strong>Navigation:</strong> Next/Prev match buttons</li>
                                    <li>• <strong>Search History:</strong> Last 10 queries saved</li>
                                </ul>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Filter size={16} className="text-purple-400" /> 
                                    🔀 Multi-Filter System
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Multiple filters with include/exclude logic. Filter by level (Error, Warn, Info, Debug).
                                </p>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Shield size={16} className="text-emerald-400" /> 
                                    🛡️ Privacy First
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    100% Local Execution. Files never leave your device. Works offline.
                                </p>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Layers size={16} className="text-green-400" /> 
                                    🎨 JSON Prettifier
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Auto-detects JSON objects. Click "JSON" button to pretty-print.
                                </p>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Bookmark size={16} className="text-[#ff00ff]" /> 
                                    📍 Warp Jump Bookmarks
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Click line numbers to mark. Jump instantly to any bookmark.
                                </p>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <BarChart3 size={16} className="text-red-400" /> 
                                    🌡️ Heatmap Navigation
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Visual minimap shows errors (red) and warnings (orange).
                                </p>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <AlertCircle size={16} className="text-red-500" /> 
                                    📊 Error Aggregation
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Groups similar errors with occurrence counts.
                                </p>
                            </div>

                            <div className="border-b border-white/5 pb-4">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Command size={16} className="text-cyan-400" /> 
                                    ⌨️ Command Palette
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Press Ctrl+K for quick access to all features.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                    <Sparkles size={16} className="text-amber-400" /> 
                                    📱 Zero Install
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    PWA support - install once, use offline. Works on all devices.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'faq' && (
                        <div className="space-y-4">
                            <div className="border-b border-white/5 pb-4"><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> Why not use Notepad?</h4><p className="text-xs text-slate-400 leading-relaxed">Standard editors (Notepad, VS Code) try to load the whole file into RAM. For a 2GB file, your device will likely freeze, crash, or heat up significantly. Log Voyager streams the file, using only ~10MB of RAM regardless of the total file size.</p></div>
                            <div className="border-b border-white/5 pb-4"><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> How do I format JSON?</h4><p className="text-xs text-slate-400 leading-relaxed">The app automatically detects JSON objects within log lines. Look for the small "JSON" button next to messy log lines. Clicking it will pretty-print the object into a readable, colored structure.</p></div>
                            <div className="border-b border-white/5 pb-4"><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> What are Bookmarks?</h4><p className="text-xs text-slate-400 leading-relaxed">Click any line number to mark it. Since giant files are hard to navigate, bookmarks save the exact byte-offset position in the file, allowing you to "warp" back to that location instantly later, even if it's gigabytes away.</p></div>
                            <div><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> Is it free?</h4><p className="text-xs text-slate-400 leading-relaxed">Yes, Log Voyager is a completely free, open-source tool for the developer community.</p></div>
                        </div>
                    )}

                    {activeTab === 'shortcuts' && (
                        <div className="space-y-4">
                            <div className="border-b border-white/5 pb-3">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Command size={14} className="text-[#00f3ff]" /> Command Palette</h4>
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-xs text-slate-400">Open Command Palette</span>
                                    <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">Ctrl+K</kbd>
                                </div>
                            </div>
                            <div className="border-b border-white/5 pb-3">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Zap size={14} className="text-yellow-400" /> Search & Navigation</h4>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Focus search</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">/</kbd>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Next match</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">Enter</kbd>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Previous match</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">Shift+Enter</kbd>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-white/5 pb-3">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Box size={14} className="text-emerald-400" /> View</h4>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Toggle theme</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">Ctrl+Shift+L</kbd>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Toggle split view</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">Ctrl+\\</kbd>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Show settings</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">Ctrl+,</kbd>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Keyboard size={14} className="text-purple-400" /> Bookmarks</h4>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Toggle bookmark on line</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">Click line #</kbd>
                                    </div>
                                    <div className="flex items-center justify-between py-1">
                                        <span className="text-xs text-slate-400">Jump to bookmark</span>
                                        <kbd className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-[#00f3ff]">B (then number)</kbd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#161b22] border-t border-white/10 text-center flex flex-col items-center gap-2">
                    <a href="https://github.com/hsr88/log-voyager" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <Github size={20} />
                    </a>
                    <p className="text-[10px] text-slate-500 font-mono">&copy; 2026 logvoyager.cc</p>
                </div>
            </div>
        </div>
    );
};

// --- Komponent: Paste Modal (Fallback) ---
export const PasteModal = ({ onClose, onPaste }: { onClose: () => void, onPaste: (text: string) => void }) => {
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
                        onClick={() => { if (text) onPaste(text); }}
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

// --- Komponent: Export Selection Modal ---
interface ExportSelectionModalProps {
    onClose: () => void;
    selectedLines: { number: number; content: string }[];
    onExport: (format: 'txt' | 'json' | 'csv') => void;
}

export const ExportSelectionModal: React.FC<ExportSelectionModalProps> = ({ 
    onClose, 
    selectedLines, 
    onExport 
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-jetbrains">
            <div className="bg-[#0d1117] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
                    <h3 className="font-bold text-white tracking-wider flex items-center gap-2">
                        <Clipboard size={18} className="text-[#00f3ff]" /> 
                        EXPORT SELECTION
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[#00f3ff] mb-1">
                            {selectedLines.length}
                        </div>
                        <div className="text-xs text-slate-500">lines selected</div>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={() => onExport('txt')}
                            className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-[#00f3ff]/10 border border-white/10 hover:border-[#00f3ff]/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-400">TXT</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-white font-bold">Plain Text</div>
                                <div className="text-xs text-slate-400">Export as .log or .txt file</div>
                            </div>
                        </button>

                        <button
                            onClick={() => onExport('json')}
                            className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-[#00f3ff]/10 border border-white/10 hover:border-[#00f3ff]/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-yellow-400">JSON</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-white font-bold">JSON Format</div>
                                <div className="text-xs text-slate-400">Structured data with line numbers</div>
                            </div>
                        </button>

                        <button
                            onClick={() => onExport('csv')}
                            className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-[#00f3ff]/10 border border-white/10 hover:border-[#00f3ff]/30 transition-all"
                        >
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-green-400">CSV</span>
                            </div>
                            <div className="flex-1 text-left">
                                <div className="text-sm text-white font-bold">CSV Spreadsheet</div>
                                <div className="text-xs text-slate-400">For Excel or data analysis</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
