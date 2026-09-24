import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

interface TopbarProps {
    onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
    "/": "Overview",
    "/projects": "Projects",
    "/materials": "Materials",
    "/requirements": "Requirements",
    "/matching": "Matching",
    "/recommendations": "Recommendations",
    "/maps": "Maps",
    "/verification": "Verification",
    "/settings": "Settings",
};

export function Topbar({ onMenuClick }: TopbarProps) {
    const location = useLocation();

    const title =
        pageTitles[location.pathname] ?? "SalvageGraph";

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    aria-label="Open navigation"
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        {title}
                    </p>
                    <p className="hidden text-xs text-slate-400 sm:block">
                        SalvageGraph workspace
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Search"
                    className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                    <Search size={19} />
                </button>

                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                    <Bell size={19} />

                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                </button>

                <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    K
                </div>
            </div>
        </header>
    );
}