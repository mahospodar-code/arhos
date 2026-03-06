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

// Cache to avoid re-fetching
let cachedData: ProjectsData | null = null;

export function useProjects() {
  const [projects, setProjects] = useState<ProjectsData>(
    cachedData || { sk: [], en: [] }
  );
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;

    fetch('/data/projects.json')
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
