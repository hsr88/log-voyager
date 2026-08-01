import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectDir, 'dist');
const basePath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(basePath, 'utf8');
const esc = (value = '') => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (value) => esc(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>');

function markdownToHtml(source) {
  const lines = source.split(/\r?\n/), output = [];
  let paragraph = [], list = [];
  const flushP = () => { if (paragraph.length) output.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; };
  const flushL = () => { if (list.length) output.push(`<ul>${list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`); list = []; };
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line.startsWith('```')) { flushP(); flushL(); const code = []; i++; while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]); output.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); }
    else if (/^####\s/.test(line)) { flushP(); flushL(); output.push(`<h4>${inline(line.slice(5))}</h4>`); }
    else if (/^###\s/.test(line)) { flushP(); flushL(); output.push(`<h3>${inline(line.slice(4))}</h3>`); }
    else if (/^##\s/.test(line)) { flushP(); flushL(); output.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (/^#\s/.test(line)) { flushP(); flushL(); }
    else if (/^[-*]\s/.test(line)) { flushP(); list.push(line.slice(2)); }
    else if (!line || /^\|?\s*:?-+/.test(line)) { flushP(); flushL(); }
    else if (line.includes('|')) { flushP(); flushL(); output.push(`<p>${inline(line.replace(/^\||\|$/g, '').split('|').join(' · '))}</p>`); }
    else paragraph.push(line);
  }
  flushP(); flushL(); return output.join('\n');
}

function readUseCases() {
  const source = fs.readFileSync(path.join(projectDir, 'src', 'seo', 'useCases.ts'), 'utf8');
  const start = source.indexOf('[', source.indexOf('export const useCasePages'));
  const end = source.indexOf('\n];', start) + 2;
  return Function(`"use strict"; return (${source.slice(start, end)});`)();
}

const useCases = readUseCases();
const articles = [
  ['how-to-analyze-log-files-online', 'How to Analyze Log Files Online: Complete Guide for Developers', 'Learn a private, browser-based workflow for searching, filtering and reducing log files.', '2026-01-15', '2026-03-28'],
  ['best-free-log-file-analyzers', 'Best Free Log File Analyzers & Viewers (2026 Edition)', 'Compare free log viewers by privacy model, large-file workflow and practical investigation features.', '2026-02-08', '2026-03-25'],
  ['online-log-reader-guide', 'Online Log Reader & Viewer: Complete Guide (2026)', 'Understand local-first and cloud log readers, with a practical workflow for browser analysis.', '2026-01-28', '2026-03-20'],
  ['json-log-viewer-guide', 'JSON Log Viewer: Complete Guide to Structured Log Analysis', 'Learn how to inspect JSON and JSONL logs, search structured fields and preserve useful context.', '2026-02-20', '2026-03-30'],
].map(([slug, title, description, published, modified]) => ({ slug, title, description, published, modified }));

const shell = (body) => `<div class="static-seo"><header><a href="/">Log Voyager</a><nav><a href="/#formats">Formats</a><a href="/blog">Guides</a><a href="/about">About</a><a href="https://ko-fi.com/hsr">Support on Ko-fi</a></nav></header><main>${body}</main><footer><p>Free, private and open source. Files stay on your device.</p><a href="https://github.com/hsr88/log-voyager">Source code</a></footer></div>`;
const homeBody = shell(`<article><p>Local-first · Free · Open source</p><h1>Free online log file analyzer &amp; viewer</h1><p>Open, search and filter large log files directly in your browser. No upload, no account and no server-side import.</p><p><a href="#analyzer">Open a log file</a> · <a href="https://ko-fi.com/hsr">Support this open-source project</a></p><section><h2>Analyze the log you have, without sending it away</h2><p>Log Voyager is a free log file analyzer online, but the analysis itself stays on your machine. Open an application, web-server, container or system log and get a clear first view before choosing a larger observability workflow.</p><p>Search for an exception, request ID, status code, service name or timestamp. Use text search, case matching, regular expressions and filters to reduce a noisy export while keeping the original file unchanged.</p><h3>Common investigation tasks</h3><ul><li>Debug production exceptions</li><li>Review Nginx and Apache requests</li><li>Inspect Docker container output</li><li>Trace JSON and JSONL application events</li><li>Find request IDs in API logs</li><li>Rebuild a syslog incident timeline</li></ul><p><a href="/about">Learn how local log analysis works</a></p></section><section><h2>Inspect the formats you already use</h2><p>Focused guides for structured application output, web-server access files, container exports and system logs.</p><ul>${useCases.map(page => `<li><a href="/${page.slug}">${esc(page.headline)}</a> - ${esc(page.description)}</li>`).join('')}</ul></section><section><h2>Private by design</h2><p>File reading, search, filters, bookmarks and export run in the browser. The viewer reads small file slices around the current position instead of uploading a complete production log.</p></section><section><h2>Frequently asked questions</h2><h3>Are log files uploaded?</h3><p>No. Selected files stay on your device.</p><h3>Is Log Voyager free?</h3><p>Yes. It is MIT-licensed; optional Ko-fi contributions support maintenance.</p></section></article>`);
const useCaseBody = (page) => shell(`<article><p>Local log analysis guide</p><h1>${esc(page.headline)}</h1><p>${esc(page.lede)}</p>${page.intro.map(text => `<p>${esc(text)}</p>`).join('')}<h2>Files and formats</h2><p>${page.fileTypes.map(esc).join(' · ')}</p><h2>Common investigation tasks</h2>${page.tasks.map(task => `<section><h3>${esc(task.title)}</h3><p>${esc(task.description)}</p></section>`).join('')}<h2>A practical workflow</h2><ol>${page.workflow.map(step => `<li><strong>${esc(step.title)}</strong> - ${esc(step.description)}</li>`).join('')}</ol><h2>Frequently asked questions</h2>${page.faq.map(item => `<h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p>`).join('')}<p><a href="/#analyzer">Open the free analyzer</a></p></article>`);
const blogBody = shell(`<article><h1>Log analysis guides</h1><p>Practical, local-first tutorials for reading text, server and structured logs.</p>${articles.map(item => `<section><h2><a href="/blog/${item.slug}">${esc(item.title)}</a></h2><p>${esc(item.description)}</p></section>`).join('')}</article>`);
const aboutBody = shell(`<article><p>About Log Voyager</p><h1>Inspect log files without giving them away</h1><p>Log Voyager is a free online log file analyzer for developers, operators and system administrators. It opens text, JSON and compressed logs in the browser, keeps the selected file on your device and gives you a focused path from raw output to useful evidence.</p><p><a href="/#analyzer">Open the analyzer</a> · <a href="https://github.com/hsr88/log-voyager">Review the source</a></p><section><h2>Log analysis should start close to the file</h2><p>When a service fails, the first question is usually what happened around a timestamp, request ID or error. Log Voyager shortens that investigation loop: open the file you already have, search it, reduce the noise and keep the relevant lines.</p><p>The browser reads the file you choose and the application performs its work on your device. The public source code makes that privacy boundary easier to inspect.</p></section><section><h2>A practical viewer for messy incident files</h2><h3>Chunked file reading</h3><p>The viewer reads small slices around the current position rather than building one large document before showing useful lines.</p><h3>Search that keeps context</h3><p>Use plain text, case-sensitive matching, regular expressions and combined filters while leaving the source file unchanged.</p><h3>JSON, JSONL and compressed logs</h3><p>Inspect structured application output alongside ordinary text and supported GZIP-compressed log files.</p><h3>Evidence you can hand off</h3><p>Bookmark important lines and export a smaller TXT, JSON or CSV working set for a ticket or postmortem.</p></section><section><h2>Who uses a local log viewer?</h2><p>Backend developers can trace exceptions and request IDs. DevOps and SRE teams can review container, proxy and deployment logs. Security investigators can narrow access and system events locally. Administrators can inspect Nginx, Apache and syslog exports from the workstation already in use.</p></section><section><h2>Open source and independently maintained</h2><p>Log Voyager is released under the MIT license. There is no paid tier or account wall. Optional <a href="https://ko-fi.com/hsr">Ko-fi support</a> helps cover hosting, browser testing and ongoing maintenance.</p></section><section><h2>Questions about Log Voyager</h2><h3>Are files uploaded to a server?</h3><p>No. Selected files are processed locally in the browser.</p><h3>Can it open large log files?</h3><p>The viewer avoids loading an entire file as one document, but practical limits still depend on the browser, device, compression and file structure.</p><h3>Do I need an account?</h3><p>No. The analyzer is available without registration or a subscription.</p></section></article>`);

function schemaFor(route) {
  const url = `https://www.logvoyager.cc${route.path}`;
  if (route.kind === 'home') return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': 'https://www.logvoyager.cc/#organization', name: 'Log Voyager', url: 'https://www.logvoyager.cc/', logo: 'https://www.logvoyager.cc/lv_new.png', sameAs: ['https://github.com/hsr88/log-voyager'] },
    { '@type': 'WebSite', '@id': 'https://www.logvoyager.cc/#website', url: 'https://www.logvoyager.cc/', name: 'Log Voyager', publisher: { '@id': 'https://www.logvoyager.cc/#organization' }, inLanguage: 'en' },
    { '@type': 'SoftwareApplication', '@id': 'https://www.logvoyager.cc/#software', name: 'Log Voyager', url: 'https://www.logvoyager.cc/', applicationCategory: 'DeveloperApplication', operatingSystem: 'Web', description: route.description, browserRequirements: 'Requires JavaScript and the HTML5 File API.', license: 'https://opensource.org/licenses/MIT', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, featureList: ['Local file processing', 'Text and regular-expression search', 'Multi-filter views', 'Bookmarks', 'Error grouping', 'TXT, JSON and CSV export'] },
    { '@type': 'FAQPage', '@id': 'https://www.logvoyager.cc/#faq', mainEntity: [
      { '@type': 'Question', name: 'Are log files uploaded to a server?', acceptedAnswer: { '@type': 'Answer', text: 'No. File reading, searching, filtering and export happen in your browser. The selected file stays on your device.' } },
      { '@type': 'Question', name: 'Is Log Voyager free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The web app is free to use and its source code is available under the MIT license.' } }
    ] }
  ] };
  if (route.kind === 'article') return { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: route.title, description: route.description, datePublished: route.published, dateModified: route.modified, mainEntityOfPage: url, author: { '@type': 'Organization', name: 'Log Voyager contributors' }, publisher: { '@type': 'Organization', name: 'Log Voyager', logo: { '@type': 'ImageObject', url: 'https://www.logvoyager.cc/lv_new.png' } } };
  if (route.kind === 'use-case') return { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', name: route.title, description: route.description, url }, { '@type': 'FAQPage', mainEntity: route.data.faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }] };
  if (route.kind === 'about') return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'AboutPage', name: route.title, description: route.description, url, about: { '@id': 'https://www.logvoyager.cc/#software' } },
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'Are log files uploaded to a server?', acceptedAnswer: { '@type': 'Answer', text: 'No. Selected files are processed locally in the browser.' } },
      { '@type': 'Question', name: 'Can Log Voyager open large log files?', acceptedAnswer: { '@type': 'Answer', text: 'The viewer reads smaller slices around the current position, while practical limits depend on the browser, device, compression and file structure.' } },
      { '@type': 'Question', name: 'Do I need an account?', acceptedAnswer: { '@type': 'Answer', text: 'No. The analyzer is available without registration or a subscription.' } },
    ] },
  ] };
  return { '@context': 'https://schema.org', '@type': 'WebPage', name: route.title, description: route.description, url };
}

