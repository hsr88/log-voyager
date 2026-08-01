export interface UseCasePageData {
  slug: string;
  shortName: string;
  title: string;
  description: string;
  headline: string;
  lede: string;
  intro: string[];
  fileTypes: string[];
  tasks: Array<{ title: string; description: string }>;
  patterns: string[];
  sample: string;
  workflow: Array<{ title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  related: string[];
}

export const useCasePages: UseCasePageData[] = [
  {
    slug: 'json-log-viewer',
    shortName: 'JSON logs',
    title: 'JSON Log Viewer Online - Free & Private | Log Voyager',
    description: 'Open JSON, JSONL and NDJSON log files in your browser. Search structured logs locally, format objects and keep production data on your device.',
    headline: 'JSON log viewer for files that stay private',
    lede: 'Open JSON, JSONL and newline-delimited logs locally. Format structured entries, search any field and export only the lines you need.',
    intro: [
      'Structured logs make incidents easier to investigate only when the structure remains readable. Log Voyager detects JSON objects inside log lines and formats them without sending the source file to a server.',
      'Use it for application logs from Node.js, Python, Go and Java, or for JSON output copied from container and cloud tooling. Search by trace ID, request ID, service, level or any literal value stored in the event.'
    ],
    fileTypes: ['.json', '.jsonl', '.ndjson', '.log', '.txt', '.gz'],
    tasks: [
      { title: 'Follow one request', description: 'Search a trace_id, correlation_id or request_id across every matching event.' },
      { title: 'Isolate error objects', description: 'Filter ERROR entries, then inspect nested message, stack and context fields.' },
      { title: 'Read compact JSON', description: 'Pretty-print single-line objects while keeping the original log order intact.' },
      { title: 'Export evidence', description: 'Select matching entries and export a smaller TXT, JSON or CSV working set.' }
    ],
    patterns: ['"level":"error"', '"status":500', '"trace_id":"…"', 'timeout|exception|failed'],
    sample: '{"timestamp":"2026-08-01T09:42:13Z","level":"error","service":"payments","message":"gateway timeout","trace_id":"7fb2c1"}',
    workflow: [
      { title: 'Open the file', description: 'Choose a JSON, JSONL, NDJSON or compressed text log from your device.' },
      { title: 'Find the field', description: 'Search a key, value or regular expression. Enable case matching only when the format requires it.' },
      { title: 'Read the context', description: 'Move between matches, bookmark relevant lines and compare nearby events.' },
      { title: 'Export the subset', description: 'Save selected evidence without copying the entire production log.' }
    ],
    faq: [
      { question: 'Does the JSON file get uploaded?', answer: 'No. File reading, searching and formatting run in your browser. The selected file is not sent to Log Voyager servers.' },
      { question: 'Does it support JSONL and NDJSON?', answer: 'Yes. Newline-delimited JSON works naturally because Log Voyager reads and displays log entries line by line.' },
      { question: 'Can I search nested JSON fields?', answer: 'You can search the rendered line for nested keys and values. Regex and case-sensitive matching are available for more precise patterns.' }
    ],
    related: ['docker-log-viewer', 'large-log-file-viewer', 'nginx-log-analyzer']
  },
  {
    slug: 'large-log-file-viewer',
    shortName: 'Large files',
    title: 'Large Log File Viewer Online - No Upload | Log Voyager',
    description: 'Open and search multi-gigabyte log files in your browser without uploading them. Chunked reading, regex filters, bookmarks and local processing.',
    headline: 'Open large log files without loading them all into RAM',
    lede: 'Log Voyager reads small file slices on demand, so you can navigate multi-gigabyte text logs without first uploading or importing the whole file.',
    intro: [
      'Traditional editors often try to create one in-memory document before they let you work. That approach becomes slow or unstable as a log grows. Log Voyager uses the browser File API to read 50 KB slices around the position you are viewing.',
      'This workflow is useful during incident response: jump through the file, search for a known identifier, bookmark useful lines and export a focused subset. The source file remains on the device throughout the session.'
    ],
    fileTypes: ['.log', '.txt', '.json', '.jsonl', '.gz'],
    tasks: [
      { title: 'Jump through the file', description: 'Use the position slider and minimap instead of waiting for a full document render.' },
      { title: 'Search a known signal', description: 'Find an exception, timestamp, request ID or regular-expression pattern.' },
      { title: 'Keep investigation notes', description: 'Bookmark significant lines and return to them without losing your place.' },
      { title: 'Reduce the evidence set', description: 'Export the current view or selected lines for a ticket or incident report.' }
    ],
    patterns: ['ERROR|FATAL', 'request_id=…', '2026-08-01 09:', 'timeout|connection reset'],
    sample: '2026-08-01T09:42:13.712Z ERROR api-gateway request_id=7fb2c1 upstream timed out after 30000ms',
    workflow: [
      { title: 'Start locally', description: 'Select the file from disk. There is no upload or server-side import step.' },
      { title: 'Navigate by position', description: 'Move to an approximate point in the file and load only the nearby slice.' },
      { title: 'Narrow the signal', description: 'Combine search, case matching and filters to remove unrelated lines.' },
      { title: 'Save only what matters', description: 'Export a smaller result set for the next stage of the investigation.' }
    ],
    faq: [
      { question: 'Why can it handle large files?', answer: 'The viewer reads slices of the file on demand instead of building one complete in-memory document before displaying anything.' },
      { question: 'Is there a server upload limit?', answer: 'No upload is performed, so there is no Log Voyager server upload limit. Practical performance still depends on the browser, device and file format.' },
      { question: 'Can it open compressed logs?', answer: 'GZIP files are supported. Decompression uses browser APIs and still happens on the device.' }
    ],
    related: ['json-log-viewer', 'nginx-log-analyzer', 'apache-log-viewer']
  },
  {
    slug: 'nginx-log-analyzer',
    shortName: 'Nginx',
    title: 'Nginx Log Analyzer & Viewer Online | Log Voyager',
    description: 'Inspect Nginx access and error logs locally. Search 4xx/5xx responses, upstream timeouts, request paths and client IPs without uploading logs.',
    headline: 'Nginx log analyzer for access and error files',
    lede: 'Inspect Nginx access logs, error logs and rotated GZIP archives in your browser. Find failed requests and upstream problems without uploading production data.',
    intro: [
      'Nginx investigations usually start with a narrow question: which route returned 502, which upstream timed out, or whether one client generated a burst of requests. A local viewer lets you answer those questions without moving the log to another service.',
      'Log Voyager works with standard combined access logs and plain-text error logs. It does not require a fixed log_format; search and filters operate on the text your Nginx configuration actually emits.'
    ],
    fileTypes: ['access.log', 'error.log', 'access.log.gz', 'error.log.gz'],
    tasks: [
      { title: 'Find server errors', description: 'Search HTTP 500, 502, 503 and 504 responses, then inspect surrounding requests.' },
      { title: 'Trace an upstream timeout', description: 'Locate upstream timed out, connect failed and prematurely closed connection messages.' },
      { title: 'Inspect one path or client', description: 'Filter by request URI, host, user agent or client IP address.' },
      { title: 'Review rotated archives', description: 'Open a GZIP log directly without first extracting a second copy to disk.' }
    ],
    patterns: [' 502 ', 'upstream timed out', 'request_time=', 'client: 203.0.113.'],
    sample: '203.0.113.18 - - [01/Aug/2026:09:42:13 +0000] "GET /api/orders HTTP/1.1" 502 173 "-" "curl/8.0"',
    workflow: [
      { title: 'Choose access or error log', description: 'Open the file or a rotated .gz archive directly from your device.' },
      { title: 'Search the failure class', description: 'Start with a status code, upstream phrase, path, IP address or request ID.' },
      { title: 'Compare nearby entries', description: 'Use bookmarks and split view to keep related events visible.' },
      { title: 'Export incident evidence', description: 'Save only the requests and errors relevant to the investigation.' }
    ],
    faq: [
      { question: 'Does it parse custom Nginx log_format values?', answer: 'The viewer does not require a fixed schema. It displays and searches the exact text produced by your configured log_format.' },
      { question: 'Can I inspect Nginx GZIP archives?', answer: 'Yes. Rotated .gz logs can be opened and decompressed locally in the browser.' },
      { question: 'Can it calculate traffic dashboards?', answer: 'Log Voyager is designed for interactive inspection and filtering, not persistent traffic analytics. Use it to isolate evidence, then export the relevant subset.' }
    ],
    related: ['apache-log-viewer', 'large-log-file-viewer', 'syslog-viewer']
  },
  {
    slug: 'apache-log-viewer',
    shortName: 'Apache',
    title: 'Apache Log Viewer - Access & Error Logs | Log Voyager',
    description: 'Open Apache access.log and error.log files locally. Search status codes, modules, request paths and client addresses without uploading server logs.',
    headline: 'Apache log viewer for access and error investigations',
    lede: 'Search Apache HTTP Server logs locally. Trace failed requests, module errors and repeated client activity while keeping production files on your machine.',
    intro: [
      'Apache access and error logs often need to be read together. An access entry identifies the request and status; the error file explains what the server or module reported at the same time.',
      'Log Voyager gives you a fast text-first workspace for both formats. Search a timestamp, path, status, process ID or module tag, bookmark matching lines and export a small evidence file for the ticket.'
    ],
    fileTypes: ['access.log', 'error.log', 'ssl_access.log', 'error.log.gz'],
    tasks: [
      { title: 'Investigate 4xx and 5xx', description: 'Find response codes in common or combined access-log formats.' },
      { title: 'Follow module messages', description: 'Search tags such as proxy, rewrite, ssl, authz_core or php.' },
      { title: 'Match requests by time', description: 'Use the timestamp to compare an access entry with the corresponding error line.' },
      { title: 'Check repeated clients', description: 'Filter one IP address or path to review repeated failures and unusual request bursts.' }
    ],
    patterns: [' 500 ', '[proxy:error]', 'AH0', '/wp-login.php'],
    sample: '[Fri Aug 01 09:42:13.712345 2026] [proxy:error] [pid 1842] [client 203.0.113.18:53144] AH01102: error reading status line from remote server',
    workflow: [
      { title: 'Open the relevant file', description: 'Start with access.log for request outcomes or error.log for module diagnostics.' },
      { title: 'Search a stable identifier', description: 'Use a status, timestamp, AH error code, module tag, path or client address.' },
      { title: 'Bookmark related lines', description: 'Mark the useful entries as the incident timeline becomes clear.' },
      { title: 'Export a focused report', description: 'Share the selected evidence without sharing the complete server log.' }
    ],
    faq: [
      { question: 'Does it support Apache combined log format?', answer: 'Yes. Combined and common access logs are plain text and can be searched, filtered and bookmarked directly.' },
      { question: 'Can I search Apache AH error codes?', answer: 'Yes. Search the complete AH code or its numeric prefix to group messages from the same error family.' },
      { question: 'Are SSL and virtual-host logs supported?', answer: 'Any text-based Apache log can be opened. The viewer does not require one predefined filename or virtual-host layout.' }
    ],
    related: ['nginx-log-analyzer', 'large-log-file-viewer', 'syslog-viewer']
  },
  {
    slug: 'docker-log-viewer',
    shortName: 'Docker',
    title: 'Docker Log Viewer - JSON & Compose Logs | Log Voyager',
    description: 'Inspect Docker JSON-file and Compose log exports locally. Search container output, stack traces, service prefixes and timestamps without uploads.',
    headline: 'Docker log viewer for container output and JSON files',
    lede: 'Open exported container logs, Docker JSON-file logs and Compose output locally. Follow one service or request without pasting production logs into a remote tool.',
    intro: [
      'Container output mixes application messages with timestamps, stream names and service prefixes. During an incident, the useful signal may be one trace ID spread across several services or a stack trace surrounded by restart noise.',
      'Export the relevant Docker or Compose logs to a text file, then use Log Voyager to search, filter, bookmark and reduce the dataset. JSON-file driver output can be formatted as structured entries.'
    ],
    fileTypes: ['docker.log', 'compose.log', '*-json.log', '.jsonl', '.txt'],
    tasks: [
      { title: 'Filter one service', description: 'Search the Compose service prefix or container name to isolate its output.' },
      { title: 'Follow a trace', description: 'Find a correlation or trace ID as it moves across application services.' },
      { title: 'Inspect restart failures', description: 'Locate fatal messages, exit-related output and the last lines before a restart.' },
      { title: 'Format JSON-file output', description: 'Read log, stream and time fields without losing the original entry order.' }
    ],
    patterns: ['service-api  |', '"stream":"stderr"', 'trace_id=', 'panic|fatal|exception'],
    sample: '{"log":"payment gateway timeout\\n","stream":"stderr","time":"2026-08-01T09:42:13.712345Z"}',
    workflow: [
      { title: 'Export container output', description: 'Save docker logs or docker compose logs output as a local text file.' },
      { title: 'Open it in the viewer', description: 'Choose the exported text, JSON-file log or compressed archive.' },
      { title: 'Narrow by service or trace', description: 'Search the stable identifier first, then inspect nearby warnings and errors.' },
      { title: 'Keep the incident subset', description: 'Export selected lines for an issue, postmortem or team handoff.' }
    ],
    faq: [
      { question: 'Can it connect directly to the Docker daemon?', answer: 'No. Log Voyager intentionally works with local files and pasted text. Export the container output first, then open the result.' },
      { question: 'Does it support Docker JSON-file logs?', answer: 'Yes. JSON objects are detected and can be formatted for easier inspection.' },
      { question: 'Can I view Docker Compose output?', answer: 'Yes. Save Compose output to a text file and search service prefixes, timestamps and application messages.' }
    ],
    related: ['json-log-viewer', 'syslog-viewer', 'large-log-file-viewer']
  },
  {
    slug: 'syslog-viewer',
    shortName: 'Syslog',
    title: 'Syslog Viewer - Search System Logs Locally | Log Voyager',
    description: 'Open syslog, messages and exported journal logs locally. Search hosts, services, priorities and incident timestamps without uploading system data.',
    headline: 'Syslog viewer for local system-log investigations',
    lede: 'Search exported syslog, messages and journal text files in your browser. Keep hostnames, addresses and operational details on your device.',
    intro: [
      'System logs are most useful as a timeline. A service failure may appear first as a kernel or network warning, then as a systemd restart, followed by repeated application errors.',
      'Log Voyager preserves the original line order while giving you regex search, filters and bookmarks. It works with RFC 3164-style messages, RFC 5424-style text and journalctl output exported to a file.'
    ],
    fileTypes: ['/var/log/syslog', '/var/log/messages', 'journalctl.txt', '.log', '.gz'],
    tasks: [
      { title: 'Build an incident timeline', description: 'Search the affected minute or service and bookmark events in chronological order.' },
      { title: 'Isolate one host', description: 'Filter the hostname when a central export contains messages from several systems.' },
      { title: 'Find priority messages', description: 'Search emerg, alert, crit, err or warning tokens used by the source.' },
      { title: 'Inspect service restarts', description: 'Locate systemd start, stop, exit-code and restart messages around the failure.' }
    ],
    patterns: ['systemd[1]:', 'kernel:', 'error|crit|alert', 'Aug  1 09:42:'],
    sample: 'Aug  1 09:42:13 web-02 systemd[1]: api.service: Main process exited, code=exited, status=1/FAILURE',
    workflow: [
      { title: 'Export the log', description: 'Copy the relevant system file or redirect journalctl output to a local text file.' },
      { title: 'Open it locally', description: 'Select the file or a rotated GZIP archive in Log Voyager.' },
      { title: 'Search time, host and service', description: 'Start with the stable incident context before broad error keywords.' },
      { title: 'Export the timeline', description: 'Save selected messages as a compact incident record.' }
    ],
    faq: [
      { question: 'Can Log Voyager read journalctl directly?', answer: 'It does not connect to systemd. Export journalctl output to a text file, then open that file locally.' },
      { question: 'Does it understand RFC 3164 and RFC 5424?', answer: 'Both are text formats and can be displayed and searched. The viewer does not require one fixed syslog schema.' },
      { question: 'Can I open rotated .gz system logs?', answer: 'Yes. GZIP logs can be selected and decompressed in the browser.' }
    ],
    related: ['nginx-log-analyzer', 'apache-log-viewer', 'large-log-file-viewer']
  }
];

export function getUseCaseBySlug(slug: string): UseCasePageData | undefined {
  return useCasePages.find((page) => page.slug === slug);
}
