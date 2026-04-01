import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BlogLayout } from './BlogLayout';
import { getArticleBySlug, getRelatedArticles, type BlogArticle } from '../articles';
import { Clock, Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPostProps {
  slug: string;
}

export const BlogPost: React.FC<BlogPostProps> = ({ slug }) => {
  const { theme } = useTheme();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const article = getArticleBySlug(slug);
  const relatedArticles = getRelatedArticles(slug);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/src/blog/articles/${slug}.md`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          // Fallback - render without content
          setContent('');
        }
      } catch {
        setContent('');
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [slug]);

  if (!article) {
    return (
      <BlogLayout showBackButton>
        <div className="text-center py-16">
          <h1 className={`text-2xl font-bold ${theme.foreground} mb-4`}>
            Article not found
          </h1>
          <a 
            href="#/blog"
            className="text-blue-500 hover:underline"
          >
            Return to blog
          </a>
        </div>
      </BlogLayout>
    );
  }

  // Parse markdown content for display
  // For production, you'd want to properly process the markdown
  const renderMarkdown = (md: string) => {
    // Simple markdown rendering - in production use a proper library
    return md
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-5">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded text-sm" style="background:' + theme.accent + '20">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="p-4 rounded-lg overflow-x-auto my-4" style="background:' + theme.panel + '"><code>$1</code></pre>')
      .replace(/- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline" style="color:' + theme.accent + '">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, '</p>');
  };

  return (
    <BlogLayout showBackButton>
      <article>
        {/* Header */}
        <header className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${theme.foreground} mb-4 leading-tight`}>
            {article.title}
          </h1>
          
          <p className={`text-lg ${theme.foreground} opacity-70 mb-6`}>
            {article.description}
          </p>
          
          {/* Meta */}
          <div className={`flex flex-wrap items-center gap-4 text-sm ${theme.foreground} opacity-60`}>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readingTime} read
            </span>
          </div>
          
          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mt-4">
            {article.keywords.map((keyword) => (
              <span 
                key={keyword}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ 
                  backgroundColor: `${theme.accent}15`,
                  color: theme.accent 
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div 
          className={`prose prose-lg max-w-none ${theme.foreground}`}
          dangerouslySetInnerHTML={{ 
            __html: content ? renderMarkdown(content) : renderMarkdown(getFallbackContent(slug))
          }}
        />

        {/* CTA */}
        <div className={`mt-12 ${theme.panel} rounded-xl p-6 border ${theme.border}`}>
          <h3 className={`text-xl font-bold ${theme.foreground} mb-3`}>
            Try Log Voyager - Free Online Log Analyzer
          </h3>
          <p className={`${theme.foreground} opacity-70 mb-4`}>
            Open 10GB+ log files instantly in your browser. Zero upload, 100% privacy, 
            powerful search and JSON formatting.
          </p>
          <a 
            href="https://www.logvoyager.cc"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200"
            style={{ 
              backgroundColor: theme.accent,
              color: '#000' 
            }}
          >
            Open Log Voyager →
          </a>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className={`text-xl font-bold ${theme.foreground} mb-4`}>
              Related Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedArticles.map((related) => (
                <a
                  key={related.id}
                  href={`#/blog/${related.slug}`}
                  className={`${theme.panel} p-4 rounded-lg border ${theme.border} hover:border-opacity-50 transition-all`}
                >
                  <h4 className={`font-semibold ${theme.foreground} mb-2`}>
                    {related.title}
                  </h4>
                  <p className={`text-sm ${theme.foreground} opacity-70`}>
                    {related.description.slice(0, 100)}...
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
    </BlogLayout>
  );
};

// Fallback content when markdown files can't be loaded
function getFallbackContent(slug: string): string {
  const fallbacks: Record<string, string> = {
    'how-to-analyze-log-files-online': `
## What is an Online Log File Analyzer?

An online log file analyzer is a web-based tool that allows you to examine log files directly in your browser without installing software.

## Why Traditional Log Viewers Fall Short

Most text editors try to load the entire file into memory. Modern online log analyzers use streaming with O(1) memory usage.

## Step-by-Step Guide

1. Choose a privacy-first tool like Log Voyager
2. Open your log file (drag & drop)
3. Use the minimap to spot error clusters
4. Search with regex patterns
5. Use bookmarks for important findings

[Try Log Voyager](https://www.logvoyager.cc)
    `,
    'best-free-log-file-analyzers': `
## Top Free Log Analyzers

### 1. Log Voyager ⭐
- Unlimited file sizes
- 100% client-side
- Instant loading

### 2. Splunk Free
- 500MB/day limit
- Cloud-based
- Powerful search

### 3. Graylog
- Self-hosted
- Requires setup
- Good for teams

[Compare all tools](https://www.logvoyager.cc)
    `,
    'online-log-reader-guide': `
## Types of Online Log Readers

### Client-Side (Privacy-First)
Files processed entirely in your browser. Nothing uploaded.

### Cloud-Based
Files uploaded to remote servers.

### Key Features
- Large file support
- Smart search
- JSON formatting
- Mobile support

[Try Log Voyager](https://www.logvoyager.cc)
    `,
    'json-log-viewer-guide': `
## What Are JSON Logs?

Structured logging format with named fields and types.

## Why JSON Logs?

- Structured data
- Easy parsing
- Nested objects
- Query-friendly

## Best JSON Log Viewers

Log Voyager offers pretty-print, collapsible sections, and field search for JSON logs.

[Analyze JSON Logs](https://www.logvoyager.cc)
    `
  };
  
  return fallbacks[slug] || 'Content loading...';
}
