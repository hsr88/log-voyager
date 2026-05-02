import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

// Read the built index.html
const indexPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, 'utf-8');

const routes = [
  {
    path: '/',
    title: 'Log Voyager | Free Log File Analyzer Online — Analyze 10GB+ Logs Instantly',
    description:
      'Free online log file analyzer. Analyze massive log files (10GB+) directly in your browser. 100% privacy — no upload, no server. Instant error detection, filtering & export.',
    ogType: 'website',
    schema: true,
  },
  {
    path: '/blog',
    title: 'Log Analysis Blog | Log Voyager — Free Online Log File Analyzer',
    description:
      'Free log file analyzer online guides and tutorials. Learn how to analyze log files online free with the best online log file analyzer techniques, tools, and tips for DevOps professionals.',
    ogType: 'website',
  },
  {
    path: '/about',
    title: 'About Log Voyager | Free Online Log File Analyzer',
    description:
      'Log Voyager is a free log file analyzer online and online log file analyzer for massive files. 100% privacy, instant loading, cross-platform and open source.',
    ogType: 'website',
  },
  {
    path: '/blog/how-to-analyze-log-files-online',
    title:
      'How to Analyze Log Files Online: Complete Guide for Developers | Log Voyager Blog',
    description:
      'Learn how to analyze massive log files (10GB+) with a free log file analyzer online. Step-by-step guide to analyze log files online free with smart search, filtering, and JSON formatting.',
    ogType: 'article',
    publishedTime: '2026-01-15',
    modifiedTime: '2026-03-28',
    author: 'Log Voyager Team',
  },
  {
    path: '/blog/best-free-log-file-analyzers',
    title:
      'Best Free Log File Analyzers & Viewers (2026 Edition) | Log Voyager Blog',
    description:
      'Comprehensive comparison of log file analyzer online free tools. Find the best free online log file analyzer for large files, privacy, and features. Includes Log Voyager and more.',
    ogType: 'article',
    publishedTime: '2026-02-08',
    modifiedTime: '2026-03-25',
    author: 'Log Voyager Team',
  },
  {
    path: '/blog/online-log-reader-guide',
    title:
      'Online Log Reader & Viewer: Complete Guide (2026) | Log Voyager Blog',
    description:
      'Everything about online log readers and viewers. Compare client-side vs cloud-based tools, and discover the best online log file analyzer to analyze log files online free.',
    ogType: 'article',
    publishedTime: '2026-01-28',
    modifiedTime: '2026-03-20',
    author: 'Log Voyager Team',
  },
  {
    path: '/blog/json-log-viewer-guide',
    title:
      'JSON Log Viewer: Complete Guide to Structured Log Analysis | Log Voyager Blog',
    description:
      'Master JSON log analysis with the best free log file analyzer online. Learn structured logging patterns and analyze modern application logs with this online log file analyzer.',
    ogType: 'article',
    publishedTime: '2026-02-20',
    modifiedTime: '2026-03-30',
    author: 'Log Voyager Team',
  },
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateHtml(route) {
  let html = baseHtml;

  const url = `https://www.logvoyager.cc${route.path}`;
  const escapedTitle = escapeHtml(route.title);
  const escapedDesc = escapeHtml(route.description);

  // Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapedTitle}</title>`);

  // Meta title
  html = html.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${escapedTitle}" />`
  );

  // Meta description
  html = html.replace(
    /<meta name="description"\s+content="[^"]*" \/>/,
    `<meta name="description" content="${escapedDesc}" />`
  );

  // Canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`
  );

  // Alternate hreflang
  html = html.replace(
    /<link rel="alternate" hreflang="en" href="[^"]*" \/>/g,
    `<link rel="alternate" hreflang="en" href="${url}" />`
  );
  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/g,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`
  );

  // OG tags
  html = html.replace(
    /<meta property="og:url"[^>]*content="[^"]*"[^>]*\/>/,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta property="og:title"[^>]*content="[^"]*"[^>]*\/>/,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description"[^>]*content="[^"]*"[^>]*\/>/,
    `<meta property="og:description" content="${escapedDesc}" />`
  );
  html = html.replace(
    /<meta property="og:type"[^>]*content="[^"]*"[^>]*\/>/,
    `<meta property="og:type" content="${route.ogType}" />`
  );

  // Twitter tags
  html = html.replace(
    /<meta property="twitter:url"[^>]*content="[^"]*"[^>]*\/>/,
    `<meta property="twitter:url" content="${url}" />`
  );
  html = html.replace(
    /<meta property="twitter:title"[^>]*content="[^"]*"[^>]*\/>/,
    `<meta property="twitter:title" content="${escapedTitle}" />`
  );
  html = html.replace(
    /<meta property="twitter:description"[^>]*content="[^"]*"[^>]*\/>/,
    `<meta property="twitter:description" content="${escapedDesc}" />`
  );

  // Article-specific OG tags
  // First remove any existing article meta tags
  html = html.replace(
    /\s*<meta property="article:published_time" content="[^"]*" \/>/g,
    ''
  );
  html = html.replace(
    /\s*<meta property="article:modified_time" content="[^"]*" \/>/g,
    ''
  );
  html = html.replace(
    /\s*<meta property="article:author" content="[^"]*" \/>/g,
    ''
  );

  if (route.ogType === 'article') {
    const articleMeta = [];
    if (route.publishedTime) {
      articleMeta.push(
        `<meta property="article:published_time" content="${route.publishedTime}" />`
      );
    }
    if (route.modifiedTime) {
      articleMeta.push(
        `<meta property="article:modified_time" content="${route.modifiedTime}" />`
      );
    }
    if (route.author) {
      articleMeta.push(
        `<meta property="article:author" content="${escapeHtml(route.author)}" />`
      );
    }

    if (articleMeta.length > 0) {
      html = html.replace(
        /(<meta property="og:type" content="article" \/>)/,
        `$1\n  ${articleMeta.join('\n  ')}`
      );
    }
  }

  return html;
}

// Generate for each route
for (const route of routes) {
  const html = generateHtml(route);

  if (route.path === '/') {
    // Overwrite root index.html
    fs.writeFileSync(indexPath, html);
    console.log(`✓ ${route.path} -> index.html`);
  } else {
    // Write to dist/<path>/index.html
    const dirPath = path.join(distDir, route.path);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, 'index.html'), html);
    console.log(
      `✓ ${route.path} -> ${path.relative(distDir, path.join(dirPath, 'index.html'))}`
    );
  }
}

// Also generate 404.html
const notFoundRoute = {
  path: '/404',
  title: '404 - Page Not Found | Log Voyager',
  description: "The page you're looking for doesn't exist. Return to Log Voyager - free online log file analyzer.",
  ogType: 'website',
  noindex: true,
};
let notFoundHtml = generateHtml(notFoundRoute);
// Fix canonical and robots for 404
notFoundHtml = notFoundHtml.replace(
  /<link rel="canonical" href="[^"]*" \/>/,
  '<link rel="canonical" href="https://www.logvoyager.cc/" />'
);
notFoundHtml = notFoundHtml.replace(
  /<meta name="robots" content="[^"]*" \/>/,
  '<meta name="robots" content="noindex, nofollow" />'
);
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);
console.log(`✓ /404 -> 404.html`);

console.log('\nPrerender complete!');
