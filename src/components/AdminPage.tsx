import { useState, useRef } from 'react';
import { translations } from '../data/translations';

// --- Configuration ---
const ADMIN_PASSWORD = 'arhos2026'; // Change this to your preferred password

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
          className={`w-full px-4 py-3 border ${error ? 'border-red-500 shake' : 'border-arhos-gray/30'} font-sans text-sm focus:outline-none focus:border-arhos-terracotta transition-colors`}
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
  onSave,
  onCancel,
}: {
  project?: ProjectItem;
  onSave: (sk: ProjectItem, en: ProjectItem) => void;
  onCancel: () => void;
}) {
  const isEdit = !!project;

  // Find matching EN project
  const enProject = project
    ? translations.en.projects.items.find((p: any) => p.id === project.id)
    : null;

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const catMap: Record<string, string> = {
    'Rezidenčné': 'Residential',
    'Interiéry': 'Interiors',
    'Komerčné': 'Commercial',
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
      // Create a path placeholder — user will need to place files in /public/images/
      const safeName = file.name.replace(/\s+/g, '_').toLowerCase();
      setImageUrls((prev) => [...prev, `/images/${safeName}`]);
    });
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextId = isEdit
      ? project!.id
      : Math.max(...translations.sk.projects.items.map((p: any) => p.id), 0) + 1;

    const skItem: ProjectItem = {
      id: nextId,
      title: titleSk,
      category: category,
      location: locationSk,
      year,
      images: imageUrls,
      description: descSk,
      area,
    };

    const enItem: ProjectItem = {
      id: nextId,
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
          <p className="font-display text-sm font-bold text-arhos-black">🇸🇰 Slovensky</p>

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
          <p className="font-display text-sm font-bold text-arhos-black">🇬🇧 English</p>

          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="Auto-fill from SK if empty" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={locationEn} onChange={(e) => setLocationEn(e.target.value)} placeholder="Auto-fill from SK if empty" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} h-24 resize-none`} value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="Auto-fill from SK if empty" />
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
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
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
          <input
            className={`${inputClass} flex-1`}
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="/images/project_nazov.webp"
          />
          <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-arhos-black text-white text-sm font-display hover:bg-arhos-terracotta transition-colors">
            +
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-arhos-gray/20 text-arhos-black text-sm font-display hover:bg-arhos-gray/30 transition-colors">
            📁
          </button>
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

// --- Export Helper ---
function generateTranslationsCode(skItems: ProjectItem[], enItems: ProjectItem[]): string {
  const formatItem = (item: ProjectItem) => {
    const imagesStr = item.images.map((img) => `'${img}'`).join(',\n                        ');
    return `                {
                    id: ${item.id},
                    title: '${item.title.replace(/'/g, "\\'")}',
                    category: '${item.category}',
                    location: '${item.location.replace(/'/g, "\\'")}',
                    year: '${item.year}',
                    images: [
                        ${imagesStr}
                    ],
                    description: '${item.description.replace(/'/g, "\\'")}',
                    area: '${item.area}',
                },`;
  };

  const skItemsStr = skItems.map(formatItem).join('\n');
  const enItemsStr = enItems.map(formatItem).join('\n');

  return `// ===== ITEMS ARRAY (SK) =====
// Paste this inside sk > projects > items: [...]
${skItemsStr}

// ===== ITEMS ARRAY (EN) =====
// Paste this inside en > projects > items: [...]
${enItemsStr}`;
}

// --- Main Admin Page ---
export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('arhos_admin') === 'true';
  });

  const [skProjects, setSkProjects] = useState<ProjectItem[]>(
    () => [...translations.sk.projects.items] as ProjectItem[]
  );
  const [enProjects, setEnProjects] = useState<ProjectItem[]>(
    () => [...translations.en.projects.items] as ProjectItem[]
  );

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | undefined>();
  const [exportCode, setExportCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  const handleSave = (sk: ProjectItem, en: ProjectItem) => {
    if (editingProject) {
      // Edit
      setSkProjects((prev) => prev.map((p) => (p.id === sk.id ? sk : p)));
      setEnProjects((prev) => prev.map((p) => (p.id === en.id ? en : p)));
    } else {
      // Add
      setSkProjects((prev) => [...prev, sk]);
      setEnProjects((prev) => [...prev, en]);
    }
    setShowForm(false);
    setEditingProject(undefined);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Naozaj chcete odstrániť tento projekt?')) return;
    setSkProjects((prev) => prev.filter((p) => p.id !== id));
    setEnProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleExport = () => {
    const code = generateTranslationsCode(skProjects, enProjects);
    setExportCode(code);
  };

  const handleCopy = () => {
    if (exportCode) {
      navigator.clipboard.writeText(exportCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('arhos_admin');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-arhos-cream">
      {/* Header */}
      <header className="bg-arhos-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="font-display text-lg font-bold hover:text-arhos-terracotta transition-colors">
            ARHOS
          </a>
          <span className="text-white/40 text-sm font-sans">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-arhos-terracotta text-white text-sm font-display hover:bg-arhos-terracotta/80 transition-colors"
          >
            📤 Exportovať kód
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white/60 text-sm font-sans hover:text-white transition-colors"
          >
            Odhlásiť sa
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Export Modal */}
        {exportCode && (
          <div className="mb-8 bg-white p-6 shadow-lg border-l-4 border-arhos-terracotta">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-arhos-black">Exportovaný kód</h3>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="px-4 py-2 bg-arhos-black text-white text-sm font-display hover:bg-arhos-terracotta transition-colors">
                  {copied ? '✓ Skopírované!' : '📋 Kopírovať'}
                </button>
                <button onClick={() => setExportCode(null)} className="px-4 py-2 text-arhos-gray text-sm font-sans hover:text-arhos-black transition-colors">
                  Zavrieť
                </button>
              </div>
            </div>
            <p className="text-sm text-arhos-gray font-sans mb-3">
              Skopírujte tento kód a vložte ho do <code className="bg-arhos-cream px-1">src/data/translations.ts</code>.
              Nahraďte existujúci obsah <code className="bg-arhos-cream px-1">items: [...]</code> v oboch sekciách (SK aj EN).
            </p>
            <pre className="bg-arhos-black text-green-400 p-4 text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto">
              {exportCode}
            </pre>
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

          {skProjects.map((project) => (
            <div key={project.id} className="bg-white p-4 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="w-20 h-16 bg-arhos-cream overflow-hidden flex-shrink-0">
                {project.images[0] && (
                  <img src={project.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-arhos-black truncate">{project.title}</h3>
                <p className="text-sm text-arhos-gray font-sans truncate">
                  {project.category} · {project.location} · {project.year} · {project.images.length} fotiek
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1.5 text-sm font-display text-arhos-black bg-arhos-cream hover:bg-arhos-terracotta hover:text-white transition-colors"
                >
                  ✏️ Upraviť
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1.5 text-sm font-display text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-colors"
                >
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
            <li>Kliknite na <strong>"+ Pridať nový projekt"</strong> vyššie</li>
            <li>Vyplňte údaje v slovenčine a angličtine</li>
            <li>Pridajte cesty k obrázkom (napr. <code className="bg-arhos-cream px-1">/images/projekt_nazov.webp</code>)</li>
            <li>Kliknite na <strong>"Exportovať kód"</strong> a skopírujte ho</li>
            <li>Vložte kód do súboru <code className="bg-arhos-cream px-1">src/data/translations.ts</code></li>
            <li>Commitnite zmeny a pushnite na GitHub — Vercel automaticky nasadí</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
