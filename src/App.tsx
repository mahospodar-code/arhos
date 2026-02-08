import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from './components/Navigation';
import { ManifestoSection } from './sections/ManifestoSection';

import { ProjectsGridSection } from './sections/ProjectsGridSection';

import { ApproachSection } from './sections/ApproachSection';
import { ContactSection } from './sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);


import { LanguageProvider } from './context/LanguageContext';

function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Cleanup all ScrollTriggers on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <LanguageProvider>
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation onCloseProject={() => setSelectedProject(null)} />

      {/* Main Content */}
      <main ref={mainRef} className="relative">
        {/* Section 1: Manifesto - z-10 */}
        <div className="relative z-10">
          <ManifestoSection />
        </div>



        {/* Section 3: Projects Grid - z-30 */}
        <div className="relative z-30">
          <ProjectsGridSection
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </div>



        {/* Section 5: Approach - z-50 */}
        <div className="relative z-50">
          <ApproachSection />
        </div>

        {/* Section 6: Contact - z-60 */}
        <div className="relative z-[60]">
          <ContactSection />
        </div>
      </main>
    </LanguageProvider>
  );
}

export default App;