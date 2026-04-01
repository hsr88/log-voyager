import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BlogLayout } from './BlogLayout';
import { blogArticles } from '../articles';
import { Clock, ArrowRight, Search } from 'lucide-react';

export const BlogIndex: React.FC = () => {
  const { theme } = useTheme();

  return (
    <BlogLayout>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold ${theme.foreground} mb-4`}>
          Log Analysis <span style={{ color: theme.accent }}>Guides & Tips</span>
        </h1>
        <p className={`text-lg ${theme.foreground} opacity-70 max-w-2xl mx-auto`}>
          Learn how to analyze log files effectively. From online log viewers to 
          JSON log analysis - master the tools and techniques used by DevOps professionals.
        </p>
      </div>

      {/* Search Hint */}
      <div className={`${theme.panel} rounded-xl p-6 mb-8 border ${theme.border}`}>
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-5 h-5" style={{ color: theme.accent }} />
          <h2 className={`font-semibold ${theme.foreground}`}>Popular Topics</h2>
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
              className="px-3 py-1 rounded-full text-sm opacity-70"
              style={{ 
                backgroundColor: `${theme.accent}15`,
                color: theme.accent 
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
            className={`${theme.panel} rounded-xl p-6 border ${theme.border} transition-all duration-200 hover:border-opacity-50`}
            style={{ 
              borderColor: theme.border,
              '--tw-border-opacity': 0.3 
            } as React.CSSProperties}
          >
            <a 
              href={`#/blog/${article.slug}`}
              className="block group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className={`text-xl font-semibold ${theme.foreground} group-hover:opacity-80 transition-opacity mb-2`}>
                    {article.title}
                  </h2>
                  <p className={`${theme.foreground} opacity-70 mb-4`}>
                    {article.description}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm opacity-60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readingTime}
                    </span>
                    <span>{article.publishedAt}</span>
                  </div>
                  
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {article.keywords.slice(0, 4).map((keyword) => (
                      <span 
                        key={keyword}
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: `${theme.accent}10`,
                          color: theme.accent 
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div 
                  className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ color: theme.accent }}
                >
                  Read <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>

      {/* CTA Section */}
      <div className={`mt-12 ${theme.panel} rounded-xl p-8 text-center border ${theme.border}`}>
        <h2 className={`text-2xl font-bold ${theme.foreground} mb-3`}>
          Ready to analyze your logs?
        </h2>
        <p className={`${theme.foreground} opacity-70 mb-6`}>
          Try Log Voyager - the free online log analyzer for files of any size.
        </p>
        <a 
          href="https://www.logvoyager.cc"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          style={{ 
            backgroundColor: theme.accent,
            color: '#000' 
          }}
        >
          Open Log Voyager →
        </a>
      </div>
    </BlogLayout>
  );
};
