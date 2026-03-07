
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
    const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    
    // Store aspect ratio 'landscape' | 'portrait' for each image URL
    const [aspectRatios, setAspectRatios] = useState<Record<string, 'landscape' | 'portrait'>>({});

    // Load images to determine their aspect ratios
    useEffect(() => {
        const loadAspectRatios = async () => {
            const ratios: Record<string, 'landscape' | 'portrait'> = {};
            
            // Only process images that will be in the gallery (skip cover)
            const galleryImages = project.images.slice(1);
            
            await Promise.all(galleryImages.map(url => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        ratios[url] = img.width > img.height ? 'landscape' : 'portrait';
                        resolve();
                    };
                    img.onerror = () => {
                        ratios[url] = 'landscape'; // fallback
                        resolve();
                    };
                    img.src = url;
                });
            }));
            
            setAspectRatios(ratios);
        };
        
        loadAspectRatios();
    }, [project.images]);

    // Keyboard navigation & ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (expandedImageIndex !== null) setExpandedImageIndex(null);
                else onClose();
            } else if (e.key === 'ArrowRight' && expandedImageIndex !== null) {
                setExpandedImageIndex(prev => prev !== null ? (prev + 1) % project.images.length : null);
            } else if (e.key === 'ArrowLeft' && expandedImageIndex !== null) {
                setExpandedImageIndex(prev => prev !== null ? (prev - 1 + project.images.length) % project.images.length : null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, expandedImageIndex, project.images.length]);

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
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 w-full max-w-[1920px] mx-auto">
                    {project.images.slice(1).map((img, idx) => {
                        const isLandscape = aspectRatios[img] !== 'portrait'; // default to landscape if not loaded yet
                        const gridClass = isLandscape 
                            ? "md:col-span-12 flex" 
                            : "md:col-span-6 aspect-[4/5] md:aspect-[3/4]";
                            
                        const originalIndex = idx + 1; // Map back to original array index for lightbox
                        
                        return (
                            <div key={originalIndex} className={`${gridClass}`}>
                                <RevealOnScroll className="w-full h-full flex">
                                    <div className={`w-full relative group overflow-hidden bg-arhos-black/5 ${isLandscape ? 'h-auto flex items-center justify-center' : 'h-full'}`}>
                                        <img
                                            src={img}
                                            alt={`${project.title} - view ${originalIndex}`}
                                            className={`w-full ${isLandscape ? 'h-auto' : 'h-full'} object-cover hover:scale-[1.02] transition-transform duration-1000 ease-out cursor-zoom-in`}
                                            loading={idx === 0 ? "eager" : "lazy"}
                                            onClick={() => setExpandedImageIndex(originalIndex)}
                                        />
                                    </div>
                                </RevealOnScroll>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* --- Expanded Image Overlay --- */}
            {expandedImageIndex !== null && (
                <div
                    className="fixed inset-0 z-[250] bg-white/95 backdrop-blur-sm flex items-center justify-center cursor-zoom-out select-none"
                    onClick={() => setExpandedImageIndex(null)}
                    onTouchStart={(e) => {
                        setTouchEnd(null);
                        setTouchStart(e.targetTouches[0].clientX);
                    }}
                    onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                    onTouchEnd={() => {
                        if (!touchStart || !touchEnd) return;
                        const distance = touchStart - touchEnd;
                        const minSwipeDistance = 50;
                        if (distance > minSwipeDistance) {
                            setExpandedImageIndex((expandedImageIndex + 1) % project.images.length);
                        } else if (distance < -minSwipeDistance) {
                            setExpandedImageIndex((expandedImageIndex - 1 + project.images.length) % project.images.length);
                        }
                    }}
                >
                    {/* Desktop Prev Arrow */}
                    <button 
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-arhos-black hover:text-arhos-terracotta bg-white/50 hover:bg-white border border-arhos-gray/10 rounded-full transition-all hidden md:flex items-center justify-center z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpandedImageIndex((expandedImageIndex - 1 + project.images.length) % project.images.length);
                        }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    <img
                        src={project.images[expandedImageIndex]}
                        alt="Zoomed view"
                        className="w-full h-full object-contain p-0 md:p-12 animate-in fade-in zoom-in-95 duration-300 pointer-events-none"
                    />

                    {/* Desktop Next Arrow */}
                    <button 
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-arhos-black hover:text-arhos-terracotta bg-white/50 hover:bg-white border border-arhos-gray/10 rounded-full transition-all hidden md:flex items-center justify-center z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpandedImageIndex((expandedImageIndex + 1) % project.images.length);
                        }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    
                    <button 
                        className="absolute top-6 right-6 px-4 py-2 text-xs font-display uppercase tracking-widest text-arhos-black hover:text-arhos-terracotta bg-white/50 hover:bg-white border border-arhos-gray/10 rounded-full transition-all z-10" 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setExpandedImageIndex(null); 
                        }}
                    >
                        Zavrieť
                    </button>
                </div>
            )}
        </div>
    );
}
