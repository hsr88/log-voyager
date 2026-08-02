import { useMemo } from 'react';
import { X, BarChart3, Clock, FileText, AlertTriangle, AlertOctagon, Info, Bug, FileJson, ScanSearch } from 'lucide-react';
import type { LogStats as LogStatsType } from '../types';
import { buildTimeline, detectLogFormat, getLogLevel, groupSimilarErrors, parseLogTimestamp } from '../utils/logAnalysis';

interface LogStatsProps {
  lines: string[];
  offset: number;
  fileSize: number;
  fileName: string;
  onJumpToLine: (lineNum: number) => void;
  onClose: () => void;
}

export const LogStats: React.FC<LogStatsProps> = ({
  lines,
  offset,
  fileSize,
  fileName,
  onJumpToLine,
  onClose,
}) => {
  const detectedFormat = useMemo(() => detectLogFormat(lines, fileName), [lines, fileName]);
  const timeline = useMemo(() => buildTimeline(lines), [lines]);
  const errorGroups = useMemo(() => groupSimilarErrors(lines), [lines]);
  const stats = useMemo<LogStatsType>(() => {
    let errorCount = 0;
    let warnCount = 0;
    let infoCount = 0;
    let debugCount = 0;
    const uniqueErrors = new Map(errorGroups.map(group => [group.key, group.count]));
    let firstTimestamp: string | null = null;
    let lastTimestamp: string | null = null;

    lines.forEach(line => {
      // Count levels
      const level = getLogLevel(line);
      if (level === 'error') {
        errorCount++;
      } else if (level === 'warn') {
        warnCount++;
      } else if (level === 'info') {
        infoCount++;
      } else if (level === 'debug') {
        debugCount++;
      }

      // Extract timestamps
      const timestamp = parseLogTimestamp(line);
      if (timestamp !== null) {
        const formatted = new Date(timestamp).toLocaleString();
        if (!firstTimestamp) firstTimestamp = formatted;
        lastTimestamp = formatted;
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
  }, [lines, errorGroups]);

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
  const maxTimelineCount = Math.max(1, ...timeline.map(bucket => bucket.count));
  const formatTime = (value: number) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-jetbrains">
      <div className="bg-[#0d1117] w-full max-w-2xl max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#161b22]">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-[#00f3ff]" />
            <div>
              <h3 className="font-bold text-white tracking-wider">EVENT TIMELINE</h3>
              <p className="text-[10px] text-slate-400">Format detection and activity in the current 50 KB window</p>
            </div>
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

          {/* Automatic format detection */}
          <div className="bg-[#00f3ff]/5 rounded-lg p-4 border border-[#00f3ff]/20 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-[#00f3ff] uppercase font-bold mb-2">
                <ScanSearch size={12} /> Automatically detected format
              </div>
              <div className="text-base text-white font-semibold">{detectedFormat.label}</div>
              <div className="text-xs text-slate-400 mt-1">{detectedFormat.description}</div>
            </div>
            <span className="shrink-0 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/20 px-2.5 py-1 text-[10px] font-bold text-[#00f3ff]">
              {Math.round(detectedFormat.confidence * 100)}% confidence
            </span>
          </div>

          {/* Event timeline */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                <Clock size={12} /> Events over time
              </div>
              {timeline.length > 0 && <span className="text-[10px] text-slate-500">Click a bar to jump</span>}
            </div>
            {timeline.length > 0 ? (
              <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                <div className="h-40 flex items-end gap-1" role="img" aria-label="Log event timeline histogram">
                  {timeline.map((bucket, index) => (
                    <button
                      key={`${bucket.start}-${index}`}
                      type="button"
                      disabled={bucket.count === 0}
                      onClick={() => bucket.firstLineIndex >= 0 && onJumpToLine(baseIndex + bucket.firstLineIndex)}
                      className="group relative flex-1 h-full flex items-end rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f3ff] disabled:cursor-default"
                      title={`${formatTime(bucket.start)} - ${formatTime(bucket.end)}: ${bucket.count} events, ${bucket.errors} errors, ${bucket.warnings} warnings`}
                    >
                      <span
                        className={`block w-full min-h-[2px] rounded-t-sm transition-all group-hover:brightness-125 ${bucket.errors > 0 ? 'bg-red-500' : bucket.warnings > 0 ? 'bg-orange-400' : 'bg-[#00f3ff]/70'}`}
                        style={{ height: `${Math.max(2, (bucket.count / maxTimelineCount) * 100)}%` }}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>{formatTime(timeline[0].start)}</span>
                  <span>{formatTime(timeline[timeline.length - 1].end)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-slate-400">
                  <span><i className="inline-block w-2 h-2 rounded-sm bg-[#00f3ff]/70 mr-1" /> events</span>
                  <span><i className="inline-block w-2 h-2 rounded-sm bg-orange-400 mr-1" /> warnings</span>
                  <span><i className="inline-block w-2 h-2 rounded-sm bg-red-500 mr-1" /> errors</span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 p-5 text-center text-xs text-slate-500">
                No supported timestamps found in this window. The format is still searchable as text.
              </div>
            )}
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