const routes = [
  { path: '/', title: 'Free Online Log File Analyzer & Viewer | Log Voyager', description: 'Open, search, filter and inspect log files locally in your browser. Free, private and open source - no account and no log upload.', body: homeBody, kind: 'home' },
  { path: '/blog', title: 'Log Analysis Guides | Log Voyager', description: 'Practical guides to viewing, searching and filtering text, JSON, web-server and application logs.', body: blogBody, kind: 'page' },
  { path: '/about', title: 'About Log Voyager - Free, Private Log File Analyzer', description: 'Learn how Log Voyager analyzes text, JSON, server and compressed log files locally in your browser, why it is open source, and how to contribute.', body: aboutBody, kind: 'about' },
  ...useCases.map(data => ({ path: `/${data.slug}`, title: data.title, description: data.description, body: useCaseBody(data), kind: 'use-case', data })),
  ...articles.map(data => ({ path: `/blog/${data.slug}`, title: `${data.title} | Log Voyager`, description: data.description, body: shell(`<article><h1>${esc(data.title)}</h1>${markdownToHtml(fs.readFileSync(path.join(projectDir, 'src', 'blog', 'articles', `${data.slug}.md`), 'utf8'))}</article>`), kind: 'article', ...data })),
];

function render(route) {
  const url = `https://www.logvoyager.cc${route.path}`;
  return baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${esc(route.title)}</title>`)
    .replace(/<meta name="title" content="[^"]*" \/>/, `<meta name="title" content="${esc(route.title)}" />`)
    .replace(/<meta name="description"\s+content="[^"]*" \/>/, `<meta name="description" content="${esc(route.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(route.title)}" />`)
    .replace(/<meta property="og:description"\s+content="[^"]*" \/>/, `<meta property="og:description" content="${esc(route.description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${route.kind === 'article' ? 'article' : 'website'}" />`)
    .replace(/<script id="site-schema" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="site-schema" type="application/ld+json">${JSON.stringify(schemaFor(route))}</script>`)
    .replace('<div id="root"></div>', `<div id="root">${route.body}</div>`);
}

for (const route of routes) {
  const output = route.path === '/' ? basePath : path.join(distDir, route.path.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, render(route));
  console.log(`rendered ${route.path}`);
}
fs.writeFileSync(path.join(distDir, '404.html'), render({ ...routes[0], path: '/404', title: 'Page Not Found | Log Voyager', description: 'The requested page does not exist.', body: shell('<article><h1>Page not found</h1><p><a href="/">Return to Log Voyager</a></p></article>'), kind: 'page' }).replace('index, follow', 'noindex, nofollow'));
console.log(`Static HTML generated for ${routes.length} indexable routes.`);
