import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({ 
  children, 
  showBackButton = false 
}) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {/* Header */}
      <header className={`${theme.panel} border-b ${theme.border} sticky top-0 z-50 backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" style={{ color: theme.accent }} />
            <h1 className={`text-xl font-bold ${theme.foreground}`}>
              Log Voyager <span className="opacity-60 font-normal">Blog</span>
            </h1>
          </div>
          
          <a 
            href="https://www.logvoyager.cc" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
            style={{ 
              backgroundColor: `${theme.accent}20`,
              color: theme.accent 
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
            className={`inline-flex items-center gap-2 ${theme.foreground} opacity-70 hover:opacity-100 transition-opacity`}
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
      <footer className={`${theme.panel} border-t ${theme.border} mt-16`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`${theme.foreground} opacity-60 text-sm`}>
              © 2026 Log Voyager. Free & Open Source Log Analyzer.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/hsr88/log-voyager" 
                className={`${theme.foreground} opacity-60 hover:opacity-100 text-sm transition-opacity`}
              >
                GitHub
              </a>
              <a 
                href="https://www.logvoyager.cc" 
                className={`${theme.foreground} opacity-60 hover:opacity-100 text-sm transition-opacity`}
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
