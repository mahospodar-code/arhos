import { useRef } from 'react';
import { gsap } from 'gsap';

interface ProjectCardProps {
    image: string;
    title: string;
    location: string;
    category: string;
    year?: string;
    className?: string;
}

export function ProjectCard({ image, title, location, category, year, className }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const underlineRef = useRef<HTMLDivElement>(null);

    const onMouseEnter = () => {
        const ctx = gsap.context(() => {
            // Image scale
            gsap.to(imageRef.current, {
                scale: 1.05,
                duration: 0.6,
                ease: 'power2.out'
            });
            // Title move
            gsap.to(titleRef.current, {
                x: 6,
                duration: 0.4,
                ease: 'power2.out'
            });
            // Underline grow
            gsap.to(underlineRef.current, {
                scaleX: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        }, cardRef);
        return () => ctx.revert();
    };

    const onMouseLeave = () => {
        const ctx = gsap.context(() => {
            gsap.to(imageRef.current, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
            gsap.to(titleRef.current, {
                x: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
            gsap.to(underlineRef.current, {
                scaleX: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        }, cardRef);
        return () => ctx.revert();
    };

    return (
        <div
            ref={cardRef}
            className={`group cursor-pointer flex flex-col gap-4 ${className || ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-arhos-black/5">
                <img
                    ref={imageRef}
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover grayscale contrast-[1.1] transition-all duration-700"
                    loading="lazy"
                />
                {/* Overlay for categorization if needed */}
                <div className="absolute top-4 right-4 bg-arhos-cream/90 px-2 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category}
                </div>
            </div>

            {/* Info */}
            <div className="flex justify-between items-end">
                <div>
                    <h3 ref={titleRef} className="font-display font-medium text-xl text-arhos-black relative inline-block">
                        {title}
                    </h3>
                    <div ref={underlineRef} className="h-[1px] w-full bg-arhos-terracotta origin-left scale-x-0" />
                    <p className="text-sm text-arhos-gray mt-1">{location}</p>
                </div>
                {year && <span className="text-xs text-arhos-gray/60 font-medium">{year}</span>}
            </div>
        </div>
    );
}
