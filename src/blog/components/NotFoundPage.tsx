import React from 'react';
import { BlogLayout } from './BlogLayout';
import { Ghost, ArrowLeft, Home } from 'lucide-react';

const CYAN = '#00f3ff';
const TEXT = '#e2e8f0';
const TEXT_MUTED = 'rgba(226, 232, 240, 0.6)';
const PANEL = 'rgba(20, 20, 25, 0.7)';
const BORDER = 'rgba(255, 255, 255, 0.08)';

export const NotFoundPage: React.FC = () => {
  return (
    <BlogLayout 
      title="404 - Page Not Found | Log Voyager"
      description="The page you're looking for doesn't exist."
    >
      <div className="text-center py-16">
        {/* 404 Icon */}
        <div 
          className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8"
          style={{ background: `${CYAN}15` }}
        >
          <Ghost className="w-12 h-12" style={{ color: CYAN }} />
        </div>

        {/* 404 Text */}
        <h1 
          className="text-6xl font-bold mb-4"
          style={{ color: CYAN }}
        >
          404
        </h1>
        
        <h2 
          className="text-2xl font-bold mb-4"
          style={{ color: TEXT }}
        >
          Page Not Found
        </h2>
        
        <p 
          className="max-w-md mx-auto mb-8"
          style={{ color: TEXT_MUTED }}
        >
          The page you're looking for doesn't exist or has been moved. 
          Check the URL or navigate back to our blog or main application.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
            style={{ 
              backgroundColor: PANEL,
              border: `1px solid ${BORDER}`,
              color: TEXT 
            }}
          >
            <ArrowLeft size={18} />
            Back to Blog
          </a>
          
          <a 
            href="https://www.logvoyager.cc"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
            style={{ 
              backgroundColor: CYAN,
              color: '#000' 
            }}
          >
            <Home size={18} />
            Open Log Voyager
          </a>
        </div>

        {/* Suggested Links */}
        <div 
          className="mt-12 p-6 rounded-xl max-w-lg mx-auto"
          style={{ backgroundColor: PANEL, border: `1px solid ${BORDER}` }}
        >
          <h3 className="font-semibold mb-4" style={{ color: TEXT }}>
            Popular Articles
          </h3>
          <div className="space-y-2 text-left">
            <a 
              href="/blog/how-to-analyze-log-files-online"
              className="block py-2 px-3 rounded transition-colors hover:bg-white/5"
              style={{ color: TEXT_MUTED }}
            >
              → How to Analyze Log Files Online
            </a>
            <a 
              href="/blog/best-free-log-file-analyzers"
              className="block py-2 px-3 rounded transition-colors hover:bg-white/5"
              style={{ color: TEXT_MUTED }}
            >
              → Best Free Log File Analyzers
            </a>
            <a 
              href="/blog/json-log-viewer-guide"
              className="block py-2 px-3 rounded transition-colors hover:bg-white/5"
              style={{ color: TEXT_MUTED }}
            >
              → JSON Log Viewer Guide
            </a>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};
