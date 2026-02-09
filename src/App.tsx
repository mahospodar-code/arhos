import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from './components/Navigation';
import { ManifestoSection } from './sections/ManifestoSection';
import { ProjectsGridSection } from './sections/ProjectsGridSection';
import { ApproachSection } from './sections/ApproachSection';
import { ContactSection } from './sections/ContactSection';
import { ProjectDetail } from './components/ProjectDetail';
import { SEOHead } from './components/SEOHead';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { translations } from './data/translations';

gsap.registerPlugin(ScrollTrigger);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Home Page Component
function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh ScrollTrigger when returning to Home
    ScrollTrigger.refresh();
  }, []);

  const handleProjectClick = (project: any) => {
    navigate(`/project/${project.id}`);
  };

  return (
    <>
      <SEOHead
        title="ARHOS Atelier | Architektúra & Dizajn"
        description="Racionálna architektúra, autentický interiér a nadčasový dizajn. Architektonický ateliér pôsobiaci na Slovensku a v Čechách."
      />

      {/* Navigation */}
      <Navigation />

      <main ref={mainRef} className="relative">
        <div className="relative z-10" id="manifesto">
          <ManifestoSection />
        </div>

        <div className="relative z-30" id="projects">
          <ProjectsGridSection
            selectedProject={null}
            setSelectedProject={handleProjectClick}
          />
        </div>

        <div className="relative z-50" id="approach">
          <ApproachSection />
        </div>

        <div className="relative z-[60]" id="contact">
          <ContactSection />
        </div>
      </main>
    </>
  );
}

// Project Detail Page Component
function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Find project data based on ID and Language
  const t = translations[language];
  const project = t.projects.items.find((p: any) => p.id === Number(id));

  if (!project) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-arhos-black font-display text-xl">
        Projekt nenájdený
        <button onClick={() => navigate('/')} className="ml-4 underline opacity-50 hover:opacity-100">
          Späť domov
        </button>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={project.title}
        description={project.description}
        image={project.images[0]}
        url={`/project/${project.id}`}
      />
      {/* Navigation stays visible even on detail page for easy return */}
      <Navigation onCloseProject={() => navigate('/')} />

      <ProjectDetail
        project={project}
        onClose={() => navigate('/')}
      />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <div className="grain-overlay" />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectPage />} />
          </Routes>

        </Router>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;