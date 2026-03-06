import { useState, useRef } from 'react';

// --- Configuration ---
const ADMIN_PASSWORD = 'arhos2026';

// Type for project data
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

// --- Auto Translate (MyMemory API - free, no key needed) ---
async function autoTranslate(text: string): Promise<string> {
  if (!text.trim()) return '';
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=sk|en`
    );
    const data = await res.json();
    return data.responseData?.translatedText || text;
  } catch {
    return text; // Fallback to original if translation fails
  }
}

// --- Password Gate ---
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
          className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-arhos-gray/30'} font-sans text-sm focus:outline-none focus:border-arhos-terracotta transition-colors`}
          autoFocus
        />
        <button
          type="submit"
          className="w-full mt-4 bg-arhos-black text-white py-3 font-display font-medium hover:bg-arhos-terracotta transition-colors"
        >
          Prihlásiť sa
        </button>
        {error && <p className="text-red-500 text-sm mt-3 text-center font-sans">Nesprávne heslo</p>}
      </form>
    </div>
  );
}

// --- Project Form ---
function ProjectForm({
  project,
  enProject,
  onSave,
  onCancel,
}: {
  project?: ProjectItem;
  enProject?: ProjectItem;
  onSave: (sk: ProjectItem, en: ProjectItem) => void;
  onCancel: () => void;
}) {
  const isEdit = !!project;

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

  const catMap: Record<string, string> = {
    'Rezidenčné': 'Residential',
    'Interiéry': 'Interiors',
    'Komerčné': 'Commercial',
  };

  // --- AUTO TRANSLATE ---
  const handleAutoTranslate = async () => {
    setTranslating(true);
    try {
      const [tTitle, tLocation, tDesc] = await Promise.all([
        autoTranslate(titleSk),
        autoTranslate(locationSk),
        autoTranslate(descSk),
      ]);
      setTitleEn(tTitle);
      setLocationEn(tLocation);
      setDescEn(tDesc);
    } catch {
      // silent fail, fields stay as-is
    } finally {
      setTranslating(false);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const safeName = file.name.replace(/\s+/g, '_').toLowerCase();
      setImageUrls((prev) => [...prev, `/images/${safeName}`]);
    });
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skItem: ProjectItem = {
      id: project?.id || 0, // Will be assigned by parent
      title: titleSk,
      category: category,
      location: locationSk,
      year,
      images: imageUrls,
      description: descSk,
      area,
    };

    const enItem: ProjectItem = {
      id: project?.id || 0,
      title: titleEn || titleSk,
      category: catMap[category] || 'Residential',
      location: locationEn || locationSk,
      year,
      images: imageUrls,
      description: descEn || descSk,
      area,
    };

    onSave(skItem, enItem);
  };

  const inputClass = 'w-full px-3 py-2 border border-arhos-gray/20 font-sans text-sm focus:outline-none focus:border-arhos-terracotta transition-colors bg-white';
  const labelClass = 'font-display text-xs text-arhos-gray uppercase tracking-wider mb-1 block';

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg">
      <h2 className="font-display text-xl font-bold text-arhos-black mb-6">
        {isEdit ? 'Upraviť projekt' : 'Nový projekt'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SK Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-bold text-arhos-black">🇸🇰 Slovensky</p>
          </div>
          <div>
            <label className={labelClass}>Názov</label>
            <input className={inputClass} value={titleSk} onChange={(e) => setTitleSk(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Lokácia</label>
            <input className={inputClass} value={locationSk} onChange={(e) => setLocationSk(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Popis</label>
            <textarea className={`${inputClass} h-24 resize-none`} value={descSk} onChange={(e) => setDescSk(e.target.value)} required />
          </div>
        </div>

        {/* EN Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-bold text-arhos-black">🇬🇧 English</p>
            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={translating || (!titleSk && !descSk)}
              className="px-3 py-1.5 text-xs font-display bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-40"
            >
              {translating ? '⏳ Prekladám...' : '🔄 Auto-preklad'}
            </button>
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Automaticky preložené" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={locationEn} onChange={(e) => setLocationEn(e.target.value)} placeholder="Automaticky preložené" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} h-24 resize-none`} value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="Automaticky preložené" />
          </div>
        </div>
      </div>

      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div>
          <label className={labelClass}>Rok</label>
          <input className={inputClass} value={year} onChange={(e) => setYear(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Rozloha</label>
          <input className={inputClass} value={area} onChange={(e) => setArea(e.target.value)} placeholder="napr. 150 m²" required />
        </div>
        <div>
          <label className={labelClass}>Kategória</label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Rezidenčné">Rezidenčné</option>
            <option value="Interiéry">Interiéry</option>
            <option value="Komerčné">Komerčné</option>
          </select>
        </div>
      </div>

      {/* Images */}
      <div className="mt-6">
        <label className={labelClass}>Obrázky (cesty k súborom v /public/images/)</label>
        <div className="flex gap-2 mt-2">
          <input className={`${inputClass} flex-1`} value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="/images/projekt_nazov.webp" />
          <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-arhos-black text-white text-sm font-display hover:bg-arhos-terracotta transition-colors">+</button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-arhos-gray/20 text-arhos-black text-sm font-display hover:bg-arhos-gray/30 transition-colors">📁</button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        </div>
        {imageUrls.length > 0 && (
          <div className="mt-3 space-y-1">
            {imageUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-2 bg-arhos-cream px-3 py-1.5 text-sm font-sans">
                <span className="text-arhos-gray text-xs">{i + 1}.</span>
                <span className="flex-1 truncate">{url}</span>
                <button type="button" onClick={() => removeImage(i)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <button type="submit" className="flex-1 bg-arhos-terracotta text-white py-3 font-display font-medium hover:bg-arhos-terracotta/90 transition-colors">
          {isEdit ? 'Uložiť zmeny' : 'Pridať projekt'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-arhos-gray/30 font-display text-sm hover:bg-arhos-cream transition-colors">
          Zrušiť
        </button>
      </div>
    </form>
  );
}

// --- Main Admin Page ---
export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('arhos_admin') === 'true';
  });

  const [skProjects, setSkProjects] = useState<ProjectItem[]>([]);
  const [enProjects, setEnProjects] = useState<ProjectItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | undefined>();
  const [hasChanges, setHasChanges] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load projects from JSON
  if (!loaded && isAuthenticated) {
    fetch('/data/projects.json')
      .then((res) => res.json())
      .then((data: ProjectsData) => {
        setSkProjects(data.sk);
        setEnProjects(data.en);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  const handleSave = (sk: ProjectItem, en: ProjectItem) => {
    if (editingProject) {
      setSkProjects((prev) => prev.map((p) => (p.id === editingProject.id ? { ...sk, id: editingProject.id } : p)));
      setEnProjects((prev) => prev.map((p) => (p.id === editingProject.id ? { ...en, id: editingProject.id } : p)));
    } else {
      const nextId = Math.max(...skProjects.map((p) => p.id), 0) + 1;
      setSkProjects((prev) => [...prev, { ...sk, id: nextId }]);
      setEnProjects((prev) => [...prev, { ...en, id: nextId }]);
    }
    setShowForm(false);
    setEditingProject(undefined);
    setHasChanges(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Naozaj chcete odstrániť tento projekt?')) return;
    setSkProjects((prev) => prev.filter((p) => p.id !== id));
    setEnProjects((prev) => prev.filter((p) => p.id !== id));
    setHasChanges(true);
  };

  const handleEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // --- REORDER PROJECTS ---
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= skProjects.length) return;

    const newSk = [...skProjects];
    const newEn = [...enProjects];
    [newSk[index], newSk[newIndex]] = [newSk[newIndex], newSk[index]];
    [newEn[index], newEn[newIndex]] = [newEn[newIndex], newEn[index]];
    setSkProjects(newSk);
    setEnProjects(newEn);
    setHasChanges(true);
  };

  // --- PUBLISH (auto-commit to GitHub) ---
  const handlePublish = async () => {
    setPublishing(true);
    setPublishStatus(null);

    const data: ProjectsData = { sk: skProjects, en: enProjects };

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: ADMIN_PASSWORD, projects: data }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setPublishStatus({ type: 'success', message: result.message });
        setHasChanges(false);
      } else {
        setPublishStatus({ type: 'error', message: result.error || 'Publikovanie zlyhalo' });
      }
    } catch {
      setPublishStatus({ type: 'error', message: 'Chyba pripojenia k serveru.' });
    } finally {
      setPublishing(false);
    }
  };

  // --- DOWNLOAD (fallback) ---
  const handleDownload = () => {
    const data: ProjectsData = { sk: skProjects, en: enProjects };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('arhos_admin');
    setIsAuthenticated(false);
  };

  // Find EN project for editing
  const editingEnProject = editingProject
    ? enProjects.find((p) => p.id === editingProject.id)
    : undefined;

  return (
    <div className="min-h-screen bg-arhos-cream">
      {/* Header */}
      <header className="bg-arhos-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="font-display text-lg font-bold hover:text-arhos-terracotta transition-colors">ARHOS</a>
          <span className="text-white/40 text-sm font-sans">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-5 py-2 bg-green-600 text-white text-sm font-display hover:bg-green-700 transition-colors animate-pulse disabled:animate-none disabled:opacity-60"
            >
              {publishing ? '⏳ Publikujem...' : '🚀 Publikovať'}
            </button>
          )}
          <button onClick={handleDownload} className="px-3 py-2 text-white/40 text-xs font-sans hover:text-white transition-colors" title="Záložné stiahnutie">
            ⬇️
          </button>
          <button onClick={handleLogout} className="px-4 py-2 text-white/60 text-sm font-sans hover:text-white transition-colors">
            Odhlásiť sa
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Publish Status */}
        {publishStatus && (
          <div className={`mb-6 p-4 text-sm font-sans ${publishStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {publishStatus.type === 'success' ? '✅ ' : '❌ '}{publishStatus.message}
          </div>
        )}
        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => { setEditingProject(undefined); setShowForm(true); }}
            className="mb-6 px-6 py-3 bg-arhos-black text-white font-display font-medium hover:bg-arhos-terracotta transition-colors"
          >
            + Pridať nový projekt
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <ProjectForm
              project={editingProject}
              enProject={editingEnProject}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingProject(undefined); }}
            />
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-arhos-black">
            Projekty ({skProjects.length})
          </h2>
          {skProjects.map((project, index) => (
            <div key={project.id} className="bg-white p-4 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
              {/* Reorder Buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveProject(index, 'up')}
                  disabled={index === 0}
                  className="px-1.5 py-0.5 text-xs text-arhos-gray hover:text-arhos-black hover:bg-arhos-cream transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Posunúť hore"
                >▲</button>
                <button
                  onClick={() => moveProject(index, 'down')}
                  disabled={index === skProjects.length - 1}
                  className="px-1.5 py-0.5 text-xs text-arhos-gray hover:text-arhos-black hover:bg-arhos-cream transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Posunúť dole"
                >▼</button>
              </div>
              <div className="w-20 h-16 bg-arhos-cream overflow-hidden flex-shrink-0">
                {project.images[0] && <img src={project.images[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-arhos-black truncate">{project.title}</h3>
                <p className="text-sm text-arhos-gray font-sans truncate">
                  {project.category} · {project.location} · {project.year} · {project.images.length} fotiek
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(project)} className="px-3 py-1.5 text-sm font-display text-arhos-black bg-arhos-cream hover:bg-arhos-terracotta hover:text-white transition-colors">
                  ✏️ Upraviť
                </button>
                <button onClick={() => handleDelete(project.id)} className="px-3 py-1.5 text-sm font-display text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-colors">
                  🗑️ Zmazať
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white p-6 shadow-sm border-t-2 border-arhos-terracotta">
          <h3 className="font-display font-bold text-arhos-black mb-3">📖 Ako pridať projekt</h3>
          <ol className="list-decimal list-inside text-sm text-arhos-gray font-sans space-y-2">
            <li>Nahrajte fotky projektu do priečinka <code className="bg-arhos-cream px-1">public/images/</code> vo formáte WebP</li>
            <li>Kliknite na <strong>"+ Pridať nový projekt"</strong></li>
            <li>Vyplňte údaje v slovenčine → kliknite <strong>"🔄 Auto-preklad"</strong> → angličtina sa doplní sama</li>
            <li>Pridajte cesty k obrázkom</li>
            <li>Kliknite na zelené tlačidlo <strong>"🚀 Publikovať"</strong> — zmeny sa automaticky nasadia na web</li>
          </ol>
          <p className="text-xs text-arhos-gray/60 font-sans mt-4">
            Stránka sa aktualizuje automaticky do ~60 sekúnd po publikovaní.
          </p>
        </div>
      </div>
    </div>
  );
}
