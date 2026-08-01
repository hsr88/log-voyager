import React, { useCallback, useState } from 'react';
import {
  ArrowRight, BookOpen, Boxes, Braces, Clipboard, Coffee, FileJson, FileText,
  Filter, Github, History, LockKeyhole, ScanSearch, Search, Server, ShieldCheck,
  UploadCloud, Wrench, Zap
} from 'lucide-react';
import type { HistoryItem } from '../types';
import { LogStreamBackground } from './LogStreamBackground';
import { SeoFooter } from './SeoChrome';
import { useCasePages } from './useCases';

interface HomeWorkbenchProps {
  history: HistoryItem[];
  onOpenFile: (file: File) => void;
  onSelectFile: () => void;
  onPaste: () => void;
}

const faq = [
  { question: 'Are log files uploaded to a server?', answer: 'No. File reading, searching, filtering and export happen in your browser. The selected file stays on your device.' },
  { question: 'Which file formats can I open?', answer: 'Log Voyager accepts text-based .log, .txt, .json and JSONL-style files, plus GZIP-compressed logs.' },
  { question: 'Why does it work with large logs?', answer: 'The viewer reads small slices around the current position instead of creating one complete in-memory document before showing the first line.' },
  { question: 'Is Log Voyager free?', answer: 'Yes. The web app is free to use and the source code is available under the MIT license. Voluntary Ko-fi contributions help cover maintenance.' },
  { question: 'Can I use it offline?', answer: 'Yes. Log Voyager is installable as a Progressive Web App. After its assets are cached, the viewer can run without a network connection.' }
];

