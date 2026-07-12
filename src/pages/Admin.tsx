import { useEffect, useState } from 'react';
import { Container, CTAButton } from '../components/ui';
import raw from '../data/projects.json';
import type { Project } from '../data/site';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

const CATEGORIES = ['Rezidenčné', 'Interiéry', 'Komerčné', 'Iné'];

const emptyProject = (): Project => ({
  id: Math.max(0, ...projectsFromStorage().map((p) => p.id)) + 1,
  title: '',
  category: CATEGORIES[0],
  location: '',
  year: String(new Date().getFullYear()),
  area: '',
  cover: 0,
  images: [],
  description: '',
});

function projectsFromStorage(): Project[] {
  return (raw as { sk: Project[] }).sk;
}

const inputCls =
  'w-full min-w-0 rounded border border-line bg-paper px-3 py-2 text-[14px] text-ink focus:border-acc focus:outline-none';
const labelCls = 'label mb-1 block !text-[10px]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function ImageRow({
  url,
  isCover,
  onMakeCover,
  onRemove,
  onMove,
}: {
  url: string;
  isCover: boolean;
  onMakeCover: () => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className={`flex items-center gap-3 border p-2 ${isCover ? 'border-acc' : 'border-line'}`}>
      <img src={url} alt="" className="h-14 w-14 shrink-0 bg-paper2 object-cover" />
      <span className="flex-1 truncate text-[11px] text-mut">{url}</span>
      {isCover ? (
        <span className="label !text-acc shrink-0">titulná</span>
      ) : (
        <button
          type="button"
          onClick={onMakeCover}
          className="label shrink-0 cursor-pointer hover:!text-acc"
        >
          nastaviť ako titulnú
        </button>
      )}
      <button type="button" onClick={() => onMove(-1)} className="shrink-0 cursor-pointer px-1 text-mut hover:text-ink">
        ↑
      </button>
      <button type="button" onClick={() => onMove(1)} className="shrink-0 cursor-pointer px-1 text-mut hover:text-ink">
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 cursor-pointer px-1 text-mut hover:text-red-600"
      >
        odstrániť
      </button>
    </div>
  );
}

