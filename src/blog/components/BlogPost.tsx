import React, { useEffect, useState } from 'react';
import { BlogLayout } from './BlogLayout';
import { getArticleBySlug, getRelatedArticles } from '../articles';
import { Clock, Calendar, User, ArrowRight } from 'lucide-react';

// Dark theme colors
const DARK_BG = '#050505';
const DARK_PANEL = 'rgba(20, 20, 25, 0.7)';
const CYAN = '#00f3ff';
const MAGENTA = '#ff00ff';
const TEXT = '#e2e8f0';
const TEXT_MUTED = 'rgba(226, 232, 240, 0.6)';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const ERROR_RED = '#ef4444';
const WARN_ORANGE = '#fb923c';
const INFO_BLUE = '#3b82f6';

interface BlogPostProps {
  slug: string;
}

export const BlogPost: React.FC<BlogPostProps> = ({ slug }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const article = getArticleBySlug(slug);
  const relatedArticles = getRelatedArticles(slug);

  // Update document title and meta tags
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Log Voyager Blog`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', article.description);
      
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://www.logvoyager.cc/#/blog/${article.slug}`);
      
      let ogTitle = document.querySelector('meta[property="og:title"]');
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogTitle) ogTitle.setAttribute('content', article.title);
      if (ogDesc) ogDesc.setAttribute('content', article.description);
    }
  }, [article]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/blog-articles/${slug}.md`);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
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
          <h1 
            className="text-2xl font-bold mb-4"
            style={{ color: TEXT }}
          >
            Article not found
          </h1>
          <a 
            href="#/blog"
            style={{ color: CYAN }}
            className="hover:underline"
          >
            Return to blog
          </a>
        </div>
      </BlogLayout>
    );
  }

  // Parse markdown content for display
  const renderMarkdown = (md: string): string => {
    // Split content into blocks (paragraphs, tables, code blocks)
    const blocks = md.split(/\n\n+/);
    const processedBlocks: string[] = [];
    
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i].trim();
      if (!block) continue;
      
      // Code blocks
      if (block.startsWith('```')) {
        const code = block.replace(/```(\w+)?\n?/, '').replace(/```$/, '');
        processedBlocks.push(`<pre style="background: ${DARK_BG}; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; border: 1px solid ${BORDER}; font-family: monospace; font-size: 0.875rem;"><code style="color: ${TEXT};">${code}</code></pre>`);
        continue;
      }
      
      // Tables - check if block contains table rows
      if (block.includes('|') && block.split('\n').every(line => line.includes('|'))) {
        const lines = block.split('\n').filter(line => line.trim());
        let tableHtml = `<table style="width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; border: 1px solid ${BORDER};">`;
        let isHeader = true;
        
        for (const line of lines) {
          // Skip separator line
          if (line.replace(/[-:|\s]/g, '').length === 0) continue;
          
          const cells = line.split('|').filter((cell, idx, arr) => {
            if (idx === 0 && cell.trim() === '') return false;
            if (idx === arr.length - 1 && cell.trim() === '') return false;
            return true;
          });
          
          const tag = isHeader ? 'th' : 'td';
          const bgStyle = isHeader ? `background: ${DARK_BG}; font-weight: 600;` : '';
          
          tableHtml += `<tr>`;
          cells.forEach(cell => {
            tableHtml += `<${tag} style="${bgStyle}color: ${isHeader ? TEXT : TEXT_MUTED}; padding: 0.75rem; border: 1px solid ${BORDER}; text-align: left;">${cell.trim()}</${tag}>`;
          });
          tableHtml += `</tr>`;
          isHeader = false;
        }
        
        tableHtml += `</table>`;
        processedBlocks.push(tableHtml);
        continue;
      }
      
      // Headers
      if (block.startsWith('# ')) {
        processedBlocks.push(`<h1 style="color: ${TEXT}; font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; margin-top: 2rem;">${block.replace(/^# /, '')}</h1>`);
        continue;
      }
      if (block.startsWith('## ')) {
        processedBlocks.push(`<h2 style="color: ${TEXT}; font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; margin-top: 1.5rem;">${block.replace(/^## /, '')}</h2>`);
        continue;
      }
      if (block.startsWith('### ')) {
        processedBlocks.push(`<h3 style="color: ${TEXT}; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.25rem;">${block.replace(/^### /, '')}</h3>`);
        continue;
      }
      if (block.startsWith('#### ')) {
        processedBlocks.push(`<h4 style="color: ${TEXT}; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">${block.replace(/^#### /, '')}</h4>`);
        continue;
      }
      
      // Regular paragraph with inline formatting
      let paragraph = block
        .replace(/\*\*(.*?)\*\*/g, `<strong style="color: ${TEXT}; font-weight: 600;">$1</strong>`)
        .replace(/`([^`]+)`/g, `<code style="background: ${CYAN}20; color: ${CYAN}; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; font-family: monospace;">$1</code>`)
        .replace(/- (.*$)/gim, `<li style="color: ${TEXT_MUTED}; margin-left: 1.5rem; margin-bottom: 0.5rem; list-style-type: disc;">$1</li>`)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" style="color: ${CYAN}; text-decoration: underline;">$1</a>`);
      
      processedBlocks.push(`<p style="color: ${TEXT_MUTED}; margin-bottom: 1rem; line-height: 1.75;">${paragraph}</p>`);
    }
    
    return processedBlocks.join('\n');
  };

  const getFallbackContent = (articleSlug: string): string => {
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
    
    return fallbacks[articleSlug] || 'Content loading...';
  };

  return (
    <BlogLayout showBackButton>
      <article>
        {/* Header with Image */}
        <header className="mb-8">
          {/* Article Image */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 
                className="text-2xl md:text-4xl font-bold leading-tight"
                style={{ color: TEXT }}
              >
                {article.title}
              </h1>
            </div>
          </div>
          
          <p 
            className="text-lg mb-6"
            style={{ color: TEXT_MUTED }}
          >
            {article.description}
          </p>
          
          {/* Meta */}
          <div 
            className="flex flex-wrap items-center gap-4 text-sm"
            style={{ color: TEXT_MUTED }}
          >
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
                  backgroundColor: `${CYAN}15`,
                  color: CYAN 
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <div 
          className="max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: content ? renderMarkdown(content) : renderMarkdown(getFallbackContent(slug))
          }}
        />

        {/* CTA */}
        <div 
          className="mt-12 rounded-xl p-6 border backdrop-blur-sm"
          style={{ 
            backgroundColor: DARK_PANEL,
            borderColor: BORDER
          }}
        >
          <h3 
            className="text-xl font-bold mb-3"
            style={{ color: TEXT }}
          >
            Try Log Voyager - Free Online Log Analyzer
          </h3>
          <p 
            className="mb-4"
            style={{ color: TEXT_MUTED }}
          >
            Open 10GB+ log files instantly in your browser. Zero upload, 100% privacy, 
            powerful search and JSON formatting.
          </p>
          <a 
            href="https://www.logvoyager.cc"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: CYAN,
              color: '#000' 
            }}
          >
            Open Log Voyager →
          </a>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 
              className="text-xl font-bold mb-4"
              style={{ color: TEXT }}
            >
              Related Articles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedArticles.map((related) => (
                <a
                  key={related.id}
                  href={`#/blog/${related.slug}`}
                  className="p-4 rounded-lg border transition-all hover:border-cyan-400/30 backdrop-blur-sm"
                  style={{ 
                    backgroundColor: DARK_PANEL,
                    borderColor: BORDER
                  }}
                >
                  <h4 
                    className="font-semibold mb-2"
                    style={{ color: TEXT }}
                  >
                    {related.title}
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: TEXT_MUTED }}
                  >
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
