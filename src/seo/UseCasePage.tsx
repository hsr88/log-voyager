import React, { useEffect } from 'react';
import { ArrowRight, Check, FileText, Search } from 'lucide-react';
import { SeoFooter, SeoHeader } from './SeoChrome';
import { getUseCaseBySlug, useCasePages } from './useCases';

export const UseCasePage: React.FC<{ slug: string }> = ({ slug }) => {
  const page = getUseCaseBySlug(slug);

  useEffect(() => {
    if (!page) return;
    document.title = page.title;
    const setMeta = (selector: string, value: string) => document.querySelector(selector)?.setAttribute('content', value);
    setMeta('meta[name="description"]', page.description);
    setMeta('meta[name="robots"]', 'index, follow');
    setMeta('meta[property="og:title"]', page.title);
    setMeta('meta[property="og:description"]', page.description);
    setMeta('meta[property="og:url"]', `https://www.logvoyager.cc/${page.slug}`);
    setMeta('meta[property="twitter:title"]', page.title);
    setMeta('meta[property="twitter:description"]', page.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    canonical?.setAttribute('href', `https://www.logvoyager.cc/${page.slug}`);

    const existingSchema = document.getElementById('site-schema') as HTMLScriptElement | null;
    const previousSchema = existingSchema?.textContent ?? '';
    const script = existingSchema ?? document.createElement('script');
    if (!existingSchema) {
      script.id = 'site-schema';
      script.type = 'application/ld+json';
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `https://www.logvoyager.cc/${page.slug}#webpage`,
          url: `https://www.logvoyager.cc/${page.slug}`,
          name: page.title,
          description: page.description,
          isPartOf: { '@id': 'https://www.logvoyager.cc/#website' },
          about: { '@id': 'https://www.logvoyager.cc/#software' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.logvoyager.cc/' },
            { '@type': 'ListItem', position: 2, name: page.shortName, item: `https://www.logvoyager.cc/${page.slug}` }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: page.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
        }
      ]
    });
    if (!existingSchema) document.head.appendChild(script);
    return () => {
      if (existingSchema) script.textContent = previousSchema;
      else script.remove();
    };
  }, [page]);

  if (!page) return null;
  const related = page.related.map((relatedSlug) => useCasePages.find((item) => item.slug === relatedSlug)).filter(Boolean);

  return (
    <div className="seo-shell use-case-page">
      <SeoHeader />
      <main>
        <section className="seo-container use-case-hero">
          <nav aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">{page.shortName}</span></nav>
          <div className="use-case-hero__grid">
            <div>
              <p className="seo-kicker">Free local analyzer</p>
              <h1 className="seo-display">{page.headline}</h1>
              <p className="use-case-hero__lede">{page.lede}</p>
              <div className="use-case-hero__actions">
                <a className="seo-button seo-button--primary" href="/#analyzer"><FileText size={18} /> Open a file</a>
                <a className="seo-button" href="#workflow"><Search size={18} /> View workflow</a>
              </div>
            </div>
            <figure className="use-case-sample">
              <figcaption>Example input</figcaption>
              <pre><code>{page.sample}</code></pre>
              <div><span>processed locally</span><span>{page.fileTypes.slice(0, 4).join(' · ')}</span></div>
            </figure>
          </div>
        </section>

        <section className="seo-container use-case-intro">
          <h2 className="seo-heading">What this viewer helps you investigate</h2>
          <div>{page.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>

        <section className="seo-container use-case-tasks">
          {page.tasks.map((task) => <article key={task.title}><Check size={19} /><div><h3>{task.title}</h3><p>{task.description}</p></div></article>)}
        </section>

        <section className="use-case-patterns">
          <div className="seo-container">
            <div><p className="seo-kicker">Useful starting points</p><h2 className="seo-heading">Search patterns for {page.shortName.toLowerCase()}</h2></div>
            <ul>{page.patterns.map((pattern) => <li key={pattern}><code>{pattern}</code></li>)}</ul>
          </div>
        </section>

        <section id="workflow" className="seo-container use-case-workflow">
          <div><h2 className="seo-heading">From source file to a smaller evidence set</h2><p className="seo-prose">The source stays unchanged. Every step narrows what you are looking at without moving the original file to a remote service.</p></div>
          <ol>{page.workflow.map((step, index) => <li key={step.title}><span>{index + 1}.0</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
        </section>

        <section className="seo-container use-case-faq">
          <h2 className="seo-heading">Common questions</h2>
          <div>{page.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
        </section>

        <section className="seo-container use-case-related">
          <h2>Related local log viewers</h2>
          <div>{related.map((item) => item && <a key={item.slug} href={`/${item.slug}`}><span>{item.shortName}</span><ArrowRight size={18} /></a>)}</div>
        </section>
      </main>
      <SeoFooter />
    </div>
  );
};
