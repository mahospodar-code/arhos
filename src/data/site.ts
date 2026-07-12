import raw from './projects.json';

export type Project = {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  images: string[];
  description: string;
  area?: string;
  /** Index titulnej fotky v poli images (default 0). */
  cover?: number;
};

export const projects: Project[] = (raw as { sk: Project[] }).sk;

/** Cloudinary transformácia — automatický formát/kvalita + šírka (rýchle LCP). */
export const cld = (url: string, w: number) =>
  url.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`) : url;

export const areaLabel = (p: Project) =>
  p.area ? (p.area.includes('m²') ? p.area : `${p.area} m²`) : null;

/** Titulná fotka projektu — index určuje pole `cover` v projects.json (default prvá). */
export const cover = (p: Project) => p.images[p.cover ?? 0];

export const SITE = {
  phoneDisplay: '+421 910 274 925',
  phoneHref: 'tel:+421910274925',
  email: 'arhos.atelier@gmail.com',
  whatsapp:
    'https://wa.me/421910274925?text=' +
    encodeURIComponent('Dobrý deň, mám záujem o nezáväznú konzultáciu.'),
  instagram: 'https://www.instagram.com/arhos.atelier',
  facebook: 'https://www.facebook.com/profile.php?id=61589100601259',
  formspree: 'https://formspree.io/f/meerqgpr',
  cities: 'Michalovce · Košice · Bratislava',
};
