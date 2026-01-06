import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { getLogLevel } from '../utils/helpers';

interface LogLineProps {
    content: string;
    number: number;
    highlight: string;
    isBookmarked: boolean;
    onToggleBookmark: (lineNum: number, content: string) => void;
    id: string;
    settings: { fontSize: string; lineWrap: boolean };
    useRegex: boolean;
    caseSensitive: boolean;
}

const LogLine = ({ content, number, highlight, isBookmarked, onToggleBookmark, id, settings, useRegex, caseSensitive }: LogLineProps) => {
    const level = getLogLevel(content);
    const [isExpanded, setIsExpanded] = useState(false);
    const jsonMatch = content.match(/(\{.*\})/);

    const renderContent = () => {
        if (!highlight) return <span className="text-slate-400">{content}</span>;
        let parts = [];
        if (useRegex) {
            try { parts = content.split(new RegExp(`(${highlight})`, caseSensitive ? 'g' : 'gi')); } catch (e) { return <span className="text-slate-400">{content}</span>; }
        } else {
            const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            parts = content.split(new RegExp(`(${escapedHighlight})`, caseSensitive ? 'g' : 'gi'));
        }
        return parts.map((part: string, i: number) => {
            const isMatch = useRegex
                ? new RegExp(highlight, caseSensitive ? '' : 'i').test(part)
                : (caseSensitive ? part === highlight : part.toLowerCase() === highlight.toLowerCase());
            return isMatch ? <span key={i} className="bg-[#00f3ff] text-black font-bold px-1 rounded-sm">{part}</span> : <span key={i} className="text-slate-400">{part}</span>
        });
    };

    const formatJson = () => { try { return JSON.stringify(JSON.parse(jsonMatch![0]), null, 2); } catch (e) { return null; } };

    let lineStyle = 'border-l-2 border-transparent hover:bg-white/5';
    let numStyle = 'text-slate-600 hover:text-[#00f3ff] cursor-pointer';
    if (level === 'error') { lineStyle = 'border-l-2 border-red-500 bg-red-500/5 hover:bg-red-500/10'; numStyle = 'text-red-500 font-bold cursor-pointer'; }
    else if (level === 'warn') { lineStyle = 'border-l-2 border-orange-400 bg-orange-400/5 hover:bg-orange-400/10'; numStyle = 'text-orange-400 cursor-pointer'; }
    if (isBookmarked) { lineStyle += ' bg-[#ff00ff]/10'; numStyle = 'text-[#ff00ff] font-bold cursor-pointer'; }

    const fontSizeClass = settings.fontSize === 'xs' ? 'text-[10px] md:text-xs' : settings.fontSize === 'sm' ? 'text-xs md:text-sm' : 'text-sm md:text-base';
    const wrapClass = settings.lineWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-nowrap';

    return (
        <div id={id} className={`flex ${fontSizeClass} font-jetbrains leading-relaxed py-0.5 ${lineStyle} transition-colors group`}>
            <div className={`w-12 shrink-0 text-right pr-3 select-none flex justify-end gap-1 ${numStyle}`} onClick={() => onToggleBookmark(number, content)}>{isBookmarked && <Bookmark size={10} className="mt-0.5 fill-current" />}{number}</div>
            <div className={`flex-1 min-w-0 ${wrapClass}`}>
                {renderContent()}{jsonMatch && (<div className="inline-block ml-2"><button onClick={() => setIsExpanded(!isExpanded)} className="text-[9px] uppercase font-bold text-[#00f3ff] hover:text-white border border-[#00f3ff]/30 px-1.5 rounded hover:bg-[#00f3ff]/20 transition-all">{isExpanded ? 'RAW' : 'JSON'}</button></div>)}{isExpanded && <pre className="mt-2 p-3 bg-black/80 rounded border border-white/10 text-[#00f3ff] overflow-x-auto shadow-2xl whitespace-pre">{formatJson() || "Invalid JSON"}</pre>}
            </div>
        </div>
    );
};

export default LogLine;
