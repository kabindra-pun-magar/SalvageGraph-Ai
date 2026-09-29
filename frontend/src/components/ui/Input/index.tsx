import {
    forwardRef,
    type InputHTMLAttributes,
} from "react";

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    id={id}
                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                        error
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            : "border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    } ${className}`}
                    {...props}
                />

                {error ? (
                    <p className="mt-1.5 text-xs text-red-600">
                        {error}
                    </p>
                ) : helperText ? (
                    <p className="mt-1.5 text-xs text-slate-500">
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = "Input";