import React, { useEffect } from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { SeoFooter, SeoHeader } from '../../seo/SeoChrome';

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  title?: string;
  description?: string;
  imageUrl?: string;
}

// Dark theme colors (matching main app)
const DARK_BG = 'var(--color-paper)';
const DARK_PANEL = 'var(--color-panel)';
const CYAN = 'var(--color-accent)';
const TEXT = 'var(--color-ink)';
const TEXT_MUTED = 'var(--color-muted)';
const BORDER = 'var(--color-rule)';

export const BlogLayout: React.FC<BlogLayoutProps> = ({ 
  children, 
  showBackButton = false,
  title = 'Log Voyager Blog',
  description = 'Log analysis guides and tips for developers',
  imageUrl = 'https://www.logvoyager.cc/og_image.png'
}) => {
  useEffect(() => {
    document.title = title;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    
    // Update canonical link
    const pathname = window.location.pathname;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://www.logvoyager.cc${pathname}`);
    }
    
    // Update OG and Twitter meta tags
    const metaTags: Record<string, string> = {
      'og:title': title,
      'og:description': description,
      'og:url': `https://www.logvoyager.cc${pathname}`,
      'og:image': imageUrl,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': imageUrl,
    };
    
    Object.entries(metaTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      }
    });
  }, [title, description, imageUrl]);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: DARK_BG,
        backgroundSize: '40px 40px',
        backgroundImage: `linear-gradient(to right, color-mix(in oklch, var(--color-rule) 35%, transparent) 1px, transparent 1px),
                          linear-gradient(to bottom, color-mix(in oklch, var(--color-rule) 35%, transparent) 1px, transparent 1px)`
      }}
    >
      <SeoHeader />
      {/* Header */}
      <header 
        className="hidden"
        style={{ 
          backgroundColor: DARK_PANEL,
          borderColor: BORDER
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" style={{ color: CYAN }} />
            <span style={{ color: TEXT }} className="text-xl font-bold">
              Log Voyager
            </span>
          </div>
          
          <a 
            href="https://www.logvoyager.cc" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 font-medium"
            style={{ 
              backgroundColor: 'color-mix(in oklch, var(--color-accent) 12%, transparent)',
              color: CYAN 
            }}
          >
            Open App →
          </a>
        </div>
      </header>

      {/* Back Button */}
      {showBackButton && (
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <a 
            href="/blog"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-100"
            style={{ color: TEXT_MUTED }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </a>
        </div>
      )}

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer 
        className="hidden"
        style={{ 
          backgroundColor: DARK_PANEL,
          borderColor: BORDER
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p style={{ color: TEXT_MUTED }} className="text-sm">
              © 2026 Log Voyager. Free & Open Source Log Analyzer.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/hsr88/log-voyager" 
                className="text-sm transition-opacity hover:opacity-100"
                style={{ color: TEXT_MUTED }}
              >
                GitHub
              </a>
              <a 
                href="https://www.logvoyager.cc" 
                className="text-sm transition-opacity hover:opacity-100"
                style={{ color: TEXT_MUTED }}
              >
                Try Log Voyager
              </a>
            </div>
          </div>
        </div>
      </footer>
      <SeoFooter />
    </div>
  );
};
