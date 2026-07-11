// Post-build prerendering: vyrenderuje každú routu do statického HTML, aby crawlery
// a AI vyhľadávače bez JS videli telo stránky (nielen meta z index.html).
// Zároveň generuje sitemap.xml z rovnakých dát ako routy — nemôžu sa rozísť.
// Non-fatal: ak čokoľvek zlyhá, build pokračuje s pôvodným dist (so statickým SEO meta).
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const SITE_URL = 'https://www.arhos.sk';
const PORT = 41000 + Math.floor(Math.random() * 2000);

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const filePath = join(DIST, urlPath);
    if (urlPath !== '/' && existsSync(filePath) && (await stat(filePath)).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(await readFile(filePath));
      return;
    }
    // SPA fallback -> serve the shell so the app can render the requested route
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(await readFile(join(DIST, 'index.html')));
  } catch {
    res.writeHead(500); res.end('error');
  }
});

async function launchBrowser() {
  const puppeteer = (await import('puppeteer')).default;
  // Na Verceli / Linux CI použij @sparticuz/chromium (puppeteerov vlastný Chromium
  // tam padá na chýbajúce systémové knižnice — "Failed to launch ... Code: 127").
  if (process.platform === 'linux') {
    const chromium = (await import('@sparticuz/chromium')).default;
    return puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  // Lokálne (macOS/Windows) použij Chromium dodaný s puppeteer.
  return puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.warn('[prerender] dist/index.html chýba, preskakujem.');
    return;
  }

  // Routy sa odvodzujú z dát projektov (src/data/projects.json)
  let projects = { sk: [] };
  try {
    projects = JSON.parse(await readFile(join(process.cwd(), 'src', 'data', 'projects.json'), 'utf8'));
  } catch {}
  const ids = [...new Set((projects.sk || []).map((p) => p.id))];
  const routes = ['/', ...ids.map((id) => `/projekt/${id}`)];

  // sitemap.xml z tých istých rout
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${r === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  await writeFile(join(DIST, 'sitemap.xml'), sitemap);
  console.log('[prerender] sitemap.xml —', routes.length, 'URL');

  await new Promise((r) => server.listen(PORT, r));
  const browser = await launchBrowser();

  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 1366, height: 900 });
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      // Preskroluj stránku, nech IntersectionObserver odkryje všetky .reveal sekcie,
      // a vráť sa hore — zachytené HTML má potom celý obsah viditeľný aj bez JS.
      await page.evaluate(async () => {
        await new Promise((done) => {
          let y = 0;
          const step = () => {
            y += 800;
            window.scrollTo(0, y);
            if (y < document.body.scrollHeight) setTimeout(step, 60);
            else {
              window.scrollTo(0, 0);
              done(undefined);
            }
          };
          step();
        });
      });
      // Deterministicky odkry všetky reveal sekcie (IO počas rýchleho scrollu nemusí stihnúť všetky)
      await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
      });
      await new Promise((r) => setTimeout(r, 900)); // doraz na meta + reveal transitions
      const html = await page.content();
      const outDir = route === '/' ? DIST : join(DIST, route.replace(/^\//, ''));
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, 'index.html'), html);
      console.log('[prerender] ✓', route);
    } catch (e) {
      console.warn('[prerender] ⚠ preskočené', route, '-', e.message);
    } finally {
      await page.close();
    }
  }
  await browser.close();
}

main()
  .catch((e) => console.warn('[prerender] vynechané (build pokračuje):', e.message))
  .finally(() => { try { server.close(); } catch {} process.exit(0); });
