// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSnippet } from './lib/supabase';
import type { LogSnippet } from './lib/supabase';
import { Loader2, AlertTriangle } from 'lucide-react';
import LogLine from './components/LogLine';
import Minimap from './components/Minimap';

// Reusing styles from App.tsx (ideally should be shared)
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
  .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
  .tech-grid {
    background-color: #050505;
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #050505; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #00f3ff; }
`;

export default function SharedViewer() {
    const { id } = useParams<{ id: string }>();
    const [snippet, setSnippet] = useState<LogSnippet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lines, setLines] = useState<string[]>([]);

    // Settings for LogLine (defaults for viewer)
    const settings = { fontSize: 'xs', lineWrap: true };

    useEffect(() => {
        async function fetchSnippet() {
            if (!id) return;
            setLoading(true);
            const data = await getSnippet(id);

            if (data) {
                setSnippet(data);
                setLines(data.content.split('\n'));
            } else {
                setError('Snippet not found or expired.');
            }
            setLoading(false);
        }
        fetchSnippet();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#00f3ff]">
                <Loader2 size={48} className="animate-spin" />
            </div>
        );
    }

    if (error || !snippet) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-slate-400 p-6">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-white mb-2">Error 404: Incident Not Found</h1>
                <p className="mb-6">{error || "This shared link is invalid."}</p>
                <Link to="/" className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] text-slate-300 font-jetbrains h-[100dvh] overflow-hidden flex flex-col tech-grid relative">
            <style>{styles}</style>

            {/* --- READ ONLY HEADER --- */}
            <div className="h-14 border-b border-white/10 bg-[#0d1117] flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <Link to="/" className="w-8 h-8 rounded bg-gradient-to-br from-[#00f3ff] to-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity">
                        <img src="/lv_new.png" alt="Log Voyager" className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-bold text-white tracking-wider">SHARED INCIDENT</h1>
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/30">READ ONLY</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">File: {snippet.filename} • {new Date(snippet.created_at || '').toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link to="/app" className="px-4 py-1.5 bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] text-xs font-bold rounded hover:bg-[#00f3ff]/20 transition-colors">
                        OPEN IN APP
                    </Link>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 overflow-hidden relative flex">
                <div className="flex-1 overflow-y-auto relative scrollbar-hide px-2">
                    <div className="pb-10 pt-2">
                        {lines.map((line, i) => (
                            <LogLine
                                key={i}
                                id={`line-${i}`}
                                content={line}
                                number={i + 1}
                                highlight=""
                                isBookmarked={false}
                                onToggleBookmark={() => { }}
                                settings={settings}
                                useRegex={false}
                                caseSensitive={false}
                            />
                        ))}
                    </div>
                </div>
                <Minimap lines={lines} bookmarks={new Map()} offset={0} />
            </div>
        </div>
    );
}
