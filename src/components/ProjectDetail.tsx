
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

    // Helper for grid classes based on index
    const getGridClass = (index: number) => {
        // Pattern: 0:Full, 1:Half, 2:Half, 3:Third, 4:Third, 5:Third -> Repeat
        const patternIndex = index % 6;
        if (patternIndex === 0) return "md:col-span-12"; // 1 per row
        if (patternIndex === 1 || patternIndex === 2) return "md:col-span-6"; // 2 per row
        return "md:col-span-4"; // 3 per row
    };

    // Scroll Reveal Hook (Simple Intersection Observer)
    const RevealOnScroll = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        const ref = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-12');
                        observer.unobserve(entry.target);
                    }
                },
                { threshold: 0.1, rootMargin: '50px' }
            );
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, []);

        return (
            <div ref={ref} className={`opacity-0 translate-y-12 transition-all duration-1000 ease-out ${className}`}>
                {children}
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-white overflow-y-auto scrollbar-hide text-arhos-black w-full"
        >
            {/* Close Button - Fixed Top Right */}
            <button
                onClick={onClose}
                className="fixed top-6 right-6 z-[220] px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-display uppercase tracking-widest text-arhos-black hover:text-arhos-terracotta border border-arhos-black/10 hover:border-arhos-terracotta transition-all rounded-full"
            >
                Close
            </button>


            <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 py-12 lg:py-20">

                {/* --- Header (Meta Data) - Centered --- */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 md:mb-32">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <p className="font-display text-xs text-arhos-terracotta uppercase tracking-[0.2em]">
                            {project.category}
                        </p>
                        <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-arhos-black">
                            {project.title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-sans text-arhos-black mt-10 pt-10 border-t border-arhos-black/10 w-full animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
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
                        <div>
                            <span className="block text-[10px] text-arhos-gray uppercase tracking-wider mb-1">Status</span>
                            Dokončené
                        </div>
                    </div>

                    <div className="prose prose-arhos text-arhos-gray font-sans text-lg leading-relaxed max-w-[65ch] mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        <p>
                            {project.description}
                        </p>
                    </div>
                </div>

                {/* --- Main Content (Smart Grid) --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 w-full max-w-[1800px] mx-auto">
                    {project.images.map((img, index) => (
                        <div key={index} className={`${getGridClass(index)}`}>
                            <RevealOnScroll className="w-full h-full">
                                <div className="w-full h-full relative group overflow-hidden bg-arhos-black/5">
                                    <img
                                        src={img}
                                        alt={`${project.title} - view ${index + 1}`}
                                        className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-700 ease-out cursor-zoom-in"
                                        style={{ aspectRatio: getGridClass(index).includes('col-span-12') ? '16/9' : '4/5' }}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        onClick={() => setExpandedImage(img)}
                                    />
                                </div>
                            </RevealOnScroll>
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
