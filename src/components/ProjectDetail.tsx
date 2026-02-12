
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type Project = {
    id: number;
    title: string;
    category: string;
    location: string;
    year: string;
    images: string[];
    description: string;
    area: string;
};

interface ProjectDetailProps {
    project: Project;
    onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (expandedImage) setExpandedImage(null);
                else onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, expandedImage]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Animation in
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: "power2.out" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-white overflow-y-auto scrollbar-hide text-arhos-black w-full"
        >
            <div className="min-h-full w-full grid grid-cols-1 lg:grid-cols-12">

                {/* --- Left Column: Sticky Info (40%) --- */}
                <div className="lg:col-span-5 px-6 py-12 lg:p-16 lg:h-screen lg:sticky lg:top-0 flex flex-col z-10 bg-white/90 backdrop-blur-sm lg:bg-transparent">

                    {/* Top: Close Button & Category */}
                    <div className="flex justify-between items-start mb-12 lg:mb-auto">
                        <button
                            onClick={onClose}
                            className="group flex items-center gap-3 text-xs font-display uppercase tracking-widest text-arhos-black/60 hover:text-arhos-terracotta transition-colors"
                        >
                            <span className="w-8 h-[1px] bg-current transition-all group-hover:w-12" />
                            Zavrieť
                        </button>

                        <span className="font-display text-xs text-arhos-terracotta uppercase tracking-[0.2em] hidden lg:block">
                            {project.category}
                        </span>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="flex flex-col justify-center space-y-8 lg:space-y-12 max-w-xl">
                        <span className="font-display text-xs text-arhos-terracotta uppercase tracking-[0.2em] lg:hidden mb-2">
                            {project.category}
                        </span>

                        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[0.95] text-arhos-black animate-in fade-in slide-in-from-left-4 duration-700">
                            {project.title}
                        </h1>

                        <div className="prose prose-arhos text-arhos-gray font-sans text-base lg:text-lg leading-relaxed animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                            <p>{project.description}</p>
                        </div>
                    </div>

                    {/* Bottom: Metadata */}
                    <div className="mt-12 lg:mt-auto pt-8 border-t border-arhos-black/10 flex flex-wrap gap-x-12 gap-y-6 text-sm font-sans text-arhos-black w-full animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                        <div>
                            <span className="block text-[10px] text-arhos-gray uppercase tracking-wider mb-1">Lokácia</span>
                            {project.location}
                        </div>
                        <div>
                            <span className="block text-[10px] text-arhos-gray uppercase tracking-wider mb-1">Rok</span>
                            {project.year}
                        </div>
                        <div>
                            <span className="block text-[10px] text-arhos-gray uppercase tracking-wider mb-1">Rozloha</span>
                            {project.area}
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Scrollable Images (60%) --- */}
                <div className="lg:col-span-7 p-4 lg:p-4 lg:pr-12 lg:pt-12 pb-12 flex flex-col gap-4 lg:gap-8 bg-white">
                    {project.images.map((img, index) => (
                        <div key={index} className="w-full relative group overflow-hidden bg-arhos-black/5">
                            <img
                                src={img}
                                alt={`${project.title} - view ${index + 1}`}
                                className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-700 ease-out cursor-zoom-in"
                                loading={index === 0 ? "eager" : "lazy"}
                                onClick={() => setExpandedImage(img)}
                            />
                        </div>
                    ))}
                </div>

            </div>

            {/* --- Expanded Image Overlay --- */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-[250] bg-white flex items-center justify-center cursor-zoom-out"
                    onClick={() => setExpandedImage(null)}
                >
                    <img
                        src={expandedImage}
                        alt="Zoomed view"
                        className="w-full h-full object-contain p-4 md:p-12 animate-in fade-in zoom-in-95 duration-300"
                    />
                </div>
            )}
        </div>
    );
}
