import React from 'react';
import { BlogLayout } from './BlogLayout';
import { 
  Zap, Search, FileJson, Shield, Globe, Smartphone, 
  Github, Heart, ExternalLink, Check, Star, Users,
  Clock, Lock, Code, Sparkles, Database, Terminal
} from 'lucide-react';

const CYAN = '#00f3ff';
const MAGENTA = '#ff00ff';
const TEXT = '#e2e8f0';
const TEXT_MUTED = 'rgba(226, 232, 240, 0.6)';
const BORDER = 'rgba(255, 255, 255, 0.08)';
const PANEL = 'rgba(20, 20, 25, 0.7)';

export const AboutPage: React.FC = () => {
  return (
    <BlogLayout showBackButton>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{ background: `${CYAN}15` }}>
          <Database className="w-10 h-10" style={{ color: CYAN }} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: TEXT }}>
          About <span style={{ color: CYAN }}>Log Voyager</span>
        </h1>
        <p className="text-lg max-w-3xl mx-auto" style={{ color: TEXT_MUTED }}>
          The free, open-source log file analyzer designed for developers who need to 
          analyze massive log files instantly without compromising privacy.
        </p>
      </div>

      {/* Mission Statement */}
      <div 
        className="rounded-2xl p-8 mb-8 border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: TEXT }}>
          Our Mission
        </h2>
        <p className="mb-4" style={{ color: TEXT_MUTED }}>
          Log Voyager was born from a simple frustration: analyzing large log files shouldn't require 
          uploading sensitive data to third-party servers or waiting minutes for files to load. 
          We believe that <strong style={{ color: TEXT }}>privacy and performance</strong> should never be mutually exclusive.
        </p>
        <p style={{ color: TEXT_MUTED }}>
          Built with modern web technologies, Log Voyager uses an innovative streaming architecture 
          that processes files of any size directly in your browser. Your logs never leave your device, 
          making it perfect for analyzing production systems while maintaining compliance with GDPR, HIPAA, and SOC 2.
        </p>
      </div>

      {/* Key Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <FeatureCard 
          icon={<Zap size={24} style={{ color: CYAN }} />}
          title="Instant Loading"
          description="Open 10GB+ log files in under a second using our streaming chunk technology. No more waiting for files to load into memory."
        />
        <FeatureCard 
          icon={<Shield size={24} style={{ color: '#22c55e' }} />}
          title="100% Privacy"
          description="All processing happens client-side in your browser. Your log files are never uploaded to any server."
        />
        <FeatureCard 
          icon={<Search size={24} style={{ color: MAGENTA }} />}
          title="Smart Search"
          description="Regex support, case sensitivity toggle, multi-filter system, and search history for powerful log analysis."
        />
        <FeatureCard 
          icon={<FileJson size={24} style={{ color: '#eab308' }} />}
          title="JSON Support"
          description="Automatic JSON detection with collapsible tree view, syntax highlighting, and prettify toggle."
        />
        <FeatureCard 
          icon={<Globe size={24} style={{ color: '#3b82f6' }} />}
          title="Cross-Platform"
          description="Works on Windows, macOS, Linux, iOS, and Android. No installation required - just open your browser."
        />
        <FeatureCard 
          icon={<Smartphone size={24} style={{ color: '#f97316' }} />}
          title="Mobile Ready"
          description="Native Android app available. Responsive design works perfectly on phones and tablets for on-call debugging."
        />
      </div>

      {/* How It Works */}
      <div 
        className="rounded-2xl p-8 mb-8 border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: TEXT }}>
          How Log Voyager Works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          <StepCard 
            number="1"
            title="File Selection"
            description="Drag & drop your log file or select it from your device. Supports .log, .txt, .json, and .gz files."
          />
          <StepCard 
            number="2"
            title="Streaming Analysis"
            description="Our engine maps the file structure and loads only visible portions (50KB chunks) for instant display."
          />
          <StepCard 
            number="3"
            title="Smart Navigation"
            description="Use the minimap to spot error clusters, jump to specific timestamps, or search with regex patterns."
          />
          <StepCard 
            number="4"
            title="Export Results"
            description="Bookmark important lines, export filtered results as TXT/JSON/CSV, or share findings with your team."
          />
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: TEXT }}>
          Performance Comparison
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: TEXT_MUTED }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                <th className="text-left py-3 px-4" style={{ color: TEXT }}>File Size</th>
                <th className="text-center py-3 px-4" style={{ color: TEXT }}>Log Voyager</th>
                <th className="text-center py-3 px-4" style={{ color: TEXT }}>VS Code</th>
                <th className="text-center py-3 px-4" style={{ color: TEXT }}>Notepad++</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td className="py-3 px-4">100 MB</td>
                <td className="text-center py-3 px-4" style={{ color: '#22c55e' }}>0.3s</td>
                <td className="text-center py-3 px-4">8s</td>
                <td className="text-center py-3 px-4">5s</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td className="py-3 px-4">1 GB</td>
                <td className="text-center py-3 px-4" style={{ color: '#22c55e' }}>0.5s</td>
                <td className="text-center py-3 px-4">45s</td>
                <td className="text-center py-3 px-4">25s</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                <td className="py-3 px-4">10 GB</td>
                <td className="text-center py-3 px-4" style={{ color: '#22c55e' }}>0.5s</td>
                <td className="text-center py-3 px-4" style={{ color: '#ef4444' }}>❌ Crash</td>
                <td className="text-center py-3 px-4" style={{ color: '#ef4444' }}>❌ Crash</td>
              </tr>
              <tr>
                <td className="py-3 px-4">50 GB</td>
                <td className="text-center py-3 px-4" style={{ color: '#22c55e' }}>0.8s</td>
                <td className="text-center py-3 px-4" style={{ color: '#ef4444' }}>❌ Crash</td>
                <td className="text-center py-3 px-4" style={{ color: '#ef4444' }}>❌ Crash</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="text-xs mt-4" style={{ color: TEXT_MUTED }}>
          * Tests conducted on M1 MacBook Pro with 16GB RAM. Traditional editors crash due to memory limitations.
        </p>
      </div>

      {/* Use Cases */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        <UseCaseCard 
          icon={<Terminal size={20} style={{ color: CYAN }} />}
          title="DevOps Engineers"
          description="Debug production incidents, analyze server logs, and monitor system health in real-time. Perfect for on-call troubleshooting."
        />
        <UseCaseCard 
          icon={<Code size={20} style={{ color: MAGENTA }} />}
          title="Backend Developers"
          description="Trace application errors, analyze API performance, and debug complex multi-service interactions with ease."
        />
        <UseCaseCard 
          icon={<Shield size={20} style={{ color: '#22c55e' }} />}
          title="Security Analysts"
          description="Investigate security incidents, analyze access logs, and detect suspicious patterns while keeping sensitive data local."
        />
        <UseCaseCard 
          icon={<Sparkles size={20} style={{ color: '#eab308' }} />}
          title="Site Reliability Engineers"
          description="Monitor service reliability, analyze error rates, and optimize performance with powerful aggregation features."
        />
      </div>

      {/* Open Source */}
      <div 
        className="rounded-2xl p-8 mb-8 border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl" style={{ background: `${CYAN}15` }}>
            <Github size={32} style={{ color: CYAN }} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2" style={{ color: TEXT }}>
              Open Source & Community Driven
            </h2>
            <p className="mb-4" style={{ color: TEXT_MUTED }}>
              Log Voyager is 100% free and open source (MIT License). Our code is publicly available on GitHub, 
              and we welcome contributions from the community. No hidden fees, no premium tiers, no data collection.
            </p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://github.com/hsr88/log-voyager"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                style={{ backgroundColor: CYAN, color: '#000' }}
              >
                <Star size={16} />
                Star on GitHub
              </a>
              <a 
                href="https://github.com/hsr88/log-voyager/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-all"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                <ExternalLink size={16} />
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard value="50K+" label="Monthly Users" />
        <StatCard value="10GB+" label="Max File Size" />
        <StatCard value="100%" label="Free Forever" />
        <StatCard value="0" label="Data Collected" />
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: TEXT }}>
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          <FAQItem 
            question="Is Log Voyager really free?"
            answer="Yes, Log Voyager is 100% free and open source. There are no hidden fees, no premium features, and no usage limits. We believe powerful developer tools should be accessible to everyone."
          />
          <FAQItem 
            question="How is my data kept private?"
            answer="All processing happens entirely in your browser using JavaScript. Your log files are never uploaded to our servers or anywhere else. You can verify this by checking our source code on GitHub or using browser developer tools to monitor network requests."
          />
          <FAQItem 
            question="What file formats are supported?"
            answer="Log Voyager supports all text-based log formats including .log, .txt, .json, and GZIP compressed files (.gz). It works with Apache/Nginx logs, application logs, Docker logs, JSON logs, CSV files, and more."
          />
          <FAQItem 
            question="Can I use Log Voyager offline?"
            answer="Yes! Log Voyager is a Progressive Web App (PWA). After the first visit, it works completely offline. You can also install it on your device like a native app."
          />
          <FAQItem 
            question="Is there a file size limit?"
            answer="There's no practical file size limit. We've tested Log Voyager with files up to 100GB. Because it uses streaming technology, file size is only limited by your available disk space, not RAM."
          />
          <FAQItem 
            question="Can I contribute to the project?"
            answer="Absolutely! We welcome contributions of all kinds - bug reports, feature requests, code contributions, and documentation improvements. Check out our GitHub repository to get started."
          />
        </div>
      </div>

      {/* CTA */}
      <div 
        className="rounded-2xl p-8 text-center border"
        style={{ backgroundColor: PANEL, borderColor: BORDER }}
      >
        <h2 className="text-2xl font-bold mb-3" style={{ color: TEXT }}>
          Ready to analyze your logs?
        </h2>
        <p className="mb-6" style={{ color: TEXT_MUTED }}>
          Join thousands of developers who trust Log Voyager for their log analysis needs.
        </p>
        <a 
          href="https://www.logvoyager.cc"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
          style={{ backgroundColor: CYAN, color: '#000' }}
        >
          <Zap size={18} />
          Open Log Voyager
        </a>
      </div>
    </BlogLayout>
  );
};

