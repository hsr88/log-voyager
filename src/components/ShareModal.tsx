// @ts-nocheck
import React, { useState } from 'react';
import { X, Share2, Link, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { uploadSnippet } from '../lib/supabase';

interface ShareModalProps {
    onClose: () => void;
    lines: string[];
    filename: string;
    bookmarks?: Map<number, any>;
    offset?: number;
}

export function ShareModal({ onClose, lines, filename, bookmarks, offset }: ShareModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // --- FILTER LOGIC ---
    let contentToShare = "";
    let lineCount = 0;

    // 1. If bookmarks exist, share ONLY bookmarked lines (sorted)
    if (bookmarks && bookmarks.size > 0 && offset !== undefined) {
        // Filter lines from the current chunk that are bookmarked
        // Global Line Index = offset + localIndex
        const bookmarkedLines = lines
            .map((line, index) => ({ line, index: offset + index }))
            .filter(item => bookmarks.has(item.index));

        if (bookmarkedLines.length > 0) {
            contentToShare = bookmarkedLines.map(item => item.line).join('\n');
            lineCount = bookmarkedLines.length;
        } else {
            // Fallback: Bookmarks might be in another chunk, not visible here.
            // For MVP, we only support sharing visible bookmarks or fallback to full view.
            // Let's fallback to full view but maybe show a warning? 
            // Actually, let's just stick to "Current View" if no visible bookmarks found.
            contentToShare = lines.slice(0, 1000).join('\n');
            lineCount = lines.length > 1000 ? 1000 : lines.length;
        }
    } else {
        // 2. Default: Share current view (max 1000 lines)
        contentToShare = lines.slice(0, 1000).join('\n');
        lineCount = lines.length > 1000 ? 1000 : lines.length;
    }

    const handleShare = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const id = await uploadSnippet({
                content: contentToShare,
                filename: filename,
                metadata: { lineCount }
            });

            if (id) {
                // Generujemy link (używamy obecnego hosta)
                const link = `${window.location.origin}/s/${id}`;
                setGeneratedLink(link);
            } else {
                setError("Failed to upload snippet. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0d1117] border border-white/10 rounded-xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <Share2 size={18} className="text-[#00f3ff]" />
                        Share Incident
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                    {!generatedLink ? (
                        <>
                            <div className="mb-6">
                                <p className="text-slate-300 text-sm mb-4">
                                    You are about to share a snapshot of <strong className="text-white">{filename}</strong>.
                                </p>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex gap-3 text-xs text-yellow-200">
                                    <AlertTriangle size={16} className="shrink-0" />
                                    <div>
                                        This will create a public link containing the first <strong>{lineCount} lines</strong> of your current view.
                                        Anyone with the link can view this content.
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleShare}
                                disabled={isLoading}
                                className="w-full btn-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-black bg-[#00f3ff] hover:bg-[#00c2cc] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                                {isLoading ? "Generating Link..." : "Generate Public Link"}
                            </button>
                        </>
                    ) : (
                        <div className="text-center animate-in zoom-in-50 duration-300">
                            <div className="w-16 h-16 bg-[#00f3ff]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00f3ff]/30">
                                <Check size={32} className="text-[#00f3ff]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Link Generated!</h3>
                            <p className="text-slate-400 text-sm mb-6">Share this link with your team to show them the logs.</p>

                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={generatedLink}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono outline-none focus:border-[#00f3ff]"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/5 flex items-center gap-2"
                                >
                                    {copied ? <Check size={18} className="text-green-400" /> : <Link size={18} />}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
