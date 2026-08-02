export type LogFormatId =
  | 'docker-json'
  | 'kubernetes-cri'
  | 'jsonl'
  | 'nginx-access'
  | 'nginx-error'
  | 'apache-access'
  | 'apache-error'
  | 'syslog'
  | 'structured-text'
  | 'plain-text';

export interface DetectedLogFormat {
  id: LogFormatId;
  label: string;
  confidence: number;
  description: string;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'default';

export interface TimelineBucket {
  start: number;
  end: number;
  count: number;
  errors: number;
  warnings: number;
  firstLineIndex: number;
}

export interface ErrorGroupData {
  key: string;
  count: number;
  sample: string;
  lineIndexes: number[];
  level: 'error' | 'warn';
}

const FORMAT_DETAILS: Record<LogFormatId, Omit<DetectedLogFormat, 'confidence'>> = {
  'docker-json': { id: 'docker-json', label: 'Docker JSON', description: 'Docker json-file records' },
  'kubernetes-cri': { id: 'kubernetes-cri', label: 'Kubernetes CRI', description: 'CRI container log records' },
  jsonl: { id: 'jsonl', label: 'JSON / JSONL', description: 'Newline-delimited structured records' },
  'nginx-access': { id: 'nginx-access', label: 'Nginx access', description: 'Nginx access-log request records' },
  'nginx-error': { id: 'nginx-error', label: 'Nginx error', description: 'Nginx diagnostic records' },
  'apache-access': { id: 'apache-access', label: 'Apache access', description: 'Apache HTTP access records' },
  'apache-error': { id: 'apache-error', label: 'Apache error', description: 'Apache module diagnostics' },
  syslog: { id: 'syslog', label: 'Syslog', description: 'RFC 3164 or RFC 5424-style messages' },
  'structured-text': { id: 'structured-text', label: 'Structured text', description: 'Timestamped application records' },
  'plain-text': { id: 'plain-text', label: 'Plain text', description: 'Unstructured text log' },
};

const accessPattern = /^\S+\s+\S+\s+\S+\s+\[[^\]]+\]\s+"(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT)\s+\S+(?:\s+HTTP\/\d(?:\.\d)?)?"\s+\d{3}\b/i;
const nginxErrorPattern = /^\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\s+\[(?:debug|info|notice|warn|error|crit|alert|emerg)\]/i;
const apacheErrorPattern = /^\[[A-Z][a-z]{2}\s+[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?\s+\d{4}\]\s+\[[^\]]+:(?:debug|info|notice|warn|error|crit|alert|emerg)\]/i;
const criPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z\s+(?:stdout|stderr)\s+[FP]\s/;
const syslogPattern = /^(?:<\d{1,3}>\d\s+\d{4}-\d{2}-\d{2}T|[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}\s+)/;
const structuredPattern = /\d{4}[-\/]\d{2}[-\/]\d{2}[T ]\d{2}:\d{2}:\d{2}/;
const ansiColorPattern = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');

export function detectLogFormat(lines: string[], fileName = ''): DetectedLogFormat {
  const sample = lines.filter(line => line.trim()).slice(0, 500);
  if (sample.length === 0) return { ...FORMAT_DETAILS['plain-text'], confidence: 0 };

  const counts: Partial<Record<LogFormatId, number>> = {};
  const add = (id: LogFormatId, amount = 1) => { counts[id] = (counts[id] || 0) + amount; };

  for (const line of sample) {
    const trimmed = line.trim();
    if (criPattern.test(trimmed)) add('kubernetes-cri');
    if (accessPattern.test(trimmed)) add(/apache/i.test(fileName) ? 'apache-access' : 'nginx-access');
    if (nginxErrorPattern.test(trimmed)) add('nginx-error');
    if (apacheErrorPattern.test(trimmed)) add('apache-error');
    if (syslogPattern.test(trimmed)) add('syslog');
    if (structuredPattern.test(trimmed)) add('structured-text', 0.65);

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>;
        if ('log' in parsed && 'stream' in parsed && ('time' in parsed || 'timestamp' in parsed)) add('docker-json', 1.4);
        else add('jsonl');
      } catch {
        // A JSON-looking line that does not parse should not affect detection.
      }
    }
  }

  const lowerName = fileName.toLowerCase();
  if (/access(?:\.log)?(?:\.gz)?$/.test(lowerName)) add(/apache|httpd/.test(lowerName) ? 'apache-access' : 'nginx-access', sample.length * 0.12);
  if (/error(?:\.log)?(?:\.gz)?$/.test(lowerName)) add(/apache|httpd/.test(lowerName) ? 'apache-error' : 'nginx-error', sample.length * 0.12);
  if (/syslog|messages|journal/.test(lowerName)) add('syslog', sample.length * 0.12);
  if (/\.jsonl?$|\.ndjson$/.test(lowerName)) add('jsonl', sample.length * 0.12);

  const ranked = Object.entries(counts)
    .map(([id, score]) => ({ id: id as LogFormatId, score: score || 0 }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score < Math.max(2, sample.length * 0.08)) {
    return { ...FORMAT_DETAILS['plain-text'], confidence: 0.45 };
  }

  return {
    ...FORMAT_DETAILS[best.id],
    confidence: Math.min(0.99, Math.max(0.5, best.score / sample.length)),
  };
}

export function getLogLevel(line: string): LogLevel {
  const lower = line.toLowerCase();
  if (/\b(error|exception|failed|failure|fatal|panic|critical|crit|emerg|alert)\b/.test(lower) || /"status"\s*:\s*5\d{2}/.test(lower)) return 'error';
  if (/\b(warn|warning)\b/.test(lower)) return 'warn';
  if (/\b(info|notice)\b/.test(lower)) return 'info';
  if (/\b(debug|trace)\b/.test(lower)) return 'debug';
  return 'default';
}

