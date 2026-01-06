import React from 'react';
import type { BookmarkData } from '../types';
import { getLogLevel } from '../utils/helpers';

interface MinimapProps {
    lines: string[];
    bookmarks: Map<number, BookmarkData>;
    offset: number;
}

const Minimap = ({ lines, bookmarks, offset }: MinimapProps) => (
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

export default Minimap;
