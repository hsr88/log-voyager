import React, { useEffect } from 'react';
import {
  ArrowRight, BookOpenCheck, Braces, Coffee, Database, FileArchive, FileSearch,
  Github, Layers3, LockKeyhole, Network, Search, ServerCog, ShieldCheck, TerminalSquare,
  Wrench
} from 'lucide-react';
import { LogStreamBackground } from './LogStreamBackground';
import { SeoFooter, SeoHeader } from './SeoChrome';

const capabilities = [
  { Icon: Layers3, title: 'Chunked file reading', text: 'The viewer reads small slices around the current position, so you can reach useful lines without first turning the whole file into one large document.' },
  { Icon: LockKeyhole, title: 'Local browser processing', text: 'Opening, searching, filtering, bookmarking and exporting happen on your device. Log Voyager does not need an upload endpoint for the selected file.' },
  { Icon: Search, title: 'Search that keeps context', text: 'Use plain text, case-sensitive matching or regular expressions, then combine filters while keeping the original file unchanged.' },
  { Icon: Braces, title: 'JSON and JSONL support', text: 'Inspect structured application output alongside ordinary text logs, with formatting that makes nested objects easier to scan.' },
  { Icon: FileArchive, title: 'Compressed log input', text: 'Open supported GZIP-compressed logs in the same local workflow instead of unpacking production exports into another cloud service.' },
  { Icon: BookOpenCheck, title: 'Evidence you can hand off', text: 'Bookmark important lines and export a smaller TXT, JSON or CSV working set for a ticket, postmortem or teammate.' },
];

const workflow = [
  { title: 'Select the source', text: 'Choose a local log file or paste a short sample. The browser grants access only to the file you select.' },
  { title: 'Find the incident window', text: 'Search for a request ID, status code, service name, exception or timestamp and move directly to matching lines.' },
  { title: 'Reduce the noise', text: 'Combine filters, group errors and keep bookmarks while preserving the surrounding context needed to understand the event.' },
  { title: 'Share the useful subset', text: 'Export selected evidence rather than copying an entire production log into a ticket or chat.' },
];

const audiences = [
  { Icon: TerminalSquare, title: 'Backend developers', text: 'Trace exceptions, request IDs and multi-service events across JSON, JSONL and ordinary application output.' },
  { Icon: Network, title: 'DevOps and SRE', text: 'Review container, proxy and deployment logs during an incident without waiting for a remote import job.' },
  { Icon: ShieldCheck, title: 'Security investigations', text: 'Narrow access logs and system events locally before deciding what evidence can safely leave the machine.' },
  { Icon: ServerCog, title: 'System administrators', text: 'Inspect Nginx, Apache, syslog and exported service logs from a browser on the workstation already in use.' },
];

const aboutFaq = [
  { question: 'Is Log Voyager an online log viewer?', answer: 'Yes. It runs as a web application, but selected files are processed locally in your browser rather than uploaded to a Log Voyager analysis server.' },
  { question: 'Can it open large log files?', answer: 'The viewer is designed to avoid loading an entire file as one document and instead reads smaller slices around the current position. Practical limits still depend on the browser, device resources, compression and the structure of the file.' },
  { question: 'Which log formats are supported?', answer: 'The current workflow covers text-based .log and .txt files, JSON and JSONL-style logs, plus supported GZIP-compressed files.' },
  { question: 'Do I need an account?', answer: 'No. You can open the analyzer without registration, a subscription or a paid tier.' },
  { question: 'Why is the project open source?', answer: 'Logs can contain sensitive operational context. Public MIT-licensed source code lets users review how file access works and lets contributors improve the tool.' },
  { question: 'How can I support development?', answer: 'You can report issues, contribute code or documentation on GitHub, or make an optional Ko-fi contribution toward hosting, testing and maintenance.' },
];