const monthIndex: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function dateFromValue(value: unknown): number | null {
  if (typeof value === 'number') {
    const millis = value < 10_000_000_000 ? value * 1000 : value;
    return Number.isFinite(millis) ? millis : null;
  }
  if (typeof value !== 'string') return null;
  const parsed = Date.parse(value.replace(/(\.\d{3})\d+/, '$1'));
  return Number.isNaN(parsed) ? null : parsed;
}

export function parseLogTimestamp(line: string): number | null {
  const trimmed = line.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>;
      for (const key of ['timestamp', '@timestamp', 'time', 'datetime', 'date', 'ts']) {
        const date = dateFromValue(parsed[key]);
        if (date !== null) return date;
      }
    } catch {
      // Continue with text timestamp patterns.
    }
  }

  const iso = line.match(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:[.,]\d+)?(?:Z|[+-]\d{2}:?\d{2})?/);
  if (iso) {
    const normalized = iso[0].replace(' ', 'T').replace(',', '.').replace(/(\.\d{3})\d+/, '$1');
    const parsed = Date.parse(normalized);
    if (!Number.isNaN(parsed)) return parsed;
  }

  const nginx = line.match(/(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (nginx) return new Date(+nginx[1], +nginx[2] - 1, +nginx[3], +nginx[4], +nginx[5], +nginx[6]).getTime();

  const access = line.match(/\[(\d{1,2})\/([A-Z][a-z]{2})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})\s+([+-])(\d{2})(\d{2})\]/);
  if (access) {
    const utc = Date.UTC(+access[3], monthIndex[access[2]], +access[1], +access[4], +access[5], +access[6]);
    const offset = (+access[8] * 60 + +access[9]) * 60_000 * (access[7] === '+' ? 1 : -1);
    return utc - offset;
  }

  const apache = line.match(/^\[[A-Z][a-z]{2}\s+([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?\s+(\d{4})\]/);
  if (apache) return new Date(+apache[6], monthIndex[apache[1]], +apache[2], +apache[3], +apache[4], +apache[5]).getTime();

  const syslog = line.match(/^([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (syslog) return new Date(new Date().getFullYear(), monthIndex[syslog[1]], +syslog[2], +syslog[3], +syslog[4], +syslog[5]).getTime();

  return null;
}

export function buildTimeline(lines: string[], maxBuckets = 32): TimelineBucket[] {
  const events = lines
    .map((line, lineIndex) => ({ timestamp: parseLogTimestamp(line), lineIndex, level: getLogLevel(line) }))
    .filter((event): event is { timestamp: number; lineIndex: number; level: LogLevel } => event.timestamp !== null);
  if (events.length < 2) return [];

  const start = Math.min(...events.map(event => event.timestamp));
  const end = Math.max(...events.map(event => event.timestamp));
  const bucketCount = Math.min(maxBuckets, Math.max(1, Math.ceil(Math.sqrt(events.length) * 2)));
  const duration = Math.max(1, end - start + 1);
  const width = duration / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, index): TimelineBucket => ({
    start: start + index * width,
    end: start + (index + 1) * width,
    count: 0,
    errors: 0,
    warnings: 0,
    firstLineIndex: -1,
  }));

  for (const event of events) {
    const index = Math.min(bucketCount - 1, Math.floor((event.timestamp - start) / width));
    const bucket = buckets[index];
    bucket.count += 1;
    if (event.level === 'error') bucket.errors += 1;
    if (event.level === 'warn') bucket.warnings += 1;
    if (bucket.firstLineIndex === -1) bucket.firstLineIndex = event.lineIndex;
  }
  return buckets;
}

function extractMessage(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>;
      for (const key of ['message', 'msg', 'error', 'exception', 'log']) {
        if (typeof parsed[key] === 'string') return parsed[key] as string;
      }
    } catch {
      // Use the original text when JSON parsing fails.
    }
  }
  return line;
}

export function normalizeErrorSignature(line: string): string {
  return extractMessage(line)
    .replace(ansiColorPattern, '')
    .replace(/\d{4}[-\/]\d{2}[-\/]\d{2}[T ]\d{2}:\d{2}:\d{2}(?:[.,]\d+)?(?:Z|[+-]\d{2}:?\d{2})?/g, '<TIMESTAMP>')
    .replace(/\[[^\]]*\d{2}:\d{2}:\d{2}[^\]]*\]/g, '<TIMESTAMP>')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, '<UUID>')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/g, '<IP>')
    .replace(/\b0x[0-9a-f]+\b/gi, '<HEX>')
    .replace(/\b(?:request|trace|span|session|correlation)[_-]?id[=: ]+[\w.-]+/gi, 'id=<ID>')
    .replace(/\b\d+(?:\.\d+)?\s*(?:ms|s|seconds?|bytes?|kb|mb|gb)\b/gi, '<VALUE>')
    .replace(/\b\d{5,}\b/g, '<N>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

export function groupSimilarErrors(lines: string[]): ErrorGroupData[] {
  const groups = new Map<string, ErrorGroupData>();
  lines.forEach((line, lineIndex) => {
    const detected = getLogLevel(line);
    if (detected !== 'error' && detected !== 'warn') return;
    const key = normalizeErrorSignature(line) || '(empty error message)';
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      existing.lineIndexes.push(lineIndex);
      if (detected === 'error') existing.level = 'error';
    } else {
      groups.set(key, { key, count: 1, sample: line.slice(0, 300), lineIndexes: [lineIndex], level: detected });
    }
  });
  return [...groups.values()].sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}
