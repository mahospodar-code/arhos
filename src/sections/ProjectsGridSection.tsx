import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectDetail } from '../components/ProjectDetail';

gsap.registerPlugin(ScrollTrigger);

import { useLanguage } from '../context/LanguageContext';

interface ProjectsGridSectionProps {
  selectedProject?: any;
  setSelectedProject?: (project: any) => void;
}

export function ProjectsGridSection({ selectedProject, setSelectedProject }: ProjectsGridSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilterId, setActiveFilterId] = useState('all'); // Store filter key (all, residential...)
  // const [selectedProject, setSelectedProject] = useState<any>(null); // MOVED TO APP.TSX
  const { t } = useLanguage();

  // Projects and filters are now fully driven by translations.ts
  const currentProjects = t.projects.items;

  // Map filters from translation object
  const filters = [
    { id: 'all', label: t.projects.filters.all },
    { id: 'residential', label: t.projects.filters.residential },
    { id: 'interior', label: t.projects.filters.interior },
    { id: 'commercial', label: t.projects.filters.commercial },
  ];

  // Filtering logic:
  // If filter is 'all', return all.
  // Else, match category name. NOTE: Category names in `currentProjects` are localized!
  // So we should filter based on the localized category string.
  // Let's see: item.category in translation is "Residential" or "Rezidenčné".
  // t.projects.filters.residential matches that.

  const activeFilterLabel = filters.find(f => f.id === activeFilterId)?.label;

  const filteredProjects = activeFilterId === 'all'
    ? currentProjects
    : currentProjects.filter(p => p.category === activeFilterLabel);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      const cards = grid.querySelectorAll('.project-card');
      cards.forEach((card, index) => {
        const image = card.querySelector('.card-image');

        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );

        // Parallax on image
        if (image) {
          gsap.fromTo(
            image,
            { y: -12 },
            {
              y: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="relative w-full bg-arhos-cream py-[10vh] px-6 lg:px-[6vw]"
      >
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <h2 className="font-display font-bold text-[clamp(32px,4vw,48px)] text-arhos-black">
            {t.projects.title}
          </h2>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilterId(filter.id)}
                className={`px-4 py-2 text-xs font-display font-medium tracking-wide uppercase transition-all duration-300 ${activeFilterId === filter.id
                  ? 'bg-arhos-black text-white'
                  : 'bg-transparent text-arhos-gray hover:text-arhos-black border border-arhos-black/20 hover:border-arhos-black'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(14px,1.6vw,28px)]"
        >
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="project-card group cursor-pointer"
              onClick={() => setSelectedProject && setSelectedProject(project)}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <div className="card-image absolute inset-0 w-full h-[120%] -top-[10%]">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
                {/* Orange accent line on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-arhos-terracotta transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Content */}
              <div className="card-content">
                <h3 className="font-display font-semibold text-lg text-arhos-black group-hover:translate-x-1.5 transition-transform duration-300">
                  {project.title}
                </h3>
                <p className="font-sans text-sm text-arhos-gray mt-1">
                  {project.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Project Detail Overlay */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject && setSelectedProject(null)}
        />
      )}
    </>
  );
}