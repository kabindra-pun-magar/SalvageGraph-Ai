import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
}

export function Button({
    variant = "primary",
    className,
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const variants: Record<ButtonVariant, string> = {
        primary:
            "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900",
        secondary:
            "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
        danger:
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
        ghost:
            "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400",
    };

    return (
        <button
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}