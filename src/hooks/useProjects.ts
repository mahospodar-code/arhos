import { useState, useEffect } from 'react';

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  images: string[];
  description: string;
  area: string;
}

interface ProjectsData {
  sk: ProjectItem[];
  en: ProjectItem[];
}

// Cache to avoid re-fetching. Prefill from prerendered inline data so the first
// client render already has content (no loading flash, matches prerendered HTML).
let cachedData: ProjectsData | null =
  (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__?.projects) || null;

export function useProjects() {
  const [projects, setProjects] = useState<ProjectsData>(
    cachedData || { sk: [], en: [] }
  );
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;

    fetch(`/data/projects.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: ProjectsData) => {
        cachedData = data;
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  return { projects, loading };
}
