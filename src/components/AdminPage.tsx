import { useState, useRef, useEffect } from 'react';

// --- Configuration ---
const ADMIN_PASSWORD = 'arhos2026';

// --- Types ---
interface ProjectItem {
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

interface BlogPost {
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

// --- Utils ---
async function autoTranslate(text: string): Promise<string> {
  if (!text.trim()) return '';
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=sk|en`);
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special chars with hyphen
    .replace(/(^-|-$)+/g, ''); // Trim hyphens
}

// --- Components ---
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('arhos_admin', 'true');
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-arhos-cream flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg max-w-sm w-full mx-4">
        <h1 className="font-display text-2xl font-bold text-arhos-black mb-6 text-center">ARHOS Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Heslo"
          className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-arhos-gray/30'} font-sans text-sm focus:outline-none focus:border-arhos-terracotta`}
          autoFocus
        />
        <button type="submit" className="w-full mt-4 bg-arhos-black text-white py-3 font-display font-medium hover:bg-arhos-terracotta">Prihlásiť sa</button>
      </form>
    </div>
  );
}

// --- Project Form (from previous) ---
function ProjectForm({ project, enProject, onSave, onCancel }: { project?: ProjectItem; enProject?: ProjectItem; onSave: (sk: ProjectItem, en: ProjectItem) => void; onCancel: () => void; }) {
  const [titleSk, setTitleSk] = useState(project?.title || '');
  const [titleEn, setTitleEn] = useState(enProject?.title || '');
  const [locationSk, setLocationSk] = useState(project?.location || '');
  const [locationEn, setLocationEn] = useState(enProject?.location || '');
  const [descSk, setDescSk] = useState(project?.description || '');
  const [descEn, setDescEn] = useState(enProject?.description || '');
  const [year, setYear] = useState(project?.year || new Date().getFullYear().toString());
  const [area, setArea] = useState(project?.area || '');
  const [category, setCategory] = useState(project?.category || 'Rezidenčné');
  const [imageUrls, setImageUrls] = useState<string[]>(project?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [translating, setTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const catMap: Record<string, string> = { 'Rezidenčné': 'Residential', 'Interiéry': 'Interiors', 'Komerčné': 'Commercial' };

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const [tTitle, tLoc, tDesc] = await Promise.all([autoTranslate(titleSk), autoTranslate(locationSk), autoTranslate(descSk)]);
      setTitleEn(tTitle); setLocationEn(tLoc); setDescEn(tDesc);
    } finally { setTranslating(false); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newImgs = Array.from(e.target.files).map(f => `/images/${f.name.replace(/\s+/g, '_').toLowerCase()}`);
    setImageUrls([...imageUrls, ...newImgs]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      { id: project?.id || 0, title: titleSk, category, location: locationSk, year, images: imageUrls, description: descSk, area },
      { id: project?.id || 0, title: titleEn || titleSk, category: catMap[category] || category, location: locationEn || locationSk, year, images: imageUrls, description: descEn || descSk, area }
    );
  };

  const inputClass = 'w-full px-3 py-2 border border-arhos-gray/20 font-sans text-sm focus:outline-none focus:border-arhos-terracotta bg-white';
  const labelClass = 'font-display text-xs text-arhos-gray uppercase tracking-wider mb-1 block';

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg mb-8">
      <h2 className="font-display text-xl font-bold mb-6">{project ? 'Upraviť projekt' : 'Nový projekt'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="font-display text-sm font-bold">🇸🇰 Slovensky</p>
          <div><label className={labelClass}>Názov</label><input className={inputClass} value={titleSk} onChange={e => setTitleSk(e.target.value)} required /></div>
          <div><label className={labelClass}>Lokácia</label><input className={inputClass} value={locationSk} onChange={e => setLocationSk(e.target.value)} required /></div>
          <div><label className={labelClass}>Popis</label><textarea className={`${inputClass} h-24`} value={descSk} onChange={e => setDescSk(e.target.value)} required /></div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-display text-sm font-bold">🇬🇧 English</p>
            <button type="button" onClick={handleAutoTranslate} disabled={translating} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5">{translating ? '⏳' : '🔄'} Auto-preklad</button>
          </div>
          <div><label className={labelClass}>Title</label><input className={inputClass} value={titleEn} onChange={e => setTitleEn(e.target.value)} /></div>
          <div><label className={labelClass}>Location</label><input className={inputClass} value={locationEn} onChange={e => setLocationEn(e.target.value)} /></div>
          <div><label className={labelClass}>Description</label><textarea className={`${inputClass} h-24`} value={descEn} onChange={e => setDescEn(e.target.value)} /></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div><label className={labelClass}>Rok</label><input className={inputClass} value={year} onChange={e => setYear(e.target.value)} required /></div>
        <div><label className={labelClass}>Rozloha</label><input className={inputClass} value={area} onChange={e => setArea(e.target.value)} required /></div>
        <div><label className={labelClass}>Kategória</label><select className={inputClass} value={category} onChange={e => setCategory(e.target.value)}><option>Rezidenčné</option><option>Interiéry</option><option>Komerčné</option></select></div>
      </div>
      <div className="mt-6">
        <label className={labelClass}>Obrázky (/public/images/)</label>
        <div className="flex gap-2 mb-2">
          <input className={inputClass} value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="/images/foto.webp" />
          <button type="button" onClick={() => { if(newImageUrl) setImageUrls([...imageUrls, newImageUrl]); setNewImageUrl(''); }} className="px-4 bg-arhos-black text-white">+</button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 bg-gray-100">📁</button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
        </div>
        {imageUrls.map((url, idx) => <div key={idx} className="flex gap-2 text-sm bg-gray-50 p-2 mb-1">{url} <button type="button" onClick={()=>setImageUrls(imageUrls.filter((_,i)=>i!==idx))} className="text-red-500 ml-auto">✕</button></div>)}
      </div>
      <div className="flex gap-3 mt-8">
        <button type="submit" className="flex-1 bg-arhos-terracotta text-white py-3">Uložiť</button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border">Zrušiť</button>
      </div>
    </form>
  );
}

// --- Blog Form ---
function BlogForm({ post, enPost, onSave, onCancel }: { post?: BlogPost; enPost?: BlogPost; onSave: (sk: BlogPost, en: BlogPost) => void; onCancel: () => void; }) {
  const [titleSk, setTitleSk] = useState(post?.title || '');
  const [titleEn, setTitleEn] = useState(enPost?.title || '');
  const [contentSk, setContentSk] = useState(post?.content || '');
  const [contentEn, setContentEn] = useState(enPost?.content || '');
  const [date, setDate] = useState(post?.date || new Date().toISOString().split('T')[0]);
  const [coverImage, setCoverImage] = useState(post?.coverImage || '');
  const [seoKeywordsSk, setSeoKeywordsSk] = useState(post?.seoKeywords || '');
  const [seoKeywordsEn, setSeoKeywordsEn] = useState(enPost?.seoKeywords || '');
  const [translating, setTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const [tTitle, tContent, tSeo] = await Promise.all([autoTranslate(titleSk), autoTranslate(contentSk), autoTranslate(seoKeywordsSk)]);
      setTitleEn(tTitle); setContentEn(tContent); setSeoKeywordsEn(tSeo);
    } finally { setTranslating(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = generateSlug(titleSk);
    const enSlug = generateSlug(titleEn || titleSk);
    
    onSave(
      { id: post?.id || 0, slug, title: titleSk, date, coverImage, content: contentSk, seoKeywords: seoKeywordsSk },
      { id: post?.id || 0, slug: enSlug, title: titleEn || titleSk, date, coverImage, content: contentEn || contentSk, seoKeywords: seoKeywordsEn || seoKeywordsSk }
    );
  };

  const inputClass = 'w-full px-3 py-2 border border-arhos-gray/20 font-sans text-sm focus:outline-none focus:border-arhos-terracotta bg-white';
  const labelClass = 'font-display text-xs text-arhos-gray uppercase tracking-wider mb-1 block';

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg mb-8 border-t-4 border-blue-500">
      <h2 className="font-display text-xl font-bold mb-6">{post ? 'Upraviť článok' : 'Nový článok'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="font-display text-sm font-bold">🇸🇰 Slovensky</p>
          <div><label className={labelClass}>Nadpis</label><input className={inputClass} value={titleSk} onChange={e => setTitleSk(e.target.value)} required /></div>
          <div><label className={labelClass}>Obsah (odseky oddelené prázdnym riadkom)</label><textarea className={`${inputClass} h-48`} value={contentSk} onChange={e => setContentSk(e.target.value)} required /></div>
          <div><label className={labelClass}>SEO Klúčové slová (oddelené čiarkou)</label><input className={inputClass} value={seoKeywordsSk} onChange={e => setSeoKeywordsSk(e.target.value)} required /></div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-display text-sm font-bold">🇬🇧 English</p>
            <button type="button" onClick={handleAutoTranslate} disabled={translating} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5">{translating ? '⏳' : '🔄'} Auto-preklad</button>
          </div>
          <div><label className={labelClass}>Title</label><input className={inputClass} value={titleEn} onChange={e => setTitleEn(e.target.value)} /></div>
          <div><label className={labelClass}>Content</label><textarea className={`${inputClass} h-48`} value={contentEn} onChange={e => setContentEn(e.target.value)} /></div>
          <div><label className={labelClass}>SEO Keywords</label><input className={inputClass} value={seoKeywordsEn} onChange={e => setSeoKeywordsEn(e.target.value)} /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div><label className={labelClass}>Dátum</label><input type="date" className={inputClass} value={date} onChange={e => setDate(e.target.value)} required /></div>
        <div><label className={labelClass}>Titulný obrázok (/images/...)</label><input className={inputClass} value={coverImage} onChange={e => setCoverImage(e.target.value)} required placeholder="/images/blog_cover.jpg" /></div>
      </div>
      <div className="flex gap-3 mt-8">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-3">Uložiť článok</button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border">Zrušiť</button>
      </div>
    </form>
  );
}

// --- Main Admin Page ---
export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('arhos_admin') === 'true');
  const [activeTab, setActiveTab] = useState<'projects' | 'blog'>('projects');
  
  // Data State
  const [skProjects, setSkProjects] = useState<ProjectItem[]>([]);
  const [enProjects, setEnProjects] = useState<ProjectItem[]>([]);
  const [skBlog, setSkBlog] = useState<BlogPost[]>([]);
  const [enBlog, setEnBlog] = useState<BlogPost[]>([]);
  
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(undefined);
  
  const [hasChanges, setHasChanges] = useState({ projects: false, blog: false });
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string; tab: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated && !loaded) {
      Promise.all([
        fetch('/data/projects.json').then(r => r.json()).catch(() => ({ sk: [], en: [] })),
        fetch('/data/blog.json').then(r => r.json()).catch(() => ({ sk: [], en: [] }))
      ]).then(([projData, blogData]: [ProjectsData, BlogData]) => {
        setSkProjects(projData.sk || []);
        setEnProjects(projData.en || []);
        setSkBlog(blogData.sk || []);
        setEnBlog(blogData.en || []);
        setLoaded(true);
      });
    }
  }, [isAuthenticated, loaded]);

  if (!isAuthenticated) return <PasswordGate onUnlock={() => setIsAuthenticated(true)} />;

  // Handlers for Projects
  const handleSaveProject = (sk: ProjectItem, en: ProjectItem) => {
    if (editingItem) {
      setSkProjects(prev => prev.map(p => p.id === editingItem.id ? { ...sk, id: editingItem.id } : p));
      setEnProjects(prev => prev.map(p => p.id === editingItem.id ? { ...en, id: editingItem.id } : p));
    } else {
      const nextId = Math.max(...skProjects.map(p => p.id), 0) + 1;
      setSkProjects(prev => [...prev, { ...sk, id: nextId }]);
      setEnProjects(prev => [...prev, { ...en, id: nextId }]);
    }
    setShowForm(false); setEditingItem(undefined); setHasChanges(p => ({ ...p, projects: true }));
  };

  const moveProject = (index: number, dir: 'up' | 'down') => {
    const ni = dir === 'up' ? index - 1 : index + 1;
    if (ni < 0 || ni >= skProjects.length) return;
    const nSk = [...skProjects]; const nEn = [...enProjects];
    [nSk[index], nSk[ni]] = [nSk[ni], nSk[index]];
    [nEn[index], nEn[ni]] = [nEn[ni], nEn[index]];
    setSkProjects(nSk); setEnProjects(nEn); setHasChanges(p => ({ ...p, projects: true }));
  };

  const deleteProject = (id: number) => {
    if (!confirm('Zmazať projekt?')) return;
    setSkProjects(prev => prev.filter(p => p.id !== id));
    setEnProjects(prev => prev.filter(p => p.id !== id));
    setHasChanges(p => ({ ...p, projects: true }));
  };

  // Handlers for Blog
  const handleSaveBlog = (sk: BlogPost, en: BlogPost) => {
    if (editingItem) {
      setSkBlog(prev => prev.map(p => p.id === editingItem.id ? { ...sk, id: editingItem.id } : p));
      setEnBlog(prev => prev.map(p => p.id === editingItem.id ? { ...en, id: editingItem.id } : p));
    } else {
      const nextId = Math.max(...skBlog.map(p => p.id), 0) + 1;
      setSkBlog(prev => [{ ...sk, id: nextId }, ...prev]); // Add to top
      setEnBlog(prev => [{ ...en, id: nextId }, ...prev]);
    }
    setShowForm(false); setEditingItem(undefined); setHasChanges(p => ({ ...p, blog: true }));
  };

  const deleteBlog = (id: number) => {
    if (!confirm('Zmazať článok?')) return;
    setSkBlog(prev => prev.filter(p => p.id !== id));
    setEnBlog(prev => prev.filter(p => p.id !== id));
    setHasChanges(p => ({ ...p, blog: true }));
  };

  // Publish
  const handlePublish = async (type: 'projects' | 'blog') => {
    setPublishing(true);
    const data = type === 'projects' ? { sk: skProjects, en: enProjects } : { sk: skBlog, en: enBlog };
    
    try {
      const res = await fetch('/api/publish', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: ADMIN_PASSWORD, type, data }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setPublishStatus({ type: 'success', message: 'Úspešne publikované! Web sa onedlho aktualizuje.', tab: type });
        setHasChanges(p => ({ ...p, [type]: false }));
      } else {
        setPublishStatus({ type: 'error', message: result.error || 'Nastala chyba pri publikovaní.', tab: type });
      }
    } catch {
      setPublishStatus({ type: 'error', message: 'Chyba sieťového pripojenia.', tab: type });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-arhos-cream">
      <header className="bg-arhos-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-[100]">
        <div className="flex items-center gap-8">
          <a href="/" className="font-display font-bold hover:text-arhos-terracotta">ARHOS</a>
          <nav className="flex gap-4">
            <button onClick={() => { setActiveTab('projects'); setShowForm(false); setPublishStatus(null); }} className={`font-sans text-sm pb-1 ${activeTab === 'projects' ? 'border-b-2 border-white' : 'text-white/50'}`}>Projekty</button>
            <button onClick={() => { setActiveTab('blog'); setShowForm(false); setPublishStatus(null); }} className={`font-sans text-sm pb-1 ${activeTab === 'blog' ? 'border-b-2 border-white' : 'text-white/50'}`}>Magazín (Blog)</button>
          </nav>
        </div>
        <div className="flex gap-4 items-center">
          {hasChanges[activeTab] && (
            <button onClick={() => handlePublish(activeTab)} disabled={publishing} className="bg-green-600 px-4 py-2 text-sm font-bold animate-pulse">
              {publishing ? '⏳ ...' : `🚀 Publikovať ${activeTab === 'projects'? 'Projekty' : 'Blog'}`}
            </button>
          )}
          <button onClick={() => { sessionStorage.clear(); location.reload(); }} className="text-white/60 hover:text-white text-sm">Odhlásiť</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {publishStatus?.tab === activeTab && (
          <div className={`p-4 mb-6 ${publishStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {publishStatus.message}
          </div>
        )}

        {!showForm && (
          <button onClick={() => { setEditingItem(undefined); setShowForm(true); }} className={`mb-6 px-6 py-3 text-white font-bold ${activeTab === 'projects' ? 'bg-arhos-black' : 'bg-blue-600'}`}>
            + Pridať {activeTab === 'projects' ? 'projekt' : 'článok'}
          </button>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <>
            {showForm && <ProjectForm project={editingItem} enProject={editingItem ? enProjects.find(p => p.id === editingItem.id) : undefined} onSave={handleSaveProject} onCancel={() => setShowForm(false)} />}
            <div className="space-y-3">
              {skProjects.map((p, i) => (
                <div key={p.id} className="bg-white p-4 flex gap-4 items-center group shadow-sm">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveProject(i, 'up')} disabled={i===0} className="text-xs disabled:opacity-20">▲</button>
                    <button onClick={() => moveProject(i, 'down')} disabled={i===skProjects.length-1} className="text-xs disabled:opacity-20">▼</button>
                  </div>
                  <div className="w-16 h-12 bg-gray-100">{p.images[0] && <img src={p.images[0]} className="w-full h-full object-cover" alt=""/>}</div>
                  <div className="flex-1 font-display font-medium">{p.title}</div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => { setEditingItem(p); setShowForm(true); }} className="bg-gray-100 px-3 py-1 text-sm">Upraviť</button>
                    <button onClick={() => deleteProject(p.id)} className="bg-red-50 text-red-600 px-3 py-1 text-sm">Zmazať</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* BLOG TAB */}
        {activeTab === 'blog' && (
          <>
            {showForm && <BlogForm post={editingItem} enPost={editingItem ? enBlog.find(p => p.id === editingItem.id) : undefined} onSave={handleSaveBlog} onCancel={() => setShowForm(false)} />}
            <div className="space-y-3">
              {skBlog.map((p) => (
                <div key={p.id} className="bg-white p-4 flex gap-4 items-center group shadow-sm border-l-4 border-blue-500">
                  <div className="w-16 h-12 bg-gray-100">{p.coverImage && <img src={p.coverImage} className="w-full h-full object-cover" alt=""/>}</div>
                  <div className="flex-1">
                    <div className="font-display font-medium">{p.title}</div>
                    <div className="text-xs text-gray-400">{p.date}</div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                    <button onClick={() => { setEditingItem(p); setShowForm(true); }} className="bg-gray-100 px-3 py-1 text-sm">Upraviť</button>
                    <button onClick={() => deleteBlog(p.id)} className="bg-red-50 text-red-600 px-3 py-1 text-sm">Zmazať</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}
