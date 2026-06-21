// Post-build prerendering: vyrenderuje každú routu do statického HTML, aby crawlery
// a AI vyhľadávače bez JS videli telo stránky (nielen meta z index.html).
// Non-fatal: ak čokoľvek zlyhá, build pokračuje s pôvodným dist (so statickým SEO meta).
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const DATA_DIR = join(process.cwd(), 'public', 'data');
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

  // Načítaj dáta na (a) enumeráciu routes a (b) inline do HTML (sync init na klientovi = bez loading flashu)
  let projects = { sk: [], en: [] }, blog = { sk: [], en: [] };
  try { projects = JSON.parse(await readFile(join(DATA_DIR, 'projects.json'), 'utf8')); } catch {}
  try { blog = JSON.parse(await readFile(join(DATA_DIR, 'blog.json'), 'utf8')); } catch {}

  const ids = new Set([...(projects.sk || []), ...(projects.en || [])].map((p) => p.id));
  const slugs = new Set([...(blog.sk || []), ...(blog.en || [])].map((b) => b.slug));
  const routes = ['/', '/blog',
    ...[...ids].map((id) => `/project/${id}`),
    ...[...slugs].map((s) => `/blog/${s}`)];

  const inline = `<script>window.__INITIAL_DATA__=${JSON.stringify({ projects, blog }).replace(/</g, '\\u003c')}</script>`;

  await new Promise((r) => server.listen(PORT, r));
  const browser = await launchBrowser();

  for (const route of routes) {
    const page = await browser.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 700)); // doraz na helmet + render
      let html = await page.content();
      html = html.replace('</head>', `${inline}\n</head>`);
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
