import { useState, useEffect } from 'react';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  content: string;
  seoKeywords: string;
}

interface BlogData {
  sk: BlogPost[];
  en: BlogPost[];
}

// Prefill from prerendered inline data so the first client render already has content.
let cachedData: BlogData | null =
  (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__?.blog) || null;

export function useBlog() {
  const [blogPosts, setBlogPosts] = useState<BlogData>(
    cachedData || { sk: [], en: [] }
  );
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;
    fetch(`/data/blog.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: BlogData) => {
        cachedData = data;
        setBlogPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load blog posts:', err);
        setLoading(false);
      });
  }, []);

  return { blogPosts, loading };
}
