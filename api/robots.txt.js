export default function handler(req, res) {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: https://www.logvoyager.cc/sitemap.xml\n`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(robots);
}