function ProjectEditor({
  project,
  onChange,
  onDelete,
}: {
  project: Project;
  onChange: (p: Project) => void;
  onDelete: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [open, setOpen] = useState(!project.title);

  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    onChange({ ...project, [key]: value });

  const uploadFile = async (file: File) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setUploadError('Cloudinary nie je nakonfigurované (VITE_CLOUDINARY_* premenné).');
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: form,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Nahratie zlyhalo');
      set('images', [...project.images, json.secure_url as string]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Nahratie zlyhalo');
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const next = [...project.images];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    let cover = project.cover ?? 0;
    if (cover === idx) cover = j;
    else if (cover === j) cover = idx;
    onChange({ ...project, images: next, cover });
  };

  const removeImage = (idx: number) => {
    const next = project.images.filter((_, i) => i !== idx);
    let cover = project.cover ?? 0;
    if (idx < cover) cover -= 1;
    else if (idx === cover) cover = 0;
    onChange({ ...project, images: next, cover });
  };

  return (
    <div className="border border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 bg-paper2/50 px-5 py-4 text-left"
      >
        <span className="font-disp text-lg">
          {project.title || <em className="text-mut not-italic">(nový projekt)</em>}
        </span>
        <span className="label">
          #{project.id} · {project.images.length} fotiek
        </span>
      </button>
      {open && (
      <div className="flex w-full min-w-0 flex-col gap-5 p-6">
        <div className="grid w-full min-w-0 gap-5 sm:grid-cols-2">
          <Field label="Názov *">
            <input
              className={inputCls}
              value={project.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </Field>
          <Field label="Kategória">
            <select
              className={inputCls}
              value={project.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Lokalita">
            <input
              className={inputCls}
              value={project.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </Field>
          <Field label="Rok">
            <input
              className={inputCls}
              value={project.year}
              onChange={(e) => set('year', e.target.value)}
            />
          </Field>
          <Field label="Plocha (napr. 190 m²)">
            <input
              className={inputCls}
              value={project.area ?? ''}
              onChange={(e) => set('area', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Popis">
          <textarea
            rows={5}
            className={`${inputCls} resize-y`}
            value={project.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>

        <div>
          <span className={labelCls}>Fotky ({project.images.length})</span>
          <div className="flex flex-col gap-2">
            {project.images.map((url, i) => (
              <ImageRow
                key={url + i}
                url={url}
                isCover={(project.cover ?? 0) === i}
                onMakeCover={() => set('cover', i)}
                onMove={(dir) => moveImage(i, dir)}
                onRemove={() => removeImage(i)}
              />
            ))}
          </div>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-3 border border-dashed border-line px-4 py-3 text-[13px] text-mut hover:border-acc hover:text-acc">
            {uploading ? 'Nahrávam…' : '+ Nahrať fotku'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
                e.target.value = '';
              }}
            />
          </label>
          {uploadError && <p className="mt-2 text-[13px] text-red-600">{uploadError}</p>}
        </div>

        <div className="flex justify-end border-t border-line pt-4">
          <button
            type="button"
            onClick={onDelete}
            className="label cursor-pointer !text-red-600 hover:underline"
          >
            Odstrániť celý projekt
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('arhos_admin') === '1');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>(() =>
    projectsFromStorage().map((p) => ({ ...p })),
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    document.title = 'Admin — ARHOS ateliér';
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('arhos_admin', '1');
      setAuthed(true);
      setLoginError(null);
    } else {
      setLoginError('Nesprávne heslo.');
    }
  };

  const publish = async () => {
    setStatus('saving');
    setStatusMsg('');
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, projects }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Publikovanie zlyhalo');
      setStatus('ok');
      setStatusMsg(json.message || 'Publikované.');
    } catch (e) {
      setStatus('error');
      setStatusMsg(e instanceof Error ? e.message : 'Publikovanie zlyhalo');
    }
  };

  if (!authed) {
    return (
      <Container className="flex min-h-dvh max-w-md items-center">
        <form onSubmit={login} className="w-full">
          <span className="label">Admin</span>
          <h1 className="mt-3 font-disp text-3xl">Prihlásenie</h1>
          <input
            type="password"
            autoFocus
            className={`${inputCls} mt-6`}
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && <p className="mt-2 text-[13px] text-red-600">{loginError}</p>}
          <button type="submit" className="mt-4 w-full cursor-pointer bg-ink px-6 py-3 text-paper">
            Vstúpiť
          </button>
        </form>
      </Container>
    );
  }

  return (
    <Container className="max-w-4xl pt-[130px] pb-32">
      <div className="flex items-baseline justify-between border-b border-line pb-5">
        <div>
          <span className="label">Admin</span>
          <h1 className="mt-2 font-disp text-3xl">Projekty</h1>
        </div>
        <button
          type="button"
          onClick={() =>
            setProjects((prev) => [...prev, emptyProject()])
          }
          className="label cursor-pointer hover:!text-acc"
        >
          + Nový projekt
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {projects.map((p, i) => (
          <ProjectEditor
            key={p.id}
            project={p}
            onChange={(np) => setProjects((prev) => prev.map((x, j) => (j === i ? np : x)))}
            onDelete={() => {
              if (confirm(`Naozaj odstrániť projekt "${p.title || p.id}"?`)) {
                setProjects((prev) => prev.filter((_, j) => j !== i));
              }
            }}
          />
        ))}
      </div>

      <div className="sticky bottom-6 mt-10 flex items-center gap-5 border border-line bg-paper p-5 shadow-lg">
        <CTAButton variant="ink">
          <span onClick={publish} className="contents">
            {status === 'saving' ? 'Publikujem…' : 'Publikovať zmeny'}
          </span>
        </CTAButton>
        {status === 'ok' && <p className="text-[13px] text-acc">{statusMsg}</p>}
        {status === 'error' && <p className="text-[13px] text-red-600">{statusMsg}</p>}
      </div>
    </Container>
  );
}
