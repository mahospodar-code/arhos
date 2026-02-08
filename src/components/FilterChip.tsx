import { cn } from "@/lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    count?: number;
}

export function FilterChip({ className, active, children, count, ...props }: FilterChipProps) {
    return (
        <button
            className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent",
                active
                    ? "bg-arhos-black text-arhos-cream"
                    : "bg-transparent text-arhos-gray hover:text-arhos-black hover:border-arhos-black/10",
                className
            )}
            {...props}
        >
            <span className="flex items-center gap-2">
                {children}
                {count !== undefined && (
                    <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full",
                        active ? "bg-arhos-cream/20 text-arhos-cream" : "bg-arhos-black/5 text-arhos-gray"
                    )}>
                        {count}
                    </span>
                )}
            </span>
        </button>
    );
}
