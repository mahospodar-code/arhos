import { useEffect } from 'react';

const SITE_URL = 'https://www.arhos.sk';

type MetaInput = {
  title: string;
  description: string;
  /** Cesta routy s lomkou na začiatku, napr. "/projekt/1". */
  path: string;
  image?: string;
};

function upsert(selector: string, create: () => HTMLElement): HTMLElement {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

const meta = (name: string) => () => {
  const el = document.createElement('meta');
  el.setAttribute('name', name);
  return el;
};

const prop = (property: string) => () => {
  const el = document.createElement('meta');
  el.setAttribute('property', property);
  return el;
};

const link = (rel: string) => () => {
  const el = document.createElement('link');
  el.setAttribute('rel', rel);
  return el;
};

/** Per-route SEO meta — title, description, canonical a Open Graph.
 *  Funguje na klientovi aj pri prerenderi (puppeteer zachytí upravený <head>). */
export function useMeta({ title, description, path, image }: MetaInput) {
  useEffect(() => {
    document.title = title;
    upsert('meta[name="description"]', meta('description')).setAttribute('content', description);
    upsert('link[rel="canonical"]', link('canonical')).setAttribute('href', SITE_URL + path);
    upsert('meta[property="og:title"]', prop('og:title')).setAttribute('content', title);
    upsert('meta[property="og:description"]', prop('og:description')).setAttribute(
      'content',
      description,
    );
    upsert('meta[property="og:url"]', prop('og:url')).setAttribute('content', SITE_URL + path);
    if (image) {
      upsert('meta[property="og:image"]', prop('og:image')).setAttribute('content', image);
    }
  }, [title, description, path, image]);
}