// Sub-components
const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ 
  icon, title, description 
}) => (
  <div 
    className="p-5 rounded-xl border transition-all hover:border-cyan-400/30"
    style={{ backgroundColor: PANEL, borderColor: BORDER }}
  >
    <div className="mb-3">{icon}</div>
    <h3 className="font-semibold mb-2" style={{ color: TEXT }}>{title}</h3>
    <p className="text-sm" style={{ color: TEXT_MUTED }}>{description}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ 
  number, title, description 
}) => (
  <div className="text-center">
    <div 
      className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold"
      style={{ backgroundColor: `${CYAN}20`, color: CYAN }}
    >
      {number}
    </div>
    <h3 className="font-semibold mb-1" style={{ color: TEXT }}>{title}</h3>
    <p className="text-xs" style={{ color: TEXT_MUTED }}>{description}</p>
  </div>
);

const UseCaseCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ 
  icon, title, description 
}) => (
  <div 
    className="p-5 rounded-xl border"
    style={{ backgroundColor: PANEL, borderColor: BORDER }}
  >
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="font-semibold" style={{ color: TEXT }}>{title}</h3>
    </div>
    <p className="text-sm" style={{ color: TEXT_MUTED }}>{description}</p>
  </div>
);

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div 
    className="p-4 rounded-xl text-center border"
    style={{ backgroundColor: PANEL, borderColor: BORDER }}
  >
    <div className="text-2xl font-bold mb-1" style={{ color: CYAN }}>{value}</div>
    <div className="text-xs" style={{ color: TEXT_MUTED }}>{label}</div>
  </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div 
    className="p-5 rounded-xl border"
    style={{ backgroundColor: PANEL, borderColor: BORDER }}
  >
    <h3 className="font-semibold mb-2" style={{ color: TEXT }}>{question}</h3>
    <p className="text-sm" style={{ color: TEXT_MUTED }}>{answer}</p>
  </div>
);
