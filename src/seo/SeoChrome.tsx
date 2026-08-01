import React from 'react';
import { BookOpenText, Braces, Coffee, Github, Heart, Info, Wrench } from 'lucide-react';

const navItems = [
  { label: 'Formats', href: '/#formats', Icon: Braces, key: 'formats' },
  { label: 'Guides', href: '/blog', Icon: BookOpenText, key: 'blog' },
  { label: 'About', href: '/about', Icon: Info, key: 'about' },
  { label: 'GitHub', href: 'https://github.com/hsr88/log-voyager', Icon: Github, key: 'github', external: true },
];

export const SeoHeader: React.FC = () => {
  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname;

  return (
    <header className="seo-site-header">
      <div className="seo-container seo-site-header__inner">
        <a className="seo-brand" href="/" aria-label="Log Voyager home">
          <img src="/lv_new.png" width="32" height="32" alt="" />
          <span>Log Voyager</span>
        </a>
        <nav className="seo-site-nav" aria-label="Primary navigation">
          {navItems.map(({ label, href, Icon, key, external }) => {
            const isCurrent = key === 'blog'
              ? pathname === '/blog' || pathname.startsWith('/blog/')
              : key === 'about'
                ? pathname === '/about'
                : false;
            return (
              <a
                key={key}
                className={`seo-nav-link${isCurrent ? ' is-current' : ''}`}
                href={href}
                aria-current={isCurrent ? 'page' : undefined}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </a>
            );
          })}
        </nav>
        <div className="seo-site-header__actions">
          <a className="seo-button seo-button--support seo-header-support" href="https://ko-fi.com/hsr" target="_blank" rel="noreferrer">
            <Coffee size={16} aria-hidden="true" /> Support
          </a>
          <a className="seo-button seo-button--primary" href="/#analyzer">
            <Wrench size={16} aria-hidden="true" /> Open analyzer
          </a>
        </div>
      </div>
    </header>
  );
};

export const SeoFooter: React.FC = () => (
  <footer className="seo-footer">
    <div className="seo-container">
      <div className="seo-footer__statement">
        <p>Private logs stay on your machine. Open-source maintenance still needs a little fuel.</p>
        <a className="seo-button seo-button--support" href="https://ko-fi.com/hsr" target="_blank" rel="noreferrer">
          <Coffee size={18} aria-hidden="true" /> Support on Ko-fi
        </a>
      </div>
      <div className="seo-footer__meta">
        <span className="seo-brand seo-brand--footer"><img src="/lv_new.png" width="28" height="28" alt="" /> Log Voyager</span>
        <nav aria-label="Footer navigation">
          <a className="seo-link" href="/blog">Guides</a>
          <a className="seo-link" href="/about">About</a>
          <a className="seo-link" href="https://github.com/hsr88/log-voyager" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
        </nav>
        <span>MIT · Made with <Heart size={13} aria-label="care" /> · © 2026</span>
      </div>
    </div>
  </footer>
);
