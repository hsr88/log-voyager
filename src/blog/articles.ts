export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
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
    description: "Learn how to analyze massive log files (10GB+) with a free log file analyzer online. Step-by-step guide to analyze log files online free with smart search, filtering, and JSON formatting.",
    content: "",
    imageUrl: "https://images.unsplash.com/photo-1588713444222-408f6d537ca3?q=80&w=2064&auto=format&fit=crop",
    publishedAt: "2026-01-15",
    updatedAt: "2026-03-28",
    readingTime: "12 min",
    keywords: ["online log file analyzer", "log file analyzer online", "analyze log files", "log analysis guide", "devops tools"],
    author: "Log Voyager Team"
  },
  {
    id: "2",
    slug: "best-free-log-file-analyzers",
    title: "Best Free Log File Analyzers & Viewers (2026 Edition)",
    description: "Comprehensive comparison of log file analyzer online free tools. Find the best free online log file analyzer for large files, privacy, and features.",
    content: "",
    imageUrl: "https://images.unsplash.com/photo-1627399270231-7d36245355a9?q=80&w=1548&auto=format&fit=crop",
    publishedAt: "2026-02-08",
    updatedAt: "2026-03-25",
    readingTime: "15 min",
    keywords: ["log file analyzer online free", "free log analyzer", "best log viewer", "log analysis tools comparison"],
    author: "Log Voyager Team"
  },
  {
    id: "3",
    slug: "online-log-reader-guide",
    title: "Online Log Reader & Viewer: Complete Guide (2026)",
    description: "Everything about online log readers and viewers. Compare client-side vs cloud-based tools, and discover the best online log file analyzer to analyze log files online free.",
    content: "",
    imageUrl: "https://images.unsplash.com/photo-1688582139492-734f3d3746d9?q=80&w=1734&auto=format&fit=crop",
    publishedAt: "2026-01-28",
    updatedAt: "2026-03-20",
    readingTime: "11 min",
    keywords: ["log reader online", "log viewer online", "online log viewer", "web-based log analyzer", "browser log viewer"],
    author: "Log Voyager Team"
  },
  {
    id: "4",
    slug: "json-log-viewer-guide",
    title: "JSON Log Viewer: Complete Guide to Structured Log Analysis",
    description: "Master JSON log analysis with the best free log file analyzer online. Learn structured logging patterns and analyze modern application logs with this online log file analyzer.",
    content: "",
    imageUrl: "https://images.unsplash.com/photo-1656836476760-77c0d09257ce?q=80&w=1752&auto=format&fit=crop",
    publishedAt: "2026-02-20",
    updatedAt: "2026-03-30",
    readingTime: "14 min",
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
