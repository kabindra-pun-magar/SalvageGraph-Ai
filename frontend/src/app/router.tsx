import { createBrowserRouter } from "react-router-dom";

import { DashboardPage } from "../features/dashboard/pages/DashboardPage";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";

import { ProjectsPage } from "../features/projects/pages/ProjectsPage";
import { ProjectDetailsPage } from "../features/projects/pages/ProjectDetailsPage";

import MaterialsPage from "../features/materials/pages/MaterialsPage";
import MaterialDetailsPage from "../features/materials/pages/MaterialDetailsPage";
import MaterialRegistrationPage from "../features/materials/pages/MaterialRegistrationPage";
import MaterialEditPage from "../features/materials/pages/MaterialEditPage";

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
                    // Dashboard
                    {
                        index: true,
                        element: <DashboardPage />,
                    },

                    // Projects
                    {
                        path: "projects",
                        element: <ProjectsPage />,
                    },
                    {
                        path: "projects/:id",
                        element: <ProjectDetailsPage />,
                    },

                    // Materials
                    {
                        path: "materials",
                        element: <MaterialsPage />,
                    },
                    {
                        path: "materials/new",
                        element: <MaterialRegistrationPage />,
                    },
                    {
                        path: "materials/:materialId/edit",
                        element: <MaterialEditPage />,
                    },
                    {
                        path: "materials/:materialId",
                        element: <MaterialDetailsPage />,
                    },
                ],
            },
        ],
    },
]);