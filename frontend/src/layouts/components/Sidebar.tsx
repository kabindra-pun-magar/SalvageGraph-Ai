import {
    BarChart3,
    Boxes,
    ClipboardList,
    FolderKanban,
    GitCompare,
    Map,
    PackageSearch,
    Settings,
    ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

const primaryNavigation = [
    {
        label: "Overview",
        path: "/",
        icon: BarChart3,
    },
    {
        label: "Projects",
        path: "/projects",
        icon: FolderKanban,
    },
    {
        label: "Materials",
        path: "/materials",
        icon: Boxes,
    },
    {
        label: "Requirements",
        path: "/requirements",
        icon: ClipboardList,
    },
    {
        label: "Matching",
        path: "/matching",
        icon: GitCompare,
    },
    {
        label: "Recommendations",
        path: "/recommendations",
        icon: PackageSearch,
    },
];

const secondaryNavigation = [
    {
        label: "Maps",
        path: "/maps",
        icon: Map,
    },
    {
        label: "Verification",
        path: "/verification",
        icon: ShieldCheck,
    },
];

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    return (
        <>
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full",
                )}
            >
                <div className="flex h-16 items-center border-b border-slate-100 px-5">
                    <div>
                        <div className="text-lg font-bold tracking-tight text-slate-900">
                            SalvageGraph
                        </div>
                        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            Material Intelligence
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Workspace
                    </p>

                    <div className="space-y-1">
                        {primaryNavigation.map((item) => (
                            <NavigationItem
                                key={item.path}
                                {...item}
                                onNavigate={onClose}
                            />
                        ))}
                    </div>

                    <p className="mb-2 mt-7 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Operations
                    </p>

                    <div className="space-y-1">
                        {secondaryNavigation.map((item) => (
                            <NavigationItem
                                key={item.path}
                                {...item}
                                onNavigate={onClose}
                            />
                        ))}
                    </div>
                </nav>

                <div className="border-t border-slate-100 p-3">
                    <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                            )
                        }
                    >
                        <Settings size={18} strokeWidth={1.8} />
                        <span>Settings</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
}

interface NavigationItemProps {
    label: string;
    path: string;
    icon: React.ComponentType<{
        size?: number;
        strokeWidth?: number;
    }>;
    onNavigate: () => void;
}

function NavigationItem({
    label,
    path,
    icon: Icon,
    onNavigate,
}: NavigationItemProps) {
    return (
        <NavLink
            to={path}
            end={path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
                clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )
            }
        >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
        </NavLink>
    );
}