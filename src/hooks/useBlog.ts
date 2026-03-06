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

let cachedData: BlogData | null = null;

export function useBlog() {
  const [blogPosts, setBlogPosts] = useState<BlogData>(
    cachedData || { sk: [], en: [] }
  );
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;

    fetch('/data/blog.json')
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
