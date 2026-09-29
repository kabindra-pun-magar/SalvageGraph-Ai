import { createBrowserRouter } from "react-router-dom";

import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { ProjectsPage } from "../features/projects/pages/ProjectsPage";

import { MainLayout } from "../layouts/MainLayout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: "projects",
                        element: <ProjectsPage />,
                    },
                ],
            },
        ],
    },
]);