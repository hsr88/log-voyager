export interface BookmarkData {
  lineNum: number;
  content: string;
  chunkOffset: number;
}

export interface HistoryItem {
  name: string;
  size: string;
  date: string;
}

export interface LogStats {
  totalLines: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  uniqueErrors: Map<string, number>;
  timeRange?: { start: string; end: string };
}

export interface Filter {
  id: string;
  term: string;
  type: 'include' | 'exclude';
  useRegex: boolean;
  caseSensitive: boolean;
  level?: 'error' | 'warn' | 'info' | 'debug' | 'all';
}

export interface Theme {
  name: 'dark' | 'light';
  background: string;
  foreground: string;
  accent: string;
  accentSecondary: string;
  panel: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  logLevels: {
    error: string;
    warn: string;
    info: string;
    debug: string;
  };
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon?: string;
  action: () => void;
  category: string;
}

export interface SplitViewState {
  enabled: boolean;
  primaryOffset: number;
  secondaryOffset: number;
  syncScroll: boolean;
}

export interface HeatmapData {
  position: number;
  intensity: number;
  type: 'error' | 'warn' | 'info' | 'bookmark';
}

export interface Selection {
  lineNumbers: number[];
  contents: string[];
}