export const HomeWorkbench: React.FC<HomeWorkbenchProps> = ({ history, onOpenFile, onSelectFile, onPaste }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onOpenFile(dropped);
  }, [onOpenFile]);

  return (
    <div className="seo-shell home-workbench">
      <LogStreamBackground />
      <div>
        <section className="seo-container home-hero">
          <div className="home-hero__copy">
            <p className="seo-kicker">Local-first · Free · Open source</p>
            <h1 className="seo-display">Free online log file analyzer &amp; viewer</h1>
            <p className="home-hero__lede">Open, search and filter large log files directly in your browser. No upload, no account and no waiting for a server-side import.</p>
            <div className="home-hero__actions">
              <button className="seo-button seo-button--primary" onClick={onSelectFile}>
                <FileText size={18} aria-hidden="true" /> Open a log file
              </button>
              <button className="seo-button" onClick={onPaste}>
                <Clipboard size={18} aria-hidden="true" /> Paste log text
              </button>
            </div>
            <ul className="home-facts" aria-label="Product facts">
              <li><ShieldCheck size={17} aria-hidden="true" /> Files stay on your device</li>
              <li><Zap size={17} aria-hidden="true" /> Reads 50 KB slices on demand</li>
              <li><Github size={17} aria-hidden="true" /> MIT-licensed source code</li>
            </ul>
          </div>

          <div
            id="analyzer"
            className={`home-dropzone ${isDragging ? 'is-dragging' : ''}`}
            onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => { if (event.currentTarget === event.target) setIsDragging(false); }}
            onDrop={handleDrop}
          >
            <div className="home-dropzone__head">
              <span><span className="home-status-dot" /> Ready locally</span>
              <span>no upload</span>
            </div>
            <UploadCloud size={48} aria-hidden="true" />
            <h2>Drop a log file here</h2>
            <p>.log · .txt · .json · .jsonl · .gz</p>
            <button className="seo-button seo-button--primary" onClick={onSelectFile}>Choose file</button>
            <button className="home-paste-link" onClick={onPaste}>or paste from clipboard</button>
            <div className="home-dropzone__preview" aria-hidden="true">
              <span>09:42:12 INFO request accepted</span>
              <span className="is-warning">09:42:13 WARN upstream latency 1842ms</span>
              <span className="is-error">09:42:14 ERROR gateway timeout</span>
            </div>
          </div>
        </section>

        <section className="home-trust-strip" aria-label="Privacy and access">
          <div className="seo-container">
            <span><LockKeyhole size={18} /> Zero-byte upload</span>
            <span><Wrench size={18} /> Search, regex, filters and export</span>
            <span><FileJson size={18} /> Text, JSON and compressed logs</span>
          </div>
        </section>

        <section className="seo-container home-overview">
          <div className="home-overview__intro">
            <h2 className="seo-heading">Analyze the log you have, without sending it away</h2>
            <p className="seo-prose">Log Voyager is a free log file analyzer online, but the analysis itself stays on your machine. It is built for the moment when you already have an application, web-server, container or system log and need a clear first view before choosing a larger observability workflow.</p>
            <p className="seo-prose">Open the file, search for the event that matters and reduce a noisy export to the lines that explain an incident. The original file remains unchanged throughout the investigation.</p>
            <a className="seo-link home-overview__link" href="/about">How the local viewer works <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="home-overview__details">
            <div className="home-overview__benefits">
              <article><Zap size={19} /><h3>Reach the first useful lines</h3><p>Small file slices are read around the current position instead of waiting for one complete document view.</p></article>
              <article><ScanSearch size={19} /><h3>Search and reduce</h3><p>Use text, case matching, regular expressions and combined filters to narrow the investigation.</p></article>
              <article><FileJson size={19} /><h3>Read structured output</h3><p>Work with ordinary text logs and JSON or JSONL records in the same browser-based tool.</p></article>
            </div>
            <div className="home-use-cases">
              <h3>Common investigation tasks</h3>
              <ul>
                <li><Wrench size={16} /> Debug production exceptions</li>
                <li><Server size={16} /> Review Nginx and Apache requests</li>
                <li><Boxes size={16} /> Inspect Docker container output</li>
                <li><Braces size={16} /> Trace JSON application events</li>
                <li><Search size={16} /> Find request IDs in API logs</li>
                <li><History size={16} /> Rebuild a syslog timeline</li>
              </ul>
            </div>
            <p className="home-overview__privacy"><LockKeyhole size={17} /><span><strong>Local by design.</strong> Log Voyager does not upload the selected log file to an analysis server.</span></p>
          </div>
        </section>

        <section className="seo-container home-support">
          <div>
            <p className="seo-kicker">Independent open source</p>
            <h2 className="seo-heading">Keep the viewer free and maintained</h2>
          </div>
          <div className="home-support__copy">
            <p>Log Voyager has no paid tier and does not monetize uploaded data - because there is no upload. If the tool saved you time during an incident, a voluntary Ko-fi contribution helps fund maintenance, testing and hosting.</p>
            <div className="home-support__actions">
              <a className="seo-button seo-button--support" href="https://ko-fi.com/hsr" target="_blank" rel="noreferrer"><Coffee size={18} /> Support on Ko-fi</a>
              <a className="seo-button" href="https://github.com/hsr88/log-voyager" target="_blank" rel="noreferrer"><Github size={18} /> Review the source</a>
            </div>
          </div>
        </section>

        <section className="home-spec-section">
          <div className="seo-container home-section-grid">
            <div className="home-section-intro">
              <p className="seo-kicker">The workbench</p>
              <h2 className="seo-heading">A focused path from raw file to useful evidence</h2>
              <p className="seo-prose">The interface stays close to the file: open it, narrow the signal, keep the useful context and export a smaller working set.</p>
            </div>
            <dl className="home-spec-list">
              <div><dt><Search size={18} /> Search</dt><dd>Plain text, case matching and regular expressions</dd><span>keyboard-first</span></div>
              <div><dt><Filter size={18} /> Multi-filter</dt><dd>Combine conditions without rewriting the source file</dd><span>non-destructive</span></div>
              <div><dt><BookOpen size={18} /> Bookmarks</dt><dd>Keep important lines visible while you investigate</dd><span>stored locally</span></div>
              <div><dt><FileText size={18} /> Export</dt><dd>Save the current view or selected evidence</dd><span>TXT · JSON · CSV</span></div>
            </dl>
          </div>
        </section>

        <section id="formats" className="seo-container home-formats">
          <div className="home-formats__head">
            <h2 className="seo-heading">Open the log you actually have</h2>
            <p className="seo-prose">Each guide below contains format-specific searches, examples and a direct route back to the local analyzer.</p>
          </div>
          <div className="home-format-index">
            {useCasePages.map((page, index) => (
              <a key={page.slug} className={`home-format-link home-format-link--${(index % 3) + 1}`} href={`/${page.slug}`}>
                <span>{page.shortName}</span>
                <p>{page.lede}</p>
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="home-dark-band">
          <div className="seo-container home-workflow">
            <div>
              <p className="seo-kicker">Four steps</p>
              <h2 className="seo-heading">Open. Narrow. Mark. Export.</h2>
            </div>
            <ol>
              <li><span>1.0</span><div><h3>Open locally</h3><p>Select a file or paste a short log. Nothing is sent to an analysis endpoint.</p></div></li>
              <li><span>2.0</span><div><h3>Narrow the signal</h3><p>Search text or regex, match case and combine filters around the incident.</p></div></li>
              <li><span>3.0</span><div><h3>Keep context</h3><p>Bookmark lines, use the minimap and compare different file positions in split view.</p></div></li>
              <li><span>4.0</span><div><h3>Export evidence</h3><p>Save selected lines or the filtered view for a ticket, handoff or postmortem.</p></div></li>
            </ol>
          </div>
        </section>

        {history.length > 0 && (
          <section className="seo-container home-history" aria-labelledby="recent-files-title">
            <div>
              <History size={20} aria-hidden="true" />
              <h2 id="recent-files-title">Recent local sessions</h2>
            </div>
            <ul>{history.map((item) => <li key={`${item.name}-${item.date}`}><span>{item.name}</span><span>{item.size} · {item.date}</span></li>)}</ul>
          </section>
        )}

        <section className="seo-container home-faq">
          <div className="home-faq__intro">
            <h2 className="seo-heading">Questions before you open a production log</h2>
            <p className="seo-prose">The privacy model is simple enough to verify: the browser reads the selected file and the open-source code performs the analysis.</p>
          </div>
          <div className="home-faq__list">
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
      <SeoFooter />
    </div>
  );
};

export const homeFaq = faq;
