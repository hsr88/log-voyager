import React from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

// Dark theme colors (matching main app)
const DARK_BG = '#050505';
const DARK_PANEL = 'rgba(20, 20, 25, 0.7)';
const CYAN = '#00f3ff';
const TEXT = '#e2e8f0';
const TEXT_MUTED = 'rgba(226, 232, 240, 0.6)';
const BORDER = 'rgba(255, 255, 255, 0.08)';

export const BlogLayout: React.FC<BlogLayoutProps> = ({ 
  children, 
  showBackButton = false 
}) => {
  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: DARK_BG,
        backgroundSize: '40px 40px',
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`
      }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{ 
          backgroundColor: DARK_PANEL,
          borderColor: BORDER
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" style={{ color: CYAN }} />
            <h1 style={{ color: TEXT }} className="text-xl font-bold">
              Log Voyager <span className="opacity-60 font-normal">Blog</span>
            </h1>
          </div>
          
          <a 
            href="https://www.logvoyager.cc" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80 font-medium"
            style={{ 
              backgroundColor: `${CYAN}20`,
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
            href="#/blog"
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
        className="mt-16 border-t"
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
    </div>
  );
};
