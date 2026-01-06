import React, { useState } from 'react';
import {
    X, Settings, Type, AlignLeft, Box, Cpu, Zap, Shield, Coffee, HelpCircle, Github, Clipboard, Check
} from 'lucide-react';

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

// --- Komponent: Info Modal (WITH KO-FI BUTTON) ---
export const InfoModal = ({ onClose }: { onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'faq'>('about');
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

                    {activeTab === 'faq' && (
                        <div className="space-y-4">
                            <div className="border-b border-white/5 pb-4"><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> Why not use Notepad?</h4><p className="text-xs text-slate-400 leading-relaxed">Standard editors (Notepad, VS Code) try to load the whole file into RAM. For a 2GB file, your device will likely freeze, crash, or heat up significantly. Log Voyager streams the file, using only ~10MB of RAM regardless of the total file size.</p></div>
                            <div className="border-b border-white/5 pb-4"><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> How do I format JSON?</h4><p className="text-xs text-slate-400 leading-relaxed">The app automatically detects JSON objects within log lines. Look for the small "JSON" button next to messy log lines. Clicking it will pretty-print the object into a readable, colored structure.</p></div>
                            <div className="border-b border-white/5 pb-4"><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> What are Bookmarks?</h4><p className="text-xs text-slate-400 leading-relaxed">Click any line number to mark it. Since giant files are hard to navigate, bookmarks save the exact byte-offset position in the file, allowing you to "warp" back to that location instantly later, even if it's gigabytes away.</p></div>
                            <div><h4 className="text-white font-bold mb-1 flex items-center gap-2"><HelpCircle size={14} className="text-[#ff00ff]" /> Is it free?</h4><p className="text-xs text-slate-400 leading-relaxed">Yes, Log Voyager is a completely free, open-source tool for the developer community.</p></div>
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
