[![GitHub stars](https://img.shields.io/github/stars/hsr88/log-voyager?style=social)](https://github.com/hsr88/log-voyager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/v/release/hsr88/log-voyager)](https://github.com/hsr88/log-voyager/releases)

# Log Voyager

Log Voyager is a free, local-first log file analyzer for developers, DevOps engineers and system administrators. Open multi-gigabyte logs in the browser without uploading production data or loading the complete file into memory.

> Files stay on your device. Analysis runs locally and works offline after the PWA assets are cached.

![Log Voyager interface](https://github.com/user-attachments/assets/910d1ed8-abd5-43c2-9e57-85102be09188)

## Live application

[Open Log Voyager](https://www.logvoyager.cc)

No installation, account or server-side import is required.

## Key features

- **Large-file streaming:** Reads 50 KB file slices on demand instead of building one complete in-memory document.
- **Smart Search 2.0:** Plain-text search, regular expressions, case matching, match navigation and local search history.
- **Automatic format detection:** Recognizes JSON and JSONL, Docker JSON, Kubernetes CRI, Nginx access and error logs, Apache access and error logs, syslog and structured application text.
- **Interactive event timeline:** Builds a timestamp histogram for the current file window, highlights warning and error spikes, and lets you jump from a bar to the matching lines.
- **Similar error groups:** Normalizes timestamps, UUIDs, IP addresses, request IDs and changing values, then groups repeated failures by stable signature.
- **Multi-filter system:** Combine include and exclude rules with optional regular expressions and log-level conditions.
- **JSON formatting:** Detect and pretty-print structured objects inside log lines.
- **Bookmarks and selection:** Mark useful lines, navigate between them and export a focused evidence set.
- **Split view:** Compare two positions in the same file.
- **Local export:** Save selected lines as TXT, JSON or CSV.
- **PWA and offline use:** Install on desktop or mobile and reopen the cached application without a network connection.
- **Privacy by design:** Log contents are processed locally and are not uploaded to Log Voyager servers.

## Release v2.1.0 - Pattern Analysis

Released on 2 August 2026.

### Added

- Automatic format detection with confidence scoring and an in-app format badge.
- Support for JSONL, Docker JSON, Kubernetes CRI, Nginx, Apache, syslog and generic structured text detection.
- Interactive event timeline with timestamp buckets, severity coloring and click-to-jump navigation.
- Improved error grouping based on normalized message signatures.
- JSON message extraction for error grouping.
- New v2.1.0 feature section on the public home page.

The timeline and error groups describe the currently loaded 50 KB window. This keeps analysis responsive for very large files and preserves the streaming architecture.

## How it works

Traditional editors commonly create one large in-memory document. That becomes slow or unstable when a log is larger than the available memory.

Log Voyager treats a text log more like a stream:

1. It creates a virtual position map for the selected file.
2. It reads a small slice around the current scrollbar position.
3. Search, format detection, timeline analysis and grouping run inside the browser.
4. Moving to another position discards the old slice and reads a new one.

The original file is not modified.

## Supported inputs

- `.log`
- `.txt`
- `.json`
- `.jsonl`
- `.ndjson`
- supported GZIP-compressed text logs

Format detection currently covers:

- JSON and JSONL
- Docker json-file records
- Kubernetes CRI output
- Nginx access and error logs
- Apache access and error logs
- RFC 3164 and RFC 5424-style syslog
- timestamped application logs
- unstructured plain text

## Roadmap

- [ ] **Live Tail:** Follow lines appended to a local file without reopening it.
- [ ] **File Comparison:** Compare logs from before and after a deployment, including new errors and frequency changes.
- [ ] **Sensitive Data Redaction:** Detect and mask email addresses, IP addresses, API keys, tokens, cookies and payment identifiers before export.
- [ ] **Request Correlation:** Group events by `request_id`, `trace_id`, `session_id`, IP address or a user-selected field.
- [ ] **Saved Alert Rules:** Store local rules such as `status >= 500`, `duration > 2000ms` or `message contains timeout`.
- [ ] **Investigation Reports:** Export a local HTML, Markdown or JSON summary with time range, top errors, severity counts and selected evidence.
- [ ] **Investigation Presets:** Add guided workflows for server errors, slow requests, failed logins, deployment incidents and suspicious IP activity.
- [ ] **Optional Local AI Assistant:** Explain a redacted selection using an on-device model or an explicitly configured provider. Full files must remain local.

Roadmap order may change based on GitHub feedback and pull requests.

## Run locally

```bash
git clone https://github.com/hsr88/log-voyager.git
cd log-voyager
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

## Run with Docker

```bash
docker build -t log-voyager .
docker run -d -p 8080:80 --name log-voyager log-voyager
```

Open `http://localhost:8080`.

## Security and privacy

Log Voyager is a static browser application. File reading, searching and analysis use browser APIs. The application does not need an upload endpoint for the selected log file.

Logs can still contain sensitive information. Review any selection before copying or exporting it, especially until automatic redaction is implemented.

## Contributing

Issues and pull requests are welcome. Include a short sample using synthetic data when reporting parser or format-detection problems. Never attach production secrets or private logs.

## License

[MIT](LICENSE)

## Support

Log Voyager has no paid tier. Voluntary contributions help cover hosting, browser testing and maintenance.

[Support Log Voyager on Ko-fi](https://ko-fi.com/G2G11RAU3K)

Copyright 2025-2026 [logvoyager.cc](https://www.logvoyager.cc). Created by [hsr88](https://github.com/hsr88).
