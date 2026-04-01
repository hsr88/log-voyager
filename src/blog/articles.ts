export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  keywords: string[];
  author: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: "1",
    slug: "how-to-analyze-log-files-online",
    title: "How to Analyze Log Files Online: Complete Guide for Developers",
    description: "Learn how to analyze massive log files (10GB+) online without upload. Step-by-step guide to online log analysis with smart search, filtering, and JSON formatting.",
    content: "", // Loaded dynamically
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-01",
    readingTime: "8 min",
    keywords: ["online log file analyzer", "log file analyzer online", "analyze log files", "log analysis guide", "devops tools"],
    author: "Log Voyager Team"
  },
  {
    id: "2",
    slug: "best-free-log-file-analyzers",
    title: "Best Free Log File Analyzers & Viewers (2026 Edition)",
    description: "Comprehensive comparison of free log file analyzers. Find the best tool for large files, privacy, and features. Includes Log Voyager, Splunk Free, Graylog, and more.",
    content: "",
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-01",
    readingTime: "6 min",
    keywords: ["log file analyzer online free", "free log analyzer", "best log viewer", "log analysis tools comparison"],
    author: "Log Voyager Team"
  },
  {
    id: "3",
    slug: "online-log-reader-guide",
    title: "Online Log Reader & Viewer: Complete Guide (2026)",
    description: "Everything about online log readers and viewers. Compare client-side vs cloud-based tools, learn key features, and discover the best web-based log analysis solutions.",
    content: "",
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-01",
    readingTime: "7 min",
    keywords: ["log reader online", "log viewer online", "online log viewer", "web-based log analyzer", "browser log viewer"],
    author: "Log Voyager Team"
  },
  {
    id: "4",
    slug: "json-log-viewer-guide",
    title: "JSON Log Viewer: Complete Guide to Structured Log Analysis",
    description: "Master JSON log analysis with the best JSON log viewers. Learn structured logging patterns, search nested data, and analyze modern application logs effectively.",
    content: "",
    publishedAt: "2026-04-01",
    updatedAt: "2026-04-01",
    readingTime: "6 min",
    keywords: ["json log viewer", "json log analyzer", "structured logging", "json log format", "ndjson viewer"],
    author: "Log Voyager Team"
  }
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find(article => article.slug === slug);
}

export function getAllArticles(): BlogArticle[] {
  return blogArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getRelatedArticles(currentSlug: string, limit: number = 3): BlogArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return [];
  
  return blogArticles
    .filter(article => article.slug !== currentSlug)
    .filter(article => 
      article.keywords.some(kw => current.keywords.includes(kw))
    )
    .slice(0, limit);
}
