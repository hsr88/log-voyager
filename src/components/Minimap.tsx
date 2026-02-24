import { useMemo } from 'react';
import type { BookmarkData, HeatmapData } from '../types';
import { getLogLevel } from '../utils/helpers';

interface MinimapProps {
    lines: string[];
    bookmarks: Map<number, BookmarkData>;
    offset: number;
    fileSize?: number;
    showHeatmap?: boolean;
    onPositionClick?: (percentage: number) => void;
}

const Minimap = ({ 
    lines, 
    bookmarks, 
    offset, 
    fileSize = 0,
    showHeatmap = true,
    onPositionClick 
}: MinimapProps) => {
    const heatmapData = useMemo(() => {
        if (!showHeatmap || lines.length === 0) return [];
        
        const data: HeatmapData[] = [];
        const baseIndex = Math.floor(offset / 50);
        
        lines.forEach((line, i) => {
            const globalIndex = baseIndex + i;
            const level = getLogLevel(line);
            
            if (level === 'error') {
                data.push({
                    position: i,
                    intensity: 1,
                    type: 'error'
                });
            } else if (level === 'warn') {
                data.push({
                    position: i,
                    intensity: 0.7,
                    type: 'warn'
                });
            } else if (bookmarks.has(globalIndex)) {
                data.push({
                    position: i,
                    intensity: 1,
                    type: 'bookmark'
                });
            }
        });
        
        return data;
    }, [lines, bookmarks, offset, showHeatmap]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!onPositionClick || lines.length === 0) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const percentage = (y / rect.height) * 100;
        
        onPositionClick(percentage);
    };

    return (
        <div 
            className="w-4 h-full bg-[#050505] border-l border-white/5 flex flex-col shrink-0 py-1 gap-[1px] overflow-hidden relative cursor-pointer hover:w-5 transition-all"
            onClick={handleClick}
            title="Click to jump to position"
        >
            {/* Heatmap overlay */}
            {showHeatmap && heatmapData.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                    {heatmapData.map((point, i) => {
                        const top = (point.position / lines.length) * 100;
                        let bgColor = '';
                        let shadow = '';
                        
                        switch (point.type) {
                            case 'error':
                                bgColor = `rgba(239, 68, 68, ${0.6 + point.intensity * 0.4})`;
                                shadow = '0 0 4px rgba(239, 68, 68, 0.5)';
                                break;
                            case 'warn':
                                bgColor = `rgba(251, 146, 60, ${0.5 + point.intensity * 0.3})`;
                                shadow = '0 0 2px rgba(251, 146, 60, 0.3)';
                                break;
                            case 'bookmark':
                                bgColor = 'rgba(255, 0, 255, 0.9)';
                                shadow = '0 0 6px rgba(255, 0, 255, 0.8)';
                                break;
                        }
                        
                        return (
                            <div
                                key={i}
                                className="absolute w-full h-[3px] rounded-full"
                                style={{
                                    top: `${top}%`,
                                    backgroundColor: bgColor,
                                    boxShadow: shadow,
                                    transform: 'translateY(-50%)',
                                    zIndex: point.type === 'bookmark' ? 10 : 5,
                                }}
                            />
                        );
                    })}
                </div>
            )}
            
            {/* Regular minimap bars */}
            {lines.map((line, i) => {
                const globalIndex = Math.floor(offset / 50) + i;
                const level = getLogLevel(line);
                let color = 'bg-slate-800';
                
                if (bookmarks.has(globalIndex)) {
                    color = 'bg-[#ff00ff] shadow-[0_0_4px_#ff00ff] z-10';
                } else if (level === 'error') {
                    color = 'bg-red-500';
                } else if (level === 'warn') {
                    color = 'bg-orange-400';
                } else if (level === 'info') {
                    color = 'bg-blue-500/30';
                }
                
                return (
                    <div 
                        key={i} 
                        className={`h-[2px] w-full ${color} hover:opacity-70 transition-opacity`}
                        title={`Line ${globalIndex}`}
                    />
                );
            })}
        </div>
    );
};

export default Minimap;
