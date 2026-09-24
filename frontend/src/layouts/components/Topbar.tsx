import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    clearAuth,
    getStoredUser,
} from "../../features/auth/services/authStorage";

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
    const navigate = useNavigate();

    const user = getStoredUser();

    const title =
        pageTitles[location.pathname] ?? "SalvageGraph";

    const handleLogout = () => {
        clearAuth();

        navigate("/login", {
            replace: true,
        });
    };

    const userInitial = user?.name
        ? user.name.charAt(0).toUpperCase()
        : "K";

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

                <div className="relative ml-2 group">
                    <button
                        type="button"
                        aria-label="Open user menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        {userInitial}
                    </button>

                    <div className="invisible absolute right-0 top-11 w-56 translate-y-1 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="border-b border-slate-100 px-3 py-2">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user?.name ?? "User"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                {user?.email ?? ""}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <LogOut size={16} />

                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}