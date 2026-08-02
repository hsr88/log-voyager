import { useState, useMemo } from 'react';
import { X, AlertCircle, ChevronDown, ChevronUp, Copy, MapPin } from 'lucide-react';
import { groupSimilarErrors } from '../utils/logAnalysis';

interface ErrorAggregationProps {
  lines: string[];
  offset: number;
  onJumpToLine: (lineNum: number, chunkOffset: number) => void;
  onClose: () => void;
}

export const ErrorAggregation: React.FC<ErrorAggregationProps> = ({
  lines,
  offset,
  onJumpToLine,
  onClose,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [minCount, setMinCount] = useState(1);

  const errorGroups = useMemo(() => {
    const baseIndex = Math.floor(offset / 50);
    return groupSimilarErrors(lines)
      .map(group => ({ ...group, lineNumbers: group.lineIndexes.map(index => baseIndex + index) }))
      .filter(g => g.count >= minCount)
      .sort((a, b) => b.count - a.count);
  }, [lines, offset, minCount]);

  const totalErrors = errorGroups.reduce((sum, g) => sum + g.count, 0);
  const uniqueErrors = errorGroups.length;

  const toggleGroup = (key: string) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setExpandedGroups(newSet);
  };

  const copyErrorSummary = () => {
    const summary = errorGroups
      .map(g => `[${g.level.toUpperCase()}] x${g.count}: ${g.key.substring(0, 80)}`)
      .join('\n');
    navigator.clipboard.writeText(`Error Summary (${uniqueErrors} unique, ${totalErrors} total):\n\n${summary}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-jetbrains">
      <div className="bg-[#0d1117] w-full max-w-3xl max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500" />
            <div>
              <h3 className="font-bold text-white tracking-wider">SIMILAR ERROR GROUPS</h3>
              <p className="text-[10px] text-slate-400">
                {uniqueErrors} signatures • {totalErrors} events in this 50 KB window
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyErrorSummary}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Copy summary"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-3 border-b border-white/10 flex items-center gap-4">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Min Occurrences:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 5, 10].map(n => (
              <button
                key={n}
                onClick={() => setMinCount(n)}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${
                  minCount === n 
                    ? 'bg-[#00f3ff]/20 text-[#00f3ff]' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                ≥{n}
              </button>
            ))}
          </div>
        </div>

        {/* Error List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {errorGroups.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">No errors or warnings found in this window</p>
            </div>
          ) : (
            errorGroups.map((group) => (
              <div
                key={group.key}
                className={`border rounded-lg overflow-hidden ${
                  group.level === 'error' 
                    ? 'border-red-500/30 bg-red-500/5' 
                    : 'border-orange-400/30 bg-orange-400/5'
                }`}
              >
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 transition-colors"
                >
                  {expandedGroups.has(group.key) ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    group.level === 'error' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-orange-400/20 text-orange-400'
                  }`}>
                    {group.level.toUpperCase()}
                  </span>
                  
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                    ×{group.count}
                  </span>
                  
                  <span className="flex-1 text-xs text-slate-300 truncate font-mono">
                    {group.key}
                  </span>
                </button>

                {expandedGroups.has(group.key) && (
                  <div className="border-t border-white/5 p-3 space-y-1 bg-black/20">
                    <div className="text-[10px] text-slate-500 mb-2">Sample:</div>
                    <div className="text-xs text-slate-400 font-mono bg-black/40 p-2 rounded">
                      {group.sample}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 mb-1">
                      Occurrences at lines: {group.lineNumbers.slice(0, 10).join(', ')}
                      {group.lineNumbers.length > 10 && ` (+${group.lineNumbers.length - 10} more)`}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {group.lineNumbers.slice(0, 20).map(lineNum => (
                        <button
                          key={lineNum}
                          onClick={() => onJumpToLine(lineNum, offset)}
                          className="px-2 py-1 rounded text-[10px] bg-white/5 hover:bg-[#00f3ff]/20 text-slate-400 hover:text-[#00f3ff] transition-colors flex items-center gap-1"
                        >
                          <MapPin size={8} />
                          #{lineNum}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
