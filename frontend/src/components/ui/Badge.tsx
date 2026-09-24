import type { ReactNode } from "react";
import { clsx } from "clsx";

type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
}

export function Badge({
    children,
    variant = "neutral",
}: BadgeProps) {
    const variants: Record<BadgeVariant, string> = {
        neutral: "bg-slate-100 text-slate-700",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-amber-50 text-amber-700",
        danger: "bg-red-50 text-red-700",
        info: "bg-blue-50 text-blue-700",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                variants[variant],
            )}
        >
            {children}
        </span>
    );
}