export const AboutPage: React.FC = () => {
  useEffect(() => {
    const title = 'About Log Voyager - Free, Private Log File Analyzer';
    const description = 'Learn how Log Voyager analyzes text, JSON, server and compressed log files locally in your browser, why it is open source, and how to contribute.';
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://www.logvoyager.cc/about');
    const schema = document.getElementById('site-schema');
    if (schema) schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'AboutPage', name: title, description, url: 'https://www.logvoyager.cc/about', isPartOf: { '@id': 'https://www.logvoyager.cc/#website' }, about: { '@id': 'https://www.logvoyager.cc/#software' } },
        { '@type': 'FAQPage', mainEntity: aboutFaq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
      ],
    });
  }, []);

  return (
    <div className="seo-shell about-page-shell">
      <SeoHeader />
      <main className="about-page">
        <LogStreamBackground />

        <section className="seo-container about-hero">
          <div className="about-hero__mark" aria-hidden="true"><Database size={28} /></div>
          <p className="seo-kicker">About Log Voyager</p>
          <h1 className="seo-display">Inspect log files without giving them away</h1>
          <p className="about-hero__lede">Log Voyager is a free online log file analyzer built for developers, operators and system administrators. It opens text, JSON and compressed logs in the browser, keeps the selected file on your device and gives you a focused path from raw output to useful evidence.</p>
          <div className="about-hero__actions">
            <a className="seo-button seo-button--primary" href="/#analyzer"><Wrench size={18} /> Open the analyzer</a>
            <a className="seo-button" href="https://github.com/hsr88/log-voyager" target="_blank" rel="noreferrer"><Github size={18} /> Review the source</a>
          </div>
        </section>

        <section className="seo-container about-mission">
          <div>
            <p className="seo-kicker">Why it exists</p>
            <h2>Log analysis should start close to the file</h2>
          </div>
          <div className="about-mission__copy">
            <p>When a service fails, the first question is rarely “which platform should I upload this file to?” It is usually “what happened around this timestamp, request ID or error?” Log Voyager was created to shorten that first investigation loop. Open the file you already have, search it, reduce the noise and keep the relevant lines.</p>
            <p>A local-first workflow also makes the privacy boundary easier to understand. The browser reads the file you choose and the application performs its work on your device. You can inspect the open-source implementation instead of relying on a vague promise about what happens after an upload.</p>
          </div>
        </section>

        <section className="seo-container about-capabilities" aria-labelledby="capabilities-title">
          <div className="about-section-head">
            <h2 id="capabilities-title">A practical log viewer for the messy files incidents produce</h2>
            <p>Log Voyager combines the speed of a focused browser tool with the controls needed to move through unstructured and structured output.</p>
          </div>
          <div className="about-capability-grid">
            {capabilities.map(({ Icon, title, text }) => (
              <article key={title}>
                <Icon size={21} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-workflow-band">
          <div className="seo-container about-workflow">
            <div className="about-section-head">
              <h2>From raw log file to a smaller, explainable story</h2>
              <p>The tool stays deliberately close to a four-step investigation workflow.</p>
            </div>
            <ol>
              {workflow.map((step, index) => (
                <li key={step.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="seo-container about-audiences">
          <div className="about-section-head">
            <h2>Useful across the incident room</h2>
            <p>The same local log viewer can support several roles without forcing every investigation into one observability platform.</p>
          </div>
          <div className="about-audience-grid">
            {audiences.map(({ Icon, title, text }) => (
              <article key={title}>
                <Icon size={20} aria-hidden="true" />
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="seo-container about-open-source">
          <div className="about-open-source__icon"><Github size={30} aria-hidden="true" /></div>
          <div>
            <p className="seo-kicker">Open source and independently maintained</p>
            <h2>You can inspect the tool, contribute to it and help keep it available</h2>
            <p>Log Voyager is released under the MIT license. The repository is public so the file-handling path can be reviewed, issues can be reproduced and improvements can be proposed. There is no paid tier or account wall. Optional Ko-fi support helps cover hosting, browser testing and ongoing maintenance without changing who can use the analyzer.</p>
            <div className="home-support__actions">
              <a className="seo-button seo-button--support" href="https://ko-fi.com/hsr" target="_blank" rel="noreferrer"><Coffee size={18} /> Support on Ko-fi</a>
              <a className="seo-button" href="https://github.com/hsr88/log-voyager" target="_blank" rel="noreferrer"><Github size={18} /> Open GitHub repository</a>
            </div>
          </div>
        </section>

        <section className="seo-container about-faq">
          <div className="about-section-head">
            <h2>Questions about the project</h2>
            <p>Clear answers about privacy, supported input and the limits of browser-based analysis.</p>
          </div>
          <div className="about-faq__list">
            {aboutFaq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="seo-container about-final-cta">
          <FileSearch size={30} aria-hidden="true" />
          <div><h2>Have a log file to inspect?</h2><p>Open it locally, find the signal and export only the lines you need.</p></div>
          <a className="seo-button seo-button--primary" href="/#analyzer">Open Log Voyager <ArrowRight size={17} /></a>
        </section>
      </main>
      <SeoFooter />
    </div>
  );
};
