import React from 'react';
import { BlogLayout } from './BlogLayout';
import { blogArticles } from '../articles';
import { Clock, ArrowRight, Search } from 'lucide-react';

// Dark theme colors
const DARK_BG = '#050505';
const DARK_PANEL = 'rgba(20, 20, 25, 0.7)';
const CYAN = '#00f3ff';
const MAGENTA = '#ff00ff';
const TEXT = '#e2e8f0';
const TEXT_MUTED = 'rgba(226, 232, 240, 0.6)';
const BORDER = 'rgba(255, 255, 255, 0.08)';

export const BlogIndex: React.FC = () => {
  return (
    <BlogLayout 
      title="Log Voyager Blog | Log Analysis Guides & Tips"
      description="Learn how to analyze log files effectively. From online log viewers to JSON log analysis - master the tools and techniques used by DevOps professionals."
    >
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: TEXT }}
        >
          Log Analysis <span style={{ color: CYAN }}>Guides & Tips</span>
        </h1>
        <p 
          className="text-lg max-w-2xl mx-auto"
          style={{ color: TEXT_MUTED }}
        >
          Learn how to analyze log files effectively. From online log viewers to 
          JSON log analysis - master the tools and techniques used by DevOps professionals.
        </p>
      </div>

      {/* Search Hint */}
      <div 
        className="rounded-xl p-6 mb-8 border backdrop-blur-sm"
        style={{ 
          backgroundColor: DARK_PANEL,
          borderColor: BORDER
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Search className="w-5 h-5" style={{ color: CYAN }} />
          <h2 style={{ color: TEXT }} className="font-semibold">Popular Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "online log file analyzer",
            "log viewer online",
            "json log viewer",
            "large log files",
            "free log analyzer",
            "devops tools"
          ].map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1.5 rounded-full text-sm"
              style={{ 
                backgroundColor: `${CYAN}15`,
                color: CYAN 
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6">
        {blogArticles.map((article) => (
          <article 
            key={article.id}
            className="rounded-xl overflow-hidden border transition-all duration-200 hover:border-cyan-400/30 backdrop-blur-sm"
            style={{ 
              backgroundColor: DARK_PANEL,
              borderColor: BORDER
            }}
          >
            <a 
              href={`/blog/${article.slug}`}
              className="block group"
            >
              {/* Article Image */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 
                    className="text-xl md:text-2xl font-bold mb-2 transition-opacity group-hover:opacity-90"
                    style={{ color: TEXT }}
                  >
                    {article.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-6">
                <p 
                  className="mb-4"
                  style={{ color: TEXT_MUTED }}
                >
                  {article.description}
                </p>
                
                {/* Meta */}
                <div 
                  className="flex items-center gap-4 text-sm mb-4"
                  style={{ color: TEXT_MUTED }}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readingTime}
                  </span>
                  <span>{article.publishedAt}</span>
                </div>
                
                {/* Keywords & Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.slice(0, 3).map((keyword) => (
                      <span 
                        key={keyword}
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: `${CYAN}10`,
                          color: CYAN 
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <div 
                    className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ color: CYAN }}
                  >
                    Read <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>

      {/* CTA Section */}
      <div 
        className="mt-12 rounded-xl p-8 text-center border backdrop-blur-sm"
        style={{ 
          backgroundColor: DARK_PANEL,
          borderColor: BORDER
        }}
      >
        <h2 
          className="text-2xl font-bold mb-3"
          style={{ color: TEXT }}
        >
          Ready to analyze your logs?
        </h2>
        <p 
          className="mb-6"
          style={{ color: TEXT_MUTED }}
        >
          Try Log Voyager - the free online log analyzer for files of any size.
        </p>
        <a 
          href="https://www.logvoyager.cc"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
          style={{ 
            backgroundColor: CYAN,
            color: '#000' 
          }}
        >
          Open Log Voyager →
        </a>
      </div>
    </BlogLayout>
  );
};
