import { useMemo } from 'react';
import { X, BarChart3, Clock, FileText, AlertTriangle, AlertOctagon, Info, Bug, FileJson } from 'lucide-react';
import type { LogStats as LogStatsType } from '../types';

interface LogStatsProps {
  lines: string[];
  offset: number;
  fileSize: number;
  fileName: string;
  onClose: () => void;
}

export const LogStats: React.FC<LogStatsProps> = ({
  lines,
  offset,
  fileSize,
  fileName,
  onClose,
}) => {
  const stats = useMemo<LogStatsType>(() => {
    let errorCount = 0;
    let warnCount = 0;
    let infoCount = 0;
    let debugCount = 0;
    const uniqueErrors = new Map<string, number>();
    let firstTimestamp: string | null = null;
    let lastTimestamp: string | null = null;

    const timestampRegex = /(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}[\.,]?\d*)/;

    lines.forEach(line => {
      // Count levels
      if (/\b(error|exception|fail|failed|fatal|crash)\b/i.test(line)) {
        errorCount++;
        // Extract error signature
        const match = line.match(/([A-Za-z]+Error|Exception):\s*(.+?)(?:\n|$)/);
        if (match) {
          const key = match[1] + ': ' + match[2].substring(0, 50);
          uniqueErrors.set(key, (uniqueErrors.get(key) || 0) + 1);
        }
      } else if (/\b(warn|warning|caution)\b/i.test(line)) {
        warnCount++;
      } else if (/\b(info|information)\b/i.test(line)) {
        infoCount++;
      } else if (/\b(debug|trace)\b/i.test(line)) {
        debugCount++;
      }

      // Extract timestamps
      const tsMatch = line.match(timestampRegex);
      if (tsMatch) {
        if (!firstTimestamp) firstTimestamp = tsMatch[1];
        lastTimestamp = tsMatch[1];
      }
    });

    return {
      totalLines: lines.length,
      errorCount,
      warnCount,
      infoCount,
      debugCount,
      uniqueErrors,
      timeRange: firstTimestamp && lastTimestamp 
        ? { start: firstTimestamp, end: lastTimestamp }
        : undefined,
    };
  }, [lines]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const topErrors = Array.from(stats.uniqueErrors.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const baseIndex = Math.floor(offset / 50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-jetbrains">
      <div className="bg-[#0d1117] w-full max-w-2xl max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-[#00f3ff]" />
            <h3 className="font-bold text-white tracking-wider">LOG STATISTICS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* File Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold mb-2">
                <FileText size={12} />
                File
              </div>
              <div className="text-sm text-white font-mono truncate" title={fileName}>
                {fileName}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {formatBytes(fileSize)}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold mb-2">
                <FileJson size={12} />
                Chunk Info
              </div>
              <div className="text-sm text-white">
                {stats.totalLines.toLocaleString()} lines
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Offset: {formatBytes(offset)}
              </div>
            </div>
          </div>

          {/* Time Range */}
          {stats.timeRange && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold mb-3">
                <Clock size={12} />
                Time Range (Detected)
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <div className="text-[10px] text-slate-500">Start</div>
                  <div className="text-[#00f3ff] font-mono">{stats.timeRange.start}</div>
                </div>
                <div className="text-slate-600">→</div>
                <div>
                  <div className="text-[10px] text-slate-500">End</div>
                  <div className="text-[#00f3ff] font-mono">{stats.timeRange.end}</div>
                </div>
              </div>
            </div>
          )}

          {/* Level Distribution */}
          <div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold mb-3">
              <BarChart3 size={12} />
              Level Distribution (Current Chunk)
            </div>
            
            <div className="space-y-3">
              {/* Error */}
              <div className="flex items-center gap-3">
                <div className="w-20 flex items-center gap-2 text-xs text-red-400">
                  <AlertOctagon size={14} />
                  Error
                </div>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500/80 transition-all"
                    style={{ 
                      width: `${stats.totalLines > 0 ? (stats.errorCount / stats.totalLines) * 100 : 0}%` 
                    }}
                  />
                </div>
                <div className="w-16 text-right text-sm text-white">
                  {stats.errorCount.toLocaleString()}
                </div>
                <div className="w-12 text-right text-xs text-slate-500">
                  {stats.totalLines > 0 ? ((stats.errorCount / stats.totalLines) * 100).toFixed(1) : 0}%
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-center gap-3">
                <div className="w-20 flex items-center gap-2 text-xs text-orange-400">
                  <AlertTriangle size={14} />
                  Warn
                </div>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-400/80 transition-all"
                    style={{ 
                      width: `${stats.totalLines > 0 ? (stats.warnCount / stats.totalLines) * 100 : 0}%` 
                    }}
                  />
                </div>
                <div className="w-16 text-right text-sm text-white">
                  {stats.warnCount.toLocaleString()}
                </div>
                <div className="w-12 text-right text-xs text-slate-500">
                  {stats.totalLines > 0 ? ((stats.warnCount / stats.totalLines) * 100).toFixed(1) : 0}%
                </div>
              </div>

              {/* Info */}
              <div className="flex items-center gap-3">
                <div className="w-20 flex items-center gap-2 text-xs text-blue-400">
                  <Info size={14} />
                  Info
                </div>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500/80 transition-all"
                    style={{ 
                      width: `${stats.totalLines > 0 ? (stats.infoCount / stats.totalLines) * 100 : 0}%` 
                    }}
                  />
                </div>
                <div className="w-16 text-right text-sm text-white">
                  {stats.infoCount.toLocaleString()}
                </div>
                <div className="w-12 text-right text-xs text-slate-500">
                  {stats.totalLines > 0 ? ((stats.infoCount / stats.totalLines) * 100).toFixed(1) : 0}%
                </div>
              </div>

              {/* Debug */}
              <div className="flex items-center gap-3">
                <div className="w-20 flex items-center gap-2 text-xs text-slate-400">
                  <Bug size={14} />
                  Debug
                </div>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-500/80 transition-all"
                    style={{ 
                      width: `${stats.totalLines > 0 ? (stats.debugCount / stats.totalLines) * 100 : 0}%` 
                    }}
                  />
                </div>
                <div className="w-16 text-right text-sm text-white">
                  {stats.debugCount.toLocaleString()}
                </div>
                <div className="w-12 text-right text-xs text-slate-500">
                  {stats.totalLines > 0 ? ((stats.debugCount / stats.totalLines) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Top Errors */}
          {topErrors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold mb-3">
                <AlertOctagon size={12} />
                Top Errors in Chunk
              </div>
              <div className="space-y-2">
                {topErrors.map(([error, count], idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-red-500/5 rounded p-2 border border-red-500/20">
                    <span className="text-xs text-red-400 font-bold min-w-[3rem]">×{count}</span>
                    <span className="text-xs text-slate-300 font-mono truncate flex-1">{error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
