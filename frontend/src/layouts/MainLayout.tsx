import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

export function MainLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex min-h-screen">
                <Sidebar
                    mobileOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Topbar
                        onMenuClick={() =>
                            setMobileSidebarOpen(true)
                        }
                    />

                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto w-full max-w-[1600px]">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}