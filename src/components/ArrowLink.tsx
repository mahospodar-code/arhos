import { cn } from "@/lib/utils";

interface ArrowLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    children: React.ReactNode;
}

export function ArrowLink({ className, href, children, ...props }: ArrowLinkProps) {
    const content = (
        <>
            {children}
            <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </>
    );

    const baseStyles = "text-sm font-medium text-arhos-black hover:text-arhos-terracotta transition-colors flex items-center gap-2 group cursor-pointer";

    if (href) {
        return (
            <a href={href} className={cn(baseStyles, className)}>
                {content}
            </a>
        );
    }

    return (
        <button className={cn(baseStyles, className)} {...props}>
            {content}
        </button>
    );
}
